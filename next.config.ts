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

/**
 * The address prefix of every language that lives under one (src/i18n/languages.ts).
 * Spelled out here because this file runs before the project's own modules can be
 * imported; `npm run lang:check` fails if the two lists differ.
 */
const LANG_PREFIXES = ["/hi", "/or"];

const nextConfig: NextConfig = {
  // A second build can sit beside the normal one (NEXT_DIST_DIR=.next-fake,
  // used with GUIDE_FAKE_NOW to look at the guide on a later day).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  // Two root layouts (English, and every other language under [lang]) and no single one to hang a 404 on:
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

  // The guide pages read their words from guide/content, kk-guide/content and
  // pump-guide/content at render time, which also happens when a page is
  // refreshed in production and when the sitemap is built on each request,
  // so the files ship with every function that can render one. Without a
  // collection's folder here its pages still build, but the sitemap answers 500.
  outputFileTracingIncludes: {
    "/**": ["./guide/content/**/*", "./guide/tools/**/*", "./kk-guide/content/**/*", "./kk-guide/tools/**/*", "./pump-guide/content/**/*"],
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
      // The pages of the other languages are not all in the proxy's matcher (it would
      // put a function in front of every page view), so their trailing-slash forms are
      // turned away here, as the proxy does for the English ones.
      ...LANG_PREFIXES.flatMap((p) => [
        { source: `${p}/`, destination: p, permanent: true },
        ...["register", "grievance", "grievances", "khata-kavach", "about", "contact", "pricing", "terms", "refund-policy", "shipping"].map((page) => ({
          source: `${p}/${page}/`,
          destination: `${p}/${page}`,
          permanent: true,
        })),
      ]),
      // The refund page has three names people (and payment reviewers) type. They
      // all go to the one address, in every language; the English slash forms
      // are turned away here too, since this runs before the proxy.
      ...["refund", "cancellation"].flatMap((name) => [
        { source: `/${name}`, destination: "/refund-policy", permanent: true },
        { source: `/${name}/`, destination: "/refund-policy", permanent: true },
        ...LANG_PREFIXES.flatMap((p) => [
          { source: `${p}/${name}`, destination: `${p}/refund-policy`, permanent: true },
          { source: `${p}/${name}/`, destination: `${p}/refund-policy`, permanent: true },
        ]),
      ]),
      // Khata Kavach is for petrol pumps only since 27 Oct 2026: the guide pages for
      // other trades are gone, and anyone holding a link lands on the nearest page.
      ...[
        ["for/cement-and-building-material", "for/petrol-pump"],
        ["for/contractors", "for/petrol-pump"],
        ["for/sand-and-aggregates", "for/petrol-pump"],
        ["for/wholesalers", "for/petrol-pump"],
        ["examples/a-contractor-limit-bag-by-bag", "examples/a-month-of-diesel-credit"],
      ].flatMap(([from, to]) =>
        ["", ...LANG_PREFIXES].flatMap((lang) => [
          { source: `${lang}/khata-kavach/${from}`, destination: `${lang}/khata-kavach/${to}/`, permanent: true },
          { source: `${lang}/khata-kavach/${from}/`, destination: `${lang}/khata-kavach/${to}/`, permanent: true },
        ]),
      ),
    ];
  },

  async rewrites() {
    return {
      beforeFiles: [
        { source: "/privacy", destination: "/privacy.html" },
        { source: "/khata-kavach/privacy", destination: "/kk-privacy.html" },
      ],
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
      // the explainers' media: every file name carries a hash of its bytes
      { source: "/videos/media/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
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
