import { enrollmentSchema, type EnrollmentData } from "./validation.js";
import { sendTemplate } from "./mailer.js";
import { enrollmentNotificationEmail, welcomeEmail } from "./emails/templates.js";
import { postIntake } from "./intake.js";
import { env } from "./env.js";
import { RecentLog, addressKey } from "./recent.js";
import type { ProcessResult } from "./result.js";

export type EnrollResult = ProcessResult;

const WINDOW_MS = 10 * 60_000;
/** Enrolments one address may send per window. */
const PER_ADDRESS = 5;
/** Enrolments one mobile number may be named in per window. */
const PER_MOBILE = 3;

const sentByAddress = new RecentLog(WINDOW_MS);
const sentByMobile = new RecentLog(WINDOW_MS);

/**
 * Validate an enrolment payload, hand it to the admin list and fan out the
 * emails.
 *
 * Transport-agnostic: the Vercel function and the local dev server both call
 * this, so the business logic lives in exactly one place. The website's
 * /register page and the Dealer Kavach app's sign-up screen both come through
 * here.
 *
 * - The enrolment is handed to the MDG API first, so the admin panel lists it.
 *   That can never fail the enrolment: the email to the team inbox is what is
 *   relied on, the admin list is a view. When it fails, the team's email says
 *   so at the top, because that email is then the only record.
 * - The internal notification always goes to `ENROLLMENT_NOTIFY_TO`.
 * - The welcome email is sent only when the dealer supplied an address.
 * - The two emails are sent concurrently; if either fails the whole call
 *   rejects so the caller can surface a retry.
 *
 * `ip` is the visitor's address as the host saw it; the dev server passes none,
 * so no per-address limit applies there.
 */
export async function processEnrollment(
  input: unknown,
  meta: { submittedAt?: string; ip?: string } = {}
): Promise<EnrollResult> {
  const parsed = enrollmentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: "Some details look off. Please check the form and try again.",
      issues: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;
  const now = Date.now();
  // "+91 98765 43210" and "9876543210" are the same number.
  const mobile = data.mobile.replace(/\D/g, "").slice(-10);
  const address = meta.ip ? addressKey(meta.ip) : undefined;
  // A real error, not a quiet one: many people can share one address on a
  // mobile network, and whoever is turned away should see the form's "call
  // us" rather than wait for a call that is not coming.
  if (address && sentByAddress.count(address, now) >= PER_ADDRESS) {
    console.warn(`[enroll] not sent: over ${PER_ADDRESS} from one address in 10 minutes`);
    return { ok: false, status: 429, error: "Too many requests just now. Please call us instead." };
  }
  if (sentByMobile.count(mobile, now) >= PER_MOBILE) {
    console.warn(`[enroll] not sent: over ${PER_MOBILE} for one mobile number in 10 minutes`);
    return { ok: false, status: 429, error: "Too many requests just now. Please call us instead." };
  }

  // Counted before anything goes out, so a burst of requests sent together
  // cannot all pass the checks while the first is still on its way; taken back
  // if an email fails, so the visitor's retry is not turned away.
  const undo = [sentByMobile.add(mobile, now), ...(address ? [sentByAddress.add(address, now)] : [])];
  const submittedAt = meta.submittedAt ?? new Date().toISOString();

  // First, so the team's email can say whether it worked.
  const onAdminList = await handToAdminList(data);

  const jobs: Array<Promise<void>> = [
    sendTemplate(enrollmentNotificationEmail(data, { submittedAt, onAdminList }), env.notifyTo, {
      replyTo: data.email,
    }),
  ];

  if (data.email) {
    jobs.push(sendTemplate(welcomeEmail(data), data.email));
  }

  // Settled, not just awaited, so the function does not return (and the host
  // stop it) while the other email is still in flight, even when one has
  // already failed.
  const settled = await Promise.allSettled(jobs);
  const failedEmail = settled.find((r) => r.status === "rejected");
  if (failedEmail) {
    for (const takeBack of undo) takeBack();
    throw failedEmail.reason;
  }
  return { ok: true, status: 200 };
}

/**
 * Hand an enrolment to the MDG API. Never rejects: a failure is logged and the
 * enrolment goes on, because the team's inbox already has it. Says whether it
 * got there, for the team's email.
 */
async function handToAdminList(data: EnrollmentData): Promise<boolean> {
  try {
    // Named field by field: the admin list takes the details, not the
    // agreement tick, and a field added to the form later is not sent by
    // accident.
    await postIntake(
      "/website/enrolments",
      {
        submissionId: data.submissionId,
        name: data.name,
        mobile: data.mobile,
        email: data.email,
        siteType: data.siteType,
        pumpName: data.pumpName,
        sapCode: data.sapCode,
        source: data.source,
      },
      { timeoutMs: 4_000, standIn: { id: "dev", duplicate: false } }
    );
    return true;
  } catch (err) {
    console.error("[enroll] could not hand the enrolment to the admin list:", err);
    return false;
  }
}
