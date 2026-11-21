import type { ReactNode } from "react";
import CallSheet from "../components/CallSheet";
import AssistLoader from "../components/AssistLoader";
import LateFonts from "../components/LateFonts";
import RevealObserver from "../components/RevealObserver";
import { LangProvider } from "../i18n/client";
import { commonDict } from "../i18n/server";
import { LANGUAGES, type Lang } from "../i18n/lang";

/**
 * The <html> and <body> of every page, in one language. The language is a
 * property of the URL, so `lang`, `data-lang` and `data-indic` (which the
 * taller-line, untracked-letter rules for Devanagari and Odia in index.css hang
 * off) are in the HTML the server sends, not set later by a script. The floating "Call us" handset and the lazy assistant live here so
 * they are on every page.
 */
export default function RootShell({
  lang,
  fontClassNames,
  lateFontClassNames = "",
  children,
}: {
  lang: Lang;
  fontClassNames: string;
  /** Font variable classes to add once the page has loaded (see LateFonts). */
  lateFontClassNames?: string;
  children: ReactNode;
}) {
  return (
    <html lang={lang} data-lang={lang} data-indic={LANGUAGES[lang].indic ? "" : undefined} className={fontClassNames}>
      <body>
        <LangProvider lang={lang} t={commonDict(lang)}>
          {children}
          {/* Outside the page on purpose: the assistant is on every page, and
              its launcher must sit above the navbar (z-50) and the scroll
              progress bar (z-60). The floating handset and the call choice
              behind every "Call us" go with it. */}
          <AssistLoader />
          <CallSheet />
          <RevealObserver />
          <LateFonts classNames={lateFontClassNames} />
        </LangProvider>
      </body>
    </html>
  );
}
