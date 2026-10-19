/**
 * The guide pages from the command line, for both collections: the MDG guides
 * (guide/) and the Khata Kavach pages (kk-guide/).
 *
 *   npm run guide -- check               every page of both, against the rules in src/guides/content.ts
 *   npm run guide -- check en/density    one page (looked up in the MDG guides, then the Khata Kavach pages)
 *   npm run guide -- check kk:hi/hub     one page of one collection
 *   npm run guide -- preview             how to see every written page (run the dev server)
 *   npm run guide -- schedule [mdg|kk]   which page goes live on which day
 *
 * `npm run build` runs `check` first, so a page that breaks a rule stops the
 * build.
 */
import { readFileSync } from "node:fs";
import { checkContent, contentPath, loadAll, parseContent } from "../src/guides/content.ts";
import { ALL, COLLECTIONS } from "../src/guides/collections.ts";
import type { Collection, CollectionKey, Lang } from "../src/guides/collection.ts";

const root = process.cwd();
const [cmd, arg] = process.argv.slice(2);

if (cmd === "check" && arg) {
  const m = /^(?:(mdg|kk):)?(en|hi)\/([a-z0-9-]+)$/.exec(arg);
  if (!m) throw new Error(`Say which page as lang/id or kk:lang/id, e.g. en/density (got ${arg})`);
  const [, key, lang, id] = m as unknown as [string, CollectionKey | undefined, Lang, string];
  const col: Collection | undefined = key ? COLLECTIONS[key] : ALL.find((c) => c.byId.has(id));
  const page = col?.byId.get(id);
  if (!col || !page) throw new Error(`No page with id ${id}`);
  const c = parseContent(readFileSync(contentPath(root, col, lang, id), "utf8"), arg);
  const errs = checkContent(col, page, lang, c);
  console.log(errs.length ? errs.join("\n") : `${arg}: OK`);
  process.exit(errs.length ? 1 : 0);
} else if (cmd === "check") {
  let failed = false;
  for (const col of ALL) {
    const { errors } = loadAll(root, col);
    const missing = errors.filter((e) => e.endsWith(": missing"));
    const real = errors.filter((e) => !e.endsWith(": missing"));
    const total = col.releases.length;
    console.log(`${col.label}: ${total - missing.length} of ${total} pages written, ${missing.length} missing, ${real.length} problem(s).`);
    for (const e of real) console.log(`  ${e}`);
    if (missing.length) console.log(`  Missing: ${missing.map((x) => x.replace(": missing", "")).join(", ")}`);
    // A real build needs every page; GUIDE_ALLOW_MISSING=1 lets a local build go without the missing ones.
    const missingFatal = missing.length > 0 && process.env.GUIDE_ALLOW_MISSING !== "1" && process.env.GUIDE_SKIP !== "1";
    if (real.length || missingFatal) failed = true;
  }
  process.exit(failed ? 1 : 0);
} else if (cmd === "preview") {
  console.log("The guides are Next.js pages. Run `npm run dev`: every written page is served at its real address.");
  console.log("Pages whose release day has not come yet answer 404 (the proxy gates them by date). To see the guides as of a");
  console.log("later day, run the dev server with GUIDE_FAKE_NOW set, e.g. GUIDE_FAKE_NOW=2026-11-20T06:00:00Z npm run dev.");
} else if (cmd === "schedule") {
  for (const col of ALL.filter((c) => !arg || c.key === arg)) {
    console.log(`${col.label}: day 1 = ${col.dateOfDay(1)} (India). ${col.releases.length} pages over ${col.lastDay} days.`);
    for (let d = 1; d <= col.lastDay; d++) {
      const rs = col.releases.filter((r) => r.day === d);
      console.log(`Day ${String(d).padStart(2)} ${col.dateOfDay(d)}  ${rs.map((r) => r.path).join("  ")}`);
    }
  }
} else {
  console.log("Usage: npm run guide -- check [lang/id | kk:lang/id] | preview | schedule [mdg|kk]");
  process.exit(1);
}
