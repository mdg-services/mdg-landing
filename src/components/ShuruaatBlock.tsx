import Icon from "./Icon";
import { NEW_PUMP } from "../data/content";
import { getT } from "../i18n/server";
import { pathFor, type Lang } from "../i18n/lang";
import { docFacts, fill } from "../lib/docText";
import { funnelHref } from "../lib/funnel";

/**
 * Which block, by where it sits (ADR 0059 §6):
 *  - `strip`: one line after the first section of a Petrol pump guide page.
 *  - `box`:   a small box near the end of the MDG guides, the tools and the density pages.
 *  - `line`:  one line near the end of a Khata Kavach page.
 *  - `card`:  a card on home, pricing, about, contact, the Khata Kavach page and the guide hubs.
 */
export type ShuruaatVariant = "strip" | "box" | "line" | "card";

/**
 * "Ask in Kavach Shuruaat", on a page that is about something else.
 *
 * Every link goes through the funnel link (`/app/new-pump?from=<from>`, ADR
 * 0059 §2), so the admin report can say which page sent each person, and
 * carries rel="nofollow": the funnel link is a redirect to an app store, not a
 * page for search engines to follow. The card also links plainly to /new-pump,
 * the page that says what Kavach Shuruaat is; that one is followed.
 *
 * `from` is the page's own source (`pump:<id>`, `mdg:<id>`, `tools:<id>`,
 * `home`…). `ad` labels the block an advertisement, which a block inside a
 * guide page must be: those pages promise that their one sales line says so.
 *
 * A server component with no script and no image, so it is in the HTML from
 * the first paint and moves nothing when the page loads. It draws nothing when
 * Kavach Shuruaat is switched off (NEW_PUMP.enabled).
 */
export default function ShuruaatBlock({
  lang,
  from,
  variant,
  ad = false,
  className = "",
}: {
  lang: Lang;
  from: string;
  variant: ShuruaatVariant;
  ad?: boolean;
  className?: string;
}) {
  if (!NEW_PUMP.enabled) return null;
  const t = getT(lang);
  const w = t.shuruaat;
  const href = funnelHref(from, lang);
  const name = ad ? `${t.newPump.name} (${w.ad})` : t.newPump.name;
  const adLabel = ad ? (
    <span className="guide-label mb-1.5 block font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">{w.ad}</span>
  ) : null;

  switch (variant) {
    case "strip":
      return (
        <aside aria-label={name} className={`rounded-xl border border-ink-hairline bg-paper-warm px-4 py-3.5 sm:px-5 ${className}`}>
          {adLabel}
          <p className="text-[15.5px] leading-[1.6] text-ink-soft">
            {w.strip.text}{" "}
            <a href={href} rel="nofollow" className="guide-link tap-pad font-semibold">
              {w.strip.link}{"\u00a0→"}
            </a>
          </p>
        </aside>
      );

    case "box":
      return (
        <aside aria-label={name} className={`rounded-2xl border border-ink-hairline bg-white p-5 sm:p-6 ${className}`}>
          {adLabel}
          <p className="font-display text-[18px] font-semibold leading-snug text-ink sm:text-[19px]">{w.box.title}</p>
          <p className="mt-2 text-[15.5px] leading-[1.6] text-ink-soft">{fill(w.box.text, docFacts(lang))}</p>
          <p className="mt-3">
            <a href={href} rel="nofollow" className="guide-link tap-pad text-[15.5px] font-semibold">
              {w.box.link}{"\u00a0→"}
            </a>
          </p>
        </aside>
      );

    case "line":
      return (
        <aside aria-label={name} className={className}>
          {adLabel}
          <p className="text-[15.5px] leading-[1.6] text-ink-soft">
            {w.line.text}{" "}
            <a href={href} rel="nofollow" className="guide-link tap-pad font-semibold">
              {w.line.link}{"\u00a0→"}
            </a>
          </p>
        </aside>
      );

    case "card":
      return (
        <aside aria-label={name} className={`rounded-3xl border border-ink-hairline bg-white p-6 shadow-card sm:p-8 ${className}`}>
          <div className="flex items-start gap-4">
            <span aria-hidden className="hidden h-12 w-12 shrink-0 place-items-center rounded-xl bg-navy-700 text-gold-300 sm:grid">
              <Icon name="pump" size={26} />
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">
                {ad ? `${w.ad} · ` : ""}
                {w.card.kicker}
              </p>
              <p className="mt-1.5 text-balance font-display text-[22px] font-semibold leading-tight text-ink md:text-[26px]">{w.card.title}</p>
              <p className="mt-2 max-w-[42rem] text-[16px] leading-[1.6] text-ink-soft md:text-[17px]">{fill(w.card.text, docFacts(lang))}</p>
              <div className="mt-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
                <a href={href} rel="nofollow" className="btn-primary">
                  {w.card.link} <Icon name="arrow" size={18} />
                </a>
                <a href={pathFor(lang, "/new-pump")} className="link-quiet tap-pad text-[15.5px] font-semibold text-navy-700">
                  {w.card.more}
                </a>
              </div>
            </div>
          </div>
        </aside>
      );
  }
}
