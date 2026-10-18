import PhoneFrame from "../PhoneFrame";
import { KK_ANCHORS, KK_APPS, KK_SCREENS } from "../../data/kk";
import { getT } from "../../i18n/server";
import type { Lang } from "../../i18n/lang";

/**
 * For the transporter: what he sends and what he sees. It mirrors the pump
 * section (text on the left, screens on the right, a cream ground), so two
 * neighbours never share a composition. He cannot sign up himself yet, so the
 * last line says so and there is no sign-up button here; the page's own way
 * in is the call at the end.
 */
export default function KkTransporter({ lang }: { lang: Lang }) {
  const t = getT(lang).kk;
  const p = t.transporter;
  const [a, b] = KK_SCREENS[lang].transporter;
  return (
    <section id={KK_ANCHORS.transporter} aria-labelledby="kk-transporter" className="scroll-mt-20 overflow-hidden bg-kk-cream text-kk-ink">
      <div className="wrap-full grid gap-x-12 gap-y-10 py-24 md:grid-cols-12 md:gap-y-12 md:py-32">
        <h2
          id="kk-transporter"
          className="text-balance font-bold md:col-span-7 md:row-start-1 md:self-end"
          style={{ fontSize: "clamp(30px, 3.9vw, 50px)", lineHeight: 1.12, letterSpacing: "-0.03em" }}
        >
          {p.heading}
        </h2>

        <div className="md:col-span-7 md:row-start-2">
          <ul className="space-y-5 text-[19px] leading-[1.45] text-kk-ink md:text-[20px]">
            {p.rows.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <a href={KK_APPS.transporter} target="_blank" rel="noopener" className="kk-link mt-8 text-kk-siyahi">
            {p.appLink}
          </a>
        </div>

        <div className="flex items-start justify-center md:col-span-5 md:col-start-8 md:row-span-2 md:row-start-1 md:justify-end">
          <PhoneFrame screen={a} alt={p.alts[0]} sizes="(min-width: 768px) 240px, 46vw" className="w-[47%] max-w-[240px] md:mt-12" />
          <PhoneFrame screen={b} alt={p.alts[1]} sizes="(min-width: 768px) 240px, 46vw" className="ml-[5%] mt-12 w-[47%] max-w-[240px] md:mt-24" />
        </div>
      </div>
    </section>
  );
}
