import type { MetadataRoute } from "next";
import { SITE } from "@/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // /app/ is the Kavach Shuruaat funnel link (ADR 0059 §2): a redirect to an app store, never a page to index.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/app/"] }],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
