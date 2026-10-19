/* Khata Kavach, MDG Services' second product: the page at /khata-kavach.

   It speaks to any business that gives goods on credit to regular customers
   (fuel, building material, gas, wholesale, dairy). The keys and anchors still
   say "pump" and "transporter" because the code was named when it began as
   petrol pumps and transporters; every visible word says business and customer.

   Outcomes only. The product is the subject of every sentence ("Khata Kavach
   shows..."), and nothing here says how MDG builds or runs it. The name is
   "Khata Kavach" in English and खाता कवच in Hindi; Dealer Kavach stays
   "Dealer's Kavach" in English sentences. */
export const kk = {
  /* ── the head of the page ── */
  meta: {
    /** At most 50 characters (the site's rule for a search title). */
    title: "Khata Kavach: credit book for any trade",
    description:
      "Khata Kavach by MDG Services is a shared credit book for any business that sells on credit. Set limits, see every sale, add a photo, send numbered bills.",
    ogTitle: "Khata Kavach · MDG Services",
    /** The one line the structured data gives for the app. */
    appDescription:
      "A shared credit account book between a business and its regular customers. The business sets each credit limit, the customer sends a request for each vehicle, and both see every sale. Numbered bills go out as a PDF on WhatsApp.",
  },
  /** Spoken name of the page in the navbar and breadcrumbs. */
  name: "Khata Kavach",
  /** The page's own navbar links (its sections, not the home page's). */
  navItems: { how: "How it works", pump: "For businesses", transporter: "For customers", faq: "Questions" },
  lockupAlt: "Khata Kavach",

  /* ── the first screen ── */
  hero: {
    by: "by MDG Services",
    headlineLine1: "Every sale written once.",
    headlineLine2: "Seen by both.",
    sub: "Khata Kavach is the shared credit book between a business and the customers it sells to on credit. No paper slips.",
    ctaPump: "Set it up for my business",
    ctaTransporter: "I am a customer",
    assurances: [
      "Hindi first, English one tap away",
      "Works with no signal at the counter",
      "Never lends or holds your money",
    ],
    phoneAlt:
      "Khata Kavach Business, the sale screen for vehicle UP00 SH 1005 of Sharma Roadlines: 'You can serve', give 50 bags of Cement, 50 bags and Rs 20,250 typed in, and a photo of the vehicle attached. The photo goes with the sale.",
    card: {
      heading: "The same line",
      plate: "UP00 SH 1005",
      detail: "50 bags cement · 6:31 am",
      pump: "Business saw it",
      transporter: "Customer saw it",
    },
  },

  /* ── the paper slip ── */
  problem: {
    heading: "Paper slips start arguments.",
    coupons: [
      "You say 50 bags. The driver says 40.",
      "The slip is lost, torn, or written twice.",
      "At month end, nobody can say who owes what.",
    ],
    close: "Khata Kavach replaces the slip with one line in a shared account book.",
  },

  /* ── one day, one shared line ── */
  flow: {
    heading: "One day, one shared line.",
    railLabel: "The shared line",
    who: { transporter: "Customer", pump: "Business", both: "Both" },
    steps: [
      { who: "transporter", text: "Sends a request for each vehicle from their phone." },
      {
        who: "pump",
        text: "At the counter, staff type the vehicle number. The screen shows a light and how much to give.",
      },
      {
        who: "pump",
        text: "They give the goods, type the quantity and rupees, add a photo of the plate or slip, and tap Done.",
      },
      {
        who: "both",
        text: "The same line shows at once on both phones.",
      },
    ],
  },

  /* ── for the business ── */
  pump: {
    heading: "See what each customer owes, and what they have paid.",
    rows: [
      "Set a credit limit for every customer.",
      "See today's credit, this month's credit, money received and bills past due.",
      "A customer near their limit shows up, with one tap to ask for payment on WhatsApp.",
      "Staff sign in with a 4-digit PIN. A manager's PIN allows one sale past the limit.",
      "Add a photo of the number plate or the slip to any sale.",
      "Make a numbered bill in a tap: a PDF on your letterhead, ready to send on WhatsApp from your own number.",
      "Money received against a bill marks it paid, and that much credit opens again.",
    ],
    cta: "Set it up for my business",
    appLink: "Open the Business app (web)",
    alts: [
      "Khata Kavach Business, the Today screen: credit given today, a Due on bills card, this month's credit and money received.",
      "Khata Kavach Business, one customer's page (Sharma Roadlines): what they owe against the limit, the Record a payment button, and a Bills section listing a bill.",
    ],
  },

  /* ── for the customer ── */
  transporter: {
    heading: "Send the day's requests from your phone. See every sale and every bill.",
    rows: [
      "Pick vehicles, say how much (bags, litres, rupees or as needed) and send in a few taps.",
      "Every sale shows as soon as it is made: vehicle, quantity and rupees.",
      "Your limit, what you owe and what you have paid, for each supplier.",
      "Every bill from every supplier in one place, with what is due and the PDF to open.",
      "Pay a bill by UPI. Your UPI app opens with the amount filled in, and the money goes straight to the business.",
      "Sent by mistake? Take a request back before the goods are given.",
      "Your supplier sets you up. Ask them to add you.",
    ],
    appLink: "Open the Customer app (web)",
    alts: [
      "Khata Kavach Customer, the request screen: how much (bags, rupees or as needed), which item (Diesel, Petrol, Cement), and quick amounts of 10, 20, 50 and 100 bags.",
      "Khata Kavach Customer, the Bills tab: what is due on bills, and the list with an unpaid bill.",
    ],
  },

  /* ── at the counter: the demo ── */
  nozzle: {
    heading: "Type the vehicle. See the light.",
    intro: "Counter staff see one of three lights, with the reason and what to do next.",
    label: "Try it with made-up vehicles",
    caption: "Made-up vehicles and amounts.",
    /** Each light says a word and the next step, so colour is never the only signal. */
    states: {
      go: { word: "OK", line: "Give 50 bags", sub: "Cement", name: "Sharma Roadlines" },
      wait: { word: "Call the manager", line: "Over the credit limit.", sub: "", name: "Gupta Transport" },
      stop: {
        word: "Stop",
        line: "No request for this vehicle today.",
        sub: "Sell for cash.",
        name: "Sharma Roadlines",
      },
    },
    lightLabels: { go: "Green light", wait: "Amber light", stop: "Red light" },
  },

  /* ── trust ── */
  trust: {
    heading: "We don't lend. We keep the account.",
    blocks: [
      {
        lead: "Khata Kavach never lends and never holds your money.",
        rest: "Customers pay the business directly, and the business writes down what it receives.",
      },
      {
        lead: "Nothing is edited.",
        rest: "A correction is a new line, so the history stays whole.",
      },
      {
        lead: "No signal at the counter?",
        rest: "The sale is saved on the phone and sent later. Its photo follows.",
      },
      {
        lead: "Each side sees only its own accounts.",
        rest: "Counter staff never see a customer's phone number.",
      },
      {
        lead: "MDG Services sets up your business and answers the phone,",
        rest: "9am to 9pm, every day.",
      },
    ],
  },

  /* ── questions ── */
  faq: {
    sectionAria: "Common questions about Khata Kavach",
    heading: "Questions, answered plainly.",
    items: [
      {
        q: "Which businesses is it for?",
        a: "Any business that sells to regular customers on credit. Fuel stations (diesel and petrol, in litres). Building material (cement in bags, sand in tonnes, steel in kg, bricks in pieces). Gas agencies (cylinders). Distributors and wholesalers (an amount only). Dairies (milk in litres, curd and paneer in kg).",
      },
      {
        q: "How do bills work?",
        a: "The business makes a numbered bill for a customer from the sales not yet billed. It is a PDF on the business's letterhead, with the total in figures and words, bank details and a UPI QR. The business sends it on WhatsApp. The customer can pay by UPI, and the business marks it paid. It is a Bill, not a GST tax invoice.",
      },
      {
        q: "Does it lend money or hold payments?",
        a: "No. It never lends and never holds money. Payments go straight to the business, which writes them down.",
      },
      {
        q: "What if there is no signal at the counter?",
        a: "Staff can still record the sale, with its photo. Both sides see the line once the phone is online.",
      },
      {
        q: "Can a customer sign up themselves?",
        a: "No. MDG Services sets up the business first, and the business adds its customers.",
      },
      {
        q: "Does my counter staff need training?",
        a: "The screen tells them what to do: vehicle number, light, quantity, Done. We show your team how.",
      },
      {
        q: "Is there an Android app?",
        a: "Both apps open in the phone's browser today. Android apps are coming to Google Play.",
      },
      {
        q: "What does it cost?",
        a: "It depends on your business. Call us and we will tell you.",
      },
      {
        q: "Do I still need Dealer's Kavach?",
        a: "They are separate apps. Dealer's Kavach handles a petrol pump dealer's paperwork. Khata Kavach handles credit sales to regular customers. Use either or both.",
      },
    ],
  },

  /* ── the guides: a few live pages on giving and keeping credit ── */
  guides: {
    sectionAria: "Guides on selling on credit",
    heading: "Selling on credit, in plain words.",
    intro: "Short pages on credit limits, getting paid, bills and how Khata Kavach compares, in Hindi and English.",
    all: "See all guides",
  },

  /* ── the way in ── */
  cta: {
    heading: "Retire the paper slip.",
    sub: "Call us, or leave your number. We will tell you whether Khata Kavach fits your business.",
    callLabel: "Call us",
    formTitle: "Leave your number",
    roleLabel: "I am",
    rolePump: "A business owner",
    roleTransporter: "A customer",
    roleTagPump: "Business owner",
    roleTagTransporter: "Customer",
    fieldName: "Your name",
    fieldPhone: "Phone",
    fieldOutlet: "Business or company (optional)",
    submit: "Request a call back",
    alreadyLabel: "Already set up?",
    openPump: "Open the Business app",
    openTransporter: "Open the Customer app",
  },
};
