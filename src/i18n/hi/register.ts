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
  pageTitle: "डीलर कवच ऐप लीजिए · MDG Services",

  backToHome: "होम पर वापस",

  /* The English page prints its phrase, a dot, then the Devanagari word. Here
     the pair would say the same thing twice, so the Devanagari word is the
     eyebrow itself and the gloss is dropped along with its dot. */
  eyebrow: "ऐप लीजिए",
  eyebrowDeva: undefined,
  heading: "डीलर कवच ऐप में रजिस्टर कीजिए।",
  intro:
    "App Store या Google Play से ऐप डाउनलोड कीजिए और अपने मोबाइल नंबर से ऐप में ही रजिस्टर कीजिए। पूरा होते ही आप साइन-इन हो जाते हैं, और सेवाएँ वहीं चुनते हैं।",

  appLead: "शुरू करने से पहले कोई सवाल? टोल-फ़्री पर कॉल कीजिए, सुबह 9 से रात 9, हर दिन।",
  appLink: "कॉल कीजिए",
  appStoreAria: "App Store से डीलर कवच ऐप डाउनलोड करें",
  playAria: "Google Play से डीलर कवच ऐप डाउनलोड करें",
  stepsHeading: "तीन क़दम",
  steps: [
    { title: "ऐप डाउनलोड कीजिए", body: "iPhone पर App Store का बटन दबाइए, Android फ़ोन पर Google Play का। ऐप मुफ़्त है।" },
    { title: "ऐप में रजिस्टर कीजिए", body: "अपना नाम, मोबाइल नंबर और पंप की जानकारी दीजिए। इस वेबसाइट पर कुछ भरना नहीं है।" },
    { title: "अपनी सेवाएँ चुनिए", body: "जो चाहिए वह चुनिए। काम शुरू करने से पहले क़ीमत लिखित में पक्की होती है।" },
  ],
  computerNote: "कंप्यूटर पर हैं? इस पेज को अपने फ़ोन में खोलिए, या फ़ोन के स्टोर में Dealer Kavach खोजिए।",

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
    password: {
      label: "पासवर्ड चुनिए",
      placeholder: "कम से कम 8 अक्षर",
      hint: "डीलर कवच ऐप में आप अपने मोबाइल नंबर और इसी पासवर्ड से साइन इन करेंगे। MDG में कोई इसे देख नहीं सकता।",
    },
    passwordConfirm: { label: "पासवर्ड दोबारा लिखिए", placeholder: "वही पासवर्ड फिर से" },
  },

  passwordShow: "दिखाइए",
  passwordHide: "छिपाइए",
  passwordShowAria: "पासवर्ड दिखाइए",
  passwordHideAria: "पासवर्ड छिपाइए",
  passwordShort: "कम से कम 8 अक्षर रखिए।",
  passwordMismatch: "दोनों पासवर्ड एक जैसे नहीं हैं।",

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
  /* The same tick covers the messages about the account that come on WhatsApp. */
  agreeTail:
    " पढ़ ली हैं और मुझे मंज़ूर हैं। मैं अपने खाते से जुड़े संदेश WhatsApp पर पाने के लिए भी सहमत हूँ।",
  agreeAria: "मैं नियम व शर्तें मानता हूँ और अपने खाते से जुड़े संदेश WhatsApp पर पाने के लिए सहमत हूँ",

  errorGeneric: "आपका रजिस्ट्रेशन पूरा नहीं हो पाया। कृपया दोबारा कोशिश कीजिए, या",
  errorBusy: "अभी हम आपका और रजिस्ट्रेशन नहीं ले पा रहे। कृपया कुछ देर बाद कोशिश कीजिए, या",
  errorCallLink: "अभी कॉल कीजिए",
  errorEnd: "।",

  privacy: "आपकी जानकारी हम किसी के साथ साझा नहीं करेंगे।",
  submit: "भेजिए",
  submitting: "भेजा जा रहा है…",

  hours: "सुबह 9 से रात 9, हर दिन",

  success: {
    ready: {
      badge: "खाता तैयार",
      heading: "आपका डीलर कवच खाता तैयार है।",
      promise: "डीलर कवच ऐप लीजिए और अपने मोबाइल नंबर और यहाँ चुने पासवर्ड से साइन इन कीजिए।",
      next: "ऐप की चैट में आगे के कदम दिखेंगे, और MDG की टीम वहीं जवाब देती है।",
    },
    existing: {
      badge: "पहले से रजिस्टर्ड",
      heading: "इस मोबाइल नंबर पर डीलर कवच खाता पहले से है।",
      promise: "इसी नंबर से डीलर कवच ऐप में साइन इन कीजिए। पासवर्ड भूल गए? साइन-इन स्क्रीन पर “पासवर्ड भूल गए?” दबाइए।",
      next: "अगर यह आपका दूसरा पंप है, तो MDG की टीम इसे आपके खाते में जोड़ने के लिए संपर्क करेगी।",
    },
    waiting: {
      badge: "नामांकन मिल गया",
      heading: "धन्यवाद। आपका रजिस्ट्रेशन हम तक पहुँच गया है।",
      promise: "MDG की टीम जल्द संपर्क करेगी।",
      next: "खाता तैयार होते ही आपको WhatsApp पर संदेश आएगा। फिर डीलर कवच ऐप में अपने मोबाइल नंबर और यहाँ चुने पासवर्ड से साइन इन कीजिए।",
    },
    appButton: "डीलर कवच ऐप लीजिए",
    bodyLead: "इंतज़ार नहीं कर सकते? हमारी लाइन {hours} खुली रहती है।",
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

  /* कवच शुरुआत की अपनी शर्तें (ADR 0058 §6, §13.2, §13.3)। अंग्रेज़ी पाठ मान्य है। */
  plannerTerms: [
    "कवच शुरुआत की क़ीमत ₹199 महीना और 18% GST है (कुल ₹234.82), जो Razorpay के ज़रिए ऑटोपे से दी जाती है, WhatsApp या SMS पर भेजे गए लिंक से। ऐप के अंदर कोई भुगतान नहीं होता।",
    "पहला भुगतान होते ही प्लान शुरू होता है, और हर महीने चलता रहता है, जब तक इसे बंद न किया जाए या ऑटोपे रुक न जाए।",
    "इसे कभी भी बंद किया जा सकता है। जिस महीने का पैसा दिया जा चुका है, उसके आख़िर तक इस्तेमाल चलता है। शुरू हो चुके महीने का पैसा वापस नहीं होता, और पहले महीने का पैसा-वापसी वादा भी नहीं है: Dealer's कवच का यह वादा कवच शुरुआत पर लागू नहीं होता।",
    "जो बिल भेजे जाने के 7 दिन के भीतर नहीं भरा जाता, वह बंद हो जाता है और प्लान रुका रहता है। पेमेंट की जानकारी कभी भी फिर से माँगी जा सकती है, ऐप की चैट में या हमसे, और वह WhatsApp और SMS पर आती है।",
    "जवाब आधिकारिक दस्तावेज़ों से पढ़ी गई सामान्य जानकारी हैं। ये क़ानूनी सलाह नहीं हैं, और मंज़ूरी भी नहीं: फ़ैसला तेल कंपनी, PESO, हाईवे अथॉरिटी और संबंधित दफ़्तर करते हैं।",
    "MDG Services डीलरशिप, लाइसेंस या मंज़ूरी का न वादा करती है, न उसे बेचती, आवंटित करती या दिलाती है।",
    "जब पंप खुल जाए और खाता Dealer's कवच पर आ जाए, तो कवच शुरुआत और उसका ऑटोपे बंद हो जाते हैं, और उसके बाद Dealer's कवच की क़ीमत और शर्तें लागू होती हैं।",
    "mdgservices.in पर छपी नियम व शर्तें और रिफ़ंड और कैंसिलेशन नीति भी लागू होती हैं।",
  ],
};
