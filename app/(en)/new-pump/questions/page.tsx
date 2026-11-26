import type { Metadata } from "next";
import NewPumpQuestionsPage from "@/views/NewPumpQuestionsPage";
import JsonLd from "@/seo/JsonLd";
import { newPumpQuestionsJsonLd } from "@/seo/graph";
import { siteMetadata } from "@/seo/site";

/* Rebuilt daily: its "read the full answer" links follow the Petrol pump guide's
   release calendar, so a guide page that goes live today is linked by tomorrow. */
export const revalidate = 86400;

export const metadata: Metadata = siteMetadata("en", "/new-pump/questions");

export default function Page() {
  return (
    <>
      <JsonLd data={newPumpQuestionsJsonLd("en")} />
      <NewPumpQuestionsPage lang="en" />
    </>
  );
}
