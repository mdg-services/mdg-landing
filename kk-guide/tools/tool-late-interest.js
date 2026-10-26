(function () {
  // The late-payment interest calculator on /khata-kavach/getting-paid/late-payment-interest-calculator/
  // (and the Hindi twin). The reader types the amount due, the days late (or the date it was due)
  // and a yearly rate of their own: the tool ships no rate, and sets none as a rule.
  //   Simple interest      = amount x rate x days / 365.
  //   Monthly compounding  = each full 30 days adds rate / 12 to the total owed; leftover days at simple.
  // Optionally it also shows what the late money costs the reader at their own borrowing rate.
  // Everything happens in the reader's browser; nothing is stored or sent.
  var hi = (document.documentElement.lang || "en").slice(0, 2) === "hi";
  var T = hi ? {
    needAmt: "बाकी रकम रुपये में भरें, जैसे 80,000 या 80 हज़ार।",
    needRate: "ग्राहक से तय की हुई सालाना ब्याज दर भरें। दर 0 से ऊपर होनी चाहिए।",
    badRate: "सालाना दर अंकों में भरें, % के साथ या उसके बिना।",
    rateHigh: "सालाना दर 100% से ऊपर टाइप की गलती लगती है। आपकी दर महीने की है तो उसे 12 से गुणा करें।",
    needLate: "कितने दिन की देर है यह भरें, या वह तारीख़ चुनें जब पैसे भरने थे।",
    badDays: "देर के दिन पूरी संख्या में भरें, जैसे 45।",
    daysBig: "3650 दिन (10 साल) से ज़्यादा टाइप की गलती लगती है। संख्या फिर देखें।",
    badDate: "तारीख़ फिर चुनें। दिन-महीना-साल लिखें, जैसे 25-10-2026।",
    future: "वह तारीख़ अभी आई नहीं है, इसलिए कोई देर नहीं हुई।",
    zeroDays: "अभी कोई देर नहीं है (0 दिन), इसलिए कोई ब्याज नहीं बनता।",
    badBorrow: "अपनी उधारी की ब्याज दर अंकों में भरें, या ख़ाली छोड़ दें।",
    tooBig: "यह रकम बहुत बड़ी लग रही है। शून्य गिनकर फिर देखें।",
    both: "आपने दिन और तारीख़ दोनों भरे हैं, इसलिए भरे हुए दिन गिने गए हैं।",
    head: function (d, x, m) { return d + " दिन की देर का ब्याज" + (m ? " (हर महीने जुड़ता हुआ)" : "") + ": " + x; },
    simple: function (a, r, d, i) { return "साधारण ब्याज: " + a + " × " + r + "% × " + d + " दिन ÷ 365 = " + i; },
    total: function (x) { return "रकम और ब्याज मिलाकर: " + x; },
    under: "30 दिन से कम की देर है, इसलिए जुड़ने के लिए पूरा महीना नहीं बना: हिसाब साधारण ब्याज जैसा ही है।",
    months: function (m, rm, r, a, b) { return "पूरे " + m + " महीने। हर महीना अब तक की कुल रकम पर " + rm + "% (" + r + "% ÷ 12) जोड़ता है: " + a + " बढ़कर " + b + " हो जाता है।"; },
    leftover: function (n, r, b) { return "बचे " + n + " दिन उस रकम पर " + r + "% × " + n + " ÷ 365 के हिसाब से: " + b + "।"; },
    cmpd: function (x) { return "हर महीने जुड़ने वाला ब्याज: " + x; },
    vsSimple: function (x) { return "तुलना के लिए, उसी पर साधारण ब्याज " + x + " बनता।"; },
    cost: function (a, b, d, c) { return "देर से आए पैसे की आपको क़ीमत, आपकी अपनी उधारी की दर पर: " + a + " × " + b + "% × " + d + " दिन ÷ 365 = " + c + "। ग्राहक से ब्याज लें या न लें, यह क़ीमत आपकी जेब से जाती है।"; },
    foot: "ब्याज लगाने का सबसे साफ़ मामला वह है जब ग्राहक ने बिक्री से पहले लिखकर हामी भरी हो: बिल पर, आपकी शर्तों में या उधार फ़ॉर्म में। कुछ तय न हुआ हो तो कोर्ट तय करता है। यह सिर्फ़ जोड़-घटाव है, कानूनी सलाह नहीं। Udyam रजिस्ट्रेशन वाले सप्लायर का अलग नियम है, जो यह टूल नहीं निकालता।"
  } : {
    needAmt: "Type the amount due in rupees, for example 80,000 or 80 thousand.",
    needRate: "Type the yearly interest rate you agreed with the customer. It must be above 0.",
    badRate: "Type the yearly rate as a number, with or without the % sign.",
    rateHigh: "A yearly rate above 100% looks like a typo. If your rate is per month, multiply it by 12.",
    needLate: "Type the days late, or pick the date the money was due.",
    badDays: "Type the days late as a whole number, for example 45.",
    daysBig: "More than 3650 days (10 years) looks like a typo. Check the number.",
    badDate: "Pick the date again. Use day, month and year, for example 25-10-2026.",
    future: "That date has not come yet, so nothing is late.",
    zeroDays: "Nothing is late yet (0 days), so there is no interest.",
    badBorrow: "Type your own borrowing rate as a number, or leave it empty.",
    tooBig: "That amount looks too large. Count the zeros and try again.",
    both: "You typed both the days and a date, so the days you typed were used.",
    head: function (d, x, m) { return "Interest for " + d + (d === 1 ? " day" : " days") + " late" + (m ? ", compounded monthly" : "") + ": " + x; },
    simple: function (a, r, d, i) { return "Simple interest: " + a + " × " + r + "% × " + d + (d === 1 ? " day" : " days") + " ÷ 365 = " + i; },
    total: function (x) { return "Amount plus interest: " + x; },
    under: "Under 30 days, so there is no full month to compound: it works out the same as simple interest.",
    months: function (m, rm, r, a, b) { return m + " full " + (m === 1 ? "month" : "months") + ". Each month adds " + rm + "% (" + r + "% ÷ 12) on the total so far: " + a + " grows to " + b + "."; },
    leftover: function (n, r, b) { return "Then the last " + n + " days at " + r + "% × " + n + " ÷ 365 on that total: " + b + "."; },
    cmpd: function (x) { return "Interest with monthly compounding: " + x; },
    vsSimple: function (x) { return "For comparison, simple interest on the same would be " + x + "."; },
    cost: function (a, b, d, c) { return "What the late money costs you, at your own borrowing rate: " + a + " × " + b + "% × " + d + (d === 1 ? " day" : " days") + " ÷ 365 = " + c + ". You pay this whether or not you charge the customer."; },
    foot: "The clearest case for charging interest is when the customer agreed to it in writing before the sale: on the bill, in your terms or on your credit form. Where nothing was agreed, a court decides. This is a sum, not legal advice. A supplier with Udyam registration has a separate rule, which this tool does not work out."
  };

  var out = document.getElementById("li-out");

  var BIG = 1e10; // Rs 1,000 crore: anything above is a typo
  var UNIT = "(रुपये|रुपए|रु\\.?|rs\\.?|inr)"; // longest first: रु is the start of रुपये

  function digits(s) { return s.replace(/[०-९]/g, function (c) { return String(c.charCodeAt(0) - 0x966); }); }

  /**
   * Rupees as typed: "80,000", "80000/-", "Rs 80 thousand", "₹1.5 लाख", "८०,०००", "80k".
   * Empty is null; anything that is not a rupee amount is NaN.
   */
  function rupees(id) {
    var s = document.getElementById(id).value.toLowerCase();
    if (s.normalize) s = s.normalize("NFC"); // करोड़ and हज़ार typed either way end up the same
    s = digits(s);
    s = s.replace(/\/-\s*$/, "").replace(/[\s,₹]/g, "");
    s = s.replace(new RegExp("^" + UNIT), "").replace(new RegExp(UNIT + "$"), "");
    if (s === "") return null;
    var mult = 1, u = s.match(/(thousand|k|हज़ार|हजार|lakhs?|lacs?|लाख|crores?|cr|करोड़?)$/);
    if (u) {
      var w = u[1];
      mult = /^(thousand|k|हज)/.test(w) ? 1e3 : /^(l|लाख)/.test(w) ? 1e5 : 1e7;
      s = s.slice(0, -w.length);
    }
    return /^(\d+\.?\d*|\.\d+)$/.test(s) ? parseFloat(s) * mult : NaN;
  }

  /** A rate as typed: "12", "12%", "१२ प्रतिशत", "1.5". Empty is null; anything else is NaN. */
  function percent(id) {
    var s = digits(document.getElementById(id).value.toLowerCase()).replace(/\s/g, "");
    s = s.replace(/(%|प्रतिशत|percent|pct|p\.?a\.?)$/, "");
    if (s === "") return null;
    return /^(\d+\.?\d*|\.\d+)$/.test(s) ? parseFloat(s) : NaN;
  }

  /** Days as typed: "45", "45 days", "४५ दिन". Empty is null; anything else is NaN. */
  function whole(id) {
    var s = digits(document.getElementById(id).value.toLowerCase()).replace(/\s/g, "");
    s = s.replace(/(days?|din|दिन)$/, "");
    if (s === "") return null;
    return /^\d+$/.test(s) ? parseInt(s, 10) : NaN;
  }

  /** A date as the number of milliseconds at 00:00 UTC of that calendar day. "2026-10-25" or "25-10-2026" or "25/10/2026". */
  function dateOf(id) {
    var v = digits(document.getElementById(id).value).trim();
    if (v === "") return null;
    var m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(v), y, mo, d;
    if (m) { y = +m[1]; mo = +m[2]; d = +m[3]; }
    else {
      m = /^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/.exec(v);
      if (!m) return NaN;
      d = +m[1]; mo = +m[2]; y = +m[3];
    }
    var t = Date.UTC(y, mo - 1, d), c = new Date(t);
    if (y < 2000 || y > 2100 || c.getUTCFullYear() !== y || c.getUTCMonth() !== mo - 1 || c.getUTCDate() !== d) return NaN;
    return t;
  }

  function todayUtc() {
    var n = new Date();
    return Date.UTC(n.getFullYear(), n.getMonth(), n.getDate());
  }

  /** 150000 -> "Rs 1,50,000" (the Indian grouping), "₹1,50,000" on the Hindi page. Whole rupees, rounded to the nearest. */
  function inr(x) {
    var s = String(Math.round(x + 1e-9)), r = s.slice(0, -3);
    if (r) r = r.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + ",";
    return (hi ? "₹" : "Rs ") + r + s.slice(-3);
  }

  /** 12 -> "12", 0.8333 -> "0.833": a rate without trailing zeros. */
  function num(x, dp) { return String(parseFloat(x.toFixed(dp))); }

  function line(text, big) {
    var p = document.createElement("p");
    p.style.margin = "0 0 6px";
    if (big) { p.style.fontSize = "1.3em"; p.style.fontWeight = "700"; }
    p.textContent = text;
    out.appendChild(p);
  }

  function go() {
    out.textContent = "";
    var a = rupees("li-a"), rate = percent("li-r"), borrow = percent("li-b");
    var typedDays = whole("li-n"), due = dateOf("li-d");
    var method = document.getElementById("li-m").value === "monthly" ? "monthly" : "simple";

    if (a === null || isNaN(a) || a <= 0) { line(T.needAmt); return; }
    if (a > BIG) { line(T.tooBig); return; }
    if (rate === null || (!isNaN(rate) && rate <= 0)) { line(T.needRate); return; }
    if (isNaN(rate)) { line(T.badRate); return; }
    if (rate > 100) { line(T.rateHigh); return; }
    if (borrow !== null && isNaN(borrow)) { line(T.badBorrow); return; }
    if (borrow !== null && borrow > 100) { line(T.rateHigh); return; }

    var d, usedBoth = false;
    if (typedDays !== null) {
      if (isNaN(typedDays)) { line(T.badDays); return; }
      d = typedDays;
      usedBoth = due !== null;
    } else if (due !== null) {
      if (isNaN(due)) { line(T.badDate); return; }
      var gap = Math.round((todayUtc() - due) / 86400000);
      if (gap < 0) { line(T.future); return; }
      d = gap;
    } else { line(T.needLate); return; }
    if (d > 3650) { line(T.daysBig); return; }
    if (d < 1) { line(T.zeroDays); return; }

    a = Math.round(a);
    var r = rate / 100, simple = a * r * d / 365, steps = [], months = Math.floor(d / 30), rest = d - months * 30;
    var interest = Math.round(simple + 1e-9), compound = method === "monthly" && months > 0;
    if (method === "monthly" && !compound) steps.push(T.under);
    if (compound) {
      var bal = a * Math.pow(1 + r / 12, months), end = bal * (1 + r * rest / 365);
      interest = Math.round(end - a + 1e-9);
      steps.push(T.months(months, num(rate / 12, 3), num(rate, 2), inr(a), inr(bal)));
      if (rest > 0) steps.push(T.leftover(rest, num(rate, 2), inr(end)));
      steps.push(T.cmpd(inr(interest)));
      steps.push(T.vsSimple(inr(simple)));
    } else {
      steps.push(T.simple(inr(a), num(rate, 2), d, inr(interest)));
    }

    line(T.head(d, inr(interest), compound), true);
    for (var i = 0; i < steps.length; i++) line(steps[i]);
    line(T.total(inr(a + interest)));
    if (borrow !== null && borrow > 0) line(T.cost(inr(a), num(borrow, 2), d, inr(a * borrow / 100 * d / 365)));
    if (usedBoth) line(T.both);
    var f = document.createElement("p");
    f.style.margin = "10px 0 0";
    f.style.fontSize = "0.92em";
    f.textContent = T.foot;
    out.appendChild(f);
  }

  document.getElementById("li-go").addEventListener("click", go);
  ["li-a", "li-n", "li-r", "li-b"].forEach(function (id) {
    document.getElementById(id).addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
  });
})();
