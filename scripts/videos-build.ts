/**
 * Writes the video pages (/videos and /videos/<slug>, Hindi and English) into
 * public/videos/, where Next serves them as plain static files. Runs before
 * `next dev` and `next build` (see package.json), so the generated files always
 * match src/videos/catalog.json. They are git-ignored; the media beside them
 * (public/videos/media) is committed.
 *
 * proxy.ts picks which file answers each address.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { buildVideoPages, pageSizes } from "./videos-pages.ts";

const root = process.cwd();
const publicDir = path.join(root, "public");
const files = buildVideoPages({ root });
for (const f of files) {
  const to = path.join(publicDir, f.fileName);
  mkdirSync(path.dirname(to), { recursive: true });
  writeFileSync(to, f.source);
}
console.log(`video pages: ${pageSizes(files)}`);
