/* The dark hero: the first thing a dealer reads.

   "Dealer's कवच" itself is not here. It is the product's name, it reads the
   same in both languages, and the component keeps it inline so the कवच mark
   never loses its Devanagari span. Only the line describing it is translated. */
export const hero = {
  eyebrow: "The app for petrol pump dealers",

  /* Three lines that rise one after another. Line 2 is gold and line 3 is
     muted, so where the sentence breaks is a decision each language makes
     for itself rather than one English imposes. */
  headline: {
    line1: "Paperwork,",
    line2: "handled.",
    line3: "You run the pump.",
  },

  /* One sentence in three pieces, because its middle is picked out in white
     inside the paragraph. Splitting it lets the emphasis land wherever the
     language puts that idea, instead of at an English word position. */
  subLead: "SDMS, Dhruva, AAC, QRC, inspections, document deadlines. One app keeps",
  subEmphasis: "every OMC portal headache",
  subTail: "on track, so your dealership is never caught short.",

  ctaPrimary: "Talk to us",
  /** Sits just before the phone number, which is the same in either language. */
  callLabel: "or call",

  /* The three figures on the hairline under the buttons. The figure is part
     of the chip, so a language may render its own digits if it wants to. */
  chips: [
    { value: "1,400+", label: "pumps" },
    { value: "14", label: "states" },
    { value: "9", label: "portals" },
  ],
};
