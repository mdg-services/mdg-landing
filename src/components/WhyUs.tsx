import Icon from "./Icon";
import SectionHeader from "./SectionHeader";
import { item } from "../lib/reveal";
import { PILLARS } from "../data/content";
import { getT } from "../i18n/server";
import type { Lang } from "../i18n/lang";

export default function WhyUs({ lang }: { lang: Lang }) {
  const t = getT(lang);

  return (
    <section id="why" className="bg-white">
      <div className="wrap-full py-24 md:py-32">
        <SectionHeader
          eyebrow={t.why.eyebrow}
          title={
            <>
              {t.why.headingLead}{" "}
              <span className="text-navy-700">{t.why.headingAccent}</span>
            </>
          }
          intro={t.why.intro}
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {PILLARS.map((p, i) => {
            /* Zip by id: the tile order comes from PILLARS, the words from the dictionary. */
            const copy = t.why.pillars[p.id];
            return (
              <div
                key={p.id}
                {...item(i)}
                className="lift group relative flex flex-col overflow-hidden rounded-2xl border border-ink-hairline bg-paper-warm p-7"
              >
                <span
                  aria-hidden
                  className="num-deva pointer-events-none absolute -right-2 -top-3 text-[78px] leading-none text-navy-100/70 transition-colors duration-300 group-hover:text-gold-100"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-navy-700 text-gold-400">
                  <Icon name={p.icon} size={24} />
                </span>
                <h3 className="relative mt-6 font-display text-[19px] font-semibold leading-tight text-ink">
                  {copy.title}
                </h3>
                <p className="relative mt-2.5 text-[14.5px] leading-[1.55] text-ink-soft">
                  {copy.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
