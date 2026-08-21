import type { StatId } from "../../data/content";

/** The words beside one counter. */
type StatCopy = {
  label: string;
  /**
   * A small Devanagari gloss printed next to an English label. It exists to
   * put a familiar word in front of a Hindi-first reader who is on the
   * English page, so the Hindi page sets it to `undefined` throughout.
   */
  hi?: string;
  note: string;
};

/* Keyed by the id in content.ts rather than by position, so re-ordering the
   counters can never silently re-label one. */
const stats: Record<StatId, StatCopy> = {
  matched: {
    label: "Figures matched the dealer's own book",
    hi: "आँकड़े",
    note: "Of 557 we checked against dealers' own records. We show you any that differ.",
  },
  items: {
    label: "Compliance items on the clock",
    hi: "काम",
    note: "Per outlet, across 9 different repeat cycles, from daily to once in two years",
  },
  cycles: {
    label: "Repeat cycles tracked",
    /* This counter has never carried a gloss. The key is spelled out anyway
       so both languages hold the same set of keys. */
    hi: undefined,
    note: "From a daily check to a licence that comes round once in two years",
  },
  languages: {
    label: "Languages, everywhere",
    hi: "भाषाएँ",
    note: "Every screen, every report and every training video, in Hindi and English",
  },
};

export const numbers = {
  /** The accessible name of the section, not printed on the page. */
  ariaLabel: "By the numbers",
  eyebrow: "By the numbers",
  /* The headline breaks on a <br />, so each line is its own key and the
     break can fall somewhere else in another language. */
  headingLine1: "Numbers you can",
  headingLine2: "ask us to prove.",
  stats,
};
