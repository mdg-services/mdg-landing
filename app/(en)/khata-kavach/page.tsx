import type { Metadata } from "next";
import KhataKavachPage from "@/views/KhataKavachPage";
import JsonLd from "@/seo/JsonLd";
import { kkJsonLd } from "@/seo/graph";
import { siteMetadata } from "@/seo/site";

/** Static, refreshed daily so the footer's year turns over on its own. */
export const revalidate = 86400;

export const metadata: Metadata = siteMetadata("en", "/khata-kavach");

export default function Page() {
  return (
    <>
      <JsonLd data={kkJsonLd("en")} />
      <KhataKavachPage lang="en" />
    </>
  );
}
