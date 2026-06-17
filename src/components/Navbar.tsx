import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { LogoChip } from "./Brand";
import Icon from "./Icon";
import { BRAND } from "../data/content";

const links = [
  { href: "#services", label: "Services" },
  { href: "#why", label: "Why us" },
  { href: "#process", label: "Process" },
  { href: "#membership", label: "Membership" },
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
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50"
      style={{
        backgroundColor: scrolled ? "rgba(252,252,254,0.82)" : "rgba(252,252,254,0)",
        backdropFilter: scrolled ? "saturate(150%) blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "saturate(150%) blur(12px)" : "none",
        boxShadow: scrolled ? "inset 0 -1px 0 0 #E4E6F1" : "inset 0 -1px 0 0 transparent",
        transition: "background-color 240ms, box-shadow 240ms",
      }}
    >
      <div className="wrap-full flex h-16 items-center justify-between md:h-20">
        <a href="#top" className="flex items-center gap-3" aria-label="MDG Services home">
          <LogoChip size={40} />
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-[15px] font-bold tracking-tight text-ink">MDG Services</span>
            <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
              Dealer's <span className="deva normal-case tracking-normal text-navy-700">कवच</span>
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="link-quiet text-[14px] font-medium text-ink-soft hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href={BRAND.phoneHref} className="hidden items-center gap-2 num text-[14px] font-semibold text-ink lg:inline-flex">
            <Icon name="phone" size={15} className="text-navy-700" />
            1800&#8209;345&#8209;6512
          </a>
          <a href="#contact" className="hidden md:inline-flex btn-primary !min-h-[44px] !px-5 !text-[13px]">
            Talk to us
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="grid h-11 w-11 place-items-center rounded-lg border border-ink/15 bg-white md:hidden"
            onClick={() => setOpen((o) => !o)}
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
        className="menu-panel border-t border-ink-hairline bg-paper/95 backdrop-blur md:hidden"
        data-open={open}
        aria-hidden={!open}
        inert={!open}
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
            <a href={BRAND.phoneHref} className="mt-5 inline-flex items-center gap-2 num text-[16px] font-semibold text-ink">
              <Icon name="phone" size={16} className="text-navy-700" /> {BRAND.phone}
            </a>
            <a href="#contact" onClick={() => setOpen(false)} className="btn-primary mt-4 self-stretch">
              Talk to us
            </a>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
