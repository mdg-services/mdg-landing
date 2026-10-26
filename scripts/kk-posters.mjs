// The printable "credit" posters (A4 portrait) on
// mdgservices.in/khata-kavach/credit/udhar-band-hai-poster/, in Hindi and English.
//
// Six posters, each in two languages. For every poster and language it writes
//   public/kk/downloads/udhar-poster-<slug>-<hindi|english>.pdf   (one A4 page)
//   public/kk/downloads/udhar-poster-<slug>-<hindi|english>.png   (small preview, shown on the page)
// plus one PDF per language with all six posters:
//   public/kk/downloads/udhar-posters-all-<hindi|english>.pdf
//
// Plain black type on white, so it prints well in black and white. Our own
// words, no pictures, no one else's marks. The only mark is a tiny
// "mdgservices.in" at the foot.
//
// Needs local Chrome:  node scripts/kk-posters.mjs
// CHECK_DIR=<folder> also saves a full-size picture of every poster there, to look at.
import { chromium } from "playwright-core";
import { mkdirSync, statSync } from "node:fs";

const OUT = "/Users/dissu/Documents/PP/mdg-service/mdg-landing/public/kk/downloads";

// Each poster: `head` is the big text, one array item per line; `sub` is the polite line below it.
const POSTERS = [
  {
    slug: "udhar-band-hai",
    hi: { note: "कृपया ध्यान दें", head: ["उधार", "बंद है"], sub: "भुगतान नकद या UPI से कीजिए।<br>आपके सहयोग के लिए धन्यवाद।" },
    en: { note: "PLEASE NOTE", head: ["No credit", "given here"], sub: "Please pay in cash or by UPI.<br>Thank you for understanding." },
  },
  {
    slug: "aaj-nakad-kal-udhar",
    hi: { note: "कृपया ध्यान दें", head: ["आज नकद,", "कल उधार"], sub: "आज का तेल, आज के पैसे में।<br>धन्यवाद।" },
    en: { note: "PLEASE NOTE", head: ["Cash today,", "credit tomorrow"], sub: "Today’s fuel is for today’s payment.<br>Thank you." },
  },
  {
    slug: "seema-tak",
    hi: { note: "हमारा नियम", head: ["उधार सिर्फ़", "तय सीमा तक"], sub: "हर खाते की सीमा मालिक तय करते हैं।<br>अपनी सीमा पंप के ऑफ़िस में पूछ लीजिए।" },
    en: { note: "OUR RULE", head: ["Credit only up to", "the agreed limit"], sub: "The owner sets the limit for every account.<br>Please ask at the pump office for yours." },
  },
  {
    slug: "har-udhar-ki-parchi",
    hi: { note: "हमारा नियम", head: ["हर उधार की भराई पर", "पर्ची मिलेगी"], sub: "पर्ची लीजिए और संभालकर रखिए।<br>महीने का हिसाब मिलाने में काम आएगी।" },
    en: { note: "OUR RULE", head: ["Every credit fill", "gets a slip"], sub: "Please take your slip and keep it.<br>It helps us match the month’s account." },
  },
  {
    slug: "purana-hisab-saaf",
    hi: { note: "हमारा नियम", head: ["पुराना हिसाब साफ़,", "तभी नया उधार"], sub: "पहले पिछला बकाया चुकाइए,<br>फिर नया तेल उधार मिलेगा।" },
    en: { note: "OUR RULE", head: ["Old account clear,", "then new credit"], sub: "Please clear the earlier balance first.<br>New credit follows." },
  },
  {
    slug: "malik-se-baat",
    hi: { note: "हमारा नियम", head: ["उधार के लिए", "मालिक से", "बात करें"], sub: "उधार तय सीमा के भीतर,<br>और मालिक की हाँ के बाद ही।" },
    en: { note: "OUR RULE", head: ["For credit,", "please speak", "to the owner"], sub: "Credit is given within the agreed limit,<br>and only with the owner’s OK." },
  },
];

const LANGS = [
  { key: "hi", word: "hindi", lang: "hi" },
  { key: "en", word: "english", lang: "en" },
];

const FONTS = "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Noto+Sans+Devanagari:wght@400;600;700;800&display=swap";

const poster = (p, key) => {
  const t = p[key];
  return `<section class="poster ${key}">
  <div class="frame">
    <div class="note">${t.note}</div>
    <div class="mid">
      <div class="head">${t.head.map((l) => `<div class="line">${l}</div>`).join("")}</div>
      <div class="bar"></div>
      <p class="sub">${t.sub}</p>
    </div>
    <div class="foot">mdgservices.in</div>
  </div>
</section>`;
};

const html = (key, lang) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">
<link href="${FONTS}" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #fff; }
  body { font-family: Inter, "Noto Sans Devanagari", sans-serif; color: #111; }
  /* A4 is 297 mm: the page is 0.5 mm shorter so a rounding error never adds a blank page */
  .poster { width: 210mm; height: 296.5mm; padding: 13mm; break-after: page; page-break-after: always; overflow: hidden; background: #fff; }
  .poster:last-child { break-after: auto; page-break-after: auto; }
  .frame { position: relative; width: 100%; height: 100%; border: 2.4mm solid #111; display: flex; flex-direction: column; align-items: center; padding: 11mm 9mm 8mm; }
  .frame::before { content: ""; position: absolute; inset: 2.4mm; border: 0.5mm solid #111; pointer-events: none; }
  .note { font-size: 17pt; font-weight: 600; color: #0F4A3D; text-align: center; }
  .en .note { letter-spacing: 0.22em; font-size: 14pt; }
  .mid { flex: 1; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
  .head { font-weight: 800; color: #111; line-height: 1.18; text-align: center; }
  .en .head { line-height: 1.08; letter-spacing: -0.01em; }
  .line { white-space: nowrap; }
  .bar { width: 46mm; height: 2.6mm; background: #0F4A3D; margin: 12mm 0 11mm; }
  .sub { font-size: 25pt; font-weight: 600; line-height: 1.5; color: #111; text-wrap: balance; }
  .en .sub { font-size: 22pt; line-height: 1.4; }
  .foot { font-size: 8pt; color: #5B6964; letter-spacing: 0.04em; }
</style></head><body>
${POSTERS.map((p) => poster(p, key)).join("\n")}
<script>
  // Make each headline as big as the frame allows: widest line inside the width, all lines inside the height.
  window.fit = () => {
    for (const el of document.querySelectorAll(".poster")) {
      const mid = el.querySelector(".mid");
      const head = el.querySelector(".head");
      const boxW = mid.clientWidth - 8;
      const sub = el.querySelector(".sub");
      const bar = el.querySelector(".bar");
      const barH = bar.getBoundingClientRect().height + parseFloat(getComputedStyle(bar).marginTop) + parseFloat(getComputedStyle(bar).marginBottom);
      const boxH = mid.clientHeight - barH - sub.getBoundingClientRect().height - 28;
      let lo = 20, hi = 260;
      while (hi - lo > 1) {
        const m = Math.floor((lo + hi) / 2);
        head.style.fontSize = m + "px";
        const wide = Math.max(...[...head.children].map((c) => c.scrollWidth));
        (wide <= boxW && head.getBoundingClientRect().height <= boxH ? (lo = m) : (hi = m));
      }
      head.style.fontSize = lo + "px";
    }
  };
</script>
</body></html>`;

const kb = (f) => Math.round(statSync(f).size / 1024);

mkdirSync(OUT, { recursive: true });
if (process.env.CHECK_DIR) mkdirSync(process.env.CHECK_DIR, { recursive: true });

const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const report = [];
for (const L of LANGS) {
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  await page.setContent(html(L.key, L.lang), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => window.fit());

  // all six in one PDF
  const all = `${OUT}/udhar-posters-all-${L.word}.pdf`;
  await page.pdf({ path: all, preferCSSPageSize: true, printBackground: true });
  report.push([all, kb(all)]);

  const els = await page.locator(".poster").all();
  for (let i = 0; i < POSTERS.length; i++) {
    const slug = POSTERS[i].slug;
    // one poster = one page of the big PDF
    const pdf = `${OUT}/udhar-poster-${slug}-${L.word}.pdf`;
    await page.pdf({ path: pdf, preferCSSPageSize: true, printBackground: true, pageRanges: String(i + 1) });
    report.push([pdf, kb(pdf)]);
    if (process.env.CHECK_DIR) await els[i].screenshot({ path: `${process.env.CHECK_DIR}/poster-${slug}-${L.word}.png` });
  }
  await page.close();

  // small previews for the page, at 320 px wide
  const small = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 320 / 793.7 });
  await small.setContent(html(L.key, L.lang), { waitUntil: "networkidle" });
  await small.evaluate(() => document.fonts.ready);
  await small.evaluate(() => window.fit());
  const smallEls = await small.locator(".poster").all();
  for (let i = 0; i < POSTERS.length; i++) {
    const png = `${OUT}/udhar-poster-${POSTERS[i].slug}-${L.word}.png`;
    await smallEls[i].screenshot({ path: png });
    report.push([png, kb(png)]);
  }
  await small.close();
}
await browser.close();
for (const [f, k] of report) console.log(String(k).padStart(5), "KB ", f.replace(OUT + "/", ""));
