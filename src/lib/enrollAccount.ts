/**
 * Where a dealer stands once their registration is saved, as the MDG API answers
 * it (mdg-backend `services/outletSetup/autoApprove.ts`), for the form to word:
 * `ready` — the account is open, sign in; `existing` — this mobile already signs in
 * to an account; `waiting` — MDG's team looks at it first. An API from before the
 * answer existed says nothing, which is `waiting`: what every form said until then.
 */
export type EnrollAccount = "ready" | "existing" | "waiting";

export function enrollAccountOf(value: unknown): EnrollAccount {
  return value === "ready" || value === "existing" ? value : "waiting";
}
