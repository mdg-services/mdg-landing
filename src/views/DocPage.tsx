import Link from "next/link";
import type { ReactNode } from "react";
import FormShell from "../components/FormShell";
import JsonLd from "../seo/JsonLd";
import { companyJsonLd } from "../seo/graph";
import { DOC_KEY, type DocBlock, type DocCard } from "../i18n/doc";
import { docFacts, fill, pieces, target } from "../lib/docText";
import { getT } from "../i18n/server";
import { pathFor, type CompanyRoute, type Lang } from "../i18n/lang";

/** Five or more sections: worth a row of jump links. */
const TOC_FROM = 5;

type Facts = Record<string, string>;

/** One link: a page of this site goes through the router, anything else is a plain anchor. */
function A({
  href,
  lang,
  facts,
  className,
  children,
}: {
  href: string;
  lang: Lang;
  facts: Facts;
  className: string;
  children: ReactNode;
}) {
  const to = target(lang, fill(href, facts));
  if (to.how === "page") {
    return (
      <Link href={to.href} className={className}>
        {children}
      </Link>
    );
  }
  if (to.how === "external") {
    return (
      <a href={to.href} target="_blank" rel="noopener" className={className}>
        {children}
      </a>
    );
  }
  return (
    <a href={to.href} className={className}>
      {children}
    </a>
  );
}

/** A string of copy: facts filled in, then bold and links drawn. */
function Inline({ text, lang, facts, strong = "" }: { text: string; lang: Lang; facts: Facts; strong?: string }) {
  return (
    <>
      {pieces(fill(text, facts)).map((x, i) => {
        if (x.kind === "bold") {
          return (
            <strong key={i} className={`font-semibold ${strong}`}>
              {x.text}
            </strong>
          );
        }
        if (x.kind === "link") {
          return (
            <A key={i} href={x.href} lang={lang} facts={facts} className="guide-link">
              {x.text}
            </A>
          );
        }
        return <span key={i}>{x.text}</span>;
      })}
    </>
  );
}

function Card({ card, lang, facts }: { card: DocCard; lang: Lang; facts: Facts }) {
  const say = (text: string) => <Inline text={text} lang={lang} facts={facts} />;
  return (
    <div className="flex flex-col rounded-2xl border border-ink-hairline bg-white p-6 shadow-card">
      {card.kicker && <p className="eyebrow">{say(card.kicker)}</p>}
      <h3 className="mt-4 break-words font-display text-[22px] font-semibold leading-snug text-ink">
        {say(card.title)}
      </h3>
      {card.price && (
        <p className="num mt-4 break-words font-display text-[32px] font-semibold leading-none text-navy-700 md:text-[34px]">
          {say(card.price)}
        </p>
      )}
      {card.priceNote && <p className="mt-2 text-[14px] leading-[1.5] text-ink-muted">{say(card.priceNote)}</p>}
      <p className="mt-4 text-[15.5px] leading-[1.6] text-ink-soft">{say(card.body)}</p>
      {card.items && (
        <ul className="mt-5 space-y-2 border-t border-ink-hairline pt-4 text-[14.5px] leading-[1.5] text-ink-soft">
          {card.items.map((item) => (
            <li key={item} className="flex gap-2.5">
              <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-400" />
              <span>{say(item)}</span>
            </li>
          ))}
        </ul>
      )}
      {card.link && (
        <p className="mt-auto pt-6">
          <A
            href={card.link.href}
            lang={lang}
            facts={facts}
            className="link-quiet text-[15px] font-semibold text-navy-700"
          >
            {say(card.link.label)} →
          </A>
        </p>
      )}
    </div>
  );
}

/** One block of a section. Prose blocks sit in the guides' reading style; boxes and tiles are drawn here. */
function Block({ block, lang, facts }: { block: DocBlock; lang: Lang; facts: Facts }) {
  const say = (text: string) => <Inline text={text} lang={lang} facts={facts} />;
  switch (block.kind) {
    case "p":
      return (
        <div className="guide-prose max-w-3xl">
          <p>{say(block.text)}</p>
        </div>
      );
    case "ul":
      return (
        <div className="guide-prose max-w-3xl">
          <ul>
            {block.items.map((item) => (
              <li key={item}>{say(item)}</li>
            ))}
          </ul>
        </div>
      );
    case "ol":
      return (
        <div className="guide-prose max-w-3xl">
          <ol>
            {block.items.map((item) => (
              <li key={item}>{say(item)}</li>
            ))}
          </ol>
        </div>
      );
    case "note":
      return (
        <div className="guide-prose max-w-3xl">
          <blockquote>
            <p>{say(block.text)}</p>
          </blockquote>
        </div>
      );
    case "facts":
      return (
        <dl className="my-7 max-w-3xl divide-y divide-ink-hairline overflow-hidden rounded-2xl border border-ink-hairline bg-white shadow-card">
          {block.rows.map((row) => (
            <div key={row.k} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[11rem_1fr] sm:gap-6">
              <dt className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted sm:pt-[3px]">
                {row.k}
              </dt>
              <dd className="break-words text-[15.5px] leading-[1.55] text-ink">{say(row.v)}</dd>
            </div>
          ))}
        </dl>
      );
    case "table":
      return (
        <div className="guide-prose max-w-3xl">
          {/* three or more columns turn into one small card per row on a phone (the guides' rule) */}
          <div className={block.head.length >= 3 ? "tw tw-stack" : "tw"}>
            <table>
              <thead>
                <tr>
                  {block.head.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, c) => (
                      <td key={c} data-label={block.head[c]}>
                        {say(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    case "cards":
      return (
        <div
          className={`my-7 grid gap-5 ${block.items.length >= 3 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"}`}
        >
          {block.items.map((card) => (
            <Card key={card.title} card={card} lang={lang} facts={facts} />
          ))}
        </div>
      );
    case "steps":
      return (
        <ol className="my-7 grid list-none gap-4 p-0 lg:grid-cols-3">
          {block.items.map((step, i) => (
            <li key={step.title} className="rounded-2xl border border-ink-hairline bg-white p-6 shadow-card">
              <span className="num text-[26px] font-semibold text-gold-500">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-[19px] font-semibold leading-snug text-ink">{say(step.title)}</h3>
              <p className="mt-2 text-[15px] leading-[1.6] text-ink-soft">{say(step.body)}</p>
            </li>
          ))}
        </ol>
      );
  }
}

/**
 * The company pages (/about, /contact, /pricing, /terms, /refund-policy,
 * /shipping and their /hi twins): the site's slim header and navy heading band,
 * a reading column on the paper background, and the footer. Every page names
 * the company and its CIN in the band as well as in the footer, so a reader
 * who lands on any one of them knows who is behind it.
 *
 * The words are data (one file per page in each language's i18n folder, shaped
 * by i18n/doc.ts); this draws them. It is a server component and ships no script.
 */
export default function DocPage({ lang, route }: { lang: Lang; route: CompanyRoute }) {
  const t = getT(lang);
  const doc = t[DOC_KEY[route]];
  const facts = docFacts(lang);
  const say = (text: string, strong?: string) => <Inline text={text} lang={lang} facts={facts} strong={strong} />;
  const sections = doc.sections;

  return (
    <FormShell
      lang={lang}
      route={route}
      backLabel={t.docs.backToHome}
      eyebrow={doc.eyebrow}
      eyebrowDeva={doc.eyebrowDeva}
      heading={doc.heading}
      headingSize="clamp(30px, 4.8vw, 56px)"
      intro={<span className="guide-answer">{say(doc.intro)}</span>}
      extra={
        <>
          <span className="block">{say(t.docs.legalLine, "text-white")}</span>
          <span className="mt-2 block text-[14px] text-navy-300">
            {t.docs.updatedLabel} {doc.updated}
          </span>
          {doc.legal && t.docs.bindingNotice !== "" && (
            <span className="mt-5 block rounded-xl border border-white/15 bg-white/[0.06] p-4 text-[14px] leading-[1.6] text-navy-100">
              {t.docs.bindingNotice}{" "}
              <a
                href={pathFor("en", route)}
                className="whitespace-nowrap font-semibold text-gold-300 underline decoration-gold-300/40 underline-offset-4 hover:decoration-gold-300"
              >
                {t.docs.readEnglish} →
              </a>
            </span>
          )}
        </>
      }
    >
      <JsonLd data={companyJsonLd(lang, route)} />
      <article className="wrap-wide pb-20 pt-10 sm:pt-12">
        {sections.length >= TOC_FROM && (
          <nav aria-label={t.docs.onThisPage} className="guide-toc max-w-3xl">
            <p className="eyebrow guide-label">{t.docs.onThisPage}</p>
            <ul>
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.heading}</a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {sections.map((s) => (
          <section key={s.id} id={s.id} className="guide-section scroll-mt-24 first:mt-0">
            <h2 className="guide-h2">{s.heading}</h2>
            {s.blocks.map((b, i) => (
              <Block key={i} block={b} lang={lang} facts={facts} />
            ))}
          </section>
        ))}

        <p className="mt-14 max-w-3xl border-t border-ink-hairline pt-6 text-[15.5px] leading-[1.7] text-ink-soft">
          {say(t.docs.questions)}
        </p>
      </article>
    </FormShell>
  );
}
