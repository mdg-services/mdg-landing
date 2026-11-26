import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollProgress from "../components/ScrollProgress";
import StoreButtons from "../components/StoreButtons";
import Icon from "../components/Icon";
import { getT } from "../i18n/server";
import { versionsOf, type Lang } from "../i18n/lang";
import { docFacts, fill, pieces, target } from "../lib/docText";

/** The page's own sections, for its navbar and for anyone who links into it. */
export const NEW_PUMP_ANCHORS = { examples: "questions", price: "price", start: "start", faq: "faq" } as const;

/**
 * /new-pump, /hi/new-pump and /or/new-pump: New Pump Guide (ADR 0058 §8), the
 * Dealer Kavach app's rule-book chat for people planning a petrol pump.
 *
 * Server HTML in one language, with no script of its own: the FAQ opens on the
 * browser's own <details>. There is nothing to fill in here. The page sends a
 * reader to the app stores, because the account, the payment link and the chat
 * all live in the app; `/start?for=new-pump` is the same road for a phone that
 * should go straight to its own store.
 *
 * The price is never typed into the copy: `{newPumpTotal}` and friends are
 * filled from NEW_PUMP (data/content.ts), the same figure the pricing page uses.
 */
export default function NewPumpPage({ lang }: { lang: Lang }) {
  const t = getT(lang);
  const n = t.newPump;
  const facts = docFacts(lang);
  const say = (text: string) => <Inline text={text} lang={lang} facts={facts} />;
  const sectionHeading = "text-balance font-display font-semibold text-ink";
  const headingSize = { fontSize: "clamp(28px, 3.4vw, 42px)", lineHeight: 1.15 } as const;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <ScrollProgress />
      <Navbar
        versions={versionsOf("/new-pump")}
        current="newPump"
        items={[
          { key: "examples", href: `#${NEW_PUMP_ANCHORS.examples}`, label: n.navItems.examples },
          { key: "price", href: `#${NEW_PUMP_ANCHORS.price}`, label: n.navItems.price },
          { key: "start", href: `#${NEW_PUMP_ANCHORS.start}`, label: n.navItems.start },
          { key: "faq", href: `#${NEW_PUMP_ANCHORS.faq}`, label: n.navItems.faq },
        ]}
        cta={{ href: `#${NEW_PUMP_ANCHORS.start}` }}
      />

      <main>
        {/* ── The first screen: what it is, what it costs, where to get it ── */}
        <section className="relative overflow-hidden bg-navy-950 text-white" aria-labelledby="np-title">
          <div aria-hidden className="absolute inset-0 bg-grid-dark mask-radial opacity-50" />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(245,165,36,.16), transparent 60%)" }}
          />
          <div className="wrap-full relative grid gap-12 pb-20 pt-14 md:grid-cols-12 md:gap-10 md:pb-24 md:pt-20">
            <div className="md:col-span-7">
              <p className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-navy-100">
                <span aria-hidden className="inline-block h-1.5 w-1.5 rotate-45 bg-gold-400" />
                {n.hero.eyebrow}
              </p>
              <h1 id="np-title" className="mt-6 text-balance font-display font-semibold text-white" style={{ fontSize: "clamp(36px, 5.6vw, 68px)", lineHeight: 1.06 }}>
                {n.hero.heading}
              </h1>
              <p className="mt-6 max-w-[40rem] text-[17px] leading-[1.6] text-navy-100 md:text-[19px]">{n.hero.intro}</p>

              {/* the price, said up front: nobody should meet it first on a payment link */}
              <div className="mt-8 inline-block rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-4">
                <p className="num font-display text-[26px] font-semibold leading-tight text-gold-300 md:text-[30px]">{say(n.hero.price)}</p>
                <p className="mt-1.5 text-[15px] leading-snug text-navy-100">{say(n.hero.priceNote)}</p>
              </div>

              <p className="mt-8 max-w-[36rem] text-[16px] leading-[1.55] text-white">{n.hero.storeLead}</p>
              <StoreButtons from="new_pump" appStoreAria={n.hero.appStoreAria} playAria={n.hero.playAria} className="mt-4" />
              <p className="mt-4 text-[15px]">
                {/* a phone that wants its own store in one tap; a computer lands back here.
                    A plain link: /start is a redirect to a store, not a page to prefetch. */}
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a
                  href="/start?for=new-pump"
                  className="-my-2 inline-flex min-h-[48px] items-center gap-2 font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
                >
                  {n.hero.androidLink} <Icon name="arrow" size={16} />
                </a>
              </p>
            </div>

            {/* what people ask about, as plain tags: meaning in words, not colour */}
            <div className="md:col-span-5 md:pt-24">
              <ul aria-label={n.hero.topicsAria} className="grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                {n.hero.topics.map((topic) => (
                  <li key={topic} className="flex min-h-[56px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-[16px] font-medium text-white">
                    <Icon name="check" size={18} className="shrink-0 text-gold-400" aria-hidden />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Who it is for, and what it is not ── */}
        <section aria-labelledby="np-who" className="wrap-full py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-12">
            <h2 id="np-who" className={sectionHeading + " md:col-span-4"} style={headingSize}>
              {n.forWho.heading}
            </h2>
            <div className="md:col-span-8">
              <ul className="space-y-4">
                {n.forWho.items.map((item) => (
                  <li key={item} className="flex gap-3.5 text-[18px] leading-[1.55] text-ink">
                    <span aria-hidden className="mt-[10px] h-2 w-2 shrink-0 rotate-45 bg-gold-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 rounded-2xl border border-gold-300 bg-gold-50 p-5 text-[16.5px] leading-[1.6] text-ink">{n.forWho.not}</p>
            </div>
          </div>
        </section>

        {/* ── Example questions, with the kind of answer ── */}
        <section id={NEW_PUMP_ANCHORS.examples} aria-labelledby="np-examples" className="scroll-mt-20 bg-paper-warm">
          <div className="wrap-full py-16 md:py-24">
            <h2 id="np-examples" className={sectionHeading} style={headingSize}>
              {n.examples.heading}
            </h2>
            <p className="mt-4 max-w-[44rem] text-[17px] leading-[1.6] text-ink-soft">{n.examples.intro}</p>
            <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {n.examples.items.map((ex) => (
                <li key={ex.q} className="flex flex-col rounded-2xl border border-ink-hairline bg-white p-6 shadow-card">
                  <p className="font-display text-[19px] font-semibold leading-snug text-ink">{ex.q}</p>
                  <p className="mt-3 text-[16px] leading-[1.6] text-ink-soft">{ex.a}</p>
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-[48rem] text-[15.5px] leading-[1.6] text-ink-soft">{n.examples.note}</p>
          </div>
        </section>

        {/* ── What it reads from ── */}
        <section aria-labelledby="np-sources" className="wrap-full py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 id="np-sources" className={sectionHeading} style={headingSize}>
                {n.sources.heading}
              </h2>
              <p className="mt-4 text-[17px] leading-[1.6] text-ink-soft">{n.sources.intro}</p>
            </div>
            <div className="md:col-span-8">
              <ul className="divide-y divide-ink-hairline overflow-hidden rounded-2xl border border-ink-hairline bg-white shadow-card">
                {n.sources.items.map((src) => (
                  <li key={src} className="flex gap-3.5 px-5 py-4 text-[16.5px] leading-[1.55] text-ink">
                    <Icon name="doc" size={20} className="mt-0.5 shrink-0 text-navy-700" aria-hidden />
                    <span>{src}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[16.5px] leading-[1.6] text-ink">{n.sources.unsettled}</p>
              <p className="mt-3 text-[16px] leading-[1.6] text-ink-soft">{n.sources.noPerson}</p>
            </div>
          </div>
        </section>

        {/* ── What it costs ── */}
        <section id={NEW_PUMP_ANCHORS.price} aria-labelledby="np-price" className="scroll-mt-20 bg-paper-warm">
          <div className="wrap-full grid gap-10 py-16 md:grid-cols-12 md:py-24">
            <h2 id="np-price" className={sectionHeading + " md:col-span-4"} style={headingSize}>
              {n.price.heading}
            </h2>
            <div className="md:col-span-8">
              <table className="w-full max-w-xl overflow-hidden rounded-2xl border border-ink-hairline bg-white text-left shadow-card">
                <thead>
                  <tr className="border-b border-ink-hairline">
                    <th scope="col" className="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
                      {n.price.headLabel}
                    </th>
                    <th scope="col" className="px-5 py-3 text-right font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
                      {n.price.headAmount}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {n.price.rows.map(([label, amount]) => (
                    <tr key={label} className="border-b border-ink-hairline last:border-0">
                      <td className="px-5 py-3.5 text-[16px] leading-snug text-ink">{say(label)}</td>
                      <td className="num px-5 py-3.5 text-right text-[16px] text-ink">{say(amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ul className="mt-8 space-y-3">
                {n.price.points.map((point) => (
                  <li key={point} className="flex gap-3.5 text-[16.5px] leading-[1.6] text-ink">
                    <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-400" />
                    <span>{say(point)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Three steps, and the store buttons again where the steps end ── */}
        <section id={NEW_PUMP_ANCHORS.start} aria-labelledby="np-start" className="scroll-mt-20 wrap-full py-16 md:py-24">
          <h2 id="np-start" className={sectionHeading} style={headingSize}>
            {n.steps.heading}
          </h2>
          <ol className="mt-10 grid list-none gap-5 p-0 lg:grid-cols-3">
            {n.steps.items.map((step, i) => (
              <li key={step.title} className="rounded-2xl border border-ink-hairline bg-white p-6 shadow-card">
                <span className="num text-[26px] font-semibold text-gold-500" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-[19px] font-semibold leading-snug text-ink">{step.title}</h3>
                <p className="mt-2 text-[16px] leading-[1.6] text-ink-soft">{say(step.body)}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 rounded-3xl bg-navy-950 p-6 sm:p-8">
            <p className="max-w-[36rem] text-[16.5px] leading-[1.55] text-white">{n.hero.storeLead}</p>
            <StoreButtons from="new_pump" appStoreAria={n.hero.appStoreAria} playAria={n.hero.playAria} className="mt-5" />
          </div>
        </section>

        {/* ── When the pump opens ── */}
        <section aria-labelledby="np-opens" className="bg-paper-warm">
          <div className="wrap-full grid gap-10 py-16 md:grid-cols-12 md:py-24">
            <h2 id="np-opens" className={sectionHeading + " md:col-span-4"} style={headingSize}>
              {n.opens.heading}
            </h2>
            <div className="md:col-span-8">
              <p className="text-[18px] leading-[1.6] text-ink">{n.opens.body}</p>
              <ul className="mt-6 space-y-3">
                {n.opens.points.map((point) => (
                  <li key={point} className="flex gap-3.5 text-[16.5px] leading-[1.6] text-ink">
                    <Icon name="check" size={18} className="mt-1 shrink-0 text-navy-700" aria-hidden />
                    <span>{say(point)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Questions, on the browser's own <details> ── */}
        <section id={NEW_PUMP_ANCHORS.faq} aria-labelledby="np-faq" className="scroll-mt-20 wrap-full grid gap-10 py-16 md:grid-cols-12 md:gap-12 md:py-24">
          <h2 id="np-faq" className={sectionHeading + " md:col-span-4"} style={headingSize}>
            {n.faq.heading}
          </h2>
          <div className="space-y-3 md:col-span-8">
            {n.faq.items.map((q, i) => (
              <details key={q.q} open={i === 0} className="group rounded-2xl border border-ink-hairline bg-white">
                <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-5 px-5 py-4 text-[18px] font-semibold leading-snug text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                  {q.q}
                  <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-paper-warm text-navy-700">
                    <Icon name="plus" size={18} className="transition-transform duration-200 group-open:rotate-45" />
                  </span>
                </summary>
                <p className="max-w-[62ch] px-5 pb-5 text-[16.5px] leading-[1.6] text-ink-soft">{q.a}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="wrap-full pb-16 text-[14.5px] leading-[1.6] text-ink-muted">{n.disclaimer}</p>
      </main>
      <Footer lang={lang} />
    </div>
  );
}

/** A string of copy: facts filled in, then **bold** and [links](route:/x) drawn (the company pages' markup, lib/docText.ts). */
function Inline({ text, lang, facts }: { text: string; lang: Lang; facts: Record<string, string> }) {
  return (
    <>
      {pieces(fill(text, facts)).map((x, i) => {
        if (x.kind === "bold") return <strong key={i} className="font-semibold">{x.text}</strong>;
        if (x.kind === "link") {
          const to = target(lang, fill(x.href, facts));
          return to.how === "page" ? (
            <Link key={i} href={to.href} className="guide-link">
              {x.text}
            </Link>
          ) : (
            <a key={i} href={to.href} className="guide-link">
              {x.text}
            </a>
          );
        }
        return <span key={i}>{x.text}</span>;
      })}
    </>
  );
}
