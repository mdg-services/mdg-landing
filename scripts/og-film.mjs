// Renders the link-preview cards for the film pages: public/film/og-<film>.jpg,
// 1200x630 JPEG (WhatsApp wants it small; these land well under 300 kB).
// Needs local Chrome. The frame is the film's own poster from its packaged
// version folder; pass another with FRAME=/path/to/poster.jpg.
//   node scripts/og-film.mjs
import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const ROOT = path.resolve(import.meta.dirname, "..");
const films = JSON.parse(readFileSync(path.join(ROOT, "src/film/films.json"), "utf8"));
const full = films.kavach;
const frameFor = (f) =>
  process.env.FRAME ||
  path.join(ROOT, "..", "marketing", ".work", "web", f.film, f.version, "poster.jpg");
const fullMin = Math.round(full.duration / 60);
const mark = `data:image/png;base64,${readFileSync(path.join(ROOT, "public/logo-mark-white.png")).toString("base64")}`;

const CARDS = [
  { out: "public/film/og-kavach.jpg", frame: frameFor(full), h: "डीलर कवच", sub: `पूरी फ़िल्म · ${fullMin} मिनट`,
    line: "पंप का रोज़ का काग़ज़ी काम — समय पर, बिना भागदौड़।" },
  // the short has no frame of its own yet: it borrows the full film's until its version exists
  { out: "public/film/og-kavach-short.jpg",
    frame: films["kavach-short"].version ? frameFor(films["kavach-short"]) : frameFor(full),
    h: "डीलर कवच", sub: "40 सेकंड में", line: "आपके पंप के लिए क्या करता है — एक नज़र में।" },
];

const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
for (const c of CARDS) {
  const frame = `data:image/jpeg;base64,${readFileSync(c.frame).toString("base64")}`;
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await p.setContent(`<!doctype html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600&family=Tiro+Devanagari+Hindi&family=Noto+Sans+Devanagari:wght@500;700&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{width:1200px;height:630px;background:#101133;color:#fff;display:flex;overflow:hidden;
      font-family:'Noto Sans Devanagari',system-ui,sans-serif}
    .l{flex:1;padding:60px 64px;display:flex;flex-direction:column;justify-content:space-between;
      background:radial-gradient(110% 80% at 0% 0%,#2c2e80 0%,#101133 65%)}
    .brand{display:flex;align-items:center;gap:14px;font-family:'Space Grotesk';font-weight:600;font-size:26px}
    .brand img{width:52px;height:52px}
    h1{font-family:'Tiro Devanagari Hindi',serif;font-weight:400;font-size:104px;line-height:1.1}
    .sub{display:inline-flex;align-items:center;gap:14px;margin-top:18px;font-size:34px;font-weight:700;color:#F5A524}
    .play{width:56px;height:56px;border-radius:50%;background:#F5A524;display:flex;align-items:center;justify-content:center}
    .play i{width:0;height:0;border-left:20px solid #101133;border-top:12px solid transparent;border-bottom:12px solid transparent;margin-left:5px}
    .line{font-size:27px;line-height:1.5;color:#C5C7ED;max-width:24em}
    .foot{font-size:20px;color:#C5C7ED;font-family:'Space Grotesk'}
    .r{width:354px;height:630px;position:relative}
    .r img{width:100%;height:100%;object-fit:cover;display:block}
    .r:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#101133 0%,rgba(16,17,51,0) 22%)}
  </style></head><body>
    <div class="l">
      <div class="brand"><img src="${mark}">MDG Services</div>
      <div><h1>${c.h}</h1><div class="sub"><span class="play"><i></i></span>${c.sub}</div></div>
      <div><p class="line">${c.line}</p><p class="foot" style="margin-top:14px">mdgservices.in</p></div>
    </div>
    <div class="r"><img src="${frame}"></div>
  </body></html>`, { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  const out = path.join(ROOT, c.out);
  await p.screenshot({ path: out, type: "jpeg", quality: 84 });
  console.log("wrote", c.out, `${(statSync(out).size / 1024).toFixed(0)} kB`);
  await p.close();
}
await b.close();
