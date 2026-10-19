import type { MetadataRoute } from "next";
import { guideNow } from "@/guides/clock";
import { SITE_PAGES } from "../guide/copy.ts";
import { ALL, SITE, contextAt, lastModified, releasesOn } from "@/guides/model";

/**
 * The sitemap lists the site's own pages and the guide pages of both
 * collections (the MDG guides, the Khata Kavach pages) that are live today
 * (India time); each list grows by itself, five pages a day, with no deploy.
 * Refreshed hourly.
 */
export const revalidate = 3600;

/** The Hindi twins of the site's own pages. */
const HINDI_PAGES = ["/hi", "/hi/register", "/hi/grievance"];

/** The Khata Kavach product page. Kept here, not in the guide's SITE_PAGES, which belongs to the guide machinery. */
const KK_PAGES = ["/khata-kavach", "/hi/khata-kavach"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = guideNow();
  return [
    // the home page is listed as the bare origin, the same address its canonical and hreflang give
    ...[...SITE_PAGES, ...HINDI_PAGES, ...KK_PAGES].map((p) => ({ url: p === "/" ? SITE : `${SITE}${p}` })),
    ...ALL.flatMap((col) => {
      const ctx = contextAt(col, now);
      return releasesOn(col, ctx.content, ctx.day).map((r) => ({ url: `${SITE}${r.path}`, lastModified: lastModified(ctx, r) }));
    }),
  ];
}
