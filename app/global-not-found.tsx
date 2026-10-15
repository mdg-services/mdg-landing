import "@/index.css";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Enter } from "@/lib/enter";
import RootShell from "@/shell/RootShell";
import { fontClassNames, lateFontClassNames } from "@/fonts/en";
import { SITE } from "@/seo/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { absolute: "Page not found | MDG Services" },
  // no `robots` here: Next adds `noindex` to every 404 itself, and a second tag saying the same thing is noise
  icons: { icon: "/favicon.png", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#2C2E80" };

/**
 * Any address the site does not have, and any guide page whose day has not
 * come yet: a real 404, in the site's own design. It speaks both languages,
 * because the address that failed might have been either.
 */
export default function NotFound() {
  return (
    <RootShell lang="en" fontClassNames={fontClassNames} lateFontClassNames={lateFontClassNames}>
      <div className="min-h-screen bg-paper text-ink">
        <Navbar twin="/hi" />
        <main>
          <section className="relative overflow-hidden bg-navy-950 text-white">
            <div aria-hidden className="absolute inset-0 bg-grid-dark opacity-40" />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-20 h-[22rem] w-[22rem] rounded-full sm:h-[26rem] sm:w-[26rem]"
              style={{ background: "radial-gradient(circle, rgba(245,165,36,.16), transparent 60%)" }}
            />
            <div className="wrap-narrow relative py-16 sm:py-20 md:py-28">
              <Enter>
                <p className="eyebrow-light">404</p>
              </Enter>
              <Enter delay={0.06}>
                <h1 className="mt-5 text-mega text-white" style={{ fontSize: "clamp(38px, 6vw, 72px)" }}>
                  Page not found
                </h1>
              </Enter>
              <Enter delay={0.12}>
                <p className="mt-5 max-w-xl text-[17px] leading-[1.6] text-navy-100">
                  This page does not exist, or is not published yet.
                </p>
                <p lang="hi" className="mt-3 max-w-xl text-[17px] leading-[1.6] text-navy-100">
                  यह पेज मौजूद नहीं है, या अभी प्रकाशित नहीं हुआ है।
                </p>
              </Enter>
              <Enter delay={0.18}>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link href="/" className="btn-gold">
                    mdgservices.in
                  </Link>
                  {/* guide addresses keep their trailing slash and are gated by the proxy: a plain link, a full page load */}
                  {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                  <a href="/guides/" className="btn-on-dark-ghost">
                    Guides for dealers
                  </a>
                  {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                  <a href="/hi/guides/" lang="hi" className="btn-on-dark-ghost">
                    डीलरों के लिए गाइड
                  </a>
                </div>
              </Enter>
            </div>
          </section>
        </main>
        <Footer lang="en" />
      </div>
    </RootShell>
  );
}
