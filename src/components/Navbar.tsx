"use client";

import { useEffect, useRef, useState } from "react";
import { KkMark, LogoFull } from "./Brand";
import CallUs from "./CallUs";
import LanguageToggle from "./LanguageToggle";
import { NAV } from "../data/content";
import { homeHref, pathFor } from "../i18n/lang";
import { useLang } from "../i18n/client";

/** One link in the bar. */
export type NavItem = { key: string; href: string; label: string; here?: boolean };

/**
 * The site's one header: the home page, the guides, the Khata Kavach page and
 * anything else that wears the full navbar.
 *
 * `onHome` is true on the home page itself, where the section links scroll
 * in place; anywhere else they go to the home page's section. `twin` is where
 * the other language's version of THIS page lives (the home page's twin for
 * the home page, the page's own twin on a guide).
 *
 * "Products" opens a small menu with both apps, so Khata Kavach has a first
 * level place without a sixth link crowding the bar. `current="khata"` is the
 * Khata Kavach page: it brings its own `items` (its own sections), its own
 * call to action (`cta`), and names itself beside the logo.
 */
export default function Navbar({
  twin,
  onHome = false,
  current,
  items: itemsOverride,
  cta,
}: {
  twin: string;
  onHome?: boolean;
  current?: "guides" | "khata";
  /** Replaces the home page's section links (the Khata Kavach page's own sections). */
  items?: NavItem[];
  /** Where "Talk to us" goes; the home page's contact section when left out. */
  cta?: { href: string; label?: string };
}) {
  const { lang, t } = useLang();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuWrap = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

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

  // The Products menu closes on a click outside it and on Escape, and Escape
  // hands focus back to the button that opened it.
  useEffect(() => {
    if (!menu) return;
    const onDown = (e: MouseEvent) => {
      if (!menuWrap.current?.contains(e.target as Node)) setMenu(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  const section = (id: string) => (onHome ? `#${id}` : homeHref(lang, id));
  const guidesHref = lang === "hi" ? "/hi/guides/" : "/guides/";
  const khataHref = pathFor(lang, "/khata-kavach");
  const items: NavItem[] =
    itemsOverride ?? [
      // "The app" is now a row of the Products menu; the other links stay.
      ...NAV.filter((l) => l.id !== "services").map((l) => ({
        key: l.id,
        href: section(l.id),
        label: t.nav.items[l.id],
        here: false,
      })),
      { key: "guides", href: guidesHref, label: t.nav.guides, here: current === "guides" },
    ];
  const talkHref = cta?.href ?? section("contact");
  const talkLabel = cta?.label ?? t.ui.talkToUs;

  /** The two apps, as the Products menu and the phone menu both list them. */
  const products = [
    { key: "dealer", href: section("services"), name: t.nav.dealerKavach.name, note: t.nav.dealerKavach.note, here: false },
    { key: "khata", href: khataHref, name: t.nav.khata.name, note: t.nav.khata.note, here: current === "khata" },
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
          {/* the tag line goes where the menu needs the room (1024-1279px) */}
          <span aria-hidden className="hidden h-6 w-px bg-ink-hairline sm:block lg:hidden xl:block" />
          {current === "khata" ? (
            <span className="hidden text-[15px] font-semibold text-kk-siyahi sm:block lg:hidden xl:block">{t.nav.khata.name}</span>
          ) : (
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted sm:block lg:hidden xl:block">
              Dealer's <span className="deva normal-case tracking-normal text-navy-700">कवच</span>
            </span>
          )}
        </a>

        <nav className="hidden items-center gap-4 lg:flex xl:gap-9" aria-label={t.ui.primaryNavAria}>
          <div
            ref={menuWrap}
            className="relative"
            onBlur={(e) => {
              // tabbing out of the menu closes it
              if (menu && !e.currentTarget.contains(e.relatedTarget as Node | null)) setMenu(false);
            }}
          >
            <button
              ref={menuButton}
              type="button"
              aria-expanded={menu}
              aria-controls="products-menu"
              onClick={() => setMenu((m) => !m)}
              className={
                "inline-flex min-h-[44px] items-center gap-1.5 whitespace-nowrap text-[14px] font-medium hover:text-ink " +
                (current === "khata" || menu ? "text-navy-700" : "text-ink-soft")
              }
            >
              {t.nav.products}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden style={{ transform: menu ? "rotate(180deg)" : "none", transition: "transform 200ms" }}>
                <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {menu && (
              <div
                id="products-menu"
                role="group"
                aria-label={t.nav.productsAria}
                className="absolute left-0 top-full z-10 mt-1 w-[340px] rounded-2xl bg-white p-2 shadow-lift"
              >
                {products.map((p) => (
                  <a
                    key={p.key}
                    href={p.href}
                    aria-current={p.here ? "page" : undefined}
                    onClick={() => setMenu(false)}
                    className="flex min-h-[60px] items-center gap-3.5 rounded-xl px-3.5 py-2.5 hover:bg-paper-warm"
                  >
                    {p.key === "khata" ? (
                      <KkMark small className="h-9 w-auto shrink-0" />
                    ) : (
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-navy-700 deva text-[15px] text-white">कवच</span>
                    )}
                    <span className="min-w-0">
                      <span className="block text-[15px] font-semibold leading-tight text-ink">{p.name}</span>
                      <span className="mt-0.5 block text-[13.5px] leading-snug text-ink-soft">{p.note}</span>
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
          {items.map((l) => (
            <a
              key={l.key}
              href={l.href}
              aria-current={l.here ? "page" : undefined}
              className={
                "link-quiet whitespace-nowrap text-[14px] font-medium hover:text-ink " + (l.here ? "text-navy-700" : "text-ink-soft")
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
          {/* 1024-1279px: the handset alone; from 1280px, with its words */}
          <CallUs variant="icon" className="hidden text-ink hover:text-navy-700 lg:inline-flex xl:hidden [&_svg]:text-navy-700" />
          <CallUs
            className="hidden whitespace-nowrap text-[14px] font-semibold text-ink hover:text-navy-700 xl:inline-flex [&_svg]:text-navy-700"
          />
          <a href={talkHref} className="hidden whitespace-nowrap btn-primary !min-h-[44px] !px-5 !text-[13px] lg:inline-flex">
            {talkLabel}
          </a>
          <button
            type="button"
            aria-label={open ? t.ui.closeMenu : t.ui.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="grid h-11 w-11 place-items-center rounded-lg border border-ink/15 bg-white lg:hidden"
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
        className="menu-panel border-t border-ink-hairline bg-paper/95 backdrop-blur lg:hidden"
        data-open={open}
        aria-hidden={!open}
        inert={!open}
      >
        <div>
          <div className="wrap-full flex flex-col py-4">
            {/* the two apps first: two large rows */}
            <p className="pb-1 pt-1 text-[14px] font-semibold text-ink-muted">{t.nav.products}</p>
            <div className="grid gap-2 pb-4">
              {products.map((p) => (
                <a
                  key={p.key}
                  href={p.href}
                  onClick={() => setOpen(false)}
                  aria-current={p.here ? "page" : undefined}
                  className={"flex min-h-[64px] items-center gap-3.5 rounded-2xl px-4 py-3 " + (p.here ? "bg-navy-50" : "bg-paper-warm")}
                >
                  {p.key === "khata" ? (
                    <KkMark small className="h-10 w-auto shrink-0" />
                  ) : (
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-navy-700 deva text-[16px] text-white">कवच</span>
                  )}
                  <span className="min-w-0">
                    <span className="block text-[17px] font-semibold leading-tight text-ink">{p.name}</span>
                    <span className="mt-0.5 block text-[14.5px] leading-snug text-ink-soft">{p.note}</span>
                  </span>
                </a>
              ))}
            </div>
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
            <a href={talkHref} onClick={() => setOpen(false)} className="btn-primary mt-4 self-stretch">
              {talkLabel}
            </a>
            <LanguageToggle twin={twin} className="mt-5 self-start" />
          </div>
        </div>
      </div>
    </header>
  );
}
