import { env } from "./env.js";

/** The API's address is a local one: the only place a secret may travel unencrypted. */
function isLocalHost(host: string): boolean {
  return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
}

/**
 * The API answered, and the answer was no. `status` is the HTTP status, so a
 * caller can tell "too many just now" (429) from a fault. The message says
 * which path and what the API called the problem, and never carries the
 * secret or the visitor's details, so it is safe to log.
 */
export class IntakeRefused extends Error {
  readonly status: number;

  constructor(path: string, status: number, code: string) {
    super(`MDG API refused ${path}: ${status} ${code}`.trim());
    this.name = "IntakeRefused";
    this.status = status;
  }
}

/**
 * Hand one submitted form to the MDG API, so the admin panel can list it.
 *
 * The website's server is the only caller the API will accept: it proves who
 * it is with a shared secret, which never reaches the visitor's browser. The
 * visitor's browser talks to this site only; this call is server to server.
 *
 * Returns what the API answered in `data`. Throws on a refusal, a timeout or
 * anything that is not a 2xx: an {@link IntakeRefused} when the API answered,
 * and the error says what happened without carrying the secret or the
 * visitor's details, so it is safe to log.
 *
 * With no secret set, a real deployment throws: a grievance that cannot reach
 * the admin panel must not look sent. On a developer's machine it logs a line
 * and returns `standIn`, the way the mailer logs instead of sending when it
 * has no credentials, so the form can be tried without a backend.
 */
export async function postIntake<T>(
  path: string,
  body: unknown,
  opts: { timeoutMs: number; standIn: T }
): Promise<T> {
  if (!env.intakeSecret) {
    if (env.isProd) {
      throw new Error("Intake secret missing — set WEBSITE_INTAKE_SECRET.");
    }
    console.info(`\n[intake:dev] (no secret — not actually sent)\n  POST ${path}\n`);
    return opts.standIn;
  }

  const url = new URL(env.mdgApiUrl + path);
  if (url.protocol !== "https:" && !isLocalHost(url.hostname)) {
    throw new Error("MDG_API_URL must be https — refusing to send the secret in the clear.");
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.intakeSecret}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(opts.timeoutMs),
    // A redirect would turn the POST into a GET somewhere nobody chose. A
    // wrong address should fail loudly, not quietly lose the submission.
    redirect: "error",
  });

  const answer = (await res.json().catch(() => null)) as {
    ok?: boolean;
    data?: T;
    error?: { code?: string };
  } | null;

  if (!res.ok || !answer?.ok || answer.data === undefined) {
    throw new IntakeRefused(path, res.status, answer?.error?.code ?? "");
  }
  return answer.data;
}
