/**
 * Where a link to a guide collection's front door should point from a page in a
 * language: that language's own front door when the collection has one, else
 * the English one. Server-side only (it reads the collections).
 */
import { MDG, KK, PUMP } from "./collections";
import { pageLangs } from "../../guide/calendar";
import { DEFAULT_LANG, localPath, type Lang } from "../i18n/languages";

const HUBS = { mdg: { col: MDG, root: "/guides/" }, kk: { col: KK, root: "/khata-kavach/guides/" }, pump: { col: PUMP, root: "/petrol-pump/" } } as const;

export function hubHref(key: keyof typeof HUBS, lang: Lang): string {
  const { col, root } = HUBS[key];
  const hub = col.byId.get("hub");
  const has = hub ? pageLangs(hub).includes(lang) : false;
  return localPath(has ? lang : DEFAULT_LANG, root);
}
