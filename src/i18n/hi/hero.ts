import type { hero as EN } from "../en/hero";

/* The dark hero, in Hindi. "Dealer's कवच" stays inline in the component, so
   the eyebrow here has to read as the phrase that follows it, not as a
   sentence of its own. */
export const hero: typeof EN = {
  eyebrow: "पेट्रोल पंप डीलरों के लिए बना ऐप",

  /* Line 2 is the gold one, so the promise sits there: the paperwork is ours.
     English puts "handled" in that slot, Hindi puts "हमारे ज़िम्मे", which is
     what a dealer actually says when someone takes a job off his head. */
  headline: {
    line1: "काग़ज़ी काम,",
    line2: "हमारे ज़िम्मे।",
    line3: "पंप आप चलाइए।",
  },

  /* Three pieces of one sentence. The middle piece is picked out in white, so
     the emphasised words have been placed where Hindi word order puts them,
     mid-sentence, and no piece carries a space or a stop at its edge. */
  subLead: "SDMS, Dhruva, AAC, QRC, इंस्पेक्शन, दस्तावेज़ों की आख़िरी तारीख़ें। एक ऐप",
  subEmphasis: "हर OMC पोर्टल का झंझट",
  subTail: "समय पर निपटाता है, ताकि आपकी डीलरशिप कभी न अटके।",

  ctaPrimary: "बात कीजिए",
  callLabel: "या कॉल कीजिए",

  /* Latin digits on purpose: this is exactly how a dealer sees every figure
     on the portals and on his own meters. Only the labels change. */
  chips: [
    { value: "1,400+", label: "पंप" },
    { value: "14", label: "राज्य" },
    { value: "9", label: "पोर्टल" },
  ],
};
