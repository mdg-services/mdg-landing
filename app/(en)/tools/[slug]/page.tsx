import type { Metadata } from "next";
import { GuideRoute, guideMetadata, releaseFor, toolParams } from "@/guides/route";
import { MDG } from "@/guides/collections";

/** Refreshed hourly: the pages it links to are the ones live today. */
export const revalidate = 3600;
// dynamicParams stays at its default (true) on purpose. The proxy already answers
// 404 for any address that is not a real page, and the daily cron (api/indexnow)
// purges the saved copies: with `false` a purged page is a 404 until the next
// build (NoFallbackError); with the default it is simply rendered again.

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return toolParams(MDG, "en");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return guideMetadata(MDG, releaseFor(MDG, "en", "tools", [(await params).slug]));
}

export default async function Page({ params }: Props) {
  return <GuideRoute col={MDG} release={releaseFor(MDG, "en", "tools", [(await params).slug])} />;
}
