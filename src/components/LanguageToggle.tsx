import { LANG_LABEL, useLang, type Lang } from "../i18n";

const ORDER: Lang[] = ["en", "hi"];

/**
 * Both languages are always on screen, with the live one filled in. A
 * one-button toggle would be smaller, but it makes the reader work out which
 * state they are in before they can act; showing both means a dealer who
 * lands on the English page sees the word हिंदी and taps it.
 *
 * `tone` picks the treatment for the surface it sits on: the white navbar,
 * or a navy band.
 */
export default function LanguageToggle({
  tone = "light",
  className = "",
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const { lang, setLang, t } = useLang();

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
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={live}
            lang={code}
            title={code === "hi" ? t.ui.switchToHindi : t.ui.switchToEnglish}
            className={`rounded-full px-3 py-1 text-[12.5px] font-semibold leading-[1.5] transition-colors duration-200 ${
              live ? on : off
            }`}
          >
            {code === "en" ? "EN" : LANG_LABEL.hi}
          </button>
        );
      })}
    </div>
  );
}
