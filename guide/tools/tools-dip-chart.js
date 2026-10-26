(function () {
  // The dip-chart reader on /tools/dip-chart-calculator/ (and the Hindi twin).
  // It carries NO chart. The reader types two neighbouring rows of THEIR OWN tank's calibration
  // chart (dip and litres for each) and a dip reading between them; the tool reads the litres in a
  // straight line between the rows:  litres = L1 + (dip - d1) x (L2 - L1) / (d2 - d1).
  // Optionally the litres of water (read from the same chart) are taken off. Any unit of dip works
  // (cm or mm) as long as all three dip boxes use the same one.
  // Everything happens in the reader's browser; nothing is stored or sent.
  var hi = (document.documentElement.lang || "en").slice(0, 2) === "hi";
  var T = hi ? {
    need: "दोनों पंक्तियों का डिप और लीटर, और अपना डिप भरें। सब सादी संख्या में, जैसे 120.5 या 9,060।",
    same: "दोनों पंक्तियों का डिप अलग-अलग होना चाहिए।",
    up: "डिप बढ़ने पर लीटर भी बढ़ने चाहिए। दोनों पंक्तियाँ अपने चार्ट से दोबारा मिलाएँ।",
    outside: "आपका डिप इन दोनों पंक्तियों के बीच में नहीं है। अपने चार्ट में डिप के दोनों तरफ़ की पंक्तियाँ लें।",
    badW: "पानी के खाने में लीटर की सादी संख्या भरें, या ख़ाली छोड़ें।",
    moreW: "पानी के लीटर कुल लीटर से ज़्यादा नहीं हो सकते। पानी के लीटर अपने चार्ट से दोबारा देखें।",
    big: "कोई आँकड़ा बहुत बड़ा लग रहा है। शून्य गिनकर फिर देखें।",
    head: function (r, l) { return "डिप " + r + " पर: " + l + " लीटर"; },
    kl: function (k) { return "यानी " + k + " KL"; },
    work: function (l1, r, d1, l2, d2, res) { return "हिसाब: " + l1 + " + (" + r + " − " + d1 + ") × (" + l2 + " − " + l1 + ") ÷ (" + d2 + " − " + d1 + ") = " + res + " लीटर"; },
    perUnit: function (x) { return "इन दो पंक्तियों के बीच डिप की 1 इकाई (cm या mm, जैसा आपने भरा) " + x + " लीटर की है।"; },
    water: function (w, p, k) { return "पानी " + w + " लीटर घटाने पर तेल: " + p + " लीटर (" + k + " KL)।"; },
    exact: "आपका डिप ठीक एक पंक्ति पर है, इसलिए चार्ट का अपना आँकड़ा ही आया।",
    foot: "सिर्फ़ आपके टैंक का अपना जाँचा हुआ चार्ट मान्य है: हर टैंक का चार्ट अलग होता है, और यहाँ कोई चार्ट नहीं है। दो पंक्तियों के बीच सीधी रेखा से पढ़ना आम चलन है, MDG का नियम नहीं। पंक्तियाँ जितनी पास होंगी, नतीजा चार्ट के उतना पास होगा।"
  } : {
    need: "Type the dip and litres of both rows, and your own dip reading. All as plain numbers, for example 120.5 or 9,060.",
    same: "The two rows must have different dips.",
    up: "Litres should rise as the dip rises. Check both rows against your chart again.",
    outside: "Your dip is not between these two rows. Take the rows either side of your dip from your chart.",
    badW: "Type the water as a plain number of litres, or leave the box empty.",
    moreW: "The water cannot be more than the total litres. Check the water litres against your chart again.",
    big: "One of the figures looks too large. Count the zeros and try again.",
    head: function (r, l) { return "At a dip of " + r + ": " + l + " litres"; },
    kl: function (k) { return "That is " + k + " KL"; },
    work: function (l1, r, d1, l2, d2, res) { return "Working: " + l1 + " + (" + r + " − " + d1 + ") × (" + l2 + " − " + l1 + ") ÷ (" + d2 + " − " + d1 + ") = " + res + " litres"; },
    perUnit: function (x) { return "Between these two rows, 1 unit of dip (cm or mm, as you typed it) is " + x + " litres."; },
    water: function (w, p, k) { return "Less " + w + " litres of water, the product is " + p + " litres (" + k + " KL)."; },
    exact: "Your dip is exactly on a row, so this is the chart's own figure.",
    foot: "Only your own tank's calibrated chart counts: every tank has its own, and no chart is held here. Reading in a straight line between two rows is general practice, not an MDG rule. The closer the two rows, the closer the result to the chart."
  };
  var out = document.getElementById("dp-out");
  var BIG = 1e9;

  function num(id) {
    var s = document.getElementById(id).value.toLowerCase();
    if (s.normalize) s = s.normalize("NFC");
    s = s.replace(/[०-९]/g, function (c) { return String(c.charCodeAt(0) - 0x966); }).replace(/\s/g, "");
    s = s.replace(/(centimetres?|centimeters?|सेंटीमीटर|सेमी|cm|millimetres?|millimeters?|मिलीमीटर|मिमी|mm|litres?|liters?|ltrs?|लीटर|ltr|ली|l)$/, "");
    if (s === "") return null;
    if (/,.*,|,\d{3}(\D|$)/.test(s)) s = s.replace(/,/g, "");
    else s = s.replace(",", ".");
    return /^(\d+\.?\d*|\.\d+)$/.test(s) ? parseFloat(s) : NaN;
  }
  function round(x, p) { var k = Math.pow(10, p); return Math.round(x * k + 1e-9) / k; }
  /** 9030 -> "9,030" (Indian grouping), up to 'dec' decimals, trailing zeros dropped. */
  function fmt(x, dec) {
    var s = round(x, dec).toFixed(dec), p = s.split("."), i = p[0], r = i.slice(0, -3), f = (p[1] || "").replace(/0+$/, "");
    if (r) r = r.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + ",";
    return r + i.slice(-3) + (f ? "." + f : "");
  }
  function line(t, big) {
    var p = document.createElement("p");
    p.style.margin = "0 0 6px";
    if (big) { p.style.fontSize = "1.25em"; p.style.fontWeight = "700"; }
    p.textContent = t;
    out.appendChild(p);
  }

  function go() {
    var d1 = num("dp-d1"), l1 = num("dp-l1"), d2 = num("dp-d2"), l2 = num("dp-l2"), r = num("dp-r"), w = num("dp-w"), t;
    out.textContent = "";
    var all = [d1, l1, d2, l2, r];
    for (var i = 0; i < all.length; i++) if (all[i] === null || isNaN(all[i])) { line(T.need); return; }
    if (w !== null && isNaN(w)) { line(T.badW); return; }
    if (Math.max(d1, l1, d2, l2, r, w === null ? 0 : w) > BIG) { line(T.big); return; }
    if (d1 === d2) { line(T.same); return; }
    if (d1 > d2) { t = d1; d1 = d2; d2 = t; t = l1; l1 = l2; l2 = t; }
    if (l2 <= l1) { line(T.up); return; }
    if (r < d1 || r > d2) { line(T.outside); return; }
    var res = l1 + (r - d1) * (l2 - l1) / (d2 - d1);
    var slope = (l2 - l1) / (d2 - d1);
    line(T.head(fmt(r, 3), fmt(res, 1)), true);
    line(T.kl(fmt(res / 1000, 3)));
    if (r === d1 || r === d2) line(T.exact);
    else line(T.work(fmt(l1, 3), fmt(r, 3), fmt(d1, 3), fmt(l2, 3), fmt(d2, 3), fmt(res, 1)));
    line(T.perUnit(fmt(slope, 3)));
    if (w !== null && w > 0) {
      if (w > res + 1e-9) { out.textContent = ""; line(T.moreW); return; }
      line(T.water(fmt(w, 1), fmt(res - w, 1), fmt((res - w) / 1000, 3)));
    }
    line(T.foot);
  }

  document.getElementById("dp-go").addEventListener("click", go);
  ["dp-d1", "dp-l1", "dp-d2", "dp-l2", "dp-r", "dp-w"].forEach(function (id) {
    document.getElementById(id).addEventListener("keydown", function (e) { if (e.key === "Enter" || e.keyCode === 13) go(); });
  });
})();
