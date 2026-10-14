import type { VercelRequest, VercelResponse } from "@vercel/node";
import { processGrievance } from "../server/grievance.js";

/**
 * The API hand-off waits up to 6 s, then two emails can each wait on the mail
 * server: more than a host's default time for one function.
 */
export const config = { maxDuration: 30 };

/**
 * POST /api/grievance — the grievance form at /grievance.
 * Thin HTTP adapter; logic lives in `server/grievance.ts`.
 *
 * Same site only: no CORS headers, so a browser on another origin cannot read
 * the answer, and nothing but JSON is accepted (see below).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  // The page sends JSON. A plain HTML form on another site can post
  // url-encoded or text without asking the browser first, and Vercel would
  // parse it; JSON from another site needs a preflight this endpoint never
  // answers. So anything but JSON is somebody else's page or a script.
  const type = String(req.headers["content-type"] ?? "").split(";")[0].trim().toLowerCase();
  if (type !== "application/json") {
    return res.status(415).json({ ok: false, error: "Send the request as JSON." });
  }

  try {
    const result = await processGrievance(req.body, {
      submittedAt: new Date().toISOString(),
      ip: clientAddress(req),
    });
    return res
      .status(result.status)
      .json(result.ok ? { ok: true, ref: result.ref, emailed: result.emailed } : result);
  } catch (err) {
    console.error("[api/grievance] failed:", err);
    return res.status(502).json({
      ok: false,
      error: "We couldn't send your grievance just now. Please try again, or call us.",
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
