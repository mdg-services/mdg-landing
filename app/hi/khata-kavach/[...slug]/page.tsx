import type { Metadata } from "next";
import { GuideRoute, guideMetadata, releaseFor, guideParams } from "@/guides/route";
import { KK } from "@/guides/collections";

/**
 * The Khata Kavach pages under /hi/khata-kavach/: the guides' front door, the topics and
 * every page under them. Refreshed hourly: the pages it links to are the ones live today.
 */
export const revalidate = 3600;
// dynamicParams stays at its default (true) on purpose, as on the MDG guide routes:
// the proxy answers 404 for any address that is not a live page.

type Props = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return guideParams(KK, "hi", "khata-kavach");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return guideMetadata(KK, releaseFor(KK, "hi", "khata-kavach", (await params).slug));
}

export default async function Page({ params }: Props) {
  return <GuideRoute col={KK} release={releaseFor(KK, "hi", "khata-kavach", (await params).slug)} />;
}
