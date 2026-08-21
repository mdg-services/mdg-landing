import { motion } from "motion/react";
import Icon from "./Icon";
import { useT } from "../i18n";
import { Reveal, Stagger } from "../lib/motion";
import { itemUp } from "../lib/anim";
import { TRAINING_HREF } from "../data/content";

/**
 * The training library. No eyebrow here on purpose: the page already carries
 * more small uppercase labels than it needs, and this section's heading says
 * what it is without help.
 */
export default function Training() {
  const t = useT();

  return (
    <section aria-label={t.training.sectionAria} className="border-b border-ink-hairline bg-navy-950">
      <div className="wrap-full py-20 md:py-24">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
          <Reveal className="md:col-span-6">
            <h2
              className="max-w-[18ch] text-balance text-display text-white"
              style={{ fontSize: "clamp(28px, 3.8vw, 46px)" }}
            >
              {t.training.heading}
            </h2>
            <p className="mt-5 max-w-prose2 text-[16px] leading-[1.65] text-navy-100 md:text-[17px]">
              {t.training.body}
            </p>
            <a
              href={TRAINING_HREF}
              className="btn btn-gold mt-8"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.training.cta}
              <Icon name="arrow" size={16} />
            </a>
          </Reveal>

          <Stagger className="md:col-span-6 grid grid-cols-2 gap-x-8 gap-y-8" gap={0.07}>
            {t.training.facts.map((f) => (
              <motion.div
                key={f.figure}
                variants={itemUp}
                className="border-t border-white/15 pt-4"
              >
                <p className="num text-[34px] font-semibold leading-none text-gold-300 md:text-[40px]">
                  {f.figure}
                </p>
                <p className="mt-2.5 text-[14.5px] text-navy-100">{f.label}</p>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
