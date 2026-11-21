/**
 * The site's two guide collections, put together from their data folders:
 * guide/ (the MDG guides) and kk-guide/ (the Khata Kavach pages). See
 * collection.ts for what each field means.
 *
 * No React and no Node APIs: the command line bundles this too.
 */
import { PAGES, PILLARS, VIDEOS } from "../../guide/inventory.ts";
import { RELEASES, LAST_DAY, dayOf, dateOfDay } from "../../guide/schedule.ts";
import { DISCLAIMER, NOTICE_SHORT, SITE, TOLL_FREE, TOPIC_BLURB, UI } from "../../guide/copy.ts";
/**
 * The fixed words of each collection, in every language. English and Hindi are
 * the originals; a further language's file (guide/copy.or.ts) is merged in, and
 * a language a collection has no words for reads English, which it never shows
 * because it has no pages there (guide/translations.ts).
 */
const UI_MDG = fillLangs({ ...UI, or: UI_OR });
const UI_ALL = UI_MDG;
const NOTICE_ALL = fillLangs({ ...NOTICE_SHORT, or: NOTICE_OR });
const DISCLAIMER_ALL = fillLangs({ ...DISCLAIMER, or: DISCLAIMER_OR });
const BLURB_ALL = Object.fromEntries(Object.entries(TOPIC_BLURB).map(([k, v]) => [k, fillLangs({ ...v, ...(TOPIC_BLURB_OR[k] ? { or: TOPIC_BLURB_OR[k] } : {}) })]));
const KK_UI_ALL = fillLangs(KK_UI);
const KK_CTA_ALL = fillLangs(KK_CTA);
const KK_NOTICE_ALL = fillLangs(KK_NOTICE);
const KK_DISCLAIMER_ALL = fillLangs(KK_DISCLAIMER);
const KK_BLURB_ALL = Object.fromEntries(Object.entries(KK_TOPIC_BLURB).map(([k, v]) => [k, fillLangs(v)]));
const PUMP_UI_ALL = fillLangs({ ...PUMP_UI, or: PUMP_UI_OR });
const PUMP_NOTICE_ALL = fillLangs({ ...PUMP_NOTICE, or: PUMP_NOTICE_OR });
const PUMP_DISCLAIMER_ALL = fillLangs({ ...PUMP_DISCLAIMER, or: PUMP_DISCLAIMER_OR });
const PUMP_BLURB_ALL = Object.fromEntries(Object.entries(PUMP_TOPIC_BLURB).map(([k, v]) => [k, fillLangs({ ...v, ...(PUMP_TOPIC_BLURB_OR[k] ? { or: PUMP_TOPIC_BLURB_OR[k] } : {}) })]));

/** Give each topic its name in a further language (a copy file's list), so the crumbs and cards can read it. */
function withNames<T extends Record<string, PillarMeta>>(pillars: T, lang: "or", names: Record<string, string>): T {
  for (const [k, meta] of Object.entries(pillars)) if (names[k]) meta.names = { ...meta.names, [lang]: names[k] };
  return pillars;
}
import { KK_PAGES, KK_PILLARS } from "../../kk-guide/inventory.ts";
import { KK_RELEASES, KK_LAST_DAY, kkDayOf, kkDateOfDay } from "../../kk-guide/schedule.ts";
import { KK_CTA, KK_DISCLAIMER, KK_NOTICE, KK_TOPIC_BLURB, KK_UI } from "../../kk-guide/copy.ts";
import { PUMP_PAGES, PUMP_PILLARS } from "../../pump-guide/inventory.ts";
import { PUMP_RELEASES, PUMP_LAST_DAY, pumpDayOf, pumpDateOfDay } from "../../pump-guide/schedule.ts";
import { PUMP_DISCLAIMER, PUMP_NOTICE, PUMP_TOPIC_BLURB, PUMP_UI } from "../../pump-guide/copy.ts";
import { KK_APPS } from "../data/kk.ts";
import { PILLAR_NAMES_OR, NOTICE_OR, DISCLAIMER_OR, TOPIC_BLURB_OR, UI_OR, PUMP_CROSS_OR } from "../../guide/copy.or.ts";
import { PUMP_DISCLAIMER_OR, PUMP_NOTICE_OR, PUMP_PILLAR_NAMES_OR, PUMP_TOPIC_BLURB_OR, PUMP_UI_OR } from "../../pump-guide/copy.or.ts";
import { pageLangs } from "../../guide/calendar.ts";
import { fillLangs, localPath, type PerLang } from "../i18n/languages.ts";
import { pathFor } from "../i18n/lang.ts";
import type { AnyPage, AnyRelease, Collection, CollectionKey, PillarMeta } from "./collection";
import { mdgClauseTags, mdgPenaltyNotes, mdgTagOk, sourceTagOk, sourceTags } from "./tags";

const hiPrefix = localPath;

/**
 * The Petrol pump guide's front door and three main pages, offered from the
 * MDG guides that readers and crawlers visit most (the hub, each topic's main
 * page, the tools and the density pages). The titles are the pump pages' own.
 */
const PUMP_CROSS: PerLang<{ heading: string; cards: { path: string; title: string; description: string }[] }> = {
  en: {
    heading: "More from MDG Services: the petrol pump guide",
    cards: [
      { path: "/petrol-pump/", title: "Petrol pump guide for India", description: "Open, license and run a pump: nine topics, every fact with its official source and date." },
      { path: "/petrol-pump/dealership/", title: "How to open a petrol pump in India", description: "The route through the oil companies: who can apply and how a dealer is chosen." },
      { path: "/petrol-pump/licences/", title: "Licences and NOCs a petrol pump needs", description: "PESO, pollution consent, fire and more, and who gives each one." },
      { path: "/petrol-pump/equipment/", title: "How a petrol pump works: tanks and dispensers", description: "Tanks, dispensers, nozzles and vapour recovery, and how each is checked." },
    ],
  },
  hi: {
    heading: "MDG Services से और: पेट्रोल पंप गाइड",
    cards: [
      { path: "/petrol-pump/", title: "पेट्रोल पंप गाइड", description: "पंप खोलना, लाइसेंस और संचालन: नौ विषय, हर तथ्य के साथ सरकारी स्रोत और तारीख़।" },
      { path: "/petrol-pump/dealership/", title: "पेट्रोल पंप कैसे खोलें", description: "तेल कंपनियों के ज़रिए रास्ता: कौन आवेदन कर सकता है और डीलर कैसे चुना जाता है।" },
      { path: "/petrol-pump/licences/", title: "पेट्रोल पंप के लिए ज़रूरी लाइसेंस और NOC", description: "PESO, प्रदूषण की मंज़ूरी, फायर और बाकी, और हर एक कौन देता है।" },
      { path: "/petrol-pump/equipment/", title: "पेट्रोल पंप कैसे काम करता है: टैंक और डिस्पेंसर", description: "टैंक, डिस्पेंसर, नोज़ल और वेपर रिकवरी, और हर एक की जाँच कैसे होती है।" },
    ],
  },
};

const PUMP_CROSS_ALL = fillLangs({ ...PUMP_CROSS, or: PUMP_CROSS_OR });

export const MDG: Collection = {
  key: "mdg",
  label: "MDG guide",
  pages: PAGES,
  byId: new Map<string, AnyPage>(PAGES.map((p) => [p.id, p])),
  pillars: withNames(PILLARS, "or", PILLAR_NAMES_OR),
  notTopics: ["hub", "tools"],
  videos: VIDEOS,
  releases: RELEASES as AnyRelease[],
  lastDay: LAST_DAY,
  dayOf,
  dateOfDay,
  contentDir: "guide/content",
  toolsDir: "guide/tools",
  ui: UI_ALL,
  notice: NOTICE_ALL,
  disclaimer: DISCLAIMER_ALL,
  topicBlurb: BLURB_ALL,
  updatesId: "official-pdf-and-updates",
  crumbsBefore: () => [],
  hubInCrumbs: true,
  prepare: mdgPenaltyNotes,
  tags: mdgClauseTags,
  tagOk: mdgTagOk,
  // How the service works, and IndianOil's site (its linking policy asks for permission first).
  forbidden: [/\]\(https?:\/\/(www\.)?iocl\.com/i, /\bSDMS\b/i, /\bIRAS\b/i, /\bOCR\b/, /captcha/i, /scrap(e|ing|er)/i],
  about: () => ({ "@type": "CreativeWork", name: "Marketing Discipline Guidelines 2024 (MDG 2024)" }),
  nav: "guides",
  look: {
    root: "min-h-screen bg-paper text-ink",
    hero: "guide-hero relative overflow-hidden bg-navy-950 text-white",
    heroGlow: "radial-gradient(circle, rgba(245,165,36,.16), transparent 60%)",
    answerText: "text-navy-50",
    cardHover: "group-hover:text-navy-700",
    faqNumber: "text-navy-500",
    ctaBox: "relative mt-14 overflow-hidden rounded-3xl bg-gradient-to-br from-navy-700 via-navy-800 to-navy-950 p-6 text-white sm:p-9",
    ctaGlow: "radial-gradient(circle, rgba(245,165,36,.18), transparent 60%)",
    ctaTitle: "eyebrow-light guide-label !text-gold-300",
    ctaText: "mt-4 max-w-prose2 text-[16px] leading-[1.65] text-navy-100 sm:text-[17px]",
    ctaPrimary: "btn-gold",
    ctaSecondary: "btn-on-dark-ghost",
  },
  themeClass: "",
  officialBox: true,
  cta: (lang) => ({
    title: UI_ALL[lang].ctaTitle,
    text: UI_ALL[lang].cta,
    primary: { href: pathFor(lang, "/register"), label: UI_ALL[lang].register },
    secondary: { href: TOLL_FREE.href, label: UI_ALL[lang].call },
  }),
  crossLinks: (page, lang) => {
    if (!(page.type === "Hub" || page.type === "Pillar" || page.type === "Tool" || page.pillar === "density")) return null;
    const x = PUMP_CROSS_ALL[lang];
    // a card only for a petrol pump guide page that exists in this language (the Odia pack is a hand-picked set)
    const there = (path: string) => PUMP_PAGES.some((p) => p.path === path && pageLangs(p).includes(lang));
    const cards = x.cards.filter((c) => there(c.path)).map((c) => ({ href: hiPrefix(lang, c.path), title: c.title, description: c.description }));
    return cards.length ? { heading: x.heading, cards } : null;
  },
};

/** Pages that are about Khata Kavach itself (its features, how it compares, where it fits). */
const ABOUT_THE_APP = new Set(["Comparison", "Feature", "Trade", "Example"]);

export const KK: Collection = {
  key: "kk",
  label: "Khata Kavach pages",
  pages: KK_PAGES,
  byId: new Map<string, AnyPage>(KK_PAGES.map((p) => [p.id, p])),
  pillars: KK_PILLARS,
  notTopics: ["hub"],
  videos: {},
  releases: KK_RELEASES as AnyRelease[],
  lastDay: KK_LAST_DAY,
  dayOf: kkDayOf,
  dateOfDay: kkDateOfDay,
  contentDir: "kk-guide/content",
  toolsDir: "kk-guide/tools",
  ui: KK_UI_ALL,
  notice: KK_NOTICE_ALL,
  disclaimer: KK_DISCLAIMER_ALL,
  topicBlurb: KK_BLURB_ALL,
  updatesId: null,
  crumbsBefore: (lang) => [{ name: lang === "en" ? "Khata Kavach" : "खाता कवच", href: hiPrefix(lang, "/khata-kavach") }],
  hubInCrumbs: false,
  prepare: (md) => md,
  tags: (html) => sourceTags(html),
  tagOk: sourceTagOk,
  forbidden: [
    // superlatives we cannot prove (ASCI / CCPA): say what it does, not that it is the most
    /\b(simplest|easiest|cheapest|fastest|safest)\b/i,
    /\bnumber one\b|\bno\.\s?1\b|#1\b/i,
    /सबसे (आसान|सस्ता|सस्ती|तेज़|सुरक्षित)/,
    // the price is not published
    /(Khata Kavach|खाता कवच)[^.।]{0,40}\b(free|मुफ़्त|मुफ्त|फ्री|फ़्री)\b/i,
    // how it is built
    /\b(MongoDB|Atlas|AWS|Amazon S3|Vercel|pdfkit|IndexedDB|nginx|pm2)\b/i,
  ],
  about: (page) =>
    ABOUT_THE_APP.has(page.type)
      ? {
          "@type": "SoftwareApplication",
          name: "Khata Kavach",
          url: `${SITE}/khata-kavach`,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
        }
      : { "@type": "Thing", name: "Selling on credit (udhar) to regular customers" },
  nav: "khata",
  look: {
    root: "min-h-screen bg-kk-paper text-kk-ink",
    hero: "guide-hero relative overflow-hidden bg-kk-coal text-white",
    heroGlow: "radial-gradient(circle, rgba(227,238,232,.14), transparent 60%)",
    answerText: "text-kk-wash",
    cardHover: "group-hover:text-kk-siyahi",
    faqNumber: "text-kk-siyahi",
    ctaBox: "relative mt-14 overflow-hidden rounded-3xl bg-gradient-to-br from-kk-siyahi via-kk-deep to-kk-coal p-6 text-white sm:p-9",
    ctaGlow: "radial-gradient(circle, rgba(244,239,227,.14), transparent 60%)",
    ctaTitle: "eyebrow-light guide-label !text-kk-cream",
    ctaText: "mt-4 max-w-prose2 text-[16px] leading-[1.65] text-kk-wash sm:text-[17px]",
    ctaPrimary: "kk-btn-light",
    ctaSecondary: "btn-on-dark-ghost",
  },
  themeClass: "kk-guide",
  officialBox: false,
  cta: (lang) => ({
    title: KK_UI_ALL[lang].ctaTitle,
    text: KK_CTA_ALL[lang].text,
    // A business starts on its own in the Business app; the call is the second way in.
    primary: { href: KK_APPS.signup, label: KK_CTA_ALL[lang].primary },
    secondary: { href: TOLL_FREE.href, label: KK_UI_ALL[lang].call },
  }),
  crossLinks: () => null,
};

/** The Petrol pump guide: getting, licensing and running a petrol pump. Looks like the MDG guides; cites sources, not MDG clauses. */
export const PUMP: Collection = {
  key: "pump",
  label: "Petrol pump guide",
  pages: PUMP_PAGES,
  byId: new Map<string, AnyPage>(PUMP_PAGES.map((p) => [p.id, p])),
  pillars: withNames(PUMP_PILLARS, "or", PUMP_PILLAR_NAMES_OR),
  notTopics: ["hub"],
  videos: {},
  releases: PUMP_RELEASES as AnyRelease[],
  lastDay: PUMP_LAST_DAY,
  dayOf: pumpDayOf,
  dateOfDay: pumpDateOfDay,
  contentDir: "pump-guide/content",
  toolsDir: "pump-guide/tools",
  ui: PUMP_UI_ALL,
  notice: PUMP_NOTICE_ALL,
  disclaimer: PUMP_DISCLAIMER_ALL,
  topicBlurb: PUMP_BLURB_ALL,
  updatesId: null,
  crumbsBefore: () => [],
  hubInCrumbs: true,
  prepare: (md) => md,
  tags: (html) => sourceTags(html),
  tagOk: sourceTagOk,
  forbidden: [
    // IndianOil's site (its linking policy asks for permission first), and how our service works
    /\]\(https?:\/\/(www\.)?iocl\.com/i,
    /\bSDMS\b/i, /\bIRAS\b/i, /\bOCR\b/, /captcha/i, /scrap(e|ing|er)/i,
    // promises nobody can keep: a dealership, a licence, an income
    /\b(guaranteed?|assured|sure(-| )shot) (dealership|licen[cs]e|approval|profit|income|returns?)\b/i,
    /\b(we|MDG Services) (can )?(get|arrange|book|allot|sell) (you )?(a |your )?(petrol pump|dealership|licen[cs]e)/i,
    // superlatives we cannot prove
    /\b(best|cheapest|easiest|fastest|safest) (way|petrol pump|dealership)\b/i,
  ],
  about: () => ({ "@type": "Thing", name: "Opening and running a petrol pump in India" }),
  nav: "guides",
  look: MDG.look,
  themeClass: "",
  officialBox: false,
  cta: (lang) => ({
    title: UI_MDG[lang].ctaTitle,
    text: UI_MDG[lang].cta,
    primary: { href: pathFor(lang, "/register"), label: UI_MDG[lang].register },
    secondary: { href: TOLL_FREE.href, label: UI_MDG[lang].call },
  }),
  crossLinks: () => null,
};

export const COLLECTIONS: Record<CollectionKey, Collection> = { mdg: MDG, kk: KK, pump: PUMP };

/** Every collection, MDG first. */
export const ALL: Collection[] = [MDG, KK, PUMP];
