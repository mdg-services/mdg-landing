(function () {
  // The "Is my density good?" checker on /tools/is-my-density-good/ (and the Hindi twin).
  // Conversion to 15°C: the band(), alpha() and iteration below are copied unchanged from
  // guide/tools/tools-density-at-15.js (go()), ASTM Table 53B working with the hydrometer glass
  // correction, including its rounding to one decimal. The ranges are those of MDG 2024 clause 7.6
  // and the invoice limit is +/- 3.0 kg/m3 (clause 1.2(iv)).
  // Everything happens in the reader's browser; nothing is stored or sent.
  var hi = (document.documentElement.lang || "en").slice(0, 2) === "hi";
  var T = hi ? {
    needD: "आपने जो डेंसिटी पढ़ी है, उसे kg/m³ में भरें, जैसे 828।",
    kgl: "यह kg प्रति लीटर जैसा लग रहा है। kg/m³ में भरें: 0.828 को 828 लिखें।",
    badD: "डेंसिटी 500 से 1200 kg/m³ के बीच भरें, जैसे 828।",
    badDT: "तापमान के साथ डेंसिटी 653 से 1075 kg/m³ के बीच भरें। इससे बाहर की रीडिंग के लिए छपी ASTM टेबल देखें।",
    badT: "तापमान −18 से 95 °C के बीच भरें, जैसे 30, या खाना ख़ाली छोड़ें।",
    badI: "इनवॉइस की डेंसिटी संख्या में भरें, जैसे 831.5, या खाना ख़ाली छोड़ें।",
    fuel: ["पेट्रोल", "डीज़ल (B7 तक)", "डीज़ल ब्लेंड (B8–B20)"],
    verdict: function (ok, r, name, lo, up) { return (ok ? "रेंज के अंदर" : "रेंज के बाहर") + " (MDG 7.6): 15°C पर " + r + " kg/m³, " + name + " की रेंज " + lo + "–" + up + "।"; },
    conv: function (o, t, r) { return "आपकी रीडिंग " + o + " kg/m³ (" + t + " °C पर) 15°C पर " + r + " kg/m³ बनती है।"; },
    noT: function (r) { return "तापमान नहीं भरा, इसलिए " + r + " को 15°C की डेंसिटी माना गया है। गरम या ठंडे सैंपल की रीडिंग पहले बदलनी होती है: उसी सैंपल का तापमान भरें।"; },
    toBlend: "यह B8–B20 ब्लेंड की रेंज, 820–860 kg/m³, के अंदर है। आपकी सप्लाई ब्लेंड हो तो वही विकल्प चुनें।",
    toDiesel: "यह B7 तक के डीज़ल की रेंज, 810–845 kg/m³, के अंदर है। आपकी सप्लाई B7 तक की हो तो वही विकल्प चुनें।",
    toDieselFromPetrol: "यह आँकड़ा डीज़ल की रेंज में है। देख लें कि ईंधन सही चुना है।",
    toPetrolFromDiesel: "यह आँकड़ा पेट्रोल की रेंज में है। देख लें कि ईंधन सही चुना है।",
    inv: "इनवॉइस डेंसिटी ", diff: "। अंतर ", dot: "।",
    ok: " यह ±3.0 kg/m³ की सीमा के अंदर है (MDG 1.2(iv))।",
    no: " यह ±3.0 kg/m³ की सीमा से बाहर है (MDG 1.2(iv))।",
    near: " अंतर सीमा से 0.3 के भीतर है, इसलिए छपी टेबल से मिलाकर पक्का करें।",
    assam: "असम क्रूड से बने ईंधन में छूट, अगर कोई हो, भारत सरकार की अधिसूचनाओं से तय हो सकती है (MDG 7.6 का फ़ुटनोट)। MDG छूट वाला आँकड़ा नहीं छापता: अपनी तेल कंपनी से पूछें।",
    todo: "आम चलन, MDG का नियम नहीं: उसी सैंपल में हाइड्रोमीटर और थर्मामीटर दोबारा पढ़ें, 15°C पर बदलें और फिर मिलाएँ। टैंकर की क्वालिटी पर फिर भी शक हो तो MDG सप्लाई लोकेशन या एरिया फ़ील्ड ऑफ़िसर से संपर्क करने को कहता है (MDG 1.2(ix))। अपने टैंक के लिए अपनी तेल कंपनी से पूछें।",
    foot: "यह सिर्फ़ मददगार टूल है। छपी ASTM टेबल 53B, या आपकी तेल कंपनी का आँकड़ा ही मान्य है। रेंज के अंदर का आँकड़ा किसी दूसरे आँकड़े से बेहतर या खराब नहीं माना जाता। आप जो भरते हैं, वह न रखा जाता है, न भेजा जाता है।"
  } : {
    needD: "Type the density you read, in kg/m³, for example 828.",
    kgl: "That looks like kg per litre. Type it in kg/m³, so 0.828 becomes 828.",
    badD: "Type the density between 500 and 1200 kg/m³, for example 828.",
    badDT: "With a temperature, type the density between 653 and 1075 kg/m³. For a reading outside that, use the printed ASTM table.",
    badT: "Type the temperature between -18 and 95 °C, for example 30, or leave the box empty.",
    badI: "Type the invoice density as a number, for example 831.5, or leave the box empty.",
    fuel: ["petrol", "diesel (up to B7)", "diesel blend (B8–B20)"],
    verdict: function (ok, r, name, lo, up) { return (ok ? "Inside the range" : "Outside the range") + " (MDG 7.6): " + r + " kg/m³ at 15°C, against " + lo + "–" + up + " for " + name + "."; },
    conv: function (o, t, r) { return "Your reading " + o + " kg/m³ at " + t + " °C converts to " + r + " kg/m³ at 15°C."; },
    noT: function (r) { return "No temperature typed, so " + r + " is taken as the density at 15°C. A reading taken warm or cold must be converted first: type the temperature of the same sample."; },
    toBlend: "It is inside the B8–B20 blend range, 820–860 kg/m³. If your supply is a blend, pick that option.",
    toDiesel: "It is inside the range for diesel up to B7, 810–845 kg/m³. If your supply is up to B7, pick that option.",
    toDieselFromPetrol: "This number is in the diesel range. Check that you picked the right fuel.",
    toPetrolFromDiesel: "This number is in the petrol range. Check that you picked the right fuel.",
    inv: "Invoice density ", diff: ". Difference ", dot: ".",
    ok: " Within ±3.0 kg/m³ (MDG 1.2(iv)).",
    no: " Outside ±3.0 kg/m³ (MDG 1.2(iv)).",
    near: " The difference is within 0.3 of the limit, so confirm it in the printed table.",
    assam: "For fuel processed from Assam crude, a relaxed range, if any, may follow Government of India notices (MDG 7.6 footnote). MDG prints no relaxed figure: ask your oil company.",
    todo: "General practice, not an MDG rule: read the hydrometer and the thermometer again in the same sample, convert to 15°C and compare again. If you still doubt the quality of a tanker, MDG says to contact the supply location or the area field officer (MDG 1.2(ix)). For your own tank, ask your oil company.",
    foot: "A helper only. The printed ASTM Table 53B, or your oil company's figure, decides. A number inside the range is not better or worse than another number inside it. Nothing you type is stored or sent."
  };
  var RNG = { p: [720, 775], d: [810, 845], b: [820, 860] };
  var IDX = { p: 0, d: 1, b: 2 };
  var out = document.getElementById("dc-out");

  function num(id) {
    var s = document.getElementById(id).value;
    if (s.normalize) s = s.normalize("NFC");
    s = s.replace(/[०-९]/g, function (c) { return String(c.charCodeAt(0) - 0x966); })
      .replace(/[٠-٩]/g, function (c) { return String(c.charCodeAt(0) - 0x660); })
      .replace(/\s/g, "");
    if (s === "") return null;
    s = /,.*,|,\d{3}(\D|$)/.test(s) ? s.replace(/,/g, "") : s.replace(",", ".");
    return /^[-+−]?(\d+\.?\d*|\.\d+)$/.test(s) ? parseFloat(s.replace("−", "-")) : NaN;
  }

  // ---- copied unchanged from guide/tools/tools-density-at-15.js (go()) ----
  function band(r) { return r < 770.35 ? 0 : r < 787.5 ? 1 : r < 838.5 ? 2 : 3; }
  function alpha(r, b) {
    if (b === 0) return 346.4228 / (r * r) + 0.4388 / r;
    if (b === 1) return -0.00336312 + 2680.3206 / (r * r);
    if (b === 2) return 594.5418 / (r * r);
    return 186.9696 / (r * r) + 0.4862 / r;
  }
  /** Hydrometer reading o at temperature t (°C) -> density at 15°C, rounded to one decimal as the calculator shows it. */
  function to15(o, t) {
    var i, r, dt = t - 15, rt = o * (1 - 0.000023 * dt - 0.00000002 * dt * dt), b, a, nr;
    r = rt;
    for (i = 0; i < 60; i++) {
      b = band(r);
      a = alpha(r, b);
      nr = rt / Math.exp(-a * dt * (1 + 0.8 * a * dt));
      if (Math.abs(nr - r) < 1e-7) { r = nr; break; }
      r = nr;
    }
    return Math.round(r * 10) / 10;
  }
  // ---- end of the copied part ----

  function sg(x) { return (x > 0 ? "+" : x < 0 ? "-" : "") + Math.abs(x).toFixed(1); }
  function line(t, big) {
    var p = document.createElement("p");
    p.style.margin = "0 0 6px";
    if (big) { p.style.fontSize = "1.15em"; p.style.fontWeight = "700"; }
    p.textContent = t;
    out.appendChild(p);
  }
  function inRange(f, r) { return r >= RNG[f][0] && r <= RNG[f][1]; }

  function go() {
    var f = document.getElementById("dc-f").value, d, t, iv, r, ok, bad = false;
    if (!RNG[f]) f = "d";
    d = num("dc-d"); t = num("dc-t"); iv = num("dc-i");
    out.textContent = "";
    if (d === null || isNaN(d)) { line(T.needD); return; }
    if (t !== null && isNaN(t)) { line(T.badT); return; }
    if (t === null && d > 0.5 && d < 1.2) { line(T.kgl); return; }
    if (t === null && (d < 500 || d > 1200)) { line(T.badD); return; }
    if (t !== null && (d < 653 || d > 1075)) { line(T.badDT); return; }
    if (t !== null && (t < -18 || t > 95)) { line(T.badT); return; }
    if (iv !== null && (isNaN(iv) || iv < 500 || iv > 1200)) { line(T.badI); return; }

    r = t === null ? Math.round(d * 10) / 10 : to15(d, t);
    ok = inRange(f, r);
    bad = !ok;
    // With no temperature the number is taken as the 15°C figure: say so before the verdict,
    // so a hot-afternoon reading typed alone is not read as "inside".
    if (t === null) line(T.noT(r.toFixed(1)));
    line(T.verdict(ok, r.toFixed(1), T.fuel[IDX[f]], RNG[f][0], RNG[f][1]), true);
    if (t !== null) line(T.conv(d.toFixed(1), String(t), r.toFixed(1)));
    if (!ok) {
      if (f === "d" && inRange("b", r)) line(T.toBlend);
      else if (f === "b" && inRange("d", r)) line(T.toDiesel);
      else if (f === "p" && (inRange("d", r) || inRange("b", r))) line(T.toDieselFromPetrol);
      else if (f !== "p" && inRange("p", r)) line(T.toPetrolFromDiesel);
      if (f === "d" && !inRange("p", r)) line(T.assam);
    }
    if (iv !== null) {
      var g = Math.round((r - iv) * 10) / 10, ag = Math.abs(g);
      line(T.inv + iv.toFixed(1) + " kg/m³" + T.diff + sg(g) + " kg/m³" + T.dot + (ag <= 3 ? T.ok : T.no) + (ag >= 2.7 && ag <= 3.3 ? T.near : ""));
      if (ag > 3) bad = true;
    }
    if (bad) line(T.todo);
    line(T.foot);
  }

  document.getElementById("dc-go").addEventListener("click", go);
  ["dc-f", "dc-d", "dc-t", "dc-i"].forEach(function (id) {
    document.getElementById(id).addEventListener("keydown", function (e) { if (e.key === "Enter" || e.keyCode === 13) go(); });
  });
})();
