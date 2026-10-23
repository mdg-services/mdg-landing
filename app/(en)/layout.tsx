import "@/index.css";
import type { Metadata, Viewport } from "next";
import RootShell from "@/shell/RootShell";
import { fontClassNames, lateFontClassNames } from "@/fonts/en";
import { SITE } from "@/seo/site";

/** The English site: /, /register, /grievance, /about, /contact, /pricing, /terms, /refund-policy, /shipping, /guides/…, /tools/…. Hindi lives under /hi. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  icons: { icon: "/favicon.png", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2C2E80",
};

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootShell lang="en" fontClassNames={fontClassNames} lateFontClassNames={lateFontClassNames}>
      {children}
    </RootShell>
  );
}
