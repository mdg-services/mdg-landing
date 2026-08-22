import { useEffect, useRef } from "react";
import { callPhaseLabel, type AssistDict } from "./dict";
import type { CallPhase } from "./useAssistCall";

/**
 * A call, drawn as a call.
 *
 * While this is on screen the chat list is not. That is the whole point of the
 * change: a dealer on a live call is talking, not reading, and a transcript
 * scrolling under their chin turns a conversation into a chat window with a
 * microphone attached. Everything said is still written down — on the server,
 * where the team reads it — so nothing is lost by not printing it here.
 *
 * What is left is what somebody on a phone call actually needs: whether we are
 * listening or thinking or talking, how long they have been on, a way to mute,
 * and a way to hang up. One short caption carries whatever the assistant has
 * just asked, for a noisy forecourt where the speaker is hard to hear.
 *
 * The hold-to-talk button is the fallback, one tap away, for a place where no
 * meter can pick a voice out of the noise. The push-to-talk button releases on
 * a `pointerup` anywhere in the window, not just on itself, so a finger that
 * slides off while talking still sends the sentence.
 */

/** Only shown once the call is genuinely running short. */
const WARN_AT_MS = 3 * 60 * 1000;

function mmss(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function CallSurface({
  d,
  phase,
  elapsedMs,
  remainingMs,
  caption,
  noticeText,
  talking,
  muted,
  holdMode,
  lost,
  reduced,
  onTalkDown,
  onTalkUp,
  onToggleMute,
  onHoldMode,
  onEnd,
}: {
  d: AssistDict;
  phase: CallPhase;
  elapsedMs: number;
  remainingMs: number | null;
  /** The last thing the assistant said, in one line. */
  caption: string | null;
  noticeText: string | null;
  talking: boolean;
  muted: boolean;
  holdMode: boolean;
  lost: boolean;
  reduced: boolean;
  onTalkDown: () => void;
  onTalkUp: () => void;
  onToggleMute: () => void;
  onHoldMode: (on: boolean) => void;
  onEnd: () => void;
}) {
  const heldRef = useRef(false);

  useEffect(() => {
    if (!talking) return;
    const up = () => {
      if (!heldRef.current) return;
      heldRef.current = false;
      onTalkUp();
    };
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [talking, onTalkUp]);

  const status = muted
    ? d.call.muted
    : holdMode && talking
      ? d.call.release
      : callPhaseLabel(d, phase);

  const showClock = remainingMs !== null && remainingMs < WARN_AT_MS;

  // A turn is in flight and the server is not reading the microphone, so the
  // button says so instead of recording a question that would be thrown away.
  const talkDisabled = phase === "thinking" || muted;

  // Gold while the visitor is being heard, green while the answer plays,
  // quiet the rest of the time. One colour, one meaning.
  const tone = muted
    ? "muted"
    : talking
      ? "hearing"
      : phase === "speaking"
        ? "speaking"
        : phase === "thinking"
          ? "thinking"
          : "listening";

  return (
    <div className="flex flex-1 flex-col bg-navy-950 px-5 pb-4 pt-4 text-white sm:rounded-b-2xl">
      <div className="flex items-center justify-between gap-3">
        {/* Said out loud once the call connects, and shown for the whole of it.
            Nobody has to tap through anything to be told. */}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1">
          <span
            aria-hidden
            className="assist-rec-dot h-1.5 w-1.5 rounded-full"
            style={reduced ? undefined : { animation: "assist-pulse 2s ease-in-out infinite" }}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-navy-100">
            {d.call.recording}
          </span>
        </span>
        {showClock && (
          <span className="num shrink-0 text-[12px] font-semibold text-gold-300">
            {d.call.remaining.replace("{time}", mmss(remainingMs))}
          </span>
        )}
      </div>

      {/* ── The middle of the call ── */}
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-4 text-center">
        <span className={"assist-orb assist-orb-" + tone} aria-hidden>
          <span className="assist-orb-ring" />
          <span className="assist-orb-core" />
        </span>

        <div>
          <p
            role="status"
            aria-live="polite"
            className="font-display text-[19px] font-semibold leading-tight text-white"
          >
            {status}
          </p>
          <p className="num mt-1 text-[13px] text-navy-200">
            <span className="sr-only">{d.call.elapsedAria} </span>
            {mmss(elapsedMs)}
          </p>
        </div>

        {caption && (
          <p className="line-clamp-3 max-w-[19rem] text-[14px] leading-[1.6] text-navy-100">
            {caption}
          </p>
        )}

        {!caption && !holdMode && !muted && phase === "listening" && (
          <p className="max-w-[17rem] text-[13px] leading-[1.55] text-navy-300">
            {d.call.justTalk}
          </p>
        )}
      </div>

      {(noticeText || lost) && (
        <p className="mb-3 text-center text-[13px] leading-[1.5] text-gold-200">
          {lost ? d.call.lost : noticeText}
        </p>
      )}

      {/* ── Hold to talk, for a forecourt no meter can read ── */}
      {holdMode ? (
        <div className="mb-3">
          <button
            type="button"
            aria-label={d.call.talkAria}
            aria-pressed={talking}
            disabled={talkDisabled}
            onPointerDown={(e) => {
              e.preventDefault();
              heldRef.current = true;
              onTalkDown();
            }}
            onPointerUp={() => {
              if (!heldRef.current) return;
              heldRef.current = false;
              onTalkUp();
            }}
            onKeyDown={(e) => {
              if (e.key !== " " && e.key !== "Enter") return;
              e.preventDefault();
              if (heldRef.current) return;
              heldRef.current = true;
              onTalkDown();
            }}
            onKeyUp={(e) => {
              if (e.key !== " " && e.key !== "Enter") return;
              e.preventDefault();
              if (!heldRef.current) return;
              heldRef.current = false;
              onTalkUp();
            }}
            className={
              "w-full select-none rounded-full px-5 py-3 text-[14px] font-semibold transition-colors duration-200 " +
              (talking
                ? "bg-gold-400 text-navy-950"
                : talkDisabled
                  ? "bg-white/25 text-white/60"
                  : "bg-white text-navy-900")
            }
            style={{ touchAction: "none" }}
          >
            {d.call.talk}
          </button>
          <button
            type="button"
            onClick={() => onHoldMode(false)}
            className="mt-2 w-full text-[12px] font-semibold text-navy-200 underline decoration-navy-500 underline-offset-4"
          >
            {d.call.handsFree}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => onHoldMode(true)}
          className="mb-3 self-center text-[12px] text-navy-300 underline decoration-navy-600 underline-offset-4"
        >
          {d.call.trouble}
        </button>
      )}

      {/* ── Mute and hang up ── */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onToggleMute}
          aria-pressed={muted}
          aria-label={muted ? d.call.unmuteAria : d.call.muteAria}
          className={
            "inline-flex items-center gap-2 rounded-full border px-5 py-3 text-[13px] font-semibold transition-colors duration-200 " +
            (muted
              ? "border-gold-400 bg-gold-400 text-navy-950"
              : "border-white/25 text-white hover:bg-white/10")
          }
        >
          <MicGlyph off={muted} />
          {muted ? d.call.unmute : d.call.mute}
        </button>
        <button
          type="button"
          onClick={onEnd}
          aria-label={d.call.endAria}
          className="assist-end inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13px] font-semibold text-white transition-colors duration-200"
        >
          <EndGlyph />
          {d.call.end}
        </button>
      </div>

      {/* The home-bar strip on a modern phone, so End is never half under it. */}
      <div className="safe-bottom" aria-hidden />
    </div>
  );
}

/** The microphone, with a stroke through it when it is off. */
function MicGlyph({ off }: { off: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
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
      {off && <path d="M4 3l16 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
    </svg>
  );
}

/** A handset laid down. The one place a telephone glyph is the right one. */
function EndGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3.5 14.2c5-4.3 12-4.3 17 0l1.2-2.6c-6-5.4-13.4-5.4-19.4 0L3.5 14.2z"
        fill="currentColor"
      />
      <path
        d="M8.4 12.4l1 3.1M15.6 12.4l-1 3.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
