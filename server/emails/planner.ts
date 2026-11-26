import { type EmailContent, MAIL_BRAND, wrapEmail, heading, paragraph, dataTable, button, escapeHtml } from "./layout.js";
import type { PlannerData } from "../validation.js";
import type { EnrollHandOff } from "./templates.js";
import type { EnrollAccount } from "../result.js";

/**
 * The two emails of a Kavach Shuruaat sign-up (ADR 0058), beside the outlet's in
 * templates.ts: the team's record of it, and the person's own welcome.
 *
 * Nothing here is ever the password: `PlannerData` does not have one.
 */

const B = MAIL_BRAND;

/** The answers on the form, in the team's words. */
const OIL_COMPANY: Record<PlannerData["oilCompany"], string> = {
  iocl: "IndianOil",
  bpcl: "BPCL",
  hpcl: "HPCL",
  other: "Another company",
  undecided: "Not decided yet",
};
const STAGE: Record<PlannerData["stage"], string> = {
  exploring: "Just exploring",
  applied: "Applied",
  selected: "Selected",
  building: "Building the pump",
};

/** When it was not saved, the person was shown an error: the team must call them. */
const NOT_SAVED: Record<Exclude<EnrollHandOff, "ok">, string> = {
  failed:
    "This person is NOT signed up. The website could not hand the Kavach Shuruaat sign-up to our system, and they were shown an error. Call them, and check the website's WEBSITE_INTAKE_SECRET and the API.",
  busy: "This person is NOT signed up. Our system refused it because this number has tried too many times this hour, and they were shown a \"call us\" message. Call them.",
};

/** The same mobile with its own account already: not a new sign-up. */
const ACCOUNT_FOR_TEAM: Record<EnrollAccount, string> = {
  ready: "Opened automatically, and the first bill sent. Nothing to do: Kavach Shuruaat answers them in the app.",
  existing: "This mobile number already signs in to an account. Nothing new was opened.",
  waiting: "Saved, but the system did not say the account is open. Check it on the Dealers page (Planning).",
};

/**
 * The team's record of a Kavach Shuruaat sign-up. Its own subject, so a mail
 * filter on "New dealer enrolment" never mixes the two: a planner is not an
 * outlet to approve.
 */
export function plannerNotificationEmail(
  data: PlannerData,
  meta: { submittedAt: string; handOff?: EnrollHandOff; account?: EnrollAccount },
): EmailContent {
  const when = new Date(meta.submittedAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });
  const handOff = meta.handOff ?? "ok";
  const notSaved = handOff === "ok" ? null : NOT_SAVED[handOff];
  const account = notSaved ? null : ACCOUNT_FOR_TEAM[meta.account ?? "waiting"];

  const plain: Array<[string, string]> = [
    ["Name", data.name],
    ["Mobile", data.mobile],
    ["Email", data.email ?? "—"],
    ["State (GST code)", data.stateCode],
    ["District / town", data.district ?? "—"],
    ["Oil company in mind", OIL_COMPANY[data.oilCompany]],
    ["Where they are", STAGE[data.stage]],
    ["App language", data.lang],
    ["WhatsApp messages", data.consentWhatsApp ? "Agreed" : "Not asked"],
    ...(data.ref ? ([["Link code", data.ref]] as Array<[string, string]>) : []),
    ...(account ? ([["Account", account]] as Array<[string, string]>) : []),
    ["Submitted", `${when} IST`],
  ];

  const body = `
    ${heading("Kavach Shuruaat sign-up")}
    ${notSaved ? `<div style="margin:0 0 16px;padding:12px 16px;background:#FFF7E6;border:1px solid ${B.gold};border-radius:10px;font:600 15px/1.5 Arial,sans-serif;color:${B.ink}">${escapeHtml(notSaved)}</div>` : ""}
    ${paragraph(`Someone planning a petrol pump signed up for Kavach Shuruaat in the Dealer Kavach app. Details below.`)}
    ${dataTable(plain.map(([k, v]) => [k, escapeHtml(v)]))}
  `;

  return {
    subject: `Kavach Shuruaat sign-up${notSaved ? " [NOT SIGNED UP — call them]" : ""} — ${data.name}`,
    html: wrapEmail({ preheader: `${data.name} · state ${data.stateCode} · ${STAGE[data.stage]}`, bodyHtml: body }),
    text: [
      "Kavach Shuruaat sign-up",
      ...(notSaved ? ["", notSaved] : []),
      "",
      ...plain.map(([k, v]) => `${`${k}:`.padEnd(21)}${v}`),
    ].join("\n"),
  };
}

/** The person's welcome, in Hindi for a Hindi app and in English otherwise (Hinglish reads Latin letters). */
const WELCOME = {
  en: {
    subject: "Welcome to Kavach Shuruaat",
    preheader: {
      ready: "Your account is ready. Pay the link on WhatsApp, then ask your first question.",
      existing: "This mobile number already has a Dealer Kavach account.",
      waiting: "Your sign-up is in.",
    },
    heading: (name?: string) => (name ? `Welcome, ${name}` : "Welcome"),
    steps: {
      ready: [
        "Your account is ready. Sign in to the Dealer Kavach app with your mobile number and the password you chose.",
        "The payment link for Kavach Shuruaat comes on WhatsApp and SMS: {total} a month, by autopay. The plan starts when it is paid.",
        "Then ask anything about opening your pump, in the app's chat.",
      ],
      existing: [
        "This mobile number already has a Dealer Kavach account. Sign in to the app with it.",
        'Forgot the password? Tap "Forgot your password?" on the app\'s sign-in screen.',
      ],
      waiting: ["Your sign-up is in. Open the Dealer Kavach app and sign in with your mobile number and the password you chose."],
    },
    note: "Kavach Shuruaat gives general information from official documents. It is not legal advice or an approval, and it does not get anyone a dealership.",
    appButton: "Get the Dealer Kavach app",
    signOff: "Warm regards,",
    team: `Team ${B.name}`,
  },
  hi: {
    subject: "कवच शुरुआत में आपका स्वागत है",
    preheader: {
      ready: "आपका खाता तैयार है। WhatsApp पर आए लिंक से भुगतान कीजिए, फिर पहला सवाल पूछिए।",
      existing: "इस मोबाइल नंबर पर डीलर कवच खाता पहले से है।",
      waiting: "आपका साइन-अप मिल गया।",
    },
    heading: (name?: string) => (name ? `स्वागत है, ${name}` : "स्वागत है"),
    steps: {
      ready: [
        "आपका खाता तैयार है। अपने मोबाइल नंबर और चुने हुए पासवर्ड से डीलर कवच ऐप में साइन इन कीजिए।",
        "कवच शुरुआत का भुगतान लिंक WhatsApp और SMS पर आता है: {total} महीना, ऑटोपे से। भुगतान होते ही प्लान शुरू होता है।",
        "फिर ऐप की चैट में पंप खोलने के बारे में कुछ भी पूछिए।",
      ],
      existing: [
        "इस मोबाइल नंबर पर डीलर कवच खाता पहले से है। इसी नंबर से ऐप में साइन इन कीजिए।",
        "पासवर्ड भूल गए? ऐप की साइन-इन स्क्रीन पर “पासवर्ड भूल गए?” दबाइए।",
      ],
      waiting: ["आपका साइन-अप मिल गया। डीलर कवच ऐप खोलिए और अपने मोबाइल नंबर और चुने हुए पासवर्ड से साइन इन कीजिए।"],
    },
    note: "कवच शुरुआत आधिकारिक दस्तावेज़ों से सामान्य जानकारी देती है। यह क़ानूनी सलाह या मंज़ूरी नहीं है, और किसी को डीलरशिप नहीं दिलाती।",
    appButton: "डीलर कवच ऐप लीजिए",
    signOff: "सादर,",
    team: `टीम ${B.name}`,
  },
} as const;

/** A plain first name only, as the outlet welcome does: anyone can type any address into a form. */
function greetingName(name: string): string | undefined {
  const first = name.trim().split(/\s+/)[0] ?? "";
  return first.length > 0 && first.length <= 40 && /^[\p{L}\p{M}]+$/u.test(first) ? first : undefined;
}

/** The welcome to someone who signed up for Kavach Shuruaat, once it was saved. `total` is the monthly price with GST ("₹234.82"). */
export function plannerWelcomeEmail(data: PlannerData, account: EnrollAccount, total: string): EmailContent {
  const lang = data.lang === "hi" ? "hi" : "en";
  const c = WELCOME[lang];
  const steps = c.steps[account].map((s) => s.replace("{total}", total));
  const name = greetingName(data.name);
  const app = [
    { label: `${c.appButton} · App Store`, href: B.appStore },
    { label: `${c.appButton} · Google Play`, href: B.playStore },
  ];
  const body = `
    ${heading(c.heading(name))}
    <ol style="margin:0 0 16px;padding-left:22px;font:400 15px/1.65 Arial,sans-serif;color:${B.soft}">
      ${steps.map((step) => `<li style="margin:0 0 6px">${escapeHtml(step)}</li>`).join("")}
    </ol>
    ${app.map((a) => `<div style="margin:22px 0 6px">${button(a.label, a.href)}</div>`).join("")}
    ${paragraph(escapeHtml(c.note))}
    <p style="margin:18px 0 0;font:400 15px/1.65 Arial,sans-serif;color:${B.soft}">${escapeHtml(c.signOff)}<br/><strong style="color:${B.ink}">${escapeHtml(c.team)}</strong></p>
  `;
  return {
    subject: c.subject,
    html: wrapEmail({ preheader: c.preheader[account], bodyHtml: body, lang }),
    text: [
      c.heading(name),
      "",
      ...steps.map((step, i) => `${i + 1}. ${step}`),
      "",
      ...app.map((a) => `${a.label}: ${a.href}`),
      "",
      c.note,
      "",
      c.signOff,
      c.team,
    ].join("\n"),
  };
}
