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
 * Pure data and arithmetic: proxy.ts imports this, so no Node APIs.
 */
import { PUMP_PAGES, PUMP_PILLARS, type PumpPage } from "./inventory.js";
import { buildCalendar, dateFrom, dayFrom, type Release as CalendarRelease } from "../guide/calendar.js";
import { PUMP_KEEP_THROUGH_DAY, PUMP_PUBLISHED } from "./release-history.js";

/** Pages that go live each day. Each language counts as one page. */
export const PUMP_PER_DAY = 10;

/** Day 1, as a calendar date in India. */
export const PUMP_START = "2026-11-09";

export type PumpRelease = CalendarRelease<PumpPage>;

export const PUMP_RELEASES: PumpRelease[] = buildCalendar({
  pages: PUMP_PAGES,
  mains: Object.fromEntries(Object.entries(PUMP_PILLARS).map(([k, v]) => [k, v.main])),
  perDay: PUMP_PER_DAY,
  first: ["hub", "disclaimer"],
  pinned: PUMP_PUBLISHED,
  keepThroughDay: PUMP_KEEP_THROUGH_DAY,
  pulledForward: [],
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
