import { usePathname } from "next/navigation";

/** The MDG guides and tools, and the Khata Kavach pages below the product page (not its privacy page). */
const GUIDES = /^\/(?:hi\/)?(?:(?:guides|tools)(?:\/|$)|khata-kavach\/(?!privacy\/?$)[^/])/;

/** True for a path under the guides or tools, of either collection (also usable outside React, e.g. in an effect that runs once). */
export function isGuidesPath(pathname: string): boolean {
  return GUIDES.test(pathname);
}

/**
 * True on the guide and tool pages (the MDG guides and the Khata Kavach pages).
 * These are reading pages: on a phone the
 * floating "Call us" pill and the assistant's invitation bubble sit on top of
 * the text, and the header already carries "Call us" and the assistant, so
 * the floating call pill is hidden there on phones (the round assistant button stays).
 */
export function useOnGuides(): boolean {
  return isGuidesPath(usePathname() ?? "");
}
