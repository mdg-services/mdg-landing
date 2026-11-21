import type { Metadata } from "next";
import KhataKavachPage from "@/views/KhataKavachPage";
import JsonLd from "@/seo/JsonLd";
import { kkJsonLd } from "@/seo/graph";
import { siteMetadata } from "@/seo/site";
import { routeLang, type LangProps } from "@/i18n/route";

/** Static, refreshed hourly: its guides list grows as pages go live (and the footer's year turns over on its own). */
export const revalidate = 3600;

export async function generateMetadata(props: LangProps): Promise<Metadata> {
  return siteMetadata(await routeLang(props), "/khata-kavach");
}

export default async function Page(props: LangProps) {
  const lang = await routeLang(props);
  return (
    <>
      <JsonLd data={kkJsonLd(lang)} />
      <KhataKavachPage lang={lang} />
    </>
  );
}
