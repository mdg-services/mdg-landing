import type { Metadata } from "next";
import NewPumpPage from "@/views/NewPumpPage";
import JsonLd from "@/seo/JsonLd";
import { newPumpJsonLd } from "@/seo/graph";
import { siteMetadata } from "@/seo/site";
import { routeLang, type LangProps } from "@/i18n/route";

/** Static; the words and the price change only with a deploy. Refreshed daily so the footer's year turns over on its own. */
export const revalidate = 86400;

export async function generateMetadata(props: LangProps): Promise<Metadata> {
  return siteMetadata(await routeLang(props), "/new-pump");
}

export default async function Page(props: LangProps) {
  const lang = await routeLang(props);
  return (
    <>
      <JsonLd data={newPumpJsonLd(lang)} />
      <NewPumpPage lang={lang} />
    </>
  );
}
