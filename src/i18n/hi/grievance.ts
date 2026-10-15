import type { grievance as EN } from "../en/grievance";

/* The grievance page. Plain spoken Hindi, the way the support desk talks to a
   dealer: "शिकायत", not a form-office word for it. Product names (Dealer
   Kavach is written डीलर कवच, as on the enrolment page) and SAP stay as a
   dealer sees them on every screen and paper they already have. */
export const grievance: typeof EN = {
  pageTitle: "शिकायत दर्ज कीजिए · MDG Services",

  backToHome: "होम पर वापस",

  /* The English page prints its phrase, a dot, then the Devanagari word. Here
     the pair would say the same thing twice, so the Devanagari word is the
     eyebrow itself and the gloss is dropped along with its dot. */
  eyebrow: "शिकायत",
  eyebrowDeva: undefined,
  heading: "कुछ गड़बड़ हुई? हमें बताइए।",
  intro:
    "हमारी सेवा, डीलर कवच ऐप, बिल या भुगतान, हमारे स्टाफ़, या आपकी जानकारी के इस्तेमाल को लेकर कोई परेशानी हो, तो यहाँ लिखिए। हमारी टीम से कोई आपकी बात देखेगा और आपको जवाब देगा।",
  metaDescription:
    "हमारी सेवा, डीलर कवच ऐप, बिल, हमारे स्टाफ़ या आपकी जानकारी के इस्तेमाल को लेकर कोई परेशानी हो, तो यहाँ लिखिए। हमारी टीम से कोई देखेगा और जवाब देगा।",
  callLead: "किसी से बात करना चाहते हैं?",
  callLink: "कॉल कीजिए",
  callEnd: "।",

  sectionAria: "शिकायत फ़ॉर्म",
  formAria: "शिकायत दर्ज कीजिए",
  /* The gold asterisk sits between these two halves, and in Hindi the mark
     belongs in the middle of the sentence, not before it. */
  requiredLead: "जिन ख़ानों पर",
  requiredTail: "का निशान है, वे ज़रूरी हैं।",

  fields: {
    name: { label: "आपका नाम", placeholder: "रमेश कुमार" },
    mobile: { label: "आपका मोबाइल", placeholder: "अपना मोबाइल नंबर" },
    email: {
      label: "आपका ईमेल",
      placeholder: "अपना ईमेल लिखिए",
      hint: "आपकी शिकायत का नंबर इसी पते पर भेजा जाएगा।",
    },
    outlet: {
      label: "पंप का नाम या SAP कोड",
      placeholder: "साईं पेट्रोलियम्स, अलीगढ़",
      hint: "अगर आप पंप चलाते हैं।",
    },
    message: {
      label: "क्या हुआ",
      placeholder:
        "बताइए क्या गड़बड़ हुई और कब। जितना खुलकर लिखेंगे, हमारे लिए मदद करना उतना आसान होगा।",
    },
  },

  categoryLegend: "किस बारे में है",
  /* The label only. The value the API is sent is the key itself and never
     changes with the language. */
  categories: {
    service: "हमारी सेवा",
    app: "डीलर कवच ऐप",
    billing: "बिल या भुगतान",
    staff: "हमारा स्टाफ़",
    privacy: "प्राइवेसी या आपकी जानकारी",
    other: "कुछ और",
  },

  messageCount: "{n} / {max}",
  messageShort: "थोड़ा और लिखिए, कम से कम 10 अक्षर।",

  errorGeneric: "आपकी शिकायत भेजी नहीं जा सकी। कृपया दोबारा कोशिश कीजिए।",
  errorBusy: "अभी हम आपकी और शिकायत नहीं ले पा रहे। कृपया कुछ देर बाद कोशिश कीजिए।",
  errorCallLink: "या अभी कॉल कीजिए",
  errorEnd: "।",
  errorField: {
    email: "ईमेल पता ठीक नहीं लग रहा। कृपया एक बार देख लीजिए।",
    mobile: "मोबाइल नंबर ठीक नहीं लग रहा। कृपया एक बार देख लीजिए।",
    message: "“क्या हुआ” वाले ख़ाने में जो लिखा है, उसे एक बार देख लीजिए।",
  },

  privacy: "आपकी जानकारी हम सिर्फ़ इस शिकायत को देखने और आपको जवाब देने में इस्तेमाल करेंगे।",
  submit: "शिकायत भेजिए",
  submitting: "भेजा जा रहा है…",

  success: {
    badge: "शिकायत मिल गई",
    heading: "धन्यवाद। आपकी शिकायत हमारे पास पहुँच गई है।",
    numberLabel: "आपकी शिकायत का नंबर",
    emailed: "हमने आपका शिकायत नंबर {email} पर भेज दिया है। न दिखे तो स्पैम फ़ोल्डर देख लीजिए।",
    notEmailed: "कृपया यह नंबर कहीं लिख लीजिए। {email} पर कोई ईमेल न पहुँचे, तो आपको बस यही नंबर चाहिए।",
    keep: "इस बारे में जब भी कॉल करें या लिखें, हमें यह नंबर बता दीजिए।",
    bodyLead: "हमारी टीम से कोई इसे देखेगा और आपको जवाब देगा। इंतज़ार नहीं कर सकते?",
    callLink: "सीधे कॉल कीजिए",
    bodyEnd: "।",
  },
};
