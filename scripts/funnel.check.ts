/**
 * Checks for the Kavach Shuruaat funnel link (ADR 0059 §2): where /app/new-pump
 * and /start?for=new-pump send each kind of visitor, the install tag Google
 * Play receives, which taps are counted, and the hand-off of a tap to the API.
 *
 *   cd mdg-landing && npm run check:funnel
 *
 * Plain `node:test` checks, like the site's other ones. The API is a pretend
 * one (`fetch` is replaced), so nothing leaves the machine. `server/env.ts`
 * reads the environment once, when it is first imported, so the variables are
 * set first and the server modules are imported afterwards.
 */
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

process.env.WEBSITE_INTAKE_SECRET = "test-secret";
process.env.MDG_API_URL = "https://api.example.test/api/v1";

const { deviceOf, funnelAnswer, guideSource, isBot, isPrefetch, mediumOf, newPumpPlayLink } = await import("../src/routing/funnel.ts");
const { cleanSource, funnelHref } = await import("../src/lib/funnel.ts");
const { recordTap, TAP_TIMEOUT_MS } = await import("../server/funnelTap.ts");
const { APP_STORE } = await import("../src/lib/appStores.ts");

const ANDROID = "Mozilla/5.0 (Linux; Android 13; SM-A145F) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36";
const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148";
const IPAD = "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148";
const DESKTOP = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36";
const CUBOT = "Mozilla/5.0 (Linux; Android 12; CUBOT P60) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36";
const GOOGLEBOT = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const GOOGLEBOT_PHONE = "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36 (compatible; Googlebot/2.1)";
const WHATSAPP = "WhatsApp/2.24.1.6 A";
const FACEBOOK = "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)";

const req = (path: string, agent: string, method = "GET") =>
  new Request(`https://mdgservices.in${path}`, { method, headers: { "user-agent": agent } });
const answer = (path: string, agent: string, method = "GET") => funnelAnswer(req(path, agent, method), { fallbackMedium: "funnel_link" });

describe("which device a visitor is", () => {
  it("names Android, iPhone and iPad, and everything else a computer", () => {
    assert.equal(deviceOf(ANDROID), "android");
    assert.equal(deviceOf(IPHONE), "ios");
    assert.equal(deviceOf(IPAD), "ios");
    assert.equal(deviceOf(DESKTOP), "other");
    assert.equal(deviceOf(""), "other");
  });
});

describe("where /app/new-pump sends a visitor", () => {
  it("sends an Android phone to Google Play with the install tag naming the page", () => {
    const { location } = answer("/app/new-pump?from=pump:dealership-documents&lang=hi", ANDROID);
    const to = new URL(location);
    assert.equal(to.origin + to.pathname, "https://play.google.com/store/apps/details");
    assert.equal(to.searchParams.get("id"), "in.mdgservices.dealerkavach");
    assert.equal(
      to.searchParams.get("referrer"),
      "utm_source=website&utm_medium=pump&utm_campaign=new_pump&utm_content=pump:dealership-documents",
    );
  });

  it("encodes the install tag exactly once", () => {
    const { location } = answer("/app/new-pump?from=home", ANDROID);
    assert.ok(location.includes("referrer=utm_source%3Dwebsite%26utm_medium%3Dhome%26utm_campaign%3Dnew_pump%26utm_content%3Dhome"), location);
    assert.ok(!location.includes("%25"), "nothing encoded twice");
  });

  it("tags the medium with the collection or the page name", () => {
    assert.equal(mediumOf("pump:dealership-documents"), "pump");
    assert.equal(mediumOf("tools:litres-to-kg"), "tools");
    assert.equal(mediumOf("home"), "home");
  });

  it("sends an iPhone or iPad to the App Store, unchanged", () => {
    assert.equal(answer("/app/new-pump?from=home", IPHONE).location, APP_STORE);
    assert.equal(answer("/app/new-pump?from=home&lang=or", IPAD).location, APP_STORE);
  });

  it("sends a computer to /new-pump, in the language the link asked for", () => {
    assert.equal(answer("/app/new-pump?from=home", DESKTOP).location, "https://mdgservices.in/new-pump");
    assert.equal(answer("/app/new-pump?from=home&lang=hi", DESKTOP).location, "https://mdgservices.in/new-pump?lang=hi");
    assert.equal(answer("/app/new-pump?from=home&lang=or", DESKTOP).location, "https://mdgservices.in/new-pump?lang=or");
    // a language the site does not speak is ignored, not passed on
    assert.equal(answer("/app/new-pump?from=home&lang=xx", DESKTOP).location, "https://mdgservices.in/new-pump");
  });

  it("sends a computer that pressed a store button to that store", () => {
    const play = new URL(answer("/app/new-pump?from=chat&store=play", DESKTOP).location);
    assert.equal(play.hostname, "play.google.com");
    assert.match(play.searchParams.get("referrer") ?? "", /utm_content=chat$/);
    assert.equal(answer("/app/new-pump?from=chat&store=app", DESKTOP).location, APP_STORE);
    // a phone always goes to its own store, whichever button it pressed
    assert.equal(answer("/app/new-pump?from=chat&store=play", IPHONE).location, APP_STORE);
    assert.equal(new URL(answer("/app/new-pump?from=chat&store=app", ANDROID).location).hostname, "play.google.com");
  });
});

describe("the source a link carries", () => {
  it("keeps the short safe shape, lower-cased, and drops anything else", () => {
    assert.equal(cleanSource("pump:dealership-documents"), "pump:dealership-documents");
    assert.equal(cleanSource("  Home "), "home");
    assert.equal(cleanSource("<script>"), null);
    assert.equal(cleanSource("a b"), null);
    assert.equal(cleanSource("x".repeat(81)), null);
    assert.equal(cleanSource(""), null);
  });

  it("still works with no source: the tag says new_pump and which link, with no content", () => {
    const to = new URL(answer("/app/new-pump?from=%3Cscript%3E", ANDROID).location);
    assert.equal(to.searchParams.get("referrer"), "utm_source=website&utm_medium=funnel_link&utm_campaign=new_pump");
    assert.equal(answer("/app/new-pump?from=%3Cscript%3E", ANDROID).tap?.source, null);
    assert.equal(newPumpPlayLink(null, "start_link").includes("utm_medium%3Dstart_link"), true);
  });

  it("names guide pages by collection, and tools by their own name", () => {
    assert.equal(guideSource("pump", "dealership-documents", "Topic"), "pump:dealership-documents");
    assert.equal(guideSource("mdg", "hub", "Hub"), "mdg:hub");
    assert.equal(guideSource("mdg", "tools-litres-to-kg", "Tool"), "tools:litres-to-kg");
    assert.equal(guideSource("kk", "join-pump", "Feature"), "kk:join-pump");
  });

  it("builds the funnel link every button uses", () => {
    assert.equal(funnelHref("pump:x", "en"), "/app/new-pump?from=pump%3Ax");
    assert.equal(funnelHref("home", "hi"), "/app/new-pump?from=home&lang=hi");
    assert.equal(funnelHref("bad source!", "or"), "/app/new-pump?lang=or");
    // the link the page writes is the link the handler reads back
    assert.equal(answer(funnelHref("pump:x", "hi"), ANDROID).tap?.source, "pump:x");
  });

  it("points at the separate funnel address only when it is switched on, and only an https origin", () => {
    const before = process.env.NEXT_PUBLIC_FUNNEL_ORIGIN;
    try {
      process.env.NEXT_PUBLIC_FUNNEL_ORIGIN = "https://go.mdgservices.in";
      assert.equal(funnelHref("home", "hi"), "https://go.mdgservices.in/app/new-pump?from=home&lang=hi");
      for (const bad of ["http://go.mdgservices.in", "https://go.mdgservices.in/x", "javascript:alert(1)", " "]) {
        process.env.NEXT_PUBLIC_FUNNEL_ORIGIN = bad;
        assert.equal(funnelHref("home", "en"), "/app/new-pump?from=home", bad);
      }
    } finally {
      if (before === undefined) delete process.env.NEXT_PUBLIC_FUNNEL_ORIGIN;
      else process.env.NEXT_PUBLIC_FUNNEL_ORIGIN = before;
    }
  });

  it("sends a computer on the funnel address to /new-pump on the main site in one hop", () => {
    const a = funnelAnswer(new Request("https://go.mdgservices.in/app/new-pump?from=home&lang=hi", { headers: { "user-agent": DESKTOP } }), { fallbackMedium: "funnel_link" });
    assert.equal(a.location, "https://mdgservices.in/new-pump?lang=hi");
    // behind `next start` the request URL can name the local server; the Host header still says go.
    const local = funnelAnswer(new Request("http://localhost:3000/app/new-pump?from=home", { headers: { "user-agent": DESKTOP, host: "go.mdgservices.in" } }), { fallbackMedium: "funnel_link" });
    assert.equal(local.location, "https://mdgservices.in/new-pump");
  });
});

describe("which taps are counted", () => {
  it("counts a person: the source, the kind of phone and the language, nothing else", () => {
    assert.deepEqual(answer("/app/new-pump?from=pump:x&lang=hi", ANDROID).tap, { source: "pump:x", device: "android", lang: "hi" });
    assert.deepEqual(answer("/app/new-pump?from=home", IPHONE).tap, { source: "home", device: "ios", lang: "en" });
    assert.deepEqual(answer("/app/new-pump?from=home&lang=or", DESKTOP).tap, { source: "home", device: "other", lang: "or" });
  });

  it("redirects crawlers and link previews but never counts them", () => {
    for (const agent of [GOOGLEBOT, GOOGLEBOT_PHONE, WHATSAPP, FACEBOOK, "Slackbot-LinkExpanding 1.0", "Mozilla/5.0 (compatible; bingbot/2.0)", ""]) {
      const a = answer("/app/new-pump?from=home", agent);
      assert.equal(a.tap, null, agent);
      assert.ok(a.location.startsWith("https://"), agent);
      assert.ok(isBot(agent), agent);
    }
  });

  it("does not mistake a Cubot phone for a bot", () => {
    assert.equal(isBot(CUBOT), false);
    assert.equal(answer("/app/new-pump?from=home", CUBOT).tap?.device, "android");
  });

  it("never counts a HEAD", () => {
    const a = answer("/app/new-pump?from=home", ANDROID, "HEAD");
    assert.equal(a.tap, null);
    assert.equal(new URL(a.location).hostname, "play.google.com");
  });
});

describe("the route files", () => {
  it("/app/new-pump answers a 302 that no shared cache may keep", async () => {
    const { GET, HEAD } = await import("../app/app/new-pump/route.ts");
    const res = GET(req("/app/new-pump?from=pump:x&lang=hi", ANDROID));
    assert.equal(res.status, 302);
    assert.equal(res.headers.get("cache-control"), "private, no-store");
    assert.equal(res.headers.get("vary"), "User-Agent");
    assert.match(res.headers.get("location") ?? "", /utm_content%3Dpump%3Ax/);
    assert.equal(HEAD(req("/app/new-pump?from=home", DESKTOP, "HEAD")).status, 302);
  });

  it("/start?for=new-pump behaves the same, the source carried into the tag", async () => {
    const { GET } = await import("../app/start/route.ts");
    const android = new URL(GET(req("/start?for=new-pump&from=film&lang=hi", ANDROID)).headers.get("location") ?? "");
    assert.equal(android.searchParams.get("referrer"), "utm_source=website&utm_medium=film&utm_campaign=new_pump&utm_content=film");
    const bare = new URL(GET(req("/start?for=new-pump", ANDROID)).headers.get("location") ?? "");
    assert.equal(bare.searchParams.get("referrer"), "utm_source=website&utm_medium=start_link&utm_campaign=new_pump");
    assert.equal(GET(req("/start?for=new-pump&lang=hi", DESKTOP)).headers.get("location"), "https://mdgservices.in/new-pump?lang=hi");
    // the plain Start services link is unchanged
    assert.match(new URL(GET(req("/start?lang=hi", ANDROID)).headers.get("location") ?? "").searchParams.get("referrer") ?? "", /utm_source=whatsapp/);
  });
});

describe("handing a tap to the API", () => {
  const realFetch = globalThis.fetch;
  let sent: { url: string; init: RequestInit }[] = [];
  let reply: () => Promise<Response> = async () => new Response(JSON.stringify({ ok: true, data: { id: "t1" } }), { status: 202 });
  before(() => {
    globalThis.fetch = (async (url: string | URL, init: RequestInit) => {
      sent.push({ url: String(url), init });
      return reply();
    }) as typeof fetch;
  });
  after(() => {
    globalThis.fetch = realFetch;
  });

  it("posts the three fields, server to server, with the website's secret and a short limit", async () => {
    sent = [];
    await recordTap({ source: "pump:x", device: "android", lang: "hi" });
    assert.equal(sent.length, 1);
    assert.equal(sent[0]!.url, "https://api.example.test/api/v1/website/funnel-taps");
    assert.equal(sent[0]!.init.method, "POST");
    assert.equal((sent[0]!.init.headers as Record<string, string>).Authorization, "Bearer test-secret");
    assert.deepEqual(JSON.parse(String(sent[0]!.init.body)), { source: "pump:x", device: "android", lang: "hi" });
    assert.ok(sent[0]!.init.signal, "a timeout signal");
    assert.equal(TAP_TIMEOUT_MS, 1500);
  });

  it("never throws: a refusal, an empty 202 or a dead API is only a log line", async () => {
    const warn = console.warn;
    const logged: string[] = [];
    console.warn = (m: string) => void logged.push(m);
    try {
      reply = async () => new Response(null, { status: 202 });
      await recordTap({ source: null, device: "other", lang: "en" });
      assert.equal(logged.length, 0, "an empty 202 is a tap taken");
      reply = async () => new Response(JSON.stringify({ ok: false, error: { code: "BAD_TAP" } }), { status: 400 });
      await recordTap({ source: null, device: "other", lang: "en" });
      reply = async () => {
        throw new Error("connect ECONNREFUSED");
      };
      await recordTap({ source: null, device: "other", lang: "en" });
      assert.equal(logged.length, 2);
      assert.ok(logged.every((m) => !m.includes("test-secret")), "the secret is never logged");
    } finally {
      console.warn = warn;
    }
  });
});

it("does not count a browser loading the link ahead of a tap", () => {
  const ahead: Array<Record<string, string>> = [
    { "sec-purpose": "prefetch" },
    { purpose: "prefetch" },
    { "sec-purpose": "prefetch;prerender" },
    { "next-router-prefetch": "1" },
    { rsc: "1" },
  ];
  for (const h of ahead) assert.equal(isPrefetch(new Headers(h)), true, JSON.stringify(h));
  assert.equal(isPrefetch(new Headers({ "user-agent": "Mozilla/5.0 (Linux; Android 14)" })), false);
});
