/**
 * The release gate for the guides (/guides/, /hi/guides/, /tools/, /hi/tools/).
 *
 * Every guide page is built once. guide/schedule.ts says on which day (India
 * time) each one goes live, five a day, so a page whose day has not come must
 * not answer: it is a plain 404. Guide addresses keep their trailing slash, so
 * the same address without one is sent to the one with it.
 *
 * Pure function of a path and a date; proxy.ts does the responding.
 */
import { dayOf, releaseDayOf } from "../../guide/schedule.ts";

const GUIDE = /^\/(?:hi\/)?(?:guides|tools)(?:\/|$)/;

export type GuideGate = { kind: "next" } | { kind: "redirect"; to: string } | { kind: "notFound" };

/** Is this path under the guides at all? */
export function isGuidePath(pathname: string): boolean {
  return GUIDE.test(pathname);
}

export function guideGate(pathname: string, search: string, now: Date): GuideGate {
  if (!GUIDE.test(pathname)) return { kind: "next" };
  if (!pathname.endsWith("/")) {
    // /guides/density -> /guides/density/, but only for a real page
    return releaseDayOf(`${pathname}/`) !== undefined
      ? { kind: "redirect", to: `${pathname}/${search}` }
      : { kind: "notFound" };
  }
  const live = releaseDayOf(pathname);
  if (live === undefined || dayOf(now) < live) return { kind: "notFound" };
  return { kind: "next" };
}
