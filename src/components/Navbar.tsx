"use client";

import { useEffect, useState } from "react";
import { LogoFull } from "./Brand";
import CallUs from "./CallUs";
import LanguageToggle from "./LanguageToggle";
import { NAV } from "../data/content";
import { homeHref } from "../i18n/lang";
import { useLang } from "../i18n/client";

/**
 * The site's one header: the home page, the guides and anything else that wears
 * the full navbar.
 *
 * `onHome` is true on the home page itself, where the section links scroll
 * in place; anywhere else they go to the home page's section. `twin` is where
 * the other language's version of THIS page lives (the home page's twin for
 * the home page, the page's own twin on a guide).
 */
export default function Navbar({
  twin,
  onHome = false,
  current,
}: {
  twin: string;
  onHome?: boolean;
  current?: "guides";
}) {
  const { lang, t } = useLang();
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

  const section = (id: string) => (onHome ? `#${id}` : homeHref(lang, id));
  const guidesHref = lang === "hi" ? "/hi/guides/" : "/guides/";
  const items = [
    ...NAV.map((l) => ({ key: l.id, href: section(l.id), label: t.nav.items[l.id], here: false })),
    { key: "guides", href: guidesHref, label: t.nav.guides, here: current === "guides" },
  ];

  return (
    <header
      className="nav-in sticky top-0 z-50"
      style={{
        backgroundColor: scrolled ? "rgba(252,252,254,0.82)" : "rgba(252,252,254,0)",
        backdropFilter: scrolled ? "saturate(150%) blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "saturate(150%) blur(12px)" : "none",
        boxShadow: scrolled ? "inset 0 -1px 0 0 #E4E6F1" : "inset 0 -1px 0 0 transparent",
        transition: "background-color 240ms, box-shadow 240ms",
      }}
    >
      <div className="wrap-full flex h-16 items-center justify-between md:h-20">
        <a href={onHome ? "#top" : homeHref(lang)} className="flex items-center gap-3" aria-label={t.ui.homeAria}>
          <LogoFull className="h-8 w-auto sm:h-9" priority />
          <span aria-hidden className="hidden h-6 w-px bg-ink-hairline sm:block" />
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted sm:block">
            Dealer's <span className="deva normal-case tracking-normal text-navy-700">कवच</span>
          </span>
        </a>

        <nav className="hidden items-center gap-9 md:flex" aria-label={t.ui.primaryNavAria}>
          {items.map((l) => (
            <a
              key={l.key}
              href={l.href}
              aria-current={l.here ? "page" : undefined}
              className={
                "link-quiet text-[14px] font-medium hover:text-ink " + (l.here ? "text-navy-700" : "text-ink-soft")
              }
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Outside the burger on purpose: a Hindi reader has to be able to
              find the switch without first opening an English menu. */}
          <LanguageToggle twin={twin} />
          <CallUs
            className="hidden text-[14px] font-semibold text-ink hover:text-navy-700 lg:inline-flex [&_svg]:text-navy-700"
          />
          <a href={section("contact")} className="hidden md:inline-flex btn-primary !min-h-[44px] !px-5 !text-[13px]">
            {t.ui.talkToUs}
          </a>
          <button
            type="button"
            aria-label={open ? t.ui.closeMenu : t.ui.openMenu}
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
            {items.map((l) => (
              <a
                key={l.key}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={l.here ? "page" : undefined}
                className={"border-b border-ink-hairline py-4 text-[16px] font-medium " + (l.here ? "text-navy-700" : "text-ink")}
              >
                {l.label}
              </a>
            ))}
            <CallUs
              className="mt-5 text-[16px] font-semibold text-ink [&_svg]:text-navy-700"
            />
            <a href={section("contact")} onClick={() => setOpen(false)} className="btn-primary mt-4 self-stretch">
              {t.ui.talkToUs}
            </a>
            <LanguageToggle twin={twin} className="mt-5 self-start" />
          </div>
        </div>
      </div>
    </header>
  );
}
