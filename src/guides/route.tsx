import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GuidePage from "./GuidePage";
import { SITE, buildPageModel, contextAt, loadContent, pathOf, releaseAt, type AnyRelease, type Collection, type Lang } from "./model";
import { guideNow } from "./clock";
import { KK_OG_IMAGE, OG_IMAGE } from "../seo/site";

/**
 * Glue between the app's guide routes and the renderer. The route trees
 * (/guides/…, /tools/…, /khata-kavach/… and their /hi twins) are thin files
 * that call these, so the English and Hindi sides cannot drift apart.
 *
 * A route names its collection and its root: the first part of the address
 * after the language ("guides", "tools", "khata-kavach").
 */

/** The public path for a route's params: ("hi", "guides", ["density"]) -> "/hi/guides/density/". */
export function guidePath(lang: Lang, root: string, slug: string[] = []): string {
  return `${lang === "hi" ? "/hi" : ""}/${root}/${slug.length ? `${slug.join("/")}/` : ""}`;
}

/** The path segments of every page of one root and language that has words. */
function slugs(col: Collection, lang: Lang, root: string): string[][] {
  const content = loadContent(col);
  const prefix = `${lang === "hi" ? "/hi" : ""}/${root}/`;
  return col.releases
    .filter((r) => r.lang === lang && r.path.startsWith(prefix) && r.path !== prefix && content.has(`${r.lang}:${r.page.id}`))
    .map((r) => r.path.slice(prefix.length, -1).split("/"));
}

/** `generateStaticParams` for a [...slug] route: every page under the root except the root's own page. */
export function guideParams(col: Collection, lang: Lang, root: string): { slug: string[] }[] {
  return slugs(col, lang, root).map((slug) => ({ slug }));
}

/** `generateStaticParams` for /tools/[slug]. */
export function toolParams(col: Collection, lang: Lang): { slug: string }[] {
  return slugs(col, lang, "tools").map((slug) => ({ slug: slug[0] }));
}

/** The page behind a route, or the site's 404 when there is none. */
export function releaseFor(col: Collection, lang: Lang, root: string, slug: string[] = []): AnyRelease {
  const r = releaseAt(col, guidePath(lang, root, slug));
  if (!r || !loadContent(col).has(`${r.lang}:${r.page.id}`)) notFound();
  return r;
}

export function guideMetadata(col: Collection, r: AnyRelease): Metadata {
  const ctx = contextAt(col, guideNow(), r.day);
  const m = buildPageModel(ctx, r);
  const { c, lang, page } = m;
  const twinLang: Lang = lang === "en" ? "hi" : "en";
  const image = col.key === "kk" ? KK_OG_IMAGE : OG_IMAGE;
  return {
    title: { absolute: `${c.metaTitle || c.title} | MDG Services` },
    description: c.description,
    alternates: {
      canonical: r.path,
      // hreflang only when both languages are live
      ...(m.twin
        ? {
            languages: {
              [lang]: r.path,
              [twinLang]: pathOf(page, twinLang),
              "x-default": pathOf(page, "en"),
            },
          }
        : {}),
    },
    openGraph: {
      type: "article",
      siteName: "MDG Services",
      title: c.title,
      description: c.description,
      url: r.path,
      locale: col.ui[lang].locale,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: c.title, description: c.description, images: [image.url] },
  };
}

/**
 * The page, as of right now. The live set is worked out at render time, and a
 * page is rendered at least as of its own release day (see `contextAt`), so
 * the cached copy of a page built ahead of its day never shows itself missing.
 */
export function GuideRoute({ col, release }: { col: Collection; release: AnyRelease }) {
  return <GuidePage ctx={contextAt(col, guideNow(), release.day)} release={release} />;
}

export { SITE };
