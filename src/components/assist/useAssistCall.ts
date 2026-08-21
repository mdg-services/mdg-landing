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
 * Push-to-talk is the control. On a forecourt with a tanker running, a
 * button you hold is the only thing that is unambiguous. The silence detector
 * is a convenience on top: it ends an utterance after about 1.2 seconds of
 * quiet so the answer starts sooner, and it is never the only way to finish.
 */

export type CallPhase =
  | "idle"
  | "connecting"
  | "listening"
  | "thinking"
  | "speaking"
  | "ended";

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

/** How long a stretch of quiet ends an utterance. */
const SILENCE_MS = 1_200;
/** Loudness has to last this long before it counts as talking over the reply. */
const BARGE_SUSTAIN_MS = 400;
/** Do not let the reply be cut off in its first moment by a door slamming. */
const BARGE_GRACE_MS = 1_000;
/** Recorder timeslice. Small enough to stream, large enough not to thrash 2G. */
const CHUNK_MS = 250;

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
  const [notice, setNotice] = useState<AssistCallNotice | null>(null);
  const [ended, setEnded] = useState<AssistCallEnded | null>(null);
  const [refusal, setRefusal] = useState<CallRefusal | null>(null);
  const [talking, setTalking] = useState(false);
  const [lost, setLost] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const meterRef = useRef(0);
  const deadlineRef = useRef<number | null>(null);
  const tickRef = useRef(0);

  const talkingRef = useRef(false);
  const utteranceStartRef = useRef(0);
  const utteranceEndedRef = useRef(true);
  /** How long the utterance ran, handed to `onstop` to put on the wire. */
  const pendingEndMsRef = useRef(0);
  const heardSpeechRef = useRef(false);
  const lastLoudRef = useRef(0);
  const floorRef = useRef(0.01);
  const playbackStartRef = useRef(0);
  const loudSinceRef = useRef(0);
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

    const rec = recorderRef.current;
    recorderRef.current = null;
    if (rec && rec.state !== "inactive") {
      try {
        rec.stop();
      } catch {
        /* already stopped */
      }
    }

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
    talkingRef.current = false;
    setTalking(false);
  }, [stopPlayback]);

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

  /* ── One utterance ────────────────────────────────────────────────────── */

  /**
   * Finish the utterance.
   *
   * `audio:end` is NOT emitted here. `MediaRecorder.stop()` delivers one last
   * `dataavailable` after it returns, so emitting the end marker from this
   * function would put it on the wire ahead of the final slice of speech and
   * the server would transcribe a sentence with its last word missing. The
   * marker is emitted from `onstop`, at the back of the same queue the chunks
   * go through, which is the only way the order is guaranteed.
   */
  const endUtterance = useCallback(() => {
    if (utteranceEndedRef.current) return;
    utteranceEndedRef.current = true;
    talkingRef.current = false;
    setTalking(false);

    pendingEndMsRef.current = Date.now() - utteranceStartRef.current;
    const rec = recorderRef.current;
    recorderRef.current = null;
    if (rec && rec.state !== "inactive") {
      try {
        rec.stop(); // `onstop` emits audio:end once the last chunk is out
        return;
      } catch {
        /* fall through and close the utterance by hand */
      }
    }
    socketRef.current?.emit("audio:end", { ms: pendingEndMsRef.current });
  }, []);

  const startUtterance = useCallback(() => {
    const stream = streamRef.current;
    const sock = socketRef.current;
    if (!stream || !sock || !utteranceEndedRef.current) return;

    // A fresh recorder per utterance, so every recording that reaches S3 is a
    // complete file rather than a slice of a stream that needs a header from
    // somewhere else. There is no ffmpeg on the server to repair one.
    const mimeType = pickMimeType();
    let rec: MediaRecorder;
    try {
      rec = new window.MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    } catch {
      return;
    }
    // Every slice goes through one chain. `Blob.arrayBuffer()` is a promise,
    // and two of them racing would put a later slice of speech on the wire
    // before an earlier one. A chain costs nothing and makes the order the
    // order they were recorded in.
    let queue = Promise.resolve();
    rec.ondataavailable = (e: BlobEvent) => {
      if (!e.data || e.data.size === 0) return;
      const slice = e.data;
      queue = queue
        .then(() => slice.arrayBuffer())
        .then((buf) => {
          socketRef.current?.emit("audio:chunk", buf);
        })
        .catch(() => undefined);
    };
    rec.onstop = () => {
      queue = queue
        .then(() => {
          socketRef.current?.emit("audio:end", { ms: pendingEndMsRef.current });
        })
        .catch(() => undefined);
    };

    recorderRef.current = rec;
    utteranceEndedRef.current = false;
    utteranceStartRef.current = Date.now();
    heardSpeechRef.current = false;
    lastLoudRef.current = Date.now();
    talkingRef.current = true;
    setTalking(true);
    try {
      rec.start(CHUNK_MS);
    } catch {
      recorderRef.current = null;
      utteranceEndedRef.current = true;
      talkingRef.current = false;
      setTalking(false);
    }
  }, []);

  const barge = useCallback(() => {
    stopPlayback();
    socketRef.current?.emit("call:barge", {});
  }, [stopPlayback]);

  /* ── The loudness meter: silence detection and barge-in ───────────────── */

  const startMeter = useCallback(() => {
    // A reconnect brings back the socket, not the microphone: `connect` fires
    // again on every successful reconnection and the meter is already
    // measuring the right stream. Starting a second one would orphan the
    // first interval and the first AudioContext, and throw away the noise
    // floor this forecourt was measured at.
    if (meterRef.current) return;
    const stream = streamRef.current;
    if (!stream) return;
    let ctx: AudioContext;
    try {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return; // no meter, no silence detection; push-to-talk still works
      ctx = new Ctor();
    } catch {
      return;
    }
    audioCtxRef.current = ctx;
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
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

      // The first moments of the call measure the forecourt, so "quiet" means
      // quiet for this pump, not quiet for a recording studio.
      if (now - startedAt < 800) {
        floorSum += rms;
        floorCount += 1;
        floorRef.current = Math.max(0.008, floorSum / Math.max(1, floorCount));
        return;
      }

      const speaking = rms > Math.max(floorRef.current * 3, 0.02);

      if (talkingRef.current) {
        if (speaking) {
          heardSpeechRef.current = true;
          lastLoudRef.current = now;
        } else if (heardSpeechRef.current && now - lastLoudRef.current > SILENCE_MS) {
          endUtterance();
        }
        return;
      }

      // Not talking. If the assistant is speaking and the visitor starts up,
      // cut the reply and start recording what they are saying.
      //
      // "Speaking" is set the moment the server starts synthesising, which is
      // one to three seconds before a sound comes out and while the server is
      // still busy with the turn. Barging into that gap kills the voice of
      // the answer the visitor is waiting for and the words they say are
      // dropped, so the reply has to actually be playing first.
      const player = audioRef.current;
      const playing = player !== null && !player.paused && !player.ended;
      if (
        playing &&
        phaseRef.current === "speaking" &&
        now - playbackStartRef.current > BARGE_GRACE_MS
      ) {
        if (speaking) {
          if (!loudSinceRef.current) loudSinceRef.current = now;
          if (now - loudSinceRef.current > BARGE_SUSTAIN_MS) {
            loudSinceRef.current = 0;
            barge();
            startUtterance();
          }
        } else {
          loudSinceRef.current = 0;
        }
      } else {
        loudSinceRef.current = 0;
      }
    }, 100);
  }, [barge, endUtterance, startUtterance]);

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
    setRemainingMs(null);
    setNotice(null);
    setEnded(null);
    setRefusal(null);
    setLost(false);
    setPhaseBoth("idle");
  }, [teardown, setPhaseBoth]);

  /* ── Connecting ───────────────────────────────────────────────────────── */

  const connect = useCallback(async () => {
    if (phaseRef.current !== "idle" && phaseRef.current !== "ended") return;
    setRefusal(null);
    setEnded(null);
    setNotice(null);
    setLost(false);
    setPhaseBoth("connecting");

    // Anything a previous attempt is still awaiting belongs to nobody now.
    // A cancelled continuation below returns without touching the phase: the
    // visitor who cancelled has already said what screen they want to be on.
    const run = ++runRef.current;
    everConnectedRef.current = false;

    // The microphone first: a refused microphone must not cost a call slot.
    let stream: MediaStream;
    try {
      stream = await openMic();
    } catch (err) {
      if (runRef.current !== run) return;
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
      transports: ["websocket"],
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
      // The barge-in grace is NOT stamped here. "Speaking" arrives when the
      // server starts synthesising, not when a sound comes out; the clock
      // that matters starts in `turn:reply`, where playback really begins.
      if (state?.phase) setPhaseBoth(state.phase);
    });

    sock.on("turn:heard", (heard: AssistCallHeard) => cbRef.current.onHeard(heard));

    sock.on("turn:reply", (reply: AssistTurnResult) => {
      cbRef.current.onReply(reply);
      if (!reply?.audioUrl) return;
      let el = audioRef.current;
      if (!el) {
        el = new Audio();
        el.preload = "auto";
        audioRef.current = el;
      }
      el.src = reply.audioUrl;
      playbackStartRef.current = Date.now();
      void el.play().catch(() => undefined); // a blocked autoplay still leaves the text
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
  }, [lang, startMeter, teardown, dropSession, setPhaseBoth, refuse]);

  /* ── The clock ────────────────────────────────────────────────────────── */

  useEffect(() => {
    if (phase === "idle" || phase === "ended") return;
    tickRef.current = window.setInterval(() => {
      if (deadlineRef.current === null) return;
      setRemainingMs(Math.max(0, deadlineRef.current - Date.now()));
    }, 1_000);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      tickRef.current = 0;
    };
  }, [phase]);

  /* ── Push to talk ─────────────────────────────────────────────────────── */

  const talkPress = useCallback(() => {
    const p = phaseRef.current;
    // "Thinking" is a turn already in flight. The server drops every byte
    // sent into that window and says nothing about it, so offering a
    // microphone here would take a question and quietly lose it. The button
    // is disabled for the same reason; this is the guard behind it.
    if (p === "idle" || p === "ended" || p === "thinking") return;
    if (p === "speaking") barge();
    startUtterance();
  }, [barge, startUtterance]);

  const talkRelease = useCallback(() => {
    if (!talkingRef.current) return; // the silence detector already sent it
    endUtterance();
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
    notice,
    ended,
    refusal,
    talking,
    lost,
    connect,
    hangUp,
    reset,
    talkPress,
    talkRelease,
  };
}
