/**
 * Vercel Routing Middleware for the film pages only. Two jobs:
 *
 * 1. It hands the page the visitor's country / state / city (from Vercel's own
 *    edge headers) in a short-lived cookie, so the film's view measurement can
 *    say where a view came from without the page ever seeing an IP address.
 * 2. It picks the page's language. Each film page is built in Hindi (the
 *    default: the films are in Hindi) and English; `?lang=` or the site's
 *    `mdg_lang` cookie decides which file answers /film, so a shared link stays
 *    one link and the switch costs no reload.
 *
 * Nothing else on the site runs through here, and the pages work the same with
 * no cookie at all.
 */
import { next, rewrite } from "@vercel/functions";

// The two pages only. A wider pattern ("/film/:path*") would also run this on
// hls.js, the preview images and the logo, and stamp a cookie on each of them.
// Vercel's matcher already accepts the trailing-slash form of each path.
export const config = { matcher: ["/film", "/film/short"] };

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

export type FilmLang = "hi" | "en";

/** The site-wide language cookie, written here and by the site's own switch. */
export const LANG_COOKIE = "mdg_lang";

/**
 * Which language to serve, and whether the URL asked for it (an explicit
 * choice, remembered for a year). Hindi unless the visitor chose otherwise.
 */
export function filmLang(url: URL, cookieHeader: string | null): { lang: FilmLang; asked: boolean } {
  const q = url.searchParams.get("lang");
  if (q === "hi" || q === "en") return { lang: q, asked: true };
  const kept = new RegExp(`(?:^|;\\s*)${LANG_COOKIE}=(hi|en)(?:;|$)`).exec(cookieHeader || "");
  return { lang: kept ? (kept[1] as FilmLang) : "hi", asked: false };
}

export function langCookie(lang: FilmLang): string {
  return `${LANG_COOKIE}=${lang}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;
}

/** The built file for a film page in a language: /film -> /film/en/index.html. */
export function filmFile(pathname: string, lang: FilmLang): string {
  const base = pathname.replace(/\/$/, "");
  return `${base}/${lang === "hi" ? "" : `${lang}/`}index.html`;
}

export default function middleware(request: Request): Response {
  const url = new URL(request.url);
  const { lang, asked } = filmLang(url, request.headers.get("cookie"));
  const headers = new Headers();
  const geo = geoCookie(request.headers);
  if (geo) headers.append("set-cookie", geo);
  if (asked) headers.append("set-cookie", langCookie(lang));
  if (lang !== "hi") return rewrite(new URL(filmFile(url.pathname, lang) + url.search, url), { headers });
  return headers.has("set-cookie") ? next({ headers }) : next();
}
