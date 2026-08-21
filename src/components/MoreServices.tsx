import { motion } from "motion/react";
import Icon from "./Icon";
import { useT } from "../i18n";
import { Reveal, Stagger } from "../lib/motion";
import { itemUp } from "../lib/anim";
import { EXTRAS } from "../data/content";

export default function MoreServices() {
  const t = useT();

  return (
    <section aria-label={t.extras.sectionAria} className="relative overflow-hidden bg-navy-900 text-white">
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
              <p className="eyebrow-light">{t.extras.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-6 text-display text-white" style={{ fontSize: "clamp(30px, 4.4vw, 54px)" }}>
                {t.extras.heading}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12} className="md:col-span-5">
            <p className="max-w-prose2 text-[16px] leading-[1.6] text-navy-100 md:text-[17px]">
              {t.extras.intro}
            </p>
          </Reveal>
        </div>

        <Stagger gap={0.08} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EXTRAS.map((e) => {
            const copy = t.extras.items[e.id];
            return (
              <motion.div
                key={e.id}
                variants={itemUp}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="rounded-2xl border border-white/12 bg-white/[0.06] p-6 backdrop-blur"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-400 text-navy-950">
                  <Icon name={e.icon} size={24} />
                </span>
                <h3 className="mt-5 font-display text-[17px] font-semibold leading-snug text-white">{copy.title}</h3>
                <p className="mt-2 text-[13.5px] leading-[1.55] text-navy-100">{copy.note}</p>
              </motion.div>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
