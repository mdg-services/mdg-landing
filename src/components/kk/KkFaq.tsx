import Icon from "../Icon";
import { KK_ANCHORS } from "../../data/kk";
import { getT } from "../../i18n/server";
import type { Lang } from "../../i18n/lang";

/**
 * Eight plain answers, on the browser's own <details>: no script, the answers
 * are in the HTML for anyone or anything that reads it, and the same words feed
 * the page's FAQ structured data. No numbers and no eyebrow: a list of
 * questions has no order to count.
 */
export default function KkFaq({ lang }: { lang: Lang }) {
  const f = getT(lang).kk.faq;
  return (
    <section id={KK_ANCHORS.faq} aria-labelledby="kk-faq" className="scroll-mt-20 bg-kk-surface text-kk-ink">
      <div className="wrap-full grid gap-10 py-24 md:grid-cols-12 md:gap-12 md:py-32">
        <h2
          id="kk-faq"
          className="text-balance font-bold md:col-span-4"
          style={{ fontSize: "clamp(30px, 3.6vw, 46px)", lineHeight: 1.12, letterSpacing: "-0.03em" }}
        >
          {f.heading}
        </h2>
        <div className="space-y-3 md:col-span-8">
          {f.items.map((q, i) => (
            <details key={q.q} open={i === 0} className="group rounded-2xl bg-kk-paper">
              <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-5 px-6 py-4 text-[19px] font-semibold leading-snug text-kk-ink marker:content-none [&::-webkit-details-marker]:hidden md:text-[20px]">
                {q.q}
                <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-kk-wash text-kk-siyahi">
                  <Icon name="plus" size={18} className="transition-transform duration-200 group-open:rotate-45" />
                </span>
              </summary>
              <p className="max-w-[62ch] px-6 pb-6 text-[18px] leading-[1.6] text-kk-soft">{q.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
