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
  promise: "Compliance software for India’s petrol pump dealers.",
  /** `{tagline}` is BRAND.tagline, which stays English in both languages,
      so the sentence is written around it rather than starting with it. */
  satisfaction: "{tagline}. Your satisfaction fuels our energy.",
  /** The company name is printed in white, which is what breaks this
      sentence in two. Each half carries its own spacing, and `{cin}` is
      filled in from content.ts so the registration clause can sit wherever
      the language wants it. */
  legalBeforeName: "MDG Services is a brand operated by ",
  legalAfterName: ", a company registered in India (CIN {cin}).",

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
  madeFor: "Made for India's fuel station dealers",
};
