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
import { PUMP, PUMP_CTA_ALL } from "../src/guides/collections.ts";
import { FORBIDDEN } from "../src/guides/content.ts";
import { funnelHref } from "../src/lib/funnel.ts";
import { en } from "../src/i18n/en/index.ts";
import { hi } from "../src/i18n/hi/index.ts";
import { or } from "../src/i18n/or/index.ts";

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
  it("know Kavach Shuruaat's page in every language", () => {
    for (const l of LANGS) assert.deepEqual(siteRoute(pathFor(l, "/new-pump")), { lang: l, route: "/new-pump" });
    assert.deepEqual(versionsOf("/new-pump"), { en: "/new-pump", hi: "/hi/new-pump", or: "/or/new-pump" });
    assert.equal(go("/new-pump", null, "hi-IN")?.location, "/hi/new-pump");
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

describe("the Petrol pump guide's closing box (Kavach Shuruaat)", () => {
  it("passes the same forbidden words as the pages, in every language", () => {
    for (const l of LANGS) {
      const box = PUMP_CTA_ALL[l];
      const text = [box.title, box.text, box.primary].join("\n");
      for (const bad of [...FORBIDDEN, ...PUMP.forbidden]) assert.ok(!bad.test(text), `${l}: ${bad}`);
    }
  });
  it("sends the reader through the funnel link, naming the page, in their language, with the price filled in", () => {
    const page = PUMP.byId.get("hub")!;
    for (const l of LANGS) {
      const cta = PUMP.cta(l, page);
      assert.equal(cta.primary.href, funnelHref("pump:hub", l));
      assert.equal(cta.primary.rel, "nofollow");
      assert.ok(!cta.text.includes("{price}"));
      assert.ok(cta.text.includes("₹199"));
    }
  });
});

describe("the Kavach Shuruaat blocks on other pages (ADR 0059 §6)", () => {
  const DICTS = { en, hi, or };
  /** Every word a block can show, with its price placeholder still in. */
  const words = (l: keyof typeof DICTS) => {
    const w = DICTS[l].shuruaat;
    return [w.ad, w.strip.text, w.strip.link, w.box.title, w.box.text, w.box.link, w.line.text, w.line.link, w.card.kicker, w.card.title, w.card.text, w.card.link, w.card.more].join("\n");
  };
  it("pass the Petrol pump guide's forbidden words in every language, since they sit on its pages", () => {
    for (const l of LANGS) for (const bad of [...FORBIDDEN, ...PUMP.forbidden]) assert.ok(!bad.test(words(l)), `${l}: ${bad}`);
  });
  it("never offer a free month and never name the reader's gender", () => {
    for (const l of LANGS) assert.doesNotMatch(words(l), /\bfree\b|मुफ़्त|मुफ्त|फ्री|ମାଗଣା/i, l);
    assert.doesNotMatch(words("hi"), /चाहता|चाहती|\bSir\b|(^|\s)सर(\s|,|।|$)/);
  });
  it("take the price from NEW_PUMP, never a typed figure", () => {
    for (const l of LANGS) {
      assert.doesNotMatch(words(l), /₹|\bRs\b/, l);
      assert.ok(DICTS[l].shuruaat.box.text.includes("{newPumpPrice}"), l);
      assert.ok(DICTS[l].shuruaat.card.text.includes("{newPumpPrice}"), l);
    }
  });
  it("carry their label in the page's own script", () => {
    assert.equal(hi.shuruaat.ad, "विज्ञापन");
    assert.equal(or.shuruaat.ad, "ବିଜ୍ଞାପନ");
  });
});
