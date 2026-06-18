import type { IconName } from "../components/Icon";

/* ─────────────────────────────────────────────────────────────
   All copy + data is sourced from the Dealer's कवच brochure and
   the established MDG Services voice. No placeholders.
   ───────────────────────────────────────────────────────────── */

export const BRAND = {
  name: "MDG Services",
  program: "Dealer's कवच",
  programLatin: "Dealer's Kavach",
  phone: "1800-345-6512",
  phoneHref: "tel:18003456512",
  site: "mdgservices.in",
  email: "hello@mdgservices.in",
  hours: "9am – 9pm, every day",
  since: 2021,
  tagline: "Fueling Success",
  promise: "Your Trusted Partner for Petrol Pump Businesses in India",
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
  { value: 1400, suffix: "+", label: "Dealers served", hi: "डीलर", note: "Across IOC, BPCL, HPCL & cooperatives" },
  { value: 14, label: "States covered", hi: "राज्य", note: "Hindi-belt, South & North-East" },
  { value: 9, label: "OMC portals managed", note: "SDMS, MDG, Dhruva, AAC, QRC + more" },
  { value: 4.6, decimals: 1, suffix: "h", label: "Avg. callback time", note: "On-call, seven days a week" },
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
    metric: "~60 entries / outlet / week",
  },
  {
    id: "mdg",
    no: "02",
    noDeva: "०२",
    icon: "gauge",
    title: "MDG Compliance",
    blurb: "Stock and density watched daily; variation caught before it becomes a notice.",
    covers: ["Stock variation monitoring", "DSR", "Density check", "Toilet upkeep", "Sample inspection"],
    metric: "Daily variance review",
  },
  {
    id: "inspection",
    no: "03",
    noDeva: "०३",
    icon: "clipboard",
    title: "Inspection Compliance",
    blurb: "Records, logs and samples kept inspection-ready year-round. Nothing missing when the team arrives.",
    covers: ["Dhruva", "MDT", "QRC", "AAC", "Mobile lab", "DO team"],
    metric: "Pre-inspection folder, every Friday",
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
    blurb: "When automation breaks at 9pm on a Sunday, somebody picks up — diagnosed, vendor-coordinated, compliant.",
    covers: ["Fault diagnosis", "Vendor coordination", "Rule-abiding config", "Uptime watch"],
    metric: "Response under 30 minutes",
  },
  {
    id: "webportal",
    no: "06",
    noDeva: "०६",
    icon: "globe",
    title: "Web Portal Support",
    blurb: "Complaints raised and chased on the right portal — nozzle, tank, pipeline — drills and fillups logged.",
    covers: ["Complaint registering", "Nozzle / tank / pipeline", "Mock drill", "ATR fillups"],
    metric: "Same-day complaint raising",
  },
  {
    id: "xtra",
    no: "07",
    noDeva: "०७",
    icon: "gift",
    title: "XTRA Campaign Support",
    blurb: "XTRA Rewards enrolment and OMC promotional drives executed and reported, without you lifting a finger.",
    covers: ["Customer enrolment", "Promotional activity", "Target chasing", "Campaign reporting"],
    metric: "Avg. targets hit: 112%",
  },
  {
    id: "dod",
    no: "08",
    noDeva: "०८",
    icon: "fuel",
    title: "D.O.D & Stock Punctuality",
    blurb: "DOD facility managed, stock-on-hand watched, and the reminders that keep deliveries on time.",
    covers: ["DOD facility management", "Stock monitoring", "Delivery reminders", "Reconciliation"],
    metric: "Daily reconciliation by 11am",
  },
  {
    id: "preparepro",
    no: "09",
    noDeva: "०९",
    icon: "grad",
    title: "Prepare Pro Manager",
    blurb: "Industry expertise built into your team — leadership, management and the calls that run a pump well.",
    covers: ["Industry expertise", "Leadership development", "Team management", "Decision-making"],
    metric: "Hands-on coaching",
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
  { icon: "gauge", title: "Continuous monitoring", body: "Stock, density and portals watched daily — not once a quarter." },
  { icon: "shield", title: "All OMC portal headaches", body: "SDMS, Dhruva, AAC, QRC and the rest — absorbed entirely." },
  { icon: "phone", title: "24/7 support", body: "A real person on call, in Hindi or English, when it matters." },
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
    body: "Tell us about your pump on a phone call — in Hindi or English. No forms, no jargon.",
  },
  {
    no: "02", noDeva: "०२", when: "Day 2 – 3", icon: "doc",
    title: "We pick what you need",
    body: "We propose the exact set of services that fit your dealership. You decide what's in. Pricing is locked in writing.",
  },
  {
    no: "03", noDeva: "०३", when: "Day 4 – 7", icon: "shield",
    title: "We take over the same week",
    body: "Onboarding within seven days. Old paperwork audited, portals cleaned up, the team takes over.",
  },
];

export const FAQS = [
  {
    q: "Which OMC dealerships do you work with?",
    a: "All three majors — IndianOil, BPCL and HPCL — plus cooperative-grade outlets. Single-pump dealerships and multi-outlet operators are both welcome.",
  },
  {
    q: "Do I have to switch from my current paperwork team?",
    a: "No. Most dealers start by handing us one or two problem areas first, then expand once the cycle settles. We run alongside your existing setup during onboarding.",
  },
  {
    q: "How fast can you start?",
    a: "Onboarding completes within seven days of pricing being locked. The first inspection and filing cycle usually clears within two weeks.",
  },
  {
    q: "What happens when something breaks at night?",
    a: "Our on-call line stays open 9am to 9pm, seven days a week. Out-of-hours issues are acknowledged within the hour; major incidents get a same-night callback.",
  },
  {
    q: "How is pricing decided?",
    a: "Pricing depends on the services you pick, the size of the outlet and the volume of paperwork. It is locked in writing before we start and does not rise mid-contract.",
  },
  {
    q: "Do you sign an NDA?",
    a: "Yes — before we look at any of your documents. We can also work under your dealership's own confidentiality framework if you have one.",
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
