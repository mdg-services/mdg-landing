import { motion } from "motion/react";
import Icon from "./Icon";
import SectionHeader from "./SectionHeader";
import { Stagger } from "../lib/motion";
import { itemUp } from "../lib/anim";
import { PILLARS } from "../data/content";

export default function WhyUs() {
  return (
    <section id="why" className="bg-white">
      <div className="wrap-full py-24 md:py-32">
        <SectionHeader
          eyebrow="Why choose us"
          title={
            <>
              Why dealers hand us{" "}
              <span className="text-navy-700">the keys to the paperwork.</span>
            </>
          }
          intro="No tiers, no bundles, no run-around. Just the four things every dealer actually wants from a compliance partner."
        />

        <Stagger gap={0.08} className="mt-14 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              variants={itemUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-hairline bg-paper-warm p-7"
            >
              <span
                aria-hidden
                className="num-deva pointer-events-none absolute -right-2 -top-3 text-[78px] leading-none text-navy-100/70 transition-colors duration-300 group-hover:text-gold-100"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-navy-700 text-gold-400">
                <Icon name={p.icon} size={24} />
              </span>
              <h3 className="relative mt-6 font-display text-[19px] font-semibold leading-tight text-ink">
                {p.title}
              </h3>
              <p className="relative mt-2.5 text-[14.5px] leading-[1.55] text-ink-soft">{p.body}</p>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
