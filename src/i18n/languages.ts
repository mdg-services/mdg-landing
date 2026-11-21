/**
 * The one list of languages the site speaks.
 *
 * Everything that differs from one language to the next and is not a sentence
 * lives here: the address prefix, the name a reader recognises, the codes
 * search engines want, the small words the guide pages draw by themselves, the
 * rule for how long a page may run. The sentences live in `src/i18n/<code>/`.
 *
 * To add a language, start from LANGUAGES.md in the project root: this entry
 * is step one, and `npm run lang:check` lists every other step that is still
 * missing.
 *
 * Plain data, no React and no Node: the server, the proxy, the command-line
 * tools and the browser all import it.
 */

export interface Language {
  /** The address prefix: "" for the default language, "/hi" for Hindi. */
  prefix: string;
  /** What the reader calls it, in its own script. */
  native: string;
  /** The English name, for people and for structured data. */
  english: string;
  /** The label on the language switch (short). */
  short: string;
  /** What the switch's link says, written in the language it leads to. */
  switchTitle: string;
  /** "language", in this language: the switch's group label. */
  languageWord: string;
  /** IETF tag for `inLanguage` and the like. */
  bcp47: string;
  /** Open Graph locale. */
  ogLocale: string;
  /** Primary language subtags a browser may send in Accept-Language for this language. */
  accept: string[];
  /** True for scripts that need the taller line and the untracked letters (see index.css `data-indic`). */
  indic: boolean;
  /** A letter of the script, for the check that a page really is in it; null for Latin. */
  script: RegExp | null;
  /** Sentence end. */
  stop: string;
  /**
   * How many words a guide page may run, against English (1). Languages that
   * stand a word on its own for every little word (Hindi: के, में, की) need
   * more than ones that attach them.
   */
  wordFactor: number;
  /** The twelve months, January first, for the "checked on" dates. */
  months: string[];
  /** The word a table's accessible name starts with. */
  tableWord: string;
  /** The breadcrumb's accessible name. */
  breadcrumb: string;
}

export const LANGUAGES = {
  en: {
    prefix: "",
    native: "English",
    english: "English",
    short: "EN",
    switchTitle: "Read this page in English",
    languageWord: "Language",
    bcp47: "en-IN",
    ogLocale: "en_IN",
    accept: ["en"],
    indic: false,
    script: null,
    stop: ".",
    wordFactor: 1,
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    tableWord: "Table",
    breadcrumb: "Breadcrumb",
  },
  hi: {
    prefix: "/hi",
    native: "हिंदी",
    english: "Hindi",
    short: "हिंदी",
    switchTitle: "इस पेज को हिंदी में पढ़ें",
    languageWord: "भाषा",
    bcp47: "hi-IN",
    ogLocale: "hi_IN",
    accept: ["hi"],
    indic: true,
    script: /[ऀ-ॿ]/,
    stop: "।",
    wordFactor: 1.6,
    months: ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
    tableWord: "तालिका",
    breadcrumb: "नेविगेशन पथ",
  },
  or: {
    prefix: "/or",
    native: "ଓଡ଼ିଆ",
    english: "Odia",
    short: "ଓଡ଼ିଆ",
    switchTitle: "ଏହି ପୃଷ୍ଠାକୁ ଓଡ଼ିଆରେ ପଢ଼ନ୍ତୁ",
    languageWord: "ଭାଷା",
    bcp47: "or-IN",
    ogLocale: "or_IN",
    // "ory" is the code some phones send for Odia (Oriya, macrolanguage "or")
    accept: ["or", "ory"],
    indic: true,
    script: /[଀-୿]/,
    stop: "।",
    wordFactor: 1.3,
    months: ["ଜାନୁଆରୀ", "ଫେବୃଆରୀ", "ମାର୍ଚ୍ଚ", "ଏପ୍ରିଲ", "ମେ", "ଜୁନ", "ଜୁଲାଇ", "ଅଗଷ୍ଟ", "ସେପ୍ଟେମ୍ବର", "ଅକ୍ଟୋବର", "ନଭେମ୍ବର", "ଡିସେମ୍ବର"],
    tableWord: "ତାଲିକା",
    breadcrumb: "ନେଭିଗେସନ ପଥ",
  },
} as const satisfies Record<string, Language>;

export type Lang = keyof typeof LANGUAGES;

/** Every language, the default first. */
export const LANGS = Object.keys(LANGUAGES) as Lang[];

/** The language of the bare address (`/`, `/register`, …). */
export const DEFAULT_LANG: Lang = "en";

/** The languages that live under a prefix. */
export const OTHER_LANGS = LANGS.filter((l) => l !== DEFAULT_LANG);

export function isLang(v: unknown): v is Lang {
  return typeof v === "string" && Object.prototype.hasOwnProperty.call(LANGUAGES, v);
}

/** The language's registry entry, typed as the general shape (so optional lookups type-check). */
export function languageOf(lang: Lang): Language {
  return LANGUAGES[lang];
}

/** "/hi" for Hindi, "" for English: `${prefixOf(lang)}/guides/` is a guide address. */
export function prefixOf(lang: Lang): string {
  return LANGUAGES[lang].prefix;
}

/** A site-relative path in a language: ("or", "/guides/") -> "/or/guides/", ("en", "/") -> "/". */
export function localPath(lang: Lang, path: string): string {
  if (lang === DEFAULT_LANG) return path;
  return path === "/" ? prefixOf(lang) || "/" : `${prefixOf(lang)}${path}`;
}

/** Which language an address is in, by its prefix. English when no prefix matches. */
export function langOfPath(pathname: string): Lang {
  for (const l of OTHER_LANGS) {
    const p = prefixOf(l);
    if (pathname === p || pathname.startsWith(`${p}/`)) return l;
  }
  return DEFAULT_LANG;
}

/** The address without its language prefix: "/or/about" -> "/about", "/or" -> "/". */
export function stripPrefix(pathname: string): string {
  const l = langOfPath(pathname);
  if (l === DEFAULT_LANG) return pathname;
  const rest = pathname.slice(prefixOf(l).length);
  return rest === "" ? "/" : rest;
}

/**
 * A table of words by language: English and Hindi are required, a further
 * language may add its own. A language the table leaves out reads English
 * (`fillLangs`), so a collection that has no pages in a language never needs
 * words for it.
 */
export type PerLang<T> = Record<"en" | "hi", T> & Partial<Record<Lang, T>>;

/** The table with every language present: the ones it lacks read English. */
export function fillLangs<T>(m: PerLang<T>): Record<Lang, T> {
  return Object.fromEntries(LANGS.map((l) => [l, m[l] ?? m.en])) as Record<Lang, T>;
}
