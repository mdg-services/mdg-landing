import type { Metadata } from "next";
import HomePage from "@/views/HomePage";
import JsonLd from "@/seo/JsonLd";
import { homeJsonLd } from "@/seo/graph";
import { siteMetadata } from "@/seo/site";

/** Static, refreshed daily so the footer's year turns over on its own. */
// Hourly: the "Guides for dealers" cards grow as guide pages go live.
export const revalidate = 3600;

export const metadata: Metadata = siteMetadata("en", "");

export default function Page() {
  return (
    <>
      <JsonLd data={homeJsonLd("en")} />
      <HomePage lang="en" />
    </>
  );
}
