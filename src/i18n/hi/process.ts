import type { process as EN } from "../en/process";

export const process: typeof EN = {
  eyebrow: "कैसे काम करता है",
  /** The danda sits on the accent, because the accent closes the sentence.
      The two keys are joined by a literal space in the JSX, so neither
      carries one of its own. */
  headingLead: "पहली कॉल से पहली फ़ाइलिंग साइकिल तक,",
  headingAccent: "दो हफ़्ते से भी कम।",
  intro:
    "तीन क़दम, सब कुछ सीधी भाषा में। क्या शामिल होगा और क्या नहीं, यह आपके हाथ में रहता है, और क़ीमत शुरू करने से पहले ही लिखित में तय हो जाती है।",
  steps: {
    call: {
      /* `when` sits in a mono, letter-spaced 11px label, so it stays short
         and keeps Latin digits, the way a dealer reads every other figure. */
      when: "दिन 1",
      title: "एक कॉल, सीधी बात",
      body: "फ़ोन पर अपने पंप के बारे में बता दीजिए, हिंदी में या अंग्रेज़ी में। न कोई फ़ॉर्म, न भारी-भरकम शब्द।",
    },
    pick: {
      when: "दिन 2 से 3",
      title: "जो चाहिए, वही चुनिए",
      body: "जो मॉड्यूल आपकी डीलरशिप पर फ़िट बैठें, बस वही चालू कीजिए। क्या शामिल होगा, यह आप तय करते हैं। क़ीमत लिखित में तय होती है।",
    },
    live: {
      when: "दिन 4 से 7",
      title: "उसी हफ़्ते चालू",
      body: "सात दिन के भीतर ऑनबोर्डिंग पूरी। आपका आउटलेट ऐप में चालू हो जाता है और उसी हफ़्ते चलने लगता है।",
    },
  },
};
