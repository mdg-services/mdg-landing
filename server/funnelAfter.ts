import { after } from "next/server";
import { recordTap } from "./funnelTap.js";
import type { FunnelTap } from "../src/routing/funnel.js";

/**
 * Count a tap once the redirect has been sent, so the person never waits for
 * the API. `after()` keeps the function alive until the call finishes (on
 * Vercel it is waitUntil), with the tap's own 1.5 s limit (funnelTap.ts).
 *
 * Outside a real request (the route called from a check script) `after()`
 * throws; nothing is counted then, which is right: no person tapped anything.
 */
export function recordTapAfter(tap: FunnelTap): void {
  try {
    after(() => recordTap(tap));
  } catch {
    // no request in progress: nothing to count
  }
}
