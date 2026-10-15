/**
 * The release schedule: which guide page goes live on which day.
 *
 * Every page is built at once, but only PER_DAY pages (counting each language
 * as a page) go live each day, starting on START in India time. The site does
 * this by itself: proxy.ts answers 404 for a page before its day (India time),
 * and the pages, sitemap and llms.txt are re-rendered as the days pass. No
 * daily deploy.
 *
 * Pages already published stay on the day they went live (FIRST_CALENDAR,
 * KEEP_THROUGH_DAY). Everything else follows from the next day.
 *
 * Order: the guide's front door and disclaimer first, then wave 1, 2, 3 in
 * inventory order, with each topic's main page pulled forward to its earliest
 * page so a page never goes live before the page above it. A page and its
 * Hindi twin go out together when the day has room; when it does not, the
 * next single page fills the gap, or the English page goes today and its Hindi
 * twin first thing the next day.
 *
 * Pure data and arithmetic: proxy.ts imports this, so no Node APIs.
 */
import { PAGES, PILLARS, pathOf, type GuidePage, type Lang } from "./inventory.js";
import { FIRST_CALENDAR } from "./release-history.js";

/** Pages that go live each day. Each language counts as one page. */
export const PER_DAY = 5;

/** Day 1, as a calendar date in India. */
export const START = "2026-10-15";

const IST_OFFSET_MS = 330 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface Release {
  page: GuidePage;
  lang: Lang;
  path: string;
  day: number;
}

function sortKey(page: GuidePage, index: number): [number, number, number] {
  const first = page.id === "hub" ? -2 : page.id === "disclaimer" ? -1 : 0;
  const main = PILLARS[page.pillar].main === page.id;
  const wave = main
    ? Math.min(...PAGES.filter((p) => p.pillar === page.pillar).map((p) => p.wave))
    : page.wave;
  return [first, wave, index];
}

/**
 * Pages of FIRST_CALENDAR that had gone live by the end of this day keep the day
 * they went live. Raise it to the current day whenever the page list changes,
 * before deploying, so nothing already published moves or disappears.
 */
export const KEEP_THROUGH_DAY = 2;

function build(): Release[] {
  const ordered = PAGES.map((p, i) => ({ p, k: sortKey(p, i) }))
    .sort((a, b) => a.k[0] - b.k[0] || a.k[1] - b.k[1] || a.k[2] - b.k[2])
    .map((x) => x.p);

  // Already published: fixed on their day.
  const byPath = new Map<string, { page: GuidePage; lang: Lang }>();
  for (const page of PAGES) for (const lang of page.hi ? (["en", "hi"] as Lang[]) : (["en"] as Lang[])) byPath.set(pathOf(page, lang), { page, lang });
  const out: Release[] = [];
  const pinned = new Set<string>();
  for (const [path, day] of FIRST_CALENDAR) {
    const hit = byPath.get(path);
    if (!hit || day > KEEP_THROUGH_DAY) continue;
    out.push({ ...hit, path, day });
    pinned.add(path);
  }

  const units = ordered
    .map((page) => (page.hi ? (["en", "hi"] as Lang[]) : (["en"] as Lang[])).map((lang) => ({ page, lang })).filter((u) => !pinned.has(pathOf(u.page, u.lang))))
    .filter((u) => u.length > 0);

  // Everything else from the first day after the pinned ones.
  let day = pinned.size ? KEEP_THROUGH_DAY + 1 : 1;
  let room = PER_DAY;
  const place = (unit: { page: GuidePage; lang: Lang }[]) => {
    for (const u of unit) out.push({ page: u.page, lang: u.lang, path: pathOf(u.page, u.lang), day });
    room -= unit.length;
    if (room === 0) {
      day += 1;
      room = PER_DAY;
    }
  };
  while (units.length) {
    const next = units[0];
    if (next.length <= room) {
      place(units.shift()!);
      continue;
    }
    // A pair that does not fit: fill today with the next single page, if one is near.
    const filler = units.slice(1, 8).findIndex((u) => u.length <= room);
    if (filler >= 0) {
      place(units.splice(filler + 1, 1)[0]);
      continue;
    }
    // No single page to fill the gap: the English page goes today, its Hindi twin
    // tomorrow, so every day carries exactly PER_DAY pages.
    const fits = room;
    units[0] = next.slice(fits);
    place(next.slice(0, fits));
  }
  return out.sort((a, b) => a.day - b.day);
}

export const RELEASES: Release[] = build();

/** The last day on which anything goes live. */
export const LAST_DAY = Math.max(...RELEASES.map((r) => r.day));

const DAY_BY_PATH = new Map(RELEASES.map((r) => [r.path, r.day]));

/** The release day of a public path ("/mdg/density/"), or undefined if it is not a guide page. */
export function releaseDayOf(path: string): number | undefined {
  return DAY_BY_PATH.get(path);
}

/** Today's day number in India time: 1 on START, 0 or less before it. */
export function dayOf(now: Date): number {
  const start = Date.parse(`${START}T00:00:00Z`);
  return Math.floor((now.getTime() + IST_OFFSET_MS - start) / DAY_MS) + 1;
}

/** The calendar date (YYYY-MM-DD, India) a day number falls on. */
export function dateOfDay(day: number): string {
  const start = Date.parse(`${START}T00:00:00Z`);
  return new Date(start + (day - 1) * DAY_MS).toISOString().slice(0, 10);
}

/** Which snapshot to serve today: 0 before launch, LAST_DAY once everything is out. */
export function snapshotDay(now: Date): number {
  return Math.max(0, Math.min(LAST_DAY, dayOf(now)));
}

export function snapshotDir(day: number): string {
  return `/_guide/d${String(day).padStart(2, "0")}`;
}
