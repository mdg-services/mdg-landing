import { SITE } from "./site";
import { getT } from "../i18n/server";
import type { Lang } from "../i18n/lang";

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
        description: "Compliance software for India's petrol pump dealers, in Hindi and English.",
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
