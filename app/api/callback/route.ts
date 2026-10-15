import { processCallback } from "../../../server/callback.ts";
import { clientAddress, contentType, json, methodNotAllowed, parseJson } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * POST /api/callback — the call-back request from the homepage, the film pages
 * and the assistant's fallback.
 * Thin HTTP adapter; logic lives in `server/callback.ts`.
 */
export async function POST(req: Request): Promise<Response> {
  // Every form here sends JSON. A plain HTML form on another site can post
  // url-encoded or text without asking the browser first; JSON from another
  // site needs a preflight this endpoint never answers. So anything but JSON
  // is somebody else's page or a script.
  if (contentType(req) !== "application/json") {
    return json({ ok: false, error: "Send the request as JSON." }, 415);
  }

  try {
    const result = await processCallback(parseJson(await req.text()), {
      submittedAt: new Date().toISOString(),
      ip: clientAddress(req),
    });
    return json(result.ok ? { ok: true } : result, result.status);
  } catch (err) {
    console.error("[api/callback] failed:", err);
    return json(
      { ok: false, error: "We couldn't send your request just now. Please try again, or call us." },
      502,
    );
  }
}

// Same site only, nothing else: every other method is turned away the same way,
// OPTIONS included (no CORS headers, so a browser on another origin cannot read the answer).
const refuse = () => methodNotAllowed("POST");
export { refuse as GET, refuse as HEAD, refuse as PUT, refuse as PATCH, refuse as DELETE, refuse as OPTIONS };
