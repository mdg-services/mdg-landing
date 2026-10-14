/**
 * Builds the MDG guide (mdgservices.in/mdg/, /hi/mdg/, /tools/) as plain
 * static HTML, one snapshot per release day.
 *
 * Each page is written by hand in guide/content/<lang>/<id>.md: a JSON header
 * (title, description, short answer, questions) and a Markdown body. This
 * script wraps it in the page chrome, resolves [text](@id) links, turns
 * {{5.1.9}} into a clause tag, and writes the structured data search engines
 * read (Article / WebPage, BreadcrumbList, FAQPage).
 *
 * Release: guide/schedule.ts decides the day each page goes live. For every
 * day N the build writes /_guide/dNN/ with only the pages live by then, links
 * between live pages only, and that day's sitemap.xml and llms.txt.
 * middleware.ts serves today's snapshot. A page whose words are missing fails
 * the build, so nothing half-written can ship.
 *
 * Budget: no web fonts (Devanagari comes from the phone), CSS inline, about
 * 25 kB a page, for a dealer on 2G.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { Marked, type Renderer, type Tokens } from "marked";
import { PAGES, PILLARS, VIDEOS, byId, pathOf, type GuidePage, type Lang } from "../guide/inventory.js";
import { RELEASES, LAST_DAY, dateOfDay, snapshotDir, type Release } from "../guide/schedule.js";
import { SITE, UI, NOTICE, OFFICIAL, TOLL_FREE, SITE_PAGES } from "../guide/copy.js";

export interface GuideFile {
  fileName: string;
  source: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface PageContent {
  title: string;
  /** <title> override when the H1 is too long for a search result. */
  metaTitle?: string;
  description: string;
  answer?: string;
  faq?: FaqItem[];
  related?: string[];
  updated: string;
  body: string;
}

const LANGS: Lang[] = ["en", "hi"];

// ── Reading and checking the words ──────────────────────────────────────

/** Words that describe how the service works, or overclaim. Never on a public page. */
const FORBIDDEN = [/\bSDMS\b/i, /\bIRAS\b/i, /\bOCR\b/, /captcha/i, /scrap(e|ing|er)/i, /admin (panel|portal)/i, /\bour AI\b/i, /artificial intelligence/i, /ChatGPT/i, /\bClaude\b/i, /\bLLM\b/];

export function contentPath(root: string, lang: Lang, id: string): string {
  return path.join(root, "guide", "content", lang, `${id}.md`);
}

export function parseContent(raw: string, where: string): PageContent {
  const m = /^---json\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/.exec(raw);
  if (!m) throw new Error(`${where}: missing the ---json header`);
  let head: Omit<PageContent, "body">;
  try {
    head = JSON.parse(m[1]);
  } catch (e) {
    throw new Error(`${where}: header is not valid JSON (${(e as Error).message})`, { cause: e });
  }
  return { ...head, body: m[2].trim() };
}

/** Every problem with one page's words, as readable lines. Empty = fine. */
export function checkContent(page: GuidePage, lang: Lang, c: PageContent): string[] {
  const where = `${lang}/${page.id}.md`;
  const errs: string[] = [];
  const need = (ok: unknown, msg: string) => {
    if (!ok) errs.push(`${where}: ${msg}`);
  };
  need(typeof c.title === "string" && c.title.length >= 10 && c.title.length <= 110, "title must be 10-110 characters");
  if (c.metaTitle !== undefined) need(c.metaTitle.length <= 65, "metaTitle must be at most 65 characters");
  else need(c.title.length <= 65 || page.type === "Hub", "title over 65 characters needs a shorter metaTitle");
  need(typeof c.description === "string" && c.description.length >= 70 && c.description.length <= 170, `description must be 70-170 characters (has ${c.description?.length ?? 0})`);
  need(/^\d{4}-\d{2}-\d{2}$/.test(c.updated || ""), "updated must be YYYY-MM-DD");
  if (page.type !== "Legal" && page.type !== "Hub") {
    need(typeof c.answer === "string" && c.answer.length >= 80 && c.answer.length <= 700, "answer must be 80-700 characters");
    need(Array.isArray(c.faq) && c.faq.length >= 3 && c.faq.length <= 10, "faq must have 3-10 questions");
  }
  for (const f of c.faq || []) need(f && f.q && f.a && f.a.length >= 40, `faq item "${f?.q}" needs a question and an answer of 40+ characters`);
  need(!/^#\s/m.test(c.body), "body must not contain a level-1 heading (# ...); the title is the H1");
  if (page.type !== "Tool") need((c.body.match(/^##\s/gm) || []).length >= 2 || page.type === "Legal", "body needs at least two ## sections");
  for (const ref of c.body.matchAll(/\]\(@([a-z0-9-]+)(?:#[^)]*)?\)/g)) need(byId.has(ref[1]), `link to unknown page @${ref[1]}`);
  for (const id of c.related || []) need(byId.has(id), `related lists unknown page ${id}`);
  for (const tag of c.body.matchAll(/\{\{([^}]*)\}\}/g)) need(/^(2012:)?[0-9A-Za-z.()–\-, ]+$|^circular$|^annexure [0-9a-z]+$/i.test(tag[1].trim()), `odd clause tag {{${tag[1]}}}`);
  const text = [c.title, c.description, c.answer || "", c.body, ...(c.faq || []).flatMap((f) => [f.q, f.a])].join("\n");
  for (const bad of FORBIDDEN) need(!bad.test(text), `contains a forbidden word (${bad}); say what a dealer gets, never how the work is done`);
  if (lang === "hi") need(/[\u0900-\u097F]/.test(c.body), "Hindi page has no Devanagari in its body");
  return errs;
}

export function loadAll(root: string): { content: Map<string, PageContent>; errors: string[] } {
  const content = new Map<string, PageContent>();
  const errors: string[] = [];
  for (const page of PAGES) {
    for (const lang of LANGS) {
      if (lang === "hi" && !page.hi) continue;
      const file = contentPath(root, lang, page.id);
      if (!existsSync(file)) {
        errors.push(`${lang}/${page.id}.md: missing`);
        continue;
      }
      try {
        const c = parseContent(readFileSync(file, "utf8"), `${lang}/${page.id}.md`);
        errors.push(...checkContent(page, lang, c));
        content.set(`${lang}:${page.id}`, c);
      } catch (e) {
        errors.push((e as Error).message);
      }
    }
  }
  return { content, errors };
}

// ── Rendering helpers ────────────────────────────────────────────────────

const MONTHS: Record<Lang, string[]> = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  hi: ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
};

/** "2026-10-15" -> "15 October 2026" / "15 अक्टूबर 2026" */
function longDate(iso: string, lang: Lang): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[lang][m - 1]} ${y}`;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function clauseTags(html: string, lang: Lang): string {
  return html.replace(/\{\{([^}]+)\}\}/g, (_, raw: string) => {
    const t = raw.trim();
    let label: string;
    if (/^circular$/i.test(t)) label = lang === "hi" ? "सर्कुलर 20.03.2025" : "Circular 20.03.2025";
    else if (t.startsWith("2012:")) label = `MDG 2012 ${t.slice(5)}`;
    else if (/^annexure/i.test(t)) label = (lang === "hi" ? "अनुलग्नक " : "Annexure ") + t.replace(/^annexure\s*/i, "");
    else label = `MDG ${t}`;
    return `<span class="cl">${esc(label)}</span>`;
  });
}

/** Inline Markdown only (answers, questions): no paragraphs. */
function inline(md: Marked, s: string, lang: Lang): string {
  return clauseTags(md.parseInline(s, { async: false }) as string, lang);
}

interface Ctx {
  root: string;
  day: number;
  live: Set<string>; // "lang:id"
  content: Map<string, PageContent>;
}

function isLive(ctx: Ctx, id: string, lang: Lang): boolean {
  return ctx.live.has(`${lang}:${id}`);
}

/** Where a link to page `id` should point from a page in `lang`: same language if live, else English if live. */
function target(ctx: Ctx, id: string, lang: Lang): { href: string; lang: Lang } | null {
  const p = byId.get(id);
  if (!p) return null;
  if (isLive(ctx, id, lang)) return { href: pathOf(p, lang), lang };
  if (lang === "hi" && isLive(ctx, id, "en")) return { href: pathOf(p, "en"), lang: "en" };
  return null;
}

function titleOf(ctx: Ctx, id: string, lang: Lang): string {
  return ctx.content.get(`${lang}:${id}`)?.title || ctx.content.get(`en:${id}`)?.title || id;
}

function makeMarked(ctx: Ctx, lang: Lang): Marked {
  const md = new Marked({ gfm: true });
  md.use({
    renderer: {
      link(this: Renderer, token: Tokens.Link) {
        const text = this.parser.parseInline(token.tokens);
        const href = token.href || "";
        if (href.startsWith("@")) {
          const [id, hash] = href.slice(1).split("#");
          const t = target(ctx, id, lang);
          if (!t) return text; // not live yet: plain words, no dead link
          const note = t.lang !== lang ? ` <span class="ln">(${UI[lang].english})</span>` : "";
          return `<a href="${t.href}${hash ? `#${hash}` : ""}">${text}</a>${note}`;
        }
        const ext = /^https?:\/\//.test(href) && !href.startsWith(SITE);
        return `<a href="${esc(href)}"${ext ? ' rel="noopener" target="_blank"' : ""}>${text}</a>`;
      },
    },
  });
  return md;
}

function renderBody(ctx: Ctx, lang: Lang, body: string): string {
  const md = makeMarked(ctx, lang);
  let html = md.parse(body, { async: false }) as string;
  html = html.replace(/<table>/g, '<div class="tw"><table>').replace(/<\/table>/g, "</table></div>");
  return clauseTags(html, lang);
}

// ── Page chrome ──────────────────────────────────────────────────────────

const CSS = `
:root{--ink:#15163A;--soft:#3D3F66;--muted:#5D5F86;--line:#E4E6F1;--paper:#FCFCFE;--sunk:#F1F2FB;--navy:#2C2E80;--navy-d:#222466;--gold:#F5A524;--gold-t:#FEF7E7;--ok:#12A87B}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--paper);color:var(--ink);font:17px/1.65 system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans","Noto Sans Devanagari",sans-serif}
a{color:var(--navy);text-underline-offset:2px}
a:focus-visible{outline:2px solid var(--gold);outline-offset:2px;border-radius:3px}
.wrap{max-width:760px;margin:0 auto;padding-inline:18px}
header.top{background:var(--navy);color:#fff}
header.top .wrap{display:flex;align-items:center;gap:12px;min-height:56px;flex-wrap:wrap;padding-block:8px}
header.top a{color:#fff;text-decoration:none}
.logo{display:flex;align-items:center;gap:8px;font-weight:700;letter-spacing:.01em}
.logo img{width:28px;height:28px;border-radius:6px;background:#fff}
.top nav{display:flex;gap:14px;margin-left:auto;align-items:center;font-size:15px;flex-wrap:wrap}
.top nav .btn{background:var(--gold);color:var(--ink);padding:6px 12px;border-radius:8px;font-weight:600}
.crumb{font-size:14px;color:var(--muted);margin:22px 0 6px}
.crumb a{color:var(--muted)}
h1{font-size:clamp(27px,5.2vw,38px);line-height:1.2;margin:4px 0 12px;letter-spacing:-.01em;text-wrap:balance}
h2{font-size:24px;line-height:1.3;margin:36px 0 10px;text-wrap:balance}
h3{font-size:19px;line-height:1.35;margin:24px 0 6px}
p,ul,ol{margin:0 0 14px}
li{margin:4px 0}
.notice{background:var(--gold-t);border:1px solid #FBD888;border-radius:10px;padding:10px 14px;font-size:14.5px;line-height:1.5;margin:10px 0 14px}
.checked{font-size:13.5px;color:var(--muted);margin:0 0 18px}
.answer{background:var(--sunk);border-left:4px solid var(--navy);border-radius:0 10px 10px 0;padding:14px 18px;margin:0 0 22px}
.answer b{display:block;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--navy);margin-bottom:4px}
.answer p{margin:0}
.cl{display:inline-block;font:500 12.5px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--navy);background:#fff;border:1px solid var(--line);border-radius:5px;padding:0 6px;white-space:nowrap;vertical-align:1px}
.ln{font-size:13px;color:var(--muted)}
.tw{overflow-x:auto;margin:6px 0 18px;border:1px solid var(--line);border-radius:10px;background:#fff}
table{border-collapse:collapse;width:100%;font-size:15.5px;line-height:1.45}
th,td{text-align:left;vertical-align:top;padding:9px 12px;border-bottom:1px solid var(--line)}
th{background:var(--sunk);font-weight:600}
tr:last-child td{border-bottom:0}
blockquote{margin:0 0 16px;padding:10px 16px;border-left:4px solid var(--gold);background:var(--gold-t);border-radius:0 10px 10px 0}
blockquote p:last-child{margin:0}
code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.9em}
.videos,.cards{display:grid;gap:10px;margin:8px 0 18px;grid-template-columns:repeat(auto-fill,minmax(240px,1fr))}
.card{display:block;border:1px solid var(--line);border-radius:12px;padding:12px 14px;background:#fff;text-decoration:none;color:var(--ink)}
.card:hover{border-color:var(--navy)}
.card small{display:block;color:var(--muted);font-size:13px}
.card strong{display:block;color:var(--navy);line-height:1.35}
.card span{display:block;font-size:14.5px;color:var(--soft);margin-top:4px;line-height:1.45}
details{border-bottom:1px solid var(--line);padding:10px 0}
summary{cursor:pointer;font-weight:600;line-height:1.45}
details p{margin:8px 0 0}
.cta{background:var(--navy);color:#fff;border-radius:14px;padding:18px 20px;margin:34px 0 18px}
.cta h2{color:#fff;margin:0 0 6px;font-size:21px}
.cta p{margin:0 0 12px;color:#E3E4F6}
.cta .row{display:flex;flex-wrap:wrap;gap:10px}
.cta a{display:inline-block;padding:9px 14px;border-radius:9px;font-weight:600;text-decoration:none}
.cta a.p{background:var(--gold);color:var(--ink)}
.cta a.s{border:1px solid #9EA1E0;color:#fff}
.official{font-size:15px;margin:0 0 18px}
.disc{font-size:13.5px;color:var(--muted);line-height:1.55;border-top:1px solid var(--line);padding-top:14px;margin-top:20px}
footer.bot{background:var(--sunk);margin-top:36px;padding-block:22px 34px;font-size:14px;color:var(--muted)}
footer.bot ul{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:6px 16px;margin:0 0 12px}
footer.bot a{color:var(--soft)}
.tool{border:1px solid var(--line);border-radius:12px;background:#fff;padding:16px;margin:8px 0 22px}
.tool label{display:block;font-weight:600;font-size:15px;margin:10px 0 4px}
.tool input,.tool select{font:inherit;padding:8px 10px;border:1px solid #C5C7ED;border-radius:8px;width:100%;max-width:260px;background:#fff;color:var(--ink)}
.tool button{font:inherit;font-weight:600;padding:9px 16px;border-radius:9px;border:0;background:var(--navy);color:#fff;cursor:pointer;margin-top:12px}
.tool .out{margin-top:14px;padding:12px 14px;border-radius:10px;background:var(--sunk);font-variant-numeric:tabular-nums}
@media (max-width:520px){body{font-size:16px}h2{font-size:21px}.top nav{margin-left:0}}
@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto}}
`.replace(/\n/g, "");

function jsonLd(obj: unknown): string {
  return `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;
}

const ORG = {
  "@type": "Organization",
  "@id": `${SITE}/#org`,
  name: "MDG Services",
  legalName: "VRUOOM PRIVATE LIMITED",
  url: `${SITE}/`,
  logo: `${SITE}/logo-mark.png`,
};

function stripMd(s: string): string {
  return s.replace(/\{\{([^}]+)\}\}/g, (_, t) => `MDG ${t}`).replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_`]/g, "");
}

interface Rendered {
  path: string;
  html: string;
}

function renderPage(ctx: Ctx, r: Release): Rendered {
  const { page, lang } = r;
  const c = ctx.content.get(`${lang}:${page.id}`)!;
  const t = UI[lang];
  const url = `${SITE}${r.path}`;
  const twin: Lang = lang === "en" ? "hi" : "en";
  const twinLive = page.hi && isLive(ctx, page.id, twin);
  const pillar = PILLARS[page.pillar];
  const mainId = pillar.main;
  const isMain = mainId === page.id;
  const published = dateOfDay(r.day);
  const modified = c.updated > published ? c.updated : published;
  const md = makeMarked(ctx, lang);

  // Breadcrumb: guide home > topic main page > this page
  const crumbs: { name: string; href: string }[] = [{ name: t.home, href: "/" }];
  if (page.id !== "hub") {
    const hub = target(ctx, "hub", lang);
    if (hub) crumbs.push({ name: t.guide, href: hub.href });
    if (!isMain && page.pillar !== "hub" && page.pillar !== "tools") {
      const m = target(ctx, mainId, lang);
      if (m) crumbs.push({ name: lang === "hi" ? pillar.hi : pillar.en, href: m.href });
    }
  }
  crumbs.push({ name: c.title, href: r.path });

  // Pages under a topic's main page, and the guide's topic list on the hub
  let children = "";
  if (page.id === "hub") {
    const cards = (Object.keys(PILLARS) as (keyof typeof PILLARS)[])
      .filter((k) => k !== "hub" && k !== "tools")
      .map((k) => {
        const tgt = target(ctx, PILLARS[k].main, lang);
        if (!tgt) return "";
        const n = PAGES.filter((p) => p.pillar === k && target(ctx, p.id, lang)).length;
        const d = ctx.content.get(`${tgt.lang}:${PILLARS[k].main}`)?.description || "";
        return `<a class="card" href="${tgt.href}"><strong>${esc(lang === "hi" ? PILLARS[k].hi : PILLARS[k].en)}</strong><span>${esc(d)}</span><small>${n} ${n === 1 ? t.page : t.pages}</small></a>`;
      })
      .join("");
    const extra = PAGES.filter((p) => (p.pillar === "hub" && p.id !== "hub") || p.pillar === "tools")
      .map((p) => {
        const tgt = target(ctx, p.id, lang);
        if (!tgt) return "";
        return `<a class="card" href="${tgt.href}"><strong>${esc(titleOf(ctx, p.id, tgt.lang))}</strong><span>${esc(ctx.content.get(`${tgt.lang}:${p.id}`)?.description || "")}</span></a>`;
      })
      .join("");
    children = (cards ? `<h2>${t.topics}</h2><div class="cards">${cards}</div>` : "") + (extra ? `<h2>${t.tools} · ${t.updates}</h2><div class="cards">${extra}</div>` : "");
  } else if (isMain && page.pillar !== "tools") {
    const cards = PAGES.filter((p) => p.pillar === page.pillar && p.id !== page.id)
      .map((p) => {
        const tgt = target(ctx, p.id, lang);
        if (!tgt) return "";
        const note = tgt.lang !== lang ? ` <span class="ln">(${t.english})</span>` : "";
        return `<a class="card" href="${tgt.href}"><strong>${esc(titleOf(ctx, p.id, tgt.lang))}${note}</strong><span>${esc(ctx.content.get(`${tgt.lang}:${p.id}`)?.description || "")}</span></a>`;
      })
      .join("");
    if (cards) children = `<h2>${t.inSection}</h2><div class="cards">${cards}</div>`;
  }

  // Related: hand-picked first, then other pages on the same topic
  const relIds = [...(c.related || []), ...PAGES.filter((p) => p.pillar === page.pillar && p.id !== page.id && p.id !== mainId).map((p) => p.id)];
  const seen = new Set<string>();
  const related = relIds
    .filter((id) => id !== page.id && !seen.has(id) && seen.add(id))
    .map((id) => ({ id, tgt: target(ctx, id, lang) }))
    .filter((x) => x.tgt)
    .slice(0, 4)
    .map(({ id, tgt }) => `<a class="card" href="${tgt!.href}"><strong>${esc(titleOf(ctx, id, tgt!.lang))}</strong><span>${esc(ctx.content.get(`${tgt!.lang}:${id}`)?.description || "")}</span></a>`)
    .join("");

  const videos = (page.videos || [])
    .filter((v) => VIDEOS[v])
    .map((v) => `<a class="card" href="https://guide.mdgservices.in/${v}-${lang}" rel="noopener"><small>${t.video} · 1 min</small><strong>${esc(VIDEOS[v][lang])}</strong></a>`)
    .join("");

  const faq = (c.faq || [])
    .map((f) => `<details><summary>${inline(md, f.q, lang)}</summary><p>${inline(md, f.a, lang)}</p></details>`)
    .join("");

  const toolFile = path.join(ctx.root, "guide", "tools", `${page.id}.js`);
  const toolJs = page.type === "Tool" && existsSync(toolFile) ? readFileSync(toolFile, "utf8") : "";

  // Structured data
  const ld: unknown[] = [
    { "@context": "https://schema.org", ...ORG },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((b, i) => ({ "@type": "ListItem", position: i + 1, name: b.name, item: `${SITE}${b.href}` })),
    },
    {
      "@context": "https://schema.org",
      "@type": page.type === "Hub" || page.type === "Legal" || page.type === "Tool" ? "WebPage" : "Article",
      headline: c.title,
      description: c.description,
      inLanguage: lang === "hi" ? "hi-IN" : "en-IN",
      datePublished: published,
      dateModified: modified,
      mainEntityOfPage: url,
      url,
      publisher: { "@id": `${SITE}/#org` },
      author: { "@id": `${SITE}/#org` },
      isAccessibleForFree: true,
      about: { "@type": "Thing", name: "Marketing Discipline Guidelines 2024 (MDG 2024)" },
    },
  ];
  if (c.faq?.length) {
    ld.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: c.faq.map((f) => ({ "@type": "Question", name: stripMd(f.q), acceptedAnswer: { "@type": "Answer", text: stripMd(f.a) } })),
    });
  }

  const alt = twinLive
    ? `<link rel="alternate" hreflang="${lang === "hi" ? "hi" : "en"}" href="${url}"><link rel="alternate" hreflang="${twin}" href="${SITE}${pathOf(page, twin)}"><link rel="alternate" hreflang="x-default" href="${SITE}${pathOf(page, "en")}">`
    : "";
  const metaTitle = `${c.metaTitle || c.title} | MDG Services`;
  const otherLink = twinLive ? `<a href="${pathOf(page, twin)}" hreflang="${twin}" lang="${twin}">${t.other}</a>` : "";
  const hubLink = target(ctx, "hub", lang);
  const discLink = target(ctx, "disclaimer", lang);
  const updLink = target(ctx, "official-pdf-and-updates", lang);
  const pillarLinks = (Object.keys(PILLARS) as (keyof typeof PILLARS)[])
    .filter((k) => k !== "hub" && k !== "tools")
    .map((k) => {
      const tgt = target(ctx, PILLARS[k].main, lang);
      return tgt ? `<li><a href="${tgt.href}">${esc(lang === "hi" ? PILLARS[k].hi : PILLARS[k].en)}</a></li>` : "";
    })
    .join("");

  const html = `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(metaTitle)}</title>
<meta name="description" content="${esc(c.description)}">
<link rel="canonical" href="${url}">
${alt}
<meta name="theme-color" content="#2C2E80">
<link rel="icon" type="image/png" href="/favicon.png">
<meta property="og:type" content="article">
<meta property="og:site_name" content="MDG Services">
<meta property="og:title" content="${esc(c.title)}">
<meta property="og:description" content="${esc(c.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/og.png">
<meta property="og:locale" content="${t.locale}">
<meta name="twitter:card" content="summary_large_image">
<style>${CSS}</style>
${ld.map(jsonLd).join("\n")}
</head>
<body>
<header class="top"><div class="wrap">
<a class="logo" href="/"><img src="/logo-mark.png" alt="" width="28" height="28">MDG Services</a>
<nav>${hubLink ? `<a href="${hubLink.href}">${t.guide}</a>` : ""}${otherLink}<a class="btn" href="/register">${t.register}</a></nav>
</div></header>
<main class="wrap">
<nav class="crumb" aria-label="Breadcrumb">${crumbs
    .slice(0, -1)
    .map((b) => `<a href="${b.href}">${esc(b.name)}</a>`)
    .join(" › ")}</nav>
<h1>${esc(c.title)}</h1>
<p class="notice">${esc(NOTICE[lang].short)}</p>
<p class="checked">${t.checked} ${longDate(c.updated, lang)}.</p>
${c.answer ? `<div class="answer"><b>${t.shortAnswer}</b><p>${inline(md, c.answer, lang)}</p></div>` : ""}
${renderBody(ctx, lang, c.body)}
${videos ? `<h2>${t.watch}</h2><div class="videos">${videos}</div>` : ""}
${children}
${faq ? `<h2>${t.faq}</h2>${faq}` : ""}
<p class="official"><b>${t.officialTitle}:</b> <a href="${OFFICIAL.iocl}" rel="noopener" target="_blank">${t.officialIocl}</a> · <a href="${OFFICIAL.bpcl}" rel="noopener" target="_blank">${t.officialBpcl}</a></p>
${related ? `<h2>${t.related}</h2><div class="cards">${related}</div>` : ""}
<section class="cta"><h2>${t.ctaTitle}</h2><p>${t.cta}</p><div class="row"><a class="p" href="/register">${t.register}</a><a class="s" href="${TOLL_FREE.href}">${t.call}</a></div></section>
<p class="disc">${esc(NOTICE[lang].full)}${discLink ? ` <a href="${discLink.href}">${t.disclaimerLink}</a>.` : ""}</p>
</main>
<footer class="bot"><div class="wrap">
<ul>${hubLink ? `<li><a href="${hubLink.href}">${t.guide}</a></li>` : ""}${pillarLinks}</ul>
<ul><li><a href="/">${t.home}</a></li>${updLink ? `<li><a href="${updLink.href}">${t.updates}</a></li>` : ""}${discLink ? `<li><a href="${discLink.href}">${t.disclaimerLink}</a></li>` : ""}<li><a href="/privacy">${t.privacy}</a></li><li><a href="/register">${t.register}</a></li></ul>
<p>${esc(t.company)}</p>
</div></footer>
${toolJs ? `<script>${toolJs}</script>` : ""}
</body>
</html>
`;
  return { path: r.path, html };
}

function sitemap(ctx: Ctx, releases: Release[]): string {
  const rows = [
    ...SITE_PAGES.map((p) => `<url><loc>${SITE}${p}</loc></url>`),
    ...releases.map((r) => {
      const c = ctx.content.get(`${r.lang}:${r.page.id}`)!;
      const pub = dateOfDay(r.day);
      return `<url><loc>${SITE}${r.path}</loc><lastmod>${c.updated > pub ? c.updated : pub}</lastmod></url>`;
    }),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join("\n")}\n</urlset>\n`;
}

function llms(ctx: Ctx, releases: Release[]): string {
  const lines = releases.map((r) => {
    const c = ctx.content.get(`${r.lang}:${r.page.id}`)!;
    return `- [${c.title}](${SITE}${r.path}): ${c.description}`;
  });
  return `# MDG Services: the MDG 2024 guide\n\n> Plain-language explanations of the Marketing Discipline Guidelines 2024 (MDG 2024) for Indian petrol pump dealers, in English and Hindi, by MDG Services. Not the official text: refer to the oil companies' official MDG and circulars for accurate and current rules. MDG Services is not affiliated with IndianOil, BPCL or HPCL.\n\n## Pages\n\n${lines.join("\n")}\n`;
}

/** One snapshot: every page live on `day` (that has words), with links between live pages only. */
function snapshot(root: string, content: Map<string, PageContent>, day: number): { pages: Rendered[]; sitemap: string; llms: string } {
  const releases = RELEASES.filter((r) => r.day <= day && content.has(`${r.lang}:${r.page.id}`));
  const ctx: Ctx = { root, day, live: new Set(releases.map((r) => `${r.lang}:${r.page.id}`)), content };
  return { pages: releases.map((r) => renderPage(ctx, r)), sitemap: sitemap(ctx, releases), llms: llms(ctx, releases) };
}

/**
 * The whole guide as files for dist/: one folder per release day.
 * `allowMissing` (local preview only) skips pages with no words yet instead of failing.
 */
export function buildGuide(opts: { root: string; allowMissing?: boolean; skipPages?: boolean }): GuideFile[] {
  if (opts.skipPages) {
    // Site-only deploy: every day's sitemap and llms.txt, no guide pages.
    return Array.from({ length: LAST_DAY + 1 }, (_, day) => snapshot(opts.root, new Map(), day)).flatMap((s, day) => [
      { fileName: `${snapshotDir(day).slice(1)}/sitemap.xml`, source: s.sitemap },
      { fileName: `${snapshotDir(day).slice(1)}/llms.txt`, source: s.llms },
    ]);
  }
  const { content, errors } = loadAll(opts.root);
  const real = errors.filter((e) => !(opts.allowMissing && e.endsWith(": missing")));
  if (real.length) throw new Error(`MDG guide content has ${real.length} problem(s):\n  ${real.join("\n  ")}`);
  const files: GuideFile[] = [];
  // Day 0 is the eve of launch: a sitemap with the site's own pages and no guide pages yet.
  for (let day = 0; day <= LAST_DAY; day++) {
    const s = snapshot(opts.root, content, day);
    const dir = snapshotDir(day).slice(1);
    for (const p of s.pages) files.push({ fileName: `${dir}${p.path}index.html`, source: p.html });
    files.push({ fileName: `${dir}/sitemap.xml`, source: s.sitemap });
    files.push({ fileName: `${dir}/llms.txt`, source: s.llms });
  }
  return files;
}

/**
 * Every page as if all were live, at its public path (for local review).
 * Pages with no words yet are left out.
 */
export function buildPreview(opts: { root: string }): { files: GuideFile[]; errors: string[] } {
  const { content, errors } = loadAll(opts.root);
  const releases = RELEASES.filter((r) => content.has(`${r.lang}:${r.page.id}`));
  const ctx: Ctx = { root: opts.root, day: LAST_DAY, live: new Set(releases.map((r) => `${r.lang}:${r.page.id}`)), content };
  const files = releases.map((r) => ({ fileName: `${r.path.slice(1)}index.html`, source: renderPage(ctx, r).html }));
  files.push({ fileName: "sitemap.xml", source: sitemap(ctx, releases) }, { fileName: "llms.txt", source: llms(ctx, releases) });
  return { files, errors };
}
