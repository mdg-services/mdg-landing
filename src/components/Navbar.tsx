import { useEffect, useState } from "react";

const links = [
  { href: "#services", label: "The work" },
  { href: "#how", label: "Process" },
  { href: "#membership", label: "Membership" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className="sticky top-0 z-50 bg-paper/90"
      style={{
        backdropFilter: "saturate(140%) blur(8px)",
        WebkitBackdropFilter: "saturate(140%) blur(8px)",
        boxShadow: scrolled
          ? "inset 0 -1px 0 0 oklch(88% 0.008 60 / 1)"
          : "inset 0 -1px 0 0 transparent",
        transition: "box-shadow 240ms var(--ease-out-quart)",
      }}
    >
      <div className="wrap-full flex h-16 items-center justify-between md:h-20">
        <a href="#top" className="flex items-center gap-3" aria-label="MDG Services home">
          <Mark />
          <div className="hidden flex-col leading-none sm:flex">
            <span className="text-[14px] font-semibold tracking-tight text-ink">
              MDG Services
            </span>
            <span className="mt-1 mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
              Dealer's <span className="deva normal-case text-[12px] tracking-normal text-seal">कवच</span>
            </span>
          </div>
        </a>

        <nav className="hidden gap-9 md:flex" aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="link-quiet text-[14px] font-medium text-ink-soft hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:18003456512"
            className="hidden items-center gap-2 num-serif tabular-nums text-[14px] font-semibold text-ink sm:inline-flex"
          >
            <PhoneIcon />
            1800&#8209;345&#8209;6512
          </a>
          <a href="#contact" className="hidden md:inline-flex btn-seal !min-h-[44px] !px-5 !text-[13px]">
            Talk to us
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="grid h-11 w-11 place-items-center border border-ink/15 md:hidden"
            onClick={() => setOpen((o) => !o)}
            style={{ borderRadius: 2 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              {open ? (
                <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className="menu-panel border-t border-ink-hairline bg-paper md:hidden"
        data-open={open}
        aria-hidden={!open}
      >
        <div>
          <div className="wrap-full flex flex-col py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-ink-hairline py-4 text-[16px] font-medium text-ink"
              >
                {l.label}
              </a>
            ))}
            <a
              href="tel:18003456512"
              className="mt-5 inline-flex items-center gap-2 num-serif tabular-nums text-[16px] font-semibold text-ink"
            >
              <PhoneIcon />
              1800-345-6512
            </a>
            <a href="#contact" onClick={() => setOpen(false)} className="btn-seal mt-4 self-stretch">
              Talk to us
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function Mark() {
  return (
    <span
      aria-hidden
      className="grid h-9 w-9 place-items-center bg-ink text-paper"
      style={{ borderRadius: 2 }}
    >
      <span className="font-serif text-[15px] font-semibold leading-none">M</span>
    </span>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.94.36 1.87.7 2.76a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.32-1.27a2 2 0 0 1 2.11-.45c.89.34 1.82.57 2.76.7A2 2 0 0 1 22 16.92Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
