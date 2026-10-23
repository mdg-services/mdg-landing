/**
 * A collection is one set of guide pages with its own list, calendar, words
 * and look. The site has two:
 *
 *  - "mdg": the guides to the Marketing Discipline Guidelines 2024, at /guides/
 *    and /tools/ (guide/).
 *  - "kk": the Khata Kavach pages on giving and keeping credit, at
 *    /khata-kavach/… (kk-guide/).
 *
 * The page builder (model.ts), the renderer (GuidePage.tsx), the rules
 * (content.ts), the sitemap, llms.txt and the daily IndexNow call all take a
 * collection, so the two share one machine and cannot drift apart. What
 * differs between them lives here, in the collection object
 * (src/guides/collections.ts).
 *
 * No React and no Node APIs: the command line bundles this too.
 */
import type { PageType, PillarMeta } from "../../guide/inventory.ts";
import type { Lang, Release } from "../../guide/calendar.ts";

export type { Lang, PageType, PillarMeta };

export type CollectionKey = "mdg" | "kk";

/** What every guide page, of either collection, carries. */
export interface AnyPage {
  /** File name in <contentDir>/<lang>/, and the id used by [text](@id) links. */
  id: string;
  pillar: string;
  /** English path, with trailing slash. The Hindi twin lives at "/hi" + path. */
  path: string;
  hi: boolean;
  type: PageType;
  wave: number;
  /** Real searches this page answers. */
  queries: string[];
  /** Explainer videos (ids like `gen-dod-clock`, without the -hi / -en suffix) shown on the page; each lives at /videos/<slug> (MDG only). */
  videos?: string[];
  brief: string;
}

export type AnyRelease = Release<AnyPage>;

export interface Crumb {
  name: string;
  href: string;
}

/**
 * The classes that colour a page. Literal strings, so Tailwind finds them;
 * everything else (the prose, cards, links) is themed by the page's wrapper
 * class in index.css (`.kk-guide`).
 */
export interface Look {
  /** the page's wrapper */
  root: string;
  /** the band behind the breadcrumb, title and short answer */
  hero: string;
  /** the soft glow in the band's corner */
  heroGlow: string;
  /** the short answer's words */
  answerText: string;
  /** a card title when the card is hovered */
  cardHover: string;
  /** the number before each question */
  faqNumber: string;
  /** the closing box */
  ctaBox: string;
  ctaGlow: string;
  ctaTitle: string;
  ctaText: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface Cta {
  title: string;
  text: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
}

export interface Collection {
  key: CollectionKey;
  /** how errors name this collection: "MDG guide", "Khata Kavach pages" */
  label: string;
  pages: AnyPage[];
  byId: Map<string, AnyPage>;
  pillars: Record<string, PillarMeta>;
  /** pillars that are not topics: no topic card, no topic link (the front door, the tools) */
  notTopics: string[];
  videos: Record<string, { en: string; hi: string }>;
  releases: AnyRelease[];
  lastDay: number;
  dayOf: (now: Date) => number;
  dateOfDay: (day: number) => string;
  /** where the words live, from the project root: <contentDir>/<lang>/<id>.md */
  contentDir: string;
  /** where a tool page's script lives: <toolsDir>/<id>.js */
  toolsDir: string;
  /** the fixed words around the content */
  ui: Record<Lang, Record<string, string>>;
  /** the notice under the title, on every page */
  notice: Record<Lang, string>;
  /** the full disclaimer: at the foot of every page, and the whole of the disclaimer page */
  disclaimer: Record<Lang, [string, string][]>;
  /** one line per topic, for the topic cards */
  topicBlurb: Record<string, Record<Lang, string>>;
  /** the page linked as "updates" in the small print, if any */
  updatesId: string | null;
  /** crumbs between Home and the page's own trail ("Khata Kavach") */
  crumbsBefore: (lang: Lang) => Crumb[];
  /** whether the front door (the hub) is a step in every page's trail */
  hubInCrumbs: boolean;
  /** Markdown, before it is parsed (the MDG penalty note) */
  prepare: (md: string, lang: Lang) => string;
  /** HTML, after it is parsed: the {{…}} tags drawn as small chips */
  tags: (html: string, lang: Lang) => string;
  /** whether a {{…}} tag's inside is allowed */
  tagOk: (tag: string) => boolean;
  /** words never allowed on a page of this collection, besides the shared ones */
  forbidden: RegExp[];
  /** structured data: what a page is about */
  about: (page: AnyPage, lang: Lang) => Record<string, unknown>;
  /** which navbar item is the current one */
  nav: "guides" | "khata";
  look: Look;
  /** the wrapper class that themes the prose (index.css) */
  themeClass: string;
  /** the MDG "read the official text" box */
  officialBox: boolean;
  /** the closing box, which says it is an advertisement */
  cta: (lang: Lang) => Cta;
}
