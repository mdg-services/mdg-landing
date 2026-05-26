export default function About() {
  return (
    <section id="about" className="container-x py-20 md:py-28">
      <div className="grid gap-12 md:grid-cols-12 md:items-center">
        <div className="md:col-span-5">
          <div className="chip">About MDG Services</div>
          <h2 className="mt-4 text-3xl font-extrabold text-navy md:text-4xl">
            Trailblazers in fuel station management since 2021.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-navy/70">
            MDG Services pioneers industry standards for petrol pump
            operations across India. We empower dealers with tailored
            solutions designed to{" "}
            <span className="font-semibold text-navy">
              maximise efficiency and profitability
            </span>{" "}
            — built on trust, transparency, and mutual success.
          </p>
          <p className="mt-4 text-base leading-relaxed text-navy/70">
            From OMC portal headaches to last-minute deadlines, our team
            stands between you and the paperwork that slows your business
            down.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="chip">Trust</span>
            <span className="chip">Transparency</span>
            <span className="chip">Mutual Success</span>
          </div>
        </div>
        <div className="md:col-span-7">
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                t: "Maximising Profitability",
                d: "Plug leaks, run tighter operations, capture every reward.",
              },
              {
                t: "Minimising Losses",
                d: "Stock variation monitoring, density checks, audit-ready records.",
              },
              {
                t: "Regulatory Compliance",
                d: "SDMS, MDG, Dhruva, MDT, QRC, AAC — all kept in good standing.",
              },
              {
                t: "Smooth Operations",
                d: "Automation fault finding, mock drills and ATR fillups handled.",
              },
            ].map((c) => (
              <div key={c.t} className="card">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-navy/10 text-navy">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="m5 12 4 4L19 6"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-navy">
                  {c.t}
                </h3>
                <p className="mt-1 text-sm text-navy/60">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
