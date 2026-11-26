import { BRAND } from "@/data/content";
import { funnelAnswer, funnelRedirect } from "../../src/routing/funnel.ts";
import { recordTapAfter } from "../../server/funnelAfter.ts";

export const dynamic = "force-dynamic";

/**
 * GET /start — "Start services", the sign-up button on our WhatsApp film invites
 * and on the film pages; and, with `?for=new-pump`, the older link to Kavach
 * Shuruaat (ADR 0058).
 *
 * It never opens a form of ours. A dealer on an iPhone goes to the Dealer Kavach
 * app on the App Store, one on an Android phone to Google Play, and they register
 * inside the app and are signed in at once. Anyone else (a computer, or an iPad
 * that hides itself as one) goes to /register, which is now a page that shows
 * both store buttons and nothing to fill in. Whatever the link carried (`?lang=hi`
 * from the Hindi invite, say) goes on to /register, whose own language rules then
 * pick the page (proxy.ts). Nothing about the visitor is stored here.
 *
 * `for=new-pump` is answered by the same code as the funnel link
 * /app/new-pump (src/routing/funnel.ts, ADR 0059 §2): the Play Store link is
 * tagged `utm_campaign=new_pump` and, when the link carries `from=<source>`,
 * names that source; a computer goes back to /new-pump; and the tap is counted
 * like any other Kavach Shuruaat tap.
 */
export function GET(req: Request): Response {
  const url = new URL(req.url);
  if (url.searchParams.get("for") === "new-pump") {
    const { location, tap } = funnelAnswer(req, { fallbackMedium: "start_link" });
    if (tap) recordTapAfter(tap);
    return funnelRedirect(location);
  }
  const agent = req.headers.get("user-agent") ?? "";
  const target = /android/i.test(agent)
    ? playStoreLink()
    : /iphone|ipad|ipod/i.test(agent)
      ? BRAND.appStore
      : new URL(`/register${url.search}`, url).toString();
  return funnelRedirect(target);
}

/** The Play Store page, tagged so Google Play's own install figures show the install came from an invite. */
function playStoreLink(): string {
  const link = new URL(BRAND.playStore);
  link.searchParams.set("referrer", "utm_source=whatsapp&utm_medium=invite&utm_campaign=start_services");
  return link.toString();
}
