import { cards, facts, p } from "../doc";
import type { contactUs as EN } from "../en/contactUs";

/* /hi/contact. फ़ोन नंबर, घंटे और ईमेल वही हैं जो होम पेज पर हैं। */
export const contactUs: typeof EN = {
  pageTitle: "संपर्क कीजिए · MDG Services",
  metaDescription:
    "टोल-फ़्री कॉल कीजिए, हमें लिखिए, या अपना नंबर छोड़ दीजिए, हम कॉल कर लेंगे। MDG Services, गुरुग्राम की कंपनी VRUOOM PRIVATE LIMITED का ब्रांड है।",
  eyebrow: "संपर्क कीजिए",
  eyebrowDeva: undefined,
  heading: "किसी इंसान से बात कीजिए।",
  intro:
    "हमें कॉल कीजिए, लिखिए, या अपना नंबर छोड़ दीजिए, हम कॉल कर लेंगे। फ़ोन एक असली इंसान उठाता है, हिंदी या अंग्रेज़ी में।",
  updated: "23 अक्टूबर 2026",
  legal: false,
  sections: [
    {
      id: "ways",
      heading: "हम तक पहुँचने के तरीक़े",
      blocks: [
        cards([
          {
            kicker: "कॉल, टोल-फ़्री",
            title: "{tollFree}",
            body: "{hours}। कॉल मुफ़्त है।",
            link: { label: "अभी कॉल कीजिए", href: "{tollFreeHref}" },
          },
          {
            kicker: "हमें लिखिए",
            title: "{email}",
            body: "सवाल, बिल और भुगतान के लिए, और जो बात आप लिखित में रखना चाहें। भुगतान के बारे में लिखें तो रसीद का रेफ़रेंस साथ भेजिए।",
            link: { label: "ईमेल भेजिए", href: "mailto:{email}" },
          },
          {
            kicker: "कॉलबैक चाहिए?",
            title: "अपना नंबर छोड़िए",
            body: "अपना नाम और मोबाइल नंबर दीजिए। एक घंटे के भीतर हमारी टीम कॉल कर लेती है, {hours}।",
            link: { label: "कॉलबैक माँगिए", href: "home:contact" },
          },
        ]),
      ],
    },
    {
      id: "office",
      heading: "रजिस्टर्ड ऑफ़िस",
      blocks: [
        facts([
          ["कंपनी", "{legalName}"],
          ["CIN", "{cin}"],
          ["ब्रांड", "MDG Services, {site} पर"],
          ["पता", "{office}"],
          ["फ़ोन", "[{tollFree}]({tollFreeHref}), टोल-फ़्री"],
          ["समय", "{hours}"],
          ["ईमेल", "[{email}](mailto:{email})"],
        ]),
        p("हमारी सेवा ऑनलाइन और फ़ोन पर मिलती है। समय के बाद जो भी आता है, उसे अगली सुबह सबसे पहले देखा जाता है।"),
      ],
    },
    {
      id: "grievance",
      heading: "कुछ गड़बड़ हुई?",
      blocks: [
        p(
          "हमारी सेवा, ऐप, बिल, स्टाफ़ या आपकी जानकारी के इस्तेमाल से आप ख़ुश नहीं हैं, तो [शिकायत पेज](route:/grievance) पर बताइए। आपको उसी समय शिकायत नंबर मिल जाता है, और हमारी टीम का कोई व्यक्ति उसे देखकर जवाब देता है।",
        ),
      ],
    },
  ],
};
