import Counter from "./Counter";
import { getT } from "../i18n/server";
import type { Lang } from "../i18n/lang";
import { Reveal, item } from "../lib/reveal";
import { STATS } from "../data/content";

export default function Numbers({ lang }: { lang: Lang }) {
  const t = getT(lang);

  return (
    <section aria-label={t.numbers.ariaLabel} className="border-b border-ink-hairline bg-paper-warm">
      <div className="wrap-full py-20 md:py-24">
        <div className="grid items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <Reveal>
              <p className="eyebrow">{t.numbers.eyebrow}</p>
              <h2 className="mt-5 text-display text-[26px] leading-[1.06] md:text-[34px]">
                {t.numbers.headingLine1} <br />
                {t.numbers.headingLine2}
              </h2>
            </Reveal>
          </div>

          <div className="md:col-span-9 grid grid-cols-2 gap-x-8 gap-y-10 sm:gap-x-10 md:grid-cols-4">
            {STATS.map((s, i) => {
              /* The figure comes from content.ts, the words from the dictionary,
                 zipped by id so neither list has to stay in the other's order. */
              const c = t.numbers.stats[s.id];
              return (
                <div key={s.id} {...item(i)} className="border-t border-navy-200 pt-5">
                  <div className="num font-semibold text-ink" style={{ fontSize: "clamp(40px, 5.6vw, 68px)", lineHeight: 0.96 }}>
                    <Counter to={s.value} />
                  </div>
                  <div className="mt-4 text-[15px] font-semibold text-ink">
                    {c.label}
                    {c.hi && <span className="ml-2 deva text-[15px] font-normal text-navy-700">{c.hi}</span>}
                  </div>
                  <p className="mt-1.5 text-[13px] leading-[1.5] text-ink-muted">{c.note}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
