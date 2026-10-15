import Icon from "./Icon";
import { getT } from "../i18n/server";
import type { Lang } from "../i18n/lang";
import { Reveal, item, reveal } from "../lib/reveal";
import { BRAND } from "../data/content";

export default function Mission({ lang }: { lang: Lang }) {
  const t = getT(lang);

  return (
    <section aria-label={t.mission.sectionAria} className="relative overflow-hidden bg-navy-950 text-white">
      <div aria-hidden className="absolute inset-0 bg-grid-dark opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/3 h-[30rem] w-[30rem] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(74,78,180,.3), transparent 60%)" }}
      />

      <div className="wrap-full relative py-24 md:py-32">
        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          {/* left: mission */}
          <div className="md:col-span-5">
            <Reveal>
              <p className="eyebrow-light">{t.mission.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-6 text-display text-white" style={{ fontSize: "clamp(30px, 4.4vw, 56px)" }}>
                {t.mission.headingLead}{" "}
                <span className="text-gold-400">{t.mission.headingAccent}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-7 max-w-prose2 text-[16px] leading-[1.65] text-navy-100">
                {/* The founding year is data, so the sentence is stored in two
                    halves and the split point can move with the language. */}
                {t.mission.bodyBeforeYear}{" "}
                {BRAND.since}
                {t.mission.bodyAfterYear}
              </p>
            </Reveal>

            {/* 4 E's */}
            <div className="mt-9 flex flex-wrap gap-2.5">
              {t.mission.fourE.map((e, i) => (
                <span
                  key={e}
                  {...item(i, 0.08, 0.2)}
                  className="rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-2 font-display text-[14px] font-semibold tracking-tight text-gold-300"
                >
                  {e}
                </span>
              ))}
            </div>
          </div>

          {/* right: the seven values as a node spine */}
          <div className="md:col-span-6 md:col-start-7">
            <div className="relative">
              {/* connecting line */}
              <span
                aria-hidden
                className="absolute left-[11px] top-2 w-px bg-white/15"
                {...reveal("line-y", { height: "calc(100% - 1rem)" })}
              />
              {t.mission.values.map((v, i) => (
                <div key={v} {...item(i, 0.07)} className="relative flex items-center gap-5 py-3.5">
                  <span className="relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-gold-400/50 bg-navy-900">
                    <span className="h-2 w-2 rotate-45 bg-gold-400" />
                  </span>
                  <span className="font-display text-[18px] font-medium text-white md:text-[21px]">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* quote strip */}
        <Reveal delay={0.1}>
          <div className="mt-16 flex items-start gap-5 border-t border-white/10 pt-8 md:mt-20">
            <Icon name="spark" size={28} className="mt-1 shrink-0 text-gold-400" />
            <p className="font-display text-[20px] font-medium italic leading-snug text-white md:text-[26px]">
              {t.mission.quote}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
