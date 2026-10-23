import { cards, facts, p, type DocPage } from "../doc";

/* /contact. Every way to reach the company, the registered office, and where
   a complaint or a billing question goes. The phone number is the toll-free
   line the home page already prints (lib/tollFree.ts), the hours are the ones
   the call card prints, and the email is the company's own (BRAND.companyEmail).
   No new number is introduced here.

   TODO-OWNER: the footer still prints hello@mdgservices.in while this page
   prints hello@vruoom.com. Razorpay's review compares the two; pick one
   address and change BRAND.email or BRAND.companyEmail so they match.
   TODO-OWNER: if you want a named Grievance Officer on this page (some
   platforms expect one), add the name and designation to the last section. */
export const contactUs: DocPage = {
  pageTitle: "Contact us · MDG Services",
  metaDescription:
    "Call toll-free, write to us, or leave your number and we call you back. MDG Services is a brand of VRUOOM PRIVATE LIMITED, Gurugram, Haryana.",
  eyebrow: "Contact us",
  eyebrowDeva: "संपर्क",
  heading: "Talk to a person.",
  intro:
    "Call us, write to us, or leave a number and we will call you back. A real person answers, in Hindi or English.",
  updated: "23 October 2026",
  legal: false,
  sections: [
    {
      id: "ways",
      heading: "Ways to reach us",
      blocks: [
        cards([
          {
            kicker: "Call, toll-free",
            title: "{tollFree}",
            body: "Open {hours}. The call is free.",
            link: { label: "Call now", href: "{tollFreeHref}" },
          },
          {
            kicker: "Write to us",
            title: "{email}",
            body: "For questions, billing and payments, and anything you would rather have in writing. For a payment, include the reference from your receipt.",
            link: { label: "Send an email", href: "mailto:{email}" },
          },
          {
            kicker: "Prefer a call back?",
            title: "Leave your number",
            body: "Give your name and mobile number and a team member calls back within the hour, {hours}.",
            link: { label: "Ask for a call back", href: "home:contact" },
          },
        ]),
      ],
    },
    {
      id: "office",
      heading: "Registered office",
      blocks: [
        facts([
          ["Company", "{legalName}"],
          ["CIN", "{cin}"],
          ["Brand", "MDG Services, at {site}"],
          ["Address", "{office}"],
          ["Phone", "[{tollFree}]({tollFreeHref}), toll-free"],
          ["Hours", "{hours}"],
          ["Email", "[{email}](mailto:{email})"],
        ]),
        p(
          "Our service is delivered online and by phone. Anything that arrives after hours is picked up first thing the next morning.",
        ),
      ],
    },
    {
      id: "grievance",
      heading: "Something gone wrong?",
      blocks: [
        p(
          "If you are unhappy with our service, the app, our billing, our staff or how we handle your data, report it on the [grievance page](route:/grievance). You are given a grievance number straight away, and a person from our team looks into it and replies.",
        ),
      ],
    },
  ],
};
