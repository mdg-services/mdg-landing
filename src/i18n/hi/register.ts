import type { register as EN } from "../en/register";

/* The enrolment page and the Terms & Conditions behind its checkbox.

   Portal, document and product names (SDMS, SAP, Annexure-I, PESO, OMC, GST,
   UPI, Type A / Type B) stay in Latin script: that is how a dealer sees them
   on every screen and on every paper they already have.

   The clauses below are a courtesy translation. The agreement a dealer signs
   is the English one, so the modal says so and offers the English original;
   where a legal term has no everyday Hindi word, the English term is kept in
   brackets after the Hindi rather than replaced by a heavier Hindi one. */
export const register: typeof EN = {
  backToHome: "होम पर वापस",

  /* The English page prints its phrase, a dot, then the Devanagari word. Here
     the pair would say the same thing twice, so the Devanagari word is the
     eyebrow itself and the gloss is dropped along with its dot. */
  eyebrow: "डीलर नामांकन",
  eyebrowDeva: undefined,
  heading: "अपनी डीलरशिप रजिस्टर कीजिए।",
  intro:
    "बस थोड़ी सी जानकारी, और आप शामिल। अपने पंप के हिसाब से साइट चुनिए। काम शुरू करने से पहले हम सेवाएँ तय कर देते हैं और क़ीमत लिखित में पक्की कर देते हैं।",

  sectionAria: "नामांकन फ़ॉर्म",
  formAria: "डीलर नामांकन",
  /* The gold asterisk sits between these two halves, and in Hindi the mark
     belongs in the middle of the sentence, not before it. */
  requiredLead: "जिन ख़ानों पर",
  requiredTail: "का निशान है, वे ज़रूरी हैं।",

  fields: {
    name: { label: "आपका नाम", placeholder: "रमेश कुमार" },
    mobile: { label: "आपका मोबाइल", placeholder: "अपना मोबाइल नंबर" },
    email: { label: "आपका ईमेल", placeholder: "अपना ईमेल लिखिए" },
    pumpName: { label: "पंप का नाम", placeholder: "अपने पंप का नाम" },
    sapCode: { label: "SAP कोड", placeholder: "अपना SAP कोड" },
  },

  siteTypeLegend: "साइट का प्रकार",
  /* The label only. The value the API is sent, and the name the signed
     agreement uses, is the key itself and never changes with the language. */
  siteTypes: {
    "Type A": "Type A",
    "Type B": "Type B",
  },

  /* The link sits inside the sentence, and in Hindi the verb lands after it,
     so the tail carries the verb as well as the full stop. */
  agreeLead: "मैंने",
  termsLink: "नियम व शर्तें",
  agreeTail: " पढ़ ली हैं और मुझे मंज़ूर हैं।",
  agreeAria: "मैं नियम व शर्तें मानता हूँ",

  errorGeneric: "कुछ गड़बड़ हो गई। कृपया दोबारा कोशिश कीजिए।",
  errorCallLink: "या अभी कॉल कीजिए",
  errorEnd: "।",

  privacy: "आपकी जानकारी हम किसी के साथ साझा नहीं करेंगे।",
  submit: "भेजिए",
  submitting: "भेजा जा रहा है…",

  hours: "सुबह 9 से रात 9, हर दिन",

  success: {
    badge: "नामांकन मिल गया",
    heading: "धन्यवाद। आपकी जानकारी हम तक पहुँच गई है।",
    bodyLead:
      "हमारी टीम कॉल करके आपकी सेवाएँ और क़ीमत पक्की कर लेगी, आमतौर पर एक घंटे के भीतर ({hours})। इंतज़ार नहीं कर सकते?",
    callLink: "सीधे कॉल कीजिए",
    bodyEnd: "।",
  },

  termsEyebrow: "यह समझौता",
  termsTitle: "नियम व शर्तें",
  close: "बंद कीजिए",
  agreeContinue: "मंज़ूर है, आगे बढ़िए",

  /* "Annexure-I" is the name of a document in the signed agreement, so the
     sentence is written around it. */
  annexureLead: "कौन सी सेवाएँ और उनके कितने पैसे, यह सब",
  annexureTail:
    " में लिखा है। उससे बाहर का कोई भी काम दोनों पक्ष आपस में बात करके तय करते हैं। साइन करने से पहले कोई सवाल है?",
  annexureCallLink: "कॉल कीजिए",
  annexureEnd: "।",

  /* A translation of a contract is not the contract. These three carry the
     notice that says so, and the labels for the control that swaps the
     clauses between this translation and the English original. */
  bindingNotice:
    "यह हिंदी अनुवाद सिर्फ़ आपकी सुविधा के लिए है, ताकि आप समझ सकें कि आप किस बात पर हामी भर रहे हैं। क़ानूनी तौर पर अंग्रेज़ी वाली शर्तें ही मान्य होंगी।",
  showEnglish: "अंग्रेज़ी मूल पढ़िए",
  showHindi: "हिंदी में पढ़िए",

  /* The ten clauses, in the same order as the English. The numeral beside
     each one is counted off this list, so the order is the meaning. */
  terms: [
    "सेवाएँ करने के लिए डीलर अपनी User ID और Password सेवा प्रदाता (Service Provider) को देगा, जैसा दोनों के बीच तय हुआ है। सेवा प्रदाता डीलर को जो सेवाएँ देगा और उनके लिए जो शुल्क या दरें (charges/rates) लगेंगी, उनकी सूची Annexure-I में दी गई है। Annexure-I से बाहर की किसी भी सेवा पर दोनों पक्ष (Parties) आपस में बात करके तय करेंगे।",
    "दोनों पक्ष इस बात पर सहमत हैं कि एक-दूसरे को दिए गए डेटा और जानकारी को गोपनीय रखेंगे। जिस पक्ष को ऐसी गोपनीय जानकारी (Confidential Information) मिलती है, वह उसे देने वाले पक्ष (Disclosing Party) की पहले से ली गई लिखित मंज़ूरी के बिना किसी को नहीं बताएगा।",
    "सेवा प्रदाता डीलर को सारी सेवाएँ सिर्फ़ ऑनलाइन ही देगा। लेकिन डीलर के ज़रूरी अनुरोध पर सेवा प्रदाता मौके पर आकर भी सेवा दे सकता है, बशर्ते उस समय आदमी उपलब्ध हों और डीलर की जगह तक पहुँचा जा सके। मौके पर आकर सेवा देने का ख़र्च दोनों पक्ष आपस में बात करके तय करेंगे।",
    "डीलर यह मानता है और पुष्टि करता है कि सेवाएँ देने के लिए जो डेटा, जानकारी और काग़ज़ात चाहिए, उनके लिए सेवा प्रदाता पूरी तरह डीलर पर निर्भर है। डीलर यह भी मानता है और पुष्टि करता है कि ऐसे डेटा, जानकारी और काग़ज़ात के सही और असली होने की जाँच करने का कोई तरीक़ा सेवा प्रदाता के पास नहीं है, इसलिए डीलर की ओर से दिए गए ग़लत डेटा, जानकारी या काग़ज़ात की वजह से सेवा में कोई कमी रह जाए, तो उसके लिए सेवा प्रदाता ज़िम्मेदार नहीं होगा।",
    "दोनों पक्षों के बीच यह तय हुआ है कि सेवाएँ ऑनलाइन दी जा रही हैं, इसलिए इंटरनेट नेटवर्क ख़राब होने, डीलर की ओर से सहयोग न मिलने, स्पेयर पार्ट्स उपलब्ध न होने, या बाढ़, हड़ताल, लॉकडाउन, भूकंप, सरकारी छुट्टी, दंगे जैसी दैवी आपदा (FORCE MAJEURE) की वजह से सेवा में देरी या कमी होती है, तो PESO, OMC या सरकारी नियमों और दिशा-निर्देशों का पालन न होने, देर से होने या पूरा न होने पर डीलर पर जो जुर्माना (fine/penalty) लगे, उसके लिए सेवा प्रदाता ज़िम्मेदार नहीं होगा।",
    "डीलर यह मानता है और पुष्टि करता है कि सेवा प्रदाता जो भी काम करता है, वह डीलर की ओर से और डीलर के लिए करता है, और इसमें सेवा प्रदाता एक स्वतंत्र सलाहकार (independent Consultant) के तौर पर काम करता है। इसलिए PESO, OMC या सरकारी नियमों और दिशा-निर्देशों का पालन करने में डीलर से जो भी चूक या ग़लती हो, उसके लिए सेवा प्रदाता ज़िम्मेदार नहीं होगा।",
    "डीलर सारा भुगतान सेवा प्रदाता को बैंक ट्रांसफ़र या UPI ट्रांसफ़र से करेगा, या उस तरीक़े से जो दोनों पक्षों के बीच तय हो। सेवा प्रदाता उस पर लागू GST जोड़कर डीलर के नाम से इनवॉइस बनाएगा। भुगतान इनवॉइस मिलने के 10 दिन के भीतर करना होगा। इससे ज़्यादा देर होने पर सेवा प्रदाता 18% सालाना की दर से ब्याज लगा सकता है।",
    "OMC, PESO या सरकारी विभाग समय-समय पर जो नियम और दिशा-निर्देश जारी करते हैं, उनका पालन डीलर की ओर से न होने पर जो भी मुक़दमे, कार्रवाई, जुर्माने और देनदारियाँ आएँ, उनमें डीलर सेवा प्रदाता का बचाव करेगा और उसका पूरा नुक़सान भरेगा (defend and indemnify)।",
    "यह समझौता साइन होने की तारीख़ से 1 साल तक चलेगा, और आगे भी 1-1 साल के लिए बढ़ता रहेगा, जब तक कोई पक्ष दूसरे पक्ष को 30 दिन पहले लिखित सूचना देकर इसे ख़त्म न कर दे। लेकिन अगर इनवॉइस में लिखी अवधि के भीतर भुगतान नहीं मिलता, तो सेवा प्रदाता इस समझौते को तुरंत ख़त्म कर सकता है।",
    "दोनों पक्ष सहमत हैं कि इस समझौते के तहत सेवा प्रदाता की दी गई सेवाओं से जुड़े सभी विवाद सिर्फ़ दिल्ली की अदालतों के अधिकार क्षेत्र (exclusive jurisdiction) में आएँगे।",
  ],
};
