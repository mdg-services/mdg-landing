// The printable statement of account a petrol pump sends a transporter on credit (A4, portrait, one page) on
// mdgservices.in/khata-kavach/getting-paid/customer-statement-format/, in English and Hindi:
// public/kk/downloads/customer-statement.pdf and customer-statement-hindi.pdf.
// The Excel twin is made by scripts/kk-statement.py.
// Needs local Chrome:  node scripts/kk-statement.mjs
// CHECK_DIR=<folder> also saves a picture of each page there, to look at (never into public/).
import { chromium } from "playwright-core";

const OUT = "/Users/dissu/Documents/PP/mdg-service/mdg-landing/public/kk/downloads";
const ROWS = 18;

const PAGES = [
  {
    out: `${OUT}/customer-statement.pdf`,
    lang: "en",
    title: "Statement of account",
    sub: "To send to a transporter on credit",
    fields: [["Pump", "Statement date"], ["Transporter", "Period from … to …"]],
    cols: ["Date", "Bill / slip no.", "Truck no.", "Details: fuel and litres, or how paid and UTR / cheque no.", "Udhar given (Rs)", "Money received (Rs)", "Balance (Rs)"],
    open: "Opening balance",
    close: "Totals and closing balance",
    rule: "Balance = the balance on the line above (on the first line, the opening balance) + udhar given − money received. Closing balance = opening balance + total udhar given − total money received. List every fill and every payment in date order.",
    confirm: "Please check this statement. If it is correct, sign below. If anything looks wrong, tell us within 7 days and we will look at it together.",
    signBiz: "For the pump: sign and date",
    signCust: "Transporter's confirmation: name, sign and date",
    foot: "A format from MDG Services · mdgservices.in/khata-kavach/getting-paid/customer-statement-format/",
  },
  {
    out: `${OUT}/customer-statement-hindi.pdf`,
    lang: "hi",
    title: "खाते का स्टेटमेंट",
    sub: "उधार वाले ट्रांसपोर्टर को भेजने के लिए",
    fields: [["आपका पंप", "स्टेटमेंट की तारीख़"], ["ट्रांसपोर्टर", "अवधि: कब से … कब तक …"]],
    cols: ["तारीख़", "बिल / पर्ची नंबर", "गाड़ी नंबर", "ब्योरा: तेल और लीटर, या कैसे मिले और UTR / चेक नंबर", "उधार दिया (₹)", "पैसे मिले (₹)", "बकाया (₹)"],
    open: "शुरू का बकाया",
    close: "जोड़ और आख़िरी बकाया",
    rule: "बकाया = ऊपर की लाइन का बकाया (पहली लाइन पर शुरू का बकाया) + उधार दिया − पैसे मिले। आख़िरी बकाया = शुरू का बकाया + कुल उधार दिया − कुल पैसे मिले। हर भराई और हर पेमेंट तारीख़ के क्रम में लिखें।",
    confirm: "कृपया यह स्टेटमेंट जाँच लें। ठीक हो तो नीचे दस्तख़त करें। कुछ गलत लगे तो 7 दिन के भीतर हमें बताएँ, हम साथ बैठकर देख लेंगे।",
    signBiz: "पंप की ओर से: दस्तख़त और तारीख़",
    signCust: "ट्रांसपोर्टर की पुष्टि: नाम, दस्तख़त और तारीख़",
    foot: "MDG Services का फ़ॉर्मेट · mdgservices.in/hi/khata-kavach/getting-paid/customer-statement-format/",
  },
];

// column widths in mm (sum = 190, the A4 portrait width inside 10 mm margins)
const WIDTHS = [18, 22, 31, 47, 24, 24, 24];

const html = (p) => `<!doctype html><html lang="${p.lang}"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4 portrait; margin: 10mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Inter, "Noto Sans Devanagari", sans-serif; color: #14231F; font-size: 10pt; }
  .top { border-bottom: 2.5pt solid #0F4A3D; padding-bottom: 3mm; }
  h1 { font-size: 20pt; color: #0F4A3D; line-height: 1.25; }
  .sub { font-size: 10pt; color: #43524D; margin-top: 1mm; }
  .fields { display: grid; grid-template-columns: 1fr 1fr; gap: 3.5mm 10mm; margin: 5mm 0 5mm; }
  .f { display: flex; align-items: flex-end; gap: 2mm; font-size: 9.5pt; color: #43524D; white-space: nowrap; }
  .f i { flex: 1; border-bottom: 0.6pt solid #43524D; height: 5.5mm; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  th { background: #0F4A3D; color: #fff; font-size: 8pt; font-weight: 600; text-align: left; padding: 1.5mm 1.5mm; line-height: 1.3; vertical-align: bottom; border: 0.6pt solid #0F4A3D; }
  td { border: 0.6pt solid #9FB3AC; height: 8mm; font-size: 8.5pt; padding: 0 1.5mm; }
  tr.line:nth-child(even) td { background: #F6F5EF; }
  td.bal { background: #E3EEE8 !important; }
  tr.open td, tr.tot td { background: #E3EEE8; font-weight: 700; height: 8.5mm; }
  tr.tot td.label, tr.open td.label { text-align: right; }
  .rule { margin-top: 3.5mm; font-size: 8.5pt; line-height: 1.45; }
  .confirm { margin-top: 4mm; border: 0.8pt solid #0F4A3D; border-radius: 1.5mm; padding: 3mm 4mm 4mm; }
  .confirm p { font-size: 9.5pt; line-height: 1.45; }
  .sigs { display: grid; grid-template-columns: 1fr 1fr; gap: 12mm; margin-top: 11mm; }
  .sig { border-top: 0.6pt solid #43524D; padding-top: 1.2mm; font-size: 8pt; color: #43524D; }
  .foot { margin-top: 3mm; font-size: 7.5pt; color: #5B6964; }
</style></head><body>
  <div class="top"><h1>${p.title}</h1><div class="sub">${p.sub}</div></div>
  <div class="fields">${p.fields.flat().map((f) => `<div class="f">${f}<i></i></div>`).join("")}</div>
  <table>
    <colgroup>${WIDTHS.map((w) => `<col style="width:${w}mm">`).join("")}</colgroup>
    <thead><tr>${p.cols.map((c) => `<th>${c}</th>`).join("")}</tr></thead>
    <tbody>
      <tr class="open"><td></td><td></td><td></td><td class="label">${p.open}</td><td></td><td></td><td></td></tr>
      ${Array.from({ length: ROWS }, () => `<tr class="line">${p.cols.map((_, i) => `<td${i === 6 ? ' class="bal"' : ""}></td>`).join("")}</tr>`).join("")}
      <tr class="tot"><td></td><td></td><td></td><td class="label">${p.close}</td><td></td><td></td><td></td></tr>
    </tbody>
  </table>
  <p class="rule">${p.rule}</p>
  <div class="confirm"><p>${p.confirm}</p>
    <div class="sigs"><div class="sig">${p.signBiz}</div><div class="sig">${p.signCust}</div></div>
  </div>
  <p class="foot">${p.foot}</p>
</body></html>`;

const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
for (const p of PAGES) {
  const page = await browser.newPage();
  await page.setContent(html(p), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const pdf = await page.pdf({ path: p.out, format: "A4", printBackground: true, preferCSSPageSize: true });
  // the statement must stay on one sheet of paper
  const pages = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
  if (pages !== 1) throw new Error(`${p.out} is ${pages} pages, not 1: cut a row`);
  // CHECK_DIR=<folder> also saves a picture of each page there, to look at (never into public/)
  if (process.env.CHECK_DIR) {
    await page.setViewportSize({ width: 794, height: 1123 });
    await page.screenshot({ path: `${process.env.CHECK_DIR}/statement-${p.lang}.png`, fullPage: true });
  }
  console.log("wrote", p.out);
  await page.close();
}
await browser.close();
