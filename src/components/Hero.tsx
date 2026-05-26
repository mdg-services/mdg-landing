export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-navy text-white bg-hero-grid"
    >
      <div className="absolute inset-0 -z-0 opacity-30 [background:radial-gradient(circle_at_85%_15%,#E94B4B_0%,transparent_45%),radial-gradient(circle_at_10%_80%,#7A82D2_0%,transparent_40%)]" />
      <div className="container-x relative grid gap-12 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-7">
          <div className="chip border-white/20 bg-white/10 text-white">
            <span className="h-2 w-2 rounded-full bg-coral" />
            Memberships open · Limited slots
          </div>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
            Dealer's <span className="text-coral">कवच</span>
            <br />
            <span className="text-white/90">
              Your trusted shield for petrol pump operations
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/75">
            End-to-end compliance, automation and support for petrol pump
            dealers across India. From SDMS &amp; MDG portals to inspections,
            DAR, density checks and digital payment reconciliation — we run the
            paperwork so you can run the pump.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className="btn-primary">
              Talk to us
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14m0 0-6-6m6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="tel:18003456512"
              className="btn-secondary !bg-white/10 !text-white !border-white/20 hover:!bg-white hover:!text-navy"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.94.36 1.87.7 2.76a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.32-1.27a2 2 0 0 1 2.11-.45c.89.34 1.82.57 2.76.7A2 2 0 0 1 22 16.92Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Toll free · 1800-345-6512
            </a>
          </div>
          <div className="mt-10 grid max-w-md grid-cols-3 gap-6">
            {[
              { n: "2021", l: "Pioneering since" },
              { n: "24/7", l: "Dedicated support" },
              { n: "10+", l: "Service modules" },
            ].map((s) => (
              <div key={s.n}>
                <div className="font-display text-2xl font-extrabold">
                  {s.n}
                </div>
                <div className="text-xs uppercase tracking-wider text-white/60">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative md:col-span-5">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/10 to-white/0 ring-1 ring-white/15" />
            <div className="absolute inset-3 overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-coral/20 via-navy-700 to-navy-900 ring-1 ring-white/10">
              <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-coral/30 blur-3xl" />
              <div className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
              <div className="absolute inset-0 grid place-items-center p-6 text-center">
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-white/60">
                    Welcome
                  </div>
                  <div className="mt-3 font-display text-3xl font-extrabold">
                    Your Satisfaction
                    <br />
                    <span className="text-coral">Fuels</span> Our Energy
                  </div>
                  <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs">
                    mdgservices.in
                  </div>
                </div>
              </div>
            </div>
            <div className="animate-float absolute -bottom-6 -left-6 hidden rounded-2xl bg-white p-3 text-navy shadow-soft sm:block">
              <div className="text-[10px] uppercase tracking-widest text-navy/50">
                Never miss
              </div>
              <div className="text-sm font-bold">a single deadline</div>
            </div>
            <div className="animate-float absolute -right-4 top-8 hidden rounded-2xl bg-white p-3 text-navy shadow-soft sm:block">
              <div className="text-[10px] uppercase tracking-widest text-navy/50">
                Compliance
              </div>
              <div className="text-sm font-bold">SDMS · MDG · Inspections</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
