/**
 * The pages written in a language beyond English and Hindi, and the date they
 * go live. English and Hindi go out five (or ten) a day on each collection's
 * calendar; a further language is a hand-picked set that goes live together,
 * so adding it never moves a page that is already published.
 *
 * To add pages in a language that already has some: write
 * `<collection>/content/<code>/<id>.md` and add the id to that language's list
 * here (keep its `live` date: a page added later goes live on the day you add
 * it, so give it a new entry with a new date).
 *
 * To start a new language: LANGUAGES.md in the project root.
 *
 * Pure data: proxy.ts imports it through the schedules, so no Node APIs.
 */
import type { Lang, Translation } from "./calendar.ts";

export type TranslationSet = ReadonlyArray<Translation>;

/** The Odia pack: the pages Odia readers search for first (the guide's front door, density, penalties, inspection, stock, tankers) and how to open and license a pump. */
export const MDG_TRANSLATIONS: TranslationSet = [
  {
    lang: "or",
    live: "2026-11-21",
    ids: ["hub", "disclaimer", "density-petrol", "density-diesel", "density-by-state", "mdg-summary", "mdg-questions-answers", "penalties", "inspection", "stock-variation", "receiving-a-tanker"],
  },
];

export const KK_TRANSLATIONS: TranslationSet = [];

export const PUMP_TRANSLATIONS: TranslationSet = [
  {
    lang: "or",
    live: "2026-11-21",
    ids: ["hub", "disclaimer", "dealership", "dealership-eligibility", "dealership-process", "dealership-rural-outlet", "licences", "money"],
  },
];

/** Give each page the further languages it is written in (idempotent; keeps the lists on the page objects). */
export function applyTranslations<P extends { id: string; more?: Lang[] }>(pages: P[], set: TranslationSet): void {
  for (const t of set) {
    for (const id of t.ids) {
      const page = pages.find((p) => p.id === id);
      if (!page) throw new Error(`translation ${t.lang}: unknown page ${id}`);
      page.more = [...new Set([...(page.more ?? []), t.lang])];
    }
  }
}
