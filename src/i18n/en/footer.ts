/* The dark footer.

   Two of its lines used to sit in content.ts as BRAND.promise and
   BRAND.hours. Both are sentences rather than facts, so both moved here.
   BRAND.tagline did not move: "Fueling Success" is a brand line and stays
   in English on the Hindi page too.

   The registered company name, the CIN and the current year are facts, so
   they are filled into these strings when the footer renders instead of
   being written into them. Where such a fact carries its own markup, as the
   company name does in the paragraph under the logo, the sentence is stored
   as the two halves around it instead of as a placeholder. */
export const footer = {
  /* ── the brand column ── */
  /** The muted line under "Dealer's कवच". */
  promise: "Apps for petrol pump dealers and credit sales to regular customers.",
  /** `{tagline}` is BRAND.tagline, which stays English in both languages,
      so the sentence is written around it rather than starting with it. */
  satisfaction: "{tagline}. Your satisfaction fuels our energy.",
  /** The company name is printed in white, which is what breaks this
      sentence in two. Each half carries its own spacing, and `{cin}` is
      filled in from content.ts so the registration clause can sit wherever
      the language wants it. */
  legalBeforeName: "MDG Services is a brand operated by ",
  legalAfterName: ", a company registered in India (CIN {cin}).",
  /** The WhatsApp accounts' names, BRAND.whatsappNames, are printed in white
      like the company name above them, so this sentence is stored as the
      pieces around the two names. */
  whatsappBefore: "On WhatsApp, our business accounts are ",
  whatsappJoin: " and ",
  whatsappAfter: ".",

  /* ── the two link columns ── */
  exploreHeading: "Explore",
  /** Keyed by the anchor each link points at, so a label never depends on
      the order of the list. Deliberately not shared with `nav`: the top bar
      says "The app" where the footer says "Services". */
  explore: {
    services: "Services",
    why: "Why us",
    process: "Process",
    membership: "Pricing",
    contact: "Get in touch",
  },
  /** Last in the same list, but a route rather than an anchor. */
  register: "Register",
  /** And the grievance page, last in the list. */
  grievance: "Grievances",
  /** The dealer guides to the Marketing Discipline Guidelines: plain static pages, so a plain link, not a route. */
  mdgGuide: "Guides for dealers",

  /** The apps column: Dealer's Kavach on this page, Khata Kavach on its own. */
  appsHeading: "Our apps",
  dealerApp: "Dealer's Kavach",
  khataApp: "Khata Kavach",
  /** The Khata Kavach guides' front door: a plain link (guide addresses keep their trailing slash). */
  khataGuides: "Guides on selling on credit",
  /** Not a link: the Android app is not on Google Play yet. */
  khataAndroid: "Khata Kavach for Android: coming to Google Play",

  reachHeading: "Reach us",
  /** When the toll-free line is open. Drawn in capitals by CSS, so it is
      written here in ordinary case. */
  hours: "9am to 9pm, every day",

  /* ── the hairline at the bottom ── */
  /** `{year}` is the current year and `{name}` the registered company. */
  copyright: "© {year} {name}. All rights reserved.",
  brandLine: "MDG Services is a brand of {name} · CIN: {cin}",
  /** The privacy page itself is English only. Its link is not. */
  privacy: "Privacy Policy",
  madeFor: "Made for India's fuel station dealers and credit-selling businesses",
};
