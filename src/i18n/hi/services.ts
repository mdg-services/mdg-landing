import type { services as EN } from "../en/services";

export const services: typeof EN = {
  eyebrow: "ऐप के अंदर",

  /* The English line breaks after "keeps"; Hindi has to break where the verb
     lets it, so the navy tail carries "आपके लिए संभालता है।". The trailing
     space on the lead is the only gap between the two halves. */
  headingLead: "नौ काम, जो अब ऐप ",
  headingAccent: "आपके लिए संभालता है।",

  intro: "जो आपके पंप को चाहिए, उतना चालू कीजिए। बाक़ी बंद रहने दीजिए।",

  labelDeva: "सेवाएँ",
  /* The Latin gloss says the same thing twice on this page, so it goes. The
     key still has to exist, with `undefined` and not "", or the parity check
     reports a hole. */
  labelLatin: undefined,

  items: {
    sdms: {
      title: "SDMS का सारा काम",
      blurb: "SDMS की हर एंट्री भरी जाती है, अपडेट होती है और उसका फ़ॉलो-अप भी होता है, ताकि आपकी डीलरशिप का रिकॉर्ड साफ़ रहे।",
      covers: ["सब्सिडी", "वर्क परमिट", "Safety & Swachhta", "महीने की मज़दूरी", "डिक्लेरेशन", "DAR ऑटोमेशन"],
      metric: "कोई फ़ाइलिंग बाक़ी नहीं",
    },
    mdg: {
      title: "MDG की रोज़ाना जाँच",
      blurb: "स्टॉक और डेंसिटी पर हर दिन नज़र। गड़बड़ी नोटिस बनने से पहले ही पकड़ में आ जाती है।",
      covers: ["स्टॉक वेरिएशन पर नज़र", "DSR", "डेंसिटी जाँच", "टॉयलेट की सफ़ाई", "सैंपल इंस्पेक्शन"],
      metric: "गड़बड़ी वक़्त रहते पकड़ में",
    },
    inspection: {
      title: "इंस्पेक्शन की तैयारी",
      blurb: "रिकॉर्ड, लॉग और सैंपल पूरे साल तैयार रहते हैं। टीम आए तो कुछ कम न पड़े।",
      covers: ["Dhruva", "MDT", "QRC", "AAC", "Mobile lab", "DO team"],
      metric: "हमेशा इंस्पेक्शन के लिए तैयार",
    },
    reminder: {
      title: "काग़ज़ों के रिमाइंडर",
      blurb: "हर लाइसेंस, रिन्युअल और फ़ाइलिंग की तारीख़ पर नज़र। कुछ भी ख़त्म होने से पहले साफ़ रिमाइंडर मिलता है।",
      covers: ["लाइसेंस", "रिन्युअल", "Fire NOC", "Weights & measures", "विस्फोटक लाइसेंस"],
      /* The 22 lives inside the string, so it travels with the translation. */
      metric: "22 तारीख़ों पर लगातार नज़र",
    },
    automation: {
      title: "ऑटोमेशन सपोर्ट",
      blurb: "इतवार की रात ऑटोमेशन बैठ जाए, तो उसी वक़्त पता चल जाता है और दोबारा चलने तक पीछा किया जाता है।",
      covers: ["ख़राबी की पहचान", "वेंडर से बात", "नियम के मुताबिक़ सेटिंग", "चालू रहने पर नज़र"],
      metric: "ख़राबी ख़ुद ढूँढनी नहीं पड़ती",
    },
    webportal: {
      title: "वेब पोर्टल सपोर्ट",
      blurb: "नोज़ल हो, टैंक हो या पाइपलाइन, शिकायत सही पोर्टल पर दर्ज होती है और हल होने तक उसका पीछा किया जाता है। Mock Drill और fillup भी दर्ज होते हैं।",
      covers: ["शिकायत दर्ज करना", "नोज़ल / टैंक / पाइपलाइन", "Mock drill", "ATR fillups"],
      metric: "दर्ज से हल होने तक नज़र",
    },
    xtra: {
      title: "XTRA कैंपेन सपोर्ट",
      blurb: "XTRA Rewards का एनरोलमेंट और OMC के प्रमोशन, दोनों का काम। कितने ग्राहक जुड़े और कैंपेन कहाँ तक पहुँचा, सब एक ही जगह दिखता है।",
      covers: ["ग्राहक एनरोलमेंट", "प्रमोशन के काम", "टारगेट का पीछा", "कैंपेन रिपोर्ट"],
      metric: "एनरोलमेंट और प्रोग्रेस एक ही जगह",
    },
    dod: {
      title: "DOD और समय पर स्टॉक",
      blurb: "DOD की सुविधा हम संभालते हैं, बचे हुए स्टॉक पर नज़र रखते हैं, और डिलीवरी समय पर आए इसके लिए याद भी दिलाते हैं।",
      covers: ["DOD सुविधा संभालना", "स्टॉक पर नज़र", "डिलीवरी रिमाइंडर", "हिसाब का मिलान"],
      metric: "कल का हिसाब सुबह तक तैयार",
    },
    preparepro: {
      /* The module's own name, so it stays Latin the way a dealer sees it in
         the app. */
      title: "Prepare Pro Manager",
      blurb: "इस लाइन का तजुर्बा आपकी टीम के अंदर आ जाता है, लीडरशिप, मैनेजमेंट और वे फ़ैसले जिनसे पंप अच्छा चलता है।",
      covers: ["लाइन का तजुर्बा", "लीडरशिप की तैयारी", "टीम मैनेजमेंट", "फ़ैसले लेना"],
      metric: "टीम ख़ुद तैयार हो जाती है",
    },
  },
};
