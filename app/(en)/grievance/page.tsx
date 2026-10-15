import type { Metadata } from "next";
import GrievancePage from "@/views/GrievancePage";
import { siteMetadata } from "@/seo/site";

export const revalidate = 86400;

export const metadata: Metadata = siteMetadata("en", "/grievance");

export default function Page() {
  return <GrievancePage lang="en" />;
}
