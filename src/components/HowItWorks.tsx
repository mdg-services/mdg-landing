const steps = [
  {
    n: "01",
    nDeva: "०१",
    t: "One call, plain talk",
    d: "Tell us about your pump on a phone call. We listen, in Hindi or English. No forms, no jargon.",
    side: "Day 1",
  },
  {
    n: "02",
    nDeva: "०२",
    t: "We pick what you need",
    d: "We propose the exact set of services that fit your dealership. You decide what is in, what is out. Pricing is locked in writing.",
    side: "Day 2 – 3",
  },
  {
    n: "03",
    nDeva: "०३",
    t: "We start the same week",
    d: "Onboarding within seven days. Your old paperwork is audited, your portals are cleaned up, and the team takes over.",
    side: "Day 4 – 7",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      className="grain relative border-y border-ink-hairline bg-paper-warm"
    >
      <div className="wrap-full relative py-24 md:py-36">
        <header className="grid items-end gap-8 md:grid-cols-12">
          <div className="md:col-span-8" data-reveal>
            <p className="eyebrow">Process</p>
            <h2
              className="mt-5 text-display text-ink"
              style={{ fontSize: "clamp(36px, 5.4vw, 72px)" }}
            >
              From first call to first clean cycle, <span className="text-seal">under two weeks.</span>
            </h2>
          </div>
          <div className="md:col-span-4" data-reveal style={{ ["--reveal-delay" as any]: "100ms" }}>
            <p className="mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
              <span className="deva text-[16px] normal-case tracking-normal text-seal">प्रक्रिया</span>
              <span className="ml-2">Three steps</span>
            </p>
          </div>
        </header>

        <ol className="relative mt-16 md:mt-24">
          {/* Left vertical timeline */}
          <span
            aria-hidden
            data-reveal-x
            className="absolute left-3 top-2 hidden h-full w-px bg-seal/30 md:left-[7px] md:block"
            style={{ transformOrigin: "top center" }}
          />

          {steps.map((s, i) => (
            <li
              key={s.n}
              data-reveal
              style={{ ["--reveal-delay" as any]: `${i * 110}ms` }}
              className="relative grid grid-cols-12 items-start gap-x-8 gap-y-4 border-t border-ink-hairline py-12 md:gap-x-14 md:py-16"
            >
              {/* Timeline dot */}
              <span
                aria-hidden
                data-reveal-pop
                style={{ ["--reveal-delay" as any]: `${480 + i * 120}ms` }}
                className="absolute -left-[1px] top-12 hidden h-3.5 w-3.5 rotate-45 border border-seal bg-paper-warm md:block"
              />

              <div className="col-span-12 md:col-span-3 md:pl-10">
                <div className="num-deva text-seal" style={{ fontSize: "clamp(56px, 7vw, 96px)", lineHeight: 0.94 }}>
                  {s.nDeva}
                </div>
                <div className="mt-3 mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                  Step {s.n} <span className="mx-2 text-ink-faint">·</span> {s.side}
                </div>
              </div>

              <div className="col-span-12 md:col-span-9">
                <h3
                  className="text-display text-ink"
                  style={{ fontSize: "clamp(24px, 3.2vw, 42px)", lineHeight: 1.08 }}
                >
                  {s.t}
                </h3>
                <p className="mt-5 max-w-[58ch] text-[16px] leading-[1.6] text-ink-soft md:text-[18px]">
                  {s.d}
                </p>
              </div>
            </li>
          ))}
          <li className="border-t border-ink-hairline" />
        </ol>
      </div>
    </section>
  );
}
