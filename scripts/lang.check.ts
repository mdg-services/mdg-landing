/**
 * The language rules, as tests: which address is which language, where a visitor
 * is sent, and that the guide gate and the switch know every language.
 * Run: npm run check:lang
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { firstAcceptedLanguage, langRedirect, siteRoute } from "../src/routing/site.ts";
import { guideGate, isGuidePath } from "../src/routing/guides.ts";
import { LANGS, localPath, pathFor, versionsOf } from "../src/i18n/lang.ts";
import { fillLangs, langOfPath, stripPrefix } from "../src/i18n/languages.ts";

const go = (path: string, cookie: string | null = null, accept: string | null = null) => langRedirect(new URL(`https://x.test${path}`), cookie, accept);

describe("addresses", () => {
  it("name their language by prefix", () => {
    assert.equal(langOfPath("/about"), "en");
    assert.equal(langOfPath("/hi/about"), "hi");
    assert.equal(langOfPath("/or"), "or");
    assert.equal(langOfPath("/orange"), "en"); // a prefix is a whole segment
    assert.equal(stripPrefix("/or/guides/density/"), "/guides/density/");
    assert.equal(stripPrefix("/or"), "/");
  });
  it("round-trip through pathFor, localPath and siteRoute", () => {
    for (const l of LANGS) {
      assert.deepEqual(siteRoute(pathFor(l, "/pricing")), { lang: l, route: "/pricing" });
      assert.deepEqual(siteRoute(pathFor(l, "")), { lang: l, route: "" });
    }
    assert.equal(localPath("or", "/guides/"), "/or/guides/");
    assert.equal(localPath("en", "/guides/"), "/guides/");
    assert.equal(versionsOf("/about").or, "/or/about");
    assert.equal(siteRoute("/or/nothing"), null);
  });
});

describe("where a visitor is sent", () => {
  it("reads the browser's language, best first", () => {
    assert.equal(firstAcceptedLanguage("or-IN,en;q=0.8"), "or");
    assert.equal(firstAcceptedLanguage("ory"), "or");
    assert.equal(firstAcceptedLanguage("hi-IN,hi;q=0.9,en;q=0.8"), "hi");
    assert.equal(firstAcceptedLanguage("mr-IN,hi;q=0.8"), "hi");
    assert.equal(firstAcceptedLanguage("hi;q=0.3,en;q=0.9"), "en");
    assert.equal(firstAcceptedLanguage("fr-FR"), null);
    assert.equal(firstAcceptedLanguage(null), null);
  });
  it("sends an English address to the twin of the browser's or the cookie's language", () => {
    assert.equal(go("/about", null, "or-IN")?.location, "/or/about");
    assert.equal(go("/", null, "or-IN")?.location, "/or");
    assert.equal(go("/about", "mdg_lang=or", "en")?.location, "/or/about");
    assert.equal(go("/about", "mdg_lang=en", "or"), null);
    assert.equal(go("/about", null, "en-IN"), null);
    assert.equal(go("/about", null, null), null); // a crawler stays on English
  });
  it("never moves a visitor off an address that names a language", () => {
    assert.equal(go("/or/about", "mdg_lang=hi", "hi"), null);
    assert.equal(go("/hi/about", "mdg_lang=or", "or"), null);
  });
  it("honours ?lang= and remembers it", () => {
    assert.deepEqual(go("/about?lang=or"), { location: "/or/about", cookie: "or" });
    assert.deepEqual(go("/or/about?lang=en"), { location: "/about", cookie: "en" });
    assert.deepEqual(go("/hi?lang=or&utm=1"), { location: "/or?utm=1", cookie: "or" });
    assert.equal(go("/about?lang=xx"), null);
  });
});

describe("the guide gate", () => {
  const long = new Date("2099-01-01");
  it("knows every language's prefix", () => {
    assert.ok(isGuidePath("/or/guides/"));
    assert.ok(isGuidePath("/or/petrol-pump/licences/"));
    assert.ok(isGuidePath("/or/tools/litres-to-kg/"));
    assert.ok(!isGuidePath("/or/about"));
  });
  it("lets a written Odia page through and 404s one that was never written", () => {
    assert.equal(guideGate("/or/guides/penalties/", "", long).kind, "next");
    assert.equal(guideGate("/or/guides/stock-shrinkage/", "", long).kind, "notFound");
    assert.equal(guideGate("/or/guides/penalties", "", long).kind, "redirect");
  });
});

describe("words by language", () => {
  it("a language a table leaves out reads English", () => {
    const t = fillLangs({ en: "a", hi: "b" });
    assert.equal(t.or, "a");
    assert.equal(t.hi, "b");
  });
});
