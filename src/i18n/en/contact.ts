export const contact = {
  eyebrow: "Get in touch",
  /** The second line is navy, so the headline is two keys: the accent can
      then land on a different part of the sentence in Hindi. */
  headingLead: "The simplest way",
  headingAccent: "is to call.",
  intro:
    "A real person picks up, speaks with you in your language, and tells you honestly whether we can help.",

  /* ── the toll-free card ── */
  tollFree: "Free call",
  /** The Devanagari gloss printed beside "Toll free" on the card. The card
      is bilingual whichever language the page is in. */
  tollFreeDeva: "नि:शुल्क",
  /** When the line is open. A sentence, not a constant, which is why it
      lives here and not in content.ts. */
  hours: "9am to 9pm, every day",
  /** The same opening hours, mid-sentence. Its own string rather than
      `hours.toLowerCase()`, because lower case does not exist in
      Devanagari and the call would quietly do nothing. */
  hoursLower: "9am to 9pm, every day",
  tapToCall: "Tap to call",

  /* ── "Prefer a callback?" ── */
  appEyebrow: "Ready to start?",
  appHeading: "Get the app, register inside it.",
  appNote: "The Dealer Kavach app is free on the App Store and Google Play. You register in the app with your mobile number; nothing to fill in here.",

  /* ── the form ── */
  privacy: "We will never share your number.",
  submitting: "Sending…",

  /** The API answers in English and both of its messages are generic, so a
      failed send shows this instead of whatever the server said. */
  errorGeneric: "Something went wrong. Please try again.",
  /** The failure note ends on a link to the number, so it is stored as the
      three pieces around that link. */
  errorCallLink: "Or call us now",
  /** The dark card that used to be the toll-free number, set enormous. */
  callHeading: "Talk to us now",
  errorEnd: ".",

  /* ── after a successful send ── */
  success: {
    badge: "Received",
    heading: "Thank you. We'll be in touch shortly.",
    /** Same three-part shape as the failure note: the sentence wraps a link. */
    bodyLead: "A team member usually calls within the hour. Can't wait?",
    callLink: "Call us directly",
    bodyEnd: ".",
  },
};
