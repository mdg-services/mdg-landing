/**
 * The dictionaries, for server components. Importing this from a component
 * that runs in the browser would ship both languages, so the browser side
 * never does: it reads the slices it needs from `client.tsx`'s context, which
 * the layout fills from here.
 */
import { en } from "./en";
import { hi } from "./hi";
import type { CommonDict, Dict, Lang } from "./lang";

const DICTS: Record<Lang, Dict> = { en, hi };

export function getT(lang: Lang): Dict {
  return DICTS[lang];
}

/** What every page needs in the browser: the call sheet, the navbar, the switch. */
export function commonDict(lang: Lang): CommonDict {
  const { ui, nav } = DICTS[lang];
  return { ui, nav };
}
