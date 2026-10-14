/**
 * Vercel Routing Middleware for the film pages and the MDG guide.
 *
 * The MDG guide (/mdg/, /hi/mdg/, /tools/, plus /sitemap.xml and /llms.txt):
 * every page is built ahead of time, one snapshot per release day under
 * /_guide/dNN/ (scripts/guide-pages.ts), and guide/schedule.ts says which day
 * each page goes live. This serves today's snapshot (India time), so five
 * pages go live each day with no deploy. A page not live yet is a plain 404.
 *
 * The film pages, two jobs:
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
import { releaseDayOf, snapshotDay, snapshotDir } from "./guide/schedule.js";

// The two film pages only. A wider pattern ("/film/:path*") would also run this
// on hls.js, the preview images and the logo, and stamp a cookie on each of them.
// Vercel's matcher already accepts the trailing-slash form of each path.
export const config = {
  matcher: ["/film", "/film/short", "/mdg", "/mdg/:path*", "/hi/mdg", "/hi/mdg/:path*", "/tools/:path*", "/hi/tools/:path*", "/sitemap.xml", "/llms.txt"],
};

const GUIDE = /^\/(?:hi\/)?(?:mdg|tools)(?:\/|$)/;

const NOT_FOUND_HTML = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found | MDG Services</title><style>body{margin:0;font:17px/1.6 system-ui,sans-serif;color:#15163A;background:#FCFCFE}main{max-width:620px;margin:0 auto;padding:48px 18px}a{color:#2C2E80}</style></head><body><main><h1>Page not found</h1><p>This page does not exist, or is not published yet.</p><p lang="hi">यह पेज मौजूद नहीं है, या अभी प्रकाशित नहीं हुआ है।</p><p><a href="/mdg/">MDG 2024 guide</a> · <a href="/hi/mdg/" lang="hi">MDG 2024 गाइड</a> · <a href="/">mdgservices.in</a></p></main></body></html>`;

function notFound(): Response {
  return new Response(NOT_FOUND_HTML, { status: 404, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=0, must-revalidate" } });
}

/** Today's snapshot of a guide page, the sitemap or llms.txt; null if the path is not ours. */
export function guideRoute(url: URL, now: Date): Response | null {
  const p = url.pathname;
  const day = snapshotDay(now);
  if (p === "/sitemap.xml" || p === "/llms.txt") return rewrite(new URL(`${snapshotDir(day)}${p}`, url));
  if (!GUIDE.test(p)) return null;
  if (!p.endsWith("/") && releaseDayOf(`${p}/`) !== undefined) {
    return Response.redirect(new URL(`${p}/${url.search}`, url), 308);
  }
  const live = releaseDayOf(p);
  if (live === undefined || day < live) return notFound();
  return rewrite(new URL(`${snapshotDir(day)}${p}index.html`, url));
}

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
  const guide = guideRoute(url, new Date());
  if (guide) return guide;
  const { lang, asked } = filmLang(url, request.headers.get("cookie"));
  const headers = new Headers();
  const geo = geoCookie(request.headers);
  if (geo) headers.append("set-cookie", geo);
  if (asked) headers.append("set-cookie", langCookie(lang));
  if (lang !== "hi") return rewrite(new URL(filmFile(url.pathname, lang) + url.search, url), { headers });
  return headers.has("set-cookie") ? next({ headers }) : next();
}
