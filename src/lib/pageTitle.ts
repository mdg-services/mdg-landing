import { useEffect } from "react";
import { useT } from "../i18n";

/**
 * Set the browser tab's title for one page, in the language on screen, and
 * put the site's own title back when the visitor leaves it.
 *
 * Every other page of the site carries the home title, which the language
 * provider writes (`meta.title`), so that is what "back" means. Its effect runs
 * before this one on a first load and on a language change, so this title is
 * the last word on both.
 */
export function usePageTitle(title: string): void {
  const home = useT().meta.title;
  useEffect(() => {
    document.title = title;
    return () => {
      document.title = home;
    };
  }, [title, home]);
}
