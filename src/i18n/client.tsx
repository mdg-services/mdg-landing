"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { CommonDict, Lang } from "./lang";

/**
 * The language of the page and the words the browser-side parts need.
 *
 * The server decides the language from the URL and hands both down; nothing
 * here guesses from the device, so what the server rendered is exactly what
 * the browser shows. Larger slices (the enrolment form's, the grievance
 * form's) are not in here: the page passes them to the form that needs them.
 */
type Ctx = { lang: Lang; t: CommonDict };

const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ lang, t, children }: { lang: Lang; t: CommonDict; children: ReactNode }) {
  return <LangContext.Provider value={{ lang, t }}>{children}</LangContext.Provider>;
}

export function useLang(): Ctx {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}

/** The common words, in the language on screen. */
export function useT(): CommonDict {
  return useLang().t;
}
