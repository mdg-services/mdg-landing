/**
 * Every fixed word on a guide page, in both languages: the chrome around the
 * content, the notices, the disclaimer and the Dealer Kavach box.
 *
 * The notices and disclaimer follow the legal review of the guides (15 Oct
 * 2026): not the official text, no connection with the oil companies, amounts
 * are the minimum, not legal advice, the official English document prevails,
 * the Dealer Kavach box is an advertisement. Change them only with the same care.
 *
 * Public-copy rule: say what a dealer gets, never how the work is done.
 */
import type { Lang } from "./inventory.js";

export const SITE = "https://mdgservices.in";
export const COMPANY = "VRUOOM PRIVATE LIMITED";
export const CIN = "U29194HR2021PTC098450";
export const EMAIL = "hello@mdgservices.in";
/** Same number as src/lib/tollFree.ts; the guides are built outside the app, so it is not imported. */
export const TOLL_FREE = { display: "1800‑891‑3496", href: "tel:18008913496" };

/**
 * The official copy we link to. Bharat Petroleum hosts the PDF publicly. IndianOil's
 * hyperlinking policy asks for permission first, so iocl.com is named in plain text only.
 * We never host the PDF ourselves.
 */
export const OFFICIAL = {
  bpcl: "https://www.bharatpetroleum.in/images/files/MDG-2024-Effective-24-10-2024.pdf",
};

export const DOC = "Marketing Discipline Guidelines 2024 (Ver. 1, effective 24.10.2024)";

export const UI: Record<Lang, Record<string, string>> = {
  en: {
    locale: "en_IN",
    brand: "MDG Services",
    guide: "Guides",
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
    topics: "Topics",
    tools: "Tools",
    pages: "pages",
    page: "page",
    checked: `Checked against the ${DOC} on`,
    published: "Published by MDG Services.",
    officialTitle: "Read the official text",
    officialBpcl: "Marketing Discipline Guidelines 2024 (PDF on Bharat Petroleum's website)",
    officialAlso: "also published on iocl.com",
    ctaTitle: "About Dealer Kavach (advertisement)",
    cta: "Dealer Kavach is an app from MDG Services that tracks your outlet's filings, renewals, inspections and daily reports, and reminds you before deadlines, in Hindi and English.",
    disclaimerLink: "Full disclaimer",
    privacy: "Privacy",
    updates: "Updates and official PDF",
    company: `MDG Services is a brand of ${COMPANY}, a company registered in India (CIN ${CIN}).`,
    report: "Report an error or send a legal notice",
    english: "English",
  },
  hi: {
    locale: "hi_IN",
    brand: "MDG Services",
    guide: "गाइड",
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
    topics: "विषय",
    tools: "टूल",
    pages: "पेज",
    page: "पेज",
    checked: "Marketing Discipline Guidelines 2024 (Ver. 1, 24.10.2024 से लागू) से मिलाकर जाँचा गया:",
    published: "प्रकाशक: MDG Services।",
    officialTitle: "आधिकारिक दस्तावेज़ पढ़ें",
    officialBpcl: "Marketing Discipline Guidelines 2024 (भारत पेट्रोलियम की वेबसाइट पर PDF)",
    officialAlso: "यह iocl.com पर भी प्रकाशित है",
    ctaTitle: "डीलर कवच के बारे में (विज्ञापन)",
    cta: "डीलर कवच, MDG Services का ऐप है जो आपके आउटलेट की फ़ाइलिंग, रिन्यूअल, निरीक्षण और रोज़ की रिपोर्ट का हिसाब रखता है और डेडलाइन से पहले याद दिलाता है — हिंदी और अंग्रेज़ी में।",
    disclaimerLink: "पूरा अस्वीकरण (डिस्क्लेमर)",
    privacy: "प्राइवेसी",
    updates: "अपडेट और आधिकारिक PDF",
    company: `MDG Services, ${COMPANY} का एक ब्रांड है, जो भारत में रजिस्टर्ड कंपनी है (CIN ${CIN})।`,
    report: "गलती बताएँ या कानूनी सूचना भेजें",
    english: "अंग्रेज़ी में",
  },
};

/** The two-sentence notice at the top of every page. Normal size, never folded away. */
export const NOTICE_SHORT: Record<Lang, string> = {
  en: "This is a plain-language explanation by MDG Services (a brand of VRUOOM Private Limited). It is not the official text and is not connected with or approved by IndianOil, BPCL, HPCL or any government body, so please check the current Marketing Discipline Guidelines 2024 and circulars on the oil companies' own websites and with your oil company officer before you act.",
  hi: "यह पेज MDG Services (VRUOOM Private Limited का ब्रांड) की ओर से आसान भाषा में दी गई जानकारी है। यह आधिकारिक पाठ नहीं है, और इंडियनऑयल, बीपीसीएल, एचपीसीएल या किसी सरकारी संस्था से इसका कोई संबंध या अनुमोदन नहीं है; इसलिए कोई भी कदम उठाने से पहले तेल कंपनियों की अपनी वेबसाइट पर ताज़ा Marketing Discipline Guidelines 2024 और सर्कुलर देखें और अपनी तेल कंपनी के अधिकारी से पूछ लें।",
};

/** The full disclaimer: at the foot of every page, and the whole of the disclaimer page. [heading, text] pairs. */
export const DISCLAIMER: Record<Lang, [string, string][]> = {
  en: [
    ["About this page", `This page is a plain-language explanation published by MDG Services, a brand of ${COMPANY} (CIN ${CIN}). It is general information, offered free of charge. It is not the official text of any rule.`],
    ["Not connected with the oil companies or the government", `MDG Services is a private company. It is not connected with, approved by, endorsed by, or acting for Indian Oil Corporation Limited (IndianOil), Bharat Petroleum Corporation Limited (BPCL), Hindustan Petroleum Corporation Limited (HPCL) or any government body. Our name shares letters with the short form "MDG" that the oil companies use for their Marketing Discipline Guidelines. That does not mean any link with them.`],
    ["Names and marks", "IndianOil, BPCL, HPCL and the names of their documents belong to their owners. We write them only to say whose rules we are explaining."],
    ["Check the official source", "The Marketing Discipline Guidelines 2024 (Ver. 1, effective 24.10.2024) and related circulars are issued by the oil companies. Rules, amounts and dates can change, and amendments may reach dealers directly without being public. Before you act, read the current documents on the oil companies' own websites (iocl.com, bharatpetroleum.in, hindustanpetroleum.com) and ask your own oil company's officer. If this page and the official document differ, the official document is the one to follow."],
    ["What the amounts mean", "Amounts in the guidelines are the minimum action. The oil company may take higher action, up to ending the dealership. Do not treat any amount shown here as your full exposure."],
    ["Court and Parliament items", "Where we mention a court order or a statement in Parliament, we report what was said on the date shown. It is not the rule for your outlet, and the position may have changed since. Your dealership agreement and the oil company's current guidelines decide."],
    ["Not legal advice", "This is general information, not legal advice. For your own notice, reply or appeal, speak to an advocate or your oil company. Examples use made-up outlets."],
    ["Last checked", `The "checked" date shows the day we last compared this page with the official documents. It does not promise that nothing has changed since.`],
    ["Report an error or send a legal notice", `If you see a mistake, or need to send us a notice, write to ${EMAIL}. We read every message, check it, and correct or remove the page.`],
    ["Limits on our responsibility", `We take reasonable care to keep this page accurate. To the extent the law allows, MDG Services and ${COMPANY} are not responsible for loss caused by relying on this page alone instead of the official documents. This does not limit anything the law does not allow us to limit, including responsibility for fraud or for an error we knew about and did not correct. Your legal rights are not affected.`],
    ["Advertisement", `The box headed "About Dealer Kavach" is an advertisement for a paid service from MDG Services. This explanation is free and needs no sign-up or purchase to read.`],
    ["Hindi pages", "Hindi pages are written for easy reading. If a Hindi page and the official English document differ, the official English document is the one to follow."],
  ],
  hi: [
    ["इस पेज के बारे में", `यह पेज MDG Services (${COMPANY} का एक ब्रांड; CIN: ${CIN}) की ओर से आसान भाषा में दी गई सामान्य जानकारी है। इसे हम मुफ़्त उपलब्ध कराते हैं। यह किसी भी नियम का आधिकारिक पाठ नहीं है।`],
    ["तेल कंपनियों या सरकार से कोई संबंध नहीं", `MDG Services एक निजी कंपनी है। इसका इंडियन ऑयल कॉर्पोरेशन लिमिटेड (इंडियनऑयल), भारत पेट्रोलियम कॉर्पोरेशन लिमिटेड (बीपीसीएल), हिंदुस्तान पेट्रोलियम कॉर्पोरेशन लिमिटेड (एचपीसीएल) या किसी सरकारी संस्था से कोई संबंध नहीं है। इनकी ओर से इसे मंज़ूरी या समर्थन भी नहीं मिला है, और हम इनकी ओर से काम नहीं करते। हमारे नाम के अक्षर "MDG" वही हैं जो तेल कंपनियाँ अपने Marketing Discipline Guidelines के लिए इस्तेमाल करती हैं, पर इसका मतलब किसी तरह का जुड़ाव नहीं है।`],
    ["नाम और चिह्न", "इंडियनऑयल, बीपीसीएल, एचपीसीएल और उनके दस्तावेज़ों के नाम उनके अपने मालिकों के हैं। हम इन्हें सिर्फ़ यह बताने के लिए लिखते हैं कि हम किसके नियम समझा रहे हैं।"],
    ["सही जानकारी के लिए असली दस्तावेज़ देखें", "Marketing Discipline Guidelines 2024 (Ver. 1, 24.10.2024 से लागू) और उनसे जुड़े सर्कुलर तेल कंपनियाँ जारी करती हैं। नियम, रकम और तारीख़ें बदल सकती हैं, और संशोधन कई बार सीधे डीलर को भेजे जाते हैं, सार्वजनिक नहीं होते। कोई भी कदम उठाने से पहले तेल कंपनियों की अपनी वेबसाइट (iocl.com, bharatpetroleum.in, hindustanpetroleum.com) पर ताज़ा मूल दस्तावेज़ पढ़ें और अपनी तेल कंपनी के अधिकारी से पूछ लें। इस पेज और मूल दस्तावेज़ में फ़र्क हो, तो मूल दस्तावेज़ की बात ही सही मानें।"],
    ["रकम का मतलब", "गाइडलाइन में दी गई रकम कम से कम की जाने वाली कार्रवाई है। तेल कंपनी इससे ज़्यादा कार्रवाई भी कर सकती है, यहाँ तक कि डीलरशिप भी खत्म कर सकती है। इसलिए यहाँ दिखाई गई किसी रकम को अपना पूरा जोखिम न समझें।"],
    ["कोर्ट और संसद की बातें", "जहाँ हमने किसी कोर्ट के आदेश या संसद में कही गई बात का ज़िक्र किया है, वहाँ हम सिर्फ़ यह बताते हैं कि दी गई तारीख़ पर क्या कहा गया था। वह आपके आउटलेट का नियम नहीं है, और तब से स्थिति बदल भी सकती है। आपका डीलरशिप एग्रीमेंट और तेल कंपनी की ताज़ा गाइडलाइन ही तय करते हैं।"],
    ["कानूनी सलाह नहीं", "यह सामान्य जानकारी है, कानूनी सलाह नहीं। अपने नोटिस, जवाब या अपील के लिए किसी एडवोकेट से या अपनी तेल कंपनी से बात करें। उदाहरणों में आउटलेट काल्पनिक हैं।"],
    ["जाँच की तारीख़", `पेज पर लिखी "जाँच की तारीख़" वह दिन है जब हमने इसे मूल दस्तावेज़ों से मिलाया था। इसका मतलब यह नहीं कि उसके बाद कुछ नहीं बदला।`],
    ["गलती बताएँ या कानूनी सूचना भेजें", `कोई गलती दिखे, या हमें कोई सूचना भेजनी हो, तो ${EMAIL} पर लिखें। हम हर संदेश पढ़ते हैं, जाँचते हैं, और पेज को सुधारते या हटा देते हैं।`],
    ["हमारी ज़िम्मेदारी की सीमा", `हम पेज को सही रखने की पूरी वाजिब कोशिश करते हैं। कानून जितनी छूट देता है, उस हद तक MDG Services और ${COMPANY} उस नुकसान के ज़िम्मेदार नहीं हैं जो मूल दस्तावेज़ देखे बिना सिर्फ़ इस पेज पर भरोसा करने से हो। यह उन बातों को सीमित नहीं करता जिन्हें कानून सीमित करने की इजाज़त नहीं देता, जैसे धोखाधड़ी, या ऐसी गलती जिसकी हमें जानकारी थी और हमने ठीक नहीं की। आपके कानूनी अधिकार जैसे के तैसे रहते हैं।`],
    ["विज्ञापन", `"डीलर कवच के बारे में" वाला हिस्सा MDG Services की एक सशुल्क सेवा का विज्ञापन है। यह जानकारी मुफ़्त है, इसे पढ़ने के लिए साइन-अप या खरीद की ज़रूरत नहीं।`],
    ["हिंदी पेज", "हिंदी पेज आसानी से पढ़ने के लिए लिखे गए हैं। हिंदी पेज और मूल अंग्रेज़ी दस्तावेज़ में फ़र्क हो, तो मूल अंग्रेज़ी दस्तावेज़ की बात ही सही मानें।"],
  ],
};

/** Static pages of the main site that belong in the sitemap. */
export const SITE_PAGES = ["/", "/register", "/film", "/film/short", "/grievance", "/privacy"];
