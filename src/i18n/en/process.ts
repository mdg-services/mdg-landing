import type { StepId } from "../../data/content";

export const process = {
  eyebrow: "How it works",
  /** The headline carries a navy tail, so it is split to let the accent
      land on a different part of the sentence in Hindi. */
  headingLead: "From first call to first clean cycle,",
  headingAccent: "under two weeks.",
  intro:
    "Three steps, no jargon. You stay in control of what's in and what's out, and the price is locked in writing before we begin.",
  /** Keyed by StepId, so a step never depends on the order of STEPS.
      `when` is the day range above the title; the numeral beside it comes
      from content.ts and is the same in both languages. */
  steps: {
    call: {
      when: "Day 1",
      title: "One call, plain talk",
      body: "Tell us about your pump on a phone call, in Hindi or English. No forms, no jargon.",
    },
    pick: {
      when: "Day 2 to 3",
      title: "You pick what you need",
      body: "Switch on the modules that fit your dealership. You decide what's in. Pricing is locked in writing.",
    },
    live: {
      when: "Day 4 to 7",
      title: "Live the same week",
      body: "Onboarding within seven days. Your outlet is live in the app and running the same week.",
    },
  } satisfies Record<StepId, { when: string; title: string; body: string }>,
};
