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
import { KK_PAGES, KK_PILLARS } from "../../kk-guide/inventory.ts";
import { KK_RELEASES, KK_LAST_DAY, kkDayOf, kkDateOfDay } from "../../kk-guide/schedule.ts";
import { KK_CTA, KK_DISCLAIMER, KK_NOTICE, KK_TOPIC_BLURB, KK_UI } from "../../kk-guide/copy.ts";
import type { AnyPage, AnyRelease, Collection, CollectionKey, Lang } from "./collection";
import { mdgClauseTags, mdgPenaltyNotes, mdgTagOk, sourceTagOk, sourceTags } from "./tags";

const hiPrefix = (lang: Lang, path: string) => (lang === "hi" ? `/hi${path}` : path);

export const MDG: Collection = {
  key: "mdg",
  label: "MDG guide",
  pages: PAGES,
  byId: new Map<string, AnyPage>(PAGES.map((p) => [p.id, p])),
  pillars: PILLARS,
  notTopics: ["hub", "tools"],
  videos: VIDEOS,
  releases: RELEASES as AnyRelease[],
  lastDay: LAST_DAY,
  dayOf,
  dateOfDay,
  contentDir: "guide/content",
  toolsDir: "guide/tools",
  ui: UI,
  notice: NOTICE_SHORT,
  disclaimer: DISCLAIMER,
  topicBlurb: TOPIC_BLURB,
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
    title: UI[lang].ctaTitle,
    text: UI[lang].cta,
    primary: { href: lang === "hi" ? "/hi/register" : "/register", label: UI[lang].register },
    secondary: { href: TOLL_FREE.href, label: UI[lang].call },
  }),
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
  ui: KK_UI,
  notice: KK_NOTICE,
  disclaimer: KK_DISCLAIMER,
  topicBlurb: KK_TOPIC_BLURB,
  updatesId: null,
  crumbsBefore: (lang) => [{ name: lang === "hi" ? "खाता कवच" : "Khata Kavach", href: hiPrefix(lang, "/khata-kavach") }],
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
    title: KK_UI[lang].ctaTitle,
    text: KK_CTA[lang].text,
    primary: { href: `${hiPrefix(lang, "/khata-kavach")}#start`, label: KK_CTA[lang].primary },
    secondary: { href: TOLL_FREE.href, label: KK_UI[lang].call },
  }),
};

export const COLLECTIONS: Record<CollectionKey, Collection> = { mdg: MDG, kk: KK };

/** Both collections, MDG first. */
export const ALL: Collection[] = [MDG, KK];
