import { processEnrollment } from "../../../server/enroll.ts";
import { enrollCorsHeaders } from "../../../server/cors.ts";
import { clientAddress, json, methodNotAllowed, readBody } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The API hand-off waits up to 4 s, then two emails can each wait on the mail
 * server: more than a host's default time for one function.
 */
export const maxDuration = 30;

/**
 * POST /api/enroll — dealer enrolment.
 * Thin HTTP adapter; all logic lives in `server/enroll.ts`.
 *
 * The website posts here from its own origin. The Dealer Kavach app's sign-up
 * screen posts the same form from the client web app's origin, so the
 * allow-listed origins get CORS headers and a preflight answer.
 */
function corsFor(req: Request): Record<string, string> {
  return { vary: "Origin", ...(enrollCorsHeaders(req.headers.get("origin") ?? undefined) ?? {}) };
}

export async function POST(req: Request): Promise<Response> {
  const headers = corsFor(req);
  try {
    const result = await processEnrollment(await readBody(req), {
      submittedAt: new Date().toISOString(),
      ip: clientAddress(req),
    });
    // `status` is present on both branches, so no narrowing is required. A saved
    // registration says where the dealer stands, so the form (the website's or the
    // app's) can say "your account is ready, sign in" instead of "wait for us".
    return json(result.ok ? { ok: true, account: result.account } : result, result.status, headers);
  } catch (err) {
    console.error("[api/enroll] failed:", err);
    return json(
      { ok: false, error: "We couldn't send your enrolment just now. Please try again, or call us." },
      502,
      headers,
    );
  }
}

/** The preflight: 204 with the CORS headers for an allow-listed origin, 403 for anyone else. */
export async function OPTIONS(req: Request): Promise<Response> {
  const headers = corsFor(req);
  return new Response(null, { status: headers["Access-Control-Allow-Origin"] ? 204 : 403, headers });
}

const refuse = (req: Request) => methodNotAllowed("POST, OPTIONS", corsFor(req));
export { refuse as GET, refuse as HEAD, refuse as PUT, refuse as PATCH, refuse as DELETE };
