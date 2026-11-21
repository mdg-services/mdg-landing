import type { Metadata } from "next";
import { GuideRoute, guideMetadata, releaseFor, toolParams } from "@/guides/route";
import { MDG } from "@/guides/collections";
import { routeLang, type LangProps } from "@/i18n/route";
import { isLang } from "@/i18n/lang";

/** The MDG tools. Refreshed hourly: the pages they link to are the ones live today. */
export const revalidate = 3600;
// dynamicParams for the slug stays at its default (true) on purpose: see the guide routes.

type Props = LangProps & { params: Promise<{ lang: string; slug: string }> };

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  return isLang(params.lang) ? toolParams(MDG, params.lang) : [];
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  return guideMetadata(MDG, releaseFor(MDG, await routeLang(props), "tools", [(await props.params).slug]));
}

export default async function Page(props: Props) {
  return <GuideRoute col={MDG} release={releaseFor(MDG, await routeLang(props), "tools", [(await props.params).slug])} />;
}
