import type { NextConfig } from "next";

const root = import.meta.dirname;

/**
 * Hosting rules that must behave the same under `next start` as on Vercel, so
 * they live here as well as in vercel.json (the film redirects and the
 * security headers are the same lines in both; Vercel simply applies one).
 */
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
];

const nextConfig: NextConfig = {
  // A second build can sit beside the normal one (NEXT_DIST_DIR=.next-fake,
  // used with GUIDE_FAKE_NOW to look at the guide on a later day).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  // Two root layouts (English, Hindi) and no single one to hang a 404 on:
  // app/global-not-found.tsx draws the site's 404 itself.
  experimental: { globalNotFound: true },
  poweredByHeader: false,
  // `next dev` would otherwise write AGENTS.md and CLAUDE.md into the project.
  agentRules: false,
  outputFileTracingRoot: root,

  // The backend modules in server/ and the guide's data files import each
  // other the NodeNext way, with a ".js" ending on a file that is ".ts" on
  // disk (they are shared with the command-line tools). webpack maps that
  // ending back to the source file; Turbopack has no such setting, which is why
  // dev and build run with --webpack.
  webpack(config) {
    config.resolve.extensionAlias = { ".js": [".ts", ".tsx", ".js"], ".mjs": [".mts", ".mjs"] };
    return config;
  },

  // The API routes ran as plain Node functions with these two straight from
  // node_modules, and must go on doing exactly that: bundled, zod loses its
  // English error messages (its package is marked side-effect free, so the
  // line that installs them is dropped).
  serverExternalPackages: ["zod", "nodemailer"],

  // Guide URLs keep their trailing slash (/guides/density/), every other URL
  // does not. Next's own redirect would strip it before the proxy could see it,
  // so the proxy (proxy.ts) takes over both directions.
  skipTrailingSlashRedirect: true,

  // The guide pages read their words from guide/content at render time, which
  // also happens when a page is refreshed in production, so the files ship
  // with every function that can render one.
  outputFileTracingIncludes: {
    "/**": ["./guide/content/**/*", "./guide/tools/**/*"],
  },

  images: {
    formats: ["image/avif", "image/webp"],
    // The logos never change; a month in the cache is plenty.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  async redirects() {
    return [
      { source: "/film/en", destination: "/film?lang=en", permanent: false },
      { source: "/film/short/en", destination: "/film/short?lang=en", permanent: false },
      // The Hindi pages are not in the proxy's matcher (it would put a function in
      // front of every Hindi page view), so their trailing-slash forms are turned
      // away here, as the proxy does for the English ones.
      { source: "/hi/", destination: "/hi", permanent: true },
      { source: "/hi/register/", destination: "/hi/register", permanent: true },
      { source: "/hi/grievance/", destination: "/hi/grievance", permanent: true },
      { source: "/hi/grievances/", destination: "/hi/grievances", permanent: true },
      { source: "/hi/khata-kavach/", destination: "/hi/khata-kavach", permanent: true },
    ];
  },

  async rewrites() {
    return {
      beforeFiles: [{ source: "/privacy", destination: "/privacy.html" }],
      afterFiles: [],
      fallback: [],
    };
  },

  async headers() {
    const week = "public, max-age=604800, stale-while-revalidate=86400";
    return [
      { source: "/film/hls-:file", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/film/mark.png", headers: [{ key: "Cache-Control", value: week }] },
      { source: "/film/og-:file", headers: [{ key: "Cache-Control", value: week }] },
      // the small brand images change about never; without this each one is
      // asked about again on every page view
      { source: "/favicon.png", headers: [{ key: "Cache-Control", value: week }] },
      { source: "/assist-bot.png", headers: [{ key: "Cache-Control", value: week }] },
      { source: "/apple-touch-icon.png", headers: [{ key: "Cache-Control", value: week }] },
      { source: "/:path*", headers: SECURITY_HEADERS },
    ];
  },
};

export default nextConfig;
