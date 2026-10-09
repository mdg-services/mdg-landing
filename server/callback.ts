import { callbackGuardSchema, callbackSchema } from "./validation.js";
import { sendTemplate } from "./mailer.js";
import { callbackNotificationEmail } from "./emails/templates.js";
import { env } from "./env.js";
import { RecentLog, addressKey } from "./recent.js";
import type { ProcessResult } from "./result.js";

/** Faster than this from the page opening to Send, and no person filled it in. */
const MIN_FILL_MS = 2_000;
const WINDOW_MS = 10 * 60_000;
/** Call-backs one address may send per window. */
const PER_ADDRESS = 5;

const sentByAddress = new RecentLog(WINDOW_MS);
const sentByPhone = new RecentLog(WINDOW_MS);

/**
 * The answer a script gets when it is caught: the same as a sent request, so
 * it learns nothing. Nothing is sent. The reason goes to the function's log
 * only, without the visitor's details.
 */
function dropQuietly(reason: string): ProcessResult {
  console.warn(`[callback] not sent: ${reason}`);
  return { ok: true, status: 200 };
}

/**
 * Validate a "Leave my number" callback request and notify the MDG inbox.
 * Transport-agnostic — called by both `api/callback.ts` and the dev server.
 *
 * Every form that posts here sends `elapsed`; the two page forms also send the
 * hidden `website` box. `ip` is the visitor's address as the host saw it; the
 * dev server passes none and is not limited.
 */
export async function processCallback(
  input: unknown,
  meta: { submittedAt?: string; ip?: string } = {}
): Promise<ProcessResult> {
  const guard = callbackGuardSchema.safeParse(input);
  // No timing at all is either a hand-written script or a page opened before
  // these fields existed. A visible error, not a quiet one: that person sees
  // the form's "could not send, call us" and is not left waiting for a call.
  if (!guard.success) {
    return { ok: false, status: 400, error: "Please check your details and try again." };
  }
  const { website, elapsed } = guard.data;
  if (website != null && website !== "") return dropQuietly("hidden box filled in");
  if (elapsed < MIN_FILL_MS) return dropQuietly(`sent ${Math.round(elapsed)} ms after the page opened`);

  const parsed = callbackSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: "Please check your details and try again.",
      issues: parsed.error.flatten().fieldErrors,
    };
  }

  const now = Date.now();
  // "+91 98765 43210" and "9876543210" are the same number.
  const phone = parsed.data.phone.replace(/\D/g, "").slice(-10);
  // Already in the inbox: a second press of Send, or the same number from
  // another form. The team calls once either way.
  if (sentByPhone.count(phone, now) > 0) return dropQuietly("same number in the last 10 minutes");

  const address = meta.ip ? addressKey(meta.ip) : undefined;
  if (address && sentByAddress.count(address, now) >= PER_ADDRESS) {
    // A real error, not a quiet one: many people can share one address on a
    // mobile network, and whoever is turned away should see the form's
    // "call us" rather than wait for a call that is not coming.
    console.warn(`[callback] not sent: over ${PER_ADDRESS} from one address in 10 minutes`);
    return { ok: false, status: 429, error: "Too many requests just now. Please call us instead." };
  }

  // Counted before the email goes, so a burst of requests sent together cannot
  // all pass the checks while the first is still sending; taken back if the
  // email fails, so the visitor's retry is not turned away.
  const undo = [sentByPhone.add(phone, now), ...(address ? [sentByAddress.add(address, now)] : [])];
  const submittedAt = meta.submittedAt ?? new Date().toISOString();
  try {
    await sendTemplate(callbackNotificationEmail(parsed.data, { submittedAt }), env.notifyTo);
  } catch (err) {
    for (const takeBack of undo) takeBack();
    throw err;
  }

  return { ok: true, status: 200 };
}
