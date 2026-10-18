import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollProgress from "../components/ScrollProgress";
import KkHero from "../components/kk/KkHero";
import KkProblem from "../components/kk/KkProblem";
import KkFlow from "../components/kk/KkFlow";
import KkPump from "../components/kk/KkPump";
import KkTransporter from "../components/kk/KkTransporter";
import KkNozzle from "../components/kk/KkNozzle";
import KkTrust from "../components/kk/KkTrust";
import KkFaq from "../components/kk/KkFaq";
import KkCta from "../components/kk/KkCta";
import { KK_ANCHORS } from "../data/kk";
import { getT } from "../i18n/server";
import { twinOf, type Lang } from "../i18n/lang";

/**
 * /khata-kavach and /hi/khata-kavach: the page for MDG Services' second
 * product. Server-rendered in one language. Only the call-back form is client
 * code; the nozzle demo runs on radio buttons and CSS.
 *
 * Its navbar carries this page's own links (how it works, pump owner,
 * transporter, questions) instead of the home page's, because the home page's
 * links (why us, pricing) are about Dealer's Kavach and would take a reader
 * off this page.
 */
export default function KhataKavachPage({ lang }: { lang: Lang }) {
  const t = getT(lang);
  const n = t.kk.navItems;
  return (
    <div className="min-h-screen bg-kk-cream text-kk-ink">
      <ScrollProgress />
      <Navbar
        twin={twinOf("/khata-kavach", lang)}
        current="khata"
        items={[
          { key: "how", href: `#${KK_ANCHORS.how}`, label: n.how },
          { key: "pump", href: `#${KK_ANCHORS.pump}`, label: n.pump },
          { key: "transporter", href: `#${KK_ANCHORS.transporter}`, label: n.transporter },
          { key: "faq", href: `#${KK_ANCHORS.faq}`, label: n.faq },
        ]}
        cta={{ href: `#${KK_ANCHORS.start}` }}
      />
      <main>
        <KkHero lang={lang} />
        <KkProblem lang={lang} />
        <KkFlow lang={lang} />
        <KkPump lang={lang} />
        <KkTransporter lang={lang} />
        <KkNozzle lang={lang} />
        <KkTrust lang={lang} />
        <KkFaq lang={lang} />
        <KkCta
          t={t.kk.cta}
          contact={{
            errorGeneric: t.contact.errorGeneric,
            errorCallLink: t.contact.errorCallLink,
            errorEnd: t.contact.errorEnd,
            submitting: t.contact.submitting,
            privacy: t.contact.privacy,
            success: t.contact.success,
          }}
        />
      </main>
      <Footer lang={lang} />
    </div>
  );
}
