import type { training as EN } from "../en/training";

export const training: typeof EN = {
  sectionAria: "ट्रेनिंग",
  eyebrow: "हिंदी में सीखिए",
  /* The numbers are spelled out here, not written as 10 and 25, because the
     four gold figures sit right beside this headline and already say them. */
  heading: "छब्बीस छोटे वीडियो, बाईस मिनट, और नियम साफ़ समझ में आ गए।",
  body: "तीन दिन की गिनती, स्टॉक वेरिएशन, टैंकर उतारना, इनवॉइस की डेंसिटी: हर बात लगभग एक मिनट में, हिंदी और अंग्रेज़ी दोनों में, और जो बोला जा रहा है वह स्क्रीन पर लिखा भी आता है। कमज़ोर नेटवर्क वाले फ़ोन के लिए बनाया गया है, पूरी लाइब्रेरी का सबसे हल्का वर्ज़न हर भाषा में सिर्फ़ 9 MB का है।",
  /* The reader is already in Hindi, so "Watch in Hindi" would state the
     obvious. The button just says: watch the videos. */
  cta: "वीडियो देखिए",
  facts: [
    { figure: "26", label: "वीडियो" },
    { figure: "22 मिनट", label: "कुल मिलाकर" },
    { figure: "241", label: "चैप्टर, जहाँ चाहें सीधे जाइए" },
    { figure: "9 MB", label: "एक भाषा की पूरी लाइब्रेरी, 2G पर भी" },
  ],
};
