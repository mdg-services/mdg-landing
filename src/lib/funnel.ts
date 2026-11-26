import type { Lang } from "@/i18n/languages";

/**
 * The one link every Kavach Shuruaat call to action uses (ADR 0059 §2).
 *
 * `/app/new-pump` sends a phone to its app store (Android with an install tag that
 * names `source`) and a computer to /new-pump, and records the tap; with the app
 * installed, the same link opens the app instead (Android App Links, iPhone
 * universal links). Keeping every button on this one address is what lets the
 * admin funnel report say which page brought a person in.
 */
export const FUNNEL_PATH = "/app/new-pump";

/**
 * The separate address the funnel link is meant to live on: go.mdgservices.in.
 *
 * Why a second address: iPhones (and Chrome on Android) keep a tap in the
 * browser when the link points to the same site the person is already reading.
 * A button on mdgservices.in that links to mdgservices.in/app/new-pump would
 * therefore never open an installed app; it would send the person to the
 * store, where "Open" starts the app on its usual screen. A link to another
 * address (go.mdgservices.in) crosses sites, so the phone hands it to the app.
 *
 * The same Next app answers on both addresses: on go.mdgservices.in only /app/
 * and /.well-known/ are served, everything else is sent to mdgservices.in
 * (next.config.ts), so search engines never see a second copy of the site.
 */
export const FUNNEL_HOST = "go.mdgservices.in";

/**
 * Where the links point, set at build time with NEXT_PUBLIC_FUNNEL_ORIGIN
 * (`https://go.mdgservices.in`). Unset, the links stay relative (same site):
 * they still count taps and reach the stores, they just cannot open an
 * installed app from our own pages. It is a switch, not a default, because
 * the address must answer (DNS + the domain added to the Vercel project)
 * before any page points at it; until then a link to it would be dead.
 * Only an https origin with no path is taken; anything else is ignored.
 */
function funnelOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_FUNNEL_ORIGIN?.trim() ?? "";
  return /^https:\/\/[a-z0-9.-]+$/i.test(raw) ? raw.toLowerCase() : "";
}

/** `<collection>:<page-id>` or a page name; anything else is dropped rather than sent. */
const SOURCE = /^[a-z0-9:_-]{1,80}$/;

/** Keep a source only if it is the short, safe shape the API and the store tag accept. */
export function cleanSource(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const s = raw.trim().toLowerCase();
  return SOURCE.test(s) ? s : null;
}

/**
 * The funnel link for a page, in that page's language. Relative (so previews
 * and the live site both work) until NEXT_PUBLIC_FUNNEL_ORIGIN names the
 * separate funnel address, then absolute on that address.
 */
export function funnelHref(source: string, lang: Lang): string {
  const q = new URLSearchParams();
  const s = cleanSource(source);
  if (s) q.set("from", s);
  if (lang !== "en") q.set("lang", lang);
  const qs = q.toString();
  const path = qs ? `${FUNNEL_PATH}?${qs}` : FUNNEL_PATH;
  return `${funnelOrigin()}${path}`;
}
