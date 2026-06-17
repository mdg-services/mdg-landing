import { useEffect, useRef, useState } from "react";

type Service = {
  num: string;
  numDeva: string;
  title: string;
  body: string;
  covers: string[];
  weekly: string;
};

const services: Service[] = [
  {
    num: "01",
    numDeva: "०१",
    title: "OMC portals, all of them",
    body: "SDMS, MDG, Dhruva, AAC, QRC. We file, update and follow up on every entry so your dealership stays in good standing.",
    covers: ["Subsidy filings", "DAR & DSR", "Monthly wages", "Declarations"],
    weekly: "~ 60 entries per outlet, per week",
  },
  {
    num: "02",
    numDeva: "०२",
    title: "Inspections, ready in advance",
    body: "Records, logs and samples are kept inspection-ready year-round. When the team shows up, nothing is missing.",
    covers: ["Density checks", "Stock variation", "Sample logs", "Mobile lab"],
    weekly: "Pre-inspection folder, every Friday",
  },
  {
    num: "03",
    numDeva: "०३",
    title: "Document and deadline reminders",
    body: "We track every licence, renewal and filing window. You get a clear reminder before anything expires.",
    covers: ["Licences", "Weights & measures", "Explosives", "Fire NOC"],
    weekly: "Tracking 22 deadline windows on average",
  },
  {
    num: "04",
    numDeva: "०४",
    title: "Automation that actually runs",
    body: "When automation breaks at 9pm on a Sunday, somebody picks up. We diagnose, coordinate vendors and keep you compliant.",
    covers: ["Fault diagnosis", "Vendor coordination", "Compliant config"],
    weekly: "Average response: under 30 minutes",
  },
  {
    num: "05",
    numDeva: "०५",
    title: "XTRA rewards and campaigns",
    body: "OMC reward targets, enrolment drives and promotional activity, executed and reported without you lifting a finger.",
    covers: ["Customer enrolment", "Campaign reporting", "Target chasing"],
    weekly: "Monthly campaign report on the 2nd",
  },
  {
    num: "06",
    numDeva: "०६",
    title: "Payments, stock and accounts",
    body: "Reconciliation of UPI, card and wallet receipts, stock-on-hand watch, DOD oversight, and the small accounting follow-ups.",
    covers: ["Reconciliation", "Stock alerts", "DOD facility", "Statements"],
    weekly: "Daily reconciliation by 11am",
  },
];

export default function Services() {
  const [active, setActive] = useState<string>(services[0].num);
  const rowsRef = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        let bestNum: string | null = null;
        let bestRatio = -1;
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > bestRatio) {
            bestNum = (e.target as HTMLElement).dataset.num ?? null;
            bestRatio = e.intersectionRatio;
          }
        });
        if (bestNum) setActive(bestNum);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    rowsRef.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="services" className="bg-paper">
      <div className="wrap-full py-24 md:py-36">
        <header className="grid items-end gap-8 md:grid-cols-12">
          <div className="md:col-span-8" data-reveal>
            <p className="eyebrow">The work</p>
            <h2
              className="mt-5 text-display text-ink"
              style={{ fontSize: "clamp(36px, 5.6vw, 76px)" }}
            >
              Six jobs that <span className="text-seal">stop being yours</span>{" "}
              the day we start.
            </h2>
          </div>
          <div className="md:col-span-4" data-reveal style={{ ["--reveal-delay" as any]: "100ms" }}>
            <p className="max-w-prose2 text-[17px] leading-[1.55] text-ink-soft md:text-[18px]">
              Each job below is sold on its own. Pick what fits your pump,
              skip what does not.
            </p>
            <p className="mt-5 mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
              <span className="deva text-[16px] normal-case tracking-normal text-seal">सेवाएँ</span>
              <span className="ml-2">Services</span>
            </p>
          </div>
        </header>

        <div className="mt-20 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-14">
          {/* Sticky rail / index on desktop */}
          <aside className="hidden md:col-span-3 md:block">
            <div className="sticky top-28">
              <p className="eyebrow">Index</p>
              <ol className="mt-5 space-y-2.5">
                {services.map((s) => (
                  <li key={s.num}>
                    <a
                      href={`#svc-${s.num}`}
                      className={
                        "block text-[14px] leading-[1.35] transition-colors duration-200 " +
                        (active === s.num ? "text-seal" : "text-ink-muted hover:text-ink")
                      }
                      style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
                    >
                      <span className="num-serif tabular-nums mr-3 text-ink-faint">{s.num}</span>
                      {s.title.split(",")[0]}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          {/* Long reading list */}
          <ol className="md:col-span-9">
            {services.map((s, i) => (
              <li
                key={s.num}
                ref={(el) => { rowsRef.current[i] = el; }}
                id={`svc-${s.num}`}
                data-num={s.num}
                data-active={active === s.num}
                data-reveal
                style={{ ["--reveal-delay" as any]: `${i * 50}ms` }}
                className="svc-row group grid grid-cols-12 items-baseline gap-y-5 gap-x-6 border-t border-ink-hairline py-12 md:gap-x-10 md:py-16"
              >
                <div className="col-span-3 md:col-span-2">
                  <div className="num-serif tabular-nums text-ink-soft" style={{ fontSize: "clamp(28px, 3.4vw, 48px)", lineHeight: 0.96 }}>
                    {s.num}
                  </div>
                  <div className="mt-3 mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                    {s.numDeva} <span className="text-ink-faint">·</span> No.
                  </div>
                </div>

                <div className="col-span-9 md:col-span-6">
                  <h3
                    className="text-display text-ink"
                    style={{ fontSize: "clamp(22px, 2.6vw, 36px)", lineHeight: 1.1 }}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-5 max-w-[58ch] text-[16px] leading-[1.6] text-ink-soft md:text-[17px]">
                    {s.body}
                  </p>
                  <p className="mt-5 mono text-[12px] uppercase tracking-[0.2em] text-seal">
                    {s.weekly}
                  </p>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <p className="eyebrow">Includes</p>
                  <ul className="mt-3 grid grid-cols-2 gap-x-5 gap-y-1.5 text-[14px] text-ink-muted md:grid-cols-1">
                    {s.covers.map((c) => (
                      <li key={c} className="flex items-start gap-2.5">
                        <span className="mt-[9px] inline-block h-px w-3 shrink-0 bg-seal" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
            <div className="border-t border-ink-hairline" />
          </ol>
        </div>
      </div>
    </section>
  );
}
