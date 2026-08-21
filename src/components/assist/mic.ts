/**
 * Opening the microphone, and being honest when it does not open.
 *
 * This product has been bitten here before. An earlier version treated a
 * failed microphone as "no recorder available" and fell back to a file input,
 * which on Android opens the camera. A dealer tapped a microphone and got a
 * camera, and read the whole product as broken.
 *
 * So there is exactly one rule in this file: when the microphone does not
 * open, say why in the visitor's language and offer the typing box and the
 * toll-free number. Never a file picker. Never a camera.
 *
 * The other trap is that a `DOMException` is NOT an `instanceof Error` in
 * every browser we ship to, so `err instanceof Error ? err.name : ...` throws
 * the one piece of information that matters away. `nameOf` reads the property
 * defensively instead.
 */

/** Why the microphone did not open, in terms a sentence can be written about. */
export type MicFailure =
  | "denied" // refused by the visitor, or by policy, or the page is not on HTTPS
  | "missing" // no microphone on the device
  | "busy" // something else is holding it
  | "unsupported" // this browser will not let a page record at all
  | "unknown";

export class MicError extends Error {
  readonly failure: MicFailure;
  constructor(failure: MicFailure, message: string) {
    super(message);
    this.name = "MicError";
    this.failure = failure;
  }
}

/** Read `.name` off anything, including a DOMException. */
function nameOf(err: unknown): string {
  if (typeof err === "object" && err !== null && "name" in err) {
    return String((err as { name: unknown }).name);
  }
  return "";
}

export function classifyMicError(err: unknown): MicFailure {
  switch (nameOf(err)) {
    // Refused. `SecurityError` is what an insecure origin reports in some
    // browsers, and it needs the same sentence: the browser said no.
    case "NotAllowedError":
    case "PermissionDeniedError":
    case "SecurityError":
      return "denied";
    case "NotFoundError":
    case "DevicesNotFoundError":
      return "missing";
    // Held by another app, or the OS refused to start the track.
    case "NotReadableError":
    case "TrackStartError":
    case "AbortError":
      return "busy";
    default:
      return "unknown";
  }
}

/** Can this browser record at all? Checked before anything is offered. */
export function micSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.mediaDevices !== "undefined" &&
    typeof navigator.mediaDevices.getUserMedia === "function" &&
    typeof window !== "undefined" &&
    typeof window.MediaRecorder === "function"
  );
}

/**
 * The recorder container this browser will actually produce.
 *
 * Returning `undefined` is fine and means "let the browser choose", which is
 * what Safari needs; the server sniffs the bytes anyway and the widget sends
 * whatever `Content-Type` the resulting blob declares.
 */
export function pickMimeType(): string | undefined {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/mp4",
  ];
  for (const type of candidates) {
    try {
      if (window.MediaRecorder.isTypeSupported(type)) return type;
    } catch {
      /* older implementations have no isTypeSupported; fall through */
    }
  }
  return undefined;
}

/**
 * Ask for the microphone.
 *
 * Echo cancellation is on because the assistant's own reply comes out of the
 * same phone speaker the microphone is listening to, and without it a call
 * hears itself and barges in on every sentence.
 */
export async function openMic(): Promise<MediaStream> {
  if (!micSupported()) {
    throw new MicError("unsupported", "This browser cannot record audio");
  }
  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
    });
  } catch (err) {
    throw new MicError(classifyMicError(err), "Could not open the microphone");
  }
}

/**
 * Let the microphone go.
 *
 * Called on every exit path there is: the end of a recording, the end of a
 * call, unmount, and `pagehide`. A microphone light left on after a
 * conversation has finished is the single most alarming thing this feature
 * could do, so it is released more often than strictly necessary rather than
 * less.
 */
export function releaseMic(stream: MediaStream | null | undefined): void {
  if (!stream) return;
  for (const track of stream.getTracks()) {
    try {
      track.stop();
    } catch {
      /* already gone */
    }
  }
}
