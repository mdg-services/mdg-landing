import { getT } from "../../i18n/server";
import type { Lang } from "../../i18n/lang";
import { KK, contextAt, descriptionOf, isLive, pathOf, titleOf } from "../../guides/model";
import { guideNow } from "../../guides/clock";

/** How many guide cards the page shows. */
const SHOWN = 6;

/**
 * "Selling on credit, in plain words" on /khata-kavach: up to six Khata Kavach
 * guide pages that are live today in this language, each topic's main page
 * first, and a link to all of them. The product page is where the guides get
 * found and weighed from, and the list grows by itself as pages go live (the
 * page re-renders hourly). Nothing shows until a page is live.
 */
export default function KkGuides({ lang }: { lang: Lang }) {
  const t = getT(lang).kk.guides;
  // The product page must never fail because of the guides: with no readable
  // guide words (a local build without them), the section is simply left out.
  let ctx: ReturnType<typeof contextAt>;
  try {
    ctx = contextAt(KK, guideNow());
  } catch {
    return null;
  }
  const mains = new Set(Object.values(KK.pillars).map((p) => p.main));
  const candidates = KK.pages.filter((p) => !KK.notTopics.includes(p.pillar) && isLive(ctx, p.id, lang));
  const picked = [...candidates.filter((p) => mains.has(p.id)), ...candidates.filter((p) => !mains.has(p.id))].slice(0, SHOWN);
  const hub = KK.byId.get("hub")!;
  if (!picked.length || !isLive(ctx, "hub", lang)) return null;

  return (
    <section aria-label={t.sectionAria} className="kk-guide bg-kk-cream text-kk-ink">
      <div className="wrap-full py-24 md:py-32">
        <h2 className="max-w-[22ch] text-balance font-bold" style={{ fontSize: "clamp(30px, 3.6vw, 46px)", lineHeight: 1.12, letterSpacing: "-0.03em" }}>
          {t.heading}
        </h2>
        <p className="mt-5 max-w-[60ch] text-[18px] leading-[1.6] text-kk-soft">{t.intro}</p>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {picked.map((p) => {
            const blurb = mains.has(p.id) ? KK.topicBlurb[p.pillar]?.[lang] : undefined;
            return (
              <div key={p.id} className="guide-card group relative">
                <strong className="block font-display text-[17px] font-semibold leading-snug text-kk-ink group-hover:text-kk-siyahi">
                  <a href={pathOf(p, lang)} className="guide-card-link">
                    {titleOf(ctx, p.id, lang)}
                  </a>
                </strong>
                <span className="mt-2 block text-[14.5px] leading-[1.55] text-kk-soft">{blurb || descriptionOf(ctx, p.id, lang)}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-8">
          <a href={pathOf(hub, lang)} className="kk-link text-kk-siyahi">
            {t.all} →
          </a>
        </p>
      </div>
    </section>
  );
}
