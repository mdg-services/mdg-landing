/**
 * Builds the video pages: /videos (the library) and /videos/<slug> (one
 * explainer), Hindi and English, as plain static HTML with the CSS and the one
 * small script inlined.
 *
 * These replace the guide site (guide.mdgservices.in). The audience is the same,
 * a fuel-pump dealer on a cheap Android phone, often on 2G or 3G, so the rules
 * are the guide site's, kept:
 *
 *   - No framework and no video library. A watch page is HTML, a few kB of CSS
 *     and a 1 kB script. No React is sent, nothing is hydrated.
 *   - Nothing downloads until play is pressed. The page costs its HTML and one
 *     poster (9 to 13 kB). The <video> does not exist until then (`preload` is
 *     never used on a video that is not playing).
 *   - Three encodes, picked by the connection, not a picker the dealer would only
 *     guess at: tiny (240p) on 2G or Save-data, low (360p) on 3G, high (720p)
 *     otherwise. If the picture stalls for five seconds it drops one step and
 *     carries on from the same second.
 *   - No webfonts: Devanagari comes from the phone.
 *   - Media file names carry a hash of their bytes, so they are served immutable
 *     (next.config.ts, vercel.json).
 *   - Every video can be saved to the phone and watched with no internet.
 *
 * Both languages are built; proxy.ts picks the file (src/routing/videos.ts), so
 * /videos/<slug> stays one address and `?lang=en` is the English one. The page's
 * words, the chapter names and the video itself all change with the language
 * (the English cut is narrated in English).
 *
 * Written into public/videos by scripts/videos-build.ts before every dev and
 * build run. The generated pages are git-ignored; src/videos/catalog.json and
 * public/videos/media are committed.
 *
 * Words are outcomes only. These are about running a pump, never about how MDG
 * does anything, and never show an MDG screen.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

type Lang = "hi" | "en";
const LANGS: Lang[] = ["hi", "en"];
type Rung = "tiny" | "low" | "high";

interface Media {
  dir: string;
  tiny: string;
  low: string;
  high: string;
  poster: string;
  thumb: string;
  og: string;
  bytes: Record<Rung, number>;
}
interface Cut {
  title: string;
  subtitle: string;
  description: string;
  duration: number;
  chapters: Array<{ t: number; title: string }>;
  media: Media;
}
export interface CatalogVideo {
  slug: string;
  source: string;
  hi: Cut;
  en: Cut;
}
export interface VideosPageFile {
  fileName: string;
  source: string;
}

export const SITE = "https://mdgservices.in";
/** The day these went public (on the guide site, before this move). */
const PUBLISHED = "2026-10-15T00:00:00+05:30";
/** Same number as src/lib/tollFree.ts; this script is not part of the app, so it is not imported. */
const TOLL_FREE_TEL = "tel:18008913496";
const TOLL_FREE_SHOWN = "1800-891-3496";

/** Every word on the page, in both languages. */
const T = {
  hi: {
    locale: "hi_IN",
    brand: "डीलर कवच",
    listTitle: "पंप चलाने के छोटे वीडियो",
    listDesc: (n: number) => `${n} छोटे वीडियो, हर एक लगभग एक मिनट का। हिंदी और अंग्रेज़ी दोनों में, कोई लॉगिन नहीं। किसी को भी भेज सकते हैं।`,
    listHint: "वीडियो तभी चलेगा जब आप दबाएँगे, तब तक डेटा नहीं लगेगा।",
    play: "वीडियो चलाएँ",
    chapters: "वीडियो में क्या-क्या है",
    more: "और वीडियो",
    all: "सारे वीडियो",
    share: "WhatsApp पर भेजें",
    shareText: (title: string) => `${title}: MDG Services का छोटा वीडियो`,
    save: "फ़ोन में सेव करें",
    saveHint: "एक बार सेव कर लीजिए, फिर बिना इंटरनेट के भी देख सकते हैं।",
    join: "डीलर कवच से जुड़ें",
    call: "टोल-फ़्री पर बात करें",
    privacy: "गोपनीयता",
    langAria: "भाषा",
    slow: "धीमा इंटरनेट मिला, कम डेटा वाली क्वालिटी चालू कर दी है।",
    err: "वीडियो नहीं चल पाया। इंटरनेट देखकर फिर कोशिश करें।",
    retry: "फिर कोशिश करें",
    min: (s: number) => (s < 90 ? `${Math.round(s)} सेकंड` : `${Math.round(s / 60)} मिनट`),
  },
  en: {
    locale: "en_IN",
    brand: "Dealer's कवच",
    listTitle: "Short videos on running a pump",
    listDesc: (n: number) => `${n} short videos, about a minute each. In Hindi and English, no login. Send them to anyone.`,
    listHint: "A video plays only when you press it, so nothing uses data until then.",
    play: "Play the video",
    chapters: "What is in the video",
    more: "More videos",
    all: "All videos",
    share: "Send on WhatsApp",
    shareText: (title: string) => `${title}: a short video from MDG Services`,
    save: "Save to your phone",
    saveHint: "Save it once and you can watch it with no internet.",
    join: "Join Dealer's कवच",
    call: "Call our toll-free number",
    privacy: "Privacy",
    langAria: "Language",
    slow: "Slow internet found, so the low-data quality is on.",
    err: "The video couldn't play. Check your internet and try again.",
    retry: "Try again",
    min: (s: number) => (s < 90 ? `${Math.round(s)} sec` : `${Math.round(s / 60)} min`),
  },
};
type Words = (typeof T)["hi"];

const ICON = {
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.7 7.4c.3-.5.6-.5.9-.5h.6c.2 0 .5 0 .7.5l.9 2.1c.1.2.1.4 0 .6l-.6.8c-.2.2-.2.4 0 .7.6 1 1.4 1.8 2.4 2.4.3.2.5.1.7 0l.8-.9c.2-.2.4-.2.6-.1l2 1c.3.1.4.3.4.5 0 .6-.2 1.3-.7 1.7-.6.5-1.5.8-2.5.5-1.3-.4-3-1.2-4.4-2.7-1.5-1.5-2.3-3-2.6-4.2-.2-.9 0-1.8.4-2.4z" fill="currentColor"/></svg>',
  save: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 20h14v-2H5zM19 9h-4V3H9v6H5l7 7z"/></svg>',
  phone:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>',
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
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
/** A running time as schema.org wants it: 43.6 s -> "PT0M44S". */
const isoDuration = (s: number) => {
  const all = Math.round(s);
  return `PT${Math.floor(all / 60)}M${all % 60}S`;
};
/** The first sentence or two of a description, short enough for a search result. */
const blurb = (s: string, max = 158) => {
  const flat = s.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("। "));
  return (stop > 60 ? cut.slice(0, stop + 1) : cut.replace(/\s\S*$/, "") + "…").trim();
};

/** Where the media is served from: this site, or a CDN when VIDEOS_MEDIA_BASE is set at build time. */
function mediaBase(): string {
  return (process.env.VIDEOS_MEDIA_BASE || "").replace(/\/$/, "") || "/videos/media";
}
const mediaUrl = (m: Media, file: string) => `${mediaBase()}/${m.dir}/${file}`;
const absolute = (url: string) => (url.startsWith("http") ? url : SITE + url);

const here = (slug: string) => (slug ? `/videos/${slug}` : "/videos");
const selfUrl = (slug: string, lang: Lang) => `${SITE}${here(slug)}${lang === "hi" ? "" : "?lang=en"}`;
const linkTo = (slug: string, lang: Lang) => `${here(slug)}?lang=${lang}`;
const joinHref = (lang: Lang) => (lang === "hi" ? "/hi/register" : "/register");

/** The inline script: starts the video on the first press and does nothing before. About 1.4 kB. */
const PLAYER_JS = `(function(){var d=document,q=function(s){return d.querySelector(s)},C=JSON.parse(q("#cfg").textContent),st=q("#stage"),R=["high","low","tiny"],v,ri,sl,n=q("#note"),rc=[],cs=d.querySelectorAll(".ch button");
function pick(){var c=navigator.connection||{},e=c.effectiveType||"";if(c.saveData||/2g$/.test(e))return 2;return e=="3g"?1:0}
function say(t){if(n){n.textContent=t||"";n.hidden=!t}}
function mark(){var t=v?v.currentTime:0,k=-1,i;for(i=0;i<C.ch.length;i++)if(C.ch[i]<=t+.25)k=i;for(i=0;i<cs.length;i++)i==k?cs[i].setAttribute("aria-current","true"):cs[i].removeAttribute("aria-current")}
function load(i,at){ri=i;var t=at||0;v.src=C.src[R[i]];if(t)try{v.currentTime=t}catch(e){}v.play().catch(function(){})}
function down(){clearTimeout(sl);if(ri<2){var t=v.currentTime;say(C.s.slow);load(ri+1,t)}else{say(C.s.err);q("#retry").hidden=false}}
function start(at){if(!v){v=d.createElement("video");v.controls=true;v.setAttribute("playsinline","");v.setAttribute("controlslist","nodownload");v.poster=C.poster;st.appendChild(v);st.className="stage on";
v.addEventListener("timeupdate",mark);v.addEventListener("error",down);
v.addEventListener("waiting",function(){clearTimeout(sl);sl=setTimeout(down,5000)});v.addEventListener("playing",function(){clearTimeout(sl)});v.addEventListener("pause",function(){clearTimeout(sl)});
load(pick(),at);return}
if(at!=null){v.currentTime=at}v.play().catch(function(){})}
q("#play").addEventListener("click",function(){start(0)});
q("#retry").addEventListener("click",function(){this.hidden=true;say("");load(pick(),v.currentTime)});
for(var i=0;i<cs.length;i++)cs[i].addEventListener("click",function(){start(+this.getAttribute("data-t"));st.scrollIntoView({block:"nearest",behavior:"smooth"})});
})()`;

const PAGE_CSS = `
/* Inlined into /videos and /videos/<slug>. Device fonts only: Devanagari comes from the phone.
   The same deep navy and gold as the film pages. */
:root{--bg:#101133;--panel:#1b1d4d;--panel2:#24275e;--edge:rgba(247,247,255,.12);--fg:#f7f7ff;--dim:#c5c7ed;--acc:#f5a524;--ink:#101133;
  --night:#07081c;--wa:#25d366;--bad:#ff9a8a;
  --sys:system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans Devanagari","Nirmala UI",sans-serif}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;color-scheme:dark}
body{margin:0;background:var(--bg);color:var(--fg);font:17px/1.55 var(--sys);-webkit-font-smoothing:antialiased}
a{color:inherit}
:focus-visible{outline:3px solid var(--acc);outline-offset:2px}
button{font:inherit;color:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}
svg{display:block}
[hidden]{display:none!important}
header{display:flex;align-items:center;gap:10px;padding:0 16px;height:56px;max-width:1000px;margin:0 auto}
header>a{display:flex;flex:none;padding:6px;margin:-6px}
header img{width:32px;height:32px}
header b{min-width:0;font-size:16px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lang{display:flex;flex:none;margin-left:auto;padding:3px;border:1px solid var(--edge);border-radius:999px;background:rgba(247,247,255,.05)}
.lang a{display:grid;place-items:center;min-width:44px;min-height:40px;padding:0 11px;border-radius:999px;font-size:16px;font-weight:700;line-height:1;text-decoration:none}
.lang a[aria-current]{background:var(--acc);color:var(--ink)}
main{max-width:1000px;margin:0 auto;padding:0 16px 40px}
h1{margin:0 0 6px;font-size:26px;line-height:1.25;font-weight:800}
h2{margin:0 0 10px;font-size:18px;line-height:1.3;font-weight:700}
.sub{margin:0 0 14px;font-size:18px;line-height:1.4;color:var(--dim)}
p{margin:0 0 14px}
.watch{display:grid;gap:22px}
@media (min-width:860px){.watch{grid-template-columns:minmax(260px,360px) 1fr;gap:40px;align-items:start}.watch .stage{position:sticky;top:12px}}
.stage{position:relative;width:min(100%,calc((100vh - 84px)*9/16));aspect-ratio:9/16;margin:0 auto;background:var(--night);border-radius:14px;overflow:hidden}
@supports (height:100svh){.stage{width:min(100%,calc((100svh - 84px)*9/16))}}
.stage img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.stage video{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:var(--night)}
.stage.on img,.stage.on .play,.stage.on .dur{display:none}
.play{position:absolute;inset:0;display:grid;place-items:center;width:100%;border:0;background:linear-gradient(transparent 55%,rgba(7,8,28,.7))}
.play i{display:grid;place-items:center;width:84px;height:84px;border-radius:50%;background:var(--acc);color:var(--ink);box-shadow:0 6px 28px rgba(0,0,0,.5)}
.play i svg{width:40px;height:40px;margin-left:4px}
.dur{position:absolute;left:10px;bottom:10px;padding:3px 10px;border-radius:999px;background:rgba(7,8,28,.78);font-size:15px;font-weight:600;pointer-events:none}
.note{margin:10px 0 0;padding:10px 14px;border-radius:10px;background:var(--panel);color:var(--dim);font-size:16px}
.retry{margin-top:10px;min-height:48px;padding:0 22px;border:0;border-radius:999px;background:var(--acc);color:var(--ink);font-weight:700}
.hint{margin:0;font-size:15px;color:var(--dim)}
.acts{display:flex;flex-wrap:wrap;gap:10px;margin:18px 0 6px}
.btn{display:inline-flex;align-items:center;gap:10px;min-height:48px;padding:0 20px;border-radius:999px;background:var(--panel);border:1px solid var(--edge);font-size:16px;font-weight:600;text-decoration:none}
.btn svg{width:22px;height:22px;flex:none}
.btn.wa{background:#103d27;border-color:#1b6a41}
.btn.wa svg{color:var(--wa)}
.btn.pri{background:var(--acc);border-color:var(--acc);color:var(--ink);font-weight:700}
.save{margin:0 0 22px;font-size:15px;color:var(--dim)}
.ch{list-style:none;margin:0 0 26px;padding:0}
.ch button{display:flex;gap:14px;align-items:baseline;width:100%;min-height:48px;padding:10px 12px;border:0;border-radius:10px;background:none;text-align:left;font-size:17px;line-height:1.35}
.ch button:hover{background:var(--panel)}
.ch button[aria-current]{background:var(--panel2);font-weight:700}
.ch time{flex:none;width:44px;font-size:15px;font-variant-numeric:tabular-nums;color:var(--dim)}
.more{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;list-style:none;margin:0 0 20px;padding:0}
.more a,.grid a{display:block;text-decoration:none}
.more img,.grid img{display:block;width:100%;height:auto;aspect-ratio:9/16;object-fit:cover;border-radius:10px;background:var(--panel)}
.more span,.grid span{display:block;margin-top:8px;font-size:15px;line-height:1.35;font-weight:600}
.grid small{display:block;font-size:14px;color:var(--dim)}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px 12px;list-style:none;margin:22px 0 28px;padding:0}
@media (min-width:600px){.grid{grid-template-columns:repeat(4,1fr)}}
@media (min-width:900px){.grid{grid-template-columns:repeat(6,1fr)}}
.join{margin:28px 0 8px;padding:18px;border-radius:14px;background:var(--panel)}
.join p{margin:0 0 12px;font-weight:600}
footer{max-width:1000px;margin:0 auto;padding:12px 16px 36px;font-size:15px;color:var(--dim)}
@media (max-width:399px){h1{font-size:23px}header{padding:0 12px}.lang a{min-width:40px;padding:0 9px}}
`;

function head(opts: {
  lang: Lang;
  title: string;
  desc: string;
  slug: string;
  og: string;
  ogType: string;
  extra?: string;
  preload?: string;
}): string {
  const { lang, title, desc, slug } = opts;
  const w = T[lang];
  const url = `${SITE}${here(slug)}`;
  const self = selfUrl(slug, lang);
  const toggle = `<nav class="lang" aria-label="${w.langAria}">${LANGS.map(
    (l) => `<a data-lang="${l}" lang="${l}" href="${here(slug)}?lang=${l}"${l === lang ? ' aria-current="true"' : ""}>${l === "hi" ? "हिंदी" : "EN"}</a>`,
  ).join("")}</nav>`;
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)} · MDG Services</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${self}">
<link rel="alternate" hreflang="hi" href="${url}">
<link rel="alternate" hreflang="en" href="${url}?lang=en">
<link rel="alternate" hreflang="x-default" href="${url}">
<meta name="theme-color" content="#101133">
<link rel="icon" type="image/png" href="/film/mark.png">
<meta property="og:type" content="${opts.ogType}">
<meta property="og:site_name" content="MDG Services">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${self}">
<meta property="og:image" content="${absolute(opts.og)}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${w.locale}">
<meta name="twitter:card" content="summary_large_image">
${opts.extra ?? ""}${opts.preload ? `<link rel="preload" as="image" href="${opts.preload}" fetchpriority="high">\n` : ""}<style>${minifyCss(PAGE_CSS)}</style>
</head><body>
<header><a href="/" aria-label="MDG Services"><img src="/film/mark.png" width="32" height="32" alt=""></a><b>${esc(w.brand)}</b>${toggle}</header>
<main>`;
}

function foot(lang: Lang): string {
  const w = T[lang];
  return `</main>
<footer><a href="/">mdgservices.in</a> · <a href="/privacy">${w.privacy}</a></footer>
</body></html>
`;
}

const jsonLd = (o: unknown) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>\n`;

/** The pages other than this one, in the library's order, wrapping round: the three that follow it. */
function neighbours(all: CatalogVideo[], slug: string): CatalogVideo[] {
  const i = all.findIndex((v) => v.slug === slug);
  return [1, 2, 3].map((k) => all[(i + k) % all.length]!);
}

function watchPage(all: CatalogVideo[], v: CatalogVideo, lang: Lang): string {
  const w: Words = T[lang];
  const c = v[lang];
  const m = c.media;
  const self = selfUrl(v.slug, lang);
  const desc = blurb(c.description);
  const poster = mediaUrl(m, m.poster);
  const cfg = {
    poster,
    src: { tiny: mediaUrl(m, m.tiny), low: mediaUrl(m, m.low), high: mediaUrl(m, m.high) },
    ch: c.chapters.map((x) => x.t),
    s: { slow: w.slow, err: w.err },
  };
  const video = jsonLd({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: c.title,
    description: c.description,
    thumbnailUrl: [absolute(poster), absolute(mediaUrl(m, m.og))],
    uploadDate: PUBLISHED,
    duration: isoDuration(c.duration),
    contentUrl: absolute(mediaUrl(m, m.high)),
    inLanguage: lang,
    publisher: { "@type": "Organization", name: "MDG Services", url: SITE, logo: { "@type": "ImageObject", url: `${SITE}/film/mark.png` } },
  });
  const crumbs = jsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "MDG Services", item: SITE },
      { "@type": "ListItem", position: 2, name: w.listTitle, item: `${SITE}/videos${lang === "hi" ? "" : "?lang=en"}` },
      { "@type": "ListItem", position: 3, name: c.title, item: self },
    ],
  });

  const chapters = c.chapters
    .map((x) => `<li><button type="button" data-t="${x.t}"><time>${mmss(x.t)}</time><span>${esc(x.title)}</span></button></li>`)
    .join("");
  const more = neighbours(all, v.slug)
    .map((o) => {
      const oc = o[lang];
      return `<li><a href="${linkTo(o.slug, lang)}"><img src="${mediaUrl(oc.media, oc.media.thumb)}" width="240" height="426" loading="lazy" alt=""><span>${esc(oc.title)}</span></a></li>`;
    })
    .join("");
  const wa = `https://wa.me/?text=${encodeURIComponent(`${w.shareText(c.title)}\n${self}`)}`;

  return `${head({ lang, title: c.title, desc, slug: v.slug, og: mediaUrl(m, m.og), ogType: "video.other", extra: video + crumbs, preload: poster })}
<div class="watch">
<div>
<div class="stage" id="stage"><img src="${poster}" width="540" height="960" alt="" fetchpriority="high"><button type="button" class="play" id="play" aria-label="${esc(w.play)}"><i>${ICON.play}</i></button><span class="dur">${mmss(c.duration)}</span></div>
<p class="note" id="note" role="status" hidden></p>
<button type="button" class="retry" id="retry" hidden>${w.retry}</button>
</div>
<div>
<h1>${esc(c.title)}</h1>
<p class="sub">${esc(c.subtitle)}</p>
<p>${esc(c.description)}</p>
<p class="hint">${esc(w.listHint)}</p>
<div class="acts"><a class="btn wa" href="${wa}" target="_blank" rel="noopener">${ICON.wa}${w.share}</a><a class="btn" href="${mediaUrl(m, m.low)}" download="${v.slug}-${lang}.mp4">${ICON.save}${w.save}</a></div>
<p class="save">${esc(w.saveHint)}</p>
<h2>${w.chapters}</h2>
<ol class="ch">${chapters}</ol>
</div>
</div>
<h2>${w.more}</h2>
<ul class="more">${more}</ul>
<p><a class="btn" href="${linkTo("", lang)}">${w.all}</a></p>
<div class="join"><p>${esc(w.brand)}</p><div class="acts" style="margin:0"><a class="btn pri" href="${joinHref(lang)}">${w.join}</a><a class="btn" href="${TOLL_FREE_TEL}">${ICON.phone}${w.call}: ${TOLL_FREE_SHOWN}</a></div></div>
<script type="application/json" id="cfg">${JSON.stringify(cfg).replace(/</g, "\\u003c")}</script>
<script>${PLAYER_JS}</script>
${foot(lang)}`;
}

function libraryPage(all: CatalogVideo[], lang: Lang): string {
  const w: Words = T[lang];
  const desc = w.listDesc(all.length);
  const items = all
    .map((v) => {
      const c = v[lang];
      return `<li><a href="${linkTo(v.slug, lang)}"><img src="${mediaUrl(c.media, c.media.thumb)}" width="240" height="426" loading="lazy" alt=""><span>${esc(c.title)}<small>${w.min(c.duration)}</small></span></a></li>`;
    })
    .join("");
  const list = jsonLd({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: w.listTitle,
    description: desc,
    url: selfUrl("", lang),
    inLanguage: lang,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: all.map((v, i) => ({ "@type": "ListItem", position: i + 1, url: selfUrl(v.slug, lang), name: v[lang].title })),
    },
  });
  return `${head({ lang, title: w.listTitle, desc, slug: "", og: mediaUrl(all[0]![lang].media, all[0]![lang].media.og), ogType: "website", extra: list })}
<h1 style="margin-top:8px">${esc(w.listTitle)}</h1>
<p class="sub">${esc(desc)}</p>
<p class="hint">${esc(w.listHint)}</p>
<ul class="grid">${items}</ul>
<div class="join"><p>${esc(w.brand)}</p><div class="acts" style="margin:0"><a class="btn pri" href="${joinHref(lang)}">${w.join}</a><a class="btn" href="${TOLL_FREE_TEL}">${ICON.phone}${w.call}: ${TOLL_FREE_SHOWN}</a></div></div>
${foot(lang)}`;
}

/** Every page: the library and each explainer, in both languages, at the file names proxy.ts rewrites to. */
export function buildVideoPages(opts: { root: string }): VideosPageFile[] {
  const all = (JSON.parse(readFileSync(path.join(opts.root, "src/videos/catalog.json"), "utf8")) as { videos: CatalogVideo[] }).videos;
  const files: VideosPageFile[] = [];
  for (const lang of LANGS) {
    const sub = lang === "hi" ? "" : `${lang}/`;
    files.push({ fileName: `videos/${sub}index.html`, source: libraryPage(all, lang) });
    for (const v of all) files.push({ fileName: `videos/${v.slug}/${sub}index.html`, source: watchPage(all, v, lang) });
  }
  return files;
}

/** gzipped size of the biggest watch page and the library page, for the build log. */
export function pageSizes(files: VideosPageFile[]): string {
  const gz = (f: VideosPageFile) => gzipSync(f.source, { level: 9 }).length;
  const watch = files.filter((f) => /^videos\/[^/]+\/(en\/)?index\.html$/.test(f.fileName));
  const lib = files.filter((f) => /^videos\/(en\/)?index\.html$/.test(f.fileName));
  const big = (list: VideosPageFile[]) => Math.max(...list.map(gz));
  return `${files.length} pages; biggest watch page ${(big(watch) / 1024).toFixed(1)} kB gz, library ${(big(lib) / 1024).toFixed(1)} kB gz`;
}
