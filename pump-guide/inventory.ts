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
import type { Lang } from "../src/i18n/languages.ts";
import { PUMP_TRANSLATIONS, applyTranslations } from "../guide/translations.ts";

export type PumpPillar = "hub" | "dealership" | "money" | "licences" | "site" | "safety" | "equipment" | "running" | "fuels" | "customers";

export interface PumpPage {
  id: string;
  pillar: PumpPillar;
  /** English path, with trailing slash. The Hindi twin lives at "/hi" + path. */
  path: string;
  hi: boolean;
  /** Further languages the page is also written in (set from guide/translations.ts, off the drip). */
  more?: Lang[];
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
  {
    id: "dealership-jio-bp", pillar: "dealership", path: `${P}/dealership/jio-bp/`, hi: true, type: "Explainer", wave: 2,
    queries: ["jio bp dealership", "jio bp dealership cost", "jio bp dealership apply", "jio bp dealership apply online", "jio bp dealership contact number", "jio bp dealership advertisement", "jio bp dealership form"],
    brief: "How to apply for a Jio-bp (Reliance BP Mobility) fuel station dealership, in the company's own published words: that Jio-bp is a private company and its selection is its own, not the public sector guideline; where it invites applications, what its page asks for, how it says it should be contacted, and any warning it publishes about fake dealership offers. Say once, in words, where a rule holds only for the public sector companies. Do not state a cost, an investment or an income the company has not published. Sources: jiobp.in dealership pages. Never link iocl.com.",
  },
  {
    id: "dealership-company-owned-vs-dealer-owned", pillar: "dealership", path: `${P}/dealership/company-owned-or-dealer-owned/`, hi: true, type: "Explainer", wave: 2,
    queries: ["codo petrol pump", "codo petrol pump meaning", "coco petrol pump meaning", "codo petrol pump full form", "codo petrol pump dealership", "coco petrol pump dealership", "dodo petrol pump"],
    brief: "Company-owned versus dealer-owned petrol pumps explained: what CODO (company-owned, dealer-operated), DODO (dealer-owned, dealer-operated) and COCO (company-owned, company-operated) mean, who owns the land and builds the pump in each, how the selection and any security deposit or fee differ where the guideline says so, and why a COCO outlet is not a dealership a person can apply for. A table of type, who owns, who runs, who invests. Figures only from the published selection guideline or a Parliament answer, with the date checked; say where it holds only for the public sector companies. No income or profit figures. Sources: the common dealer selection guidelines on an oil company site (not iocl.com), Parliament answers on eparlib.sansad.in or sansad.in.",
  },
  {
    id: "site-highway-access", pillar: "site", path: `${P}/site/highway-access/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump on national highway permission", "nhai noc for petrol pump", "petrol pump access permission morth", "petrol pump highway noc", "petrol pump on state highway rules", "morth guidelines petrol pump access", "fuel station access national highway"],
    brief: "Access permission for a petrol pump on a national or state highway: why a pump beside a national highway needs the road ministry's access permission before it can open, which MoRTH guideline governs it, the distance and layout points the guideline sets (with the clause and date checked), who to apply to and through which portal, any licence fee or bank guarantee the guideline states, and that state highways follow the state's own rules. Give no figure that is not in the circular on the day. Sources: morth.nic.in circulars on access to wayside amenities and fuel stations, the NHAI or MoRTH online access permission portal pages, Parliament answers.",
  },
  {
    id: "safety-fire-extinguishers", pillar: "safety", path: `${P}/safety/fire-extinguishers/`, hi: true, type: "Explainer", wave: 2,
    queries: ["fire extinguisher at petrol pump", "fire extinguisher used in petrol pump", "petrol pump fire extinguisher", "fire extinguisher for petrol pump price", "fire fighting petrol pump", "what fire extinguisher for petrol", "petrol pump safety equipment"],
    brief: "Fire extinguishers at a petrol pump: which types are kept (dry chemical powder, foam, CO2 and why water is not used on a petrol fire), how many and where, the sand buckets and fire blanket, who checks them and how often, and that the rule comes from the PESO licence conditions and OISD standards. Give numbers only where the official text states them, with the source and date; otherwise say where the outlet's PESO licence and the oil company's checklist set them. No product prices. Sources: peso.gov.in (Petroleum Rules 2002 and licence conditions), oisd.gov.in standards for retail outlets, bis.gov.in for extinguisher standards.",
  },
  {
    id: "safety-earthing", pillar: "safety", path: `${P}/safety/earthing-and-bonding/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump earthing", "petrol pump earthing system", "petrol station earthing", "tanker earthing at petrol pump", "earthing and bonding petrol pump", "static electricity petrol pump", "earthing pit petrol pump"],
    brief: "Earthing and bonding at a petrol pump: why static electricity is a fire risk around petrol, what earthing and bonding mean in plain words, which parts are earthed (tanks, dispensers, pipelines, the canopy, electrical panels), why the tanker is earthed before it unloads, how earthing is tested and how often where an official text says so, and which rule or standard requires it. Every requirement with its source and the date checked; mark practice as practice. Sources: peso.gov.in (Petroleum Rules 2002 rules on electrical equipment and static), oisd.gov.in standards, the Central Electricity Authority regulations where relevant.",
  },
  {
    id: "safety-signage", pillar: "safety", path: `${P}/safety/safety-signs/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump safety signs", "petrol pump warning sign", "petrol pump safety rules in india", "petrol pump safety poster", "no smoking sign petrol pump", "switch off mobile petrol pump sign", "petrol pump safety rules"],
    brief: "Safety signs a petrol pump must show: no smoking and no naked flame, switch off the engine, the licence number and its display, emergency phone numbers, fire point and assembly signs, and the notices for customers. For each say which rule or standard requires it with the date checked, and mark signs that are only oil company practice as practice. Explain the mobile phone sign plainly without claims the sources do not make. Sources: peso.gov.in (Petroleum Rules 2002, the licence conditions), oisd.gov.in standards, Legal Metrology rules for price and measure displays where relevant.",
  },
  {
    id: "safety-spill", pillar: "safety", path: `${P}/safety/spill-and-leak/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol spill at petrol pump", "petrol spillage", "petrol spill clean up", "petrol spill kit", "fuel leak at petrol pump", "underground tank leak petrol pump", "petrol spillage fire extinguisher"],
    brief: "What to do in a fuel spill or a leak at a petrol pump: the first steps in a small spill at a nozzle (stop dispensing, no ignition, absorb with sand, keep vehicles away), a larger spill during tanker unloading, a suspected leak from an underground tank or pipeline, and who must be told (the oil company, PESO for an accident under the Petroleum Rules, the fire service). Each duty with its rule and date checked; practice marked as practice. No promise that any step makes a site safe. Sources: peso.gov.in (Petroleum Rules 2002, the rule on reporting accidents), oisd.gov.in standards, cpcb.nic.in on soil and groundwater from fuel stations.",
  },
  {
    id: "equipment-nozzles", pillar: "equipment", path: `${P}/equipment/nozzles/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump nozzle", "petrol pump nozzle mechanism", "petrol pump nozzle parts", "petrol pump nozzle auto cut off", "petrol and diesel nozzle size difference", "petrol pump nozzle pipe", "why petrol pump nozzle stops"],
    brief: "Fuel dispenser nozzles in plain words: the parts of a nozzle (spout, lever, hose, breakaway coupling), how the automatic cut-off senses a full tank and stops the flow, why a diesel spout is usually wider than a petrol spout so a petrol car cannot easily take a diesel nozzle, the vapour-recovery nozzle where the rules require one (link @equipment-vrs), and who checks nozzles. Figures and sizes only from a standard or rule opened that day with its date; otherwise mark as practice. No prices. Sources: bis.gov.in standards for dispensing nozzles, Legal Metrology rules for dispensers, cpcb.nic.in on vapour recovery.",
  },
  {
    id: "equipment-dispenser", pillar: "equipment", path: `${P}/equipment/dispenser-parts/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump dispenser", "fuel dispenser parts", "petrol dispenser machine parts", "how does petrol pump meter work", "pulser in fuel dispenser"],
    brief: "Inside a fuel dispenser: the pump, the flow meter, the pulser and the display, how a litre is measured and shown, and what Legal Metrology verifies. Facts only from a standard or rule opened that day, with its date. Sources: Legal Metrology; standards (bis.gov.in, consumeraffairs.nic.in).",
  },
  {
    id: "equipment-automation", pillar: "equipment", path: `${P}/equipment/automation/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump automation", "outlet automation", "petrol pump automation system", "retail outlet automation oil company"],
    brief: "Outlet automation: what it is and what it records (sales, tank stock, dispenser readings sent to the oil company). Sources: oil company public pages (not iocl.com); the live MDG guide page /guides/automation/ if it exists.",
  },
  {
    id: "equipment-tank-gauge", pillar: "equipment", path: `${P}/equipment/tank-gauge/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump tank level gauge", "dip stick petrol pump", "automatic tank gauge", "how stock is measured in petrol pump tank"],
    brief: "Tank level gauges and how stock is read: the dip rod and the automatic tank gauge, in plain words. Sources: oil company technical pages; standards (bis.gov.in, oisd.gov.in, peso.gov.in).",
  },
  {
    id: "running-attendant-duties", pillar: "running", path: `${P}/running/nozzle-attendant-duties/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol attendant duties", "petrol pump attendant work", "nozzle man duty petrol pump", "petrol pump worker job"],
    brief: "What a nozzle attendant does in a shift: the rules that bind the job (engine off, no smoking, zero on the display, a bill on request) with their sources, and the rest marked as practice. Sources: practice; PESO; Legal Metrology; oil company training material if public.",
  },
  {
    id: "running-manager-duties", pillar: "running", path: `${P}/running/manager-duties/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump manager work", "petrol pump manager duties", "petrol pump manager job"],
    brief: "What a pump manager does in a day: records, stock, shift hand-over, staff, and the rules each task follows with its source; practice marked as practice. Sources: practice; PESO; Legal Metrology; oil company guidelines.",
  },
  {
    id: "fuels-premium-petrol", pillar: "fuels", path: `${P}/fuels/premium-petrol/`, hi: true, type: "Explainer", wave: 2,
    queries: ["premium petrol cost", "premium petrol vs normal petrol", "what is premium petrol", "speed petrol difference"],
    brief: "Premium petrol: what is different and what the rules say; no prices and no performance claims beyond the source's own words. Sources: bis.gov.in petrol specification; oil company public product pages (not iocl.com); PIB/MoPNG.",
  },
  {
    id: "fuels-diesel-grades", pillar: "fuels", path: `${P}/fuels/diesel-grades/`, hi: true, type: "Explainer", wave: 2,
    queries: ["bs6 diesel", "diesel grades in india", "biodiesel blend petrol pump", "bs vi diesel specification"],
    brief: "Diesel at the pump: BS VI and blends; only figures the source states, with date. Sources: bis.gov.in diesel specification; PIB; MoPNG.",
  },
  {
    id: "customers-short-delivery", pillar: "customers", path: `${P}/customers/short-delivery/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump less petrol", "how to check petrol quantity", "5 litre measure petrol pump", "petrol pump cheating complaint"],
    brief: "Short delivery of fuel: how a customer can check the quantity and where to complain; no legal advice, no promise of outcome. Sources: Legal Metrology Act 2009 and rules; consumerhelpline.gov.in; the oil company grievance route.",
  },
  {
    id: "money-price-build-up", pillar: "money", path: `${P}/money/petrol-price-build-up/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol price breakup", "petrol price structure india", "how petrol price is decided", "dealer commission in petrol price"],
    brief: "How the retail price of a litre of petrol is built up: the dealer commission, central excise duty, VAT and the crude and refinery parts, with the figures the source states and its date; no price forecast. Sources: PPAC price build-up; PIB; petroleum.nic.in.",
  },
  {
    id: "fuels-ethanol-100", pillar: "fuels", path: `${P}/fuels/flex-fuel-and-e100/`, hi: true, type: "Explainer", wave: 2,
    queries: ["e100 petrol pump", "flex fuel vehicles india", "e20 petrol", "ethanol blended petrol"],
    brief: "Flex-fuel vehicles and E100 at the pump: what E20 and E100 are and what the government has stated about them, only figures the source states, with date. Sources: PIB; MoPNG.",
  },
  {
    id: "customers-quality-complaint", pillar: "customers", path: `${P}/customers/fuel-quality-complaint/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol quality complaint", "bad petrol complaint", "adulterated petrol complaint", "petrol pump complaint number"],
    brief: "A fuel quality complaint: what a customer can do, where the sample test is and where to write; no legal advice, no promise of outcome. Sources: oil company grievance pages; BIS; MDG sampling pages.",
  },
  {
    id: "customers-free-services", pillar: "customers", path: `${P}/customers/free-services/`, hi: true, type: "Explainer", wave: 2,
    queries: ["free air at petrol pump", "petrol pump toilet rule", "drinking water petrol pump", "free services petrol pump"],
    brief: "Free air, drinking water and toilets at a petrol pump: what the guidelines require and what is practice. Sources: oil company guidelines; link MDG toilet rules page.",
  },
  {
    id: "customers-refund", pillar: "customers", path: `${P}/customers/refund-and-consumer-court/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump refund", "consumer court petrol pump", "fuel complaint consumer forum", "petrol pump overcharging complaint"],
    brief: "Refund and consumer court for a fuel complaint: what the Consumer Protection Act 2019 and the National Consumer Helpline say; no legal advice. Sources: Consumer Protection Act 2019; consumerhelpline.gov.in.",
  },
  {
    id: "safety-mobile-phone", pillar: "safety", path: `${P}/safety/mobile-phone-at-pump/`, hi: true, type: "Explainer", wave: 2,
    queries: ["mobile phone petrol pump", "can we use phone at petrol pump", "phone at petrol pump danger", "mobile phone ban at petrol pump"],
    brief: "Using a mobile phone at a petrol pump: what the rules and official safety guidance actually say, without myths. Sources: PESO; OISD; Parliament answers; oil company guidelines.",
  },
  {
    id: "running-marketing-discipline", pillar: "running", path: `${P}/running/marketing-discipline-guidelines/`, hi: true, type: "Explainer", wave: 2,
    queries: ["ms hsd control order", "petrol pump adulteration rules", "marketing discipline guidelines", "petrol pump penalty adulteration"],
    brief: "The marketing discipline guidelines and the control order that bind a dealer on adulteration, sealing and sales, as the source states them. Sources: petroleum.nic.in; indiacode.nic.in; MoPNG; PIB.",
  },
  {
    id: "site-land-size", pillar: "site", path: `${P}/site/land-size-required/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump land size in feet", "land required for petrol pump", "plot size required for petrol pump", "petrol pump ke liye jameen kitni chahiye"],
    brief: "Scope: Land size for a petrol pump: frontage and depth the oil companies ask. Sources: HPCL, BPCL, Nayara and Jio-bp dealership pages and advertisement notices; MDG 2024 guideline on petroleum.nic.in; Petroleum Rules 2002 on indiacode.nic.in; PESO.",
  },
  {
    id: "licences-petroleum-classes", pillar: "licences", path: `${P}/licences/petroleum-classes/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petroleum class a and class b", "petroleum class a b c", "class a class b petroleum products"],
    brief: "Scope: Class A, B and C petroleum: what the classes mean and which one a pump sells. Sources: Petroleum Act 1934 and Petroleum Rules 2002 on indiacode.nic.in; peso.gov.in.",
  },
  {
    id: "customers-digital-payments", pillar: "customers", path: `${P}/customers/pay-by-upi-or-card/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump upi payment", "how to pay at petrol pump", "are upi payments free", "petrol pump card payment charge"],
    brief: "Scope: Paying for petrol by UPI or card: extra charges, refunds and failed payments. Sources: RBI notifications (MDR, zero charge on UPI); PIB; MoPNG; NPCI public pages; Parliament answers.",
  },
  {
    id: "customers-bill-gst", pillar: "customers", path: `${P}/customers/petrol-bill-and-gst/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump bill receipt", "does petrol have gst", "is gst applicable on petrol pump", "petrol pump gst bill"],
    brief: "Scope: Petrol bill and GST: is there GST on petrol and what the bill shows. Sources: CBIC / cbic-gst.gov.in; GST Council PIB releases; Legal Metrology rules; Parliament answers.",
  },
  {
    id: "safety-tanker-unloading", pillar: "safety", path: `${P}/safety/tanker-unloading/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump tanker unloading", "fuel tanker unloading procedures"],
    brief: "Scope: Tanker unloading at a petrol pump: the safety steps the rules and OISD ask for. Sources: OISD standards and guidelines (oisd.gov.in, read with curl); Petroleum Rules 2002 on indiacode.nic.in; PESO.",
  },
  {
    id: "equipment-cctv", pillar: "equipment", path: `${P}/equipment/cctv-cameras/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump cctv", "petrol pump cctv camera", "petrol pump cctv footage"],
    brief: "Scope: CCTV cameras at a petrol pump: whether any rule or guideline requires them. Sources: MDG 2024 guideline and oil company RO standards; OISD; PESO; state home department orders only if on an official site. If no primary source states a requirement, say so on the page and keep it short.",
  },
  {
    id: "running-density-check", pillar: "running", path: `${P}/running/density-check/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump par density kaise check kare", "what is density in petrol pump", "petrol pump par density kitni honi chahie"],
    brief: "Scope: Density at a petrol pump: what it is, how it is checked and what the number means. Sources: BIS IS 2796 and IS 1460 on bis.gov.in; Marketing discipline guidelines; PPAC; PIB; MoPNG.",
  },
  {
    id: "fuels-biofuel-outlets", pillar: "fuels", path: `${P}/fuels/biodiesel-and-biofuel/`, hi: true, type: "Explainer", wave: 2,
    queries: ["biodiesel petrol pump", "biofuel petrol pump", "biodiesel petrol pump in india"],
    brief: "Scope: Biodiesel and biofuel at a petrol pump: what the policy says and what is sold. Sources: National Policy on Biofuels (petroleum.nic.in, mnre.gov.in); PIB; MoPNG; Parliament answers; oil company pages.",
  },
  {
    id: "dealership-chayan-portal", pillar: "dealership", path: `${P}/dealership/dealer-chayan-portal/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump dealer chayan", "petrol pump dealer chayan 2026 registration", "petrol pump dealership advertisement 2026", "petrol pump dealer chayan 2026 opening date"],
    brief: "Scope: Petrol Pump Dealer Chayan: the official portal, its advertisements and how to register. Sources: petrolpumpdealerchayan.in (read with curl if fetch fails); OMC dealer selection brochures (HPCL, BPCL pages); PIB; Parliament answers. Never state a future opening date that the portal or an OMC does not publish.",
  },
  {
    id: "dealership-fuel-companies", pillar: "dealership", path: `${P}/dealership/fuel-companies-in-india/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump company list in india", "petrol pump company name list", "fuel companies in india", "petrol station companies in india"],
    brief: "Scope: Which companies run petrol pumps in India and how many pumps each has. Sources: PPAC retail outlet / marketing infrastructure data (ppac.gov.in); MoPNG resolution on authorisation to market transportation fuels (2019) on petroleum.nic.in / egazette; PIB; Parliament answers.",
  },
  {
    id: "dealership-transfer", pillar: "dealership", path: `${P}/dealership/transfer-of-dealership/`, hi: true, type: "Explainer", wave: 2,
    queries: ["can petrol pump dealership be transferred", "petrol pump dealership transfer", "how to transfer ownership of petrol pump", "indian oil petrol pump dealership transfer"],
    brief: "Scope: Can a petrol pump dealership be transferred or sold? Reconstitution and legal heirs. Sources: OMC dealer selection brochures (clauses on reconstitution, death of dealer, legal heirs); MDG 2024; Parliament answers; Petroleum Rules 2002 on transfer of licence (indiacode). If no primary source states the transfer rule, set the topic back to needs-data.",
  },
  {
    id: "licences-peso-status-check", pillar: "licences", path: `${P}/licences/check-peso-licence-status/`, hi: true, type: "Explainer", wave: 2,
    queries: ["peso license status check online", "peso license check", "petrol pump license verification", "peso license download"],
    brief: "Scope: How to check a PESO licence and its status online. Sources: peso.gov.in online licensing pages (read with curl and pdftotext); Petroleum Rules 2002 on indiacode.nic.in; PIB on PESO online services.",
  },
  {
    id: "licences-petroleum-rules-2002", pillar: "licences", path: `${P}/licences/petroleum-rules-2002/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petroleum rules 2002", "petrol pump rules 2002", "petroleum rules 2002 rule 144", "petroleum rules 2002 latest amendment", "petrol pump rules and regulations"],
    brief: "Scope: Petroleum Rules 2002: the parts that apply to a petrol pump. Sources: Petroleum Rules 2002 on indiacode.nic.in and peso.gov.in; amendment notifications on egazette / peso.gov.in; Petroleum Act 1934.",
  },
  {
    id: "running-inspections", pillar: "running", path: `${P}/running/who-can-inspect-a-petrol-pump/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump inspection officer", "petrol pump checking officer", "petrol pump inspection report", "petrol pump inspector"],
    brief: "Scope: Who can inspect a petrol pump and what they check. Sources: MS and HSD Order 2005 (inspection, search, sampling clauses) on ppac.gov.in / petroleum.nic.in / egazette; Legal Metrology Act 2009 s.15 on indiacode; Petroleum Rules 2002 inspection rule; MDG 2024.",
  },
  {
    id: "site-agricultural-land", pillar: "site", path: `${P}/site/agricultural-land/`, hi: true, type: "Explainer", wave: 2,
    queries: ["can we open petrol pump on agriculture land", "petrol pump on agricultural land", "petrol pump land conversion", "petrol pump land rules"],
    brief: "Scope: Can a petrol pump be built on agricultural land? Land conversion explained. Sources: OMC dealer selection brochures (land clauses: conversion to non-agricultural / commercial use and when it must be done); MDG brochure on hpcl/bpcl sites; state revenue department pages only if official; say conversion law is by state.",
  },
  {
    id: "fuels-adblue", pillar: "fuels", path: `${P}/fuels/adblue-def/`, hi: true, type: "Explainer", wave: 2,
    queries: ["adblue petrol pump", "adblue petrol pump price", "adblue fuel pump", "def at petrol pump"],
    brief: "Scope: AdBlue (diesel exhaust fluid) at petrol pumps: what it is and why BS-VI diesels need it. Sources: BIS standard for DEF (IS 17042) on bis.gov.in; MoRTH BS-VI notification on morth.nic.in / egazette; PIB; oil company product pages (HPCL, BPCL). No price unless an official page states it, dated.",
  },
  {
    id: "dealership-ex-servicemen", pillar: "dealership", path: `${P}/dealership/ex-servicemen/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump for ex servicemen", "petrol pump dealership for ex servicemen", "ex servicemen petrol pump scheme", "petrol pump allotment procedure for ex servicemen", "ex servicemen petrol pump kaise khole"],
    brief: "Scope: Petrol pump dealership for ex-servicemen: the defence category explained. Sources: Dealer selection brochure June 2023 (petrolpumpdealerchayan.in, HPCL, BPCL pages): defence category, who qualifies, groups, certificate; Directorate General Resettlement (dgrindia.gov.in) pages on oil product agencies; Parliament answers. Go deeper than the eligibility page's one line on the 8% share.",
  },
  {
    id: "dealership-rural-outlet", pillar: "dealership", path: `${P}/dealership/rural-retail-outlet/`, hi: true, type: "Explainer", wave: 2,
    queries: ["rural petrol pump dealership", "kisan seva kendra petrol pump dealership", "rural petrol pump land requirement", "rural petrol pump dealership cost", "kisan seva kendra petrol pump kaise khole"],
    brief: "Scope: Rural petrol pump dealership: how it differs from a regular one. Sources: Dealer selection brochure June 2023 and BPCL DSG 2023 (Regular vs Rural retail outlet: definitions, land, fees, security deposit, selection); Parliament answers on rural outlets and Kisan Seva Kendra (name Indian Oil in words, never link iocl.com); PIB.",
  },
  {
    id: "customers-petrol-in-bottle", pillar: "customers", path: `${P}/customers/petrol-in-bottle/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol in bottle rules", "petrol in bottle allowed or not", "petrol in bottle ban", "petrol pump bottle rule", "can i buy petrol in a can"],
    brief: "Scope: Can you buy petrol in a bottle? What the rules say. Sources: Petroleum Rules 2002 on indiacode.nic.in and peso.gov.in (Form XIV condition 16, rules on containers for petroleum class A); PESO circulars or advisories on peso.gov.in (read with curl); district or state orders only on official sites, dated.",
  },
  {
    id: "customers-no-helmet-no-petrol", pillar: "customers", path: `${P}/customers/no-helmet-no-petrol/`, hi: true, type: "Explainer", wave: 2,
    queries: ["no helmet no petrol rule", "no helmet no petrol which state", "no helmet no petrol policy", "no helmet no petrol rule comes into force in"],
    brief: "Scope: No helmet, no petrol: where the rule comes from and which places have it. Sources: Motor Vehicles Act 1988 s.129 on indiacode.nic.in; state government, transport department, police or district orders on official .gov.in / .nic.in sites only (dated); PIB; MoRTH. If no official order can be opened, set to needs-data.",
  },
  {
    id: "running-opening-hours", pillar: "running", path: `${P}/running/opening-hours/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump timing in india", "petrol pump 24 hours open", "petrol pump timing", "petrol pump working hours"],
    brief: "Scope: Petrol pump timings: what the rules say about opening hours. Sources: MDG 2024 (bharatpetroleum.in PDF): working hours, display of working hours, related irregularities; HPCL retail outlets brochure (mandatory facilities incl. display of working hours); BPCL DSG 2023; Parliament answers. Opening hours set per outlet by the oil company: say so if that is what the sources show.",
  },
  {
    id: "running-staff-uniform", pillar: "running", path: `${P}/running/staff-uniform/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump staff uniform", "petrol pump staff designation", "petrol pump uniform rules"],
    brief: "Scope: Petrol pump staff uniform: what the oil companies' guidelines ask. Sources: MDG 2024 (uniform and staff clauses, irregularity lists); HPCL / BPCL dealer pages; Petroleum Rules 2002 (rule 118 supervision; any clothing clause). If no primary source states a uniform requirement, set to needs-data.",
  },
  {
    id: "fuels-cbg-satat", pillar: "fuels", path: `${P}/fuels/compressed-biogas/`, hi: true, type: "Explainer", wave: 2,
    queries: ["cbg petrol pump", "satat scheme cbg", "satat scheme details", "compressed biogas pump", "satat scheme full form"],
    brief: "Scope: Compressed biogas (CBG) at petrol pumps and the SATAT scheme. Sources: SATAT pages on mopng.gov.in / petroleum.nic.in; PIB releases on SATAT and CBG sale at retail outlets (dated counts); Parliament answers; CBG blending obligation notifications. No plant economics or subsidy promises.",
  },
  {
    id: "fuels-lng-trucks", pillar: "fuels", path: `${P}/fuels/lng-for-trucks/`, hi: true, type: "Explainer", wave: 2,
    queries: ["lng station in india", "lng fuel station", "lng for trucks india", "lng station near me"],
    brief: "Scope: LNG for trucks at fuel stations in India. Sources: PIB releases on LNG stations (dated counts); MoPNG; PESO (Static and Mobile Pressure Vessels (Unfired) Rules 2016 on peso.gov.in / indiacode); Parliament answers; oil company pages (HPCL, BPCL). No prices unless an official dated page states them.",
  },
  {
    id: "customers-diesel-in-drum", pillar: "customers", path: `${P}/customers/diesel-in-drum-or-can/`, hi: true, type: "Explainer", wave: 2,
    queries: ["can petrol pump give diesel in bottle", "diesel in jerry can rules", "diesel in drum from petrol pump", "can petrol pump give petrol in jerry cans", "diesel pump for drum"],
    brief: "Scope: Can a petrol pump fill diesel in a drum, jerry can or bottle? What the rules say. Sources: Petroleum Rules 2002 (indiacode.nic.in / peso.gov.in): Form XIV conditions on filling containers, rules on containers for petroleum Class B (diesel), quantities a person may keep without a licence; Parliament answers or PIB on sale in loose containers. Do not repeat the petrol-in-bottle page; link to it.",
  },
  {
    id: "customers-check-fuel-price", pillar: "customers", path: `${P}/customers/check-todays-fuel-price/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol price today", "how to check petrol price", "petrol price sms", "diesel price today", "petrol price change time"],
    brief: "Scope: How to check today's petrol and diesel price at your pump, and when it changes. Sources: PPAC (ppac.gov.in) price pages; PIB on daily price revision (June 2017) and current pricing; oil companies' own price pages and SMS codes (HPCL, BPCL; Indian Oil named in words only, never link iocl.com); MDG 2024 on price display. No price figures that are not dated on an official page.",
  },
  {
    id: "customers-pump-locator", pillar: "customers", path: `${P}/customers/find-a-petrol-pump/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump near me", "petrol pump locator hpcl", "nearest petrol pump on highway", "petrol pump near me open now", "bharat petroleum pump locator"],
    brief: "Scope: Finding a petrol pump near you: the oil companies' own locators. Sources: Oil companies' own locator pages and apps (HPCL, BPCL, Jio-bp, Nayara, Shell; Indian Oil named in words only, never link iocl.com); PIB or Parliament answers for dated outlet counts; MDG 2024 or company pages on 24-hour outlets if stated. No third-party apps.",
  },
  {
    id: "running-dry-out", pillar: "running", path: `${P}/running/dry-out-and-closure/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump dry out", "petrol pump closed today", "petrol pump strike", "petrol pump running dry", "petrol pump closed news"],
    brief: "Scope: When a petrol pump runs dry or shuts: what the dealer guidelines say. Sources: MDG 2024 (bharatpetroleum.in PDF): clauses on dry outs, stock, non-operation, closure and penalties; Parliament answers and PIB releases on dry outs and supply (dated); Essential Commodities Act orders if a primary source applies. No news reporting of particular strikes; if no primary source covers a point, leave it out.",
  },
  {
    id: "running-display-boards", pillar: "running", path: `${P}/running/display-boards/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump display board", "petrol pump rules and regulations for customers", "petrol pump ke niyam", "petrol pump rules in hindi", "petrol pump price display"],
    brief: "Scope: What a petrol pump must display: prices, density, timings and other boards. Sources: MDG 2024 (bharatpetroleum.in PDF): clause 1.6 and the display list (prices, density, working hours, contact numbers, complaint book, facilities); Legal Metrology rules if any apply; Petroleum Rules 2002 display conditions. Do not repeat the safety-signs page (safety signs live there); link to it.",
  },
  {
    id: "equipment-solar", pillar: "equipment", path: `${P}/equipment/solar-panels/`, hi: true, type: "Explainer", wave: 2,
    queries: ["solar petrol pump", "solar panel at petrol pump", "solarised retail outlets", "petrol pump solar power"],
    brief: "Scope: Solar panels at petrol pumps: how many outlets run on solar. Sources: PIB releases and Parliament answers on solarised retail outlets (dated counts by company); MoPNG annual report; oil companies' own sustainability pages (HPCL, BPCL). No savings or cost promises.",
  },
  {
    id: "fuels-hydrogen", pillar: "fuels", path: `${P}/fuels/hydrogen-stations/`, hi: true, type: "Explainer", wave: 2,
    queries: ["hydrogen fuel station india", "hydrogen petrol pump", "hydrogen car fuel station in india", "hydrogen refuelling station"],
    brief: "Scope: Hydrogen at fuel stations in India: where it is sold and what the rules say. Sources: PIB releases on hydrogen dispensing stations and hydrogen buses (dated); MNRE National Green Hydrogen Mission pages (mnre.gov.in); PESO notes or rules on hydrogen (Gas Cylinders Rules 2016, SMPV(U) Rules 2016) on peso.gov.in; Parliament answers. No prices unless dated on an official page.",
  },
  {
    id: "money-fleet-cards", pillar: "money", path: `${P}/money/fleet-cards/`, hi: true, type: "Explainer", wave: 2,
    queries: ["fleet card", "hp drivetrack card", "bpcl smartfleet card", "fleet card for petrol pump", "fuel card for transporters"],
    brief: "Scope: Fleet cards at petrol pumps: how transport companies pay for fuel. Sources: Oil companies' own fleet card pages (HPCL DriveTrack Plus, BPCL SmartFleet; Indian Oil XTRAPOWER named in words only, never link iocl.com); MDG 2024 on card acceptance at outlets; PIB if any. Describe what the companies publish; no fee figures unless dated on the company page; no advice.",
  },
  {
    id: "dealership-shell", pillar: "dealership", path: `${P}/dealership/shell-india/`, hi: true, type: "Explainer", wave: 2,
    queries: ["shell petrol pump dealership", "shell petrol pump dealership apply online", "shell petrol pump dealership cost", "shell petrol pump franchise", "शेल पेट्रोल पंप डीलरशिप"],
    brief: "Scope: Shell petrol pump dealership in India: what the company publishes. Sources: Shell India's own retail / dealership page (shell.in); Shell company dealer-selection notices; PIB or Parliament answers naming Shell as a private retailer (dated). Never invent a cost; say what Shell publishes and that payment to anyone for a dealership is a fraud sign.",
  },
  {
    id: "dealership-agreement-termination", pillar: "dealership", path: `${P}/dealership/dealer-agreement-and-termination/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump dealership agreement", "petrol pump dealership terms and conditions", "petrol pump dealership cancelled", "petrol pump dealer termination", "पेट्रोल पंप डीलरशिप एग्रीमेंट"],
    brief: "Scope: Petrol pump dealership agreement: terms, and when a dealership can be terminated. Sources: MDG 2024 (bharatpetroleum.in PDF, read with curl and pdftotext): the dealership agreement, term, termination, suspension and penalty clauses; Parliament answers on dealer termination (dated). Only clauses the guideline states; no advice.",
  },
  {
    id: "running-dealer-grievance", pillar: "running", path: `${P}/running/dealer-grievance-redressal/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump dealer complaint", "petrol pump dealer grievance", "dealer complaint oil company", "oil company dealer dispute arbitration", "पेट्रोल पंप डीलर शिकायत"],
    brief: "Scope: Petrol pump dealer complaints against the oil company: where a dealer can go. Sources: MDG 2024 (bharatpetroleum.in PDF): grievance, dispute and arbitration clauses; Parliament answers and PIB on dealer grievance redressal (dated); the oil companies' own dealer grievance pages (HPCL, BPCL). Only what sources state.",
  },
  {
    id: "running-dealer-records", pillar: "running", path: `${P}/running/dealer-records-and-registers/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump registers", "petrol pump records", "petrol pump stock register", "petrol pump dip register", "पेट्रोल पंप रजिस्टर"],
    brief: "Scope: Records and registers a petrol pump dealer must keep. Sources: MDG 2024 (bharatpetroleum.in PDF): records and registers clauses (stock, dip, sales, density, complaint book); Legal Metrology rules on registers if any; Petroleum Rules 2002 records conditions. If a register is not named in a primary source, leave it out.",
  },
  {
    id: "safety-oisd-standards", pillar: "safety", path: `${P}/safety/oisd-standards-for-retail-outlets/`, hi: true, type: "Explainer", wave: 2,
    queries: ["oisd standards petrol pump", "oisd 118 layouts", "oisd standard for retail outlets", "oisd guidelines petrol pump", "OISD क्या है"],
    brief: "Scope: OISD standards for petrol pumps: what they are and which ones apply. Sources: oisd.gov.in (read with curl/pdftotext): what OISD is, the list of standards and guidelines that cover retail outlets (for example the layout and fire protection standards), with their numbers and years only as shown on the site; MoPNG page on OISD; Parliament answers. Do not repeat the fire-extinguisher, earthing or tanker-unloading pages: link to them.",
  },
  {
    id: "equipment-flameproof-fittings", pillar: "equipment", path: `${P}/equipment/flameproof-electrical-fittings/`, hi: true, type: "Explainer", wave: 2,
    queries: ["flameproof equipment petrol pump", "hazardous area petrol pump", "petrol pump electrical safety", "hazardous area classification", "पेट्रोल पंप बिजली सुरक्षा"],
    brief: "Scope: Electrical fittings at a petrol pump: hazardous areas and flameproof equipment. Sources: Petroleum Rules 2002 (indiacode.nic.in) conditions on electrical installations; PESO (peso.gov.in, curl) circulars on electrical equipment; BIS (bis.gov.in) standard titles for flameproof equipment and area classification only as listed there; OISD (oisd.gov.in). Plain words: what a hazardous area is and why fittings differ. No design figures unless a source states them.",
  },
  {
    id: "licences-cng-station", pillar: "licences", path: `${P}/licences/cng-station-licence/`, hi: true, type: "Explainer", wave: 2,
    queries: ["cng pump licence", "cng station licence", "cng pump licence process", "cng filling station licence", "सीएनजी पंप लाइसेंस"],
    brief: "Scope: CNG station licence in India: who gives it and what it covers. Sources: PESO (peso.gov.in, curl): licensing of CNG stations under the Gas Cylinders Rules 2016 / SMPV(U) Rules 2016; PNGRB (pngrb.gov.in) authorisation of CGD networks and CNG stations; PIB and Parliament answers (dated). No fees unless on the official page with date. Link to the cng-and-ev page rather than repeat it.",
  },
  {
    id: "customers-wrong-fuel", pillar: "customers", path: `${P}/customers/wrong-fuel-in-vehicle/`, hi: true, type: "Explainer", wave: 2,
    queries: ["wrong fuel filled in car petrol pump", "diesel in petrol car what to do", "petrol in diesel car", "galat fuel dalwa diya"],
    brief: "Scope: Wrong fuel in your vehicle at a petrol pump: what to do and who is responsible. Sources: Consumer Protection Act 2019 (indiacode.nic.in); consumerhelpline/NCH pages (consumerhelpline.gov.in, consumeraffairs.nic.in); oil company customer grievance pages (HPCL, BPCL); only what sources state.",
  },
  {
    id: "money-price-differs-by-state", pillar: "money", path: `${P}/money/why-petrol-price-differs-by-state/`, hi: true, type: "Explainer", wave: 2,
    queries: ["why petrol price different in different states", "petrol price in all states", "state wise petrol vat", "petrol sasta kis rajya me"],
    brief: "Scope: Why petrol and diesel prices differ from state to state: VAT and other levies. Sources: PPAC (ppac.gov.in) price build-up and state-wise VAT tables; PIB; Parliament answers on state VAT.",
  },
  {
    id: "safety-smoking", pillar: "safety", path: `${P}/safety/smoking-at-petrol-pump/`, hi: true, type: "Explainer", wave: 2,
    queries: ["is smoking at petrol pump illegal", "smoking at petrol pump fine", "petrol pump me smoking"],
    brief: "Scope: Smoking at a petrol pump: what the rules say. Sources: Petroleum Rules 2002 (smoking and naked lights rule, indiacode.nic.in or peso.gov.in); COTPA 2003; OISD.",
  },
  {
    id: "running-non-fuel-retail", pillar: "running", path: `${P}/running/non-fuel-retail/`, hi: true, type: "Explainer", wave: 2,
    queries: ["convenience store at petrol pump india", "atm at petrol pump", "non fuel retail petrol pump", "petrol pump me shop"],
    brief: "Scope: Shops, ATMs and other non-fuel business at a petrol pump: what the oil companies allow. Sources: MoPNG/PIB on non-fuel revenue at retail outlets; HPCL/BPCL/Nayara/Jio-bp published pages on convenience stores; dealer guidelines.",
  },
  {
    id: "running-water-in-fuel", pillar: "running", path: `${P}/running/water-in-fuel/`, hi: true, type: "Explainer", wave: 2,
    queries: ["water in petrol pump tank", "water in petrol at pump what to do", "water finding paste", "petrol me pani"],
    brief: "Scope: Water in petrol or diesel: how a pump checks for it and what it does. Sources: Marketing Discipline Guidelines / MDG 2024 (oil company published); OISD; PESO; HPCL/BPCL quality control pages.",
  },
  {
    id: "customers-dispenser-tampering", pillar: "customers", path: `${P}/customers/dispenser-tampering/`, hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump chip fraud", "petrol pump pulsar cheating", "dispenser tampering penalty", "petrol pump me chori"],
    brief: "Scope: Tampered petrol pump dispensers (chip and pulsar fraud): what the law says and what happens. Sources: Legal Metrology Act 2009; MoPNG/PIB answers on tampering and action taken; MDG 2024 penalty table.",
  },
  {
    id: "dealership-pumps-by-state", pillar: "dealership", path: `${P}/dealership/petrol-pumps-by-state/`, hi: true, type: "Explainer", wave: 2,
    queries: ["how many petrol pumps in india", "state wise petrol pumps list", "petrol pumps in up", "bharat me kitne petrol pump hain"],
    brief: "Scope: How many petrol pumps are there in India, state by state. Sources: PPAC (ppac.gov.in) retail outlet counts; Parliament answers on retail outlets by state; PIB.",
  },
  {
    id: "fuels-ethanol-free-petrol", pillar: "fuels", path: `${P}/fuels/ethanol-free-petrol/`, hi: true, type: "Explainer", wave: 2,
    queries: ["ethanol free petrol india", "e0 petrol available", "ethanol free petrol pump near me", "E20 se bachne ke liye e0 petrol"],
    brief: "Scope: Is ethanol-free petrol sold in India? What the government has said. Sources: PIB and Parliament answers 2025-26 on E20 and ethanol-free petrol; MoPNG; BIS specification; only what is stated, with dates.",
  },
];

applyTranslations(PUMP_PAGES, PUMP_TRANSLATIONS);
