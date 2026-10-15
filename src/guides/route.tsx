import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GuidePage from "./GuidePage";
import {
  RELEASES,
  SITE,
  UI,
  buildPageModel,
  contextAt,
  loadContent,
  pathOf,
  releaseAt,
  type Lang,
  type Release,
} from "./model";
import { guideNow } from "./clock";
import { OG_IMAGE } from "../seo/site";

/**
 * Glue between the app's guide routes and the renderer. The four route trees
 * (/guides/…, /tools/…, and their /hi twins) are thin files that call these,
 * so the English and Hindi sides cannot drift apart.
 */

type Root = "guides" | "tools";

/** The public path for a route's params: ("hi", "guides", ["density"]) -> "/hi/guides/density/". */
export function guidePath(lang: Lang, root: Root, slug: string[] = []): string {
  return `${lang === "hi" ? "/hi" : ""}/${root}/${slug.length ? `${slug.join("/")}/` : ""}`;
}

/** The path segments of every page of one root and language that has words. */
function slugs(lang: Lang, root: Root): string[][] {
  const content = loadContent();
  const prefix = `${lang === "hi" ? "/hi" : ""}/${root}/`;
  return RELEASES.filter((r) => r.lang === lang && r.path.startsWith(prefix) && r.path !== prefix && content.has(`${r.lang}:${r.page.id}`)).map((r) =>
    r.path.slice(prefix.length, -1).split("/"),
  );
}

/** `generateStaticParams` for /guides/[...slug]: every guide page except the hub (which has its own route). */
export function guideParams(lang: Lang): { slug: string[] }[] {
  return slugs(lang, "guides").map((slug) => ({ slug }));
}

/** `generateStaticParams` for /tools/[slug]. */
export function toolParams(lang: Lang): { slug: string }[] {
  return slugs(lang, "tools").map((slug) => ({ slug: slug[0] }));
}

/** The page behind a route, or the site's 404 when there is none. */
export function releaseFor(lang: Lang, root: Root, slug: string[] = []): Release {
  const r = releaseAt(guidePath(lang, root, slug));
  if (!r || !loadContent().has(`${r.lang}:${r.page.id}`)) notFound();
  return r;
}

export function guideMetadata(r: Release): Metadata {
  const ctx = contextAt(guideNow(), r.day);
  const m = buildPageModel(ctx, r);
  const { c, lang, page } = m;
  const twinLang: Lang = lang === "en" ? "hi" : "en";
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
      locale: UI[lang].locale,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: c.title, description: c.description, images: [OG_IMAGE.url] },
  };
}

/**
 * The page, as of right now. The live set is worked out at render time, and a
 * page is rendered at least as of its own release day (see `contextAt`), so
 * the cached copy of a page built ahead of its day never shows itself missing.
 */
export function GuideRoute({ release }: { release: Release }) {
  return <GuidePage ctx={contextAt(guideNow(), release.day)} release={release} />;
}

export { SITE };
