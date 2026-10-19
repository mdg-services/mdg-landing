/**
 * The release calendar, for any set of guide pages: which page goes live on
 * which day, PER_DAY pages a day (each language counts as a page).
 *
 * guide/schedule.ts (the MDG guides) and kk-guide/schedule.ts (the Khata Kavach
 * pages) each call `buildCalendar` with their own page list and settings, so
 * the two sets of pages keep their own start day and their own five a day.
 *
 * Order: the pages named in `first` (the front door, the disclaimer), then
 * wave 1, 2, 3 in list order, with each topic's main page pulled forward to its
 * earliest page so a page never goes live before the page above it. A page and
 * its Hindi twin go out together when the day has room; when it does not, the
 * next single page fills the gap, or the English page goes today and its Hindi
 * twin first thing the next day.
 *
 * Pages already published stay on the day they went live (`pinned`, up to
 * `keepThroughDay`). Everything else follows from the next day.
 *
 * Pure data and arithmetic: proxy.ts imports this, so no Node APIs.
 */

export type Lang = "en" | "hi";

/** What the calendar needs to know about a page. */
export interface CalendarPage {
  id: string;
  pillar: string;
  /** English path, with trailing slash. The Hindi twin lives at "/hi" + path. */
  path: string;
  hi: boolean;
  wave: number;
}

export interface Release<P extends CalendarPage = CalendarPage> {
  page: P;
  lang: Lang;
  path: string;
  day: number;
}

export interface CalendarOptions<P extends CalendarPage> {
  pages: P[];
  /** The id of each topic's main page, by topic. */
  mains: Record<string, string>;
  /** Pages that go live each day. Each language counts as one page. */
  perDay: number;
  /** Ids that go first, in this order (the front door, then the disclaimer). */
  first: string[];
  /** [path, day] of pages already published. */
  pinned: ReadonlyArray<readonly [string, number]>;
  /** Pinned pages live by the end of this day keep their day. */
  keepThroughDay: number;
  /** Early releases: on `day`, the pages of the next `days` days go out as well. */
  pulledForward: ReadonlyArray<{ day: number; days: number }>;
}

const IST_OFFSET_MS = 330 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/** The public path of a page in a language. */
export function pathIn(page: CalendarPage, lang: Lang): string {
  return lang === "hi" ? `/hi${page.path}` : page.path;
}

export function buildCalendar<P extends CalendarPage>(o: CalendarOptions<P>): Release<P>[] {
  const sortKey = (page: P, index: number): [number, number, number] => {
    const rank = o.first.indexOf(page.id);
    const first = rank >= 0 ? rank - o.first.length : 0;
    const main = o.mains[page.pillar] === page.id;
    const wave = main ? Math.min(...o.pages.filter((p) => p.pillar === page.pillar).map((p) => p.wave)) : page.wave;
    return [first, wave, index];
  };
  const ordered = o.pages
    .map((p, i) => ({ p, k: sortKey(p, i) }))
    .sort((a, b) => a.k[0] - b.k[0] || a.k[1] - b.k[1] || a.k[2] - b.k[2])
    .map((x) => x.p);
  const langsOf = (page: P): Lang[] => (page.hi ? ["en", "hi"] : ["en"]);

  // Already published: fixed on their day.
  const byPath = new Map<string, { page: P; lang: Lang }>();
  for (const page of o.pages) for (const lang of langsOf(page)) byPath.set(pathIn(page, lang), { page, lang });
  const out: Release<P>[] = [];
  const pinned = new Set<string>();
  for (const [path, day] of o.pinned) {
    const hit = byPath.get(path);
    if (!hit || day > o.keepThroughDay) continue;
    out.push({ ...hit, path, day });
    pinned.add(path);
  }

  const units = ordered
    .map((page) => langsOf(page).map((lang) => ({ page, lang })).filter((u) => !pinned.has(pathIn(u.page, u.lang))))
    .filter((u) => u.length > 0);

  // Everything else from the first day after the pinned ones.
  let day = pinned.size ? o.keepThroughDay + 1 : 1;
  let room = o.perDay;
  const place = (unit: { page: P; lang: Lang }[]) => {
    for (const u of unit) out.push({ page: u.page, lang: u.lang, path: pathIn(u.page, u.lang), day });
    room -= unit.length;
    if (room === 0) {
      day += 1;
      room = o.perDay;
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
    // tomorrow, so every day carries exactly perDay pages.
    const fits = room;
    units[0] = next.slice(fits);
    place(next.slice(0, fits));
  }
  for (const pull of o.pulledForward) {
    for (const r of out) if (r.day > pull.day) r.day = Math.max(pull.day, r.day - pull.days);
  }
  return out.sort((a, b) => a.day - b.day);
}

/** Today's day number in India time for a calendar starting on `start`: 1 on `start`, 0 or less before it. */
export function dayFrom(start: string, now: Date): number {
  const s = Date.parse(`${start}T00:00:00Z`);
  return Math.floor((now.getTime() + IST_OFFSET_MS - s) / DAY_MS) + 1;
}

/** The calendar date (YYYY-MM-DD, India) a day number falls on. */
export function dateFrom(start: string, day: number): string {
  const s = Date.parse(`${start}T00:00:00Z`);
  return new Date(s + (day - 1) * DAY_MS).toISOString().slice(0, 10);
}
