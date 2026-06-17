/* The MDG mark — a group of people cradled in a cupped hand, inside a ring.
   Inherits currentColor so it works on light and dark surfaces. */
export function LogoMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role="img"
      aria-label="MDG Services"
      className={className}
      fill="currentColor"
    >
      <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="9" />
      <circle cx="66" cy="70" r="12" />
      <path d="M46 98c0-10 9-18 20-18s20 8 20 18v7H46z" />
      <circle cx="96" cy="60" r="14" />
      <path d="M72 90c0-12 11-22 24-22s24 10 24 22v7H72z" />
      <circle cx="130" cy="70" r="12" />
      <path d="M110 98c0-10 9-18 20-18s20 8 20 18v7h-40z" />
      <path d="M134 152c4 2 9 2 13 1l9-2c3-1 5 1 6 3 1 3-1 6-4 7l-13 5c-6 2-12 2-17 0z" />
      <path d="M46 134c-4-3-5-10-2-13 3-4 9-5 13-2l17 10c7 4 14 6 21 6h28c4 0 7 3 7 6 0 4-3 7-7 8l-23 4c-13 2-27 0-39-5z" />
      <path d="M46 134c-3-3-8-2-10 1-2 4-1 8 3 10l8 5 7-8z" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={"flex flex-col leading-none " + (className ?? "")}>
      <span className="font-display text-[15px] font-bold tracking-tight">MDG Services</span>
      <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
        Dealer's <span className="deva normal-case tracking-normal text-navy-700">कवच</span>
      </span>
    </span>
  );
}

/* A rounded-square lockup of the mark on a navy chip — used in nav + footer. */
export function LogoChip({ size = 40 }: { size?: number }) {
  return (
    <span
      className="grid place-items-center rounded-xl bg-navy-700 text-white shadow-navy"
      style={{ width: size, height: size }}
    >
      <LogoMark size={size * 0.62} />
    </span>
  );
}
