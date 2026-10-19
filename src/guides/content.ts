/**
 * Reading and checking the words of the guide pages, for either collection:
 * the MDG guides (guide/content/) and the Khata Kavach pages
 * (kk-guide/content/).
 *
 * Each page is written by hand in <contentDir>/<lang>/<id>.md: a JSON header
 * (title, description, short answer, questions) and a Markdown body. This file
 * parses a page, and checks it against the rules every page must keep. The
 * page builder (model.ts) and the command line (`npm run guide -- check`) both
 * use it, so a page that breaks a rule fails the build and the check the same
 * way.
 *
 * No React and nothing from the browser in here: the command line bundles it
 * on its own.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { AnyPage, Collection, Lang } from "./collection";

export interface FaqItem {
  q: string;
  a: string;
}

export interface PageContent {
  title: string;
  /** <title> override when the H1 is too long for a search result. */
  metaTitle?: string;
  description: string;
  answer?: string;
  faq?: FaqItem[];
  related?: string[];
  updated: string;
  body: string;
}

export const LANGS: Lang[] = ["en", "hi"];

/** Words that describe how the service works, or overclaim. Never on a public page of either collection. */
const FORBIDDEN = [/complete guide/i, /\bwe guarantee\b|\bguaranteed? (compliance|accuracy|results?)\b/i, /100\s?%\s?accurate/i, /admin (panel|portal)/i, /\bour AI\b/i, /artificial intelligence/i, /ChatGPT/i, /\bClaude\b/i, /\bLLM\b/];

export function contentPath(root: string, col: Collection, lang: Lang, id: string): string {
  return path.join(root, col.contentDir, lang, `${id}.md`);
}

export function parseContent(raw: string, where: string): PageContent {
  const m = /^---json\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/.exec(raw);
  if (!m) throw new Error(`${where}: missing the ---json header`);
  let head: Omit<PageContent, "body">;
  try {
    head = JSON.parse(m[1]);
  } catch (e) {
    throw new Error(`${where}: header is not valid JSON (${(e as Error).message})`, { cause: e });
  }
  return { ...head, body: m[2].trim() };
}

/** Every problem with one page's words, as readable lines. Empty = fine. */
export function checkContent(col: Collection, page: AnyPage, lang: Lang, c: PageContent): string[] {
  const where = `${col.key === "mdg" ? "" : `${col.key}:`}${lang}/${page.id}.md`;
  const errs: string[] = [];
  const need = (ok: unknown, msg: string) => {
    if (!ok) errs.push(`${where}: ${msg}`);
  };
  need(typeof c.title === "string" && c.title.length >= 10 && c.title.length <= 110, "title must be 10-110 characters");
  // The search-result title is the metaTitle (or title) plus " | MDG Services" (15
  // characters); Google shows about 60-65, so the page's part stays within 50.
  if (c.metaTitle !== undefined) need(c.metaTitle.length <= 50, `metaTitle must be at most 50 characters (has ${c.metaTitle.length})`);
  else need(c.title.length <= 50, `title over 50 characters needs a metaTitle of at most 50 (title has ${c.title.length})`);
  need(typeof c.description === "string" && c.description.length >= 70 && c.description.length <= 170, `description must be 70-170 characters (has ${c.description?.length ?? 0})`);
  need(/^\d{4}-\d{2}-\d{2}$/.test(c.updated || ""), "updated must be YYYY-MM-DD");
  if (page.type !== "Legal" && page.type !== "Hub") {
    need(typeof c.answer === "string" && c.answer.length >= 80 && c.answer.length <= 700, "answer must be 80-700 characters");
    need(Array.isArray(c.faq) && c.faq.length >= 3 && c.faq.length <= 10, "faq must have 3-10 questions");
  }
  for (const f of c.faq || []) need(f && f.q && f.a && f.a.length >= 40, `faq item "${f?.q}" needs a question and an answer of 40+ characters`);
  need(!/^#\s/m.test(c.body), "body must not contain a level-1 heading (# ...); the title is the H1");
  if (page.type !== "Tool") need((c.body.match(/^##\s/gm) || []).length >= 2 || page.type === "Legal", "body needs at least two ## sections");
  for (const ref of c.body.matchAll(/\]\(@([a-z0-9-]+)(?:#[^)]*)?\)/g)) need(col.byId.has(ref[1]), `link to unknown page @${ref[1]}`);
  for (const id of c.related || []) need(col.byId.has(id), `related lists unknown page ${id}`);
  for (const tag of c.body.matchAll(/\{\{([^}]*)\}\}/g)) need(col.tagOk(tag[1]), `odd tag {{${tag[1]}}}`);
  const text = [c.title, c.description, c.answer || "", c.body, ...(c.faq || []).flatMap((f) => [f.q, f.a])].join("\n");
  for (const bad of [...FORBIDDEN, ...col.forbidden]) need(!bad.test(text), `contains a forbidden word (${bad}); say what the reader gets, never how the work is done, and claim nothing we cannot prove`);
  if (lang === "hi") need(/[ऀ-ॿ]/.test(c.body), "Hindi page has no Devanagari in its body");
  // Crisp pages: the body (without markup) plus the questions, counted in words.
  const words = (x: string) => (x.replace(/<[^>]+>/g, " ").replace(/\{\{[^}]*\}\}/g, " ").match(/[\p{L}\p{N}]+/gu) || []).length;
  // A tool's own form (one HTML block, no blank lines inside) is not reading text.
  const prose = c.body.replace(/<div class="tool"[\s\S]*?(\n\s*\n|$)/g, " ");
  const total = words(prose) + (c.faq || []).reduce((n, f) => n + words(f.q) + words(f.a), 0);
  // Hindi spends about 1.6 words for every English one (के, में, की stand alone).
  const base = page.type === "Glossary" ? 1100 : page.type === "Tool" ? 750 : page.type === "Hub" || page.type === "Pillar" ? 800 : 650;
  const limit = Math.round(base * (lang === "hi" ? 1.6 : 1));
  need(total <= limit, `too long: ${total} words (limit ${limit}); cut, or split into a new page`);
  return errs;
}

export function loadAll(root: string, col: Collection): { content: Map<string, PageContent>; errors: string[] } {
  const content = new Map<string, PageContent>();
  const errors: string[] = [];
  for (const page of col.pages) {
    for (const lang of LANGS) {
      if (lang === "hi" && !page.hi) continue;
      const where = `${col.key === "mdg" ? "" : `${col.key}:`}${lang}/${page.id}.md`;
      const file = contentPath(root, col, lang, page.id);
      if (!existsSync(file)) {
        errors.push(`${where}: missing`);
        continue;
      }
      try {
        const c = parseContent(readFileSync(file, "utf8"), where);
        errors.push(...checkContent(col, page, lang, c));
        content.set(`${lang}:${page.id}`, c);
      } catch (e) {
        errors.push((e as Error).message);
      }
    }
  }
  return { content, errors };
}
