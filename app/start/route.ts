import { BRAND } from "@/data/content";

export const dynamic = "force-dynamic";

/**
 * GET /start — "Start services", the sign-up button on our WhatsApp film invites.
 *
 * A dealer who taps it on an Android phone goes straight to the Dealer Kavach app
 * on Google Play: they register inside the app and are signed in at once, with no
 * website form and no second sign-in. Everyone else — an iPhone, while the app is
 * not on the App Store, and a computer — goes to the website's Register your pump
 * page, which opens the same account.
 *
 * The invites sent before this link existed point at /register itself, which
 * keeps working exactly as before. Whatever the link carried (`?lang=hi` from the
 * Hindi invite, say) goes on to /register, whose own language rules then pick the
 * page (proxy.ts). Nothing about the visitor is stored here.
 */
export function GET(req: Request): Response {
  const url = new URL(req.url);
  const agent = req.headers.get("user-agent") ?? "";
  const target = /android/i.test(agent) ? playStoreLink() : new URL(`/register${url.search}`, url).toString();
  return new Response(null, {
    status: 302,
    // A phone and a computer get different answers from the same address, so no
    // cache in between may keep one answer for everybody.
    headers: { location: target, "cache-control": "private, no-store", vary: "User-Agent" },
  });
}

/** The Play Store page, tagged so Google Play's own install figures show where the install came from. */
function playStoreLink(): string {
  const link = new URL(BRAND.playStore);
  link.searchParams.set("referrer", "utm_source=whatsapp&utm_medium=invite&utm_campaign=start_services");
  return link.toString();
}
