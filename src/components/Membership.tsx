const promises = [
  { t: "Bespoke", d: "You pick the services. We do not bundle. Your fee depends on what your pump actually needs." },
  { t: "Locked", d: "Pricing is written down before we begin. No surprise fees, no escalations during the year." },
  { t: "Limited", d: "We only take as many dealers as we can serve well. Membership is closed during overload." },
  { t: "Lifted", d: "Onboarding within seven days. Old paperwork audited. You see a difference in the first cycle." },
];

export default function Membership() {
  return (
    <section id="membership" className="relative overflow-hidden bg-ink text-paper">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-paper/15" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-paper/15" />

      <div className="wrap-full relative py-24 md:py-36">
        <div className="grid items-end gap-8 md:grid-cols-12">
          <div className="md:col-span-8" data-reveal>
            <p className="eyebrow-on-seal">Membership <span className="mx-2">·</span> <span className="deva normal-case text-[14px] tracking-normal text-seal">सदस्यता</span></p>
            <h2
              className="mt-6 text-mega text-paper"
              style={{ fontSize: "clamp(40px, 7vw, 112px)" }}
            >
              Pay only for what
              <br />
              <span className="text-seal">your pump needs.</span>
            </h2>
          </div>

          <div className="md:col-span-4" data-reveal style={{ ["--reveal-delay" as any]: "120ms" }}>
            <p className="max-w-prose2 text-[17px] leading-[1.55] text-paper/80 md:text-[19px]">
              No tiers. No bundles. Your monthly fee depends on the
              services you choose, and is locked in writing before we
              begin.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="#contact" className="btn-on-seal">
                Reserve your slot
                <ArrowRight />
              </a>
              <a
                href="tel:18003456512"
                className="btn-on-seal-ghost"
              >
                Call to discuss
              </a>
            </div>
          </div>
        </div>

        <ol className="mt-16 grid gap-0 md:mt-24 md:grid-cols-4 md:gap-0">
          {promises.map((p, i) => (
            <li
              key={p.t}
              data-reveal
              style={{ ["--reveal-delay" as any]: `${i * 90}ms` }}
              className={
                "relative border-t border-paper/20 py-8 md:py-10 " +
                (i !== 0 ? "md:border-l md:border-l-paper/20 md:pl-8" : "md:pl-0") +
                " md:pr-8"
              }
            >
              <span className="num-serif tabular-nums text-paper/40 text-[28px] leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-display text-paper" style={{ fontSize: "clamp(22px, 2.4vw, 30px)", lineHeight: 1.05 }}>
                {p.t}
              </h3>
              <p className="mt-3 text-[15px] leading-[1.55] text-paper/75">
                {p.d}
              </p>
            </li>
          ))}
        </ol>

        <div
          className="mt-16 flex items-center gap-4 text-[11px] uppercase tracking-[0.22em] text-paper/70"
          data-reveal
          style={{ ["--reveal-delay" as any]: "420ms" }}
        >
          <span className="h-px w-10 bg-paper/40" />
          <span className="mono">Only a handful of slots left this quarter</span>
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
