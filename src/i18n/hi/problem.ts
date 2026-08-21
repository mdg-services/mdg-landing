import type { problem as EN } from "../en/problem";

export const problem: typeof EN = {
  sectionAria: "जो दिक्कत हम हल करते हैं",
  eyebrow: "दिक्कत",
  /** The navy tail is a key of its own, so the split sits where Hindi wants
      it: the count of portals leads, the dealer standing alone lands last. */
  headingLead: "9 पोर्टल। दर्जनों तारीख़ें।",
  headingAccent: "और आप अकेले।",
  intro:
    "ज़्यादातर डीलर हर हफ़्ते कई घंटे सरकारी और कंपनी के उन कामों में गँवा देते हैं जो उन्हें किसी ने सिखाए ही नहीं। और एक तारीख़ चूक जाए, तो सीधे नोटिस आ जाता है। Dealer's कवच यह पूरा बोझ अपने ऊपर ले लेता है।",

  /* ── The left-hand panel: the dealer carrying it alone ── */
  aloneLabel: "अपने दम पर",
  aloneBadge: "≈ 11 घंटे / हफ़्ता",
  /** Four worries, scattered as loose cards. The order matters: the tilt and
      position of each card live in Problem.tsx and are matched by index. */
  chaos: [
    "SDMS सब्सिडी एंट्री की तारीख़ निकल गई",
    "ऑडिट के लिए डेंसिटी लॉग नहीं मिल रहा",
    "Fire NOC 3 दिन में ख़त्म",
    "ऑटोमेशन बंद। वेंडर को कौन बुलाए?",
  ],

  /* ── The right-hand panel: the same four, handled ── */
  /** The gold कवच keeps its own span, so the label is written around it:
      Hindi puts the brand name before the mark and "के साथ" after it, which
      renders as "Dealer's कवच के साथ". */
  withLabelBefore: "Dealer's ",
  withLabelAfter: " के साथ",
  withBadge: "0 चूक",
  handled: [
    "SDMS सुबह 11 बजे की कट-ऑफ़ से पहले भर दिया",
    "लॉग पूरे साल इंस्पेक्शन के लिए तैयार",
    "Fire NOC 9 दिन पहले रिन्यू हो गया",
    "ऑटोमेशन 22 मिनट में दोबारा चालू",
  ],
};
