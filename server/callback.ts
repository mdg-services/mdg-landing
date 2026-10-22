import { callbackGuardSchema, callbackSchema, type CallbackData } from "./validation.js";
import { sendTemplate } from "./mailer.js";
import { IntakeRefused, postIntake } from "./intake.js";
import type { CallbackHandOff } from "./emails/templates.js";
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
 * Validate a "Leave my number" callback request, hand it to the admin panel's
 * Call-backs page and notify the MDG inbox.
 * Transport-agnostic — called by both `api/callback.ts` and the dev server.
 *
 * The hand-off can never fail the request: the email to the team inbox is
 * what is relied on, as it always was, and when the hand-off fails that email
 * says so at the top, because it is then the only record.
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
  // First, so the team's email can say whether it worked.
  const handOff = await handToAdminList(parsed.data);
  try {
    await sendTemplate(callbackNotificationEmail(parsed.data, { submittedAt, handOff }), env.notifyTo);
  } catch (err) {
    for (const takeBack of undo) takeBack();
    throw err;
  }

  return { ok: true, status: 200 };
}

/**
 * Hand a call-back request to the MDG API, so the admin's Call-backs page lists
 * it and the team's phones get an alert. Never rejects: a failure is logged and
 * the request goes on, because the team's inbox gets it either way. Says whether
 * it got there, for the team's email. A repeat from the same number is folded
 * into the row the API already has, so a retry here makes no second row.
 */
async function handToAdminList(data: CallbackData): Promise<CallbackHandOff> {
  try {
    // Named field by field, so a field added to the form later is not sent by accident.
    await postIntake(
      "/website/callbacks",
      {
        name: data.name,
        mobile: data.phone,
        outlet: data.outlet,
        message: data.message,
        source: data.source,
        film: data.film,
        ref: data.ref,
        lang: data.lang,
      },
      { timeoutMs: 4_000, standIn: { id: "dev", duplicate: false } }
    );
    return "ok";
  } catch (err) {
    console.error("[callback] could not hand the request to the admin list:", err);
    // What the team's email says depends on why: a slow answer may still
    // have saved it, a full hour certainly did not, and only a refusal at the
    // door is about the secret.
    if (err instanceof Error && err.name === "TimeoutError") return "slow";
    if (err instanceof IntakeRefused) return err.status === 429 ? "full" : "refused";
    if (err instanceof Error && /secret/i.test(err.message)) return "refused";
    return "unreachable";
  }
}
