/**
 * The film watch page's whole runtime: playback that starts at once (muted,
 * with Hindi captions carrying the words) and in a sharp picture, the sound-on
 * tap, the page's own touch controls, speed / subtitles / picture settings,
 * chapters, resume, the end screen, and the view measurement.
 *
 * Inlined into /film and /film/short by scripts/film-pages.ts. It is not part
 * of the React app and must stay small: the page budget is 15 kB gzipped for
 * HTML + CSS + this file. Configuration arrives as JSON in #cfg.
 *
 * Measurement sends anonymous beacons only: a random per-browser id kept in
 * localStorage, a random per-page-load id, and what happened to the player.
 * Never a name, number or account.
 */
import type HlsType from "hls.js";

type FilmId = "kavach" | "kavach-short";
type Cta = "full" | "register" | "share" | "replay" | "chapter" | "speed";
type Range = [number, number];

interface PageConfig {
  film: FilmId;
  title: string;
  duration: number;
  base: string;
  hls: string;
  /** for the browser's own player: the same ladder, 720p / 540p / 360p listed first */
  playlists?: { hd: string; sd: string; lite: string };
  mp4: string;
  captions: string;
  chapters: Array<{ t: number; title: string }>;
  beacon: string;
  hlsJs: string;
  /** public URL of this page, without query */
  url: string;
  /** "short" pages link to the full film at the end; "full" pages to /register */
  kind: "full" | "short";
}

interface NetInfo {
  effectiveType?: string;
  saveData?: boolean;
  downlink?: number;
}

(() => {
  const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T | null;
  const cfgEl = $("cfg");
  if (!cfgEl) return;
  const C = JSON.parse(cfgEl.textContent || "{}") as PageConfig;
  const v = $<HTMLVideoElement>("v");
  if (!v) return;
  const stage = $("stage") || document.body;
  const snd = $<HTMLButtonElement>("snd");
  const big = $<HTMLButtonElement>("big");
  const end = $("end");
  const load = $("load");
  const errBox = $("err");
  const cls = (c: string, on: boolean) => stage.classList.toggle(c, on);
  // the page's own controls replace the browser's; without this script the browser's stay
  v.controls = false;
  cls("js", true);
  if (load) load.hidden = false;
  const q = new URLSearchParams(location.search);
  const pick = (k: string, re: RegExp) => {
    const x = q.get(k);
    return x && re.test(x) ? x : undefined;
  };
  const tag = pick("r", /^[A-Za-z0-9_-]{1,32}$/);
  const from = pick("from", /^[a-z-]{1,16}$/);
  const r2 = (n: number) => Math.round(n * 100) / 100;
  const now = () => (window.performance ? performance.now() : 0);
  const net: NetInfo = (navigator as unknown as { connection?: NetInfo }).connection || {};
  const media = (f: string) => `${C.base}/${f}`;

  /* ── links that carry the share code ─────────────────────────────────── */
  const withTag = (u: string, extra?: string) => {
    const p = [extra, tag ? `r=${tag}` : ""].filter(Boolean).join("&");
    return p ? `${u}?${p}` : u;
  };
  const shareUrl = withTag(C.url);
  document.querySelectorAll<HTMLAnchorElement>("a[data-wa]").forEach((a) => {
    a.href = `https://wa.me/?text=${encodeURIComponent(`${C.title}\n${shareUrl}`)}`;
  });
  const fullLinks = document.querySelectorAll<HTMLAnchorElement>("a[data-full]");
  fullLinks.forEach((a) => (a.href = withTag("/film", "from=short")));

  /* ── ids ─────────────────────────────────────────────────────────────── */
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  const uuid = (): string => {
    try {
      if (crypto.randomUUID) return crypto.randomUUID();
    } catch {
      /* not a secure context: fall through */
    }
    const b = new Uint8Array(16);
    crypto.getRandomValues(b);
    b[6] = (b[6] & 15) | 64;
    b[8] = (b[8] & 63) | 128;
    const h = Array.from(b, (x) => (x + 256).toString(16).slice(1)).join("");
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
  };
  let vid = "";
  try {
    vid = localStorage.getItem("mdg_vid") || "";
    if (!UUID.test(vid)) {
      vid = uuid();
      localStorage.setItem("mdg_vid", vid);
    }
  } catch {
    vid = vid && UUID.test(vid) ? vid : uuid();
  }
  const sid = uuid();
  let seq = 0;

  /* ── measurement state ───────────────────────────────────────────────── */
  let started = false; // the 'start' beacon has gone
  let pending: Range[] = [];
  let cur: Range | null = null;
  let acc = 0; // seconds watched since the last beacon
  let firstFrame = false;
  let startupMs: number | undefined;
  let startupSent = false;
  let clock0 = 0; // when the startup clock began (0 = navigation start)
  let stallAt: number | null = null;
  let rebuffers = 0;
  let rebufferMs = 0;
  let unmutedAt: number | undefined;
  let restarted = false;
  let unmuteSent = false;
  let ended = false;
  let ctas: Cta[] = [];
  let lastKind = "";
  // What the browser said to muted autoplay, once it has said it. The 'start'
  // beacon does not wait for that answer: a viewer on 2G can give up before
  // play() settles, and that open must still count.
  let autoplay: "muted" | "blocked" | undefined;
  let autoplaySent = "";

  const send = (kind: "start" | "beat" | "end", body: Record<string, unknown>) => {
    const json = JSON.stringify({ v: 1, film: C.film, sid, vid, seq: seq++, kind, at: Date.now(), ...body });
    lastKind = kind;
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(C.beacon, new Blob([json], { type: "text/plain" }))) return;
    } catch {
      /* fall back to fetch */
    }
    try {
      fetch(C.beacon, { method: "POST", body: json, keepalive: true, mode: "no-cors" }).catch(() => {});
    } catch {
      /* measurement must never break playback */
    }
  };

  const closeRange = () => {
    if (cur && cur[1] > cur[0]) pending.push(cur);
    cur = null;
  };

  const collect = (): Record<string, unknown> => {
    const ranges = pending.slice();
    if (cur && cur[1] > cur[0]) ranges.push([cur[0], cur[1]]);
    pending = [];
    if (cur) cur = [cur[1], cur[1]];
    acc = 0;
    const b: Record<string, unknown> = { pos: r2(v.currentTime || 0), muted: v.muted };
    if (ranges.length) b.ranges = ranges.map((x) => [r2(x[0]), r2(x[1])]);
    if (v.videoHeight) b.level = v.videoHeight;
    if (startupMs !== undefined && !startupSent) {
      b.startupMs = startupMs;
      startupSent = true;
    }
    if (unmutedAt !== undefined && !unmuteSent) {
      b.unmutedAt = unmutedAt;
      if (restarted) b.restarted = true;
      unmuteSent = true;
    }
    if (stallAt !== null) {
      const t = now();
      rebufferMs += t - stallAt;
      stallAt = t;
    }
    if (rebuffers || rebufferMs) {
      b.rebuffers = rebuffers;
      b.rebufferMs = Math.round(rebufferMs);
      rebuffers = 0;
      rebufferMs = 0;
    }
    if (ended) b.ended = true;
    if (ctas.length) b.cta = ctas;
    ctas = [];
    if (v.playbackRate !== 1) b.rate = v.playbackRate;
    // the 'start' beacon guessed "muted"; the browser later said otherwise
    if (autoplay && autoplay !== autoplaySent) {
      b.ctx = { autoplay };
      autoplaySent = autoplay;
    }
    return b;
  };

  /** Anything a beacon would carry that the server has not seen yet. Reads, never consumes. */
  const fresh = () =>
    !!(
      pending.length || (cur && cur[1] > cur[0]) || ctas.length || rebuffers || rebufferMs >= 1 ||
      (stallAt !== null && now() - stallAt >= 500) ||
      (startupMs !== undefined && !startupSent) || (unmutedAt !== undefined && !unmuteSent) ||
      (autoplay && autoplay !== autoplaySent)
    );
  const beat = () => {
    start();
    send("beat", collect());
  };
  const flushEnd = () => {
    start();
    // nothing new since the last 'end' (e.g. hidden, shown, hidden again): stay quiet
    if (lastKind === "end" && !fresh()) return;
    send("end", collect());
  };
  const cta = (c: Cta) => {
    ctas.push(c);
  };

  const ua = navigator.userAgent;
  const device = () => {
    const os = /Android/.test(ua) ? "android" : /iPhone|iPad|iPod/.test(ua) ? "ios" : /Windows/.test(ua) ? "windows"
      : /CrOS/.test(ua) ? "chromeos" : /Mac OS X/.test(ua) ? "mac" : /Linux/.test(ua) ? "linux" : "other";
    const browser = /SamsungBrowser/.test(ua) ? "samsung" : /EdgA?\/|EdgiOS/.test(ua) ? "edge" : /OPR\/|Opera/.test(ua) ? "opera"
      : /UCBrowser/.test(ua) ? "uc" : /Firefox|FxiOS/.test(ua) ? "firefox" : /CriOS|Chrome\//.test(ua) ? "chrome"
      : /Safari/.test(ua) ? "safari" : "other";
    const inApp = /WhatsApp/i.test(ua) ? "whatsapp" : /FBAN|FBAV|FB_IAB/.test(ua) ? "facebook" : /Instagram/.test(ua) ? "instagram"
      : /Snapchat/.test(ua) ? "snapchat" : /GSA\//.test(ua) ? "google" : /; wv\)/.test(ua) ? "webview" : undefined;
    return { os, browser, inApp, mobile: /Mobi|Android|iPhone|iPad/.test(ua) };
  };
  const geo = () => {
    const m = document.cookie.match(/(?:^|; )mdg_geo=([^;]*)/);
    if (!m) return undefined;
    try {
      const [country, region, city] = decodeURIComponent(m[1]).split("|");
      const g: Record<string, string> = {};
      if (country) g.country = country;
      if (region) g.region = region;
      if (city) g.city = city;
      return Object.keys(g).length ? g : undefined;
    } catch {
      return undefined;
    }
  };
  const refHost = () => {
    try {
      return document.referrer ? new URL(document.referrer).host || undefined : undefined;
    } catch {
      return undefined;
    }
  };

  /** The page-open beacon. Sent once: when play() answers, after 3 s, or on leaving, whichever is first. */
  const start = () => {
    if (started) return;
    started = true;
    autoplaySent = autoplay || "muted";
    const d = device();
    const n: Record<string, unknown> = {};
    if (net.effectiveType) n.type = net.effectiveType;
    if (net.saveData !== undefined) n.saveData = !!net.saveData;
    if (typeof net.downlink === "number") n.downlink = net.downlink;
    send("start", {
      ctx: {
        tag, from, ref: refHost(), lang: navigator.language, os: d.os, browser: d.browser, mobile: d.mobile,
        inApp: d.inApp, screen: [screen.width, screen.height], net: Object.keys(n).length ? n : undefined,
        geo: geo(), autoplay: autoplaySent,
      },
      muted: v.muted,
      startupMs,
    });
    if (startupMs !== undefined) startupSent = true;
  };
  /** play() has answered: open the view, or correct the guess the 'start' beacon made. */
  const outcome = (a: "muted" | "blocked") => {
    autoplay = a;
    if (!started) start();
    else if (a !== autoplaySent) beat();
  };
  setTimeout(start, 3000);

  /* ── the page's own controls ─────────────────────────────────────────── */
  const pp = $<HTMLButtonElement>("pp");
  const seek = $<HTMLInputElement>("seek");
  const timeEl = $("time");
  const chapEl = $("chap");
  const hdEl = $("hd");
  const muteBtn = $<HTMLButtonElement>("mute");
  const fsBtn = $<HTMLButtonElement>("fs");
  const waitBox = $("wait");
  const waitMsg = $("waitmsg");
  const loadMsg = $("loadmsg");
  const resume = $<HTMLButtonElement>("resume");
  const dur = () => (isFinite(v.duration) && v.duration > 0 ? v.duration : C.duration);
  const clock = (t: number) => {
    const s = Math.max(0, Math.floor(t));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };
  let dragging = false;
  let waitT = 0;
  let hideT = 0;
  const paint = () => {
    const d = dur();
    const t = dragging && seek ? Number(seek.value) : v.currentTime || 0;
    let b = t;
    for (let i = 0; i < v.buffered.length; i++) if (v.buffered.start(i) <= t + 0.5 && v.buffered.end(i) > b) b = v.buffered.end(i);
    const pc = (x: number) => `${d ? Math.min(100, (x / d) * 100) : 0}%`;
    if (seek) {
      if (!dragging) seek.value = String(t);
      seek.style.setProperty("--p", pc(t));
      seek.style.setProperty("--b", pc(b));
    }
    stage.style.setProperty("--q", String(d ? Math.min(1, t / d) : 0));
    if (timeEl) timeEl.textContent = `${clock(t)} / ${clock(d)}`;
  };
  const shown = () => stage.classList.contains("on");
  const hideUi = () => {
    if (v.paused || dragging) return;
    cls("on", false);
    lift(-4);
  };
  /** Bring the controls up; they go again after 3 s of playing, never while paused. */
  const showUi = (stay?: boolean) => {
    cls("on", true);
    lift(-5);
    window.clearTimeout(hideT);
    if (!stay) hideT = window.setTimeout(hideUi, 3000);
  };
  /** An overlay that owns the picture (end, error, tap-to-play) hides the controls. */
  const over = () => cls("over", !!((end && !end.hidden) || (errBox && !errBox.hidden) || (big && !big.hidden)));
  const unwait = () => {
    window.clearTimeout(waitT);
    if (waitBox) waitBox.hidden = true;
    cls("stall", false);
  };
  const fail = () => {
    if (errBox) errBox.hidden = false;
    if (load) load.hidden = true;
    unwait();
    over();
  };
  const markPlay = () => {
    cls("paused", v.paused);
    pp?.setAttribute("aria-label", v.paused ? "चलाएँ" : "रोकें");
    if (v.paused && firstFrame) showUi(true);
    else if (shown()) showUi();
  };
  const toggle = () => {
    if (v.paused || v.ended) v.play().catch(() => {});
    else v.pause();
  };
  const nudges = [$("nl"), $("nr")];
  const jump = (dt: number) => {
    v.currentTime = Math.max(0, Math.min(dur() - 0.3, (v.currentTime || 0) + dt));
    const el = nudges[dt < 0 ? 0 : 1];
    if (el) {
      el.classList.remove("go");
      void el.offsetWidth; // restart the animation on a second skip
      el.classList.add("go");
    }
    paint();
  };

  v.addEventListener("play", markPlay);
  v.addEventListener("pause", markPlay);
  v.addEventListener("pause", unwait);
  v.addEventListener("canplay", unwait);
  v.addEventListener("progress", paint);
  v.addEventListener("seeked", paint);
  v.addEventListener("timeupdate", () => {
    paint();
    if (!v.seeking && v.readyState > 2 && waitBox && !waitBox.hidden) unwait();
  });
  v.addEventListener("durationchange", () => {
    if (seek && isFinite(v.duration)) seek.max = String(v.duration);
  });
  // "HD" beside the clock once the picture is 720p or better
  v.addEventListener("resize", () => {
    if (hdEl) hdEl.hidden = v.videoHeight < 1280;
  });
  pp?.addEventListener("click", toggle);
  $("back")?.addEventListener("click", () => (jump(-10), showUi()));
  $("fwd")?.addEventListener("click", () => (jump(10), showUi()));
  muteBtn?.addEventListener("click", () => {
    if (v.muted || !v.volume) soundOn(unmutedAt === undefined);
    else v.muted = true;
    showUi();
  });
  if (seek) {
    const commit = () => {
      if (!dragging) return;
      dragging = false;
      v.currentTime = Number(seek.value);
      showUi();
    };
    seek.addEventListener("input", () => {
      dragging = true;
      showUi(true);
      paint();
    });
    seek.addEventListener("change", commit);
    seek.addEventListener("pointerup", commit);
    seek.addEventListener("touchend", commit);
  }
  const ticks = $("ticks");
  if (ticks && C.duration)
    C.chapters.forEach((c) => {
      if (c.t <= 0) return;
      const i = document.createElement("i");
      i.style.left = `${(c.t / C.duration) * 100}%`;
      ticks.appendChild(i);
    });

  /* full screen: the page's own frame where the browser allows it (Android,
     desktop), else the iPhone's own player */
  type FsDoc = Document & { webkitFullscreenElement?: Element | null; webkitExitFullscreen?: () => void };
  const doc = document as FsDoc;
  const st = stage as HTMLElement & { webkitRequestFullscreen?: () => void };
  const vv = v as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
  const isFs = () => !!(document.fullscreenElement || doc.webkitFullscreenElement);
  const fsChange = () => cls("fs", isFs());
  /** Out of full screen if in it; resolves either way. */
  const leaveFs = (): Promise<void> => {
    if (!isFs()) return Promise.resolve();
    if (document.exitFullscreen) return document.exitFullscreen().catch(() => {});
    if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
    return Promise.resolve();
  };
  document.addEventListener("fullscreenchange", fsChange);
  document.addEventListener("webkitfullscreenchange", fsChange);
  if (fsBtn) {
    if (!st.requestFullscreen && !st.webkitRequestFullscreen && !vv.webkitEnterFullscreen) fsBtn.hidden = true;
    fsBtn.addEventListener("click", () => {
      if (isFs()) leaveFs();
      else if (st.requestFullscreen) st.requestFullscreen({ navigationUI: "hide" }).catch(() => {});
      else if (st.webkitRequestFullscreen) st.webkitRequestFullscreen();
      else if (vv.webkitEnterFullscreen) vv.webkitEnterFullscreen();
      showUi();
    });
  }

  /* A tap on the picture: while the film has never had sound, it turns the
     sound on (people tap the film itself, not only the button). After that it
     shows or hides the controls, and two quick taps on the left or right third
     skip 10 s back or forward. Buttons and the bar handle their own taps. */
  let lastTap = 0;
  let lastSide = 0;
  let tapT = 0;
  stage.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    if (stage.classList.contains("over") || (t && t.closest && t.closest("button,a,input"))) return;
    if (v.muted && unmutedAt === undefined && !probing) {
      soundOn(true);
      if (firstFrame) showUi();
      return;
    }
    if (!firstFrame) return;
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const side = x < 0.35 ? -1 : x > 0.65 ? 1 : 0;
    const at = now();
    window.clearTimeout(tapT);
    if (side && side === lastSide && at - lastTap < 320) {
      lastTap = at;
      jump(side * 10);
      return;
    }
    lastTap = at;
    lastSide = side;
    const act = () => (shown() ? hideUi() : showUi());
    // a side tap waits a moment in case it is the first of two
    if (side) tapT = window.setTimeout(act, 250);
    else act();
  });
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target as HTMLElement;
    // typing a name or a number into the call-back form is not a command
    if (t && t.closest && t.closest("input:not(#seek),textarea,select,[contenteditable]")) return;
    const inCtl = !!(t && t.closest && t.closest("button,a,input"));
    const k = e.key;
    if ((k === " " || k === "k") && !inCtl) {
      e.preventDefault();
      toggle();
      showUi();
    } else if ((k === "ArrowLeft" || k === "ArrowRight") && t !== seek) {
      e.preventDefault();
      jump(k === "ArrowLeft" ? -10 : 10);
      showUi();
    } else if (k === "m") muteBtn?.click();
    else if (k === "f") fsBtn?.click();
  });

  /* ── where he left off (the full film only: 26 minutes is watched in pieces) ── */
  const posKey = `mdg_pos_${C.film}`;
  let saved = 0;
  let lastSave = 0;
  try {
    if (C.kind === "full") saved = Number(localStorage.getItem(posKey)) || 0;
  } catch {
    /* storage blocked: no resume */
  }
  const forget = () => {
    try {
      localStorage.removeItem(posKey);
    } catch {
      /* storage blocked */
    }
  };
  v.addEventListener("timeupdate", () => {
    if (C.kind !== "full" || !firstFrame) return;
    const t = v.currentTime;
    if (Math.abs(t - lastSave) < 5) return;
    lastSave = t;
    try {
      if (t > 20 && t < dur() - 30) localStorage.setItem(posKey, String(Math.floor(t)));
    } catch {
      /* storage blocked */
    }
  });
  const offerResume = () => {
    if (!resume || saved < 30 || saved > dur() - 30 || deep) return;
    const b = resume.querySelector("b");
    if (b) b.textContent = clock(saved);
    resume.hidden = false;
    window.setTimeout(() => (resume.hidden = true), 12000);
  };
  resume?.addEventListener("click", () => {
    resume.hidden = true;
    v.currentTime = saved;
    if (v.muted && unmutedAt === undefined) soundOn(false);
    else v.play().catch(() => {});
  });
  window.setTimeout(() => {
    if (!firstFrame && loadMsg) loadMsg.textContent = "इंटरनेट धीमा है, बस थोड़ी देर और…";
  }, 9000);

  /* ── watched ranges ──────────────────────────────────────────────────── */
  v.addEventListener("timeupdate", () => {
    markChapter();
    if (v.paused || v.seeking || stallAt !== null || !firstFrame) return;
    const t = v.currentTime;
    if (cur && t >= cur[1] && t - cur[1] <= 1.5) {
      acc += t - cur[1];
      cur[1] = t;
    } else {
      closeRange();
      cur = [t, t];
    }
    if (acc >= 10) beat();
  });
  v.addEventListener("seeking", closeRange);
  v.addEventListener("pause", closeRange);

  const onFirstFrame = () => {
    if (firstFrame) return;
    firstFrame = true;
    startupMs = Math.max(0, Math.round(now() - clock0));
    // the view was already opened while the film was loading: report the wait now
    if (started) beat();
    if (load) load.hidden = true;
    cls("live", true);
    offerResume();
  };
  v.addEventListener("playing", () => {
    if (stallAt !== null) {
      rebufferMs += now() - stallAt;
      stallAt = null;
    }
    onFirstFrame();
    // open a range at the playhead now, so the first fraction of a second is not lost
    if (!cur && !v.seeking) cur = [v.currentTime, v.currentTime];
    if (big) big.hidden = true;
    if (end) end.hidden = true;
    over();
    unwait();
  });
  v.addEventListener("waiting", () => {
    // a stall after the first frame; waiting caused by a seek is not a rebuffer
    if (firstFrame && !v.seeking && stallAt === null) {
      rebuffers++;
      stallAt = now();
      onStall();
    }
    if (firstFrame) {
      clearTimeout(waitT);
      waitT = setTimeout(() => {
        if (waitMsg) waitMsg.textContent = navigator.onLine === false ? "इंटरनेट बंद है, जुड़ते ही चलेगी" : "रुकिए…";
        if (waitBox) waitBox.hidden = false;
        cls("stall", true);
      }, 700);
    }
  });
  v.addEventListener("ended", () => {
    ended = true;
    if (end) end.hidden = false;
    over();
    // the end card's next steps lead below the picture, which full screen hides
    leaveFs();
    forget();
    flushEnd();
  });
  addEventListener("pagehide", flushEnd);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushEnd();
  });

  /* ── captions ────────────────────────────────────────────────────────── */
  const track = v.textTracks[0];
  const ccBtns = document.querySelectorAll<HTMLButtonElement>("[data-cc]");
  const captions = (on: boolean) => {
    if (track) track.mode = on ? "showing" : "hidden";
    ccBtns.forEach((b) => b.setAttribute("aria-pressed", String((b.dataset.cc === "1") === on)));
  };
  // keep every cue clear of the film's own words low in the frame, and a line
  // higher while the controls are up
  const trackEl = v.querySelector("track");
  let cueLine = -4;
  const lift = (n?: number) => {
    if (n !== undefined) cueLine = n;
    const cues = track && track.cues;
    if (!cues) return;
    for (let i = 0; i < cues.length; i++) {
      const c = cues[i] as VTTCue;
      if ("line" in c) c.line = cueLine;
    }
  };
  trackEl?.addEventListener("load", () => lift());
  lift();
  captions(true);
  ccBtns.forEach((b) => b.addEventListener("click", () => captions(b.dataset.cc === "1")));

  /* ── sound ───────────────────────────────────────────────────────────── */
  const soundOn = (fromTap: boolean) => {
    if (unmutedAt === undefined) {
      unmutedAt = r2(v.currentTime || 0);
      if (fromTap && v.currentTime < 15) {
        v.currentTime = 0;
        restarted = true;
      }
      captions(false);
    }
    v.muted = false;
    if (!v.volume) v.volume = 1;
    if (snd) snd.hidden = true;
    v.play().catch(() => {});
  };
  snd?.addEventListener("click", () => soundOn(true));
  /* the start-up probe for sound flips `muted` itself; that is not the viewer */
  let probing = false;
  v.addEventListener("volumechange", () => {
    cls("mut", v.muted || !v.volume);
    if (probing) return;
    if (!v.muted && v.volume > 0) soundOn(false);
    // the gold "sound on" pill is for a film that has never had sound; a viewer
    // who muted it himself only sees the speaker icon change
    else if (snd && firstFrame && unmutedAt === undefined) snd.hidden = false;
  });

  /* ── speed ───────────────────────────────────────────────────────────── */
  const chips = document.querySelectorAll<HTMLButtonElement>("[data-rate]");
  const markRate = () =>
    chips.forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.rate) === v.playbackRate)));
  chips.forEach((b) =>
    b.addEventListener("click", () => {
      v.playbackRate = Number(b.dataset.rate) || 1;
      cta("speed");
    }),
  );
  v.addEventListener("ratechange", markRate);

  /* ── chapters ────────────────────────────────────────────────────────── */
  const chBtns = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-t]"));
  let chOn = -1;
  const markChapter = () => {
    if (!chBtns.length || !v) return;
    let i = -1;
    for (let k = 0; k < chBtns.length; k++) if (Number(chBtns[k].dataset.t) <= v.currentTime + 0.25) i = k;
    if (i === chOn) return;
    if (chOn >= 0) chBtns[chOn].removeAttribute("aria-current");
    if (i >= 0) chBtns[i].setAttribute("aria-current", "true");
    chOn = i;
    const ch = C.chapters[i];
    // the name only: the film's own cards number its acts differently
    if (chapEl) chapEl.textContent = ch && i > 0 ? ch.title : "";
  };
  chBtns.forEach((b) =>
    b.addEventListener("click", () => {
      v.currentTime = Number(b.dataset.t) || 0;
      if (v.muted && unmutedAt === undefined) soundOn(false);
      else v.play().catch(() => {});
      cta("chapter");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }),
  );

  /* ── end screen ──────────────────────────────────────────────────────── */
  $("replay")?.addEventListener("click", () => {
    cta("replay");
    ended = false;
    if (end) end.hidden = true;
    over();
    v.currentTime = 0;
    v.play().catch(() => {});
  });
  fullLinks.forEach((a) => a.addEventListener("click", () => cta("full")));
  document.querySelectorAll<HTMLAnchorElement>("a[data-reg]").forEach((a) =>
    a.addEventListener("click", (e) => {
      cta("register");
      // "join" on the end card drops to the ways in below the picture: leave
      // full screen first, or the jump happens behind it and the tap looks dead
      if (a.getAttribute("href") === "#next" && isFs()) {
        e.preventDefault();
        leaveFs().then(() => $("next")?.scrollIntoView({ behavior: "smooth", block: "start" }));
      }
    }),
  );
  $("retry")?.addEventListener("click", () => location.reload());
  document.querySelectorAll("a[data-wa]").forEach((a) =>
    a.addEventListener("click", () => {
      cta("share");
      beat();
    }),
  );

  /* ── "we call you": straight to the team's inbox, with the share code ───── */
  const cb = $<HTMLFormElement>("cb");
  const cbMsg = $("cbmsg");
  if (cb) {
    const say = (t: string, ok: boolean) => {
      if (!cbMsg) return;
      cbMsg.textContent = t;
      cbMsg.className = ok ? "msg ok" : "msg";
    };
    cb.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(cb);
      const val = (k: string) => String(f.get(k) || "").trim();
      const name = val("name");
      // spaces and dashes are how people type numbers; the inbox wants digits
      const phone = val("phone").replace(/[\s-]/g, "");
      if (!name || !/^\+?\d{10,13}$/.test(phone)) {
        say("अपना नाम और 10 अंकों का मोबाइल नंबर भरें।", false);
        return;
      }
      const btn = cb.querySelector("button");
      if (btn) btn.disabled = true;
      say("भेज रहे हैं…", true);
      fetch("/api/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, outlet: val("outlet"), message: `फ़िल्म: ${C.title}`, source: "film", ref: tag }),
      })
        .then((r) => {
          if (!r.ok) throw new Error(String(r.status));
          cb.classList.add("done");
          say("धन्यवाद! हमारी टीम जल्द ही आपको कॉल करेगी।", true);
          // counted with the other ways of joining: the film's tally knows six kinds of tap
          cta("register");
          beat();
        })
        .catch(() => {
          if (btn) btn.disabled = false;
          say("भेज नहीं पाए। इंटरनेट देखकर फिर कोशिश करें।", false);
        });
    });
  }

  /* ── playback ────────────────────────────────────────────────────────── */
  const deep = Number((location.hash.match(/t=(\d+(?:\.\d+)?)/) || [])[1]) || 0;
  /* Sound first: a browser lets a page play with sound when the visitor has
     played media on this site before (desktop Chrome's engagement score, an
     installed app). Most first visits from a WhatsApp link are refused, and then
     the film starts muted, which every browser allows. A tap is the only other
     way to sound; a tap on the link in WhatsApp does not count. */
  const mutedStart = () => {
    v.muted = true;
    probing = false;
    const p = v.play();
    if (!p || !p.then) return outcome("muted");
    p.then(
      () => outcome("muted"),
      (e: { name?: string }) => {
        if (e && e.name === "NotAllowedError") {
          outcome("blocked");
          if (snd) snd.hidden = true;
          if (big) big.hidden = false;
          if (load) load.hidden = true;
          over();
        } else outcome("muted");
      },
    );
  };
  const tryPlay = () => {
    probing = true;
    v.muted = false;
    let p: Promise<void> | undefined;
    try {
      p = v.play();
    } catch {
      return mutedStart();
    }
    if (!p || !p.then) return mutedStart();
    p.then(
      () => {
        // it played with sound: count it as sound on from the first second
        probing = false;
        outcome("muted");
        soundOn(false);
      },
      (e: { name?: string }) => (e && e.name === "NotAllowedError" ? mutedStart() : ((probing = false), outcome("muted"))),
    );
  };
  big?.addEventListener("click", () => {
    // a tap lets the browser play with sound, so start the film properly
    big.hidden = true;
    over();
    if (load && !firstFrame) load.hidden = false;
    clock0 = now();
    unmutedAt = r2(v.currentTime || 0);
    captions(false);
    v.muted = false;
    if (snd) snd.hidden = true;
    v.play().catch(() => {});
  });
  if (snd) snd.hidden = false;
  v.addEventListener("error", () =>
    // hls.js recovers most media errors by itself: only a lasting one is shown
    window.setTimeout(() => {
      if (v.error && v.paused) fail();
    }, 2000),
  );

  /* ── picture quality: sharp from the first frame ─────────────────────────
     The film starts on the 720p rung wherever the network can carry it (it
     used to start on 540p and sharpen after the first 4 s segment, which read
     as "it plays blurry"). A slower link starts on 540p or 360p. Once playing,
     the automatic choice is held one rung below the start and only lets go of
     that after the film has actually stalled. Chrome's "3g" also means a slow
     round trip on a fast link (common on Indian mobile data), so the measured
     speed decides wherever the browser reports one. */
  const lite = !!net.saveData || /(^|-)2g$/.test(net.effectiveType || "");
  const dl = typeof net.downlink === "number" && net.downlink > 0 ? net.downlink : 0;
  const tier = lite ? 640 : dl ? (dl >= 2 ? 1280 : dl >= 1 ? 960 : 640) : net.effectiveType === "3g" ? 960 : 1280;
  let onStall = () => {};
  const qBtns = document.querySelectorAll<HTMLButtonElement>("[data-q]");
  let qPref = "auto";
  try {
    qPref = localStorage.getItem("mdg_q") || "auto";
  } catch {
    /* storage blocked */
  }
  let applyQ: (q: string) => void = () => {};
  const markQ = () => qBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.q === qPref)));
  qBtns.forEach((b) =>
    b.addEventListener("click", () => {
      qPref = b.dataset.q || "auto";
      try {
        localStorage.setItem("mdg_q", qPref);
      } catch {
        /* storage blocked */
      }
      markQ();
      applyQ(qPref);
    }),
  );
  markQ();

  const seekDeep = () => {
    if (deep && deep < C.duration) v.currentTime = deep;
  };
  const nativeHls = !!v.canPlayType("application/vnd.apple.mpegurl");
  const mse = !!(window.MediaSource || (window as unknown as { ManagedMediaSource?: unknown }).ManagedMediaSource);
  const phone = matchMedia("(pointer: coarse)").matches;
  const apple = /Apple/.test(navigator.vendor || "");
  const P = C.playlists;
  /** Safari starts on the first rung listed: give it the list for this network. */
  const nativeSrc = () =>
    media(nativeHls ? (P ? (tier === 640 ? P.lite : tier === 960 ? P.sd : P.hd) : C.hls) : C.mp4);
  // Chrome (desktop and Android) says it plays HLS itself, but its own player
  // opens on the smallest rung whatever the list says (240p measured) and on
  // Android climbs to 1080p, about twice the data of 720p. So every browser
  // with MediaSource goes through hls.js, which starts where it is told and can
  // be held below 1080p. Safari keeps its own player, which honours the list.
  // Data saver and 2G keep the browser's player too: there the one-time hls.js
  // download (about 120 kB) would push the first frame back by seconds
  // (9 s -> 15 s measured at 250 kbps).
  const viaHlsJs = mse && !lite && !(nativeHls && apple);
  /** The browser's own player: native HLS where it has it, else the 540p mp4. */
  const plain = () => {
    v.addEventListener("loadedmetadata", seekDeep, { once: true });
    v.src = nativeSrc();
    tryPlay();
  };
  if (!viaHlsJs) plain();
  else {
    const s = document.createElement("script");
    s.src = C.hlsJs;
    s.onload = () => {
      const Hls = (window as unknown as { Hls?: typeof HlsType }).Hls;
      if (!Hls || !Hls.isSupported()) return plain();
      // until it has measured the link itself, hls.js assumes what the browser said
      const est = dl ? dl * 1e6 : tier === 1280 ? 3e6 : 1e6;
      const hls = new Hls({ capLevelToPlayerSize: true, autoStartLoad: false, abrEwmaDefaultEstimate: est });
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // phones never fetch the 1080p rung: the dealer's data matters more
        if (phone) {
          for (let i = hls.levels.length - 1; i >= 0; i--) if (hls.levels[i].height > 1280) hls.removeLevel(i);
        }
        const at = (h: number) => hls.levels.findIndex((l) => l.height === h);
        const floor = (h: number) => {
          const l = hls.levels[at(h)];
          hls.config.minAutoBitrate = l ? l.maxBitrate : 0;
        };
        const want = qPref === "lite" ? 640 : qPref === "hd" ? 1280 : tier;
        if (at(want) >= 0) hls.startLevel = at(want);
        if (qPref !== "auto" && at(want) >= 0) hls.loadLevel = at(want);
        // held one rung below the start (360p at the least) until a real stall,
        // and each stall lowers that one step more
        let low = tier === 1280 ? 960 : 640;
        floor(low);
        onStall = () => {
          low = low > 640 ? 640 : 0;
          floor(low);
        };
        applyQ = (q) => {
          hls.nextLevel = q === "hd" ? at(1280) : q === "lite" ? at(640) : -1;
        };
        const qRow = $("qual");
        if (qRow) qRow.hidden = false;
        hls.startLoad(deep && deep < C.duration ? deep : -1);
      });
      hls.on(Hls.Events.ERROR, (_e, d) => {
        if (!d.fatal) return;
        if (d.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
        else if (d.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
        else {
          hls.destroy();
          v.src = nativeSrc();
          v.play().catch(() => {});
        }
      });
      hls.loadSource(media(C.hls));
      hls.attachMedia(v);
      tryPlay();
    };
    s.onerror = plain;
    document.head.appendChild(s);
  }
  markRate();
})();
