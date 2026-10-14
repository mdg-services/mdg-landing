import type { VercelRequest, VercelResponse } from "@vercel/node";
import { processEnrollment } from "../server/enroll.js";
import { enrollCorsHeaders } from "../server/cors.js";

/**
 * The API hand-off waits up to 4 s, then two emails can each wait on the mail
 * server: more than a host's default time for one function.
 */
export const config = { maxDuration: 30 };

/**
 * POST /api/enroll — dealer enrolment.
 * Thin HTTP adapter; all logic lives in `server/enroll.ts`.
 *
 * The website posts here from its own origin. The Dealer Kavach app's sign-up
 * screen posts the same form from the client web app's origin, so the
 * allow-listed origins get CORS headers and a preflight answer.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Vary", "Origin");
  const cors = enrollCorsHeaders(req.headers.origin);
  if (cors) for (const [k, v] of Object.entries(cors)) res.setHeader(k, v);

  if (req.method === "OPTIONS") {
    return res.status(cors ? 204 : 403).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const result = await processEnrollment(req.body, {
      submittedAt: new Date().toISOString(),
      ip: clientAddress(req),
    });

    // `status` is present on both branches, so no narrowing is required.
    return res.status(result.status).json(result.ok ? { ok: true } : result);
  } catch (err) {
    console.error("[api/enroll] failed:", err);
    return res.status(502).json({
      ok: false,
      error: "We couldn't send your enrolment just now. Please try again, or call us.",
    });
  }
}

/**
 * The visitor's address as Vercel's edge saw it. Vercel overwrites both headers
 * on the way in, so the caller cannot choose them.
 */
function clientAddress(req: VercelRequest): string | undefined {
  const header = req.headers["x-real-ip"] ?? req.headers["x-forwarded-for"];
  const value = Array.isArray(header) ? header[0] : header;
  return value?.split(",")[0].trim() || undefined;
}
