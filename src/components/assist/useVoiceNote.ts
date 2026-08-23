import { useCallback, useEffect, useRef, useState } from "react";
import { MicError, openMic, pickMimeType, releaseMic } from "./mic";
import type { MicFailure } from "./mic";

/**
 * Tap to speak, tap again to send.
 *
 * This used to be hold-to-speak, and it was wrong for three separate reasons.
 *
 *   1. A long press is the browser's own text-selection gesture. Holding the
 *      button filled the panel with blue highlight and, on iOS, put a
 *      "Copy / Look Up" bubble on top of the button being held.
 *   2. The release could go missing. If the permission prompt appeared over
 *      the page, the `pointerup` that ended the press never arrived, and the
 *      composer froze. The old code carried three separate mechanisms to
 *      survive that; none of them are needed once nothing is being held.
 *   3. Live transcription needs a free hand and free eyes. Words now appear
 *      while the visitor is still speaking, and nobody can read them with a
 *      thumb pinned to the button.
 *
 * What is still true, and must stay true: the microphone is released on every
 * exit path there is, and a recording nobody deliberately ended is never sent.
 * A half-question abandoned by closing the panel would otherwise be
 * transcribed, answered, spoken and paid for, with nobody left to read it.
 */

export type VoiceNoteState = "idle" | "opening" | "recording";

interface Options {
  /** Hard cap, from `AssistPublicConfig.maxVoiceNoteMs`. */
  maxMs: number;
  onDone: (blob: Blob, ms: number) => void;
  onTooShort: () => void;
  /** Recorded, but the microphone never heard anything above the room. */
  onSilent: () => void;
  onFailure: (failure: MicFailure) => void;
  /**
   * The recorder's own slices, as they are produced, for live transcription.
   * `first` marks the slice that carries the container header — a later slice
   * on its own is not a playable or decodable file.
   */
  onChunk?: (chunk: Blob, first: boolean) => void;
  /**
   * Recording actually began. The live microphone is handed over so a second
   * reader — the live transcript — can tap the SAME stream. Opening the
   * microphone twice is what breaks recording on Android.
   */
  onStart?: (stream: MediaStream) => void;
}

/** Below this, it is a mis-tap rather than a question. */
const MIN_MS = 700;
/**
 * Slice length. The same figure the live call uses: small enough that the
 * transcript keeps up with the speaker, large enough not to thrash a 2G
 * uplink with headers.
 */
const CHUNK_MS = 250;
/** How often loudness is sampled. Fine enough to catch the start of a word. */
const METER_MS = 100;
/**
 * Peak amplitude, 0-1, below which we conclude nobody spoke. Deliberately
 * low: a quiet dealer in a loud forecourt must still get through, so this
 * only catches a genuinely dead microphone or a button tapped by accident
 * and left running.
 */
const SILENCE_PEAK = 0.02;

export function useVoiceNote({
  maxMs,
  onDone,
  onTooShort,
  onSilent,
  onFailure,
  onChunk,
  onStart,
}: Options) {
  const [state, setState] = useState<VoiceNoteState>("idle");
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(maxMs / 1000));

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const startedAtRef = useRef(0);
  const tickRef = useRef(0);
  const capRef = useRef(0);
  /** True between `stop()` and `onstop`, so a second tap is not a second stop. */
  const stoppingRef = useRef(false);
  /**
   * Bumped on every teardown. A `start()` still waiting on the permission
   * prompt compares the generation it began in against this, and abandons if
   * anything has happened since — a second tap, a closed panel, a hidden page.
   */
  const genRef = useRef(0);

  /* The loudness meter, so a recording nobody spoke into is not sent. */
  const audioCtxRef = useRef<AudioContext | null>(null);
  const meterRef = useRef(0);
  const peakRef = useRef(0);

  // Callbacks live in a ref so the effects below can clean up on unmount
  // without re-running every time the panel re-renders.
  const cbRef = useRef({ onDone, onTooShort, onSilent, onFailure, onChunk, onStart });
  useEffect(() => {
    cbRef.current = { onDone, onTooShort, onSilent, onFailure, onChunk, onStart };
  }, [onDone, onTooShort, onSilent, onFailure, onChunk, onStart]);

  const clearTimers = useCallback(() => {
    if (tickRef.current) window.clearInterval(tickRef.current);
    if (capRef.current) window.clearTimeout(capRef.current);
    if (meterRef.current) window.clearInterval(meterRef.current);
    tickRef.current = 0;
    capRef.current = 0;
    meterRef.current = 0;
  }, []);

  /** Let everything go. Safe to call twice. */
  const teardown = useCallback(() => {
    genRef.current += 1;
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
    const ctx = audioCtxRef.current;
    audioCtxRef.current = null;
    if (ctx) void ctx.close().catch(() => undefined);
    releaseMic(streamRef.current);
    streamRef.current = null;
  }, [clearTimers]);

  /**
   * Stop the recorder; `onstop` below decides whether it was worth sending.
   *
   * Tearing down while a stop is in flight would release the microphone
   * before the recorder had handed over its last slice, and the visitor would
   * lose the end of their own question.
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

  /**
   * Watch the peak amplitude so a tap nobody spoke into can be told apart
   * from a question. Best-effort: if this browser will not give us an
   * AudioContext, `peakRef` stays at its opening value and everything is
   * treated as speech, which is the safe way to be wrong.
   */
  const startMeter = useCallback((stream: MediaStream) => {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) {
      peakRef.current = 1;
      return;
    }
    let ctx: AudioContext;
    try {
      ctx = new Ctor();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(analyser);
      audioCtxRef.current = ctx;
      const buf = new Uint8Array(analyser.frequencyBinCount);
      meterRef.current = window.setInterval(() => {
        analyser.getByteTimeDomainData(buf);
        let peak = 0;
        for (const v of buf) {
          const amp = Math.abs(v - 128) / 128;
          if (amp > peak) peak = amp;
        }
        if (peak > peakRef.current) peakRef.current = peak;
      }, METER_MS);
    } catch {
      // No meter on this browser. Assume every recording carries speech.
      peakRef.current = 1;
    }
  }, []);

  const start = useCallback(async () => {
    if (state !== "idle") return;
    setState("opening");
    setSecondsLeft(Math.ceil(maxMs / 1000));
    const gen = genRef.current;

    let stream: MediaStream;
    try {
      stream = await openMic();
    } catch (err) {
      if (gen !== genRef.current) return;
      setState("idle");
      cbRef.current.onFailure(err instanceof MicError ? err.failure : "unknown");
      return;
    }

    // Tapped again, or the panel closed, while the browser was asking. The
    // permission is granted now, so the next tap simply works.
    if (gen !== genRef.current) {
      releaseMic(stream);
      return;
    }

    streamRef.current = stream;
    chunksRef.current = [];
    peakRef.current = 0;
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
      if (!e.data || e.data.size === 0) return;
      const first = chunksRef.current.length === 0;
      chunksRef.current.push(e.data);
      cbRef.current.onChunk?.(e.data, first);
    };
    rec.onstop = () => {
      // Did the visitor end this recording, or did it end because they walked
      // away from it? `finish()` sets this and `teardown()` clears it, so it
      // has to be read before the teardown below.
      const deliberate = stoppingRef.current;
      const ms = Date.now() - startedAtRef.current;
      const blob = new Blob(chunksRef.current, { type: rec.mimeType || mimeType || "audio/webm" });
      const peak = peakRef.current;
      chunksRef.current = [];
      teardown();
      setState("idle");
      if (!deliberate) return;
      if (ms < MIN_MS || blob.size === 0) cbRef.current.onTooShort();
      // Tap-to-start makes it possible to start a recording and put the phone
      // down. Sending that would cost a transcription, an answer, a spoken
      // reply and one of the visitor's turns, for a question nobody asked.
      else if (peak < SILENCE_PEAK) cbRef.current.onSilent();
      else cbRef.current.onDone(blob, Math.min(ms, maxMs));
    };

    recorderRef.current = rec;
    startedAtRef.current = Date.now();
    try {
      // A timeslice, so the slices arrive while the visitor is still talking
      // and the transcript can keep up with them.
      rec.start(CHUNK_MS);
    } catch {
      teardown();
      setState("idle");
      cbRef.current.onFailure("unknown");
      return;
    }
    startMeter(stream);
    setState("recording");
    cbRef.current.onStart?.(stream);

    tickRef.current = window.setInterval(() => {
      const left = Math.ceil((maxMs - (Date.now() - startedAtRef.current)) / 1000);
      setSecondsLeft(left > 0 ? left : 0);
    }, 250);
    capRef.current = window.setTimeout(finish, maxMs);
  }, [state, maxMs, finish, teardown, startMeter]);

  /** Tap while recording: send what there is. */
  const stop = useCallback(() => {
    finish();
  }, [finish]);

  /**
   * The button is one control with one job: start, or send. A tap during
   * `opening` abandons the attempt — `start` sees the generation move and
   * lets go of the microphone itself.
   */
  const toggle = useCallback(() => {
    if (state === "recording") stop();
    else if (state === "opening") {
      teardown();
      setState("idle");
    } else void start();
  }, [state, stop, start, teardown]);

  /** A hidden page, a closed panel, an unmount: all end the same way. */
  useEffect(() => {
    const onHide = () => teardown();
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      teardown();
    };
  }, [teardown]);

  return { state, secondsLeft, start, stop, toggle };
}
