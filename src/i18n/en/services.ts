import type { ServiceId } from "../../data/content";

/**
 * One card in the nine-card grid.
 *
 * `covers` are chips, so every entry has to stay chip-short. The portal,
 * scheme and instrument names inside them (SDMS, DSR, DAR, Dhruva, MDT,
 * QRC, AAC, DOD, XTRA) belong to other people's systems and stay in Latin
 * script in every language, because that is how a dealer sees them on the
 * screens they already use.
 */
type ServiceCard = {
  title: string;
  blurb: string;
  covers: string[];
  metric: string;
};

export const services = {
  eyebrow: "Inside the app",

  /* The headline runs on into a navy tail, so it is two keys rather than one
     sentence with a marker in it: the point where the colour starts moves
     with the language. The trailing space on the lead is deliberate; it is
     the gap before the coloured half. */
  headingLead: "Nine jobs the app keeps ",
  headingAccent: "on track for you.",

  intro: "Switch on what your pump needs, leave the rest off.",

  /* The section's own name, set twice at the foot of the header: the
     Devanagari word, then its Latin gloss. On the Hindi page the pair would
     say the same thing twice, so Hindi leaves `labelLatin` as `undefined`
     and the component drops that span. Write `undefined` there, not an
     empty string, or the development parity check will call it a hole. */
  labelDeva: "सेवाएँ",
  labelLatin: "Services" as string | undefined,

  /* Keyed by id, not by position: the component looks each card up by
     `s.id`, so the order of SERVICES in content.ts can change freely. */
  items: {
    sdms: {
      title: "SDMS Compliance",
      blurb: "Every SDMS entry filed, updated and followed up so your dealership stays in good standing.",
      covers: ["Subsidy", "Work permit", "Safety & Swachhta", "Monthly wages", "Declaration", "DAR automation"],
      metric: "Nothing left unfiled",
    },
    mdg: {
      title: "MDG Compliance",
      blurb: "Stock and density watched daily; variation caught before it becomes a notice.",
      covers: ["Stock variation monitoring", "DSR", "Density check", "Toilet upkeep", "Sample inspection"],
      metric: "Variation caught early",
    },
    inspection: {
      title: "Inspection Compliance",
      blurb: "Records, logs and samples kept inspection-ready year-round. Nothing missing when the team arrives.",
      covers: ["Dhruva", "MDT", "QRC", "AAC", "Mobile lab", "DO team"],
      metric: "Inspection-ready, always",
    },
    reminder: {
      title: "Document Reminders",
      blurb: "Every licence, renewal and filing window tracked. A clear reminder before anything expires.",
      covers: ["Licences", "Renewals", "Fire NOC", "Weights & measures", "Explosives"],
      metric: "22 deadline windows tracked",
    },
    automation: {
      title: "Automation Support",
      blurb: "When automation goes down on a Sunday night, it is flagged straight away and tracked until it is back up.",
      covers: ["Fault diagnosis", "Vendor coordination", "Rule-abiding config", "Uptime watch"],
      metric: "Downtime flagged, not discovered",
    },
    webportal: {
      title: "Web Portal Support",
      blurb: "Complaints raised and chased on the right portal, whether nozzle, tank or pipeline. Drills and fillups logged.",
      covers: ["Complaint registering", "Nozzle / tank / pipeline", "Mock drill", "ATR fillups"],
      metric: "Tracked from raised to resolved",
    },
    xtra: {
      title: "XTRA Campaign Support",
      blurb: "XTRA Rewards enrolment and OMC promotional drives, with enrolment and campaign progress visible in one place.",
      covers: ["Customer enrolment", "Promotional activity", "Target chasing", "Campaign reporting"],
      metric: "Enrolment and progress in one place",
    },
    dod: {
      title: "D.O.D & Stock Punctuality",
      blurb: "DOD facility managed, stock-on-hand watched, and the reminders that keep deliveries on time.",
      covers: ["DOD facility management", "Stock monitoring", "Delivery reminders", "Reconciliation"],
      metric: "Yesterday reconciled by morning",
    },
    preparepro: {
      title: "Prepare Pro Manager",
      blurb: "Industry expertise built into your team: leadership, management and the calls that run a pump well.",
      covers: ["Industry expertise", "Leadership development", "Team management", "Decision-making"],
      metric: "Built into the team",
    },
  } satisfies Record<ServiceId, ServiceCard>,
};
