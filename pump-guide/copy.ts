/**
 * Every fixed word on a Petrol pump guide page, in both languages: the chrome
 * around the content, the notice, the disclaimer and the Dealer Kavach box.
 *
 * The notice and disclaimer say what a reader must know before trusting a page
 * written by the maker of an app for petrol pump dealers: we make Dealer
 * Kavach; this is general information, not legal, tax or financial advice;
 * rules, fees and guidelines change and differ by oil company and state, so
 * every fact names its source and the date it was checked; we never sell,
 * allot or arrange a dealership or a licence; the closing box is an
 * advertisement. Change them only with the same care.
 *
 * Public-copy rule: say what the reader gets, never how the work is done.
 */
import type { Lang } from "../guide/calendar.js";
import { CIN, COMPANY, EMAIL, UI } from "../guide/copy.js";

export const PUMP_UI: Record<Lang, Record<string, string>> = {
  en: {
    ...UI.en,
    faq: "Questions people ask",
    checked: "Facts checked on",
    toolsAndReference: "Start here",
  },
  hi: {
    ...UI.hi,
    faq: "लोगों के सवाल",
    checked: "जानकारी की जाँच की तारीख़:",
    toolsAndReference: "यहाँ से शुरू करें",
  },
};

/** The notice under the title of every page. Normal size, never folded away. */
export const PUMP_NOTICE: Record<Lang, string> = {
  en: "MDG Services makes Dealer Kavach, an app for petrol pump dealers, so this page comes from the maker of a product it may mention. It is general information, not legal, tax or financial advice. Rules, fees and guidelines change and differ by oil company and state: every fact here names its source and the date we checked it, so confirm it with the oil company or the authority before you act. We do not sell, allot or arrange dealerships or licences.",
  hi: "MDG Services पेट्रोल पंप डीलरों के लिए ऐप डीलर कवच बनाती है, यानी यह पेज उसी कंपनी का लिखा है जिसका प्रोडक्ट इसमें आ सकता है। यह सामान्य जानकारी है, कानूनी, टैक्स या वित्तीय सलाह नहीं। नियम, फ़ीस और गाइडलाइन बदलती रहती हैं और तेल कंपनी और राज्य के हिसाब से अलग होती हैं: यहाँ हर तथ्य के साथ उसका स्रोत और हमारी जाँच की तारीख़ लिखी है, इसलिए कोई कदम उठाने से पहले तेल कंपनी या संबंधित विभाग से पुष्टि कर लें। हम डीलरशिप या लाइसेंस न बेचते हैं, न दिलाते हैं।",
};

/** The full disclaimer: at the foot of every page, and the whole of the disclaimer page. [heading, text] pairs. */
export const PUMP_DISCLAIMER: Record<Lang, [string, string][]> = {
  en: [
    ["About this page", `This page is general information published by MDG Services, a brand of ${COMPANY} (CIN ${CIN}), the company that makes Dealer Kavach. It is free to read and needs no sign-up.`],
    ["We make an app for dealers", "We make Dealer Kavach, an app for petrol pump dealers. Where a page mentions tools or services for a dealer, remember that. We state facts from the source, not our own opinion of what is best."],
    ["We do not sell dealerships or licences", "MDG Services does not sell, allot, book or arrange petrol pump dealerships, land, licences or approvals, and we have no connection with any oil company's selection of dealers. Dealerships are offered only by the oil companies through their own advertisements and websites. The oil companies say no agent is authorised to ask candidates for money, and that fees and deposits are paid only through their official website. If someone asks you for money to get you a dealership, do not pay, and tell the oil company or the police."],
    ["Sources and dates", "Every fact on these pages names its source: a law, a rule, a standard, a government notice or reply, or an oil company's own published guideline. Each page shows the date its facts were checked. Fees, figures, guidelines and portals change, and oil companies and states do not all follow the same rule. Check the source before you act, and tell us if anything here is out of date: we will correct it."],
    ["Not legal, tax or financial advice", "Pages about licences, tax, fees or penalties explain the general position in India on the date shown. Laws and rules change, and every case is different. For your own case, speak to an advocate, a chartered accountant, or the oil company or authority concerned."],
    ["Earnings and costs are not promises", "Nothing here promises a dealership, a licence, an income or a profit. Where a page gives a figure for a cost or a commission, it is what the source states on the date shown, not what any pump will earn or spend."],
    ["Other companies' names", "Oil companies and every other company, product or body named here belong to their owners. We name them only to say whose rule or service a fact is about. They have not seen or approved these pages."],
    ["Report an error or send a legal notice", `If you see a mistake, or need to send us a notice, write to ${EMAIL}. We read every message, check it, and correct or remove the page.`],
    ["Limits on our responsibility", `We take reasonable care to keep these pages accurate. To the extent the law allows, MDG Services and ${COMPANY} are not responsible for loss caused by relying on this page alone. This does not limit anything the law does not allow us to limit, including responsibility for fraud or for an error we made after being told of it.`],
    ["Advertisement", "The box headed \"About Dealer Kavach\" is an advertisement for Dealer Kavach, a service from MDG Services. Everything else on this page is free information."],
    ["Hindi pages", "Hindi pages are written for easy reading and say the same as their English pages. Where a page mentions a law or a guideline, the official text is the one to follow."],
  ],
  hi: [
    ["इस पेज के बारे में", `यह पेज MDG Services (${COMPANY} का एक ब्रांड; CIN: ${CIN}) की ओर से दी गई सामान्य जानकारी है। डीलर कवच यही कंपनी बनाती है। इसे पढ़ना मुफ़्त है और किसी साइन-अप की ज़रूरत नहीं।`],
    ["हम डीलरों के लिए ऐप बनाते हैं", "हम पेट्रोल पंप डीलरों के लिए ऐप डीलर कवच बनाते हैं। जहाँ किसी पेज पर डीलर के किसी टूल या सेवा का ज़िक्र हो, वहाँ यह बात याद रखें। हम तथ्य स्रोत से लिखते हैं, 'सबसे अच्छा क्या है' पर अपनी राय नहीं।"],
    ["हम डीलरशिप या लाइसेंस नहीं बेचते", "MDG Services पेट्रोल पंप की डीलरशिप, ज़मीन, लाइसेंस या मंज़ूरी न बेचती है, न आवंटित करती है, न बुक करती है, न दिलाती है, और किसी तेल कंपनी के डीलर चयन से हमारा कोई संबंध नहीं है। डीलरशिप सिर्फ़ तेल कंपनियाँ अपने विज्ञापन और वेबसाइट के ज़रिए देती हैं। तेल कंपनियों का कहना है कि उन्होंने किसी एजेंट को उम्मीदवारों से पैसे माँगने का अधिकार नहीं दिया है, और फ़ीस व जमा राशि सिर्फ़ उनकी आधिकारिक वेबसाइट के ज़रिए ली जाती है। जो कोई डीलरशिप दिलाने के नाम पर आपसे पैसे माँगे, उसे पैसे न दें और तेल कंपनी या पुलिस को बताएँ।"],
    ["स्रोत और तारीख़ें", "इन पेजों पर हर तथ्य के साथ उसका स्रोत लिखा है: कोई कानून, नियम, मानक, सरकारी अधिसूचना या जवाब, या किसी तेल कंपनी की अपनी प्रकाशित गाइडलाइन। हर पेज पर जाँच की तारीख़ दी है। फ़ीस, आँकड़े, गाइडलाइन और पोर्टल बदलते रहते हैं, और सभी तेल कंपनियाँ और राज्य एक ही नियम नहीं मानते। कदम उठाने से पहले स्रोत देख लें, और कुछ पुराना दिखे तो हमें बताएँ: हम सुधार देंगे।"],
    ["कानूनी, टैक्स या वित्तीय सलाह नहीं", "लाइसेंस, टैक्स, फ़ीस या जुर्माने वाले पेज दी गई तारीख़ पर भारत की आम स्थिति बताते हैं। कानून और नियम बदलते रहते हैं और हर मामला अलग होता है। अपने मामले के लिए वकील, चार्टर्ड अकाउंटेंट, या संबंधित तेल कंपनी या विभाग से बात करें।"],
    ["कमाई और खर्च के वादे नहीं", "यहाँ कुछ भी डीलरशिप, लाइसेंस, आमदनी या मुनाफ़े का वादा नहीं है। जहाँ किसी पेज पर खर्च या कमीशन का आँकड़ा है, वह वही है जो स्रोत ने दी गई तारीख़ पर बताया है, यह नहीं कि कोई पंप कितना कमाएगा या खर्च करेगा।"],
    ["दूसरी कंपनियों के नाम", "तेल कंपनियों और यहाँ लिखे हर दूसरे कंपनी, प्रोडक्ट या संस्था के नाम उनके मालिकों के हैं। हम उनका नाम सिर्फ़ यह बताने के लिए लिखते हैं कि कोई तथ्य किसके नियम या सेवा का है। उन्होंने ये पेज देखे या मंज़ूर नहीं किए हैं।"],
    ["गलती बताएँ या कानूनी सूचना भेजें", `कोई गलती दिखे, या हमें कोई सूचना भेजनी हो, तो ${EMAIL} पर लिखें। हम हर संदेश पढ़ते हैं, जाँचते हैं, और पेज सुधारते या हटाते हैं।`],
    ["हमारी ज़िम्मेदारी की सीमा", `हम इन पेजों को सही रखने की पूरी वाजिब कोशिश करते हैं। कानून जितनी छूट देता है, उस हद तक MDG Services और ${COMPANY} सिर्फ़ इस पेज के भरोसे हुए नुकसान के ज़िम्मेदार नहीं हैं। इससे वह कुछ सीमित नहीं होता जिसे सीमित करने की कानून इजाज़त नहीं देता, जिसमें धोखाधड़ी या बताए जाने के बाद हमारी की गई गलती की ज़िम्मेदारी शामिल है।`],
    ["विज्ञापन", "\"डीलर कवच के बारे में\" वाला हिस्सा डीलर कवच का विज्ञापन है, जो MDG Services की सेवा है। पेज की बाकी हर बात मुफ़्त जानकारी है।"],
    ["हिंदी पेज", "हिंदी पेज आसानी से पढ़ने के लिए लिखे गए हैं और वही बात कहते हैं जो उनके अंग्रेज़ी पेज। जहाँ किसी कानून या गाइडलाइन का ज़िक्र हो, वहाँ आधिकारिक पाठ ही मानें।"],
  ],
};

/**
 * One short line for each topic's card on the hub (two lines on a phone).
 * Keyed by the topic (pillar) in pump-guide/inventory.ts.
 */
export const PUMP_TOPIC_BLURB: Record<string, Record<Lang, string>> = {
  dealership: {
    en: "Who can apply, how an oil company picks a dealer, and the real route to a petrol pump.",
    hi: "कौन आवेदन कर सकता है, तेल कंपनी डीलर कैसे चुनती है, और पेट्रोल पंप पाने का असली रास्ता।",
  },
  money: {
    en: "What it costs to start, and how the dealer commission works.",
    hi: "शुरू करने में कितना खर्च, और डीलर कमीशन कैसे चलता है।",
  },
  licences: {
    en: "The licences, NOCs and consents a pump needs, and who gives each one.",
    hi: "पंप को कौन-कौन से लाइसेंस, NOC और मंज़ूरी चाहिए, और हर एक कौन देता है।",
  },
  site: {
    en: "How much land, what kind of plot, and what gets a site rejected.",
    hi: "कितनी ज़मीन, कैसी जगह, और किस वजह से जगह नामंज़ूर होती है।",
  },
  safety: {
    en: "Fire equipment, earthing, signs and the daily safety checks.",
    hi: "आग बुझाने के साधन, अर्थिंग, साइन और रोज़ की सुरक्षा जाँच।",
  },
  equipment: {
    en: "Tanks, dispensers, nozzles, vapour recovery and how each is checked.",
    hi: "टैंक, डिस्पेंसर, नोज़ल, वेपर रिकवरी और हर एक की जाँच कैसे होती है।",
  },
  running: {
    en: "Who does what in a day, and how GST works for a pump.",
    hi: "दिन भर में कौन क्या करता है, और पंप पर GST कैसे लगता है।",
  },
  fuels: {
    en: "E20 petrol, and adding CNG or an EV charger to a pump.",
    hi: "E20 पेट्रोल, और पंप पर CNG या EV चार्जर जोड़ना।",
  },
  customers: {
    en: "Where a customer complains, and how a dealer should answer.",
    hi: "ग्राहक शिकायत कहाँ करे, और डीलर जवाब कैसे दे।",
  },
};
