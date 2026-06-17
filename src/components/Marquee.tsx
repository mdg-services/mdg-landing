import { TOKENS } from "../data/content";

export default function Marquee() {
  const row = [...TOKENS, ...TOKENS];
  return (
    <section aria-label="Portals and registers we manage" className="border-b border-ink-hairline bg-white">
      <div className="wrap-full flex items-center gap-6 py-5 md:gap-10">
        <span className="hidden shrink-0 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted sm:block">
          We live inside
        </span>
        <div className="marquee-track relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="marquee gap-3">
            {row.map((t, i) => (
              <span
                key={t + i}
                className="flex shrink-0 items-center gap-2 rounded-full border border-ink-hairline bg-paper-warm px-3.5 py-1.5 font-mono text-[12px] font-medium tracking-wide text-ink-soft"
              >
                <span className="h-1.5 w-1.5 rotate-45 bg-navy-400" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
