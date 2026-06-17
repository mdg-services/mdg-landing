const explore = [
  { href: "#services", label: "The work" },
  { href: "#how", label: "Process" },
  { href: "#membership", label: "Membership" },
  { href: "#contact", label: "Get in touch" },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink-hairline bg-paper">
      <div className="wrap-full pt-20 pb-12 md:pt-24">
        <div className="grid items-start gap-12 md:grid-cols-12 md:gap-14">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="grid h-10 w-10 place-items-center bg-ink text-paper"
                style={{ borderRadius: 2 }}
              >
                <span className="font-serif text-[16px] font-semibold leading-none">M</span>
              </span>
              <span className="text-[16px] font-semibold tracking-tight text-ink">
                MDG Services
              </span>
            </div>

            <p
              className="mt-8 text-display text-ink"
              style={{ fontSize: "clamp(24px, 2.6vw, 34px)", lineHeight: 1.15 }}
            >
              Dealer's <span className="deva text-seal">कवच</span>.<br />
              Compliance, paperwork and on-call support for petrol pump dealers across India.
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="eyebrow">Explore</div>
            <ul className="mt-6 space-y-3 text-[15px]">
              {explore.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="link-quiet text-ink">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="eyebrow">Reach us</div>
            <ul className="mt-6 space-y-3 text-[15px]">
              <li>
                <a href="tel:18003456512" className="link-quiet num-serif tabular-nums text-ink">
                  1800&#8209;345&#8209;6512
                </a>
                <span className="ml-3 mono text-[12px] uppercase tracking-[0.2em] text-ink-muted">
                  9 – 9, daily
                </span>
              </li>
              <li>
                <a href="https://www.mdgservices.in" target="_blank" rel="noreferrer" className="link-quiet text-ink">
                  mdgservices.in
                </a>
              </li>
              <li>
                <a href="mailto:hello@mdgservices.in" className="link-quiet text-ink">
                  hello@mdgservices.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-3 border-t border-ink-hairline pt-6 text-[13px] text-ink-muted sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} MDG Services. All rights reserved.</p>
          <p className="mono text-[11px] uppercase tracking-[0.22em]">
            Made for India's fuel station dealers
          </p>
        </div>
      </div>
    </footer>
  );
}
