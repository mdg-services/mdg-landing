import type { Metadata } from "next";
import { getT } from "../i18n/server";
import { pathFor, type Lang, type SiteRoute } from "../i18n/lang";

export const SITE = "https://mdgservices.in";
export const OG_IMAGE = { url: "/og.png", width: 2400, height: 1260, alt: "MDG Services · Dealer's कवच" };

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
  const title = home ? t.meta.title : route === "/register" ? t.register.pageTitle : t.grievance.pageTitle;
  const description = home ? t.meta.description : route === "/register" ? t.register.intro : t.grievance.intro;
  const ogTitle = home ? t.meta.ogTitle : title;
  const ogDescription = home ? t.meta.ogDescription : description;
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
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [OG_IMAGE.url],
    },
    // Bing Webmaster Tools ownership check; keep it, Bing re-checks.
    ...(home ? { other: { "msvalidate.01": BING_VERIFICATION } } : {}),
  };
}
