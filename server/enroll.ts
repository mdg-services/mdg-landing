import { enrollmentSchema } from "./validation";
import { sendTemplate } from "./mailer";
import { enrollmentNotificationEmail, welcomeEmail } from "./emails/templates";
import { env } from "./env";

export type EnrollResult =
  | { ok: true }
  | { ok: false; status: number; error: string; issues?: Record<string, string[] | undefined> };

/**
 * Validate an enrolment payload and fan out the emails.
 *
 * Transport-agnostic: the Vercel function and the local dev server both call
 * this, so the business logic lives in exactly one place.
 *
 * - The internal notification always goes to `ENROLLMENT_NOTIFY_TO`.
 * - The welcome email is sent only when the dealer supplied an address.
 * - Both are sent concurrently; if either fails the whole call rejects so the
 *   caller can surface a retry.
 */
export async function processEnrollment(
  input: unknown,
  meta: { submittedAt?: string } = {}
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
  const submittedAt = meta.submittedAt ?? new Date().toISOString();

  const jobs: Array<Promise<void>> = [
    sendTemplate(enrollmentNotificationEmail(data, { submittedAt }), env.notifyTo, {
      replyTo: data.email,
    }),
  ];

  if (data.email) {
    jobs.push(sendTemplate(welcomeEmail(data), data.email));
  }

  await Promise.all(jobs);
  return { ok: true };
}
