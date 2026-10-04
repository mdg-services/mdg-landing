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
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z"/></svg>',
  replay:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 5V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.7 7.4c.3-.5.6-.5.9-.5h.6c.2 0 .5 0 .7.5l.9 2.1c.1.2.1.4 0 .6l-.6.8c-.2.2-.2.4 0 .7.6 1 1.4 1.8 2.4 2.4.3.2.5.1.7 0l.8-.9c.2-.2.4-.2.6-.1l2 1c.3.1.4.3.4.5 0 .6-.2 1.3-.7 1.7-.6.5-1.5.8-2.5.5-1.3-.4-3-1.2-4.4-2.7-1.5-1.5-2.3-3-2.6-4.2-.2-.9 0-1.8.4-2.4z" fill="currentColor"/></svg>',
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
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
    const html = page({ f, p, live, css, js, beacon, hlsSrc: `/${hls.fileName}`, fullMin });
    files.push({ fileName: `${p.path.slice(1)}/index.html`, source: html });
  }
  return files;
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
<header><a href="/" aria-label="MDG Services"><img src="/film/mark.png" width="36" height="36" alt=""></a><div><h1>${esc(f.title)}</h1><p>${esc(desc)}</p></div></header>
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
    film: f.film, title: f.title, duration: f.duration, base: f.base, hls: f.hls, mp4: f.mp4,
    captions: f.captions, chapters: f.chapters || [], beacon: a.beacon, hlsJs: a.hlsSrc, url, kind: p.kind,
  };
  const endCta =
    p.kind === "short"
      ? `<a class="btn pri" id="full" href="/film?from=short">पूरी फ़िल्म देखें (${a.fullMin} मिनट) →</a>`
      : `<a class="btn pri" id="reg" href="/register">डीलर कवच से जुड़ें</a>`;
  const chapters = (f.chapters || []).length
    ? `<section class="ch"><h2>अध्याय</h2><ol>${(f.chapters || [])
        .map((c) => `<li><button type="button" data-t="${c.t}"><span>${mmss(c.t)}</span>${esc(c.title)}</button></li>`)
        .join("")}</ol></section>`
    : "";
  return `${head}
<div class="stage" id="stage">
<video id="v" playsinline muted autoplay preload="auto" controls crossorigin="anonymous" poster="${poster}"><track kind="captions" srclang="hi" label="हिन्दी" default src="${f.base}/${f.captions}"></video>
<button type="button" class="snd" id="snd" hidden>${ICON.sound}आवाज़ चालू करें</button>
<button type="button" class="big" id="big" hidden><span>${ICON.play}</span>फ़िल्म चलाएँ</button>
<div class="end" id="end" hidden><p>${esc(f.title)}</p>${endCta}<button type="button" class="btn" id="replay">${ICON.replay}फिर से देखें</button><a class="btn wa" data-wa href="https://wa.me/" target="_blank" rel="noopener">${ICON.wa}WhatsApp पर भेजें</a></div>
</div>
<div class="bar" aria-label="रफ़्तार"><button type="button" class="chip" data-rate="1">1x</button><button type="button" class="chip" data-rate="1.2">1.2x</button><button type="button" class="chip" data-rate="1.5">1.5x</button><button type="button" class="chip" id="cc" aria-pressed="true" aria-label="कैप्शन">CC</button><a class="wa" data-wa href="https://wa.me/" target="_blank" rel="noopener" aria-label="WhatsApp पर भेजें">${ICON.wa}</a></div>
${chapters}
${foot}</main>
<script type="application/json" id="cfg">${JSON.stringify(cfg).replace(/</g, "\\u003c")}</script>
<script>${js}</script>
</body></html>
`;
}
