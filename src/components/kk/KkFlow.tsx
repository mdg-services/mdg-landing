import { KK_ANCHORS } from "../../data/kk";
import { getT } from "../../i18n/server";
import type { Lang } from "../../i18n/lang";

/**
 * One day, one shared line: a drawn diagram, not a row of cards. Four steps are
 * beads on one rail. The transporter's steps sit above it, the pump's below,
 * and the rail between them is the line both of them see. On a phone the rail
 * turns vertical and the same four steps stack. It is a real ordered list
 * because the order is the point; the rail itself is decoration.
 */

/** Where each step sits on a desktop: lane (above or below the rail) and column. */
const PLACE = [
  { top: true, cls: "md:col-start-1 md:row-start-1 md:self-end" },
  { top: false, cls: "md:col-start-2 md:row-start-3 md:self-start" },
  { top: false, cls: "md:col-start-3 md:row-start-3 md:self-start" },
  { top: true, cls: "md:col-start-4 md:row-start-1 md:self-end" },
] as const;

export default function KkFlow({ lang }: { lang: Lang }) {
  const f = getT(lang).kk.flow;
  return (
    <section id={KK_ANCHORS.how} aria-labelledby="kk-flow" className="scroll-mt-20 bg-kk-paper text-kk-ink">
      <div className="wrap-full py-24 md:py-32">
        <h2
          id="kk-flow"
          className="text-balance font-bold"
          style={{ fontSize: "clamp(32px, 4.4vw, 56px)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
        >
          {f.heading}
        </h2>

        <div className="relative mt-14 md:mt-20 md:grid md:grid-cols-4 md:grid-rows-[auto_64px_auto]">
          {/* the shared line, across a desktop */}
          <div
            aria-hidden
            data-reveal="rail"
            className="hidden items-center justify-center rounded-full bg-kk-siyahi px-6 text-[17px] font-bold text-white md:col-span-4 md:col-start-1 md:row-start-2 md:mx-[12.5%] md:flex md:h-11 md:self-center"
          >
            {f.railLabel}
          </div>

          <ol role="list" className="contents">
            {f.steps.map((s, i) => {
              const place = PLACE[i];
              return (
                <li
                  key={i}
                  className={
                    "relative grid grid-cols-[44px_1fr] gap-x-5 pb-12 last:pb-0 md:block md:px-5 md:pb-0 md:text-center " + place.cls
                  }
                >
                  {/* the rail's segment down to the next step, on a phone */}
                  {i < 3 && <span aria-hidden className="absolute left-[19px] top-[22px] -bottom-[22px] w-1.5 bg-kk-siyahi md:hidden" />}
                  <span
                    className={
                      "relative z-10 grid h-11 w-11 place-items-center rounded-full border-4 border-kk-paper bg-kk-siyahi text-[19px] font-bold text-kk-cream md:absolute md:left-1/2 md:-translate-x-1/2 " +
                      (place.top ? "md:top-[calc(100%+10px)]" : "md:bottom-[calc(100%+10px)]")
                    }
                  >
                    <span className="num">{i + 1}</span>
                  </span>
                  <div className={place.top ? "md:pb-6" : "md:pt-6"}>
                    <p className="text-[19px] font-bold text-kk-siyahi">{f.who[s.who as keyof typeof f.who]}</p>
                    <p className="mt-1 text-[17px] leading-[1.5] text-kk-ink md:mx-auto md:max-w-[17rem] md:text-[19px]">{s.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
