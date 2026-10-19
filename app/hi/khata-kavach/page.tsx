import type { Metadata } from "next";
import KhataKavachPage from "@/views/KhataKavachPage";
import JsonLd from "@/seo/JsonLd";
import { kkJsonLd } from "@/seo/graph";
import { siteMetadata } from "@/seo/site";

/** Static, refreshed hourly: its guides list grows as pages go live (and the footer's year turns over on its own). */
export const revalidate = 3600;

export const metadata: Metadata = siteMetadata("hi", "/khata-kavach");

export default function Page() {
  return (
    <>
      <JsonLd data={kkJsonLd("hi")} />
      <KhataKavachPage lang="hi" />
    </>
  );
}
