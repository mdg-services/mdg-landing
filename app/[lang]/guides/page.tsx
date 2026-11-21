import type { Metadata } from "next";
import { GuideRoute, guideMetadata, releaseFor } from "@/guides/route";
import { MDG } from "@/guides/collections";
import { routeLang, type LangProps } from "@/i18n/route";

/** The guides' front door. Live from the first day; what it lists grows by the day. */
export const revalidate = 3600;

export async function generateMetadata(props: LangProps): Promise<Metadata> {
  return guideMetadata(MDG, releaseFor(MDG, await routeLang(props), "guides"));
}

export default async function Page(props: LangProps) {
  return <GuideRoute col={MDG} release={releaseFor(MDG, await routeLang(props), "guides")} />;
}
