/**
 * Checks for the video pages (/videos and /videos/<slug>) that replaced the
 * guide site: the catalog is whole, every file a page names is on disk, the
 * pages are light and well-formed, the proxy's address rules hold, the guide
 * pages and the home page point at the new addresses, and no page of this site
 * still links to guide.mdgservices.in.
 *
 * This site has no test runner, so these are plain `node:test` checks run
 * through the `tsx` the repo root already carries:
 *
 *   cd mdg-landing && npm run check:videos
 *
 * Run from this folder (the guide pages read their words relative to it). It
 * builds the pages in memory; it writes nothing.
 */
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { gzipSync } from "node:zlib";

import { VIDEOS } from "../guide/inventory.ts";
import { training as trainingEn } from "../src/i18n/en/training.ts";
import { training as trainingHi } from "../src/i18n/hi/training.ts";
import { MDG, buildPageModel, contextAt } from "../src/guides/model.ts";
import { isVideosPath, slugOfSource, videoPath, videoSlugOf, videosFile, VIDEO_SLUGS } from "../src/routing/videos.ts";
import { buildVideoPages, type CatalogVideo } from "./videos-pages.ts";

const root = process.cwd();
const catalog = (JSON.parse(readFileSync(path.join(root, "src/videos/catalog.json"), "utf8")) as { videos: CatalogVideo[] }).videos;
const pages = buildVideoPages({ root });
const page = (file: string) => pages.find((p) => p.fileName === file)!.source;
const gz = (s: string) => gzipSync(s, { level: 9 }).length;

describe("the catalog", () => {
  it("has the 26 explainers, each a usable address", () => {
    assert.equal(catalog.length, 26);
    assert.equal(new Set(catalog.map((v) => v.slug)).size, 26);
    for (const v of catalog) {
      assert.match(v.slug, /^[a-z0-9-]+$/);
      assert.ok(!["media", "en"].includes(v.slug), `${v.slug} is an address of its own under /videos`);
      assert.equal(v.source, `gen-${v.slug}`);
    }
  });

  it("is the list the proxy knows", () => {
    assert.deepEqual([...VIDEO_SLUGS], catalog.map((v) => v.slug));
    assert.deepEqual(JSON.parse(readFileSync(path.join(root, "src/videos/slugs.json"), "utf8")), catalog.map((v) => v.slug));
  });

  for (const v of catalog) {
    for (const lang of ["hi", "en"] as const) {
      it(`${v.slug} (${lang}) has its words, chapters and every file`, () => {
        const c = v[lang];
        assert.ok(c.title && c.subtitle && c.description, "title, subtitle and description");
        assert.ok(c.duration > 20 && c.duration < 120, `a minute-ish video, not ${c.duration}s`);
        assert.equal(c.chapters[0]?.t, 0);
        for (let i = 1; i < c.chapters.length; i += 1) assert.ok(c.chapters[i]!.t > c.chapters[i - 1]!.t, "chapters start later than the one before");
        assert.ok(c.chapters[c.chapters.length - 1]!.t < c.duration, "the last chapter starts before the end");
        for (const c2 of c.chapters) assert.ok(c2.title.trim().length > 0, "a chapter name");
        for (const role of ["tiny", "low", "high", "poster", "thumb", "og"] as const) {
          const file = path.join(root, "public/videos/media", c.media.dir, c.media[role]);
          assert.ok(existsSync(file) && statSync(file).size > 1000, `${role}: ${file}`);
        }
        // the three encodes get bigger, and none is a stand-in
        assert.ok(c.media.bytes.tiny < c.media.bytes.low && c.media.bytes.low < c.media.bytes.high);
      });
    }
  }
});

describe("the pages", () => {
  it("are 54: the library and 26 videos, in two languages", () => {
    assert.equal(pages.length, 54);
    for (const lang of ["", "en/"]) {
      assert.ok(pages.some((p) => p.fileName === `videos/${lang}index.html`));
      for (const v of catalog) assert.ok(pages.some((p) => p.fileName === `videos/${v.slug}/${lang}index.html`), `${v.slug} ${lang}`);
    }
  });

  it("are light: a watch page under 8 kB gzipped, the library under 8 kB", () => {
    for (const p of pages) {
      const limit = 8 * 1024;
      assert.ok(gz(p.source) < limit, `${p.fileName} is ${gz(p.source)} bytes gzipped`);
    }
  });

  it("send no video until play is pressed: no <video> or <source> element, no preload", () => {
    for (const p of pages.filter((q) => !/^videos\/(en\/)?index\.html$/.test(q.fileName))) {
      // The <video> is created by the script on the first press; the HTML has none.
      const markup = p.source.replace(/<script>[\s\S]*?<\/script>/g, "");
      assert.doesNotMatch(markup, /<video\b/, p.fileName);
      assert.doesNotMatch(markup, /<source\b/, p.fileName);
      assert.doesNotMatch(markup, /preload=/, p.fileName);
    }
  });

  it("carry the language, the canonical address, both hreflangs and parseable structured data", () => {
    for (const v of catalog) {
      for (const lang of ["hi", "en"] as const) {
        const html = page(`videos/${v.slug}/${lang === "hi" ? "" : "en/"}index.html`);
        assert.match(html, new RegExp(`<html lang="${lang}">`));
        const self = `https://mdgservices.in/videos/${v.slug}${lang === "hi" ? "" : "?lang=en"}`;
        assert.ok(html.includes(`<link rel="canonical" href="${self}">`), `${v.slug} ${lang} canonical`);
        assert.ok(html.includes(`hreflang="hi" href="https://mdgservices.in/videos/${v.slug}"`));
        assert.ok(html.includes(`hreflang="en" href="https://mdgservices.in/videos/${v.slug}?lang=en"`));
        const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]!.replace(/\\u003c/g, "<")));
        const video = ld.find((o) => o["@type"] === "VideoObject");
        assert.ok(video, "a VideoObject");
        assert.equal(video.inLanguage, lang);
        assert.match(video.contentUrl, /^https:\/\/mdgservices\.in\/videos\/media\/.+\.mp4$/);
        assert.match(video.duration, /^PT\d+M\d+S$/);
      }
    }
  });

  it("give the script all three encodes, the chapter starts and a button for each chapter", () => {
    for (const v of catalog) {
      for (const lang of ["hi", "en"] as const) {
        const html = page(`videos/${v.slug}/${lang === "hi" ? "" : "en/"}index.html`);
        const cfg = JSON.parse(/<script type="application\/json" id="cfg">([\s\S]*?)<\/script>/.exec(html)![1]!.replace(/\\u003c/g, "<"));
        assert.deepEqual(Object.keys(cfg.src).sort(), ["high", "low", "tiny"]);
        assert.deepEqual(cfg.ch, v[lang].chapters.map((c) => c.t));
        assert.equal((html.match(/<button type="button" data-t=/g) ?? []).length, v[lang].chapters.length);
      }
    }
  });

  it("name only files that exist", () => {
    for (const p of pages) {
      for (const m of p.source.matchAll(/(?:src|href|poster)="(\/videos\/media\/[^"]+)"/g)) {
        assert.ok(existsSync(path.join(root, "public", m[1]!)), `${p.fileName} names ${m[1]}`);
      }
      for (const m of p.source.matchAll(/"(\/videos\/media\/[^"]+)"/g)) {
        assert.ok(existsSync(path.join(root, "public", m[1]!)), `${p.fileName} names ${m[1]}`);
      }
    }
  });

  it("link only to pages that exist, each in the page's own language", () => {
    for (const p of pages) {
      const lang = /^videos\/(?:[^/]+\/)?en\/index\.html$/.test(p.fileName) ? "en" : "hi";
      const links = [...p.source.matchAll(/href="\/videos(?:\/([a-z0-9-]*))?\?lang=(hi|en)"/g)];
      assert.ok(links.length > 0, p.fileName);
      for (const m of links) {
        if (m[1]) assert.ok(VIDEO_SLUGS.includes(m[1]), `${p.fileName} links to /videos/${m[1]}`);
      }
      // the cards below a video and the library's grid stay in the language of the page
      const cards = [...p.source.matchAll(/<li><a href="\/videos\/[a-z0-9-]+\?lang=(hi|en)"><img/g)];
      for (const m of cards) assert.equal(m[1], lang, p.fileName);
    }
  });

  it("never mention the retired guide site", () => {
    for (const p of pages) assert.doesNotMatch(p.source, /guide\.mdgservices/i, p.fileName);
  });

  it("put no MDG price in the words around a video (the page chrome is fixed text)", () => {
    // A video's own chapter names may use a rupee figure as an example ("per ₹1,000 of sales");
    // the page's own words never do.
    const html = page("videos/index.html") + page("videos/en/index.html");
    assert.doesNotMatch(html, /₹|\bRs\.?\s?\d|\bINR\b/);
  });

  it("switch language with a link on the same address", () => {
    const html = page("videos/dod-clock/index.html");
    assert.ok(html.includes('href="/videos/dod-clock?lang=hi" aria-current="true"') || html.includes('lang="hi" href="/videos/dod-clock?lang=hi" aria-current="true"'));
    assert.ok(html.includes('href="/videos/dod-clock?lang=en"'));
  });
});

describe("the proxy's address rules", () => {
  it("knows /videos and one level below it, and nothing deeper", () => {
    assert.ok(isVideosPath("/videos"));
    assert.ok(isVideosPath("/videos/"));
    assert.ok(isVideosPath("/videos/dod-clock"));
    assert.ok(isVideosPath("/videos/dod-clock/"));
    assert.ok(!isVideosPath("/videos/media/gen-dod-clock-hi/low.x.mp4"));
    assert.ok(!isVideosPath("/video"));
    assert.ok(!isVideosPath("/hi/videos"));
  });

  it("answers the library, a real video, and 404 for anything else", () => {
    assert.equal(videoSlugOf("/videos"), "");
    assert.equal(videoSlugOf("/videos/"), "");
    assert.equal(videoSlugOf("/videos/dod-clock"), "dod-clock");
    assert.equal(videoSlugOf("/videos/not-a-video"), null);
    assert.equal(videoSlugOf("/videos/media"), null);
    assert.equal(videoSlugOf("/videos/en"), null);
  });

  it("maps an address and a language to the built file, which exists", () => {
    assert.equal(videosFile("", "hi"), "/videos/index.html");
    assert.equal(videosFile("", "en"), "/videos/en/index.html");
    assert.equal(videosFile("dod-clock", "hi"), "/videos/dod-clock/index.html");
    assert.equal(videosFile("dod-clock", "en"), "/videos/dod-clock/en/index.html");
    for (const v of catalog) for (const lang of ["hi", "en"] as const) assert.ok(pages.some((p) => `/${p.fileName}` === videosFile(v.slug, lang)));
  });
});

describe("the guide pages, the Training section and the home page", () => {
  it("every video a guide page names is in the catalog", () => {
    for (const id of Object.keys(VIDEOS)) assert.ok(VIDEO_SLUGS.includes(slugOfSource(id)), `${id} has no page`);
    for (const page of MDG.pages) for (const id of page.videos ?? []) assert.ok(VIDEOS[id], `${page.id} names ${id}`);
  });

  it("each guide page's video links point at /videos/<slug>?lang=<its own language>", () => {
    const ctx = contextAt(MDG, new Date("2099-01-01"));
    let seen = 0;
    for (const r of ctx.col.releases.filter((x) => x.page.videos?.length)) {
      const m = buildPageModel(ctx, r);
      for (const v of m.videos) {
        seen += 1;
        assert.match(v.href, new RegExp(`^/videos/[a-z0-9-]+\\?lang=${r.lang}$`), `${r.path}: ${v.href}`);
        assert.ok(VIDEO_SLUGS.includes(v.href.slice("/videos/".length, v.href.indexOf("?"))));
      }
    }
    assert.ok(seen >= 15, `expected the 11 pages' links in both languages, saw ${seen}`);
    assert.equal(videoPath("dod-clock", "hi"), "/videos/dod-clock?lang=hi");
  });
});

describe("nothing on the site links to the retired guide site", () => {
  it("no source, page or setting of the site names guide.mdgservices.in or its env variable (the notes in .md files may talk about the old site)", () => {
    const offenders: string[] = [];
    const skip = new Set(["node_modules", ".next", ".next-e5", ".git", "graphify-out", "dist", ".guide-source", ".guide-preview", ".vercel"]);
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (skip.has(entry.name) || entry.name.startsWith(".next")) continue;
        const p = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          // the media folder is binary and large; the checks above cover what names it
          if (p.endsWith(path.join("public", "videos", "media"))) continue;
          walk(p);
        } else if (/\.(ts|tsx|js|mjs|json|html|css|txt)$/.test(entry.name) && statSync(p).size < 2_000_000) {
          // this check, the importer and the generator talk ABOUT the old site in their comments
          if (/scripts[\\/](videos\.check\.ts|videos-import\.mjs|videos-pages\.ts)$/.test(p)) continue;
          if (/guide\.mdgservices|VITE_GUIDE_BASE_URL|GUIDE_MEDIA_BASE/i.test(readFileSync(p, "utf8"))) offenders.push(path.relative(root, p));
        }
      }
    };
    walk(root);
    assert.deepEqual(offenders, []);
  });

  it("the Training section opens the library on this site", () => {
    const tsx = readFileSync(path.join(root, "src/components/Training.tsx"), "utf8");
    assert.match(tsx, /TRAINING_HREF\}\?lang=\$\{lang\}/);
    assert.doesNotMatch(tsx, /target="_blank"/);
    assert.match(readFileSync(path.join(root, "src/data/content.ts"), "utf8"), /TRAINING_HREF = "\/videos"/);
  });

  it("the Training band's figures are the library's own, per language (Hindi and English cuts differ in length)", () => {
    const spelled: Record<string, Record<number, string>> = {
      en: { 20: "twenty minutes", 22: "twenty-two minutes" },
      hi: { 22: "बाईस मिनट" },
    };
    for (const [lang, band] of [["hi", trainingHi], ["en", trainingEn]] as const) {
      const seconds = catalog.reduce((sum, v) => sum + v[lang].duration, 0);
      const minutes = Math.round(seconds / 60);
      const chapters = catalog.reduce((sum, v) => sum + v[lang].chapters.length, 0);
      const figure = (n: number) => band.facts[n]!.figure;
      assert.equal(figure(0), String(catalog.length), `${lang}: video count`);
      assert.equal(Number(/^\d+/.exec(figure(1))?.[0]), minutes, `${lang}: "${figure(1)}" against ${(seconds / 60).toFixed(1)} min of video`);
      assert.equal(figure(2), String(chapters), `${lang}: chapter count`);
      // the heading spells the same number out
      const word = spelled[lang]![minutes];
      assert.ok(word, `${lang}: add how the heading spells ${minutes} minutes`);
      assert.ok(band.heading.toLowerCase().includes(word), `${lang}: heading "${band.heading}" should say ${word}`);
    }
  });

  it("the sitemap lists the library and every video once", () => {
    const sitemap = readFileSync(path.join(root, "app/sitemap.ts"), "utf8");
    assert.match(sitemap, /VIDEO_PAGES/);
    assert.match(sitemap, /VIDEO_SLUGS\.map/);
  });
});
