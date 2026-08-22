import { useCallback, useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { assistSocketOrigin, ensureSession, forgetSession } from "../../lib/assistApi";
import { MicError, openMic, pickMimeType, releaseMic } from "./mic";
import type { MicFailure } from "./mic";
import type {
  AssistCallEnded,
  AssistCallHeard,
  AssistCallLeadAsk,
  AssistCallNotice,
  AssistCallState,
  AssistEndReason,
  AssistLang,
  AssistTurnResult,
} from "../../types/assist";

/**
 * The live call.
 *
 * `socket.io-client` is ~40 KB and almost nobody taps Call, so it is pulled in
 * by a dynamic `import()` at the moment the visitor asks for a call, not when
 * they open the panel and certainly not when the page loads.
 *
 * Order of operations matters: the microphone is opened BEFORE the socket. A
 * call slot is one of three in the whole product, and burning one only to
 * discover the visitor's browser will not give us a microphone would take a
 * line away from somebody who could have used it.
 *
 * ── Why the microphone simply stays open ──────────────────────────────────
 *
 * This used to be push-to-talk, and push-to-talk is a walkie-talkie. The whole
 * reason a dealer taps Call rather than typing is that they want to talk to
 * somebody, and nobody holds a button down to talk to a person. So the
 * microphone stays open for the length of the call and the loudness meter
 * decides where one sentence ends: about 900ms of quiet after they have
 * actually said something. "Quiet" is measured, not assumed — the first second
 * of every call takes the noise floor of that forecourt, so a pump with a
 * tanker running is not mistaken for a person talking.
 *
 * Holding a button is still there, one tap away, because a busy forecourt can
 * defeat any meter. It is the fallback, not the road.
 *
 * ── Why an open microphone does not mean an open wire ─────────────────────
 *
 * The recorder runs while we are listening, but its slices are held on this
 * side until the meter is sure a person is talking. That matters for two
 * reasons. Bytes that reach the server are transcribed and paid for, so a door
 * slamming must never buy a transcription. And the server keeps every slice it
 * is sent until `audio:end` arrives, with no way to say "forget that" — so an
 * utterance we abandon after sending part of it would put its bytes in front
 * of the next real sentence and corrupt it.
 *
 * Holding the slices also buys the start of the word back. The meter cannot
 * know somebody is talking until they have been talking for a moment, so the
 * recorder is already running before that moment arrives and the held slices
 * carry the first syllable with them. It is rolled over every couple of
 * seconds while nothing is said, so the silence it is holding never grows.
 */

export type CallPhase = "idle" | "connecting" | "listening" | "thinking" | "speaking" | "ended";

/** Why a call could not start. Each one gets its own sentence in the panel. */
export type CallRefusalKind =
  | "unauthorized"
  | "blocked"
  | "capacity"
  | "disabled"
  | "mic"
  | "generic";

export interface CallRefusal {
  kind: CallRefusalKind;
  /** Set only when `kind` is `mic`. */
  micFailure?: MicFailure;
}

interface Options {
  lang: AssistLang;
  /**
   * What to say when the socket gave up coming back. This hook has no
   * dictionary — every other sentence a call shows is written by the server —
   * so the one sentence only the client can know about is handed in.
   */
  lostText: string;
  onHeard: (heard: AssistCallHeard) => void;
  onReply: (reply: AssistTurnResult) => void;
  onLeadAsk: (ask: AssistCallLeadAsk) => void;
  /** A refusal is an event, not a state the panel should watch for. */
  onRefused: (refusal: CallRefusal) => void;
}

/** How long a stretch of quiet ends a sentence. A pause for breath is shorter. */
const SILENCE_MS = 900;
/** The first second of a call measures the forecourt, not the visitor. */
const CALIBRATE_MS = 1_000;
/** Loudness has to last this long before it counts as somebody starting to talk. */
const ONSET_MS = 120;
/** Loudness has to last this long before it counts as talking over the reply. */
const BARGE_SUSTAIN_MS = 350;
/** Do not let the reply be cut off in its first moment by a door slamming. */
const BARGE_GRACE_MS = 900;
/** How much unspoken-into silence the open recorder is allowed to hold. */
const PREROLL_MS = 2_000;
/**
 * How long we will wait for a reply's audio to start before deciding it never
 * will. Without this, one file that neither plays nor errors would leave the
 * microphone shut for the rest of the call.
 */
const AWAIT_AUDIO_MS = 8_000;
/** Recorder timeslice. Small enough to stream, large enough not to thrash 2G. */
const CHUNK_MS = 250;
/** How often the loudness is read. Fine enough to catch the start of a word. */
const METER_MS = 50;
/** How long a dead audio context is given before the button goes up instead. */
const SUSPENDED_MS = 2_500;

/**
 * One recording, from the moment the recorder starts to the moment its bytes
 * are either sent or thrown away. Held in a ref rather than in state: it is
 * driven by a 50ms interval and by recorder events, and nothing about it
 * belongs in a render.
 */
interface Utterance {
  rec: MediaRecorder;
  /** When the recorder started, which is where the blob starts. */
  startedAt: number;
  /** When it stopped, so the declared length matches the bytes. */
  endedAt: number;
  /** Slices held back until we are sure this is a person and not a forecourt. */
  pending: ArrayBuffer[];
  /** True once we are sure. From here every slice goes straight out. */
  live: boolean;
  /** True once this recording is abandoned. Nothing of it is ever sent. */
  dropped: boolean;
  /** True once the end marker is on the queue, so it is never queued twice. */
  flushed: boolean;
  /**
   * One chain for every slice. `Blob.arrayBuffer()` is a promise, and two of
   * them racing would put a later slice of speech on the wire before an
   * earlier one. A chain costs nothing and makes the order the order they
   * were recorded in.
   */
  queue: Promise<void>;
}

export function useAssistCall({
  lang,
  lostText,
  onHeard,
  onReply,
  onLeadAsk,
  onRefused,
}: Options) {
  const [phase, setPhase] = useState<CallPhase>("idle");
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [notice, setNotice] = useState<AssistCallNotice | null>(null);
  const [ended, setEnded] = useState<AssistCallEnded | null>(null);
  const [refusal, setRefusal] = useState<CallRefusal | null>(null);
  const [talking, setTalking] = useState(false);
  const [muted, setMutedState] = useState(false);
  const [holdMode, setHoldModeState] = useState(false);
  const [lost, setLost] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const utteranceRef = useRef<Utterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const meterRef = useRef(0);
  const deadlineRef = useRef<number | null>(null);
  const startedAtRef = useRef(0);
  const tickRef = useRef(0);

  const talkingRef = useRef(false);
  const mutedRef = useRef(false);
  const holdModeRef = useRef(false);
  /** True while a finger is actually on the fallback button. */
  const heldRef = useRef(false);
  const lastLoudRef = useRef(0);
  const loudSinceRef = useRef(0);
  const floorRef = useRef(0.01);
  const playbackStartRef = useRef(0);
  /**
   * True between the server saying it is composing an answer and that answer
   * actually coming out of the speaker.
   *
   * This is the one window where the microphone must be shut without the phase
   * saying so. The server marks the call "speaking" the moment it starts
   * writing the reply, one to three seconds before there is a sound, and it
   * drops every byte sent while it is busy — telling the visitor out loud that
   * we were busy, which is a rude answer to a question they asked politely.
   */
  const awaitingAudioRef = useRef(false);
  const awaitingSinceRef = useRef(0);
  const phaseRef = useRef<CallPhase>("idle");

  /**
   * Which attempt at connecting is the current one.
   *
   * `connect()` awaits three things — the microphone permission prompt, the
   * session, and the ~40 KB socket.io chunk — and on 2G the visitor has
   * seconds to change their mind in. Closing the panel, pressing End or
   * hanging up all go through `teardown()`, which bumps this; a continuation
   * that comes back to find the number has moved on stops where it stands
   * rather than opening a microphone and a call slot nobody is waiting for.
   */
  const runRef = useRef(0);
  /** True once the socket has been up. Distinguishes "never got in" from "fell out". */
  const everConnectedRef = useRef(false);
  /** Removes our listener from the Manager, which `removeAllListeners()` does not reach. */
  const detachManagerRef = useRef<(() => void) | null>(null);

  const lostTextRef = useRef(lostText);
  useEffect(() => {
    lostTextRef.current = lostText;
  }, [lostText]);

  // The socket handlers are registered once, at connect, so they must not
  // close over a render's props. They read this instead, kept current in an
  // effect rather than during render.
  const cbRef = useRef({ onHeard, onReply, onLeadAsk, onRefused });
  useEffect(() => {
    cbRef.current = { onHeard, onReply, onLeadAsk, onRefused };
  }, [onHeard, onReply, onLeadAsk, onRefused]);

  const setPhaseBoth = useCallback((next: CallPhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  /**
   * Record a refusal and hand it straight to the panel.
   *
   * Told, not watched: the panel opening a callback form is a consequence of
   * the refusal happening, not of a value having changed, and an effect
   * watching a state would fire again on every unrelated re-render.
   */
  const refuse = useCallback((r: CallRefusal) => {
    setRefusal(r);
    cbRef.current.onRefused(r);
  }, []);

  /* ── Playback ─────────────────────────────────────────────────────────── */

  const stopPlayback = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    try {
      el.pause();
      el.currentTime = 0;
    } catch {
      /* nothing playing */
    }
  }, []);

  /* ── One utterance ────────────────────────────────────────────────────── */

  /** Everything held back goes out, in the order it was recorded. */
  const emitPending = useCallback((u: Utterance) => {
    const sock = socketRef.current;
    for (const buf of u.pending) sock?.emit("audio:chunk", buf);
    u.pending.length = 0;
  }, []);

  /**
   * This is a person talking. Open the wire.
   *
   * The held slices are flushed through the same chain the live ones use, so
   * the first syllable — recorded before the meter could know — arrives first.
   */
  const goLive = useCallback(
    (u: Utterance) => {
      if (u.live || u.dropped) return;
      u.live = true;
      lastLoudRef.current = Date.now();
      talkingRef.current = true;
      setTalking(true);
      u.queue = u.queue
        .then(() => {
          if (!u.dropped) emitPending(u);
        })
        .catch(() => undefined);
    },
    [emitPending],
  );

  /**
   * Put the end marker on the wire.
   *
   * It is NOT emitted straight away. `MediaRecorder.stop()` delivers one last
   * `dataavailable` after it returns, so emitting the marker outside the chain
   * would put it ahead of the final slice of speech and the server would
   * transcribe a sentence with its last word missing.
   */
  const flush = useCallback(
    (u: Utterance) => {
      if (u.dropped || !u.live || u.flushed) return;
      u.flushed = true;
      u.queue = u.queue
        .then(() => {
          emitPending(u);
          const ms = Math.max(1, (u.endedAt || Date.now()) - u.startedAt);
          socketRef.current?.emit("audio:end", { ms });
        })
        .catch(() => undefined);
    },
    [emitPending],
  );

  /** Throw a recording away without the server ever hearing of it. */
  const dropUtterance = useCallback(() => {
    const u = utteranceRef.current;
    if (!u) return;
    utteranceRef.current = null;
    u.dropped = true;
    u.pending.length = 0;
    talkingRef.current = false;
    setTalking(false);
    try {
      if (u.rec.state !== "inactive") u.rec.stop();
    } catch {
      /* already stopped */
    }
  }, []);

  /** Open a recorder on the live stream. `live` skips the "is this a person" wait. */
  const arm = useCallback(
    (live: boolean) => {
      const stream = streamRef.current;
      if (!stream || utteranceRef.current || mutedRef.current) return;

      // A fresh recorder per utterance, so every recording that reaches S3 is a
      // complete file rather than a slice of a stream that needs a header from
      // somewhere else. There is no ffmpeg on the server to repair one.
      const mimeType = pickMimeType();
      let rec: MediaRecorder;
      try {
        rec = new window.MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      } catch {
        // The meter would ask again in fifty milliseconds, and again after
        // that. A recorder this browser will not build is not going to build
        // on the twentieth try, so the visitor gets the button instead.
        holdModeRef.current = true;
        setHoldModeState(true);
        return;
      }

      const u: Utterance = {
        rec,
        startedAt: Date.now(),
        endedAt: 0,
        pending: [],
        live: false,
        dropped: false,
        flushed: false,
        queue: Promise.resolve(),
      };

      rec.ondataavailable = (e: BlobEvent) => {
        if (!e.data || e.data.size === 0) return;
        const slice = e.data;
        u.queue = u.queue
          .then(() => slice.arrayBuffer())
          .then((buf) => {
            if (u.dropped) return;
            if (!u.live) {
              u.pending.push(buf);
              return;
            }
            emitPending(u);
            socketRef.current?.emit("audio:chunk", buf);
          })
          .catch(() => undefined);
      };
      rec.onstop = () => flush(u);

      utteranceRef.current = u;
      try {
        rec.start(CHUNK_MS);
      } catch {
        utteranceRef.current = null;
        holdModeRef.current = true;
        setHoldModeState(true);
        return;
      }
      if (live) goLive(u);
    },
    [emitPending, flush, goLive],
  );

  /**
   * The sentence is finished. Send it, and say we are thinking.
   *
   * The phase is moved here rather than waited for: the server takes a moment
   * to answer, and until it does, this side must not open the microphone again
   * — anything sent into that window is dropped by the server and the visitor
   * is told out loud that we were busy. Saying "Thinking" the instant we send
   * is also simply what is true.
   */
  const endUtterance = useCallback(() => {
    const u = utteranceRef.current;
    if (!u) return;
    utteranceRef.current = null;
    talkingRef.current = false;
    setTalking(false);
    u.endedAt = Date.now();

    if (!u.live) {
      u.dropped = true;
      u.pending.length = 0;
    }
    let stopped = false;
    try {
      if (u.rec.state !== "inactive") {
        u.rec.stop(); // `onstop` flushes once the last slice is out
        stopped = true;
      }
    } catch {
      /* fall through and close it by hand */
    }
    if (!stopped) flush(u);
    if (u.live) setPhaseBoth("thinking");
  }, [flush, setPhaseBoth]);

  const barge = useCallback(() => {
    stopPlayback();
    socketRef.current?.emit("call:barge", {});
  }, [stopPlayback]);

  /* ── Teardown ─────────────────────────────────────────────────────────── */

  const teardown = useCallback(() => {
    // Every way out of a call goes through here — End, Escape, the launcher,
    // unmount, a refusal, the server hanging up — so this is the one place
    // that has to invalidate a `connect()` still waiting on an await.
    runRef.current += 1;

    if (tickRef.current) window.clearInterval(tickRef.current);
    tickRef.current = 0;
    if (meterRef.current) window.clearInterval(meterRef.current);
    meterRef.current = 0;

    dropUtterance();

    stopPlayback();
    audioRef.current = null;

    const ctx = audioCtxRef.current;
    audioCtxRef.current = null;
    analyserRef.current = null;
    if (ctx) void ctx.close().catch(() => undefined);

    releaseMic(streamRef.current);
    streamRef.current = null;

    // `removeAllListeners()` below only reaches the socket's own events. The
    // Manager is cached and reused for the next call to the same URL, so a
    // listener left on it would fire during somebody else's call.
    const detach = detachManagerRef.current;
    detachManagerRef.current = null;
    if (detach) {
      try {
        detach();
      } catch {
        /* already gone */
      }
    }

    const sock = socketRef.current;
    socketRef.current = null;
    if (sock) {
      try {
        sock.removeAllListeners();
        sock.disconnect();
      } catch {
        /* already gone */
      }
    }

    everConnectedRef.current = false;
    heldRef.current = false;
    awaitingAudioRef.current = false;
    mutedRef.current = false;
    setMutedState(false);
  }, [dropUtterance, stopPlayback]);

  /**
   * Drop the session token.
   *
   * The server closes the session at the end of every call — `endCall` is its
   * single exit and it always writes the ending — so the token in hand is
   * good for nothing afterwards. Left in place, the next thing the visitor
   * types is refused and the panel has no way back. Cleared here, the next
   * question quietly opens a fresh conversation.
   */
  const dropSession = useCallback(() => {
    forgetSession();
  }, []);

  /**
   * The meter's audio context.
   *
   * Opened from inside the tap that asked for the call, which is why this is
   * separate from the meter that uses it. iOS starts any AudioContext built
   * outside a gesture in the suspended state, and a suspended context reads a
   * flat line whatever the forecourt is doing — so a context built later, on
   * the socket's connect event, would give us a hands-free call that hears
   * nothing at all and never says why.
   */
  const openAudioContext = useCallback((): AudioContext | null => {
    if (audioCtxRef.current) return audioCtxRef.current;
    try {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      // No meter means no hands free at all, so the panel puts the button up
      // and leaves it up. A call nobody can talk on is the only worse outcome.
      if (!Ctor) {
        holdModeRef.current = true;
        setHoldModeState(true);
        return null;
      }
      const ctx = new Ctor();
      audioCtxRef.current = ctx;
      void ctx.resume?.().catch(() => undefined);
      return ctx;
    } catch {
      holdModeRef.current = true;
      setHoldModeState(true);
      return null;
    }
  }, []);

  /* ── The loudness meter: it decides everything ────────────────────────── */

  const startMeter = useCallback(() => {
    // A reconnect brings back the socket, not the microphone: `connect` fires
    // again on every successful reconnection and the meter is already
    // measuring the right stream. Starting a second one would orphan the
    // first interval and the first AudioContext, and throw away the noise
    // floor this forecourt was measured at.
    if (meterRef.current) return;
    const stream = streamRef.current;
    if (!stream) return;
    const ctx = openAudioContext();
    if (!ctx) return;
    void ctx.resume?.().catch(() => undefined);
    let analyser: AnalyserNode;
    try {
      const source = ctx.createMediaStreamSource(stream);
      analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
    } catch {
      holdModeRef.current = true;
      setHoldModeState(true);
      return;
    }
    analyserRef.current = analyser;

    const buf = new Uint8Array(analyser.fftSize);
    const startedAt = Date.now();
    let floorSum = 0;
    let floorCount = 0;

    meterRef.current = window.setInterval(() => {
      const a = analyserRef.current;
      if (!a) return;
      a.getByteTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) {
        const v = (buf[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / buf.length);
      const now = Date.now();

      // A context the browser never started hears a flat line however loud the
      // room is. Rather than let the visitor talk into nothing, the button
      // goes up and stays up.
      if (ctx.state !== "running") {
        if (now - startedAt > SUSPENDED_MS && !holdModeRef.current) {
          holdModeRef.current = true;
          setHoldModeState(true);
        }
        return;
      }

      // The first second of the call measures the forecourt, so "quiet" means
      // quiet for this pump, not quiet for a recording studio.
      if (now - startedAt < CALIBRATE_MS) {
        floorSum += rms;
        floorCount += 1;
        floorRef.current = Math.max(0.008, floorSum / Math.max(1, floorCount));
        return;
      }

      const loud = rms > Math.max(floorRef.current * 2.5, 0.015);
      const p = phaseRef.current;
      const u = utteranceRef.current;

      // A muted microphone hears nothing, decides nothing and sends nothing.
      if (mutedRef.current) return;

      // Being heard right now. Quiet is the only thing that ends a sentence,
      // unless a finger is holding the fallback button, in which case letting
      // go is.
      if (u?.live) {
        if (loud) lastLoudRef.current = now;
        else if (!heldRef.current && now - lastLoudRef.current > SILENCE_MS) endUtterance();
        return;
      }

      // A reply that never made a sound must not shut the microphone for good.
      if (awaitingAudioRef.current && now - awaitingSinceRef.current > AWAIT_AUDIO_MS) {
        awaitingAudioRef.current = false;
      }

      const player = audioRef.current;
      const playing = player !== null && !player.paused && !player.ended;

      // Our own voice is coming out of the speaker. Nothing is recorded into
      // that except somebody plainly talking over it, and echo cancellation is
      // not trusted to tell the difference on a phone held at arm's length.
      if (playing) {
        if (u) dropUtterance();
        if (holdModeRef.current || now - playbackStartRef.current < BARGE_GRACE_MS || !loud) {
          loudSinceRef.current = 0;
          return;
        }
        if (!loudSinceRef.current) loudSinceRef.current = now;
        if (now - loudSinceRef.current > BARGE_SUSTAIN_MS) {
          loudSinceRef.current = 0;
          barge();
          arm(true); // they are plainly talking; no need to ask the meter again
        }
        return;
      }

      /**
       * The microphone is open whenever the server can take audio.
       *
       * "Speaking" counts, because the server leaves a call in that phase after
       * the answer has finished — the next thing that moves it is the visitor
       * talking. Waiting for a phase that only their own voice can bring about
       * would be a call that answers once and then goes deaf.
       */
      const canHear = !awaitingAudioRef.current && (p === "listening" || p === "speaking");
      if (!canHear) {
        // Connecting, thinking, or an answer being written: the server is not
        // reading the microphone and every byte sent would be thrown away.
        if (u) dropUtterance();
        loudSinceRef.current = 0;
        return;
      }

      if (heldRef.current) return; // the button is driving this one
      if (holdModeRef.current) {
        if (u) dropUtterance();
        return;
      }
      if (!u) {
        arm(false); // start holding slices, in case the next sound is a word
        return;
      }
      if (loud) {
        if (!loudSinceRef.current) loudSinceRef.current = now;
        if (now - loudSinceRef.current >= ONSET_MS) {
          loudSinceRef.current = 0;
          goLive(u);
        }
        return;
      }
      loudSinceRef.current = 0;
      // Still nothing said. Roll the recorder so the silence it is holding
      // never grows into something we would have to pay to transcribe.
      if (now - u.startedAt > PREROLL_MS) {
        dropUtterance();
        arm(false);
      }
    }, METER_MS);
  }, [arm, barge, dropUtterance, endUtterance, goLive, openAudioContext]);

  /* ── Hanging up ───────────────────────────────────────────────────────── */

  const hangUp = useCallback(
    (reason: AssistEndReason = "visitor-left") => {
      const sock = socketRef.current;
      if (sock) {
        try {
          sock.emit("call:end", { reason });
        } catch {
          /* the socket has already gone */
        }
      }
      teardown();
      dropSession();
      deadlineRef.current = null;
      setRemainingMs(null);
      setPhaseBoth("ended");
    },
    [teardown, dropSession, setPhaseBoth],
  );

  /** Wipe the call away entirely, so the panel can go back to typing. */
  const reset = useCallback(() => {
    teardown();
    deadlineRef.current = null;
    startedAtRef.current = 0;
    setRemainingMs(null);
    setElapsedMs(0);
    setNotice(null);
    setEnded(null);
    setRefusal(null);
    setLost(false);
    setHoldModeState(false);
    holdModeRef.current = false;
    setPhaseBoth("idle");
  }, [teardown, setPhaseBoth]);

  /* ── Connecting ───────────────────────────────────────────────────────── */

  const connect = useCallback(async () => {
    if (phaseRef.current !== "idle" && phaseRef.current !== "ended") return;
    setRefusal(null);
    setEnded(null);
    setNotice(null);
    setLost(false);
    setElapsedMs(0);
    startedAtRef.current = Date.now();
    setPhaseBoth("connecting");

    // Anything a previous attempt is still awaiting belongs to nobody now.
    // A cancelled continuation below returns without touching the phase: the
    // visitor who cancelled has already said what screen they want to be on.
    const run = ++runRef.current;
    everConnectedRef.current = false;

    // Still inside the tap that asked for this. See `openAudioContext`.
    openAudioContext();

    // The microphone first: a refused microphone must not cost a call slot.
    let stream: MediaStream;
    try {
      stream = await openMic();
    } catch (err) {
      if (runRef.current !== run) return;
      teardown(); // closes the audio context opened a moment ago
      setPhaseBoth("idle");
      refuse({ kind: "mic", micFailure: err instanceof MicError ? err.failure : "unknown" });
      return;
    }
    // Cancelled while the permission prompt was up. The stream is ours alone
    // — `streamRef` has not been assigned, so nothing else can ever release
    // it — and a microphone light left on is the worst thing this can do.
    if (runRef.current !== run) {
      releaseMic(stream);
      return;
    }
    streamRef.current = stream;

    let token: string;
    try {
      token = (await ensureSession(lang)).token;
    } catch {
      if (runRef.current !== run) return;
      teardown();
      setPhaseBoth("idle");
      refuse({ kind: "generic" });
      return;
    }
    if (runRef.current !== run) return; // teardown() already let the microphone go

    let io: typeof import("socket.io-client").io;
    try {
      ({ io } = await import("socket.io-client"));
    } catch {
      if (runRef.current !== run) return;
      teardown();
      setPhaseBoth("idle");
      refuse({ kind: "generic" });
      return;
    }
    // The 40 KB chunk can take fifteen seconds on 2G, which is long enough to
    // get bored in. Stopping here costs the visitor nothing: no call slot is
    // taken, no greeting is synthesised, and nothing is spoken out loud on a
    // page with no panel on it.
    if (runRef.current !== run) return;

    const sock = io(`${assistSocketOrigin()}/assist-call`, {
      auth: { token },
      // Websocket first, long-polling behind it. Asking for websocket ALONE is
      // what took live calls off the air after launch: nginx in front of the
      // API was not passing the Upgrade and Connection headers, so the socket
      // could never leave HTTP, and with nothing to fall back to every call
      // died at the handshake instead of quietly running slower. The proxy is
      // fixed, but a corporate proxy or a hotel wifi that eats the upgrade is
      // not something we control, and a slow call beats no call.
      transports: ["websocket", "polling"],
      reconnectionAttempts: 3,
      timeout: 15_000,
    });
    socketRef.current = sock;

    sock.on("connect", () => {
      everConnectedRef.current = true;
      setLost(false);
      sock.emit("call:start", { lang });
      startMeter();
    });

    sock.on("connect_error", (err: Error) => {
      // This fires for the handshake AND for every failed reconnection
      // attempt: the manager emits `error` before its own retry branch, and
      // the socket re-emits it as `connect_error` while it is not connected.
      // A call that was already up must not be torn down here — teardown()
      // disconnects the socket, which kills the attempts that are left and
      // wastes the server's twenty-second grace on the slot it is holding.
      if (everConnectedRef.current) {
        setLost(true);
        return;
      }
      // A handshake refusal arrives as the message the server passed to
      // `next(new Error(...))`. Each one means something different to the
      // visitor, so none of them share a sentence.
      const reason = String(err?.message ?? "").toLowerCase();
      const kind: CallRefusalKind = reason.includes("unauthor")
        ? "unauthorized"
        : reason.includes("block")
          ? "blocked"
          : reason.includes("capacit")
            ? "capacity"
            : reason.includes("disab")
              ? "disabled"
              : "generic";
      teardown();
      setPhaseBoth("idle");
      refuse({ kind });
    });

    sock.on("disconnect", (reason: string) => {
      if (phaseRef.current === "ended" || phaseRef.current === "idle") return;
      // "io client disconnect" is us hanging up; anything else is the network.
      if (reason !== "io client disconnect") setLost(true);
    });

    // Only socket.io giving up ends a call that was already running. It has
    // tried three times by now and the server's grace has all but run out, so
    // this is the honest moment to say the connection is not coming back.
    const onReconnectFailed = () => {
      // The session is NOT dropped here. The server holds it open for another
      // few seconds and a question typed into that window still lands in the
      // same conversation; once the server does close it, a 409 replaces it
      // without the visitor seeing anything.
      teardown();
      deadlineRef.current = null;
      setRemainingMs(null);
      setEnded({ reason: "error", text: lostTextRef.current });
      setPhaseBoth("ended");
    };
    sock.io.on("reconnect_failed", onReconnectFailed);
    detachManagerRef.current = () => sock.io.off("reconnect_failed", onReconnectFailed);

    sock.on("call:state", (state: AssistCallState) => {
      if (typeof state?.remainingMs === "number") {
        deadlineRef.current = Date.now() + state.remainingMs;
        setRemainingMs(state.remainingMs);
      }
      if (state?.phase === "ended") {
        setPhaseBoth("ended");
        return;
      }
      // "Speaking" arrives when the server starts WRITING the answer, not
      // when a sound comes out. Everything sent between here and the first
      // note of it is dropped by the server, so the microphone shuts until
      // the reply is actually playing.
      if (state?.phase === "speaking" && !awaitingAudioRef.current) {
        awaitingAudioRef.current = true;
        awaitingSinceRef.current = Date.now();
      }
      if (state?.phase) setPhaseBoth(state.phase);
    });

    sock.on("turn:heard", (heard: AssistCallHeard) => cbRef.current.onHeard(heard));

    sock.on("turn:reply", (reply: AssistTurnResult) => {
      cbRef.current.onReply(reply);
      // No sound to wait for: an answer that failed to be spoken must not
      // leave the microphone shut waiting for it.
      if (!reply?.audioUrl) {
        awaitingAudioRef.current = false;
        return;
      }
      let el = audioRef.current;
      if (!el) {
        el = new Audio();
        el.preload = "auto";
        audioRef.current = el;
      }
      // The wait ends when a sound actually comes out, not when the file is
      // handed over: a signed URL on 2G can take a second to open, and the
      // visitor talking into that second must be heard, not barged over.
      const done = () => {
        awaitingAudioRef.current = false;
      };
      el.onplaying = () => {
        awaitingAudioRef.current = false;
        // The barge grace starts HERE. Anywhere earlier and the first word of
        // the answer is cut off by whatever the forecourt was doing.
        playbackStartRef.current = Date.now();
      };
      el.onended = done;
      el.onerror = done;
      awaitingAudioRef.current = true;
      awaitingSinceRef.current = Date.now();
      playbackStartRef.current = Date.now();
      el.src = reply.audioUrl;
      void el.play().catch(done); // a blocked autoplay still leaves the text
    });

    sock.on("call:notice", (n: AssistCallNotice) => setNotice(n));

    sock.on("lead:ask", (ask: AssistCallLeadAsk) => cbRef.current.onLeadAsk(ask));

    sock.on("call:ended", (e: AssistCallEnded) => {
      setEnded(e);
      teardown();
      dropSession();
      deadlineRef.current = null;
      setRemainingMs(null);
      setPhaseBoth("ended");
    });
  }, [lang, openAudioContext, startMeter, teardown, dropSession, setPhaseBoth, refuse]);

  /* ── The clock ────────────────────────────────────────────────────────── */

  useEffect(() => {
    if (phase === "idle" || phase === "ended") return;
    const tick = () => {
      if (startedAtRef.current) setElapsedMs(Date.now() - startedAtRef.current);
      if (deadlineRef.current !== null) {
        setRemainingMs(Math.max(0, deadlineRef.current - Date.now()));
      }
    };
    tick();
    tickRef.current = window.setInterval(tick, 1_000);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      tickRef.current = 0;
    };
  }, [phase]);

  /* ── Mute ─────────────────────────────────────────────────────────────── */

  /**
   * Mute is the microphone going quiet, not the call pausing.
   *
   * The track itself is disabled as well as the recorder being dropped,
   * because a visitor who mutes has decided the room should not be heard, and
   * a half-recorded sentence sent on the way out would be answered out loud —
   * which is the opposite of what they just asked for.
   */
  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMutedState(next);
    const stream = streamRef.current;
    if (stream) for (const track of stream.getAudioTracks()) track.enabled = !next;
    if (next) {
      heldRef.current = false;
      dropUtterance();
    }
  }, [dropUtterance]);

  /* ── Hold to talk: the fallback, for a forecourt no meter can read ────── */

  const setHoldMode = useCallback(
    (on: boolean) => {
      holdModeRef.current = on;
      setHoldModeState(on);
      if (on) {
        heldRef.current = false;
        if (!talkingRef.current) dropUtterance();
      }
    },
    [dropUtterance],
  );

  const talkPress = useCallback(() => {
    const p = phaseRef.current;
    // "Thinking" is a turn already in flight. The server drops every byte sent
    // into that window and says nothing about it, so offering a microphone
    // here would take a question and quietly lose it.
    if (p === "idle" || p === "ended" || p === "thinking" || mutedRef.current) return;
    if (p === "speaking") barge();
    heldRef.current = true;
    const u = utteranceRef.current;
    if (u) goLive(u);
    else arm(true);
  }, [arm, barge, goLive]);

  const talkRelease = useCallback(() => {
    if (!heldRef.current) return;
    heldRef.current = false;
    if (talkingRef.current) endUtterance();
  }, [endUtterance]);

  /* ── Never leave a microphone on ──────────────────────────────────────── */

  useEffect(() => {
    const onHide = () => {
      if (phaseRef.current === "idle" || phaseRef.current === "ended") return;
      hangUp("visitor-left");
    };
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      // Unmount: tell the server if we can, and release the microphone always.
      const sock = socketRef.current;
      if (sock) {
        try {
          sock.emit("call:end", { reason: "visitor-left" });
        } catch {
          /* gone already */
        }
      }
      teardown();
    };
  }, [hangUp, teardown]);

  const active = phase !== "idle" && phase !== "ended";

  return {
    phase,
    active,
    remainingMs,
    elapsedMs,
    notice,
    ended,
    refusal,
    talking,
    muted,
    holdMode,
    lost,
    connect,
    hangUp,
    reset,
    toggleMute,
    setHoldMode,
    talkPress,
    talkRelease,
  };
}
