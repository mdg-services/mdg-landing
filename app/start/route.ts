import { BRAND } from "@/data/content";

export const dynamic = "force-dynamic";

/**
 * GET /start — "Start services", the sign-up button on our WhatsApp film invites
 * and on the film pages; and, with `?for=new-pump`, the "Start on Android" link
 * of New Pump Guide (/new-pump, ADR 0058).
 *
 * It never opens a form of ours. A dealer on an iPhone goes to the Dealer Kavach
 * app on the App Store, one on an Android phone to Google Play, and they register
 * inside the app and are signed in at once. Anyone else (a computer, or an iPad
 * that hides itself as one) goes to /register, which is now a page that shows
 * both store buttons and nothing to fill in. Whatever the link carried (`?lang=hi`
 * from the Hindi invite, say) goes on to /register, whose own language rules then
 * pick the page (proxy.ts). Nothing about the visitor is stored here.
 *
 * `for=new-pump` changes two things: the Play Store link is tagged
 * `utm_campaign=new_pump`, so Google Play's install figures show New Pump Guide's
 * installs apart from the dealers'; and a computer goes back to /new-pump (which
 * has the store buttons and says what to choose in the app) instead of /register.
 * The App Store has no install tag to carry, so an iPhone is sent as before.
 */
export function GET(req: Request): Response {
  const url = new URL(req.url);
  const agent = req.headers.get("user-agent") ?? "";
  const newPump = url.searchParams.get("for") === "new-pump";
  const target = /android/i.test(agent)
    ? playStoreLink(newPump)
    : /iphone|ipad|ipod/i.test(agent)
      ? BRAND.appStore
      : newPump
        ? new URL(`/new-pump${queryWithout(url, "for")}`, url).toString()
        : new URL(`/register${url.search}`, url).toString();
  return new Response(null, {
    status: 302,
    // A phone and a computer get different answers from the same address, so no
    // cache in between may keep one answer for everybody.
    headers: { location: target, "cache-control": "private, no-store", vary: "User-Agent" },
  });
}

/** The Play Store page, tagged so Google Play's own install figures show where the install came from. */
function playStoreLink(newPump: boolean): string {
  const link = new URL(BRAND.playStore);
  link.searchParams.set(
    "referrer",
    newPump
      ? "utm_source=website&utm_medium=start_link&utm_campaign=new_pump&utm_content=for-new-pump"
      : "utm_source=whatsapp&utm_medium=invite&utm_campaign=start_services",
  );
  return link.toString();
}

/** The link's own query, minus one key ("?lang=hi&for=new-pump" -> "?lang=hi"), so the page it lands on is not told twice. */
function queryWithout(url: URL, key: string): string {
  const rest = new URLSearchParams(url.search);
  rest.delete(key);
  const q = rest.toString();
  return q ? `?${q}` : "";
}
