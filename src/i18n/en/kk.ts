/* Khata Kavach, MDG Services' second product: the page at /khata-kavach.

   Outcomes only. The product is the subject of every sentence ("Khata Kavach
   shows..."), and nothing here says how MDG builds or runs it. The name is
   "Khata Kavach" in English and खाता कवच in Hindi; Dealer Kavach stays
   "Dealer's Kavach" in English sentences. */
export const kk = {
  /* ── the head of the page ── */
  meta: {
    /** At most 50 characters (the site's rule for a search title). */
    title: "Khata Kavach: credit fuel, no paper coupons",
    description:
      "Khata Kavach by MDG Services replaces paper coupons for credit diesel. The pump sets each limit, the transporter sends requests, both see every litre.",
    ogTitle: "Khata Kavach · MDG Services",
    /** The one line the structured data gives for the app. */
    appDescription:
      "A shared account book between a petrol pump and its transporters. The pump sets each credit limit, the transporter sends a request for each truck, and both see every fill. No paper coupons.",
  },
  /** Spoken name of the page in the navbar and breadcrumbs. */
  name: "Khata Kavach",
  /** The page's own navbar links (its sections, not the home page's). */
  navItems: { how: "How it works", pump: "Pump owner", transporter: "Transporter", faq: "Questions" },
  lockupAlt: "Khata Kavach",

  /* ── the first screen ── */
  hero: {
    by: "by MDG Services",
    headlineLine1: "Every litre written once.",
    headlineLine2: "Seen by both.",
    sub: "Khata Kavach is the shared account book between a petrol pump and its transporters. No paper coupons.",
    ctaPump: "Set it up at my pump",
    ctaTransporter: "I am a transporter",
    assurances: [
      "Hindi and English",
      "Works with no signal at the pump",
      "Never lends or holds your money",
    ],
    phoneAlt:
      "The nozzle screen on a pump's phone: 'You can fill' for truck UP00 SH 1001, 200 L of diesel, with the litres and rupees typed from the dispenser.",
    card: {
      heading: "The same line",
      plate: "UP00 SH 1001",
      detail: "200 L diesel · 6:31 am",
      pump: "Pump saw it",
      transporter: "Transporter saw it",
    },
  },

  /* ── the paper coupon ── */
  problem: {
    heading: "Paper coupons start arguments.",
    coupons: [
      "The pump says 200 litres. The driver says 180.",
      "The coupon is lost, torn, or written twice.",
      "At month end, nobody can say who owes what.",
    ],
    close: "Khata Kavach replaces the coupon with one line in a shared account book.",
  },

  /* ── one day, one shared line ── */
  flow: {
    heading: "One day, one shared line.",
    railLabel: "The shared line",
    who: { transporter: "Transporter", pump: "Pump", both: "Both" },
    steps: [
      { who: "transporter", text: "Sends a request for each truck from his phone." },
      {
        who: "pump",
        text: "The nozzle man types the truck number. The screen shows a light and how much to fill.",
      },
      { who: "pump", text: "He fills, types the litres and taps Done." },
      {
        who: "both",
        text: "The line shows at once for the transporter and in the pump's account.",
      },
    ],
  },

  /* ── for the pump owner ── */
  pump: {
    heading: "See what each transporter owes, and what he has paid.",
    rows: [
      "Set a credit limit for every transporter.",
      "See today's credit, this month's credit and what was owed before.",
      "A transporter near his limit shows up, with one tap to ask for payment on WhatsApp.",
      "A manager can allow one fill past the limit, with his own PIN.",
      "Add or switch off nozzle men and phones whenever you want.",
      "Payments you receive are written down in one tap.",
    ],
    cta: "Set it up at my pump",
    appLink: "Open the Pump app (web)",
    alts: [
      "Khata Kavach Pump, the Today screen: credit given today, this month's credit, money received and the total owed.",
      "Khata Kavach Pump, one transporter's account: the amount owed against the limit, with a Record a payment button.",
    ],
  },

  /* ── for the transporter ── */
  transporter: {
    heading: "Send the day's requests from your phone. See every fill.",
    rows: [
      "Pick trucks, or all trucks, and send in a few taps.",
      "Every fill shows as soon as it is made: truck, litres and amount.",
      "Your limit, what you owe and what you have paid, for each pump.",
      "Sent by mistake? Take a request back before it is filled.",
      "Your pump sets you up. Ask your pump to add you.",
    ],
    appLink: "Open the Transporter app (web)",
    alts: [
      "Khata Kavach Transporter, the request screen: pick the trucks and how much for each.",
      "Khata Kavach Transporter, the account screen: what you owe the pump against your limit, and every fill listed by truck.",
    ],
  },

  /* ── at the nozzle: the demo ── */
  nozzle: {
    heading: "Type the truck. See the light.",
    intro: "The nozzle man sees one of three lights, with the reason and what to do next.",
    label: "Try it with made-up trucks",
    caption: "Made-up trucks and amounts.",
    /** Each light says a word and the next step, so colour is never the only signal. */
    states: {
      go: { word: "OK", line: "Fill 200 L", sub: "Diesel", name: "Sharma Roadlines" },
      wait: { word: "Call the manager", line: "Over the credit limit.", sub: "", name: "Gupta Transport" },
      stop: {
        word: "Stop",
        line: "No request for this truck today.",
        sub: "Fill for cash.",
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
        rest: "The pump writes down each payment.",
      },
      {
        lead: "Nothing is edited.",
        rest: "A correction is a new line, so the history stays whole.",
      },
      {
        lead: "No signal at the pump?",
        rest: "The fill is still recorded, and both sides see it once the phone is online.",
      },
      {
        lead: "Each side sees only its own account.",
        rest: "A transporter sees his, a pump sees its transporters.",
      },
      {
        lead: "MDG Services sets up your pump and answers the phone,",
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
        q: "Who is it for?",
        a: "Petrol pumps that sell diesel on credit to transporters, and the transporters who buy it.",
      },
      {
        q: "Does it lend money or hold payments?",
        a: "No. It never lends and never holds money. The pump writes down payments it receives.",
      },
      {
        q: "What if there is no signal at the pump?",
        a: "The nozzle man can still fill and record. Both sides see the line once the phone is online.",
      },
      {
        q: "Can a transporter sign up himself?",
        a: "Not yet. MDG Services sets up the pump first, and the pump adds its transporters.",
      },
      {
        q: "Do my nozzle men need training?",
        a: "The screen tells them what to do: truck number, light, litres, Done. We show your team how.",
      },
      {
        q: "Is there an Android app?",
        a: "Both apps open in the phone's browser today. Android apps are coming to Google Play.",
      },
      {
        q: "What does it cost?",
        a: "It depends on your pump. Call us and we will tell you.",
      },
      {
        q: "Do I still need Dealer's Kavach?",
        a: "They are separate apps. Dealer's Kavach handles a dealer's paperwork. Khata Kavach handles credit fuel to transporters. Use either or both.",
      },
    ],
  },

  /* ── the way in ── */
  cta: {
    heading: "Retire the paper coupon.",
    sub: "Call us, or leave your number. We will tell you whether Khata Kavach fits your pump.",
    callLabel: "Call us",
    formTitle: "Leave your number",
    roleLabel: "I am",
    rolePump: "A pump owner",
    roleTransporter: "A transporter",
    roleTagPump: "Pump owner",
    roleTagTransporter: "Transporter",
    fieldName: "Your name",
    fieldPhone: "Phone",
    fieldOutlet: "Pump or company (optional)",
    submit: "Request a call back",
    alreadyLabel: "Already set up?",
    openPump: "Open the Pump app",
    openTransporter: "Open the Transporter app",
  },
};
