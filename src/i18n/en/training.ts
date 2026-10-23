/** The video library band (the explainers at /videos), and the four figures beside it. */
export const training = {
  sectionAria: "Training",
  /* Not rendered today: the section carries no eyebrow on purpose. Kept so
     the copy exists in both languages if the design ever asks for one. */
  eyebrow: "Learn it in Hindi",
  heading: "Twenty-six short videos, twenty minutes, and the rules make sense",
  body: "The three-day deposit clock, stock variation, decanting a tanker, the density on the invoice: each in about a minute, in Hindi and in English, with the words on screen as well. Built for a phone on a weak connection: the smallest version of the whole library is 9 MB in each language.",
  cta: "Watch the videos",
  /* `figure` is the big gold number, `label` the line under it. Both are
     translatable: the unit travels with the figure ("20 min", "9 MB"). The
     minutes are per language, because the English cuts run shorter than the
     Hindi ones (20.2 against 22.3); scripts/videos.check.ts holds both. */
  facts: [
    { figure: "26", label: "videos" },
    { figure: "20 min", label: "in total" },
    { figure: "241", label: "chapters you can jump to" },
    { figure: "9 MB", label: "for a whole language, even on 2G" },
  ],
};
