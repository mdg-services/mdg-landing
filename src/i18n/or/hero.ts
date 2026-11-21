import type { hero as EN } from "../en/hero";

/* The dark hero, in Odia. "Dealer's କବଚ" stays inline in the component, so
   the eyebrow here reads as the phrase that follows it, not as a sentence of
   its own. Same piece structure as the Hindi file. */
export const hero: typeof EN = {
  eyebrow: "ପେଟ୍ରୋଲ ପମ୍ପ ଡିଲରଙ୍କ ପାଇଁ ତିଆରି ଆପ",

  headline: {
    line1: "କାଗଜପତ୍ର କାମ,",
    line2: "ଆମ ଦାୟିତ୍ୱରେ।",
    line3: "ପମ୍ପ ଆପଣ ଚଳାନ୍ତୁ।",
  },

  /* Three pieces of one sentence; the middle one is picked out in white. No
     piece carries a space or a stop at its edge. */
  subLead: "SDMS, Dhruva, AAC, QRC, ଇନ୍ସପେକ୍ସନ, କାଗଜପତ୍ରର ଶେଷ ତାରିଖ। ଗୋଟିଏ ଆପ",
  subEmphasis: "ପ୍ରତ୍ୟେକ OMC ପୋର୍ଟାଲର ଝଞ୍ଜଟ",
  subTail: "ଠିକ ସମୟରେ ସମ୍ଭାଳି ଦିଏ, ଯେପରି ଆପଣଙ୍କ ଡିଲରସିପ କେବେ ଅଟକିବ ନାହିଁ।",

  ctaPrimary: "କଥା ହୁଅନ୍ତୁ",
  filmLink: "ଫିଲ୍ମ ଦେଖନ୍ତୁ · 40 ସେକେଣ୍ଡ",
  alsoLabel: "MDG Services ର ଆଉ ଗୋଟିଏ ଆପ:",
  alsoLink: "ଖାତା କବଚ, କଞ୍ଚା ଚିଟ୍ ବିନା ଧାର ଡିଜେଲ",
  callLabel: "କିମ୍ବା",

  chips: [
    { value: "1,400+", label: "ପମ୍ପ" },
    { value: "14", label: "ରାଜ୍ୟ" },
    { value: "9", label: "ପୋର୍ଟାଲ" },
  ],
};
