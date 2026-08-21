import type { ExtraId } from "../../data/content";

/** The navy "More services?" band that sits under the nine core services. */
export const extras = {
  sectionAria: "More services",
  eyebrow: "More services?",
  heading: "Beyond the nine, we also cover:",
  intro:
    "The subscription customises to your outlet, so the cover can grow as your dealership does.",
  /* Keyed by id, not by position: the component zips these onto EXTRAS. */
  items: {
    payments: {
      title: "Digital Payment Reconciliation",
      note: "UPI, card & wallet receipts, reconciled daily",
    },
    safety: {
      title: "Quick Response for Safety",
      note: "Incident handling the moment it happens",
    },
    accounts: {
      title: "Account Support",
      note: "Statements and the small follow-ups, handled",
    },
    cyber: {
      title: "Cyber Security",
      note: "Your dealership's data and logins, protected",
    },
  } satisfies Record<ExtraId, { title: string; note: string }>,
};
