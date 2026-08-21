import type { footer as EN } from "../en/footer";

export const footer: typeof EN = {
  /* ── the brand column ── */
  promise: "भारत के पेट्रोल पंप डीलरों के लिए कंप्लायंस सॉफ़्टवेयर।",
  satisfaction: "{tagline}. आपकी संतुष्टि ही हमारी ऊर्जा है।",
  /* The company name is printed in white in the middle of the sentence. Hindi
     puts the owner before the thing owned, so the first half is just the brand
     name and the comma, and the registration clause rides on the second. */
  legalBeforeName: "MDG Services, ",
  legalAfterName: " का एक ब्रांड है, जो भारत में रजिस्टर्ड कंपनी है (CIN {cin})।",

  /* ── the two link columns ── */
  exploreHeading: "और देखिए",
  explore: {
    services: "सेवाएँ",
    /* The top bar says "कैसे चलता है" here; the footer keeps its own shorter
       label, the way the English side does. */
    why: "हम क्यों",
    process: "प्रोसेस",
    membership: "क़ीमत",
    contact: "संपर्क कीजिए",
  },
  register: "रजिस्टर कीजिए",

  reachHeading: "हमसे संपर्क",
  hours: "सुबह 9 से रात 9, हर दिन",

  /* ── the hairline at the bottom ── */
  copyright: "© {year} {name}. सभी अधिकार सुरक्षित।",
  brandLine: "MDG Services, {name} का एक ब्रांड · CIN: {cin}",
  privacy: "प्राइवेसी पॉलिसी",
  madeFor: "भारत के पेट्रोल पंप डीलरों के लिए बनाया गया",
};
