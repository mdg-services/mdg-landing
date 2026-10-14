/**
 * The MDG guide from the command line:
 *
 *   npm run guide -- check            every page's words, against the rules in guide-pages.ts
 *   npm run guide -- check en/density one page
 *   npm run guide -- preview [dir]    every written page at its public path (default .guide-preview/)
 *   npm run guide -- schedule         which page goes live on which day
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { buildPreview, checkContent, contentPath, loadAll, parseContent } from "./guide-pages.ts";
import { byId, type Lang } from "../guide/inventory.js";
import { RELEASES, LAST_DAY, START, dateOfDay } from "../guide/schedule.js";

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
  process.exit(real.length ? 1 : 0);
} else if (cmd === "preview") {
  const out = path.resolve(root, arg || ".guide-preview");
  const { files, errors } = buildPreview({ root });
  for (const f of files) {
    const to = path.join(out, f.fileName);
    mkdirSync(path.dirname(to), { recursive: true });
    writeFileSync(to, f.source);
  }
  console.log(`Wrote ${files.length} files to ${out}`);
  const real = errors.filter((e) => !e.endsWith(": missing"));
  if (real.length) console.log(real.join("\n"));
} else if (cmd === "schedule") {
  console.log(`Day 1 = ${START} (India). ${RELEASES.length} pages over ${LAST_DAY} days.`);
  for (let d = 1; d <= LAST_DAY; d++) {
    const rs = RELEASES.filter((r) => r.day === d);
    console.log(`Day ${String(d).padStart(2)} ${dateOfDay(d)}  ${rs.map((r) => r.path).join("  ")}`);
  }
} else {
  console.log("Usage: npm run guide -- check [lang/id] | preview [dir] | schedule");
  process.exit(1);
}
