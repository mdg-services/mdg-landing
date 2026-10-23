/**
 * Checks for the registration hand-off (`server/enroll.ts`), the Terms record
 * (`server/terms.ts`) and what the website's form promises about the password.
 *
 * This site has no test runner, so these are plain `node:test` checks run
 * through the `tsx` the repo root already carries:
 *
 *   cd mdg-landing && npm run check:enroll
 *
 * They talk to a pretend API (`fetch` is replaced) and read what the mailer
 * would have sent from its dev log, so no mail leaves and nothing is stored.
 * `server/env.ts` reads the environment once, when it is first imported, so the
 * variables are set first and the server modules are imported afterwards.
 */
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";

/**
 * Every edition of the Terms text there has been, oldest first, with the
 * fingerprint of each language's clauses. APPEND-ONLY: when a clause changes,
 * bump `TERMS_VERSION` in src/i18n/en/register.ts and add a new entry here;
 * never edit an old one. A registration records its version and fingerprint as
 * the proof of what the dealer agreed to, so an old entry must keep describing
 * the text that edition really was.
 */
const TERMS_HISTORY = [
  {
    version: "2026-10-06",
    en: "3966eee24caa725648a3784c765a606d2e9ee0aaa6ffe673e080076ba00cc578",
    hi: "8d0d791f372d07c7888675508ec0b28b3df33e9601de35e0ccfe6bdf7c831127",
  },
] as const;

const PASSWORD = "Tr1cky-passw0rd-9";

type Enroll = typeof import("../server/enroll.ts");
type Terms = typeof import("../server/terms.ts");
type Register = typeof import("../src/i18n/en/register.ts");

let enroll: Enroll;
let terms: Terms;
let register: Register;
const realFetch = globalThis.fetch;
const realConsole = { info: console.info, warn: console.warn, error: console.error, log: console.log };

/** Everything the server printed, as one string, for "the password never appears" checks. */
let printed: string[] = [];
/** What the pretend API was sent, and what it will answer next. */
let sent: Array<{ url: string; body: Record<string, unknown> }> = [];
let answers: Array<{ status: number; code?: string } | "network"> = [];

const form = {
  name: "Ramesh Kumar",
  mobile: "9876543210",
  email: "ramesh@example.com",
  siteType: "Type A",
  pumpName: "Sai Petroleums",
  sapCode: "41001234",
  agree: true,
  source: "website",
  submissionId: "form-0001-abcdef",
  password: PASSWORD,
  consentWhatsApp: true,
  ref: "film-abc_1",
  lang: "hi",
};

before(async () => {
  process.env.WEBSITE_INTAKE_SECRET = "test-secret";
  process.env.MDG_API_URL = "http://localhost:4000/api/v1";
  delete process.env.SMTP_USER;
  delete process.env.SMTP_PASS;
  enroll = await import("../server/enroll.ts");
  terms = await import("../server/terms.ts");
  register = await import("../src/i18n/en/register.ts");
});

beforeEach(() => {
  printed = [];
  sent = [];
  answers = [];
  const capture =
    (name: keyof typeof realConsole) =>
    (...args: unknown[]) => {
      printed.push(args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" "));
      void name;
    };
  console.info = capture("info");
  console.warn = capture("warn");
  console.error = capture("error");
  console.log = capture("log");
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    sent.push({ url: String(input), body: JSON.parse(String(init?.body ?? "{}")) });
    const next = answers.shift() ?? { status: 200 };
    if (next === "network") throw new TypeError("fetch failed");
    const ok = next.status < 300;
    return new Response(
      JSON.stringify(ok ? { ok: true, data: { id: "enr1", duplicate: false } } : { ok: false, error: { code: next.code ?? "ERR" } }),
      { status: next.status, headers: { "content-type": "application/json" } },
    );
  }) as typeof fetch;
});

after(() => {
  globalThis.fetch = realFetch;
  Object.assign(console, realConsole);
});

/** A fresh mobile per call, so the per-number limit of one test never reaches the next. */
let counter = 0;
const fresh = (over: Record<string, unknown> = {}) => ({
  ...form,
  mobile: `98765${String(10000 + (counter += 1)).slice(-5)}`,
  ...over,
});

describe("Terms record", () => {
  it("matches the latest pinned edition: a clause changed without a new version fails here", () => {
    const latest = TERMS_HISTORY[TERMS_HISTORY.length - 1];
    assert.equal(
      register.TERMS_VERSION,
      latest.version,
      "TERMS_VERSION and the last entry of TERMS_HISTORY must name the same edition",
    );
    assert.equal(
      terms.termsTextHash("en"),
      latest.en,
      "the English Terms text changed: bump TERMS_VERSION and append a new TERMS_HISTORY entry",
    );
    assert.equal(
      terms.termsTextHash("hi"),
      latest.hi,
      "the Hindi Terms text changed: bump TERMS_VERSION and append a new TERMS_HISTORY entry",
    );
  });

  it("never reuses a version for different text", () => {
    const versions = TERMS_HISTORY.map((h) => h.version);
    assert.equal(new Set(versions).size, versions.length);
    for (let i = 1; i < TERMS_HISTORY.length; i += 1) {
      const [before, now] = [TERMS_HISTORY[i - 1], TERMS_HISTORY[i]];
      assert.ok(now.version > before.version, "versions are dates and only go forward");
      assert.ok(now.en !== before.en || now.hi !== before.hi, "a new edition changes some text");
    }
  });

  it("records the language of the page, and English when the form did not say", () => {
    assert.equal(terms.termsRecord("hi").termsTextHash, terms.termsTextHash("hi"));
    assert.equal(terms.termsRecord("en").termsTextHash, terms.termsTextHash("en"));
    assert.equal(terms.termsRecord(undefined).termsTextHash, terms.termsTextHash("en"));
    assert.notEqual(terms.termsTextHash("en"), terms.termsTextHash("hi"));
    assert.match(terms.termsTextHash("hi"), /^[0-9a-f]{64}$/);
  });
});

describe("the registration hand-off", () => {
  it("sends the password, the Terms record, the consent, the ref and the language to the API, and answers ok", async () => {
    const result = await enroll.processEnrollment(fresh());
    assert.deepEqual(result, { ok: true, status: 200 });
    assert.equal(sent.length, 1);
    const [call] = sent;
    assert.ok(call.url.endsWith("/website/enrolments"));
    assert.equal(call.body.password, PASSWORD);
    assert.equal(call.body.termsVersion, register.TERMS_VERSION);
    assert.equal(call.body.termsTextHash, terms.termsTextHash("hi"));
    assert.equal(call.body.consentWhatsApp, true);
    assert.equal(call.body.ref, "film-abc_1");
    assert.equal(call.body.lang, "hi");
    // The browser's own claim about `agree` is not forwarded as a field.
    assert.equal("agree" in call.body, false);
  });

  it("never lets the password reach a log line, an email or the answer", async () => {
    // Success, then a refusal, then a network failure: every path.
    for (const answer of [{ status: 200 }, { status: 400, code: "VALIDATION" }, "network" as const, "network" as const]) {
      answers.push(answer);
    }
    const ok = await enroll.processEnrollment(fresh());
    const refused = await enroll.processEnrollment(fresh());
    const down = await enroll.processEnrollment(fresh());
    for (const text of [JSON.stringify(ok), JSON.stringify(refused), JSON.stringify(down), printed.join("\n")]) {
      assert.equal(text.includes(PASSWORD), false);
    }
    // Only the request to the API carries it.
    assert.ok(sent.every((s) => s.body.password === PASSWORD));
  });

  it("tells the visitor so when the API is down, and still emails the team, marked", async () => {
    answers.push("network", "network");
    const result = await enroll.processEnrollment(fresh());
    assert.deepEqual(result, {
      ok: false,
      status: 502,
      error: "We could not complete your registration. Please try again, or call us.",
    });
    const team = printed.filter((l) => l.includes("[mailer:dev]"));
    assert.equal(team.length, 1, "one email, to the team, and no welcome");
    assert.ok(team[0].includes("[NOT REGISTERED — call them]"));
  });

  it("tries once more after a try that got no answer, and with the same submission id", async () => {
    answers.push("network", { status: 200 });
    const result = await enroll.processEnrollment(fresh());
    assert.equal(result.ok, true);
    assert.equal(sent.length, 2);
    assert.equal(sent[0].body.submissionId, sent[1].body.submissionId);
  });

  it("does not try again after the API answered no", async () => {
    answers.push({ status: 400, code: "VALIDATION" });
    const result = await enroll.processEnrollment(fresh());
    assert.equal(result.ok, false);
    assert.equal(sent.length, 1);
  });

  it("passes the API's own 'too many' on as a 429, which the form words differently", async () => {
    answers.push({ status: 429, code: "RATE_LIMITED" });
    const result = await enroll.processEnrollment(fresh());
    assert.equal(result.ok, false);
    assert.equal(result.status, 429);
    assert.equal(sent.length, 1);
    assert.ok(printed.some((l) => l.includes("[NOT REGISTERED — call them]")));
  });

  it("sends the welcome to the dealer only when the registration was saved", async () => {
    await enroll.processEnrollment(fresh());
    const saved = printed.filter((l) => l.includes("[mailer:dev]"));
    assert.equal(saved.length, 2, "the team's and the welcome");
    assert.ok(saved.some((l) => l.includes("to:      ramesh@example.com")));
  });

  it("still registers a form from before the password existed (an older app)", async () => {
    const { password: _omitted, consentWhatsApp: _c, lang: _l, ...old } = fresh({ source: "app" });
    void _omitted;
    void _c;
    void _l;
    const result = await enroll.processEnrollment(old);
    assert.equal(result.ok, true);
    assert.equal("password" in sent[0].body && sent[0].body.password !== undefined, false);
    // No language given: recorded against the English text, which is the binding one.
    assert.equal(sent[0].body.termsTextHash, terms.termsTextHash("en"));
  });

  it("refuses a password that is there but too short, and says nothing about its value", async () => {
    const result = await enroll.processEnrollment(fresh({ password: "short" }));
    assert.equal(result.ok, false);
    assert.equal(result.status, 400);
    assert.equal(sent.length, 0);
    assert.equal(JSON.stringify(result).includes("short\""), false);
  });

  it("drops a malformed ref instead of refusing the registration", async () => {
    const result = await enroll.processEnrollment(fresh({ ref: "not a code!!" }));
    assert.equal(result.ok, true);
    assert.equal(sent[0].body.ref, undefined);
  });
});
