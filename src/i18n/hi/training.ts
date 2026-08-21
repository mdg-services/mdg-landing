import type { training as EN } from "../en/training";

export const training: typeof EN = {
  sectionAria: "ट्रेनिंग",
  eyebrow: "हिंदी में सीखिए",
  /* The numbers are spelled out here, not written as 10 and 25, because the
     four gold figures sit right beside this headline and already say them. */
  heading: "दस वीडियो, पच्चीस मिनट, और पूरी बात समझ में आ गई।",
  body: "ऐप की हर स्क्रीन वीडियो पर हिंदी में समझाई गई है, और जो बोला जा रहा है वह नीचे लिखा भी आता है। कमज़ोर नेटवर्क वाले फ़ोन के लिए बनाया गया है, पूरी लाइब्रेरी का सबसे हल्का वर्ज़न सिर्फ़ 12 MB का है।",
  /* The reader is already in Hindi, so "Watch in Hindi" would state the
     obvious. The button just says: watch the videos. */
  cta: "वीडियो देखिए",
  facts: [
    { figure: "10", label: "वीडियो" },
    { figure: "25 मिनट", label: "कुल मिलाकर" },
    { figure: "112", label: "चैप्टर, जहाँ चाहें सीधे जाइए" },
    { figure: "12 MB", label: "पूरी लाइब्रेरी, 2G पर भी" },
  ],
};
