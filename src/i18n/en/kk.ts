/* Khata Kavach, MDG Services' second product: the page at /khata-kavach.

   It is for petrol pumps that give diesel and petrol on credit to their
   transporters and other regular customers who come in their own trucks, and
   for those transporters. The two apps are Khata Kavach Pump and Khata Kavach
   Transporter, and the keys and anchors below (pump, transporter) match them.

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
      "Khata Kavach by MDG Services is a shared account book for petrol pumps and their transporters. Set limits, see every fill, add a photo, send numbered bills.",
    ogTitle: "Khata Kavach · MDG Services",
    /** The one line the structured data gives for the app. */
    appDescription:
      "A shared account book between a petrol pump and its transporters. The pump sets each credit limit, the transporter sends a request for each truck, and both see every fill. Numbered bills go out as a PDF on WhatsApp.",
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
    ctaPump: "Set up my pump",
    ctaTransporter: "I am a transporter",
    assurances: [
      "Hindi first, English one tap away",
      "Works with no signal at the pump",
      "Never lends or holds your money",
    ],
    phoneAlt:
      "Khata Kavach Pump at the demo pump, the fill screen for truck UP00 SH 1001 of Sharma Roadlines: 'You can fill', 200 L of diesel and Rs 17,524 typed in, and a photo of the truck attached. The photo goes with the fill.",
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
      {
        who: "transporter",
        text: "Sends a request for each truck from his phone: litres, rupees or a full tank.",
      },
      {
        who: "pump",
        text: "At the nozzle, the nozzle man types the last 4 digits of the truck number. The screen shows a light and how much credit is left.",
      },
      {
        who: "pump",
        text: "He fills, types the rupees from the dispenser (the litres fill in at today's rate), adds a photo if he wants, and taps Done.",
      },
      {
        who: "both",
        text: "The same line shows on both phones, as soon as the phone is online.",
      },
    ],
  },

  /* ── for the pump owner ── */
  pump: {
    heading: "See what each transporter owes, and what he has paid.",
    rows: [
      "Set a credit limit for every transporter.",
      "For a transporter you choose, a manager's PIN can allow a fill without a request.",
      "See today's credit, this month's credit, money received and what is due on bills.",
      "A transporter near his limit shows up, with one tap to ask for payment on WhatsApp.",
      "Every morning from 6 a.m., the day's rate of each fuel is typed once, or taken from yesterday with one tap.",
      "Everyone at the pump signs in with a 6-digit PIN, and you can add or switch off phones whenever you want. A manager's PIN allows one fill past the limit.",
      "Add a photo of the truck or the slip to any fill.",
      "Make a numbered bill in a tap: a PDF on your letterhead, ready to send on WhatsApp from your own number.",
      "Money received against a bill marks it paid, and that much credit opens again.",
    ],
    cta: "Set up my pump in the app",
    appLink: "Open the Pump app (web)",
    alts: [
      "Khata Kavach Pump at the demo pump, the Today screen: credit given today, what is due on bills, and this month's credit.",
      "Khata Kavach Pump at the demo pump, one transporter's page (Sharma Roadlines): what it owes against the limit, the Record a payment button, and its bills.",
    ],
  },

  /* ── for the transporter ── */
  transporter: {
    heading: "Send the day's requests from your phone. See every fill and every bill.",
    rows: [
      "Pick the trucks, say how much for each (litres, rupees or a full tank, diesel or petrol) and send in a few taps.",
      "Every fill shows as soon as it is made: truck, litres and amount, with the photo if the nozzle man took one.",
      "Your limit, what you owe and what you have paid, for each pump.",
      "Every bill from every pump in one place, with what is due and the PDF to open.",
      "Pay a bill by UPI. Your UPI app opens with the amount filled in, and the money goes straight to the pump.",
      "Sent by mistake? Take a request back before it is filled.",
      "Add a manager (munshi) who sends requests from his own phone, with his own 6-digit PIN.",
      "Your pump sets you up and sends you a link on WhatsApp. Ask your pump to add you.",
    ],
    appLink: "Open the Transporter app (web)",
    alts: [
      "Khata Kavach Transporter, the request screen: Litres, Rupees or Full tank, Diesel or Petrol, and quick litre amounts.",
      "Khata Kavach Transporter, the Bills tab: what is due on bills, and the list with one unpaid bill.",
    ],
  },

  /* ── at the nozzle: the demo ── */
  nozzle: {
    heading: "Type the truck number. See the light.",
    intro: "The nozzle man sees one of three lights, with the reason and what to do next.",
    label: "Try it with made-up trucks",
    caption: "Made-up trucks and amounts.",
    /** Each light says a word and the next step, so colour is never the only signal. */
    states: {
      go: { word: "You can fill", line: "Fill 200 L", sub: "Diesel", name: "Sharma Roadlines" },
      wait: { word: "Call the manager", line: "Over the credit limit.", sub: "", name: "Gupta Transport" },
      stop: {
        word: "No credit",
        line: "No request for this truck today.",
        sub: "You can fill for cash.",
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
        rest: "Transporters pay the pump directly, and the pump writes down what it receives.",
      },
      {
        lead: "Nothing is edited.",
        rest: "A correction is a new line, so the history stays whole.",
      },
      {
        lead: "No signal at the pump?",
        rest: "The fill is saved on the phone and sent later. Its photo follows.",
      },
      {
        lead: "Each side sees only its own account.",
        rest: "A transporter sees his, a pump sees its transporters. Nozzle men never see a transporter's phone number.",
      },
      {
        lead: "A person at MDG Services answers the phone,",
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
        a: "Petrol pumps that give diesel and petrol on credit to transporters, fleet owners and other regular customers who come in their own trucks and vehicles, and the transporters and fleet owners who buy from them. It is for pumps of any oil company. MDG Services is not connected with any oil company.",
      },
      {
        q: "Which fuels does it cover?",
        a: "The four fuels a pump sells: diesel, petrol, premium diesel and premium petrol, by the litre.",
      },
      {
        q: "What if a transporter has not sent a request?",
        a: "The light is red, \"No credit\", and the nozzle man can fill for cash. For a transporter you choose, you can let a manager's PIN allow a fill without a request.",
      },
      {
        q: "How do bills work?",
        a: "The pump makes a numbered bill for a transporter from the fills not yet billed. It is a PDF on the pump's letterhead, with the total in figures and words, bank details and a UPI QR. The pump sends it from its own WhatsApp. The transporter can pay by UPI, and the pump marks it paid. It is a numbered bill, not a GST tax invoice.",
      },
      {
        q: "Does it lend money or hold payments?",
        a: "No. It never lends and never holds money. Payments go straight to the pump, which writes them down.",
      },
      {
        q: "What if there is no signal at the pump?",
        a: "The nozzle man can still fill and record, with the photo. Both sides see the line once the phone is online.",
      },
      {
        q: "Can a transporter sign up himself?",
        a: "No. The pump adds its transporters and sends each one a link on WhatsApp. A pump owner sets up his own pump in the Pump app, in about a minute.",
      },
      {
        q: "Do my nozzle men need training?",
        a: "The screen tells them what to do: the last 4 digits of the truck number, the light, the litres and rupees, Done. We show your team how.",
      },
      {
        q: "Is there an Android app?",
        a: "Both apps open in the phone's browser today. Android apps are coming to Google Play.",
      },
      {
        q: "What does it cost?",
        a: "Nothing while Khata Kavach is new. If that ever changes, we will tell you well before anything is charged.",
      },
      {
        q: "Do I still need Dealer's Kavach?",
        a: "They are separate apps. Dealer's Kavach handles a petrol pump dealer's paperwork. Khata Kavach handles credit fuel to transporters. Use either or both.",
      },
    ],
  },

  /* ── the guides: a few live pages on giving fuel on credit ── */
  guides: {
    sectionAria: "Guides on giving fuel on credit",
    heading: "Fuel on credit, in plain words.",
    intro: "Short pages on credit limits, getting paid, bills and how Khata Kavach compares, in Hindi and English.",
    all: "See all guides",
  },

  /* ── the way in ── */
  cta: {
    heading: "Retire the paper coupon.",
    sub: "Set up your pump in the Pump app in about a minute, then add your transporters on WhatsApp. Want to talk first? Call us, or leave your number.",
    startLabel: "Set up my pump in the app",
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
