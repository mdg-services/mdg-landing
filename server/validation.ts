import { z } from "zod";

/** Optional free-text field that treats "" the same as "not provided". */
const optionalText = (max: number) =>
  z
    .union([z.string().trim().max(max), z.literal("")])
    .optional()
    .transform((v) => (v ? v : undefined));

/**
 * The dealer-enrolment payload. This is the single source of truth for the
 * shape of the form — the API, the dev server, and the email templates all
 * consume `EnrollmentData`.
 */
export const enrollmentSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  mobile: z
    .string()
    .trim()
    .regex(/^[0-9+\s-]{10,15}$/, "Enter a valid mobile number"),
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
});

export type EnrollmentData = z.infer<typeof enrollmentSchema>;

/** The homepage "Leave my number" callback request. */
export const callbackSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\s-]{10,15}$/, "Enter a valid phone number"),
  outlet: optionalText(160),
  message: optionalText(1000),
});

export type CallbackData = z.infer<typeof callbackSchema>;
