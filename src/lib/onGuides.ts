import { usePathname } from "next/navigation";

const GUIDES = /^\/(?:hi\/)?(?:guides|tools)(?:\/|$)/;

/**
 * True on the guides and tools pages. These are reading pages: on a phone the
 * floating "Call us" pill and the assistant's invitation bubble sit on top of
 * the text, and the header already carries "Call us" and the assistant, so
 * the floating call pill is hidden there on phones (the round assistant button stays).
 */
export function useOnGuides(): boolean {
  return GUIDES.test(usePathname() ?? "");
}
