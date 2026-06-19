import { Link } from "react-router-dom";
import { LogoFullWhite } from "./Brand";
import Icon from "./Icon";
import { BRAND } from "../data/content";

const explore = [
  { href: "/#services", label: "Services" },
  { href: "/#why", label: "Why us" },
  { href: "/#process", label: "Process" },
  { href: "/#membership", label: "Membership" },
  { href: "/#contact", label: "Get in touch" },
];

export default function Footer() {
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
              <span className="text-navy-100">{BRAND.promise}.</span>
            </p>
            <p className="mt-6 max-w-prose2 text-[14px] leading-[1.6] text-navy-200">
              {BRAND.tagline} — your satisfaction fuels our energy.
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <p className="eyebrow-light">Explore</p>
            <ul className="mt-6 space-y-3 text-[15px]">
              {explore.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="link-quiet text-navy-100 hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/register" className="link-quiet text-navy-100 hover:text-white">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow-light">Reach us</p>
            <ul className="mt-6 space-y-3.5 text-[15px]">
              <li>
                <a href={BRAND.phoneHref} className="inline-flex items-center gap-2 num font-semibold text-white">
                  <Icon name="phone" size={15} className="text-gold-400" />
                  1800&#8209;345&#8209;6512
                </a>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-navy-300">{BRAND.hours}</div>
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
          <p>© {new Date().getFullYear()} MDG Services. All rights reserved.</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em]">Made for India's fuel station dealers</p>
        </div>
      </div>
    </footer>
  );
}
