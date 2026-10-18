import PhoneFrame from "../PhoneFrame";
import { KK_ANCHORS, KK_APPS, KK_SCREENS } from "../../data/kk";
import { getT } from "../../i18n/server";
import type { Lang } from "../../i18n/lang";

/**
 * For the pump owner: what he sees and controls. A Siyahi field, two real
 * screens overlapped on the left, the heading and six plain lines on the
 * right. Plain rows, not cards.
 */
export default function KkPump({ lang }: { lang: Lang }) {
  const t = getT(lang).kk;
  const p = t.pump;
  const [a, b] = KK_SCREENS[lang].pump;
  return (
    <section id={KK_ANCHORS.pump} aria-labelledby="kk-pump" className="scroll-mt-20 overflow-hidden bg-kk-siyahi text-white">
      <div className="wrap-full grid gap-x-12 gap-y-10 py-24 md:grid-cols-12 md:gap-y-12 md:py-32">
        <h2
          id="kk-pump"
          className="text-balance font-bold !text-white md:col-span-7 md:col-start-6 md:row-start-1 md:self-end"
          style={{ fontSize: "clamp(30px, 3.9vw, 50px)", lineHeight: 1.12, letterSpacing: "-0.03em" }}
        >
          {p.heading}
        </h2>

        <div className="flex items-start justify-center md:col-span-5 md:col-start-1 md:row-span-2 md:row-start-1 md:justify-start">
          <PhoneFrame screen={a} alt={p.alts[0]} sizes="(min-width: 768px) 240px, 46vw" className="w-[47%] max-w-[240px]" />
          <PhoneFrame screen={b} alt={p.alts[1]} sizes="(min-width: 768px) 240px, 46vw" className="ml-[5%] mt-12 w-[47%] max-w-[240px] md:mt-16" />
        </div>

        <div className="md:col-span-7 md:col-start-6 md:row-start-2">
          <ul className="space-y-5 text-[19px] leading-[1.45] text-white md:text-[20px]">
            {p.rows.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-7">
            <a href={`#${KK_ANCHORS.start}`} className="kk-btn-light w-full sm:w-auto">
              {p.cta}
            </a>
            <a href={KK_APPS.pump} target="_blank" rel="noopener" className="kk-link text-kk-cream">
              {p.appLink}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
