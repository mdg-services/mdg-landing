/**
 * The film watch page's whole runtime: playback that starts at once (muted,
 * with Hindi captions carrying the words), the sound-on tap, speed chips,
 * chapters, the end screen, and the view measurement.
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
  const snd = $<HTMLButtonElement>("snd");
  const big = $<HTMLButtonElement>("big");
  const end = $("end");
  const cc = $<HTMLButtonElement>("cc");
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
  const fullLink = $<HTMLAnchorElement>("full");
  if (fullLink) fullLink.href = withTag("/film", "from=short");

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
  });
  v.addEventListener("waiting", () => {
    // a stall after the first frame; waiting caused by a seek is not a rebuffer
    if (firstFrame && !v.seeking && stallAt === null) {
      rebuffers++;
      stallAt = now();
    }
  });
  v.addEventListener("ended", () => {
    ended = true;
    if (end) end.hidden = false;
    flushEnd();
  });
  addEventListener("pagehide", flushEnd);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushEnd();
  });

  /* ── captions ────────────────────────────────────────────────────────── */
  const track = v.textTracks[0];
  const captions = (on: boolean) => {
    if (track) track.mode = on ? "showing" : "hidden";
    cc?.setAttribute("aria-pressed", String(on));
  };
  // lift every cue above the native control bar
  const trackEl = v.querySelector("track");
  const lift = () => {
    const cues = track && track.cues;
    if (!cues) return;
    for (let i = 0; i < cues.length; i++) {
      const c = cues[i] as VTTCue;
      if ("line" in c) c.line = -4;
    }
  };
  trackEl?.addEventListener("load", lift);
  lift();
  captions(true);
  cc?.addEventListener("click", () => captions(track ? track.mode !== "showing" : false));

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
  v.addEventListener("volumechange", () => {
    if (!v.muted && v.volume > 0) soundOn(false);
    else if (snd && firstFrame) snd.hidden = false;
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
  };
  chBtns.forEach((b) =>
    b.addEventListener("click", () => {
      v.currentTime = Number(b.dataset.t) || 0;
      v.play().catch(() => {});
      cta("chapter");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }),
  );

  /* ── end screen ──────────────────────────────────────────────────────── */
  $("replay")?.addEventListener("click", () => {
    cta("replay");
    ended = false;
    v.currentTime = 0;
    v.play().catch(() => {});
  });
  fullLink?.addEventListener("click", () => cta("full"));
  $("reg")?.addEventListener("click", () => cta("register"));
  document.querySelectorAll("a[data-wa]").forEach((a) =>
    a.addEventListener("click", () => {
      cta("share");
      beat();
    }),
  );

  /* ── playback ────────────────────────────────────────────────────────── */
  const deep = Number((location.hash.match(/t=(\d+(?:\.\d+)?)/) || [])[1]) || 0;
  const tryPlay = () => {
    const p = v.play();
    if (!p || !p.then) return outcome("muted");
    p.then(
      () => outcome("muted"),
      (e: { name?: string }) => {
        if (e && e.name === "NotAllowedError") {
          outcome("blocked");
          if (snd) snd.hidden = true;
          if (big) big.hidden = false;
        } else outcome("muted");
      },
    );
  };
  big?.addEventListener("click", () => {
    // a tap lets the browser play with sound, so start the film properly
    big.hidden = true;
    clock0 = now();
    unmutedAt = r2(v.currentTime || 0);
    captions(false);
    v.muted = false;
    if (snd) snd.hidden = true;
    v.play().catch(() => {});
  });
  if (snd) snd.hidden = false;

  const seekDeep = () => {
    if (deep && deep < C.duration) v.currentTime = deep;
  };
  const nativeHls = !!v.canPlayType("application/vnd.apple.mpegurl");
  const mse = !!(window.MediaSource || (window as unknown as { ManagedMediaSource?: unknown }).ManagedMediaSource);
  const phone = matchMedia("(pointer: coarse)").matches;
  const slow = !!net.saveData || /(^|-)2g$/.test(net.effectiveType || "");
  // Android Chrome says it plays HLS itself, but its own player climbs to the
  // 1080p rung (about twice the data of 720p) and cannot be held below it. So a
  // phone with MediaSource goes through hls.js, which can. iPhones have no
  // MediaSource and keep Safari's player. On a slow link (Chrome reports up to
  // ~700 kbps as "3g") or data saver the browser's own player is kept: it
  // already picks a small rung there, and the one-time hls.js download (about
  // 120 kB) would push the first frame back by seconds (9 s -> 15 s measured at
  // 250 kbps).
  const viaHlsJs = mse && (!nativeHls || (phone && !slow && net.effectiveType !== "3g" && !!window.MediaSource));
  /** The browser's own player: native HLS where it has it, else the 540p mp4. */
  const plain = () => {
    v.addEventListener("loadedmetadata", seekDeep, { once: true });
    v.src = media(nativeHls ? C.hls : C.mp4);
    tryPlay();
  };
  if (!viaHlsJs) plain();
  else {
    const s = document.createElement("script");
    s.src = C.hlsJs;
    s.onload = () => {
      const Hls = (window as unknown as { Hls?: typeof HlsType }).Hls;
      if (!Hls || !Hls.isSupported()) return plain();
      const hls = new Hls({ capLevelToPlayerSize: true, autoStartLoad: false });
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // phones never fetch the 1080p rung: the dealer's data matters more
        if (phone) {
          for (let i = hls.levels.length - 1; i >= 0; i--) if (hls.levels[i].height > 1280) hls.removeLevel(i);
        }
        const want = slow ? 426 : net.effectiveType === "3g" ? 640 : 960;
        const at = hls.levels.findIndex((l) => l.height === want);
        if (at >= 0) hls.startLevel = at;
        hls.startLoad(deep && deep < C.duration ? deep : -1);
      });
      hls.on(Hls.Events.ERROR, (_e, d) => {
        if (!d.fatal) return;
        if (d.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
        else if (d.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
        else {
          hls.destroy();
          v.src = media(nativeHls ? C.hls : C.mp4);
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
