import { env } from "./env.js";

/**
 * CORS headers for the enrolment endpoint, or `null` when the caller's origin
 * is not on the list.
 *
 * Only the enrolment form needs this: the app's sign-up screen posts the same
 * form from the client web app's origin. A `null` answer does not refuse the
 * request; it leaves the browser to block the response, as it always did.
 */
export function enrollCorsHeaders(origin: string | undefined): Record<string, string> | null {
  if (!origin || !env.enrollAllowedOrigins.includes(origin)) return null;
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}
