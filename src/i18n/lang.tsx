/* eslint-disable react-refresh/only-export-components -- the provider and the
   hooks and constants that belong to it are one module. Splitting them so
   Fast Refresh stays happy would scatter the language rules across three
   files for no reader's benefit. */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { en } from "./en";
import { hi } from "./hi";
import { checkParity } from "./parity";

/* ─────────────────────────────────────────────────────────────────────────
   Language.

   Two languages, one rule about which one wins:

     1. What the reader last chose here, if they ever chose.
     2. Otherwise, whatever their phone or browser is already set to.

   A reader who has never touched the switch keeps following their device,
   every visit, forever. The moment they touch it, that choice is theirs and
   the device stops deciding. `?lang=hi` counts as touching it, so a Hindi
   link shared on a dealer WhatsApp group opens in Hindi and stays that way.
   ───────────────────────────────────────────────────────────────────────── */

export const LANGS = ["en", "hi"] as const;
export type Lang = (typeof LANGS)[number];

/** The English dictionary is the shape every other language must satisfy. */
export type Dict = typeof en;

const DICTS: Record<Lang, Dict> = { en, hi };

/** Written in the language itself: a reader must recognise their own. */
export const LANG_LABEL: Record<Lang, string> = { en: "English", hi: "हिंदी" };

const STORE_KEY = "mdg.lang";

function isLang(v: unknown): v is Lang {
  return typeof v === "string" && (LANGS as readonly string[]).includes(v);
}

/** An explicit choice made on a previous visit. */
function stored(): Lang | null {
  try {
    const v = localStorage.getItem(STORE_KEY);
    return isLang(v) ? v : null;
  } catch {
    return null; // private mode, storage disabled: fall through to the device
  }
}

function persist(lang: Lang) {
  try {
    localStorage.setItem(STORE_KEY, lang);
  } catch {
    /* nothing to do; the choice just will not survive the visit */
  }
}

/** `?lang=hi` on the URL. Treated as a choice, not a hint. */
function fromQuery(): Lang | null {
  if (typeof window === "undefined") return null;
  const v = new URLSearchParams(window.location.search).get("lang");
  return isLang(v) ? v : null;
}

/** Drop `?lang=` once it has been honoured, so the address bar stays clean. */
function clearQuery() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("lang")) return;
  url.searchParams.delete("lang");
  window.history.replaceState({}, "", url.pathname + url.search + url.hash);
}

/**
 * What the device asks for. `navigator.languages` is ordered by preference,
 * so the first entry we can actually serve wins; "hi-IN" and "hi" both count.
 */
export function systemLang(): Lang {
  if (typeof navigator === "undefined") return "en";
  const list =
    (navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language]) ?? [];
  for (const tag of list) {
    const primary = String(tag).toLowerCase().split("-")[0];
    if (isLang(primary)) return primary;
  }
  return "en";
}

type Ctx = {
  lang: Lang;
  /** false while the reader is still just following their device. */
  chosen: boolean;
  setLang: (lang: Lang) => void;
  t: Dict;
};

const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => fromQuery() ?? stored() ?? systemLang());
  const [chosen, setChosen] = useState<boolean>(() => fromQuery() !== null || stored() !== null);

  // A URL that carried ?lang= is a choice: remember it, then tidy the URL.
  useEffect(() => {
    const q = fromQuery();
    if (q) {
      persist(q);
      clearQuery();
    }
  }, []);

  // Nobody has chosen, so the device is still in charge — including if it
  // changes language mid-session.
  useEffect(() => {
    if (chosen) return;
    const onChange = () => setLangState(systemLang());
    window.addEventListener("languagechange", onChange);
    return () => window.removeEventListener("languagechange", onChange);
  }, [chosen]);

  const t = DICTS[lang];

  // Everything outside React that has to agree about the language.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dataset.lang = lang; // Devanagari needs its own line-height and tracking
    document.title = t.meta.title;
    setMeta("name", "description", t.meta.description);
    setMeta("property", "og:title", t.meta.ogTitle);
    setMeta("property", "og:description", t.meta.ogDescription);
    setMeta("property", "og:locale", lang === "hi" ? "hi_IN" : "en_IN");
  }, [lang, t]);

  // Types prove the two dictionaries have the same keys; only a run of the
  // program can prove their lists are the same length.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const problems = checkParity(en, hi);
    if (problems.length) console.error("[i18n] dictionaries disagree:\n" + problems.join("\n"));
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    setChosen(true);
    persist(next);
  }, []);

  const value = useMemo<Ctx>(() => ({ lang, chosen, setLang, t }), [lang, chosen, setLang, t]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function useLang(): Ctx {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}

/** Every visible string, in the language currently on screen. */
export function useT(): Dict {
  return useLang().t;
}
