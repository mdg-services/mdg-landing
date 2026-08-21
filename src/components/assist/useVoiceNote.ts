import { useCallback, useEffect, useRef, useState } from "react";
import { MicError, openMic, pickMimeType, releaseMic } from "./mic";
import type { MicFailure } from "./mic";

/**
 * Hold-to-speak, for a one-shot voice note.
 *
 * The awkward part is not the recording, it is the permission prompt. The
 * first time a visitor holds the button, the browser puts a native dialog on
 * top of the page and the `pointerup` that ends their press may never reach
 * us. An earlier version of this product froze its composer exactly there.
 *
 * Three things stop that happening here:
 *
 *   1. The release listener is on `window`, not on the button, so a finger
 *      lifted anywhere still ends the press.
 *   2. If the microphone opens *after* the visitor has already let go, we do
 *      not start recording. We release the microphone and say "hold the
 *      button while you speak", which is what they will now be able to do,
 *      because the permission has been granted.
 *   3. While recording, the same button is also a stop control: one tap
 *      sends what has been recorded. With the 45-second cap behind it, a
 *      lost release cannot leave the widget stuck.
 */

export type VoiceNoteState = "idle" | "opening" | "recording";

interface Options {
  /** Hard cap, from `AssistPublicConfig.maxVoiceNoteMs`. */
  maxMs: number;
  onDone: (blob: Blob, ms: number) => void;
  onTooShort: () => void;
  onFailure: (failure: MicFailure) => void;
}

/** Below this, it is a mis-tap rather than a question. */
const MIN_MS = 700;

export function useVoiceNote({ maxMs, onDone, onTooShort, onFailure }: Options) {
  const [state, setState] = useState<VoiceNoteState>("idle");
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(maxMs / 1000));

  const heldRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const startedAtRef = useRef(0);
  const tickRef = useRef(0);
  const capRef = useRef(0);
  /** True between `stop()` and `onstop`, so a second tap is not a second stop. */
  const stoppingRef = useRef(false);

  // Callbacks live in a ref so the effects below can clean up on unmount
  // without re-running every time the panel re-renders.
  const cbRef = useRef({ onDone, onTooShort, onFailure });
  useEffect(() => {
    cbRef.current = { onDone, onTooShort, onFailure };
  }, [onDone, onTooShort, onFailure]);

  const clearTimers = useCallback(() => {
    if (tickRef.current) window.clearInterval(tickRef.current);
    if (capRef.current) window.clearTimeout(capRef.current);
    tickRef.current = 0;
    capRef.current = 0;
  }, []);

  /** Let everything go. Safe to call twice. */
  const teardown = useCallback(() => {
    clearTimers();
    stoppingRef.current = false;
    const rec = recorderRef.current;
    recorderRef.current = null;
    if (rec && rec.state !== "inactive") {
      try {
        rec.stop();
      } catch {
        /* already stopped */
      }
    }
    releaseMic(streamRef.current);
    streamRef.current = null;
    heldRef.current = false;
  }, [clearTimers]);

  /**
   * Stop the recorder; `onstop` below decides whether it was worth sending.
   *
   * A release and a tap can both arrive for one press, and the second must do
   * nothing: tearing down while a stop is in flight would release the
   * microphone before the recorder had handed over its last slice, and the
   * visitor would lose the end of their own question.
   */
  const finish = useCallback(() => {
    if (stoppingRef.current) return;
    clearTimers();
    const rec = recorderRef.current;
    if (!rec || rec.state === "inactive") {
      teardown();
      setState("idle");
      return;
    }
    stoppingRef.current = true;
    try {
      rec.stop();
    } catch {
      teardown();
      setState("idle");
    }
  }, [clearTimers, teardown]);

  const press = useCallback(async () => {
    if (state !== "idle") return;
    heldRef.current = true;
    setState("opening");
    setSecondsLeft(Math.ceil(maxMs / 1000));

    let stream: MediaStream;
    try {
      stream = await openMic();
    } catch (err) {
      heldRef.current = false;
      setState("idle");
      cbRef.current.onFailure(err instanceof MicError ? err.failure : "unknown");
      return;
    }

    // They let go while the browser was asking. Do not record something they
    // did not mean to record; the permission is granted now, so the next hold
    // will simply work.
    if (!heldRef.current) {
      releaseMic(stream);
      setState("idle");
      cbRef.current.onTooShort();
      return;
    }

    streamRef.current = stream;
    chunksRef.current = [];
    const mimeType = pickMimeType();
    let rec: MediaRecorder;
    try {
      rec = new window.MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    } catch {
      teardown();
      setState("idle");
      cbRef.current.onFailure("unsupported");
      return;
    }

    rec.ondataavailable = (e: BlobEvent) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };
    rec.onstop = () => {
      // Did the visitor end this recording, or did it end because they walked
      // away from it? `finish()` sets this and `teardown()` clears it, so it
      // has to be read before the teardown below. A half-question abandoned by
      // closing the panel or leaving the page must not be sent: it would be
      // transcribed, answered, spoken and paid for, and count against the
      // session's turns, with nobody left to read the answer.
      const deliberate = stoppingRef.current;
      const ms = Date.now() - startedAtRef.current;
      const blob = new Blob(chunksRef.current, { type: rec.mimeType || mimeType || "audio/webm" });
      chunksRef.current = [];
      teardown();
      setState("idle");
      if (!deliberate) return;
      if (ms < MIN_MS || blob.size === 0) cbRef.current.onTooShort();
      else cbRef.current.onDone(blob, Math.min(ms, maxMs));
    };

    recorderRef.current = rec;
    startedAtRef.current = Date.now();
    try {
      rec.start();
    } catch {
      teardown();
      setState("idle");
      cbRef.current.onFailure("unknown");
      return;
    }
    setState("recording");

    tickRef.current = window.setInterval(() => {
      const left = Math.ceil((maxMs - (Date.now() - startedAtRef.current)) / 1000);
      setSecondsLeft(left > 0 ? left : 0);
    }, 250);
    capRef.current = window.setTimeout(finish, maxMs);
  }, [state, maxMs, finish, teardown]);

  const release = useCallback(() => {
    if (!heldRef.current) return;
    heldRef.current = false;
    if (recorderRef.current) finish();
    // If the microphone has not opened yet, `press` sees heldRef go false and
    // gives up on its own.
  }, [finish]);

  /** A lost press, a hidden page, an unmount: all end the same way. */
  useEffect(() => {
    if (state === "idle") return;
    const onUp = () => release();
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [state, release]);

  useEffect(() => {
    const onHide = () => teardown();
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      teardown();
    };
  }, [teardown]);

  /** Tapping the button again while it is recording sends what there is. */
  const stop = useCallback(() => {
    heldRef.current = false;
    finish();
  }, [finish]);

  return { state, secondsLeft, press, release, stop };
}
