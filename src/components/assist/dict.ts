import { assist as enAssist } from "../../i18n/en/assist";
import { assist as hiAssist } from "../../i18n/hi/assist";
import { grievance as enGrievance } from "../../i18n/en/grievance";
import { grievance as hiGrievance } from "../../i18n/hi/grievance";
import type { GrievanceCategory } from "../../data/content";
import type { AssistLang } from "../../types/assist";
import type { CallPhase } from "./useAssistCall";

/**
 * The widget picks its own language.
 *
 * The rest of the site reads `useT()`, which follows the page. The assistant
 * has its own toggle, seeded from the page, because the language a visitor
 * wants to be *answered* in is not always the language they were reading in:
 * a dealer skims the English page and then asks the question in Hindi. So the
 * panel reads whichever dictionary its own toggle points at, and leaves the
 * page alone.
 */
export type AssistDict = typeof enAssist;

export function assistDict(lang: AssistLang): AssistDict {
  return lang === "hi" ? hiAssist : enAssist;
}

/**
 * The six things a grievance can be about, in the widget's language.
 *
 * These are the labels the website's own grievance page already prints, so the
 * same complaint is called the same thing wherever it is filed. The key is what
 * the server is sent; only the label changes with the language.
 */
export function grievanceCategoryLabels(lang: AssistLang): Record<GrievanceCategory, string> {
  return lang === "hi" ? hiGrievance.categories : enGrievance.categories;
}

/**
 * What the call is doing, in words.
 *
 * Lives here rather than in the call strip because two places say it: the
 * strip a visitor reads, and the panel's `aria-live` region a screen reader
 * hears. They must never drift apart.
 */
export function callPhaseLabel(d: AssistDict, phase: CallPhase): string {
  switch (phase) {
    case "connecting":
      return d.call.connecting;
    case "thinking":
      return d.call.thinking;
    case "speaking":
      return d.call.speaking;
    case "ended":
      return d.call.ended;
    default:
      return d.call.listening;
  }
}
