type Entry = {
  day: string;
  dayHi?: string;
  date: string;
  item: string;
  meta?: string;
};

const week: Entry[] = [
  {
    day: "Mon",
    dayHi: "सोम",
    date: "10.06",
    item: "12 SDMS subsidy filings cleared for outlets in UP-East",
    meta: "Before 11am cut-off",
  },
  {
    day: "Tue",
    dayHi: "मंगल",
    date: "11.06",
    item: "Inspection-ready folders compiled for 3 pumps in Pune",
    meta: "Density logs, sample sheet, calibration record",
  },
  {
    day: "Wed",
    dayHi: "बुध",
    date: "12.06",
    item: "Fire NOC renewal initiated, district office filing",
    meta: "Avg. turnaround we hit: 9 days",
  },
  {
    day: "Thu",
    dayHi: "गुरु",
    date: "13.06",
    item: "Automation fault on a Dhruva DU resolved at 9.47pm",
    meta: "Vendor coordinated, outlet running by 11pm",
  },
  {
    day: "Fri",
    dayHi: "शुक्र",
    date: "14.06",
    item: "Weekly DAR / DSR variance review for 18 outlets",
    meta: "Three flagged early, fixed before month-end",
  },
  {
    day: "Sat",
    dayHi: "शनि",
    date: "15.06",
    item: "XTRA Rewards enrolment drive report sent to dealer-partners",
    meta: "Avg. targets hit: 112%",
  },
  {
    day: "Sun",
    dayHi: "रवि",
    date: "16.06",
    item: "On-call line stays open. Three queries handled.",
    meta: "Weekend rota, no extra cost",
  },
];

export default function Week() {
  return (
    <section
      aria-label="A typical week"
      className="bg-paper border-t border-ink-hairline"
    >
      <div className="wrap-full py-24 md:py-32">
        <header className="grid items-end gap-8 md:grid-cols-12">
          <div className="md:col-span-7" data-reveal>
            <p className="eyebrow">A typical week</p>
            <h2
              className="mt-5 text-display text-ink"
              style={{ fontSize: "clamp(36px, 5.4vw, 72px)" }}
            >
              Not theory. The work, week by week.
            </h2>
          </div>
          <div className="md:col-span-5" data-reveal style={{ ["--reveal-delay" as any]: "100ms" }}>
            <p className="max-w-prose2 text-[17px] leading-[1.55] text-ink-soft md:text-[18px]">
              An actual week, last quarter, anonymised. We log every action
              and send a digest to each dealer on Monday.
            </p>
            <p className="mt-5 mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
              <span className="deva text-[16px] normal-case tracking-normal text-seal">सप्ताह</span>
              <span className="ml-2">Saptaah · Week</span>
            </p>
          </div>
        </header>

        <ol className="mt-16 md:mt-20">
          {week.map((e, i) => (
            <li
              key={e.date}
              data-reveal
              style={{ ["--reveal-delay" as any]: `${i * 60}ms` }}
              className="grid grid-cols-12 items-baseline gap-x-6 gap-y-2 border-t border-ink-hairline py-7 md:gap-x-10 md:py-8"
            >
              <div className="col-span-3 md:col-span-2">
                <div className="text-display text-ink" style={{ fontSize: "clamp(20px, 1.9vw, 26px)" }}>
                  {e.day}
                  {e.dayHi && (
                    <span className="ml-2 deva text-[18px] text-seal">{e.dayHi}</span>
                  )}
                </div>
                <div className="mt-1 mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                  {e.date}
                </div>
              </div>

              <div className="col-span-9 md:col-span-7">
                <p className="text-[17px] leading-[1.5] text-ink md:text-[19px]">
                  {e.item}
                </p>
              </div>

              <div className="col-span-12 md:col-span-3 md:text-right">
                {e.meta && (
                  <p className="mono text-[12px] uppercase tracking-[0.18em] text-ink-muted">
                    {e.meta}
                  </p>
                )}
              </div>
            </li>
          ))}
          <li className="border-t border-ink-hairline" />
        </ol>
      </div>
    </section>
  );
}
