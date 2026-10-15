import Icon from "./Icon";
import { getT } from "../i18n/server";
import type { Lang } from "../i18n/lang";
import { Reveal, reveal } from "../lib/reveal";

/* Where each worry card lands and how far it is knocked off square. The
   words are per-language; the scatter is not, so it stays here and is
   matched to `t.problem.chaos` by position. */
const CHAOS_LAYOUT = [
  { rot: -5, x: "0%", y: "2%" },
  { rot: 4, x: "14%", y: "26%" },
  { rot: -3, x: "2%", y: "52%" },
  { rot: 6, x: "20%", y: "74%" },
];

export default function Problem({ lang }: { lang: Lang }) {
  const t = getT(lang);

  return (
    <section aria-label={t.problem.sectionAria} className="relative overflow-hidden bg-white">
      <div className="wrap-full py-24 md:py-32">
        <div className="max-w-3xl">
          <Reveal>
            <p className="eyebrow">{t.problem.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-6 text-balance text-display text-ink" style={{ fontSize: "clamp(33px, 5vw, 64px)" }}>
              {t.problem.headingLead}{" "}
              <span className="text-navy-700">{t.problem.headingAccent}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-prose2 text-[17px] leading-[1.6] text-ink-soft">
              {t.problem.intro}
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid items-stretch gap-6 md:mt-20 md:grid-cols-[1fr_auto_1fr] md:gap-4">
          {/* ── On your own ── */}
          <Reveal className="h-full">
            <div className="relative h-full overflow-hidden rounded-2xl border border-ink-hairline bg-paper-warm p-6 md:p-8">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted">{t.problem.aloneLabel}</span>
                <span className="rounded-full bg-gold-100 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-gold-700">
                  {t.problem.aloneBadge}
                </span>
              </div>

              <div className="relative mt-5 h-[280px]">
                {t.problem.chaos.map((text, i) => {
                  const c = CHAOS_LAYOUT[i];
                  return (
                    <div
                      key={text}
                      className="tilt absolute w-[78%] rounded-xl border border-ink-hairline bg-white p-3.5 shadow-card"
                      data-reveal=""
                      style={
                        { left: c.x, top: c.y, "--rot": `${c.rot}deg`, "--ry": "16px", "--d": `${0.1 + i * 0.1}s` } as React.CSSProperties
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gold-50 text-gold-600">
                          <Icon name="siren" size={15} />
                        </span>
                        <span className="text-[13.5px] font-medium leading-tight text-ink">{text}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* ── Connector / shield ── */}
          <div className="flex items-center justify-center md:px-1">
            <div className="flex flex-col items-center gap-2" {...reveal("pop", { "--d": "0.3s" })}>
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-navy-700 text-gold-400 shadow-navy">
                <Icon name="shield" size={26} />
              </span>
              <span className="rounded-full bg-navy-700 px-2.5 py-0.5 deva text-[12px] text-white">कवच</span>
              <Icon name="arrow" size={20} className="mt-1 hidden text-navy-400 md:block" />
              <Icon name="arrowDown" size={20} className="mt-1 text-navy-400 md:hidden" />
            </div>
          </div>

          {/* ── With Dealer's कवच ── */}
          <Reveal delay={0.15} className="h-full">
            <div className="relative h-full overflow-hidden rounded-2xl border border-navy-700 bg-gradient-to-b from-navy-700 to-navy-900 p-6 text-white shadow-navy md:p-8">
              <div aria-hidden className="absolute inset-0 bg-grid-dark opacity-40" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  {/* The brand mark keeps its own gold span, so the label is
                      written around it: English before, Hindi after. */}
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy-200">
                    {t.problem.withLabelBefore}
                    <span className="deva normal-case text-gold-300">कवच</span>
                    {t.problem.withLabelAfter}
                  </span>
                  <span className="rounded-full bg-ok px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
                    {t.problem.withBadge}
                  </span>
                </div>

                <ul className="mt-6 space-y-3.5">
                  {t.problem.handled.map((h, i) => (
                    <li
                      key={h}
                      className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5"
                      {...reveal("x", { "--d": `${(0.3 + i * 0.12).toFixed(2)}s` })}
                    >
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ok text-white">
                        <Icon name="check" size={14} strokeWidth={2.2} />
                      </span>
                      <span className="text-[14.5px] font-medium leading-snug text-white">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
