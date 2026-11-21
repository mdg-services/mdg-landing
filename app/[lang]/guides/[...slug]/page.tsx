import type { Metadata } from "next";
import { GuideRoute, guideMetadata, releaseFor, guideParams } from "@/guides/route";
import { MDG } from "@/guides/collections";
import { routeLang, type LangProps } from "@/i18n/route";
import { isLang } from "@/i18n/lang";

/** The MDG guide pages below the front door. Refreshed hourly: the pages it links to are the ones live today. */
export const revalidate = 3600;
// dynamicParams for the slug stays at its default (true) on purpose, as on the English
// routes: the proxy already answers 404 for any address that is not a live page, and the
// daily cron (api/indexnow) purges the saved copies: with `false` a purged page is a 404
// until the next build; with the default it is simply rendered again. (The [lang] layer
// above is `false`: an address that names no language is never a page.)

type Props = LangProps & { params: Promise<{ lang: string; slug: string[] }> };

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  return isLang(params.lang) ? guideParams(MDG, params.lang, "guides") : [];
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  return guideMetadata(MDG, releaseFor(MDG, await routeLang(props), "guides", (await props.params).slug));
}

export default async function Page(props: Props) {
  return <GuideRoute col={MDG} release={releaseFor(MDG, await routeLang(props), "guides", (await props.params).slug)} />;
}
