import type { Metadata } from "next";
import { getT } from "../i18n/server";
import { pathFor, type Lang, type SiteRoute } from "../i18n/lang";

export const SITE = "https://mdgservices.in";
export const OG_IMAGE = { url: "/og.png", width: 2400, height: 1260, alt: "MDG Services · Dealer's कवच" };
/** Khata Kavach's own card (scripts/og.mjs, ONLY=kk): the product page and its guides. */
export const KK_OG_IMAGE = { url: "/og-kk.png", width: 2400, height: 1260, alt: "Khata Kavach · MDG Services: every credit sale written once, seen by both" };

/** Bing Webmaster Tools ownership check; keep it, Bing re-checks. */
export const BING_VERIFICATION = "573ECDE597341A4280A1604DF38F4ADC";

/** The page that stands for a route in search: the plural grievance address is the same page. */
function canonicalRoute(route: SiteRoute): SiteRoute {
  return route === "/grievances" ? "/grievance" : route;
}

/**
 * The head of a page that exists in both languages: title, description,
 * canonical, hreflang (en, hi, x-default), Open Graph and Twitter. The URL
 * decides the language, so the same builder serves `/` and `/hi`, `/register`
 * and `/hi/register`, and so on.
 */
export function siteMetadata(lang: Lang, route: SiteRoute): Metadata {
  const t = getT(lang);
  const home = route === "";
  const page = canonicalRoute(route);
  /* what each page says about itself in search and in a link preview */
  const heads: Record<SiteRoute, { title: string; description: string; ogTitle: string; ogDescription: string }> = {
    "": { title: t.meta.title, description: t.meta.description, ogTitle: t.meta.ogTitle, ogDescription: t.meta.ogDescription },
    "/register": { title: t.register.pageTitle, description: t.register.intro, ogTitle: t.register.pageTitle, ogDescription: t.register.intro },
    "/grievance": { title: t.grievance.pageTitle, description: t.grievance.metaDescription, ogTitle: t.grievance.pageTitle, ogDescription: t.grievance.metaDescription },
    "/grievances": { title: t.grievance.pageTitle, description: t.grievance.metaDescription, ogTitle: t.grievance.pageTitle, ogDescription: t.grievance.metaDescription },
    "/khata-kavach": { title: t.kk.meta.title, description: t.kk.meta.description, ogTitle: t.kk.meta.ogTitle, ogDescription: t.kk.meta.description },
  };
  const { title, description, ogTitle, ogDescription } = heads[route];
  /* the Khata Kavach page wears its own card */
  const image = route === "/khata-kavach" ? KK_OG_IMAGE : OG_IMAGE;
  const canonical = pathFor(lang, page);

  return {
    title: { absolute: title },
    description,
    authors: [{ name: "VRUOOM PRIVATE LIMITED" }],
    alternates: {
      canonical,
      languages: {
        en: pathFor("en", page),
        hi: pathFor("hi", page),
        "x-default": pathFor("en", page),
      },
    },
    openGraph: {
      type: "website",
      siteName: "MDG Services · VRUOOM PRIVATE LIMITED",
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      locale: lang === "hi" ? "hi_IN" : "en_IN",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [image.url],
    },
    // Bing Webmaster Tools ownership check; keep it, Bing re-checks.
    ...(home ? { other: { "msvalidate.01": BING_VERIFICATION } } : {}),
  };
}
