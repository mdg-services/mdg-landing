import "@/index.css";
import type { Metadata, Viewport } from "next";
import RootShell from "@/shell/RootShell";
import { fontsFor } from "@/fonts";
import { langParams, routeLang, type LangProps } from "@/i18n/route";
import { SITE } from "@/seo/site";

/**
 * Every language that lives under a prefix: Hindi at /hi, Odia at /or, and any
 * language added to src/i18n/languages.ts. The same route files serve them all;
 * `lang` in the address picks the words (src/i18n/server.ts) and the faces
 * (src/fonts). An address that names no language is the site's 404.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return langParams();
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  icons: { icon: "/favicon.png", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2C2E80",
};

export default async function LanguageLayout(props: LangProps & { children: React.ReactNode }) {
  const lang = await routeLang(props);
  const { fontClassNames, lateFontClassNames } = fontsFor(lang);
  return (
    <RootShell lang={lang} fontClassNames={fontClassNames} lateFontClassNames={lateFontClassNames}>
      {props.children}
    </RootShell>
  );
}
