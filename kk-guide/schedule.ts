/**
 * The release schedule of the Khata Kavach pages: five a day (each language
 * counts as a page) from START, India time, on their own calendar beside the
 * MDG guides' (guide/schedule.ts). The ordering rules are in
 * guide/calendar.ts.
 *
 * Once pages are live, pin them before changing the page list: copy the
 * calendar into PUBLISHED and raise KEEP_THROUGH_DAY to today's day, so nothing
 * already published moves or disappears.
 *
 * Pure data and arithmetic: proxy.ts imports this, so no Node APIs.
 */
import { KK_PAGES, KK_PILLARS, type KkPage } from "./inventory.js";
import { buildCalendar, dateFrom, dayFrom, type Release as CalendarRelease } from "../guide/calendar.js";
import { KK_FIRST_CALENDAR } from "./release-history.js";

/** Pages that go live each day. Each language counts as one page. */
export const KK_PER_DAY = 5;

/** Day 1, as a calendar date in India. */
export const KK_START = "2026-10-19";

export type KkRelease = CalendarRelease<KkPage>;

/** [path, day] of pages published (the calendar frozen on 20 Oct 2026, day 2). */
export const KK_PUBLISHED: ReadonlyArray<readonly [string, number]> = KK_FIRST_CALENDAR;

/**
 * Pages of KK_PUBLISHED that had gone live by the end of this day keep their
 * day. Raise it to the current day whenever the page list changes, before
 * deploying.
 * - 20 Oct 2026 (day 2): the udhar khata format and the credit-limit calculator added.
 */
export const KK_KEEP_THROUGH_DAY = 2;

export const KK_RELEASES: KkRelease[] = buildCalendar({
  pages: KK_PAGES,
  mains: Object.fromEntries(Object.entries(KK_PILLARS).map(([k, v]) => [k, v.main])),
  perDay: KK_PER_DAY,
  first: ["hub", "disclaimer"],
  pinned: KK_PUBLISHED,
  keepThroughDay: KK_KEEP_THROUGH_DAY,
  pulledForward: [],
});

export const KK_LAST_DAY = Math.max(...KK_RELEASES.map((r) => r.day));

const DAY_BY_PATH = new Map(KK_RELEASES.map((r) => [r.path, r.day]));

/** The release day of a public path ("/khata-kavach/compare/khatabook/"), or undefined. */
export function kkReleaseDayOf(path: string): number | undefined {
  return DAY_BY_PATH.get(path);
}

export function kkDayOf(now: Date): number {
  return dayFrom(KK_START, now);
}

export function kkDateOfDay(day: number): string {
  return dateFrom(KK_START, day);
}
