import PhoneFrame from "../PhoneFrame";
import Icon from "../Icon";
import { KkLockup } from "../Brand";
import { KK_ANCHORS, KK_APPS, KK_SCREENS } from "../../data/kk";
import { getT } from "../../i18n/server";
import type { Lang } from "../../i18n/lang";

/**
 * The first screen of /khata-kavach: the idea in two short lines, the two
 * people it is for, and the real nozzle screen with the one line both of them
 * see. Plain server HTML. The only motion is the stamp on the "same line"
 * card, once.
 */
export default function KkHero({ lang }: { lang: Lang }) {
  const t = getT(lang).kk;
  const h = t.hero;
  const screens = KK_SCREENS[lang];

  return (
    <section id="top" className="overflow-hidden bg-kk-cream text-kk-ink">
      <div className="wrap-full grid gap-10 pt-9 md:grid-cols-12 md:items-start md:gap-8 md:pt-12 lg:pt-14">
        <div className="md:col-span-7 md:pb-16 lg:col-span-8">
          <KkLockup lang={lang} alt={t.lockupAlt} className="h-12 w-auto md:h-16" eager />
          <p className="mt-3 text-[16px] font-medium text-kk-muted">{h.by}</p>

          <h1
            className="mt-8 font-bold text-kk-ink md:mt-7"
            style={{ fontSize: "clamp(36px, 4.6vw, 64px)", lineHeight: 1.08, letterSpacing: "-0.03em" }}
          >
            <span className="block text-balance">{h.headlineLine1}</span>{" "}
            <span className="block text-balance">{h.headlineLine2}</span>
          </h1>

          <p className="mt-6 max-w-[34rem] text-[18px] leading-[1.55] text-kk-soft md:mt-6 md:text-[20px]">{h.sub}</p>

          <div className="mt-8 flex flex-col items-start gap-3 md:mt-7 sm:flex-row sm:items-center sm:gap-7">
            {/* The owner starts on his own in the Business app: no call needed. */}
            <a href={KK_APPS.signup} target="_blank" rel="noopener" className="kk-btn-primary w-full sm:w-auto">
              {h.ctaPump}
            </a>
            <a href={`#${KK_ANCHORS.transporter}`} className="kk-link text-kk-siyahi">
              {h.ctaTransporter} <Icon name="arrowDown" size={16} />
            </a>
          </div>

          <ul className="mt-8 space-y-1.5 text-[17px] font-medium text-kk-ink md:mt-7">
            {h.assurances.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>

        {/* the real nozzle screen, and the line both sides see. On a phone the screen rises from the foot of the section. */}
        <div className="relative mx-auto mt-6 h-[400px] w-full max-w-[300px] overflow-hidden md:mt-0 md:col-span-5 md:h-auto md:max-w-[310px] md:overflow-visible lg:col-span-4 lg:max-w-[330px]">
          <PhoneFrame screen={screens.hero} alt={h.phoneAlt} priority sizes="(min-width: 1024px) 330px, 300px" />
          <div className="kk-stamp absolute bottom-6 left-0 w-[232px] rounded-2xl bg-kk-surface p-4 text-kk-ink md:-left-28 md:bottom-28 md:w-[250px] md:p-5">
            <p className="text-[15px] font-bold text-kk-soft">{h.card.heading}</p>
            <p className="num mt-2 text-[26px] font-bold leading-none tracking-wide">{h.card.plate}</p>
            <p className="mt-2 text-[15px] text-kk-soft">{h.card.detail}</p>
            <ul className="mt-3 space-y-1.5 text-[15px] font-semibold">
              {[h.card.pump, h.card.transporter].map((w) => (
                <li key={w} className="flex items-center gap-2.5">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-kk-siyahi text-white">
                    <Icon name="check" size={13} strokeWidth={2.6} />
                  </span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
