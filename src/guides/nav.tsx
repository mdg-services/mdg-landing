import type { NavItem } from "../components/Navbar";
import { KK_ANCHORS } from "../data/kk";
import { getT } from "../i18n/server";
import type { Collection, Lang } from "./collection";

/**
 * The navbar a guide page wears. The MDG guides keep the site's own bar (the
 * home page's sections and "Guides"); the Khata Kavach pages wear the bar of
 * the Khata Kavach page itself: its own sections, "Guides" (the Khata Kavach
 * guides' front door, marked as here) and its own call to action, so a reader
 * is never sent to Dealer's Kavach's pricing from a page about credit.
 */
export function guideNav(col: Collection, lang: Lang): { items?: NavItem[]; cta?: { href: string } } {
  if (col.key !== "kk") return {};
  const t = getT(lang);
  const page = lang === "hi" ? "/hi/khata-kavach" : "/khata-kavach";
  const n = t.kk.navItems;
  return {
    items: [
      { key: "how", href: `${page}#${KK_ANCHORS.how}`, label: n.how },
      { key: "pump", href: `${page}#${KK_ANCHORS.pump}`, label: n.pump },
      { key: "transporter", href: `${page}#${KK_ANCHORS.transporter}`, label: n.transporter },
      { key: "guides", href: `${lang === "hi" ? "/hi" : ""}/khata-kavach/guides/`, label: t.nav.guides, here: true },
    ],
    cta: { href: `${page}#${KK_ANCHORS.start}` },
  };
}
