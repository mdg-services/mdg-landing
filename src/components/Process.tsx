import Icon from "./Icon";
import SectionHeader from "./SectionHeader";
import { getT } from "../i18n/server";
import type { Lang } from "../i18n/lang";
import { item, reveal } from "../lib/reveal";
import { STEPS } from "../data/content";

export default function Process({ lang }: { lang: Lang }) {
  const t = getT(lang);

  return (
    <section id="process" className="bg-paper-warm">
      <div className="wrap-full py-24 md:py-32">
        <SectionHeader
          eyebrow={t.process.eyebrow}
          title={
            <>
              {t.process.headingLead}{" "}
              <span className="text-navy-700">{t.process.headingAccent}</span>
            </>
          }
          intro={t.process.intro}
        />

        <div className="relative mt-16 md:mt-20">
          {/* horizontal connecting line (desktop) */}
          <span
            aria-hidden
            className="absolute left-0 right-0 top-[27px] hidden h-px bg-gradient-to-r from-navy-300 via-navy-400 to-gold-400 md:block"
            {...reveal("line-x")}
          />

          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((s, i) => {
              /* zipped by id, never by position */
              const copy = t.process.steps[s.id];
              return (
                <div key={s.no} {...item(i, 0.14)} className="relative">
                  {/* node */}
                  <div className="flex items-center gap-4 md:block">
                    <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-ink-hairline bg-white text-navy-700 shadow-card">
                      <Icon name={s.icon} size={26} />
                    </span>
                    <div className="mt-0 md:mt-6">
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold-600">{copy.when}</span>
                      <div className="mt-1 flex items-baseline gap-3">
                        <span className="num-deva text-[26px] leading-none text-navy-200">{s.noDeva}</span>
                        <h3 className="font-display text-[20px] font-semibold leading-tight text-ink md:text-[23px]">
                          {copy.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 max-w-sm text-[15px] leading-[1.6] text-ink-soft md:pr-6">{copy.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
