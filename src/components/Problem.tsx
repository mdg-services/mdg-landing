import { motion } from "motion/react";
import Icon from "./Icon";
import { Reveal } from "../lib/motion";
import { VIEWPORT, EASE } from "../lib/anim";

const CHAOS = [
  { t: "SDMS subsidy entry overdue", rot: -5, x: "0%", y: "2%" },
  { t: "Density log missing for audit", rot: 4, x: "14%", y: "26%" },
  { t: "Fire NOC expires in 3 days", rot: -3, x: "2%", y: "52%" },
  { t: "Automation down — vendor?", rot: 6, x: "20%", y: "74%" },
];

const HANDLED = [
  "SDMS filed before the 11am cut-off",
  "Logs kept inspection-ready year-round",
  "Fire NOC renewed 9 days early",
  "Automation back online in 22 minutes",
];

export default function Problem() {
  return (
    <section aria-label="The problem we solve" className="relative overflow-hidden bg-white">
      <div className="wrap-full py-24 md:py-32">
        <div className="max-w-3xl">
          <Reveal>
            <p className="eyebrow">The problem</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-6 text-balance text-display text-ink" style={{ fontSize: "clamp(33px, 5vw, 64px)" }}>
              Nine portals. Dozens of deadlines.{" "}
              <span className="text-navy-700">One of you.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-prose2 text-[17px] leading-[1.6] text-ink-soft">
              Most dealers lose hours every week to compliance no one trained
              them for — and a single missed window can mean a notice. The कवच
              absorbs the entire load.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid items-stretch gap-6 md:mt-20 md:grid-cols-[1fr_auto_1fr] md:gap-4">
          {/* ── On your own ── */}
          <Reveal className="h-full">
            <div className="relative h-full overflow-hidden rounded-2xl border border-ink-hairline bg-paper-warm p-6 md:p-8">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted">On your own</span>
                <span className="rounded-full bg-gold-100 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-gold-700">
                  ≈ 11 hrs / week
                </span>
              </div>

              <div className="relative mt-5 h-[280px]">
                {CHAOS.map((c, i) => (
                  <motion.div
                    key={c.t}
                    className="absolute w-[78%] rounded-xl border border-ink-hairline bg-white p-3.5 shadow-card"
                    style={{ left: c.x, top: c.y, rotate: `${c.rot}deg` }}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VIEWPORT}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.1 }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gold-50 text-gold-600">
                        <Icon name="siren" size={15} />
                      </span>
                      <span className="text-[13.5px] font-medium leading-tight text-ink">{c.t}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* ── Connector / shield ── */}
          <div className="flex items-center justify-center md:px-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
              className="flex flex-col items-center gap-2"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-navy-700 text-gold-400 shadow-navy">
                <Icon name="shield" size={26} />
              </span>
              <span className="rounded-full bg-navy-700 px-2.5 py-0.5 deva text-[12px] text-white">कवच</span>
              <Icon name="arrow" size={20} className="mt-1 hidden text-navy-400 md:block" />
              <Icon name="arrowDown" size={20} className="mt-1 text-navy-400 md:hidden" />
            </motion.div>
          </div>

          {/* ── With Dealer's कवच ── */}
          <Reveal delay={0.15} className="h-full">
            <div className="relative h-full overflow-hidden rounded-2xl border border-navy-700 bg-gradient-to-b from-navy-700 to-navy-900 p-6 text-white shadow-navy md:p-8">
              <div aria-hidden className="absolute inset-0 bg-grid-dark opacity-40" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy-200">
                    With Dealer's <span className="deva normal-case text-gold-300">कवच</span>
                  </span>
                  <span className="rounded-full bg-ok px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
                    0 missed
                  </span>
                </div>

                <ul className="mt-6 space-y-3.5">
                  {HANDLED.map((h, i) => (
                    <motion.li
                      key={h}
                      className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5"
                      initial={{ opacity: 0, x: 14 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={VIEWPORT}
                      transition={{ duration: 0.5, ease: EASE, delay: 0.3 + i * 0.12 }}
                    >
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ok text-white">
                        <Icon name="check" size={14} strokeWidth={2.2} />
                      </span>
                      <span className="text-[14.5px] font-medium leading-snug text-white">{h}</span>
                    </motion.li>
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
