/**
 * The video pages' one server job (/videos and /videos/<slug>): pick the page's
 * language and the built file that answers the address.
 *
 * Each page is built in Hindi (the default: the audience is Hindi-speaking
 * dealers, and the videos were made in Hindi first) and English, as plain static
 * HTML under public/videos (scripts/videos-pages.ts). `?lang=` or the site's
 * `mdg_lang` cookie decides which file answers, so a shared link stays one link.
 * The same rules as the film pages (src/routing/film.ts), whose language
 * decision this reuses.
 *
 * Pure functions on paths; proxy.ts does the responding. It imports only the
 * list of slugs, never the catalog, which is large.
 */
import slugs from "../videos/slugs.json";
import { filmLang } from "./film.ts";
import type { Lang } from "../i18n/lang.ts";

export { filmLang as videosLang };

/** Every explainer's address part, in the order the library shows them. */
export const VIDEO_SLUGS: readonly string[] = slugs;

const KNOWN = new Set<string>(VIDEO_SLUGS);

/** `/videos`, `/videos/<anything>`, with or without a trailing slash. Not the media folder below it. */
export function isVideosPath(pathname: string): boolean {
  const p = pathname.replace(/\/$/, "");
  return p === "/videos" || /^\/videos\/[^/]+$/.test(p);
}

/** The slug an address names, "" for the library page, null for an address that is no video. */
export function videoSlugOf(pathname: string): string | null {
  const p = pathname.replace(/\/$/, "");
  if (p === "/videos") return "";
  const m = /^\/videos\/([^/]+)$/.exec(p);
  return m && KNOWN.has(m[1]!) ? m[1]! : null;
}

/** The built file for an address in a language: /videos/dod-clock -> /videos/dod-clock/en/index.html. */
export function videosFile(slug: string, lang: Lang): string {
  const base = slug ? `/videos/${slug}` : "/videos";
  return `${base}/${lang === "hi" ? "" : `${lang}/`}index.html`;
}

/** A video's public address; Hindi is the bare one, English carries `?lang=en`. */
export function videoPath(slug: string, lang: Lang): string {
  return `/videos/${slug}?lang=${lang}`;
}

/** The slug for a guide-site id: "gen-dod-clock" -> "dod-clock". */
export function slugOfSource(source: string): string {
  return source.replace(/^gen-/, "");
}

/** The two guide-site ids' new address, for the pages that name a video by its old id. */
export function isKnownVideo(slug: string): boolean {
  return KNOWN.has(slug);
}
