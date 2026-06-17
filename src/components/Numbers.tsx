type Stat = {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
  hi?: string;
  note: string;
};

const stats: Stat[] = [
  { value: 1400, suffix: "+", label: "Dealers served", hi: "डीलर", note: "Across cooperatives, IOC, BPCL, HPCL" },
  { value: 14, label: "States", hi: "राज्य", note: "Hindi-belt, South, North-East" },
  { value: 9, label: "OMC portals managed", note: "SDMS, MDG, Dhruva, AAC, QRC and more" },
  { value: 4.6, decimals: 1, suffix: "h", label: "Avg. callback time", note: "9am to 9pm, 7 days a week" },
];

export default function Numbers() {
  return (
    <section
      aria-label="By the numbers"
      className="relative border-y border-ink-hairline bg-paper-warm"
    >
      <div className="wrap-full py-20 md:py-28">
        <div className="grid items-end gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-3" data-reveal>
            <p className="eyebrow">By the numbers</p>
            <h2 className="mt-5 text-display text-[28px] leading-[1.05] md:text-[36px]">
              Five years in.<br />
              <span className="deva text-seal">पाँच साल।</span>
            </h2>
          </div>

          <ul className="md:col-span-9 grid grid-cols-2 gap-x-8 gap-y-10 sm:gap-x-12 md:grid-cols-4">
            {stats.map((s, i) => (
              <li
                key={s.label}
                data-reveal
                style={{ ["--reveal-delay" as any]: `${i * 80}ms` }}
                className="border-t border-ink/20 pt-5"
              >
                <div className="num-serif text-ink tabular-nums" style={{ fontSize: "clamp(44px, 6.5vw, 84px)", lineHeight: 0.94 }}>
                  <span
                    data-counter={s.value}
                    data-counter-decimals={s.decimals ?? 0}
                    data-counter-suffix={s.suffix ?? ""}
                  >
                    0{s.suffix ?? ""}
                  </span>
                </div>
                <div className="mt-5 text-[15px] font-medium text-ink">
                  {s.label}
                  {s.hi && (
                    <span className="ml-2 deva text-[16px] text-seal">{s.hi}</span>
                  )}
                </div>
                <p className="mt-1.5 text-[13px] leading-[1.5] text-ink-muted">
                  {s.note}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
