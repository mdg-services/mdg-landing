const reasons = [
  {
    t: "Never miss a deadline",
    d: "Calendar-driven workflows so renewals, filings and inspections always happen on time.",
  },
  {
    t: "Continuous monitoring",
    d: "Stock, density, automation and portal status — watched, logged, reported.",
  },
  {
    t: "All OMC portal headaches",
    d: "SDMS, MDG, Dhruva, AAC, QRC — one team, every portal, no excuses.",
  },
  {
    t: "24/7 support",
    d: "When something breaks at 11 PM on a Sunday, somebody picks up the phone.",
  },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="bg-navy text-white py-20 md:py-28">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6">
            <div className="chip !bg-white/10 !text-white !border-white/20">
              Why choose us?
            </div>
            <h2 className="mt-4 text-3xl font-extrabold md:text-4xl">
              We replace four problems
              <br />
              with one phone call.
            </h2>
          </div>
          <p className="md:col-span-6 text-white/70">
            We're built around the specific pain of running a fuel station in
            India — the portals, the inspectors, the OMC asks, the deadlines
            no one warned you about.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <div
              key={r.t}
              className="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10 backdrop-blur"
            >
              <div className="font-display text-3xl font-extrabold text-coral">
                0{i + 1}
              </div>
              <h3 className="mt-3 font-display text-lg font-bold">{r.t}</h3>
              <p className="mt-1 text-sm text-white/65">{r.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
