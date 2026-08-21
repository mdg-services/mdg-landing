import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const URL = process.argv[2] ?? "http://localhost:4319/";
const OUT = process.argv[3] ?? "/private/tmp/claude-502/-Users-dissu-Documents-PP-mdg-service/35b56e93-8ecc-4a9f-b998-4652a90c3724/scratchpad/shots-site";
const TAG = process.argv[4] ?? "v";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  args: ["--force-color-profile=srgb", "--hide-scrollbars"],
});

const shots = [
  { name: "desktop", width: 1440, height: 900, dsf: 2 },
  { name: "mobile", width: 390, height: 844, dsf: 2 },
];

const problems = [];

for (const s of shots) {
  const ctx = await browser.newContext({
    viewport: { width: s.width, height: s.height },
    deviceScaleFactor: s.dsf,
    // Forces the flat render path in every component, which is also the
    // accessibility path we ship, so this doubles as a check of it.
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.goto(URL, { waitUntil: "networkidle" });
  // Walk the page so lazy images below the fold actually load before we
  // screenshot or assert on them.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(600);

  // Horizontal overflow check: the page body must never scroll sideways.
  const overflow = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
    offenders: [...document.querySelectorAll("*")]
      .filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
      .slice(0, 6)
      .map((el) => el.tagName + "." + (el.className?.toString?.().slice(0, 60) ?? "")),
  }));
  if (overflow.scrollW > overflow.clientW + 1) {
    problems.push(`${s.name}: horizontal overflow ${overflow.scrollW} > ${overflow.clientW} :: ${overflow.offenders.join(" | ")}`);
  }

  // Every image must actually have decoded.
  const badImgs = await page.evaluate(() =>
    [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
  );
  if (badImgs.length) problems.push(`${s.name}: broken images :: ${badImgs.join(", ")}`);

  // Em-dash ban, mechanical.
  const dashes = await page.evaluate(() => {
    const t = document.body.innerText;
    const hits = [];
    for (const ch of ["—", "–"]) {
      let i = t.indexOf(ch);
      while (i !== -1 && hits.length < 8) {
        hits.push(t.slice(Math.max(0, i - 45), i + 45).replace(/\n/g, " "));
        i = t.indexOf(ch, i + 1);
      }
    }
    return hits;
  });
  if (dashes.length) problems.push(`${s.name}: EM/EN DASH found :: ${dashes.join(" ~~ ")}`);

  await page.screenshot({ path: `${OUT}/${TAG}-${s.name}.png`, fullPage: true });

  // Section-by-section for readable review.
  if (s.name === "desktop") {
    const secs = await page.$$("main > section");
    for (let i = 0; i < secs.length; i++) {
      await secs[i].screenshot({ path: `${OUT}/${TAG}-sec-${String(i).padStart(2, "0")}.png` }).catch(() => {});
    }
  }

  if (errors.length) problems.push(`${s.name}: console/page errors :: ${errors.slice(0, 5).join(" | ")}`);
  await ctx.close();
}

await browser.close();
console.log(problems.length ? "PROBLEMS:\n" + problems.join("\n") : "clean: no overflow, no broken images, no em-dashes, no console errors");
