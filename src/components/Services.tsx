import { motion } from "motion/react";
import Icon from "./Icon";
import { Reveal, Stagger } from "../lib/motion";
import { itemUp } from "../lib/anim";
import { SERVICES } from "../data/content";

export default function Services() {
  return (
    <section id="services" className="relative bg-paper-warm">
      <div className="wrap-full py-24 md:py-32">
        <div className="grid items-end gap-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <Reveal>
              <p className="eyebrow">Program service covers</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-6 text-balance text-display text-ink" style={{ fontSize: "clamp(33px, 5vw, 64px)" }}>
                Nine jobs that stop being yours{" "}
                <span className="text-navy-700">the day we start.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12} className="md:col-span-4">
            <p className="max-w-prose2 text-[16px] leading-[1.6] text-ink-soft md:text-[17px]">
              Each cover is sold on its own — pick what your pump needs, skip
              what it doesn't.
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted">
              <span className="deva text-[15px] normal-case tracking-normal text-navy-700">सेवाएँ</span>
              <span className="ml-2">Services</span>
            </p>
          </Reveal>
        </div>

        <Stagger gap={0.06} className="mt-14 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <motion.article
              key={s.id}
              variants={itemUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-hairline bg-white p-6 shadow-card"
            >
              {/* top accent that grows on hover */}
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-navy-600 to-gold-400 transition-transform duration-300 ease-out group-hover:scale-x-100"
              />

              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy-50 text-navy-700 transition-colors duration-300 group-hover:bg-navy-700 group-hover:text-gold-400">
                  <Icon name={s.icon} size={24} />
                </span>
                <span className="num-deva text-[34px] leading-none text-navy-100">{s.noDeva}</span>
              </div>

              <h3 className="mt-5 font-display text-[20px] font-semibold leading-tight text-ink">
                {s.title}
              </h3>
              <p className="mt-2.5 text-[14.5px] leading-[1.55] text-ink-soft">{s.blurb}</p>

              <ul className="mt-4 flex flex-wrap gap-1.5">
                {s.covers.map((c) => (
                  <li
                    key={c}
                    className="rounded-full border border-ink-hairline bg-paper-warm px-2.5 py-1 text-[11.5px] font-medium text-ink-muted"
                  >
                    {c}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-center gap-2 border-t border-ink-hairline pt-4">
                <span className="h-1.5 w-1.5 rotate-45 bg-gold-400" />
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-navy-700">{s.metric}</span>
              </div>
            </motion.article>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
