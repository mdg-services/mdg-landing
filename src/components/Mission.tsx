const values = [
  "Maximising Profitability",
  "Minimising Losses",
  "Regulatory Compliance",
  "Dedicated Support",
  "Smooth Operations",
  "Regular Updates and Monitoring",
  "Never miss any Deadline",
];

export default function Mission() {
  return (
    <section className="container-x py-20 md:py-24">
      <div className="grid gap-12 md:grid-cols-12 md:items-center">
        <div className="md:col-span-5">
          <div className="chip">Our mission &amp; values</div>
          <h2 className="mt-4 text-3xl font-extrabold text-navy md:text-4xl">
            Built on the simple promise of
            <span className="text-coral"> Fueling Success.</span>
          </h2>
          <blockquote className="mt-6 border-l-2 border-coral pl-5 italic text-navy/70">
            "Your Trusted Partner in Petrol Pump Excellence."
          </blockquote>
          <p className="mt-6 text-navy/70">
            We don't just file forms. We build long-term partnerships rooted
            in trust, transparency and the shared goal of a smoother, more
            profitable dealership.
          </p>
        </div>
        <div className="md:col-span-7">
          <ul className="grid gap-3 sm:grid-cols-2">
            {values.map((v) => (
              <li
                key={v}
                className="flex items-center gap-3 rounded-xl border border-navy/10 bg-white px-4 py-3 text-sm font-semibold text-navy"
              >
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy text-white">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="m5 12 4 4L19 6"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {v}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
