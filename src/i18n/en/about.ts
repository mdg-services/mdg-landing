import { cards, facts, note, p, type DocPage } from "../doc";

/* /about. Who the company is, with the facts a reviewer or a customer can
   check on the public record, and what the two apps are. Outcomes only: it
   says what the apps do for a customer, never how the work is done. */
export const about: DocPage = {
  pageTitle: "About us · MDG Services",
  metaDescription:
    "MDG Services is a brand of VRUOOM PRIVATE LIMITED, a company in Gurugram, India. We make Dealer's Kavach for petrol pump dealers and Khata Kavach for businesses that sell on credit.",
  eyebrow: "About us",
  eyebrowDeva: "हमारे बारे में",
  heading: "Software for people who run India's pumps and credit counters.",
  intro:
    "MDG Services is the brand of {legalName}, a private limited company in Gurugram, Haryana. We make two apps, in Hindi and English: Dealer's Kavach for petrol pump dealers, and Khata Kavach for any business that sells on credit to regular customers.",
  updated: "23 October 2026",
  legal: false,
  sections: [
    {
      id: "company",
      heading: "The company",
      blocks: [
        p("All of this is on the public record and can be checked."),
        facts([
          ["Registered name", "{legalName}"],
          ["CIN", "{cin}"],
          ["Incorporated", "13 October 2021"],
          ["Registrar", "RoC Delhi"],
          ["Registered office", "{office}"],
          ["Brand", "MDG Services, at {site}"],
          ["Email", "[{email}](mailto:{email})"],
          ["Phone", "[{tollFree}]({tollFreeHref}), toll-free, {hours}"],
        ]),
      ],
    },
    {
      id: "apps",
      heading: "What we make",
      blocks: [
        cards([
          {
            kicker: "For petrol pump dealers",
            title: "Dealer's Kavach",
            body: "The filings, renewals, inspections and daily reports a dealer owes the oil company and the authorities, kept on time in one app, with a person to call when something needs a hand.",
            link: { label: "See pricing", href: "route:/pricing" },
          },
          {
            kicker: "For businesses that sell on credit",
            title: "Khata Kavach",
            body: "One shared credit account book for a business and its regular customers. Both sides see every sale, and the business makes numbered bills. It keeps records only: it never lends, and never holds or moves money.",
            link: { label: "About Khata Kavach", href: "route:/khata-kavach" },
          },
        ]),
      ],
    },
    {
      id: "independent",
      heading: "Independent of the oil companies",
      blocks: [
        note(
          "MDG Services is not part of IndianOil, BPCL or HPCL, and none of them endorses us. Their names are used on this site only to say which dealers we serve.",
        ),
      ],
    },
    {
      id: "reach",
      heading: "Talk to us",
      blocks: [
        p(
          "A person answers the phone, in Hindi or English. Details are on the [Contact us](route:/contact) page, and a complaint can be raised on the [grievance page](route:/grievance).",
        ),
      ],
    },
  ],
};
