/**
 * What the guide pages are made of, apart from how they look: which pages are
 * live, where a link to one should point, how the Markdown becomes HTML, and
 * the structured data search engines read.
 *
 * "Live" is a matter of the date. guide/schedule.ts puts each page on a day
 * (five a day, India time); a page is live from that day on. Every page that
 * is live links only to pages that are live, so the links, the lists and the
 * sitemap grow by themselves each day with no deploy.
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { Marked, type Renderer, type Tokens } from "marked";
import { PAGES, PILLARS, VIDEOS, byId, pathOf, type GuidePage, type Lang } from "../../guide/inventory.ts";
import { RELEASES, LAST_DAY, dateOfDay, dayOf, type Release } from "../../guide/schedule.ts";
import { SITE, UI } from "../../guide/copy.ts";
import { loadAll, type PageContent } from "./content.ts";

export type { Lang, Release, GuidePage, PageContent };
export { PAGES, PILLARS, VIDEOS, byId, pathOf, RELEASES, LAST_DAY, dateOfDay, SITE, UI };

// ── Reading the words (once per server) ─────────────────────────────────

let loaded: Map<string, PageContent> | undefined;

/**
 * Every page's words, read and checked once. A page that is missing or breaks a
 * rule throws here, so a build with a bad page fails instead of shipping it.
 *
 *  - GUIDE_ALLOW_MISSING=1 lets pages with no words yet be skipped (a local
 *    test build only; a real build needs every page).
 *  - GUIDE_SKIP=1 ships the site with no guide pages at all.
 */
export function loadContent(): Map<string, PageContent> {
  if (loaded) return loaded;
  if (process.env.GUIDE_SKIP === "1") return (loaded = new Map());
  const { content, errors } = loadAll(process.cwd());
  const real = errors.filter((e) => !(process.env.GUIDE_ALLOW_MISSING === "1" && e.endsWith(": missing")));
  if (real.length) throw new Error(`MDG guide content has ${real.length} problem(s):\n  ${real.join("\n  ")}`);
  return (loaded = content);
}

/** The page's script, for a tool page ("" for any other page or a tool with no script). */
export function toolScript(page: GuidePage): string {
  if (page.type !== "Tool") return "";
  const file = path.join(process.cwd(), "guide", "tools", `${page.id}.js`);
  return existsSync(file) ? readFileSync(file, "utf8") : "";
}

// ── Which pages are live ────────────────────────────────────────────────

export interface Ctx {
  day: number;
  live: Set<string>; // "lang:id"
  content: Map<string, PageContent>;
}

/** The pages that have words and whose day has come, as of `day`. */
export function releasesOn(content: Map<string, PageContent>, day: number): Release[] {
  return RELEASES.filter((r) => r.day <= day && content.has(`${r.lang}:${r.page.id}`));
}

/**
 * The picture of the guide as of `now`. `atLeast` is a page's own release day:
 * a page is always built as if it were live, so one built ahead of its day (at
 * deploy time) never links to itself as missing.
 */
export function contextAt(now: Date, atLeast = 0): Ctx {
  const content = loadContent();
  const day = Math.min(LAST_DAY, Math.max(dayOf(now), atLeast));
  return { day, content, live: new Set(releasesOn(content, day).map((r) => `${r.lang}:${r.page.id}`)) };
}

export function isLive(ctx: Ctx, id: string, lang: Lang): boolean {
  return ctx.live.has(`${lang}:${id}`);
}

/** Where a link to page `id` should point from a page in `lang`: same language if live, else English if live. */
export function target(ctx: Ctx, id: string, lang: Lang): { href: string; lang: Lang } | null {
  const p = byId.get(id);
  if (!p) return null;
  if (isLive(ctx, id, lang)) return { href: pathOf(p, lang), lang };
  if (lang === "hi" && isLive(ctx, id, "en")) return { href: pathOf(p, "en"), lang: "en" };
  return null;
}

export function titleOf(ctx: Ctx, id: string, lang: Lang): string {
  return ctx.content.get(`${lang}:${id}`)?.title || ctx.content.get(`en:${id}`)?.title || id;
}

export function descriptionOf(ctx: Ctx, id: string, lang: Lang): string {
  return ctx.content.get(`${lang}:${id}`)?.description || ctx.content.get(`en:${id}`)?.description || "";
}

/** The page at a public path ("/hi/guides/density/"), with its language. */
const BY_PATH = new Map(RELEASES.map((r) => [r.path, r]));
export function releaseAt(pathname: string): Release | undefined {
  return BY_PATH.get(pathname);
}

// ── Markdown to HTML ─────────────────────────────────────────────────────

const MONTHS: Record<Lang, string[]> = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  hi: ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
};

/** "2026-10-15" -> "15 October 2026" / "15 अक्टूबर 2026" */
export function longDate(iso: string, lang: Lang): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[lang][m - 1]} ${y}`;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** {{5.1.9}} -> a clause tag. */
function clauseTags(html: string, lang: Lang): string {
  return html.replace(/\{\{([^}]+)\}\}/g, (_, raw: string) => {
    const t = raw.trim();
    let label: string;
    if (/^circular$/i.test(t)) label = lang === "hi" ? "सर्कुलर 20.03.2025" : "Circular 20.03.2025";
    else if (t.startsWith("2012:")) label = `MDG 2012 ${t.slice(5)}`;
    else if (/^annexure/i.test(t)) label = `MDG Annexure ${t.replace(/^annexure\s*/i, "")}`;
    else if (/^[0-9]/.test(t)) label = `MDG ${t}`;
    // Words, not a clause number: "cover page", "introduction", "chapter 6, item 4"
    else label = `MDG 2024, ${t.charAt(0).toLowerCase()}${t.slice(1)}`;
    return `<span class="cl">${esc(label)}</span>`;
  });
}

/**
 * The compact note a penalty page can ask for with `{{penalty-note}}` on a
 * line of its own: the three qualifiers that belong beside every penalty
 * amount, in the page's language. The clause numbers are ordinary `{{…}}` tags,
 * so they draw as clause chips like every other reference (the words are the
 * content owner's, as shipped in the static pages on main).
 */
export const PENALTY_NOTE: Record<Lang, string> = {
  en: "These amounts are the minimum: the oil company may take higher action, up to termination {{8.5.1}}. An irregularity must be established first {{8.5.2}}. Instances are counted over five years, including the previous guideline {{8.5.5}}.",
  hi: "ये रकम कम से कम की कार्रवाई हैं: तेल कंपनी इससे ज़्यादा कार्रवाई कर सकती है, टर्मिनेशन तक {{8.5.1}}। कार्रवाई से पहले अनियमितता साबित होनी चाहिए {{8.5.2}}। गिनती पाँच साल की होती है, पिछली गाइडलाइन समेत {{8.5.5}}।",
};

function penaltyNotes(md: string, lang: Lang): string {
  const box = `<aside class="penalty-note" lang="${lang}"><p>${esc(PENALTY_NOTE[lang])}</p></aside>`;
  return md.replace(/^[ \t]*\{\{\s*penalty-note\s*\}\}[ \t]*$/gim, `\n${box}\n`);
}

function makeMarked(ctx: Ctx, lang: Lang): Marked {
  const md = new Marked({ gfm: true });
  let h2 = 0;
  md.use({
    renderer: {
      // Every ## heading gets an address (s1, s2, ...) so a long page can offer jump links.
      heading(this: Renderer, token: Tokens.Heading) {
        const inner = this.parser.parseInline(token.tokens);
        return token.depth === 2 ? `<h2 id="s${++h2}">${inner}</h2>\n` : `<h${token.depth}>${inner}</h${token.depth}>\n`;
      },
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

/** The page's Markdown body as HTML: links resolved, tables made to scroll, clause tags drawn. */
export function renderBody(ctx: Ctx, lang: Lang, body: string): string {
  const md = makeMarked(ctx, lang);
  let html = md.parse(penaltyNotes(body, lang), { async: false }) as string;
  html = html.replace(/<table>/g, '<div class="tw"><table>').replace(/<\/table>/g, "</table></div>");
  return clauseTags(html, lang);
}

/** Inline Markdown only (answers, questions): no paragraphs. */
export function renderInline(ctx: Ctx, lang: Lang, s: string): string {
  return clauseTags(makeMarked(ctx, lang).parseInline(s, { async: false }) as string, lang);
}

/** A heading's words without Markdown marks, links or clause tags. */
function plainHeading(s: string): string {
  return s
    .replace(/\{\{[^}]+\}\}/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** The page's ## headings in order, with the addresses `renderBody` gave them (s1, s2, ...). */
export function outline(body: string): { id: string; text: string }[] {
  const md = new Marked({ gfm: true });
  const out: { id: string; text: string }[] = [];
  md.walkTokens(md.lexer(body), (token) => {
    if (token.type === "heading" && (token as Tokens.Heading).depth === 2) {
      out.push({ id: `s${out.length + 1}`, text: plainHeading((token as Tokens.Heading).text) });
    }
  });
  return out;
}

/** Plain text for structured data: tags and Markdown marks removed. */
export function stripMd(s: string): string {
  return s.replace(/\{\{([^}]+)\}\}/g, (_, t) => `MDG ${t}`).replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_`]/g, "");
}

// ── What a page needs to be drawn ────────────────────────────────────────

export interface Crumb {
  name: string;
  href: string;
}

export interface Card {
  href: string;
  title: string;
  description: string;
  /** shown beside the title when the card points at the other language's page */
  otherLang?: boolean;
  /** hub topic cards: how many pages the topic has */
  count?: number;
}

export interface PageModel {
  release: Release;
  page: GuidePage;
  lang: Lang;
  c: PageContent;
  url: string;
  published: string;
  modified: string;
  crumbs: Crumb[];
  /** the other language's address, when that page is live */
  twin: { lang: Lang; href: string } | null;
  /** the guides hub in this page's language (or English), when live */
  hub: { href: string } | null;
  /** cards under a heading: topics on the hub, the pages of a topic on its main page */
  children: { heading: string; cards: Card[] }[];
  related: Card[];
  videos: { href: string; title: string }[];
  pillarLinks: { href: string; label: string }[];
  disclaimerHref: string | null;
  updatesHref: string | null;
}

export function buildPageModel(ctx: Ctx, r: Release): PageModel {
  const { page, lang } = r;
  const c = ctx.content.get(`${lang}:${page.id}`)!;
  const t = UI[lang];
  const url = `${SITE}${r.path}`;
  const twinLang: Lang = lang === "en" ? "hi" : "en";
  const twinLive = page.hi && isLive(ctx, page.id, twinLang);
  const pillar = PILLARS[page.pillar];
  const mainId = pillar.main;
  const isMain = mainId === page.id;
  const published = dateOfDay(r.day);
  const modified = c.updated > published ? c.updated : published;

  // Breadcrumb: guide home > topic main page > this page
  const crumbs: Crumb[] = [{ name: t.home, href: lang === "hi" ? "/hi" : "/" }];
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
  const children: PageModel["children"] = [];
  if (page.id === "hub") {
    const topics: Card[] = [];
    for (const k of Object.keys(PILLARS) as (keyof typeof PILLARS)[]) {
      if (k === "hub" || k === "tools") continue;
      const tgt = target(ctx, PILLARS[k].main, lang);
      if (!tgt) continue;
      topics.push({
        href: tgt.href,
        title: lang === "hi" ? PILLARS[k].hi : PILLARS[k].en,
        description: descriptionOf(ctx, PILLARS[k].main, tgt.lang),
        count: PAGES.filter((p) => p.pillar === k && target(ctx, p.id, lang)).length,
      });
    }
    if (topics.length) children.push({ heading: t.topics, cards: topics });
    const extra: Card[] = [];
    for (const p of PAGES.filter((p) => (p.pillar === "hub" && p.id !== "hub") || p.pillar === "tools")) {
      const tgt = target(ctx, p.id, lang);
      if (!tgt) continue;
      extra.push({ href: tgt.href, title: titleOf(ctx, p.id, tgt.lang), description: descriptionOf(ctx, p.id, tgt.lang) });
    }
    if (extra.length) children.push({ heading: `${t.tools} · ${t.updates}`, cards: extra });
  } else if (isMain && page.pillar !== "tools") {
    const cards: Card[] = [];
    for (const p of PAGES.filter((p) => p.pillar === page.pillar && p.id !== page.id)) {
      const tgt = target(ctx, p.id, lang);
      if (!tgt) continue;
      cards.push({
        href: tgt.href,
        title: titleOf(ctx, p.id, tgt.lang),
        description: descriptionOf(ctx, p.id, tgt.lang),
        otherLang: tgt.lang !== lang,
      });
    }
    if (cards.length) children.push({ heading: t.inSection, cards });
  }

  // Related: hand-picked first, then other pages on the same topic
  const relIds = [...(c.related || []), ...PAGES.filter((p) => p.pillar === page.pillar && p.id !== page.id && p.id !== mainId).map((p) => p.id)];
  const seen = new Set<string>();
  const related: Card[] = relIds
    .filter((id) => id !== page.id && !seen.has(id) && seen.add(id))
    .map((id) => ({ id, tgt: target(ctx, id, lang) }))
    .filter((x): x is { id: string; tgt: { href: string; lang: Lang } } => x.tgt !== null)
    .slice(0, 4)
    .map(({ id, tgt }) => ({ href: tgt.href, title: titleOf(ctx, id, tgt.lang), description: descriptionOf(ctx, id, tgt.lang) }));

  const videos = (page.videos || [])
    .filter((v) => VIDEOS[v])
    .map((v) => ({ href: `https://guide.mdgservices.in/${v}-${lang}`, title: VIDEOS[v][lang] }));

  const pillarLinks: PageModel["pillarLinks"] = [];
  for (const k of Object.keys(PILLARS) as (keyof typeof PILLARS)[]) {
    if (k === "hub" || k === "tools") continue;
    const tgt = target(ctx, PILLARS[k].main, lang);
    if (tgt) pillarLinks.push({ href: tgt.href, label: lang === "hi" ? PILLARS[k].hi : PILLARS[k].en });
  }

  return {
    release: r,
    page,
    lang,
    c,
    url,
    published,
    modified,
    crumbs,
    twin: twinLive ? { lang: twinLang, href: pathOf(page, twinLang) } : null,
    hub: target(ctx, "hub", lang),
    children,
    related,
    videos,
    pillarLinks,
    disclaimerHref: target(ctx, "disclaimer", lang)?.href ?? null,
    updatesHref: target(ctx, "official-pdf-and-updates", lang)?.href ?? null,
  };
}

// ── Structured data ──────────────────────────────────────────────────────

const ORG = {
  "@type": "Organization",
  "@id": `${SITE}/#org`,
  name: "MDG Services",
  legalName: "VRUOOM PRIVATE LIMITED",
  url: `${SITE}/`,
  logo: `${SITE}/logo-mark.png`,
};

/** Organization, BreadcrumbList, Article / WebPage and (when the page has questions) FAQPage. */
export function structuredData(m: PageModel): unknown[] {
  const { page, lang, c, url } = m;
  const ld: unknown[] = [
    { "@context": "https://schema.org", ...ORG },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: m.crumbs.map((b, i) => ({ "@type": "ListItem", position: i + 1, name: b.name, item: `${SITE}${b.href}` })),
    },
    {
      "@context": "https://schema.org",
      "@type": page.type === "Hub" || page.type === "Legal" || page.type === "Tool" ? "WebPage" : "Article",
      headline: c.title,
      description: c.description,
      inLanguage: lang === "hi" ? "hi-IN" : "en-IN",
      datePublished: m.published,
      dateModified: m.modified,
      mainEntityOfPage: url,
      url,
      publisher: { "@id": `${SITE}/#org` },
      author: { "@id": `${SITE}/#org` },
      isAccessibleForFree: true,
      about: { "@type": "CreativeWork", name: "Marketing Discipline Guidelines 2024 (MDG 2024)" },
    },
  ];
  if (c.faq?.length) {
    ld.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: c.faq.map((f) => ({ "@type": "Question", name: stripMd(f.q), acceptedAnswer: { "@type": "Answer", text: stripMd(f.a) } })),
    });
  }
  return ld;
}
