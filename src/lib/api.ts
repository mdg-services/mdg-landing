/**
 * The few things the /api routes share. They stand in for what Vercel's
 * Node functions did for free before the move to Next, so that each route's
 * answers stay exactly what they were: the same status codes, the same JSON
 * bodies, the same headers.
 */

/** A JSON answer. `charset=utf-8` is on the content type because the old functions sent it. */
export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  });
}

/** The answer to every method a route does not take. */
export function methodNotAllowed(allow: string, headers: Record<string, string> = {}): Response {
  return json({ ok: false, error: "Method not allowed" }, 405, { allow, ...headers });
}

/**
 * The visitor's address as Vercel's edge saw it. Vercel overwrites both headers
 * on the way in, so the caller cannot choose them.
 */
export function clientAddress(req: Request): string | undefined {
  const value = req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for");
  return value?.split(",")[0].trim() || undefined;
}

/** The media type of the request, without parameters, lower-cased ("" if none). */
export function contentType(req: Request): string {
  return (req.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
}

/**
 * JSON text to a value the way Vercel's Node functions did it: an empty body
 * is an empty object (so the form is judged and answered 400), text that is not
 * JSON throws (the route answers 502).
 */
export function parseJson(text: string): unknown {
  return text ? JSON.parse(text) : {};
}

/**
 * The request body the way Vercel's Node functions handed it over as
 * `req.body`: JSON parsed (and a body that is not JSON throws), a url-encoded
 * form as an object, any other text as a string, and nothing at all as
 * undefined.
 */
export async function readBody(req: Request): Promise<unknown> {
  const type = contentType(req);
  if (!type) return undefined;
  switch (type) {
    case "application/json":
      return parseJson(await req.text());
    case "application/x-www-form-urlencoded":
      return Object.fromEntries(new URLSearchParams(await req.text()));
    default:
      return await req.text();
  }
}
