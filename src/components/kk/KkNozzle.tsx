import type { ReactNode } from "react";
import { KK_DEMO, type KkLight } from "../../data/kk";
import { getT } from "../../i18n/server";
import type { Lang } from "../../i18n/lang";

/**
 * At the nozzle: the one thing on the page you can try. Pick one of three
 * made-up trucks and see what the nozzle man sees: a green, amber or red light,
 * with the reason and the next step. This is the only place on the whole site
 * where those three colours appear, because there they mean one thing each.
 *
 * It needs no script. The three trucks are radio buttons and each result is
 * shown by the radio before it (CSS sibling selectors), so it works with
 * scripts off and a keyboard's arrow keys move between trucks. The stamp
 * (180 ms, once) plays when a result is shown; reduced motion drops it.
 *
 * Each light says a word and the next step, so colour is never the only signal.
 */

/** Tailwind needs whole class names, so each truck's classes are spelled out. */
const SLOT = {
  go: {
    id: "kk-truck-go",
    peer: "peer/go",
    chipOn: "peer-checked/go:bg-kk-cream peer-checked/go:text-kk-coal",
    chipFocus: "peer-focus-visible/go:outline peer-focus-visible/go:outline-[3px] peer-focus-visible/go:outline-offset-2 peer-focus-visible/go:outline-white",
    show: "hidden peer-checked/go:block",
    skin: "bg-light-go text-white",
  },
  stop: {
    id: "kk-truck-stop",
    peer: "peer/stop",
    chipOn: "peer-checked/stop:bg-kk-cream peer-checked/stop:text-kk-coal",
    chipFocus: "peer-focus-visible/stop:outline peer-focus-visible/stop:outline-[3px] peer-focus-visible/stop:outline-offset-2 peer-focus-visible/stop:outline-white",
    show: "hidden peer-checked/stop:block",
    skin: "bg-light-stop text-white",
  },
  wait: {
    id: "kk-truck-wait",
    peer: "peer/wait",
    chipOn: "peer-checked/wait:bg-kk-cream peer-checked/wait:text-kk-coal",
    chipFocus: "peer-focus-visible/wait:outline peer-focus-visible/wait:outline-[3px] peer-focus-visible/wait:outline-offset-2 peer-focus-visible/wait:outline-white",
    show: "hidden peer-checked/wait:block",
    skin: "bg-light-wait text-kk-coal",
  },
} as const satisfies Record<KkLight, Record<string, string>>;

/** A word and a shape for each light, so a colour-blind reader and a bright forecourt both get it. */
const ICON: Record<KkLight, ReactNode> = {
  go: (
    <svg viewBox="0 0 32 32" width="40" height="40" aria-hidden fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="13" />
      <path d="M9.5 16.5l4.5 4.5 8.5-9" />
    </svg>
  ),
  wait: (
    <svg viewBox="0 0 32 32" width="40" height="40" aria-hidden fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4 29 27H3L16 4z" />
      <path d="M16 13v7M16 23.5v.5" />
    </svg>
  ),
  stop: (
    <svg viewBox="0 0 32 32" width="40" height="40" aria-hidden fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="13" />
      <path d="M10.5 10.5l11 11M21.5 10.5l-11 11" />
    </svg>
  ),
};

export default function KkNozzle({ lang }: { lang: Lang }) {
  const n = getT(lang).kk.nozzle;

  return (
    <section id="nozzle" aria-labelledby="kk-nozzle" className="scroll-mt-20 bg-kk-coal text-white">
      <div className="wrap-full py-24 md:py-32">
        <h2
          id="kk-nozzle"
          className="max-w-3xl text-balance font-bold !text-white"
          style={{ fontSize: "clamp(32px, 4.4vw, 56px)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
        >
          {n.heading}
        </h2>
        <p className="mt-5 max-w-[34rem] text-[18px] leading-[1.55] text-kk-cream md:text-[20px]">{n.intro}</p>

        <div
          role="radiogroup"
          aria-labelledby="kk-nozzle-label"
          className="mt-12 grid gap-3 md:mt-14 md:grid-cols-12 md:grid-rows-[auto_auto_auto_auto_1fr] md:gap-x-10 md:gap-y-3"
        >
          {KK_DEMO.map((d, i) => (
            <input
              key={d.light}
              id={SLOT[d.light].id}
              type="radio"
              name="kk-truck"
              value={d.light}
              defaultChecked={i === 0}
              className={"sr-only " + SLOT[d.light].peer}
            />
          ))}

          <p id="kk-nozzle-label" className="order-1 text-[18px] font-semibold text-kk-cream md:order-none md:col-span-4">
            {n.label}
          </p>

          {KK_DEMO.map((d) => (
            <label
              key={d.light}
              htmlFor={SLOT[d.light].id}
              className={
                "kk-chip order-2 flex min-h-[64px] cursor-pointer flex-col justify-center rounded-2xl bg-white/10 px-5 py-3 text-white md:order-none md:col-span-4 " +
                SLOT[d.light].chipOn +
                " " +
                SLOT[d.light].chipFocus
              }
            >
              <span className="num text-[23px] font-bold leading-tight tracking-wide">{d.plate}</span>
              <span className="text-[15px] opacity-90">{n.states[d.light].name}</span>
            </label>
          ))}

          {KK_DEMO.map((d) => {
            const s = n.states[d.light];
            const big = d.light === "go";
            return (
              <div
                key={d.light}
                className={
                  SLOT[d.light].show +
                  " kk-stamp order-3 mt-3 rounded-[1.75rem] p-6 md:order-none md:mt-0 md:col-span-8 md:col-start-5 md:row-span-5 md:row-start-1 md:p-10 " +
                  SLOT[d.light].skin
                }
              >
                <p className="sr-only">{n.lightLabels[d.light]}.</p>
                <p className="flex items-center gap-3 text-[30px] font-bold leading-tight md:text-[38px]">
                  {ICON[d.light]}
                  {s.word}
                </p>
                <div className="mt-6 rounded-2xl bg-kk-surface px-5 py-4 text-kk-ink md:mt-8">
                  <p className="num text-[30px] font-bold leading-none tracking-wide md:text-[40px]">{d.plate}</p>
                  <p className="mt-2 text-[16px] text-kk-soft">{s.name}</p>
                </div>
                <p
                  className="mt-6 font-bold leading-[1.1] md:mt-8"
                  style={{ fontSize: big ? "clamp(44px, 7vw, 76px)" : "clamp(26px, 3.4vw, 36px)", letterSpacing: "-0.02em" }}
                >
                  {s.line}
                </p>
                {s.sub && <p className="mt-3 text-[22px] font-semibold md:text-[26px]">{s.sub}</p>}
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-[17px] text-kk-steel">{n.caption}</p>
      </div>
    </section>
  );
}
