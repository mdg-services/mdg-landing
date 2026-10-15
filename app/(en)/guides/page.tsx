import type { Metadata } from "next";
import { GuideRoute, guideMetadata, releaseFor } from "@/guides/route";

/** The guides' front door. Live from the first day; what it lists grows by the day. */
export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return guideMetadata(releaseFor("en", "guides"));
}

export default function Page() {
  return <GuideRoute release={releaseFor("en", "guides")} />;
}
