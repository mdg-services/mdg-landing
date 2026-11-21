"use client";

import { DEFAULT_LANG, LANGS, LANGUAGES, LANG_STORE_KEY, langCookie, type Lang, type Versions } from "../i18n/lang";
import { useLang } from "../i18n/client";
import { siteRoute } from "../routing/site";

/**
 * Every language the page exists in is on screen, with the live one filled in.
 * A one-button toggle would be smaller, but it makes the reader work out which
 * state they are in before they can act; showing all of them means a dealer
 * who lands on the English page sees the word हिंदी or ଓଡ଼ିଆ and taps it. A
 * language the page has no version in (a guide that was not written in Odia)
 * is not offered, so no tap ever lands on a page that is not there.
 *
 * The other languages are plain links to this page's versions (`versions`),
 * because the URL decides the language: the server sends the right words, and
 * a Hindi or Odia reader never waits for a script to translate the page. The
 * link to an English page carries `?lang=en` (the proxy turns that into the
 * clean address plus the `mdg_lang` cookie), so choosing English works with no
 * script and in a new tab; without it a Hindi browser would be sent straight
 * back to /hi. The click only adds what a link cannot: the cookie at once, and
 * localStorage where the film pages look as well.
 *
 * `tone` picks the treatment for the surface it sits on: the white navbar,
 * or a navy band.
 */
export default function LanguageToggle({
  versions,
  tone = "light",
  className = "",
}: {
  /** Where each language's version of this page lives (a language with no version is left out). */
  versions: Versions;
  tone?: "light" | "dark";
  className?: string;
}) {
  const { lang, t } = useLang();

  // An English site page is reached as a choice, not as a bare address (guides
  // do not redirect by language, so their twin needs no query).
  const hrefFor = (code: Lang) => {
    const to = versions[code] ?? "/";
    return code === DEFAULT_LANG && siteRoute(to) ? `${to}?lang=${code}` : to;
  };
  const shown = LANGS.filter((code) => code === lang || versions[code]);
  // one language only: nothing to switch
  if (shown.length < 2) return null;

  const shell =
    tone === "light"
      ? "border-ink-hairline bg-white"
      : "border-white/20 bg-white/10";

  return (
    <div
      role="group"
      aria-label={t.ui.languageAria}
      className={`inline-flex shrink-0 items-center rounded-full border p-[3px] ${shell} ${className}`}
    >
      {shown.map((code) => {
        const live = code === lang;
        const on =
          tone === "light"
            ? "bg-navy-700 text-white"
            : "bg-gold-400 text-navy-950";
        const off =
          tone === "light"
            ? "text-ink-muted hover:text-ink"
            : "text-navy-100 hover:text-white";
        const label = LANGUAGES[code].short;
        const cls = `rounded-full px-3 py-1 text-[12.5px] font-semibold leading-[1.5] transition-colors duration-200 ${
          live ? on : off
        }`;
        if (live) {
          return (
            <span key={code} aria-current="true" lang={code} className={cls}>
              {label}
            </span>
          );
        }
        return (
          <a
            key={code}
            href={hrefFor(code)}
            hrefLang={code}
            lang={code}
            onClick={() => remember(code)}
            title={LANGUAGES[code].switchTitle}
            className={cls}
          >
            {label}
          </a>
        );
      })}
    </div>
  );
}

/** A choice made on purpose: kept for a year, where the proxy and the film pages can read it. */
function remember(lang: Lang) {
  try {
    document.cookie = langCookie(lang);
  } catch {
    /* cookies blocked: the page still switches, it just will not be remembered */
  }
  try {
    localStorage.setItem(LANG_STORE_KEY, lang);
  } catch {
    /* private mode, storage disabled */
  }
}
