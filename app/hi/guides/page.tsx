import type { Metadata } from "next";
import { GuideRoute, guideMetadata, releaseFor } from "@/guides/route";
import { MDG } from "@/guides/collections";

/** The guides' front door. Live from the first day; what it lists grows by the day. */
export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return guideMetadata(MDG, releaseFor(MDG, "hi", "guides"));
}

export default function Page() {
  return <GuideRoute col={MDG} release={releaseFor(MDG, "hi", "guides")} />;
}
