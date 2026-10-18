import { Fragment } from "react";
import { LogoMark } from "./Brand";
import Icon from "./Icon";
import CallUs from "./CallUs";
import { ORBIT } from "../data/content";
import { getT } from "../i18n/server";
import { pathFor, type Lang } from "../i18n/lang";

/* Portals that flow into the shield. They are other people's systems, so
   the names sit in content.ts and never change with the language. */
type Node = { label: string; x: number; y: number };
const NODES: Node[] = ORBIT.map((label, i) => {
  const a = (i / ORBIT.length) * Math.PI * 2 - Math.PI / 2;
  return { label, x: 50 + Math.cos(a) * 39, y: 50 + Math.sin(a) * 39 };
});

/**
 * The first screen. It is plain server HTML with CSS entrances (the `enter`,
 * `line-up`, `pop-in`, `draw` classes in index.css), not script-driven ones:
 * the words are on screen the moment the page paints, which is what a phone on
 * a slow line and a crawler both need, and nothing here waits for the page's
 * JavaScript. Reduced motion is handled once, globally, in index.css.
 */
export default function Hero({ lang }: { lang: Lang }) {
  const t = getT(lang);
  /** A CSS custom property as inline style. */
  const v = (vars: Record<string, string>) => vars as React.CSSProperties;

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
          <div
            className="enter-solid inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-navy-100"
            style={v({ "--rise-y": "12px", "--dur": "0.6s" })}
          >
            <span className="inline-block h-1.5 w-1.5 rotate-45 bg-gold-400" />
            Dealer's <span className="deva normal-case tracking-normal text-gold-300">कवच</span>
            <span className="text-white/30">·</span> {t.hero.eyebrow}
          </div>

          <h1 className="mt-7 text-mega" style={{ fontSize: "clamp(44px, 7.2vw, 96px)" }}>
            {/* the lines are blocks, so the spaces between them cost nothing on screen; they keep the words apart for anything that reads the text */}
            {[t.hero.headline.line1, t.hero.headline.line2].map((line, i) => (
              <Fragment key={i}>
                {i > 0 && " "}
                <span className="block overflow-hidden">
                  <span
                    className={"line-up block " + (i === 1 ? "text-gold-400" : "text-white")}
                    style={v({ "--d": `${0.1 + i * 0.12}s` })}
                  >
                    {line}
                  </span>
                </span>
              </Fragment>
            ))}{" "}
            <span className="block overflow-hidden">
              <span className="line-up block text-navy-200" style={v({ "--d": "0.34s" })}>
                {t.hero.headline.line3}
              </span>
            </span>
          </h1>

          <p
            className="enter-solid mt-8 max-w-xl text-[17px] leading-[1.6] text-navy-100 md:text-[19px]"
            style={v({ "--rise-y": "14px", "--dur": "0.7s", "--d": "0.55s" })}
          >
            {t.hero.subLead} <span className="text-white">{t.hero.subEmphasis}</span> {t.hero.subTail}
          </p>

          {/* the second app, said quietly: a text link with a thumb-sized target */}
          <p
            className="fade-in mt-6 text-[15px] leading-snug text-navy-200"
            style={v({ "--dur": "0.6s", "--d": "0.78s" })}
          >
            {t.hero.alsoLabel}{" "}
            <a
              href={pathFor(lang, "/khata-kavach")}
              className="-my-3 inline-block py-3 font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
            >
              {t.hero.alsoLink}
            </a>
          </p>

          <div
            className="enter-solid mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
            style={v({ "--rise-y": "14px", "--dur": "0.7s", "--d": "0.68s" })}
          >
            <a href="#contact" className="btn-gold w-full sm:w-auto">
              {t.hero.ctaPrimary} <Icon name="arrow" size={16} />
            </a>
            <span className="inline-flex items-center gap-2 text-[14px] text-navy-100">
              <span className="text-navy-300">{t.hero.callLabel}</span>
              <CallUs className="font-semibold text-white underline decoration-white/30 underline-offset-4 [&_svg]:text-gold-400" />
            </span>
          </div>

          {/* stat chips */}
          <div
            className="fade-in mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/10 pt-6"
            style={v({ "--dur": "0.6s", "--d": "0.85s" })}
          >
            {t.hero.chips.map((c) => (
              <span key={c.label} className="flex items-baseline gap-2">
                <span className="num text-[22px] font-semibold text-white">{c.value}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-navy-200">{c.label}</span>
              </span>
            ))}
          </div>
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
  const v = (vars: Record<string, string>) => vars as React.CSSProperties;
  return (
    <div
      className="pop-in relative mx-auto aspect-square w-full max-w-[460px]"
      style={v({ "--pop-from": "0.94", "--dur": "1s", "--d": "0.3s" })}
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
            <line
              className="draw"
              pathLength={1}
              x1={n.x} y1={n.y} x2={50} y2={50}
              stroke="rgba(158,161,224,.30)" strokeWidth="0.3"
              style={v({ "--dur": "0.8s", "--d": `${0.6 + i * 0.07}s` })}
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
        <div
          key={n.label}
          className="pop-in absolute -translate-x-1/2 -translate-y-1/2"
          style={v({ left: `${n.x}%`, top: `${n.y}%`, "--pop-from": "0.6", "--dur": "0.5s", "--d": `${0.7 + i * 0.07}s` })}
        >
          <span
            className="bob block whitespace-nowrap rounded-full border border-white/15 bg-navy-900/80 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-navy-100 backdrop-blur"
            style={v({ "--dur": `${3.5 + (i % 3)}s`, "--d": `${i * 0.2}s` })}
          >
            {n.label}
          </span>
        </div>
      ))}

      {/* centre shield */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          aria-hidden
          className="breathe absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(245,165,36,.35), transparent 65%)" }}
        />
        <div className="relative grid h-32 w-32 place-items-center rounded-[28px] border border-white/20 bg-gradient-to-b from-navy-700 to-navy-900 shadow-navy sm:h-40 sm:w-40">
          {/* shield outline drawing in behind the mark */}
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className="absolute h-[120%] w-[120%] text-gold-400/70">
            <path
              className="draw"
              pathLength={1}
              d="M12 2.5 4 5.6v6.2c0 4.6 3.4 8 8 9.7 4.6-1.7 8-5.1 8-9.7V5.6l-8-3.1z"
              stroke="currentColor"
              strokeWidth="0.7"
              fill="rgba(245,165,36,.05)"
              style={v({ "--dur": "1.4s", "--d": "0.9s" })}
            />
          </svg>
          <LogoMark white className="relative h-16 w-16 object-contain" />
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-400 px-3 py-1 deva text-[13px] font-medium text-navy-950 shadow-glow">
            कवच
          </span>
        </div>
      </div>
    </div>
  );
}
