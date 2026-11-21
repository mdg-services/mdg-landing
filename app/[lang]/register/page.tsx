import type { Metadata } from "next";
import RegisterPage from "@/views/RegisterPage";
import { siteMetadata } from "@/seo/site";
import { routeLang, type LangProps } from "@/i18n/route";

export const revalidate = 86400;

export async function generateMetadata(props: LangProps): Promise<Metadata> {
  return siteMetadata(await routeLang(props), "/register");
}

export default async function Page(props: LangProps) {
  return <RegisterPage lang={await routeLang(props)} />;
}
