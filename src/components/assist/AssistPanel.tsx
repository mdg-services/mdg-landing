import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import Icon from "../Icon";
import CallSurface from "./CallSurface";
import LeadForm, { type LeadValues } from "./LeadForm";
import { assistDict, type AssistDict } from "./dict";
import { useVoiceNote } from "./useVoiceNote";
import VoiceNote from "./VoiceNote";
import { useAssistCall } from "./useAssistCall";
import { useTypedPlaceholder } from "./useTypedPlaceholder";
import { playPop } from "./pop";
import { micSupported, type MicFailure } from "./mic";
import {
  AssistError,
  endSession,
  escalate as requestCallback,
  getConfig,
  sendMessage,
  sendVoice,
  submitLead,
} from "../../lib/assistApi";
import { BRAND } from "../../data/content";
import { LANG_LABEL, useLang } from "../../i18n";
import type {
  AssistLang,
  AssistLeadField,
  AssistPublicConfig,
  AssistTurnResult,
} from "../../types/assist";

/**
 * The assistant panel.
 *
 * Everything in this file sits behind a `React.lazy` boundary, so a visitor
 * who never taps the button downloads none of it. That is the whole point on
 * a 2G connection. `socket.io-client` sits behind a second boundary inside
 * `useAssistCall`, so even opening the panel does not pay for the call.
 *
 * Typing and a voice note are one conversation and share the list. A live
 * call is not: it takes the whole panel and prints nothing. A dealer on a call
 * is talking, not reading, and a transcript running under their chin turns a
 * phone call into a chat window with a microphone on it. Every word is still
 * written down on the server, where the team reads it, so the record is
 * exactly as complete as it was before.
 */

type Msg = {
  id: number;
  role: "visitor" | "assistant";
  text: string;
  /** Visitor messages we transcribed rather than read. */
  transcribed?: boolean;
  audioUrl?: string;
  /** Length of the spoken reply, as the server measured it. Shown before playback starts. */
  audioMs?: number;
};

const CHAR_LIMIT = 600;
/** The character count appears only once it starts to matter. */
const CHARS_WARN_AT = 80;
const DEFAULT_VOICE_MS = 45_000;

let nextId = 1;

export default function AssistPanel({
  onClose,
  takeFocus,
}: {
  onClose: () => void;
  /**
   * False when the panel opened itself rather than being asked for. An
   * uninvited dialog must not take the keyboard away from whatever somebody
   * was reading, and must not tell a screen reader the rest of the page has
   * gone away, so both of those hang off this.
   */
  takeFocus: boolean;
}) {
  const site = useLang();
  const reduced = useReducedMotion() ?? false;

  const [lang, setLang] = useState<AssistLang>(site.lang === "hi" ? "hi" : "en");
  const d = assistDict(lang);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [config, setConfig] = useState<AssistPublicConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  /** Set once a failure means the assistant itself cannot serve this visitor. */
  const [apiDown, setApiDown] = useState(false);
  /**
   * Set once nothing here can help any more: the API is unreachable, it
   * refused outright, or every live line is taken. This is the ONLY thing
   * that puts the toll-free number on screen, and even then it sits under the
   * callback offer. The assistant exists to take calls off that number.
   */
  const [stuck, setStuck] = useState(false);
  /** A guard answered instead of the knowledge base, so a person is offered. */
  const [offerCallback, setOfferCallback] = useState(false);
  const [micNotice, setMicNotice] = useState<MicFailure | null>(null);
  const [lead, setLead] = useState<{ escalate: boolean; focus?: AssistLeadField } | null>(null);
  const [leadDone, setLeadDone] = useState<"lead" | "callback" | null>(null);
  /**
   * The last thing the assistant said out loud, for the one caption line on
   * the call surface. It is not a transcript and it does not accumulate: it is
   * there for a forecourt where the speaker is hard to hear.
   */
  const [caption, setCaption] = useState<string | null>(null);
  /** True once the visitor has touched the composer. Stops the typed hint. */
  const [composerTouched, setComposerTouched] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const push = useCallback((msg: Omit<Msg, "id">) => {
    setMessages((prev) => [...prev, { ...msg, id: nextId++ }]);
  }, []);

  const withPhone = useCallback((s: string) => s.replace("{phone}", BRAND.phone), []);

  /* ── The live call ────────────────────────────────────────────────────── */

  const call = useAssistCall({
    lang,
    lostText: d.call.lostForGood,
    // Nothing a call says goes into the chat list. What was heard is not shown
    // back either: reading your own sentence off a screen mid-call is the
    // walkie-talkie feeling this change exists to remove.
    onHeard: () => undefined,
    onReply: (r) => setCaption(r.text),
    // Asked and answered out loud. The form is for typing; putting it on
    // screen mid-call gives somebody a keyboard to fill in while they are
    // talking, which is exactly the wrong thing to hand them.
    onLeadAsk: (ask) => setCaption(ask.text),
    onRefused: (refusal) => {
      // A refused microphone gets the microphone card, which says more than
      // the call strip could. Busy lines and a block both get the form: the
      // visitor came here to reach somebody, and they still will.
      if (refusal.kind === "mic" && refusal.micFailure) setMicNotice(refusal.micFailure);
      if (refusal.kind === "capacity" || refusal.kind === "blocked") {
        setLeadDone(null);
        setLead({ escalate: true });
      }
      if (refusal.kind === "capacity") setStuck(true);
    },
  });

  /* ── The sound of it opening ──────────────────────────────────────────── */

  useEffect(() => {
    // A gesture-less open cannot make a sound in most browsers, and that is
    // fine: `playPop` attempts it and swallows the refusal, so the automatic
    // desktop open is silent and the one somebody tapped for is not.
    playPop();
  }, []);

  /* ── What the assistant can offer, asked once, on open ────────────────── */

  useEffect(() => {
    let alive = true;
    getConfig()
      .then((c) => {
        if (alive) setConfig(c);
      })
      .catch(() => {
        // Not fatal, and not worth a message. Typing raises its own error if
        // the API is really gone, and there is no point telling somebody the
        // weather is bad before they have tried to go outside.
        if (alive) setConfig(null);
      });
    return () => {
      alive = false;
    };
  }, []);

  /* ── Escape, focus trap, and handing focus back ───────────────────────── */

  useEffect(() => {
    const el = panelRef.current;
    const opener = document.activeElement as HTMLElement | null;
    // A panel that opened itself leaves the keyboard where it was. Stealing
    // focus from somebody who is reading, or mid-way through the enrolment
    // form, would be the rudest possible greeting.
    if (takeFocus) el?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !el) return;
      const focusable = el.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === el)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (takeFocus) opener?.focus?.();
    };
  }, [onClose, takeFocus]);

  /* ── On a phone the panel is the screen, so the page behind it holds still ── */

  useEffect(() => {
    if (window.innerWidth >= 640) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = before;
    };
  }, []);

  /* ── A closed tab is the end of the conversation ──────────────────────── */

  useEffect(() => {
    const onHide = () => endSession("visitor-left");
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, []);

  /* ── Keep the newest message in view ──────────────────────────────────── */

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [messages, busy, lead, error, reduced]);

  /* ── Failures, each with its own sentence and its own way out ─────────── */

  const handleFailure = useCallback(
    (err: unknown) => {
      const code = err instanceof AssistError ? err.code : "UNKNOWN";
      switch (code) {
        case "RATE_LIMITED":
          setError(d.errors.rateLimited);
          return;
        case "TURN_LIMIT":
          setError(d.errors.turnLimit);
          setLeadDone(null);
          setLead({ escalate: true });
          return;
        case "CALL_CAPACITY":
          setError(d.errors.callCapacity);
          setLeadDone(null);
          setLead({ escalate: true });
          setStuck(true);
          return;
        case "PAYLOAD_TOO_LARGE":
          setError(d.errors.tooLarge);
          return;
        case "SESSION_EXPIRED":
          // The client already replaced the session and asked again, so this
          // is the second refusal. The assistant itself is up — it answered
          // with a sentence — so this must NOT set `apiDown`, which is what
          // used to turn one closed conversation into a dead panel.
          setError(d.errors.conversationEnded);
          return;
        case "ASSIST_DISABLED":
          setError(d.errors.disabled);
          setApiDown(true);
          setStuck(true);
          return;
        case "ASSIST_BLOCKED":
          // Nothing is said about a block. They simply get the callback form.
          setError(d.errors.blocked);
          setApiDown(true);
          setStuck(true);
          return;
        case "NETWORK":
          setError(d.errors.network);
          setApiDown(true);
          setStuck(true);
          return;
        default:
          setError(d.errors.generic);
          setApiDown(true);
          setStuck(true);
      }
    },
    [d],
  );

  const applyResult = useCallback(
    (res: AssistTurnResult) => {
      if (res.heard) push({ role: "visitor", text: res.heard, transcribed: true });
      push({ role: "assistant", text: res.text, audioUrl: res.audioUrl, audioMs: res.audioMs });
      if (res.asksFor) {
        setLeadDone(null);
        setLead({ escalate: false, focus: res.asksFor });
      }
      // A deflected answer is one a guard wrote, so the visitor is shown the
      // way to a person. Offered, not opened: nobody likes a form appearing
      // under them mid-sentence.
      if (res.deflected) setOfferCallback(true);
    },
    [push],
  );

  /* ── Typing ───────────────────────────────────────────────────────────── */

  const submitText = useCallback(async () => {
    const text = input.trim();
    if (!text || busy) return;
    if (text.length > CHAR_LIMIT) {
      setError(d.composer.tooLong);
      return;
    }
    setInput("");
    setError(null);
    push({ role: "visitor", text });
    setBusy(true);
    try {
      applyResult(await sendMessage(text, lang));
    } catch (err) {
      handleFailure(err);
    } finally {
      setBusy(false);
    }
  }, [input, busy, lang, d, push, applyResult, handleFailure]);

  /* ── Speaking ─────────────────────────────────────────────────────────── */

  const sendNote = useCallback(
    async (blob: Blob, ms: number) => {
      setError(null);
      setBusy(true);
      try {
        applyResult(await sendVoice(blob, ms, lang));
      } catch (err) {
        handleFailure(err);
      } finally {
        setBusy(false);
      }
    },
    [lang, applyResult, handleFailure],
  );

  const voice = useVoiceNote({
    maxMs: config?.maxVoiceNoteMs ?? DEFAULT_VOICE_MS,
    onDone: (blob, ms) => void sendNote(blob, ms),
    onTooShort: () => setError(d.voice.tooShort),
    onFailure: (failure) => setMicNotice(failure),
  });

  /* ── Lead capture and escalation ──────────────────────────────────────── */

  /**
   * The site's own callback mailer, which is a serverless function on this
   * same domain and has nothing to do with the assistant. It is what the
   * contact form on the page already uses, so it is up whenever the page is.
   */
  const mailCallback = useCallback(async (values: LeadValues & { mobile: string }) => {
    const res = await fetch("/api/callback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        phone: values.mobile,
        outlet: values.place,
        message: "Callback requested from the assistant.",
      }),
    });
    const body = (await res.json().catch(() => ({}))) as { ok?: boolean };
    if (!res.ok || !body.ok) throw new Error("callback request failed");
  }, []);

  const handleLeadSubmit = useCallback(
    async (values: LeadValues & { mobile: string }) => {
      const wantsCall = lead?.escalate === true;

      const done = (route: "lead" | "callback") => {
        setLead(null);
        setOfferCallback(false);
        setLeadDone(route);
      };

      // The assistant is already known to be unreachable, so do not make
      // somebody who has just typed their number wait for it to fail again.
      if (apiDown) {
        await mailCallback(values);
        done("callback");
        return;
      }

      try {
        const saved = await submitLead(
          {
            name: values.name || undefined,
            place: values.place || undefined,
            mobile: values.mobile || undefined,
            mobileConfirmed: wantsCall && values.mobile !== "" ? true : undefined,
          },
          lang,
        );
        if (wantsCall && values.mobile) {
          await requestCallback(
            {
              mobile: values.mobile,
              name: values.name || undefined,
              place: values.place || undefined,
            },
            lang,
          );
        }
        done(wantsCall ? "callback" : "lead");
        if (saved.reply) push({ role: "assistant", text: saved.reply });
      } catch (err) {
        const code = err instanceof AssistError ? err.code : "UNKNOWN";
        // Going too fast is worth saying so about; the visitor can press
        // Send again in a moment and nothing has been lost.
        if (code === "RATE_LIMITED") throw err;
        // Anything else means the assistant cannot take this number. It is
        // still a number somebody is waiting by, so it goes to the team the
        // other way rather than being dropped with an apology. A duplicate
        // is a far smaller problem than a lost callback.
        if (!values.mobile) throw err;
        setApiDown(true);
        await mailCallback(values);
        done("callback");
      }
    },
    [apiDown, lead, lang, push, mailCallback],
  );

  const openCallbackForm = useCallback(() => {
    setLeadDone(null);
    setLead({ escalate: true });
  }, []);

  /* ── Starting a call ──────────────────────────────────────────────────── */

  const canRecord = micSupported();
  const callOffered = canRecord && config?.callEnabled !== false;
  const linesBusy = config !== null && config.callEnabled && config.callSlotsFree <= 0;

  const refusalText = useMemo(() => {
    if (!call.refusal) return null;
    switch (call.refusal.kind) {
      case "unauthorized":
        return d.call.refusedUnauthorized;
      case "blocked":
        return d.call.refusedBlocked;
      case "capacity":
        return d.call.refusedCapacityBody;
      case "disabled":
        return d.call.refusedDisabled;
      case "mic":
        return null; // the microphone card says more, and says it better
      default:
        return withPhone(d.call.refusedGeneric);
    }
  }, [call.refusal, d, withPhone]);

  /* ── The one line that says what is happening ─────────────────────────── */

  // The call surface carries its own live status, so this line is only ever
  // about the chat. Two `aria-live` regions saying different things at once is
  // a screen reader talking over itself.
  const status = busy
    ? d.chat.thinking
    : voice.state === "recording"
      ? d.voice.recording
      : voice.state === "opening"
        ? d.voice.preparing
        : d.chat.ready;

  const statusIsIdle = !busy && voice.state === "idle";
  const charsLeft = CHAR_LIMIT - input.length;

  // The typed hint stops for good the moment the box is theirs, and never
  // starts for a reader who has asked for less movement.
  const typedHint = useTypedPlaceholder(d.composer.typedHint, composerTouched || reduced);

  return (
    <>
      {/* On a phone the panel covers the page, so the page behind it dims. */}
      <div className="fixed inset-0 z-[69] bg-navy-950/50 sm:hidden" onClick={onClose} aria-hidden />

      <div
        ref={panelRef}
        role="dialog"
        // Modal only when the visitor opened it. A panel that appeared by
        // itself must not hide the page from a screen reader.
        aria-modal={takeFocus}
        aria-labelledby="assist-title"
        tabIndex={-1}
        lang={lang}
        className={
          "assist-enter fixed inset-0 z-[70] flex flex-col bg-white outline-none sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[38rem] sm:max-h-[calc(100vh_-_9rem)] sm:w-[23.5rem] sm:rounded-2xl sm:border sm:border-ink-hairline sm:shadow-lift" +
          // The page's Devanagari rules key off html[data-lang]. The panel has
          // its own language toggle, so it carries its own scope class.
          (lang === "hi" ? " assist-hi" : "")
        }
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-3 border-b border-ink-hairline px-4 py-3">
          <div className="min-w-0">
            <h2
              id="assist-title"
              className="font-display text-[17px] font-semibold leading-tight text-ink"
            >
              {d.panel.title}
            </h2>
            {/* Not truncated: the Hindi line is longer than the English one
                and an ellipsis on the first thing a dealer reads is a poor
                greeting. It wraps to two lines instead. */}
            <p className="mt-0.5 text-[12.5px] leading-[1.45] text-ink-muted">
              {d.panel.subtitle}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {/* The call was opened in a language and the server answers in
                that one, so switching mid-call would promise something that
                does not happen. It comes back when the call ends. */}
            {!call.active && (
              <div
                role="group"
                aria-label={d.panel.langAria}
                className="inline-flex items-center rounded-full border border-ink-hairline bg-white p-[3px]"
              >
                {(["en", "hi"] as const).map((code) => (
                  <button
                    key={code}
                    type="button"
                    lang={code}
                    aria-pressed={lang === code}
                    onClick={() => setLang(code)}
                    className={
                      "rounded-full px-2.5 py-1 text-[12px] font-semibold leading-[1.5] transition-colors duration-200 " +
                      (lang === code ? "bg-navy-700 text-white" : "text-ink-muted")
                    }
                  >
                    {code === "en" ? "EN" : LANG_LABEL.hi}
                  </button>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label={d.panel.close}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink-hairline text-ink-soft transition-colors duration-200 hover:border-navy-300 hover:text-ink"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 6l12 12M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {call.active ? (
          /* A call takes the whole panel and prints nothing. The record of it
             lives on the server, where the team reads it. */
          <CallSurface
            d={d}
            phase={call.phase}
            elapsedMs={call.elapsedMs}
            remainingMs={call.remainingMs}
            /* The moment they start talking, what was last said to them is
               stale. Taking it away is what makes this read as a line rather
               than as a screen. */
            caption={call.talking ? null : caption}
            noticeText={call.notice?.text ?? null}
            talking={call.talking}
            muted={call.muted}
            holdMode={call.holdMode}
            lost={call.lost}
            reduced={reduced}
            onTalkDown={call.talkPress}
            onTalkUp={call.talkRelease}
            onToggleMute={call.toggleMute}
            onHoldMode={call.setHoldMode}
            onEnd={() => call.hangUp("visitor-left")}
          />
        ) : (
          <>
            {/* ── Conversation ── */}
            <div ref={listRef} className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
              <div className="rounded-2xl bg-paper-warm p-3.5">
                <p className="text-[14px] leading-[1.65] text-ink-soft">{d.panel.greeting}</p>
                <p className="mt-2 text-[12.5px] leading-[1.5] text-ink-muted">{d.panel.hint}</p>
              </div>

              <div role="log" className="mt-3 flex flex-col gap-3">
                {messages.map((m) =>
                  m.role === "visitor" ? (
                    <div key={m.id} className="max-w-[85%] self-end">
                      {m.transcribed && (
                        <p className="mb-1 text-right font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                          {d.chat.heard}
                        </p>
                      )}
                      <p className="rounded-2xl rounded-br-md bg-navy-700 px-3.5 py-2.5 text-[14.5px] leading-[1.6] text-white">
                        {m.text}
                      </p>
                      {m.transcribed && (
                        <p className="mt-1 text-right text-[11.5px] leading-[1.45] text-ink-muted">
                          {d.chat.heardNote}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div key={m.id} className="max-w-[90%] self-start">
                      <p className="rounded-2xl rounded-bl-md border border-ink-hairline bg-white px-3.5 py-2.5 text-[14.5px] leading-[1.65] text-ink">
                        {m.text}
                      </p>
                      {m.audioUrl && <VoiceNote src={m.audioUrl} d={d} knownMs={m.audioMs} />}
                    </div>
                  ),
                )}

                {busy && (
                  <p className="self-start rounded-2xl rounded-bl-md border border-ink-hairline bg-white px-3.5 py-2.5 text-[14px] text-ink-muted">
                    {d.chat.thinking}
                  </p>
                )}
              </div>

              {/* Microphone trouble. Never a file picker, never the camera. */}
              {micNotice && (
                <div role="alert" className="mt-3 rounded-2xl border border-gold-300 bg-gold-50 p-3.5">
                  <p className="font-display text-[15px] font-semibold text-ink">
                    {micNotice === "denied"
                      ? d.mic.deniedTitle
                      : micNotice === "missing"
                        ? d.mic.missingTitle
                        : micNotice === "busy"
                          ? d.mic.busyTitle
                          : d.mic.unsupportedTitle}
                  </p>
                  <p className="mt-1.5 text-[13.5px] leading-[1.6] text-ink-soft">
                    {micNotice === "denied"
                      ? d.mic.deniedBody
                      : micNotice === "missing"
                        ? d.mic.missingBody
                        : micNotice === "busy"
                          ? d.mic.busyBody
                          : d.mic.unsupportedBody}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMicNotice(null);
                        inputRef.current?.focus();
                      }}
                      className="rounded-full bg-navy-700 px-4 py-2 text-[13px] font-semibold text-white"
                    >
                      {d.mic.typeInstead}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMicNotice(null);
                        openCallbackForm();
                      }}
                      className="rounded-full border border-ink/15 bg-white px-4 py-2 text-[13px] font-semibold text-ink"
                    >
                      {d.lead.open}
                    </button>
                  </div>
                </div>
              )}

              {/* A refused call. Capacity gets the callback form under it. */}
              {refusalText && !call.active && (
                <div
                  role="alert"
                  className="mt-3 rounded-2xl border border-ink-hairline bg-paper-warm p-3.5"
                >
                  {call.refusal?.kind === "capacity" && (
                    <p className="font-display text-[15px] font-semibold text-ink">
                      {d.call.refusedCapacity}
                    </p>
                  )}
                  <p className="mt-1 text-[13.5px] leading-[1.6] text-ink-soft">{refusalText}</p>
                  {/* Every line taken is one of the three states where a phone
                      number is still worth printing. The form above it is the
                      first offer; this is the second. */}
                  {call.refusal?.kind === "capacity" && <TollFree d={d} withPhone={withPhone} />}
                </div>
              )}

              {/* How the call ended, in plain words. */}
              {call.ended && (
                <div className="mt-3 rounded-2xl border border-ink-hairline bg-paper-warm p-3.5">
                  <p className="font-display text-[15px] font-semibold text-ink">{d.call.endedTitle}</p>
                  <p className="mt-1 text-[13.5px] leading-[1.6] text-ink-soft">
                    {call.ended.text || reasonText(d, call.ended.reason)}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      call.reset();
                      openCallbackForm();
                    }}
                    className="mt-2.5 text-[13px] font-semibold text-navy-700 underline decoration-navy-300 underline-offset-4"
                  >
                    {d.lead.open}
                  </button>
                </div>
              )}

              {/* Anything that went wrong, and the number that still works. */}
              {error && (
                <div role="alert" className="mt-3 rounded-2xl border border-gold-300 bg-gold-50 p-3.5">
                  <p className="text-[13.5px] leading-[1.6] text-ink-soft">{error}</p>
                  {stuck && (
                    <>
                      {/* The way out comes first. The form is already open for a
                          busy line, so the button appears only when it is not. */}
                      {!lead && (
                        <button
                          type="button"
                          onClick={openCallbackForm}
                          className="mt-2.5 rounded-full bg-navy-700 px-4 py-2 text-[13px] font-semibold text-white"
                        >
                          {d.lead.open}
                        </button>
                      )}
                      <TollFree d={d} withPhone={withPhone} />
                    </>
                  )}
                </div>
              )}

              {/* A guard answered, so a person is offered. */}
              {offerCallback && !lead && !leadDone && (
                <div className="mt-3 rounded-2xl border border-ink-hairline bg-paper-warm p-3.5">
                  <p className="font-display text-[15px] font-semibold text-ink">{d.fallback.title}</p>
                  <p className="mt-1 text-[13.5px] leading-[1.6] text-ink-soft">{d.fallback.body}</p>
                  <button
                    type="button"
                    onClick={openCallbackForm}
                    className="mt-2.5 rounded-full bg-navy-700 px-4 py-2 text-[13px] font-semibold text-white"
                  >
                    {d.lead.open}
                  </button>
                  {/* The assistant could not answer this one, so the number is
                      allowed. It comes after the callback, never before it. */}
                  <TollFree d={d} withPhone={withPhone} />
                </div>
              )}

              {/* Name, place, mobile. */}
              {lead && !leadDone && (
                <div className="mt-3">
                  <LeadForm
                    d={d}
                    escalate={lead.escalate}
                    focusField={lead.focus}
                    onSubmit={handleLeadSubmit}
                    onCancel={() => setLead(null)}
                  />
                </div>
              )}

              {leadDone && (
                <div role="status" className="mt-3 rounded-2xl border border-ok/30 bg-ok-tint p-3.5">
                  <p className="font-display text-[15px] font-semibold text-ink">{d.lead.savedTitle}</p>
                  <p className="mt-1 text-[13.5px] leading-[1.6] text-ink-soft">
                    {leadDone === "callback" ? d.lead.savedBody : d.lead.savedBodyLead}
                  </p>
                </div>
              )}
            </div>

            {/* ── What is happening. Read aloud, and shown when it is not "ready". ── */}
            <p
              aria-live="polite"
              className={
                statusIsIdle
                  ? "sr-only"
                  : "border-t border-ink-hairline px-4 py-1.5 text-[11.5px] text-ink-muted"
              }
            >
              {status}
            </p>

            {/* ── Controls ── */}
            <div className="border-t border-ink-hairline bg-white px-4 py-3">
              <div className="flex items-end gap-2">
                {canRecord && (
                  <button
                    type="button"
                    aria-label={voice.state === "recording" ? d.voice.stopAria : d.voice.holdAria}
                    aria-pressed={voice.state === "recording"}
                    disabled={busy}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      void voice.press();
                    }}
                    onPointerUp={() => voice.release()}
                    onClick={() => {
                      // A press whose release never arrived, because a
                      // permission prompt swallowed it, would otherwise leave
                      // this stuck down. A second tap always stops and sends.
                      if (voice.state === "recording") voice.stop();
                    }}
                    className={
                      "grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors duration-200 " +
                      (voice.state === "recording"
                        ? "border-gold-400 bg-gold-400 text-navy-950"
                        : "border-ink-hairline bg-white text-navy-700")
                    }
                    style={{ touchAction: "none" }}
                  >
                    <MicGlyph />
                  </button>
                )}

                <textarea
                  ref={inputRef}
                  value={input}
                  rows={1}
                  maxLength={CHAR_LIMIT}
                  disabled={busy}
                  /* The label is what a screen reader announces, so the moving
                     placeholder never reaches one. */
                  aria-label={d.composer.aria}
                  placeholder={composerTouched ? d.composer.placeholder : typedHint}
                  onFocus={() => setComposerTouched(true)}
                  onChange={(e) => {
                    setComposerTouched(true);
                    setInput(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void submitText();
                    }
                  }}
                  className="max-h-24 min-w-0 flex-1 resize-none rounded-2xl border border-ink-hairline bg-paper-warm px-3.5 py-2.5 text-[16px] leading-[1.5] text-ink outline-none transition-colors duration-200 placeholder:text-ink-faint focus:border-navy-500 focus:bg-white"
                />

                <button
                  type="button"
                  onClick={() => void submitText()}
                  disabled={busy || input.trim() === ""}
                  aria-label={d.composer.sendAria}
                  className={
                    "grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors duration-200 " +
                    (input.trim() === "" || busy
                      ? "bg-ink-hairline text-ink-faint"
                      : "bg-navy-700 text-white")
                  }
                >
                  <Icon name="arrow" size={17} />
                </button>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {voice.state === "recording" ? (
                  <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-gold-600">
                    <span
                      aria-hidden
                      className="h-2 w-2 rounded-full bg-gold-500"
                      style={
                        reduced ? undefined : { animation: "assist-pulse 1.4s ease-in-out infinite" }
                      }
                    />
                    <span className="num">
                      {d.voice.secondsLeft.replace("{n}", String(voice.secondsLeft))}
                    </span>
                  </span>
                ) : (
                  canRecord && <span className="text-[12px] text-ink-muted">{d.voice.hold}</span>
                )}

                {callOffered && !linesBusy && (
                  <button
                    type="button"
                    /* Straight through. The recording notice is spoken by the
                       assistant the moment the line is up, and the chip on the
                       call says it in writing for the whole of it. A box to tap
                       through said the same thing and lost half the callers. */
                    onClick={() => {
                      setError(null);
                      setCaption(null);
                      void call.connect();
                    }}
                    aria-label={d.call.startAria}
                    className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-navy-700"
                  >
                    <WaveGlyph /> {d.call.start}
                  </button>
                )}
                {linesBusy && (
                  <span className="text-[12px] text-ink-muted">{d.call.refusedCapacity}</span>
                )}

                <button
                  type="button"
                  onClick={openCallbackForm}
                  aria-label={d.lead.openAria}
                  className="text-[12.5px] font-semibold text-navy-700"
                >
                  {d.lead.open}
                </button>

                {charsLeft < CHARS_WARN_AT && (
                  <span className="num ml-auto text-[12px] text-ink-muted">
                    {d.composer.charsLeft.replace("{n}", String(charsLeft))}
                  </span>
                )}
              </div>
              {/* The home-bar strip on a modern phone, so the send button is
                  never half under it. */}
              <div className="safe-bottom" aria-hidden />
            </div>
          </>
        )}
      </div>
    </>
  );
}

/** The number that works when nothing else does. */
function TollFree({ d, withPhone }: { d: AssistDict; withPhone: (s: string) => string }) {
  return (
    <div className="mt-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
        {d.fallback.callLead}
      </p>
      <a
        href={BRAND.phoneHref}
        aria-label={withPhone(d.fallback.callAria)}
        className="num mt-0.5 block text-[22px] font-semibold text-navy-700"
      >
        {BRAND.phone}
      </a>
      <p className="mt-0.5 text-[12.5px] text-ink-muted">{d.fallback.hours}</p>
    </div>
  );
}

/** Plain words for the reason the server gave, when it sends no text of its own. */
function reasonText(d: AssistDict, reason: string): string {
  const map: Record<string, string> = {
    "visitor-left": d.call.reasons.visitorLeft,
    inactivity: d.call.reasons.inactivity,
    "max-duration": d.call.reasons.maxDuration,
    "max-turns": d.call.reasons.maxTurns,
    "speech-budget": d.call.reasons.speechBudget,
    abuse: d.call.reasons.abuse,
    blocked: d.call.reasons.blocked,
    error: d.call.reasons.error,
    capacity: d.call.reasons.capacity,
    shutdown: d.call.reasons.shutdown,
  };
  return map[reason] ?? d.call.reasons.error;
}

/**
 * The live call, drawn as sound rather than as a handset.
 *
 * The shared set carries a telephone, and a telephone next to this control
 * read as "ring our landline" — which is the exact call this whole feature
 * exists to save. It is not a second microphone either: the microphone
 * beside it records a note, and these two are not the same thing.
 */
function WaveGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
      <g fill="currentColor">
        <rect x="3" y="10" width="2" height="4" rx="1" />
        <rect x="7.5" y="7" width="2" height="10" rx="1" />
        <rect x="12" y="4" width="2" height="16" rx="1" />
        <rect x="16.5" y="8" width="2" height="8" rx="1" />
        <rect x="21" y="10.5" width="2" height="3" rx="1" />
      </g>
    </svg>
  );
}

/** The one glyph the shared icon set does not carry. */
function MicGlyph() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 4a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V7a3 3 0 0 1 3-3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
