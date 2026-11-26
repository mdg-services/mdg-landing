/**
 * Which language a visitor to the site's own pages (/, /register, /grievance,
 *  /grievances, /khata-kavach, /new-pump, /new-pump/questions, the company pages (/about, /contact, /pricing,
 * /terms, /refund-policy, /shipping) and their twins under each language's
 * prefix, /hi and /or) should be sent to.
 *
 * The URL decides the language of the HTML. This only decides when to send a
 * visitor to another URL:
 *
 *  - `?lang=<code>` is a choice: go to that language's address, keep the
 *    choice in the `mdg_lang` cookie, and drop the query.
 *  - On an English address with no query: the cookie, if there is one, wins
 *    (a language's code goes to that language's twin, `en` stays). With no
 *    cookie, a browser whose first language the site can serve (see
 *    src/i18n/languages.ts) is not English goes to that language's twin;
 *    everyone else stays. A crawler sends neither, so it gets English at / and
 *    each other language at its own prefix.
 *  - An address under a language's prefix with no query always stays: someone
 *    who typed or followed /hi or /or asked for it.
 *
 * Pure functions on strings; proxy.ts does the responding.
 */
import { COMPANY_ROUTES, LANG_COOKIE, pathFor, type SiteRoute } from "../i18n/lang";
import { DEFAULT_LANG, LANGS, LANGUAGES, isLang, langOfPath, prefixOf, type Lang } from "../i18n/languages";

const ROUTES = ["", "/register", "/grievance", "/grievances", "/khata-kavach", "/new-pump", "/new-pump/questions", ...COMPANY_ROUTES] as const;

/** Which of the site's own pages a path is, and in which language; null for anything else. */
export function siteRoute(pathname: string): { lang: Lang; route: SiteRoute } | null {
  const p = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const lang = langOfPath(p);
  const rest = lang !== DEFAULT_LANG ? p.slice(prefixOf(lang).length) : p === "/" ? "" : p;
  const route = (ROUTES as readonly string[]).includes(rest) ? (rest as SiteRoute) : null;
  return route === null ? null : { lang, route };
}

/**
 * The first language the site can serve (one of src/i18n/languages.ts) in
 * Accept-Language, best q first: "hi-IN,hi;q=0.9,en;q=0.8" -> hi,
 * "or-IN,en;q=0.8" -> or, "mr-IN,hi;q=0.8" -> hi (a Marathi phone that lists
 * Hindi next gets Hindi, as the old device check gave it), "hi;q=0.3,en;q=0.9"
 * -> en. Anything else, or nothing, is null.
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
  for (const e of entries) {
    const hit = LANGS.find((l) => (LANGUAGES[l].accept as readonly string[]).includes(e.lang));
    if (hit) return hit;
  }
  return null;
}

function cookieLang(cookieHeader: string | null): Lang | null {
  const m = new RegExp(`(?:^|;\\s*)${LANG_COOKIE}=([a-z]+)(?:;|$)`).exec(cookieHeader || "");
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
  if (isLang(asked)) {
    const rest = new URLSearchParams(url.search);
    rest.delete("lang");
    const query = rest.toString();
    return { location: pathFor(asked, here.route) + (query ? `?${query}` : ""), cookie: asked };
  }

  if (here.lang !== DEFAULT_LANG) return null;
  const wants = cookieLang(cookieHeader) ?? firstAcceptedLanguage(acceptLanguage);
  return wants && wants !== DEFAULT_LANG ? { location: pathFor(wants, here.route) + url.search } : null;
}
