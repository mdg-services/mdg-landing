(function () {
  var hi = (document.documentElement.lang || "en").slice(0, 2) === "hi";
  var T = hi ? {
    bad: "डेंसिटी 653 से 1075 kg/m³ के बीच और तापमान −18 से 95 °C के बीच भरें। इससे बाहर की रीडिंग के लिए छपी टेबल देखें।",
    res: "15°C पर डेंसिटी: ", glass: "हाइड्रोमीटर के काँच का सुधार: ",
    b: ["इस्तेमाल की गई रेंज: पेट्रोल", "इस्तेमाल की गई रेंज: बीच का ट्रांज़िशन ज़ोन (लगभग 770 से 787.5)", "इस्तेमाल की गई रेंज: केरोसिन और हल्का डीज़ल (787.5 से 838.5)", "इस्तेमाल की गई रेंज: भारी डीज़ल और फ़्यूल ऑयल (838.5 से ऊपर)"],
    inv: "इनवॉइस डेंसिटी ", diff: "। अंतर ", dot: "।", ok: " यह ±3.0 kg/m³ की सीमा के अंदर है (MDG 1.2(iv))।",
    no: " यह ±3.0 kg/m³ की सीमा से बाहर है (MDG 1.2(iv))। रीडिंग दोबारा जाँचें। फिर भी माल पर शक हो तो सप्लाई लोकेशन या एरिया फ़ील्ड ऑफ़िसर से बात करें (MDG 1.2(ix))।",
    near: " अंतर सीमा से 0.3 के भीतर है, इसलिए छपी टेबल से मिलाकर पक्का करें।",
    rng: "यह आँकड़ा उन रेंज से बाहर है जो MDG 7.6 में छपी हैं (पेट्रोल 720-775, डीज़ल 810-845, बायोडीज़ल ब्लेंड 820-860)। हाइड्रोमीटर और थर्मामीटर की रीडिंग दोबारा देखें।",
    foot: "यह सिर्फ़ मददगार टूल है। इसमें और छपी ASTM टेबल 53B में फ़र्क हो, तो टेबल (या आपकी तेल कंपनी का आँकड़ा) ही मान्य है। टेबल में एक दशमलव छपता है, इसलिए आख़िरी अंक अलग हो सकता है।"
  } : {
    bad: "Enter the density between 653 and 1075 kg/m³ and the temperature between -18 and 95 °C. For readings outside that, use the printed table.",
    res: "Density at 15°C: ", glass: "Hydrometer glass correction: ",
    b: ["Range used: petrol (gasoline)", "Range used: transition zone between petrol and kerosene (about 770 to 787.5)", "Range used: kerosene and lighter diesel (787.5 to 838.5)", "Range used: heavier diesel and fuel oil (above 838.5)"],
    inv: "Invoice density ", diff: ". Difference ", dot: ".", ok: " Within ±3.0 kg/m³ (MDG 1.2(iv)).",
    no: " Outside ±3.0 kg/m³ (MDG 1.2(iv)). Check the readings again. If you still doubt the quality, contact the supply location or the area field officer (MDG 1.2(ix)).",
    near: " The difference is within 0.3 of the limit, so confirm it in the printed table.",
    rng: "This figure is outside the ranges MDG 7.6 prints (petrol 720-775, diesel 810-845, biodiesel blends 820-860). Check the hydrometer and thermometer readings again.",
    foot: "A helper only. If this and the printed ASTM Table 53B differ, the table (or your oil company's figure) decides. The printed table shows one decimal, so the last digit can differ."
  };
  var out = document.getElementById("dt-out");
  function val(id) {
    var s = document.getElementById(id).value.replace(/\s/g, "");
    s = /,\d{3}(\D|$)/.test(s) ? s.replace(/,/g, "") : s.replace(",", ".");
    return /^[-+]?(\d+\.?\d*|\.\d+)$/.test(s) ? parseFloat(s) : NaN;
  }
  function band(r) { return r < 770.35 ? 0 : r < 787.5 ? 1 : r < 838.5 ? 2 : 3; }
  function alpha(r, b) {
    if (b === 0) return 346.4228 / (r * r) + 0.4388 / r;
    if (b === 1) return -0.00336312 + 2680.3206 / (r * r);
    if (b === 2) return 594.5418 / (r * r);
    return 186.9696 / (r * r) + 0.4862 / r;
  }
  function sg(x) { return (x > 0 ? "+" : x < 0 ? "-" : "") + Math.abs(x).toFixed(1); }
  function line(t, big) {
    var p = document.createElement("p");
    p.style.margin = "0 0 6px";
    if (big) { p.style.fontSize = "1.25em"; p.style.fontWeight = "700"; }
    p.textContent = t;
    out.appendChild(p);
  }
  function go() {
    var o = val("dt-d"), t = val("dt-t"), iv = val("dt-i"), i, r, a, dt, rt, b;
    out.textContent = "";
    if (isNaN(o) || isNaN(t) || o < 653 || o > 1075 || t < -18 || t > 95) { line(T.bad); return; }
    dt = t - 15;
    rt = o * (1 - 0.000023 * dt - 0.00000002 * dt * dt);
    r = rt;
    for (i = 0; i < 60; i++) {
      b = band(r);
      a = alpha(r, b);
      var nr = rt / Math.exp(-a * dt * (1 + 0.8 * a * dt));
      if (Math.abs(nr - r) < 1e-7) { r = nr; break; }
      r = nr;
    }
    r = Math.round(r * 10) / 10;
    line(T.res + r.toFixed(1) + " kg/m³", true);
    line(T.b[band(r)]);
    line(T.glass + sg(rt - o) + " kg/m³");
    if (r < 720 || (r > 775 && r < 810) || r > 860) line(T.rng);
    if (!isNaN(iv)) {
      var d = Math.round((r - iv) * 10) / 10, ad = Math.abs(d);
      line(T.inv + iv.toFixed(1) + " kg/m³" + T.diff + sg(d) + " kg/m³" + T.dot + (ad <= 3 ? T.ok : T.no) + (ad >= 2.7 && ad <= 3.3 ? T.near : ""));
    }
    line(T.foot);
  }
  document.getElementById("dt-go").addEventListener("click", go);
  var ids = ["dt-d", "dt-t", "dt-i"];
  for (var k = 0; k < ids.length; k++) {
    document.getElementById(ids[k]).addEventListener("keydown", function (e) { if (e.key === "Enter" || e.keyCode === 13) go(); });
  }
})();
