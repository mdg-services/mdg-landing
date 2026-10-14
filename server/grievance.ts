import { grievanceGuardSchema, grievanceSchema } from "./validation.js";
import { sendTemplate } from "./mailer.js";
import { grievanceAckEmail, grievanceNotificationEmail } from "./emails/templates.js";
import { MAIL_BRAND } from "./emails/layout.js";
import { IntakeRefused, postIntake } from "./intake.js";
import { env } from "./env.js";
import { RecentLog, addressKey } from "./recent.js";
import type { ProcessResult } from "./result.js";

/** Faster than this from the page opening to Send, and no person filled it in. */
const MIN_FILL_MS = 1_500;
const WINDOW_MS = 10 * 60_000;
/** Grievances one address may send per window. */
const PER_ADDRESS = 5;
/**
 * Grievances one email address may be named in per window. The acknowledgement
 * goes to whatever address was typed, so this is what keeps the form from being
 * used to mail one stranger over and over.
 */
const PER_EMAIL = 3;
/** The API's answer holds the number the person is given, so it is waited for longer than an enrolment's. */
const FORWARD_TIMEOUT_MS = 6_000;

const sentByAddress = new RecentLog(WINDOW_MS);
const sentByEmail = new RecentLog(WINDOW_MS);

/**
 * `ref` is the grievance number, always: a grievance that was not saved is an
 * error, never a "received". `emailed` is whether the acknowledgement reached
 * the mail server, so the page can tell the person to note the number down
 * when it did not (and when it was a repeat of one already saved, which sends
 * nothing).
 */
export type GrievanceResult =
  | { ok: true; status: 200; ref: string; emailed: boolean }
  | Extract<ProcessResult, { ok: false }>;

const CHECK_AND_RETRY = "Please check your details and try again.";
const TOO_MANY = "Too many requests just now. Please call us instead.";

/**
 * The answer a script gets when it is caught. A visible error, not a quiet
 * "received": a person caught by mistake (a form their browser filled in at
 * once) sees the form's "could not send, call us" instead of being told their
 * grievance arrived when nothing was saved. Nothing is saved or sent. The
 * reason goes to the function's log only, without the visitor's details.
 */
function refuseScript(reason: string): GrievanceResult {
  console.warn(`[grievance] not sent: ${reason}`);
  return { ok: false, status: 400, error: CHECK_AND_RETRY };
}

/**
 * Validate a grievance, hand it to the API for the admin panel, and send the
 * two emails: an acknowledgement to the person, and the details to the MDG
 * inbox. When the API says it already had this very form (a retry), nothing
 * is emailed again. Transport-agnostic — called by both `api/grievance.ts`
 * and the dev server.
 *
 * The API is told first because it hands back the grievance number, and the
 * acknowledgement carries it. If the API cannot be reached this throws before
 * anything is emailed: a grievance that is not on the admin panel must not be
 * told to the person as received. If the API says too many came in just now,
 * the person gets a visible 429, not a fault.
 *
 * `ip` is the visitor's address as the host saw it; the dev server passes none,
 * so no per-address limit applies there.
 */
export async function processGrievance(
  input: unknown,
  meta: { submittedAt?: string; ip?: string } = {}
): Promise<GrievanceResult> {
  const guard = grievanceGuardSchema.safeParse(input);
  // No timing at all is either a hand-written script or a page opened before
  // these fields existed.
  if (!guard.success) {
    return { ok: false, status: 400, error: CHECK_AND_RETRY };
  }
  const { website, elapsed } = guard.data;
  if (website != null && website !== "") return refuseScript("hidden box filled in");
  if (elapsed < MIN_FILL_MS) return refuseScript(`sent ${Math.round(elapsed)} ms after the page opened`);

  const parsed = grievanceSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: CHECK_AND_RETRY,
      issues: parsed.error.flatten().fieldErrors,
    };
  }
  const data = parsed.data;

  const now = Date.now();
  const address = meta.ip ? addressKey(meta.ip) : undefined;
  const email = data.email.toLowerCase();
  // Real errors, not quiet ones: many people can share one address on a mobile
  // network, and whoever is turned away should see the form's "call us" rather
  // than wait for an answer that is not coming.
  if (address && sentByAddress.count(address, now) >= PER_ADDRESS) {
    console.warn(`[grievance] not sent: over ${PER_ADDRESS} from one address in 10 minutes`);
    return { ok: false, status: 429, error: TOO_MANY };
  }
  if (sentByEmail.count(email, now) >= PER_EMAIL) {
    console.warn(`[grievance] not sent: over ${PER_EMAIL} for one email address in 10 minutes`);
    return { ok: false, status: 429, error: TOO_MANY };
  }

  // Counted before anything goes out, so a burst of requests sent together
  // cannot all pass the checks while the first is still on its way; taken back
  // if the API cannot be reached, so the visitor's retry is not turned away.
  const undo = [sentByEmail.add(email, now), ...(address ? [sentByAddress.add(address, now)] : [])];
  const submittedAt = meta.submittedAt ?? new Date().toISOString();

  let ref: string;
  let duplicate: boolean;
  try {
    const saved = await postIntake("/website/grievances", data, {
      timeoutMs: FORWARD_TIMEOUT_MS,
      standIn: { id: "dev", ref: "G-DEV", duplicate: false },
    });
    // The number is what the person is promised, so an answer without one is
    // a failure, not a grievance with a blank.
    if (typeof saved.ref !== "string" || !saved.ref) throw new Error("MDG API gave no grievance number.");
    ref = saved.ref;
    duplicate = saved.duplicate === true;
  } catch (err) {
    for (const takeBack of undo) takeBack();
    // The API keeps its own count across every copy of this server, where
    // the limits above see only one. Its "too many" is the person's too.
    if (err instanceof IntakeRefused && err.status === 429) {
      console.warn("[grievance] not sent: the API's own limit on grievances was reached");
      return { ok: false, status: 429, error: TOO_MANY };
    }
    throw err;
  }

  // A retry of the same form comes back from the API as a duplicate, with the
  // same number. The first try already sent both emails, or tried to, and a
  // second pair would only mail the same person twice, so none go out. The
  // page tells the person to note the number down.
  if (duplicate) return { ok: true, status: 200, ref, emailed: false };

  const [ack, team] = await Promise.allSettled([
    // Replies to the acknowledgement reach a person at the public address,
    // not the unwatched sender and not the team's own inbox, which is not
    // published.
    sendTemplate(grievanceAckEmail(data, { ref, submittedAt }), data.email, {
      replyTo: MAIL_BRAND.email,
    }),
    sendTemplate(grievanceNotificationEmail(data, { ref, submittedAt }), env.notifyTo, {
      replyTo: data.email,
    }),
  ]);
  // The grievance is saved either way, so a failed email is logged, not
  // thrown: the person still gets their number on screen.
  if (ack.status === "rejected") console.error(`[grievance] ${ref} acknowledgement email failed:`, ack.reason);
  if (team.status === "rejected") console.error(`[grievance] ${ref} team email failed:`, team.reason);

  return { ok: true, status: 200, ref, emailed: ack.status === "fulfilled" };
}
