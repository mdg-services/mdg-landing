/**
 * The film pages' two server jobs (/film and /film/short):
 *
 * 1. Hand the page the visitor's country / state / city (from Vercel's own
 *    edge headers) in a short-lived cookie, so the film's view measurement can
 *    say where a view came from without the page ever seeing an IP address.
 * 2. Pick the page's language. Each film page is built in Hindi (the default:
 *    the films are in Hindi) and English; `?lang=` or the site's `mdg_lang`
 *    cookie decides which file answers /film, so a shared link stays one link
 *    and the switch costs no reload.
 *
 * Pure functions on headers and URLs; proxy.ts does the responding.
 */
import { LANG_COOKIE, langCookie, type Lang } from "../i18n/lang";

export { langCookie };

/** The cookie value: "country|region|city", URL-encoded. Empty parts stay empty. */
export function geoCookie(headers: Headers): string | null {
  const read = (k: string) => {
    const raw = headers.get(k) || "";
    try {
      // Vercel URL-encodes the city so multi-byte names survive a header
      return decodeURIComponent(raw).replace(/\|/g, " ").trim().slice(0, 64);
    } catch {
      return "";
    }
  };
  const country = read("x-vercel-ip-country");
  const region = read("x-vercel-ip-country-region");
  const city = read("x-vercel-ip-city");
  if (!country && !region && !city) return null;
  const value = encodeURIComponent(`${country}|${region}|${city}`);
  return `mdg_geo=${value}; Path=/film; Max-Age=86400; SameSite=Lax; Secure`;
}

/**
 * Which language to serve, and whether the URL asked for it (an explicit
 * choice, remembered for a year). Hindi unless the visitor chose otherwise.
 */
export function filmLang(url: URL, cookieHeader: string | null): { lang: Lang; asked: boolean } {
  const q = url.searchParams.get("lang");
  if (q === "hi" || q === "en") return { lang: q, asked: true };
  const kept = new RegExp(`(?:^|;\\s*)${LANG_COOKIE}=(hi|en)(?:;|$)`).exec(cookieHeader || "");
  return { lang: kept ? (kept[1] as Lang) : "hi", asked: false };
}

/** The built file for a film page in a language: /film -> /film/en/index.html. */
export function filmFile(pathname: string, lang: Lang): string {
  const base = pathname.replace(/\/$/, "");
  return `${base}/${lang === "hi" ? "" : `${lang}/`}index.html`;
}

/** /film and /film/short, with or without a trailing slash. */
export function isFilmPath(pathname: string): boolean {
  const p = pathname.replace(/\/$/, "");
  return p === "/film" || p === "/film/short";
}
