import { getT } from "../../i18n/server";
import { item } from "../../lib/reveal";
import type { Lang } from "../../i18n/lang";

/**
 * The paper coupon, drawn: three torn slips, each one the argument it starts.
 * A different composition from the sections around it (a coal field, type on
 * the left, slips knocked off square on the right). No handwriting is faked.
 */
const TILT = ["-rotate-3", "rotate-2", "-rotate-1"] as const;
const SHIFT = ["", "md:ml-20", "md:ml-6"] as const;

export default function KkProblem({ lang }: { lang: Lang }) {
  const p = getT(lang).kk.problem;
  return (
    <section id="problem" aria-labelledby="kk-problem" className="overflow-hidden bg-kk-coal text-white">
      <div className="wrap-full py-24 md:py-32">
        <div className="grid items-center gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <h2
              id="kk-problem"
              className="text-balance font-bold !text-white"
              style={{ fontSize: "clamp(32px, 4.4vw, 56px)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
            >
              {p.heading}
            </h2>
          </div>

          <ul className="space-y-5 md:col-span-7 md:space-y-6">
            {p.coupons.map((c, i) => (
              <li key={c} {...item(i, 0.12)} className={"max-w-[30rem] md:max-w-[34rem] " + SHIFT[i]}>
                <p
                  className={
                    "kk-coupon bg-kk-cream px-7 pb-7 pt-10 font-display text-[21px] font-semibold leading-[1.35] text-kk-ink md:text-[26px] " +
                    TILT[i]
                  }
                >
                  {c}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-20 md:mt-24">
          <div aria-hidden className="h-1.5 w-24 bg-kk-cream" />
          <p className="mt-6 max-w-3xl text-[24px] font-medium leading-[1.35] text-kk-cream md:text-[30px]">{p.close}</p>
        </div>
      </div>
    </section>
  );
}
