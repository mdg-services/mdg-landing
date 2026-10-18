import PhoneFrame from "./PhoneFrame";
import Icon from "./Icon";
import { KkLockup } from "./Brand";
import { KK_SCREENS } from "../data/kk";
import { getT } from "../i18n/server";
import { homeHref, pathFor, type Lang } from "../i18n/lang";
import { Reveal } from "../lib/reveal";

/**
 * The home page's "two apps" section, straight under the first screen: where a
 * pump owner who came for Dealer's Kavach finds Khata Kavach. A split field
 * (navy on the left, Khata Kavach's cream on the right), not two equal cards.
 * The apps are told apart by ground and by form: Dealer's Kavach is type on
 * navy, Khata Kavach is its own seal on cream, at a different size, so they are
 * never read as a matched pair. Server HTML, no script.
 */
export default function Products({ lang }: { lang: Lang }) {
  const t = getT(lang).products;
  const screen = KK_SCREENS[lang].pump[0];

  return (
    <section id="products" aria-label={t.sectionAria} className="scroll-mt-20 bg-paper">
      <div className="wrap-full pb-14 pt-20 md:pb-20 md:pt-28">
        <Reveal>
          <h2 className="max-w-3xl text-balance text-display text-ink" style={{ fontSize: "clamp(32px, 4.6vw, 58px)" }}>
            {t.heading}
          </h2>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="mt-5 max-w-[40rem] text-[18px] leading-[1.55] text-ink-soft md:text-[20px]">{t.intro}</p>
        </Reveal>
      </div>

      <div className="grid md:grid-cols-2">
        {/* Dealer's Kavach: type on navy */}
        <div className="flex flex-col justify-center bg-navy-700 px-6 py-14 text-white sm:px-8 md:py-20 md:pl-[max(2rem,calc((100vw-84rem)/2+2rem))] md:pr-12 lg:pl-[max(3rem,calc((100vw-84rem)/2+3rem))] lg:pr-16">
          <h3 className="text-display text-white" style={{ fontSize: "clamp(34px, 3.6vw, 48px)" }}>
            Dealer's <span className="deva text-gold-300">कवच</span>
          </h3>
          <p className="mt-4 text-[26px] font-semibold leading-tight text-white md:text-[30px]">{t.dealer.tagline}</p>
          <ul className="mt-8 space-y-3.5 text-[18px] leading-[1.45] text-navy-50">
            {t.dealer.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <a
            href={homeHref(lang, "services")}
            className="mt-9 inline-flex min-h-[52px] items-center gap-2.5 text-[17px] font-semibold text-white underline decoration-white/50 underline-offset-[6px] hover:decoration-white"
          >
            {t.dealer.link} <Icon name="arrow" size={18} />
          </a>
        </div>

        {/* Khata Kavach: its own seal on its own cream */}
        <div className="relative overflow-hidden bg-kk-cream px-6 pt-14 text-kk-ink sm:px-8 md:py-20 md:pl-12 md:pr-[max(2rem,calc((100vw-84rem)/2+2rem))] lg:pl-16 lg:pr-[max(3rem,calc((100vw-84rem)/2+3rem))]">
          <div className="md:max-w-[58%]">
            <h3 className="m-0">
              <KkLockup lang={lang} alt={getT(lang).kk.name} className="h-11 w-auto md:h-12" />
            </h3>
            <p className="mt-5 text-[26px] font-bold leading-tight text-kk-ink md:text-[30px]">{t.khata.tagline}</p>
            <ul className="mt-8 space-y-3.5 text-[18px] leading-[1.45] text-kk-ink">
              {t.khata.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p className="mt-6 text-[16px] leading-snug text-kk-muted">{t.note}</p>
            <a
              href={pathFor(lang, "/khata-kavach")}
              className="mt-6 inline-flex min-h-[52px] items-center gap-2.5 text-[17px] font-semibold text-kk-siyahi underline decoration-kk-siyahi/50 underline-offset-[6px] hover:decoration-kk-siyahi"
            >
              {t.khata.link} <Icon name="arrow" size={18} />
            </a>
          </div>
          {/* the real screen, rising from the foot of the panel */}
          <div className="mx-auto mt-8 h-[230px] w-[200px] overflow-hidden md:absolute md:bottom-0 md:right-10 md:mt-0 md:h-[400px] md:w-[210px] lg:right-[max(3rem,calc((100vw-84rem)/2+3rem))] lg:h-[430px] lg:w-[230px]">
            <PhoneFrame screen={screen} alt={t.khata.imageAlt} sizes="230px" className="w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
