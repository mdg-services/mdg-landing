import { BRAND } from "@/data/content";

export const dynamic = "force-dynamic";

/**
 * GET /start — "Start services", the sign-up button on our WhatsApp film invites
 * and on the film pages.
 *
 * It never opens a form of ours. A dealer on an iPhone goes to the Dealer Kavach
 * app on the App Store, one on an Android phone to Google Play, and they register
 * inside the app and are signed in at once. Anyone else (a computer, or an iPad
 * that hides itself as one) goes to /register, which is now a page that shows
 * both store buttons and nothing to fill in. Whatever the link carried (`?lang=hi`
 * from the Hindi invite, say) goes on to /register, whose own language rules then
 * pick the page (proxy.ts). Nothing about the visitor is stored here.
 */
export function GET(req: Request): Response {
  const url = new URL(req.url);
  const agent = req.headers.get("user-agent") ?? "";
  const target = /android/i.test(agent)
    ? playStoreLink()
    : /iphone|ipad|ipod/i.test(agent)
      ? BRAND.appStore
      : new URL(`/register${url.search}`, url).toString();
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
