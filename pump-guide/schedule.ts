/**
 * The release schedule of the Petrol pump guide: ten pages a day (each language
 * counts as a page) from START, India time, on its own calendar beside the MDG
 * guides' (guide/schedule.ts) and the Khata Kavach pages' (kk-guide/schedule.ts).
 * The ordering rules are in guide/calendar.ts.
 *
 * The first 21 topics (42 pages) went live together on day 1. Pages already
 * live are pinned in pump-guide/release-history.ts (PUMP_PUBLISHED, frozen by
 * `npm run guide -- freeze pump`), so adding pages never moves one that is
 * live. New pages follow from the next day, ten a day, in inventory order.
 *
 * 26 Nov 2026 (day 18): 17 topics (34 pages) for people planning a new pump went
 * live together that day, outside the ten a day. To do that without moving
 * anything, the whole calendar of that day (live and queued pages, through day
 * 25) is pinned as well (PUMP_CALENDAR_26_NOV).
 *
 * Pure data and arithmetic: proxy.ts imports this, so no Node APIs.
 */
import { PUMP_PAGES, PUMP_PILLARS, type PumpPage } from "./inventory.js";
import { buildCalendar, dateFrom, dayFrom, type Release as CalendarRelease } from "../guide/calendar.js";
import { PUMP_CALENDAR_26_NOV, PUMP_CALENDAR_26_NOV_LAST_DAY, PUMP_KEEP_THROUGH_DAY, PUMP_PUBLISHED } from "./release-history.js";
import { PUMP_TRANSLATIONS } from "../guide/translations.js";

/** Pages that go live each day. Each language counts as one page. */
export const PUMP_PER_DAY = 10;

/** Day 1, as a calendar date in India. */
export const PUMP_START = "2026-11-09";

export type PumpRelease = CalendarRelease<PumpPage>;

/** The day the early batch of 26 Nov 2026 went live. */
const EARLY_26_NOV_DAY = 18;

/** The 17 topics put out early on 26 Nov 2026, in English and Hindi. */
const EARLY_26_NOV_IDS = [
  "dealership-reading-advertisement",
  "dealership-application-form",
  "dealership-land-groups",
  "dealership-without-land",
  "dealership-corpus-fund-scheme",
  "money-loan-schemes",
  "dealership-interview",
  "dealership-draw-result",
  "dealership-bidding-process",
  "dealership-field-verification",
  "dealership-letter-of-intent",
  "dealership-appointment-and-commissioning",
  "dealership-cng-pump",
  "dealership-mini-petrol-pump",
  "dealership-private-petrol-pump",
  "site-offer-land-to-oil-company",
  "site-nhai-wayside-amenities",
];
const EARLY_26_NOV: ReadonlyArray<readonly [string, number]> = PUMP_PAGES.filter((p) => EARLY_26_NOV_IDS.includes(p.id)).flatMap(
  (p) => [[p.path, EARLY_26_NOV_DAY], ...(p.hi ? [[`/hi${p.path}`, EARLY_26_NOV_DAY] as const] : [])] as const,
);

/**
 * Every pinned [path, day]: the calendar of 26 Nov, the pages the freeze command
 * has pinned since, and the early batch. A path listed twice keeps one entry
 * (the later list wins), because the calendar builder places every entry it is
 * given and a duplicate would put the page out twice.
 */
const PUMP_PINNED: ReadonlyArray<readonly [string, number]> = [
  ...new Map([...PUMP_CALENDAR_26_NOV, ...PUMP_PUBLISHED, ...EARLY_26_NOV].map(([path, day]) => [path, day] as const)).entries(),
];

/**
 * Pinned pages up to this day keep their day. The freeze command lowers
 * PUMP_KEEP_THROUGH_DAY to the day it runs, so the queued days of the 26 Nov
 * calendar are kept by taking the later of the two.
 */
const PUMP_KEEP = Math.max(PUMP_KEEP_THROUGH_DAY, PUMP_CALENDAR_26_NOV_LAST_DAY);

export const PUMP_RELEASES: PumpRelease[] = buildCalendar({
  pages: PUMP_PAGES,
  mains: Object.fromEntries(Object.entries(PUMP_PILLARS).map(([k, v]) => [k, v.main])),
  perDay: PUMP_PER_DAY,
  first: ["hub", "disclaimer"],
  pinned: PUMP_PINNED,
  keepThroughDay: PUMP_KEEP,
  pulledForward: [],
  translations: PUMP_TRANSLATIONS,
  start: PUMP_START,
});

export const PUMP_LAST_DAY = Math.max(...PUMP_RELEASES.map((r) => r.day));

const DAY_BY_PATH = new Map(PUMP_RELEASES.map((r) => [r.path, r.day]));

/** The release day of a public path ("/petrol-pump/licences/"), or undefined. */
export function pumpReleaseDayOf(path: string): number | undefined {
  return DAY_BY_PATH.get(path);
}

export function pumpDayOf(now: Date): number {
  return dayFrom(PUMP_START, now);
}

export function pumpDateOfDay(day: number): string {
  return dateFrom(PUMP_START, day);
}
