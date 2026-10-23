/**
 * Brings the 26 trade explainers over from the retired guide site.
 *
 *   node scripts/videos-import.mjs            # write src/videos/*.json, copy the media
 *   node scripts/videos-import.mjs --check    # change nothing; exit 1 if either is out of date
 *
 * The explainers were made, encoded and written up in mdg-demo (`mdg-demo/site`):
 * bilingual copy in data/declared-videos.json, chapter offsets in
 * data/videos.json, the encoded files in public/media/<id>/. This reads those and
 * writes what the website needs:
 *
 *   src/videos/catalog.json  one entry per explainer, Hindi and English side by side
 *   src/videos/slugs.json    just the slugs (the proxy imports this, not the catalog)
 *   public/videos/media/<id>/   the three encodes, the poster, the thumbnail and the share card
 *
 * ── THE FILES ON DISK, NOT THE NAMES IN data/videos.json ────────────────────
 *
 * Every media file's name carries a hash of its bytes. data/videos.json names
 * hashes that are NOT the ones in the folder (it was written by an earlier
 * encode; the folder was re-encoded after), so the guide site's pages pointed at
 * three files that were not there and only the poster loaded. This script finds
 * each file by looking in the folder, measures each video's length with ffprobe,
 * and refuses to continue if a rung is missing or a chapter starts after the end.
 *
 * Only the 26 explainers (`gen-<name>-hi` / `-en`) come over. The dealer course,
 * the team videos and the acquisition film have other homes (the app's Help
 * videos, the admin portal, /film).
 *
 * Re-running is safe: files are copied only when they are not already there, and
 * the catalog is rewritten byte-for-byte the same when nothing changed.
 */
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '..');
const SITE_SRC = path.resolve(ROOT, '../mdg-demo/site');
const MEDIA_OUT = path.join(ROOT, 'public/videos/media');
const check = process.argv.includes('--check');

const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
const manifest = new Map(read(path.join(SITE_SRC, 'data/videos.json')).map((v) => [v.id, v]));
const declared = new Map(read(path.join(SITE_SRC, 'data/declared-videos.json')).map((v) => [v.id, v]));

/** Reserved: these are addresses of their own under /videos. */
const RESERVED = new Set(['media', 'en']);

function probeSeconds(file) {
  const out = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' });
  return Math.round(Number.parseFloat(out) * 10) / 10;
}

/** The files in one video's media folder, by role. */
function mediaFor(id) {
  const dir = path.join(SITE_SRC, 'public/media', id);
  const names = readdirSync(dir);
  const pick = (re, what) => {
    const hits = names.filter((n) => re.test(n));
    if (hits.length !== 1) throw new Error(`${id}: expected exactly one ${what}, found ${hits.length} (${hits.join(', ') || 'none'})`);
    return hits[0];
  };
  const files = {
    tiny: pick(/^tiny\.[0-9a-f]{8}\.mp4$/, 'tiny encode'),
    low: pick(/^low\.[0-9a-f]{8}\.mp4$/, 'low encode'),
    high: pick(/^high\.[0-9a-f]{8}\.mp4$/, 'high encode'),
    poster: pick(/^poster\.[0-9a-f]{8}\.webp$/, 'poster'),
    thumb: pick(/^thumb\.[0-9a-f]{8}\.webp$/, 'thumbnail'),
    og: pick(/^og\.[0-9a-f]{8}\.jpg$/, 'share card'),
  };
  const bytes = Object.fromEntries(['tiny', 'low', 'high'].map((k) => [k, statSync(path.join(dir, files[k])).size]));
  return { dir: id, ...files, bytes };
}

function cut(id, lang) {
  const meta = manifest.get(id);
  const text = declared.get(id);
  if (!meta || !text) throw new Error(`${id}: missing from videos.json or declared-videos.json`);
  const copy = text[lang];
  const media = mediaFor(id);
  const duration = probeSeconds(path.join(SITE_SRC, 'public/media', id, media.low));
  const chapters = meta.chapters.map((c) => {
    const title = copy.chapters[c.id];
    if (!title) throw new Error(`${id}: chapter "${c.id}" has no ${lang} label`);
    return { t: c.start, title };
  });
  const last = chapters[chapters.length - 1];
  if (!last || last.t >= duration) throw new Error(`${id}: last chapter starts at ${last?.t}s but the video is ${duration}s`);
  if (meta.orientation !== 'portrait') throw new Error(`${id}: expected a portrait video, got ${meta.orientation}`);
  return { title: copy.title, subtitle: copy.subtitle, description: copy.description, duration, chapters, media };
}

const bases = [...declared.keys()].filter((id) => id.endsWith('-hi') && id.startsWith('gen-')).map((id) => id.slice(0, -3));
const videos = bases.map((source) => {
  const slug = source.replace(/^gen-/, '');
  if (RESERVED.has(slug) || !/^[a-z0-9-]+$/.test(slug)) throw new Error(`${source}: "${slug}" is not a usable address`);
  return { slug, source, hi: cut(`${source}-hi`, 'hi'), en: cut(`${source}-en`, 'en') };
});

const catalog = JSON.stringify({ videos }, null, 1) + '\n';
const slugs = JSON.stringify(videos.map((v) => v.slug)) + '\n';
const catalogFile = path.join(ROOT, 'src/videos/catalog.json');
const slugsFile = path.join(ROOT, 'src/videos/slugs.json');

/** Every media file the catalog names, as [from, to]. */
const copies = videos.flatMap((v) =>
  ['hi', 'en'].flatMap((lang) => {
    const m = v[lang].media;
    return ['tiny', 'low', 'high', 'poster', 'thumb', 'og'].map((role) => [
      path.join(SITE_SRC, 'public/media', m.dir, m[role]),
      path.join(MEDIA_OUT, m.dir, m[role]),
    ]);
  }),
);

const stale = [];
if (!existsSync(catalogFile) || readFileSync(catalogFile, 'utf8') !== catalog) stale.push('src/videos/catalog.json');
if (!existsSync(slugsFile) || readFileSync(slugsFile, 'utf8') !== slugs) stale.push('src/videos/slugs.json');
const missing = copies.filter(([, to]) => !existsSync(to));
if (missing.length) stale.push(`${missing.length} media file(s) not copied yet`);

if (check) {
  if (stale.length) {
    console.error(`Out of date: ${stale.join('; ')}. Run: node scripts/videos-import.mjs`);
    process.exit(1);
  }
  console.log(`Up to date: ${videos.length} videos, ${copies.length} media files.`);
  process.exit(0);
}

mkdirSync(path.dirname(catalogFile), { recursive: true });
writeFileSync(catalogFile, catalog);
writeFileSync(slugsFile, slugs);
let copied = 0;
for (const [from, to] of copies) {
  if (existsSync(to)) continue;
  mkdirSync(path.dirname(to), { recursive: true });
  copyFileSync(from, to);
  copied += 1;
}
const mb = (n) => (n / 1e6).toFixed(1);
const total = (role) => videos.reduce((s, v) => s + v.hi.media.bytes[role] + v.en.media.bytes[role], 0);
console.log(`${videos.length} videos; ${copied} media files copied (${copies.length} in all).`);
console.log(`Library size: tiny ${mb(total('tiny'))} MB, low ${mb(total('low'))} MB, high ${mb(total('high'))} MB (both languages).`);
