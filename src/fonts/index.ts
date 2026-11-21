import * as en from "./en";
import * as hi from "./hi";
import * as or from "./or";
import type { Lang } from "../i18n/languages";

/**
 * The faces of each language's pages. A language is a file here (copy
 * `or.ts`, swap the script's Google font) and one line below.
 */
const FACES: Record<Lang, { fontClassNames: string; lateFontClassNames: string }> = { en, hi, or };

export function fontsFor(lang: Lang) {
  return FACES[lang];
}
