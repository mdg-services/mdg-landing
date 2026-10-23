/* The words every company page shares: About us, Contact us, Pricing, Terms
   and conditions, Refund and cancellation, Shipping and delivery. The pages'
   own copy sits beside this file (about.ts, contactUs.ts, pricing.ts,
   terms.ts, refund.ts, shipping.ts) and is drawn by views/DocPage.tsx.

   `{name}` is a fact filled in when the page renders (lib/docText.ts). */
export const docs = {
  /** After the "←" in the header. */
  backToHome: "Back to home",
  /** Before the date in the heading band. */
  updatedLabel: "Last updated",
  /** In the heading band of every page, so the company is named wherever a visitor lands. */
  legalLine: "MDG Services is a brand of **{legalName}** · CIN\u00a0{cin}",
  /** The jump links above a page with several sections. */
  onThisPage: "On this page",
  /** The last line of every page. */
  questions:
    "Questions about this page? Write to [{email}](mailto:{email}) or call [{tollFree}]({tollFreeHref}), {hours}.",
  /** A translation of a policy is not the policy. English is already the binding text, so on this side both are empty and nothing is shown. */
  bindingNotice: "",
  readEnglish: "",
};
