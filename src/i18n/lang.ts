/**
 * Language, as plain data and arithmetic: nothing here touches React or the
 * browser, so the server, the proxy and the client can all import it.
 *
 * The rule is simple. The URL decides the language of the page: `/` is
 * English and `/hi` is Hindi, and every other page has a twin under `/hi`.
 * The EN / हिंदी switch goes to the twin and remembers the choice in the
 * `mdg_lang` cookie (the proxy reads it, and so do the film pages).
 */
import type { en } from "./en";

export const LANGS = ["en", "hi"] as const;
export type Lang = (typeof LANGS)[number];

/** The English dictionary is the shape every other language must satisfy. */
export type Dict = typeof en;

/** The slices the browser-side parts of the page read through `useT()`. */
export type CommonDict = Pick<Dict, "ui" | "nav">;

/** Written in the language itself: a reader must recognise their own. */
export const LANG_LABEL: Record<Lang, string> = { en: "English", hi: "हिंदी" };

export function isLang(v: unknown): v is Lang {
  return typeof v === "string" && (LANGS as readonly string[]).includes(v);
}

/** The site-wide language cookie, written by the switch and the proxy, read by the proxy. */
export const LANG_COOKIE = "mdg_lang";
/** The film pages also read the choice from here. */
export const LANG_STORE_KEY = "mdg.lang";

/** The cookie as a `Set-Cookie` / `document.cookie` string. */
export function langCookie(lang: Lang): string {
  return `${LANG_COOKIE}=${lang}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;
}

/** Pages that exist in both languages, as English paths ("" is the home page). */
export type SiteRoute = "" | "/register" | "/grievance" | "/grievances" | "/khata-kavach";

/** The public path of a site page in a language: ("", "hi") -> "/hi". */
export function pathFor(lang: Lang, route: SiteRoute = ""): string {
  if (lang === "en") return route === "" ? "/" : route;
  return `/hi${route}`;
}

/** The home page link for a language, with an optional #section. */
export function homeHref(lang: Lang, hash = ""): string {
  if (lang === "hi") return hash ? `/hi#${hash}` : "/hi";
  return hash ? `/#${hash}` : "/";
}

/** The same page in the other language, for the switch. */
export function twinOf(route: SiteRoute, lang: Lang): string {
  return pathFor(lang === "en" ? "hi" : "en", route);
}
