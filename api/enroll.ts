import type { VercelRequest, VercelResponse } from "@vercel/node";
import { processEnrollment } from "../server/enroll.js";

/**
 * POST /api/enroll — dealer enrolment.
 * Thin HTTP adapter; all logic lives in `server/enroll.ts`.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
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
