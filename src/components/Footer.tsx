import { Link } from "react-router-dom";
import { LogoFullWhite } from "./Brand";
import CallUs from "./CallUs";
import { BRAND } from "../data/content";
import { useT } from "../i18n";

/* The targets never change with the language; the labels are looked up by id. */
const explore = [
  { id: "services", href: "/#services" },
  { id: "why", href: "/#why" },
  { id: "process", href: "/#process" },
  { id: "membership", href: "/#membership" },
  { id: "contact", href: "/#contact" },
] as const;

export default function Footer() {
  const t = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white">
      <div aria-hidden className="absolute inset-0 bg-grid-dark opacity-30" />
      <div className="wrap-full relative pt-20 pb-12 md:pt-24">
        <div className="grid items-start gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <LogoFullWhite className="h-10 w-auto" />
            <p className="mt-7 font-display text-[24px] font-medium leading-[1.2] text-white md:text-[30px]">
              Dealer's <span className="deva text-gold-400">कवच</span>.
              <br />
              <span className="text-navy-100">{t.footer.promise}</span>
            </p>
            <p className="mt-6 max-w-prose2 text-[14px] leading-[1.6] text-navy-200">
              {t.footer.satisfaction.replace("{tagline}", BRAND.tagline)}
            </p>
            <p className="mt-6 max-w-prose2 text-[14px] leading-[1.6] text-navy-200">
              {t.footer.legalBeforeName}
              <span className="font-semibold text-white">{BRAND.legalName}</span>
              {t.footer.legalAfterName.replace("{cin}", BRAND.cin)}
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <p className="eyebrow-light">{t.footer.exploreHeading}</p>
            <ul className="mt-6 space-y-3 text-[15px]">
              {explore.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="link-quiet text-navy-100 hover:text-white">
                    {t.footer.explore[l.id]}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/register" className="link-quiet text-navy-100 hover:text-white">
                  {t.footer.register}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow-light">{t.footer.reachHeading}</p>
            <ul className="mt-6 space-y-3.5 text-[15px]">
              <li>
                <CallUs className="font-semibold text-white [&_svg]:text-gold-400" />
                <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-navy-300">{t.footer.hours}</div>
              </li>
              <li>
                <a href={`https://www.${BRAND.site}`} target="_blank" rel="noreferrer" className="link-quiet text-navy-100 hover:text-white">
                  {BRAND.site}
                </a>
              </li>
              <li>
                <a href={`mailto:${BRAND.email}`} className="link-quiet text-navy-100 hover:text-white">
                  {BRAND.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-[13px] text-navy-300 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <p>{t.footer.copyright.replace("{year}", String(year)).replace("{name}", BRAND.legalName)}</p>
            <p className="text-[12px] text-navy-400">
              {t.footer.brandLine.replace("{name}", BRAND.legalName).replace("{cin}", BRAND.cin)}
            </p>
            <p>
              <a href="/privacy" className="link-quiet text-navy-200 hover:text-white">
                {t.footer.privacy}
              </a>
            </p>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em]">{t.footer.madeFor}</p>
        </div>
      </div>
    </footer>
  );
}
