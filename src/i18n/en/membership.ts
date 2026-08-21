/* The pricing band. What a dealer pays for and what is promised in return.

   The phone number, the "Get started" link target and the four tile numerals
   are not here: they are the same in either language and live in the
   component or in `src/data/content.ts`. */
export const membership = {
  /** The live pill above the headline. The dot is a separator, not a word. */
  badge: "Subscriptions open · new dealers welcome",

  /* The mega headline is two lines with a hard break, and only the second
     line is gold. Splitting it lets each language decide where the sentence
     turns and which half carries the accent. */
  headingLead: "Pay only for what",
  headingAccent: "your pump needs.",

  intro:
    "One monthly subscription, sized to the modules you switch on, priced in writing before you begin.",

  ctaPrimary: "Get started",
  ctaSecondary: "Call to discuss",

  /* The four tiles along the bottom. A list, not a keyed record: the ids for
     these live nowhere else, and the numeral on each tile comes from its
     position, so the order is the meaning. */
  promises: [
    {
      title: "Modular",
      body: "You switch on the modules your pump needs. Your subscription covers what it actually uses.",
    },
    {
      title: "Locked",
      body: "Pricing is written down before we begin. No surprise fees, no mid-year escalation.",
    },
    {
      title: "Checked",
      body: "Every outlet is set up and checked properly before the next one starts.",
    },
    {
      title: "Lifted",
      body: "Onboarding within seven days. A difference in the first cycle.",
    },
  ],
};
