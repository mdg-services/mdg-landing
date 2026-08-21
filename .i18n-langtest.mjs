/* Proves the language rules: system default when nothing is stored, a stored
   choice that outranks the system, and ?lang= treated as a choice. */
import { chromium } from "playwright-core";

const URL = process.argv[2] ?? "http://localhost:4319/";
const STORE_KEY = process.argv[3] ?? "vruoom.lang";

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});

const fails = [];
const ok = [];
function check(name, actual, expected) {
  (actual === expected ? ok : fails).push(`${name}: expected ${expected}, got ${actual}`);
}

async function open(locale) {
  const ctx = await browser.newContext({ locale, viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(350);
  return { ctx, page };
}
const langOf = (page) => page.evaluate(() => document.documentElement.lang);
const storedOf = (page, key) => page.evaluate((k) => localStorage.getItem(k), key);

// 1. Device is Hindi, nothing ever chosen.
{
  const { ctx, page } = await open("hi-IN");
  check("hi device, no choice -> hi", await langOf(page), "hi");
  check("hi device, no choice -> nothing written", await storedOf(page, STORE_KEY), null);
  await ctx.close();
}

// 2. Device is English, nothing ever chosen.
{
  const { ctx, page } = await open("en-GB");
  check("en device, no choice -> en", await langOf(page), "en");
  await ctx.close();
}

// 3. Device is Hindi, reader picks English. The choice must outrank the device,
//    survive a reload, and survive a fresh page in the same profile.
{
  const { ctx, page } = await open("hi-IN");
  check("hi device starts hi", await langOf(page), "hi");
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await page.waitForTimeout(250);
  check("after tapping EN -> en", await langOf(page), "en");
  check("choice was written", await storedOf(page, STORE_KEY), "en");
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(350);
  check("after reload, choice beats device", await langOf(page), "en");
  const page2 = await ctx.newPage();
  await page2.goto(URL, { waitUntil: "domcontentloaded" });
  await page2.waitForTimeout(350);
  check("new tab, same profile, still en", await langOf(page2), "en");
  await ctx.close();
}

// 4. A shared ?lang=hi link on an English device is a choice, not a hint.
{
  const { ctx } = await open("en-GB");
  const page = await ctx.newPage();
  await page.goto(URL + "?lang=hi", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400);
  check("?lang=hi on en device -> hi", await langOf(page), "hi");
  check("?lang=hi is remembered", await storedOf(page, STORE_KEY), "hi");
  check(
    "?lang= is cleaned off the url",
    await page.evaluate(() => new URL(location.href).searchParams.has("lang")),
    false,
  );
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(350);
  check("plain url afterwards, still hi", await langOf(page), "hi");
  await ctx.close();
}

// 5. Storage refused (private mode). Must fall back to the device, not crash.
{
  const ctx = await browser.newContext({ locale: "hi-IN", viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() { throw new DOMException("denied", "SecurityError"); },
    });
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(350);
  check("no storage, hi device -> hi", await langOf(page), "hi");
  check("no storage -> no crash", errors.length, 0);
  await ctx.close();
}

await browser.close();
console.log(ok.map((l) => "  ok   " + l).join("\n"));
if (fails.length) {
  console.log("\nFAILED:\n" + fails.map((l) => "  FAIL " + l).join("\n"));
  process.exit(1);
}
console.log(`\nall ${ok.length} language rules hold`);
