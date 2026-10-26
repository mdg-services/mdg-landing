(function () {
  // The dealer margin calculator on /tools/dealer-margin-calculator/ (and the Hindi twin).
  // It holds NO margin figure of its own: the margin per KL for petrol (MS) and diesel (HSD)
  // is whatever the reader types from their own oil company's latest margin letter.
  //   margin of a product = KL sold x margin per KL
  //   left = petrol margin + diesel margin - the month's costs
  //   per litre = margin (or what is left) / litres sold
  // Everything happens in the reader's browser; nothing is stored or sent.
  var hi = (document.documentElement.lang || "en").slice(0, 2) === "hi";
  var R = hi ? "₹" : "Rs ";
  var T = hi ? {
    names: ["पेट्रोल (MS)", "डीज़ल (HSD)"],
    short: ["पेट्रोल", "डीज़ल"],
    costs: ["तनख़्वाह", "बिजली", "किराया", "ब्याज", "बाकी ख़र्च"],
    needSales: "कम से कम एक तेल की महीने की बिक्री भरें, जैसे 100 (KL में) या 1 लाख (लीटर में)।",
    badSales: function (n) { return n + " की बिक्री सादी संख्या में भरें, जैसे 100 या 3 लाख।"; },
    needM: function (n) { return n + " की बिक्री भरी है, इसलिए उसका मार्जिन रुपये प्रति KL भी भरें। यह आँकड़ा अपनी तेल कंपनी की ताज़ा मार्जिन चिट्ठी से लें।"; },
    badM: function (n) { return n + " का मार्जिन रुपये प्रति KL की सादी संख्या में भरें।"; },
    badC: function (n) { return "ख़र्च का खाना (" + n + ") रुपये की सादी संख्या में भरें, या ख़ाली छोड़ें।"; },
    big: "कोई आँकड़ा बहुत बड़ा लग रहा है। शून्य गिनकर फिर देखें।",
    perL: "इस खाने में रुपये प्रति KL भरना है (1 KL = 1,000 लीटर)। आपका आँकड़ा प्रति लीटर का हो, तो उसे 1,000 से गुणा करें।",
    hintL: "आपने इकाई लीटर रखी है। यह KL में हो, तो इकाई का खाना बदलें।",
    hintK: "आपने इकाई KL रखी है। यह लीटर में हो, तो इकाई का खाना बदलें।",
    left: function (x) { return "ख़र्च के बाद बचा: " + x + " प्रति महीना"; },
    lack: function (x) { return "ख़र्च के बाद कमी: " + x + " प्रति महीना"; },
    prod: function (n, kl, m, g, pl) { return n + ": " + kl + " KL × " + m + " प्रति KL = " + g + " (" + pl + " प्रति लीटर)"; },
    gross: function (x) { return "कुल मार्जिन: " + x; },
    cost: function (x) { return "महीने का ख़र्च: " + x; },
    noCost: "ख़र्च नहीं भरा, इसलिए बचा हुआ आँकड़ा कुल मार्जिन के बराबर है।",
    litres: function (kl, l, g, n) { return "कुल बिक्री " + kl + " KL यानी " + l + " लीटर। प्रति लीटर: कुल मार्जिन " + g + (n ? ", ख़र्च के बाद बचा " + n : "") + "।"; },
    foot: "इस टूल में कोई मार्जिन का आँकड़ा पहले से नहीं है: यहाँ वही लगता है जो आप भरते हैं। मार्जिन तेल कंपनी तय करती और बदलती है, और कंपनी और तेल के हिसाब से अलग होता है, इसलिए ताज़ा चिट्ठी देखें। नतीजा इनकम टैक्स से पहले का है और उसमें ल्यूब या दुकान की कमाई शामिल नहीं।"
  } : {
    names: ["Petrol (MS)", "Diesel (HSD)"],
    short: ["petrol", "diesel"],
    costs: ["Salaries", "Power", "Rent", "Interest", "Other costs"],
    needSales: "Type the monthly sales of at least one fuel, for example 100 (in KL) or 1 lakh (in litres).",
    badSales: function (n) { return "Type the " + n + " sales as a plain number, for example 100 or 3 lakh."; },
    needM: function (n) { return "You typed " + n + " sales, so type its margin in rupees per KL too. Take the figure from your own oil company's latest margin letter."; },
    badM: function (n) { return "Type the " + n + " margin as a plain number in rupees per KL."; },
    badC: function (n) { return "Type the cost box (" + n + ") as a plain amount in rupees, or leave it empty."; },
    big: "One of the figures looks too large. Count the zeros and try again.",
    perL: "This box takes rupees per KL (1 KL = 1,000 litres). If your figure is per litre, multiply it by 1,000.",
    hintL: "The unit is set to litres. If this figure is in KL, change the unit box.",
    hintK: "The unit is set to KL. If this figure is in litres, change the unit box.",
    left: function (x) { return "Left after costs: " + x + " a month"; },
    lack: function (x) { return "Short after costs: " + x + " a month"; },
    prod: function (n, kl, m, g, pl) { return n + ": " + kl + " KL × " + m + " per KL = " + g + " (" + pl + " a litre)"; },
    gross: function (x) { return "Gross margin: " + x; },
    cost: function (x) { return "Costs for the month: " + x; },
    noCost: "No costs typed, so what is left equals the gross margin.",
    litres: function (kl, l, g, n) { return "Total sales " + kl + " KL, or " + l + " litres. Per litre: gross margin " + g + (n ? ", left after costs " + n : "") + "."; },
    foot: "This tool holds no margin figure of its own: it uses only what you type. Margins are set and revised by the oil company and differ by company and product, so use your latest margin letter. The result is before income tax and leaves out any lubricant or shop income."
  };
  var out = document.getElementById("dm-out");
  var BIG = 1e12;

  /** "3,00,000", "3 lakh", "₹5,000", "१००", "300 kl": { v: number | null (empty) | NaN, u: "" | "kl" | "l" }. */
  function read(id) {
    var s = document.getElementById(id).value.toLowerCase(), mult = 1, m, u = "";
    if (s.normalize) s = s.normalize("NFC");
    s = s.replace(/[०-९]/g, function (c) { return String(c.charCodeAt(0) - 0x966); });
    s = s.replace(/\/-\s*$/, "").replace(/[\s₹]/g, "");
    s = s.replace(/^(रुपये|रुपए|रु\.?|rs\.?|inr)/, "").replace(/(रुपये|रुपए|रु\.?|rs\.?|inr)$/, "");
    m = s.match(/(kilolitres?|kiloliters?|किलोलीटर|kl)$/);
    if (m) { u = "kl"; s = s.slice(0, -m[1].length); }
    else {
      m = s.match(/(litres?|liters?|ltrs?|लीटर|ltr|ली|l)$/);
      if (m) { u = "l"; s = s.slice(0, -m[1].length); }
    }
    if (s === "") return { v: null, u: u };
    m = s.match(/(lakhs?|lacs?|लाख|crores?|cr|करोड\u093C?)$/);
    if (m) { mult = /^(l|लाख)/.test(m[1]) ? 1e5 : 1e7; s = s.slice(0, -m[1].length); }
    if (/,.*,|,\d{3}(\D|$)/.test(s)) s = s.replace(/,/g, "");
    else s = s.replace(",", ".");
    return { v: /^(\d+\.?\d*|\.\d+)$/.test(s) ? parseFloat(s) * mult : NaN, u: u };
  }
  function num(id) { return read(id).v; }

  /** 150000 -> "Rs 1,50,000" (Indian grouping), "₹1,50,000" on the Hindi page; nearest rupee. */
  function inr(x) {
    var neg = x < 0, s = String(Math.round(Math.abs(x) + 1e-9)), r = s.slice(0, -3);
    if (r) r = r.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + ",";
    return (neg ? "-" : "") + R + r + s.slice(-3);
  }
  /** a per-litre rupee amount: Rs 0.67 (more decimals only when two would show 0.00) */
  function paise(x) {
    var neg = x < 0, a = Math.abs(x), v = Math.round(a * 100 + 1e-9) / 100;
    return (neg ? "-" : "") + R + (v === 0 && a > 0 ? String(Math.round(a * 10000) / 10000) : v.toFixed(2));
  }
  /** the margin per KL as typed: Rs 1,000 or Rs 3.5 (up to two decimals kept) */
  function rate(x) {
    var v = Math.round(x * 100 + 1e-9) / 100, p = v.toFixed(2).split("."), r = p[0].slice(0, -3), f = p[1].replace(/0+$/, "");
    if (r) r = r.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + ",";
    return R + r + p[0].slice(-3) + (f ? "." + f : "");
  }
  /** plain count with Indian grouping and up to 3 decimals */
  function cnt(x) {
    var v = Math.round(x * 1000 + 1e-9) / 1000, p = v.toFixed(3).split("."), r = p[0].slice(0, -3), f = p[1].replace(/0+$/, "");
    if (r) r = r.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + ",";
    return r + p[0].slice(-3) + (f ? "." + f : "");
  }

  function line(t, big) {
    var p = document.createElement("p");
    p.style.margin = "0 0 6px";
    if (big) { p.style.fontSize = "1.25em"; p.style.fontWeight = "700"; }
    p.textContent = t;
    out.appendChild(p);
  }

  function go() {
    var toKL = document.getElementById("dm-u").value !== "l" ? 1 : 0.001;
    var sIds = ["dm-ms", "dm-hs"], mIds = ["dm-mm", "dm-hm"], cIds = ["dm-c1", "dm-c2", "dm-c3", "dm-c4", "dm-c5"];
    var i, s, m, c, tot = 0, gross = 0, lit = 0, hints = [], used = 0, lines = [];
    out.textContent = "";
    for (i = 0; i < 2; i++) {
      var rs = read(sIds[i]); s = rs.v; m = num(mIds[i]);
      if (s !== null && (isNaN(s) || s < 0)) { line(T.badSales(T.short[i])); return; }
      if (m !== null && (isNaN(m) || m < 0)) { line(T.badM(T.short[i])); return; }
      if (s === null || s === 0) continue;
      if (m === null) { line(T.needM(T.short[i])); return; }
      var f = rs.u === "kl" ? 1 : rs.u === "l" ? 0.001 : toKL;
      if (s * f > BIG || m > BIG) { line(T.big); return; }
      var k = s * f, g = k * m;
      if (m < 100 && hints.indexOf(T.perL) < 0) hints.push(T.perL);
      if (f === 1 && s > 50000 && hints.indexOf(T.hintK) < 0) hints.push(T.hintK);
      if (f !== 1 && s < 1000 && hints.indexOf(T.hintL) < 0) hints.push(T.hintL);
      lines.push(T.prod(T.names[i], cnt(k), rate(m), inr(g), paise(m / 1000)));
      gross += g; lit += k * 1000; used++;
    }
    if (!used) { line(T.needSales); return; }
    for (i = 0; i < cIds.length; i++) {
      c = num(cIds[i]);
      if (c !== null && (isNaN(c) || c < 0)) { line(T.badC(T.costs[i])); return; }
      if (c !== null) { if (c > BIG) { line(T.big); return; } tot += c; }
    }
    var anyCost = false;
    for (i = 0; i < cIds.length; i++) if (num(cIds[i]) !== null) anyCost = true;
    var left = gross - tot;
    line(anyCost ? (left >= 0 ? T.left(inr(left)) : T.lack(inr(-left))) : T.gross(inr(gross)), true);
    for (i = 0; i < lines.length; i++) line(lines[i]);
    if (anyCost) line(T.gross(inr(gross)));
    if (anyCost) line(T.cost(inr(tot))); else line(T.noCost);
    line(T.litres(cnt(lit / 1000), cnt(lit), paise(gross / lit), anyCost ? paise(left / lit) : ""));
    for (i = 0; i < hints.length; i++) line(hints[i]);
    line(T.foot);
  }

  document.getElementById("dm-go").addEventListener("click", go);
  ["dm-ms", "dm-hs", "dm-mm", "dm-hm", "dm-c1", "dm-c2", "dm-c3", "dm-c4", "dm-c5"].forEach(function (id) {
    document.getElementById(id).addEventListener("keydown", function (e) { if (e.key === "Enter" || e.keyCode === 13) go(); });
  });
})();
