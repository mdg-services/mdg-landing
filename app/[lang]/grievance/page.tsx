import type { Metadata } from "next";
import GrievancePage from "@/views/GrievancePage";
import { siteMetadata } from "@/seo/site";
import { routeLang, type LangProps } from "@/i18n/route";

export const revalidate = 86400;

export async function generateMetadata(props: LangProps): Promise<Metadata> {
  return siteMetadata(await routeLang(props), "/grievance");
}

export default async function Page(props: LangProps) {
  return <GrievancePage lang={await routeLang(props)} />;
}
