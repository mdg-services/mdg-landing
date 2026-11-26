/* /new-pump: Kavach Shuruaat (ADR 0058; called New Pump Guide while it was
   built), the rule-book chat inside the Dealer Kavach app for someone planning
   a petrol pump.

   Rules for these words, because the reader is about to spend money on a
   dream:
   - Never promise, or let a sentence imply, that anyone will get a dealership,
     a licence or an approval. The oil company, PESO and the highway authority
     decide; we say so more than once.
   - The example answers describe the KIND of answer, with no figures: a
     distance or a plot size printed here would be one more number to go stale
     and to be quoted back at us. The app gives the figures, from the books.
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
    androidLink: "On an Android phone? Start here",
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
    intro: "A few examples, and the kind of answer you get. The real answers come with the figures the rule books give.",
    items: [
      {
        q: "How far must my pump be from a junction on a National Highway?",
        a: "The distances the highway ministry's rules set, case by case, and who decides when your stretch of road is not a plain case.",
      },
      {
        q: "How much land do I need?",
        a: "The plot sizes the selection rules ask for, by kind of road and place, and what to check in the land papers before you apply.",
      },
      {
        q: "Which licences and approvals does a new pump need?",
        a: "The approvals the documents list, which office gives each one, and which ones come before building starts.",
      },
      {
        q: "How does the oil company choose a dealer?",
        a: "The steps as the guidelines describe them: the advertisement, who may apply, the documents, the selection and the checks after it.",
      },
      {
        q: "What does it cost to build a pump?",
        a: "The costs the documents mention and who bears which, and which costs they leave to your own quotes.",
      },
      {
        q: "What does PESO approve, and when?",
        a: "What the explosives licence covers, the drawings it asks for, and the inspection before fuel may be stored.",
      },
      {
        q: "What must be on display on opening day?",
        a: "The boards a customer must be able to see, and the first-aid and fire-safety items the rules ask for.",
      },
    ],
    note: "Every answer is general guidance read from official documents. It is not legal advice and it is not an approval: the oil company, PESO and the highway authority decide.",
  },

  sources: {
    heading: "What it reads from",
    intro: "Kavach Shuruaat answers only from documents we hold, not from guesses:",
    items: [
      "The Marketing Discipline Guidelines 2024: the oil companies' rules for running an outlet.",
      "IndianOil's Dealer Handbook.",
      "The highway ministry's 2020 rules for fuel stations on National Highways: access, distances and layout.",
      "IndianOil's 2025 policy circular on modernising outlets (334-07/2025).",
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

  steps: {
    heading: "Start in three steps",
    items: [
      { title: "Install Dealer Kavach", body: "It is free on the App Store and Google Play." },
      {
        title: "Choose “I want to open a petrol pump”",
        body: "Give your name, mobile number, a password and your state. It takes a minute.",
      },
      {
        title: "Pay the link on WhatsApp",
        body: "The autopay link for {newPumpTotal} a month comes on WhatsApp and SMS. Once it is paid, ask your first question.",
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
