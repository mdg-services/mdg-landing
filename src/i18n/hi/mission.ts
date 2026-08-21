import type { mission as EN } from "../en/mission";

export const mission: typeof EN = {
  sectionAria: "हमारा मक़सद और उसूल",
  eyebrow: "हमारा मक़सद और उसूल",
  /** Split so the second half can carry the gold accent colour. */
  headingLead: "मुनाफ़ा ज़्यादा। नुक़सान कम।",
  headingAccent: "तारीख़ कभी न चूके।",
  /**
   * Hindi needs a space between the year and the word that follows it, and the
   * JSX puts a space only BEFORE the year. So this half starts with a literal
   * leading space. Remove it and the line reads "2021से".
   */
  bodyBeforeYear: "MDG Services साल",
  bodyAfterYear:
    " से भारत के पेट्रोल पंप कारोबार के लिए सॉफ़्टवेयर बना रही है। Dealer’s कवच इसीलिए बना है कि पंप मालिक को अपनी हर ज़िम्मेदारी एक ही जगह दिखे, और हर काम समय पर पूरा हो जाए। भरोसा, साफ़ हिसाब और एक-दूसरे की तरक़्क़ी, यही इसकी बुनियाद है।",
  /**
   * The four E's stay in English on the Hindi page too. The device is the
   * alliteration, and four Hindi words that no longer start with the same
   * letter would not be the same device.
   */
  fourE: ["Empower", "Enhance", "Enable", "Engage"],
  /** The seven values, drawn as a node spine. Order is the order on screen. */
  values: [
    "मुनाफ़ा बढ़ाना",
    "नुक़सान घटाना",
    "नियम-क़ायदों का पालन",
    "हमेशा मौजूद सपोर्ट",
    "बिना रुकावट कामकाज",
    "लगातार अपडेट और निगरानी",
    "कोई तारीख़ न चूके",
  ],
  /** The curly quotation marks belong to the string, in both languages. */
  quote: "“हर ज़िम्मेदारी एक ही जगह दिखे, और समय पर पूरी हो जाए।”",
};
