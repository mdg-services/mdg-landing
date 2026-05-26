import { useState } from "react";

const links = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#why-us", label: "Why us" },
  { href: "#membership", label: "Membership" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-navy/5 bg-white/80 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy text-white font-display font-bold">
            M
          </span>
          <span className="font-display text-lg font-extrabold text-navy">
            MDG <span className="text-coral">Services</span>
          </span>
        </a>
        <nav className="hidden gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-navy/70 transition hover:text-navy"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a href="tel:18003456512" className="text-sm font-semibold text-navy">
            1800-345-6512
          </a>
          <a href="#contact" className="btn-primary !py-2 !px-4 !text-xs">
            Get in touch
          </a>
        </div>
        <button
          aria-label="Toggle menu"
          className="md:hidden grid h-10 w-10 place-items-center rounded-lg border border-navy/15"
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-navy/5 bg-white">
          <div className="container-x flex flex-col py-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium text-navy/80"
              >
                {l.label}
              </a>
            ))}
            <a href="#contact" className="btn-primary mt-2 self-start">
              Get in touch
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
