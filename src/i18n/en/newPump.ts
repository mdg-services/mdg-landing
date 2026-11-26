/* /new-pump: Kavach Shuruaat (ADR 0058; called New Pump Guide while it was
   built), the rule-book chat inside the Dealer Kavach app for someone planning
   a petrol pump.

   Rules for these words, because the reader is about to spend money on a
   dream:
   - Never promise, or let a sentence imply, that anyone will get a dealership,
     a licence or an approval. The oil company, PESO and the highway authority
     decide; we say so more than once.
   - The sample answers (ADR 0059 §6) are short and correct, from public
     documents only, and each names its source and date: the highway
     ministry's (MoRTH) norms of 26 June 2020, the oil companies' June 2023
     dealer selection brochure, the Petroleum Rules 2002. Never a figure from
     a document that is not public.
   - Prices come in as {facts} (lib/docText.ts docFacts), never typed here.
   - No pay button and no "pay in the app": payment is a link on WhatsApp or
     SMS (Play's payments policy, ADR 0022 §1).
   - Nobody is named "Sir". Plain words; one idea per sentence.
   - Refunds (ADR 0058 §13.2): no first-month money-back, no refund of a
     started month, and a refund question in the chat goes to the team. */
export const newPump = {
  meta: {
    title: "Kavach Shuruaat: ask anything about opening a petrol pump · MDG Services",
    description:
      "Planning a petrol pump? Kavach Shuruaat in the Dealer Kavach app answers your questions from the official rule books, in Hindi or English. {newPumpPrice} + GST a month.",
    ogTitle: "Kavach Shuruaat: ask anything about opening a petrol pump",
  },
  /** The product's name, as the app and the menu say it. */
  name: "Kavach Shuruaat",

  hero: {
    eyebrow: "In the Dealer Kavach app",
    heading: "Planning a petrol pump? Ask anything.",
    intro:
      "Kavach Shuruaat answers your questions about opening and running a petrol pump, in plain Hindi or English, from the official rule books. Land, distances, licences, dealer selection, building and opening: ask it the way you would ask a friend who knows.",
    price: "{newPumpPrice} a month + {newPumpGstPercent} GST",
    priceNote: "{newPumpTotal} a month in all, by autopay. It starts when your first payment is done.",
    storeLead: "Get the free Dealer Kavach app, then choose “I want to open a petrol pump”.",
    appStoreAria: "Get the Dealer Kavach app on the App Store, for Kavach Shuruaat",
    playAria: "Get the Dealer Kavach app on Google Play, for Kavach Shuruaat",
    /** The funnel link (ADR 0059 §2): on a phone it opens the app, or its store. */
    askLink: "Ask your question in Kavach Shuruaat",
    /** For a computer, where the funnel link comes back to this page. */
    phoneLine: "On a computer? Open mdgservices.in/new-pump on your phone, or search “Dealer Kavach” in your phone's app store.",
    /** A tag on the hero's list of what it covers. */
    topicsAria: "What you can ask about",
    topics: ["Land and location", "Distances on highways", "Licences and approvals", "Dealer selection", "Building the pump", "Opening day"],
  },

  forWho: {
    heading: "Who it is for",
    items: [
      "You are thinking about a petrol pump and want to understand the rules before you spend anything.",
      "You have applied to an oil company, or been selected, and want to know what comes next.",
      "You are building the pump and need to know about approvals, layout, equipment and opening.",
    ],
    /** What it is not, said as plainly as what it is. */
    not: "It does not get you a dealership. The oil company selects dealers, and PESO, the highway authority and other offices give the approvals. Kavach Shuruaat helps you understand their rules.",
  },

  examples: {
    heading: "Questions you can ask",
    intro: "Six questions people ask, with short answers from public documents. In the app you can ask about your own plot and case, and follow up.",
    items: [
      {
        q: "How far must a pump be from a junction on a National Highway?",
        a: "On a rural stretch, at least 300 m from an intersection or a median gap; on an urban or hilly stretch, 100 m. Source: the highway ministry's (MoRTH) norms of 26 June 2020.",
      },
      {
        q: "How much land does a pump on a National Highway need?",
        a: "At least 35 m by 35 m on a rural stretch in plain terrain, 30 m by 30 m on an urban stretch and 20 m by 20 m in hilly terrain (MoRTH norms, 26 June 2020). Elsewhere, the oil company's advertisement states the size for each location.",
      },
      {
        q: "Who can apply for a dealership?",
        a: "An Indian citizen and resident with a valid PAN, aged 21 to 60, who has passed 10th class, under the oil companies' June 2023 selection brochure. Each advertisement adds the land conditions for its location.",
      },
      {
        q: "How does the oil company choose a dealer?",
        a: "By a computerised draw of lots or by bidding among eligible applicants, depending on the kind of site. The land and the documents are checked after that (June 2023 selection brochure).",
      },
      {
        q: "Which licences does a new pump need?",
        a: "A licence in Form XIV from PESO to store petrol and diesel, with a No Objection Certificate from the District Authority (Petroleum Rules 2002, rule 144). Other approvals differ by state.",
      },
      {
        q: "What does it cost to apply?",
        a: "An application fee of ₹2,500 to ₹10,000 with GST, by category and kind of outlet, and later a refundable security deposit of ₹2 lakh to ₹5 lakh (June 2023 selection brochure). The building funds are stated in each location's advertisement.",
      },
    ],
    note: "Every answer is general guidance read from official documents. It is not legal advice and it is not an approval: the oil company, PESO and the highway authority decide.",
    /** The link to the questions hub, /new-pump/questions. */
    more: "More questions people ask, answered",
  },

  sources: {
    heading: "What it reads from",
    intro: "Kavach Shuruaat answers only from documents we hold, not from guesses:",
    items: [
      "The Marketing Discipline Guidelines 2024: the oil companies' rules for running an outlet.",
      "The highway ministry's 2020 rules for fuel stations on National Highways: access, distances and layout.",
      "Guidance on display boards and first aid at an outlet.",
      "Our own plain-language guides on opening and running a petrol pump.",
    ],
    unsettled:
      "When the books do not settle a question, the answer says so, and tells you where to ask: the oil company's area sales office, the dealer selection portal, the highway authority, or your state's PESO office.",
    noPerson: "No person answers your questions: you get the answer in the chat, at any hour. Only a question about a refund is passed to our team.",
  },

  price: {
    heading: "What it costs",
    rows: [
      ["Kavach Shuruaat, one month", "{newPumpPrice}"],
      ["GST at {newPumpGstPercent}", "{newPumpGst}"],
      ["**You pay a month**", "**{newPumpTotal}**"],
    ] as [string, string][],
    headLabel: "For one month",
    headAmount: "Amount",
    points: [
      "You pay by autopay, from a link we send on WhatsApp or SMS. There is no payment inside the app.",
      "The plan starts when your first payment is done, and runs month to month.",
      "Cancel any time. You keep access to the end of the month you have paid for.",
      "A month that has started is not refunded, and there is no first-month money-back. Our team handles any refund request. The full rules are in the [Refund policy](route:/refund-policy) and the [Terms](route:/terms).",
    ],
  },

  /* How it works (ADR 0059 §6): the same four steps the app takes a reader through. */
  steps: {
    heading: "How it works",
    items: [
      {
        title: "Choose “I want to open a petrol pump”",
        body: "In the Dealer Kavach app, which is free on Google Play and the App Store.",
      },
      { title: "Sign up in a minute", body: "Give your name, mobile number, a password and your state." },
      {
        title: "Get the payment details on WhatsApp and SMS",
        body: "The autopay link for {newPumpTotal} a month comes on WhatsApp and SMS. There is no payment inside the app.",
      },
      {
        title: "Ask anything",
        body: "Once the first payment is done, ask in the chat, in Hindi, Hinglish or English, at any hour.",
      },
    ],
  },

  opens: {
    heading: "When your pump opens",
    body: "Tell the app your pump is open, with its SAP code and name. Your account becomes a Dealer Kavach account in place.",
    points: [
      "The same login and the same chat. Your questions and answers stay.",
      "Kavach Shuruaat stops, and so does its autopay.",
      "Dealer Kavach's setup starts in the chat. It is {standard} a month + GST, and your first month's money comes back if you are not happy.",
    ],
  },

  faq: {
    heading: "Questions",
    items: [
      {
        q: "Will Kavach Shuruaat help me get a dealership?",
        a: "No. It explains the rules so you can plan well and ask the right office. The oil company selects dealers. MDG Services does not sell, allot or arrange dealerships or licences.",
      },
      {
        q: "Who answers my questions?",
        a: "The answers are written from the rule books, in the chat, at any hour. No person reads or answers them, so there is no waiting for a call. Only a question about a refund is passed to our team, who talk to you about it.",
      },
      {
        q: "Is the answer legal advice or an approval?",
        a: "No. It is general guidance from official documents. Before you buy land, sign anything or start building, confirm with the oil company or the office concerned.",
      },
      {
        q: "Which languages can I ask in?",
        a: "Hindi, Hinglish or English. The answer comes in the language you use in the app.",
      },
      {
        q: "Why can I not pay inside the app?",
        a: "Payment is by a secure link on WhatsApp or SMS. If you lost it, ask for it again in the app, and it comes again on WhatsApp and SMS.",
      },
      {
        q: "What if I do not pay the link?",
        a: "Nothing is charged. After 7 days the bill is closed and the plan waits. When you want to start, ask for the payment details again in the app, and they come on WhatsApp and SMS.",
      },
      {
        q: "How do I cancel?",
        a: "Email or call us, or stop the autopay from your UPI app or bank. You keep access to the end of the month you paid for. A started month is not refunded.",
      },
      {
        q: "I already run a petrol pump. Is this for me?",
        a: "Dealer Kavach itself is for you: it keeps your filings, renewals and reports on time, and it also answers rule questions from the same books.",
      },
    ],
  },

  /** The line at the foot of the page. */
  disclaimer:
    "Kavach Shuruaat gives general information from official documents. It is not legal advice and not an approval. Rules change and differ by oil company and state. MDG Services is independent and is not part of IndianOil, BPCL or HPCL.",

  /* ── The card that offers Kavach Shuruaat elsewhere (the home page's products) ── */
  card: {
    kicker: "New in the Dealer Kavach app",
    title: "Planning a petrol pump?",
    body: "Kavach Shuruaat answers any question about opening a pump, from the official rule books, in Hindi or English.",
    price: "{newPumpPrice} + GST a month",
    link: "See Kavach Shuruaat",
  },

  navItems: {
    examples: "Questions",
    price: "Price",
    start: "Start",
    faq: "FAQ",
  },
};
