import "@/index.css";
import type { Metadata, Viewport } from "next";
import RootShell from "@/shell/RootShell";
import { fontClassNames, lateFontClassNames } from "@/fonts/hi";
import { SITE } from "@/seo/site";

/** The Hindi site: /hi, /hi/register, /hi/grievance, /hi/guides/…, /hi/tools/…. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  icons: { icon: "/favicon.png", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2C2E80",
};

export default function HindiLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootShell lang="hi" fontClassNames={fontClassNames} lateFontClassNames={lateFontClassNames}>
      {children}
    </RootShell>
  );
}
