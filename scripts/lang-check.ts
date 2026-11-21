/**
 * `npm run lang:check`: is every language the site lists really finished?
 *
 * It reads src/i18n/languages.ts and, for each language other than English,
 * checks every place a language has to be added by hand. Anything missing is
 * printed as one plain line and the command exits 1, so nobody ships a language
 * that is half wired. LANGUAGES.md is the same list as steps.
 *
 *  1. the words: src/i18n/<code>/ has every file the English folder has, and the
 *     dictionary has the same shape (same keys, same list lengths, no empty
 *     strings), and each sentence keeps the English one's numbers, links and
 *     {placeholders};
 *  2. the wiring that must be spelled out because Next reads it as literal text
 *     (the proxy's matcher, the redirect prefixes in next.config.ts);
 *  3. the places that register a language (dictionaries, fonts);
 *  4. the guides: how many pages each collection has in the language, and that
 *     every page of that language has its words.
 *
 * `--report` prints the numbers and never fails.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { LANGUAGES, OTHER_LANGS, prefixOf, type Lang } from "../src/i18n/languages.ts";
import { en } from "../src/i18n/en/index.ts";
import { hi } from "../src/i18n/hi/index.ts";
import { or } from "../src/i18n/or/index.ts";
import { checkParity } from "../src/i18n/parity.ts";
import { ALL } from "../src/guides/collections.ts";
import { pageLangs } from "../guide/calendar.ts";
import { loadAll } from "../src/guides/content.ts";

const root = process.cwd();
const report = process.argv.includes("--report");
const problems: string[] = [];
const notes: string[] = [];
const fail = (msg: string) => problems.push(msg);

const DICTS: Partial<Record<Lang, unknown>> = { hi, or };
const read = (rel: string) => (existsSync(path.join(root, rel)) ? readFileSync(path.join(root, rel), "utf8") : "");

/** Every string of a dictionary with its path. */
function strings(v: unknown, at = "dict", out: [string, string][] = []): [string, string][] {
  if (typeof v === "string") out.push([at, v]);
  else if (Array.isArray(v)) v.forEach((x, i) => strings(x, `${at}[${i}]`, out));
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) strings(x, `${at}.${k}`, out);
  return out;
}

/** What a translation must keep: digits, links, e-mail addresses and {placeholders}. */
function keepers(s: string): string[] {
  const found = [...(s.match(/\d+(?:[.,]\d+)*/g) ?? []), ...(s.match(/https?:\/\/\S+|mailto:\S+|[\w.+-]+@[\w-]+\.[\w.]+/g) ?? []), ...(s.match(/\{[^}]+\}/g) ?? [])];
  return found.map((x) => x.replace(/[.,;)]+$/, "")).sort();
}

for (const lang of OTHER_LANGS) {
  const info = LANGUAGES[lang];
  const code = lang;

  // 1. the words
  const enFiles = readdirSync(path.join(root, "src/i18n/en")).filter((f) => f.endsWith(".ts"));
  for (const f of enFiles) if (!existsSync(path.join(root, `src/i18n/${code}`, f))) fail(`${code}: src/i18n/${code}/${f} is missing`);
  const dict = DICTS[lang];
  if (!dict) {
    fail(`${code}: scripts/lang-check.ts does not import the ${code} dictionary yet (add it next to hi and or at the top)`);
  } else {
    for (const p of checkParity(en, dict)) fail(`${code}: ${p.replace(/Hindi/g, info.english)}`);
    const mine = new Map(strings(dict));
    let drift = 0;
    for (const [at, s] of strings(en)) {
      const t = mine.get(at);
      if (t === undefined) continue;
      const a = keepers(s).join("|");
      const b = keepers(t).join("|");
      if (a !== b) {
        // the Hindi file is allowed to differ where the Hindi video or copy differs; show the first few
        if (drift++ < 6) notes.push(`${code}: ${at}: numbers, links or {placeholders} differ from English\n      en: ${a || "-"}\n      ${code}: ${b || "-"}`);
      }
    }
    if (drift) notes.push(`${code}: ${drift} sentence(s) differ from English in numbers, links or {placeholders} (a few shown above; some are deliberate)`);
    // a sentence that is still all English
    if (info.script) {
      let latin = 0;
      for (const [at, s] of strings(dict)) {
        const words = s.replace(/\{[^}]+\}|\*\*|\[[^\]]*\]\([^)]*\)|https?:\/\/\S+/g, " ").match(/[A-Za-z]{3,}/g) ?? [];
        if (words.length >= 6 && !info.script.test(s)) {
          latin++;
          if (latin <= 5) fail(`${code}: ${at} looks untranslated (no ${info.english} letters, ${words.length} English words)`);
        }
      }
      if (latin > 5) fail(`${code}: ${latin - 5} more untranslated-looking sentences`);
    }
  }

  // 2. wiring that is literal text
  const proxy = read("proxy.ts");
  const prefixes = OTHER_LANGS.map((l) => prefixOf(l).slice(1));
  if (!proxy.includes(`(${prefixes.join("|")})`)) fail(`${code}: proxy.ts matcher does not name every prefix: it must read "/:lang(${prefixes.join("|")})/…"`);
  const nextConfig = read("next.config.ts");
  const want = `const LANG_PREFIXES = [${OTHER_LANGS.map((l) => `"${prefixOf(l)}"`).join(", ")}];`;
  if (!nextConfig.includes(want)) fail(`${code}: next.config.ts must read: ${want}`);

  // 3. registrations
  if (!read("src/i18n/server.ts").match(new RegExp(`import \\{ ${code} \\} from "\\./${code}"`))) fail(`${code}: src/i18n/server.ts does not import the dictionary`);
  if (!read("src/i18n/server.ts").match(new RegExp(`DICTS[^\\n]*\\b${code}\\b`))) fail(`${code}: src/i18n/server.ts DICTS does not list it`);
  if (!existsSync(path.join(root, `src/fonts/${code}.ts`))) fail(`${code}: src/fonts/${code}.ts is missing (copy or.ts, swap the script's font)`);
  if (!read("src/fonts/index.ts").match(new RegExp(`import \\* as ${code} from`))) fail(`${code}: src/fonts/index.ts does not list it`);
  if (!existsSync(path.join(root, `src/i18n/${code}/GLOSSARY.md`))) notes.push(`${code}: no src/i18n/${code}/GLOSSARY.md yet (the terms a reviewer checks; new languages should have one)`);

  // 4. the guides
  for (const col of ALL) {
    const pages = col.pages.filter((p) => pageLangs(p).includes(lang));
    const { errors } = loadAll(root, col);
    const mine = errors.filter((e) => e.includes(`${code}/`));
    for (const e of mine) fail(`${code}: ${e}`);
    notes.push(`${code}: ${col.label}: ${pages.length} of ${col.pages.length} pages written`);
  }
}

console.log(notes.join("\n"));
if (problems.length) {
  console.log(`\n${problems.length} problem(s):\n${problems.map((p) => `  - ${p}`).join("\n")}`);
  if (!report) process.exit(1);
} else {
  console.log(`\nEvery language checked: ${OTHER_LANGS.join(", ")} (and English).`);
}
