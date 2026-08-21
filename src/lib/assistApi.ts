/**
 * The assistant's client.
 *
 * One place that knows the base URL, the session token, the house envelope
 * and the six error codes the widget behaves differently for. Everything the
 * panel does goes through here, so the panel never sees a status code.
 *
 * Two rules are enforced here rather than in the UI, because they must hold
 * whichever screen made the call:
 *
 *   - A session that is no longer usable — an expired token, or a
 *     conversation the server has closed after a call — is replaced and the
 *     request is resent once. The visitor never sees it happen; a
 *     conversation that quietly dies mid-question is the worst possible
 *     failure for somebody on 2G.
 *   - A rate-limited request is retried once after a short wait, but only
 *     when the server says the wait is short enough to be worth it, and never
 *     on a route where money has already been spent by the time the refusal
 *     arrives. A voice note is transcribed BEFORE the answer is written, so a
 *     refusal from the model limiter comes after the transcription has been
 *     paid for and resending it would buy the same transcription twice.
 *
 * Nothing here runs until the visitor opens the panel. The launcher makes no
 * network request at all.
 */

import type {
  AssistEnvelope,
  AssistErrorCode,
  AssistLeadResult,
  AssistLang,
  AssistPublicConfig,
  AssistSessionCreated,
  AssistTurnResult,
} from "../types/assist";

/** Where the API lives. Overridable so a laptop can point at localhost. */
export const ASSIST_API_BASE = (
  import.meta.env.VITE_ASSIST_API_BASE ?? "https://api.mdgservices.in/api/v1"
).replace(/\/+$/, "");

/**
 * The origin the Socket.IO namespace hangs off. `io()` wants an origin plus a
 * namespace, not the `/api/v1` path prefix, so it is derived once here rather
 * than being string-sliced at the call site.
 */
export function assistSocketOrigin(): string {
  try {
    return new URL(ASSIST_API_BASE, window.location.href).origin;
  } catch {
    return ASSIST_API_BASE;
  }
}

/** How long we wait before deciding the network has swallowed a request. */
const TIMEOUT_MS = { normal: 45_000, voice: 90_000 } as const;

/** How long to wait before the single retry a rate-limited request gets. */
const RATE_LIMIT_BACKOFF_MS = 1_500;

/** The mobile rule, identical to `assistMobileSchema` on the server. */
const MOBILE_RE = /^[6-9]\d{9}$/;

/**
 * Normalise what somebody typed into ten digits, then check it.
 * Returns null when it is not a number anybody could ring.
 */
export function normaliseMobile(raw: string): string | null {
  const digits = raw.replace(/[\s-]/g, "").replace(/^(\+?91)/, "");
  return MOBILE_RE.test(digits) ? digits : null;
}

/** A failure the widget can decide about, rather than a status code. */
export class AssistError extends Error {
  readonly code: AssistErrorCode;
  readonly status: number;
  /** How long the server itself asked us to wait. Only ever set on a 429. */
  readonly retryAfterMs?: number;

  constructor(code: AssistErrorCode, message: string, status = 0, retryAfterMs?: number) {
    super(message);
    this.name = "AssistError";
    this.code = code;
    this.status = status;
    this.retryAfterMs = retryAfterMs;
  }
}

/** Codes we recognise; anything else from the server becomes UNKNOWN. */
const KNOWN_CODES = new Set<string>([
  "RATE_LIMITED",
  "ASSIST_DISABLED",
  "ASSIST_BLOCKED",
  "SESSION_EXPIRED",
  "TURN_LIMIT",
  "CALL_CAPACITY",
  "PAYLOAD_TOO_LARGE",
]);

function codeFrom(raw: string | undefined, status: number): AssistErrorCode {
  if (raw && KNOWN_CODES.has(raw)) return raw as AssistErrorCode;
  // A 401 without a code is still an expired session as far as we can act on it.
  if (status === 401) return "SESSION_EXPIRED";
  // 409 CONFLICT is the server saying "this conversation has ended — start a
  // new one", which it does after every call, after a callback is requested,
  // and after half an hour of quiet. The token is still signed and still
  // in date, so it is not a 401; but the only thing that helps is the same
  // thing a 401 needs, a fresh session and one more try. Left unrecognised
  // this turned every panel into a dead one until the page was reloaded.
  if (status === 409) return "SESSION_EXPIRED";
  if (status === 413) return "PAYLOAD_TOO_LARGE";
  return "UNKNOWN";
}

/** The server tells us how long its window has left. Read it if it is there. */
function retryAfterFrom(details: unknown): number | undefined {
  if (typeof details !== "object" || details === null) return undefined;
  const value = (details as { retryAfterMs?: unknown }).retryAfterMs;
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

/* ── The session ────────────────────────────────────────────────────────── */

let session: AssistSessionCreated | null = null;
/** In flight, so two quick taps do not create two sessions. */
let creating: Promise<AssistSessionCreated> | null = null;

export function currentSession(): AssistSessionCreated | null {
  return session;
}

export function forgetSession(): void {
  session = null;
  creating = null;
}

/** The page the visitor was on, for the team to see which section drives questions. */
function currentPage(): string {
  try {
    return (window.location.pathname + window.location.hash).slice(0, 120);
  } catch {
    return "/";
  }
}

async function raw<T>(
  path: string,
  init: RequestInit,
  timeoutMs: number = TIMEOUT_MS.normal,
): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  let res: Response;
  try {
    res = await fetch(ASSIST_API_BASE + path, { ...init, signal: controller.signal });
  } catch {
    // A refused connection, a dead tunnel, a timeout: all the same to a
    // visitor, and all fixed by the same offer of a phone number.
    throw new AssistError("NETWORK", "Could not reach the assistant");
  } finally {
    window.clearTimeout(timer);
  }

  // A body that is not JSON is a proxy page or a truncated response, and
  // there is nothing in it worth showing anybody.
  let body: AssistEnvelope<T> | null = null;
  try {
    body = (await res.json()) as AssistEnvelope<T>;
  } catch {
    /* leave it null */
  }

  if (!res.ok || !body || body.ok !== true) {
    const err = body && body.ok === false ? body.error : undefined;
    throw new AssistError(
      codeFrom(err?.code, res.status),
      err?.message ?? `Request failed (${res.status})`,
      res.status,
      retryAfterFrom(err?.details),
    );
  }
  return body.data;
}

/**
 * Get a session, making one if we have none.
 *
 * `channel` is fixed for the life of a session, so a visitor who starts by
 * typing and then taps Call keeps the `chat` session: the call namespace
 * authenticates on the same token either way, and re-creating the session
 * would throw away the conversation so far.
 */
export async function ensureSession(lang: AssistLang): Promise<AssistSessionCreated> {
  if (session) return session;
  if (creating) return creating;
  creating = raw<AssistSessionCreated>("/assist/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channel: "chat", lang, page: currentPage() }),
  })
    .then((created) => {
      session = created;
      return created;
    })
    .finally(() => {
      creating = null;
    });
  return creating;
}

/**
 * A request that needs a session, with the two automatic recoveries.
 *
 * `build` is a function rather than a value because a retry needs a fresh
 * `RequestInit`: a Blob body can be replayed, but the Authorization header
 * carries the token that just got replaced.
 */
async function authed<T>(
  path: string,
  build: (token: string) => RequestInit,
  opts: { lang: AssistLang; timeoutMs?: number; retryOnRateLimit?: boolean },
): Promise<T> {
  const timeoutMs = opts.timeoutMs ?? TIMEOUT_MS.normal;
  const attempt = async (): Promise<T> => {
    const s = await ensureSession(opts.lang);
    return raw<T>(path, build(s.token), timeoutMs);
  };

  try {
    return await attempt();
  } catch (err) {
    if (!(err instanceof AssistError)) throw err;

    if (err.code === "SESSION_EXPIRED") {
      forgetSession();
      return attempt(); // one fresh session, one resend, then it is a real failure
    }
    if (err.code === "RATE_LIMITED" && opts.retryOnRateLimit !== false) {
      // The server's limiter is a fixed window, and it tells us how much of
      // that window is left. When that is longer than the pause we are
      // willing to make somebody sit through, a resend is guaranteed to be
      // refused for the same reason — so we do not make it, and the visitor
      // is told to try again in a moment instead of waiting for a second no.
      const wait = err.retryAfterMs;
      if (wait !== undefined && wait > RATE_LIMIT_BACKOFF_MS) throw err;
      await new Promise((r) => window.setTimeout(r, RATE_LIMIT_BACKOFF_MS));
      return attempt();
    }
    throw err;
  }
}

function jsonInit(token: string, payload: unknown): RequestInit {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  };
}

/* ── The public surface ─────────────────────────────────────────────────── */

/** What the widget is allowed to offer, before it offers anything. */
export function getConfig(): Promise<AssistPublicConfig> {
  return raw<AssistPublicConfig>("/assist/config", { method: "GET" });
}

/** A typed question. */
export function sendMessage(text: string, lang: AssistLang): Promise<AssistTurnResult> {
  return authed<AssistTurnResult>("/assist/message", (token) => jsonInit(token, { text, lang }), {
    lang,
  });
}

/**
 * A voice note: the recorder's own blob, unwrapped, with the duration
 * declared on the query string so the server can check it against the bytes.
 *
 * This is the one route that never resends itself after a "too many
 * requests". The recording is transcribed first and the model limit is
 * checked afterwards, so by the time a refusal arrives the transcription has
 * been bought; sending the same blob again buys it a second time and the
 * second one is refused too. The visitor is shown the line and decides.
 */
export function sendVoice(blob: Blob, ms: number, lang: AssistLang): Promise<AssistTurnResult> {
  const type = blob.type || "audio/webm";
  return authed<AssistTurnResult>(
    `/assist/voice?ms=${Math.max(1, Math.round(ms))}`,
    (token) => ({
      method: "POST",
      headers: { "Content-Type": type, Authorization: `Bearer ${token}` },
      body: blob,
    }),
    { lang, timeoutMs: TIMEOUT_MS.voice, retryOnRateLimit: false },
  );
}

export interface LeadFields {
  name?: string;
  place?: string;
  mobile?: string;
  mobileConfirmed?: boolean;
}

/** Whatever the visitor has given us so far. Partial answers are saved. */
export function submitLead(fields: LeadFields, lang: AssistLang): Promise<AssistLeadResult> {
  return authed<AssistLeadResult>("/assist/lead", (token) => jsonInit(token, fields), { lang });
}

/** Asking for a person to ring back. The server will not accept this without a number. */
export function escalate(
  fields: { mobile: string; name?: string; place?: string; reason?: string },
  lang: AssistLang,
): Promise<{ reply: string }> {
  return authed<{ reply: string }>("/assist/escalate", (token) => jsonInit(token, fields), {
    lang,
  });
}

/**
 * Tell the server the visitor has gone.
 *
 * Best effort by design: it runs on `pagehide`, where a rejected promise has
 * nobody left to catch it. `keepalive` lets the browser finish the request
 * after the page is gone, which `sendBeacon` cannot do here because a beacon
 * carries no Authorization header.
 */
export function endSession(reason: "visitor-left" = "visitor-left"): void {
  const s = session;
  if (!s) return;
  session = null;
  try {
    void fetch(ASSIST_API_BASE + "/assist/end", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${s.token}` },
      body: JSON.stringify({ reason }),
    }).catch(() => undefined);
  } catch {
    /* the visitor has left; there is nothing left to tell them */
  }
}
