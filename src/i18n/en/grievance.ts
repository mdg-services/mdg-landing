import type { GrievanceCategory } from "../../data/content";

/* The grievance page at /grievance, where anyone can report a problem and is
   emailed a grievance number.

   Product and document names (Dealer Kavach, SAP) belong to us and to other
   people's paperwork, so they keep their own spelling in both languages. */
export const grievance = {
  /** The browser tab's title on this page. */
  pageTitle: "Report a grievance · MDG Services",

  /* ── the slim header ── */
  /** Used twice: after the "←" in the header, and on the success card. */
  backToHome: "Back to home",

  /* ── the dark hero band ── */
  /* Bilingual on the English page, the way the enrolment page is: the English
     phrase, a dot, then the Devanagari word. Hindi puts its own word in
     `eyebrow` and leaves `eyebrowDeva` as `undefined`, and the dot goes with
     it. Write `undefined` there, not an empty string. */
  eyebrow: "Grievances",
  eyebrowDeva: "शिकायत" as string | undefined,
  heading: "Something gone wrong? Tell us.",
  /** What this page is for, in plain words, and what happens to what is sent. */
  intro:
    "Report a problem with our service, the Dealer Kavach app, billing or payment, our staff, or how we handle your data. Write what happened. A person from our team will look into it and get back to you.",
  /** The search-result description: the intro, cut to fit about 155 characters. */
  metaDescription:
    "Report a problem with our service, the Dealer Kavach app, billing, our staff or how we handle your data. Someone from our team will look into it and reply.",
  /** Under the intro, ending on a link that starts a call. */
  callLead: "Rather talk to someone?",
  callLink: "Call us",
  callEnd: ".",

  /* ── the form ── */
  sectionAria: "Grievance form",
  formAria: "Report a grievance",
  /** The gold asterisk sits between these two halves, so each language
      decides for itself where in the sentence the mark belongs. */
  requiredLead: "Fields marked",
  requiredTail: "are required.",

  fields: {
    name: { label: "Your Name", placeholder: "Ramesh Kumar" },
    mobile: { label: "Your Mobile", placeholder: "Your mobile number" },
    email: {
      label: "Your Email",
      placeholder: "Enter your email",
      /** Under the box: why it is asked for. */
      hint: "Your grievance number is sent to this address.",
    },
    outlet: {
      label: "Pump Name or SAP Code",
      placeholder: "Sai Petroleums, Aligarh",
      hint: "If you run a pump.",
    },
    message: {
      label: "What happened",
      placeholder:
        "Tell us what went wrong and when. The more you write, the easier it is for us to help.",
    },
  },

  categoryLegend: "What is it about",
  /**
   * Only the label a visitor reads. The value sent to the grievance API is the
   * key itself and never changes with the language.
   */
  categories: {
    service: "Our service",
    app: "The Dealer Kavach app",
    billing: "Billing or payment",
    staff: "Our staff",
    privacy: "Privacy or your data",
    other: "Something else",
  } satisfies Record<GrievanceCategory, string>,

  /** Under the box, as the visitor types. `{n}` is what is written so far and
      `{max}` the most the form takes. */
  messageCount: "{n} / {max}",
  /** Shown under the box when what was written is too short to send. */
  messageShort: "Please write a little more, at least 10 characters.",

  /** The API answers in English and its messages are generic, so a failed
      send shows this instead of whatever the server said. */
  errorGeneric: "We could not send your grievance. Please try again.",
  /** Instead of the line above when the form was refused for coming too often:
      trying again at once would only be refused again. */
  errorBusy: "We can't take another grievance from you just now. Please try again later.",
  /** The failure note ends on a link that starts a call. */
  errorCallLink: "Or call us now",
  errorEnd: ".",
  /** One line under the failure note when the server named the box it did not
      accept. Only these three: the others the form's own checks catch first. */
  errorField: {
    email: "The email address does not look right. Please check it.",
    mobile: "The mobile number does not look right. Please check it.",
    message: "Please check what you wrote in the “What happened” box.",
  },

  privacy: "We use your details only to look into this and reply to you.",
  submit: "Send grievance",
  submitting: "Sending…",

  /* ── after a successful send ── */
  success: {
    badge: "Grievance received",
    heading: "Thank you. We have your grievance.",
    numberLabel: "Your grievance number",
    /** `{email}` is the address the person typed. */
    emailed:
      "We have emailed your grievance number to {email}. If you do not see it, look in your spam folder.",
    /** No email went: it could not be sent, or this was a repeat of one already
        saved. The number on screen is all they may have. `{email}` as above. */
    notEmailed: "Please note this number down. If no email reaches {email}, this number is all you need.",
    keep: "Give us this number whenever you call or write about it.",
    /** Ends on a link that starts a call, so it is stored as the pieces around it. */
    bodyLead: "A person from our team will look into it and get back to you. Can't wait?",
    callLink: "Call us directly",
    bodyEnd: ".",
  },
};
