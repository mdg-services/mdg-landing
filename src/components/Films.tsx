import Image from "next/image";
import films from "../film/films.json";
import { getT } from "../i18n/server";
import { filmHref, type Lang } from "../i18n/lang";
import { Reveal, item } from "../lib/reveal";

/**
 * The home page's film section: the two films, for a visitor who found the
 * site on their own rather than through a WhatsApp invite. Each film is a
 * phone-shaped poster (the films are made for phones, 9:16) that opens its
 * watch page, /film/short or /film, where it plays.
 *
 * The posters are copies of each film's poster-720.jpg in the mdg-films bucket,
 * kept in public/film/ on purpose: a page that loads the bucket's poster
 * without CORS leaves a copy in the browser's cache that the watch page's
 * CORS request then trips over (the bucket sends no `Vary: Origin`). Re-cut a
 * film and these two files are replaced along with films.json.
 *
 * Server HTML, no script: the reveals are CSS, and a tap is an ordinary link.
 */
export default function Films({ lang }: { lang: Lang }) {
  const t = getT(lang).films;
  const full = films.kavach;
  const fill = (s: string) =>
    s.replace(/\{min\}/g, String(Math.round(full.duration / 60))).replace(/\{chapters\}/g, String(full.chapters.length));

  const cards = [
    { key: "short", href: filmHref(lang, "short"), poster: "/film/poster-kavach-short.jpg", copy: t.short },
    { key: "full", href: filmHref(lang, "full"), poster: "/film/poster-kavach.jpg", copy: t.full },
  ] as const;

  return (
    <section id="film" aria-label={t.sectionAria} className="relative scroll-mt-20 overflow-hidden bg-navy-950 text-white">
      <div aria-hidden className="absolute inset-0 bg-grid-dark mask-radial opacity-50" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-48 top-1/3 h-[34rem] w-[34rem] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(245,165,36,.14), transparent 60%)" }}
      />

      <div className="wrap-full relative grid items-center gap-12 py-20 md:grid-cols-12 md:gap-10 md:py-28">
        <div className="md:col-span-5">
          <Reveal>
            <p className="eyebrow-light">{t.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 max-w-xl text-balance text-display text-white" style={{ fontSize: "clamp(32px, 4.4vw, 56px)" }}>
              {t.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[32rem] text-[18px] leading-[1.55] text-navy-100 md:text-[19px]">{t.intro}</p>
          </Reveal>
        </div>

        <div className="md:col-span-7">
          {/* the second poster sits lower: two phones on a table, not a grid of tiles */}
          <div className="mx-auto grid max-w-[34rem] grid-cols-2 items-start gap-4 sm:gap-7">
            {cards.map((c, i) => (
              <div key={c.key} {...item(i, 0.1)} className={i === 1 ? "mt-10 sm:mt-16" : ""}>
                <a
                  href={c.href}
                  className="group relative block overflow-hidden rounded-[1.75rem] border border-white/15 bg-navy-900 shadow-navy"
                >
                  <Image
                    src={c.poster}
                    width={720}
                    height={1280}
                    alt=""
                    sizes="(min-width: 768px) 260px, 44vw"
                    className="block h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    draggable={false}
                  />
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 via-35% to-transparent to-60%" />
                  {/* At the foot, never in the middle: the middle of each poster is a face
                      (and the short's top carries its own Hindi words). The play button is
                      a gold disc that breathes, as the hero's shield does. */}
                  <span className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <span aria-hidden className="relative mb-3 block h-12 w-12 sm:h-14 sm:w-14">
                      <span
                        className="breathe absolute -inset-2.5 rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(245,165,36,.5), transparent 70%)" }}
                      />
                      <span className="relative grid h-full w-full place-items-center rounded-full bg-gold-400 text-navy-950 shadow-glow transition-transform duration-300 group-hover:scale-110">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="translate-x-[2px]">
                          <path d="M7 4.5v15l12.5-7.5z" />
                        </svg>
                      </span>
                    </span>
                    <span className="block text-[17px] font-semibold leading-tight text-white sm:text-[19px]">{c.copy.title}</span>
                    <span className="mt-1 block text-[13.5px] leading-snug text-navy-100 sm:text-[14.5px]">{fill(c.copy.note)}</span>
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
