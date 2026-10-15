import type { Metadata } from "next";
import GrievancePage from "@/views/GrievancePage";
import { siteMetadata } from "@/seo/site";

export const revalidate = 86400;

/** Plural is what people type; same page, and its canonical address is the singular one. */
export const metadata: Metadata = siteMetadata("en", "/grievances");

export default function Page() {
  return <GrievancePage lang="en" route="/grievances" />;
}
