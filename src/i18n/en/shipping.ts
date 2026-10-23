import { p, steps, table, ul, type DocPage } from "../doc";

/* /shipping. Dealer's Kavach and Khata Kavach are delivered online, so this
   page says so plainly and says when access starts. "Onboarding finishes
   inside seven days of the arrangement being agreed in writing" is the
   assistant's published line; Khata Kavach's "start in about a minute" is from
   the Khata Kavach page's own call to action. */
export const shipping: DocPage = {
  pageTitle: "Shipping and delivery · MDG Services",
  metaDescription:
    "Dealer's Kavach and Khata Kavach are online software. Nothing is shipped and there is no delivery charge. Access starts when your outlet is set up.",
  eyebrow: "Shipping and delivery",
  eyebrowDeva: "शिपिंग और डिलीवरी",
  heading: "Nothing to ship. Access starts online.",
  intro:
    "Dealer's Kavach and Khata Kavach are online software. There is no physical product, no courier and no delivery charge.",
  updated: "23 October 2026",
  legal: true,
  sections: [
    {
      id: "access",
      heading: "How access starts",
      blocks: [
        table(
          ["App", "When you get access", "Delivery charge"],
          [
            [
              "Dealer's Kavach",
              "Your outlet is set up within seven days of the arrangement being agreed in writing.",
              "None",
            ],
            [
              "Khata Kavach",
              "Straight away: start your business in the Khata Kavach Business app in about a minute, then add your customers on WhatsApp.",
              "None",
            ],
          ],
        ),
      ],
    },
    {
      id: "steps",
      heading: "What happens",
      blocks: [
        steps([
          ["You sign up", "Register your outlet or business, in Hindi or English, on this site or in the app."],
          [
            "We set you up",
            "For Dealer's Kavach we set up your outlet and check it before the next one starts. Khata Kavach needs no set-up from us.",
          ],
          [
            "You start using it",
            "Sign in on your phone or in a web browser. Your first month of Dealer's Kavach is free.",
          ],
        ]),
      ],
    },
    {
      id: "good-to-know",
      heading: "Good to know",
      blocks: [
        ul([
          "Anywhere in India with an internet connection.",
          "No delivery, courier or handling charge. The only charge is the subscription price on the [Pricing](route:/pricing) page.",
          "If your access has not started when we said it would, call [{tollFree}]({tollFreeHref}) or write to [{email}](mailto:{email}), and we will sort it out.",
        ]),
        p(
          "A complaint can be raised on the [grievance page](route:/grievance). Cancelling and refunds are in the [Refund and cancellation policy](route:/refund-policy).",
        ),
      ],
    },
  ],
};
