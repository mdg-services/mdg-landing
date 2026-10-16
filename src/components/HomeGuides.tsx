import SectionHeader from "./SectionHeader";
import { getT } from "../i18n/server";
import type { Lang } from "../i18n/lang";
import { PAGES, PILLARS, pathOf } from "../../guide/inventory";
import { TOPIC_BLURB } from "../../guide/copy";
import { contextAt, descriptionOf, isLive, titleOf } from "../guides/model";
import { guideNow } from "../guides/clock";

/** How many guide cards the homepage shows. */
const SHOWN = 6;

/**
 * "Guides for dealers" on the homepage: up to six guide pages that are live
 * today in this language, each topic's main page first. The homepage is the
 * site's strongest page, so a link from it is how a new guide gets found and
 * weighed by search engines. The list grows by itself as pages go live (the
 * homepage re-renders hourly).
 */
export default function HomeGuides({ lang }: { lang: Lang }) {
  const t = getT(lang).guides;
  const ctx = contextAt(guideNow());
  const mains = new Set(Object.values(PILLARS).map((p) => p.main));
  const candidates = PAGES.filter((p) => p.pillar !== "hub" && p.pillar !== "tools" && isLive(ctx, p.id, lang));
  const picked = [...candidates.filter((p) => mains.has(p.id)), ...candidates.filter((p) => !mains.has(p.id))].slice(0, SHOWN);
  if (!picked.length) return null;
  const hubHref = lang === "hi" ? "/hi/guides/" : "/guides/";

  return (
    <section aria-label={t.sectionAria} className="bg-paper">
      <div className="wrap-full py-24 md:py-32">
        <SectionHeader eyebrow={t.eyebrow} title={t.title} intro={t.intro} />
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {picked.map((p) => {
            const blurb = mains.has(p.id) ? TOPIC_BLURB[p.pillar]?.[lang] : undefined;
            return (
              <div key={p.id} className="guide-card group relative">
                <strong className="block font-display text-[17px] font-semibold leading-snug text-ink group-hover:text-navy-700">
                  <a href={pathOf(p, lang)} className="guide-card-link">
                    {titleOf(ctx, p.id, lang)}
                  </a>
                </strong>
                <span className="mt-2 block text-[14.5px] leading-[1.55] text-ink-soft">
                  {blurb || descriptionOf(ctx, p.id, lang)}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-8">
          <a href={hubHref} className="link-quiet text-[16px] font-semibold text-navy-700">
            {t.all} →
          </a>
        </p>
      </div>
    </section>
  );
}
