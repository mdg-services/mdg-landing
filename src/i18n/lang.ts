/**
 * Language, as plain data and arithmetic: nothing here touches React or the
 * browser, so the server, the proxy and the client can all import it.
 *
 * The rule is simple. The URL decides the language of the page: `/` is
 * English, `/hi` is Hindi, `/or` is Odia, and every other page has a twin under
 * each prefix. The language switch goes to the twin and remembers the choice in
 * the `mdg_lang` cookie (the proxy reads it, and so do the film pages).
 *
 * Which languages exist, and everything that differs between them besides
 * their sentences, is `languages.ts`. This file is the arithmetic on top of it.
 */
import type { en } from "./en";
import { DEFAULT_LANG, LANGS, LANGUAGES, isLang, localPath, prefixOf, type Lang } from "./languages";

export { DEFAULT_LANG, LANGS, LANGUAGES, isLang, localPath, prefixOf };
export type { Lang };

/** The English dictionary is the shape every other language must satisfy. */
export type Dict = typeof en;

/** The slices the browser-side parts of the page read through `useT()`. */
export type CommonDict = Pick<Dict, "ui" | "nav">;

/** Written in the language itself: a reader must recognise their own. */
export const LANG_LABEL = Object.fromEntries(LANGS.map((l) => [l, LANGUAGES[l].native])) as Record<Lang, string>;

/** The site-wide language cookie, written by the switch and the proxy, read by the proxy. */
export const LANG_COOKIE = "mdg_lang";
/** The film pages also read the choice from here. */
export const LANG_STORE_KEY = "mdg.lang";

/** The cookie as a `Set-Cookie` / `document.cookie` string. */
export function langCookie(lang: Lang): string {
  return `${LANG_COOKIE}=${lang}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;
}

/**
 * The company pages a payment provider's review reads: who we are, how to
 * reach us, what it costs, the terms, the refund rules and how access is
 * delivered. Each has a Hindi twin under /hi. (/refund and /cancellation are
 * redirects to /refund-policy; see next.config.ts.)
 */
export const COMPANY_ROUTES = ["/about", "/contact", "/pricing", "/terms", "/refund-policy", "/shipping"] as const;
export type CompanyRoute = (typeof COMPANY_ROUTES)[number];

/** Pages that exist in both languages, as English paths ("" is the home page). */
/* "/new-pump" is New Pump Guide (ADR 0058): a page about a feature of the Dealer Kavach app, in every language.
   "/new-pump/questions" is its questions hub (ADR 0059 §6), the page a search for a pump question lands on. */
export type SiteRoute = "" | "/register" | "/grievance" | "/grievances" | "/khata-kavach" | "/new-pump" | "/new-pump/questions" | CompanyRoute;

/** The public path of a site page in a language: ("", "hi") -> "/hi". */
export function pathFor(lang: Lang, route: SiteRoute = ""): string {
  if (lang === DEFAULT_LANG) return route === "" ? "/" : route;
  return `${prefixOf(lang)}${route}`;
}

/** The home page link for a language, with an optional #section. */
export function homeHref(lang: Lang, hash = ""): string {
  const home = lang === DEFAULT_LANG ? "/" : prefixOf(lang);
  return hash ? `${home}#${hash}` : home;
}

/**
 * A film page in a language: ("en", "short") -> "/film/short?lang=en". The
 * film pages answer Hindi unless told otherwise, and a visitor on /hi may still
 * carry an English choice from an earlier visit, so Hindi and English both say it.
 * The film's words on screen exist in Hindi and English only; an Odia reader
 * gets the Hindi page with the Odia voice and captions already chosen
 * (`al=or`, read by the film player).
 */
export function filmHref(lang: Lang, film: "full" | "short"): string {
  const base = film === "full" ? "/film" : "/film/short";
  if (lang === "en" || lang === "hi") return `${base}?lang=${lang}`;
  return film === "full" ? `${base}?al=${lang}` : base;
}

/** The addresses of one site page in every language, for the switch: { en: "/about", hi: "/hi/about", or: "/or/about" }. */
export type Versions = Partial<Record<Lang, string>>;

export function versionsOf(route: SiteRoute): Versions {
  return Object.fromEntries(LANGS.map((l) => [l, pathFor(l, route)])) as Versions;
}
