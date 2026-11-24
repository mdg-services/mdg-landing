/**
 * The release schedule of the MDG guides: which page goes live on which day.
 *
 * Every page is built at once, but only PER_DAY pages (counting each language
 * as a page) go live each day, starting on START in India time. The site does
 * this by itself: proxy.ts answers 404 for a page before its day (India time),
 * and the pages, sitemap and llms.txt are re-rendered as the days pass. No
 * daily deploy.
 *
 * Pages already published stay on the day they went live (PUBLISHED,
 * KEEP_THROUGH_DAY). Everything else follows from the next day. The ordering
 * rules are in guide/calendar.ts, shared with the Khata Kavach pages.
 *
 * Pure data and arithmetic: proxy.ts imports this, so no Node APIs.
 */
import { PAGES, PILLARS, type GuidePage } from "./inventory.js";
import { MDG_TRANSLATIONS } from "./translations.js";
import { CALENDAR_24_NOV } from "./release-history.js";
import { buildCalendar, dateFrom, dayFrom, type Release as CalendarRelease } from "./calendar.js";

/** Pages that go live each day. Each language counts as one page. */
export const PER_DAY = 5;

/** Day 1, as a calendar date in India. */
export const START = "2026-10-15";

export type Release = CalendarRelease<GuidePage>;

/**
 * Pages put out on a day of their own choosing, outside the five a day.
 * - 26 Oct 2026 (day 12): 17 pages (six tools and eleven guides) picked from
 *   what Search Console shows the site for and what Google suggests next to it.
 */
// Those 17 went live on day 12 and are part of CALENDAR_31_OCT now: tools-litres-to-kg,
// tools-5-litre-test, tools-dip-chart, tools-dealer-margin, tools-density-chart, tools-registers,
// density-high-or-low, density-temperature, density-e20, density-kit, density-board,
// service-customer-checks, mdg-every-oil-company, inspection-who, mdg-questions-answers,
// stock-what-is-dip, product-names.

/**
 * - 31 Oct 2026 (day 17): 10 pages doubling down on what Search Console shows
 *   the site for (petrol and diesel density, density numbers, premium petrol,
 *   oil companies, states and Assam, litres-to-kg table, MDG in ten points, two
 *   more question-and-answer pages). Part of CALENDAR_24_NOV now.
 * - 24 Nov 2026 (day 41): 50 dealer-situation topics, 100 pages ("what to do when a
 *   QRC team arrives", "what to watch while a tanker is unloaded" and the like),
 *   put out together on the day they were written, outside the five a day.
 */
const EARLY_24_NOV_IDS = [
  "inspection-qrc-team-visit",
  "inspection-night-before-checklist",
  "inspection-morning-of-checks",
  "inspection-samples-though-tests-pass",
  "inspection-government-officer-visit",
  "inspection-dealer-absent-who-signs",
  "inspection-report-has-remarks",
  "inspection-show-cause-notice-first-checks",
  "inspection-refusing-or-obstructing",
  "inspection-after-customer-complaint",
  "tanker-while-unloading-checks",
  "tanker-documents-do-not-match",
  "tanker-seal-or-lock-mismatch",
  "tanker-dip-rod-and-certificate",
  "tanker-master-valve-before-dip",
  "tanker-two-products-two-compartments",
  "tanker-unauthorised-product-found",
  "tanker-selling-during-decant",
  "sampling-label-and-custody",
  "sampling-result-waiting-time",
  "sampling-retention-seal-or-leak",
  "sampling-more-than-one-tank",
  "density-out-of-range-what-happens",
  "density-2t-premix-nozzle",
  "density-missing-on-invoice",
  "stock-book-and-dip-do-not-match",
  "stock-four-percent-of-what",
  "stock-600-kl-slab",
  "quantity-broken-seal-first-steps",
  "quantity-short-nozzle-or-whole-unit",
  "quantity-dispenser-repair-record",
  "quantity-dispenser-inspection-checklist",
  "quantity-lube-measures-stamp",
  "service-customer-complaint-steps",
  "service-air-and-telephone",
  "service-hours-and-holiday-notice",
  "service-digital-payment-enabled",
  "service-forecourt-housekeeping",
  "service-safety-equipment-and-signs",
  "service-product-not-available",
  "penalties-minor-ladder",
  "penalties-beyond-the-table",
  "penalties-unauthorised-purchase-sale",
  "penalties-sales-stopped-on-the-spot",
  "automation-power-cut-backup",
  "automation-atg-not-working",
  "company-sample-containers-and-seals",
  "company-maintenance-job-report",
  "company-depot-reference-sample",
  "sko-inspection-checklist",
];
const EARLY_24_NOV: ReadonlyArray<readonly [string, number]> = PAGES.filter((p) => EARLY_24_NOV_IDS.includes(p.id)).flatMap(
  (p) => [[p.path, 41], ...(p.hi ? [[`/hi${p.path}`, 41] as const] : [])] as const,
);

/**
 * [path, day] of pages published: the calendar frozen on 24 Nov 2026 (day 41,
 * which already holds every earlier snapshot and early release) and the pages
 * put out early that day.
 */
export const PUBLISHED: ReadonlyArray<readonly [string, number]> = [...CALENDAR_24_NOV, ...EARLY_24_NOV];

/**
 * Pages of PUBLISHED that had gone live by the end of this day keep the day
 * they went live. Raise it to the current day whenever the page list changes,
 * before deploying, so nothing already published moves or disappears.
 * - 26 Oct 2026: raised from 2 to 12 with the new snapshot.
 * - 31 Oct 2026: raised from 12 to 17 with the next snapshot.
 * - 24 Nov 2026: raised from 17 to 41 with the next snapshot.
 */
export const KEEP_THROUGH_DAY = 41;

/**
 * Early releases the owner asked for. On `day`, the pages of the next `days`
 * days go out as well, and everything after moves up by that many days, so the
 * daily rhythm carries on from the new point.
 * - 17 Oct 2026 (day 3): "release the next 10 pages" (days 4 and 5). Baked into
 *   CALENDAR_26_OCT, so it is no longer applied here (applying it again would
 *   move every pinned page after day 3 back by two days).
 */
export const PULLED_FORWARD: ReadonlyArray<{ day: number; days: number }> = [];

export const RELEASES: Release[] = buildCalendar({
  pages: PAGES,
  mains: Object.fromEntries(Object.entries(PILLARS).map(([k, v]) => [k, v.main])),
  perDay: PER_DAY,
  first: ["hub", "disclaimer"],
  pinned: PUBLISHED,
  keepThroughDay: KEEP_THROUGH_DAY,
  pulledForward: PULLED_FORWARD,
  translations: MDG_TRANSLATIONS,
  start: START,
});

/** The last day on which anything goes live. */
export const LAST_DAY = Math.max(...RELEASES.map((r) => r.day));

const DAY_BY_PATH = new Map(RELEASES.map((r) => [r.path, r.day]));

/** The release day of a public path ("/guides/density/"), or undefined if it is not a guide page. */
export function releaseDayOf(path: string): number | undefined {
  return DAY_BY_PATH.get(path);
}

/** Today's day number in India time: 1 on START, 0 or less before it. */
export function dayOf(now: Date): number {
  return dayFrom(START, now);
}

/** The calendar date (YYYY-MM-DD, India) a day number falls on. */
export function dateOfDay(day: number): string {
  return dateFrom(START, day);
}
