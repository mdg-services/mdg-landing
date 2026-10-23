import {
  type EmailContent,
  MAIL_BRAND,
  wrapEmail,
  heading,
  paragraph,
  dataTable,
  button,
  escapeHtml,
} from "./layout.js";
import type {
  EnrollmentData,
  CallbackData,
  GrievanceData,
  GrievanceCategory,
  GrievanceLang,
} from "../validation.js";

const B = MAIL_BRAND;

/* ─────────────────────────────────────────────────────────────
   To add a new email: write a function `(data) => EmailContent`
   here, then send it with `sendTemplate(myEmail(data), to)`.
   ───────────────────────────────────────────────────────────── */

/**
 * The first name a mail may greet, only if it looks like a name: one word of
 * letters and marks, nothing else. Anyone can type any address into the forms,
 * so a mail to that address must not become a way to put somebody's chosen
 * words in front of a stranger. A single plain word is the most it will ever
 * repeat back; without one, the mail greets plainly.
 */
function greetingName(name: string): string | undefined {
  const first = name.trim().split(/\s+/)[0] ?? "";
  return first.length > 0 && first.length <= 40 && /^[\p{L}\p{M}]+$/u.test(first) ? first : undefined;
}

/**
 * How handing a registration to the MDG API went (server/enroll.ts). Anything
 * but `ok` means the dealer was shown an error and has NOT been registered.
 */
export type EnrollHandOff = "ok" | "busy" | "failed";
/** What the team's mail says, and the tag on its subject, when the registration was not saved. */
const NOT_REGISTERED: Record<Exclude<EnrollHandOff, "ok">, string> = {
  failed:
    "This person is NOT registered. The website could not hand the registration to our system, and they were shown an error. Call them and register them by hand, and check the website's WEBSITE_INTAKE_SECRET and the API.",
  busy: "This person is NOT registered. Our system refused it because this number has tried too many times this hour, and they were shown a \"call us\" message. Call them.",
};
const NOT_REGISTERED_TAG = "[NOT REGISTERED — call them]";
/** How handing a call-back to the admin's Call-backs page went (server/callback.ts). */
export type CallbackHandOff = "ok" | "slow" | "full" | "refused" | "unreachable";
/** What the team's email says when it did not simply work, and the tag on its subject. */
const CALLBACK_HAND_OFF: Record<Exclude<CallbackHandOff, "ok">, { note: string; tag: string }> = {
  slow: {
    note: "The admin Call-backs page did not answer in time, so this request MAY not be on it. Check the Call-backs page before calling, so two people do not ring the same person.",
    tag: "[check admin list]",
  },
  full: {
    note: "The admin Call-backs page took no more requests this hour, so this request is NOT on it. This email is the only record: call them from here.",
    tag: "[not on admin list]",
  },
  refused: {
    note: "This request did NOT reach the admin Call-backs page — this email is the only record. Call them from here, and check the website's WEBSITE_INTAKE_SECRET.",
    tag: "[not on admin list]",
  },
  unreachable: {
    note: "The website could not reach the admin Call-backs page, so this request is probably NOT on it. Call them from here.",
    tag: "[not on admin list]",
  },
};

/**
 * Internal notification to the MDG inbox when a dealer enrols.
 *
 * `handOff` is whether the registration was saved in our system. When it was
 * not, the dealer was shown an error, this mail is the only record, and it says
 * so at the top and in the subject, where it cannot be missed.
 *
 * It shows that a password was chosen, never the password: the type of `data`
 * does not even have one.
 */
export function enrollmentNotificationEmail(
  data: EnrollmentData,
  meta: { submittedAt: string; handOff?: EnrollHandOff; hasPassword?: boolean }
): EmailContent {
  const when = new Date(meta.submittedAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });
  const fromApp = data.source === "app";
  const handOff = meta.handOff ?? "ok";
  const notRegistered = handOff === "ok" ? null : NOT_REGISTERED[handOff];

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
    ["WhatsApp messages", data.consentWhatsApp ? "Agreed" : "Not asked"],
    ["Chose a password", meta.hasPassword ? "Yes" : "No"],
    ...(data.ref ? ([["Link code", escapeHtml(data.ref)]] as Array<[string, string]>) : []),
    ["Came from", fromApp ? "Dealer Kavach app" : "Website"],
    ["Submitted", escapeHtml(when) + " IST"],
  ];

  const body = `
    ${heading("New dealer enrolment")}
    ${notRegistered ? `<div style="margin:0 0 16px;padding:12px 16px;background:#FFF7E6;border:1px solid ${B.gold};border-radius:10px;font:600 15px/1.5 Arial,sans-serif;color:${B.ink}">${escapeHtml(notRegistered)}</div>` : ""}
    ${paragraph(`A dealer just submitted the enrolment form ${fromApp ? "in the Dealer Kavach app" : "on the website"}. Details below — reply to this email to reach ${escapeHtml(data.name)} directly.`)}
    ${dataTable(rows)}
  `;

  return {
    // The app's tag sits after "enrolment", so a filter on the old subject
    // still catches both.
    subject: `New dealer enrolment${fromApp ? " (app)" : ""}${notRegistered ? ` ${NOT_REGISTERED_TAG}` : ""} — ${data.name}${data.pumpName ? ` (${data.pumpName})` : ""}`,
    html: wrapEmail({ preheader: `${data.name} · ${data.siteType} · SAP ${data.sapCode}`, bodyHtml: body }),
    text: [
      "New dealer enrolment",
      ...(notRegistered ? ["", notRegistered] : []),
      "",
      `Name:       ${data.name}`,
      `Mobile:     ${data.mobile}`,
      `Email:      ${data.email ?? "—"}`,
      `Site type:  ${data.siteType}`,
      `Pump name:  ${data.pumpName ?? "—"}`,
      `SAP code:   ${data.sapCode}`,
      `Agreed:     Yes`,
      `WhatsApp:   ${data.consentWhatsApp ? "Agreed" : "Not asked"}`,
      `Password:   ${meta.hasPassword ? "Chosen" : "Not chosen"}`,
      ...(data.ref ? [`Link code:  ${data.ref}`] : []),
      `Came from:  ${fromApp ? "Dealer Kavach app" : "Website"}`,
      `Submitted:  ${when} IST`,
    ].join("\n"),
  };
}

/**
 * The welcome copy, in the language of the page the dealer registered on. One
 * promise and no time in it: MDG's team will be in touch, and when is theirs to
 * say. Then the order things happen in: approval, a WhatsApp message, and signing
 * in with the mobile number and the password they chose (never repeated here).
 */
const WELCOME = {
  en: {
    subject: (name?: string) => `Welcome to MDG Services${name ? `, ${name}` : ""} — your enrolment is in`,
    preheader: "Your enrolment is in. MDG's team will contact you shortly.",
    heading: (name?: string) => (name ? `Welcome aboard, ${name}` : "Welcome aboard"),
    thanks: "Thank you for enrolling with {brand} — the Dealer's कवच program. Your details are with our team.",
    nextHeading: "What happens next:",
    steps: [
      "MDG's team will contact you shortly.",
      "Once your registration is approved, you will get a message on WhatsApp.",
      "Then open the Dealer Kavach app and sign in with your mobile number and the password you chose when you registered.",
    ],
    callButton: (phone: string) => `Call us — ${phone}`,
    reach: "Prefer we reach out first? No problem — just keep your phone handy. We answer in plain Hindi or English.",
    signOff: "Warm regards,",
    team: `Team ${B.name}`,
  },
  hi: {
    subject: (name?: string) => `MDG Services में आपका स्वागत है${name ? `, ${name}` : ""} — आपका रजिस्ट्रेशन मिल गया`,
    preheader: "आपका रजिस्ट्रेशन मिल गया। MDG की टीम जल्द संपर्क करेगी।",
    heading: (name?: string) => (name ? `स्वागत है, ${name}` : "स्वागत है"),
    thanks: "{brand} के डीलर कवच के लिए रजिस्टर करने का धन्यवाद। आपकी जानकारी हमारी टीम के पास है।",
    nextHeading: "आगे क्या होगा:",
    steps: [
      "MDG की टीम जल्द संपर्क करेगी।",
      "आपका रजिस्ट्रेशन मंज़ूर होते ही आपको WhatsApp पर संदेश आएगा।",
      "फिर डीलर कवच ऐप खोलिए और अपने मोबाइल नंबर और रजिस्टर करते समय चुने गए पासवर्ड से साइन इन कीजिए।",
    ],
    callButton: (phone: string) => `कॉल कीजिए — ${phone}`,
    reach: "चाहें तो हम ही पहले संपर्क करेंगे — बस अपना फ़ोन पास रखिए। हम सीधी हिंदी या अंग्रेज़ी में बात करते हैं।",
    signOff: "सादर,",
    team: `टीम ${B.name}`,
  },
} as const;

/** Friendly welcome to the dealer who just enrolled, once their registration is saved. */
export function welcomeEmail(data: EnrollmentData): EmailContent {
  const lang = data.lang ?? "en";
  const c = WELCOME[lang];
  // A stranger can type any address into the form, so only a plain first name
  // is ever repeated back; anything else gets the plain greeting.
  const name = greetingName(data.name);

  const body = `
    ${heading(c.heading(name))}
    ${paragraph(escapeHtml(c.thanks).replace("{brand}", `<strong style="color:${B.ink}">${escapeHtml(B.name)}</strong>`))}
    ${paragraph(`<strong style="color:${B.ink}">${escapeHtml(c.nextHeading)}</strong>`)}
    <ol style="margin:0 0 16px;padding-left:22px;font:400 15px/1.65 Arial,sans-serif;color:${B.soft}">
      ${c.steps.map((step) => `<li style="margin:0 0 6px">${escapeHtml(step)}</li>`).join("")}
    </ol>
    <div style="margin:22px 0 6px">${button(c.callButton(B.phone), B.phoneHref)}</div>
    ${paragraph(escapeHtml(c.reach))}
    <p style="margin:18px 0 0;font:400 15px/1.65 Arial,sans-serif;color:${B.soft}">${escapeHtml(c.signOff)}<br/><strong style="color:${B.ink}">${escapeHtml(c.team)}</strong></p>
  `;

  return {
    subject: c.subject(name),
    html: wrapEmail({ preheader: c.preheader, bodyHtml: body, lang }),
    text: [
      c.heading(name),
      "",
      c.thanks.replace("{brand}", B.name),
      "",
      c.nextHeading,
      ...c.steps.map((step, i) => `${i + 1}. ${step}`),
      "",
      `${B.phone}`,
      "",
      c.signOff,
      c.team,
    ].join("\n"),
  };
}

/**
 * Internal notification when someone asks for a call: the homepage "Leave my
 * number", the film pages' "we'll call you", the Khata Kavach page or the
 * assistant's fallback. `handOff` is how handing it to the admin panel's
 * Call-backs page went; when it did not simply work, this mail says why at the
 * top and tags the subject.
 */
export function callbackNotificationEmail(
  data: CallbackData,
  meta: { submittedAt: string; handOff?: CallbackHandOff }
): EmailContent {
  const flag = meta.handOff && meta.handOff !== "ok" ? CALLBACK_HAND_OFF[meta.handOff] : null;
  const when = new Date(meta.submittedAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });
  const fromFilm = data.source === "film";

  const rows: Array<[string, string]> = [
    ["Name", escapeHtml(data.name)],
    [
      "Phone",
      `<a href="tel:${escapeHtml(data.phone.replace(/\s/g, ""))}" style="color:${B.navy};text-decoration:none">${escapeHtml(data.phone)}</a>`,
    ],
    ["Pump / outlet", data.outlet ? escapeHtml(data.outlet) : "—"],
    ["Message", data.message ? escapeHtml(data.message) : "—"],
    ["Came from", fromFilm ? "Film page" : "Website"],
    ...(data.ref ? ([["Link code", escapeHtml(data.ref)]] as Array<[string, string]>) : []),
    ["Submitted", escapeHtml(when) + " IST"],
  ];

  const body = `
    ${flag ? `<div style="margin:0 0 16px;padding:12px 16px;background:#FFF7E6;border:1px solid ${B.gold};border-radius:10px;font:600 15px/1.5 Arial,sans-serif;color:${B.ink}">${escapeHtml(flag.note)}</div>` : ""}
    ${heading("New callback request")}
    ${paragraph(
      fromFilm
        ? `Someone watched the Dealer Kavach film and asked for a call. Call them back at the number below — they're expecting it within the hour.`
        : `Someone asked for a callback from the website. Call them back at the number below — they're expecting it within the hour.`
    )}
    ${dataTable(rows)}
  `;

  return {
    subject: `Callback request${fromFilm ? " (film)" : ""}${flag ? ` ${flag.tag}` : ""} — ${data.name}`,
    html: wrapEmail({ preheader: `${data.name} · ${data.phone}`, bodyHtml: body }),
    text: [
      "New callback request",
      "",
      `Name:      ${data.name}`,
      `Phone:     ${data.phone}`,
      `Outlet:    ${data.outlet ?? "—"}`,
      `Message:   ${data.message ?? "—"}`,
      `Came from: ${fromFilm ? "Film page" : "Website"}`,
      ...(data.ref ? [`Link code: ${data.ref}`] : []),
      `Submitted: ${when} IST`,
      ...(flag ? ["", flag.note] : []),
    ].join("\n"),
  };
}

/* ─────────────────────────────────────────────────────────────
   Grievances
   ───────────────────────────────────────────────────────────── */

/**
 * What a grievance is about, in the words each reader sees. They mirror the
 * labels on the form (`grievance.ts` in each language's folder under
 * src/i18n), which the server cannot import. The team's mail is always in
 * English, whatever language the form was filled in.
 */
const CATEGORY_LABEL: Record<GrievanceCategory, Record<GrievanceLang, string>> = {
  service: { en: "Our service", hi: "हमारी सेवा" },
  app: { en: "The Dealer Kavach app", hi: "डीलर कवच ऐप" },
  billing: { en: "Billing or payment", hi: "बिल या भुगतान" },
  staff: { en: "Our staff", hi: "हमारा स्टाफ़" },
  privacy: { en: "Privacy or your data", hi: "प्राइवेसी या आपकी जानकारी" },
  other: { en: "Something else", hi: "कुछ और" },
};

const oneLine = (value: string) => value.replace(/\s+/g, " ").trim();

const COPY = {
  en: {
    subject: (ref: string) => `We have your grievance, number ${ref}`,
    preheader: (ref: string) => `Your grievance number is ${ref}.`,
    heading: "We have received your grievance",
    greeting: (name?: string) => (name ? `Hello ${name},` : "Hello,"),
    intro:
      "Thank you for telling us. Your grievance has reached our team. Keep the number below for any call or message about it.",
    numberLabel: "Your grievance number",
    rows: { about: "About", date: "Date" },
    nextHeading: "What happens next:",
    next: "A person from our team will look into it and get back to you.",
    reachLead: "Want to add something? Reply to this email, or call us on",
    reachHours: "9am to 9pm, every day",
    reachTail: "and give us your grievance number.",
    callButton: (phone: string) => `Call us — ${phone}`,
    notYou: "Did not send this? You can ignore this email.",
    signOff: "Warm regards,",
    team: `Team ${B.name}`,
    locale: "en-IN",
  },
  hi: {
    subject: (ref: string) => `आपकी शिकायत मिल गई है, नंबर ${ref}`,
    preheader: (ref: string) => `आपकी शिकायत का नंबर ${ref} है।`,
    heading: "आपकी शिकायत हमें मिल गई",
    greeting: (name?: string) => (name ? `नमस्ते ${name},` : "नमस्ते,"),
    intro:
      "आपने जो बताया, वह हमारी टीम तक पहुँच गया है। इस बारे में कॉल करते या लिखते समय नीचे दिया नंबर अपने पास रखिए।",
    numberLabel: "आपकी शिकायत का नंबर",
    rows: { about: "किस बारे में", date: "तारीख़" },
    nextHeading: "आगे क्या होगा:",
    next: "हमारी टीम से कोई आपकी बात देखेगा और आपको जवाब देगा।",
    reachLead: "कुछ और जोड़ना है? इस ईमेल का जवाब दे दीजिए, या",
    reachHours: "सुबह 9 से रात 9, हर दिन",
    reachTail: "पर कॉल कीजिए और अपना शिकायत नंबर बता दीजिए।",
    callButton: (phone: string) => `कॉल कीजिए — ${phone}`,
    notYou: "यह शिकायत आपने नहीं भेजी? तो इस ईमेल को अनदेखा कर दीजिए।",
    signOff: "सादर,",
    team: `टीम ${B.name}`,
    locale: "hi-IN",
  },
} satisfies Record<GrievanceLang, unknown>;

/**
 * The acknowledgement the person who sent a grievance gets, in the language
 * they filled the form in. It carries their grievance number, what it is
 * about and the date, and says what happens next. It never repeats what they
 * wrote, and it promises no time to reply: that is the team's to give.
 */
export function grievanceAckEmail(
  data: GrievanceData,
  meta: { ref: string; submittedAt: string }
): EmailContent {
  const c = COPY[data.lang];
  const name = greetingName(data.name);
  const about = CATEGORY_LABEL[data.category][data.lang];
  const date = new Date(meta.submittedAt).toLocaleDateString(c.locale, {
    dateStyle: "long",
    timeZone: "Asia/Kolkata",
  });
  const ref = escapeHtml(meta.ref);

  const body = `
    ${heading(c.heading)}
    ${paragraph(escapeHtml(c.greeting(name)))}
    ${paragraph(escapeHtml(c.intro))}
    <div style="margin:20px 0;padding:18px 20px;background:${B.paper};border:1px solid ${B.line};border-radius:12px;text-align:center">
      <div style="font:600 12px/1.4 Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:${B.muted}">${escapeHtml(c.numberLabel)}</div>
      <div style="margin-top:6px;font:700 32px/1.1 'Courier New',monospace;letter-spacing:.04em;color:${B.navy}">${ref}</div>
    </div>
    ${dataTable([
      [c.rows.about, escapeHtml(about)],
      [c.rows.date, escapeHtml(date)],
    ])}
    ${paragraph(`<strong style="color:${B.ink}">${escapeHtml(c.nextHeading)}</strong> ${escapeHtml(c.next)}`)}
    ${paragraph(
      `${escapeHtml(c.reachLead)} <a href="${B.phoneHref}" style="color:${B.navy};text-decoration:none;font-weight:600">${B.phone}</a> (${escapeHtml(c.reachHours)}) ${escapeHtml(c.reachTail)}`
    )}
    <div style="margin:22px 0 6px">${button(c.callButton(B.phone), B.phoneHref)}</div>
    ${paragraph(escapeHtml(c.notYou))}
    <p style="margin:18px 0 0;font:400 15px/1.65 Arial,sans-serif;color:${B.soft}">${escapeHtml(c.signOff)}<br/><strong style="color:${B.ink}">${escapeHtml(c.team)}</strong></p>
  `;

  return {
    subject: c.subject(meta.ref),
    html: wrapEmail({ preheader: c.preheader(meta.ref), bodyHtml: body, lang: data.lang }),
    text: [
      c.heading,
      "",
      c.greeting(name),
      "",
      c.intro,
      "",
      `${c.numberLabel}: ${meta.ref}`,
      `${c.rows.about}: ${about}`,
      `${c.rows.date}: ${date}`,
      "",
      `${c.nextHeading} ${c.next}`,
      "",
      `${c.reachLead} ${B.phone} (${c.reachHours}) ${c.reachTail}`,
      "",
      c.notYou,
      "",
      c.signOff,
      c.team,
    ].join("\n"),
  };
}

/** Internal notification to the MDG inbox when somebody sends a grievance. */
export function grievanceNotificationEmail(
  data: GrievanceData,
  meta: { ref: string; submittedAt: string }
): EmailContent {
  const when = new Date(meta.submittedAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });
  const about = CATEGORY_LABEL[data.category].en;
  const language = data.lang === "hi" ? "Hindi" : "English";

  const rows: Array<[string, string]> = [
    ["Grievance no.", escapeHtml(meta.ref)],
    ["About", escapeHtml(about)],
    ["Name", escapeHtml(data.name)],
    [
      "Mobile",
      `<a href="tel:${escapeHtml(data.mobile.replace(/\s/g, ""))}" style="color:${B.navy};text-decoration:none">${escapeHtml(data.mobile)}</a>`,
    ],
    [
      "Email",
      `<a href="mailto:${escapeHtml(data.email)}" style="color:${B.navy};text-decoration:none">${escapeHtml(data.email)}</a>`,
    ],
    ["Pump / SAP code", data.outlet ? escapeHtml(data.outlet) : "—"],
    ["Wrote in", language],
    ["Submitted", escapeHtml(when) + " IST"],
  ];

  // Their own line breaks, kept: a grievance written as a list should read as one.
  const message = escapeHtml(data.message).replace(/\r?\n/g, "<br/>");

  const body = `
    ${heading("New grievance")}
    ${paragraph(`Someone sent a grievance from the website. It is on the Grievances page in the admin panel too. Reply to this email to write to ${escapeHtml(oneLine(data.name))} directly.`)}
    ${dataTable(rows)}
    <p style="margin:18px 0 6px;font:600 12px/1.4 Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:${B.muted}">What they wrote</p>
    <div style="padding:14px 16px;background:${B.paper};border:1px solid ${B.line};border-radius:12px;font:400 15px/1.6 Arial,sans-serif;color:${B.ink};overflow-wrap:anywhere;word-break:break-word">${message}</div>
  `;

  return {
    subject: `Grievance ${meta.ref} (${about}) — ${oneLine(data.name)}`,
    html: wrapEmail({ preheader: `${meta.ref} · ${about} · ${oneLine(data.name)}`, bodyHtml: body }),
    text: [
      "New grievance",
      "",
      `Grievance no.:   ${meta.ref}`,
      `About:           ${about}`,
      `Name:            ${data.name}`,
      `Mobile:          ${data.mobile}`,
      `Email:           ${data.email}`,
      `Pump / SAP code: ${data.outlet ?? "—"}`,
      `Wrote in:        ${language}`,
      `Submitted:       ${when} IST`,
      "",
      "What they wrote:",
      data.message,
    ].join("\n"),
  };
}
