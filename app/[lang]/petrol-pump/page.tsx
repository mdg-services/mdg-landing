import type { Metadata } from "next";
import { GuideRoute, guideMetadata, releaseFor } from "@/guides/route";
import { PUMP } from "@/guides/collections";
import { routeLang, type LangProps } from "@/i18n/route";

/** The Petrol pump guide's front door. Live from the first day; what it lists grows by the day. */
export const revalidate = 3600;

export async function generateMetadata(props: LangProps): Promise<Metadata> {
  return guideMetadata(PUMP, releaseFor(PUMP, await routeLang(props), "petrol-pump"));
}

export default async function Page(props: LangProps) {
  return <GuideRoute col={PUMP} release={releaseFor(PUMP, await routeLang(props), "petrol-pump")} />;
}
