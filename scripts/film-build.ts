/**
 * Writes the film watch pages (/film, /film/short, Hindi and English) and the
 * self-hosted hls.js into public/film/, where Next serves them as plain static
 * files. Runs before `next dev` and `next build` (see package.json), so the
 * generated files always match src/film/*. They are git-ignored; only
 * mark.png and the og-*.jpg cards in that folder are committed.
 *
 * proxy.ts picks which file answers /film and /film/short.
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { buildFilmPages, pageSizes } from "./film-pages.ts";

const root = process.cwd();
const publicDir = path.join(root, "public");

// A new hls.js version gets a new file name; drop the old copies.
const filmDir = path.join(publicDir, "film");
mkdirSync(filmDir, { recursive: true });
for (const name of readdirSync(filmDir)) {
  if (/^hls-.*\.js$/.test(name)) rmSync(path.join(filmDir, name));
}

const files = await buildFilmPages({ root });
for (const f of files) {
  const to = path.join(publicDir, f.fileName);
  mkdirSync(path.dirname(to), { recursive: true });
  writeFileSync(to, f.source);
}
console.log(`film pages: ${pageSizes(files)}`);
