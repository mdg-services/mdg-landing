import type { Metadata } from "next";
import { GuideRoute, guideMetadata, releaseFor, guideParams } from "@/guides/route";
import { PUMP } from "@/guides/collections";

/** The Petrol pump guide's pages under /petrol-pump/. Refreshed hourly: the pages it links to are the ones live today. */
export const revalidate = 3600;
// dynamicParams stays at its default (true) on purpose, as on the other guide routes:
// the proxy answers 404 for any address that is not a live page.

type Props = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return guideParams(PUMP, "en", "petrol-pump");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return guideMetadata(PUMP, releaseFor(PUMP, "en", "petrol-pump", (await params).slug));
}

export default async function Page({ params }: Props) {
  return <GuideRoute col={PUMP} release={releaseFor(PUMP, "en", "petrol-pump", (await params).slug)} />;
}
