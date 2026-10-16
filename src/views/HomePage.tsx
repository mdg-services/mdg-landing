import ScrollProgress from "../components/ScrollProgress";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import Numbers from "../components/Numbers";
import Problem from "../components/Problem";
import Training from "../components/Training";
import Services from "../components/Services";
import MoreServices from "../components/MoreServices";
import WhyUs from "../components/WhyUs";
import Mission from "../components/Mission";
import Process from "../components/Process";
import Membership from "../components/Membership";
import Contact from "../components/Contact";
import FAQ from "../components/FAQ";
import HomeGuides from "../components/HomeGuides";
import Footer from "../components/Footer";
import { getT } from "../i18n/server";
import { twinOf, type Lang } from "../i18n/lang";

/**
 * The home page, server-rendered in one language: `/` is English, `/hi` is
 * Hindi, and everything on it comes from that language's dictionary.
 */
export default function HomePage({ lang }: { lang: Lang }) {
  const t = getT(lang);
  return (
    <div className="min-h-screen bg-paper text-ink">
      <ScrollProgress />
      <Navbar onHome twin={twinOf("", lang)} />
      <main>
        <Hero lang={lang} />
        <Marquee lang={lang} />
        <Numbers lang={lang} />
        <Problem lang={lang} />
        <Services lang={lang} />
        <MoreServices lang={lang} />
        <WhyUs lang={lang} />
        <Mission lang={lang} />
        <Process lang={lang} />
        <Training lang={lang} />
        <Membership lang={lang} />
        <Contact c={t.contact} />
        <HomeGuides lang={lang} />
        <FAQ faq={t.faq} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}
