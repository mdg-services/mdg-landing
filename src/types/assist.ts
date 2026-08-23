/**
 * The wire shapes the assistant widget reads.
 *
 * These are copied, deliberately, from `shared/src/types/assist.ts` in the
 * main repo. `mdg-landing` does not vendor `@dk/shared` and is not going to
 * start: it is a static marketing site that must build with nothing but its
 * own `package.json`, and pulling in a workspace package to read six response
 * shapes would tie every deploy of this site to the backend's build.
 *
 * Only the parts the widget actually receives are here. Request bodies are
 * validated by the server (`shared/src/schemas/assist.ts`); the widget mirrors
 * one rule locally, the mobile-number check, because telling somebody their
 * number is wrong after a round trip is a worse experience than telling them
 * as they type. That rule is `/^[6-9]\d{9}$/`, the same one the server applies.
 *
 * If a shape here ever disagrees with the shared file, the shared file wins.
 */

/** The two languages the assistant speaks. Mirrors the site's own toggle. */
export type AssistLang = "hi" | "en";

/** Why a call or a session stopped. */
export type AssistEndReason =
  | "visitor-left"
  | "inactivity"
  | "max-duration"
  | "max-turns"
  | "speech-budget"
  | "abuse"
  | "blocked"
  | "error"
  | "capacity"
  | "shutdown";

/** What the widget is told before anyone types anything. `GET /assist/config`. */
export interface AssistPublicConfig {
  enabled: boolean;
  /** False when the daily budget is spent or the kill switch is off. */
  callEnabled: boolean;
  /** Free call slots right now, so the Call button can say "busy" before it is pressed. */
  callSlotsFree: number;
  langs: AssistLang[];
  maxVoiceNoteMs: number;
  maxCallMs: number;
  /** The line the visitor must be shown before a call starts, in both languages. */
  recordingNotice: Record<AssistLang, string>;
  /**
   * True when the widget may ask for a live-transcript key, so a visitor sees
   * their words appear as they speak. A nicety on top of the voice note, never
   * a replacement: when this is false the recording is still made and still
   * answered exactly as before.
   */
  liveTranscript: boolean;
}

/**
 * A short-lived key for one live transcription. `POST /assist/voice/live-token`.
 *
 * The vendor's API key never reaches the browser. A WebSocket cannot carry a
 * header, so the server mints this instead: single-use, minutes long, and
 * worth one transcription to whoever holds it.
 */
export interface AssistLiveTranscriptToken {
  token: string;
  /** WebSocket URL, already carrying the model and the audio format. */
  url: string;
  expiresInSec: number;
  /** What the socket expects, so the browser knows what to resample to. */
  sampleRate: number;
}

/** What creating a session gives the widget back. `POST /assist/session`. */
export interface AssistSessionCreated {
  sessionId: string;
  /** Short-lived signed token. Every later call carries it; there is no cookie. */
  token: string;
  expiresInSec: number;
  greeting: string;
  lang: AssistLang;
}

/** The answer to one turn, as the widget receives it. */
export interface AssistTurnResult {
  seq: number;
  /** What we heard, when the turn was spoken. Shown back so a misheard question is obvious. */
  heard?: string;
  text: string;
  lang: AssistLang;
  /** Signed URL for the spoken reply. Absent for a typed turn, or if speech failed. */
  audioUrl?: string;
  audioMs?: number;
  /** True when a guard answered instead of the knowledge base. */
  deflected: boolean;
  /** Set when the assistant wants the visitor's details next. */
  asksFor?: AssistLeadField;
  /** Turns left before the session's cap. */
  turnsRemaining: number;
}

/** The one detail the assistant is asking for right now. */
export type AssistLeadField = "name" | "place" | "mobile" | "mobile-confirm";

/** The name, place and mobile the visitor volunteered. */
export interface AssistLead {
  name?: string;
  place?: string;
  mobile?: string;
  mobileConfirmed: boolean;
  capturedAt?: string;
}

/** `POST /assist/lead`. */
export interface AssistLeadResult {
  lead: AssistLead;
  reply: string;
}

/** Live-call state, server to widget. */
export interface AssistCallState {
  sessionId: string;
  phase: "connecting" | "listening" | "thinking" | "speaking" | "ended";
  /** Milliseconds left on the call cap. */
  remainingMs: number;
  endReason?: AssistEndReason;
}

/** `turn:heard` on the call socket. */
export interface AssistCallHeard {
  seq: number;
  text: string;
  lang: AssistLang;
}

/** `call:notice` on the call socket. */
export interface AssistCallNotice {
  kind: "nudge" | "time-warning" | "abuse-warning";
  text: string;
}

/** `call:ended` on the call socket. */
export interface AssistCallEnded {
  reason: AssistEndReason;
  text: string;
}

/** `lead:ask` on the call socket. */
export interface AssistCallLeadAsk {
  field: AssistLeadField;
  text: string;
}

/**
 * The error codes the widget has to behave differently for. Anything else is
 * treated as a generic failure, which always ends with the toll-free number.
 */
export type AssistErrorCode =
  | "RATE_LIMITED"
  | "ASSIST_DISABLED"
  | "ASSIST_BLOCKED"
  | "SESSION_EXPIRED"
  | "TURN_LIMIT"
  | "CALL_CAPACITY"
  | "PAYLOAD_TOO_LARGE"
  | "NETWORK"
  | "UNKNOWN";

/** The house response envelope. */
export type AssistEnvelope<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string; details?: unknown } };
