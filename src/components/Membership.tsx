export default function Membership() {
  return (
    <section
      id="membership"
      className="container-x py-20 md:py-24"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-navy-700 to-navy-900 px-8 py-16 text-white md:px-16">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-coral/30 blur-3xl" />
        <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative grid gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <div className="chip !bg-white/10 !text-white !border-white/20">
              Memberships Open
            </div>
            <h2 className="mt-4 text-3xl font-extrabold md:text-4xl">
              Registrations are open — for a limited number of dealers.
            </h2>
            <p className="mt-4 max-w-xl text-white/75">
              The subscription is fully customisable: pick the modules you
              need, leave the rest. Pricing varies with the services you
              choose, so you only pay for what genuinely moves the needle for
              your pump.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-white/80">
              {[
                "Customised service mix — built around your dealership",
                "Transparent pricing, no surprise add-ons",
                "Onboarding support and document audit included",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contact" className="btn-primary">
                Reserve your slot
              </a>
              <a
                href="tel:18003456512"
                className="btn-secondary !bg-white/10 !text-white !border-white/20 hover:!bg-white hover:!text-navy"
              >
                Call 1800-345-6512
              </a>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10 backdrop-blur">
              <div className="text-xs uppercase tracking-[0.3em] text-white/60">
                Important
              </div>
              <p className="mt-3 text-white/85">
                The subscription has an option to customise the services,
                resulting in varying prices. Registrations are open for{" "}
                <span className="font-semibold text-white">
                  selected members only
                </span>{" "}
                — hurry up.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/[0.06] p-3">
                  <div className="text-[10px] uppercase tracking-widest text-white/60">
                    Onboarding
                  </div>
                  <div className="text-sm font-bold">Within 7 days</div>
                </div>
                <div className="rounded-xl bg-white/[0.06] p-3">
                  <div className="text-[10px] uppercase tracking-widest text-white/60">
                    Support
                  </div>
                  <div className="text-sm font-bold">24 / 7</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
