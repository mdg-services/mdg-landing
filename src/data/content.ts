import type { IconName } from "../components/Icon";

/* ─────────────────────────────────────────────────────────────
   All copy + data is sourced from the Dealer's कवच brochure and
   the established MDG Services voice. No placeholders.
   ───────────────────────────────────────────────────────────── */

export const BRAND = {
  name: "MDG Services",
  legalName: "VRUOOM PRIVATE LIMITED",
  cin: "U29194HR2021PTC098450",
  program: "Dealer's कवच",
  programLatin: "Dealer's Kavach",
  phone: "1800-891-3496",
  phoneHref: "tel:18008913496",
  site: "mdgservices.in",
  email: "hello@mdgservices.in",
  hours: "9am to 9pm, every day",
  since: 2021,
  tagline: "Fueling Success",
  promise: "Compliance software for India’s petrol pump dealers",
};

export type Stat = {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  label: string;
  hi?: string;
  note: string;
};

export const STATS: Stat[] = [
  {
    value: 536,
    label: "Figures matched the dealer's own book",
    hi: "आँकड़े",
    note: "Of 557 we checked against dealers' own records. We show you any that differ.",
  },
  {
    value: 45,
    label: "Compliance items on the clock",
    hi: "काम",
    note: "Per outlet, across 9 different repeat cycles, from daily to once in two years",
  },
  {
    value: 9,
    label: "Repeat cycles tracked",
    note: "From a daily check to a licence that comes round once in two years",
  },
  {
    value: 2,
    label: "Languages, everywhere",
    hi: "भाषाएँ",
    note: "Every screen, every report and every training video, in Hindi and English",
  },
];

/* The 9 "Program Service covers" — the spine of the brochure. */
export type Service = {
  id: string;
  no: string;
  noDeva: string;
  icon: IconName;
  title: string;
  blurb: string;
  covers: string[];
  metric: string;
};

export const SERVICES: Service[] = [
  {
    id: "sdms",
    no: "01",
    noDeva: "०१",
    icon: "doc",
    title: "SDMS Compliance",
    blurb: "Every SDMS entry filed, updated and followed up so your dealership stays in good standing.",
    covers: ["Subsidy", "Work permit", "Safety & Swachhta", "Monthly wages", "Declaration", "DAR automation"],
    metric: "Nothing left unfiled",
  },
  {
    id: "mdg",
    no: "02",
    noDeva: "०२",
    icon: "gauge",
    title: "MDG Compliance",
    blurb: "Stock and density watched daily; variation caught before it becomes a notice.",
    covers: ["Stock variation monitoring", "DSR", "Density check", "Toilet upkeep", "Sample inspection"],
    metric: "Variation caught early",
  },
  {
    id: "inspection",
    no: "03",
    noDeva: "०३",
    icon: "clipboard",
    title: "Inspection Compliance",
    blurb: "Records, logs and samples kept inspection-ready year-round. Nothing missing when the team arrives.",
    covers: ["Dhruva", "MDT", "QRC", "AAC", "Mobile lab", "DO team"],
    metric: "Inspection-ready, always",
  },
  {
    id: "reminder",
    no: "04",
    noDeva: "०४",
    icon: "bell",
    title: "Document Reminders",
    blurb: "Every licence, renewal and filing window tracked. A clear reminder before anything expires.",
    covers: ["Licences", "Renewals", "Fire NOC", "Weights & measures", "Explosives"],
    metric: "22 deadline windows tracked",
  },
  {
    id: "automation",
    no: "05",
    noDeva: "०५",
    icon: "cpu",
    title: "Automation Support",
    blurb: "When automation goes down on a Sunday night, it is flagged straight away and tracked until it is back up.",
    covers: ["Fault diagnosis", "Vendor coordination", "Rule-abiding config", "Uptime watch"],
    metric: "Downtime flagged, not discovered",
  },
  {
    id: "webportal",
    no: "06",
    noDeva: "०६",
    icon: "globe",
    title: "Web Portal Support",
    blurb: "Complaints raised and chased on the right portal, whether nozzle, tank or pipeline. Drills and fillups logged.",
    covers: ["Complaint registering", "Nozzle / tank / pipeline", "Mock drill", "ATR fillups"],
    metric: "Tracked from raised to resolved",
  },
  {
    id: "xtra",
    no: "07",
    noDeva: "०७",
    icon: "gift",
    title: "XTRA Campaign Support",
    blurb: "XTRA Rewards enrolment and OMC promotional drives, with enrolment and campaign progress visible in one place.",
    covers: ["Customer enrolment", "Promotional activity", "Target chasing", "Campaign reporting"],
    metric: "Enrolment and progress in one place",
  },
  {
    id: "dod",
    no: "08",
    noDeva: "०८",
    icon: "fuel",
    title: "D.O.D & Stock Punctuality",
    blurb: "DOD facility managed, stock-on-hand watched, and the reminders that keep deliveries on time.",
    covers: ["DOD facility management", "Stock monitoring", "Delivery reminders", "Reconciliation"],
    metric: "Yesterday reconciled by morning",
  },
  {
    id: "preparepro",
    no: "09",
    noDeva: "०९",
    icon: "grad",
    title: "Prepare Pro Manager",
    blurb: "Industry expertise built into your team: leadership, management and the calls that run a pump well.",
    covers: ["Industry expertise", "Leadership development", "Team management", "Decision-making"],
    metric: "Built into the team",
  },
];

/* "More services?" — the speech-bubble cluster on page 2 */
export type Extra = { icon: IconName; title: string; note: string };
export const EXTRAS: Extra[] = [
  { icon: "card", title: "Digital Payment Reconciliation", note: "UPI, card & wallet receipts, reconciled daily" },
  { icon: "siren", title: "Quick Response for Safety", note: "Incident handling the moment it happens" },
  { icon: "wallet", title: "Account Support", note: "Statements and the small follow-ups, handled" },
  { icon: "lock", title: "Cyber Security", note: "Your dealership's data and logins, protected" },
];

/* "Why choose us?" — the four-tile block */
export type Pillar = { icon: IconName; title: string; body: string };
export const PILLARS: Pillar[] = [
  { icon: "bell", title: "Never miss a deadline", body: "Every renewal and filing window tracked and cleared on time." },
  { icon: "gauge", title: "Continuous monitoring", body: "Stock, density and portals watched daily, not once a quarter." },
  { icon: "shield", title: "All OMC portal headaches", body: "SDMS, Dhruva, AAC, QRC and the rest, absorbed entirely." },
  { icon: "phone", title: "A person, not a menu", body: "9am to 9pm, every day, in Hindi or English. The same team every time." },
];

/* "Our Mission & Values" — the seven-point list */
export const VALUES: string[] = [
  "Maximizing profitability",
  "Minimizing losses",
  "Regulatory compliance",
  "Dedicated support",
  "Smooth operations",
  "Regular updates & monitoring",
  "Never miss a deadline",
];

export const FOUR_E = ["Empower", "Enhance", "Enable", "Engage"];

/* The portals / tokens MDG absorbs — used in marquee + hero orbit */
export const TOKENS: string[] = [
  "SDMS", "MDG", "Dhruva", "MDT", "QRC", "AAC", "DSR", "DAR",
  "Mobile Lab", "DO Team", "ATR", "Mock Drill", "DOD", "XTRA Rewards",
  "Fire NOC", "Weights & Measures",
];

/* Onboarding process */
export type Step = { no: string; noDeva: string; when: string; title: string; body: string; icon: IconName };
export const STEPS: Step[] = [
  {
    no: "01", noDeva: "०१", when: "Day 1", icon: "phone",
    title: "One call, plain talk",
    body: "Tell us about your pump on a phone call, in Hindi or English. No forms, no jargon.",
  },
  {
    no: "02", noDeva: "०२", when: "Day 2 to 3", icon: "doc",
    title: "You pick what you need",
    body: "Switch on the modules that fit your dealership. You decide what's in. Pricing is locked in writing.",
  },
  {
    no: "03", noDeva: "०३", when: "Day 4 to 7", icon: "shield",
    title: "Live the same week",
    body: "Onboarding within seven days. Your outlet is live in the app and running the same week.",
  },
];

export const FAQS = [
  {
    q: "Which OMC dealerships do you work with?",
    a: "All three majors, IndianOil, BPCL and HPCL, plus cooperative-grade outlets. Single-pump dealerships and multi-outlet operators are both welcome.",
  },
  {
    q: "Do I have to change everything at once?",
    a: "No. Most dealers switch on one or two modules first, then add more once the cycle settles. It runs alongside your existing setup during onboarding.",
  },
  {
    q: "How fast can you start?",
    a: "Onboarding completes within seven days of pricing being locked. The first inspection and filing cycle usually clears within two weeks.",
  },
  {
    q: "What happens when something breaks at night?",
    a: "Our line stays open 9am to 9pm, seven days a week, including Sunday. Outside those hours it waits for the desk and is picked up first thing the next morning.",
  },
  {
    q: "How is pricing decided?",
    a: "Your subscription depends on the modules you switch on and the size of the outlet. It is locked in writing before you start and does not rise mid-contract.",
  },
  {
    q: "Do you sign an NDA?",
    a: "Yes, before we look at any of your documents. We can also work under your dealership's own confidentiality framework if you have one.",
  },
];

/* ── Dealer enrolment: Terms & Conditions (verbatim from the agreement) ── */
export const TERMS: string[] = [
  "The Dealer shall share the User ID and the Password to the Service Provider for carrying out services, as mutually agreed. The list of services as well as respective charges/rates for the services provided by the Service Provider to the Dealer is illustrated in Annexure – I. Any services outside the scope of Annexure-I shall be mutually negotiated between the Parties.",
  "Parties agree to maintain confidentiality of the data/information disclosed to each other. Party receiving such Confidential Information shall not disclose this information without the prior written consent of the Disclosing Party.",
  "Service Provider shall provide all the services to the Dealer virtually only (Online services). However, upon urgent request of the Dealer, onsite services shall be provided by the Service Provider subject to the availability of manpower as well as accessibility of the Dealer's Location. Cost for providing such services physically at the location of the Dealer shall be mutually negotiated between the Parties.",
  "It is acknowledged and confirmed by the Dealer that Service Provider is fully dependent on the Dealer in respect of the data/information/documents required for providing services to the Dealer. It is further acknowledged and confirmed by the Dealer that the Service Provider has no mechanism to check the authenticity/accuracy of such data/information/documents, and therefore Service Provider shall not be responsible for any deficiency in services on account of wrong/incorrect data/information/documents provided by the Dealer to the Service Provider.",
  "It is agreed between the Parties that since the services are being provided by the Service Provider virtually therefore in the event of any delay/deficiency of services on account of poor internet network, dealer's non-cooperation, non-availability of the spare parts, and other FORCE MAJEURE events including flood, Strike, Lock down, Earthquake, Government Holidays, riots etc, Service Provider shall not be liable for fine/penalty which might be imposed on the Dealer for non-compliance/delayed compliance/failure to comply with PESO/OMC/Government regulations/guidelines.",
  "It is acknowledged and confirmed by the Dealer that all the services being carried out by the Service Provider is, for and on behalf of the Dealer, and the Service Provider shall be acting as an independent Consultant, and therefore Service Provider shall not be responsible for any acts or failure of the Dealer to follow the PESO/OMC/Government regulations/guidelines.",
  "Dealer shall make all the payment to the Service Provider through Bank Transfer/UPI Transfer or in any manner as agreed between the Parties. Service Provider shall add applicable GST charges and raise invoice in the name of the Dealer. Payment shall be made within 10 days of receipt of the invoice. Any delay beyond this period shall entitle the Service Provider to charge interest @ 18% per annum.",
  "Dealer agrees to defend and indemnify the Service Provider against all suits, actions, penalties and liabilities that may arise from failure on the part of the Dealer to comply regulatory provisions/statutory guidelines as notified by OMC/PESO/Government Authorities from time to time.",
  "This agreement shall remain valid for a period of 1 year from the Signing Date, and may further be renewed for successive terms of 1 (One) year each unless terminated by Parties with prior 30 days written notice to the other Party. However, Service Provider shall be entitled to terminate this Agreement immediately in the event of non-receipt of the payment within the period/timeline stipulated in the invoice.",
  "Parties agree that all the disputes related to the services provided by the Service Provider under this agreement shall be the exclusive jurisdiction of Courts at Delhi.",
];

export const SITE_TYPES = ["Type A", "Type B"] as const;

/* Learning it, in Hindi. */
export const TRAINING = {
  eyebrow: "Learn it in Hindi",
  heading: "Ten videos, twenty-five minutes, and you know the whole thing",
  body: "Every screen in the app is explained in Hindi, on video, with the words on screen as well. Built for a phone on a weak connection: the smallest version of the whole library is 12 MB.",
  facts: [
    { k: "10", v: "videos" },
    { k: "25 min", v: "in total" },
    { k: "112", v: "chapters you can jump to" },
    { k: "12 MB", v: "for the whole library on 2G" },
  ],
  href: "https://guide.mdgservices.in",
} as const;
