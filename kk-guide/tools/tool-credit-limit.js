(function () {
  // The credit-limit calculator on /khata-kavach/credit/credit-limit-calculator/ (and the
  // Hindi twin). The rule of thumb from the credit-limit page: monthly purchase x credit
  // days / 30, half for a new customer, rounded down to the nearest Rs 1,000, and never
  // above what the owner says they could carry if the customer paid a month late.
  // Everything happens in the reader's browser; nothing is stored or sent.
  var hi = (document.documentElement.lang || "en").slice(0, 2) === "hi";
  var T = hi ? {
    need: "महीने की उधार ख़रीद रुपये में भरें, जैसे 3,00,000 या 3 लाख।",
    badCap: "आख़िरी खाने में रुपये की रकम भरें, या उसे ख़ाली छोड़ दें।",
    tooBig: "यह रकम बहुत बड़ी लग रही है। शून्य गिनकर फिर देखें।",
    head: "सुझाई गई उधार की सीमा: ",
    work: function (m, d, b) { return "महीने की ख़रीद " + m + " × " + d + " दिन ÷ 30 = " + b; },
    half: function (x) { return "नया ग्राहक, इसलिए आधा: " + x; },
    round: function (x) { return "हज़ार में नीचे गिराकर: " + x; },
    roundSmall: function (x) { return "सौ में नीचे गिराकर: " + x; },
    cap: function (c) { return "आपकी अपनी हद " + c + " इससे कम है, इसलिए " + c + " रखें।"; },
    capOk: function (c) { return "आपकी अपनी हद " + c + " इससे कम नहीं है, इसलिए ऊपर वाली सीमा ही रहेगी।"; },
    foot: "यह शुरुआत के लिए अंदाज़े का नियम है, कोई सलाह नहीं: आख़िरी फ़ैसला आपका अपना है। कुछ महीने समय पर पेमेंट हो तो सीमा बढ़ाएँ, पेमेंट खिसकने लगे तो घटाएँ। सीमा रुपये में रखें, लीटर या बोरी में नहीं।",
    zero: "इस हिसाब से उधार की सीमा ₹0 आती है। ख़रीद या उधार के दिन फिर से देखें।",
    capZero: "आपने अपनी हद ₹0 रखी है: फ़िलहाल इस ग्राहक को उधार न दें, नकद पर माल दें।"
  } : {
    need: "Type the monthly credit purchase in rupees, for example 3,00,000 or 3 lakh.",
    badCap: "Type a rupee amount in the last box, or leave it empty.",
    tooBig: "That figure looks too large. Count the zeros and try again.",
    head: "Suggested credit limit: ",
    work: function (m, d, b) { return "Monthly purchase " + m + " × " + d + " days ÷ 30 = " + b; },
    half: function (x) { return "New customer, so half: " + x; },
    round: function (x) { return "Rounded down to the nearest Rs 1,000: " + x; },
    roundSmall: function (x) { return "Rounded down to the nearest Rs 100: " + x; },
    cap: function (c) { return "Your own cap of " + c + " is lower, so use " + c + "."; },
    capOk: function (c) { return "Your own cap of " + c + " is not lower, so the limit above stands."; },
    foot: "A rule of thumb to start from, not advice: the final figure is your own decision. Raise it after a few months of on-time payment; lower it if payments slip. Keep the limit in rupees, not litres or bags.",
    zero: "This works out to a limit of Rs 0. Check the monthly purchase and the credit days.",
    capZero: "Your own cap is Rs 0: for now, sell to this customer for cash, not on credit."
  };

  var out = document.getElementById("cl-out");

  var BIG = 1e10; // Rs 1,000 crore: anything above is a typo
  var UNIT = "(रुपये|रुपए|रु\\.?|rs\\.?|inr)"; // longest first: रु is the start of रुपये

  /**
   * Rupees as typed: "3,00,000", "300000/-", "Rs 3 lakh", "₹1.5 लाख", "३,००,०००", "2 crore".
   * Empty is null; anything that is not a rupee amount is NaN.
   */
  function rupees(id) {
    var s = document.getElementById(id).value.toLowerCase();
    if (s.normalize) s = s.normalize("NFC"); // करोड़ typed either way ends up the same
    s = s.replace(/[०-९]/g, function (c) { return String(c.charCodeAt(0) - 0x966); });
    s = s.replace(/\/-\s*$/, "").replace(/[\s,₹]/g, "");
    s = s.replace(new RegExp("^" + UNIT), "").replace(new RegExp(UNIT + "$"), "");
    if (s === "") return null;
    var mult = 1, u = s.match(/(lakhs?|lacs?|लाख|crores?|cr|करोड\u093C?)$/);
    if (u) {
      mult = /^(l|लाख)/.test(u[1]) ? 1e5 : 1e7;
      s = s.slice(0, -u[1].length);
    }
    return /^(\d+\.?\d*|\.\d+)$/.test(s) ? parseFloat(s) * mult : NaN;
  }

  /** 150000 -> "Rs 1,50,000" (the Indian grouping), "₹1,50,000" on the Hindi page. Paise are dropped, never rounded up. */
  function inr(x) {
    var s = String(Math.floor(x + 1e-6)), r = s.slice(0, -3);
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
    var m = rupees("cl-m"), cap = rupees("cl-c"), d = parseInt(document.getElementById("cl-d").value, 10);
    var isNew = document.getElementById("cl-n").checked;
    if (m === null || isNaN(m) || m <= 0) { line(T.need); return; }
    if (cap !== null && (isNaN(cap) || cap < 0)) { line(T.badCap); return; }
    if (m > BIG || (cap !== null && cap > BIG)) { line(T.tooBig); return; }
    if (cap !== null && cap < 1) { line(T.capZero); return; }

    var steps = [];
    var base = m * d / 30;
    steps.push(T.work(inr(m), d, inr(base)));
    var x = base;
    if (isNew) { x = base / 2; steps.push(T.half(inr(x))); }
    var step = x >= 1000 ? 1000 : 100;
    var rounded = Math.floor(x / step) * step;
    if (rounded !== Math.floor(x + 1e-6)) steps.push(step === 1000 ? T.round(inr(rounded)) : T.roundSmall(inr(rounded)));
    var limit = rounded;
    if (cap !== null) {
      if (cap < limit) { limit = cap; steps.push(T.cap(inr(cap))); }
      else steps.push(T.capOk(inr(cap)));
    }
    if (limit <= 0) { line(T.zero); return; }

    line(T.head + inr(limit), true);
    for (var i = 0; i < steps.length; i++) line(steps[i]);
    var f = document.createElement("p");
    f.style.margin = "10px 0 0";
    f.style.fontSize = "0.92em";
    f.textContent = T.foot;
    out.appendChild(f);
  }

  document.getElementById("cl-go").addEventListener("click", go);
  ["cl-m", "cl-c"].forEach(function (id) {
    document.getElementById(id).addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
  });
})();
