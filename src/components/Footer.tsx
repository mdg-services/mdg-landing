import Link from "next/link";
import { LogoFullWhite } from "./Brand";
import CallUs from "./CallUs";
import { BRAND } from "../data/content";
import { getT } from "../i18n/server";
import { homeHref, pathFor, type Lang } from "../i18n/lang";

/* The targets never change with the language; the labels are looked up by id. */
const explore = ["services", "film", "why", "process", "contact"] as const;

/* The company pages' targets never change with the language either; labels by id. */
const company = [
  { id: "about", route: "/about" },
  { id: "contact", route: "/contact" },
  { id: "pricing", route: "/pricing" },
] as const;
const policies = [
  { id: "terms", route: "/terms" },
  { id: "refund", route: "/refund-policy" },
  { id: "shipping", route: "/shipping" },
] as const;

export default function Footer({ lang }: { lang: Lang }) {
  const t = getT(lang);
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white">
      <div aria-hidden className="absolute inset-0 bg-grid-dark opacity-30" />
      {/* the foot has room under the last line: the floating assistant button (right) and call pill (left) rest there instead of on the text */}
      <div className="wrap-full relative pt-20 pb-24 md:pt-24">
        <div className="grid items-start gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <LogoFullWhite className="h-10 w-auto" />
            <p className="mt-7 font-display text-[24px] font-medium leading-[1.2] text-white md:text-[30px]">
              Dealer's <span className="deva text-gold-400">कवच</span> <span className="text-navy-300">&amp;</span>{" "}
              {lang === "hi" ? <span className="deva text-gold-400">खाता कवच</span> : <span className="text-gold-400">Khata Kavach</span>}.
            </p>
            <p className="mt-3 max-w-[22rem] text-[19px] leading-[1.4] text-navy-100">{t.footer.promise}</p>
            <p className="mt-6 max-w-prose2 text-[14px] leading-[1.6] text-navy-200">
              {t.footer.satisfaction.replace("{tagline}", BRAND.tagline)}
            </p>
            <p className="mt-6 max-w-prose2 text-[14px] leading-[1.6] text-navy-200">
              {t.footer.legalBeforeName}
              <span className="font-semibold text-white">{BRAND.legalName}</span>
              {t.footer.legalAfterName.replace("{cin}", BRAND.cin)}
            </p>
            <p className="mt-4 max-w-prose2 text-[14px] leading-[1.6] text-navy-200">
              {t.footer.whatsappBefore}
              <span className="font-semibold text-white">{BRAND.whatsappNames[0]}</span>
              {t.footer.whatsappJoin}
              <span className="font-semibold text-white">{BRAND.whatsappNames[1]}</span>
              {t.footer.whatsappAfter}
            </p>
          </div>

          <div className="md:col-span-2 md:col-start-6">
            <p className="eyebrow-light">{t.footer.exploreHeading}</p>
            <ul className="mt-6 space-y-3 text-[15px]">
              {explore.map((id) => (
                <li key={id}>
                  <a href={homeHref(lang, id)} className="link-quiet tap-pad text-navy-100 hover:text-white">
                    {t.footer.explore[id]}
                  </a>
                </li>
              ))}
              <li>
                <Link href={pathFor(lang, "/register")} className="link-quiet tap-pad text-navy-100 hover:text-white">
                  {t.footer.register}
                </Link>
              </li>
              <li>
                <Link href={pathFor(lang, "/grievance")} className="link-quiet tap-pad text-navy-100 hover:text-white">
                  {t.footer.grievance}
                </Link>
              </li>
              <li>
                {/* The guides keep a trailing slash on their addresses, so this is a plain link */}
                <a href={lang === "hi" ? "/hi/guides/" : "/guides/"} className="link-quiet tap-pad text-navy-100 hover:text-white">
                  {t.footer.mdgGuide}
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="eyebrow-light">{t.footer.appsHeading}</p>
            <ul className="mt-6 space-y-3 text-[15px]">
              <li>
                <a href={homeHref(lang, "services")} className="link-quiet tap-pad text-navy-100 hover:text-white">
                  {t.footer.dealerApp}
                </a>
                <a
                  href={BRAND.playStore}
                  target="_blank"
                  rel="noopener"
                  className="link-quiet tap-pad mt-1 block text-[13.5px] text-navy-300 hover:text-white"
                >
                  {t.ui.getApp} · Google Play
                </a>
              </li>
              <li>
                <Link href={pathFor(lang, "/khata-kavach")} className="link-quiet tap-pad text-navy-100 hover:text-white">
                  {t.footer.khataApp}
                </Link>
                {/* the Khata Kavach guides keep a trailing slash on their addresses, so this is a plain link */}
                <a
                  href={lang === "hi" ? "/hi/khata-kavach/guides/" : "/khata-kavach/guides/"}
                  className="link-quiet tap-pad mt-1 block text-[13.5px] text-navy-300 hover:text-white"
                >
                  {t.footer.khataGuides}
                </a>
                {/* not a link: the Android app is not on Google Play yet */}
                <p className="mt-1 text-[13.5px] leading-snug text-navy-300">{t.footer.khataAndroid}</p>
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
                {/* this very site: the home page of the language being read, in the same tab */}
                <a href={homeHref(lang)} className="link-quiet tap-pad text-navy-100 hover:text-white">
                  {BRAND.site}
                </a>
              </li>
              <li>
                <a href={`mailto:${BRAND.email}`} className="link-quiet tap-pad text-navy-100 hover:text-white">
                  {BRAND.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* The company and its policies: who we are, what it costs, and the rules a customer is under. The pages a payment provider's review looks for are all linked from here, on every page. */}
        <div className="mt-16 grid gap-10 border-t border-white/10 pt-10 md:grid-cols-12">
          <nav aria-label={t.footer.companyHeading} className="md:col-span-4">
            <p className="eyebrow-light">{t.footer.companyHeading}</p>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2.5 text-[15px]">
              {company.map((c) => (
                <li key={c.route}>
                  <Link href={pathFor(lang, c.route)} className="link-quiet tap-pad text-navy-100 hover:text-white">
                    {t.footer.company[c.id]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label={t.footer.policiesHeading} className="md:col-span-8">
            <p className="eyebrow-light">{t.footer.policiesHeading}</p>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2.5 text-[15px]">
              {policies.map((c) => (
                <li key={c.route}>
                  <Link href={pathFor(lang, c.route)} className="link-quiet tap-pad text-navy-100 hover:text-white">
                    {t.footer.policies[c.id]}
                  </Link>
                </li>
              ))}
              <li>
                {/* the privacy page is one static page, in English only: a plain link */}
                <a href="/privacy" className="link-quiet tap-pad text-navy-100 hover:text-white">
                  {t.footer.privacy}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-[13px] text-navy-300 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <p>{t.footer.copyright.replace("{year}", String(year)).replace("{name}", BRAND.legalName)}</p>
            <p className="text-[12px] text-navy-400">
              {t.footer.brandLine.replace("{name}", BRAND.legalName).replace("{cin}", BRAND.cin)}
            </p>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em]">{t.footer.madeFor}</p>
        </div>
      </div>
    </footer>
  );
}
