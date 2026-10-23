import { facts, note, p, ul, type DocPage } from "../doc";

/* /terms. The terms of the online subscription to Dealer's Kavach and Khata
   Kavach, for a payment provider's review and for customers.

   TODO-OWNER: this is a DRAFT, and it needs a lawyer's review before it goes
   live. The points I decided, so you can overrule them: the liability cap is
   the fees paid in the 12 months before the claim; a price change after the
   agreed period needs 30 days' written notice; a payment that stays unpaid may
   pause access (no late interest is mentioned, unlike the old agreement's 18%);
   courts at Gurugram have exclusive jurisdiction. There is no named Grievance
   Officer; add one if you want it.

   What it deliberately does NOT say: that MDG is a consultant or agency that
   acts on a dealer's behalf, and that the customer hands over portal user ids
   and passwords. The older terms behind /register do both, and they are the
   signed agreement with existing dealers, so they were left alone; they need
   the owner's rewrite. The clause "Other agreements" below is how the two sit
   together until that is done.

   Keep it to outcomes: it never explains how the work is done. */
export const terms: DocPage = {
  pageTitle: "Terms and conditions · MDG Services",
  metaDescription:
    "The terms for subscribing to Dealer's Kavach and Khata Kavach from MDG Services, a brand of VRUOOM PRIVATE LIMITED: your account, subscription and payment, acceptable use, liability and governing law.",
  eyebrow: "Terms and conditions",
  eyebrowDeva: "नियम व शर्तें",
  heading: "The terms of your subscription.",
  intro:
    "These terms are the agreement between you and {legalName} for our apps and this website. Please read them before you subscribe.",
  updated: "23 October 2026",
  legal: true,
  sections: [
    {
      id: "who",
      heading: "1. Who we are",
      blocks: [
        p(
          "MDG Services is a brand of {legalName} (CIN {cin}), whose registered office is {office}. In these terms, “we”, “us” and “MDG Services” mean {legalName}.",
        ),
        p(
          "They cover the Dealer's Kavach and Khata Kavach apps, this website, and any paid subscription to them (together, “the service”). By registering for or using the service you accept these terms.",
        ),
        p(
          "“You” means the business that subscribes and the people it lets use the service. If you accept for a business, you confirm that you are allowed to bind it.",
        ),
      ],
    },
    {
      id: "account",
      heading: "2. Your account",
      blocks: [
        ul([
          "Give us true and complete details when you register, and keep them up to date.",
          "You must be 18 or older and able to enter a contract under Indian law.",
          "Keep your sign-in details to yourself. What happens under your account is your responsibility, including what the staff you add do with it.",
          "Tell us at once if you think someone else has used your account.",
        ]),
      ],
    },
    {
      id: "service",
      heading: "3. The service",
      blocks: [
        p(
          "The service is software, with support, that helps a business keep its records, reminders and reports in order. It is delivered online; see [Shipping and delivery](route:/shipping).",
        ),
        p(
          "We work to keep it available, but we do not promise that it will never be interrupted. We may update or improve it. We will tell you before a change that takes away something you are paying for.",
        ),
        note(
          "The service helps you keep track. You and your business remain responsible for meeting your own legal duties and the duties you owe to your oil company or any authority. What the apps show is only as complete as the information they are given.",
        ),
        p(
          "Khata Kavach keeps a record of credit sales between a business and its customers. We do not lend money, and we do not hold or move anyone's money. What a customer owes a business is between the two of them.",
        ),
        p("MDG Services is independent. It is not part of IndianOil, BPCL or HPCL, and none of them endorses it."),
      ],
    },
    {
      id: "subscription",
      heading: "4. Subscription and price",
      blocks: [
        ul([
          "Dealer's Kavach is a monthly subscription. The first month is free. After that it renews every month until you cancel.",
          "The plans and prices are on the [Pricing](route:/pricing) page. Prices are in Indian rupees, and GST is added.",
          "The price for your outlet is agreed in writing before you start, and we do not raise it during the period agreed. If we change a price after that, we tell you in writing at least 30 days before it applies, and you may cancel before then.",
          "Khata Kavach is priced on request. The price is agreed with you before anything is charged.",
        ]),
      ],
    },
    {
      id: "payment",
      heading: "5. Payment and GST",
      blocks: [
        ul([
          "You pay online through Razorpay, using UPI, debit or credit card, netbanking or a wallet, on Razorpay's secure page. We never see or keep your card number, UPI PIN or bank login. Razorpay's own terms apply to the payment itself.",
          "We send you a payment link by SMS, email or WhatsApp, or you can pay from your account in a web browser. A payment counts as made when Razorpay confirms it to us.",
          "GST at the rate in force, now {gstPercent}, is added to the price, and we issue a GST invoice for what you pay.",
          "If a payment fails, you are not charged for it. If a payment is not made by its due date we will remind you, and we may pause your access until it is paid.",
          "A payment made twice, or by mistake, is refunded as set out in the [Refund and cancellation policy](route:/refund-policy).",
        ]),
      ],
    },
    {
      id: "cancelling",
      heading: "6. Cancelling and ending",
      blocks: [
        p(
          "You can cancel at any time. How cancelling and refunds work is set out in the [Refund and cancellation policy](route:/refund-policy), which is part of these terms.",
        ),
        p(
          "We may suspend or end your access if you break these terms, if a payment stays unpaid after we have reminded you, or if the law requires it. We will tell you why and, where we can, give you time to put it right.",
        ),
      ],
    },
    {
      id: "use",
      heading: "7. Acceptable use",
      blocks: [
        ul([
          "Use the service only for your own business, and only for lawful purposes.",
          "Do not copy, reverse-engineer, overload or try to break the service, or try to reach another customer's information.",
          "Do not put in information that is false, or that you have no right to use.",
          "Do not use the service to harass anyone or to send spam.",
          "Do not resell the service or share your account with another business.",
        ]),
      ],
    },
    {
      id: "data",
      heading: "8. Your information",
      blocks: [
        ul([
          "What you put into the service stays yours. You allow us to use it only to run the service for you, to support you, and to meet the law.",
          "We keep your business information confidential and we do not sell it. How we handle personal information is in our [Privacy policy](/privacy).",
          "You are responsible for having the right to put in any information about your staff or customers.",
          "On request, we delete your account and the data we are not required by law to keep.",
        ]),
      ],
    },
    {
      id: "rights",
      heading: "9. Our rights",
      blocks: [
        p(
          "The software, the names Dealer's Kavach, Khata Kavach and MDG Services, and the logos belong to {legalName}. While your subscription is active you may use the service for your business. It is not a sale of the software to you.",
        ),
      ],
    },
    {
      id: "liability",
      heading: "10. Our liability",
      blocks: [
        ul([
          "We are not responsible for a loss that comes from information given to the service being wrong or late, from a reminder you did not act on, or from a fine, penalty or action taken by an oil company or an authority.",
          "We are not liable for loss of profit or business, or for any indirect or consequential loss.",
          "Our total liability to you for any claim is limited to the fees you paid us for the service in the 12 months before the claim arose.",
          "We are not responsible for a delay or failure caused by something outside our control, such as a network or third-party failure, a strike, a flood or another act of God.",
          "Nothing in these terms limits a liability that the law does not allow to be limited.",
        ]),
      ],
    },
    {
      id: "law",
      heading: "11. Law and courts",
      blocks: [
        p(
          "Indian law governs these terms. Before going to court, please tell us what went wrong so that we can try to put it right (see Grievances below). The courts at Gurugram, Haryana have exclusive jurisdiction over any dispute.",
        ),
      ],
    },
    {
      id: "grievances",
      heading: "12. Grievances",
      blocks: [
        p(
          "If you are unhappy with the service, our billing or how we handle your data, report it on the [grievance page](route:/grievance), write to [{email}](mailto:{email}), or call [{tollFree}]({tollFreeHref}). You are given a grievance number straight away, and a person from our team looks into it and replies.",
        ),
      ],
    },
    {
      id: "changes",
      heading: "13. Changes",
      blocks: [
        p(
          "We may change these terms. The date at the top of this page shows when they were last updated. We will tell subscribers in writing before a change that affects what they pay or can do. If you carry on using the service after a change takes effect, you accept it.",
        ),
      ],
    },
    {
      id: "other",
      heading: "14. Other agreements",
      blocks: [
        p(
          "If you have signed a separate written agreement with us for an outlet, it applies together with these terms. If the two disagree on a point, the written agreement governs for that outlet.",
        ),
      ],
    },
    {
      id: "contact",
      heading: "15. Contact us",
      blocks: [
        facts([
          ["Company", "{legalName}"],
          ["CIN", "{cin}"],
          ["Registered office", "{office}"],
          ["Email", "[{email}](mailto:{email})"],
          ["Phone", "[{tollFree}]({tollFreeHref}), toll-free, {hours}"],
        ]),
      ],
    },
  ],
};
