import { SITE } from "./site";
import { BRAND, OFFICE } from "../data/content";
import { TOLL_FREE } from "../lib/tollFree";
import { getT } from "../i18n/server";
import { DOC_KEY } from "../i18n/doc";
import { pathFor, type CompanyRoute, type Lang } from "../i18n/lang";

/**
 * The home page's structured data: the company, the site, and the questions
 * the page answers. The questions come from the same list the page draws, in
 * the page's own language, so the markup is the text on screen.
 */
export function homeJsonLd(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE}/#org`,
        name: "MDG Services",
        legalName: "VRUOOM PRIVATE LIMITED",
        url: `${SITE}/`,
        logo: `${SITE}/logo-mark.png`,
        description:
          "Apps for India's petrol pump dealers and the transporters who buy from them, in Hindi and English: Dealer's Kavach and Khata Kavach.",
        brand: [
          { "@type": "Brand", name: "Dealer's Kavach", url: `${SITE}/` },
          { "@type": "Brand", name: "Khata Kavach", url: `${SITE}/khata-kavach` },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE}/#site`,
        name: "MDG Services",
        url: `${SITE}/`,
        inLanguage: ["en-IN", "hi-IN"],
        publisher: { "@id": `${SITE}/#org` },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE}${lang === "hi" ? "/hi" : "/"}#faq`,
        inLanguage: lang === "hi" ? "hi-IN" : "en-IN",
        mainEntity: getT(lang).faq.items.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

/**
 * The Khata Kavach page's structured data: the app (made by MDG Services, the
 * same organisation as the home page's), where the page sits in the site, and
 * the questions it answers, in the page's own language. No price and no rating:
 * the page states neither.
 */
export function kkJsonLd(lang: Lang) {
  const t = getT(lang).kk;
  const url = `${SITE}${pathFor(lang, "/khata-kavach")}`;
  const inLanguage = lang === "hi" ? "hi-IN" : "en-IN";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE}/#org`,
        name: "MDG Services",
        legalName: "VRUOOM PRIVATE LIMITED",
        url: `${SITE}/`,
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE}/khata-kavach#app`,
        name: "Khata Kavach",
        alternateName: "खाता कवच",
        url,
        description: t.meta.appDescription,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        inLanguage: ["en-IN", "hi-IN"],
        publisher: { "@id": `${SITE}/#org` },
        author: { "@id": `${SITE}/#org` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#crumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "MDG Services", item: `${SITE}${lang === "hi" ? "/hi" : "/"}` },
          { "@type": "ListItem", position: 2, name: t.name, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        inLanguage,
        mainEntity: t.faq.items.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

/**
 * The structured data of a company page: the page itself (an About, a Contact
 * or a plain web page), where it sits in the site, and the company behind it.
 * About and Contact add what a reader of those pages looks for: the registered
 * office, the company number, how to reach it and when. No price and no rating.
 */
export function companyJsonLd(lang: Lang, route: CompanyRoute) {
  const doc = getT(lang)[DOC_KEY[route]];
  const url = `${SITE}${pathFor(lang, route)}`;
  const inLanguage = lang === "hi" ? "hi-IN" : "en-IN";
  const full = route === "/about" || route === "/contact";
  const pageType = route === "/about" ? "AboutPage" : route === "/contact" ? "ContactPage" : "WebPage";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE}/#org`,
        name: "MDG Services",
        legalName: BRAND.legalName,
        url: `${SITE}/`,
        ...(full
          ? {
              foundingDate: "2021-10-13",
              identifier: { "@type": "PropertyValue", propertyID: "CIN", value: BRAND.cin },
              address: {
                "@type": "PostalAddress",
                streetAddress: OFFICE.street,
                addressLocality: OFFICE.city,
                addressRegion: OFFICE.state,
                postalCode: OFFICE.pin,
                addressCountry: "IN",
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                email: BRAND.companyEmail,
                telephone: TOLL_FREE.href.replace("tel:", ""),
                availableLanguage: ["English", "Hindi"],
                hoursAvailable: {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                  opens: "09:00",
                  closes: "21:00",
                },
              },
            }
          : {}),
      },
      {
        "@type": pageType,
        "@id": `${url}#page`,
        url,
        name: doc.eyebrow,
        inLanguage,
        isPartOf: { "@id": `${SITE}/#site` },
        about: { "@id": `${SITE}/#org` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#crumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "MDG Services", item: `${SITE}${lang === "hi" ? "/hi" : "/"}` },
          { "@type": "ListItem", position: 2, name: doc.eyebrow, item: url },
        ],
      },
    ],
  };
}
