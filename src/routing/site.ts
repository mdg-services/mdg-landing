/**
 * Which language a visitor to the site's own pages (/, /register, /grievance,
 * /grievances and their /hi twins) should be sent to.
 *
 * The URL decides the language of the HTML. This only decides when to send a
 * visitor to the other URL:
 *
 *  - `?lang=hi` or `?lang=en` is a choice: go to that language's address, keep
 *    the choice in the `mdg_lang` cookie, and drop the query.
 *  - On an English address with no query: the cookie, if there is one, wins
 *    (`hi` goes to the /hi twin, `en` stays). With no cookie, a browser whose
 *    first language the site can serve (English or Hindi) is Hindi goes to the
 *    /hi twin; everyone else stays. A crawler sends neither, so it gets English
 *    at / and Hindi at /hi.
 *  - A Hindi address with no query always stays: someone who typed or followed
 *    /hi asked for Hindi.
 *
 * Pure functions on strings; proxy.ts does the responding.
 */
import { LANG_COOKIE, isLang, pathFor, type Lang, type SiteRoute } from "../i18n/lang";

const ROUTES = ["", "/register", "/grievance", "/grievances"] as const;

/** Which of the site's own pages a path is, and in which language; null for anything else. */
export function siteRoute(pathname: string): { lang: Lang; route: SiteRoute } | null {
  const p = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const hindi = p === "/hi" || p.startsWith("/hi/");
  const rest = hindi ? p.slice(3) : p === "/" ? "" : p;
  const route = (ROUTES as readonly string[]).includes(rest) ? (rest as SiteRoute) : null;
  return route === null ? null : { lang: hindi ? "hi" : "en", route };
}

/**
 * The first language the site can serve ("en" or "hi") in Accept-Language, best
 * q first: "hi-IN,hi;q=0.9,en;q=0.8" -> hi, "mr-IN,hi;q=0.8" -> hi (a Marathi
 * phone that lists Hindi next gets Hindi, as the old device check gave it),
 * "hi;q=0.3,en;q=0.9" -> en. Anything else, or nothing, is null.
 */
export function firstAcceptedLanguage(header: string | null): Lang | null {
  if (!header) return null;
  const entries: { lang: string; q: number; order: number }[] = [];
  header.split(",").forEach((part, order) => {
    const [tag, ...params] = part.trim().split(";");
    if (!tag || tag === "*") return;
    const qParam = params.map((x) => x.trim()).find((x) => x.startsWith("q="));
    const q = qParam ? Number(qParam.slice(2)) : 1;
    if (Number.isNaN(q) || q <= 0) return;
    entries.push({ lang: tag.toLowerCase().split("-")[0], q, order });
  });
  entries.sort((a, b) => b.q - a.q || a.order - b.order);
  const hit = entries.find((e) => e.lang === "en" || e.lang === "hi");
  return hit ? (hit.lang as Lang) : null;
}

function cookieLang(cookieHeader: string | null): Lang | null {
  const m = new RegExp(`(?:^|;\\s*)${LANG_COOKIE}=(hi|en)(?:;|$)`).exec(cookieHeader || "");
  return m && isLang(m[1]) ? m[1] : null;
}

export interface LangRedirect {
  /** Where to send the visitor, query kept (minus `lang`). */
  location: string;
  /** Set when the visitor made an explicit choice that should be remembered. */
  cookie?: Lang;
}

export function langRedirect(
  url: URL,
  cookieHeader: string | null,
  acceptLanguage: string | null,
): LangRedirect | null {
  const here = siteRoute(url.pathname);
  if (!here) return null;

  const asked = url.searchParams.get("lang");
  if (asked === "hi" || asked === "en") {
    const rest = new URLSearchParams(url.search);
    rest.delete("lang");
    const query = rest.toString();
    return { location: pathFor(asked, here.route) + (query ? `?${query}` : ""), cookie: asked };
  }

  if (here.lang === "hi") return null;
  const kept = cookieLang(cookieHeader);
  const wantsHindi = kept ? kept === "hi" : firstAcceptedLanguage(acceptLanguage) === "hi";
  return wantsHindi ? { location: pathFor("hi", here.route) + url.search } : null;
}
