// The printable udhar khata page for a petrol pump (A4, landscape, one page per transporter) on
// mdgservices.in/khata-kavach/credit/udhar-khata-format/, in English and Hindi:
// public/kk/downloads/udhar-khata-page.pdf and udhar-khata-page-hindi.pdf.
// Needs local Chrome:  node scripts/kk-khata-page.mjs
import { chromium } from "playwright-core";

const OUT = "/Users/dissu/Documents/PP/mdg-service/mdg-landing/public/kk/downloads";
const ROWS = 15;

const PAGES = [
  {
    out: `${OUT}/udhar-khata-page.pdf`,
    lang: "en",
    title: "Udhar khata",
    sub: "One page for each transporter",
    pageNo: "Page no.",
    fields: ["Your pump", "Transporter", "Phone", "Credit limit (Rs)", "Credit days", "Balance brought forward (Rs)"],
    cols: ["Date", "Truck no.", "Fuel", "Litres", "Udhar given (Rs)", "Money received (Rs)", "How paid · UTR or cheque no.", "Coupon / slip no.", "Who filled", "Balance (Rs)", "Transporter's sign"],
    rule: "Write each line when the fuel goes in. Balance = the balance on the line above (on the first line, the balance brought forward) + udhar given − money received. Never write over a line: strike a wrong one through, leave it out of the balance, and write the right line below. When the page is full, carry the last balance to a new page as the balance brought forward.",
    foot: "A free format from MDG Services · mdgservices.in/khata-kavach/credit/udhar-khata-format/",
  },
  {
    out: `${OUT}/udhar-khata-page-hindi.pdf`,
    lang: "hi",
    title: "उधार खाता",
    sub: "हर ट्रांसपोर्टर का एक पेज",
    pageNo: "पेज नंबर",
    fields: ["आपका पंप", "ट्रांसपोर्टर", "फ़ोन", "उधार की सीमा (₹)", "उधार के दिन", "पिछला बकाया (₹)"],
    cols: ["तारीख़", "गाड़ी नंबर", "तेल", "लीटर", "उधार दिया (₹)", "पैसे मिले (₹)", "कैसे मिले · UTR या चेक नंबर", "कूपन / पर्ची नंबर", "किसने भरा", "बकाया (₹)", "ट्रांसपोर्टर के दस्तख़त"],
    rule: "हर लाइन तेल डलते समय लिखें। बकाया = ऊपर की लाइन का बकाया (पहली लाइन पर पिछला बकाया) + उधार दिया − पैसे मिले। किसी लाइन पर दोबारा न लिखें: गलत लाइन पर एक लकीर खींचें, उसे बकाये में न गिनें, और सही लाइन नीचे लिखें। पेज भर जाए तो आख़िरी बकाया नए पेज पर पिछला बकाया बनाकर लिखें।",
    foot: "MDG Services का मुफ़्त फ़ॉर्मेट · mdgservices.in/hi/khata-kavach/credit/udhar-khata-format/",
  },
];

// column widths in mm (sum = 277, the A4 landscape width inside 10 mm margins)
const WIDTHS = [20, 26, 26, 18, 25, 25, 33, 22, 22, 25, 35];

const html = (p) => `<!doctype html><html lang="${p.lang}"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4 landscape; margin: 10mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Inter, "Noto Sans Devanagari", sans-serif; color: #14231F; font-size: 10.5pt; }
  .top { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2.5pt solid #0F4A3D; padding-bottom: 3mm; }
  h1 { font-size: 20pt; color: #0F4A3D; line-height: 1.2; }
  .sub { font-size: 10pt; color: #43524D; margin-top: 1mm; }
  .pg { font-size: 10pt; color: #43524D; }
  .pg span { display: inline-block; width: 22mm; border-bottom: 0.6pt solid #43524D; margin-left: 2mm; }
  .fields { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3mm 8mm; margin: 4mm 0 4mm; }
  .f { display: flex; align-items: flex-end; gap: 2mm; font-size: 9.5pt; color: #43524D; white-space: nowrap; }
  .f i { flex: 1; border-bottom: 0.6pt solid #43524D; height: 5mm; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  th { background: #0F4A3D; color: #fff; font-size: 8.5pt; font-weight: 600; text-align: left; padding: 1.5mm 1.5mm; line-height: 1.3; vertical-align: bottom; border: 0.6pt solid #0F4A3D; }
  td { border: 0.6pt solid #9FB3AC; height: 8.1mm; }
  tr:nth-child(even) td { background: #F6F5EF; }
  td.bal { background: #E3EEE8 !important; }
  .rule { margin-top: 3mm; font-size: 8.8pt; color: #14231F; line-height: 1.45; }
  .foot { margin-top: 1.5mm; font-size: 7.5pt; color: #5B6964; }
</style></head><body>
  <div class="top">
    <div><h1>${p.title}</h1><div class="sub">${p.sub}</div></div>
    <div class="pg">${p.pageNo}<span></span></div>
  </div>
  <div class="fields">${p.fields.map((f) => `<div class="f">${f}<i></i></div>`).join("")}</div>
  <table>
    <colgroup>${WIDTHS.map((w) => `<col style="width:${w}mm">`).join("")}</colgroup>
    <thead><tr>${p.cols.map((c) => `<th>${c}</th>`).join("")}</tr></thead>
    <tbody>${Array.from({ length: ROWS }, () => `<tr>${p.cols.map((_, i) => `<td${i === 9 ? ' class="bal"' : ""}></td>`).join("")}</tr>`).join("")}</tbody>
  </table>
  <p class="rule">${p.rule}</p>
  <p class="foot">${p.foot}</p>
</body></html>`;

const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
for (const p of PAGES) {
  const page = await browser.newPage();
  await page.setContent(html(p), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: p.out, format: "A4", landscape: true, printBackground: true, preferCSSPageSize: true });
  // CHECK_DIR=<folder> also saves a picture of each page there, to look at (never into public/)
  if (process.env.CHECK_DIR) {
    await page.setViewportSize({ width: 1123, height: 794 });
    await page.screenshot({ path: `${process.env.CHECK_DIR}/${p.lang}.png`, fullPage: true });
  }
  console.log("wrote", p.out);
  await page.close();
}
await browser.close();
