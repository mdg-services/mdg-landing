import { SITE } from "./site";
import { getT } from "../i18n/server";
import { pathFor, type Lang } from "../i18n/lang";

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
          "Apps for India's petrol pump dealers, and for any business that sells on credit to regular customers, in Hindi and English: Dealer's Kavach and Khata Kavach.",
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
