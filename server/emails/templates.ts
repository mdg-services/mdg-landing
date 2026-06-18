import {
  type EmailContent,
  MAIL_BRAND,
  wrapEmail,
  heading,
  paragraph,
  dataTable,
  button,
  escapeHtml,
} from "./layout";
import type { EnrollmentData } from "../validation";

const B = MAIL_BRAND;

/* ─────────────────────────────────────────────────────────────
   To add a new email: write a function `(data) => EmailContent`
   here, then send it with `sendTemplate(myEmail(data), to)`.
   ───────────────────────────────────────────────────────────── */

/** Internal notification to the MDG inbox when a dealer enrols. */
export function enrollmentNotificationEmail(
  data: EnrollmentData,
  meta: { submittedAt: string }
): EmailContent {
  const when = new Date(meta.submittedAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  const rows: Array<[string, string]> = [
    ["Name", escapeHtml(data.name)],
    [
      "Mobile",
      `<a href="tel:${escapeHtml(data.mobile.replace(/\s/g, ""))}" style="color:${B.navy};text-decoration:none">${escapeHtml(data.mobile)}</a>`,
    ],
    [
      "Email",
      data.email
        ? `<a href="mailto:${escapeHtml(data.email)}" style="color:${B.navy};text-decoration:none">${escapeHtml(data.email)}</a>`
        : "—",
    ],
    ["Site type", escapeHtml(data.siteType)],
    ["Pump name", data.pumpName ? escapeHtml(data.pumpName) : "—"],
    ["SAP code", escapeHtml(data.sapCode)],
    ["Agreed to T&C", "Yes"],
    ["Submitted", escapeHtml(when) + " IST"],
  ];

  const body = `
    ${heading("New dealer enrolment")}
    ${paragraph(`A dealer just submitted the enrolment form on the website. Details below — reply to this email to reach ${escapeHtml(data.name)} directly.`)}
    ${dataTable(rows)}
  `;

  return {
    subject: `New dealer enrolment — ${data.name}${data.pumpName ? ` (${data.pumpName})` : ""}`,
    html: wrapEmail({ preheader: `${data.name} · ${data.siteType} · SAP ${data.sapCode}`, bodyHtml: body }),
    text: [
      "New dealer enrolment",
      "",
      `Name:       ${data.name}`,
      `Mobile:     ${data.mobile}`,
      `Email:      ${data.email ?? "—"}`,
      `Site type:  ${data.siteType}`,
      `Pump name:  ${data.pumpName ?? "—"}`,
      `SAP code:   ${data.sapCode}`,
      `Agreed:     Yes`,
      `Submitted:  ${when} IST`,
    ].join("\n"),
  };
}

/** Friendly welcome to the dealer who just enrolled. */
export function welcomeEmail(data: EnrollmentData): EmailContent {
  const firstName = data.name.split(/\s+/)[0] || data.name;

  const body = `
    ${heading(`Welcome aboard, ${escapeHtml(firstName)}`)}
    ${paragraph(`Thank you for enrolling with <strong style="color:${B.ink}">${B.name}</strong> — the Dealer's कवच program. Your details are with our team.`)}
    ${paragraph(`<strong style="color:${B.ink}">What happens next:</strong> a team member will call you to confirm the exact services that fit your pump and lock your pricing in writing — usually within one working day, 9am–9pm.`)}
    <div style="margin:22px 0 6px">${button(`Call us — ${B.phone}`, B.phoneHref)}</div>
    ${paragraph(`Prefer we reach out first? No problem — just keep your phone handy. We answer in plain Hindi or English.`)}
    <p style="margin:18px 0 0;font:400 15px/1.65 Arial,sans-serif;color:${B.soft}">Warm regards,<br/><strong style="color:${B.ink}">Team ${B.name}</strong></p>
  `;

  return {
    subject: `Welcome to MDG Services, ${firstName} — your enrolment is in`,
    html: wrapEmail({
      preheader: "Your enrolment is in. We'll call to confirm your services and pricing.",
      bodyHtml: body,
    }),
    text: [
      `Welcome aboard, ${firstName}`,
      "",
      `Thank you for enrolling with ${B.name} — the Dealer's Kavach program. Your details are with our team.`,
      "",
      "What happens next: a team member will call you to confirm the exact services that fit your pump and lock your pricing in writing — usually within one working day, 9am-9pm.",
      "",
      `Call us anytime: ${B.phone}`,
      "",
      `Warm regards,`,
      `Team ${B.name}`,
    ].join("\n"),
  };
}
