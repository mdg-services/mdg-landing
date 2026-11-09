import type { Metadata } from "next";
import { GuideRoute, guideMetadata, releaseFor } from "@/guides/route";
import { PUMP } from "@/guides/collections";

/** The Petrol pump guide's front door. Live from the first day; what it lists grows by the day. */
export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return guideMetadata(PUMP, releaseFor(PUMP, "en", "petrol-pump"));
}

export default function Page() {
  return <GuideRoute col={PUMP} release={releaseFor(PUMP, "en", "petrol-pump")} />;
}
