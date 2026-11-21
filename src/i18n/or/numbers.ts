import type { numbers as EN } from "../en/numbers";

export const numbers: typeof EN = {
  ariaLabel: "ସଂଖ୍ୟାରେ",
  eyebrow: "ସଂଖ୍ୟାରେ",
  headingLine1: "ଯେଉଁ ସଂଖ୍ୟାର ପ୍ରମାଣ",
  headingLine2: "ଆପଣ ଆମଠାରୁ ମାଗିପାରିବେ।",
  stats: {
    /* `hi` stays undefined here, as on the Hindi page: the small Devanagari
       gloss is only for a Hindi reader on the English page. */
    matched: {
      label: "ଯେଉଁ ସଂଖ୍ୟା ଡିଲରଙ୍କ ନିଜ ବହିରେ ମିଳିଲା",
      hi: undefined,
      note: "557 ମଧ୍ୟରୁ, ଯାହାକୁ ଆମେ ଡିଲରଙ୍କ ନିଜ ରେକର୍ଡ ସହ ମିଳାଇଲୁ। ଯାହା ଭିନ୍ନ ବାହାରେ, ତାହା ମଧ୍ୟ ଆମେ ଆପଣଙ୍କୁ ଦେଖାଇ ଦେଉ।",
    },
    items: {
      label: "ଯେଉଁ କାମ ଉପରେ ଘଡ଼ି ଚାଲିଛି",
      hi: undefined,
      note: "ପ୍ରତ୍ୟେକ ଆଉଟଲେଟରେ, 9ଟି ଭିନ୍ନ ଚକ୍ରରେ, ଦୈନିକ ଯାଞ୍ଚରୁ ଦୁଇ ବର୍ଷରେ ଥରେ ହେଉଥିବା କାମ ପର୍ଯ୍ୟନ୍ତ",
    },
    cycles: {
      label: "ଯେଉଁ ଚକ୍ର ଉପରେ ନଜର ରହେ",
      hi: undefined,
      note: "ଦୈନିକ ଗୋଟିଏ ଯାଞ୍ଚରୁ ସେହି ଲାଇସେନ୍ସ ପର୍ଯ୍ୟନ୍ତ, ଯାହା ଦୁଇ ବର୍ଷରେ ଥରେ ଆସେ",
    },
    languages: {
      label: "ଭାଷା, ସବୁଠାରେ",
      hi: undefined,
      note: "ପ୍ରତ୍ୟେକ ସ୍କ୍ରିନ, ପ୍ରତ୍ୟେକ ରିପୋର୍ଟ ଓ ପ୍ରତ୍ୟେକ ଟ୍ରେନିଂ ଭିଡିଓ, ହିନ୍ଦୀ ଓ ଇଂରାଜୀ ଦୁଇଟିରେ",
    },
  },
};
