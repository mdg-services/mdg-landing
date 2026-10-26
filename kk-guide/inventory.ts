/**
 * Every Khata Kavach page (mdgservices.in/khata-kavach/…, Hindi at
 * /hi/khata-kavach/…), in release order of priority. The single source of
 * truth: the page builder (src/guides/), the release schedule
 * (kk-guide/schedule.ts), the sitemap and proxy.ts all read it.
 *
 * A page's words live in kk-guide/content/<lang>/<id>.md. Every page has a
 * Hindi twin at "/hi" + path. Writers' rules: kk-guide/README.md.
 *
 * `brief` is the writer's scope: what the page must cover. It never reaches the
 * site. Briefs written before 23 Oct 2026 describe every request as "for a vehicle";
 * where they do, README.md's "How the counter knows the customer" wins (pickup
 * codes, trusted customers, vehicle numbers for fuel). `queries` are real searches (Google and YouTube suggestions, Brave
 * results, Oct 2026) the page should answer in the words people type.
 */
import type { PageType, PillarMeta } from "../guide/inventory.js";

export type KkPillar = "hub" | "credit" | "counter" | "paid" | "compare" | "features" | "trades" | "examples";

export interface KkPage {
  id: string;
  pillar: KkPillar;
  /** English path, with trailing slash. The Hindi twin lives at "/hi" + path. */
  path: string;
  hi: boolean;
  type: PageType;
  wave: 1 | 2 | 3;
  queries: string[];
  brief: string;
}

export const KK_PILLARS: Record<KkPillar, PillarMeta> = {
  hub: { en: "Guides", hi: "गाइड", main: "hub" },
  credit: { en: "Giving credit", hi: "उधार देना", main: "credit" },
  counter: { en: "Credit at the counter", hi: "काउंटर पर उधार", main: "counter" },
  paid: { en: "Getting paid", hi: "पैसा वसूलना", main: "getting-paid" },
  compare: { en: "Comparisons", hi: "तुलना", main: "compare" },
  features: { en: "Khata Kavach features", hi: "खाता कवच के फ़ीचर", main: "features" },
  trades: { en: "Who it is for", hi: "किसके लिए", main: "trades" },
  examples: { en: "Worked examples", hi: "उदाहरण", main: "examples" },
};

const P = "/khata-kavach";

/**
 * Every brief speaks to a petrol pump and its transporters (since 27 Oct 2026; from 19 to 26 Oct the product was
 * offered to any trade). Where a brief and README.md differ, README.md wins.
 */
export const KK_PAGES: KkPage[] = [
  // ── The front door ────────────────────────────────────────────────────
  {
    id: "hub", pillar: "hub", path: `${P}/guides/`, hi: true, type: "Hub", wave: 1,
    queries: ["उधार खाता बुक", "udhar khata book", "udhar ka hisab", "उधार का हिसाब", "credit to regular customers"],
    brief: "The front door of the Khata Kavach pages. Hindi H1 and title lead with 'उधार खाता' and 'उधार का हिसाब' (never 'क्रेडिट'). For a petrol pump owner who gives diesel and petrol on credit to transporters and fleet owners whose trucks fill at his pump. Frame the four jobs of credit in one short paragraph each: deciding who gets credit and how much, controlling it at the nozzle, getting paid, and keeping a record both sides trust. Then one paragraph on where Khata Kavach fits, plainly, with its two apps (Pump app, Transporter app). The topic cards are drawn by the template: write the framing, not a link list. No sales tone; this page is a guide's front door.",
  },
  {
    id: "disclaimer", pillar: "hub", path: `${P}/guides/disclaimer/`, hi: true, type: "Legal", wave: 1,
    queries: [],
    brief: "Already written (who writes these pages and how). The template prints the full disclaimer under it.",
  },

  // ── Wave 1: the pages that answer what nobody answers well ─────────────
  {
    id: "credit", pillar: "credit", path: `${P}/credit/`, hi: true, type: "Pillar", wave: 1,
    queries: ["उधार देने के नियम", "business me udhar dena chahiye ya nahi", "credit sales to regular customers", "udhar dene ke niyam", "credit to customers"],
    brief: "Giving diesel on credit (udhar) to transporters, the plain guide for a pump owner. Should you give udhar at all (it is how fleet business runs; the cost is money tied up and the risk of not being paid). The five decisions every pump that gives credit makes: who gets credit, how much (the limit), for how long (the credit period), who may say yes at the nozzle, and how the fill is recorded so both sides agree later. One short table: decision / what to decide / the page that explains it (use [words](@id) links). End with a short line on where a shared credit book helps (Khata Kavach) without selling.",
  },
  {
    id: "credit-without-stress", pillar: "credit", path: `${P}/credit/udhar-se-kaise-bache/`, hi: true, type: "Explainer", wave: 1,
    queries: ["dukan me udhar se kaise bache", "business me udhar se kaise bache", "उधारी से कैसे बचे", "udhar dene ke nuksan", "business me udhar dena chahiye ya nahi", "उधार देने के नुकसान"],
    brief: "How to keep giving credit without getting burned (dukan me udhar se kaise bache, written for a pump). The honest answer: most pumps cannot stop credit, because their regular transporters buy on it; the stress comes from not knowing, not from credit itself. Seven habits that take the stress off the pump owner: a rupee limit for every transporter; the transporter asks before a truck fills; one person allowed to say yes over the limit; every credit fill recorded the same way with who filled; the transporter sees what he owes as it happens; bills on fixed days; stop new credit at a fixed number of days overdue. A short table: habit / what it prevents. One short section on how Khata Kavach builds these habits in (requests per truck, the light at the nozzle, the shared line, the Today screen). The Hindi page is the main one for these searches: natural Hindi, with the Roman forms 'dukan me udhar se kaise bache' and 'business me udhar se kaise bache' in the FAQ. No superstition, no 'udhar band'.",
  },
  {
    id: "credit-limit", pillar: "credit", path: `${P}/credit/credit-limit/`, hi: true, type: "Explainer", wave: 1,
    queries: ["credit limit for customers", "how much credit to give a customer", "credit days and credit limit", "उधार की सीमा कैसे तय करें", "udhar ki limit kitni rakhe"],
    brief: "How a pump sets a credit limit for a transporter, with worked examples in litres and rupees. One-line answer first. The common rule of thumb: about what the transporter buys from you in one credit period (monthly purchase × credit days ÷ 30), started lower for a new transporter and raised after on-time payment; say it is a rule of thumb, not a law. A table of three made-up transporters (a small fleet, a bigger one, a tractor owner) with monthly diesel, credit days, the worked limit. Credit period: 7, 15 or 30 days and how it ties to the limit. What to do when a good transporter is slightly over (decide in advance who may allow it; see @counter-over-limit). Set the limit in rupees, not litres, because prices move. Mention that Khata Kavach checks the rupee limit at the nozzle (one sentence).",
  },
  {
    id: "tool-khata-format", pillar: "credit", path: `${P}/credit/udhar-khata-format/`, hi: true, type: "Tool", wave: 1,
    queries: ["udhar khata format", "udhar khata excel sheet", "udhar khata book pdf", "khata book excel format", "udhari chart", "उधार खाता फॉर्मेट", "excel mein udhar khata kaise banaye"],
    brief: "A free udhar khata format to download and use: an Excel sheet (English or Hindi headings) with one sheet for every line and a customer sheet that adds up each customer's balance and credit left, and a printable A4 khata page (one page per customer) as a PDF. The page shows the columns as a table, how to use the sheet in five steps, and what a sheet cannot do that a shared book does (the customer does not see it as it happens). The download is free and needs no sign-up; Khata Kavach's own price is not mentioned.",
  },
  {
    id: "tool-credit-limit", pillar: "credit", path: `${P}/credit/credit-limit-calculator/`, hi: true, type: "Tool", wave: 1,
    queries: ["credit limit calculator", "how much credit to give a customer", "udhar ki limit kitni rakhe", "credit limit kaise nikale", "उधार की सीमा कैसे तय करें"],
    brief: "A credit-limit calculator using the rule of thumb on the credit-limit page: monthly purchase × credit days ÷ 30, half for a new customer, rounded down to the nearest Rs 1,000, capped at what the owner says they could carry if the customer paid a month late. Shows the working. A rule of thumb, not a law; nothing typed is stored or sent.",
  },
  {
    id: "counter", pillar: "counter", path: `${P}/counter/`, hi: true, type: "Pillar", wave: 1,
    queries: ["counter staff udhar", "staff giving credit without owner", "credit sale at counter", "उधार काउंटर पर", "credit sale control"],
    brief: "Credit at the nozzle: who decides, who records, who sees. The owner sets the rules but is not at the nozzle for every fill; the nozzle man decides in seconds. The three questions he needs answered before a truck fills (is this transporter allowed credit today, how much is left, has the transporter asked for this truck), and the record that must come out of every credit fill (truck number, fuel, litres, rupees, who filled, time, a coupon number or photo). What goes wrong with memory, a register or paper coupons (no dramatisation, no statistics). The principle: decide the rule once, let the screen apply it, and let both sides see the record. Link the counter pages.",
  },
  {
    id: "counter-over-limit", pillar: "counter", path: `${P}/counter/over-the-limit/`, hi: true, type: "Checklist", wave: 1,
    queries: ["customer over credit limit what to do", "credit limit exceeded", "limit cross ho gayi udhar", "उधार की सीमा पार", "manager approval credit"],
    brief: "A customer is over the credit limit at the counter: what staff should do. A short rule sheet the owner can adopt: who may allow one sale past the limit (a named manager, never the person serving), what gets written down (who allowed it, how much over, why), offer to sell for cash, ask the customer to pay something now, and how the owner reviews every override that day. A table: situation (slightly over / far over / account on hold / no request today) → what staff do. How Khata Kavach does it (amber light, manager's PIN for one sale, the owner sees every override); keep that to a short section and use the real screen words.",
  },
  {
    id: "counter-slips", pillar: "counter", path: `${P}/counter/paper-slips-and-coupons/`, hi: true, type: "Explainer", wave: 1,
    queries: ["diesel credit slip", "petrol pump udhar parchi", "fuel coupon petrol pump transporter", "credit slip book", "पेट्रोल पंप उधार पर्ची", "parchi system"],
    brief: "Paper credit slips and coupon books at a fuel station or a building material store: how they work and where they go wrong, and what to use instead. How it works (the customer's driver brings or is given a slip; the seller writes or keeps it; bills at month end). Where it goes wrong, as mechanics not statistics: a slip does not show what the customer already owes; a lost, torn or duplicate slip; the quantity on the slip and the quantity given differ; the customer sees the total only at month end; staff can write a slip with no one asking. What a good record needs instead (customer asks first, a limit check, a line both sides see, a photo). Do not run paper down; paper needs no phone or signal, say so. Never cite a loss figure. Words dealers use: parchi, slip, coupon, udhar.",
  },
  {
    id: "getting-paid", pillar: "paid", path: `${P}/getting-paid/`, hi: true, type: "Pillar", wave: 1,
    queries: ["how to recover money from customers", "koi udhar wapas na de to kya kare", "udhar paisa na de to kya kare", "bakaya paisa kaise nikale", "outstanding payment recovery"],
    brief: "Getting paid for credit sales: from the first reminder to the last step. A ladder table: before it is due (agree terms, send the bill) / on the due day (reminder) / 15-30 days late (stop new credit, call) / 60+ days (written demand) / last steps (mediation, suit, cheque route if a cheque bounced). Each rung links its page. The point that prevention beats recovery: limits, a record the customer sees, regular bills. Say plainly that the law pages are general information. No guarantees ('you will recover').",
  },
  {
    id: "paid-udhar-wapas", pillar: "paid", path: `${P}/getting-paid/udhar-vasuli-ke-upay/`, hi: true, type: "Explainer", wave: 1,
    queries: ["उधार वसूली के उपाय", "udhar vasuli ke upay", "उधारी कैसे वसूल करें", "udhari kaise vasool kare", "dukan ka udhar kaise nikale", "udhar wapas kaise le", "उधार दिया हुआ पैसा वापस कैसे लें"],
    brief: "Udhar vasuli ke upay (how to recover udhar): a pump owner's steps that get paid and keep the transporter. Written FOR a pump with regular transporters (say so in the first line: not for money lent to friends). Steps: check your own record first (what is owed, since when, what the transporter has seen); send a clear statement or bill; ask politely, in person or on WhatsApp, with the exact amount and a date; agree a plan if they cannot pay at once (part payments, recorded); stop new credit until it is cleared; written demand; legal steps last (link). What not to do: public shaming, threats, a 'defaulter list', hiring muscle, posting on social media (these can create legal trouble for the pump). Hindi page is the main one for this query: write it natural.",
  },
  {
    id: "paid-reminder-messages", pillar: "paid", path: `${P}/getting-paid/payment-reminder-messages/`, hi: true, type: "Template", wave: 1,
    queries: ["पेमेंट रिमाइंडर मैसेज", "payment reminder message in hindi", "payment reminder message to customer", "उधार पैसा कैसे मांगे", "udhar paisa kaise mange", "udhari mangne ka tarika"],
    brief: "Payment reminder messages for credit customers, in Hindi and English, ready to copy: 6-8 short messages in our own words (before due, on due date, a week late, after a part payment, after a bounced promise, final request before stopping credit). Each one names the amount, the bill or period, and how to pay; polite, never threatening. A short 'how to send' section: from your own WhatsApp, one customer at a time, not bulk. Mention once that Khata Kavach's 'Ask for payment on WhatsApp' button opens your WhatsApp with a ready message (it does not send by itself). Both language pages carry both languages' messages? No: English page gives English messages plus Hinglish lines; Hindi page gives Devanagari messages.",
  },
  {
    id: "trades", pillar: "trades", path: `${P}/for/`, hi: true, type: "Pillar", wave: 1,
    queries: ["credit app for business", "b2b credit management", "udhar app for wholesale", "transporter credit app"],
    brief: "Who Khata Kavach is for, and who it is not for. For: petrol pumps of any oil company (not connected with any) that give diesel and petrol on credit to regular customers who come in their own trucks or vehicles: transporters, fleet owners, bus and tractor owners, contractors' machines; and those transporters, who use the Transporter app. Each fill is for a truck on the transporter's list, the four fuels by the litre. Not for (say plainly): shops or other trades, walk-in buyers with no credit account, pumps that need GST tax invoices or forecourt stock and accounting from the same app (point to pump software), or anyone wanting someone else to carry the credit. A table: who / what they do in Khata Kavach / fits?",
  },
  {
    id: "trade-petrol-pump", pillar: "trades", path: `${P}/for/petrol-pump/`, hi: true, type: "Trade", wave: 1,
    queries: ["petrol pump credit management", "petrol pump ka hisab kitab", "पेट्रोल पंप पर उधार का हिसाब", "diesel udhar transporter", "petrol pump credit customer"],
    brief: "Giving diesel on credit to transporters: an owner's guide. Who should get credit, how big a limit (in rupees; link @credit-limit), the request-before-fill rule, what each fill record must show (vehicle, litres, rupees, who served, time, photo or slip), monthly billing, and when to stop. Note that petrol and diesel are outside GST (state VAT applies), so a pump's monthly credit bill is not a GST invoice question. Then how Khata Kavach runs it at a pump: transporter sends a request per truck, the counter sees the light, types litres and rupees from the dispenser, Done; both see it. Nothing about oil-company rules; no oil company names. Do not claim it replaces the pump's own accounts.",
  },
  {
    id: "trade-transporter", pillar: "trades", path: `${P}/for/transporters/`, hi: true, type: "Trade", wave: 1,
    queries: ["transport hisab app", "transport hisab kitab", "transporter diesel udhar hisab", "ट्रांसपोर्टर डीज़ल उधार हिसाब", "truck diesel expense tracking"],
    brief: "For transporters and fleet owners who buy diesel on credit: see exactly what your drivers take and what you owe. The transporter's view: the problem of finding out at month end; what to ask your pump to show you (each fill, truck, litres, rupees, who filled, a photo); sending a request per truck so nothing is filled without your say; taking a request back. Then the Khata Kavach Transporter app in a short section with real screen words (Send requests, Same as last time, Bills, Pay by UPI straight to the pump). Say that the pump adds you; you cannot sign up yourself.",
  },
  {
    id: "compare", pillar: "compare", path: `${P}/compare/`, hi: true, type: "Pillar", wave: 1,
    queries: ["best khata app", "khata app comparison", "khatabook alternative", "hisab kitab app", "हिसाब किताब रखने वाला ऐप"],
    brief: "How Khata Kavach compares with other ways of keeping credit, as an honest map by kind, not a ranking: paper khata and slip books; one-sided ledger apps (Khatabook, OkCredit); billing and accounting apps (Vyapar, myBillBook); petrol pump software with credit modules; fuel cards and fuel credit networks. A table: kind / who records / does the customer see each sale / who carries the credit / good for. Where Khata Kavach sits (two apps, customer asks first, the business carries its own credit, never lends). Say that the right choice depends on what you need, and link each comparison page. No 'best'. Facts about named apps only from the comparison research, dated.",
  },
  {
    id: "compare-khatabook-okcredit", pillar: "compare", path: `${P}/compare/khatabook-vs-okcredit/`, hi: true, type: "Comparison", wave: 1,
    queries: ["khatabook vs okcredit", "khatabook or okcredit which is better", "khatabook vs okcredit vs vyapar", "खाता बुक या ओके क्रेडिट"],
    brief: "Khatabook vs OkCredit: a side-by-side table from each company's own website and Play listing, checked on the page's date, and where Khata Kavach fits. Rows: who makes it, price as published, customer app or SMS, staff access, credit limits (say 'not stated on its pages' where so), bills and GST invoices, payments, loans offered to the business, languages, platforms, Play rating and downloads as displayed on the check date. Then: who each suits (in their favour where true: free tiers, many languages, GST bills, iPhone apps). Then one short section: if your customers collect by vehicle and you want them to ask first and see each sale, that is the job Khata Kavach does. Use only CONFIRMED facts from comp-ledger.verified.md; quote numbers as displayed with the date.",
  },
  {
    id: "compare-choose-app", pillar: "compare", path: `${P}/compare/how-to-choose-a-khata-app/`, hi: true, type: "Checklist", wave: 1,
    queries: ["udhar khata app", "उधार खाता ऐप", "udhar ka hisab rakhne wala app", "उधारी लिखने वाला ऐप", "best udhar khata app", "digital udhar khata", "bahi khata app"],
    brief: "Udhar khata app: how to choose one (udhar ka hisab rakhne wala app). Hindi H1 leads with 'उधार खाता ऐप'. How to choose a khata or credit app: 9 questions to ask before you install (does the customer see each entry, who can enter a sale, are there limits and who can override, does it work with no signal, can you add a photo, bills: plain or GST tax invoice, does the company lend or handle money, language, what it costs and what is free). A table of the questions with why each matters. Then a short 'what each kind of app is good for'. Never say which app is best; say how to decide. Mention Khata Kavach only in one short paragraph answering the questions for itself, honestly (including no GST invoice, price on call, browser apps today).",
  },
  {
    id: "features", pillar: "features", path: `${P}/features/`, hi: true, type: "Pillar", wave: 1,
    queries: ["khata kavach", "khata kavach app", "खाता कवच", "khata kavach features"],
    brief: "What Khata Kavach does, feature by feature, in plain words: the two apps (Pump, Transporter), requests per truck, the light at the nozzle and the limit, manager's PIN, photo with a fill, nothing edited, works with no signal at the pump, the owner's Today screen, numbered bills with a UPI QR, the Transporter app, Hindi first, the four fuels by the litre. One table: feature / what it means for the owner / what the transporter sees. What it does not do (no GST invoice, no tank stock, no lending, no automatic messages). Price: as the README allows. Android apps: as the README allows; both apps open in the phone's browser today.",
  },
  {
    id: "feature-requests", pillar: "features", path: `${P}/features/customer-requests/`, hi: true, type: "Feature", wave: 1,
    queries: ["customer request before credit", "credit request app", "advance order credit"],
    brief: "Transporter requests: the transporter asks before a truck fills. How it works with the real screen words (Send requests, Which trucks need fuel today?, How much to fill? in litres, rupees or Full tank, valid till today by default, Same as last time, Cancel this request). What the nozzle man sees (the trucks to fill today; no request means red 'No credit' by default, fill for cash). The owner's option to let a manager allow a fill without a request for chosen transporters. Why this takes stress off the owner: nothing is filled on credit that the transporter did not ask for, and the transporter cannot later say he never asked.",
  },
  {
    id: "examples", pillar: "examples", path: `${P}/examples/`, hi: true, type: "Pillar", wave: 1,
    queries: ["khata kavach example", "credit management example", "udhar hisab example"],
    brief: "Worked examples with made-up pumps: what they are (one made-up pump walked through a real situation with the real app screens and made-up figures) and what they are not (not customers, not results). Start with the example quote block. One paragraph per example page saying what it shows. Explain why there are no real case studies yet (the product is new; real ones will come only with the pump's written permission and its own figures).",
  },
  {
    id: "example-pump-month", pillar: "examples", path: `${P}/examples/a-month-of-diesel-credit/`, hi: true, type: "Example", wave: 1,
    queries: ["diesel credit example", "how credit works at petrol pump", "transporter monthly diesel bill"],
    brief: "Example: one month of diesel credit for one transporter at a made-up pump (Sharma Traders / Sharma Roadlines, plate UP00 SH 1005 and two more made-up trucks). Walk through: the owner sets a Rs 2,00,000 limit; requests per truck most mornings; a day with no request (red, sold for cash); one morning the limit is near (amber, manager's PIN, flagged); a typo warning on rupees; the month-end bill with 12 sales; a part payment against the bill; credit opens again. Use a table for the month's lines with made-up litres and rupees that add up exactly (diesel rate in the ₹85-95/L range, consistent). Every figure is illustrative and must add up. Start with the example quote block.",
  },

  // ── Wave 2 ────────────────────────────────────────────────────────────
  {
    id: "glossary", pillar: "hub", path: `${P}/guides/glossary/`, hi: true, type: "Glossary", wave: 2,
    queries: ["udhar meaning", "bahi khata kya hai", "jama kharch meaning", "outstanding meaning in hindi", "credit period meaning", "kacha bill pakka bill"],
    brief: "Glossary of credit and khata words a business owner meets, English and Hindi side by side: udhar (उधार), udhari, jama (जमा), baki/bakaya (बाकी, बकाया), khata, bahi khata, ledger, opening balance, credit limit, credit period, due date, outstanding, ageing, advance, part payment, statement, bill, kachcha bill, pakka bill, GST tax invoice, bill of supply, TDS, UTR, UPI QR, cheque bounce, legal notice, acknowledgment of debt, limitation period, MSME / Udyam, mediation, summary suit. One or two plain sentences each; a source tag where a law defines it.",
  },
  {
    id: "credit-who", pillar: "credit", path: `${P}/credit/who-to-give-credit/`, hi: true, type: "Checklist", wave: 2,
    queries: ["who to give credit", "udhar kisko dena chahiye", "new customer credit", "किसे उधार दें", "credit check customer"],
    brief: "Who to give credit to: checks before you say yes. A checklist: how long you have known them and how they paid cash; who owns the vehicles and who may collect; the person responsible and a phone number they answer; a GSTIN or PAN where they have one (to put on the bill); a start with a small limit or a few cash-and-carry weeks; references from other suppliers they buy from (ask them, never share lists of defaulters). What to write down when you agree (link @credit-policy). No 'credit score' or 'bureau'.",
  },
  {
    id: "credit-policy", pillar: "credit", path: `${P}/credit/credit-policy-template/`, hi: true, type: "Template", wave: 2,
    queries: ["credit policy for small business", "credit policy format", "उधार देने के नियम", "credit terms format", "उधार की शर्तें"],
    brief: "A one-page credit policy a pump can copy, in our own words: who gets credit and how (link @credit-who), how limits are set and raised, the credit period, who at the nozzle may allow what, what each credit fill must record, how and when bills go out, what happens when a payment is late (reminder dates, stop credit after N days), interest only if agreed in writing beforehand (link the law page), and how disputes are settled (photos, coupon numbers, the shared record). Present it as a fill-in template (with [blanks]) in a code-free list. Say it is a sample to adapt, not a legal document; for a binding agreement, ask an advocate.",
  },
  {
    id: "credit-khata", pillar: "credit", path: `${P}/credit/how-to-keep-a-khata/`, hi: true, type: "Explainer", wave: 2,
    queries: ["udhar khata kaise likhe", "उधार खाता कैसे लिखें", "udhar ka hisab kaise rakhe", "udhar khata format", "udhar khata excel sheet", "udhar khata kaise banaye"],
    brief: "How a pump keeps an udhar khata (udhar ka hisab) properly, paper or phone, with a format to copy (a table layout readers can draw in a register or set up in Excel; describe the columns): what every credit entry must show (date and time, transporter, truck number, fuel, litres, rupees, who filled, coupon number or photo), what every payment entry must show (amount, how paid, UTR or cheque number, date, against which bill), never overwrite (strike out and write a new line, with the reason), a running balance per transporter, a monthly statement. A table of one transporter's page with made-up lines (labelled example). Then how a shared book changes it: the transporter sees each line as it is made.",
  },
  {
    id: "credit-bills", pillar: "credit", path: `${P}/credit/kachcha-bill-pakka-bill/`, hi: true, type: "Explainer", wave: 2,
    queries: ["kacha bill pakka bill", "kachcha bill kya hota hai", "udhar bill format", "bill and invoice difference", "कच्चा बिल पक्का बिल", "bill of supply"],
    brief: "Kachcha bill, pakka bill and a GST tax invoice: what each is, and what a numbered credit bill is. A GST-registered seller of taxable goods must issue a tax invoice; an unregistered seller may not charge GST on a bill {{CGST Act 2017, s.32}}; a bill of supply for exempt or composition supplies (one line). Petrol and diesel are outside GST. What a good credit bill from a pump shows (number, period, each fill with its truck, totals in figures and words, how to pay). Khata Kavach's bill: a numbered PDF on the pump's letterhead with a UPI QR, a bill, not a GST tax invoice; for GST invoices on taxable items use your billing software. Law-page ending line required. CA check note in the brief only.",
  },
  {
    id: "counter-driver", pillar: "counter", path: `${P}/counter/driver-collects-on-credit/`, hi: true, type: "Explainer", wave: 2,
    queries: ["driver collects goods on credit", "driver diesel credit", "driver ne zyada diesel liya", "ड्राइवर उधार", "authorised person to collect goods"],
    brief: "When a driver fills a truck on the transporter's credit: the three-party problem (the transporter owes, the driver fills, the nozzle man serves). What the pump needs: the transporter's say-so for that truck that day, a litre or rupee cap, a record the transporter sees with the truck and a photo, and a rule for a truck not on the list. What the transporter needs: to know what each driver took the same day. How a request per truck solves the authorisation (Khata Kavach in one short section). No accusations against drivers as a group; say 'mistakes and misunderstandings', not theft.",
  },
  {
    id: "counter-disputes", pillar: "counter", path: `${P}/counter/disputed-credit-sale/`, hi: true, type: "Explainer", wave: 2,
    queries: ["customer disputes bill", "galat entry udhar", "dispute in credit sale", "हिसाब में झगड़ा", "customer says he did not take goods"],
    brief: "A disputed credit fill ('the truck took 150 L, not 200'): how to settle it calmly and how to prevent the next one. Steps: pull the record for that fill (date, time, truck, litres, rupees, who filled, photo or coupon number, the request it was made against); show it to the transporter; if the record is wrong, correct it openly (a new line, the old one struck out, with the reason); if right, explain and keep the line; never edit history. Prevention: request first, photo, coupon number, the transporter seeing each line on the day. Khata Kavach in one short section (struck-out line plus new line visible on both phones).",
  },
  {
    id: "counter-daily-check", pillar: "counter", path: `${P}/counter/owners-daily-credit-check/`, hi: true, type: "Checklist", wave: 2,
    queries: ["daily credit check", "udhar ka roz ka hisab", "how to monitor credit sales", "रोज़ उधार का हिसाब"],
    brief: "The owner's daily credit check, in five minutes: credit given today, money received, who is near or past the limit, any sale allowed past the limit or without a request (who allowed it, why), anything that looks wrong (quantity more than asked, odd rate, a sale entered late), and who to call today. A checklist table: what to look at / why / what to do. Then how the Khata Kavach Today screen shows these (real screen words: Credit given today, Due on bills, This month, Near or past the limit, Look at these).",
  },
  {
    id: "paid-ageing", pillar: "paid", path: `${P}/getting-paid/how-old-is-your-udhar/`, hi: true, type: "Explainer", wave: 2,
    queries: ["outstanding ageing", "ageing report meaning", "debtors ageing", "overdue payment days", "बकाया कितना पुराना"],
    brief: "How old is your udhar? Ageing in plain words: split each customer's balance by how long it has been owed (0-15, 16-30, 31-60, over 60 days), why old money matters more than total money, and what to do at each band (a table: band / risk / action). A made-up worked example of one customer's balance split into bands (amounts add up). Khata Kavach shows 'How old the balance is' on each customer's page in the same bands (one line).",
  },
  {
    id: "paid-stop-credit", pillar: "paid", path: `${P}/getting-paid/when-to-stop-credit/`, hi: true, type: "Checklist", wave: 2,
    queries: ["when to stop credit to customer", "udhar band kab kare", "stop credit customer", "उधार कब बंद करें"],
    brief: "When to stop giving credit to a customer, and how to do it without a fight: signs (payments slip past the agreed period, promises missed, balance always at the limit, cheques returned, buying less from you but owing more), a rule decided in advance (e.g. stop new credit at N days overdue), telling the customer politely and offering cash sales, putting the account on hold (Khata Kavach: freeze, vehicles show red; one line), and restarting after payment with a lower limit. Table: signal / what to do.",
  },
  {
    id: "compare-khatabook", pillar: "compare", path: `${P}/compare/khatabook/`, hi: true, type: "Comparison", wave: 2,
    queries: ["khatabook alternative", "khatabook vs", "khatabook review", "khatabook kaisa hai", "khatabook safe hai"],
    brief: "How Khatabook and Khata Kavach compare, checked on the page's date, from Khatabook's own website and store listings only. What Khatabook is (a digital khata for businesses, with bills, payments and loans as published). The table on the same rows as the other comparison pages. Where Khatabook is stronger (scale, free, iPhone and desktop apps, GST invoices, many languages). Where Khata Kavach works differently (the customer's own app and request per vehicle, the counter light and limit, photo per sale, never lends). Who should stay with Khatabook. Mark anything not found on its pages as 'not stated on its pages'. No 'alternative: why we win'.",
  },
  {
    id: "compare-okcredit", pillar: "compare", path: `${P}/compare/okcredit/`, hi: true, type: "Comparison", wave: 2,
    queries: ["okcredit alternative", "okcredit review", "okcredit kaisa hai", "okcredit vs", "okcredit free hai kya"],
    brief: "How OkCredit and Khata Kavach compare, checked on the page's date, from OkCredit's own website, pricing page and Play listing only (its published plan prices, free plan, SMS to customers, UPI collection, loans, 11 languages, offline). The same table rows. Where OkCredit is stronger. Where Khata Kavach works differently. Who should stay with OkCredit. Facts only from comp-ledger.verified.md CONFIRMED cells.",
  },
  {
    id: "compare-billing-apps", pillar: "compare", path: `${P}/compare/vyapar-and-mybillbook/`, hi: true, type: "Comparison", wave: 2,
    queries: ["vyapar vs khatabook", "mybillbook vs vyapar", "billing app or khata app", "vyapar credit limit", "billing software vs udhar app"],
    brief: "Vyapar and myBillBook vs Khata Kavach: billing and accounting software or a credit book? What the two billing apps are built for (GST invoices, e-invoice, e-way bills, stock, accounting; party credit limits on some plans, as published, with prices and plan names as published and dated). What Khata Kavach is built for (credit to regular customers who collect by vehicle, the customer's own app). Many businesses need both: GST invoices from billing software, the credit counter and shared record from Khata Kavach. Table on the same rows. No running down.",
  },
  {
    id: "compare-paper", pillar: "compare", path: `${P}/compare/paper-khata-vs-app/`, hi: true, type: "Comparison", wave: 2,
    queries: ["udhar register", "उधार रजिस्टर", "paper khata vs app", "digital khata benefits", "excel vs khata app"],
    brief: "Paper khata, a register or Excel vs a shared credit app: an honest table (cost, needs a phone or signal, who can see it, can it be lost, can it be changed without trace, how the customer knows, effort at month end). Paper's real strengths first (no phone, no signal, no training, everyone knows it). When to switch and when not to. How to move: the opening balance from the paper book (Khata Kavach's 'Balance from the paper book' field, one line). No running down of paper.",
  },
  {
    id: "feature-counter-light", pillar: "features", path: `${P}/features/counter-light-and-limit/`, hi: true, type: "Feature", wave: 2,
    queries: ["credit limit app", "credit limit check at counter", "manager approval credit app"],
    brief: "The counter light and the credit limit: green 'You can serve' with credit left and what to give; amber 'Call the manager' with the reason and the manager's PIN for one sale; red 'No credit' with the reason and 'You can serve for cash'. The reasons (no request today, limit used up, account frozen, vehicle not on the list, customer has not accepted the terms). The owner's per-customer setting for what happens at the limit (manager can allow, or cash only). Every override is marked on both sides and listed for the owner. Use the truth sheet's exact words.",
  },
  {
    id: "feature-photo", pillar: "features", path: `${P}/features/photo-with-every-sale/`, hi: true, type: "Feature", wave: 2,
    queries: ["photo proof credit sale", "vehicle photo diesel", "proof of delivery photo app"],
    brief: "A photo with a credit sale: optional, one per sale, of the number plate, the slip or the load; taken on the sale screen; the sale never waits for it (it follows when the phone is online); both the business and the customer see it with the line. What it helps with (a quick answer when a sale is questioned). Do not call it legal proof. The app asks for no location, contacts or microphone. Web apps have the photo button; say nothing about Android versions.",
  },
  {
    id: "feature-bills", pillar: "features", path: `${P}/features/numbered-bills-and-upi/`, hi: true, type: "Feature", wave: 2,
    queries: ["credit bill app", "bill with upi qr", "whatsapp bill pdf", "monthly bill for customers app"],
    brief: "Numbered bills with a UPI QR, sent from your own WhatsApp: make a bill from the unbilled sales of a period in a tap; a PDF on your letterhead (name, address, GSTIN and PAN if entered, logo), every sale, totals in figures and words, bank details and a UPI QR for exactly what is due; numbering with your prefix and a next number you can move; never reused. Send on WhatsApp, Send a reminder, Money received marks it paid and opens that much credit. The customer sees every bill and can pay by UPI straight to you. It is a bill, not a GST tax invoice.",
  },

  // ── Wave 3 ────────────────────────────────────────────────────────────
  {
    id: "paid-proof", pillar: "paid", path: `${P}/getting-paid/is-a-khata-entry-proof/`, hi: true, type: "Explainer", wave: 3,
    queries: ["khata entry proof", "udhar ka saboot", "khata book proof in court", "उधार का सबूत", "is khatabook entry valid in court"],
    brief: "Does a khata entry count as proof? What to keep and what to get signed. Books of account and electronic records can be evidence, but entries alone do not settle who owes what; an electronic record normally needs a certificate {{BSA 2023, s.63}}. What helps: a bill the customer received, a signed delivery or slip, the customer's written acknowledgment of the balance {{Limitation Act 1963, s.18}}, payments recorded with UTR or cheque numbers, photos. Never 'court-ready' or 'legally valid'. Say what is uncertain. Law-page ending line.",
  },
  {
    id: "paid-time-limit", pillar: "paid", path: `${P}/getting-paid/time-limit-to-recover-dues/`, hi: true, type: "Explainer", wave: 3,
    queries: ["time limit to recover money", "limitation period for recovery of money", "udhar kitne saal tak vasool", "पैसे वसूलने की समय सीमा", "3 years limitation goods sold"],
    brief: "The time limit to recover money for goods sold on credit in India: 3 years from delivery when no credit period was agreed {{Limitation Act 1963, Art. 14}}; 3 years from the end of an agreed credit period {{Limitation Act 1963, Art. 15}}; a written, signed acknowledgment before the period ends starts it again {{Limitation Act 1963, s.18}}; a part payment does too only with the payer's written acknowledgment of it {{Limitation Act 1963, s.19}}. A worked made-up timeline table. What is uncertain (running accounts; in-app confirmations). Practical point: do not let dues age; get written acknowledgments. Law-page ending line.",
  },
  {
    id: "paid-legal-steps", pillar: "paid", path: `${P}/getting-paid/legal-steps-for-unpaid-dues/`, hi: true, type: "Explainer", wave: 3,
    queries: ["legal notice for payment recovery", "legal action for unpaid dues", "udhar ke liye legal notice", "बकाया के लिए लीगल नोटिस", "summary suit recovery"],
    brief: "Unpaid dues: legal notice, mediation and a suit, in plain words. A written demand (usual practice; mandatory only in the cheque-bounce route); commercial disputes of Rs 3 lakh or more need mediation tried first {{Commercial Courts Act 2015, s.12A}}; a summary suit is a faster route where a written contract or bill supports a fixed sum {{CPC, Order XXXVII}}; interest is safest when agreed in writing, otherwise a court decides {{Interest Act 1978, s.3}}. A table: step / when / what it needs. What we do not cover (court fees, timelines, small-causes limits). Never promise outcomes. Law-page ending line.",
  },
  {
    id: "paid-cheque-bounce", pillar: "paid", path: `${P}/getting-paid/cheque-bounce/`, hi: true, type: "Explainer", wave: 3,
    queries: ["cheque bounce kya kare", "cheque bounce notice time limit", "section 138 cheque bounce", "चेक बाउंस होने पर क्या करें", "cheque bounce process"],
    brief: "A cheque from a credit customer bounced: the steps and time limits {{NI Act 1881, s.138}} {{NI Act 1881, s.142}}: presented within validity (3 months in practice); written demand within 30 days of the bank's return memo; the drawer has 15 days to pay; complaint within 1 month after that; penalty up to 2 years or a fine up to twice the amount or both. A timeline table with made-up dates. What may fall outside (security cheques, disputed or time-barred debts). Record the bounced cheque and keep credit stopped. Law-page ending line.",
  },
  {
    id: "paid-msme", pillar: "paid", path: `${P}/getting-paid/msme-45-day-rule/`, hi: true, type: "Explainer", wave: 3,
    queries: ["msme 45 days payment rule", "msme payment 45 days", "msme samadhaan", "43b(h) msme", "एमएसएमई 45 दिन नियम"],
    brief: "The MSME 45-day payment rule: who it protects and who it may not. Written for micro and small suppliers with Udyam registration: payment by the agreed date, at most 45 days, or 15 days with no agreement {{MSMED Act 2006, s.15}}; after that compound interest at three times the RBI bank rate {{MSMED Act 2006, s.16}}; claims through the MSME ODR portal; buyers' tax deduction waits until payment {{Income-tax Act, s.43B(h)}}. Say plainly that whether a trader (a fuel station, a dealer) qualifies is doubtful and to ask a lawyer; that the 2026 amendment may change procedures; that this rule most helps transporters and contractors who supply services to bigger firms. Law-page ending line.",
  },
  {
    id: "paid-gst", pillar: "paid", path: `${P}/getting-paid/gst-when-customer-has-not-paid/`, hi: true, type: "Explainer", wave: 3,
    queries: ["gst on unpaid invoice", "gst paid but customer not paid", "180 days itc reversal", "udhar par gst", "पेमेंट नहीं मिला तो GST"],
    brief: "GST when a credit customer has not paid: the seller owes GST for the invoice's period even if unpaid {{CGST Act 2017, s.12}}; a buyer who has not paid within 180 days of the invoice must reverse the input tax credit and can re-claim it once paid {{CGST Act 2017, s.16(2)}} (a useful nudge to mention to a GST-registered buyer, politely); petrol and diesel are outside GST. Say nothing about relief for bad debts. Point to a chartered accountant. Law-page ending line.",
  },
  {
    id: "compare-ledger-vs-shared", pillar: "compare", path: `${P}/compare/ledger-app-vs-shared-credit-book/`, hi: true, type: "Comparison", wave: 3,
    queries: ["bahi khata app kya hota hai", "digital khata kya hai", "shared ledger app", "udhar app kaise kaam karta hai"],
    brief: "A ledger app or a shared credit book: what is the difference? A ledger app is the pump's own book (the transporter may get an SMS or a link); a shared credit book has two apps, the transporter asks first and both see each line as it is made. A short table. Which suits whom (a shop with walk-in families vs a pump whose transporters send trucks). Neutral, no names needed beyond one example of each kind.",
  },
  {
    id: "compare-pump-software", pillar: "compare", path: `${P}/compare/petrol-pump-software/`, hi: true, type: "Comparison", wave: 3,
    queries: ["petrol pump software", "petrol pump credit management software", "garruda", "petrosoft", "पेट्रोल पंप सॉफ्टवेयर"],
    brief: "Petrol pump software with credit modules (GARRUDA, Petrosoft by YoungMinds, Petro Genius) or a credit book: when you need full forecourt software and when you only need credit control. What each says it does, from its own pages and store listings, dated (several have customer apps; GARRUDA uses a QR per vehicle and an OTP to the driver). Where they are stronger (nozzle, shift, tank and stock, Tally, accounting). Where Khata Kavach is different (only credit, Hindi first, works with no signal at the pump, not tied to forecourt systems). Use only CONFIRMED cells from comp-fuel.verified.md. No 'only' or 'first' claims.",
  },
  {
    id: "compare-fuel-credit", pillar: "compare", path: `${P}/compare/fuel-cards-and-credit-networks/`, hi: true, type: "Comparison", wave: 3,
    queries: ["fuel card vs credit", "diesel credit for transporters", "fleet card", "fuel credit network", "डीज़ल उधार ट्रांसपोर्टर"],
    brief: "Your own credit, an oil company fleet card, or a fuel credit network: who carries the risk? Fleet cards (prepaid by default, credit only through partner banks or finance companies, one oil company's pumps), networks where a platform says it carries the credit, and the pump's own credit to a transporter it knows (Khata Kavach: the business sets the limit, never lends, never holds money). A table: who carries the credit / works at which pumps / customer app / cost published. Name the programmes in plain text only, facts from comp-fuel.verified.md CONFIRMED cells, no logos, and the line 'not connected with any oil company'.",
  },
  {
    id: "feature-no-signal", pillar: "features", path: `${P}/features/works-with-no-signal/`, hi: true, type: "Feature", wave: 3,
    queries: ["offline khata app", "app works without internet", "no network counter app"],
    brief: "Works with no signal at the counter: once opened with internet, the counter can find a vehicle, see the light, record a sale with its photo and allow a sale with a manager's PIN without signal; the sale is saved on the phone and sent when the phone is online; the screen says so ('Saved on the phone. Goes when internet returns.'). What needs internet (owner screens, the customer's app sending requests, the first open on a new phone). If the counter phone is out of touch for 24 hours every vehicle needs a manager's PIN. Never say the whole app works offline.",
  },
  {
    id: "feature-corrections", pillar: "features", path: `${P}/features/nothing-is-edited/`, hi: true, type: "Feature", wave: 3,
    queries: ["edit entry khata app", "wrong entry correction", "galat entry kaise sudhare"],
    brief: "Nothing is edited: how corrections work. Staff can fix their own sale within 2 minutes ('Wrong, fix it'); after that an owner or manager corrects it with a reason; the old line stays struck out and a new line is added; the customer sees both. A sale on a bill is locked until that bill is cancelled. Why this takes stress off both sides: no one can quietly change what the other already saw. Use the real screen words.",
  },
  {
    id: "feature-today", pillar: "features", path: `${P}/features/owners-today-screen/`, hi: true, type: "Feature", wave: 3,
    queries: ["credit dashboard app", "udhar report app", "daily credit report"],
    brief: "The owner's Today screen: Credit given today, Due on bills (with past-due count), This month (credit given, money received, owed before, total owed), Near or past the limit with 'Ask for payment on WhatsApp', All customers, and Look at these (sales flagged in the last 7 days). One customer's page: owed against limit, how old the balance is, bills, record a payment. Use the screenshots' made-up figures only as described examples. Link @counter-daily-check.",
  },
  {
    id: "feature-customer-app", pillar: "features", path: `${P}/features/customer-app/`, hi: true, type: "Feature", wave: 3,
    queries: ["customer app credit", "transporter app diesel", "supplier khata app"],
    brief: "What the transporter sees in Khata Kavach Transporter: each pump's credit left and what he owes, every fill with truck, fuel, litres, rupees, who filled and the photo, the account lines (fills, payments, corrections), bills with Pay by UPI straight to the pump, requests (send, Same as last time, cancel), trucks, Hindi and English and a large-text switch. The transporter is added by the pump and agrees to the terms once. It never lends and never holds money.",
  },
  {
    id: "example-dispute", pillar: "examples", path: `${P}/examples/a-disputed-sale/`, hi: true, type: "Example", wave: 3,
    queries: ["credit dispute example", "galat entry example"],
    brief: "Example: a disputed fill from the nozzle to the transporter's phone. A made-up transporter says his truck took only 150 L, not 200 L. The record: request for 200 L, fill by a named made-up nozzle man at a time, photo of the dispenser or slip, 'More than requested' not flagged. It turns out the nozzle man typed 200 for a 150 L fill: the manager corrects it with a reason; the old line stays struck out on both phones; the bill was not yet made. Second variant in two lines: if the record was right, the owner shows it and keeps it. Start with the example quote block.",
  },
  {
    id: "example-bill-payment", pillar: "examples", path: `${P}/examples/a-bill-and-a-part-payment/`, hi: true, type: "Example", wave: 3,
    queries: ["part payment example", "bill payment udhar example"],
    brief: "Example: a month-end bill and a part payment. A made-up business makes Bill 7 for a customer (made-up period and sales), sends it on WhatsApp; the customer pays part by UPI; the business records Money received against Bill 7: it shows Part paid with the rest due and that much credit opens again. Then the variant where money is recorded without choosing a bill (it clears the oldest unpaid line first). Figures must add up exactly. Start with the example quote block.",
  },
  // ── Added 26 Oct 2026 outside the daily schedule (kk-guide/schedule.ts KK_EARLY_26_OCT),
  //    from Search Console and Google suggestions.
  {
    id: "tool-late-interest", pillar: "paid", path: `${P}/getting-paid/late-payment-interest-calculator/`, hi: true, type: "Tool", wave: 3,
    queries: ["customer late payment interest calculator", "interest on late payment calculator", "udhar par byaj kaise nikale", "interest on delayed payment calculator", "interest on late payment invoice"],
    brief: "Calculator: amount due, the date it was due (or days late), and a yearly rate the owner chooses (the tool ships NO rate as a rule); simple interest = amount x rate x days / 365, with an option for monthly compounding. Shows the working. Two lines: you can charge interest only if the customer agreed to it in advance (bill/terms), and MSME suppliers have their own rule (link msme-45-day-rule; never compute the MSME rate here). 'Not legal advice' line. Also shows what the late money costs YOU at your own borrowing rate.",
  },
  {
    id: "tool-debtor-days", pillar: "paid", path: `${P}/getting-paid/debtor-days-calculator/`, hi: true, type: "Tool", wave: 3,
    queries: ["debtors days formula", "debtor days kitna hona chahiye", "debtor days kya hota hai", "average debtors days calculation", "debtors days meaning in hindi"],
    brief: "Calculator: total udhar outstanding today and credit sales over the last 30/90/365 days -> debtor days = outstanding / credit sales x days. Show the working and compare with the credit days the owner gives (e.g. 15): if debtor days is well above, customers pay late on average. Plain meaning first. Link how-old-is-your-udhar and when-to-stop-credit. No benchmark claims for an industry.",
  },
  {
    id: "tool-reminder-maker", pillar: "paid", path: `${P}/getting-paid/payment-reminder-maker/`, hi: true, type: "Tool", wave: 3,
    queries: ["payment reminder message in hindi", "payment reminder message on whatsapp", "payment reminder message example", "payment reminder short message", "baki paisa message"],
    brief: "A message maker: customer name, amount, since when / bill numbers, your business name, tone (polite first reminder / firm second / final before stopping credit), language (Hindi, English, Hinglish). Out: a ready message with a Copy button and a 'Open WhatsApp' link (wa.me with the text, no phone number needed). Everything stays in the browser. Never threatening, never mentions police/court in early tones; the final tone may say credit is paused. Link the payment-reminder-messages template page.",
  },
  {
    id: "tool-udhar-poster", pillar: "credit", path: `${P}/credit/udhar-band-hai-poster/`, hi: true, type: "Tool", wave: 3,
    queries: ["udhar band hai poster", "udhari mana hai poster", "udhar mana hai poster", "aaj nagad kal udhar poster", "udhari band poster", "udhari slogan in hindi"],
    brief: "Download page: 4-6 printable A4 posters (PDF) for the counter, in Hindi and English, our own wording (e.g. 'Aaj nakad, kal udhar', 'Udhar band hai', polite versions like 'Udhar sirf likhit seema tak' and 'Har udhar ki parchi milegi'), clean design, no clip-art copied from anywhere, no third-party brands. Files in public/kk/downloads/, made by a script in scripts/ (playwright + local Chrome like scripts/kk-khata-page.mjs). Plus 8-10 polite one-line slogans as text to copy. Footer line on the poster: none, or a tiny 'mdgservices.in' only.",
  },
  {
    id: "tool-statement", pillar: "paid", path: `${P}/getting-paid/customer-statement-format/`, hi: true, type: "Tool", wave: 3,
    queries: ["customer ledger statement format", "statement of account format", "udhar statement format", "outstanding statement format excel", "party ledger format"],
    brief: "Download page: a monthly statement of account to send a credit customer (opening balance, each sale and payment with date/bill no./vehicle, closing balance, 'please confirm or tell us within 7 days', signature) as an A4 PDF to print and an Excel sheet that works out the running balance (Excel-2007 functions only, like scripts/kk-khata-template.py). English and Hindi headings. Made by a script in scripts/. Link the udhar khata format and disputed-sale pages.",
  },
  {
    id: "paid-outstanding-letter", pillar: "paid", path: `${P}/getting-paid/outstanding-payment-letter/`, hi: true, type: "Template", wave: 3,
    queries: ["outstanding payment letter format", "outstanding payment letter format in word", "payment reminder letter format", "baki bhugtan patra", "outstanding payment mail to customer"],
    brief: "Three short letter formats in our own words, Hindi and English, to copy: (1) a polite statement-and-request, (2) a firm reminder with a date, (3) a final notice that credit is stopped until paid. Placeholders in [brackets]. Before the letters: what to attach (statement, bills). After: if still unpaid, link legal-steps-for-unpaid-dues and cheque-bounce. Not legal notice drafting; say a legal notice should come from an advocate. 'Not legal advice' line.",
  },
  {
    id: "credit-agreement", pillar: "credit", path: `${P}/credit/udhar-agreement-format/`, hi: true, type: "Template", wave: 3,
    queries: ["udhari agreement", "credit agreement format for customer", "customer credit form format", "udhar agreement format in hindi", "credit terms format"],
    brief: "A one-page customer credit form in our own words, Hindi and English, for the owner and customer to sign before credit starts: customer details, who may collect (names/vehicles), credit limit in rupees, credit days, how bills and statements are shared, what happens when the limit is crossed or payment is late (credit pauses; interest only if written here and agreed), signatures. Explain each line in one sentence. 'General information, not legal advice; for a binding contract speak to an advocate.' Link credit-policy-template.",
  },
  {
    id: "paid-outstanding-overdue", pillar: "paid", path: `${P}/getting-paid/outstanding-vs-overdue/`, hi: true, type: "Explainer", wave: 3,
    queries: ["outstanding payment meaning in hindi", "overdue payment kya hota hai", "outstanding and overdue difference", "outstanding amount kya hota hai", "baki paisa ko kya kahate hain"],
    brief: "Two words explained with one worked example: outstanding = everything the customer still owes; overdue = the part past its credit days. Example with real-looking made-up figures (Rs 80,000 outstanding, Rs 30,000 of it overdue at 15 days). Why the owner should watch overdue, not just outstanding. Link how-old-is-your-udhar and the debtor days tool. Short.",
  },
  {
    id: "credit-deposit-pdc", pillar: "credit", path: `${P}/credit/security-deposit-and-cheque/`, hi: true, type: "Explainer", wave: 3,
    queries: ["security cheque for credit customer", "post dated cheque for credit", "security deposit from customer for credit", "advance cheque udhar", "pdc meaning"],
    brief: "Taking a security deposit or a post-dated/security cheque before giving credit: what each is, pros and cons in a table, what to write down (receipt for deposit, cheque details), and the caution that a cheque taken 'as security' may not always be treated like a cheque for a debt (say: rules on security cheques under the cheque bounce law are for an advocate to advise; link cheque-bounce). No legal promises. 'Not legal advice' line.",
  },
  {
    id: "paid-bad-debt", pillar: "paid", path: `${P}/getting-paid/bad-debt-write-off/`, hi: true, type: "Explainer", wave: 3,
    queries: ["bad debt write off", "bad debt meaning in hindi", "when to write off bad debt", "doobat karz", "udhar dub gaya kya kare"],
    brief: "When udhar is unlikely to come back: the signs, the steps before giving up (statement, reminders, stop credit, settlement offer in writing, legal steps link), and writing it off in your books. Tax/GST treatment: one line only, 'ask your CA' (no tax rules stated). How to stop the next one (limits, credit days). Link time-limit-to-recover-dues and legal-steps pages.",
  },
  {
    id: "paid-kal-dunga", pillar: "paid", path: `${P}/getting-paid/customer-keeps-saying-kal-dunga/`, hi: true, type: "Explainer", wave: 3,
    queries: ["customer payment nahi de raha kya kare", "udhar wala paisa nahi de raha", "customer keeps delaying payment", "udhari ka paisa kaise nikale", "baki paisa kaise milega"],
    brief: "A practical page for the customer who keeps promising 'kal dunga': fix a date in writing (message), take part payments, stop new credit after the second missed date, send the statement, then the firm letter. A small table: promise missed 1st/2nd/3rd time -> what to do. Tone: calm, no threats. Link reminder maker, outstanding letter, when-to-stop-credit. Mention once that a shared credit book (Khata Kavach) shows the customer each sale and the balance as it happens; no other sales talk.",
  },
  {
    id: "credit-say-no", pillar: "credit", path: `${P}/credit/how-to-refuse-udhar/`, hi: true, type: "Explainer", wave: 3,
    queries: ["udhar mana hai slogan", "udhar kaise mana kare", "udhar band karne ka tarika", "udhari par slogan", "how to say no to credit customer"],
    brief: "How to refuse or limit udhar without losing the customer: lines staff can say (Hindi and English) for a new customer, for someone over the limit, for a friend/relative; when to say 'yes, up to this much'. Link the poster tool, who-to-give-credit, credit-limit pages. Polite, practical.",
  },
  {
    id: "paid-interest", pillar: "paid", path: `${P}/getting-paid/interest-on-udhar/`, hi: true, type: "Explainer", wave: 3,
    queries: ["can i charge interest on late payment", "udhar par byaj le sakte hain", "interest on late payment meaning", "interest on delayed payment msme", "how much interest can i charge on late payment"],
    brief: "Can a pump charge interest on late udhar? Plain answer: only if the transporter agreed in advance (on the bill, terms or credit form); write the rate and from which day. MSME suppliers have a separate statutory right (link msme-45-day-rule; do not restate figures not on that page). Practical view: interest is often hard to collect; credit days and limits work better. Link the interest calculator and udhar agreement format. 'General information, not legal advice.'",
  },
];

export const kkById = new Map(KK_PAGES.map((p) => [p.id, p]));
