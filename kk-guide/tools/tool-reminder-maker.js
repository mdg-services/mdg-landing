(function () {
  // The payment reminder maker on /khata-kavach/getting-paid/payment-reminder-maker/ (and the
  // Hindi twin). Builds one message from the customer's name, the amount, the bill number(s), the
  // date it was due, an optional pay-by date and the business name, in Hindi, English or Hinglish
  // and in three tones: polite (first), firm (second), final (before new credit stops).
  // Wording follows the seven messages on the payment-reminder-messages page. No tone mentions
  // police or court. The message can be edited, copied, or opened in the reader's own WhatsApp
  // (https://wa.me/?text=..., no phone number). Everything happens in the reader's browser;
  // nothing is stored, and nothing is sent by us; the text reaches WhatsApp only when the reader taps the link and presses send there.
  var hi = (document.documentElement.lang || "en").slice(0, 2) === "hi";
  var T = hi ? {
    needAmt: "बाकी रकम रुपये में भरें, जैसे 48,500।",
    tooBig: "यह रकम बहुत बड़ी लग रही है। शून्य गिनकर फिर देखें।",
    badDue: "भरने की तारीख़ फिर चुनें। दिन-महीना-साल लिखें, जैसे 25-10-2026।",
    badBy: "'कब तक दें' की तारीख़ फिर चुनें। दिन-महीना-साल लिखें, जैसे 8-11-2026।",
    byPast: "'कब तक दें' की तारीख़ निकल चुकी है। आगे की तारीख़ चुनें, या उसे ख़ाली छोड़ दें।",
    tooLong: "नाम या बिल नंबर बहुत लंबा है। छोटा करके फिर देखें।",
    ready: "संदेश तैयार है। इसे पढ़ लें, जो बदलना हो बदलें, फिर कॉपी करें या WhatsApp में खोलें। भेजने का बटन WhatsApp में आप ख़ुद दबाएँगे।",
    copied: "कॉपी हो गया। अब WhatsApp खोलकर ग्राहक की चैट में चिपकाएँ।",
    copyFail: "कॉपी नहीं हो सका। संदेश को छूकर चुनें और ख़ुद कॉपी करें।",
    nothing: "पहले 'संदेश बनाएँ' दबाएँ।"
  } : {
    needAmt: "Type the amount still open in rupees, for example 48,500.",
    tooBig: "That amount looks too large. Count the zeros and try again.",
    badDue: "Pick the due date again. Use day, month and year, for example 25-10-2026.",
    badBy: "Pick the pay-by date again. Use day, month and year, for example 8-11-2026.",
    byPast: "The pay-by date has already passed. Pick a later date, or leave it empty.",
    tooLong: "The name or bill number is too long. Shorten it and try again.",
    ready: "Your message is ready. Read it, change anything you like, then copy it or open it in WhatsApp. You press send yourself, in WhatsApp.",
    copied: "Copied. Now open WhatsApp and paste it into the customer's chat.",
    copyFail: "Could not copy. Tap the message to select it and copy it yourself.",
    nothing: "Press \"Make the message\" first."
  };

  var out = document.getElementById("rm-out");
  var msg = document.getElementById("rm-msg");
  var act = document.getElementById("rm-act");
  var wa = document.getElementById("rm-wa");

  var BIG = 1e10; // Rs 1,000 crore: anything above is a typo
  var UNIT = "(रुपये|रुपए|रु\\.?|rs\\.?|inr)"; // longest first: रु is the start of रुपये

  function digits(s) { return s.replace(/[०-९]/g, function (c) { return String(c.charCodeAt(0) - 0x966); }); }

  /**
   * Rupees as typed: "48,500", "48500/-", "Rs 48.5 thousand", "₹1.5 लाख", "४८,५००", "48k".
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

  /** A text box's words on one line, with the spaces tidied. */
  function words(id) { return document.getElementById(id).value.replace(/\s+/g, " ").trim(); }

  /** 48500 -> "Rs 48,500" (the Indian grouping); "₹48,500" in a Hindi message. Paise only when there are some. */
  function inr(x, lang) {
    var fixed = Math.abs(x - Math.round(x)) < 0.005 ? String(Math.round(x)) : x.toFixed(2);
    var parts = fixed.split("."), s = parts[0], r = s.slice(0, -3);
    if (r) r = r.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + ",";
    return (lang === "hi" ? "₹" : "Rs ") + r + s.slice(-3) + (parts[1] ? "." + parts[1] : "");
  }

  /** 25 Oct 2026 -> "25 October" ("25 अक्टूबर"); the year only when it is not this year's. */
  function dayName(ms, lang, today) {
    var d = new Date(ms), y = d.getUTCFullYear();
    var names = lang === "hi" ? MONTHS_HI : MONTHS_EN;
    return d.getUTCDate() + " " + names[d.getUTCMonth()] + (y !== new Date(today).getUTCFullYear() ? " " + y : "");
  }
  var MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var MONTHS_HI = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];

  /**
   * The three tones in the three languages. `v` holds: name, bill, plural (more than one bill),
   * amt (already formatted), due and by (day names, or "" when not given), late (true when the money
   * was due on a day that has come, or no day was given), biz.
   */
  var MAKE = {
    en: function (tone, v) {
      var ref = v.bill ? "on " + (v.plural ? "Bills " : "Bill ") + v.bill : "on your account";
      var due = !v.due ? "is still open" : v.late ? "was due on " + v.due + " and is still open" : "is due on " + v.due;
      var head = "Namaste" + (v.name ? " " + v.name : "") + ". " + v.amt + " " + ref + " " + due + ".";
      var tail;
      if (tone === "polite") tail = "Please pay by UPI or at our counter, and tell us. Thank you.";
      else if (tone === "firm") tail = (v.late ? "We have not received it yet. " : "") + (v.by ? "Please pay by " + v.by + ", or call us today to settle a date." : "Please call us today to settle the date you will pay. We will note it.");
      else tail = (v.by ? "If we do not receive it by " + v.by + ", we will have to stop new credit on your account until it is cleared." : "Until it is cleared, we will have to stop new credit on your account.") + " We want to keep working together; please call us.";
      return head + " " + tail;
    },
    hl: function (tone, v) {
      var ref = v.bill ? "Bill " + v.bill + " ke" : "aapke khate ke";
      var due = !v.due ? "abhi baaki hain" : v.late ? v.due + " ko due the, abhi baaki hain" : v.due + " ko due hain";
      var head = "Namaste" + (v.name ? " " + v.name : "") + ", " + ref + " " + v.amt + " " + due + ".";
      var tail;
      if (tone === "polite") tail = "UPI se ya hamare counter par de dijiye aur hamein bata dijiye. Dhanyavaad.";
      else if (tone === "firm") tail = (v.late ? "Abhi tak nahi mile. " : "") + (v.by ? "Kripya " + v.by + " tak de dijiye, ya aaj phone karke nayi tareekh tay kar lijiye." : "Kis tareekh tak aa jayenge, aaj bata dijiye. Hum note kar lenge.");
      else tail = (v.by ? v.by + " tak nahi aaye to naya udhar rok denge." : "Jab tak ye nahi aate, naya udhar rok denge.") + " Hum saath kaam karte rehna chahte hain, ek baar phone kijiye.";
      return head + " " + tail;
    },
    hi: function (tone, v) {
      var ref = v.bill ? "बिल " + v.bill + " के" : "आपके खाते के";
      var due = !v.due ? "अभी बाकी हैं" : v.late ? "भरने की तारीख़ " + v.due + " थी और ये अभी बाकी हैं" : "भरने की तारीख़ " + v.due + " है";
      var head = "नमस्ते" + (v.name ? " " + v.name : "") + "। " + ref + " " + v.amt + " " + due + "।";
      var tail;
      if (tone === "polite") tail = "कृपया UPI से या हमारे काउंटर पर दे दीजिए और हमें बता दीजिए। धन्यवाद।";
      else if (tone === "firm") tail = (v.late ? "अभी तक मिले नहीं हैं। " : "") + (v.by ? "कृपया " + v.by + " तक दे दीजिए, या आज फ़ोन करके नई तारीख़ तय कर लीजिए।" : "आप किस तारीख़ तक दे देंगे, आज बता दीजिए। हम लिख लेंगे।");
      else tail = (v.by ? v.by + " तक नहीं मिले, तो आपके खाते पर नया उधार बंद करना पड़ेगा, जब तक यह चुक न जाए।" : "जब तक यह चुक नहीं जाता, आपके खाते पर नया उधार बंद करना पड़ेगा।") + " हम आगे भी साथ काम करना चाहते हैं; कृपया फ़ोन कीजिए।";
      return head + " " + tail;
    }
  };

  function say(text) { out.textContent = ""; var p = document.createElement("p"); p.textContent = text; out.appendChild(p); }

  function link() { wa.href = "https://wa.me/?text=" + encodeURIComponent(msg.value); }

  function go() {
    var amt = rupees("rm-a"), due = dateOf("rm-d"), by = dateOf("rm-by");
    var name = words("rm-n"), bill = digits(words("rm-b")), biz = words("rm-biz");
    var tone = document.getElementById("rm-t").value, lang = document.getElementById("rm-l").value;
    if (tone !== "firm" && tone !== "final") tone = "polite";
    if (lang !== "hi" && lang !== "hl") lang = "en";
    act.hidden = true;
    msg.value = "";
    if (amt === null || isNaN(amt) || amt <= 0) { say(T.needAmt); return; }
    if (amt > BIG) { say(T.tooBig); return; }
    if (name.length > 60 || bill.length > 40 || biz.length > 60) { say(T.tooLong); return; }
    if (due !== null && isNaN(due)) { say(T.badDue); return; }
    var today = todayUtc();
    if (by !== null && isNaN(by)) { say(T.badBy); return; }
    if (by !== null && by < today) { say(T.byPast); return; }

    var v = {
      name: name, bill: bill, plural: /[,&]|\band\b|\baur\b|और/i.test(bill),
      amt: inr(amt, lang),
      due: due === null ? "" : dayName(due, lang, today),
      by: by === null ? "" : dayName(by, lang, today),
      late: due === null || due <= today,
      biz: biz
    };
    msg.value = MAKE[lang](tone, v) + (biz ? "\n" + biz : "");
    link();
    act.hidden = false;
    say(T.ready);
  }

  function fallbackCopy() {
    try {
      msg.focus();
      msg.select();
      say(document.execCommand && document.execCommand("copy") ? T.copied : T.copyFail);
    } catch (e) { say(T.copyFail); }
  }

  function copy() {
    if (!msg.value) { say(T.nothing); return; }
    if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(msg.value).then(function () { say(T.copied); }, fallbackCopy);
    } else fallbackCopy();
  }

  document.getElementById("rm-go").addEventListener("click", go);
  document.getElementById("rm-copy").addEventListener("click", copy);
  // the message can be edited: the WhatsApp link follows what is in the box
  msg.addEventListener("input", link);
  ["rm-n", "rm-a", "rm-b", "rm-biz"].forEach(function (id) {
    document.getElementById(id).addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
  });
})();
