(function () {
  // The litres <-> kg converter on /tools/litres-to-kg/ (and the Hindi twin).
  // kg = litres x density (kg/m3) / 1000. The density box takes the density at 15°C; when it is
  // empty the middle of the range MDG 2024 lists in 7.6 is used (petrol 720-775, diesel 810-845).
  // Everything happens in the reader's browser; nothing is stored or sent.
  var hi = (document.documentElement.lang || "en").slice(0, 2) === "hi";
  var T = hi ? {
    needL: "लीटर की मात्रा भरें, जैसे 5,000 या 12 KL।",
    needK: "किलो की मात्रा भरें, जैसे 4,150 या 10 टन।",
    unitL: "इस खाने में लीटर या KL भरें, किलो नहीं।",
    unitK: "इस खाने में किलो या टन भरें, लीटर नहीं।",
    big: "यह मात्रा बहुत बड़ी लग रही है। शून्य गिनकर फिर देखें।",
    badD: "डेंसिटी 500 से 1200 kg/m³ के बीच भरें, जैसे 827.5। ख़ाली छोड़ेंगे तो MDG रेंज का बीच का आँकड़ा लगेगा।",
    ofFuel: function (f) { return f === 0 ? "डीज़ल" : "पेट्रोल"; },
    litres: "लीटर", kg: "kg", tonnes: "टन", kl: "KL",
    headL: function (a, f, r) { return a + " लीटर " + f + " = " + r + " kg"; },
    headK: function (a, f, r) { return a + " kg " + f + " = " + r + " लीटर"; },
    workL: function (a, d, r) { return "हिसाब: " + a + " लीटर × " + d + " kg/m³ ÷ 1,000 = " + r + " kg"; },
    workK: function (a, d, r) { return "हिसाब: " + a + " kg × 1,000 ÷ " + d + " kg/m³ = " + r + " लीटर"; },
    perL: function (d, w) { return "यानी 1 लीटर का वज़न " + w + " kg (डेंसिटी " + d + " kg/m³)।"; },
    mid: function (d, f, r) { return "इस्तेमाल हुई डेंसिटी: " + d + " kg/m³, यानी " + f + " के लिए MDG 7.6 की रेंज (" + r + ") का बीच का आँकड़ा। अपनी इनवॉइस या डेंसिटी रजिस्टर की 15°C वाली डेंसिटी भरेंगे तो हिसाब आपके माल का होगा।"; },
    own: function (d) { return "इस्तेमाल हुई डेंसिटी: " + d + " kg/m³ (आपकी भरी हुई)।"; },
    kgl: function (d) { return "आपने 0.83 जैसा आँकड़ा भरा, इसलिए इसे kg प्रति लीटर मानकर " + d + " kg/m³ लिया।"; },
    out: function (d, r) { return "ध्यान दें: " + d + " kg/m³ उन रेंज से बाहर है जो MDG 7.6 में छपी हैं (" + r + ")। डेंसिटी की रीडिंग दोबारा देखें।"; },
    midR: ["810 से 845", "720 से 775"],
    rngD: "डीज़ल 810-845, बायोडीज़ल ब्लेंड 820-860",
    rngP: "पेट्रोल 720-775",
    foot: "डेंसिटी 15°C पर नापी जाती है। गरम तापमान पर नापे लीटर का वज़न थोड़ा कम बैठता है, इसलिए नतीजा नज़दीक का है, ठीक-ठीक नहीं।"
  } : {
    needL: "Type the quantity in litres, for example 5,000 or 12 KL.",
    needK: "Type the weight in kg, for example 4,150 or 10 tonnes.",
    unitL: "This box takes litres or KL, not kg.",
    unitK: "This box takes kg or tonnes, not litres.",
    big: "That quantity looks too large. Count the zeros and try again.",
    badD: "Type a density between 500 and 1200 kg/m³, for example 827.5. Leave it empty to use the middle of the MDG range.",
    ofFuel: function (f) { return f === 0 ? "diesel" : "petrol"; },
    litres: "litres", kg: "kg", tonnes: "tonnes", kl: "KL",
    lit: function (n) { return n === 1 ? "litre" : "litres"; },
    headL: function (a, f, r, n) { return a + " " + this.lit(n) + " of " + f + " = " + r + " kg"; },
    headK: function (a, f, r, n) { return a + " kg of " + f + " = " + r + " " + this.lit(n); },
    workL: function (a, d, r, n) { return "Working: " + a + " " + this.lit(n) + " × " + d + " kg/m³ ÷ 1,000 = " + r + " kg"; },
    workK: function (a, d, r, n) { return "Working: " + a + " kg × 1,000 ÷ " + d + " kg/m³ = " + r + " " + this.lit(n); },
    perL: function (d, w) { return "So 1 litre weighs " + w + " kg (density " + d + " kg/m³)."; },
    mid: function (d, f, r) { return "Density used: " + d + " kg/m³, the middle of the MDG 7.6 range for " + f + " (" + r + "). Type the density at 15°C from your invoice or density register to work out your own load."; },
    own: function (d) { return "Density used: " + d + " kg/m³ (the figure you typed)."; },
    kgl: function (d) { return "You typed a figure like 0.83, so it was read as kg per litre: " + d + " kg/m³."; },
    out: function (d, r) { return "Note: " + d + " kg/m³ is outside the ranges MDG 7.6 prints (" + r + "). Check the density reading again."; },
    midR: ["810 to 845", "720 to 775"],
    rngD: "diesel 810-845, biodiesel blends 820-860",
    rngP: "petrol 720-775",
    foot: "Density is measured at 15°C. A litre measured at a warmer temperature weighs a little less, so treat the result as close, not exact."
  };

  // [low, high] of MDG 2024 clause 7.6 at 15°C; diesel's top is the biodiesel-blend top (860)
  var RANGE = [[810, 860], [720, 775]];
  var MID = [827.5, 747.5];
  var out = document.getElementById("lk-out");

  /** "3,00,000", "12 KL", "10 tonnes", "५,०००", "1.5 lakh": { v: number|null|NaN, u: "" | "vol" | "mass" }. */
  function read(id) {
    var s = document.getElementById(id).value.toLowerCase(), u = "", m, mult = 1;
    if (s.normalize) s = s.normalize("NFC");
    s = s.replace(/[०-९]/g, function (c) { return String(c.charCodeAt(0) - 0x966); });
    s = s.replace(/[\s₹]/g, "");
    if (s === "") return { v: null, u: "" };
    m = s.match(/(kilolitres?|kiloliters?|किलोलीटर|litres?|liters?|ltrs?|लीटर|kl|ltr|ली|l)$/);
    if (m) { u = "vol"; if (/^(kilo|किलो|kl)/.test(m[1])) mult = 1000; s = s.slice(0, -m[1].length); }
    else {
      m = s.match(/(kilograms?|किलोग्राम|किग्रा|kgs?|kilos?|किलो|tonnes?|tons?|टन|t)$/);
      if (m) { u = "mass"; if (/^(tonne|ton|टन|t$)/.test(m[1])) mult = 1000; s = s.slice(0, -m[1].length); }
    }
    m = s.match(/(lakhs?|lacs?|लाख|crores?|cr|करोड़?)$/);
    if (m) { mult *= /^(l|लाख)/.test(m[1]) ? 1e5 : 1e7; s = s.slice(0, -m[1].length); }
    if (/,.*,|,\d{3}(\D|$)/.test(s)) s = s.replace(/,/g, "");
    else s = s.replace(",", ".");
    return { v: /^(\d+\.?\d*|\.\d+)$/.test(s) ? parseFloat(s) * mult : NaN, u: u };
  }

  function round(x, p) { var k = Math.pow(10, p); return Math.round(x * k + 1e-9) / k; }
  /** 4137.5 -> "4,137.5" (Indian grouping), at most 'dec' decimals, trailing zeros dropped. */
  function fmt(x, dec) {
    var s = round(x, dec).toFixed(dec), neg = s.charAt(0) === "-", p, i, f;
    if (neg) s = s.slice(1);
    p = s.split(".");
    i = p[0]; f = p[1] || "";
    var r = i.slice(0, -3);
    if (r) r = r.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + ",";
    f = f.replace(/0+$/, "");
    return (neg ? "-" : "") + r + i.slice(-3) + (f ? "." + f : "");
  }
  function dec(x) { return x < 1 ? 3 : x < 100 ? 2 : x < 100000 ? 1 : 0; }

  function line(t, big) {
    var p = document.createElement("p");
    p.style.margin = "0 0 6px";
    if (big) { p.style.fontSize = "1.25em"; p.style.fontWeight = "700"; }
    p.textContent = t;
    out.appendChild(p);
  }

  function go() {
    var f = parseInt(document.getElementById("lk-f").value, 10) === 1 ? 1 : 0;
    var toKg = document.getElementById("lk-m").value !== "k2l";
    var a = read("lk-a"), d = read("lk-d"), dv, note = "", ownD;
    out.textContent = "";
    if (a.v === null || isNaN(a.v) || a.v <= 0) { line(toKg ? T.needL : T.needK); return; }
    if (toKg && a.u === "mass") { line(T.unitL); return; }
    if (!toKg && a.u === "vol") { line(T.unitK); return; }
    if (a.v > 1e9) { line(T.big); return; }
    if (d.u !== "" || (d.v !== null && isNaN(d.v))) { line(T.badD); return; }
    ownD = d.v !== null;
    dv = ownD ? d.v : MID[f];
    if (ownD && dv >= 0.5 && dv <= 1.2) { dv = round(dv * 1000, 3); note = T.kgl(fmt(dv, 1)); }
    if (dv < 500 || dv > 1200) { line(T.badD); return; }

    var res = toKg ? a.v * dv / 1000 : a.v * 1000 / dv;
    var A = fmt(a.v, dec(a.v)), D = fmt(dv, 1), R = fmt(res, dec(res));
    var name = T.ofFuel(f);
    line(toKg ? T.headL(A, name, R, a.v) : T.headK(A, name, R, res), true);
    line(toKg ? T.workL(A, D, R, a.v) : T.workK(A, D, R, res));
    if (toKg && res >= 1000) line("= " + fmt(res / 1000, 3) + " " + T.tonnes);
    if (!toKg && res >= 1000) line("= " + fmt(res / 1000, 3) + " " + T.kl);
    line(T.perL(D, fmt(dv / 1000, 4)));
    if (note) line(note);
    line(ownD ? T.own(D) : T.mid(D, name, T.midR[f]));
    if (dv < RANGE[f][0] || dv > RANGE[f][1]) line(T.out(D, f === 0 ? T.rngD : T.rngP));
    line(T.foot);
  }

  document.getElementById("lk-go").addEventListener("click", go);
  ["lk-a", "lk-d"].forEach(function (id) {
    document.getElementById(id).addEventListener("keydown", function (e) { if (e.key === "Enter" || e.keyCode === 13) go(); });
  });
})();
