import type { Metadata } from "next";
import GrievancePage from "@/views/GrievancePage";
import { siteMetadata } from "@/seo/site";
import { routeLang, type LangProps } from "@/i18n/route";

export const revalidate = 86400;

/** Plural is what people type; same page, and its canonical address is the singular one. */
export async function generateMetadata(props: LangProps): Promise<Metadata> {
  return siteMetadata(await routeLang(props), "/grievances");
}

export default async function Page(props: LangProps) {
  return <GrievancePage lang={await routeLang(props)} route="/grievances" />;
}
