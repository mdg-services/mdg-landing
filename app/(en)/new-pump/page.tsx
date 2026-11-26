import type { Metadata } from "next";
import NewPumpPage from "@/views/NewPumpPage";
import JsonLd from "@/seo/JsonLd";
import { newPumpJsonLd } from "@/seo/graph";
import { siteMetadata } from "@/seo/site";

/** Static; the words and the price change only with a deploy. Refreshed daily so the footer's year turns over on its own. */
export const revalidate = 86400;

export const metadata: Metadata = siteMetadata("en", "/new-pump");

export default function Page() {
  return (
    <>
      <JsonLd data={newPumpJsonLd("en")} />
      <NewPumpPage lang="en" />
    </>
  );
}
