import { createHash } from "node:crypto";
import { register as en, TERMS_VERSION } from "../src/i18n/en/register.js";
import { register as hi } from "../src/i18n/hi/register.js";

/**
 * What a registration records about the Terms the person ticked: the edition
 * (`TERMS_VERSION`) and a fingerprint of the clause text in the language of the
 * page they were on.
 *
 * Computed here, on the server, from the same dictionaries the page is drawn
 * from, and never taken from the browser: a browser could send any fingerprint,
 * and the point is that this one is ours. The Hindi text is a courtesy
 * translation and the English is the binding one (see `register.ts`), so each
 * language has its own fingerprint, and a registration made on the Hindi page
 * is recorded against the Hindi clauses the dealer actually read.
 *
 * There are two sets of clauses (ADR 0058 §6): an outlet's (`terms`, the
 * dealer agreement) and Kavach Shuruaat's (`plannerTerms`, for someone planning
 * a pump, `kind: "planner"`). Each is fingerprinted on its own, so a planner's
 * registration proves what a planner was shown, and the outlet fingerprint did
 * not move when Kavach Shuruaat's clauses were added. One `TERMS_VERSION` names
 * the edition of both.
 *
 * The fingerprint is SHA-256, as lower-case hex, of the clauses in order, each
 * followed by a line feed, as UTF-8. `scripts/enroll.check.ts` pins these
 * values, so a clause edited without a new `TERMS_VERSION` is caught.
 */
const CLAUSES = {
  outlet: { en: en.terms, hi: hi.terms },
  planner: { en: en.plannerTerms, hi: hi.plannerTerms },
} as const;

export type TermsLang = keyof (typeof CLAUSES)["outlet"];
/** Which form the tick was on: an outlet's registration, or Kavach Shuruaat's. */
export type TermsKind = keyof typeof CLAUSES;

/** The fingerprint of one language's clause text. */
export function termsTextHash(lang: TermsLang, kind: TermsKind = "outlet"): string {
  const hash = createHash("sha256");
  for (const clause of CLAUSES[kind][lang]) hash.update(`${clause}\n`, "utf8");
  return hash.digest("hex");
}

/**
 * What goes to the API with a registration. A form that did not say which
 * language it was in (a copy of the app from before it did) is recorded against
 * the English text, which is the binding one.
 */
export function termsRecord(
  lang: TermsLang | undefined,
  kind: TermsKind = "outlet",
): { termsVersion: string; termsTextHash: string } {
  return { termsVersion: TERMS_VERSION, termsTextHash: termsTextHash(lang ?? "en", kind) };
}
