import { processGrievance } from "../../../server/grievance.ts";
import { clientAddress, contentType, json, methodNotAllowed, parseJson } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The API hand-off waits up to 6 s, then two emails can each wait on the mail
 * server: more than a host's default time for one function.
 */
export const maxDuration = 30;

/**
 * POST /api/grievance — the grievance form at /grievance.
 * Thin HTTP adapter; logic lives in `server/grievance.ts`.
 *
 * Same site only: no CORS headers, so a browser on another origin cannot read
 * the answer, and nothing but JSON is accepted (see below).
 */
export async function POST(req: Request): Promise<Response> {
  // The page sends JSON. A plain HTML form on another site can post
  // url-encoded or text without asking the browser first; JSON from another
  // site needs a preflight this endpoint never answers. So anything but JSON
  // is somebody else's page or a script.
  if (contentType(req) !== "application/json") {
    return json({ ok: false, error: "Send the request as JSON." }, 415);
  }

  try {
    const result = await processGrievance(parseJson(await req.text()), {
      submittedAt: new Date().toISOString(),
      ip: clientAddress(req),
    });
    return json(result.ok ? { ok: true, ref: result.ref, emailed: result.emailed } : result, result.status);
  } catch (err) {
    console.error("[api/grievance] failed:", err);
    return json(
      { ok: false, error: "We couldn't send your grievance just now. Please try again, or call us." },
      502,
    );
  }
}

const refuse = () => methodNotAllowed("POST");
export { refuse as GET, refuse as HEAD, refuse as PUT, refuse as PATCH, refuse as DELETE, refuse as OPTIONS };
