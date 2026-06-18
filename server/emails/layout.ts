/**
 * Email layout + building blocks. Every template renders through {@link wrapEmail}
 * so all mail shares one branded shell. Styles are inline (email-client safe).
 */

export type EmailContent = { subject: string; html: string; text: string };

export const MAIL_BRAND = {
  name: "MDG Services",
  program: "Dealer's कवच",
  tagline: "Fueling Success",
  phone: "1800-345-6512",
  phoneHref: "tel:18003456512",
  site: "mdgservices.in",
  navy: "#2C2E80",
  navyDeep: "#1A1B4B",
  gold: "#F5A524",
  ink: "#15163A",
  soft: "#3D3F66",
  muted: "#6B6D93",
  line: "#E4E6F1",
  paper: "#F5F6FB",
};

const B = MAIL_BRAND;

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** A simple two-column "label / value" table for transactional details. */
export function dataTable(rows: Array<[string, string]>): string {
  const body = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid ${B.line};font:600 12px/1.4 Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:${B.muted};white-space:nowrap;vertical-align:top;width:38%">${escapeHtml(
        label
      )}</td>
        <td style="padding:10px 0 10px 16px;border-bottom:1px solid ${B.line};font:400 15px/1.5 Arial,sans-serif;color:${B.ink}">${value}</td>
      </tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:8px 0 4px">${body}</table>`;
}

/** A filled call-to-action button. */
export function button(label: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;background:${B.navy};color:#ffffff;text-decoration:none;font:600 15px/1 Arial,sans-serif;padding:14px 26px;border-radius:999px">${escapeHtml(
    label
  )}</a>`;
}

/**
 * Wrap body HTML in the branded shell.
 * `preheader` is the hidden inbox-preview line.
 */
export function wrapEmail(opts: { preheader?: string; bodyHtml: string }): string {
  const { preheader = "", bodyHtml } = opts;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="light" />
</head>
<body style="margin:0;padding:0;background:${B.paper};">
  <span style="display:none!important;opacity:0;color:transparent;height:0;width:0;overflow:hidden">${escapeHtml(
    preheader
  )}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${B.paper};padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid ${B.line};border-radius:16px;overflow:hidden">
        <!-- header -->
        <tr><td style="background:${B.navyDeep};padding:22px 28px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="font:700 18px/1 Arial,sans-serif;color:#ffffff;letter-spacing:-.01em">${B.name}</td>
            <td align="right" style="font:600 11px/1 Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:${B.gold}">Dealer's कवच</td>
          </tr></table>
        </td></tr>
        <!-- gold rule -->
        <tr><td style="height:3px;background:${B.gold};font-size:0;line-height:0">&nbsp;</td></tr>
        <!-- body -->
        <tr><td style="padding:32px 28px 28px">${bodyHtml}</td></tr>
        <!-- footer -->
        <tr><td style="padding:20px 28px 26px;border-top:1px solid ${B.line};background:#ffffff">
          <p style="margin:0 0 4px;font:400 13px/1.5 Arial,sans-serif;color:${B.muted}">
            ${B.name} — ${B.tagline}. Your trusted partner for petrol pump businesses in India.
          </p>
          <p style="margin:0;font:400 13px/1.5 Arial,sans-serif;color:${B.muted}">
            <a href="${B.phoneHref}" style="color:${B.navy};text-decoration:none;font-weight:600">${B.phone}</a>
            &nbsp;·&nbsp;
            <a href="https://www.${B.site}" style="color:${B.navy};text-decoration:none">${B.site}</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Shared heading/paragraph helpers so templates stay declarative. */
export function heading(text: string): string {
  return `<h1 style="margin:0 0 12px;font:700 24px/1.2 Arial,sans-serif;color:${B.ink};letter-spacing:-.02em">${escapeHtml(
    text
  )}</h1>`;
}

export function paragraph(html: string): string {
  return `<p style="margin:0 0 14px;font:400 15px/1.65 Arial,sans-serif;color:${B.soft}">${html}</p>`;
}
