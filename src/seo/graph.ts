import { SITE } from "./site";
import { BRAND, OFFICE } from "../data/content";
import { NEW_PUMP_QUESTION_GROUPS } from "../data/newPumpQuestions";
import { TOLL_FREE } from "../lib/tollFree";
import { getT } from "../i18n/server";
import { DOC_KEY } from "../i18n/doc";
import { docFacts, fill, newPumpPrice } from "../lib/docText";
import { LANGS, LANGUAGES, homeHref, pathFor, type CompanyRoute, type Lang } from "../i18n/lang";

/** The languages the website is written in, for structured data: ["en-IN", "hi-IN", "or-IN"]. */
const IN_LANGUAGE = LANGS.map((l) => LANGUAGES[l].bcp47);

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
        inLanguage: IN_LANGUAGE,
        publisher: { "@id": `${SITE}/#org` },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE}${pathFor(lang)}#faq`,
        inLanguage: LANGUAGES[lang].bcp47,
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
  const inLanguage = LANGUAGES[lang].bcp47;
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
        // the app's own languages, not the website's
        inLanguage: ["en-IN", "hi-IN"],
        publisher: { "@id": `${SITE}/#org` },
        author: { "@id": `${SITE}/#org` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#crumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "MDG Services", item: `${SITE}${homeHref(lang)}` },
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
 * New Pump Guide's structured data (ADR 0058): the service (a feature of the
 * Dealer Kavach app, made by MDG Services), its monthly price as the page
 * states it, where the page sits in the site, and the questions it answers, in
 * the page's own language.
 */
export function newPumpJsonLd(lang: Lang) {
  const t = getT(lang).newPump;
  const url = `${SITE}${pathFor(lang, "/new-pump")}`;
  const { total } = newPumpPrice();
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
        "@type": "Service",
        "@id": `${SITE}/new-pump#service`,
        name: "Kavach Shuruaat",
        alternateName: "कवच शुरुआत",
        url,
        description: fill(t.meta.description, docFacts(lang)),
        serviceType: "Guidance on opening a petrol pump, from official documents",
        areaServed: { "@type": "Country", name: "India" },
        provider: { "@id": `${SITE}/#org` },
        offers: {
          "@type": "Offer",
          // the monthly total with GST, as the page prints it
          price: (total / 100).toFixed(2),
          priceCurrency: "INR",
          url,
          // the same figure again, said to be per month and to include GST: search engines read
          // priceSpecification as this offer's price, so a different figure here would contradict it
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: (total / 100).toFixed(2),
            priceCurrency: "INR",
            valueAddedTaxIncluded: true,
            referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#crumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "MDG Services", item: `${SITE}${homeHref(lang)}` },
          { "@type": "ListItem", position: 2, name: t.name, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        inLanguage: LANGUAGES[lang].bcp47,
        // the sample questions and the FAQ: both are questions with their answers on the page
        mainEntity: [...t.examples.items, ...t.faq.items].map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

/**
 * The questions hub's structured data (ADR 0059 §6): every question with its
 * short answer, in the page's own language and order, and where the page sits
 * (MDG Services, Kavach Shuruaat, Questions). The answers are the text on
 * screen; the "read the full answer" links are not part of them.
 */
export function newPumpQuestionsJsonLd(lang: Lang) {
  const t = getT(lang);
  const q = t.newPumpQuestions;
  const url = `${SITE}${pathFor(lang, "/new-pump/questions")}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#crumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "MDG Services", item: `${SITE}${homeHref(lang)}` },
          { "@type": "ListItem", position: 2, name: t.newPump.name, item: `${SITE}${pathFor(lang, "/new-pump")}` },
          { "@type": "ListItem", position: 3, name: q.crumb, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        name: q.hero.heading,
        url,
        inLanguage: LANGUAGES[lang].bcp47,
        publisher: { "@type": "Organization", "@id": `${SITE}/#org`, name: "MDG Services", url: `${SITE}/` },
        mainEntity: NEW_PUMP_QUESTION_GROUPS.flatMap((g) =>
          g.questions.map((x) => ({
            "@type": "Question",
            name: q.questions[x.id].q,
            acceptedAnswer: { "@type": "Answer", text: q.questions[x.id].a },
          })),
        ),
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
  const inLanguage = LANGUAGES[lang].bcp47;
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
                // the languages the support desk answers in (not the website's: the pages are in Odia, the desk is not yet)
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
          { "@type": "ListItem", position: 1, name: "MDG Services", item: `${SITE}${homeHref(lang)}` },
          { "@type": "ListItem", position: 2, name: doc.eyebrow, item: url },
        ],
      },
    ],
  };
}
