import { en } from "../../i18n/en";
import { hi } from "../../i18n/hi";
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
export type AssistDict = typeof en.assist;

export function assistDict(lang: AssistLang): AssistDict {
  return lang === "hi" ? hi.assist : en.assist;
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
