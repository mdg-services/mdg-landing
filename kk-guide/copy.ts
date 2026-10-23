/**
 * Every fixed word on a Khata Kavach page, in both languages: the chrome around
 * the content, the notice, the disclaimer and the Khata Kavach box.
 *
 * The notice and disclaimer say what a reader must know before trusting a page
 * written by the maker of one of the apps it discusses: we make Khata Kavach;
 * other apps' names belong to their owners; facts about them are dated and come
 * from their own pages; this is not legal, tax or financial advice; examples are
 * made up; Khata Kavach never lends or holds money; the closing box is an
 * advertisement. Change them only with the same care.
 *
 * Public-copy rule: say what a business gets, never how the product is built.
 */
import type { Lang } from "../guide/calendar.js";
import { CIN, COMPANY, EMAIL, TOLL_FREE } from "../guide/copy.js";

export const KK_UI: Record<Lang, Record<string, string>> = {
  en: {
    locale: "en_IN",
    brand: "MDG Services",
    guide: "Guides",
    home: "Home",
    call: `Call ${TOLL_FREE.display}`,
    other: "हिंदी में पढ़ें",
    shortAnswer: "Short answer",
    inSection: "In this section",
    related: "Related pages",
    faq: "Questions people ask",
    watch: "Watch",
    video: "Video",
    topics: "Topics",
    tools: "Tools",
    toolsAndReference: "Start here",
    pages: "pages",
    page: "page",
    checked: "Facts checked on",
    published: "Published by MDG Services on",
    ctaTitle: "About Khata Kavach (advertisement)",
    disclaimerLink: "Full disclaimer",
    privacy: "Privacy",
    updates: "Updates",
    company: `MDG Services is a brand of ${COMPANY}, a company registered in India (CIN ${CIN}).`,
    report: "Report an error or send a legal notice",
    english: "English",
  },
  hi: {
    locale: "hi_IN",
    brand: "MDG Services",
    guide: "गाइड",
    home: "होम",
    call: `कॉल करें ${TOLL_FREE.display}`,
    other: "Read in English",
    shortAnswer: "संक्षेप में",
    inSection: "इस हिस्से के पेज",
    related: "इनसे जुड़े पेज",
    faq: "लोगों के सवाल",
    watch: "देखें",
    video: "वीडियो",
    topics: "विषय",
    tools: "टूल",
    toolsAndReference: "यहाँ से शुरू करें",
    pages: "पेज",
    page: "पेज",
    checked: "जानकारी की जाँच की तारीख़:",
    published: "प्रकाशक: MDG Services। प्रकाशन की तारीख़:",
    ctaTitle: "खाता कवच के बारे में (विज्ञापन)",
    disclaimerLink: "पूरा अस्वीकरण (डिस्क्लेमर)",
    privacy: "प्राइवेसी (अंग्रेज़ी में)",
    updates: "अपडेट",
    company: `MDG Services, ${COMPANY} का एक ब्रांड है, जो भारत में रजिस्टर्ड कंपनी है (CIN ${CIN})।`,
    report: "गलती बताएँ या कानूनी सूचना भेजें",
    english: "अंग्रेज़ी में",
  },
};

/** The closing box: the one sales line on a page, and it says it is an advertisement. */
export const KK_CTA: Record<Lang, { text: string; primary: string }> = {
  en: {
    text: "Khata Kavach is a shared credit book from MDG Services. Your customer asks before they take, your counter staff see the limit before they give, and both of you see every sale, payment and bill. It never lends or holds money.",
    primary: "Start my business in the app",
  },
  hi: {
    text: "खाता कवच, MDG Services का साझा उधार खाता है। ग्राहक माल लेने से पहले माँग भेजता है, काउंटर स्टाफ़ देने से पहले उधार की सीमा देखता है, और दोनों तरफ़ हर बिक्री, हर पेमेंट और हर बिल दिखता है। यह न उधार देता है, न आपका पैसा अपने पास रखता है।",
    primary: "ऐप में अपना बिज़नेस शुरू कीजिए",
  },
};

/** The notice under the title of every page. Normal size, never folded away. */
export const KK_NOTICE: Record<Lang, string> = {
  en: "MDG Services makes Khata Kavach, so this page comes from the maker of one of the apps it may mention. It is general information, not legal, tax or financial advice. Facts about other apps are taken from their own websites and app listings on the date shown and can change, so check them there before you decide.",
  hi: "खाता कवच MDG Services बनाती है, यानी यह पेज उसी कंपनी का लिखा है जिसका ऐप इसमें आ सकता है। यह सामान्य जानकारी है, कानूनी, टैक्स या वित्तीय सलाह नहीं। दूसरे ऐप्स की जानकारी उनकी अपनी वेबसाइट और ऐप लिस्टिंग से, दी गई तारीख़ पर ली गई है और बदल सकती है, इसलिए फ़ैसला करने से पहले वहीं जाँच लें।",
};

/** The full disclaimer: at the foot of every page, and the whole of the disclaimer page. [heading, text] pairs. */
export const KK_DISCLAIMER: Record<Lang, [string, string][]> = {
  en: [
    ["About this page", `This page is general information published by MDG Services, a brand of ${COMPANY} (CIN ${CIN}), the company that makes Khata Kavach. It is free to read and needs no sign-up.`],
    ["We make one of the apps", "Where a page compares Khata Kavach with another app or another way of keeping credit, remember that we make Khata Kavach. We compare like with like, use only facts the other company publishes, and say plainly where another app does more."],
    ["Other companies' names", "Khatabook, OkCredit, Vyapar, myBillBook and every other product or company named here belong to their owners. We name them only to say which product a fact is about. We have no connection with them, and they have not seen or approved these pages."],
    ["Facts about other apps", "Facts about other apps come from their own websites, help pages and app store listings, on the date shown as \"facts checked on\". Apps change their features and prices often. Check the app's own website before you decide, and tell us if anything here is out of date: we will correct it."],
    ["Not legal, tax or financial advice", "Pages about getting paid, notices, interest, courts or tax explain the general position in India on the date shown. Laws and rules change, and every case is different. For your own case, speak to an advocate or a chartered accountant."],
    ["Examples are made up", "The businesses, customers, vehicles and amounts in examples are made up, and so is the data on the app screens shown. No example describes a real customer or a real result."],
    ["What Khata Kavach is", "Khata Kavach records credit sales, bills and payments between a business and its customers. It never lends money and never holds anyone's money: it is not a bank, a lender or a payment service. A Khata Kavach bill is not a GST tax invoice."],
    ["Report an error or send a legal notice", `If you see a mistake, or need to send us a notice, write to ${EMAIL}. We read every message, check it, and correct or remove the page.`],
    ["Limits on our responsibility", `We take reasonable care to keep these pages accurate. To the extent the law allows, MDG Services and ${COMPANY} are not responsible for loss caused by relying on this page alone. This does not limit anything the law does not allow us to limit, including responsibility for fraud or for an error we knew about and did not correct. Your legal rights are not affected.`],
    ["Advertisement", "The box headed \"About Khata Kavach\" is an advertisement for Khata Kavach, a service from MDG Services. Everything else on this page is free information."],
    ["Hindi pages", "Hindi pages are written for easy reading and say the same as their English pages. Where a page mentions a law, the official text of that law is the one to follow."],
  ],
  hi: [
    ["इस पेज के बारे में", `यह पेज MDG Services (${COMPANY} का एक ब्रांड; CIN: ${CIN}) की ओर से दी गई सामान्य जानकारी है। खाता कवच यही कंपनी बनाती है। इसे पढ़ना मुफ़्त है, साइन-अप की ज़रूरत नहीं।`],
    ["ऐप हम ही बनाते हैं", "जहाँ किसी पेज पर खाता कवच की तुलना किसी दूसरे ऐप या उधार रखने के किसी दूसरे तरीके से है, वहाँ याद रखें कि खाता कवच हम बनाते हैं। हम बराबर की चीज़ों की तुलना करते हैं, सिर्फ़ वही बातें लिखते हैं जो दूसरी कंपनी ख़ुद बताती है, और जहाँ दूसरा ऐप ज़्यादा करता है, वह साफ़ लिखते हैं।"],
    ["दूसरी कंपनियों के नाम", "Khatabook, OkCredit, Vyapar, myBillBook और यहाँ लिखे हर दूसरे प्रोडक्ट या कंपनी के नाम उनके मालिकों के हैं। हम उनका नाम सिर्फ़ यह बताने के लिए लिखते हैं कि कौन-सी बात किस प्रोडक्ट की है। उनसे हमारा कोई संबंध नहीं है, और उन्होंने ये पेज न देखे हैं, न मंज़ूर किए हैं।"],
    ["दूसरे ऐप्स की जानकारी", "दूसरे ऐप्स की जानकारी उनकी अपनी वेबसाइट, हेल्प पेज और ऐप स्टोर लिस्टिंग से, \"जाँच की तारीख़\" पर ली गई है। ऐप अपने फ़ीचर और दाम अक्सर बदलते हैं। फ़ैसला करने से पहले उस ऐप की अपनी वेबसाइट देखें, और कुछ पुराना दिखे तो हमें बताएँ: हम ठीक कर देंगे।"],
    ["कानूनी, टैक्स या वित्तीय सलाह नहीं", "पैसा वसूलने, नोटिस, ब्याज, कोर्ट या टैक्स वाले पेज दी गई तारीख़ पर भारत की आम स्थिति बताते हैं। कानून और नियम बदलते हैं, और हर मामला अलग होता है। अपने मामले के लिए किसी एडवोकेट या चार्टर्ड अकाउंटेंट से बात करें।"],
    ["उदाहरण काल्पनिक हैं", "उदाहरणों में कारोबार, ग्राहक, गाड़ियाँ और रकम काल्पनिक हैं, और ऐप की तस्वीरों में दिखा डेटा भी। कोई उदाहरण किसी असली ग्राहक या असली नतीजे के बारे में नहीं है।"],
    ["खाता कवच क्या है", "खाता कवच एक कारोबार और उसके ग्राहकों के बीच उधार की बिक्री, बिल और पेमेंट का हिसाब रखता है। यह न पैसा उधार देता है, न किसी का पैसा अपने पास रखता है: यह बैंक, लोन देने वाली कंपनी या पेमेंट सर्विस नहीं है। खाता कवच का बिल GST टैक्स इनवॉइस नहीं है।"],
    ["गलती बताएँ या कानूनी सूचना भेजें", `कोई गलती दिखे, या हमें कोई सूचना भेजनी हो, तो ${EMAIL} पर लिखें। हम हर संदेश पढ़ते हैं, जाँचते हैं, और पेज को सुधारते या हटा देते हैं।`],
    ["हमारी ज़िम्मेदारी की सीमा", `हम इन पेजों को सही रखने की पूरी वाजिब कोशिश करते हैं। कानून जितनी छूट देता है, उस हद तक MDG Services और ${COMPANY} उस नुकसान के ज़िम्मेदार नहीं हैं जो सिर्फ़ इस पेज पर भरोसा करने से हो। यह उन बातों को सीमित नहीं करता जिन्हें कानून सीमित करने की इजाज़त नहीं देता, जैसे धोखाधड़ी, या ऐसी गलती जिसकी हमें जानकारी थी और हमने ठीक नहीं की। आपके कानूनी अधिकार जैसे के तैसे रहते हैं।`],
    ["विज्ञापन", "\"खाता कवच के बारे में\" वाला हिस्सा खाता कवच का विज्ञापन है, जो MDG Services की सेवा है। पेज की बाकी हर बात मुफ़्त जानकारी है।"],
    ["हिंदी पेज", "हिंदी पेज आसानी से पढ़ने के लिए लिखे गए हैं और वही बात कहते हैं जो उनके अंग्रेज़ी पेज। जहाँ किसी कानून का ज़िक्र है, वहाँ उस कानून का आधिकारिक पाठ ही मानें।"],
  ],
};

/**
 * One short line for each topic's card on the hub (two lines on a phone).
 * Keyed by the topic (pillar) in kk-guide/inventory.ts.
 */
export const KK_TOPIC_BLURB: Record<string, Record<Lang, string>> = {
  credit: {
    en: "Who gets credit, how big a limit, for how long, and how to write it down.",
    hi: "उधार किसे दें, कितनी सीमा, कितने दिन, और हिसाब कैसे लिखें।",
  },
  counter: {
    en: "What staff check before goods go out on credit, and what every sale must record.",
    hi: "उधार पर माल देने से पहले स्टाफ़ क्या देखे, और हर बिक्री में क्या लिखा जाए।",
  },
  paid: {
    en: "Reminders, statements, when to stop credit, and the legal steps in plain words.",
    hi: "याद दिलाना, हिसाब भेजना, उधार कब रोकें, और कानूनी कदम आसान भाषा में।",
  },
  compare: {
    en: "Paper, ledger apps, billing apps, pump software and fuel cards, side by side.",
    hi: "कागज़, खाता ऐप, बिलिंग ऐप, पंप सॉफ़्टवेयर और फ़्यूल कार्ड की तुलना।",
  },
  features: {
    en: "Customer requests, the counter light, photos, bills, and what each side sees.",
    hi: "ग्राहक की रिक्वेस्ट, काउंटर की बत्ती, फ़ोटो, बिल, और किसे क्या दिखता है।",
  },
  trades: {
    en: "Fuel, cement, sand, gas, wholesale and dairy: by vehicle number or by pickup code.",
    hi: "डीज़ल, सीमेंट, बालू, गैस, थोक और डेयरी: गाड़ी नंबर से या 4 अंक के कोड से।",
  },
  examples: {
    en: "Made-up businesses walked through real situations, with figures that add up.",
    hi: "काल्पनिक कारोबार, असली हालात, और जुड़ते हुए आँकड़े।",
  },
};
