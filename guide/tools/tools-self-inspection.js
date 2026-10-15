(function () {
  var hi = (document.documentElement.lang || "en").slice(0, 2) === "hi";
  var T = hi ? {
    y: "हाँ: ", n: "नहीं: ", u: "जवाब बाकी: ", of: " में से ",
    cl: {
      crit: "क्रिटिकल अनियमितता (MDG 8.2)",
      maj: "मेजर अनियमितता (MDG 8.3)",
      min: "माइनर अनियमितता (MDG 8.4)",
      rec: "पिछले इंस्पेक्शन के बाद का रिकॉर्ड न हो तो मेजर, सिर्फ़ उससे पुराना न हो तो माइनर (MDG 8.3, 8.4)",
      open: "अध्याय 8 में इस जाँच के लिए कोई क्लास नहीं लिखी; कार्रवाई तेल कंपनी पूछताछ के बाद तय करती है (MDG 8.5.4)"
    },
    pt: "सर्कुलर बिंदु ", fix: "आपके “नहीं” जवाब, सबसे गंभीर क्लास पहले:",
    none: "अभी कोई “नहीं” जवाब नहीं।", cf: "सारे जवाब मिटा दें?"
  } : {
    y: "Yes: ", n: "No: ", u: "Not answered: ", of: " of ",
    cl: {
      crit: "Critical irregularity (MDG 8.2)",
      maj: "Major irregularity (MDG 8.3)",
      min: "Minor irregularity (MDG 8.4)",
      rec: "Major if the records since the last inspection are missing, minor if only older records are missing (MDG 8.3, 8.4)",
      open: "Chapter 8 names no class for this exact check; the oil company decides after enquiry (MDG 8.5.4)"
    },
    pt: "Circular point ", fix: "Your No answers, most serious class first:",
    none: "No “No” answers yet.", cf: "Clear all your answers?"
  };
  var KEY = "mdg-self-inspection-v1", ORDER = ["crit", "maj", "rec", "min", "open"];
  var rows = document.querySelectorAll("#si .ck"), st = {}, i;
  try { st = JSON.parse(window.localStorage.getItem(KEY)) || {}; } catch (e) { st = {}; }
  if (typeof st !== "object" || st === null || st.length !== undefined) st = {};
  function save() { try { window.localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function paint() {
    var y = 0, n = 0, no = [], j, r, id, v, b, nt, a, k;
    for (j = 0; j < rows.length; j++) {
      r = rows[j]; id = r.getAttribute("data-i"); v = st[id];
      b = r.getElementsByTagName("button");
      b[0].setAttribute("aria-pressed", v === 1 ? "true" : "false");
      b[1].setAttribute("aria-pressed", v === 0 ? "true" : "false");
      nt = r.querySelector(".nt");
      r.className = "ck" + (v === 0 ? " no" : "");
      if (v === 1) y++;
      if (v === 0) {
        n++; k = r.getAttribute("data-k"); no.push([ORDER.indexOf(k), j]);
        a = r.getAttribute("data-n");
        nt.textContent = (a ? T.pt + a + " · " : "") + "MDG " + r.getAttribute("data-c") + " · " + T.cl[k] + (r.getAttribute("data-m") ? (hi ? "। " : ". ") + r.getAttribute("data-m") : "");
        nt.style.display = "block";
      } else nt.style.display = "none";
    }
    document.getElementById("si-sum").textContent = T.y + (hi ? rows.length + T.of + y : y + T.of + rows.length) + " · " + T.n + n + " · " + T.u + (rows.length - y - n);
    var ol = document.getElementById("si-fix");
    ol.textContent = "";
    no.sort(function (p, q) { return p[0] - q[0] || p[1] - q[1]; });
    for (j = 0; j < no.length; j++) {
      var li = document.createElement("li");
      li.textContent = rows[no[j][1]].querySelector(".t").textContent + " (MDG " + rows[no[j][1]].getAttribute("data-c") + ")";
      ol.appendChild(li);
    }
    document.getElementById("si-fh").textContent = no.length ? T.fix : T.none;
  }
  function pick(e) {
    var t = e.target, r = t;
    if (t.tagName !== "BUTTON" || !t.getAttribute("data-v")) return;
    while (r && String(r.className).indexOf("ck") !== 0) r = r.parentNode;
    if (!r || !r.getAttribute) return;
    var id = r.getAttribute("data-i"), v = t.getAttribute("data-v") === "1" ? 1 : 0;
    if (st[id] === v) delete st[id]; else st[id] = v;
    save(); paint();
  }
  document.getElementById("si").addEventListener("click", pick);
  document.getElementById("si-clr").addEventListener("click", function () {
    if (window.confirm(T.cf)) { st = {}; save(); paint(); }
  });
  paint();
})();
