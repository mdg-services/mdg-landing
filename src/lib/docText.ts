/**
 * The words of a company page, made ready to draw: facts filled in, then
 * split into plain text, bold and links. Pure functions on strings, so the
 * server component that draws a page and anything that checks one share them.
 *
 * The markup is described at the top of i18n/doc.ts. A fact name that does not
 * exist is an error, not a blank: a typo in a price or a phone number must
 * stop the build, never reach a visitor.
 */
import { BRAND, PRICING } from "../data/content";
import { TOLL_FREE } from "./tollFree";
import { getT } from "../i18n/server";
import { homeHref, pathFor, type Lang, type SiteRoute } from "../i18n/lang";

/** 3000 -> "₹3,000". Whole rupees only. */
export function rupees(n: number): string {
  return `₹${new Intl.NumberFormat("en-IN").format(n)}`;
}

/** The facts a company page may name in `{braces}`, in the language being read. */
export function docFacts(lang: Lang): Record<string, string> {
  const gst = Math.round((PRICING.standard * PRICING.gstPercent) / 100);
  return {
    legalName: BRAND.legalName,
    cin: BRAND.cin,
    office: BRAND.registeredOffice,
    email: BRAND.companyEmail,
    site: BRAND.site,
    tollFree: TOLL_FREE.display,
    tollFreeHref: TOLL_FREE.href,
    /* the opening hours, in the words the call card already uses */
    hours: getT(lang).contact.hoursLower,
    standard: rupees(PRICING.standard),
    gst: rupees(gst),
    standardTotal: rupees(PRICING.standard + gst),
    everythingAround: rupees(PRICING.everythingAround),
    gstPercent: `${PRICING.gstPercent}%`,
  };
}

/** Fill every `{name}` from the facts. */
export function fill(text: string, facts: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (_all, name: string) => {
    const v = facts[name];
    if (v === undefined) throw new Error(`Company page copy names an unknown fact {${name}}: "${text.slice(0, 80)}"`);
    return v;
  });
}

export type Piece =
  | { kind: "text"; text: string }
  | { kind: "bold"; text: string }
  | { kind: "link"; text: string; href: string };

/** Split `**bold**` and `[label](target)` out of a filled string. */
export function pieces(text: string): Piece[] {
  const out: Piece[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let at = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > at) out.push({ kind: "text", text: text.slice(at, m.index) });
    if (m[1] !== undefined) out.push({ kind: "bold", text: m[1] });
    else out.push({ kind: "link", text: m[2], href: m[3] });
    at = m.index + m[0].length;
  }
  if (at < text.length) out.push({ kind: "text", text: text.slice(at) });
  return out;
}

export type Target = { href: string; how: "page" | "plain" | "external" };

/**
 * Where a link goes. `route:/x` is a page of this site in the language being
 * read, `home:id` is a section of its home page; a `https:` address leaves the
 * site; anything else (mailto:, tel:, /privacy) is used as written.
 */
export function target(lang: Lang, href: string): Target {
  if (href.startsWith("route:")) return { href: pathFor(lang, href.slice("route:".length) as SiteRoute), how: "page" };
  if (href.startsWith("home:")) return { href: homeHref(lang, href.slice("home:".length)), how: "plain" };
  if (/^https?:/.test(href)) return { href, how: "external" };
  return { href, how: "plain" };
}
