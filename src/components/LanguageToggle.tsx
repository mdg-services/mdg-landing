"use client";

import { LANG_LABEL, LANG_STORE_KEY, langCookie, type Lang } from "../i18n/lang";
import { useLang } from "../i18n/client";
import { siteRoute } from "../routing/site";

const ORDER: Lang[] = ["en", "hi"];

/**
 * Both languages are always on screen, with the live one filled in. A
 * one-button toggle would be smaller, but it makes the reader work out which
 * state they are in before they can act; showing both means a dealer who
 * lands on the English page sees the word हिंदी and taps it.
 *
 * The other language is a plain link to this page's twin (`twin`), because the
 * URL decides the language: the server sends the right words, and a Hindi
 * reader never waits for a script to translate the page. The link to an
 * English page carries `?lang=en` (the proxy turns that into the clean address
 * plus the `mdg_lang` cookie), so choosing English works with no script and in
 * a new tab; without it a Hindi browser would be sent straight back to /hi.
 * The click only adds what a link cannot: the cookie at once, and localStorage
 * where the film pages look as well.
 *
 * `tone` picks the treatment for the surface it sits on: the white navbar,
 * or a navy band.
 */
export default function LanguageToggle({
  twin,
  tone = "light",
  className = "",
}: {
  /** Where the other language's version of this page lives. */
  twin: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const { lang, t } = useLang();

  // An English site page is reached as a choice, not as a bare address (guides
  // do not redirect by language, so their twin needs no query).
  const hrefFor = (code: Lang) => (code === "en" && siteRoute(twin) ? `${twin}?lang=en` : twin);

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
      {ORDER.map((code) => {
        const live = code === lang;
        const on =
          tone === "light"
            ? "bg-navy-700 text-white"
            : "bg-gold-400 text-navy-950";
        const off =
          tone === "light"
            ? "text-ink-muted hover:text-ink"
            : "text-navy-100 hover:text-white";
        const label = code === "en" ? "EN" : LANG_LABEL.hi;
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
            title={code === "hi" ? t.ui.switchToHindi : t.ui.switchToEnglish}
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
