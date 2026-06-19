import type { VercelRequest, VercelResponse } from "@vercel/node";
import { processCallback } from "../server/callback.js";

/**
 * POST /api/callback — homepage "Leave my number" callback request.
 * Thin HTTP adapter; logic lives in `server/callback.ts`.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const result = await processCallback(req.body, {
      submittedAt: new Date().toISOString(),
    });
    return res.status(result.status).json(result.ok ? { ok: true } : result);
  } catch (err) {
    console.error("[api/callback] failed:", err);
    return res.status(502).json({
      ok: false,
      error: "We couldn't send your request just now. Please try again, or call us.",
    });
  }
}
