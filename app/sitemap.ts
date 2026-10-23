import type { MetadataRoute } from "next";
import { guideNow } from "@/guides/clock";
import { COMPANY_ROUTES, pathFor } from "@/i18n/lang";
import { SITE_PAGES } from "../guide/copy.ts";
import { ALL, SITE, contextAt, lastModified, releasesOn } from "@/guides/model";

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

/** The Hindi twins of the site's own pages. */
const HINDI_PAGES = ["/hi", "/hi/register", "/hi/grievance"];

/** The Khata Kavach product page. Kept here, not in the guide's SITE_PAGES, which belongs to the guide machinery. */
const KK_PAGES = ["/khata-kavach", "/hi/khata-kavach"];

/** The company pages (about, contact, pricing, terms, refund, shipping) and their Hindi twins. Kept here for the same reason. */
const COMPANY_PAGES = COMPANY_ROUTES.flatMap((r) => [pathFor("en", r), pathFor("hi", r)]);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = guideNow();
  return [
    // the home page is listed as the bare origin, the same address its canonical and hreflang give
    ...[...SITE_PAGES, ...HINDI_PAGES, ...KK_PAGES, ...COMPANY_PAGES].map((p) => ({ url: p === "/" ? SITE : `${SITE}${p}` })),
    ...ALL.flatMap((col) => {
      const ctx = contextAt(col, now);
      return releasesOn(col, ctx.content, ctx.day).map((r) => ({ url: `${SITE}${r.path}`, lastModified: lastModified(ctx, r) }));
    }),
  ];
}
