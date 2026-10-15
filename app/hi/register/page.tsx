import type { Metadata } from "next";
import RegisterPage from "@/views/RegisterPage";
import { siteMetadata } from "@/seo/site";

export const revalidate = 86400;

export const metadata: Metadata = siteMetadata("hi", "/register");

export default function Page() {
  return <RegisterPage lang="hi" />;
}
