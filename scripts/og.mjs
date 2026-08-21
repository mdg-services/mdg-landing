// Renders the social card at public/og.png. Needs local Chrome.
import { chromium } from "playwright-core";
const CARDS = [
  {
    out: "/Users/dissu/Documents/PP/mdg-service/mdg-landing/public/og.png",
    bg: "#101133", fg: "#FFFFFF", dim: "#C5C7ED", accent: "#F5A524", line: "#2C2E80",
    mark: "MDG Services",
    h: `Your pump's paperwork,<br><span style="color:#F5A524">done before you wake up.</span>`,
    sub: `Dealer's <span class="deva">कवच</span>. Every filing, renewal, inspection and daily report your pump owes, tracked in one app.`,
    stats: [["536 / 557", "figures matched your own book"], ["45", "compliance items on the clock"], ["2", "languages, everywhere"]],
    foot: "mdgservices.in  ·  1800-891-3496",
  },
];
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
for (const c of CARDS) {
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
  await p.setContent(`<!doctype html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500&family=Tiro+Devanagari+Hindi&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{width:1200px;height:630px;background:${c.bg};color:${c.fg};
      font-family:Inter,system-ui,sans-serif;padding:66px 72px;display:flex;flex-direction:column;justify-content:space-between}
    .mark{display:flex;align-items:center;gap:12px;font-family:'Space Grotesk';font-weight:600;font-size:23px;letter-spacing:-.02em}
    .dot{width:13px;height:13px;background:${c.accent};transform:rotate(45deg)}
    h1{font-family:'Space Grotesk';font-weight:600;font-size:63px;line-height:1.06;letter-spacing:-.035em}
    .sub{margin-top:22px;font-size:21px;line-height:1.5;color:${c.dim};max-width:44ch}
    .deva{font-family:'Tiro Devanagari Hindi',serif;line-height:1.45}
    .stats{display:flex;gap:0;border-top:1px solid ${c.line};padding-top:24px}
    .st{flex:1;border-left:1px solid ${c.line};padding-left:22px}
    .st:first-child{border-left:0;padding-left:0}
    .sv{font-family:'Space Grotesk';font-weight:600;font-size:33px;letter-spacing:-.02em}
    .sl{margin-top:7px;font-size:14.5px;line-height:1.35;color:${c.dim};max-width:20ch}
    .foot{margin-top:26px;font-size:16px;color:${c.dim}}
  </style></head><body>
    <div class="mark"><span class="dot"></span>${c.mark}</div>
    <div><h1>${c.h}</h1><p class="sub">${c.sub}</p></div>
    <div><div class="stats">${c.stats.map(([v,l])=>`<div class="st"><div class="sv">${v}</div><div class="sl">${l}</div></div>`).join("")}</div>
    <div class="foot">${c.foot}</div></div>
  </body></html>`, { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  await p.screenshot({ path: c.out });
  console.log("wrote", c.out);
  await p.close();
}
await b.close();
