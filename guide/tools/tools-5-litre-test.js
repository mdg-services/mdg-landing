(function () {
  // The 5-litre test checker on /tools/5-litre-test/ (and the Hindi twin).
  // It turns what the 5-litre measure showed into a gap in ml, sets the gap against the range
  // MDG 2024 prints in 5.1.2(a) (+/- 10 ml to +/- 25 ml per 5 litres, for an inspector's finding)
  // and lists the steps from 1.4.2(d), 4.3(a) and 5.1.2(a), exactly as the quantity-5-litre-test
  // page states them. MDG prints a range, not one figure: the limit itself is Legal Metrology's.
  // Everything happens in the reader's browser; nothing is stored or sent.
  var hi = (document.documentElement.lang || "en").slice(0, 2) === "hi";
  var T = hi ? {
    need: "5 लीटर के मेज़र से मिले ml भरें, जैसे 15।",
    needT: "मेज़र में कुल कितना आया, वह भरें, जैसे 4985 ml या 4.985 लीटर।",
    big: "यह 5 लीटर से 1,000 ml से ज़्यादा दूर है। मेज़र की रीडिंग दोबारा देखें।",
    nl: "कुल मात्रा लीटर में मानी गई: ",
    none: "ठीक 5 लीटर: कोई फ़र्क नहीं।",
    short: function (x) { return "5 लीटर में " + x + " ml कम"; },
    over: function (x) { return "5 लीटर में " + x + " ml ज़्यादा"; },
    scale: function (p, a, b) { return "यह मात्रा का " + p + "% है: हर 100 लीटर में " + a + " और हर 1,000 लीटर में " + b + "।"; },
    ml: " ml", lt: " लीटर", lt1: " लीटर",
    zA: "10 ml से कम: MDG ने जो दायरा छापा है (प्रति 5 लीटर 10 से 25 ml), उसके सबसे छोटे आँकड़े से भी कम।",
    zB: "MDG के छपे दायरे के भीतर: प्रति 5 लीटर 10 से 25 ml।",
    zC: "MDG के छपे दायरे से बाहर: प्रति 5 लीटर 25 ml से ज़्यादा।",
    dN: "कोई फ़र्क नहीं। टेस्टिंग की मात्रा स्टॉक रजिस्टर में लिखें (MDG 1.4.2(d))।",
    d1: "फ़र्क की सूचना तुरंत वेट्स एंड मेज़र्स (W&M) विभाग और अपने कंट्रोलिंग ऑयल कंपनी ऑफ़िस को दें (MDG 1.4.2(d))।",
    d2: "जब तक यूनिट दोबारा स्टैम्प न हो और डिलीवरी ठीक न हो, उसे न चलाएँ (MDG 1.4.2(d))।",
    d3: "W&M इंस्पेक्टर की मदद से तुरंत रीकैलिब्रेशन करवाएँ। यह डीलर या तेल कंपनी का मेंटेनेंस प्रतिनिधि करवाता है (MDG 4.3(a))।",
    d4: "टेस्टिंग की मात्रा स्टॉक रजिस्टर में लिखें (MDG 1.4.2(d))।",
    dA: "अपनी जाँच के लिए MDG कोई न्यूनतम फ़र्क नहीं बताता, और 10 से 25 ml का दायरा इंस्पेक्टर को मिले फ़र्क के लिए है (MDG 5.1.2(a))। इतना छोटा फ़र्क आपकी तेल कंपनी कैसे गिनती है, उससे पूछें।",
    dB: "इंस्पेक्टर को इतना फ़र्क मिलता, तो बिक्री चलती और यूनिट का रीकैलिब्रेशन और दोबारा स्टैम्प 15 दिन के भीतर होना होता (MDG 5.1.2(a))। यह आपकी अपनी जाँच वाली रोक से कैसे बैठता है, MDG नहीं बताता। अपनी तेल कंपनी से पूछें।",
    dCs: "इंस्पेक्टर को इतना कम मिलता, तो उस नोज़ल की बिक्री तुरंत रुक जाती (MDG 5.1.2(a))।",
    dCo: "MDG का कम डिलीवरी वाला नियम (5.1.2(a)) कम देने की बात करता है। आपकी अपनी जाँच और 4.3(a) ज़्यादा देने को भी गिनते हैं।",
    iN: "कोई फ़र्क नहीं मिला।",
    iA: "दायरे के सबसे छोटे आँकड़े से भी कम। MDG का 15 दिन वाला कदम 10 से 25 ml के फ़र्क के लिए लिखा है। इससे छोटे फ़र्क के लिए MDG अलग कदम नहीं देता। अपनी तेल कंपनी से पूछें (MDG 5.1.2(a))।",
    iB: "यह फ़र्क दर्ज होता है और उस नोज़ल की बिक्री चलती रहती है। जल्द से जल्द, और फ़र्क देखे जाने के 15 दिन के भीतर, रीकैलिब्रेशन और दोबारा स्टैम्प करवाएँ, वरना उस यूनिट या नोज़ल की बिक्री रुक जाती है (MDG 5.1.2(a))।",
    iCs: "उस यूनिट या नोज़ल की बिक्री तुरंत रुकेगी। बिक्री दोबारा शुरू करने से पहले रीकैलिब्रेशन और दोबारा स्टैम्प करवाएँ (MDG 5.1.2(a))। रीकैलिब्रेशन W&M इंस्पेक्टर की मदद से तुरंत करवाया जाता है (MDG 4.3(a))।",
    iCo: "MDG का नियम कम डिलीवरी के लिए है। ज़्यादा देना भी फ़र्क है: रीकैलिब्रेशन तुरंत करवाया जाता है (MDG 4.3(a)), और फ़र्क वाली यूनिट दोबारा स्टैम्प होने तक नहीं चलती (MDG 1.4.2(d))। अपनी तेल कंपनी से पूछें।",
    c1: "MDG 2024 में ग्राहक के लिए कोई टेस्ट नहीं है। W&M से जाँचा आउटलेट का अपना मेज़र पंप टेस्टिंग के लिए रखा जाता है (MDG 1.4.2(b)), और हर नोज़ल रोज़ बिक्री से पहले जाँचा जाता है (MDG 1.4.2(d))।",
    c2: "आपके अपने मेज़र में फ़र्क दिखे, तो डीलर या तेल कंपनी को बताएँ। ग्राहक माँगे तो शिकायत पुस्तिका देनी होती है (MDG 1.6(iv))।",
    c3: "आम चलन, MDG का नियम नहीं: घर का डिब्बा या बोतल जाँचा हुआ मेज़र नहीं है, इसलिए उसकी रीडिंग को इशारा मानें, सबूत नहीं।",
    cN: "पूरे 5 लीटर: कुछ उठाने की ज़रूरत नहीं।",
    foot: "MDG एक आँकड़ा नहीं, प्रति 5 लीटर ±10 से ±25 ml का दायरा छापता है। अनुमेय सीमा खुद लीगल मेट्रोलॉजी एक्ट, 2009 और नियमों में है। उसके लिए वे पढ़ें या W&M से पूछें। यह सिर्फ़ मददगार टूल है: फ़ैसला इंस्पेक्टर या W&M का ही माना जाता है।"
  } : {
    need: "Type the ml from your 5-litre measure, for example 15.",
    needT: "Type what the measure held in total, for example 4985 ml or 4.985 litres.",
    big: "That is more than 1,000 ml away from 5 litres. Read the measure again.",
    nl: "The total was read as litres: ",
    none: "Exactly 5 litres: no gap.",
    short: function (x) { return x + " ml short in 5 litres"; },
    over: function (x) { return x + " ml over in 5 litres"; },
    scale: function (p, a, b) { return "That is " + p + "% of the quantity: " + a + " in every 100 litres and " + b + " in every 1,000 litres."; },
    ml: " ml", lt: " litres", lt1: " litre",
    zA: "Under 10 ml: smaller than the lowest figure of the range MDG prints (10 to 25 ml per 5 litres).",
    zB: "Inside the range MDG prints: 10 to 25 ml per 5 litres.",
    zC: "Beyond the range MDG prints: more than 25 ml per 5 litres.",
    dN: "No gap. Write the testing quantity in the stock register (MDG 1.4.2(d)).",
    d1: "Tell the Weights & Measures (W&M) department and your controlling oil company office at once (MDG 1.4.2(d)).",
    d2: "Do not run that dispensing unit until it is re-stamped and the delivery is set right (MDG 1.4.2(d)).",
    d3: "Arrange recalibration at once, with the W&M Inspector's help. The dealer or the oil company's maintenance representative does this (MDG 4.3(a)).",
    d4: "Write the testing quantity in the stock register (MDG 1.4.2(d)).",
    dA: "MDG gives no minimum gap for your own check, and its 10 to 25 ml range is written for an inspector's finding (MDG 5.1.2(a)). Ask your oil company how it treats a gap this small.",
    dB: "If an inspector had found this, sales would go on and the unit would need recalibrating and re-stamping within 15 days (MDG 5.1.2(a)). MDG does not say how that fits with the stop in your own check. Ask your oil company.",
    dCs: "If an inspector found a gap this size short, sales through that nozzle would stop at once (MDG 5.1.2(a)).",
    dCo: "MDG's short-delivery rule (5.1.2(a)) speaks of short delivery. Your own check and 4.3(a) cover excess as well.",
    iN: "No gap was found.",
    iA: "Smaller than the lowest figure of the range. MDG's 15-day step is written for a gap of 10 to 25 ml; for a smaller one it gives no separate step. Ask your oil company (MDG 5.1.2(a)).",
    iB: "The finding is recorded and sales through the nozzle go on. Recalibrate and re-stamp at the earliest, and not later than 15 days from the day it was seen, or sales through that unit or nozzle stop until it is done (MDG 5.1.2(a)).",
    iCs: "Sales through that unit or nozzle must stop at once. Recalibrate and re-stamp before sales restart (MDG 5.1.2(a)). Recalibration is arranged at once, with the W&M Inspector's help (MDG 4.3(a)).",
    iCo: "MDG's rule is written for short delivery. An excess is still a variation: recalibration is arranged at once (MDG 4.3(a)) and a unit with a variation is not run until it is re-stamped (MDG 1.4.2(d)). Ask your oil company.",
    c1: "MDG 2024 sets out no customer test. The outlet's own measure, verified by W&M, is kept for pump testing (MDG 1.4.2(b)), and every nozzle is checked each day before sales (MDG 1.4.2(d)).",
    c2: "If your own measure shows a gap, tell the dealer or your oil company. The complaint book must be handed over when a customer asks (MDG 1.6(iv)).",
    c3: "General practice, not an MDG rule: a can or bottle from home is not a verified measure, so treat its reading as a hint, not proof.",
    cN: "A full 5 litres: nothing to raise.",
    foot: "MDG prints a range of ±10 to ±25 ml per 5 litres, not one figure. The permissible limit itself is in the Legal Metrology Act, 2009 and Rules: read them or ask W&M. A helper only: an inspector's or W&M's finding decides."
  };
  var out = document.getElementById("ft-out");

  /** "15", "15 ml", "4,985", "4.985 litres", "१५": { v, u } with u "ml", "l" or "". */
  function read() {
    var s = document.getElementById("ft-a").value.toLowerCase(), u = "", m;
    if (s.normalize) s = s.normalize("NFC");
    s = s.replace(/[०-९]/g, function (c) { return String(c.charCodeAt(0) - 0x966); }).replace(/\s/g, "");
    if (s === "") return { v: null, u: "" };
    m = s.match(/(millilitres?|milliliters?|मिलीलीटर|मिली|ml)$/);
    if (m) { u = "ml"; s = s.slice(0, -m[1].length); }
    else {
      m = s.match(/(litres?|liters?|ltrs?|लीटर|ltr|ली|l)$/);
      if (m) { u = "l"; s = s.slice(0, -m[1].length); }
    }
    if (/,.*,|,\d{3}(\D|$)/.test(s)) s = s.replace(/,/g, "");
    else s = s.replace(",", ".");
    return { v: /^(\d+\.?\d*|\.\d+)$/.test(s) ? parseFloat(s) : NaN, u: u };
  }

  function round(x, p) { var k = Math.pow(10, p); return Math.round(x * k + 1e-9) / k; }
  function fmt(x, dec) {
    var s = round(x, dec).toFixed(dec), p = s.split("."), i = p[0], r = i.slice(0, -3), f = (p[1] || "").replace(/0+$/, "");
    if (r) r = r.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + ",";
    return r + i.slice(-3) + (f ? "." + f : "");
  }
  /** a quantity in ml -> "300 ml" or "1.2 litres" */
  function amt(ml) { return ml >= 1000 ? fmt(ml / 1000, 2) + (round(ml / 1000, 2) === 1 ? T.lt1 : T.lt) : fmt(ml, 1) + T.ml; }

  function line(t, big) {
    var p = document.createElement("p");
    p.style.margin = "0 0 6px";
    if (big) { p.style.fontSize = "1.25em"; p.style.fontWeight = "700"; }
    p.textContent = t;
    out.appendChild(p);
  }

  function go() {
    var who = document.getElementById("ft-w").value, mode = document.getElementById("ft-m").value;
    var a = read(), dev, note = "", ad, zone, over, steps = [], i;
    out.textContent = "";
    if (a.v === null || isNaN(a.v)) { line(mode === "t" ? T.needT : T.need); return; }
    if (mode === "t") {
      var total = a.u === "l" ? a.v * 1000 : a.v;
      if (a.u === "" && a.v < 20) { total = a.v * 1000; note = T.nl + fmt(a.v, 3) + T.lt; }
      dev = total - 5000;
    } else {
      if (a.u === "l") { line(T.need); return; }
      dev = mode === "o" ? a.v : -a.v;
    }
    dev = round(dev, 3);
    ad = Math.abs(dev);
    if (ad > 1000) { line(T.big); return; }
    over = dev > 0;

    if (ad === 0) line(T.none, true);
    else line(over ? T.over(fmt(ad, 1)) : T.short(fmt(ad, 1)), true);
    if (note) line(note);
    if (ad > 0) line(T.scale(fmt(ad / 50, 2), amt(ad * 20), amt(ad * 200)));
    zone = ad < 10 ? "A" : ad <= 25 ? "B" : "C";
    if (ad > 0) line(T["z" + zone]);

    if (who === "d") {
      if (ad === 0) steps = [T.dN];
      else steps = [T.d1, T.d2, T.d3, T.d4, zone === "C" ? (over ? T.dCo : T.dCs) : T["d" + zone]];
    } else if (who === "i") {
      steps = ad === 0 ? [T.iN] : [zone === "C" ? (over ? T.iCo : T.iCs) : T["i" + zone]];
    } else {
      steps = ad === 0 ? [T.cN, T.c1] : [T.c1, T.c2, T.c3];
    }
    for (i = 0; i < steps.length; i++) line((steps.length > 1 && who === "d" && i < 4 ? (i + 1) + ". " : "") + steps[i]);
    line(T.foot);
  }

  document.getElementById("ft-go").addEventListener("click", go);
  document.getElementById("ft-a").addEventListener("keydown", function (e) { if (e.key === "Enter" || e.keyCode === 13) go(); });
})();
