type Service = {
  tag: string;
  title: string;
  body: string;
  bullets: string[];
};

const services: Service[] = [
  {
    tag: "SDMS",
    title: "SDMS Compliance Support",
    body: "We handle every line item on the SDMS portal so your dealership stays in the green.",
    bullets: [
      "Subsidy filings",
      "Work permits",
      "Safety & Swachta",
      "Monthly wages",
      "Declaration & DAR automation",
    ],
  },
  {
    tag: "MDG",
    title: "MDG Compliance Support",
    body: "Day-to-day operational compliance, audited and reconciled.",
    bullets: [
      "Stock variation monitoring",
      "DSR maintenance",
      "Density checks",
      "Toilet hygiene logs",
      "Sample inspection",
    ],
  },
  {
    tag: "Inspections",
    title: "Inspection Compliance Support",
    body: "Stay inspection-ready, always. We prep the records, you sleep at night.",
    bullets: [
      "Dhruva",
      "MDT",
      "QRC",
      "AAC",
      "Mobile lab & DO Team coordination",
    ],
  },
  {
    tag: "Reminders",
    title: "Document Reminder Support",
    body: "Regular reminders for important deadlines and document dates — so renewals never expire on a Sunday.",
    bullets: [
      "Licence renewal alerts",
      "Filing-window reminders",
      "Document expiry tracking",
    ],
  },
  {
    tag: "Automation",
    title: "Automation Functional Support",
    body: "Fault finding and smooth functioning of automation while abiding by the rules.",
    bullets: [
      "Issue diagnosis",
      "Vendor coordination",
      "Compliant configuration",
    ],
  },
  {
    tag: "Web Portal",
    title: "Web Portal Support",
    body: "Complaint registration and portal upkeep handled by trained operators.",
    bullets: [
      "Nozzle / tank / pipeline complaints",
      "Mock drills",
      "ATR fill-ups",
    ],
  },
  {
    tag: "XTRA",
    title: "XTRA Reward Campaign Support",
    body: "Hit the targets handed down by the OMC without lifting a finger.",
    bullets: [
      "Enrolment of new XtraRewards customers",
      "Promotional activity execution",
      "Campaign reporting",
    ],
  },
  {
    tag: "DOD & Stock",
    title: "DOD & Stock Punctuality Support",
    body: "Management of DOD facility, stock monitoring and timely reminders.",
    bullets: [
      "Stock-on-hand tracking",
      "Indenting reminders",
      "DOD facility oversight",
    ],
  },
  {
    tag: "Leadership",
    title: "Prepare Pro · Efficient Manager",
    body: "Industry expertise transferred to your on-site team.",
    bullets: [
      "Leadership development",
      "Team management",
      "Decision-making skills",
    ],
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-navy-50/60 py-20 md:py-28">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <div className="chip mx-auto">Program coverage</div>
          <h2 className="mt-4 text-3xl font-extrabold text-navy md:text-4xl">
            Everything the Dealer's <span className="text-coral">कवच</span>{" "}
            program covers
          </h2>
          <p className="mt-4 text-navy/70">
            A complete shield around your petrol pump — compliance,
            automation, inspections, campaigns and people.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <article
              key={s.title}
              className="card group relative overflow-hidden transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(34,36,107,0.35)]"
            >
              <div className="absolute right-4 top-4 font-display text-5xl font-extrabold text-navy/5 transition group-hover:text-coral/15">
                0{i + 1}
              </div>
              <span className="chip !bg-coral/10 !text-coral border-coral/20">
                {s.tag}
              </span>
              <h3 className="mt-4 font-display text-xl font-bold text-navy">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-navy/65">{s.body}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-navy/80">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="mt-0.5 shrink-0 text-coral"
                    >
                      <path
                        d="m5 12 4 4L19 6"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
