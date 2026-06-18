import nodemailer, { type Transporter } from "nodemailer";
import { env, hasMailCredentials } from "./env";
import type { EmailContent } from "./emails/layout";

export type MailMessage = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

/**
 * Lazily-created singleton transport. Reused across warm serverless
 * invocations so we don't reconnect on every request.
 */
let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure,
      auth: { user: env.smtpUser, pass: env.smtpPass },
    });
  }
  return transporter;
}

/** Low-level send. Most callers should use {@link sendTemplate}. */
export async function sendMail(message: MailMessage): Promise<void> {
  const from = `"${env.fromName}" <${env.fromAddress || env.smtpUser}>`;

  if (!hasMailCredentials()) {
    if (env.isProd) {
      throw new Error("Mail credentials missing — set SMTP_USER and SMTP_PASS.");
    }
    // Local dev without secrets: log instead of sending so the flow is testable.
    const to = Array.isArray(message.to) ? message.to.join(", ") : message.to;
    console.info(
      `\n[mailer:dev] (no creds — not actually sent)\n  to:      ${to}\n  subject: ${message.subject}\n`
    );
    return;
  }

  await getTransporter().sendMail({
    from,
    to: message.to,
    subject: message.subject,
    html: message.html,
    text: message.text,
    replyTo: message.replyTo,
  });
}

/**
 * Send a rendered template to one or more recipients.
 *
 * This is the function to reach for when adding a new kind of email: write a
 * template that returns {@link EmailContent}, then `sendTemplate(myTemplate(data), to)`.
 */
export async function sendTemplate(
  content: EmailContent,
  to: string | string[],
  opts: { replyTo?: string } = {}
): Promise<void> {
  await sendMail({
    to,
    subject: content.subject,
    html: content.html,
    text: content.text,
    replyTo: opts.replyTo,
  });
}
