import type { Metadata } from "next";
import DocPage from "@/views/DocPage";
import { siteMetadata } from "@/seo/site";
import { routeLang, type LangProps } from "@/i18n/route";

export const revalidate = 86400;

export async function generateMetadata(props: LangProps): Promise<Metadata> {
  return siteMetadata(await routeLang(props), "/pricing");
}

export default async function Page(props: LangProps) {
  return <DocPage lang={await routeLang(props)} route="/pricing" />;
}
