export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-paper">
      <div className="wrap-full relative pt-24 pb-32 md:pt-36 md:pb-44">
        {/* Top meta strip */}
        <div className="mb-16 flex flex-wrap items-center justify-between gap-3 md:mb-24">
          <div className="flex items-center gap-3">
            <span aria-hidden className="inline-block h-1.5 w-1.5 rotate-45 bg-seal" />
            <span className="mono text-[11px] uppercase tracking-[0.24em] text-ink-muted">
              Dealer's <span className="deva normal-case text-[14px] tracking-normal text-seal">कवच</span>
              <span className="mx-2 text-ink-faint">/</span>
              MDG Services
            </span>
          </div>
          <span className="mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
            Est. 2021 <span className="mx-2 text-ink-faint">·</span> 14 States
          </span>
        </div>

        {/* Display */}
        <h1
          className="text-mega text-ink"
          style={{ fontSize: "clamp(48px, 11vw, 168px)" }}
        >
          <span className="block">
            <span className="clip-line"><span style={{ animationDelay: "120ms" }}>Paperwork,</span></span>
          </span>
          <span className="block">
            <span className="clip-line"><span style={{ animationDelay: "240ms" }}>handled.</span></span>
          </span>
          <span className="block text-seal">
            <span className="clip-line"><span style={{ animationDelay: "440ms" }}>You run the pump.</span></span>
          </span>
        </h1>

        {/* Subline + CTAs */}
        <div className="mt-16 grid items-end gap-10 md:mt-20 md:grid-cols-12 md:gap-10">
          <p
            className="text-[18px] leading-[1.5] text-ink-soft md:col-span-7 md:text-[22px] md:leading-[1.42]"
            data-reveal
            style={{ ["--reveal-delay" as any]: "700ms" }}
          >
            Compliance, inspections, OMC portals, document deadlines.
            One team handles all of it, so your dealership is never
            caught short.
          </p>

          <div
            className="flex flex-col gap-3 md:col-span-5 md:items-end"
            data-reveal
            style={{ ["--reveal-delay" as any]: "900ms" }}
          >
            <a href="#contact" className="btn-seal w-full md:w-auto">
              Talk to us
              <ArrowRight />
            </a>
            <a
              href="tel:18003456512"
              className="mono text-[14px] tracking-[0.04em] text-ink-soft"
            >
              <span className="text-ink-faint">or call</span>{" "}
              <span className="font-medium text-ink underline decoration-ink-hairline underline-offset-4">
                1800&#8209;345&#8209;6512
              </span>
            </a>
          </div>
        </div>

        {/* Bottom hairline strip */}
        <div className="mt-24 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-ink-hairline pt-6 md:mt-32">
          <span className="mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
            Now serving
          </span>
          <span className="h-px flex-1 bg-ink-hairline" />
          <span className="num-serif text-[18px] text-ink">
            1,400+ pumps
          </span>
          <span className="text-ink-faint">·</span>
          <span className="num-serif text-[18px] text-ink">14 states</span>
          <span className="text-ink-faint">·</span>
          <span className="num-serif text-[18px] text-ink">9 portals</span>
        </div>
      </div>
    </section>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
