import { SITE } from "./site";

/**
 * The home page's structured data: the company and the site. The same data
 * index.html carried before the move to Next.
 */
export const HOME_JSON_LD = {
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
  ],
};
