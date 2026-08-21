export const problem = {
  sectionAria: "The problem we solve",
  eyebrow: "The problem",
  /** The tail of the headline is coloured navy, so it is a key of its own:
      the split point can then move to wherever the language needs it. */
  headingLead: "Nine portals. Dozens of deadlines.",
  headingAccent: "One of you.",
  intro:
    "Most dealers lose hours every week to compliance no one trained them for, and a single missed window can mean a notice. The कवच absorbs the entire load.",

  /* ── The left-hand panel: the dealer carrying it alone ── */
  aloneLabel: "On your own",
  aloneBadge: "≈ 11 hrs / week",
  /** Four worries, scattered as loose cards. The order matters: the tilt and
      position of each card live in Problem.tsx and are matched by index. */
  chaos: [
    "SDMS subsidy entry overdue",
    "Density log missing for audit",
    "Fire NOC expires in 3 days",
    "Automation down. Vendor?",
  ],

  /* ── The right-hand panel: the same four, handled ── */
  /** The gold कवच is its own span, so the label is written around it rather
      than as one string: English puts its words before the brand mark,
      Hindi puts "के साथ" after it. Either half may be empty. */
  withLabelBefore: "With Dealer's ",
  withLabelAfter: "",
  withBadge: "0 missed",
  handled: [
    "SDMS filed before the 11am cut-off",
    "Logs kept inspection-ready year-round",
    "Fire NOC renewed 9 days early",
    "Automation back online in 22 minutes",
  ],
};
