import { callbackSchema } from "./validation.js";
import { sendTemplate } from "./mailer.js";
import { callbackNotificationEmail } from "./emails/templates.js";
import { env } from "./env.js";
import type { ProcessResult } from "./result.js";

/**
 * Validate a "Leave my number" callback request and notify the MDG inbox.
 * Transport-agnostic — called by both `api/callback.ts` and the dev server.
 */
export async function processCallback(
  input: unknown,
  meta: { submittedAt?: string } = {}
): Promise<ProcessResult> {
  const parsed = callbackSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: "Please check your details and try again.",
      issues: parsed.error.flatten().fieldErrors,
    };
  }

  const submittedAt = meta.submittedAt ?? new Date().toISOString();
  await sendTemplate(callbackNotificationEmail(parsed.data, { submittedAt }), env.notifyTo);

  return { ok: true, status: 200 };
}
