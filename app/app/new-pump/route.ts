import { funnelAnswer, funnelRedirect } from "../../../src/routing/funnel.ts";
import { recordTapAfter } from "../../../server/funnelAfter.ts";

export const dynamic = "force-dynamic";

/**
 * GET /app/new-pump?from=<source>&lang=<en|hi|or> — the one link behind every
 * "Ask in Kavach Shuruaat" button on the website (ADR 0059 §2).
 *
 * A phone goes to its app store (Android with an install tag naming the page),
 * a computer to /new-pump; the tap is counted after the redirect has gone out.
 * With the Dealer Kavach app installed, the phone opens the app on this address
 * instead (Android App Links and iPhone universal links, served from
 * public/.well-known), and this handler is never reached.
 *
 * robots.txt keeps search engines off /app/, and every link to it carries
 * rel="nofollow".
 */
export function GET(req: Request): Response {
  const { location, tap } = funnelAnswer(req, { fallbackMedium: "funnel_link" });
  if (tap) recordTapAfter(tap);
  return funnelRedirect(location);
}

/** A HEAD is a program checking the link: the same redirect, never counted (funnelAnswer reads the method). */
export const HEAD = GET;
