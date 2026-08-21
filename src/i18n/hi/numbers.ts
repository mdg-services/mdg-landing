import type { numbers as EN } from "../en/numbers";

export const numbers: typeof EN = {
  ariaLabel: "आँकड़ों में",
  eyebrow: "आँकड़ों में",
  /* The English headline breaks after "Numbers you can". In Hindi the natural
     break falls after the noun phrase, so line 1 ends at "सबूत". */
  headingLine1: "आँकड़े, जिनका सबूत",
  headingLine2: "आप हमसे माँग सकते हैं।",
  stats: {
    /* `hi` stays undefined on this page: the small Devanagari gloss exists to
       help a Hindi reader who is on the English page, and here the label is
       already that word. */
    matched: {
      label: "आँकड़े, जो डीलर की अपनी किताब से मिले",
      hi: undefined,
      note: "557 में से, जिन्हें हमने डीलरों के अपने रिकॉर्ड से मिलाया। जो अलग निकलता है, वह भी हम आपको दिखा देते हैं।",
    },
    items: {
      label: "काम, जिन पर घड़ी चल रही है",
      hi: undefined,
      note: "हर आउटलेट पर, 9 अलग-अलग चक्रों में, रोज़ वाले से लेकर दो साल में एक बार वाले तक",
    },
    cycles: {
      label: "चक्र, जिन पर नज़र रहती है",
      hi: undefined,
      note: "रोज़ की एक जाँच से लेकर उस लाइसेंस तक, जो दो साल में एक बार आता है",
    },
    languages: {
      label: "भाषाएँ, हर जगह",
      hi: undefined,
      note: "हर स्क्रीन, हर रिपोर्ट और हर ट्रेनिंग वीडियो, हिंदी और अंग्रेज़ी दोनों में",
    },
  },
};
