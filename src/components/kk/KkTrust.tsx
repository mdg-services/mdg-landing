import { getT } from "../../i18n/server";
import { item } from "../../lib/reveal";
import type { Lang } from "../../i18n/lang";

/**
 * Trust, said as plainly as the promise on the box: we don't lend, we keep the
 * account. Large statements with space between them, no cards. The first one,
 * the promise itself, is set larger than the other four.
 */
export default function KkTrust({ lang }: { lang: Lang }) {
  const tr = getT(lang).kk.trust;
  const [first, ...rest] = tr.blocks;
  return (
    <section id="trust" aria-labelledby="kk-trust" className="scroll-mt-20 bg-kk-paper text-kk-ink">
      <div className="wrap-full py-24 md:py-32">
        <h2
          id="kk-trust"
          className="max-w-4xl text-balance font-bold"
          style={{ fontSize: "clamp(32px, 4.4vw, 56px)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
        >
          {tr.heading}
        </h2>

        <div className="mt-14 md:mt-20">
          <p className="max-w-4xl text-[26px] font-semibold leading-[1.3] text-kk-ink md:text-[36px]" {...item(0)}>
            {first.lead} <span className="font-normal text-kk-soft">{first.rest}</span>
          </p>

          <div className="mt-14 grid gap-x-16 gap-y-10 md:mt-20 md:grid-cols-2">
            {rest.map((b, i) => (
              <p key={b.lead} className="text-[19px] leading-[1.5] text-kk-soft md:text-[20px]" {...item(i, 0.08)}>
                <span className="font-semibold text-kk-ink">{b.lead}</span> {b.rest}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
