/**
 * Posting a call-back request to the site's own /api/callback.
 *
 * One place for what every call-back form sends and how it fails, so the home
 * page's "Leave my number" and the Khata Kavach form cannot drift apart. The
 * two things a person can be told from a script by are added here: the hidden
 * box (anything in it came from a program) and `elapsed`, how long the page
 * has been open (the server drops a post sent under two seconds after load).
 */
export type CallbackPayload = {
  name: string;
  phone: string;
  outlet: string;
  /** Free text for the team. The Khata Kavach form puts the product and the person's role here. */
  message: string;
  /** The hidden box's value; empty for a real person. */
  website: string;
};

/** Resolves when the server accepted it; rejects with the server's own message otherwise. */
export async function postCallback(payload: CallbackPayload): Promise<void> {
  const res = await fetch("/api/callback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, elapsed: Math.round(performance.now()) }),
  });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (!res.ok || !data.ok) {
    throw new Error(data.error || `Callback request failed (${res.status})`);
  }
}
