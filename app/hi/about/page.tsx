import type { Metadata } from "next";
import DocPage from "@/views/DocPage";
import { siteMetadata } from "@/seo/site";

export const revalidate = 86400;

export const metadata: Metadata = siteMetadata("hi", "/about");

export default function Page() {
  return <DocPage lang="hi" route="/about" />;
}
