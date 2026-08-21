import type { SiteType } from "../../data/content";

/* The dealer enrolment page at /register, and the Terms & Conditions behind
   the checkbox on it.

   Portal, document and product names (SDMS, SAP, Annexure I, PESO, OMC, GST,
   UPI, Type A / Type B) belong to other people's systems and paperwork, so
   they stay in Latin script in both languages: that is how a dealer sees them
   on every screen and on every piece of paper they already have. */
export const register = {
  /* ── the slim header ── */
  /** Used twice: after the "←" in the header, and on the success card. */
  backToHome: "Back to home",

  /* ── the dark hero band ── */
  /* The eyebrow is set bilingually on the English page: the English phrase,
     a dot, then the Devanagari word. On the Hindi page the pair would say the
     same thing twice, so Hindi puts its own word in `eyebrow` and leaves
     `eyebrowDeva` as `undefined`, and the component drops the dot with it.
     Write `undefined` there, not an empty string. */
  eyebrow: "Dealer enrolment",
  eyebrowDeva: "नामांकन" as string | undefined,
  heading: "Register your dealership.",
  intro:
    "A few details and you're in. Pick the site that fits your pump. We confirm the services and lock your pricing in writing before we begin.",

  /* ── the form ── */
  sectionAria: "Enrolment form",
  formAria: "Dealer enrolment",
  /** The gold asterisk sits between these two halves, so each language
      decides for itself where in the sentence the mark belongs. */
  requiredLead: "Fields marked",
  requiredTail: "are required.",

  fields: {
    name: { label: "Your Name", placeholder: "Ramesh Kumar" },
    mobile: { label: "Your Mobile", placeholder: "Your mobile number" },
    email: { label: "Your Email", placeholder: "Enter your email" },
    pumpName: { label: "Pump Name", placeholder: "Your pump's name" },
    sapCode: { label: "SAP Code", placeholder: "Your SAP code" },
  },

  siteTypeLegend: "Site type",
  /**
   * Only the label a dealer reads. The value submitted to the enrolment API,
   * and the name the signed agreement uses, is the key itself and never
   * changes with the language.
   */
  siteTypes: {
    "Type A": "Type A",
    "Type B": "Type B",
  } satisfies Record<SiteType, string>,

  /* The agreement line wraps the link that opens the modal, so it is stored
     as the two pieces around that link. In English the tail is only the full
     stop; in Hindi the verb lands after the link, so the tail carries it. */
  agreeLead: "I have read and agree to the",
  termsLink: "Terms & Conditions",
  agreeTail: ".",
  agreeAria: "I agree to the Terms and Conditions",

  /** The enrolment API answers in English and its messages are generic, so a
      failed submit shows this instead of whatever the server said. */
  errorGeneric: "Something went wrong. Please try again.",
  /** The failure note ends on a link to the number. `{phone}` is filled in
      from content.ts, and the closing punctuation is its own key so Hindi can
      end the sentence with a danda. */
  errorCallLink: "Or call {phone}",
  errorEnd: ".",

  privacy: "We will never share your details.",
  submit: "Submit",
  submitting: "Submitting…",

  /** When the line is open, mid-sentence. Its own string rather than
      `hours.toLowerCase()`, because lower case does not exist in Devanagari
      and the call would quietly do nothing. */
  hours: "9am to 9pm, every day",

  /* ── after a successful enrolment ── */
  success: {
    badge: "Enrolment received",
    heading: "Thank you. Your details are with us.",
    /** `{hours}` is filled in with `hours` above, so the opening times can
        sit wherever the sentence wants them rather than being glued on in
        English word order. The sentence then wraps a link, so its last two
        pieces are separate keys. */
    bodyLead:
      "A team member will call to confirm your services and pricing, usually within the hour ({hours}). Can't wait?",
    callLink: "Call us directly",
    bodyEnd: ".",
  },

  /* ── the Terms & Conditions modal ── */
  termsEyebrow: "The agreement",
  /** The modal's own heading. Kept apart from `termsLink` above so a language
      can set the link and the title differently if it reads better. */
  termsTitle: "Terms & Conditions",
  close: "Close",
  agreeContinue: "I agree & continue",

  /* The footnote under the clauses. "Annexure I" is the name of a document in
     the signed agreement, so it stays put; the sentence is stored as the
     pieces around it and around the phone link. */
  annexureLead: "Services and rates are set out in",
  annexureTail:
    "; anything outside it is negotiated between both parties. Questions before you sign?",
  annexureCallLink: "Call {phone}",
  annexureEnd: ".",

  /**
   * A translation of a contract is not the contract. On the Hindi page these
   * three carry a notice saying the English text is the binding one, plus the
   * labels for the control that swaps the clause list between the Hindi
   * translation and the English original. English is already the binding
   * text, so on this side all three are empty and the modal shows neither the
   * notice nor the control.
   */
  bindingNotice: "",
  showEnglish: "",
  showHindi: "",

  /**
   * The ten clauses, verbatim from the signed service agreement, in the order
   * they appear there. The only edit is the reference in clause 1, which the
   * agreement types as "Annexure - I" and which is written here the way the
   * same clause writes it a sentence later.
   */
  terms: [
    "The Dealer shall share the User ID and the Password to the Service Provider for carrying out services, as mutually agreed. The list of services as well as respective charges/rates for the services provided by the Service Provider to the Dealer is illustrated in Annexure-I. Any services outside the scope of Annexure-I shall be mutually negotiated between the Parties.",
    "Parties agree to maintain confidentiality of the data/information disclosed to each other. Party receiving such Confidential Information shall not disclose this information without the prior written consent of the Disclosing Party.",
    "Service Provider shall provide all the services to the Dealer virtually only (Online services). However, upon urgent request of the Dealer, onsite services shall be provided by the Service Provider subject to the availability of manpower as well as accessibility of the Dealer's Location. Cost for providing such services physically at the location of the Dealer shall be mutually negotiated between the Parties.",
    "It is acknowledged and confirmed by the Dealer that Service Provider is fully dependent on the Dealer in respect of the data/information/documents required for providing services to the Dealer. It is further acknowledged and confirmed by the Dealer that the Service Provider has no mechanism to check the authenticity/accuracy of such data/information/documents, and therefore Service Provider shall not be responsible for any deficiency in services on account of wrong/incorrect data/information/documents provided by the Dealer to the Service Provider.",
    "It is agreed between the Parties that since the services are being provided by the Service Provider virtually therefore in the event of any delay/deficiency of services on account of poor internet network, dealer's non-cooperation, non-availability of the spare parts, and other FORCE MAJEURE events including flood, Strike, Lock down, Earthquake, Government Holidays, riots etc, Service Provider shall not be liable for fine/penalty which might be imposed on the Dealer for non-compliance/delayed compliance/failure to comply with PESO/OMC/Government regulations/guidelines.",
    "It is acknowledged and confirmed by the Dealer that all the services being carried out by the Service Provider is, for and on behalf of the Dealer, and the Service Provider shall be acting as an independent Consultant, and therefore Service Provider shall not be responsible for any acts or failure of the Dealer to follow the PESO/OMC/Government regulations/guidelines.",
    "Dealer shall make all the payment to the Service Provider through Bank Transfer/UPI Transfer or in any manner as agreed between the Parties. Service Provider shall add applicable GST charges and raise invoice in the name of the Dealer. Payment shall be made within 10 days of receipt of the invoice. Any delay beyond this period shall entitle the Service Provider to charge interest @ 18% per annum.",
    "Dealer agrees to defend and indemnify the Service Provider against all suits, actions, penalties and liabilities that may arise from failure on the part of the Dealer to comply regulatory provisions/statutory guidelines as notified by OMC/PESO/Government Authorities from time to time.",
    "This agreement shall remain valid for a period of 1 year from the Signing Date, and may further be renewed for successive terms of 1 (One) year each unless terminated by Parties with prior 30 days written notice to the other Party. However, Service Provider shall be entitled to terminate this Agreement immediately in the event of non-receipt of the payment within the period/timeline stipulated in the invoice.",
    "Parties agree that all the disputes related to the services provided by the Service Provider under this agreement shall be the exclusive jurisdiction of Courts at Delhi.",
  ],
};
