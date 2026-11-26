import type { Metadata } from "next";
import NewPumpQuestionsPage from "@/views/NewPumpQuestionsPage";
import JsonLd from "@/seo/JsonLd";
import { newPumpQuestionsJsonLd } from "@/seo/graph";
import { siteMetadata } from "@/seo/site";
import { routeLang, type LangProps } from "@/i18n/route";

/* Rebuilt daily: its "read the full answer" links follow the Petrol pump guide's
   release calendar, so a guide page that goes live today is linked by tomorrow. */
export const revalidate = 86400;

export async function generateMetadata(props: LangProps): Promise<Metadata> {
  return siteMetadata(await routeLang(props), "/new-pump/questions");
}

export default async function Page(props: LangProps) {
  const lang = await routeLang(props);
  return (
    <>
      <JsonLd data={newPumpQuestionsJsonLd(lang)} />
      <NewPumpQuestionsPage lang={lang} />
    </>
  );
}
