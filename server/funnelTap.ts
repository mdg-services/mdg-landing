import { IntakeRefused, postIntake } from "./intake.js";
import type { FunnelTap } from "../src/routing/funnel.js";

/**
 * How long the website waits for the API to take one tap. The person has
 * already been redirected by then (the call runs after the answer is sent), so
 * this only bounds how long the server keeps working on it.
 */
export const TAP_TIMEOUT_MS = 1500;

/**
 * Hand one funnel tap to the MDG API (`POST /v1/website/funnel-taps`, ADR 0059
 * §3), server to server, with the same shared secret the website's forms use.
 *
 * Never throws: a tap is a count, not a submission, and a lost one must never
 * turn into an error anyone sees. A failure is logged in one line that names
 * the problem and nothing about the person (the tap holds only the source, the
 * kind of phone and the language).
 */
export async function recordTap(tap: FunnelTap): Promise<void> {
  try {
    await postIntake("/website/funnel-taps", tap, { timeoutMs: TAP_TIMEOUT_MS, standIn: null });
  } catch (e) {
    // The API answers 202 for a tap; one that answers with no body is still a tap taken.
    if (e instanceof IntakeRefused && e.status >= 200 && e.status < 300) return;
    console.warn(`[funnel] tap not recorded: ${(e as Error).message}`);
  }
}
