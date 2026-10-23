/**
 * The shape of a company page (About us, Contact us, Pricing, Terms, Refund
 * policy, Shipping) and the small builders its copy is written with.
 *
 * Each page is a heading band plus a list of sections, and a section is a list
 * of blocks: a paragraph, a list, a table, a row of cards, a few numbered
 * steps. One view (views/DocPage.tsx) draws all six, so a page is data, the
 * way the guides are, and the two languages are the same data in two files.
 *
 * Any string may carry three bits of markup, resolved when the page renders
 * (lib/docText.ts):
 *   {name}          a fact (the company, the CIN, the email, a price …)
 *   **words**       bold
 *   [label](target) a link: `route:/refund-policy` is a page of this site in
 *                   the language being read, `home:contact` a section of the
 *                   home page, and mailto:, tel:, https: and /privacy go as
 *                   they are.
 */
import type { CompanyRoute } from "./lang";

export type DocLink = { label: string; href: string };

/** A box on a page: a plan, a way of reaching us, a product. */
export type DocCard = {
  /** The small mono label above the title. */
  kicker?: string;
  title: string;
  /** The figure the card is about, set large ("₹3,000"). */
  price?: string;
  /** Under the figure ("a month + GST"). */
  priceNote?: string;
  body: string;
  items?: string[];
  link?: DocLink;
};

export type DocBlock =
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  /** A quiet gold-edged note. */
  | { kind: "note"; text: string }
  /** Label and value, one pair per row. */
  | { kind: "facts"; rows: { k: string; v: string }[] }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "cards"; items: DocCard[] }
  /** Numbered tiles read left to right (top to bottom on a phone). */
  | { kind: "steps"; items: { title: string; body: string }[] };

export type DocSection = {
  /** The jump link's anchor. */
  id: string;
  heading: string;
  blocks: DocBlock[];
};

export type DocPage = {
  /** The browser tab's title. */
  pageTitle: string;
  /** The search-result description, about 155 characters. */
  metaDescription: string;
  eyebrow: string;
  /** The Devanagari gloss on the English page; `undefined` on the Hindi one, where it would say the same thing twice. */
  eyebrowDeva: string | undefined;
  heading: string;
  intro: string;
  /** When the words were last settled, written out ("23 October 2026"). */
  updated: string;
  /** A page that makes a promise: the Hindi side says the English text is the binding one. */
  legal: boolean;
  sections: DocSection[];
};

/* The builders. They return plain objects, so a page's data is still data. */
export const p = (text: string): DocBlock => ({ kind: "p", text });
export const ul = (items: string[]): DocBlock => ({ kind: "ul", items });
export const ol = (items: string[]): DocBlock => ({ kind: "ol", items });
export const note = (text: string): DocBlock => ({ kind: "note", text });
export const facts = (rows: [k: string, v: string][]): DocBlock => ({
  kind: "facts",
  rows: rows.map(([k, v]) => ({ k, v })),
});
export const table = (head: string[], rows: string[][]): DocBlock => ({ kind: "table", head, rows });
export const cards = (items: DocCard[]): DocBlock => ({ kind: "cards", items });
export const steps = (items: [title: string, body: string][]): DocBlock => ({
  kind: "steps",
  items: items.map(([title, body]) => ({ title, body })),
});

/** Which dictionary section holds a company page. */
export const DOC_KEY = {
  "/about": "about",
  "/contact": "contactUs",
  "/pricing": "pricing",
  "/terms": "terms",
  "/refund-policy": "refund",
  "/shipping": "shipping",
} as const satisfies Record<CompanyRoute, string>;
