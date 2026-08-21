import { useEffect, useRef } from "react";
import { callPhaseLabel, type AssistDict } from "./dict";
import type { CallPhase } from "./useAssistCall";

/**
 * The live call, as a strip at the bottom of the panel.
 *
 * The status line is deliberately literal. "Listening", "Thinking",
 * "Speaking" is what is actually happening, so a visitor waiting on a slow
 * connection can tell the difference between a system that is working and one
 * that has died. It is the panel's `aria-live` region, so a screen reader
 * hears the same thing.
 *
 * The push-to-talk button releases on a `pointerup` anywhere in the window,
 * not just on itself, so a finger that slides off the button while talking
 * still sends the sentence.
 */

/** Only shown once the call is genuinely running short. */
const WARN_AT_MS = 3 * 60 * 1000;

function mmss(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function CallControls({
  d,
  phase,
  remainingMs,
  noticeText,
  talking,
  lost,
  reduced,
  onTalkDown,
  onTalkUp,
  onEnd,
}: {
  d: AssistDict;
  phase: CallPhase;
  remainingMs: number | null;
  noticeText: string | null;
  talking: boolean;
  lost: boolean;
  reduced: boolean;
  onTalkDown: () => void;
  onTalkUp: () => void;
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

  const label = callPhaseLabel(d, phase);

  const showClock = remainingMs !== null && remainingMs < WARN_AT_MS;

  // A turn is in flight and the server is not reading the microphone, so the
  // button says so instead of recording a question that would be thrown away.
  // The status line above it already reads "Thinking". This mirrors the chat
  // composer, which is disabled for exactly the same stretch.
  const talkDisabled = phase === "thinking";

  return (
    <div className="border-t border-ink-hairline bg-navy-950 px-4 py-3 text-white">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex min-w-0 items-center gap-2">
          <span
            aria-hidden
            className={
              "h-2 w-2 shrink-0 rounded-full " +
              (talking ? "bg-gold-400" : phase === "speaking" ? "bg-ok" : "bg-navy-300")
            }
            style={
              !reduced && (talking || phase === "connecting")
                ? { animation: "assist-pulse 1.4s ease-in-out infinite" }
                : undefined
            }
          />
          <span className="truncate font-mono text-[11px] uppercase tracking-[0.16em] text-navy-100">
            {talking ? d.call.release : label}
          </span>
        </span>
        {showClock && (
          <span className="num shrink-0 text-[12px] font-semibold text-gold-300">
            {d.call.remaining.replace("{time}", mmss(remainingMs))}
          </span>
        )}
      </div>

      {(noticeText || lost) && (
        <p className="mt-2 text-[13px] leading-[1.5] text-gold-200">{lost ? d.call.lost : noticeText}</p>
      )}

      <div className="mt-3 flex items-center gap-2.5">
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
            "flex-1 select-none rounded-full px-5 py-3 text-[14px] font-semibold transition-colors duration-200 " +
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
          onClick={onEnd}
          aria-label={d.call.endAria}
          className="shrink-0 rounded-full border border-white/25 px-4 py-3 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-white/10"
        >
          {d.call.end}
        </button>
      </div>
    </div>
  );
}
