/**
 * What the `app/[lang]/…` routes (every language that lives under a prefix)
 * share: the languages to build, and the check that an address names one.
 *
 * English lives in `app/(en)/…` at the bare addresses; every other language is
 * the same route files with `lang` filled in, so a new language adds no
 * route files.
 */
import { notFound } from "next/navigation";
import { DEFAULT_LANG, OTHER_LANGS, isLang, type Lang } from "./languages";

export type LangProps = { params: Promise<{ lang: string }> };

/** `generateStaticParams` for the [lang] layout: one entry per prefixed language. */
export function langParams(): { lang: Lang }[] {
  return OTHER_LANGS.map((lang) => ({ lang }));
}

/** The route's language, or the site's 404 when the address is not one of ours. */
export async function routeLang(props: { params: Promise<{ lang: string }> }): Promise<Lang> {
  const { lang } = await props.params;
  if (!isLang(lang) || lang === DEFAULT_LANG) notFound();
  return lang;
}
