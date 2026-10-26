(function () {
  // The density-and-temperature table on /tools/density-temperature-chart/ (and the Hindi twin).
  // It runs the conversion of guide/tools/tools-density-at-15.js (ASTM Table 53B working, hydrometer
  // glass correction included, copied unchanged as to15) BACKWARDS: for a density at 15°C it finds,
  // by bisection, the hydrometer reading that to15 turns back into that density, at each temperature.
  // Everything happens in the reader's browser; nothing is stored or sent.
  var hi = (document.documentElement.lang || "en").slice(0, 2) === "hi";
  var T = hi ? {
    bad: "15°C की डेंसिटी 653 से 1075 kg/m³ के बीच भरें, जैसे 830। इससे बाहर के लिए छपी टेबल देखें।",
    badT: "दूसरा तापमान −18 से 95 °C के बीच भरें, या खाना ख़ाली छोड़ें।",
    head: function (d, f) { return "15°C पर डेंसिटी " + d + " kg/m³ (" + f + ")। हाइड्रोमीटर ये पढ़ेगा:"; },
    fuel: ["डीज़ल", "पेट्रोल"],
    th: ["सैंपल का तापमान", "हाइड्रोमीटर की रीडिंग (kg/m³)", "15°C की डेंसिटी से फ़र्क"],
    same: "वही",
    one: function (t, r) { return t + " °C पर हाइड्रोमीटर " + r + " kg/m³ पढ़ेगा।"; },
    rng: function (d, r) { return "यह " + d + " kg/m³ उन रेंज से बाहर है जो MDG 7.6 में छपी हैं (" + r + ")। अपनी डेंसिटी दोबारा देखें।"; },
    rngD: "डीज़ल 810-845, बायोडीज़ल ब्लेंड 820-860",
    rngP: "पेट्रोल 720-775",
    foot: "यह सिर्फ़ मददगार टूल है, ASTM टेबल 53B के उसी हिसाब को उलटा चलाकर। छपी टेबल, या आपकी तेल कंपनी का आँकड़ा ही मान्य है। रीडिंग सैंपल के अपने तापमान की है, टैंक या हवा के नहीं। एक दशमलव तक दिखाई गई है।"
  } : {
    bad: "Type the density at 15°C between 653 and 1075 kg/m³, for example 830. For anything outside that, use the printed table.",
    badT: "Type the other temperature between -18 and 95 °C, or leave the box empty.",
    head: function (d, f) { return "Density at 15°C: " + d + " kg/m³ (" + f + "). A hydrometer will read:"; },
    fuel: ["diesel", "petrol"],
    th: ["Sample temperature", "Hydrometer reads (kg/m³)", "Change from the 15°C density"],
    same: "same",
    one: function (t, r) { return "At " + t + " °C the hydrometer reads " + r + " kg/m³."; },
    rng: function (d, r) { return "Note: " + d + " kg/m³ is outside the ranges MDG 7.6 prints (" + r + "). Check your density again."; },
    rngD: "diesel 810-845, biodiesel blends 820-860",
    rngP: "petrol 720-775",
    foot: "A helper only: the ASTM Table 53B working of the density-at-15 calculator, run backwards. The printed table, or your oil company's figure, decides. The reading is for the sample's own temperature, not the tank's or the air's. Shown to one decimal."
  };
  var out = document.getElementById("dh-out");
  var TEMPS = [10, 15, 20, 25, 30, 35, 40, 45];

  function num(id) {
    var s = document.getElementById(id).value;
    if (s.normalize) s = s.normalize("NFC");
    s = s.replace(/[०-९]/g, function (c) { return String(c.charCodeAt(0) - 0x966); }).replace(/\s/g, "");
    if (s === "") return null;
    s = /,.*,|,\d{3}(\D|$)/.test(s) ? s.replace(/,/g, "") : s.replace(",", ".");
    return /^[-+−]?(\d+\.?\d*|\.\d+)$/.test(s) ? parseFloat(s.replace("−", "-")) : NaN;
  }

  // ---- copied unchanged from guide/tools/tools-density-at-15.js (go()), without the rounding ----
  function band(r) { return r < 770.35 ? 0 : r < 787.5 ? 1 : r < 838.5 ? 2 : 3; }
  function alpha(r, b) {
    if (b === 0) return 346.4228 / (r * r) + 0.4388 / r;
    if (b === 1) return -0.00336312 + 2680.3206 / (r * r);
    if (b === 2) return 594.5418 / (r * r);
    return 186.9696 / (r * r) + 0.4862 / r;
  }
  /** Hydrometer reading o at temperature t (°C) -> density at 15°C, as tools-density-at-15 works it out (before its 0.1 rounding). */
  function to15(o, t) {
    var dt = t - 15, rt = o * (1 - 0.000023 * dt - 0.00000002 * dt * dt), r = rt, i, b, a, nr;
    for (i = 0; i < 60; i++) {
      b = band(r);
      a = alpha(r, b);
      nr = rt / Math.exp(-a * dt * (1 + 0.8 * a * dt));
      if (Math.abs(nr - r) < 1e-7) { r = nr; break; }
      r = nr;
    }
    return r;
  }
  // ---- the new part: invert by bisection (to15 rises with the reading) ----
  function reading(r15, t) {
    var lo = r15 * 0.9, hi2 = r15 * 1.1, mid, i;
    for (i = 0; i < 80; i++) {
      mid = (lo + hi2) / 2;
      if (to15(mid, t) < r15) lo = mid; else hi2 = mid;
    }
    return (lo + hi2) / 2;
  }

  function r1(x) { return Math.round(x * 10 + 1e-9) / 10; }
  function sg(x) { return (x > 0 ? "+" : x < 0 ? "-" : "") + Math.abs(x).toFixed(1); }
  function line(t, big) {
    var p = document.createElement("p");
    p.style.margin = "0 0 6px";
    if (big) { p.style.fontWeight = "700"; }
    p.textContent = t;
    out.appendChild(p);
  }
  function cell(tag, text, right) {
    var c = document.createElement(tag);
    c.textContent = text;
    if (right) c.style.textAlign = "right";
    return c;
  }

  function go() {
    var f = document.getElementById("dh-f").value === "p" ? 1 : 0, d = num("dh-d"), x = num("dh-t");
    var i, tr, table, head, body, base;
    out.textContent = "";
    if (d === null || isNaN(d) || d < 653 || d > 1075) { line(T.bad); return; }
    if (isNaN(x) || (x !== null && (x < -18 || x > 95))) { line(T.badT); return; }
    base = r1(d);
    line(T.head(base.toFixed(1), T.fuel[f]), true);

    table = document.createElement("table");
    head = document.createElement("thead");
    tr = document.createElement("tr");
    for (i = 0; i < 3; i++) tr.appendChild(cell("th", T.th[i], i > 0));
    head.appendChild(tr);
    table.appendChild(head);
    body = document.createElement("tbody");
    for (i = 0; i < TEMPS.length; i++) {
      var rd = r1(reading(d, TEMPS[i]));
      tr = document.createElement("tr");
      tr.appendChild(cell("td", TEMPS[i] + " °C"));
      tr.appendChild(cell("td", rd.toFixed(1), true));
      tr.appendChild(cell("td", TEMPS[i] === 15 ? T.same : sg(r1(rd - base)), true));
      body.appendChild(tr);
    }
    table.appendChild(body);
    out.appendChild(table);

    if (x !== null) line(T.one(String(x), r1(reading(d, x)).toFixed(1)));
    var lo = f === 0 ? 810 : 720, up = f === 0 ? 860 : 775;
    if (d < lo || d > up) line(T.rng(base.toFixed(1), f === 0 ? T.rngD : T.rngP));
    line(T.foot);
  }

  document.getElementById("dh-go").addEventListener("click", go);
  ["dh-d", "dh-t"].forEach(function (id) {
    document.getElementById(id).addEventListener("keydown", function (e) { if (e.key === "Enter" || e.keyCode === 13) go(); });
  });
})();
