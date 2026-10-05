import type { VercelRequest, VercelResponse } from "@vercel/node";
import { processEnrollment } from "../server/enroll.js";
import { enrollCorsHeaders } from "../server/cors.js";

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
