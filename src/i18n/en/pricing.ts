import { cards, p, steps, table, ul, type DocPage } from "../doc";

/* /pricing. What is sold, the rupee price, GST, how to pay.

   The figures are the ones the site assistant already quotes
   (mdg-backend/src/assist/llm/prompts.ts): the nine standard services at
   3,000 rupees a month plus 18% GST, and everything
   together "in the region of" 15,000 plus GST, quoted on the work. There is
   NO free month (owner, 23 Oct 2026): the first month is paid, and a dealer
   who is not happy with it, for any reason, gets that month's payment back.
   Once per dealer, first month only. The refund policy, the terms and the site
   assistant say the same. They come
   from PRICING in data/content.ts, so this page and the assistant cannot drift.

   Khata Kavach is free while it is new (owner, 23 Oct 2026). If that changes,
   this card, the Hindi one and the FAQ change together.

   TODO-OWNER (per outlet): "for one outlet" below is my reading. The assistant's
   published line says only "3000 rupees plus 18% GST for the standard services".
   Confirm that the price is per outlet, or drop the words.

   The GST invoice promised below is issued by the payment system itself the
   moment a payment is confirmed (ADR 0022 §11).

   Never add "pay in the app" wording here or anywhere on the site: Google
   Play's payments policy makes that a Play Billing matter (ADR 0022 §1). Payment is
   by a link that arrives by SMS, email or WhatsApp, or on the website. */
export const pricing: DocPage = {
  pageTitle: "Pricing · MDG Services",
  metaDescription:
    "Dealer's Kavach costs {standard} a month plus {gstPercent} GST, with your first month's money back if you are not happy. Prices in rupees, paid online through Razorpay by UPI, card, netbanking or wallet.",
  eyebrow: "Pricing",
  eyebrowDeva: "क़ीमत",
  heading: "Simple monthly pricing, in rupees.",
  intro:
    "Dealer's Kavach is a monthly subscription, and if your first month does not suit you, you get that month's payment back. Prices are in Indian rupees, GST is added, and what we agree is written down before you start.",
  updated: "23 October 2026",
  legal: true,
  sections: [
    {
      id: "plans",
      heading: "Plans",
      blocks: [
        cards([
          {
            kicker: "Dealer's Kavach",
            title: "Standard services",
            price: "{standard}",
            priceNote: "a month, plus {gstPercent} GST ({standardTotal} in all)",
            body: "The nine standard services, for one outlet. Not happy with your first month? You get that month's payment back.",
            items: [
              "SDMS, MDG and inspection compliance",
              "Document and renewal reminders",
              "Automation, web portal and XTRA campaign support",
              "DOD and stock punctuality",
              "Prepare Pro Manager",
            ],
          },
          {
            kicker: "Dealer's Kavach",
            title: "Everything, with the premium services",
            price: "Around {everythingAround}",
            priceNote: "a month, plus GST, quoted on the work",
            body: "The standard services plus the four premium ones. The exact figure for your outlet is agreed in writing before you start.",
            items: ["Quick response for safety", "Digital payment reconciliation", "Account support", "Cyber security"],
          },
          {
            kicker: "Khata Kavach",
            title: "Free while it is new",
            price: "₹0",
            priceNote: "a month, while Khata Kavach is new",
            body: "Sign up from the app and use it at no charge. If that ever changes, we will tell you well before anything is charged.",
            link: { label: "About Khata Kavach", href: "route:/khata-kavach" },
          },
        ]),
      ],
    },
    {
      id: "example",
      heading: "What you pay in a month",
      blocks: [
        p("For the standard services of one outlet:"),
        table(
          ["For one outlet, in a month", "Amount"],
          [
            ["Dealer's Kavach, standard services", "{standard}"],
            ["GST at {gstPercent}", "{gst}"],
            ["**You pay**", "**{standardTotal}**"],
          ],
        ),
        p(
          "You pay {standardTotal} for your first month. If you are not happy with it, for any reason, tell us by the end of that month and we refund the full {standardTotal}. This is once per dealer, for the first month only.",
        ),
      ],
    },
    {
      id: "pay",
      heading: "How you pay",
      blocks: [
        steps([
          [
            "You get a payment link",
            "It arrives by SMS, email or WhatsApp, with the amount and what it is for. You can also pay from your account in a web browser.",
          ],
          [
            "Pay the way you like",
            "UPI, debit or credit card, netbanking or a wallet, on Razorpay's secure page. We never see or keep your card number, UPI PIN or bank login.",
          ],
          [
            "Get your receipt",
            "Razorpay confirms the payment to us, and you get a confirmation and a GST invoice for the amount.",
          ],
        ]),
      ],
    },
    {
      id: "good-to-know",
      heading: "Good to know",
      blocks: [
        ul([
          "All prices are in Indian rupees (INR). GST at {gstPercent} is added on top.",
          "Not happy with your first month, for any reason? Tell us by the end of it and we refund that month in full, GST included. Once per dealer, first month only.",
          "The price is written down before you begin and does not rise in the middle of what we agreed. No surprise fees.",
          "You can cancel any time. See the [Refund and cancellation policy](route:/refund-policy).",
          "A subscription is for software delivered online. There is nothing to ship; see [Shipping and delivery](route:/shipping).",
          "Our [Terms and conditions](route:/terms) apply to every subscription.",
        ]),
      ],
    },
  ],
};
