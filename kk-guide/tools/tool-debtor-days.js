(function () {
  // The debtor days calculator on /khata-kavach/getting-paid/debtor-days-calculator/ (and the
  // Hindi twin). Debtor days = udhar outstanding today / credit sales in the last 30, 90 or 365
  // days x those days. Compared only with the credit days the reader gives: no industry figure.
  // Everything happens in the reader's browser; nothing is stored or sent.
  var hi = (document.documentElement.lang || "en").slice(0, 2) === "hi";
  var T = hi ? {
    needO: "आज कुल कितना उधार बाकी है, रुपये में भरें, जैसे 4,50,000 या 4.5 लाख। कुछ बाकी न हो तो 0 भरें।",
    needS: "चुने हुए दिनों की उधार की बिक्री रुपये में भरें, जैसे 9,00,000 या 9 लाख। यह 0 से ऊपर होनी चाहिए।",
    badC: "उधार के दिन पूरी संख्या में भरें, जैसे 15, या ख़ाली छोड़ दें।",
    tooBig: "यह रकम बहुत बड़ी लग रही है। शून्य गिनकर फिर देखें।",
    head: function (d) { return "देनदार दिन (debtor days): " + d; },
    work: function (o, s, p, d) { return "बाकी " + o + " ÷ " + p + " दिन की उधार बिक्री " + s + " × " + p + " दिन = " + d + " दिन"; },
    perDay: function (x, p, n) { return "इन " + p + " दिनों में रोज़ की उधार बिक्री औसतन " + x + " रही। यानी जो बाकी है, वह लगभग " + n + " दिन की उधार बिक्री के बराबर है।"; },
    zero: "आज कुछ बाकी नहीं है, इसलिए देनदार दिन 0 हैं।",
    inside: function (c, d) { return "आप " + c + " दिन का उधार देते हैं और देनदार दिन " + d + " हैं: औसतन ट्रांसपोर्टर आपके उधार के दिनों के भीतर पेमेंट कर रहे हैं।"; },
    above: function (c, d, x) { return "आप " + c + " दिन का उधार देते हैं और देनदार दिन " + d + " हैं: तय से " + x + " दिन ज़्यादा। कुछ ट्रांसपोर्टर देर से पेमेंट कर रहे हैं।"; },
    well: function (c, d, x) { return "आप " + c + " दिन का उधार देते हैं और देनदार दिन " + d + " हैं: तय से " + x + " दिन ज़्यादा। औसतन ट्रांसपोर्टर आपके उधार के दिनों के काफ़ी बाद पेमेंट कर रहे हैं।"; },
    expect: function (c, e, o, w) { return c + " दिन के उधार पर लगभग " + e + " बाकी होना चाहिए। आपका बाकी " + o + " है, यानी लगभग " + w + " तय समय से ज़्यादा रुका है।"; },
    longer: function (p) { return "देनदार दिन चुने हुए " + p + " दिनों से ज़्यादा निकले, यानी बाकी में कुछ पैसा उन बिक्रियों से भी पुराना है जो आपने गिनीं। " + (p < 365 ? "लंबी अवधि (365 दिन) चुनकर देखें, या आँकड़े जाँचें।" : "आँकड़े जाँचें।"); },
    foot: "देनदार दिन सारे ट्रांसपोर्टरों का औसत है: एक बड़ा देर वाला ट्रांसपोर्टर कई समय पर देने वालों के पीछे छिप सकता है, इसलिए हर ट्रांसपोर्टर का हिसाब अलग देखें। महीने-दर-महीने बिक्री बहुत घटे-बढ़े तो यह अंदाज़ा मोटा रहता है। इसकी तुलना सिर्फ़ अपने उधार के दिनों से करें; सब पंपों के लिए कोई एक तय आँकड़ा नहीं है।"
  } : {
    needO: "Type the total udhar outstanding today in rupees, for example 4,50,000 or 4.5 lakh. If nothing is outstanding, type 0.",
    needS: "Type your credit sales for the days you picked, in rupees, for example 9,00,000 or 9 lakh. It must be above 0.",
    badC: "Type the credit days as a whole number, for example 15, or leave it empty.",
    tooBig: "That figure looks too large. Count the zeros and try again.",
    head: function (d) { return "Debtor days: " + d; },
    work: function (o, s, p, d) { return o + " outstanding ÷ " + s + " credit sales in " + p + " days × " + p + " days = " + d + (d === 1 ? " day" : " days"); },
    perDay: function (x, p, n) { return "Over those " + p + " days you sold about " + x + " on credit a day, so what is outstanding is about " + n + (n === 1 ? " day" : " days") + " of credit sales."; },
    zero: "Nothing is outstanding today, so debtor days is 0.",
    inside: function (c, d) { return "You give " + c + " days' credit and debtor days is " + d + ": on average, transporters are paying inside your credit days."; },
    above: function (c, d, x) { return "You give " + c + " days' credit and debtor days is " + d + ": " + x + (x === 1 ? " day" : " days") + " longer than agreed. Some transporters are paying late."; },
    well: function (c, d, x) { return "You give " + c + " days' credit and debtor days is " + d + ": " + x + " days longer than agreed. On average, transporters are paying well after your credit days."; },
    expect: function (c, e, o, w) { return "With " + c + " days' credit you would expect about " + e + " outstanding. You have " + o + ", so about " + w + " is waiting longer than agreed."; },
    longer: function (p) { return "Debtor days came out longer than the " + p + " days you picked, so some of what is outstanding is older than the sales you counted. " + (p < 365 ? "Try 365 days, or check the figures." : "Check the figures."); },
    foot: "Debtor days is an average over all transporters: one big late transporter can hide behind many on-time ones, so look at each transporter's ageing too. It is rough when your sales rise or fall a lot from month to month. Compare it only with your own credit days; no single figure suits every pump."
  };

  var out = document.getElementById("dd-out");

  var BIG = 1e10; // Rs 1,000 crore: anything above is a typo
  var UNIT = "(रुपये|रुपए|रु\\.?|rs\\.?|inr)"; // longest first: रु is the start of रुपये

  function digits(s) { return s.replace(/[०-९]/g, function (c) { return String(c.charCodeAt(0) - 0x966); }); }

  /**
   * Rupees as typed: "4,50,000", "450000/-", "Rs 4.5 lakh", "₹9 लाख", "४,५०,०००", "80k".
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

  /** Days as typed: "15", "15 days", "१५ दिन". Empty is null; anything else is NaN. */
  function whole(id) {
    var s = digits(document.getElementById(id).value.toLowerCase()).replace(/\s/g, "");
    s = s.replace(/(days?|din|दिन)$/, "");
    if (s === "") return null;
    return /^\d+$/.test(s) ? parseInt(s, 10) : NaN;
  }

  /** 450000 -> "Rs 4,50,000" (the Indian grouping), "₹4,50,000" on the Hindi page. Whole rupees, rounded to the nearest. */
  function inr(x) {
    var s = String(Math.round(x + 1e-9)), r = s.slice(0, -3);
    if (r) r = r.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + ",";
    return (hi ? "₹" : "Rs ") + r + s.slice(-3);
  }

  function line(text, big) {
    var p = document.createElement("p");
    p.style.margin = "0 0 6px";
    if (big) { p.style.fontSize = "1.3em"; p.style.fontWeight = "700"; }
    p.textContent = text;
    out.appendChild(p);
  }

  function go() {
    out.textContent = "";
    var o = rupees("dd-o"), s = rupees("dd-s"), c = whole("dd-c");
    var p = parseInt(document.getElementById("dd-p").value, 10);
    if (p !== 30 && p !== 90 && p !== 365) p = 90;
    if (o === null || isNaN(o) || o < 0) { line(T.needO); return; }
    if (s === null || isNaN(s) || s <= 0) { line(T.needS); return; }
    if (c !== null && (isNaN(c) || c < 1)) { line(T.badC); return; }
    if (o > BIG || s > BIG) { line(T.tooBig); return; }
    if (c !== null && c > 365) { line(T.badC); return; }

    var days = o / s * p, shown = Math.round(days + 1e-9);
    line(T.head(shown), true);
    if (o === 0) { line(T.zero); return; }
    line(T.work(inr(o), inr(s), p, shown));
    line(T.perDay(inr(s / p), p, shown));
    if (days > p) line(T.longer(p));
    if (c !== null) {
      var extra = shown - c;
      if (shown <= c) line(T.inside(c, shown));
      else if (days > c * 1.5) line(T.well(c, shown, extra));
      else line(T.above(c, shown, extra));
      var expected = s / p * c;
      if (o > expected + 0.5) line(T.expect(c, inr(expected), inr(o), inr(o - expected)));
    }
    var f = document.createElement("p");
    f.style.margin = "10px 0 0";
    f.style.fontSize = "0.92em";
    f.textContent = T.foot;
    out.appendChild(f);
  }

  document.getElementById("dd-go").addEventListener("click", go);
  ["dd-o", "dd-s", "dd-c"].forEach(function (id) {
    document.getElementById(id).addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
  });
})();
