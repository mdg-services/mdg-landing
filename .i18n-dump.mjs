// Dumps the full rendered text of a page, for before/after regression diffing.
import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";

const [url, out, lang] = process.argv.slice(2);

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: "reduce",
  locale: lang === "hi" ? "hi-IN" : "en-US",
});
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push("pageerror: " + String(e)));
page.on("console", (m) => m.type() === "error" && errors.push("console: " + m.text()));

await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate(async () => {
  const step = window.innerHeight * 0.8;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(400);

// Open every disclosure so collapsed copy is captured too.
await page.evaluate(() => {
  document.querySelectorAll("button").forEach((b) => {
    const t = (b.textContent || "").trim();
    if (/Leave my number|Terms & Conditions/i.test(t)) b.click();
  });
});
await page.waitForTimeout(500);
const faqButtons = await page.$$('button[aria-controls^="faq-"]');
for (const b of faqButtons) { await b.click().catch(() => {}); await page.waitForTimeout(80); }
await page.waitForTimeout(300);

const text = await page.evaluate(() => document.body.innerText);
const htmlLang = await page.evaluate(() => document.documentElement.lang);
const title = await page.title();
const desc = await page.evaluate(
  () => document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
);

writeFileSync(
  out,
  [
    `URL: ${url}`,
    `html lang: ${htmlLang}`,
    `title: ${title}`,
    `description: ${desc}`,
    errors.length ? `ERRORS:\n${errors.join("\n")}` : "ERRORS: none",
    "──── body text ────",
    text.split("\n").map((l) => l.trim()).filter(Boolean).join("\n"),
  ].join("\n"),
);
console.log(`${out}: ${text.length} chars, ${errors.length} errors`);
await browser.close();
