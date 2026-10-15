import type { Metadata } from "next";
import HomePage from "@/views/HomePage";
import JsonLd from "@/seo/JsonLd";
import { HOME_JSON_LD } from "@/seo/graph";
import { siteMetadata } from "@/seo/site";

/** Static, refreshed daily so the footer's year turns over on its own. */
export const revalidate = 86400;

export const metadata: Metadata = siteMetadata("hi", "");

export default function Page() {
  return (
    <>
      <JsonLd data={HOME_JSON_LD} />
      <HomePage lang="hi" />
    </>
  );
}
