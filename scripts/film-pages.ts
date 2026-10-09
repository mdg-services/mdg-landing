/**
 * Builds the two film watch pages, /film and /film/short, as plain static
 * HTML with their CSS and JS inlined, plus a self-hosted copy of hls.js that
 * only browsers without native HLS ever fetch.
 *
 * Not part of the React app: a dealer on a cheap phone on 2G should see the
 * poster and the first seconds of the film before the SPA would even have
 * downloaded. Budget: HTML + inline CSS/JS <= 15 kB gzipped per page.
 *
 * Updating a film = package a new version (marketing/films/web/package.mjs),
 * paste its film.json into src/film/films.json, rebuild, deploy. A film whose
 * version is still null renders a "coming soon" page instead of a player.
 *
 * The beacon endpoint comes from FILM_BEACON_URL at build time (defaults to
 * production); point it at a local stub to test.
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { minify, transformWithOxc } from "vite";

type FilmId = "kavach" | "kavach-short";
interface FilmJson {
  film: FilmId;
  title: string;
  version: string | null;
  duration?: number;
  base?: string;
  hls?: string;
  /** master playlists for the browser's own player, by network: 720p / 540p / 360p first */
  playlists?: { hd: string; sd: string; lite: string };
  mp4?: string;
  poster?: string;
  captions?: string;
  chapters?: Array<{ t: number; title: string }>;
  ladder?: number[];
}
export interface FilmPageFile {
  fileName: string;
  source: string;
}

const SITE = "https://mdgservices.in";
const MEDIA_ORIGIN = "https://mdg-films.s3.ap-south-1.amazonaws.com";
const DEFAULT_BEACON = "https://api.mdgservices.in/api/v1/films/beacon";
/** The Dealer Kavach app; its sign-in screen opens the same enrolment form as /register. */
const PLAY_URL = "https://play.google.com/store/apps/details?id=in.mdgservices.dealerkavach";
/** Same number as src/lib/tollFree.ts; this script is not part of the app, so it is not imported. */
const TOLL_FREE_TEL = "tel:18008913496";

/* What each page says about its film. Outcomes only. */
const PAGES: Record<FilmId, { path: string; kind: "full" | "short"; desc: (fullMin: number) => string; og: string; soon: string }> = {
  kavach: {
    path: "/film",
    kind: "full",
    desc: (m) => `पंप का रोज़ का काग़ज़ी काम — समय पर, बिना भागदौड़। ${m} मिनट की फ़िल्म।`,
    og: "/film/og-kavach.jpg",
    soon: "पूरी फ़िल्म यहाँ बहुत जल्द आएगी।",
  },
  "kavach-short": {
    path: "/film/short",
    kind: "short",
    desc: () => "डीलर कवच आपके पंप के लिए क्या करता है — 40 सेकंड में देखिए।",
    og: "/film/og-kavach-short.jpg",
    soon: "डीलर कवच की 40 सेकंड की फ़िल्म यहाँ बहुत जल्द आएगी। तब तक पूरी फ़िल्म देखिए।",
  },
};

const ICON = {
  sound:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/></svg>',
  muted:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm11.3.7 1.4-1.4 2.3 2.3 2.3-2.3 1.4 1.4-2.3 2.3 2.3 2.3-1.4 1.4-2.3-2.3-2.3 2.3-1.4-1.4 2.3-2.3z"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.5 4.5h4v15h-4zm7 0h4v15h-4z"/></svg>',
  fs: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 9V4h5v2H6v3zm11-5h5v5h-2V6h-3zM4 15h2v3h3v2H4zm14 0h2v5h-5v-2h3z"/></svg>',
  unfs: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4h2v5H4V7h3zm8 0h2v3h3v2h-5zM4 15h5v5H7v-3H4zm11 0h5v2h-3v3h-2z"/></svg>',
  replay:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 5V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.7 7.4c.3-.5.6-.5.9-.5h.6c.2 0 .5 0 .7.5l.9 2.1c.1.2.1.4 0 .6l-.6.8c-.2.2-.2.4 0 .7.6 1 1.4 1.8 2.4 2.4.3.2.5.1.7 0l.8-.9c.2-.2.4-.2.6-.1l2 1c.3.1.4.3.4.5 0 .6-.2 1.3-.7 1.7-.6.5-1.5.8-2.5.5-1.3-.4-3-1.2-4.4-2.7-1.5-1.5-2.3-3-2.6-4.2-.2-.9 0-1.8.4-2.4z" fill="currentColor"/></svg>',
  phone:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>',
  app: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 3v14h10V5zm4 2h2v5h2l-3 3-3-3h2z"/></svg>',
  form: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1.5V8h4.5zM7 12v2h10v-2zm0 4v2h7v-2z"/></svg>',
  talk: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm4 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm4 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm4 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>',
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/** a 10-second skip: the replay arrow, mirrored for forward, with the number inside */
const skip = (id: string, dir: -1 | 1) =>
  `<button type="button" class="sk" id="${id}" aria-label="10 सेकंड ${dir < 0 ? "पीछे" : "आगे"}"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"${dir > 0 ? ' style="transform:scaleX(-1)"' : ""}><path d="M12 5V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z"/></svg><span>10</span></button>`;
const seg = (label: string, id: string, items: Array<[string, string, string]>, hidden = false) =>
  `<div class="set" id="${id}"${hidden ? " hidden" : ""}><span>${label}</span><div class="seg" role="group" aria-label="${label}">${items
    .map(([attr, val, text]) => `<button type="button" ${attr}="${val}" aria-pressed="false">${text}</button>`)
    .join("")}</div></div>`;
const mmss = (t: number) => {
  const s = Math.floor(t);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
const minifyCss = (css: string) =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();

async function playerJs(root: string): Promise<string> {
  const file = path.join(root, "src/film/player.ts");
  // es2018: phones a few Chrome versions old still run it (no ?. or ??), and
  // object spread stays native so no runtime helper import sneaks in
  const ts = await transformWithOxc(readFileSync(file, "utf8"), file, { target: "es2018" });
  const out = await minify("player.js", ts.code, { compress: { target: "es2018" }, mangle: true });
  if (out.errors?.length) throw new Error(`film player minify: ${JSON.stringify(out.errors[0])}`);
  // the type-only import makes the source a module; the empty marker it leaves is dropped
  const code = out.code.replace(/export\s*\{\s*\};?\s*$/, "");
  if (/(^|[;\s])(import|export)[\s{"'*]/.test(code)) throw new Error("film player: output must be a plain script, found import/export");
  // never let the inline script close its own <script> element
  return code.replace(/<\/script/gi, "<\\/script").trim();
}

function hlsJs(root: string): { fileName: string; source: string } {
  const req = createRequire(path.join(root, "package.json"));
  const pkg = JSON.parse(readFileSync(req.resolve("hls.js/package.json"), "utf8")) as { version: string };
  const src = readFileSync(req.resolve("hls.js/dist/hls.light.min.js"), "utf8").replace(/\n\/\/# sourceMappingURL=.*$/m, "");
  return { fileName: `film/hls-${pkg.version}.js`, source: src };
}

export async function buildFilmPages(opts: { root: string; beaconUrl?: string }): Promise<FilmPageFile[]> {
  const { root } = opts;
  const beacon = opts.beaconUrl || process.env.FILM_BEACON_URL || DEFAULT_BEACON;
  const films = JSON.parse(readFileSync(path.join(root, "src/film/films.json"), "utf8")) as Record<FilmId, FilmJson>;
  const css = minifyCss(readFileSync(path.join(root, "src/film/page.css"), "utf8"));
  const js = await playerJs(root);
  const hls = hlsJs(root);
  const fullMin = Math.round((films.kavach.duration || 0) / 60);

  const files: FilmPageFile[] = [hls];
  for (const id of Object.keys(PAGES) as FilmId[]) {
    const f = films[id];
    const p = PAGES[id];
    const live = !!(f && f.version && f.base && f.duration);
    const html = page({ f, p, live, css, js, beacon, hlsSrc: `/${hls.fileName}`, fullMin, peek: peek(films.kavach) });
    files.push({ fileName: `${p.path.slice(1)}/index.html`, source: html });
  }
  return files;
}

/** What the short's end screen promises is in the full film: four of its own chapter names. */
function peek(full: FilmJson): string[] {
  const ch = full.chapters || [];
  return [1, 2, 3, 7].map((i) => ch[i] && ch[i].title).filter((t): t is string => !!t);
}

/** gzipped byte size of each generated page, for the build log. */
export function pageSizes(files: FilmPageFile[]): string {
  return files
    .filter((f) => f.fileName.endsWith(".html"))
    .map((f) => `${f.fileName} ${(Buffer.byteLength(f.source) / 1024).toFixed(1)} kB, ${(gzipSync(f.source, { level: 9 }).length / 1024).toFixed(1)} kB gz`)
    .join("; ");
}

function page(a: {
  f: FilmJson;
  p: (typeof PAGES)[FilmId];
  live: boolean;
  css: string;
  js: string;
  beacon: string;
  hlsSrc: string;
  fullMin: number;
  peek: string[];
}): string {
  const { f, p, live, css, js } = a;
  const url = SITE + p.path;
  const desc = p.desc(a.fullMin);
  const poster = live ? `${f.base}/${f.poster}` : "";
  const head = `<!doctype html><html lang="hi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(f.title)} · MDG Services</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#101133">
<link rel="icon" type="image/png" href="/film/mark.png">
<meta property="og:type" content="video.other">
<meta property="og:site_name" content="MDG Services">
<meta property="og:title" content="${esc(f.title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}${p.og}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="hi_IN">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(f.title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${SITE}${p.og}">
${live ? `<link rel="preconnect" href="${MEDIA_ORIGIN}" crossorigin>\n<link rel="preload" as="image" href="${poster}" crossorigin="anonymous" fetchpriority="high">\n` : ""}<style>${css}</style>
</head><body>
<header><a href="/" aria-label="MDG Services"><img src="/film/mark.png" width="32" height="32" alt=""></a><div><h1>${esc(f.title)}</h1><p>${esc(desc)}</p></div></header>
<main>`;
  const foot = `<footer><a href="/">mdgservices.in</a> · <a href="/privacy">गोपनीयता</a></footer>`;

  if (!live) {
    // the film is still being made: a calm placeholder, and the way to the full film
    return `${head}
<div class="stage"><div class="soon"><img src="/film/mark.png" width="72" height="72" alt=""><b>जल्द आ रहा है</b><p>${esc(p.soon)}</p>${p.kind === "short" ? `<a class="btn pri" id="full" href="/film">पूरी फ़िल्म देखें (${a.fullMin} मिनट) →</a>` : ""}</div></div>
${foot}</main>
<script>(function(){var a=document.getElementById("full"),r=new URLSearchParams(location.search).get("r");if(a&&r&&/^[A-Za-z0-9_-]{1,32}$/.test(r))a.href="/film?r="+r})()</script>
</body></html>
`;
  }

  const cfg = {
    film: f.film, title: f.title, duration: f.duration, base: f.base, hls: f.hls, playlists: f.playlists, mp4: f.mp4,
    captions: f.captions, chapters: f.chapters || [], beacon: a.beacon, hlsJs: a.hlsSrc, url, kind: p.kind,
  };
  const wa = (cls: string, text: string) =>
    `<a class="${cls}" data-wa href="https://wa.me/" target="_blank" rel="noopener">${ICON.wa}${text}</a>`;
  const fullBtn = (cls: string) =>
    `<a class="${cls}" data-full href="/film?from=short">${ICON.play}पूरी फ़िल्म देखें · ${a.fullMin} मिनट</a>`;
  // "join" no longer leaves the page: it drops to the ways of joining below the picture
  const regBtn = (cls: string) => `<a class="${cls}" data-reg href="#next">डीलर कवच से जुड़ें</a>`;
  const way = (href: string, icon: string, title: string, sub: string, ext = false) =>
    `<a class="way" data-reg href="${href}"${ext ? ' target="_blank" rel="noopener"' : ""}>${icon}<div><b>${title}</b><span>${sub}</span></div></a>`;
  // The ways in, most-asked first. The callback goes to the team's inbox with the
  // share code, so a dealer who came from a personal WhatsApp link is known by it.
  const next = `<section class="next" id="next"><h2>आगे क्या करें?</h2>
<form class="cb" id="cb" novalidate><b>हम आपको कॉल करें</b><p>नाम और मोबाइल नंबर छोड़िए — हमारी टीम आपको कॉल करेगी।</p>
<input name="name" autocomplete="name" placeholder="आपका नाम" aria-label="आपका नाम" maxlength="120" required>
<input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="मोबाइल नंबर" aria-label="मोबाइल नंबर" maxlength="16" required>
<input name="outlet" placeholder="पंप का नाम (ज़रूरी नहीं)" aria-label="पंप का नाम" maxlength="160">
<input name="website" tabindex="-1" autocomplete="off" hidden>
<button type="submit" class="btn pri">${ICON.phone}मुझे कॉल करें</button><p class="msg" id="cbmsg" role="status" aria-live="polite"></p></form>
<div class="ways">${way(TOLL_FREE_TEL, ICON.phone, "टोल-फ़्री नंबर पर कॉल करें", "1800-891-3496 · सुबह 9 से रात 9, हर दिन")}${way(PLAY_URL, ICON.app, "ऐप डाउनलोड करें", "Google Play से डीलर कवच ऐप लें, उसी में रजिस्टर करें", true)}${way("/register?lang=hi", ICON.form, "वेबसाइट पर रजिस्टर करें", "दो मिनट का फ़ॉर्म")}${way("/?call=1&amp;lang=hi", ICON.talk, "वेबसाइट पर बात करें", "हमारे सहायक से बोलकर पूछें — फ़ोन की ज़रूरत नहीं")}</div></section>`;
  // the short ends on what the full film holds; the full film on the next step
  const endBody =
    p.kind === "short"
      ? `<p class="k">पूरी फ़िल्म में</p><ul class="peek">${a.peek.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>${fullBtn("btn pri")}`
      : `<img src="/film/mark.png" width="56" height="56" alt=""><p class="k">देखने के लिए धन्यवाद</p><b>अपने पंप के लिए डीलर कवच शुरू करें</b>${regBtn("btn pri")}`;
  const chapters = (f.chapters || []).length
    ? `<section class="ch"><h2>अध्याय</h2><ol>${(f.chapters || [])
        .map((c) => `<li><button type="button" data-t="${c.t}"><span>${mmss(c.t)}</span>${esc(c.title)}</button></li>`)
        .join("")}</ol></section>`
    : "";
  return `${head}
<div class="stage" id="stage">
<video id="v" playsinline preload="auto" controls crossorigin="anonymous" poster="${poster}"><track kind="captions" srclang="hi" label="हिन्दी" default src="${f.base}/${f.captions}"></video>
<div class="load" id="load" hidden><b id="loadmsg">फ़िल्म साफ़ तस्वीर में आ रही है</b><i></i></div>
<div class="ui" id="ui">
<div class="mid">${skip("back", -1)}<button type="button" class="pp" id="pp" aria-label="रोकें">${ICON.pause}${ICON.play}</button>${skip("fwd", 1)}</div>
<div class="low"><p class="now" id="chap"></p><div class="row"><span class="time" id="time">0:00 / ${mmss(f.duration || 0)}</span><span class="hd" id="hd" hidden>HD</span><button type="button" class="ic" id="mute" aria-label="आवाज़">${ICON.sound}${ICON.muted}</button><button type="button" class="ic" id="fs" aria-label="पूरी स्क्रीन">${ICON.fs}${ICON.unfs}</button></div>
<div class="seek"><div class="ticks" id="ticks"></div><input type="range" id="seek" min="0" max="${f.duration}" step="0.1" value="0" aria-label="फ़िल्म में आगे या पीछे जाएँ"></div></div>
</div>
<div class="mini"></div>
<div class="nudge" id="nl">10 सेकंड पीछे</div><div class="nudge r" id="nr">10 सेकंड आगे</div>
<div class="wait" id="wait" hidden><i></i><b id="waitmsg">रुकिए…</b></div>
<button type="button" class="snd" id="snd" hidden>${ICON.sound}आवाज़ चालू करें</button>
<button type="button" class="resume" id="resume" hidden>${ICON.play}<span>पिछली बार <b></b> तक देखी थी, वहीं से चलाएँ</span></button>
<button type="button" class="big" id="big" hidden><span>${ICON.play}</span>फ़िल्म चलाएँ</button>
<div class="err" id="err" hidden><b>फ़िल्म नहीं चल पाई</b><p>इंटरनेट देखकर फिर कोशिश करें।</p><button type="button" class="btn pri" id="retry">${ICON.replay}फिर कोशिश करें</button></div>
<div class="end" id="end" hidden>${endBody}<div class="two"><button type="button" class="btn" id="replay">${ICON.replay}फिर से देखें</button>${wa("btn wa", "भेजें")}</div></div>
</div>
<div class="act">${p.kind === "short" ? fullBtn("btn pri") : regBtn("btn pri")}${wa("btn wa", "भेजें")}</div>
<div class="dock">${seg("रफ़्तार", "speed", [["data-rate", "1", "1x"], ["data-rate", "1.2", "1.2x"], ["data-rate", "1.5", "1.5x"]])}${seg("सबटाइटल", "subs", [["data-cc", "1", "चालू"], ["data-cc", "0", "बंद"]])}${seg("तस्वीर", "qual", [["data-q", "auto", "अपने-आप"], ["data-q", "hd", "HD"], ["data-q", "lite", "कम डेटा"]], true)}</div>
${next}
${chapters}
${foot}</main>
<script type="application/json" id="cfg">${JSON.stringify(cfg).replace(/</g, "\\u003c")}</script>
<script>${js}</script>
</body></html>
`;
}
