import type { IconName } from "../components/Icon";

/* ─────────────────────────────────────────────────────────────
   The things about mdgservices.in that do not change when the
   language does.

   Identifiers, icons, link targets, portal names and the numbers
   behind the counters. Every string a dealer actually reads lives
   in `src/i18n/en` and `src/i18n/hi`, keyed by the ids below.

   Copy and data are sourced from the Dealer's कवच brochure and
   the established MDG Services voice. No placeholders.
   ───────────────────────────────────────────────────────────── */

export const BRAND = {
  name: "MDG Services",
  legalName: "VRUOOM PRIVATE LIMITED",
  cin: "U29194HR2021PTC098450",
  program: "Dealer's कवच",
  programLatin: "Dealer's Kavach",
  /* There is deliberately no phone number here. The site offers the call
     itself — see `components/CallUs.tsx` — and a number left in this object
     is a number that creeps back onto the page. If one is ever needed again,
     it belongs behind that component, not beside it. */
  site: "mdgservices.in",
  email: "hello@mdgservices.in",
  since: 2021,
  /** A brand line, not a sentence: it stays in English in both languages. */
  tagline: "Fueling Success",
};

/** Section anchors. The labels are per-language; the targets are not. */
export const NAV = [
  { id: "services", href: "#services" },
  { id: "why", href: "#why" },
  { id: "process", href: "#process" },
  { id: "membership", href: "#membership" },
] as const;

export type NavId = (typeof NAV)[number]["id"];

/* ── The counters. The figures are the same in either language. ── */
export type Stat = {
  id: string;
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
};

export const STATS = [
  { id: "matched", value: 536 },
  { id: "items", value: 45 },
  { id: "cycles", value: 9 },
  { id: "languages", value: 2 },
] as const satisfies readonly Stat[];

export type StatId = (typeof STATS)[number]["id"];

/* The 9 "Program Service covers" — the spine of the brochure. */
export type Service = {
  id: string;
  no: string;
  noDeva: string;
  icon: IconName;
};

export const SERVICES = [
  { id: "sdms", no: "01", noDeva: "०१", icon: "doc" },
  { id: "mdg", no: "02", noDeva: "०२", icon: "gauge" },
  { id: "inspection", no: "03", noDeva: "०३", icon: "clipboard" },
  { id: "reminder", no: "04", noDeva: "०४", icon: "bell" },
  { id: "automation", no: "05", noDeva: "०५", icon: "cpu" },
  { id: "webportal", no: "06", noDeva: "०६", icon: "globe" },
  { id: "xtra", no: "07", noDeva: "०७", icon: "gift" },
  { id: "dod", no: "08", noDeva: "०८", icon: "fuel" },
  { id: "preparepro", no: "09", noDeva: "०९", icon: "grad" },
] as const satisfies readonly Service[];

export type ServiceId = (typeof SERVICES)[number]["id"];

/* "More services?" — the speech-bubble cluster on page 2 */
export const EXTRAS = [
  { id: "payments", icon: "card" },
  { id: "safety", icon: "siren" },
  { id: "accounts", icon: "wallet" },
  { id: "cyber", icon: "lock" },
] as const satisfies readonly { id: string; icon: IconName }[];

export type ExtraId = (typeof EXTRAS)[number]["id"];

/* "Why choose us?" — the four-tile block */
export const PILLARS = [
  { id: "deadline", icon: "bell" },
  { id: "monitoring", icon: "gauge" },
  { id: "portals", icon: "shield" },
  { id: "person", icon: "phone" },
] as const satisfies readonly { id: string; icon: IconName }[];

export type PillarId = (typeof PILLARS)[number]["id"];

/* The portals / tokens MDG absorbs — used in marquee + hero orbit.
   Names of other people's systems: identical in both languages. */
export const TOKENS: string[] = [
  "SDMS", "MDG", "Dhruva", "MDT", "QRC", "AAC", "DSR", "DAR",
  "Mobile Lab", "DO Team", "ATR", "Mock Drill", "DOD", "XTRA Rewards",
  "Fire NOC", "Weights & Measures",
];

/** The portals that flow into the shield in the hero diagram. */
export const ORBIT: string[] = ["SDMS", "Dhruva", "QRC", "AAC", "MDT", "DSR", "DAR", "Fire NOC"];

/* Onboarding process */
export const STEPS = [
  { id: "call", no: "01", noDeva: "०१", icon: "phone" },
  { id: "pick", no: "02", noDeva: "०२", icon: "doc" },
  { id: "live", no: "03", noDeva: "०३", icon: "shield" },
] as const satisfies readonly { id: string; no: string; noDeva: string; icon: IconName }[];

export type StepId = (typeof STEPS)[number]["id"];

/** The training library lives on its own site. */
export const TRAINING_HREF = "https://guide.mdgservices.in";

/**
 * Site type. The value is what the enrolment API is sent and what the
 * signed agreement calls it, so it never changes with the language; only
 * the label a dealer reads does.
 */
export const SITE_TYPES = ["Type A", "Type B"] as const;

export type SiteType = (typeof SITE_TYPES)[number];
