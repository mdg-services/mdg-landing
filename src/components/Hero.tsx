import { motion, useReducedMotion } from "motion/react";
import { LogoMark } from "./Brand";
import Icon from "./Icon";
import { BRAND } from "../data/content";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Portals that flow into the shield. */
const ORBIT = ["SDMS", "Dhruva", "QRC", "AAC", "MDT", "DSR", "DAR", "Fire NOC"];

type Node = { label: string; x: number; y: number };
const NODES: Node[] = ORBIT.map((label, i) => {
  const a = (i / ORBIT.length) * Math.PI * 2 - Math.PI / 2;
  return { label, x: 50 + Math.cos(a) * 39, y: 50 + Math.sin(a) * 39 };
});

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-navy-950 text-white">
      {/* backdrop */}
      <div aria-hidden className="absolute inset-0 bg-grid-dark mask-radial opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(245,165,36,.16), transparent 60%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 h-[34rem] w-[34rem] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(74,78,180,.30), transparent 60%)" }}
      />

      <div className="wrap-full relative grid items-center gap-12 pt-16 pb-20 md:grid-cols-12 md:gap-8 md:pt-24 md:pb-28">
        {/* ── Copy ── */}
        <div className="md:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-navy-100"
          >
            <span className="inline-block h-1.5 w-1.5 rotate-45 bg-gold-400" />
            Dealer's <span className="deva normal-case tracking-normal text-gold-300">कवच</span>
            <span className="text-white/30">·</span> Est. {BRAND.since}
          </motion.div>

          <h1 className="mt-7 text-mega" style={{ fontSize: "clamp(44px, 7.2vw, 96px)" }}>
            {["Paperwork,", "handled."].map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className={"block " + (i === 1 ? "text-gold-400" : "text-white")}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.1 + i * 0.12 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
            <span className="block overflow-hidden">
              <motion.span
                className="block text-navy-200"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.34 }}
              >
                You run the pump.
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
            className="mt-8 max-w-xl text-[17px] leading-[1.6] text-navy-100 md:text-[19px]"
          >
            SDMS, Dhruva, AAC, QRC, inspections, document deadlines — one team
            absorbs <span className="text-white">every OMC portal headache</span>, so your
            dealership is never caught short.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.68 }}
            className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <a href="#contact" className="btn-gold w-full sm:w-auto">
              Talk to us <Icon name="arrow" size={16} />
            </a>
            <a href={BRAND.phoneHref} className="font-mono text-[14px] tracking-[0.02em] text-navy-100">
              <span className="text-navy-300">or call</span>{" "}
              <span className="font-semibold text-white underline decoration-white/30 underline-offset-4">
                1800&#8209;345&#8209;6512
              </span>
            </a>
          </motion.div>

          {/* stat chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/10 pt-6"
          >
            {[
              ["1,400+", "pumps"],
              ["14", "states"],
              ["9", "portals"],
            ].map(([n, l]) => (
              <span key={l} className="flex items-baseline gap-2">
                <span className="num text-[22px] font-semibold text-white">{n}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-navy-200">{l}</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── Shield diagram ── */}
        <div className="md:col-span-6">
          <ShieldDiagram />
        </div>
      </div>

      {/* bottom hairline */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
    </section>
  );
}

function ShieldDiagram() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: EASE, delay: 0.3 }}
      className="relative mx-auto aspect-square w-full max-w-[460px]"
    >
      {/* connector + ring layer */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        {/* concentric rings */}
        <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="0.3" />
        <g className="spin-slow" style={{ transformOrigin: "50% 50%" }}>
          <circle cx="50" cy="50" r="39" fill="none" stroke="rgba(158,161,224,.28)" strokeWidth="0.4" strokeDasharray="0.6 2.4" />
        </g>
        <g className="spin-rev" style={{ transformOrigin: "50% 50%" }}>
          <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(245,165,36,.25)" strokeWidth="0.3" strokeDasharray="1 3" />
        </g>

        {/* connectors from each node to the centre */}
        {NODES.map((n, i) => (
          <g key={n.label}>
            <motion.line
              x1={n.x} y1={n.y} x2={50} y2={50}
              stroke="rgba(158,161,224,.30)" strokeWidth="0.3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.6 + i * 0.07 }}
            />
            {/* flowing gold pulse toward the shield */}
            <line
              x1={n.x} y1={n.y} x2={50} y2={50}
              stroke="rgba(245,165,36,.85)" strokeWidth="0.5"
              strokeLinecap="round" strokeDasharray="0.5 7"
              style={{ animation: `flow-${i} 2.4s linear infinite`, animationDelay: `${i * 0.18}s` }}
            />
          </g>
        ))}
        <style>
          {NODES.map((_, i) => `@keyframes flow-${i}{to{stroke-dashoffset:-7.5}}`).join("")}
        </style>
      </svg>

      {/* token chips */}
      {NODES.map((n, i) => (
        <motion.div
          key={n.label}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.7 + i * 0.07 }}
        >
          <motion.span
            className="block whitespace-nowrap rounded-full border border-white/15 bg-navy-900/80 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-navy-100 backdrop-blur"
            animate={reduce ? undefined : { y: [0, -4, 0] }}
            transition={reduce ? undefined : { duration: 3.5 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
          >
            {n.label}
          </motion.span>
        </motion.div>
      ))}

      {/* centre shield */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(245,165,36,.35), transparent 65%)" }}
          animate={reduce ? { opacity: 0.7 } : { scale: [1, 1.12, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={reduce ? undefined : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative grid h-32 w-32 place-items-center rounded-[28px] border border-white/20 bg-gradient-to-b from-navy-700 to-navy-900 shadow-navy sm:h-40 sm:w-40">
          {/* shield outline drawing in behind the mark */}
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className="absolute h-[120%] w-[120%] text-gold-400/70">
            <motion.path
              d="M12 2.5 4 5.6v6.2c0 4.6 3.4 8 8 9.7 4.6-1.7 8-5.1 8-9.7V5.6l-8-3.1z"
              stroke="currentColor"
              strokeWidth="0.7"
              fill="rgba(245,165,36,.05)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.4, ease: EASE, delay: 0.9 }}
            />
          </svg>
          <LogoMark size={66} className="relative text-white" />
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-400 px-3 py-1 deva text-[13px] font-medium text-navy-950 shadow-glow">
            कवच
          </span>
        </div>
      </div>
    </motion.div>
  );
}
