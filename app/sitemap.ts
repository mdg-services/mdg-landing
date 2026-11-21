import type { MetadataRoute } from "next";
import { guideNow } from "@/guides/clock";
import { COMPANY_ROUTES, LANGS, pathFor, type SiteRoute } from "@/i18n/lang";
import { SITE_PAGES } from "../guide/copy.ts";
import { ALL, SITE, contextAt, lastModified, releasesOn } from "@/guides/model";
import { VIDEO_SLUGS } from "@/routing/videos";

/**
 * The sitemap lists the site's own pages and the guide pages of both
 * collections (the MDG guides, the Khata Kavach pages) that are live today
 * (India time); each list grows by itself, five pages a day, with no deploy.
 *
 * Built fresh on every request. With `revalidate = 3600` it worked under
 * `next start` but never refreshed on Vercel: the CDN kept answering with the
 * copy made at deploy time (on 22 Oct 2026 it still listed 20 Oct's pages, 20
 * live guide pages missing). Crawlers ask for it a few times a day, so the
 * cost is nothing.
 */
export const dynamic = "force-dynamic";

/**
 * The site's own pages (home, register, grievance, the Khata Kavach product page and the company
 * pages), in every language. Each is one entry with its hreflang alternates, so a search engine
 * reads the languages as one page. Kept here, not in the guide's SITE_PAGES, which belongs to the guide machinery.
 */
const SITE_ROUTES: SiteRoute[] = ["", "/register", "/grievance", "/khata-kavach", ...COMPANY_ROUTES];

/** The video library and one page per explainer. One address each: the English cut is `?lang=en` on the same page. */
const VIDEO_PAGES = ["/videos", ...VIDEO_SLUGS.map((slug) => `/videos/${slug}`)];

const abs = (p: string) => (p === "/" ? SITE : `${SITE}${p}`);

/** The pages that are not in the site's own routes: the guide's static list (film, privacy, …) and the videos. */
const OTHER_PAGES = [...SITE_PAGES.filter((p) => !SITE_ROUTES.some((r) => pathFor("en", r) === p)), ...VIDEO_PAGES];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = guideNow();
  return [
    // the home page is listed as the bare origin, the same address its canonical and hreflang give
    ...SITE_ROUTES.flatMap((route) =>
      LANGS.map((lang) => ({
        url: abs(pathFor(lang, route)),
        alternates: { languages: { ...Object.fromEntries(LANGS.map((l) => [l, abs(pathFor(l, route))])), "x-default": abs(pathFor("en", route)) } },
      })),
    ),
    ...OTHER_PAGES.map((p) => ({ url: abs(p) })),
    ...ALL.flatMap((col) => {
      const ctx = contextAt(col, now);
      const live = releasesOn(col, ctx.content, ctx.day);
      return live.map((r) => {
        // the page in every language it is live in, so a search engine reads them as one page
        const same = live.filter((x) => x.page.id === r.page.id);
        return {
          url: `${SITE}${r.path}`,
          lastModified: lastModified(ctx, r),
          ...(same.length > 1
            ? { alternates: { languages: { ...Object.fromEntries(same.map((x) => [x.lang, `${SITE}${x.path}`])), "x-default": `${SITE}${same.find((x) => x.lang === "en")?.path ?? r.path}` } } }
            : {}),
        };
      });
    }),
  ];
}
