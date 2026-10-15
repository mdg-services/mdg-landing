(function () {
  var hi = (document.documentElement.lang || "en").slice(0, 2) === "hi";
  var T = hi ? {
    e1: "A, B, E और G सादी संख्या में भरें (0 या उससे ज़्यादा)।",
    e2: "श्रिंकेज या TVA के लिए Rs प्रति KL में अलाउंस और नेट प्राइस भरें, या वह प्रतिशत भरें जो आपकी तेल कंपनी बताती है।",
    e3: "वह मात्रा भरें जिस पर अलाउंस लगता है। TVA में यह सिर्फ़ वह मात्रा है जिस पर इनवॉइस में TVA का क्रेडिट मिला। यह रिसीट से ज़्यादा नहीं हो सकती।",
    pos: "(टैंक में बुक से ज़्यादा)", neg: "(टैंक में बुक से कम)",
    v1: "सीमा के अंदर है, क्लॉज़ का कोई भी मतलब लें।",
    v2: "सीमा से बाहर है, क्लॉज़ का कोई भी मतलब लें।",
    v3: "दोनों पढ़ाइयों के बीच: सीमा के अंदर तभी, जब आपकी तेल कंपनी 4% के साथ हैंडलिंग लॉस भी गिनती हो। उससे पूछें कि वह इसे कैसे गिनती है।",
    e4: "पहले 600 KL में गिना जाने वाला हिस्सा इस अवधि की बिक्री (E) से ज़्यादा नहीं हो सकता।",
    gain: "पॉज़िटिव वेरिएशन में हैंडलिंग लॉस नहीं जोड़ा गया। MDG उसे नुकसान (loss) कहता है और यह नहीं बताता कि बढ़त पर वह कैसे लगेगा। उसे सीमा में जोड़ने से यह पढ़ाई सख़्त है।",
    cp: "सीमा से बाहर पॉज़िटिव वेरिएशन में सैंपल लैब जाते हैं और सभी प्रोडक्ट की बिक्री और सप्लाई तुरंत रुक जाती है (MDG 5.1.11)।",
    cn: "सीमा से बाहर नेगेटिव वेरिएशन में जाँच के दौरान बिक्री और सप्लाई चलती रहती है और डीलर से स्पष्टीकरण माँगा जाता है (MDG 5.1.11)।",
    rg: "हैंडलिंग लॉस एक रेंज में दिखाया है, क्योंकि MDG नहीं बताता कि 600 KL की हद पर बिक्री कैसे बाँटी जाए। एक आँकड़ा पाने के लिए वह हिस्सा भरें जिसे आपकी तेल कंपनी पहले 600 KL में गिनती है।"
  } : {
    e1: "Fill in A, B, E and G as plain numbers (0 or more).",
    e2: "For shrinkage or TVA, give the allowance and the net price in Rs per KL, or the percentage your oil company gives.",
    e3: "Give the quantity the allowance applies to. For TVA this is only what carried the TVA credit on the invoices. It cannot be more than the receipts.",
    pos: "(more in the tank than the books)", neg: "(less in the tank than the books)",
    v1: "Within the limit, on every reading of the clause.",
    v2: "Beyond the limit, on every reading of the clause.",
    v3: "Between the readings: within the limit only if your oil company counts the handling loss together with the 4%. Ask it how it counts.",
    e4: "The part counted in the first 600 KL cannot be more than this period's sales (E).",
    gain: "The handling loss is not added for a positive variation. MDG calls it a loss and does not say how it applies to a gain. This is stricter than adding it to the limit.",
    cp: "A positive variation beyond the limit sends samples to the lab and stops sales and supplies of all products at once (MDG 5.1.11).",
    cn: "A negative variation beyond the limit lets sales and supplies continue during the investigation, and the dealer's explanation is called for (MDG 5.1.11).",
    rg: "The handling loss is shown as a range because MDG does not say how sales are split at the 600 KL line. Enter the part your oil company counts in the first 600 KL to get one figure."
  };
  function el(i) { return document.getElementById(i); }
  function val(i) {
    var s = el(i).value.replace(/\s/g, "");
    if (s === "") return null;
    s = /,\d{3}(\D|$)/.test(s) ? s.replace(/,/g, "") : s.replace(",", ".");
    return /^(\d+\.?\d*|\.\d+)$/.test(s) ? parseFloat(s) : NaN;
  }
  function f(x) {
    var n = Math.round(x), s = String(Math.abs(n)), r = s.slice(0, -3);
    if (r) r = r.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + ",";
    return (n < 0 ? "-" : "") + r + s.slice(-3) + " L";
  }
  function show(id, on, txt) {
    var e = el(id);
    e.style.display = on ? "" : "none";
    if (txt) e.textContent = txt;
  }
  function bad(x) { return x === null || isNaN(x); }
  function go() {
    var u = parseFloat(el("sv-u").value), ms = el("sv-p").value === "ms", k, ids = ["v1", "v2", "v3", "gain", "cp", "cn", "rg", "err"];
    for (k = 0; k < ids.length; k++) show("sv-" + ids[k], false);
    show("sv-out", false);
    var A = val("sv-a"), B = val("sv-b"), E = val("sv-e"), G = val("sv-g");
    if (bad(A) || bad(B) || bad(E) || bad(G)) { show("sv-err", true, T.e1); return; }
    A *= u; B *= u; E *= u; G *= u;
    var sk = el("sv-s").value, C = 0;
    if (sk) {
      var pc = val("sv-sc"), sa = val("sv-sa"), sp = val("sv-sp"), q = val("sv-sq"), pct;
      if (pc !== null) {
        if (isNaN(pc) || pc > 100) { show("sv-err", true, T.e2); return; }
        pct = pc;
      }
      else if (sa > 0 && sp > 0) pct = Math.round(sa / sp * 10000) / 100;
      else { show("sv-err", true, T.e2); return; }
      if (q === null && sk === "s") q = B / u;
      if (bad(q) || q * u > B + 1e-6) { show("sv-err", true, T.e3); return; }
      C = pct / 100 * q * u;
    }
    var D = A + B - C, F = D - E, V = Math.round((G - F) * 1e6) / 1e6, four = 0.04 * G, EPS = 1e-6;
    var r = ms ? [0.0075, 0.006] : [0.0025, 0.002], av = val("sv-v"), q1 = val("sv-w"), lo, up, range = false;
    if (isNaN(av) || isNaN(q1)) { show("sv-err", true, T.e1); return; }
    if (av !== null && av <= 600) lo = up = E * r[0];
    else if (q1 !== null) {
      if (q1 * u > E + EPS) { show("sv-err", true, T.e4); return; }
      lo = up = q1 * u * r[0] + (E - q1 * u) * r[1];
    }
    else { lo = E * r[1]; up = E * r[0]; range = true; }
    var res = V >= 0 ? (V <= four + EPS ? 1 : 2) : (-V <= four + EPS ? 1 : -V > four + up + EPS ? 2 : 3);
    el("o-c").textContent = f(C);
    el("o-d").textContent = f(D);
    el("o-f").textContent = f(F);
    el("o-g").textContent = f(G);
    el("o-v").textContent = (V > 0 ? "+" : "") + f(V) + (G > 0 ? " (" + (V > 0 ? "+" : "") + (V / G * 100).toFixed(1) + "%)" : "");
    el("o-vd").textContent = V > 0 ? T.pos : V < 0 ? T.neg : "";
    el("o-4").textContent = f(four);
    el("o-h").textContent = lo === up ? f(lo) : f(lo) + " – " + f(up);
    show("sv-out", true);
    show("sv-v" + res, true, T["v" + res]);
    show("sv-gain", V > 0, T.gain);
    show("sv-cp", V > 0 && res === 2, T.cp);
    show("sv-cn", V < 0 && res > 1, T.cn);
    show("sv-rg", range && V < 0, T.rg);
  }
  el("sv-go").addEventListener("click", go);
  el("sv-s").addEventListener("change", function () { show("sv-sx", !!this.value); });
})();
