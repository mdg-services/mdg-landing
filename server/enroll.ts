import {
  enrollmentSchema,
  plannerEnrollmentSchema,
  type EnrollmentData,
  type EnrollmentSubmission,
  type PlannerData,
  type PlannerSubmission,
} from "./validation.js";
import { sendTemplate } from "./mailer.js";
import { enrollmentNotificationEmail, welcomeEmail, type EnrollHandOff } from "./emails/templates.js";
import { plannerNotificationEmail, plannerWelcomeEmail } from "./emails/planner.js";
import { newPumpPrice, rupeesPaise } from "../src/lib/docText.js";
import { IntakeRefused, postIntake } from "./intake.js";
import { termsRecord } from "./terms.js";
import { env } from "./env.js";
import { RecentLog, addressKey } from "./recent.js";
import { enrollAccountOf, type EnrollAccount, type ProcessResult } from "./result.js";

/** A saved registration also says where the dealer now stands, for the form to word. */
export type EnrollResult = { ok: true; status: 200; account: EnrollAccount } | Extract<ProcessResult, { ok: false }>;

const WINDOW_MS = 10 * 60_000;
/** Enrolments one address may send per window. */
const PER_ADDRESS = 5;
/** Enrolments one mobile number may be named in per window. */
const PER_MOBILE = 3;

const sentByAddress = new RecentLog(WINDOW_MS);
const sentByMobile = new RecentLog(WINDOW_MS);

/** What a visitor is told when the registration could not be saved. The same words the form shows. */
const NOT_REGISTERED = "We could not complete your registration. Please try again, or call us.";
/** New Pump Guide is switched off on the server (`PLANNER_ENABLED=false`): a plain answer, no retry, no team email. */
const PLANNER_CLOSED = "Kavach Shuruaat is not open for sign-ups right now. Please try again later.";
const TOO_MANY = "Too many requests just now. Please call us instead.";

/**
 * Validate an enrolment payload, hand it to the MDG API and fan out the
 * emails.
 *
 * Transport-agnostic: the Vercel function and the local dev server both call
 * this, so the business logic lives in exactly one place. The website's
 * /register page and the Dealer Kavach app's sign-up screen both come through
 * here.
 *
 * - The registration is handed to the MDG API first, and that hand-off is what
 *   makes it a registration: the API holds the dealer's password (as a hash),
 *   the Terms they ticked and the campaign it came from. So when it fails the
 *   visitor is told so, never shown "success". The team is still emailed, with
 *   the subject marked "[NOT REGISTERED — call them]", because a person who
 *   tried to register is a person to ring.
 * - The password is taken out of the form here and goes to the API and nowhere
 *   else: not to a template, a log line, an error or the answer.
 * - The internal notification always goes to `ENROLLMENT_NOTIFY_TO`.
 * - The welcome email is sent only when the registration was saved and the
 *   dealer supplied an address.
 * - The two emails are sent concurrently; if either fails the whole call
 *   rejects so the caller can surface a retry.
 *
 * New Pump Guide's sign-up (ADR 0058, `kind: "planner"`, the app's "I want to
 * open a petrol pump" form) comes through here too, with the same limits, the
 * same password rule and the same retry; it is checked by its own schema, sent
 * to the API with its own fields and recorded against its own Terms, and its
 * emails are its own (emails/planner.ts).
 *
 * `ip` is the visitor's address as the host saw it; the dev server passes none,
 * so no per-address limit applies there. `userAgent` is the browser's signature,
 * handed to the API for the kind of device the form was filled in on.
 */
export async function processEnrollment(
  input: unknown,
  meta: { submittedAt?: string; ip?: string; userAgent?: string } = {}
): Promise<EnrollResult> {
  const parsed = parseForm(input);
  if (!parsed.ok) {
    return {
      ok: false,
      status: 400,
      error: "Some details look off. Please check the form and try again.",
      issues: parsed.issues,
    };
  }
  const now = Date.now();
  // "+91 98765 43210" and "9876543210" are the same number.
  const mobile = parsed.form.mobile.replace(/\D/g, "").slice(-10);
  const address = meta.ip ? addressKey(meta.ip) : undefined;
  // A real error, not a quiet one: many people can share one address on a
  // mobile network, and whoever is turned away should see the form's "call
  // us" rather than wait for a call that is not coming.
  if (address && sentByAddress.count(address, now) >= PER_ADDRESS) {
    console.warn(`[enroll] not sent: over ${PER_ADDRESS} from one address in 10 minutes`);
    return { ok: false, status: 429, error: TOO_MANY };
  }
  if (sentByMobile.count(mobile, now) >= PER_MOBILE) {
    console.warn(`[enroll] not sent: over ${PER_MOBILE} for one mobile number in 10 minutes`);
    return { ok: false, status: 429, error: TOO_MANY };
  }

  // Counted before anything goes out, so a burst of requests sent together
  // cannot all pass the checks while the first is still on its way; taken back
  // if an email fails, so the visitor's retry is not turned away.
  const undo = [sentByMobile.add(mobile, now), ...(address ? [sentByAddress.add(address, now)] : [])];
  const submittedAt = meta.submittedAt ?? new Date().toISOString();

  // First, so the team's email can say whether it worked, and where the dealer stands.
  const { handOff, account, jobs, closed } =
    parsed.kind === "planner"
      ? await registerPlanner(parsed.form, submittedAt, meta.userAgent)
      : await registerOutlet(parsed.form, submittedAt, meta.userAgent);

  // Switched off on the server: say so plainly. Nothing was sent (it is not a lost sign-up to chase).
  if (closed) {
    for (const takeBack of undo) takeBack();
    return { ok: false, status: 503, error: PLANNER_CLOSED };
  }

  // Settled, not just awaited, so the function does not return (and the host
  // stop it) while the other email is still in flight, even when one has
  // already failed.
  const settled = await Promise.allSettled(jobs);
  const failedEmail = settled.find((r) => r.status === "rejected");
  if (failedEmail) {
    for (const takeBack of undo) takeBack();
    throw failedEmail.reason;
  }
  // Not undone: the visitor's retries stay counted, so a registration that
  // cannot be saved cannot turn the team's inbox into a stream either.
  if (handOff === "busy") return { ok: false, status: 429, error: TOO_MANY };
  if (handOff === "failed") return { ok: false, status: 502, error: NOT_REGISTERED };
  return { ok: true, status: 200, account };
}

/** The form, by its kind: an outlet's registration or a New Pump Guide sign-up. */
type Parsed =
  | { ok: true; kind: "outlet"; form: EnrollmentSubmission }
  | { ok: true; kind: "planner"; form: PlannerSubmission }
  | { ok: false; issues: Record<string, string[] | undefined> };

/** Read the form with the schema its `kind` names; anything that is not a planner's is an outlet's, as before. */
function parseForm(input: unknown): Parsed {
  const planner = typeof input === "object" && input !== null && (input as { kind?: unknown }).kind === "planner";
  if (planner) {
    const parsed = plannerEnrollmentSchema.safeParse(input);
    return parsed.success ? { ok: true, kind: "planner", form: parsed.data } : { ok: false, issues: parsed.error.flatten().fieldErrors };
  }
  const parsed = enrollmentSchema.safeParse(input);
  return parsed.success ? { ok: true, kind: "outlet", form: parsed.data } : { ok: false, issues: parsed.error.flatten().fieldErrors };
}

type Registered = { handOff: EnrollHandOff; account: EnrollAccount; jobs: Array<Promise<void>>; closed?: boolean };

/** An outlet's registration: the hand-off, the team's mail and the dealer's welcome, as it always was. */
async function registerOutlet(form: EnrollmentSubmission, submittedAt: string, userAgent: string | undefined): Promise<Registered> {
  // The password stays in this scope. Everything below that is not the API
  // hand-off sees `data`, which does not have it.
  const { password, ...data } = form;
  const { handOff, account } = await handToApi(data, password, userAgent);
  const jobs: Array<Promise<void>> = [
    sendTemplate(
      enrollmentNotificationEmail(data, { submittedAt, handOff, hasPassword: password !== undefined, account }),
      env.notifyTo,
      { replyTo: data.email },
    ),
  ];
  // The welcome says "your enrolment is in" and what comes next. Said to
  // someone who was just shown an error, it would be false.
  if (data.email && handOff === "ok") {
    jobs.push(sendTemplate(welcomeEmail(data, account), data.email));
  }
  return { handOff, account, jobs };
}

/** A New Pump Guide sign-up: the same steps with its own fields, Terms and emails. */
async function registerPlanner(form: PlannerSubmission, submittedAt: string, userAgent: string | undefined): Promise<Registered> {
  const { password, ...data } = form;
  const { handOff, account, closed } = await handPlannerToApi(data, password, userAgent);
  if (closed) return { handOff, account, jobs: [], closed };
  const jobs: Array<Promise<void>> = [
    sendTemplate(plannerNotificationEmail(data, { submittedAt, handOff, account }), env.notifyTo, { replyTo: data.email }),
  ];
  if (data.email && handOff === "ok") {
    jobs.push(sendTemplate(plannerWelcomeEmail(data, account, rupeesPaise(newPumpPrice().total)), data.email));
  }
  return { handOff, account, jobs };
}

/** The API hand-off waits this long for each try. */
const HAND_OFF_TIMEOUT_MS = 6_000;
/** Tries before a registration is called unsaved. */
const HAND_OFF_TRIES = 2;

/**
 * Hand a registration to the MDG API. Never rejects: it says how it went, and
 * for a saved one where the dealer now stands (`account`, `waiting` otherwise).
 *
 * - `ok`: saved. The API also answers `ok` for a repeat of the same
 *   `submissionId`, which is why trying twice is safe.
 * - `busy`: the API's own cap (a few per mobile an hour) said no. Trying again
 *   at once would only be refused again.
 * - `failed`: it did not get there, or the API refused it for a reason a retry
 *   will not change.
 *
 * A try that did not get an answer (timeout, network, a 5xx) is made once
 * more. A refusal is not: the API has answered. What is logged is the status
 * and the code, never the body, so neither the password nor the visitor's
 * details reach a log line.
 *
 * Fields are named one by one, so a field added to the form later is not sent
 * by accident. The Terms fingerprint is ours (`termsRecord`), not the browser's.
 */
async function handToApi(
  data: EnrollmentData,
  password: string | undefined,
  userAgent: string | undefined
): Promise<{ handOff: EnrollHandOff; account: EnrollAccount }> {
  return postRegistration({
    submissionId: data.submissionId,
    name: data.name,
    mobile: data.mobile,
    email: data.email,
    siteType: data.siteType,
    pumpName: data.pumpName,
    sapCode: data.sapCode,
    source: data.source,
    password,
    ...termsRecord(data.lang),
    consentWhatsApp: data.consentWhatsApp,
    ref: data.ref,
    lang: data.lang,
    // For the kind of device only (Android, iPhone, computer); the API keeps the
    // result, never the signature. An API older than that field drops it unread.
    userAgent: userAgent?.slice(0, 500),
  });
}

/**
 * Hand a New Pump Guide sign-up to the MDG API: the fields of the API's
 * `plannerRegisterSchema`, named one by one like the outlet's. The app's language
 * goes as it is (hi, hl or en); the Terms are recorded in the language they were
 * shown in, Hindi for a Hindi app and English otherwise (Hinglish falls back to
 * English, as the API's `baseLangOf` does).
 */
async function handPlannerToApi(
  data: PlannerData,
  password: string,
  userAgent: string | undefined
): Promise<{ handOff: EnrollHandOff; account: EnrollAccount; closed?: boolean }> {
  return postRegistration({
    kind: "planner",
    submissionId: data.submissionId,
    name: data.name,
    mobile: data.mobile,
    email: data.email,
    password,
    stateCode: data.stateCode,
    district: data.district,
    oilCompany: data.oilCompany,
    stage: data.stage,
    source: data.source,
    ...termsRecord(data.lang === "hi" ? "hi" : "en", "planner"),
    consentWhatsApp: data.consentWhatsApp,
    ref: data.ref,
    lang: data.lang,
    userAgent: userAgent?.slice(0, 500),
    // Which page sent them, for the funnel report. Beside the Terms record, never in it:
    // the fingerprint is of the clauses shown, and a tag does not change those.
    from: data.from,
  });
}

/** Send one registration body to the API, once more after a try that got no answer (see `handToApi`). */
async function postRegistration(
  body: Record<string, unknown>
): Promise<{ handOff: EnrollHandOff; account: EnrollAccount; closed?: boolean }> {
  for (let attempt = 1; attempt <= HAND_OFF_TRIES; attempt += 1) {
    try {
      const saved = await postIntake<{ account?: unknown }>("/website/enrolments", body, {
        timeoutMs: HAND_OFF_TIMEOUT_MS,
        standIn: { account: "waiting" },
      });
      return { handOff: "ok", account: enrollAccountOf(saved.account) };
    } catch (err) {
      if (err instanceof IntakeRefused) {
        if (err.status === 429) return { handOff: "busy", account: "waiting" };
        // New Pump Guide switched off on the server: a final answer, not a failure to retry.
        if (err.code === "PLANNER_OFF") return { handOff: "failed", account: "waiting", closed: true };
        if (err.status < 500) {
          console.error(`[enroll] the API refused the registration: ${err.message}`);
          return { handOff: "failed", account: "waiting" };
        }
      }
      const what = err instanceof Error ? err.message : "unknown error";
      console.error(`[enroll] could not hand the registration to the API (try ${attempt}): ${what}`);
    }
  }
  return { handOff: "failed", account: "waiting" };
}
