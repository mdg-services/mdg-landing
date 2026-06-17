import { motion } from "motion/react";
import Counter from "./Counter";
import { Reveal, Stagger } from "../lib/motion";
import { itemUp, EASE, VIEWPORT } from "../lib/anim";
import { STATS } from "../data/content";

const BARS = [0.94, 0.68, 0.82, 0.6];

export default function Numbers() {
  return (
    <section aria-label="By the numbers" className="border-b border-ink-hairline bg-paper-warm">
      <div className="wrap-full py-20 md:py-24">
        <div className="grid items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <Reveal>
              <p className="eyebrow">By the numbers</p>
              <h2 className="mt-5 text-display text-[26px] leading-[1.06] md:text-[34px]">
                Five years in.
                <br />
                <span className="deva text-navy-700">पाँच साल।</span>
              </h2>
            </Reveal>
          </div>

          <Stagger className="md:col-span-9 grid grid-cols-2 gap-x-8 gap-y-10 sm:gap-x-10 md:grid-cols-4">
            {STATS.map((s, i) => (
              <motion.div key={s.label} variants={itemUp} className="border-t border-navy-200 pt-5">
                <div className="num font-semibold text-ink" style={{ fontSize: "clamp(40px, 5.6vw, 68px)", lineHeight: 0.96 }}>
                  <Counter to={s.value} decimals={s.decimals} suffix={s.suffix} prefix={s.prefix} />
                </div>
                {/* animated bar */}
                <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-navy-100">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-navy-600 to-gold-400"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: BARS[i] }}
                    viewport={VIEWPORT}
                    transition={{ duration: 1.1, ease: EASE, delay: 0.2 + i * 0.08 }}
                    style={{ transformOrigin: "left center" }}
                  />
                </div>
                <div className="mt-4 text-[15px] font-semibold text-ink">
                  {s.label}
                  {s.hi && <span className="ml-2 deva text-[15px] font-normal text-navy-700">{s.hi}</span>}
                </div>
                <p className="mt-1.5 text-[13px] leading-[1.5] text-ink-muted">{s.note}</p>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
