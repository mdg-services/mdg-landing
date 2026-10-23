import { z } from "zod";
import { toMobile } from "../src/lib/mobile.js";

/** Optional free-text field that treats "" the same as "not provided". */
const optionalText = (max: number) =>
  z
    .union([z.string().trim().max(max), z.literal("")])
    .optional()
    .transform((v) => (v ? v : undefined));

/**
 * One id per filled-in form, made by the browser when the page opens. A retry
 * after a dropped connection carries the same id, so the admin list finds the
 * submission the first attempt already saved instead of adding a second one.
 */
const submissionId = z.string().regex(/^[A-Za-z0-9_-]{8,64}$/);

/**
 * A 10-digit Indian mobile, by the rule every form on the site checks in the
 * browser (`src/lib/mobile.ts`), and handed on as those ten plain digits.
 * Hindi digits, spaces, +91 and a leading 0 are accepted and taken off here
 * too, for an older page or the app that sends the number as it was typed.
 * The API's own rule is looser (10 to 15 digits, spaces, + and -), so what
 * passes here always passes there.
 */
const mobile = z
  .string()
  .trim()
  .max(40)
  .transform((value, ctx) => {
    const ten = toMobile(value);
    if (ten) return ten;
    ctx.addIssue({ code: "custom", message: "Enter a 10-digit mobile number" });
    return z.NEVER;
  });

/**
 * The dealer-enrolment payload. This is the single source of truth for the
 * shape of the form — the API, the dev server, and the email templates all
 * consume `EnrollmentData`.
 */
export const enrollmentSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  mobile,
  email: z
    .union([z.string().trim().email("Enter a valid email").max(200), z.literal("")])
    .optional()
    .transform((v) => (v ? v : undefined)),
  siteType: z.enum(["Type A", "Type B"], {
    message: "Select a site type",
  }),
  pumpName: optionalText(160),
  sapCode: z.string().trim().min(1, "SAP code is required").max(60),
  agree: z.literal(true, { message: "You must accept the Terms & Conditions" }),
  /** Where the form was filled in. The website never sends it; the app does. */
  source: z.enum(["website", "app"]).default("website"),
  /**
   * The website's form sends one; the app's sign-up screen does not. It only
   * helps the admin list spot a retry, so a malformed one is dropped rather
   * than refusing an enrolment the team's inbox should still get.
   */
  submissionId: submissionId.optional().catch(undefined),
  /**
   * The password the dealer chose for Dealer Kavach. It goes to the MDG API and
   * nowhere else: not into an email, a log line, an error or the answer to the
   * browser. Optional only because a copy of the app from before this field
   * still registers without one (the API then makes a temporary password on
   * approval); the website's own form will not send without it. A password
   * that is there but too short is an error, never quietly dropped, or the
   * dealer would believe they had chosen one.
   */
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .max(200, "Use at most 200 characters")
    .optional(),
  /**
   * That the one tick also agreed to WhatsApp messages about the account. Sent
   * on only when the form said so: an older app's tick did not cover it.
   */
  consentWhatsApp: z.boolean().optional().catch(undefined),
  /** The film link's share code (`?r=`) the form was opened from. Dropped, not refused, when malformed. */
  ref: z
    .string()
    .regex(/^[A-Za-z0-9_-]{1,32}$/)
    .optional()
    .catch(undefined),
  /** The language of the page the form was on: it decides which Terms text the tick is recorded against. */
  lang: z.enum(["hi", "en"]).optional().catch(undefined),
});

/** What the form carried, password included. Only `processEnrollment` handles this. */
export type EnrollmentSubmission = z.infer<typeof enrollmentSchema>;

/**
 * The same without the password, and the only shape the email templates take.
 * Typed this way so a template that tried to print the password would not
 * compile, and `processEnrollment` takes it out before anything else sees it.
 */
export type EnrollmentData = Omit<EnrollmentSubmission, "password">;

/** The homepage "Leave my number" callback request. */
export const callbackSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  phone: mobile,
  outlet: optionalText(160),
  message: optionalText(1000),
  /** Where the form was filled in. The homepage never sends it; the film pages do. */
  source: z.enum(["website", "film"]).default("website"),
  /** The film page's share code (`?r=`): which message or link brought this dealer. */
  ref: z
    .string()
    .regex(/^[A-Za-z0-9_-]{1,32}$/)
    .optional()
    .catch(undefined),
  /** Which film page it was sent from. Anything else is dropped, not refused. */
  film: z.enum(["kavach", "kavach-short"]).optional().catch(undefined),
  /** The language of the page the form was on. */
  lang: z.enum(["hi", "en"]).optional().catch(undefined),
});

export type CallbackData = z.infer<typeof callbackSchema>;

/**
 * What every call-back form sends beside the request itself, so a person can
 * be told from a script. Neither field reaches the email.
 */
export const callbackGuardSchema = z.object({
  /**
   * A box no person sees. Anything in it came from a program that fills every
   * box it finds. The assistant's fallback has no such box and leaves it out.
   */
  website: z.unknown().optional(),
  /**
   * Milliseconds from the page opening to the form being sent, timed on the
   * visitor's own device, so a phone whose clock is wrong is timed correctly.
   */
  elapsed: z.number().nonnegative(),
});

/** What a grievance can be about. The API holds the same list; the page labels them. */
export const GRIEVANCE_CATEGORIES = [
  "service",
  "app",
  "billing",
  "staff",
  "privacy",
  "other",
] as const;

export type GrievanceCategory = (typeof GRIEVANCE_CATEGORIES)[number];

/** The language the form was filled in: it decides the language of the reply. */
export const GRIEVANCE_LANGS = ["hi", "en"] as const;

export type GrievanceLang = (typeof GRIEVANCE_LANGS)[number];

/**
 * The /grievance form. These are the same rules the API holds a grievance to:
 * it checks them again, and one that passed here but failed there would be a
 * grievance the visitor was told was sent.
 */
export const grievanceSchema = z.object({
  submissionId,
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(200),
  mobile,
  outlet: optionalText(160),
  category: z.enum(GRIEVANCE_CATEGORIES, { message: "Select what it is about" }),
  message: z
    .string()
    .trim()
    .min(10, "Please write a little more")
    .max(3000, "Please keep it under 3000 characters"),
  lang: z.enum(GRIEVANCE_LANGS),
});

export type GrievanceData = z.infer<typeof grievanceSchema>;

/** The grievance form sends the same two guard fields the call-back form does. */
export const grievanceGuardSchema = callbackGuardSchema;
