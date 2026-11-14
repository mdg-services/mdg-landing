/**
 * Every page of the Petrol pump guide (mdgservices.in/petrol-pump/, Hindi at
 * /hi/petrol-pump/): plain-language pages on getting, licensing and running a
 * petrol pump in India, for people who want to open a pump and for dealers who
 * run one. Separate from the MDG guides (guide/, which explain one document, MDG
 * 2024) and from the Khata Kavach pages (kk-guide/); the same machine renders
 * them (src/guides/). The single source of truth: the page builder, the release
 * schedule (pump-guide/schedule.ts), the sitemap and proxy.ts all read it.
 *
 * A page's words live in pump-guide/content/<lang>/<id>.md. Every page has a
 * Hindi twin at "/hi" + path. Writers' rules, sources and the dating rule:
 * pump-guide/README.md.
 *
 * `brief` is the writer's scope: what the page must cover and which sources to
 * open. It never reaches the site. `queries` are real searches (Google
 * suggestions in India, English and Hindi, Nov 2026) the page should answer in
 * the words people type.
 */
import type { PageType, PillarMeta } from "../guide/inventory.js";

export type PumpPillar = "hub" | "dealership" | "money" | "licences" | "site" | "safety" | "equipment" | "running" | "fuels" | "customers";

export interface PumpPage {
  id: string;
  pillar: PumpPillar;
  /** English path, with trailing slash. The Hindi twin lives at "/hi" + path. */
  path: string;
  hi: boolean;
  type: PageType;
  wave: 1 | 2 | 3;
  queries: string[];
  brief: string;
}

export const PUMP_PILLARS: Record<PumpPillar, PillarMeta> = {
  hub: { en: "Guides", hi: "गाइड", main: "hub" },
  dealership: { en: "Getting a dealership", hi: "डीलरशिप कैसे मिलती है", main: "dealership" },
  money: { en: "Cost and earnings", hi: "खर्च और कमाई", main: "money" },
  licences: { en: "Licences and permissions", hi: "लाइसेंस और मंज़ूरी", main: "licences" },
  site: { en: "Land and site", hi: "ज़मीन और जगह", main: "site" },
  safety: { en: "Fire and safety", hi: "आग और सुरक्षा", main: "safety" },
  equipment: { en: "Equipment and measurement", hi: "उपकरण और माप", main: "equipment" },
  running: { en: "Staff and daily running", hi: "स्टाफ और रोज़ का काम", main: "running" },
  fuels: { en: "Fuels at the pump", hi: "पंप पर मिलने वाले ईंधन", main: "fuels" },
  customers: { en: "Customers and complaints", hi: "ग्राहक और शिकायतें", main: "customers" },
};

const P = "/petrol-pump";

export const PUMP_PAGES: PumpPage[] = [
  {
    id: "hub", pillar: "hub", path: `${P}/`, hi: true, type: "Hub", wave: 1,
    queries: ["how petrol pump works", "petrol pump rules", "पेट्रोल पंप"],
    brief: "The front door of the Petrol pump guide: who a petrol pump is run by, and the nine areas this guide covers (getting a dealership, cost and earnings, licences and permissions, land, fire safety, equipment and measurement, staff and daily running, fuels, customers' complaints), each with one line saying what a reader finds there and the question it answers. Plain words for someone who has never run a pump and for a dealer who has. Say once that this guide is separate from the MDG 2024 guide (link /guides/ by hand is allowed here for that one link) and that every fact names its source. No figures that need a source.",
  },
  {
    id: "disclaimer", pillar: "hub", path: `${P}/disclaimer/`, hi: true, type: "Legal", wave: 1,
    queries: [],
    brief: "Who writes these pages and how. The template prints the full disclaimer under it: write two short sections (who we are; how we check facts and what to do if something is out of date). Say plainly that MDG Services does not sell, allot or arrange petrol pump dealerships or licences, that dealerships are given only by the oil companies through their own advertisements, and that anyone asking money for one is not the oil company.",
  },
  {
    id: "dealership", pillar: "dealership", path: `${P}/dealership/`, hi: true, type: "Pillar", wave: 1,
    queries: ["petrol pump how to open", "petrol pump how to apply", "how to get petrol pump", "petrol pump apply online", "petrol pump dealer apply", "petrol pump how to start", "पेट्रोल पंप कैसे खोलें", "पेट्रोल पम्प कैसे खोले", "petrol pump apply 2026", "petrol pump dealer chayan"],
    brief: "How to open a petrol pump in India, start to finish, for a reader who owns or can lease land and wants to know the real route. The route is the oil companies' dealership advertisements and selection (never an application to a middleman); the main steps in order (advertisement, application, selection by draw of lots or bidding, verification, letter of intent, approvals and licences, building, commissioning); what the reader decides before applying (land, money, time). Link the eligibility, process, money, licences and site pages. Warn about dealership fraud in one short note. Sources to open that day: the oil companies' RO dealership selection guidelines (the 2018 guidelines, and the 2023 version if it exists: find which one is in force) as published by Hindustan Petroleum and Bharat Petroleum on their own sites or in Parliament answers (eparlib.sansad.in, rsdebate.nic.in), and petroleum.nic.in. Never link iocl.com.",
  },
  {
    id: "dealership-eligibility", pillar: "dealership", path: `${P}/dealership/who-can-apply/`, hi: true, type: "Explainer", wave: 1,
    queries: ["petrol pump licence age limit", "documents required for petrol pump", "petrol pump business requirements", "petrol pump licence criteria", "petrol pump land criteria", "petrol pump dealer apply"],
    brief: "Who can apply for a retail outlet dealership: the eligibility the selection guidelines set for an individual (citizenship, age, education, other conditions) and for a firm or company, what counts as the land and money requirement, the reserved categories and how they work, and what disqualifies an applicant. Every condition with the guideline and year it comes from; use a table; say which guideline year is in force on the checked date and what changed from the one before. Sources to open that day: the oil companies' RO dealership selection guidelines (the 2018 guidelines, and the 2023 version if it exists: find which one is in force) as published by Hindustan Petroleum and Bharat Petroleum on their own sites or in Parliament answers (eparlib.sansad.in, rsdebate.nic.in), and petroleum.nic.in. Never link iocl.com.",
  },
  {
    id: "dealership-process", pillar: "dealership", path: `${P}/dealership/selection-process/`, hi: true, type: "Explainer", wave: 1,
    queries: ["petrol pump dealer chayan", "petrol pump dealership chayan", "petrol pump dealer chayan 2018", "petrol pump dealer chayan portal", "petrol pump apply online", "petrol pump licence process", "petrol pump dealer chayan 2026", "petrol pump dealer chayan 2026 registration"],
    brief: "How an oil company picks a dealer: the stages from the advertisement to the letter of intent in order, who does what at each stage (applicant, company, committee), how applicants are chosen when many qualify (draw of lots or bidding, and the marks or criteria if any), the documents asked at each stage, the fees that are officially charged and the fact that no payment goes to an agent. A numbered sequence. If the stages differ between companies, show a small table, not a guess. Sources to open that day: the oil companies' RO dealership selection guidelines (the 2018 guidelines, and the 2023 version if it exists: find which one is in force) as published by Hindustan Petroleum and Bharat Petroleum on their own sites or in Parliament answers (eparlib.sansad.in, rsdebate.nic.in), and petroleum.nic.in. Never link iocl.com.",
  },
  {
    id: "money", pillar: "money", path: `${P}/money/`, hi: true, type: "Pillar", wave: 1,
    queries: ["petrol pump cost", "petrol pump investment", "petrol pump total cost", "petrol pump cost to open", "petrol pump cost with land", "petrol pump setup cost without land", "petrol pump business profit", "petrol pump cost and profit", "petrol pump franchise cost"],
    brief: "What it costs to start a petrol pump: the money the oil company's advertisement asks the applicant to show, what the dealer pays for (land or lease, building and canopy, tanks and dispensers where the dealer bears them, licences, working capital, stock and security deposit), and what the oil company bears. Every figure must come from an oil company advertisement or guideline or a Parliament answer and carry its date; where costs vary by place or kind of outlet, say the range only if a source gives it, otherwise say it varies and what it depends on. Never a made-up total. Link the commission page. Sources: oil company dealership pages other than iocl.com, Parliament answers, petroleum.nic.in.",
  },
  {
    id: "money-commission", pillar: "money", path: `${P}/money/dealer-commission/`, hi: true, type: "Explainer", wave: 1,
    queries: ["petrol pump commission", "petrol pump income", "petrol pump profit", "dealer margin on petrol", "petrol pump owner profit", "is petrol pump profitable", "petrol pump profit margin", "petrol pump income per day", "petrol pump commission rate", "how much commission does petrol pump owner earn in india", "petrol pump mein profit kitna hota hai", "पेट्रोल पंप में कमाई कैसे होती है"],
    brief: "How a petrol pump dealer earns: the dealer commission (margin) is a fixed amount per kilolitre (or per litre) that the oil company pays on the petrol and diesel the dealer sells; who sets it and when it is revised; the latest revision with its date from a public primary source (Parliament answer, ministry or oil company statement), and what the commission has to cover (staff, power, losses, interest). Explain with one worked example using a made-up volume and the sourced rate. Say what the commission is not: not the sale price, not the profit. If no primary source for the latest figure can be found, give no figure and explain the mechanism and where the reader can see the current one. No income promises.",
  },
  {
    id: "licences", pillar: "licences", path: `${P}/licences/`, hi: true, type: "Pillar", wave: 1,
    queries: ["petrol pump noc", "petrol pump licence", "petrol pump noc list", "list of noc required for petrol pump in india pdf", "licenses required for petrol pump", "petrol pump licence cost", "पेट्रोल पंप लाइसेंस", "petrol pump licence kaise le", "petrol pump noc rules", "petrol pump noc cost"],
    brief: "The licences, approvals and NOCs a petrol pump needs, in the order a dealer meets them: the oil company's allotment, the District Authority's NOC, PESO licence in Form XIV under the Petroleum Rules 2002, fire NOC, pollution consent from the State Pollution Control Board, Legal Metrology verification of dispensers, GST registration and local registrations. A table: approval, who gives it, what it is for, and a link to the page that explains it where we have one. Say which ones are central and which are state or district matters that differ by place. Every approval with its legal basis in a source tag; no fees unless a primary source gives them with a date. Sources: peso.gov.in, indiacode.nic.in, cpcb.nic.in, Parliament answers.",
  },
  {
    id: "licences-peso", pillar: "licences", path: `${P}/licences/peso-licence/`, hi: true, type: "Explainer", wave: 1,
    queries: ["peso petrol pump", "petrol pump peso license", "peso rules for petrol pump", "petrol pump peso license download"],
    brief: "The PESO licence for a petrol pump (Form XIV, Petroleum Rules 2002): what PESO is, what the licence allows, the order of steps (the oil company's approval and District Authority NOC, layout drawing approval, construction, inspection, grant), the documents, who applies (the dealer, with the oil company's help), what the safety distances are called and where the figures are (the licence conditions, never invent them), validity and renewal as the rules say, and what to do when a layout changes. Quote the rule numbers. Sources: PESO's own Petroleum Rules 2002 SOP and licence pages on peso.gov.in, the rules on indiacode.nic.in.",
  },
  {
    id: "licences-pollution", pillar: "licences", path: `${P}/licences/pollution-consent/`, hi: true, type: "Explainer", wave: 1,
    queries: ["petrol pump pollution", "petrol pump pollution category", "petrol pump pollution certificate", "petrol pump pollution check", "petrol pump pollution challan"],
    brief: "Pollution consent for a petrol pump: which law asks for it (Water Act 1974, Air Act 1981), that it is the State Pollution Control Board that gives it, what CPCB's categorisation says about petrol pumps (which category, with the list and date), the two consents (to establish and to operate), what the board looks at (waste water, oil-water separator, vapour, used oil), validity and renewal as the board says. Do not state the category from memory: open the current CPCB categorisation document and quote it. If states differ, say so. Sources: cpcb.nic.in, indiacode.nic.in.",
  },
  {
    id: "site", pillar: "site", path: `${P}/site/`, hi: true, type: "Pillar", wave: 1,
    queries: ["petrol pump land size", "petrol pump land lease", "petrol pump land rules", "petrol pump land criteria", "petrol pump land required", "petrol pump land lease rent", "petrol bunk land requirement", "petrol pump land requirement in square feet", "land dimensions required for petrol pump", "petrol pump land requirement in city"],
    brief: "The land a petrol pump needs: the minimum plot size or frontage and depth the oil companies ask for by kind of location (national highway, state highway, city, rural), owned land versus leased land and what a lease must say, access and road rules, the distance rules from junctions, schools and the like that apply (central rules and state rules differ: say which is which), and what makes a plot get rejected. Use the figures only from the selection guidelines or oil company advertisements with year; a table of location type and requirement. Warn against paying anyone to 'book' land. Sources: the dealership guidelines (see the dealership page's list), the Petroleum Rules 2002 via peso.gov.in, Ministry of Road Transport guidance on access to national highways if it is on an official site.",
  },
  {
    id: "safety", pillar: "safety", path: `${P}/safety/`, hi: true, type: "Pillar", wave: 1,
    queries: ["petrol pump safety rules", "petrol pump fire safety", "petrol pump fire noc", "petrol pump fire stand", "petrol pump fire bucket", "petrol bunk safety rules", "petrol pump safety", "petrol pump safety signs", "petrol pump safety rules in india", "gas station safety checklist pdf"],
    brief: "Fire safety at a petrol pump: what the licence conditions and standards require around the dispensers, tanks and unloading point (fire extinguishers by type, sand buckets, earthing and bonding of tankers, no-smoking and no-mobile signage, safe zones, emergency shut-off, staff training, mock drills), the fire NOC and who issues it, and what a dealer should check every day. Use a checklist table with the source of each item (PESO licence conditions, Petroleum Rules 2002, OISD standards on oisd.gov.in, National Building Code if cited by the authority). Do not invent quantities; if a standard gives a number, quote it with the standard's number. Link the MDG guide page on first aid and fire extinguisher for unloading by hand (/guides/) only if it is live.",
  },
  {
    id: "equipment", pillar: "equipment", path: `${P}/equipment/`, hi: true, type: "Pillar", wave: 1,
    queries: ["how petrol pump works", "petrol pump dispenser", "petrol pump machine", "how petrol bunk works", "petrol pump nozzle sizes", "petrol pump nozzle color code", "petrol pump machine cost", "petrol pump how it works", "how does a gas pump measure fuel", "gas pump nozzle how it works"],
    brief: "What a petrol pump is made of and how fuel gets from the tanker to the vehicle: underground tanks, the fill point and vent pipes, the pump and dispenser (the meter, the hose, the nozzle and its automatic cut-off), the nozzle colour or size differences between petrol and diesel only if a standard says so, the automation and tank gauge if the outlet has them, and where each part is checked by someone (oil company, PESO, Legal Metrology). A labelled step-by-step of one fill. Plain words, no brand names. Link the pages on tanks, measurement and vapour recovery. Sources: Legal Metrology and PESO pages, OISD standards, oil company technical pages other than iocl.com.",
  },
  {
    id: "equipment-metrology", pillar: "equipment", path: `${P}/equipment/legal-metrology-verification/`, hi: true, type: "Explainer", wave: 1,
    queries: ["legal metrology petrol pump", "how to measure petrol in petrol pump", "how is measurement done at the petrol pump"],
    brief: "How a petrol pump's dispensers are checked for accuracy under the Legal Metrology Act 2009: who verifies and stamps (the State Legal Metrology department, and accredited test centres where the rules now allow), how often, the five-litre measure test and the error allowed per five litres as the rules or the department's instructions say (quote the number and its source), what the seal and certificate mean, what happens after a short delivery is found (penalty and compounding sections of the Act with section numbers), and the verification fee only if a current official notification states it with its date. Link the MDG guide pages on the five-litre test and on seals by hand (/guides/quantity/...) only if live. Sources: consumeraffairs.nic.in, indiacode.nic.in, a State Legal Metrology department site.",
  },
  {
    id: "equipment-vrs", pillar: "equipment", path: `${P}/equipment/vapour-recovery/`, hi: true, type: "Explainer", wave: 1,
    queries: ["vapour recovery system in petrol pump", "vapour recovery system", "how does vapour recovery work"],
    brief: "Vapour recovery at petrol pumps: what petrol vapour is and why it is recovered, the two stages (Stage I at the tanker unloading, Stage II at the nozzle) in plain words, where it is required in India and by which order or rule (CPCB, a Pollution Control Board, a court order, a city: quote each with its date), what a pump has to install and keep, and what is NOT required everywhere. If the requirement is only in some cities say that clearly. Sources: cpcb.nic.in, MoEFCC, National Green Tribunal orders on greentribunal.gov.in.",
  },
  {
    id: "equipment-tanks", pillar: "equipment", path: `${P}/equipment/underground-tanks/`, hi: true, type: "Explainer", wave: 1,
    queries: ["petrol pump tank capacity", "petrol pump tank size", "petrol pump tank cost", "petrol pump underground tank price", "petrol pump tank installation", "petrol pump tank capacity in litres", "petrol pump tank design"],
    brief: "Underground storage tanks at a petrol pump: why they are buried, single-wall and double-wall, the usual capacity range only if a standard or oil company page gives it, how the tank, fill pipe, vent and sump fit together, tank calibration and the dip chart (link the MDG tools only if live), leak checks and tank testing as PESO conditions or OISD standards require with their numbers and frequency, and what to do on a suspected leak. A parts table. Sources: peso.gov.in, oisd.gov.in standards, the Petroleum Rules 2002.",
  },
  {
    id: "running", pillar: "running", path: `${P}/running/`, hi: true, type: "Pillar", wave: 1,
    queries: ["petrol pump staff", "petrol pump manager work", "petrol pump attendant duties and responsibilities", "petrol pump staff hiring", "petrol pump manager duty time", "petrol pump staff designation", "petrol pump staff required", "petrol pump attendant", "petrol pump manager qualification"],
    brief: "Who runs a petrol pump and what each person does in a day: the dealer or owner, the manager, the nozzle attendants (shifts, uniform, training), the cashier, the tanker receiver, and the records that must be kept daily (link the MDG 2024 pages on the density register, the stock register and the daily books by hand: /guides/density/density-register/, /guides/stock-variation/daily-stock-register/ only if they are live). Duties come from the oil company's guidelines and the MDG where they say so, otherwise from general practice, labelled as practice. Do not state salaries or wages: say that minimum wages are fixed by each state and point to the labour department's page. A table of role and duties.",
  },
  {
    id: "running-gst", pillar: "running", path: `${P}/running/gst/`, hi: true, type: "Explainer", wave: 1,
    queries: ["petrol pump gst", "does petrol have gst", "why no gst on petrol", "is gst applicable on petrol pump", "petrol pump gst registration", "petrol pump gst hsn code", "ms petrol hsn code", "petrol pump gst rate", "petrol pump gst number", "petrol pump gst return", "is there any gst on petrol"],
    brief: "GST and a petrol pump: petrol, diesel and the other petroleum products that are outside GST today and what that means (VAT or sales tax applies, set by each state; the dealer's tax rate is the state's), what the dealer must register for under GST (other sales such as lubricants, accessories, convenience store goods, services, and the rates that apply with their dates), what HSN codes are used, how input tax credit works for such a mixed business, and what changes if petrol is ever brought under GST. Use only current statements from the CBIC, GST Council or a Parliament answer, with their date. A table of product and tax treatment. No tax advice: say to ask a chartered accountant. Sources: cbic-gst.gov.in, gst council statements, eparlib.sansad.in.",
  },
  {
    id: "fuels", pillar: "fuels", path: `${P}/fuels/`, hi: true, type: "Pillar", wave: 1,
    queries: ["what is e20 petrol", "e20 petrol kya hai", "e20 petrol law", "e20 petrol rules", "e20 petrol good", "e20 petrol use", "e20 petrol vs xp95", "is ethanol blended petrol good for environment", "e20 petrol list", "e20 पेट्रोल क्या है"],
    brief: "E20 petrol explained: what ethanol blending is and why India does it (the national blending policy and target, with dates), what E20 means (20% ethanol, 80% petrol), the BIS specification for ethanol-blended petrol and where its number is published, how dispensers and the dealer's records handle blended petrol, what the dealer must label or tell customers (only if an official order says it), the vehicle-compatibility statement from the ministry (quote carefully, with its source), and what E20 does to the density range (link the MDG density E20 page by hand: /guides/density/e20-petrol/ only if live). A short table of E10 versus E20. Sources: pib.gov.in press releases of the Ministry of Petroleum, petroleum.nic.in, bis.gov.in. State what is official and what is contested, never take sides.",
  },
  {
    id: "fuels-cng-ev", pillar: "fuels", path: `${P}/fuels/cng-and-ev-charging/`, hi: true, type: "Explainer", wave: 1,
    queries: ["cng petrol pump apply", "how to apply cng petrol pump", "cng petrol pump cost", "cng petrol pump requirements", "cng petrol pump process", "petrol pump and cng", "petrol pump ev charging"],
    brief: "CNG and electric vehicle charging at a petrol pump: whether an existing petrol pump can add a CNG dispenser or an EV charger and who permits it (the oil company, the CGD company for CNG, PESO for gas safety, the state electricity regulator for charging), what the Government of India's guidelines and policies say (quote the notification, ministry and date), what the dealer has to provide (land, electrical load, safety distances), and the difference between a company-owned and dealer-owned arrangement only if sources say. A table of the two options and the permission each needs. Sources: pib.gov.in, petroleum.nic.in, powermin.gov.in, peso.gov.in. If a point depends on the oil company's policy, say to ask the company.",
  },
  {
    id: "customers", pillar: "customers", path: `${P}/customers/`, hi: true, type: "Pillar", wave: 1,
    queries: ["complaint of petrol pump", "petrol pump complaint number", "how to complaint against petrol pump", "petrol pump complaint toll free number", "petrol quality complaint", "petrol density complaint", "पेट्रोल पंप शिकायत", "पेट्रोल पंप शिकायत नंबर", "petrol pump wale ki complaint kaise kare", "petrol pump staff complaint"],
    brief: "How a customer complains about a petrol pump and how a dealer should handle it: the first step at the pump (the complaint and suggestion book that every outlet must keep, with the rule behind it), the oil company's customer care and grievance routes (name them by company; give a phone number or portal only if you read it on that company's own page or the Government's page on the checked date), the national consumer helpline, CPGRAMS for government grievances, Legal Metrology for short delivery, and the Consumer Protection Act for refunds. A table: problem (short delivery, bad quality, overcharging, rude staff, no air or toilet) and where it goes. Dealers: how to answer a complaint the same day. Link the MDG complaint-book page by hand (/guides/customer-service/complaint-book/) only if live. Sources: official portals and PIB.",
  },
  {
    id: "dealership-hpcl", pillar: "dealership", path: `${P}/dealership/hindustan-petroleum/`, hi: true, type: "Explainer", wave: 2,
    queries: ["hpcl dealership", "hpcl dealership apply online", "hpcl dealership advertisement 2026", "hpcl dealership contact number", "hpcl dealership agreement", "hpcl petrol pump dealership", "hindustan petroleum dealership apply"],
    brief: "How to apply for a Hindustan Petroleum retail outlet dealership, in the company's own published words: where HPCL advertises vacancies (its own dealership portal and newspaper advertisements), how the online application works, what an advertisement states about eligibility, the application fee and the draw of lots, how the company says it should be contacted, and the company's own warning about touts and paying anyone for a dealership. Say plainly that a dealership comes only through the company's own advertisement. Do not state a cost, an investment or an income the company has not published. A table of step and where it happens. Sources: hindustanpetroleum.com retail outlet dealership pages, PIB or Parliament answers where they describe the common selection guidelines. Never link iocl.com.",
  },
  {
    id: "dealership-bpcl", pillar: "dealership", path: `${P}/dealership/bharat-petroleum/`, hi: true, type: "Explainer", wave: 2,
    queries: ["bpcl dealership", "bpcl dealership apply online", "bpcl dealership advertisement 2026", "bpcl dealership contact number", "bpcl dealer", "bharat petroleum dealership apply", "bpcl petrol pump dealership"],
    brief: "How to apply for a Bharat Petroleum retail outlet dealership, in the company's own published words: where BPCL advertises vacancies and how its online application works, what an advertisement states about eligibility, the application fee and the draw of lots, how the company says it should be contacted, and its own warning about touts and paying anyone for a dealership. Say plainly that a dealership comes only through the company's own advertisement. Do not state a cost, an investment or an income the company has not published. A table of step and where it happens. Sources: bharatpetroleum.in retail dealership pages, PIB or Parliament answers on the common selection guidelines. Never link iocl.com.",
  },
  {
    id: "dealership-nayara", pillar: "dealership", path: `${P}/dealership/nayara-energy/`, hi: true, type: "Explainer", wave: 2,
    queries: ["nayara dealership", "nayara dealership apply online", "nayara dealership contact number", "nayara petrol pump dealership", "nayara energy dealership", "nayara dealership apply", "nayara pump dealership"],
    brief: "How to apply for a Nayara Energy retail outlet dealership, in the company's own published words: that Nayara is a private oil company and its selection is its own, not the public sector guideline; where it invites applications, what its page asks for, how it says it should be contacted, and any warning it publishes about touts. Say once, in words, where a rule holds only for the public sector companies. Do not state a cost, an investment or an income the company has not published. Sources: nayaraenergy.com dealership pages. Never link iocl.com.",
  },
  {
    id: "licences-renewal", pillar: "licences", path: `${P}/licences/validity-and-renewal/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump licence renewal", "petrol pump licence renewal online", "peso licence renewal", "petrol pump license validity", "peso license renewal fee", "petrol pump licence expiry", "form xiv licence renewal"],
    brief: "Validity and renewal of a petrol pump's PESO licence in Form XIV: how long a licence runs, the period a renewal is granted for, when the renewal application must reach PESO, what a late application costs, when a licence can no longer be renewed at all, what happens if the layout or the premises change, and the amendment route when the licensee changes. Every figure from the Petroleum Rules 2002 and its amendments, with the rule number and the date checked. A short table of period, deadline and consequence. Sources: peso.gov.in (Petroleum Rules 2002, Amendment Rules 2018 and 2024) and the PESO FAQs.",
  },
  {
    id: "money-running-costs", pillar: "money", path: `${P}/money/running-costs/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump running cost", "petrol pump maintenance cost", "petrol pump operating cost", "petrol pump monthly expenses", "petrol pump electricity bill", "petrol pump total cost", "petrol pump expenses list"],
    brief: "What a petrol pump spends every month, by cost head: the fuel itself bought from the oil company (the dealer's margin is the published commission, link @money-commission), staff, electricity, the licence and verification fees that come back every year, insurance, maintenance of dispensers and tanks, bank and card charges, rent or lease where the land is leased, and the state taxes the dealer collects and pays on. Give a figure only where an official source publishes one (the PESO fee schedule, the Legal Metrology verification fee, the PPAC commission table) with its date; mark every other head as a cost that varies and say what it depends on. Never state a total, a profit or an income, and never suggest what a pump earns. A table of cost head, who sets it and where to check it. Sources: ppac.gov.in, peso.gov.in, consumeraffairs.nic.in.",
  },
  {
    id: "money-working-capital", pillar: "money", path: `${P}/money/working-capital/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump working capital", "petrol pump cash requirement", "petrol pump stock payment", "petrol pump credit days", "petrol pump tanker payment", "working capital for petrol pump", "petrol pump cash flow"],
    brief: "Working capital at a petrol pump: why the business needs cash in hand before it earns, how a tanker load is paid for (in practice paid to the oil company before or on delivery), how long stock sits in the tank, what customer credit and card settlement do to cash, and the swings that catch a new dealer (a price rise makes the same load cost more, festival demand, a tanker that arrives early). Explain with one made-up worked example that says it is made up, using a stated tank size and a price the reader is told to replace with the day's own, never a real price presented as today's. Say that payment terms differ by oil company and to ask the company. No loan, tax or investment advice: say to ask a bank and a chartered accountant. Mark every practice point as practice. Sources: ppac.gov.in for the commission structure, Parliament answers on dealer payment terms where they exist.",
  },
  {
    id: "site-lease", pillar: "site", path: `${P}/site/land-lease/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump land lease", "petrol pump land lease agreement", "petrol pump land lease rent", "petrol pump land rent", "petrol pump land lease agreement format", "land for petrol pump lease", "petrol pump lease agreement"],
    brief: "Leasing land for a petrol pump: what the lease has to do before the oil company and PESO will accept the site, the papers that show legal possession that PESO asks for with the plan application, why a short lease is a problem when a licence and the build outlast it, that registration and stamp duty are state matters, what the agreement should cover (access, the right to build and to dig, what happens at the end of the term), and the difference between offering your own land against a dealership advertisement and leasing land to a company. Give no draft agreement and no legal advice: say to ask an advocate and to use the oil company's own format. Do not state a rent figure. Sources: peso.gov.in (rule 131 and the FAQ list of land documents), the common selection guidelines, oil company pages where they publish lease terms. Never link iocl.com.",
  },
  {
    id: "site-layout", pillar: "site", path: `${P}/site/layout/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump layout", "petrol pump layout plan", "petrol pump layout plan pdf", "petrol pump design", "petrol pump plan drawing", "petrol pump diagram", "petrol pump site plan"],
    brief: "How a petrol pump is laid out and who approves the drawing: the parts of the site (approach and exit, the forecourt and canopy, the dispenser islands, the underground tanks with their fill points and vents, the sales room, the air and water point, toilets, and the tanker's path), why the drawing must be approved by PESO in Form IX before building under rule 131, what the site plan has to show including everything protected within 100 metres, the undertakings about schools, hospitals of ten beds or more, residential areas and water bodies within 50 metres, where OISD standards set distances, that the licence number is marked on the premises, and what happens when the built pump differs from the approved drawing (rule 146). Say that the oil company supplies its own standard layout and that no drawing here replaces the approved one. A table of element and the rule or standard behind it. Sources: peso.gov.in (Petroleum Rules 2002 rules 131, 133, 146 and the PESO FAQs), oisd.gov.in standards.",
  },
];
