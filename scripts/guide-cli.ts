/**
 * The MDG guide from the command line:
 *
 *   npm run guide -- check            every page's words, against the rules in src/guides/content.ts
 *   npm run guide -- check en/density one page
 *   npm run guide -- preview          how to see every written page (run the dev server)
 *   npm run guide -- schedule         which page goes live on which day
 *
 * `npm run build` runs `check` first, so a page that breaks a rule stops the
 * build.
 */
import { readFileSync } from "node:fs";
import { checkContent, contentPath, loadAll, parseContent } from "../src/guides/content.ts";
import { byId, type Lang } from "../guide/inventory.ts";
import { RELEASES, LAST_DAY, START, dateOfDay } from "../guide/schedule.ts";

const root = process.cwd();
const [cmd, arg] = process.argv.slice(2);

if (cmd === "check" && arg) {
  const [lang, id] = arg.split("/") as [Lang, string];
  const page = byId.get(id);
  if (!page) throw new Error(`No page with id ${id}`);
  const c = parseContent(readFileSync(contentPath(root, lang, id), "utf8"), arg);
  const errs = checkContent(page, lang, c);
  console.log(errs.length ? errs.join("\n") : `${arg}: OK`);
  process.exit(errs.length ? 1 : 0);
} else if (cmd === "check") {
  const { errors } = loadAll(root);
  const missing = errors.filter((e) => e.endsWith(": missing"));
  const real = errors.filter((e) => !e.endsWith(": missing"));
  const total = RELEASES.length;
  console.log(`${total - missing.length} of ${total} pages written, ${missing.length} missing, ${real.length} problem(s).`);
  for (const e of real) console.log(`  ${e}`);
  if (missing.length) console.log(`Missing: ${missing.map((m) => m.replace(": missing", "")).join(", ")}`);
  // A real build needs every page; GUIDE_ALLOW_MISSING=1 lets a local build go without the missing ones.
  const missingFatal = missing.length > 0 && process.env.GUIDE_ALLOW_MISSING !== "1" && process.env.GUIDE_SKIP !== "1";
  process.exit(real.length || missingFatal ? 1 : 0);
} else if (cmd === "preview") {
  console.log("The guides are Next.js pages now. Run `npm run dev`: every written page is served at its real address.");
  console.log("Pages whose release day has not come yet answer 404 (the proxy gates them by date); to see one early, check it with");
  console.log("`npm run guide -- schedule` and open it once its day arrives, or temporarily lower START in guide/schedule.ts on your machine.");
} else if (cmd === "schedule") {
  console.log(`Day 1 = ${START} (India). ${RELEASES.length} pages over ${LAST_DAY} days.`);
  for (let d = 1; d <= LAST_DAY; d++) {
    const rs = RELEASES.filter((r) => r.day === d);
    console.log(`Day ${String(d).padStart(2)} ${dateOfDay(d)}  ${rs.map((r) => r.path).join("  ")}`);
  }
} else {
  console.log("Usage: npm run guide -- check [lang/id] | preview | schedule");
  process.exit(1);
}
