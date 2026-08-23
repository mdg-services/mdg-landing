import { useCallback, useEffect, useRef, useState } from "react";
import { liveTranscriptToken } from "../../lib/assistApi";
import type { AssistLang } from "../../types/assist";

/**
 * The visitor's own words, on screen while they are still speaking.
 *
 * ── The one rule ──────────────────────────────────────────────────────────
 *
 * This is a caption. It is NEVER the question. The recording is made by
 * `useVoiceNote` and answered by the server exactly as it always was, and
 * every failure in this file — no token, no socket, no AudioWorklet, a dead
 * uplink halfway through a sentence — costs the visitor a line of grey text
 * and nothing else. Nothing here is awaited before recording starts, and
 * nothing here can stop a note being sent.
 *
 * ── Why the vendor's socket and not the browser's own recogniser ──────────
 *
 * `SpeechRecognition` cannot be trusted to share a microphone. Chromium bug
 * 41083534 — open since 2014, still active — reports the `getUserMedia`
 * stream going dead while recognition runs on Android, and the failure is
 * silent: no error, just an empty recording. The specced fix,
 * `start(audioTrack)`, is desktop-only. Since the recording is the thing we
 * must not lose, the recogniser is the thing that goes.
 *
 * This instead taps the SAME `MediaStream` the recorder is already using. One
 * permission prompt, one microphone, two readers.
 *
 * ── The wire ──────────────────────────────────────────────────────────────
 *
 * ElevenLabs Scribe v2 Realtime wants base64 16 kHz mono 16-bit PCM. A phone
 * gives 48 kHz float, so there is a resample here. Probed against the live
 * API on 2026-08-23 with real Hindi, Hinglish and English speech:
 * `partial_transcript` carries the WHOLE segment so far, not the newest
 * words, so each one REPLACES the line rather than appending to it.
 * Appending would print every word three or four times.
 */

/** How much audio to gather before sending a frame. Matches the recorder's slice. */
const FLUSH_MS = 250;
/**
 * Frames held while the token is being minted and the socket is opening.
 *
 * Without this the caption loses however long that takes — the visitor taps,
 * says "my petrol pump", and reads "petrol pump" appearing. Twelve frames is
 * three seconds, far longer than the round trip really takes; a socket still
 * not open by then has lost the race, and the caption is abandoned rather
 * than delivered three seconds behind the speaker.
 */
const MAX_PENDING_FRAMES = 12;

/**
 * The worklet does one job — hand the samples over — because everything else
 * is cheaper on the main thread than a second copy across the port.
 */
const WORKLET_SRC = `
class AssistPcm extends AudioWorkletProcessor {
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    // The render quantum's buffer is reused, so this has to be a copy.
    if (ch && ch.length) this.port.postMessage(new Float32Array(ch));
    return true;
  }
}
registerProcessor('assist-pcm', AssistPcm);
`;

/** Linear resample to 16 kHz. Cheap enough for a low-end phone's main thread. */
function to16k(input: Float32Array, inRate: number): Float32Array {
  if (inRate === 16_000) return input;
  const ratio = inRate / 16_000;
  const out = new Float32Array(Math.floor(input.length / ratio));
  for (let i = 0; i < out.length; i += 1) {
    const at = i * ratio;
    const lo = Math.floor(at);
    const hi = Math.min(lo + 1, input.length - 1);
    const frac = at - lo;
    out[i] = (input[lo] ?? 0) * (1 - frac) + (input[hi] ?? 0) * frac;
  }
  return out;
}

/** Float samples to base64 16-bit little-endian PCM, which is what the socket reads. */
function toBase64Pcm(samples: Float32Array): string {
  const bytes = new Uint8Array(samples.length * 2);
  const view = new DataView(bytes.buffer);
  for (let i = 0; i < samples.length; i += 1) {
    const s = Math.max(-1, Math.min(1, samples[i] ?? 0));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  let binary = "";
  // Chunked so a long frame cannot blow the argument limit on `apply`.
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

export function useLiveTranscript({ enabled, lang }: { enabled: boolean; lang: AssistLang }) {
  const [text, setText] = useState("");

  const socketRef = useRef<WebSocket | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodeRef = useRef<AudioWorkletNode | null>(null);
  const bufRef = useRef<Float32Array[]>([]);
  const bufLenRef = useRef(0);
  /** Encoded frames captured before the socket finished opening. */
  const pendingRef = useRef<string[]>([]);
  /** Bumped on every teardown, so a token or socket that lands late is dropped. */
  const genRef = useRef(0);

  const teardown = useCallback(() => {
    genRef.current += 1;
    const node = nodeRef.current;
    nodeRef.current = null;
    if (node) {
      node.port.onmessage = null;
      try {
        node.disconnect();
      } catch {
        /* already out of the graph */
      }
    }
    const ctx = ctxRef.current;
    ctxRef.current = null;
    if (ctx) void ctx.close().catch(() => undefined);
    const sock = socketRef.current;
    socketRef.current = null;
    if (sock) {
      sock.onopen = null;
      sock.onmessage = null;
      sock.onerror = null;
      try {
        sock.close();
      } catch {
        /* already closing */
      }
    }
    bufRef.current = [];
    bufLenRef.current = 0;
    pendingRef.current = [];
  }, []);

  /**
   * Listen alongside the recorder. Never throws and never blocks: the
   * recording has already begun by the time this is called.
   */
  const begin = useCallback(
    async (stream: MediaStream) => {
      if (!enabled) return;
      if (typeof window === "undefined" || typeof window.WebSocket !== "function") return;
      setText("");

      const gen = genRef.current;
      const alive = () => gen === genRef.current;

      /**
       * Hand a frame over, or hold it until the socket is ready. The audio
       * graph below is built before the token has even been asked for, so the
       * first words of a sentence are captured rather than raced against a
       * round trip to our server and then on to the vendor.
       */
      const emit = (frame: string) => {
        const live = socketRef.current;
        if (live && live.readyState === WebSocket.OPEN) {
          try {
            live.send(JSON.stringify({ message_type: "input_audio_chunk", audio_base_64: frame }));
          } catch {
            /* the socket went while we were writing to it */
          }
          return;
        }
        pendingRef.current.push(frame);
        if (pendingRef.current.length > MAX_PENDING_FRAMES) teardown();
      };

      // ── The microphone tap, built FIRST so nothing spoken is missed ──
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      // No AudioWorklet means no caption. Everything else still works, which
      // is the right way for an old browser to lose a decoration.
      if (!Ctor) return;

      let ctx: AudioContext;
      try {
        ctx = new Ctor();
        if (!ctx.audioWorklet) {
          void ctx.close().catch(() => undefined);
          return;
        }
        const url = URL.createObjectURL(new Blob([WORKLET_SRC], { type: "text/javascript" }));
        try {
          await ctx.audioWorklet.addModule(url);
        } finally {
          URL.revokeObjectURL(url);
        }
      } catch {
        return;
      }
      if (!alive()) {
        void ctx.close().catch(() => undefined);
        return;
      }
      ctxRef.current = ctx;

      try {
        const node = new AudioWorkletNode(ctx, "assist-pcm");
        const rate = ctx.sampleRate;
        const framesPerFlush = Math.round((rate * FLUSH_MS) / 1000);

        node.port.onmessage = (ev: MessageEvent<Float32Array>) => {
          if (!alive()) return;
          bufRef.current.push(ev.data);
          bufLenRef.current += ev.data.length;
          if (bufLenRef.current < framesPerFlush) return;

          const joined = new Float32Array(bufLenRef.current);
          let at = 0;
          for (const part of bufRef.current) {
            joined.set(part, at);
            at += part.length;
          }
          bufRef.current = [];
          bufLenRef.current = 0;
          emit(toBase64Pcm(to16k(joined, rate)));
        };

        // A zero gain on the way to the speakers. The node has to be in the
        // graph to be pulled, and a forecourt does not need to hear itself.
        const sink = ctx.createGain();
        sink.gain.value = 0;
        ctx.createMediaStreamSource(stream).connect(node);
        node.connect(sink).connect(ctx.destination);
        nodeRef.current = node;
      } catch {
        teardown();
        return;
      }

      // ── The key and the socket, while the audio above is already piling up ──
      let key: Awaited<ReturnType<typeof liveTranscriptToken>>;
      try {
        key = await liveTranscriptToken(lang);
      } catch {
        // No caption this time. The note is entirely unaffected.
        teardown();
        return;
      }
      if (!alive()) return;

      let sock: WebSocket;
      try {
        // The token goes on the query string because a browser cannot put a
        // header on a WebSocket. It is single-use and minutes long, which is
        // the whole reason the server mints one instead of sharing its key.
        sock = new WebSocket(`${key.url}&token=${encodeURIComponent(key.token)}`);
      } catch {
        teardown();
        return;
      }
      socketRef.current = sock;

      sock.onopen = () => {
        if (!alive()) return;
        // Everything said while this was connecting, in order, before any
        // frame recorded since.
        const held = pendingRef.current;
        pendingRef.current = [];
        for (const frame of held) {
          try {
            sock.send(JSON.stringify({ message_type: "input_audio_chunk", audio_base_64: frame }));
          } catch {
            break;
          }
        }
      };

      sock.onmessage = (ev) => {
        if (!alive()) return;
        let msg: { message_type?: string; text?: unknown };
        try {
          msg = JSON.parse(String(ev.data)) as typeof msg;
        } catch {
          return;
        }
        const kind = msg.message_type;
        if (kind !== "partial_transcript" && kind !== "committed_transcript") return;
        const heard = typeof msg.text === "string" ? msg.text.trim() : "";
        // REPLACE, never append: each partial is the whole segment so far.
        if (heard) setText(heard);
      };
      sock.onerror = () => undefined;
    },
    [enabled, lang, teardown],
  );

  /**
   * The visitor has stopped talking, and the note is on its way. The caption
   * has done its job, so the segment is closed politely and everything is let
   * go — we do not wait for the closing transcript, because the transcript
   * that gets answered is the server's, from the recording itself.
   */
  const reset = useCallback(() => {
    const sock = socketRef.current;
    if (sock && sock.readyState === WebSocket.OPEN) {
      try {
        // An empty frame with `commit` closes a manual segment. The socket was
        // opened with commit_strategy=manual precisely so the stop button
        // decides this, not a guess about a pause in a noisy forecourt.
        sock.send(
          JSON.stringify({ message_type: "input_audio_chunk", audio_base_64: "", commit: true }),
        );
      } catch {
        /* nothing left to close */
      }
    }
    teardown();
    setText("");
  }, [teardown]);

  useEffect(() => teardown, [teardown]);

  return { text, begin, reset };
}
