import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AssistDict } from "./dict";

/**
 * The spoken answer, as a voice note.
 *
 * A dealer standing at a pump knows exactly what this is, because it is what
 * every message on their phone already looks like: a round play button, a
 * waveform, and a clock. The earlier "Play the answer" link was a link, and a
 * link on a marketing page reads like something that navigates away.
 *
 * Three things are deliberate.
 *
 *   1. The bars are made up. There is no peak data on the wire — the answer
 *      arrives as a URL and nothing else — so the shape is generated from a
 *      hash of that URL. Same answer, same bars, every render, which is the
 *      whole point: a waveform that reshuffles on each keystroke elsewhere in
 *      the panel would look broken. This is the approach `mdg-client` uses in
 *      `src/lib/waveform.ts`; the twenty lines are repeated here rather than
 *      shared, because the two apps do not build together.
 *   2. Nothing plays on its own. The browser would block it anyway, and an
 *      answer speaking out loud by itself on a page somebody is reading is
 *      startling. The player sits there, ready, one tap.
 *   3. If the audio will not load, the player takes itself away and leaves a
 *      quiet line. The text of the answer is right above it and says the same
 *      thing, so a dead play button is pure loss.
 */

/** How many bars a note draws. They stretch to fill whatever width the
    bubble gives them, so this is a density, not a size. */
const BARS = 40;
/** Arrow keys move by this much, which is about one bar. */
const KEY_STEP_MS = 3_000;

export default function VoiceNote({
  src,
  d,
  knownMs,
}: {
  src: string;
  d: AssistDict;
  /**
   * How long the reply is, as the server measured it when it made the audio.
   *
   * The element's own `duration` is not available until enough of the file has
   * been fetched, and for a streamed mp3 it can stay `Infinity` for a while —
   * so without this the note sits there reading 0:00 and looks empty, which is
   * exactly what a voice note must not look like before you press it.
   */
  knownMs?: number;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(false);
  const [currentMs, setCurrentMs] = useState(0);
  const [totalMs, setTotalMs] = useState(knownMs && knownMs > 0 ? knownMs : 0);
  const [broken, setBroken] = useState(false);

  const peaks = useMemo(() => pseudoPeaks(src, BARS), [src]);
  const seekable = totalMs > 0;
  const progress = seekable ? Math.min(1, currentMs / totalMs) : 0;

  /* Strip the operating system's "cast this" route off the element, so an
     answer meant for one person cannot end up on a nearby speaker or leave a
     now-playing tile on the lock screen. The same three lines guard the voice
     notes in the dealer app. */
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    (el as HTMLAudioElement & { disableRemotePlayback?: boolean }).disableRemotePlayback = true;
    el.setAttribute("x-webkit-airplay", "deny");
    if ("mediaSession" in navigator) navigator.mediaSession.metadata = null;
  }, []);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play().catch(() => {
        // A rejected play is either a browser rule we cannot argue with or a
        // file that will not decode. Either way the text stands on its own.
        if (el.error) setBroken(true);
      });
    } else {
      el.pause();
    }
  }, []);

  const seekTo = useCallback(
    (ms: number) => {
      const el = audioRef.current;
      if (!el || !seekable) return;
      const clamped = Math.max(0, Math.min(totalMs, ms));
      el.currentTime = clamped / 1000;
      setCurrentMs(clamped);
    },
    [seekable, totalMs],
  );

  /** Where along the track a pointer landed, as a fraction. */
  const seekToPointer = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0) return;
      seekTo(((clientX - rect.left) / rect.width) * totalMs);
    },
    [seekTo, totalMs],
  );

  if (broken) {
    return <p className="mt-1.5 text-[12px] leading-[1.5] text-ink-muted">{d.chat.voiceFailed}</p>;
  }

  return (
    <div className="mt-1.5 flex items-center gap-2.5 rounded-2xl border border-ink-hairline bg-paper-warm px-2.5 py-2">
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? d.chat.voicePause : d.chat.voicePlay}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy-700 text-white transition-colors duration-200 hover:bg-navy-800"
      >
        {playing ? <PauseGlyph /> : <PlayGlyph />}
      </button>

      <div className="min-w-0 flex-1">
        <div
          ref={trackRef}
          role="slider"
          tabIndex={seekable ? 0 : -1}
          aria-label={d.chat.voiceSeek}
          aria-valuemin={0}
          aria-valuemax={Math.round(totalMs / 1000)}
          aria-valuenow={Math.round(currentMs / 1000)}
          aria-valuetext={mmss(currentMs)}
          onPointerDown={(e) => {
            if (!seekable) return;
            // Capture, so a finger that slides off the panel keeps scrubbing
            // and the release still lands here.
            e.currentTarget.setPointerCapture(e.pointerId);
            seekToPointer(e.clientX);
          }}
          onPointerMove={(e) => {
            if (!seekable || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
            seekToPointer(e.clientX);
          }}
          onKeyDown={(e) => {
            if (!seekable) return;
            if (e.key === "ArrowRight") {
              e.preventDefault();
              seekTo(currentMs + KEY_STEP_MS);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              seekTo(currentMs - KEY_STEP_MS);
            } else if (e.key === "Home") {
              e.preventDefault();
              seekTo(0);
            } else if (e.key === "End") {
              e.preventDefault();
              seekTo(totalMs);
            }
          }}
          className={
            "flex h-7 items-center gap-[2px] rounded-md outline-none focus-visible:ring-2 focus-visible:ring-navy-400 " +
            (seekable ? "cursor-pointer" : "")
          }
          style={{ touchAction: "none" }}
        >
          {peaks.map((p, i) => (
            <span
              key={i}
              aria-hidden
              className={
                "min-w-[2px] flex-1 rounded-full " +
                (i < Math.round(progress * BARS) ? "bg-navy-700" : "bg-navy-200")
              }
              style={{ height: `${Math.round(p * 100)}%` }}
            />
          ))}
        </div>
        <p className="num mt-0.5 text-[11px] leading-none text-ink-muted">
          {seekable ? `${mmss(currentMs)} / ${mmss(totalMs)}` : mmss(currentMs)}
        </p>
      </div>

      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => {
          claimPlayback(audioRef.current);
          setPlaying(true);
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setCurrentMs(0);
        }}
        onTimeUpdate={(e) => setCurrentMs(e.currentTarget.currentTime * 1000)}
        onLoadedMetadata={(e) => {
          const secs = e.currentTarget.duration;
          // A streamed answer can report Infinity until it has all arrived.
          // Without a length there is nothing to seek along, so the player
          // shows the elapsed time alone rather than a track that lies.
          if (Number.isFinite(secs) && secs > 0) setTotalMs(secs * 1000);
        }}
        onError={() => setBroken(true)}
        className="hidden"
      />
    </div>
  );
}

/**
 * One answer at a time.
 *
 * Two notes talking over each other is nonsense, and the panel can hold a
 * dozen of them. Each player registers itself here when it starts and pauses
 * whoever was speaking before.
 */
let speaking: HTMLAudioElement | null = null;

function claimPlayback(el: HTMLAudioElement | null) {
  if (!el) return;
  if (speaking && speaking !== el) speaking.pause();
  speaking = el;
}

/** m:ss. Never negative, never NaN, because a clock that says "NaN" is worse. */
function mmss(ms: number): string {
  const total = Number.isFinite(ms) && ms > 0 ? Math.floor(ms / 1000) : 0;
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

/** djb2, so a URL becomes a number. */
function hashSeed(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 33) ^ input.charCodeAt(i);
  }
  return h >>> 0;
}

/** mulberry32: small, fast, and the same sequence for the same seed. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A voice-shaped waveform invented from a seed. Two slow waves under the
 * noise give it a rise and a fall instead of a hedge, and the seed picks the
 * shape, so two answers do not look like the same recording.
 */
function pseudoPeaks(seed: string, count: number): number[] {
  const base = hashSeed(seed) || 1;
  const rng = mulberry32(base);
  const waves = 1.5 + (base % 3);
  const phase = (base % 7) * 0.4;
  const out: number[] = new Array<number>(count);
  for (let i = 0; i < count; i += 1) {
    const env = 0.55 + 0.35 * Math.sin((i / count) * Math.PI * waves + phase);
    const v = 0.15 + Math.min(1, env * (0.4 + rng() * 0.6)) * 0.85;
    out[i] = Math.max(0.2, Math.min(1, v));
  }
  return out;
}

function PlayGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden>
      <path d="M8 5.5v13l11-6.5L8 5.5z" fill="currentColor" />
    </svg>
  );
}

function PauseGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden>
      <path d="M8 5h3v14H8zM13 5h3v14h-3z" fill="currentColor" />
    </svg>
  );
}
