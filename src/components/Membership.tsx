import { motion } from "motion/react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import { Reveal, Stagger } from "../lib/motion";
import { itemUp } from "../lib/anim";

const PROMISES = [
  { t: "Bespoke", d: "You pick the services. We don't bundle. Your fee depends on what your pump actually needs." },
  { t: "Locked", d: "Pricing is written down before we begin — no surprise fees, no mid-year escalation." },
  { t: "Limited", d: "We take only as many dealers as we can serve well. Registration closes during overload." },
  { t: "Lifted", d: "Onboarding within seven days. Old paperwork audited. A difference in the first cycle." },
];

export default function Membership() {
  return (
    <section id="membership" className="relative overflow-hidden bg-gradient-to-br from-navy-700 via-navy-800 to-navy-950 text-white">
      <div aria-hidden className="absolute inset-0 bg-grid-dark opacity-30" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-[30rem] w-[30rem] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(245,165,36,.18), transparent 60%)" }}
      />

      <div className="wrap-full relative py-24 md:py-32">
        <div className="grid items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-gold-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-400" />
                </span>
                Memberships open · selected dealers
              </span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-7 text-mega text-white" style={{ fontSize: "clamp(38px, 6.4vw, 92px)" }}>
                Pay only for what
                <br />
                <span className="text-gold-400">your pump needs.</span>
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="md:col-span-5">
            <p className="max-w-prose2 text-[17px] leading-[1.6] text-navy-100 md:text-[19px]">
              No tiers. No bundles. Your monthly fee depends on the services you
              choose, locked in writing before we begin.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/register" className="btn-gold">
                Reserve your slot <Icon name="arrow" size={16} />
              </Link>
              <a href="tel:18003456512" className="btn-on-dark-ghost">
                Call to discuss
              </a>
            </div>
          </Reveal>
        </div>

        <Stagger gap={0.09} className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/12 bg-white/10 md:mt-20 md:grid-cols-4">
          {PROMISES.map((p, i) => (
            <motion.div key={p.t} variants={itemUp} className="bg-navy-900/60 p-7 backdrop-blur">
              <span className="num text-[26px] font-semibold text-gold-400/60">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-display text-[22px] font-semibold text-white">{p.t}</h3>
              <p className="mt-2.5 text-[14px] leading-[1.55] text-navy-100">{p.d}</p>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
