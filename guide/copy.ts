/**
 * Every fixed word on a guide page, in both languages: the chrome around the
 * content, the notices and the closing line about Dealer Kavach.
 *
 * Public-copy rule: say what a dealer gets, never how the work is done.
 */
import type { Lang } from "./inventory.js";

export const SITE = "https://mdgservices.in";
export const COMPANY = "VRUOOM PRIVATE LIMITED";
export const CIN = "U29194HR2021PTC098450";
/** Same number as src/lib/tollFree.ts; the guide is built outside the app, so it is not imported. */
export const TOLL_FREE = { display: "1800‑891‑3496", href: "tel:18008913496" };

/** The official copies we point to. We never host the PDF ourselves. */
export const OFFICIAL = {
  iocl: "https://iocl.com/uploads/Marketing_Discipline_Guideline_2024_24_10_2024.pdf",
  bpcl: "https://www.bharatpetroleum.in/images/files/MDG-2024-Effective-24-10-2024.pdf",
};

export const UI: Record<Lang, Record<string, string>> = {
  en: {
    locale: "en_IN",
    brand: "MDG Services",
    guide: "MDG 2024 guide",
    home: "Home",
    register: "Register your pump",
    call: `Call ${TOLL_FREE.display}`,
    other: "हिंदी में पढ़ें",
    shortAnswer: "Short answer",
    inSection: "In this section",
    related: "Related pages",
    faq: "Questions dealers ask",
    watch: "Watch the one-minute explainer",
    video: "Video",
    topics: "Topics in this guide",
    tools: "Tools",
    pages: "pages",
    page: "page",
    checked: "Checked against MDG 2024 (effective 24.10.2024) and the oil company circulars on our updates page, on",
    officialTitle: "Read the official text",
    officialIocl: "MDG 2024 on IndianOil's website",
    officialBpcl: "MDG 2024 on Bharat Petroleum's website",
    ctaTitle: "Dealer Kavach, from MDG Services",
    cta: "Keeps every filing, renewal, inspection and daily report for your outlet on track in one app, in Hindi and English.",
    disclaimerLink: "Full disclaimer",
    privacy: "Privacy",
    updates: "Updates and official PDF",
    company: `MDG Services is a brand of ${COMPANY} (CIN ${CIN}).`,
    english: "English",
    clause: "MDG",
  },
  hi: {
    locale: "hi_IN",
    brand: "MDG Services",
    guide: "MDG 2024 गाइड",
    home: "होम",
    register: "अपना पंप रजिस्टर करें",
    call: `कॉल करें ${TOLL_FREE.display}`,
    other: "Read in English",
    shortAnswer: "संक्षेप में",
    inSection: "इस हिस्से के पेज",
    related: "इनसे जुड़े पेज",
    faq: "डीलरों के सवाल",
    watch: "एक मिनट का वीडियो देखें",
    video: "वीडियो",
    topics: "इस गाइड के विषय",
    tools: "टूल",
    pages: "पेज",
    page: "पेज",
    checked: "MDG 2024 (24.10.2024 से लागू) और हमारे अपडेट पेज पर दिए तेल कंपनी सर्कुलर से मिलाकर जाँचा गया:",
    officialTitle: "आधिकारिक दस्तावेज़ पढ़ें",
    officialIocl: "इंडियन ऑयल की वेबसाइट पर MDG 2024",
    officialBpcl: "भारत पेट्रोलियम की वेबसाइट पर MDG 2024",
    ctaTitle: "डीलर कवच, MDG Services से",
    cta: "आपके पंप की हर फ़ाइलिंग, रिन्यूअल, निरीक्षण और रोज़ की रिपोर्ट एक ऐप में समय पर — हिंदी और अंग्रेज़ी में।",
    disclaimerLink: "पूरा अस्वीकरण (डिस्क्लेमर)",
    privacy: "प्राइवेसी",
    updates: "अपडेट और आधिकारिक PDF",
    company: `MDG Services, ${COMPANY} (CIN ${CIN}) का एक ब्रांड है।`,
    english: "अंग्रेज़ी में",
    clause: "MDG",
  },
};

/**
 * The notice at the top of every page and the disclaimer at the bottom.
 * Wording follows the legal review of the guide (see guide/README.md).
 */
export const NOTICE: Record<Lang, { short: string; full: string }> = {
  en: {
    short:
      "This is a plain-language explanation of MDG 2024, not the official text. For accurate and current rules, always refer to the official Marketing Discipline Guidelines and circulars on the oil companies' websites and confirm with your oil company's officer.",
    full:
      "MDG Services is a private company. It is not part of, and is not endorsed by, IndianOil, Bharat Petroleum, Hindustan Petroleum or any government body. Company names are used only to identify the official documents. This guide explains the Marketing Discipline Guidelines 2024 in our own words for general information. It is not the official text, it is not legal advice, and it may not reflect circulars issued after the date shown on each page. Before acting on anything here, check the official MDG and your oil company's circulars, and speak to your oil company's officer or a lawyer about your own case. If you find a mistake, tell us and we will correct it.",
  },
  hi: {
    short:
      "यह MDG 2024 को आसान शब्दों में समझाने वाला पेज है, आधिकारिक दस्तावेज़ नहीं। सही और ताज़ा नियमों के लिए हमेशा तेल कंपनियों की वेबसाइट पर दिए आधिकारिक मार्केटिंग डिसिप्लिन गाइडलाइंस और सर्कुलर देखें, और अपनी तेल कंपनी के अधिकारी से पुष्टि करें।",
    full:
      "MDG Services एक निजी कंपनी है। इसका इंडियन ऑयल, भारत पेट्रोलियम, हिंदुस्तान पेट्रोलियम या किसी सरकारी संस्था से कोई संबंध नहीं है, और न ही उनकी ओर से इसे कोई मान्यता मिली है। कंपनियों के नाम सिर्फ़ आधिकारिक दस्तावेज़ों की पहचान के लिए लिखे गए हैं। यह गाइड मार्केटिंग डिसिप्लिन गाइडलाइंस 2024 को सामान्य जानकारी के लिए हमारे अपने शब्दों में समझाती है। यह आधिकारिक दस्तावेज़ नहीं है, कानूनी सलाह नहीं है, और हर पेज पर लिखी तारीख़ के बाद आए सर्कुलर इसमें शायद न हों। यहाँ लिखी किसी बात पर काम करने से पहले आधिकारिक MDG और अपनी तेल कंपनी के सर्कुलर देखें, और अपने मामले के लिए तेल कंपनी के अधिकारी या वकील से बात करें। कोई गलती दिखे तो हमें बताइए, हम उसे ठीक करेंगे।",
  },
};

/** Static pages of the main site that belong in the sitemap. */
export const SITE_PAGES = ["/", "/register", "/film", "/film/short", "/grievance", "/privacy"];
