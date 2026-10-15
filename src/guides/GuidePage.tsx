import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Enter } from "../lib/enter";
import JsonLd from "../seo/JsonLd";
import ToolScript from "./ToolScript";
import {
  UI,
  buildPageModel,
  longDate,
  outline,
  renderBody,
  renderInline,
  structuredData,
  target,
  toolScript,
  type Card,
  type Ctx,
  type Lang,
  type PageModel,
  type Release,
} from "./model";
import { DISCLAIMER, EMAIL, NOTICE_SHORT, OFFICIAL, TOLL_FREE } from "../../guide/copy.ts";
import { homeHref, pathFor } from "../i18n/lang";

/** The jump-link list on a page with several sections. */
const ON_THIS_PAGE: Record<Lang, string> = { en: "On this page", hi: "इस पेज पर" };

/** Four or more sections: worth a row of jump links. */
const TOC_FROM = 4;

/**
 * One page of the guides, drawn in the site's own design: its navbar and
 * footer, a navy band with the breadcrumb, the title and the short answer, a
 * calm reading column on the paper background, and the notice and disclaimer
 * kept in view but quiet.
 *
 * It is a server component. The only script on it is the tool's own, on a tool
 * page (`ToolScript`). Its styles are the `.guide-*` rules in index.css.
 */
export default function GuidePage({ ctx, release }: { ctx: Ctx; release: Release }) {
  const m = buildPageModel(ctx, release);
  const { page, lang, c } = m;
  const t = UI[lang];
  const otherLang: Lang = lang === "en" ? "hi" : "en";
  // The switch goes to this page's twin; with no twin live, to the other language's guides.
  const twin = m.twin?.href ?? target(ctx, "hub", otherLang)?.href ?? homeHref(otherLang);
  const body = renderBody(ctx, lang, c.body);
  const answer = c.answer ? renderInline(ctx, lang, c.answer) : "";
  const script = toolScript(page);
  const disclaimer = DISCLAIMER[lang];
  // "MDG 2024" stays on one line in the heading; a break inside it reads as two things
  const h1 = c.title.replace(/MDG 2024/g, "MDG\u00a02024");
  const sections = page.id === "hub" ? [] : outline(c.body);
  // A card is shown once: the hub lists the topics and tools, so the related list skips them
  const shown = new Set(m.children.flatMap((g) => g.cards.map((card) => card.href)));
  const related = m.related.filter((card) => !shown.has(card.href));
  const groups = m.children.map((group) => (
    <section key={group.heading} className="guide-section">
      <h2 className="guide-h2">{group.heading}</h2>
      <CardGrid cards={group.cards} lang={lang} />
    </section>
  ));
  // the hub is a front page: its topic cards come first, the explanation after
  const hubFirst = page.id === "hub";

  return (
    <div className="min-h-screen bg-paper text-ink">
      <JsonLd data={structuredData(m)} />
      <Navbar twin={twin} current="guides" />

      <main>
        {/* hero band: breadcrumb, title, short answer */}
        <section className="guide-hero relative overflow-hidden bg-navy-950 text-white">
          <div aria-hidden className="absolute inset-0 bg-grid-dark opacity-40" />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-20 h-[22rem] w-[22rem] rounded-full sm:h-[26rem] sm:w-[26rem]"
            style={{ background: "radial-gradient(circle, rgba(245,165,36,.16), transparent 60%)" }}
          />
          <div className="wrap-narrow relative py-12 sm:py-14 md:py-16">
            <Enter>
              <nav aria-label={lang === "hi" ? "नेविगेशन पथ" : "Breadcrumb"} className="eyebrow-light">
                <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  {m.crumbs.slice(0, -1).map((b, i) => (
                    <li key={b.href} className="flex items-center gap-2.5">
                      {i > 0 && (
                        <span aria-hidden className="text-white/30">
                          /
                        </span>
                      )}
                      {/* padded for a thumb, with the padding taken back so the line does not grow */}
                      <a href={b.href} className="-my-1.5 inline-block py-1.5 transition-colors hover:text-white">
                        {b.name}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </Enter>
            <Enter delay={0.06}>
              <h1 className="mt-5 text-balance text-display text-white" style={{ fontSize: "clamp(30px, 4.6vw, 52px)" }}>
                {h1}
              </h1>
            </Enter>
            {answer && (
              <Enter delay={0.12}>
                <div className="mt-7 rounded-2xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur sm:p-6">
                  <p className="eyebrow-light">{t.shortAnswer}</p>
                  <p
                    className="guide-answer mt-3 text-[16px] leading-[1.65] text-navy-50 sm:text-[17px]"
                    dangerouslySetInnerHTML={{ __html: answer }}
                  />
                </div>
              </Enter>
            )}
          </div>
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
        </section>

        {/* the notice: a slim strip, always in view */}
        <div className="border-b border-ink-hairline bg-paper-warm">
          <p className="guide-notice wrap-narrow py-3 text-[13px] leading-[1.6] text-ink-muted">{NOTICE_SHORT[lang]}</p>
        </div>

        {/* the reading column */}
        <article className="wrap-narrow pb-16 pt-8 sm:pb-20 sm:pt-10">
          <p className="guide-checked mb-8 font-mono text-[12px] leading-[1.6] text-ink-muted">
            {t.checked} {longDate(c.updated, lang)}. {t.published}
          </p>

          {sections.length >= TOC_FROM && (
            <nav aria-label={ON_THIS_PAGE[lang]} className="guide-toc">
              <p className="eyebrow">{ON_THIS_PAGE[lang]}</p>
              <ul>
                {sections.map((sec) => (
                  <li key={sec.id}>
                    <a href={`#${sec.id}`}>{sec.text}</a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {hubFirst && <div className="-mt-14">{groups}</div>}

          <div className={hubFirst ? "guide-prose mt-14" : "guide-prose"} dangerouslySetInnerHTML={{ __html: body }} />
          {script && <ToolScript code={script} />}

          {page.id === "disclaimer" && (
            <div className="guide-prose">
              {disclaimer.map(([h, x]) => (
                <section key={h}>
                  <h2>{h}</h2>
                  <p>{x}</p>
                </section>
              ))}
            </div>
          )}

          {m.videos.length > 0 && (
            <section className="guide-section">
              <h2 className="guide-h2">{t.watch}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {m.videos.map((v) => (
                  <a key={v.href} href={v.href} rel="noopener" className="guide-card group">
                    <span className="eyebrow">{t.video} · 1 min</span>
                    <strong className="mt-3 block font-display text-[17px] font-semibold leading-snug text-ink group-hover:text-navy-700">
                      {v.title}
                    </strong>
                  </a>
                ))}
              </div>
            </section>
          )}

          {!hubFirst && groups}

          {c.faq && c.faq.length > 0 && (
            <section className="guide-section">
              <h2 className="guide-h2">{t.faq}</h2>
              <div className="border-b border-ink-hairline">
                {c.faq.map((f, i) => (
                  <details key={f.q} className="guide-faq">
                    <summary>
                      <span className="num text-[15px] font-semibold text-navy-500">{String(i + 1).padStart(2, "0")}</span>
                      <span
                        className="font-display text-[17px] font-semibold leading-snug text-ink md:text-[19px]"
                        dangerouslySetInnerHTML={{ __html: renderInline(ctx, lang, f.q) }}
                      />
                      <span aria-hidden className="guide-faq-plus">
                        <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                          <path d="M9 2.5v13M2.5 9h13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      </span>
                    </summary>
                    <p className="guide-faq-a" dangerouslySetInnerHTML={{ __html: renderInline(ctx, lang, f.a) }} />
                  </details>
                ))}
              </div>
            </section>
          )}

          <p className="mt-12 rounded-2xl border border-ink-hairline bg-white p-4 text-[15px] leading-[1.6] text-ink-soft">
            <b className="font-semibold text-ink">{t.officialTitle}:</b>{" "}
            <a href={OFFICIAL.bpcl} rel="noopener" target="_blank" className="guide-link">
              {t.officialBpcl}
            </a>{" "}
            ({t.officialAlso}).
          </p>

          {related.length > 0 && (
            <section className="guide-section">
              <h2 className="guide-h2">{t.related}</h2>
              <CardGrid cards={related} lang={lang} />
            </section>
          )}

          {/* the one sales line, and it says it is an advertisement */}
          <section
            aria-labelledby="guide-ad"
            className="relative mt-14 overflow-hidden rounded-3xl bg-gradient-to-br from-navy-700 via-navy-800 to-navy-950 p-6 text-white sm:p-9"
          >
            <div aria-hidden className="absolute inset-0 bg-grid-dark opacity-30" />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-[18rem] w-[18rem] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(245,165,36,.18), transparent 60%)" }}
            />
            <div className="relative">
              <h2 id="guide-ad" className="eyebrow-light !text-gold-300">
                {t.ctaTitle}
              </h2>
              <p className="mt-4 max-w-prose2 text-[16px] leading-[1.65] text-navy-100 sm:text-[17px]">{t.cta}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href={pathFor(lang, "/register")} className="btn-gold">
                  {t.register}
                </a>
                <a href={TOLL_FREE.href} className="btn-on-dark-ghost">
                  {t.call}
                </a>
              </div>
            </div>
          </section>
        </article>

        {/* the small print: the full disclaimer, the topic links, who publishes and how to report an error */}
        <section aria-label={t.disclaimerLink} className="border-t border-ink-hairline bg-paper-warm">
          <div className="guide-small wrap-narrow py-8 text-[12.5px] leading-[1.65] text-ink-muted">
            {page.id !== "disclaimer" && (
              <>
                {disclaimer.map(([h, x]) => (
                  <p key={h} className="mb-2.5">
                    <b className="font-semibold text-ink-soft">{h}.</b> {x}
                  </p>
                ))}
                {m.disclaimerHref && (
                  <p className="mt-3">
                    <a href={m.disclaimerHref} className="guide-link">
                      {t.disclaimerLink}
                    </a>
                  </p>
                )}
              </>
            )}
            <SmallLinks m={m} />
            <p className="mt-5">{t.company}</p>
            <p className="mt-1">
              {t.report}:{" "}
              <a href={`mailto:${EMAIL}`} className="guide-link">
                {EMAIL}
              </a>
            </p>
          </div>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  );
}

function CardGrid({ cards, lang }: { cards: Card[]; lang: Lang }) {
  const t = UI[lang];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {cards.map((card) => (
        <a key={card.href} href={card.href} className="guide-card group">
          <strong className="block font-display text-[17px] font-semibold leading-snug text-ink group-hover:text-navy-700">
            {card.title}
            {card.otherLang && <span className="ml-2 text-[13px] font-normal text-ink-muted">({t.english})</span>}
          </strong>
          {card.description && <span className="mt-2 block text-[14.5px] leading-[1.55] text-ink-soft">{card.description}</span>}
          {card.count !== undefined && (
            <small className="mt-3 block font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
              {card.count} {card.count === 1 ? t.page : t.pages}
            </small>
          )}
        </a>
      ))}
    </div>
  );
}

/** The guides hub, each live topic, the updates page and the site's own pages: links on every page, for readers and for crawlers. */
function SmallLinks({ m }: { m: PageModel }) {
  const t = UI[m.lang];
  const links: { href: string; label: string }[] = [
    ...(m.hub ? [{ href: m.hub.href, label: t.guide }] : []),
    ...m.pillarLinks,
    ...(m.updatesHref ? [{ href: m.updatesHref, label: t.updates }] : []),
    { href: homeHref(m.lang), label: t.home },
    { href: "/privacy", label: t.privacy },
  ];
  return (
    <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px]">
      {links.map((l) => (
        <li key={l.href}>
          <a href={l.href} className="guide-link">
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
