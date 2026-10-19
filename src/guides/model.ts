/**
 * What the guide pages are made of, apart from how they look: which pages are
 * live, where a link to one should point, how the Markdown becomes HTML, and
 * the structured data search engines read. It serves both collections (the
 * MDG guides and the Khata Kavach pages, src/guides/collections.ts): every
 * function works on a `Ctx`, which carries its collection.
 *
 * "Live" is a matter of the date. Each collection's schedule puts each page on
 * a day (five a day, India time); a page is live from that day on. Every page
 * that is live links only to pages that are live, so the links, the lists and
 * the sitemap grow by themselves each day with no deploy.
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { Marked, type Renderer, type Tokens } from "marked";
import { pathIn } from "../../guide/calendar.ts";
import { SITE } from "../../guide/copy.ts";
import { loadAll, type PageContent } from "./content.ts";
import { esc } from "./tags.ts";
import { ALL, COLLECTIONS, KK, MDG } from "./collections.ts";
import type { AnyPage, AnyRelease, Collection, CollectionKey, Crumb, Lang } from "./collection.ts";

export type { Lang, PageContent, AnyPage, AnyRelease, Collection, CollectionKey, Crumb };
export { SITE, ALL, COLLECTIONS, MDG, KK };

/** The public path of a page in a language. */
export const pathOf = pathIn;

// ── Reading the words (once per server) ─────────────────────────────────

const loaded = new Map<CollectionKey, Map<string, PageContent>>();

/**
 * Every page's words, read and checked once per collection. A page that is
 * missing or breaks a rule throws here, so a build with a bad page fails
 * instead of shipping it.
 *
 *  - GUIDE_ALLOW_MISSING=1 lets pages with no words yet be skipped (a local
 *    test build only; a real build needs every page).
 *  - GUIDE_SKIP=1 ships the site with no guide pages at all.
 */
export function loadContent(col: Collection): Map<string, PageContent> {
  const hit = loaded.get(col.key);
  if (hit) return hit;
  if (process.env.GUIDE_SKIP === "1") {
    loaded.set(col.key, new Map());
    return loaded.get(col.key)!;
  }
  const { content, errors } = loadAll(process.cwd(), col);
  const real = errors.filter((e) => !(process.env.GUIDE_ALLOW_MISSING === "1" && e.endsWith(": missing")));
  if (real.length) throw new Error(`${col.label} content has ${real.length} problem(s):\n  ${real.join("\n  ")}`);
  loaded.set(col.key, content);
  return content;
}

/** The page's script, for a tool page ("" for any other page or a tool with no script). */
export function toolScript(col: Collection, page: AnyPage): string {
  if (page.type !== "Tool") return "";
  const file = path.join(process.cwd(), col.toolsDir, `${page.id}.js`);
  return existsSync(file) ? readFileSync(file, "utf8") : "";
}

// ── Which pages are live ────────────────────────────────────────────────

export interface Ctx {
  col: Collection;
  day: number;
  live: Set<string>; // "lang:id"
  content: Map<string, PageContent>;
}

/** The pages that have words and whose day has come, as of `day`. */
export function releasesOn(col: Collection, content: Map<string, PageContent>, day: number): AnyRelease[] {
  return col.releases.filter((r) => r.day <= day && content.has(`${r.lang}:${r.page.id}`));
}

/**
 * The picture of a collection as of `now`. `atLeast` is a page's own release
 * day: a page is always built as if it were live, so one built ahead of its
 * day (at deploy time) never links to itself as missing.
 */
export function contextAt(col: Collection, now: Date, atLeast = 0): Ctx {
  const content = loadContent(col);
  const day = Math.min(col.lastDay, Math.max(col.dayOf(now), atLeast));
  return { col, day, content, live: new Set(releasesOn(col, content, day).map((r) => `${r.lang}:${r.page.id}`)) };
}

export function isLive(ctx: Ctx, id: string, lang: Lang): boolean {
  return ctx.live.has(`${lang}:${id}`);
}

/** Where a link to page `id` should point from a page in `lang`: same language if live, else English if live. */
export function target(ctx: Ctx, id: string, lang: Lang): { href: string; lang: Lang } | null {
  const p = ctx.col.byId.get(id);
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

/** The page at a public path ("/hi/guides/density/") in a collection, with its language. */
const BY_PATH = new Map<CollectionKey, Map<string, AnyRelease>>(ALL.map((c) => [c.key, new Map(c.releases.map((r) => [r.path, r]))]));
export function releaseAt(col: Collection, pathname: string): AnyRelease | undefined {
  return BY_PATH.get(col.key)!.get(pathname);
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

const TABLE_WORD: Record<Lang, string> = { en: "Table", hi: "तालिका" };

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
      // A table scrolls sideways in its own box (a keyboard can scroll it too).
      // With three or more columns it is stacked on a phone instead, each row a
      // small card whose cells carry their column's name (`data-label`), so the
      // words are never squeezed into a sliver of a column. See `.tw-stack`.
      table(this: Renderer, token: Tokens.Table) {
        const names = token.header.map((h) => plainHeading(h.text));
        const align = (a: Tokens.TableCell["align"]) => (a ? ` align="${a}"` : "");
        // explicit roles: stacked cells are display:block, which some browsers read as "no longer a table"
        const head = token.header
          .map((h) => `<th role="columnheader" scope="col"${align(h.align)}>${this.parser.parseInline(h.tokens)}</th>`)
          .join("");
        const rows = token.rows
          .map(
            (row) =>
              `<tr role="row">${row
                .map((c, i) => `<td role="cell" data-label="${esc(names[i] ?? "")}"${align(c.align)}>${this.parser.parseInline(c.tokens)}</td>`)
                .join("")}</tr>`,
          )
          .join("\n");
        const label = `${TABLE_WORD[lang]}: ${names.filter(Boolean).join(", ")}`.slice(0, 120);
        const stack = token.header.length >= 3 ? " tw-stack" : "";
        return `<div class="tw${stack}" role="group" tabindex="0" aria-label="${esc(label)}"><table role="table"><thead role="rowgroup"><tr role="row">${head}</tr></thead><tbody role="rowgroup">\n${rows}\n</tbody></table></div>\n`;
      },
      link(this: Renderer, token: Tokens.Link) {
        const text = this.parser.parseInline(token.tokens);
        const href = token.href || "";
        if (href.startsWith("@")) {
          const [id, hash] = href.slice(1).split("#");
          const t = target(ctx, id, lang);
          if (!t) return text; // not live yet: plain words, no dead link
          const note = t.lang !== lang ? ` <span class="ln">(${ctx.col.ui[lang].english})</span>` : "";
          return `<a href="${t.href}${hash ? `#${hash}` : ""}">${text}</a>${note}`;
        }
        const ext = /^https?:\/\//.test(href) && !href.startsWith(SITE);
        return `<a href="${esc(href)}"${ext ? ' rel="noopener" target="_blank"' : ""}>${text}</a>`;
      },
    },
  });
  return md;
}

/** The page's Markdown body as HTML: links resolved, tables made to scroll or stack, tags drawn. */
export function renderBody(ctx: Ctx, lang: Lang, body: string): string {
  const md = makeMarked(ctx, lang);
  return ctx.col.tags(md.parse(ctx.col.prepare(body, lang), { async: false }) as string, lang);
}

/** Inline Markdown only (answers, questions): no paragraphs. */
export function renderInline(ctx: Ctx, lang: Lang, s: string): string {
  return ctx.col.tags(makeMarked(ctx, lang).parseInline(s, { async: false }) as string, lang);
}

/** A heading's words without Markdown marks, links or tags. */
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

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };

/**
 * The words a reader sees, as plain text: `renderInline`'s HTML with its tags
 * dropped and its entities turned back into characters. Structured data is
 * built from this, so the FAQ markup is the same text as the visible answer
 * (tags in the page's own language included), never a second version.
 */
export function visibleText(ctx: Ctx, lang: Lang, s: string): string {
  return renderInline(ctx, lang, s)
    .replace(/<[^>]+>/g, "")
    .replace(/&(?:#x([0-9a-f]+)|#(\d+)|([a-z]+));/gi, (m, hex: string | undefined, dec: string | undefined, name: string | undefined) => {
      if (hex) return String.fromCodePoint(parseInt(hex, 16));
      if (dec) return String.fromCodePoint(Number(dec));
      return ENTITIES[(name || "").toLowerCase()] ?? m;
    })
    .replace(/\s+/g, " ")
    .trim();
}

// ── What a page needs to be drawn ────────────────────────────────────────

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
  release: AnyRelease;
  page: AnyPage;
  lang: Lang;
  c: PageContent;
  url: string;
  published: string;
  modified: string;
  crumbs: Crumb[];
  /** the other language's address, when that page is live */
  twin: { lang: Lang; href: string } | null;
  /** the collection's front door in this page's language (or English), when live */
  hub: { href: string } | null;
  /** cards under a heading: topics on the hub, the pages of a topic on its main page */
  children: { heading: string; cards: Card[] }[];
  related: Card[];
  videos: { href: string; title: string }[];
  pillarLinks: { href: string; label: string }[];
  disclaimerHref: string | null;
  updatesHref: string | null;
}

/** A topic is a pillar with pages of its own, not the front door or the tools. */
function topics(col: Collection): string[] {
  return Object.keys(col.pillars).filter((k) => !col.notTopics.includes(k));
}

export function buildPageModel(ctx: Ctx, r: AnyRelease): PageModel {
  const { col } = ctx;
  const { page, lang } = r;
  const c = ctx.content.get(`${lang}:${page.id}`)!;
  const t = col.ui[lang];
  const url = `${SITE}${r.path}`;
  const twinLang: Lang = lang === "en" ? "hi" : "en";
  const twinLive = page.hi && isLive(ctx, page.id, twinLang);
  const pillar = col.pillars[page.pillar];
  const mainId = pillar.main;
  const isMain = mainId === page.id;
  const published = col.dateOfDay(r.day);
  // the same day the sitemap gives (a hub or topic page also changes when a page it lists goes live)
  const modified = lastModified(ctx, r);
  const isTopicPage = !col.notTopics.includes(page.pillar);

  // Breadcrumb: home > (the product) > the collection's front door > topic main page > this page
  const crumbs: Crumb[] = [{ name: t.home, href: lang === "hi" ? "/hi" : "/" }, ...col.crumbsBefore(lang)];
  if (page.id !== "hub") {
    const hub = col.hubInCrumbs ? target(ctx, "hub", lang) : null;
    if (hub) crumbs.push({ name: t.guide, href: hub.href });
    if (!isMain && isTopicPage) {
      const m = target(ctx, mainId, lang);
      if (m) crumbs.push({ name: lang === "hi" ? pillar.hi : pillar.en, href: m.href });
    }
  }
  // the hub is called "Guides" here as it is on every page below it, not by its long headline
  crumbs.push({ name: page.id === "hub" ? t.guide : c.title, href: r.path });

  // Pages under a topic's main page, and the topic list on the hub
  const children: PageModel["children"] = [];
  if (page.id === "hub") {
    const cards: Card[] = [];
    for (const k of topics(col)) {
      const tgt = target(ctx, col.pillars[k].main, lang);
      if (!tgt) continue;
      cards.push({
        href: tgt.href,
        title: lang === "hi" ? col.pillars[k].hi : col.pillars[k].en,
        description: col.topicBlurb[k]?.[lang] ?? descriptionOf(ctx, col.pillars[k].main, tgt.lang),
        count: col.pages.filter((p) => p.pillar === k && target(ctx, p.id, lang)).length,
      });
    }
    if (cards.length) children.push({ heading: t.topics, cards });
    const extra: Card[] = [];
    for (const p of col.pages.filter((p) => col.notTopics.includes(p.pillar) && p.id !== "hub")) {
      const tgt = target(ctx, p.id, lang);
      if (!tgt) continue;
      extra.push({ href: tgt.href, title: titleOf(ctx, p.id, tgt.lang), description: descriptionOf(ctx, p.id, tgt.lang) });
    }
    if (extra.length) children.push({ heading: t.toolsAndReference, cards: extra });
  } else if (isMain && isTopicPage) {
    const cards: Card[] = [];
    for (const p of col.pages.filter((p) => p.pillar === page.pillar && p.id !== page.id)) {
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
  const relIds = [...(c.related || []), ...col.pages.filter((p) => p.pillar === page.pillar && p.id !== page.id && p.id !== mainId).map((p) => p.id)];
  const seen = new Set<string>();
  const related: Card[] = relIds
    .filter((id) => id !== page.id && !seen.has(id) && seen.add(id))
    .map((id) => ({ id, tgt: target(ctx, id, lang) }))
    .filter((x): x is { id: string; tgt: { href: string; lang: Lang } } => x.tgt !== null)
    .slice(0, 4)
    .map(({ id, tgt }) => ({ href: tgt.href, title: titleOf(ctx, id, tgt.lang), description: descriptionOf(ctx, id, tgt.lang) }));

  const videos = (page.videos || [])
    .filter((v) => col.videos[v])
    .map((v) => ({ href: `https://guide.mdgservices.in/${v}-${lang}`, title: col.videos[v][lang] }));

  const pillarLinks: PageModel["pillarLinks"] = [];
  for (const k of topics(col)) {
    const tgt = target(ctx, col.pillars[k].main, lang);
    if (tgt) pillarLinks.push({ href: tgt.href, label: lang === "hi" ? col.pillars[k].hi : col.pillars[k].en });
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
    updatesHref: col.updatesId ? (target(ctx, col.updatesId, lang)?.href ?? null) : null,
  };
}

/**
 * The day a page last changed, for the sitemap. A page's own date is its
 * `updated` day or the day it went live, whichever is later. A page that lists
 * other pages (the hub, a topic's main page) also changes whenever one of them
 * goes live, so its date is the newest release day among them.
 */
export function lastModified(ctx: Ctx, r: AnyRelease): string {
  const { col } = ctx;
  const published = col.dateOfDay(r.day);
  const updated = ctx.content.get(`${r.lang}:${r.page.id}`)!.updated;
  let latest = updated > published ? updated : published;
  const isHub = r.page.id === "hub";
  const listsOthers = isHub || (col.pillars[r.page.pillar].main === r.page.id && !col.notTopics.includes(r.page.pillar));
  if (listsOthers) {
    for (const x of releasesOn(col, ctx.content, ctx.day)) {
      if (!isHub && x.page.pillar !== r.page.pillar) continue;
      const d = col.dateOfDay(x.day);
      if (d > latest) latest = d;
    }
  }
  return latest;
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
export function structuredData(ctx: Ctx, m: PageModel): unknown[] {
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
      about: ctx.col.about(page, lang),
    },
  ];
  if (c.faq?.length) {
    ld.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: c.faq.map((f) => ({ "@type": "Question", name: visibleText(ctx, lang, f.q), acceptedAnswer: { "@type": "Answer", text: visibleText(ctx, lang, f.a) } })),
    });
  }
  return ld;
}
