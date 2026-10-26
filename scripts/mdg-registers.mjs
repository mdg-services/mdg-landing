// The printable density register and daily stock register (A4, landscape), in English and Hindi,
// for mdgservices.in/tools/density-and-stock-register-format/ (Hindi at /hi/tools/...):
//   public/mdg/downloads/mdg-density-register.pdf, mdg-density-register-hindi.pdf
//   public/mdg/downloads/mdg-stock-register.pdf,   mdg-stock-register-hindi.pdf
// The Excel files come from scripts/mdg-registers.py. Needs local Chrome:  node scripts/mdg-registers.mjs
// CHECK_DIR=<folder> also draws each PDF page to a PNG there, to look at (never into public/).
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";

const OUT = "/Users/dissu/Documents/PP/mdg-service/mdg-landing/public/mdg/downloads";
mkdirSync(OUT, { recursive: true });

// ───────────────────────── words ─────────────────────────
const TXT = {
  en: {
    lang: "en",
    suffix: "",
    site: "mdgservices.in/tools/density-and-stock-register-format/",
    outlet: "Outlet",
    product: "Product",
    monthYear: "Month and year",
    pageNo: "Page no.",
    byLine: "A working format from MDG Services (a brand of VRUOOM Private Limited), not an oil company form",
    // density
    dTitle: "Daily density register",
    dSub: "One line for every reading: the morning reading, each tanker compartment, and the density after decanting",
    dTank: "Tank no.",
    dProduct: "Product (MS / HSD)",
    dTick: "Tick what was measured",
    dCols: {
      date: "Date", time: "Time", morning: "Morning", tanker: "Tanker", after: "After decanting",
      tankerNo: "Tanker no.", comp: "Comp. no.", hydro: "Hydrometer reading (kg/m³)", temp: "Temp. (°C)",
      d15: "Density at 15°C (kg/m³)", inv: "Invoice density at 15°C (kg/m³)", gap: "Gap from invoice (within ±3.0)",
      by: "Checked by", note: "Note",
    },
    dRule: "<b>Morning:</b> before the first sale, take a sample at a pump nozzle and write its density at 15°C, by 10 AM at the latest. <b>Tanker:</b> before decanting, write each compartment on its own line, with the density at 15°C printed on the invoice; the gap should be within 3.0 either way. <b>After decanting:</b> run at least 50 litres through the pump, take a nozzle sample and write its density at 15°C. <span class=\"cc\">MDG 2024: 1.4.1(c), 5.1.9, 1.2(iv), 1.2(viii), 1.2(xiv)</span>",
    dGood: "<b>Good practice, not an MDG rule:</b> never write over a line. Strike it through and write the right figure on the next line.",
    dCaution: "<b>Check with your oil company.</b> MDG 2024 says density records follow the format it attaches as Annexure 1 (clause 1.2(xiv)). This page records the same readings in our own layout. If your oil company gave you its own register, fill that one first, and ask whether it accepts this layout too.",
    // stock
    sTitle: "Daily stock register",
    sParts: {
      A: { t: "A. Morning tank record", s: "Before the first sale. For each tank: the product dip, the litres that dip gives in that tank's own calibration chart, and the water dip." },
      B: { t: "B. Morning pump meter readings", s: "Before the first sale. One column for each nozzle: write the nozzle at the top (for example DU1-N1). Sales since yesterday = today's total minus yesterday's total." },
      C: { t: "C. Tankers received", s: "One line for each tanker, written after decanting." },
      D: { t: "D. Stock check", s: "One line for each day, worked out from parts A, B and C. The closing stock by dip is the next morning's stock in part A." },
    },
    sCols: {
      date: "Date", tank: "Tank no.", pdip: "Product dip (cm)", lit: "Litres by chart", wdip: "Water dip (cm)",
      all: "Stock by dip, all tanks (L)", test: "Litres used to test nozzles", by: "Done by", note: "Note",
      nozzle: "Nozzle", total: "Total of all readings", sales: "Sales since yesterday (L)",
      time: "Time decanted", inv: "Invoice no.", tankerNo: "Tanker no.", prod: "Product", tankNo: "Tank no.", qty: "Quantity (L)", water: "Water found with paste? Yes / No",
      A: "A. Opening stock by dip (L)", B: "B. Received (L)", C: "C. Shrinkage or TVA (L), if any", D: "D = A + B − C (L)", E: "E. Sales by meter (L)",
      F: "F = D − E, book stock (L)", G: "G. Closing stock by dip (L)", V: "Variation, G − F (L)", P: "4% of G (L)", I: "Inside 4%? Yes / No",
    },
    sNotes: {
      A: "MDG 2024 asks for the morning product and water dips of each tank, taken separately <span class=\"c\">1.3</span>, the water dip every day in the stock register <span class=\"c\">1.4.1(b)</span>, and the litres used to test each nozzle <span class=\"c\">1.4.2(d)</span>. If water is found, tell the controlling company office at once <span class=\"c\">1.4.1(b)</span>. Use each tank's own calibration chart.",
      B: "MDG 2024 asks for the pump meter readings taken each morning <span class=\"c\">1.3</span>. If a dispensing unit's meter is changed or set back to zero, write what happened in the note and work that day out by hand.",
      C: "MDG 2024 asks for “appropriate entries” in the stock register or on the stock display board after decanting <span class=\"c\">1.2(xiii)</span> and does not list them. The receipt is the plain reading. Density after decanting goes in the density register.",
      D: "The method of MDG Annexure 9: opening stock by dip, plus receipts, less shrinkage or TVA where it applies, less sales by meter, is the book stock; compare it with the closing stock by dip. The limit is 4% of the closing stock <span class=\"c\">5.1.11</span> <span class=\"c\">Annexure 9</span>. A plus variation means more fuel in the tank than in the books. This page checks the 4% only: MDG also counts the handling loss on sales, and shrinkage or TVA where they apply, so your oil company's working decides.",
    },
    sCaution: "<b>The oil company's own register comes first.</b> MDG 2024 says the company supplies the daily stock register <span class=\"c\">1.3(ii)</span> and prints no form for it. If you have it, fill that one first; use these pages for the sums or as a spare.",
    sCautionShort: "<b>The oil company's own register comes first.</b> MDG 2024 prints no form for the daily stock register <span class=\"c\">1.3(ii)</span>.",
    sPage: (n) => `Page ${n} of 4`,
  },
  hi: {
    lang: "hi",
    suffix: "-hindi",
    site: "mdgservices.in/hi/tools/density-and-stock-register-format/",
    outlet: "आउटलेट",
    product: "प्रोडक्ट",
    monthYear: "महीना और साल",
    pageNo: "पेज नंबर",
    byLine: "MDG Services (VRUOOM Private Limited का ब्रांड) का काम चलाऊ फ़ॉर्मेट, तेल कंपनी का फ़ॉर्म नहीं",
    dTitle: "रोज़ का डेंसिटी रजिस्टर",
    dSub: "हर रीडिंग की एक लाइन: सुबह की रीडिंग, टैंकर का हर कंपार्टमेंट, और माल उतारने के बाद की डेंसिटी",
    dTank: "टैंक नंबर",
    dProduct: "प्रोडक्ट (MS / HSD)",
    dTick: "जो नापा, उस पर निशान लगाएँ",
    dCols: {
      date: "तारीख़", time: "समय", morning: "सुबह", tanker: "टैंकर", after: "उतारने के बाद",
      tankerNo: "टैंकर नंबर", comp: "कंपार्ट. नंबर", hydro: "हाइड्रोमीटर रीडिंग (kg/m³)", temp: "तापमान (°C)",
      d15: "15°C पर डेंसिटी (kg/m³)", inv: "इनवॉइस की 15°C डेंसिटी (kg/m³)", gap: "इनवॉइस से अंतर (±3.0 के अंदर)",
      by: "किसने जाँचा", note: "नोट",
    },
    dRule: "<b>सुबह:</b> पहली बिक्री से पहले पंप के नोज़ल से सैंपल लेकर उसकी 15°C की डेंसिटी लिखिए, देर से देर 10 AM तक। <b>टैंकर:</b> माल उतारने से पहले हर कंपार्टमेंट अलग लाइन में लिखिए, साथ में इनवॉइस पर छपी 15°C की डेंसिटी; अंतर किसी भी तरफ़ 3.0 के अंदर होना चाहिए। <b>उतारने के बाद:</b> पंप से कम से कम 50 लीटर निकालिए, फिर नोज़ल का सैंपल लेकर उसकी 15°C की डेंसिटी लिखिए। <span class=\"cc\">MDG 2024: 1.4.1(c), 5.1.9, 1.2(iv), 1.2(viii), 1.2(xiv)</span>",
    dGood: "<b>आम चलन, MDG का नियम नहीं:</b> किसी लाइन पर दोबारा न लिखिए। उस पर लकीर खींचिए और सही आँकड़ा अगली लाइन में लिखिए।",
    dCaution: "<b>अपनी तेल कंपनी से पूछ लीजिए।</b> MDG 2024 कहता है कि डेंसिटी के रिकॉर्ड उस फ़ॉर्मेट में रखे जाएँ जो उसने Annexure 1 में लगाया है (क्लॉज़ 1.2(xiv))। यह पेज वही रीडिंग हमारे अपने लेआउट में लिखवाता है। तेल कंपनी ने अपना रजिस्टर दिया हो, तो पहले वही भरिए, और पूछिए कि यह लेआउट भी चलता है या नहीं।",
    sTitle: "डेली स्टॉक रजिस्टर",
    sParts: {
      A: { t: "A. सुबह का टैंक रिकॉर्ड", s: "पहली बिक्री से पहले। हर टैंक के लिए: प्रोडक्ट डिप, उस डिप के उस टैंक के अपने कैलिब्रेशन चार्ट से निकले लीटर, और पानी का डिप।" },
      B: { t: "B. सुबह की पंप मीटर रीडिंग", s: "पहली बिक्री से पहले। हर नोज़ल का एक कॉलम: ऊपर नोज़ल लिखिए (जैसे DU1-N1)। कल से अब तक की बिक्री = आज का जोड़ घटा कल का जोड़।" },
      C: { t: "C. आए टैंकर", s: "हर टैंकर की एक लाइन, माल उतारने के बाद लिखिए।" },
      D: { t: "D. स्टॉक जाँच", s: "हर दिन की एक लाइन, भाग A, B और C से निकाली हुई। डिप से क्लोज़िंग स्टॉक वही है जो अगली सुबह भाग A में लिखा है।" },
    },
    sCols: {
      date: "तारीख़", tank: "टैंक नंबर", pdip: "प्रोडक्ट डिप (cm)", lit: "चार्ट से लीटर", wdip: "पानी का डिप (cm)",
      all: "डिप से स्टॉक, सभी टैंक (L)", test: "नोज़ल टेस्ट में लगे लीटर", by: "किसने भरा", note: "नोट",
      nozzle: "नोज़ल", total: "सभी रीडिंग का जोड़", sales: "कल से अब तक की बिक्री (L)",
      time: "उतारने का समय", inv: "इनवॉइस नंबर", tankerNo: "टैंकर नंबर", prod: "प्रोडक्ट", tankNo: "टैंक नंबर", qty: "मात्रा (L)", water: "पेस्ट से पानी मिला? हाँ / नहीं",
      A: "A. डिप से ओपनिंग स्टॉक (L)", B: "B. आया माल (L)", C: "C. श्रिंकेज या TVA (L), हो तो", D: "D = A + B − C (L)", E: "E. मीटर से बिक्री (L)",
      F: "F = D − E, बुक स्टॉक (L)", G: "G. डिप से क्लोज़िंग स्टॉक (L)", V: "वेरिएशन, G − F (L)", P: "G का 4% (L)", I: "4% के अंदर? हाँ / नहीं",
    },
    sNotes: {
      A: "MDG 2024 हर टैंक के सुबह के प्रोडक्ट और पानी के डिप अलग से माँगता है <span class=\"c\">1.3</span>, पानी का डिप रोज़ स्टॉक रजिस्टर में <span class=\"c\">1.4.1(b)</span>, और हर नोज़ल की टेस्टिंग में लगे लीटर <span class=\"c\">1.4.2(d)</span>। पानी मिले तो कंट्रोलिंग कंपनी ऑफ़िस को तुरंत बताइए <span class=\"c\">1.4.1(b)</span>। हर टैंक का अपना कैलिब्रेशन चार्ट इस्तेमाल करें।",
      B: "MDG 2024 हर सुबह की पंप मीटर रीडिंग माँगता है <span class=\"c\">1.3</span>। किसी डिस्पेंसिंग यूनिट का मीटर बदला जाए या शून्य पर लौट जाए, तो नोट में लिखिए क्या हुआ और उस दिन का हिसाब हाथ से कीजिए।",
      C: "MDG 2024 टैंकर उतारने के बाद स्टॉक रजिस्टर या स्टॉक डिस्प्ले बोर्ड में “उचित एंट्री” माँगता है <span class=\"c\">1.2(xiii)</span> और उनकी सूची नहीं देता। सीधा पढ़ें तो रिसीट। उतारने के बाद की डेंसिटी डेंसिटी रजिस्टर में जाती है।",
      D: "MDG Annexure 9 का तरीका: डिप से ओपनिंग स्टॉक, जमा आया माल, घटा श्रिंकेज या TVA (जहाँ लागू हो), घटा मीटर की बिक्री, यह बुक स्टॉक है; इसकी तुलना डिप से क्लोज़िंग स्टॉक से कीजिए। सीमा क्लोज़िंग स्टॉक का 4% है <span class=\"c\">5.1.11</span> <span class=\"c\">Annexure 9</span>। प्लस वेरिएशन का मतलब टैंक में बही से ज़्यादा तेल। यह पेज सिर्फ़ 4% देखता है: MDG बिक्री पर हैंडलिंग लॉस, और जहाँ लागू हो वहाँ श्रिंकेज या TVA भी गिनता है, इसलिए फ़ैसला तेल कंपनी के हिसाब का माना जाता है।",
    },
    sCaution: "<b>पहले तेल कंपनी का अपना रजिस्टर।</b> MDG 2024 कहता है कि डेली स्टॉक रजिस्टर कंपनी देती है <span class=\"c\">1.3(ii)</span> और उसका कोई फ़ॉर्म नहीं छापता। वह आपके पास हो तो पहले वही भरिए; ये पेज हिसाब के लिए, या अतिरिक्त कॉपी की तरह रखिए।",
    sCautionShort: "<b>पहले तेल कंपनी का अपना रजिस्टर।</b> MDG 2024 डेली स्टॉक रजिस्टर का कोई फ़ॉर्म नहीं छापता <span class=\"c\">1.3(ii)</span>।",
    sPage: (n) => `पेज ${n} / 4`,
  },
};

// ───────────────────────── page building blocks ─────────────────────────
const CSS = `
  @page { size: A4 landscape; margin: 8mm 10mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Inter, "Noto Sans Devanagari", "Kohinoor Devanagari", "Devanagari Sangam MN", sans-serif; color: #15163A; font-size: 9.5pt; }
  .sheet { page-break-after: always; height: 194mm; position: relative; }
  .sheet:last-child { page-break-after: auto; }
  .top { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2.5pt solid #2C2E80; padding-bottom: 2.2mm; }
  h1 { font-size: 18pt; color: #2C2E80; line-height: 1.15; }
  .sub { font-size: 8.8pt; color: #43456B; margin-top: 0.8mm; max-width: 215mm; line-height: 1.35; }
  .pg { font-size: 9pt; color: #43456B; white-space: nowrap; }
  .pg span { display: inline-block; width: 20mm; border-bottom: 0.6pt solid #43456B; margin-left: 2mm; }
  .fields { display: flex; gap: 8mm; margin: 3mm 0 2.6mm; }
  .f { display: flex; align-items: flex-end; gap: 2mm; font-size: 9pt; color: #43456B; white-space: nowrap; }
  .f i { display: inline-block; border-bottom: 0.6pt solid #43456B; height: 4.6mm; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  th { background: #2C2E80; color: #fff; font-size: 7.6pt; font-weight: 600; text-align: center; padding: 1.1mm 0.8mm; line-height: 1.22; vertical-align: middle; border: 0.6pt solid #2C2E80; }
  th.g { background: #E4E6F1; color: #2C2E80; border: 0.6pt solid #9DA0CC; font-size: 7.8pt; }
  th.calc { background: #4B4E9C; }
  td { border: 0.6pt solid #A7AACB; }
  tr.r:nth-child(even) td { background: #F7F7FB; }
  td.calc { background: #ECEFF6 !important; }
  .wi { display: block; margin: 0.6mm auto 0; border-bottom: 0.5pt solid #fff; width: 86%; height: 2.8mm; }
  th.g .wi { border-bottom: 0.6pt solid #2C2E80; }
  .box { margin-top: 2.2mm; font-size: 7.9pt; line-height: 1.38; color: #15163A; }
  .box p + p { margin-top: 0.9mm; }
  .caution { border-left: 2pt solid #F5A524; background: #FFF8E8; padding: 1.2mm 2.4mm; }
  .c, .cc { font-size: 6.8pt; font-weight: 600; color: #2C2E80; border: 0.5pt solid #C5C7ED; border-radius: 1mm; padding: 0 1mm; white-space: nowrap; background: #fff; }
  .c::before { content: "MDG "; }
  .foot { position: absolute; left: 0; right: 0; bottom: 0; display: flex; justify-content: space-between; font-size: 7pt; color: #5D5F86; }
`;

const FONTS = `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap" rel="stylesheet">`;

/** cols: [{ w, h, g (group id), calc, wi (write-in line under the header) }]; rows: how many blank rows. */
function table(cols, rows, groups, rowH) {
  const hasGroups = groups && groups.length;
  const cg = `<colgroup>${cols.map((c) => `<col style="width:${c.w}mm">`).join("")}</colgroup>`;
  let thead = "";
  if (hasGroups) {
    const cells = [];
    let i = 0;
    while (i < cols.length) {
      const g = cols[i].g;
      if (g === undefined) {
        cells.push(`<th rowspan="2"${cols[i].calc ? ' class="calc"' : ""}>${cols[i].h}</th>`);
        i++;
      } else {
        let span = 0;
        while (i + span < cols.length && cols[i + span].g === g) span++;
        const gr = groups.find((x) => x.id === g);
        cells.push(`<th class="g" colspan="${span}">${gr.label}${gr.wi ? `<span class="wi"></span>` : ""}</th>`);
        i += span;
      }
    }
    thead = `<thead><tr>${cells.join("")}</tr><tr>${cols.filter((c) => c.g !== undefined).map((c) => `<th>${c.h}</th>`).join("")}</tr></thead>`;
  } else {
    thead = `<thead><tr>${cols.map((c) => `<th${c.calc ? ' class="calc"' : ""}>${c.h}${c.wi ? `<span class="wi"></span>` : ""}</th>`).join("")}</tr></thead>`;
  }
  const body = Array.from({ length: rows }, () => `<tr class="r" style="height:${rowH}mm">${cols.map((c) => `<td${c.calc ? ' class="calc"' : ""}></td>`).join("")}</tr>`).join("");
  return `<table>${cg}${thead}<tbody>${body}</tbody></table>`;
}

const fields = (items) => `<div class="fields">${items.map(([label, w]) => `<div class="f">${label}<i style="width:${w}mm"></i></div>`).join("")}</div>`;
const head = (t, title, sub) => `<div class="top"><div><h1>${title}</h1><div class="sub">${sub}</div></div><div class="pg">${t.pageNo}<span></span></div></div>`;
const foot = (t, right) => `<div class="foot"><span>${t.byLine} · ${t.site}</span><span>${right || ""}</span></div>`;
const doc = (lang, sheets) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">${FONTS}<style>${CSS}</style></head><body>${sheets.join("")}</body></html>`;

// ───────────────────────── the density register ─────────────────────────
function densityHtml(t) {
  const c = t.dCols;
  // widths in mm; the sum is 277 (A4 landscape inside 10 mm side margins)
  const cols = [
    { w: 17, h: c.date }, { w: 12, h: c.time },
    { w: 13, h: c.morning, g: "k" }, { w: 13, h: c.tanker, g: "k" }, { w: 16, h: c.after, g: "k" },
    { w: 24, h: c.tankerNo }, { w: 14, h: c.comp }, { w: 20, h: c.hydro }, { w: 14, h: c.temp },
    { w: 21, h: c.d15 }, { w: 23, h: c.inv }, { w: 20, h: c.gap, calc: true }, { w: 17, h: c.by },
  ];
  const used = cols.reduce((n, x) => n + x.w, 0);
  cols.push({ w: 277 - used, h: c.note });
  const sheet = `<section class="sheet">
    ${head(t, t.dTitle, t.dSub)}
    ${fields([[t.outlet, 78], [t.dTank, 22], [t.dProduct, 22], [t.monthYear, 38]])}
    ${table(cols, 16, [{ id: "k", label: t.dTick }], 7.3)}
    <div class="box"><p>${t.dRule}</p><p>${t.dGood}</p><p class="caution">${t.dCaution}</p></div>
    ${foot(t, "")}
  </section>`;
  return doc(t.lang, [sheet]);
}

// ───────────────────────── the daily stock register ─────────────────────────
function stockHtml(t) {
  const c = t.sCols;
  const part = (k, inner, rows, rowH, n) => `<section class="sheet">
    ${head(t, `${t.sTitle}: ${t.sParts[k].t}`, t.sParts[k].s)}
    ${fields([[t.outlet, 78], [t.product, 40], [t.monthYear, 38]])}
    ${inner}
    <div class="box"><p>${t.sNotes[k]}</p><p class="caution">${k === "A" ? t.sCaution : t.sCautionShort}</p></div>
    ${foot(t, t.sPage(n))}
  </section>`;

  // A: tanks (3 tanks x 3 columns), stock by dip, litres used to test, done by, note
  const tank = (g) => [{ w: 14, h: c.pdip, g }, { w: 20, h: c.lit, g }, { w: 14, h: c.wdip, g }];
  const colsA = [{ w: 16, h: c.date }, ...tank("t1"), ...tank("t2"), ...tank("t3"), { w: 23, h: c.all, calc: true }, { w: 19, h: c.test }, { w: 16, h: c.by }];
  colsA.push({ w: 277 - colsA.reduce((n, x) => n + x.w, 0), h: c.note });
  const groupsA = ["t1", "t2", "t3"].map((id) => ({ id, label: `${c.tank} <span class="wi" style="margin-top:0.3mm"></span>`, wi: false }));
  const A = table(colsA, 15, groupsA, 7.7);

  // B: 8 nozzles
  const colsB = [{ w: 16, h: c.date }, ...Array.from({ length: 8 }, () => ({ w: 22, h: c.nozzle, wi: true })), { w: 24, h: c.total, calc: true }, { w: 25, h: c.sales, calc: true }, { w: 16, h: c.by }];
  colsB.push({ w: 277 - colsB.reduce((n, x) => n + x.w, 0), h: c.note });
  const B = table(colsB, 17, null, 7.7);

  // C: tankers
  const colsC = [{ w: 16, h: c.date }, { w: 16, h: c.time }, { w: 28, h: c.inv }, { w: 28, h: c.tankerNo }, { w: 22, h: c.prod }, { w: 16, h: c.tankNo }, { w: 24, h: c.qty }, { w: 28, h: c.water }, { w: 16, h: c.by }];
  colsC.push({ w: 277 - colsC.reduce((n, x) => n + x.w, 0), h: c.note });
  const C = table(colsC, 17, null, 7.7);

  // D: the stock check
  const colsD = [{ w: 16, h: c.date }, { w: 25, h: c.A }, { w: 22, h: c.B }, { w: 25, h: c.C }, { w: 24, h: c.D, calc: true }, { w: 24, h: c.E }, { w: 26, h: c.F, calc: true }, { w: 26, h: c.G }, { w: 24, h: c.V, calc: true }, { w: 20, h: c.P, calc: true }, { w: 21, h: c.I }];
  colsD.push({ w: 277 - colsD.reduce((n, x) => n + x.w, 0), h: c.note });
  const D = table(colsD, 15, null, 7.7);

  return doc(t.lang, [part("A", A, 17, 7.7, 1), part("B", B, 17, 7.7, 2), part("C", C, 17, 7.7, 3), part("D", D, 17, 7.7, 4)]);
}

// ───────────────────────── write ─────────────────────────
const JOBS = [];
for (const lang of ["en", "hi"]) {
  const t = TXT[lang];
  JOBS.push({ lang, kind: "density", out: `${OUT}/mdg-density-register${t.suffix}.pdf`, html: densityHtml(t) });
  JOBS.push({ lang, kind: "stock", out: `${OUT}/mdg-stock-register${t.suffix}.pdf`, html: stockHtml(t) });
}

const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
for (const j of JOBS) {
  const page = await browser.newPage();
  await page.setContent(j.html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: j.out, format: "A4", landscape: true, printBackground: true, preferCSSPageSize: true });
  console.log("wrote", j.out);
  // CHECK_DIR=<folder> also draws the PDF pages as pictures there (needs pdftoppm)
  if (process.env.CHECK_DIR) {
    execFileSync("pdftoppm", ["-r", "80", "-png", j.out, `${process.env.CHECK_DIR}/${j.kind}-${j.lang}`]);
  }
  await page.close();
}
await browser.close();
