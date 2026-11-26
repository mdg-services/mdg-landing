import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollProgress from "../components/ScrollProgress";
import Icon from "../components/Icon";
import { AskButton } from "./NewPumpPage";
import { getT } from "../i18n/server";
import { homeHref, localPath, pathFor, versionsOf, type Lang } from "../i18n/lang";
import { LANGUAGES } from "../i18n/languages";
import { docFacts, fill } from "../lib/docText";
import { funnelHref } from "../lib/funnel";
import { guideNow } from "../guides/clock";
import { PUMP, contextAt, target, type Ctx } from "../guides/model";
import { NEW_PUMP_QUESTION_GROUPS, PLANNED_GUIDE_PATHS } from "../data/newPumpQuestions";

/**
 * /new-pump/questions, /hi/new-pump/questions and /or/new-pump/questions: the
 * questions people ask before opening a petrol pump, each answered in a few
 * plain lines with a link to the Petrol pump guide page that answers it in
 * full (ADR 0059 §6). It is the page a search for one of these questions should
 * land on, and it offers Kavach Shuruaat at the top and at the end for the
 * question that is not here, or that is about the reader's own case.
 *
 * Server HTML in one language, no script of its own. The answers are always
 * open (no accordion), because a reader scanning thirty questions should not
 * have to open each one, and the FAQ structured data is the same text.
 *
 * Links to guide pages follow the guide's own release calendar: a page that is
 * not live yet gets no link (never a 404), and a language the page is not
 * written in links the English page, marked as such.
 */
export default function NewPumpQuestionsPage({ lang }: { lang: Lang }) {
  const t = getT(lang);
  const q = t.newPumpQuestions;
  const n = t.newPump;
  const facts = docFacts(lang);
  /* the one funnel link of this page: the admin report counts its taps as "new-pump-questions" */
  const ask = funnelHref("new-pump-questions", lang);
  const ctx = contextAt(PUMP, guideNow());
  const disclaimer = target(ctx, "disclaimer", lang);
  const anchor = (group: string) => `q-${group}`;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <ScrollProgress />
      <Navbar
        versions={versionsOf("/new-pump/questions")}
        current="newPump"
        items={NEW_PUMP_QUESTION_GROUPS.map((g) => ({ key: g.id, href: `#${anchor(g.id)}`, label: q.groupsShort[g.id] }))}
        cta={{ href: "#ask", label: n.navItems.start }}
      />

      <main>
        {/* ── Breadcrumb, title, and the short offer for a question about one's own case ── */}
        <section className="relative overflow-hidden bg-navy-950 text-white" aria-labelledby="npq-title">
          <div aria-hidden className="absolute inset-0 bg-grid-dark mask-radial opacity-50" />
          <div className="wrap-full relative pb-14 pt-12 md:pb-20 md:pt-16">
            <nav aria-label={LANGUAGES[lang].breadcrumb} className="font-mono text-[12px] uppercase tracking-[0.14em] text-navy-100">
              <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <li>
                  <Link href={homeHref(lang)} className="-my-1.5 inline-block py-1.5 transition-colors hover:text-white">
                    MDG Services
                  </Link>
                </li>
                <li className="flex items-center gap-2.5">
                  <span aria-hidden className="text-white/30">
                    /
                  </span>
                  <Link href={pathFor(lang, "/new-pump")} className="-my-1.5 inline-block py-1.5 transition-colors hover:text-white">
                    {n.name}
                  </Link>
                </li>
              </ol>
            </nav>
            <div className="mt-6 grid gap-10 md:grid-cols-12">
              <div className="md:col-span-7">
                <p className="text-[15px] font-semibold text-gold-300">{q.hero.eyebrow}</p>
                <h1 id="npq-title" className="mt-3 text-balance font-display font-semibold text-white" style={{ fontSize: "clamp(32px, 4.8vw, 56px)", lineHeight: 1.08 }}>
                  {q.hero.heading}
                </h1>
                <p className="mt-6 max-w-[42rem] text-[17px] leading-[1.6] text-navy-100">{q.hero.intro}</p>
              </div>
              <div className="md:col-span-5 md:pt-10">
                <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-5 sm:p-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-navy-100">{q.funnel.kicker}</p>
                  <p className="mt-3 font-display text-[21px] font-semibold leading-snug text-white">{q.funnel.topTitle}</p>
                  <p className="mt-2 text-[16px] leading-[1.55] text-navy-100">{q.funnel.topText}</p>
                  <AskButton href={ask} label={q.funnel.button} className="mt-5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── The questions, group by group ── */}
        <div className="wrap-full py-14 md:py-20">
          {NEW_PUMP_QUESTION_GROUPS.map((g) => (
            <section key={g.id} id={anchor(g.id)} aria-labelledby={`${anchor(g.id)}-h`} className="scroll-mt-20 border-t border-ink-hairline py-10 first:border-t-0 first:pt-0 md:py-14">
              <div className="grid gap-8 md:grid-cols-12">
                <h2 id={`${anchor(g.id)}-h`} className="text-balance font-display font-semibold text-ink md:col-span-4" style={{ fontSize: "clamp(26px, 3vw, 36px)", lineHeight: 1.15 }}>
                  {q.groups[g.id]}
                </h2>
                <ul className="space-y-4 md:col-span-8">
                  {g.questions.map((x) => {
                    const item = q.questions[x.id];
                    const link = guideLink(ctx, x.guide, lang);
                    return (
                      <li key={x.id} id={`a-${x.id}`} className="scroll-mt-20 rounded-2xl border border-ink-hairline bg-white p-5 shadow-card sm:p-6">
                        <h3 className="font-display text-[19px] font-semibold leading-snug text-ink">{item.q}</h3>
                        <p className="mt-2.5 max-w-[66ch] text-[16.5px] leading-[1.6] text-ink-soft">{item.a}</p>
                        {link && (
                          <p className="mt-3">
                            <a
                              href={link.href}
                              hrefLang={link.lang !== lang ? LANGUAGES[link.lang].bcp47 : undefined}
                              className="-my-2 inline-flex min-h-[44px] items-center gap-2 text-[15.5px] font-semibold text-navy-700 underline decoration-navy-700/40 underline-offset-4 hover:decoration-navy-700"
                            >
                              {q.readMore}
                              {link.lang !== lang && <span className="font-normal text-ink-muted">{q.inEnglish}</span>}
                              <Icon name="arrow" size={15} />
                            </a>
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          ))}
        </div>

        {/* ── The question that is not here: Kavach Shuruaat ── */}
        <section id="ask" aria-labelledby="npq-ask" className="scroll-mt-20 wrap-full pb-14 md:pb-20">
          <div className="rounded-3xl bg-navy-950 p-6 text-white sm:p-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-navy-100">{q.funnel.kicker}</p>
            <h2 id="npq-ask" className="mt-3 text-balance font-display font-semibold text-white" style={{ fontSize: "clamp(26px, 3.2vw, 38px)", lineHeight: 1.15 }}>
              {q.funnel.endTitle}
            </h2>
            <p className="mt-4 max-w-[44rem] text-[17px] leading-[1.6] text-navy-100">{fill(q.funnel.endText, facts)}</p>
            <AskButton href={ask} label={q.funnel.button} className="mt-7" />
            <p className="mt-3 max-w-[40rem] text-[14.5px] leading-[1.55] text-navy-100">{q.funnel.phoneLine}</p>
            <p className="mt-6">
              <Link
                href={pathFor(lang, "/new-pump")}
                className="-my-2 inline-flex min-h-[48px] items-center gap-2 font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
              >
                {q.funnel.about} <Icon name="arrow" size={16} />
              </Link>
            </p>
          </div>
        </section>

        <div className="wrap-full pb-16 text-[14.5px] leading-[1.6] text-ink-muted">
          <p className="max-w-[72ch]">{q.disclaimer}</p>
          {disclaimer && (
            <p className="mt-2">
              <a href={disclaimer.href} className="guide-link">
                {q.disclaimerLink}
              </a>
            </p>
          )}
        </div>
      </main>
      <Footer lang={lang} />
    </div>
  );
}

/**
 * Where "read the full answer" points: the guide page in the reader's language
 * if it is live, else its English page if that is live (the guide's own rule,
 * model.ts `target`), else nothing. A page the guide's list does not know yet
 * (written alongside this hub) is linked at its planned address, in English or
 * Hindi, the two languages those pages are written in.
 */
function guideLink(ctx: Ctx, id: string, lang: Lang): { href: string; lang: Lang } | null {
  const live = target(ctx, id, lang);
  if (live) return live;
  if (ctx.col.byId.has(id)) return null;
  const planned = PLANNED_GUIDE_PATHS[id];
  if (!planned) return null;
  const written: Lang = lang === "hi" ? "hi" : "en";
  return { href: localPath(written, planned), lang: written };
}
