import type { contact as EN } from "../en/contact";

export const contact: typeof EN = {
  eyebrow: "संपर्क कीजिए",
  headingLead: "सबसे आसान तरीक़ा है,",
  headingAccent: "बस एक कॉल।",
  intro:
    "फ़ोन एक असली इंसान उठाता है, आपकी अपनी भाषा में बात करता है, और सीधे-सीधे बता देता है कि हम आपके काम आ सकते हैं या नहीं।",

  /* The card stays bilingual in both languages: the number is printed as
     "Toll free" everywhere a dealer already sees it. */
  tollFree: "Toll free",
  tollFreeDeva: "नि:शुल्क",
  hours: "सुबह 9 से रात 9, हर दिन",
  hoursLower: "सुबह 9 से रात 9, हर दिन",
  tapToCall: "कॉल करने के लिए टैप कीजिए",

  callbackEyebrow: "कॉलबैक चाहिए?",
  callbackHeading: "अपना नंबर छोड़ दीजिए, हम कॉल कर लेंगे।",
  callbackNote: "एक घंटे के भीतर हमारी टीम कॉल कर लेती है, {hours}।",
  leaveNumber: "मेरा नंबर ले लीजिए",

  formAria: "कॉलबैक का अनुरोध",
  fields: {
    name: { label: "आपका नाम", placeholder: "रमेश कुमार" },
    outlet: { label: "पंप / आउटलेट", placeholder: "साईं पेट्रोलियम्स, अलीगढ़" },
    phone: { label: "फ़ोन", placeholder: "+91 9XXXXXXXXX" },
  },
  privacy: "आपका नंबर हम किसी के साथ साझा नहीं करेंगे।",
  submit: "कॉलबैक का अनुरोध भेजिए",
  submitting: "भेजा जा रहा है…",

  errorGeneric: "कुछ गड़बड़ हो गई। कृपया दोबारा कोशिश कीजिए।",
  errorCallLink: "या {phone} पर कॉल कीजिए",
  errorEnd: "।",

  success: {
    badge: "मिल गया",
    heading: "धन्यवाद। हम जल्द ही आपसे बात करेंगे।",
    bodyLead: "आमतौर पर हमारी टीम एक घंटे के भीतर कॉल कर लेती है। इंतज़ार नहीं कर सकते?",
    callLink: "सीधे कॉल कीजिए",
    bodyEnd: "।",
  },
};
