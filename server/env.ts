/**
 * Typed, centralised access to the mail-related environment.
 * Nothing else in the backend reads `process.env` directly.
 */
export const env = {
  /** Gmail account used to authenticate the SMTP transport. */
  gmailUser: process.env.GMAIL_USER ?? "",
  /** Google "App Password" (not the account password) for that account. */
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD ?? "",
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
  return Boolean(env.gmailUser && env.gmailAppPassword);
}
