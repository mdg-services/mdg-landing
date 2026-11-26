/**
 * Where a tap on a Kavach Shuruaat link goes, and what is counted (ADR 0059 §2).
 *
 * Two addresses share this: the funnel link every Kavach Shuruaat button on the
 * site uses (`/app/new-pump?from=<source>&lang=<lang>`), and the older
 * `/start?for=new-pump` that film pages and earlier links still carry. Keeping
 * one piece of logic is what makes both send a phone to the same store page with
 * the same install tag, so the admin report counts them the same way.
 *
 *  - An Android phone goes to Google Play, with an install tag that names the
 *    page the person came from. The phone app reads that tag on its first
 *    launch and opens straight on the Kavach Shuruaat sign-up.
 *  - An iPhone or iPad goes to the App Store. Apple carries no install tag
 *    without a provider token, so nothing is added.
 *  - Anything else (a computer) goes to /new-pump in the page's language, which
 *    shows the store buttons and explains what to choose in the app. A `store`
 *    hint (`play` or `app`) sends a computer to that store instead: the site
 *    assistant shows both store buttons, and a computer that pressed "Google
 *    Play" expects to see Google Play.
 *
 * The tap that is counted is three short words (`source`, `device`, `lang`):
 * no address, no cookie, nothing about the person. Search engines and link
 * previews are redirected like anyone else but never counted, so the report
 * shows people, not crawlers.
 *
 * Pure: no Next.js, no network. The route files call it, and the checks in
 * scripts/funnel.check.ts call it directly.
 */
import { APP_STORE, PLAY_STORE } from "../lib/appStores.ts";
import { cleanSource, FUNNEL_HOST } from "../lib/funnel.ts";
import { DEFAULT_LANG, isLang, type Lang } from "../i18n/languages.ts";

/** The main site, where /new-pump lives (src/seo/site.ts SITE; not imported, that module pulls in the page text). */
const SITE_ORIGIN = "https://mdgservices.in";

export type FunnelDevice = "android" | "ios" | "other";

/** What the API is told about one tap: exactly these three fields. */
export interface FunnelTap {
  source: string | null;
  device: FunnelDevice;
  lang: Lang;
}

export interface FunnelAnswer {
  /** Absolute address to redirect to. */
  location: string;
  /** The tap to record, or null when it must not be counted (a crawler, a preview, a HEAD). */
  tap: FunnelTap | null;
}

/** Which phone the user agent says it is. An iPad that hides itself as a Mac counts as a computer. */
export function deviceOf(agent: string): FunnelDevice {
  if (/android/i.test(agent)) return "android";
  if (/iphone|ipad|ipod/i.test(agent)) return "ios";
  return "other";
}

/**
 * A browser loading the link ahead of a tap (Next.js link prefetch, Chrome's speculative
 * prefetch or prerender) is not a person pressing the button. Seen on the first night: eight
 * "taps" across five pages within seconds, from pages whose links were still same-site.
 */
export function isPrefetch(headers: Headers): boolean {
  const purpose = `${headers.get("sec-purpose") ?? ""} ${headers.get("purpose") ?? ""}`.toLowerCase();
  return (
    purpose.includes("prefetch") ||
    purpose.includes("prerender") ||
    headers.get("next-router-prefetch") !== null ||
    headers.get("rsc") !== null ||
    headers.get("x-middleware-prefetch") !== null
  );
}

/**
 * True for a visitor that is a program, not a person: search engines, link
 * previews (WhatsApp, Facebook, Slack and the like fetch a link to draw its
 * card), and a request with no user agent at all, which no browser sends.
 * "Cubot" is a phone maker whose model names end in "bot", so it is let through.
 */
export function isBot(agent: string): boolean {
  if (!agent.trim()) return true;
  if (/cubot/i.test(agent)) return false;
  return /bot|crawl|spider|slurp|preview|facebookexternalhit|^whatsapp\//i.test(agent);
}

/**
 * `pump:dealership-documents` -> `pump`, `home` -> `home`: the store tag's
 * medium is the collection or the page, so Google Play's own figures can group
 * installs by where they came from without knowing every page.
 */
export function mediumOf(source: string): string {
  return source.split(":")[0] || source;
}

/**
 * The Play Store page with Kavach Shuruaat's install tag. `URLSearchParams`
 * encodes the tag exactly once, which is what Google Play expects: the app
 * then reads `utm_content` back as the source. With no source the tag still
 * says `new_pump`, so the app still opens on Kavach Shuruaat, and the medium
 * says which link it was.
 */
export function newPumpPlayLink(source: string | null, fallbackMedium: string): string {
  // Every part is a fixed word or a source already held to [a-z0-9:_-], so the tag is written
  // raw here and encoded once, as a whole, by searchParams.set().
  const medium = source ? mediumOf(source) : fallbackMedium;
  const tag = `utm_source=website&utm_medium=${medium}&utm_campaign=new_pump${source ? `&utm_content=${source}` : ""}`;
  const link = new URL(PLAY_STORE);
  link.searchParams.set("referrer", tag);
  return link.toString();
}

/**
 * The source a guide page reports: `<collection>:<page-id>`, and `tools:<name>`
 * for a tool page (`tools-litres-to-kg` -> `tools:litres-to-kg`), the names the
 * admin report turns back into page titles.
 */
export function guideSource(collection: string, id: string, type: string): string {
  if (type === "Tool") return `tools:${id.replace(/^tools-/, "")}`;
  return `${collection}:${id}`;
}

/** The language the link asked for, if it is one the site speaks. */
function askedLang(url: URL): Lang | null {
  const raw = url.searchParams.get("lang");
  return isLang(raw) ? raw : null;
}

/**
 * Where a request for a Kavach Shuruaat link goes, and the tap to record.
 * `fallbackMedium` names the link in the store tag when it carries no source
 * (`funnel_link` for /app/new-pump, `start_link` for /start?for=new-pump).
 */
export function funnelAnswer(req: Request, opts: { fallbackMedium: string }): FunnelAnswer {
  const url = new URL(req.url);
  const agent = req.headers.get("user-agent") ?? "";
  const source = cleanSource(url.searchParams.get("from"));
  const asked = askedLang(url);
  const lang = asked ?? DEFAULT_LANG;
  const device = deviceOf(agent);
  const store = url.searchParams.get("store");

  let location: string;
  if (device === "android" || (device === "other" && store === "play")) {
    location = newPumpPlayLink(source, opts.fallbackMedium);
  } else if (device === "ios" || (device === "other" && store === "app")) {
    location = APP_STORE;
  } else {
    // The page's own language rules (proxy.ts) take `?lang=` from here, and remember the choice.
    // On the separate funnel address the page lives on the main site, so go there in one hop.
    // The address the person typed is in the Host header; behind `next start` the request URL
    // itself can name the local server instead.
    const host = (req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? url.host).split(",")[0].trim().split(":")[0].toLowerCase();
    const home = host === FUNNEL_HOST || url.hostname === FUNNEL_HOST ? SITE_ORIGIN : url.origin;
    location = new URL(`/new-pump${asked ? `?lang=${asked}` : ""}`, home).toString();
  }

  const counted = req.method !== "HEAD" && !isBot(agent) && !isPrefetch(req.headers);
  return { location, tap: counted ? { source, device, lang } : null };
}

/** The redirect itself. A phone and a computer get different answers from one address, so no cache may keep one for everybody. */
export function funnelRedirect(location: string): Response {
  return new Response(null, {
    status: 302,
    headers: { location, "cache-control": "private, no-store", vary: "User-Agent" },
  });
}
