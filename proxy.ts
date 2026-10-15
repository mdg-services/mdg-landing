/**
 * The site's proxy (what Next.js 16 calls middleware): the small amount of
 * per-request logic that cannot be decided when a page is built.
 *
 * 1. Language. `/`, `/register`, `/grievance` and `/grievances` are English
 *    and `/hi…` is Hindi; a `?lang=` choice, the `mdg_lang` cookie or a Hindi
 *    browser can send a visitor of an English address to its /hi twin
 *    (src/routing/site.ts).
 * 2. The guides. Five pages go live a day (guide/schedule.ts); a page whose day
 *    has not come is a real 404, and guide addresses keep their trailing slash
 *    (src/routing/guides.ts).
 * 3. The film pages (/film, /film/short). They hand the page the visitor's
 *    place in a short-lived cookie and pick the Hindi or English file; the
 *    pages themselves are static files generated into public/film.
 *
 * Nothing else runs through here, and every page works the same with no cookie
 * at all.
 */
import { NextResponse, type NextRequest } from "next/server";
import { langCookie } from "./src/i18n/lang.ts";
import { filmFile, filmLang, geoCookie, isFilmPath } from "./src/routing/film.ts";
import { guideNow } from "./src/guides/clock.ts";
import { guideGate, isGuidePath } from "./src/routing/guides.ts";
import { langRedirect, siteRoute } from "./src/routing/site.ts";

// Only the paths that need it. The matcher also takes the trailing-slash form
// of each path. A request for any other page never reaches this file.
export const config = {
  matcher: [
    "/",
    "/register",
    "/grievance",
    "/grievances",
    "/film",
    "/film/short",
    "/guides",
    "/guides/:path*",
    "/hi/guides",
    "/hi/guides/:path*",
    "/tools/:path*",
    "/hi/tools/:path*",
    // a ?lang= on a Hindi address is a choice too
    { source: "/hi/:path*", has: [{ type: "query", key: "lang" }] },
    { source: "/hi", has: [{ type: "query", key: "lang" }] },
  ],
};

/** A real 404 in the site's own design: a rewrite to an address nothing serves. */
function notFound(request: NextRequest): NextResponse {
  return NextResponse.rewrite(new URL("/_not-live", request.url), { status: 404 });
}

export function proxy(request: NextRequest): NextResponse {
  const raw = new URL(request.url);
  const pathname = raw.pathname;

  // ── The guides ────────────────────────────────────────────────────────
  if (isGuidePath(pathname)) {
    const gate = guideGate(pathname, raw.search, guideNow());
    if (gate.kind === "redirect") return NextResponse.redirect(new URL(gate.to, request.url), 308);
    if (gate.kind === "notFound") return notFound(request);
    return NextResponse.next();
  }

  // ── The film pages ────────────────────────────────────────────────────
  if (isFilmPath(pathname)) {
    const { lang, asked } = filmLang(raw, request.headers.get("cookie"));
    const headers = new Headers();
    const geo = geoCookie(request.headers);
    if (geo) headers.append("set-cookie", geo);
    if (asked) headers.append("set-cookie", langCookie(lang));
    return NextResponse.rewrite(new URL(filmFile(pathname, lang) + raw.search, request.url), { headers });
  }

  // ── The site's own pages: which language ──────────────────────────────
  if (siteRoute(pathname)) {
    // a trailing slash is not part of these addresses
    if (pathname.length > 1 && pathname.endsWith("/")) {
      return NextResponse.redirect(new URL(pathname.replace(/\/+$/, "") + raw.search, request.url), 308);
    }
    const redirect = langRedirect(raw, request.headers.get("cookie"), request.headers.get("accept-language"));
    if (redirect) {
      const res = NextResponse.redirect(new URL(redirect.location, request.url), 307);
      if (redirect.cookie) res.headers.append("set-cookie", langCookie(redirect.cookie));
      // the answer depends on who asks, so no shared cache may keep it
      res.headers.set("cache-control", "private, no-store");
      res.headers.set("vary", "Accept-Language, Cookie");
      return res;
    }
  }
  return NextResponse.next();
}
