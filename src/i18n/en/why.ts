import type { PillarId } from "../../data/content";

export const why = {
  eyebrow: "Why choose us",
  /** The headline carries a navy tail, so it is split to let the accent
      land on a different part of the sentence in Hindi. */
  headingLead: "Why dealers hand us",
  headingAccent: "the keys to the paperwork.",
  intro:
    "One product, one subscription, no run-around. Just the four things every dealer actually wants from a compliance app.",
  /** Keyed by PillarId, so a tile never depends on the order of PILLARS. */
  pillars: {
    deadline: {
      title: "Never miss a deadline",
      body: "Every renewal and filing window tracked and cleared on time.",
    },
    monitoring: {
      title: "Continuous monitoring",
      body: "Stock, density and portals watched daily, not once a quarter.",
    },
    portals: {
      title: "All OMC portal headaches",
      body: "SDMS, Dhruva, AAC, QRC and the rest, absorbed entirely.",
    },
    person: {
      title: "A person, not a menu",
      body: "9am to 9pm, every day, in Hindi or English. The same team every time.",
    },
  } satisfies Record<PillarId, { title: string; body: string }>,
};
