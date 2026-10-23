import { note, p, steps, table, ul, type DocPage } from "../doc";

/* /refund-policy (and /refund, /cancellation, which redirect here).

   TODO-OWNER: this whole policy is a DRAFT for your review. It follows the
   terms the brief set: cancel any time before the next billing month and the
   following month is not charged; a payment made in error or charged twice is
   refunded within 7 working days to the original payment method; the first
   month is free so it needs no refund. Three things in it are my reading of
   "a fair SaaS policy", not facts from the repo, so change them if they are
   not what you want: (1) a month already begun is not refunded in part,
   (2) the contact route is the company email and the grievance page, (3) the
   sentence on a failed payment that was debited says the bank returns it.
   Razorpay refunds go back to the original method (RBI's wording); keep that. */
export const refund: DocPage = {
  pageTitle: "Refund and cancellation policy · MDG Services",
  metaDescription:
    "Cancel any time, with no charge for the next month. A payment made in error or charged twice is refunded in full to the original payment method within 7 working days.",
  eyebrow: "Refund and cancellation",
  eyebrowDeva: "रिफ़ंड और कैंसिलेशन",
  heading: "Cancel any time. Pay back what was charged by mistake.",
  intro:
    "This policy covers cancelling a subscription to Dealer's Kavach or Khata Kavach, and when we refund a payment. It is part of our [Terms and conditions](route:/terms).",
  updated: "23 October 2026",
  legal: true,
  sections: [
    {
      id: "summary",
      heading: "In short",
      blocks: [
        table(
          ["If", "Then"],
          [
            [
              "You cancel",
              "You pay nothing for the following month. The service carries on to the end of the month you have paid for.",
            ],
            [
              "You are not happy with your first month",
              "Tell us by the end of it and we refund that month in full, GST included. Once per dealer.",
            ],
            [
              "You are charged twice, or a payment was made by mistake",
              "We refund it in full, to the original payment method, within 7 working days.",
            ],
          ],
        ),
      ],
    },
    {
      id: "cancel",
      heading: "How to cancel",
      blocks: [
        steps([
          [
            "Tell us",
            "Write to [{email}](mailto:{email}), call [{tollFree}]({tollFreeHref}), or tell the person who looks after your outlet. Say which outlet and app it is for.",
          ],
          ["We confirm", "We confirm your cancellation to you in writing, with the date your service ends."],
          [
            "Nothing more to pay",
            "Cancel before the next billing month starts and that month is not charged. There is no cancellation fee.",
          ],
        ]),
        p(
          "Your service keeps working until the end of the month you have already paid for. We do not refund part of a month that has begun, unless it was charged in error or it is your first month (see below).",
        ),
      ],
    },
    {
      id: "first-month",
      heading: "Your first month's money back",
      blocks: [
        p(
          "If you are not happy with Dealer's Kavach in your first paid month, for any reason, tell us by the end of that month. We refund the whole first-month payment, GST included, to the way you paid, within 7 working days, and your subscription ends. You do not have to give a reason. This applies once per dealer, to the first month only; later months follow the cancellation rules above.",
        ),
      ],
    },
    {
      id: "refunds",
      heading: "When we refund a payment",
      blocks: [
        p("We refund a payment in full when:"),
        ul([
          "the same payment was charged twice;",
          "a payment was made in error, for example the wrong amount or for the wrong outlet; or",
          "you were charged for a month after your cancellation took effect.",
        ]),
        note(
          "Refunds go back to the payment method that was used, whether that was UPI, a card, netbanking or a wallet. We make the refund within 7 working days of confirming it. Your bank or card issuer decides when it shows in your account.",
        ),
        p(
          "If money left your account but the payment shows as failed, your bank normally returns it by itself. If it has not, write to us with the details and we will help you trace it.",
        ),
      ],
    },
    {
      id: "ask",
      heading: "How to ask for a refund",
      blocks: [
        ul([
          "Write to [{email}](mailto:{email}) or call [{tollFree}]({tollFreeHref}), {hours}.",
          "Give the payment reference from your receipt, the amount and the date.",
          "We check it, tell you what we found, and send the refund if it is due.",
        ]),
        p(
          "If you are not happy with the answer, raise it on the [grievance page](route:/grievance). You are given a grievance number straight away.",
        ),
      ],
    },
  ],
};
