import type { NewPumpQuestionGroup, NewPumpQuestionId } from "../../data/newPumpQuestions";

/* /new-pump/questions: the questions people ask before opening a petrol pump,
   each answered in a few plain lines (ADR 0059 §6), with a link to the
   Petrol pump guide page that answers it in full.

   Rules for these words, the same as the Petrol pump guide's:
   - Every figure comes from a public source and says which: the oil
     companies' June 2023 dealer selection brochure (published on the Bharat
     Petroleum and Hindustan Petroleum sites), the Petroleum Rules 2002, the
     highway ministry's (MoRTH) norms of 26 June 2020, PPAC's commission table.
     No figure from a document that is not public, and none from memory.
   - Never promise or hint at a dealership, a licence or an income. MDG
     Services does not sell, allot or arrange dealerships.
   - Prices of Kavach Shuruaat come in as {facts}, never typed here.
   - The order of the questions and the page each links to live in
     src/data/newPumpQuestions.ts, once for every language. */

type QA = { q: string; a: string };

export const newPumpQuestions = {
  meta: {
    /* at most 50 characters, like a guide page's search title */
    title: "Petrol pump dealership questions, answered",
    description:
      "Who can apply, land, cost, licences and dealer selection: the questions people ask before opening a petrol pump, answered from public sources.",
  },
  /** The last step of the breadcrumb. */
  crumb: "Questions",

  hero: {
    eyebrow: "Opening a petrol pump",
    heading: "Questions people ask before opening a petrol pump",
    intro:
      "Short answers from public documents: the oil companies' dealer selection brochure, the Petroleum Rules, the highway ministry's norms and the commission table of PPAC, the petroleum ministry's analysis cell. Each answer names its source, and its guide page gives the full answer with the date the facts were checked.",
  },

  groups: {
    who: "Who can apply",
    land: "Land and site",
    money: "Money and documents",
    licences: "Licences and permissions",
    selection: "Selection and after",
  } satisfies Record<NewPumpQuestionGroup, string>,
  /** The same groups, short enough for the navbar. */
  groupsShort: {
    who: "Who",
    land: "Land",
    money: "Money",
    licences: "Licences",
    selection: "Selection",
  } satisfies Record<NewPumpQuestionGroup, string>,

  questions: {
    "who-can-apply": {
      q: "Who can apply for a petrol pump dealership?",
      a: "Under the oil companies' June 2023 selection brochure, an individual must be an Indian citizen and resident with a valid PAN. The applicant must also have land (owned, leased for at least 19 years 11 months, or a firm offer for it), except at locations advertised for SC/ST applicants, where one may apply without land (Group 3). Each advertisement adds the conditions for its own location.",
    },
    "age-and-education": {
      q: "What is the age limit and how much education is needed?",
      a: "From 21 to 60 years on the date of application, and at least 10th class passed. Freedom fighters applying in the CC2 category are exempt from both. Source: the June 2023 selection brochure.",
    },
    "with-a-job": {
      q: "Can a person with a job apply for a petrol pump?",
      a: "A selected dealer cannot hold a job, so an employed person must resign before the letter of appointment. The family of an employee of Indian Oil, Bharat Petroleum or Hindustan Petroleum cannot apply. Source: the June 2023 selection brochure.",
    },
    "company-or-firm": {
      q: "Can a company, partnership firm or trust apply?",
      a: "Yes, in some forms. A partnership firm can apply, with each partner meeting the conditions for individuals. Registered societies, charitable trusts and companies apply in the Open category only, and must have been registered for at least 3 years. A Hindu Undivided Family cannot apply. Source: the June 2023 selection brochure.",
    },
    "reserved-categories": {
      q: "Which categories are reserved: SC, ST, OBC, women and others?",
      a: "Each advertised location is reserved for one category. In most states, 22.50% of locations go to SC/ST, 27% to OBC and 50.50% are Open, with smaller shares inside for defence and government personnel, disabled applicants and others. The table has no separate category for women. Source: the June 2023 selection brochure.",
    },
    "ex-servicemen": {
      q: "Is there a separate route for ex-servicemen?",
      a: "There is a reserved share, not a separate allotment. In most states, 8% of locations are in Combined Category 1 (CC1), which includes defence personnel. Eligible applicants still go through the oil company's draw of lots or bidding. Source: the June 2023 selection brochure.",
    },
    "private-brand": {
      q: "Can I open a private petrol pump of my own brand?",
      a: "Selling petrol and diesel under your own brand needs the government's authorisation as a fuel retailer. The petroleum ministry's 2019 rules ask an entity seeking authorisation for retail only to have a net worth of at least ₹250 crore. For a person, the usual route is a dealership of an oil company that holds this authorisation.",
    },

    "land-size": {
      q: "How much land does a petrol pump need?",
      a: "There is no one size for every pump: the oil company's advertisement states the minimum frontage, area and depth for each location. On a National Highway, the highway ministry's minimum plot is 35 m by 35 m on rural stretches in plain terrain, 30 m by 30 m on urban stretches and 20 m by 20 m in hilly terrain. Source: MoRTH norms of 26 June 2020.",
    },
    "without-land": {
      q: "Can I get a petrol pump without my own land?",
      a: "Only at locations advertised for SC/ST applicants. There, an applicant who offers no land (Group 3) is asked to offer it within 90 days, and only when no applicant with land is selected. Every other location needs land you own, lease, or have a firm offer for. Source: the June 2023 selection brochure.",
    },
    "land-groups": {
      q: "What are Group 1 and Group 2 land in the application?",
      a: "Group 1 is land in the advertised area that you own or hold on a long lease (at least 19 years 11 months, or as advertised); land owned by your family also counts, with their consent affidavit. Group 2 is a firm offer to buy or lease such land. The draw or bidding is held for Group 1 first, and for Group 2 only when Group 1 has no eligible applicant.",
    },
    "agricultural-land": {
      q: "Can a petrol pump be built on agricultural land?",
      a: "Not as it stands. In the land notices of Hindustan Petroleum and Bharat Petroleum, agricultural land must first be converted to non-agricultural use, at the owner's own cost. Conversion rules and fees are set by each state, so ask the state revenue office.",
    },
    "land-lease": {
      q: "What must the land lease say, and for how many years?",
      a: "At least 19 years 11 months, or the period the advertisement states. Where the oil company builds the outlet, the lease must allow sub-leasing. The oil company gives its own lease format; have an advocate read it before you sign. Source: the June 2023 selection brochure.",
    },
    "highway-permission": {
      q: "Does a pump on a national highway need permission from MoRTH or NHAI?",
      a: "Yes. A fuel station on a National Highway needs access permission from the highway administration for that stretch (a MoRTH or NHAI officer), applied for online. The station must not start until the final permission is granted. Source: MoRTH norms of 26 June 2020.",
    },
    "offer-land": {
      q: "Can I give my land to an oil company for a petrol pump?",
      a: "Oil companies publish their own notices asking for land to buy or lease for outlets. Hindustan Petroleum says these notices are for land only, not for a dealership. Agricultural land offered must be converted to non-agricultural use at the owner's cost.",
    },

    cost: {
      q: "How much does it cost to open a petrol pump?",
      a: "The June 2023 brochure gives no single total: each advertisement states the estimated working capital and building funds for its location. The fixed payments are an application fee of ₹2,500 to ₹10,000 and a refundable security deposit of ₹2 lakh to ₹5 lakh, plus, for some kinds of site, a fixed fee or a minimum bid.",
    },
    documents: {
      q: "Which documents are needed to apply?",
      a: "A valid PAN to register and apply. After provisional selection: a notarised affidavit, proof of age, proof of passing 10th class, the land documents and a sketch of the site, and a category certificate if you applied in a reserved category. Source: the June 2023 selection brochure.",
    },
    "application-form": {
      q: "How do I fill the application form and the affidavit?",
      a: "You register on the oil companies' portal, petrolpumpdealerchayan.in, with a valid PAN, fill the form online for an advertised location and pay the fee there. Only one application can be sent for a location. The notarised affidavit, in the brochure's standard format, comes after provisional selection.",
    },
    "loan-or-subsidy": {
      q: "Is there a government loan or subsidy for a petrol pump?",
      a: "The selection brochure names one scheme: at Corpus Fund sites for SC/ST applicants, the oil company builds the outlet at its own cost and lends working capital for about 7 days of sales. Bank loans are decided by the banks; ask your bank what it offers.",
    },
    "dealer-commission": {
      q: "How does a dealer earn: what is the dealer commission?",
      a: "The oil company pays a commission on every kilolitre sold: a fixed amount plus a small percentage of the price. PPAC's table, from 1 December 2024, shows ₹3,144.03 per KL plus 0.870% for petrol and ₹2,332.51 per KL plus 0.266% for diesel. The pump's own costs come out of it, so it is not profit.",
    },

    "licences-and-nocs": {
      q: "Which licences and NOCs does a petrol pump need?",
      a: "A No Objection Certificate from the District Authority, and a PESO licence in Form XIV to store petrol and diesel (Petroleum Rules 2002, rule 144). Pollution consent, fire approval and Legal Metrology checks depend on your state.",
    },
    "peso-licence": {
      q: "What is the PESO licence and how is it applied for?",
      a: "It is the licence in Form XIV of the Petroleum Rules 2002 to store petrol and diesel in the pump's tanks. The plan is approved first; after building, the application goes online through the National Single Window System and PESO's site, with the District Authority's NOC.",
    },
    "cng-pump": {
      q: "How do I get a CNG pump dealership?",
      a: "CNG is sold through city gas networks, each authorised for its area by the regulator, PNGRB. A CNG station needs a PESO licence in Form G under the Gas Cylinders Rules 2016. Ask the gas company authorised for your area how it appoints dealers.",
    },
    "mini-pump": {
      q: "Is a 'mini petrol pump' allowed?",
      a: "The oil companies' June 2023 selection brochure sets out regular and rural outlets. Check any 'mini petrol pump' offer against the advertisements on petrolpumpdealerchayan.in. The oil companies say no agent may ask candidates for money.",
    },

    "reading-the-advertisement": {
      q: "How do I read a petrol pump dealership advertisement?",
      a: "Each location is advertised in newspapers, with the details on petrolpumpdealerchayan.in: the location, district, state and category. The advertisement also states the kind of site, the minimum land size, the funds you need to arrange, how the dealer is selected and the last date. Source: the June 2023 selection brochure.",
    },
    "draw-or-bidding": {
      q: "How is the dealer chosen: draw of lots or bidding?",
      a: "It depends on the kind of site. Dealer-owned and Corpus Fund sites go by a computerised draw of lots; other company-owned sites go by bidding, and a tie is settled by draw. Source: the June 2023 selection brochure.",
    },
    interview: {
      q: "Is there an interview for a petrol pump dealership?",
      a: "The June 2023 brochure says selection is made basically by draw of lots or bidding among eligible applicants. After selection come checks: an evaluation of the land and a field verification of your documents (FVC), where you show the originals.",
    },
    "draw-result": {
      q: "Where is the draw result published?",
      a: "The list of eligible applicants for each location is put on petrolpumpdealerchayan.in. Draws and bid openings are held online, as far as possible at the office of the District Collector or District Magistrate. After the draw, the location's status on the portal reads “Results of draw declared”, and its List Of Applicants marks the selected applicant “Selected”; the selected applicant is also told by SMS or email. Messages go only to the mobile number and email used to register.",
    },
    "letter-of-intent": {
      q: "What is a Letter of Intent (LOI)?",
      a: "It is the letter the oil company issues to the selected candidate after the land and document checks, and not before 30 days from the result. It is issued only if the application was found correct and no complaint or court case about the selection is pending. Source: the June 2023 selection brochure.",
    },
    "after-the-loi": {
      q: "What happens after the LOI, up to the opening day?",
      a: "The LOI holder makes the land available: within 2 months for Group 1 and 4 months for Group 2. The oil company prepares the layouts and the applications for the approvals, and the pump is built. Before commissioning, the company issues the letter of appointment with the signed dealership agreement.",
    },
    "how-long": {
      q: "How long does it take from application to opening?",
      a: "The brochure sets limits for each stage, not one total: 10 days (and 10 more after a reminder) to upload documents, 10 days' notice for each check, and the LOI not before 30 days from the result. Approvals and building come after that, with no fixed total.",
    },
    "pay-an-agent": {
      q: "Should I pay an agent to get a dealership?",
      a: "No. The oil companies say they have appointed no agency or person to select dealers, and no one may ask candidates for money. Fees and deposits are paid only on petrolpumpdealerchayan.in. If someone asks you for money, tell the oil company or the police.",
    },
  } satisfies Record<NewPumpQuestionId, QA>,

  /** The link under each answer. */
  readMore: "Read the full answer",
  /** Beside that link when the full answer exists only in English. */
  inEnglish: "(in English)",

  /* The Kavach Shuruaat block, at the top and at the end of the page. */
  funnel: {
    kicker: "Kavach Shuruaat · in the Dealer Kavach app",
    topTitle: "A question about your own plot or case?",
    topText: "Ask it in Kavach Shuruaat, in Hindi or English, at any hour.",
    endTitle: "Your question is not here?",
    endText:
      "Ask it in Kavach Shuruaat. It answers from the official rule books, in Hindi or English, at any hour, for {newPumpPrice} + GST a month. It explains the rules; the oil company decides who becomes a dealer.",
    button: "Ask your question in Kavach Shuruaat",
    about: "What Kavach Shuruaat is",
    phoneLine: "On a computer? Open mdgservices.in/new-pump on your phone, or search “Dealer Kavach” in your phone's app store.",
  },

  /** The line at the foot of the page, as on the Petrol pump guide. */
  disclaimer:
    "This page is general information from public documents, not legal, tax or financial advice. Rules, fees and guidelines change and differ by oil company and state, so confirm with the oil company or the authority before you act. MDG Services makes the Dealer Kavach app and does not sell, allot or arrange dealerships or licences.",
  disclaimerLink: "About these pages and how we check facts",
};
