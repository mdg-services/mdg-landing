import { motion } from "motion/react";
import Icon from "./Icon";
import { Reveal, Stagger } from "../lib/motion";
import { itemUp } from "../lib/anim";
import { EXTRAS } from "../data/content";

export default function MoreServices() {
  return (
    <section aria-label="More services" className="relative overflow-hidden bg-navy-900 text-white">
      <div aria-hidden className="absolute inset-0 bg-grid-dark opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[28rem] w-[28rem] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(245,165,36,.14), transparent 60%)" }}
      />
      <div className="wrap-full relative py-20 md:py-24">
        <div className="grid items-end gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <p className="eyebrow-light">More services?</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-6 text-display text-white" style={{ fontSize: "clamp(30px, 4.4vw, 54px)" }}>
                Beyond the nine, we also cover —
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12} className="md:col-span-5">
            <p className="max-w-prose2 text-[16px] leading-[1.6] text-navy-100 md:text-[17px]">
              The subscription customises to your outlet, so the cover can grow
              as your dealership does.
            </p>
          </Reveal>
        </div>

        <Stagger gap={0.08} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EXTRAS.map((e) => (
            <motion.div
              key={e.title}
              variants={itemUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="rounded-2xl border border-white/12 bg-white/[0.06] p-6 backdrop-blur"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-400 text-navy-950">
                <Icon name={e.icon} size={24} />
              </span>
              <h3 className="mt-5 font-display text-[17px] font-semibold leading-snug text-white">{e.title}</h3>
              <p className="mt-2 text-[13.5px] leading-[1.55] text-navy-100">{e.note}</p>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
