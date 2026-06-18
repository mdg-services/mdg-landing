/**
 * Typed, centralised access to the mail-related environment.
 * Provider-agnostic SMTP — defaults target Hostinger
 * (noreply@mdgservices.in). Nothing else reads `process.env` directly.
 */
export const env = {
  /** SMTP host. Hostinger = smtp.hostinger.com. */
  smtpHost: process.env.SMTP_HOST ?? "smtp.hostinger.com",
  /** 465 = implicit SSL (secure). 587 = STARTTLS (set SMTP_SECURE=false). */
  smtpPort: Number(process.env.SMTP_PORT ?? 465),
  smtpSecure: (process.env.SMTP_SECURE ?? "true").toLowerCase() !== "false",
  /** Mailbox login — the full email address, e.g. noreply@mdgservices.in. */
  smtpUser: process.env.SMTP_USER ?? "",
  /** Mailbox password (set in Hostinger hPanel). */
  smtpPass: process.env.SMTP_PASS ?? "",
  /** Address on the "From" header (defaults to the SMTP user). */
  fromAddress: process.env.MAIL_FROM ?? process.env.SMTP_USER ?? "",
  /** Display name on the "From" header. */
  fromName: process.env.MAIL_FROM_NAME ?? "MDG Services",
  /** Where internal enrolment notifications are sent. */
  notifyTo: process.env.ENROLLMENT_NOTIFY_TO ?? "mdgservicesterms@gmail.com",
  /** True on a real deployment — used to decide whether missing creds are fatal. */
  isProd:
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production" ||
    process.env.VERCEL_ENV === "preview",
};

export function hasMailCredentials(): boolean {
  return Boolean(env.smtpUser && env.smtpPass);
}
