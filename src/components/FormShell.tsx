import Link from "next/link";
import type { ReactNode } from "react";
import { LogoFull } from "./Brand";
import CallUs from "./CallUs";
import Footer from "./Footer";
import LanguageToggle from "./LanguageToggle";
import { Enter } from "../lib/enter";
import { getT } from "../i18n/server";
import { pathFor, twinOf, type Lang, type SiteRoute } from "../i18n/lang";

/**
 * The frame the enrolment and grievance pages share: a slim header, a navy
 * band with the heading, the page's form, and the footer. All of it is
 * server-rendered; only the form (`children`) is interactive.
 */
export default function FormShell({
  lang,
  route,
  backLabel,
  eyebrow,
  eyebrowDeva,
  heading,
  intro,
  extra,
  headingSize = "clamp(34px, 6vw, 72px)",
  children,
}: {
  lang: Lang;
  /** This page, as an English route, so the switch can find its twin. */
  route: SiteRoute;
  backLabel: string;
  eyebrow: string;
  /** The Devanagari gloss, printed only where it says something the eyebrow does not. */
  eyebrowDeva?: string;
  heading: string;
  /** Words, or words with a link in them (the company pages' intros). */
  intro: ReactNode;
  /** The smaller paragraph under the intro (the app link, or the call link). */
  extra: ReactNode;
  /** The heading's CSS font size; the company pages' headings are sentences and run smaller. */
  headingSize?: string;
  children: ReactNode;
}) {
  const t = getT(lang);
  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* slim header */}
      <header className="sticky top-0 z-40 border-b border-ink-hairline bg-paper/85 backdrop-blur">
        <div className="wrap-wide flex h-16 items-center justify-between md:h-[72px]">
          <Link href={pathFor(lang)} className="flex items-center gap-3" aria-label={t.ui.homeAria}>
            <LogoFull className="h-8 w-auto sm:h-9" priority />
            <span aria-hidden className="hidden h-6 w-px bg-ink-hairline sm:block" />
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted sm:block">
              Dealer's <span className="deva normal-case tracking-normal text-navy-700">कवच</span>
            </span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href={pathFor(lang)} className="link-quiet hidden text-[14px] font-medium text-ink-soft hover:text-ink sm:inline">
              ← {backLabel}
            </Link>
            <LanguageToggle twin={twinOf(route, lang)} />
            <CallUs className="text-[13.5px] font-semibold text-ink sm:text-[14px] [&_svg]:text-navy-700" />
          </div>
        </div>
      </header>

      <main>
        {/* hero band */}
        <section className="relative overflow-hidden bg-navy-950 text-white">
          <div aria-hidden className="absolute inset-0 bg-grid-dark opacity-40" />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-20 h-[22rem] w-[22rem] rounded-full sm:h-[26rem] sm:w-[26rem]"
            style={{ background: "radial-gradient(circle, rgba(245,165,36,.16), transparent 60%)" }}
          />
          <div className="wrap-wide relative py-12 sm:py-16 md:py-20">
            <Enter>
              {/* The Devanagari gloss is only printed where it says something the
                  eyebrow does not already say, and the dot goes with it. */}
              <p className="eyebrow-light">
                {eyebrow}
                {eyebrowDeva && (
                  <>
                    {" "}
                    <span className="text-white/30">·</span>{" "}
                    <span className="deva normal-case text-gold-300">{eyebrowDeva}</span>
                  </>
                )}
              </p>
            </Enter>
            <Enter delay={0.06}>
              <h1 className="mt-5 text-mega text-white" style={{ fontSize: headingSize }}>
                {heading}
              </h1>
            </Enter>
            <Enter delay={0.12}>
              <p className="mt-5 max-w-2xl text-[16px] leading-[1.6] text-navy-100 sm:text-[18px]">{intro}</p>
            </Enter>
            <Enter delay={0.16}>
              <p className="mt-6 max-w-2xl text-[15px] leading-[1.6] text-navy-200 sm:text-[16px]">{extra}</p>
            </Enter>
          </div>
        </section>

        {children}
      </main>

      <Footer lang={lang} />
    </div>
  );
}
