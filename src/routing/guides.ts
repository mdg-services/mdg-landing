/**
 * The release gate for the guide pages of both collections:
 *
 *  - the MDG guides: /guides/…, /tools/… and their /hi twins (guide/schedule.ts);
 *  - the Khata Kavach pages: /khata-kavach/<anything>/… and the /hi twins
 *    (kk-guide/schedule.ts). The product page itself (/khata-kavach) and its
 *    privacy page (/khata-kavach/privacy) are not guide pages.
 *
 * Every guide page is built once. Each schedule says on which day (India time)
 * each page goes live, five a day on its own calendar, so a page whose day has
 * not come must not answer: it is a plain 404. Guide addresses keep their
 * trailing slash, so the same address without one is sent to the one with it.
 *
 * Pure function of a path and a date; proxy.ts does the responding.
 */
import { dayOf, releaseDayOf } from "../../guide/schedule.ts";
import { kkDayOf, kkReleaseDayOf } from "../../kk-guide/schedule.ts";

const GATES = [
  { test: /^\/(?:hi\/)?(?:guides|tools)(?:\/|$)/, releaseDayOf, dayOf },
  { test: /^\/(?:hi\/)?khata-kavach\/(?!privacy\/?$)[^/]/, releaseDayOf: kkReleaseDayOf, dayOf: kkDayOf },
];

export type GuideGate = { kind: "next" } | { kind: "redirect"; to: string } | { kind: "notFound" };

/** Is this path under the guide pages of either collection at all? */
export function isGuidePath(pathname: string): boolean {
  return GATES.some((g) => g.test.test(pathname));
}

export function guideGate(pathname: string, search: string, now: Date): GuideGate {
  const gate = GATES.find((g) => g.test.test(pathname));
  if (!gate) return { kind: "next" };
  if (!pathname.endsWith("/")) {
    // /guides/density -> /guides/density/, but only for a real page
    return gate.releaseDayOf(`${pathname}/`) !== undefined
      ? { kind: "redirect", to: `${pathname}/${search}` }
      : { kind: "notFound" };
  }
  const live = gate.releaseDayOf(pathname);
  if (live === undefined || gate.dayOf(now) < live) return { kind: "notFound" };
  return { kind: "next" };
}
