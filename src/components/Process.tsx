import { motion } from "motion/react";
import Icon from "./Icon";
import SectionHeader from "./SectionHeader";
import { Stagger } from "../lib/motion";
import { itemUp, VIEWPORT, EASE } from "../lib/anim";
import { STEPS } from "../data/content";

export default function Process() {
  return (
    <section id="process" className="bg-paper-warm">
      <div className="wrap-full py-24 md:py-32">
        <SectionHeader
          eyebrow="How it works"
          title={
            <>
              From first call to first clean cycle,{" "}
              <span className="text-navy-700">under two weeks.</span>
            </>
          }
          intro="Three steps, no jargon. You stay in control of what's in and what's out — and the price is locked in writing before we begin."
        />

        <div className="relative mt-16 md:mt-20">
          {/* horizontal connecting line (desktop) */}
          <motion.span
            aria-hidden
            className="absolute left-0 right-0 top-[27px] hidden h-px bg-gradient-to-r from-navy-300 via-navy-400 to-gold-400 md:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 1.1, ease: EASE }}
            style={{ transformOrigin: "left" }}
          />

          <Stagger gap={0.14} className="grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((s) => (
              <motion.div key={s.no} variants={itemUp} className="relative">
                {/* node */}
                <div className="flex items-center gap-4 md:block">
                  <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-ink-hairline bg-white text-navy-700 shadow-card">
                    <Icon name={s.icon} size={26} />
                  </span>
                  <div className="mt-0 md:mt-6">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold-600">{s.when}</span>
                    <div className="mt-1 flex items-baseline gap-3">
                      <span className="num-deva text-[26px] leading-none text-navy-200">{s.noDeva}</span>
                      <h3 className="font-display text-[20px] font-semibold leading-tight text-ink md:text-[23px]">
                        {s.title}
                      </h3>
                    </div>
                  </div>
                </div>
                <p className="mt-4 max-w-sm text-[15px] leading-[1.6] text-ink-soft md:pr-6">{s.body}</p>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
