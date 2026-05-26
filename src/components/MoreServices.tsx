const extras = [
  {
    title: "Digital Payment Reconciliation",
    body: "Tally UPI, card and wallet settlements against pump receipts — daily, automatically.",
    icon: (
      <path
        d="M3 7h18M3 12h18M3 17h12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    ),
  },
  {
    title: "Cyber Security",
    body: "Basic dealership hygiene: secure logins, phishing awareness, safer portal use.",
    icon: (
      <path
        d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Quick Response for Safety",
    body: "Fast-track triage when something on-site goes wrong — we connect you to the right desk.",
    icon: (
      <path
        d="M12 2v6m0 0 3-3m-3 3-3-3M5 13a7 7 0 1 0 14 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Account Support",
    body: "Reconciliation, statements, and routine accounting follow-ups handled by the team.",
    icon: (
      <path
        d="M4 7h16v12H4zM4 11h16M9 15h2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    ),
  },
];

export default function MoreServices() {
  return (
    <section className="container-x py-16">
      <div className="mx-auto max-w-2xl text-center">
        <div className="chip mx-auto">More services</div>
        <h2 className="mt-4 text-3xl font-extrabold text-navy md:text-4xl">
          And a little more, because dealerships never sit still.
        </h2>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {extras.map((e) => (
          <div
            key={e.title}
            className="card flex flex-col gap-3 text-center items-center"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-coral/10 text-coral">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                {e.icon}
              </svg>
            </div>
            <h3 className="font-display text-base font-bold text-navy">
              {e.title}
            </h3>
            <p className="text-sm text-navy/65">{e.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
