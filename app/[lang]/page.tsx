import type { Metadata } from "next";
import HomePage from "@/views/HomePage";
import JsonLd from "@/seo/JsonLd";
import { homeJsonLd } from "@/seo/graph";
import { siteMetadata } from "@/seo/site";
import { routeLang, type LangProps } from "@/i18n/route";

/** Static, refreshed hourly: the "Guides for dealers" cards grow as guide pages go live (and the footer's year turns over on its own). */
export const revalidate = 3600;

export async function generateMetadata(props: LangProps): Promise<Metadata> {
  return siteMetadata(await routeLang(props), "");
}

export default async function Page(props: LangProps) {
  const lang = await routeLang(props);
  return (
    <>
      <JsonLd data={homeJsonLd(lang)} />
      <HomePage lang={lang} />
    </>
  );
}
