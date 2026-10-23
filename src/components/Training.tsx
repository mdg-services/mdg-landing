import Icon from "./Icon";
import { getT } from "../i18n/server";
import type { Lang } from "../i18n/lang";
import { Reveal, item } from "../lib/reveal";
import { TRAINING_HREF } from "../data/content";

/**
 * The training library. No eyebrow here on purpose: the page already carries
 * more small uppercase labels than it needs, and this section's heading says
 * what it is without help.
 */
export default function Training({ lang }: { lang: Lang }) {
  const t = getT(lang);

  return (
    <section aria-label={t.training.sectionAria} className="border-b border-ink-hairline bg-navy-950">
      <div className="wrap-full py-20 md:py-24">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
          <Reveal className="md:col-span-6">
            <h2
              className="max-w-[18ch] text-balance text-display text-white"
              style={{ fontSize: "clamp(28px, 3.8vw, 46px)" }}
            >
              {t.training.heading}
            </h2>
            <p className="mt-5 max-w-prose2 text-[16px] leading-[1.65] text-navy-100 md:text-[17px]">
              {t.training.body}
            </p>
            <a href={`${TRAINING_HREF}?lang=${lang}`} className="btn btn-gold mt-8">
              {t.training.cta}
              <Icon name="arrow" size={16} />
            </a>
          </Reveal>

          <div className="md:col-span-6 grid grid-cols-2 gap-x-8 gap-y-8">
            {t.training.facts.map((f, i) => (
              <div
                key={f.figure}
                {...item(i, 0.07)}
                className="border-t border-white/15 pt-4"
              >
                <p className="num text-[34px] font-semibold leading-none text-gold-300 md:text-[40px]">
                  {f.figure}
                </p>
                <p className="mt-2.5 text-[14.5px] text-navy-100">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
