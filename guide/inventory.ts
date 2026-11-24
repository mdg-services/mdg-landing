/**
 * Every page of the guides to the Marketing Discipline Guidelines 2024
 * (mdgservices.in/guides/, Hindi at /hi/guides/), in release order of
 * priority. This list is the single source of truth: the page builder
 * (src/guides/), the release schedule (guide/schedule.ts), the sitemap and
 * proxy.ts all read it.
 *
 * A page's words live in guide/content/<lang>/<id>.md. `hi: true` means a Hindi
 * twin exists at "/hi" + path and must have a file in guide/content/hi/.
 *
 * `brief` is the writer's scope: what the page must cover and which clauses it
 * draws on. It never reaches the site.
 */

import { prefixOf, type Lang } from "../src/i18n/languages.ts";
import { MDG_TRANSLATIONS, applyTranslations } from "./translations.ts";

export type { Lang };

export type Pillar =
  | "hub"
  | "penalties"
  | "inspection"
  | "density"
  | "stock"
  | "quantity"
  | "tanker"
  | "sampling"
  | "service"
  | "automation"
  | "company"
  | "sko"
  | "tools";

export type PageType =
  | "Hub"
  | "Pillar"
  | "Explainer"
  | "Checklist"
  | "Template"
  | "Tool"
  | "Glossary"
  | "Comparison"
  | "Updates"
  | "Legal"
  // used by the Khata Kavach pages (kk-guide/inventory.ts)
  | "Feature"
  | "Trade"
  | "Example";

export interface GuidePage {
  /** File name in guide/content/<lang>/, and the id used by [text](@id) links. */
  id: string;
  pillar: Pillar;
  /** English path, with trailing slash. The Hindi twin lives at "/hi" + path. */
  path: string;
  hi: boolean;
  /** Further languages the page is also written in (set from guide/translations.ts, off the drip). */
  more?: Lang[];
  type: PageType;
  wave: 1 | 2 | 3;
  /** Real searches (Google / YouTube suggestions, Oct 2026) this page answers. */
  queries: string[];
  clauses: string;
  /** Explainer video ids (like `gen-dod-clock`, no -hi / -en suffix); each is the page /videos/<slug> on this site. */
  videos?: string[];
  brief: string;
}

export interface PillarMeta {
  en: string;
  hi: string;
  /** The name in further languages (guide/copy.or.ts and friends fill it in). */
  names?: Partial<Record<Lang, string>>;
  /** id of the pillar's main page */
  main: string;
}

export const PILLARS: Record<Pillar, PillarMeta> = {
  hub: { en: "Guides", hi: "गाइड", main: "hub" },
  penalties: { en: "Penalties", hi: "जुर्माना और कार्रवाई", main: "penalties" },
  inspection: { en: "Inspections and notices", hi: "निरीक्षण और नोटिस", main: "inspection" },
  density: { en: "Density and quality", hi: "डेंसिटी और क्वालिटी", main: "density" },
  stock: { en: "Stock variation", hi: "स्टॉक वेरिएशन", main: "stock-variation" },
  quantity: { en: "Meters and seals", hi: "मीटर और सील", main: "quantity" },
  tanker: { en: "Receiving a tanker", hi: "टैंकर उतारना", main: "receiving-a-tanker" },
  sampling: { en: "Samples and labs", hi: "सैंपल और लैब", main: "sampling" },
  service: { en: "Customer facilities", hi: "ग्राहक सुविधाएँ", main: "customer-service" },
  automation: { en: "Automated outlets", hi: "ऑटोमेटेड आउटलेट", main: "automation" },
  company: { en: "Oil company duties", hi: "तेल कंपनी की ज़िम्मेदारियाँ", main: "oil-company-duties" },
  sko: { en: "Kerosene dealers", hi: "केरोसिन डीलर", main: "sko-dealers" },
  tools: { en: "Tools", hi: "टूल", main: "tools-density-at-15" },
};

/** The explainer videos shown on guide pages, by id: the title in each language. The page is /videos/<id without gen->. */
export const VIDEOS: Record<string, { en: string; hi: string }> = {
  "gen-daily-books": { en: "Three books by 10 am", hi: "दस बजे तक तीन किताबें" },
  "gen-density-15": { en: "The density on the invoice", hi: "इनवॉइस पर लिखी डेंसिटी" },
  "gen-stock-variation": { en: "Two allowances, not one", hi: "छूट एक नहीं, दो हैं" },
  "gen-plus-vs-minus": { en: "Over and short", hi: "ज़्यादा और कम" },
  "gen-inspection-window": { en: "The count starts again", hi: "गिनती फिर से शुरू" },
  "gen-cumulative-column": { en: "Sales this month", hi: "महीने की बिक्री वाला कॉलम" },
  "gen-tanker-day": { en: "Which day does the tanker belong to?", hi: "टैंकर किस दिन का है?" },
  "gen-testing-litres": { en: "The testing litres", hi: "जाँच का तेल" },
  "gen-du-seals": { en: "Seals and the certificate", hi: "सील और सर्टिफ़िकेट" },
  "gen-prove-the-meter": { en: "Prove it with the slip", hi: "पर्ची से जाँच" },
  "gen-decantation": { en: "Decant a tanker properly", hi: "टैंकर सही तरीक़े से उतारिए" },
  "gen-dip-settle": { en: "Let the tank settle", hi: "टैंक को ठहरने दीजिए" },
  "gen-invoice-vs-decant": { en: "Invoice litres, dip litres", hi: "बिल के लीटर, डिप के लीटर" },
  "gen-water-dip": { en: "The water dip", hi: "पानी का डिप" },
  "gen-wall-papers": { en: "The wall before the books", hi: "पहले दीवार, फिर किताब" },
};

export const PAGES: GuidePage[] = [
  // ── The whole document ───────────────────────────────────────────────
  {
    id: "hub", pillar: "hub", path: "/guides/", hi: true, type: "Hub", wave: 1,
    queries: ["mdg guidelines", "mdg 2024", "marketing discipline guidelines 2024", "mdg full form in petrol pump", "petrol pump ke niyam", "पेट्रोल पंप के नियम"],
    clauses: "Whole document",
    brief: "The front door. What MDG is (Marketing Discipline Guidelines, first framed 1981-82; MDG 2024 effective 24.10.2024; issued jointly by the public-sector oil companies for RO and SKO dealerships), who it binds and why (dealership agreement), how it is organised (8 chapters, 13 annexures), the three classes of irregularity in one line each, and a guided tour of every section of this guide. The topic list itself is generated by the template, so write the framing, not a link list. The Hindi version is the 'पेट्रोल पंप के नियम' page: use that phrase prominently.",
  },
  {
    id: "official-pdf-and-updates", pillar: "hub", path: "/guides/official-pdf-and-updates/", hi: true, type: "Updates", wave: 1,
    queries: ["mdg 2024 pdf", "mdg 2024 iocl", "mdg 2024 bpcl", "mdg 2024 amendment", "mdg guidelines 2025", "mdg guidelines 2026"],
    clauses: "Cover page; OMC circular of 20.03.2025",
    brief: "Where to read the official text (link to IndianOil's and BPCL's PDFs; we do not host a copy), version and effective date, what each chapter covers in one line, and a dated log of circulars issued under MDG 2024 that we know of (the 20.03.2025 Minimum Service Obligations circular). Explain that MDG 2012 (last amended 30.11.2022) was replaced. Tell readers to check their oil company for circulars we may not have.",
  },
  {
    id: "glossary", pillar: "hub", path: "/guides/glossary/", hi: true, type: "Glossary", wave: 1,
    queries: ["mdg full form", "mdg meaning", "nano petrol pump", "mpd full form", "hsd full form"],
    clauses: "Whole document",
    brief: "Alphabetical glossary of every abbreviation and term in MDG 2024 a dealer meets: MDG, OMC, RO, SKO, LDO, MS, HSD, DU, MPD, ATG, VTS, GPS, TLF, TL/TT, SL, NANO, RSP, DSM, CA/CSA, W&M, PESO, IQCM, BIS, FTL, SLC, TVA, PDS, PMSBY, PMJJBY, Darpan QR, Whatman 2, ASTM Table 53B, density at 15°C, totaliser, proof level, dip rod, water finding paste, 3-tier sampling, reference density, composite density, show cause notice, speaking order, critical/major/minor irregularity, instance. One or two plain sentences each, clause reference where the term is defined or used.",
  },
  {
    id: "disclaimer", pillar: "hub", path: "/guides/disclaimer/", hi: true, type: "Legal", wave: 1,
    queries: [],
    clauses: "—",
    brief: "The full disclaimer for the guide. Written from the legal research, not by a page writer.",
  },
  {
    id: "mdg-2012-vs-2024", pillar: "hub", path: "/guides/mdg-2012-vs-2024/", hi: true, type: "Comparison", wave: 2,
    queries: ["mdg 2012", "marketing discipline guidelines 2012", "mdg guidelines 2012", "mdg 2012 vs 2024"],
    clauses: "MDG 2012 (Ver. 7, 30.11.2022) vs MDG 2024",
    brief: "Clause-by-clause comparison of what changed for dealers between MDG 2012 as last amended (Ver. 7, 30.11.2022) and MDG 2024. Read both texts side by side. Lead with the changes that move money or risk: clean toilet moved from major (Rs 15,000 / 25,000 / 35,000 or 45% of margin + 7 days) to minor in 2024; short delivery with W&M seals intact moved from major (Rs 25,000 per nozzle...) to minor; wage non-payment clause; toilet protocol additions (accessible to all customers and transit travellers, Darpan QR); customer service standards 5.1.18; anything else you find. A table of changes, then detail. Only state a change you have read in both texts.",
  },

  // ── Penalties ────────────────────────────────────────────────────────
  {
    id: "penalties", pillar: "penalties", path: "/guides/penalties/", hi: true, type: "Pillar", wave: 1,
    queries: ["mdg penalty", "mdg penalty meaning", "mdg irregularities", "petrol pump penalty", "petrol pump suspended"],
    clauses: "5.1, 8.1–8.4",
    brief: "The complete penalty table of MDG 2024: every critical (8.2, termination at first instance), major (8.3: 15 days, 30 days, termination; branded fuel: differential price then termination; automation: Rs 1,00,000, then Rs 2,00,000 + 7 days, then termination) and minor (8.4: warning-cum-guidance letter, Rs 10,000, Rs 25,000 per irregularity; a-h counted as one) irregularity, each linked to its chapter-5 definition. Explain 'instance' (5-year cycle, 8.5.5), compounding (8.5.3), actions are minimum (8.5.1), irregularity must be established first (8.5.2). One worked example of an outlet with two findings on the same day.",
  },
  {
    id: "penalties-classes", pillar: "penalties", path: "/guides/penalties/critical-major-minor/", hi: true, type: "Explainer", wave: 2,
    queries: ["mdg irregularities", "critical irregularity mdg", "major irregularity petrol pump", "minor irregularity petrol pump", "is dirty toilet major or minor"],
    clauses: "5.1.1–5.1.18, 8.1–8.4, 8.5.4, 8.10",
    brief: "Is my lapse critical, major or minor? A lookup table grouped by OUR OWN topics (fuel quality; meters, seals and quantity; stock, sources and records; prices, displays and service; automation; inspections and samples), never in the order of 8.2/8.3/8.4. Columns: what goes wrong (about 12 words), class, link to the detail page. Collapse the display and service items into two rows. One line pointing to the action ladders on the penalties page, {{penalty-note}} once, one line that matters MDG does not name are decided after an enquiry (8.5.4), one line linking the 2012-vs-2024 page, a pointer for kerosene dealers (8.10), and the legal ending line. About 450 words incl. 3 FAQs.",
  },
  {
    id: "penalties-repeat-and-unpaid", pillar: "penalties", path: "/guides/penalties/repeat-offences-and-unpaid-fines/", hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump suspended", "mdg second instance", "petrol pump fine not paid"],
    clauses: "8.5.3, 8.5.5, 8.7",
    brief: "How the first/second/third instance is counted (5 years back from the date the irregularity is established; instances under the previous MDG within 5 years count), what happens when several irregularities are found together (each counted, compounding), and the unpaid-fine rule in 8.7 (pay within 30 days; suspension from day 31 for 15 days; another 15 days; then termination). Worked example with dates.",
  },
  {
    id: "penalties-unpaid-fines", pillar: "penalties", path: "/guides/penalties/unpaid-fines/", hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump fine not paid", "mdg fine payment 30 days", "petrol pump suspended for non payment of fine"],
    clauses: "8.3, 8.4, 8.7, 8.9",
    brief: "What happens if a fine is not paid within 30 days (8.7): which fines it covers (fine-only steps: minor Rs 10,000 / Rs 25,000, first automation step Rs 1,00,000; MDG does not say whether differential-price recovery counts, ask the oil company); due within 30 days of the notice; from day 31 suspension of sales and supplies for 15 days, then 15 more, then termination. One dated timeline from a made-up notice (illustration), noting MDG does not say whether the notice day counts. Appeal only for termination, within 30 days of the order (8.9). Legal ending line. About 430 words incl. 3 FAQs.",
  },
  {
    id: "penalties-branded-fuel-overcharging", pillar: "penalties", path: "/guides/penalties/branded-fuel-and-overcharging/", hi: true, type: "Explainer", wave: 3,
    queries: ["petrol pump overcharging complaint", "normal petrol sold as power petrol"],
    clauses: "5.1.10, 5.1.13, 5.1.15, 8.3",
    brief: "Two money irregularities: intentionally selling normal MS/HSD as branded fuel (major; first instance recovery of the differential price since last inspection, second termination) and overcharging above the authorised selling price of MS/HSD/CNG/Auto LPG (major; 15 days, 30 days, termination), plus the minor duty to display RSP. What a dealer should do to stay safe.",
  },

  // ── Inspections and notices ──────────────────────────────────────────
  {
    id: "inspection", pillar: "inspection", path: "/guides/inspection/", hi: true, type: "Pillar", wave: 1,
    queries: ["petrol pump inspection", "petrol pump inspection format", "petrol pump inspection report", "petrol pump inspection officer", "petrol bunk inspection"],
    clauses: "1.5, 2.2.2.2, 2.4, 5.1.8, 5.1.12, 8.7",
    brief: "What happens at an inspection: who may inspect (OMC officials, mobile labs, joint industry teams, authorised agencies, statutory authorities; 8.7 says findings by government authorities count too), what they check (records, density, 5-litre test, seals, stock, facilities, the 20-point minimum service obligations), random sampling covering at least 2% of outlets a month, refusal is a major irregularity (5.1.8), what happens after (show cause within 30 days). A walk-through of a typical visit, without inventing any procedure not in the text.",
  },
  {
    id: "inspection-minimum-service-obligations", pillar: "inspection", path: "/guides/inspection/minimum-service-obligations/", hi: true, type: "Checklist", wave: 1,
    queries: ["petrol pump inspection checklist", "customer service standards petrol pump", "minimum service obligation petrol pump"],
    clauses: "5.1.18; OMC circular of 20.03.2025",
    brief: "The 20-point Customer Service Standards / Minimum Service Obligations list from the OMC circular dated 20.03.2025 under MDG 2024 clause 5.1.18, checked YES/NO at inspection. List all 20 in plain words with what 'compliant' looks like and the MDG clause each ties to; explain deficiency attracts minor-irregularity action (5.1.18); note dealers are asked to acknowledge the circular in writing.",
  },
  {
    id: "inspection-records-to-keep", pillar: "inspection", path: "/guides/inspection/records-to-keep/", hi: true, type: "Checklist", wave: 1,
    queries: ["petrol pump record", "petrol pump stock register", "density register", "records to be maintained at petrol pump"],
    clauses: "1.2(xiii)–(xiv), 1.3, 1.4, 1.5(iv)–(vi), 5.1.12, 8.3(v), 8.4(i)",
    videos: ["gen-daily-books"],
    brief: "Every record and document MDG 2024 requires, and how long to keep it (5.1.12: daily sales register and density register for current and previous financial year; pump maintenance records same; inspection records 5 years; purchase invoices and sales bills current and previous FY; licences; anything specified by OMC in writing), plus the daily entries (meter readings, product and water dips each morning, morning density, testing quantity, after-decant density, entries on invoices). Missing records since last inspection = major; only older records missing = minor.",
  },
  {
    id: "inspection-show-cause-notice", pillar: "inspection", path: "/guides/inspection/show-cause-notice/", hi: true, type: "Explainer", wave: 1,
    queries: ["show cause notice petrol pump", "mdg show cause reply", "show cause notice reply format petrol pump"],
    clauses: "8.5.2, 8.5.6–8.5.8, 8.6, 8.7",
    brief: "The timeline after an irregularity: notice within 30 days of inspection (or within 30 days of test results when samples were drawn), issued with all reports it relies on; 10 days to reply; reasoned 'speaking order' preferably within 45 days of the reply; personal hearing before termination for critical irregularities (one more chance if missed, then ex parte); fines payable in 30 days (8.7). A dated example timeline table. General information only: say a lawyer should be consulted for a specific notice. Do not draft a reply template.",
  },
  {
    id: "inspection-appeal", pillar: "inspection", path: "/guides/inspection/appeal-against-termination/", hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump termination", "dealership termination appeal", "petrol pump lease termination"],
    clauses: "8.6, 8.8, 8.9",
    brief: "Who approves action (8.8: termination/critical by Regional/State/Zonal head GM and above, SC/ST terminations by Director (Marketing); major: State Retail Head for IOC, DGM-and-above for BPC/HPC; minor: Territory/Regional/Divisional head) and the appeal route (8.9: within 30 days of receiving the order, through the divisional/territory/regional office; decided preferably within 90 days; appellate authority ED (Retail) at HO or nominated ED, a committee of 2 EDs if an ED terminated; SC/ST: committee of two Directors other than Director Marketing). General information, consult a lawyer.",
  },

  // ── Density and quality ──────────────────────────────────────────────
  {
    id: "density", pillar: "density", path: "/guides/density/", hi: true, type: "Pillar", wave: 1,
    queries: ["petrol pump density", "petrol pump density kya hota hai", "petrol pump density check", "petrol pump density board"],
    clauses: "1.2(iv), 1.2(viii), 1.2(xiv), 1.4.1, 2.10, 5.1.9, 5.1.17, Annexure 1",
    brief: "Every density rule in one place: what density at 15°C is and why the 15°C reference (ASTM Table 53B conversion), the four moments a dealer measures it (each compartment on receipt within ±3.0 kg/m³ of invoice density; after decant once 50 litres have gone through the pump; every morning before sales and by 10 AM; on demand), the density register (Annexure 1), displaying density (5.1.17, minor), the equipment the dealer must keep (calibrated hydrometers, thermometers, ASTM table, 1.5(vi)), and what an inspector compares against. Link down to each density page.",
  },
  {
    id: "density-range", pillar: "density", path: "/guides/density/petrol-diesel-density-range/", hi: true, type: "Explainer", wave: 1,
    queries: ["petrol pump me density kitni honi chahiye", "petrol pump density range", "density of petrol at 15 c", "petrol pump density chart", "what should be the density of petrol", "diesel density range"],
    clauses: "7.6 (MS and HSD clinical test tables)",
    brief: "The specification ranges at 15°C from the clinical test tables in 7.6: MS (MG/E5-E20 grades) 720–775 kg/m³; HSD BS VI up to B7 810–845 kg/m³; biodiesel blends B8–B20 820–860 kg/m³; colours (MG 91 orange, MG 95 red, MG 98 green for E20 table as printed). Explain that being inside the range is NOT the dealer's test: the dealer's test is against the invoice density (±3.0) and against the reference density. Explain why density moves with temperature. Note Assam-crude relaxation footnote. Answer the Hinglish question directly.",
  },
  {
    id: "density-reference-10am", pillar: "density", path: "/guides/density/reference-density-10am/", hi: true, type: "Explainer", wave: 1,
    queries: ["petrol pump density check", "reference density petrol pump", "morning density petrol pump"],
    clauses: "1.2(xiv), 1.4.1(c), 2.10, 5.1.9, 8.3(ii)",
    brief: "The reference-density rule: morning density from the nozzle before sales and by 10 AM; composite density after each decant once at least 50 litres dispensed; which figure the inspector asks for depending on time of inspection and whether a load came (5.1.9 a/b/c, as a table); consequences (sales and supplies of all products suspended, samples to lab; sample passes = major irregularity: 15 days / 30 days / termination; sample fails = adulteration, critical); mobile lab variant. Worked example.",
  },
  {
    id: "density-invoice-check", pillar: "density", path: "/guides/density/invoice-density-check/", hi: true, type: "Explainer", wave: 2,
    queries: ["invoice density", "how to calculate density of petrol", "tanker density check"],
    clauses: "1.1(v), 1.2(iv), 1.2(viii)–(x), 2.2.1(iv), 2.10, 3.1(h)",
    videos: ["gen-density-15"],
    brief: "Checking tanker product against the density printed on the invoice: supply location records density at 15°C on the invoice (2.2.1(iv), 3.1(h)); dealer draws a sample from each compartment after draining about 20 litres from the manifold, measures density and temperature, converts with ASTM Table 53B and accepts if within ±3.0 kg/m³ (1.2(iv), (viii)); records per compartment; what to do if outside (contact supply location / field officer, 1.2(ix)); reference density until decant is the invoice figure (2.10). Worked example with a plausible observed reading, clearly labelled illustrative, and do not invent a conversion: tell readers to use the ASTM table.",
  },
  {
    id: "density-filter-paper", pillar: "density", path: "/guides/density/filter-paper-test/", hi: true, type: "Explainer", wave: 2,
    queries: ["filter paper test petrol", "filter paper test for petrol whatman", "petrol quality check at pump"],
    clauses: "1.4.1(a), 2.2.2.2, 2.5(K)",
    brief: "The Whatman No. 2 filter paper the dealer must keep for MS, made available to customers on demand, with a message on the Customer Education board (1.4.1(a)); failure leads OMCs to draw samples (2.2.2.2) and density/filter paper failure suspends sales and supplies of all products (2.5(K)). Describe only what MDG says; if describing how the test is commonly done, label it general practice, not MDG text.",
  },
  {
    id: "density-register", pillar: "density", path: "/guides/density/density-register/", hi: true, type: "Template", wave: 3,
    queries: ["density register", "petrol pump density register format"],
    clauses: "1.2(xiv), 1.4.1(c), 5.1.12, Annexure 1",
    brief: "The density register: what goes in it (Annexure 1 columns as printed — read the annexure page in the source), when entries are made (each receipt, after decant, every morning), how long to keep it (current and previous FY), and a filled example row set labelled as an example. Present the columns as a table the dealer can copy into a register.",
  },

  // ── Stock variation ──────────────────────────────────────────────────
  {
    id: "stock-variation", pillar: "stock", path: "/guides/stock-variation/", hi: true, type: "Pillar", wave: 1,
    queries: ["petrol pump stock variation", "permissible stock variation", "petrol pump stock variation kya hai", "stock loss petrol pump"],
    clauses: "1.3, 5.1.11, 8.3(iv), Annexures 8–10",
    videos: ["gen-stock-variation", "gen-inspection-window"],
    brief: "Permissible stock variation under 5.1.11: normal operational variation of 4% of tank stock, plus evaporation/handling losses (MS 0.75% of quantity sold up to an annual average of 600 KL and 0.60% beyond; HSD 0.25% and 0.20%), plus shrinkage and temperature variation (TVA) only where applicable (Annexures 8–10). Positive variation beyond limits: samples, all sales and supplies suspended, study of reasons; negative: sales continue during investigation, explanation called, supply suspended if unsatisfactory. Beyond limits with sample passing = major (8.3(iv)). Read Annexures 8–10 and reproduce their illustrations' method faithfully; do not invent a formula the annexures do not show.",
  },
  {
    id: "stock-positive-negative", pillar: "stock", path: "/guides/stock-variation/positive-vs-negative/", hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump stock variation", "excess stock petrol pump", "stock gain petrol pump"],
    clauses: "5.1.11",
    videos: ["gen-plus-vs-minus"],
    brief: "Why the direction matters: positive variation beyond limits suggests product from an unauthorised source or adulteration, so all sales and supplies stop at once and samples go to the lab (sample fails = adulteration; passes but unauthorised purchase established = that irregularity); negative variation beyond limits lets sales continue while the dealer explains. Common innocent causes of each (temperature, wrong dip, meter error, testing litres not recorded) labelled as general practice.",
  },
  {
    id: "stock-daily-register", pillar: "stock", path: "/guides/stock-variation/daily-stock-register/", hi: true, type: "Template", wave: 2,
    queries: ["petrol pump stock register", "petrol pump stock register excel", "petrol pump stock statement", "stock register format petrol pump"],
    clauses: "1.2(xiii), 1.3, 1.4.1(b), 1.4.2(d), 5.1.12",
    videos: ["gen-cumulative-column", "gen-tanker-day"],
    brief: "The daily stock register provided by the company (1.3(ii)): morning meter readings and product and water dips of each tank recorded separately (1.3), water dip daily (1.4.1(b)), testing quantity recorded (1.4.2(d)), receipts entered after decant (1.2(xiii)), display of opening stock (1.3(i)). A model layout as a table labelled 'example layout' since MDG says the company provides the register. Keep for current and previous FY.",
  },
  {
    id: "stock-shrinkage-tva", pillar: "stock", path: "/guides/stock-variation/shrinkage-and-tva/", hi: true, type: "Explainer", wave: 3,
    queries: ["shrinkage allowance petrol pump", "temperature variation allowance petrol", "tva loss petrol pump"],
    clauses: "5.1.11(iii), Annexures 8, 9, 10",
    brief: "Shrinkage allowance and temperature variation allowance (TVA) as set out in Annexures 8, 9 and 10, applicable only where and when allowed. Walk through each annexure's sample calculation step by step with its own figures, quoting the method faithfully. Read those annexure pages fully.",
  },

  // ── Meters and seals ─────────────────────────────────────────────────
  {
    id: "quantity", pillar: "quantity", path: "/guides/quantity/", hi: true, type: "Pillar", wave: 2,
    queries: ["petrol pump checking", "short delivery petrol pump", "petrol pump meter"],
    clauses: "1.4.2, 4.1–4.3, 5.1.2–5.1.4, 8.2, 8.4",
    brief: "Quantity rules: daily W&M and totaliser seal check and valid W&M certificate (1.4.2(a)); the 5-litre measure (1.4.2(b)); stamped lube measures (1.4.2(c)); daily nozzle check (1.4.2(d)); leak checks (1.4.2(e)); zero before delivery (1.4.2(f)); recalibration through W&M (4.3(a)); short delivery with seals intact (minor) vs seals tampered (critical); totaliser tampering and unauthorised fittings/software (critical). Link down.",
  },
  {
    id: "quantity-5-litre-test", pillar: "quantity", path: "/guides/quantity/5-litre-test/", hi: true, type: "Explainer", wave: 1,
    queries: ["petrol pump testing kaise kare", "petrol pump 5 litre test", "petrol pump checking", "5 litre measure petrol pump"],
    clauses: "1.4.2(b), 1.4.2(d), 4.3(a), 5.1.2(a), 8.4(iii)(h)",
    videos: ["gen-testing-litres"],
    brief: "The 5-litre test: W&M-verified 5 litre measure kept for exclusive pump testing; every nozzle checked daily before sales; testing quantity recorded in the stock register; any variation reported to W&M and the oil company, and the DU not operated until re-stamped (1.4.2(d)). At inspection: within the permissible limit noted in 5.1.2(a) (between ±10 ml and ±25 ml per 5 litres) it is recorded, sales continue, but recalibration and re-stamping must be done within 15 days or sales from that nozzle are suspended; beyond the Legal Metrology limit, sales through the nozzle stop until recalibrated. Short delivery with seals intact is a minor irregularity in MDG 2024. Do not describe test technique beyond MDG unless labelled general practice.",
  },
  {
    id: "quantity-seals", pillar: "quantity", path: "/guides/quantity/wm-and-totaliser-seals/", hi: true, type: "Explainer", wave: 2,
    queries: ["totalizer seal", "petrol pump seal", "weights and measures seal petrol pump"],
    clauses: "1.4.2(a), 4.3(a), 5.1.2(b), 5.1.3, 5.1.4, 8.2",
    videos: ["gen-du-seals"],
    brief: "W&M seals on metering unit and totaliser: when a seal is deemed tampered (missing, different seal, broken wire, other manipulation), W&M's opinion is final, penal action even if delivery is correct or excess; totaliser tampering includes making it non-functional or not reporting a non-working totaliser; unauthorised fittings, chips, electronic parts or OEM software changes are tampering (OEM opinion). All critical: termination at first instance; DU sealed, samples drawn. Daily dealer check and immediate suspension + report if found tampered (1.4.2(a)).",
  },
  {
    id: "quantity-zero-before-delivery", pillar: "quantity", path: "/guides/quantity/zero-before-delivery/", hi: true, type: "Explainer", wave: 3,
    queries: ["petrol pump zero check", "petrol pump fraud", "how to check petrol pump cheating"],
    clauses: "1.4.1(a), 1.4.2(f), 1.6, 5.1.17, circular 20.03.2025 item 3",
    videos: ["gen-prove-the-meter"],
    brief: "What a customer can check and ask for under MDG, written for both customers and the dealer who must provide it: zero shown before each delivery and a sticker saying so on each pump (1.4.2(f), 5.1.17), closing reading shown after delivery (circular item 3), filter paper on demand, 5-litre check on request is commonly offered (label as practice unless MDG says so), complaint book, contact numbers, displayed density and prices. What each failure costs the dealer.",
  },

  // ── Receiving a tanker ───────────────────────────────────────────────
  {
    id: "receiving-a-tanker", pillar: "tanker", path: "/guides/receiving-a-tanker/", hi: true, type: "Pillar", wave: 2,
    queries: ["tank lorry decantation", "tanker decantation", "tanker decantation meaning", "decant tank meaning", "tank lorry under decantation"],
    clauses: "1.1, 1.2(i)–(xiv), 1.5(vii), 2.3",
    videos: ["gen-decantation", "gen-dip-settle", "gen-invoice-vs-decant"],
    brief: "The full receipt checklist in order: match invoice details (1.1: TL number, seal/lock numbers, compartments and quantity, time left supply point, density at 15°C, dip rod and calibration certificate); park level and settle 10 minutes, earthing/bonding, DCP extinguisher, no plastic/PVC hoses (1.2(i)); seals vs invoice (ii); release master valves (iii); density check (iv); calibration certificate (v); W&M marks on dip rod (vi); dips and water finding paste in every compartment, stop sales from that tank (vii); compartment samples (viii); doubt → supply location (ix); bottom retention samples (x); short dip handling (xi); fully empty (xii); entries (xiii); after-decant density (xiv). Also VTS monitoring (1.5(vii)) and driver refusing to sign (2.3 notes). A numbered checklist is right here because the order is real.",
  },
  {
    id: "tanker-short-dip-water", pillar: "tanker", path: "/guides/receiving-a-tanker/short-dip-and-water/", hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump dip", "dip rod", "dip chart", "tank lorry short delivery", "water in tanker"],
    clauses: "1.2(vi), 1.2(vii), 1.2(xi), 1.4.1(b), 4.4",
    videos: ["gen-water-dip"],
    brief: "When a compartment dips short against the calibration certificate or water is found with water finding paste: make up the shortage (including water removed) by filling to the correct level through the dispensing pump; record chamber-wise observed dip and quantity filled on the back of all invoice copies; if the RO is dry, measure the shortage by drawing from another compartment with a calibrated measure; dealer/representative and driver both sign (1.2(xi)). Water in RO tanks: daily water dip, report immediately (1.4.1(b)); maintenance representative checks water on every visit (4.4).",
  },
  {
    id: "tanker-water-finding-paste", pillar: "tanker", path: "/guides/receiving-a-tanker/water-finding-paste/", hi: true, type: "Explainer", wave: 2,
    queries: ["water finding paste", "water finding paste for ethanol", "water finding paste for diesel", "water finding paste for petroleum"],
    clauses: "1.2(vii), 1.4.1(b), 4.3(c)",
    brief: "MDG requires checking each compartment for water with water finding paste and, for ethanol-blended motor spirit, a suitable paste (1.2(vii)); daily water dip in RO tanks (1.4.1(b)); ethanol content check after water removal (4.3(c), Annexure 7 method). Explain why ordinary paste can mislead with ethanol blends (phase separation) only as general knowledge, clearly labelled. No brand recommendations.",
  },
  {
    id: "tanker-vts", pillar: "tanker", path: "/guides/receiving-a-tanker/vts-and-route-deviation/", hi: true, type: "Explainer", wave: 3,
    queries: ["vts petrol pump", "tank lorry gps", "tank lorry route deviation"],
    clauses: "1.5(vii), 2.3 notes, 3.2",
    brief: "Vehicle tracking: supply locations must not fill a TL without working VTS; deviation reports cover time and route and are visible to the dealer (3.2); dealer must monitor via the link and, on deviation, inform the supply location before accepting and act on OMC instructions (1.5(vii), 2.3 note ii); dealers may witness filling for ex-MI supplies and accompany the TL (3.2).",
  },

  // ── Samples and labs ─────────────────────────────────────────────────
  {
    id: "sampling", pillar: "sampling", path: "/guides/sampling/", hi: true, type: "Pillar", wave: 1,
    queries: ["3 tier sampling", "3 tier sampling petrol pump", "tank lorry retention sample", "petrol pump sample"],
    clauses: "Chapter 2, 7.5",
    brief: "3-tier sampling explained correctly (other sites get it wrong): the purpose (2.1), the three samples (supply location retention sample, tank lorry retention sample kept by the dealer, RO nozzle sample drawn by the inspector), how the lab compares RO vs TL1 vs SL1 and then TL2/SL2 (2.5(G)), who may draw samples and when (2.2, 2.4: MS six 1-litre samples per tank split 2/2/2; HSD three split 1/1/1), containers, seals and labels (2.6–2.8), retention (2.9), timelines (2.10: lab within 10 days, tested within 15, result to dealer within 5), interpretation (reproducibility limits). Diagram-like table of who holds which sample.",
  },
  {
    id: "sampling-inspector-samples", pillar: "sampling", path: "/guides/sampling/inspector-samples/", hi: true, type: "Explainer", wave: 2,
    queries: ["who can take fuel sample from petrol pump", "how many samples does an inspector take petrol pump", "nozzle sample petrol pump", "does inspector pay for fuel sample"],
    clauses: "2.2.2.2, 2.4, 2.4.1–2.4.3, 2.5(C), 5.1 Note (ii), 5.1.8, 8.3, Chapter 2 General Notes (4)",
    brief: "When an inspector or mobile lab samples the pump: who may (company officials, mobile labs, authorised agencies, other empowered authorities, joint industry teams); when (random sampling of at least 2% of outlets a month, stock variation past the limit, failed density or filter paper test, special drives, complaints); the non-2T nozzle rule; bottles (6 x 1 L per MS tank, 3 x 1 L per HSD tank, split three ways: dealer, oil company office, lab); what goes to the lab together; the sealed box goes into custody under a joint memo; payment and cash memo; refusing is a major irregularity with {{penalty-note}}. One short example (illustration). About 500 words incl. FAQs.",
  },
  {
    id: "sampling-retention", pillar: "sampling", path: "/guides/sampling/retention-samples/", hi: true, type: "Explainer", wave: 2,
    queries: ["tank lorry retention sample", "retention sample petrol pump"],
    clauses: "1.2(x), 2.3, 2.5(B)–(E), 2.9.2, Notes to 5.1",
    brief: "The dealer's tank-lorry retention samples: 2x1 litre MS and/or 1x1 litre HSD bottom composite samples per load, rinsed aluminium containers, sealed and labelled (Annexure 3), signed by dealer and driver, tank number marked; keep the last two loads for each tank; transporter may take a set against a Rs 300 per container deposit; if the driver refuses to sign, do not decant. If not available at inspection, a later-produced sample is not considered and the RO sample is compared with the supply point sample, action against the dealer only (2.5(E)).",
  },
  {
    id: "sampling-failed", pillar: "sampling", path: "/guides/sampling/sample-failed/", hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump adulteration", "fuel sample fail petrol pump", "petrol pump sample fail what next"],
    clauses: "2.5(F)–(M), 2.10, 5.1.1, 8.2",
    brief: "What happens when a sample fails: definition of adulteration (5.1.1, BIS specs IS 2796/17586/17021 and IS 1460/16531, reproducibility), lab compares RO, TL1, SL1 then TL2/SL2; results to dealer preferably within 30 days; dealer may ask within 10 days of receiving the report for his retained sample and the OMC counter sample to be tested at a PSU lab of his choice in the same or nearby state or FTL Noida, at his cost, decision binding; transporter's right; handling of adulterated product (sent to refinery, costs recovered from dealer, paid furnace-oil value) or full value if transporter at fault; adulteration is critical (termination). Timelines are administrative (2.5(L)); no parallel investigations (2.5(M)).",
  },
  {
    id: "sampling-adulteration", pillar: "sampling", path: "/guides/sampling/adulteration/", hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump adulteration", "adulteration meaning petrol pump", "penalty for adulteration petrol pump", "adulterated fuel in tank who pays"],
    clauses: "5.1.1, 8.2, 8.5.1, 8.5.2, 8.6, 8.9",
    brief: "What MDG 2024 counts as adulteration (the three alternative parts of 5.1.1; name IS 2796 / 17586 / 17021 for MS and IS 1460 / 16531 for HSD and tell the reader to check the current version), critical irregularity with termination at the first instance and {{penalty-note}}, one line each on the personal hearing (8.6) and appeal (8.9) with links, and a 2-row table on who pays for the fuel (proven at the outlet vs by the transport contractor). Legal ending line. No worked example. About 450 words incl. FAQs.",
  },
  {
    id: "sampling-mobile-lab", pillar: "sampling", path: "/guides/sampling/mobile-lab/", hi: true, type: "Explainer", wave: 2,
    queries: ["mobile lab petrol pump", "mobile laboratory fuel testing"],
    clauses: "2.4.4, Chapter 7, Annexures 11–13a",
    brief: "Mobile labs: surprise checks of MS/HSD/lube, deployment by the State Level Coordinator, industry logo; nozzle samples of all tanks; clinical tests (MS: appearance, colour, density, distillation; HSD also kinematic viscosity at 40°C) run regardless of density result; payment for samples; on failure, samples follow chapter 2 with the third set going to the OMC, meter and dip readings recorded, sales suspended, five copies of the test report, dealer signs with seal; no corrections to recorded results.",
  },

  // ── Customer facilities ──────────────────────────────────────────────
  {
    id: "customer-service", pillar: "service", path: "/guides/customer-service/", hi: true, type: "Pillar", wave: 2,
    queries: ["petrol pump free facility", "is air filling in petrol pump free", "petrol pump free services", "petrol pump customer rights"],
    clauses: "1.6, 5.1.14, 5.1.15, 5.1.17, 5.1.18, circular 20.03.2025",
    brief: "Everything a dealer must provide customers under MDG 2024 and the March 2025 minimum service obligations: correct quality, quantity and price; air (manned, calibrated gauge); clean toilet; telephone; first aid box with in-date medicines; drinking water (circular); complaint book and its notice; working hours and holiday notices; dealer and OMC contact names and numbers; customer education posters; lighting and housekeeping; safety equipment and trained staff; digital payments (circular). The penalty class for each (mostly minor, 8.4). Write for dealers, but useful to customers too.",
  },
  {
    id: "service-toilet-rules", pillar: "service", path: "/guides/customer-service/toilet-rules/", hi: true, type: "Explainer", wave: 2,
    queries: ["petrol pump toilet rules", "petrol pump toilet rules hindi", "petrol pump toilet rules in india", "petrol pump toilet complaint", "petrol pump toilet for public"],
    clauses: "1.6(vi), 5.1.14(b), 8.4(iii)(g); MDG 2012 Ver. 7 5.1.14(b) and 8.3(vii)",
    brief: "The daily toilet checks in 5.1.14(b) (clean at all times, lighting, flush, water, working latch, signage, accessible to all customers and transit travellers subject to safety, Darpan QR code for feedback; protocol displayed and maintenance sheet kept); what happens at inspection (photo or complaint, letter issued instantly). PENALTY: present BOTH versions in a table — MDG 2024 (current): minor irregularity, warning-cum-guidance letter, then Rs 10,000, then Rs 25,000 per irregularity (8.4); MDG 2012 as amended to 30.11.2022 (replaced on 24.10.2024): major, Rs 15,000, Rs 25,000, then Rs 35,000 or 45% of monthly dealer margin (avg of last 6 months) whichever higher plus 7 days' suspension or until rectified. Explain older news articles quote older versions; tell readers to confirm with their oil company. Mention the Kerala High Court matter on public access (2025 orders) only as 'a court case in Kerala has dealt with public access; check the latest position', with no case details you cannot source from the brief.",
  },
  {
    id: "service-display-boards", pillar: "service", path: "/guides/customer-service/display-boards/", hi: true, type: "Checklist", wave: 2,
    queries: ["petrol pump density board", "petrol pump stock board", "boards required at petrol pump"],
    clauses: "1.3(i), 1.4.1(a), 1.4.2(f), 1.6(iv), 1.6(v), 1.6(viii), 5.1.14(b), 5.1.15, 5.1.17; display-boards source",
    videos: ["gen-wall-papers"],
    brief: "Every board, notice and sticker MDG requires: opening stock and RSP (1.3(i), 5.1.15); density (5.1.17); zero-before-delivery sticker on each pump (1.4.2(f)); product name on each MPD nozzle; complaint book notice (1.6(iv)); working hours and holiday notices (1.6(v)); dealer and OMC contact names and numbers and Customer Service Cell messages (1.6(viii)); customer education poster incl. filter paper message (1.4.1(a)); toilet protocol and maintenance sheet (5.1.14(b)); safety signage (circular item 16). Use the display-boards source document for the list of boards commonly required at an RO (stock board etc.), labelled as from the OMC display-board list, not MDG text. Non-display is minor (8.4).",
  },
  {
    id: "service-first-aid-box", pillar: "service", path: "/guides/customer-service/first-aid-box/", hi: true, type: "Checklist", wave: 3,
    queries: ["petrol pump first aid box", "first aid kit list petrol pump"],
    clauses: "1.6(ix), 5.1.14(a), 8.4(ii); first-aid-kit source",
    brief: "First aid box with necessary valid (in-date) medicinal aids (1.6(ix)); medicines beyond expiry count as non-provision (5.1.14(a), minor). Give the contents list from the first-aid-kit source document, labelled as the OMC list that source shows, and tell readers to confirm the current list with their oil company.",
  },
  {
    id: "service-complaint-book", pillar: "service", path: "/guides/customer-service/complaint-book/", hi: true, type: "Explainer", wave: 3,
    queries: ["petrol pump complaint", "petrol pump complaint number", "petrol pump complaint book"],
    clauses: "1.6(iv), 1.6(viii), 5.1.17, 8.4(iii)(c)",
    brief: "Suggestion/complaint book kept and given on demand with a displayed notice (1.6(iv)); dealer and OMC personnel names and numbers displayed (1.6(viii)); not maintaining or refusing it is minor (5.1.17, 8.4). Tell customers to use the numbers displayed at the outlet and the oil company's official website for helplines; do NOT print any helpline numbers ourselves.",
  },
  {
    id: "service-staff-wages-uniform", pillar: "service", path: "/guides/customer-service/staff-wages-and-uniform/", hi: true, type: "Explainer", wave: 3,
    queries: ["petrol pump staff salary", "minimum wages petrol pump", "pmsby pmjjby petrol pump staff"],
    clauses: "1.5(x), 1.6(iii), 5.1.17, 5.1.18 note, circular items 2 and 8",
    brief: "Staff duties for the dealer under MDG 2024: comply with statutory obligations incl. minimum wages and PMSBY/PMJJBY (1.5(x), note under 5.1.18); driveway salesmen in uniform with badges (5.1.17, minor); courteous behaviour (1.6(iii), circular item 8); DUs manned during working hours (circular item 2); trained staff for safety equipment (1.6(xi)). Mention MDG 2012 had a separate wage-penalty ladder (20%/30%/40% of margin) that is not in MDG 2024 only if confirmed in both texts.",
  },

  // ── Automated outlets ────────────────────────────────────────────────
  {
    id: "automation", pillar: "automation", path: "/guides/automation/", hi: true, type: "Pillar", wave: 2,
    queries: ["nano petrol pump", "automated retail outlet", "atg petrol pump", "no automation no operation"],
    clauses: "1.5(viii)–(ix), 5.1.16, 8.3(vii)",
    brief: "Automated ROs run on 'No Automation, No Operation' (NANO): the dealer must keep automation working and report malfunctions immediately (1.5(viii)); power backup by generator or UPS (1.5(ix)); irregularities under 5.1.16 (a) manual mode without authorisation, (b) ATG off/non-operational without authorisation, (c) deliberately disabling any automation component; only email or signed letter from a company official counts as authorisation, keep it on record. Penalty 8.3(vii): Rs 1,00,000; then Rs 2,00,000 + 7 days' suspension; then termination.",
  },
  {
    id: "automation-manual-mode", pillar: "automation", path: "/guides/automation/manual-mode-authorisation/", hi: true, type: "Explainer", wave: 3,
    queries: ["petrol pump manual mode", "automation failure petrol pump what to do"],
    clauses: "1.5(viii), 5.1.16 note, 8.3(vii)",
    brief: "What to do when automation fails: report to the authorised OMC official immediately and follow directions (1.5(viii)); never run manual mode without written authorisation (email or signed letter from a company official); keep the authorisation on file (5.1.16 note); what happens if you do not. A short step list and a record-keeping tip.",
  },

  // ── Oil company duties ───────────────────────────────────────────────
  {
    id: "oil-company-duties", pillar: "company", path: "/guides/oil-company-duties/", hi: true, type: "Pillar", wave: 3,
    queries: ["oil company responsibility to dealer", "oil company duties mdg"],
    clauses: "Chapter 3, 2.6–2.8",
    brief: "What MDG puts on the oil company and supply locations (Chapter 3): IQCM quality checks, water dips, records, SKO release checks, 30-day retention samples numbered on delivery documents, ethanol blending within limits, blue dye for PDS SKO, density every two hours and on tank switch recorded on the invoice, only calibrated and licensed TLs, leak checks, no mixed loads in common-manifold TLs, sealing/locking with numbers on invoice, VTS, dealers may witness filling, training of dealers and staff (3.3); free sample containers, seals, wires, pliers and labels (2.6–2.8). Written so a dealer knows what to expect and ask for.",
  },
  {
    id: "company-breakdowns-leaks", pillar: "company", path: "/guides/oil-company-duties/breakdowns-and-leaks/", hi: true, type: "Explainer", wave: 3,
    queries: ["petrol pump maintenance", "petrol pump breakdown", "petrol pump leak", "water in underground tank petrol pump"],
    clauses: "Chapter 4, 1.4.2(e), Annexure 6",
    brief: "Who fixes what (Chapter 4): OMC attends breakdowns of its equipment, dealer handles day-to-day upkeep and reports breakdowns (4.2(a)); dealer maintains own equipment (4.2(b)); calibration with W&M inspector when delivering short/excess, broken W&M seal recorded in the maintenance report signed by dealer (4.3(a)); minor vs major pipeline leaks, suspend sales, record totaliser and dip (4.3(b)); tank seepage, suspected loss reported, ethanol check after water removal (4.3(c)); water dip on every maintenance visit (4.4); Maintenance Job Report format in Hindi/English (Annexure 6, 4.1); daily leak checks by dealer (1.4.2(e)).",
  },
  {
    id: "company-water-in-tank", pillar: "company", path: "/guides/oil-company-duties/water-in-underground-tank/", hi: true, type: "Explainer", wave: 3,
    queries: ["water in underground tank petrol pump", "water in petrol pump tank", "water found in petrol tank what to do", "ethanol check after water in tank"],
    clauses: "1.3, 1.4.1(b), 4.3(c), 4.4, Annexure 7",
    brief: "Water in the underground tank: daily water dip in the stock register and report at once to the controlling office (1.4.1(b)); morning dips (1.3); the maintenance representative's water dip on every visit and removal (4.4); seepage fixes: openings, packing, gaskets, caps (4.3(c)); for ethanol-blended petrol, ethanol content checked after the water is removed, stop sales and tell the office if outside range (4.3(c), name the standards only); suspected loss through a leak reported (4.3(c)). Link to the tanker short-dip/water page for water found in a tank lorry. About 350 words incl. 3-4 FAQs.",
  },

  // ── Kerosene dealers ─────────────────────────────────────────────────
  {
    id: "sko-dealers", pillar: "sko", path: "/guides/sko-dealers/", hi: true, type: "Pillar", wave: 3,
    queries: ["sko dealer rules", "kerosene dealer mdg", "pds kerosene dealer duties"],
    clauses: "Chapter 6, 8.10",
    brief: "SKO (PDS kerosene) wholesale dealers: duties in Chapter 6 (sell blue-dyed SKO only to intended persons, never refuse during working hours with stock, no closure without written permission, no overcharging, adequate stock, stock-cum-price board, daily accounts) and irregularities in 8.10 (critical: short delivery with seals tampered, totaliser tampered, unauthorised purchase/sale/exchange, stock variation beyond limits as established under the Kerosene Control Order 1993; major: overcharging, non-observance of government/company rules; minor: short delivery with seals intact), penalties (termination; 50% allocation cut for 3 months with State Govt approval; warning) and consultation with civil supplies authorities.",
  },

  // ── Tools ────────────────────────────────────────────────────────────
  {
    id: "tools-density-at-15", pillar: "tools", path: "/tools/density-at-15/", hi: true, type: "Tool", wave: 3,
    queries: ["petrol pump density calculator", "how to calculate density of petrol", "density at 15 degree calculator"],
    clauses: "1.2(iv), 1.4.1(c); ASTM Table 53B",
    brief: "A calculator page: observed density and temperature in, density at 15°C out, plus the ±3.0 kg/m³ check against an invoice density. Built by the tools engineer, not a page writer.",
  },
  {
    id: "tools-stock-variation", pillar: "tools", path: "/tools/stock-variation/", hi: true, type: "Tool", wave: 3,
    queries: ["stock variation calculation petrol pump", "petrol pump stock loss calculator"],
    clauses: "5.1.11, Annexures 8–10",
    brief: "A calculator page for the permissible stock variation limit under 5.1.11 following the method in Annexures 8–10. Built by the tools engineer.",
  },
  {
    id: "tools-self-inspection", pillar: "tools", path: "/tools/self-inspection/", hi: true, type: "Tool", wave: 3,
    queries: ["petrol pump inspection checklist", "petrol pump self audit checklist"],
    clauses: "5.1.12, 5.1.18; circular 20.03.2025",
    brief: "An interactive YES/NO self-inspection checklist: the 20 minimum service obligations plus the records list and daily checks, with a score and the MDG clause for every NO. Built by the tools engineer.",
  },
  // ── Added 26 Oct 2026 outside the daily schedule (guide/schedule.ts EARLY_26_OCT),
  //    from Search Console (what the site is already shown for) and Google suggestions.
  {
    id: "tools-litres-to-kg", pillar: "tools", path: "/tools/litres-to-kg/", hi: true, type: "Tool", wave: 3,
    queries: ["1 litre diesel kitne kg", "1 litre diesel weight in kg", "1 litre diesel kitne kilo hota hai", "diesel density kg to liter", "1 litre petrol weight in kg", "diesel kg to litre"],
    clauses: "7.6 (density ranges); mass = volume x density",
    brief: "A converter: litres to kg and kg to litres for diesel and petrol. Mass (kg) = litres x density (kg/m3) / 1000. Default density is the middle of the MDG 7.6 range for the fuel, but the reader can type the density from their invoice or density register (density at 15°C; say that at another temperature the litres differ slightly, link the density-at-15 tool). Show the worked sum. A table of kg for 1, 10, 100, 1,000 litres at three densities across the range. Answers '1 litre diesel kitne kg' directly in the answer box: about 0.81-0.85 kg depending on density.",
  },
  {
    id: "tools-5-litre-test", pillar: "tools", path: "/tools/5-litre-test/", hi: true, type: "Tool", wave: 3,
    queries: ["permissible limit of variations in nozzle delivery as per w&m dept is within", "5 litre measure test petrol pump", "petrol pump 5 litre test", "nozzle delivery variation limit", "petrol pump me kam petrol check kaise kare"],
    clauses: "the 5-litre test clauses in MDG 2024 (see guide/content/en/quantity-5-litre-test.md and its sources); Legal Metrology limit as stated there",
    brief: "A checker: the reader types what the 5-litre measure showed (in ml, above or below the 5-litre mark, or the total) and gets whether it is within the permissible limit, how many ml per 5 litres and per 100 litres it is off, and what the dealer must do (stop the nozzle, call the oil company / W&M) per the existing 5-litre-test page. Use exactly the limit and steps the existing quantity-5-litre-test page states and its source clause; if MDG does not state a figure, say who sets it. Works for a customer too ('am I getting less fuel').",
  },
  {
    id: "tools-dip-chart", pillar: "tools", path: "/tools/dip-chart-calculator/", hi: true, type: "Tool", wave: 3,
    queries: ["petrol pump dip calculator", "dip chart calculator", "petrol pump dip chart", "dip to litre conversion", "how to read dip chart"],
    clauses: "tank calibration chart / dip rod use as MDG describes stock checks (5.1.11 and the stock pages)",
    brief: "A calculator that never invents a chart: the reader types two neighbouring rows from THEIR OWN tank's calibration (dip) chart (dip in cm and litres for each) and their dip reading in between; the tool interpolates the litres in a straight line and shows the sum. Also: water dip subtracted if they enter it. Clear note that only the tank's own calibrated chart counts, every tank has its own, and interpolation between two close rows is the usual way to read between lines (label as general practice, not an MDG rule).",
  },
  {
    id: "tools-dealer-margin", pillar: "tools", path: "/tools/dealer-margin-calculator/", hi: true, type: "Tool", wave: 3,
    queries: ["petrol pump dealer margin per litre", "petrol pump dealer commission per liter 2026", "petrol pump dealer profit per litre", "petrol pump dealer ko kitna commission milta hai", "petrol pump dealer income"],
    clauses: "none: margins are set and revised by the oil companies; no MDG figure",
    brief: "A calculator with the reader's own numbers: monthly sales of MS and HSD (litres or KL), the dealer margin per KL for each (from their own oil company's latest margin letter; the tool must not ship any default margin figure as fact), plus optional monthly costs (salaries, power, rent, interest, other). Out: gross margin per month, costs, what is left, and margin per litre. Explain in two lines that margins are fixed and revised by the oil company and differ by company and product, so check the latest letter. No claims about current rates.",
  },
  {
    id: "tools-density-chart", pillar: "tools", path: "/tools/density-temperature-chart/", hi: true, type: "Tool", wave: 3,
    queries: ["diesel density chart with temperature", "diesel density at 30 deg c", "diesel density at 35 deg c", "petrol density at 40 c", "diesel density chart with temperature pdf"],
    clauses: "1.2(iv), 1.4.1(c); ASTM Table 53B (via the same calculation as tools-density-at-15)",
    brief: "The reverse of the density-at-15 tool: the reader types a density at 15°C (e.g. from the invoice) and the fuel, and gets a table of what a hydrometer would read at 10, 15, 20, 25, 30, 35, 40 and 45°C. Use exactly the same ASTM 53B calculation as guide/tools/tools-density-at-15.js (reuse its code, inverted by iteration), with the same note that the printed table or the oil company's figure is final. No pre-printed table copied from ASTM.",
  },
  {
    id: "tools-registers", pillar: "tools", path: "/tools/density-and-stock-register-format/", hi: true, type: "Tool", wave: 3,
    queries: ["density register pdf", "density register petrol pump", "density register format", "daily stock register format petrol pump", "dsr format petrol pump excel"],
    clauses: "Annexure 1 (density record: describe only, never copy the form); 1.2, 5.1.9; stock register clauses on guide/content/en/stock-daily-register.md",
    brief: "Download page for OUR OWN printable formats: a daily density register (A4 PDF) and a daily stock register (A4 PDF), plus an Excel version of each, English and Hindi headings. The columns are what MDG requires to be recorded (take them from the existing density-register and stock-daily-register pages), in our own layout and words; never a copy of Annexure 1 or any oil company form. Files go to public/guides/downloads/ and are made by a script in scripts/ (like scripts/kk-khata-page.mjs and scripts/kk-khata-template.py). Say the oil company's own register, if it issues one, comes first.",
  },
  {
    id: "density-high-or-low", pillar: "density", path: "/guides/density/high-or-low-density/", hi: true, type: "Explainer", wave: 3,
    queries: ["diesel density should be high or low", "petrol density which is good", "diesel density which is best", "petrol density high or low", "petrol density and mileage", "acche diesel ki density kitni honi chahiye"],
    clauses: "7.6 (ranges); 1.2(iv) (±3 against the invoice)",
    brief: "Answers the customer myth: is higher or lower density better? Plain answer: any density inside the range in MDG 7.6 is fine; what matters is that it matches the invoice/reference within ±3.0 kg/m3 at 15°C, not whether it is high or low; density is read at a temperature, so a lower reading on a hot afternoon is normal. Mileage differences from density inside the range are small (say so carefully, no invented percentages). One table: fuel, range, what a reading outside it means.",
  },
  {
    id: "density-temperature", pillar: "density", path: "/guides/density/density-and-temperature/", hi: true, type: "Explainer", wave: 3,
    queries: ["diesel density with temperature", "petrol density at night", "why density changes with temperature", "diesel density at 15 deg c", "density at 15 degree celsius meaning"],
    clauses: "1.2(iv), 1.4.1(c), 5.1.9; ASTM 53B",
    brief: "Why the same diesel reads a different density in the morning and the afternoon, and why everything is compared at 15°C. Fuel expands when warm, so observed density falls as temperature rises; the hydrometer reading plus the temperature is converted to density at 15°C with ASTM Table 53B. One illustrative example using the density-at-15 tool (say 'for example', take numbers from that tool, not invented). Link the density-at-15 and density chart tools and the 10am reference density page.",
  },
  {
    id: "density-e20", pillar: "density", path: "/guides/density/e20-petrol/", hi: true, type: "Explainer", wave: 3,
    queries: ["e20 petrol kya hai", "petrol density after e20", "petrol density with e20", "e20 petrol and normal petrol difference", "e20 petrol problems", "petrol density with ethanol"],
    clauses: "7.6 (density ranges as MDG 2024 prints them); IS 17021 named only",
    brief: "For dealers and customers: what E20 is (petrol with up to 20% ethanol), what changes at the pump. Density: state only what MDG 2024 says (if MDG 7.6 lists a range that covers ethanol-blended petrol, give it with the clause; otherwise say the standard for E20 is IS 17021 and to check the current version and the oil company's figure; never invent an E20 density range). Water: ethanol-blended petrol is sensitive to water, so keep tanks and tanker receipts dry (link the water-finding paste and water-in-tank pages; any handling rule must come from MDG or be labelled general practice). No opinions on the E20 policy, no mileage figures.",
  },
  {
    id: "density-kit", pillar: "density", path: "/guides/density/hydrometer-and-density-kit/", hi: true, type: "Checklist", wave: 3,
    queries: ["diesel density hydrometer range", "petrol pump density kit", "density meter petrol pump", "hydrometer for diesel density", "diesel density kit"],
    clauses: "the clauses around line 428 of .guide-source/mdg-2024.txt (hydrometers, thermometers, ASTM tables) and the minimum equipment lists",
    brief: "Checklist: the density equipment a pump must keep and show on demand (hydrometers of the right range for each product, thermometer, measuring jar, ASTM density conversion table), what to check (calibration/certificate if MDG asks, broken glass), and what happens if it is missing, all from MDG 2024 with clauses. A table: item, why, what MDG says. If MDG gives no hydrometer ranges, give the range a dealer needs to cover from 7.6 and say 'choose hydrometers that cover it'.",
  },
  {
    id: "density-board", pillar: "density", path: "/guides/density/what-is-density-at-a-petrol-pump/", hi: true, type: "Explainer", wave: 3,
    queries: ["petrol pump density kya hota hai", "what is density in petrol pump", "petrol pump par density ka matlab", "density meter petrol pump kitna hona chahiye", "petrol pump density kitni honi chahiye"],
    clauses: "minimum service obligations / display clauses for density; 7.6; 1.2",
    brief: "For the customer who sees 'density' on the dispenser or board: what the number is (mass of one cubic metre of the fuel, in kg/m3, at 15°C), why pumps display it, what range is normal (7.6), and how to ask for a density check. Short and Hindi-search friendly. Do not repeat the density-range page; link it. Any display duty must come from MDG 2024 or the 20.03.2025 circular with its tag.",
  },
  {
    id: "service-customer-checks", pillar: "service", path: "/guides/customer-service/customer-density-and-quantity-check/", hi: true, type: "Explainer", wave: 3,
    queries: ["petrol pump par density kaise check kare", "how to check petrol quantity at petrol pump", "petrol pump me kam petrol check kaise kare", "petrol pump ki testing kaise hoti hai", "customer right density check petrol pump"],
    clauses: "the customer-facing checks MDG 2024 and the 20.03.2025 circular give (density check on demand, 5-litre measure, filter paper, complaint book); exact clauses from the source",
    brief: "What a customer may ask the pump to show or check, in order: the density check, the 5-litre measure test, the filter paper test, the complaint book. For each: what the customer sees, what result is normal, where to complain. Only duties MDG or the circular gives, with tags. Neutral tone, no accusations against dealers. Link the 5-litre-test tool, filter-paper, complaint-book pages.",
  },
  {
    id: "mdg-every-oil-company", pillar: "hub", path: "/guides/mdg-for-every-oil-company/", hi: true, type: "Explainer", wave: 3,
    queries: ["mdg guidelines iocl", "mdg guidelines bpcl", "mdg guidelines hpcl", "is mdg same for all oil companies", "mdg guidelines for petrol pump"],
    clauses: "the document's own statement of which companies issued it and whom it binds (title page / 1.x)",
    brief: "One question: is MDG the same for IndianOil, BPCL and HPCL dealers? Answer from what MDG 2024 itself says about who issued it and to whom it applies (with clause). What can differ by company in practice (forms, circular formats, local officers) only where the document leaves it to the oil company, labelled so. The joint circular of 20.03.2025 is for all three. Name the companies in plain text, never as the lead word, at most once in title/description.",
  },
  {
    id: "inspection-who", pillar: "inspection", path: "/guides/inspection/who-can-inspect-a-petrol-pump/", hi: true, type: "Explainer", wave: 3,
    queries: ["petrol pump checking officer", "petrol pump inspection officer", "who can inspect petrol pump", "petrol pump inspection kaun karta hai", "mobile lab inspection petrol pump"],
    clauses: "the inspection chapter: who inspects (oil company officers, joint inspections, other authorities MDG mentions) and what they must do (sign, give a copy)",
    brief: "Who may inspect a petrol pump under MDG 2024 (oil company officers and the others the document names), what the dealer can ask for (identity, a copy of the inspection report), and what the inspector records. Only what the source says, with clauses. Link inspection pillar, records-to-keep, mobile lab. Never print phone numbers or names of officers.",
  },
  {
    id: "mdg-questions-answers", pillar: "hub", path: "/guides/mdg-questions-and-answers/", hi: true, type: "Explainer", wave: 3,
    queries: ["what is allowed tank variation in a retail outlet", "what is allowed operation loss % of sales for hsd (sales <600 kl per year)", "permissible limit of variations in nozzle delivery as per w&m dept is within", "what is the cycle for calculating instances of irregularities from the date of the report of inspection", "mdg penalty meaning"],
    clauses: "stock variation limits (5.1.11 and the stock pages, incl. the 600 KL point), 5-litre test limit, the five-year count (8.5.5), penalty classes (8.2-8.4)",
    brief: "The short-answer questions dealers, managers and DSMs get asked (in training and tests), each answered in one or two sentences with the figure and clause, grouped by topic: stock variation (allowed tank variation; the operation loss allowance for HSD with sales under 600 KL a year, exactly as MDG 2024 states it), quantity (5-litre test limit), density (±3, ranges), penalties (classes, how repeat instances are counted from the inspection report date, five years incl. previous guideline). 10-14 Q&As in the body as a table or ### questions; FAQ adds 3-5 different ones. Every figure from the source with its tag; add {{penalty-note}} after penalty figures. Link the page that explains each one.",
  },
  {
    id: "stock-what-is-dip", pillar: "stock", path: "/guides/stock-variation/what-is-dip/", hi: true, type: "Explainer", wave: 3,
    queries: ["what is dip in petrol pump", "petrol pump dip", "petrol pump dip chart", "dip rod petrol pump", "dip kya hota hai petrol pump"],
    clauses: "the stock-taking / dip clauses (5.1.11, the daily stock register clauses, water dip)",
    brief: "What 'dip' means at a pump: measuring the fuel height in the underground tank with a dip rod, reading the litres from the tank's calibration chart, and the water dip with water-finding paste. When MDG requires dips to be taken and recorded (with clauses), how the dip feeds the stock register and stock variation. Link the dip-chart calculator, daily stock register, water-finding paste, stock variation pages. Short.",
  },
  {
    id: "product-names", pillar: "hub", path: "/guides/hsd-ms-and-product-names/", hi: true, type: "Explainer", wave: 3,
    queries: ["hsd meaning petrol pump", "ms meaning petrol pump", "hsd full form", "hsd density range", "xp95 meaning", "dsm petrol pump full form"],
    clauses: "the product names and abbreviations MDG 2024 uses (MS, HSD, branded fuels, SKO, LDO etc.) and 7.6 for density ranges",
    brief: "A short reference: the product names and abbreviations a dealer and customer see (MS = petrol, HSD = diesel, branded/premium fuels, SKO, and staff terms like DSM) with one line each and, for MS and HSD, the density range from 7.6. Use only abbreviations MDG uses or that are standard; brand names of premium fuels (XP95, Speed, Power) may be named in plain text as examples without claims. Link the glossary for more.",
  },
  // ── Added 31 Oct 2026 outside the daily schedule (guide/schedule.ts EARLY_31_OCT), doubling down on
  //    the Search Console clusters the site already ranks for (density, litres to kg, MDG test questions).
  {
    id: "density-petrol", pillar: "density", path: "/guides/density/petrol-density/", hi: true, type: "Explainer", wave: 3,
    queries: ["petrol ki density kitni honi chahiye", "petrol ki density kitni honi chahie", "petrol ki density kitni hoti hai", "पेट्रोल की डेंसिटी कितनी होनी चाहिए", "petrol density range in india", "petrol density limit", "petrol pump density range", "petrol minimum density in india", "petrol maximum density"],
    clauses: "7.6 (MS range for every BS VI grade incl. E20 and premium), 1.2(iv) (±3.0 against the invoice), 1.4.1(c), 5.1.9",
    brief: "PETROL ONLY (the existing density-range page covers both fuels; do not repeat it, link it). Answer box in one breath: petrol (MS) at a pump should read 720–775 kg/m³ at 15°C {{7.6}}, and today's reading should match the invoice/reference within ±3.0 {{1.2(iv)}}. Then: what an observed reading at a hot afternoon looks like (link density-temperature and the density chart tool, figures only from tools-density-at-15.js), minimum and maximum, what a reading outside means and what the dealer does, E20 and premium petrol use the same range (link density-e20, density-premium-petrol). Hindi twin is the priority: its title must be exactly in the searcher's words 'पेट्रोल की डेंसिटी कितनी होनी चाहिए' and the FAQ must use Roman-script searches ('petrol ki density kitni honi chahiye', '...hoti hai', 'petrol pump par petrol ki density').",
  },
  {
    id: "density-diesel", pillar: "density", path: "/guides/density/diesel-density/", hi: true, type: "Explainer", wave: 3,
    queries: ["diesel density range", "diesel density limit", "diesel density in india", "hsd density range", "diesel density should be", "diesel ki density kitni honi chahiye", "density of diesel in petrol pump", "good density for diesel", "diesel minimum density"],
    clauses: "7.6 (HSD BS VI up to B7: 810–845; B8–B20 blends: 820–860), 1.2(iv), 5.1.9",
    brief: "DIESEL ONLY (HSD). Answer box: diesel at a pump should be 810–845 kg/m³ at 15°C for BS VI diesel up to B7, 820–860 for B8–B20 blends {{7.6}}, and match the invoice within ±3.0 {{1.2(iv)}}. Cover: 'diesel density limit' minimum/maximum, why a 'high' diesel density is not 'better' (link density-high-or-low), what HSD means (link product-names), afternoon readings (link density-temperature, chart tool), what to do if outside. Do not repeat the density-range page; link it. Hindi twin title in the searcher's words: 'डीज़ल की डेंसिटी कितनी होनी चाहिए'.",
  },
  {
    id: "tools-density-check", pillar: "tools", path: "/tools/is-my-density-good/", hi: true, type: "Tool", wave: 3,
    queries: ["828 density diesel", "821 density diesel", "824 density diesel", "diesel density 825 is good or bad", "petrol density 748 is good or bad", "petrol density 750 is good or bad", "742 density petrol", "760 density petrol", "is my diesel density good"],
    clauses: "7.6 ranges; 1.2(iv) ±3.0 vs invoice; 5.1.9; conversion via the same ASTM 53B code as tools-density-at-15.js",
    brief: "A checker for the number people see on the board or hydrometer: pick petrol or diesel (and blend), type the density (e.g. 828), optionally the temperature it was read at (then convert to 15°C with the SAME code as guide/tools/tools-density-at-15.js) and optionally the invoice/reference density. Output in plain words: inside or outside the 7.6 range at 15°C; if an invoice figure is given, inside or outside ±3.0; and what to do. The page body: a short table 'common numbers people ask about' (diesel 815, 818, 821, 824, 828, 832, 840, 850; petrol 742, 745, 748, 750, 755, 760, 770, 780) each with 'inside / outside the range at 15°C' — only range membership, no quality verdicts beyond MDG. Explain once that a number read at 30°C is not the 15°C figure.",
  },
  {
    id: "density-premium-petrol", pillar: "density", path: "/guides/density/premium-petrol-density/", hi: true, type: "Explainer", wave: 3,
    queries: ["power petrol density", "power petrol vs normal petrol density", "hp power petrol density", "xp95 density", "speed petrol density", "power petrol ki density kitni honi chahiye", "premium petrol density range"],
    clauses: "7.6 (whatever MDG says about MS grades incl. premium/higher-octane grades; check whether 7.6 lists separate grades)",
    brief: "Premium petrol (the brands sold as Power, XP95, Speed and similar — name them as examples in plain text, no claims about them) vs normal petrol: what MDG 2024 says about the density range for each MS grade (verify in 7.6 whether premium grades share 720–775 at 15°C; state exactly what the source shows), that premium is about octane and additives, not density, and that a pump selling both checks each tank against its own invoice (±3.0, 1.2(iv)). No mileage or performance claims. Hindi title in searcher words 'पावर पेट्रोल की डेंसिटी कितनी होनी चाहिए'.",
  },
  {
    id: "density-by-company", pillar: "density", path: "/guides/density/density-by-oil-company/", hi: true, type: "Explainer", wave: 3,
    queries: ["hp petrol density", "indian oil density chart", "bpcl diesel density", "bharat petroleum diesel density", "indian oil petrol density range", "hpcl petrol density", "indian oil ki density kitni honi chahiye"],
    clauses: "7.6; the document's own statement of who issued it (link mdg-every-oil-company)",
    brief: "Is the density at an IndianOil, BPCL or HP pump different? Answer: the same 7.6 ranges apply to all three because MDG 2024 is one document for all of them (link mdg-every-oil-company); the actual figure varies by refinery/source and temperature, which is why each tank is checked against its own invoice (±3.0). Cover 'indian oil density chart': there is no company-specific range; the ASTM table converts readings; link the density chart tool. Company names in plain text, never the lead word, each at most once in title/description; no logos, no claims about any company's fuel quality.",
  },
  {
    id: "density-by-state", pillar: "density", path: "/guides/density/density-by-state-and-assam/", hi: true, type: "Explainer", wave: 3,
    queries: ["petrol density in assam", "diesel density in assam", "petrol density range in assam", "diesel density in punjab", "diesel density in rajasthan", "petrol density in punjab", "diesel density in haryana", "petrol density in bangalore"],
    clauses: "7.6 incl. its footnote on density range relaxation for fuel processed from Assam crude (around line 1913 of .guide-source/mdg-2024.txt)",
    brief: "One page for every 'density in <state>' search (never one page per state): the 7.6 ranges are the same in every state; what differs is temperature (a hot state reads lower before conversion — link density-temperature) and the source refinery. The one real exception MDG names: the 7.6 footnote on a density range relaxation and time frame, if any, for fuel processed from Assam crude, which follows Government notifications — explain exactly what the footnote says (short quote max 15 words with clause), that the figure is not printed in MDG, and to ask the oil company for the current notified range. A small table: state group (north-east / hot plains / hills) → what changes (temperature, source) → range that applies.",
  },
  {
    id: "tools-litres-kg-table", pillar: "tools", path: "/tools/diesel-litres-to-kg-table/", hi: true, type: "Tool", wave: 3,
    queries: ["100 liter diesel in kg", "1000 liter kitna kg hota hai", "20 liter diesel in kg", "5 liter me kitna kg hota hai", "10 litre petrol weight in kg", "50 liter diesel to kg", "1 litre diesel ka vajan kitna hota hai", "1 लीटर डीजल में कितने किलोग्राम होते हैं"],
    clauses: "7.6 (densities used for the table: the range ends and the middle); mass = litres × density / 1000",
    brief: "A ready table page (no script needed; the existing tools-litres-to-kg is the calculator — link it prominently): diesel and petrol, rows 1, 5, 10, 15, 20, 50, 100, 200, 500, 1,000, 5,000 litres; columns kg at the low end, middle and high end of the 7.6 range (diesel 810/827.5/845, petrol 720/747.5/775). Compute every figure exactly (round to 0.01 kg for ≤20 L, 0.1 kg above). Also the reverse for 1 kg and 1 tonne in litres. One worked example. Answer box answers '1 litre diesel kitne kg' and '1000 litre diesel kitne kg'. Hindi twin in searcher words ('1 लीटर डीज़ल में कितने किलो होते हैं').",
  },
  {
    id: "mdg-summary", pillar: "hub", path: "/guides/mdg-2024-in-10-points/", hi: true, type: "Explainer", wave: 3,
    queries: ["mdg guidelines for petrol pump", "mdg 2024", "marketing discipline guidelines 2024", "mdg guidelines 2024 summary", "mdg guidelines 2026", "mdg penalty meaning", "mdg kya hai petrol pump"],
    clauses: "the main obligations across chapters 1, 5, 7 and 8 (one figure per point, each with its clause)",
    brief: "MDG 2024 in ten points for a pump dealer: ten short numbered points, each one duty in our own words with its key figure and clause and a link to the page that explains it (density ±3, 10 AM reference density, stock variation limits, 5-litre test band, records, sampling, display, inspections, penalty classes with {{penalty-note}}, the five-year count). Do not walk the guideline in its own order; group by the dealer's day. Name the document in full once. Never call it a law. Hindi title: 'MDG 2024 दस बातों में: पेट्रोल पंप डीलर के लिए'.",
  },
  {
    id: "mdg-qa-density", pillar: "hub", path: "/guides/mdg-questions-density-and-samples/", hi: true, type: "Explainer", wave: 3,
    queries: ["what is the permissible density variation at petrol pump", "density variation limit mdg", "when are samples drawn from petrol pump", "retention sample kitne din rakhte hai", "filter paper test for petrol", "mdg questions density"],
    clauses: "1.2(iv), 1.4.1(c), 5.1.9, 7.x sampling and retention clauses, 7.4, filter paper clauses",
    brief: "Part 2 of the MDG questions and answers (link mdg-questions-answers as part 1; do not repeat its questions): 9–10 short test-style questions on density, samples and quality, each answered in one or two sentences with figure and clause: ±3.0 kg/m³ vs invoice, when the morning density is recorded, what happens without a reference density, how many samples and how long retention samples are kept, filter paper test, what a failed sample leads to, mobile lab, water dip. FAQ adds 3 more. Every figure from the source.",
  },
  {
    id: "mdg-qa-records", pillar: "hub", path: "/guides/mdg-questions-records-and-penalties/", hi: true, type: "Explainer", wave: 3,
    queries: ["what records must a petrol pump keep", "mdg penalty for first instance", "how many instances lead to termination mdg", "show cause notice reply time mdg", "what is critical irregularity in mdg", "mdg minor irregularity penalty"],
    clauses: "records clauses (1.x, 5.1.12), inspection chapter, 8.2–8.6, 8.5.5, 8.5.6, 8.9",
    brief: "Part 3 of the MDG questions and answers (link parts 1 and 2): 9–10 test-style questions on records, inspections and penalties, one or two sentences each with figure and clause: which registers, how long records are kept, what the inspector signs/hands over (only what MDG says), show cause timeline (8.5.6), critical/major/minor and their first-instance consequences in our own grouping (never the 8.4 list), repeat counting over five years incl. previous guideline (8.5.5), appeal only for termination (8.9). {{penalty-note}} after penalty figures. FAQ adds 3 more. 'General information, not legal advice' line where penalties appear.",
  },
  // ── Dealer situations: what to do when X happens (released together on 24 Nov 2026) ──
  {
    id: "inspection-qrc-team-visit", pillar: "inspection", path: "/guides/inspection/qrc-team-visit/", hi: true, type: "Checklist", wave: 3,
    queries: ["QRC team aane pe kya karna chahiye", "QRC team visit at a petrol pump: what the dealer and manager should do"],
    clauses: "2.2.2.2, 2.4, 2.4.3, 2.5(C), 1.5(iv), 1.5(v), 1.5(vi), 5.1.8, 5.1.9, 5.1.12, 8.3(i), 8.5.6, Annexure 4",
    brief: "Answers what a dealer or manager should do when a QRC (Quality Reassurance Cell) team arrives. MDG does not define or name QRC; Parliament answers describe QRC teams making regular and surprise inspections, so every step is tied to MDG's own names (Sales Officer, Inspecting Teams and Senior Level Officers in 2.4; company officials and authorised agencies in 2.2.2.2) and QRC is never presented as an MDG body. MDG-tagged: officials pay for samples and give a cash memo (2.2.2.2); the label compares the register density with the officer's reading and the dealer or representative signs (Annexure 4); the tank lorry sample box goes into custody on a joint memo (2.5(C)); the inspection-report file, test reports, invoices, statutory records and the density kit must be at hand (1.5(iv)-(vi)); the reference density for the time of the visit must exist (5.1.9); refusal or obstruction is major (5.1.8, 8.3(i)); a show cause notice follows within 30 days (8.5.6). Practice, labelled as such: meet the team at the office, let one named person accompany it, note names and times, and ask for a copy of what is written.",
  },
  {
    id: "inspection-night-before-checklist", pillar: "inspection", path: "/guides/inspection/night-before-checklist/", hi: true, type: "Checklist", wave: 3,
    queries: ["inspection se ek raat pehle kya taiyari karni chahiye", "What to keep ready the night before a petrol pump inspection"],
    clauses: "1.3(i), 1.4.2(b), 1.5(iv), 1.5(vi), 2.9.2, 5.1.12, 5.1.14(a), 5.1.14(b), 5.1.15, 5.1.17",
    brief: "Answers what to lay out the evening before a visit, as a pack-the-table checklist rather than the retention-period table on the records page. MDG-tagged items to have at the outlet: the file of inspection reports, company letters, test reports and invoice copies (1.5(iv)); daily sales and density registers and maintenance records for the current and previous financial year, five years of inspection records, purchase invoices, sales bills and licences (5.1.12); calibrated hydrometer, thermometer, ASTM table and other test kits in working order (1.5(vi)); the W&M-verified 5-litre measure (1.4.2(b)); the last two tank lorry retention samples sealed and labelled (2.9.2); boards for opening stock, prices, density and contact details (1.3(i), 5.1.15, 5.1.17); toilet protocol and maintenance sheet (5.1.14(b)); an in-date first aid box (5.1.14(a)). The 'night before' timing is practice, not an MDG rule, and must be labelled; link to the records page for retention periods instead of repeating them.",
  },
  {
    id: "inspection-morning-of-checks", pillar: "inspection", path: "/guides/inspection/morning-of-the-inspection/", hi: true, type: "Checklist", wave: 3,
    queries: ["subah pump kholte hi kaun kaun si jaanch aur entry karni hoti hai", "The morning of an inspection: the checks that must be done and written down by 10 AM"],
    clauses: "1.3, 1.4.1(b), 1.4.1(c), 1.4.2(a), 1.4.2(d), 1.4.2(e), 1.4.2(f), 5.1.9, 5.1.14(b)",
    brief: "Answers what must already be done and written down when an inspector arrives, using the clock as the structure. MDG-tagged: morning meter readings and product and water dips of each tank recorded separately (1.3); the daily water dip entered and any water reported at once (1.4.1(b)); morning density from the nozzle before sales and by 10 AM (1.4.1(c), 5.1.9); the W&M seal and certificate check, nozzle checks before sales with the testing quantity recorded, the leak check and zero before each delivery (1.4.2(a), (d), (e), (f)); the daily toilet check (5.1.14(b)). Use the 5.1.9 table (before 10 AM, after 10 AM, after a load) as the clock; the order of the morning routine is practice and is labelled, and the single-topic pages are linked rather than repeated.",
  },
  {
    id: "inspection-samples-though-tests-pass", pillar: "inspection", path: "/guides/inspection/samples-taken-when-tests-pass/", hi: true, type: "Explainer", wave: 3,
    queries: ["density aur filter paper pass hai phir bhi sample kyu le rahe hain", "Inspector took samples even though density and filter paper tests passed: is that allowed?"],
    clauses: "2.2.2.2, 2.4, 2.4.1, 2.4.2, 2.4.3, 7.1, 7.4 Note (i), Annexure 4",
    brief: "Answers why a team may draw samples when the quick tests look fine. MDG-tagged: random sampling by company teams covers at least 2% of the outlet network every month (2.4); joint industry team members may collect samples irrespective of indicative tests such as density, stock variation or filter paper (2.4.3); mobile labs make surprise checks and run clinical tests whatever the density result (7.1, 7.4 Note (i)). What the dealer is entitled to is payment and a cash memo (2.2.2.2), sealed and labelled samples signed jointly (2.4.3, Annexure 4) and one set kept by the dealer (2.4.1, 2.4.2). MDG gives no right to refuse (5.1.8); the tone stays neutral and never calls it unfair.",
  },
  {
    id: "inspection-government-officer-visit", pillar: "inspection", path: "/guides/inspection/government-officer-inspection/", hi: true, type: "Explainer", wave: 3,
    queries: ["sarkari adhikari ya legal metrology wale jaanch karein to MDG me kya hota hai", "Government officer inspects a petrol pump: what it means under MDG 2024"],
    clauses: "1.5(ii), 1.5(v), 2.2.2.2, 4.3(a), 5.1.2(a), 5.1.2(b), 5.1.8, 8.7",
    brief: "Answers what changes under MDG when a government authority (for example Legal Metrology, PESO or the police) inspects a pump. MDG-tagged: authorities empowered under existing laws and control orders may check the dealership, and a malpractice or irregularity they establish is also an irregularity under MDG, acted on by the oil company on their advice (8.7); any other statutorily empowered authority may draw samples (2.2.2.2); the dealer must follow PESO rules and keep MS/HSD Control Order records ready for inspecting officials (1.5(ii), 1.5(v)); W&M's opinion on seals is final and recalibration is done with the W&M inspector (5.1.2(b), 4.3(a)). MDG does not list the officers or their powers: say so, send the reader to the official orders and an advocate, and keep it general information, not legal advice.",
  },
  {
    id: "inspection-dealer-absent-who-signs", pillar: "inspection", path: "/guides/inspection/dealer-absent-who-signs/", hi: true, type: "Explainer", wave: 3,
    queries: ["dealer pump pe na ho to inspection me manager sign kar sakta hai kya", "Dealer not at the pump during an inspection: can the manager or staff sign for the dealer?"],
    clauses: "2.2.2.1, 2.3, 2.4.3, 2.5(C), 4.3(a), 7.6.1(c), 7.6.2, Annexure 3, Annexure 4, Annexure 11, Annexure 12a, Annexure 13a",
    brief: "Answers whether a manager or staff member can sign for the dealer when the dealer is away. MDG-tagged: its sample and test papers are signed by 'dealer / his representative' (2.2.2.1, 2.3, 2.4.3, Annexures 3, 4, 11, 12a, 13a; joint memo in 2.5(C)), the mobile lab test report carries the dealer's signature with seal on all copies (7.6.1(c)), the maintenance job report is signed by the dealer (4.3(a)), and a test report entry is corrected only by strike-through with name and signature (7.6.2). MDG does not define who counts as a 'representative' and gives no authority format: say so and tell the reader to confirm with the oil company. Practice, labelled: a signed authority letter naming the manager, kept in the inspection file.",
  },
  {
    id: "inspection-report-has-remarks", pillar: "inspection", path: "/guides/inspection/report-has-remarks/", hi: true, type: "Checklist", wave: 3,
    queries: ["inspection report me remark aaye to kya karna chahiye", "Inspection report has remarks or deficiencies: what to do next under MDG 2024"],
    clauses: "1.5(iv), 5.1.12(iii), 5.1.18, 8.1, 8.4, 8.5.2, 8.5.3, 8.5.4, 8.5.6, 8.8",
    brief: "Answers what to do after a report or sheet carries remarks. MDG-tagged: keep the report in the outlet file and five years of inspection records (1.5(iv), 5.1.12(iii)); a remark that matches an irregularity is critical, major or minor (8.1) and must be established before action (8.5.2); several findings on the same day are each counted (8.5.3); things MDG does not list are decided after enquiry (8.5.4); a show cause notice follows within 30 days (8.5.6); minor items a to h count as one irregularity (8.4) and service-standard deficiencies are minor (5.1.18). Practice, labelled: fix display, toilet and housekeeping items at once and keep dated photographs; no legal advice and no reply template.",
  },
  {
    id: "inspection-show-cause-notice-first-checks", pillar: "inspection", path: "/guides/inspection/show-cause-notice-first-checks/", hi: true, type: "Checklist", wave: 3,
    queries: ["show cause notice mila hai sabse pehle kya check karna chahiye", "Show cause notice received: what to check on the notice first (MDG 2024)"],
    clauses: "8.5.2, 8.5.3, 8.5.5, 8.5.6, 8.5.7, 8.5.8, 8.6, 8.8",
    brief: "Answers what to verify on the paper in hand; the timeline page already covers the sequence, so this is a checklist of the notice itself. MDG-tagged: it must arrive within 30 days of the inspection, or within 30 days of test results where samples were drawn, with all reports it relies on and all irregularities listed (8.5.6); the reply period is 10 days from the date of issuance, as printed (8.5.7); a reasoned speaking order follows, preferably within 45 days of the reply (8.5.8); critical cases heading to termination get a personal hearing with one more chance if missed (8.6); the instance is counted over five years (8.5.5) and approval levels differ by class (8.8). No reply template and no tactics; end with the standard 'not legal advice' line.",
  },
  {
    id: "inspection-refusing-or-obstructing", pillar: "inspection", path: "/guides/inspection/refusing-or-obstructing-inspection/", hi: true, type: "Explainer", wave: 3,
    queries: ["inspector ko sample ya inspection se mana kar de to kya hota hai", "Refusing or obstructing an inspection or sample at a petrol pump: what MDG 2024 says"],
    clauses: "5.1.8, 8.3(i), 8.5.1, 8.5.2, 2.2.2.2, 2.4",
    brief: "Answers what MDG says about refusing or obstructing an inspection or sampling. MDG-tagged: refusal, obstruction or creating circumstances that disable sampling or inspection is irregularity 5.1.8 and major (8.3(i)): 15 days' suspension, then 30 days, then termination (8.3); it must be established first (8.5.2) and the company may take higher action (8.5.1); the persons who may draw samples are listed in 2.2.2.2. MDG gives no further definition of 'obstruction' and says nothing on what a dealer may do if he doubts a visitor's authority: say that plainly; practice, labelled: ask for identity, record any disagreement in writing and do not block. Needs {{penalty-note}} after the ladder.",
  },
  {
    id: "inspection-after-customer-complaint", pillar: "inspection", path: "/guides/inspection/after-customer-complaint/", hi: true, type: "Explainer", wave: 3,
    queries: ["customer ki shikayat ke baad company ki team aaye to kya hota hai", "Company team visits after a customer complaint: what happens at the pump"],
    clauses: "2.2.2.2, 2.4, 2.5(K), 1.6(iv), 1.6(viii), 5.1.14(b), 5.1.17",
    brief: "Answers what happens when a complaint reaches the oil company rather than the counter. MDG-tagged: companies are enjoined to draw samples on a specific complaint against an outlet, from the nozzles of all MS and HSD tanks (2.2.2.2, 2.4); a failed density or filter paper test suspends sales of all products pending priority sampling (2.5(K)); a toilet complaint leads to a photograph or the complaint being shared and a letter issued instantly (5.1.14(b)); the complaint book and contact details must be available (1.6(iv), 1.6(viii), 5.1.17). MDG does not say a complaint visit is announced or how complaints are verified; the counter-side steps live on the customer-complaint page, which this page links.",
  },
  {
    id: "tanker-while-unloading-checks", pillar: "tanker", path: "/guides/receiving-a-tanker/while-unloading-checks/", hi: true, type: "Checklist", wave: 3,
    queries: ["load utaarte waqt kin chizon ka dhyan rakhna chahiye", "Tanker unloading at a petrol pump: what to check before, during and after"],
    clauses: "1.1, 1.2(i)-(xiv), 1.5(vii), 2.3 and Notes (i)-(ii)",
    brief: "Answers what the person standing at the tanker must watch, as a three-stage card for staff and not the full numbered receipt list on the pillar page. Before the hose goes on (MDG): match the invoice details (1.1); level ground, 10 minutes settling, earthing and bonding, DCP extinguisher, no plastic hoses (1.2(i)); seals (1.2(ii)); master valves, certificate, dip rod, dips, water paste, density within +/-3.0 kg/m3, compartment and bottom samples (1.2(iii)-(x)); sales from that tank stopped (1.2(vii)). During, only what MDG says: sales from that tank stay stopped, product goes into the correct underground tank, the extinguisher stays near, and a deviation or a driver who will not sign means waiting for instructions (1.2(vii), 1.2(xi), 1.2(i), 2.3 Notes). After: tank lorry fully empty before release, stock register and board entries, 50 litres through the pump and then the composite density in the register, shortages signed by both sides (1.2(xi)-(xiv)); anything on staff positions or phones is practice and labelled.",
  },
  {
    id: "tanker-documents-do-not-match", pillar: "tanker", path: "/guides/receiving-a-tanker/invoice-and-tanker-do-not-match/", hi: true, type: "Checklist", wave: 3,
    queries: ["tanker ka invoice se milan na ho to kya karna chahiye", "Tanker and invoice do not match: what to check and who to call"],
    clauses: "1.1, 1.2(ix), 1.5(vii), 2.2.1(iv), 2.3 Note (ii), 3.2",
    brief: "Answers what to do when the lorry or its papers do not match the invoice (density and seals have their own pages). MDG-tagged: the dealer matches tank lorry number, compartments and quantity, the time it left the supply point, and the dip rod with its calibration certificate (1.1); the supply location writes density, filling point, tank number and release time on the invoice (2.2.1(iv)); in doubt, contact the supply location or Area Field Officer for instructions (1.2(ix)); on a time or route deviation, tell the supply location before accepting and act on the company's instructions (1.5(vii), 2.3 Note (ii)). MDG does not say 'reject the load': state that it only sends the dealer for instructions; practice, labelled: note the mismatch, and the name and time of the person informed, on the invoice copy.",
  },
  {
    id: "tanker-seal-or-lock-mismatch", pillar: "tanker", path: "/guides/receiving-a-tanker/seal-or-lock-mismatch/", hi: true, type: "Explainer", wave: 3,
    queries: ["tanker ka seal toota hua ya invoice se alag number ho to kya kare", "Tanker seal or lock number does not match the invoice: what MDG 2024 says"],
    clauses: "1.1(ii), 1.2(ii), 1.2(ix), 3.2",
    brief: "Answers what to do when the seal or security lock on the delivery manifold or manhole covers is broken, missing or numbered differently. MDG-tagged: the dealer checks the condition of the seal or lock against the invoice (1.1(ii), 1.2(ii)); the supply location records seal and lock numbers on the invoice (3.2); in doubt over quality, contact the supply location or Area Field Officer for further instructions (1.2(ix)). MDG has no separate rule for a seal mismatch and does not say whether to refuse the load: state that plainly. Practice, labelled: hold the unloading until the supply location answers and write the seal numbers actually found on the invoice copy.",
  },
  {
    id: "tanker-dip-rod-and-certificate", pillar: "tanker", path: "/guides/receiving-a-tanker/dip-rod-and-calibration-certificate/", hi: true, type: "Checklist", wave: 3,
    queries: ["tanker ka dip rod aur calibration certificate kaise check karein", "Tanker dip rod and calibration certificate: how to check them before taking dips"],
    clauses: "1.1(vi), 1.2(v), 1.2(vi), 1.2(vii), 1.2(xi), 3.1(i)",
    brief: "Answers how to check the lorry's dip rod and certificate before dipping. MDG-tagged: ask the driver for the certificate showing product level and proof level (1.2(v)); check the W&M markings at the bottom and at the proof level of the dip rod and verify its calibration with a standard measuring tape (1.2(vi)); dip every compartment with the W&M-certified rod supplied with the lorry (1.2(vii)); supply locations may fill only lorries with a valid calibration certificate and explosives licence (3.1(i)); a dip short against the certificate is made up as in 1.2(xi). MDG gives no tolerance for the tape check: say so and tell the reader to ask the oil company.",
  },
  {
    id: "tanker-master-valve-before-dip", pillar: "tanker", path: "/guides/receiving-a-tanker/master-valve-before-dip/", hi: true, type: "Explainer", wave: 3,
    queries: ["tanker ka dip lene se pehle master valve kyu kholte hain", "Why the master valve is released before taking tanker dips"],
    clauses: "1.2(iii), 1.2(v), 1.2(vii), 1.2(xi)",
    brief: "Answers why the master valve levers are released before the dips are read. MDG-tagged: release them so product fills the pipelines, where lorries are normally calibrated with lines full, before checking dips and referring to the calibration certificate (1.2(iii)); this step comes before the certificate check (1.2(v)) and the dips (1.2(vii)). MDG does not say how long to wait or which valves; the certificate shows whether the lorry was calibrated with lines full and the supply location answers if it is unclear. Plain reasoning, labelled as such: a dip taken with empty lines can read short against the certificate; link to the short-dip page for what follows.",
  },
  {
    id: "tanker-two-products-two-compartments", pillar: "tanker", path: "/guides/receiving-a-tanker/two-products-in-one-tanker/", hi: true, type: "Explainer", wave: 3,
    queries: ["ek tanker me petrol aur diesel dono ho to kaise utaarein", "Tanker with petrol and diesel in different compartments: how to receive it"],
    clauses: "1.1(iii), 1.2(vii), 1.2(viii), 1.2(xi), 2.3, 3.1(j)",
    brief: "Answers how to handle a lorry that carries more than one product. MDG-tagged: match the number of compartments and the quantity and product in each (1.1(iii)); dip and water-paste every compartment (1.2(vii)); check density and temperature of each compartment individually and record it (1.2(viii)); bottom retention samples are composites proportionate to the quantity in each compartment (2.3); decant each product into the correct underground tank (1.2(xi)). Mixed loads are barred only in lorries with a common manifold, which is a duty of the supply location (3.1(j)). A walk-through with one illustrative table, labelled as an example.",
  },
  {
    id: "tanker-unauthorised-product-found", pillar: "tanker", path: "/guides/receiving-a-tanker/unauthorised-product-in-tanker/", hi: true, type: "Explainer", wave: 3,
    queries: ["tanker me galat ya unauthorised product nikle to dealer par kya action hota hai", "Tanker carrying unauthorised product: what MDG 2024 says and which checks protect the dealer"],
    clauses: "5.1.7, 8.2(vii), 8.5.1, 8.5.2, 8.6, 1.2(iv), 1.2(viii), 1.2(ix), Notes to 5.1 (i)",
    brief: "Answers what MDG says if a tank lorry is found decanting unauthorised product into the outlet's tanks. MDG-tagged: it is irregularity 5.1.7 and critical, with termination at the first instance (8.2(vii)); it must be established first (8.5.2); a personal hearing precedes termination (8.6); the receipt checks (density within +/-3.0 kg/m3 of the invoice, compartment dips, bottom samples) and the retention-sample rule are what protect innocent dealers (1.2(iv), 1.2(viii), Notes to 5.1 (i)). MDG does not define 'unauthorised product': say so, keep the page narrow, and send the reader to the supply location in doubt (1.2(ix)). Needs {{penalty-note}}.",
  },
  {
    id: "tanker-selling-during-decant", pillar: "tanker", path: "/guides/receiving-a-tanker/selling-during-decant/", hi: true, type: "Explainer", wave: 3,
    queries: ["tanker khali hote waqt baaki pump se bikri kar sakte hain kya", "Can the pump keep selling while a tanker is being unloaded? What MDG 2024 says"],
    clauses: "1.2(vii), 1.2(xiv), 1.5(i), 1.5(ii)",
    brief: "Answers whether other nozzles may keep selling during unloading. MDG-tagged: only sales from the underground tank being filled must stop until decantation is complete (1.2(vii)); after decanting, at least 50 litres go through the pump before the density sample is taken (1.2(xiv)). MDG says nothing about other tanks or products, so give only the literal reading and tell the reader that PESO rules and company instructions may add limits (1.5(i), 1.5(ii)): confirm with the oil company. Any safety advice is practice and labelled.",
  },
  {
    id: "sampling-label-and-custody", pillar: "sampling", path: "/guides/sampling/label-and-custody/", hi: true, type: "Checklist", wave: 3,
    queries: ["pump se sample nikle to label par kya check karein aur apna sample kaise rakhein", "Sample drawn from your pump: what to check on the label and how to keep your set"],
    clauses: "2.2.2.2, 2.4.1, 2.4.2, 2.5(A), 2.7, 2.9.2, 7.3.1, Annexure 4, Annexure 11",
    brief: "Answers what to check on the label when an inspector or mobile lab draws a sample, and how to keep the dealer's set. MDG-tagged: containers are rinsed in the dealer's presence and the label records the outlet, product, dispensing unit and tank, the density in the register against the officer's reading, the date and lorry number of the last receipt, the seal numbers of the container and the wooden box, and the dealer's or representative's signature with the outlet seal (Annexure 4; Annexure 11 for a mobile lab); one of three sets stays with the dealer until testing and later steps end (2.9.2); officials pay and give a cash memo (2.2.2.2, 7.3.1). Describe the fields in our own words and never copy the form.",
  },
  {
    id: "sampling-result-waiting-time", pillar: "sampling", path: "/guides/sampling/how-long-for-sample-result/", hi: true, type: "Explainer", wave: 3,
    queries: ["sample ka result kitne din me aata hai", "How long does a petrol pump sample result take? MDG 2024 timelines"],
    clauses: "2.4.4, 2.5(D), 2.5(F), 2.5(H), 2.5(L), 2.10, 7.6, 8.5.6",
    brief: "Answers how long a sample result takes. Figures with clauses, all 'preferably': samples reach the lab within 10 days of drawal, are tested within the next 15 days and the result reaches the dealer within 5 days of the report (2.10), about 30 days in all (2.5(F)); special drives allow 15 days to reach the lab and testing within 30 days of receipt (2.10); a mobile lab hands failed-sample sets to the company preferably within 5 days (2.4.4); if everything passes the dealer is told in writing and the balance of a mobile lab's samples is returned (2.5(F), 7.6). The time frames are administrative and unrelated to product quality (2.5(L)); the show cause notice runs from the test results (8.5.6); link to the failed-sample page for the 10-day request on the retained sample (2.5(H)).",
  },
  {
    id: "sampling-retention-seal-or-leak", pillar: "sampling", path: "/guides/sampling/retention-sample-seal-or-leak/", hi: true, type: "Explainer", wave: 3,
    queries: ["retention sample ka seal toot jaye ya container leak kare to kya hoga", "Tank lorry retention sample with a broken seal or a leaking container: what MDG 2024 says"],
    clauses: "2.5(B), 2.5(C), 2.5(E), 2.7, 2.9.2, Chapter 2 General Notes (3), Notes to 5.1 (i)",
    brief: "Answers what happens when the retention sample's seal is broken or its container leaks. MDG-tagged: dealer and transporter are jointly responsible for correct sampling and safekeeping, in their own interest (2.5(B)); the container and the wooden box are both sealed with numbered plastic seals and wire (2.7); an inspector takes custody after checking the external seal and labels and records it on the joint memo, and a leaky or tampered inner container found at the lab rests with the dealer or transporter whose sample it is and is treated as under 2.5(E) (2.5(C)), meaning a sample not made available is recorded, the RO sample is compared with the depot sample and action is against the dealer only. MDG gives no repair or replacement step: say so; practice, labelled: check seals at each receipt.",
  },
  {
    id: "sampling-more-than-one-tank", pillar: "sampling", path: "/guides/sampling/pump-with-more-than-one-tank/", hi: true, type: "Explainer", wave: 3,
    queries: ["ek product ke do tank ho to sample aur density record kaise rakhein", "Pump with two petrol or two diesel tanks: tank-wise samples, labels and density records"],
    clauses: "2.2.2.2, 2.3, 2.4.1, 2.4.2, 2.9.2, Annexure 1, Annexure 3, Annexure 4",
    brief: "Answers how samples, labels and density records work when a product has more than one tank. MDG-tagged: the tank number is marked on the retention container and the last two loads are kept for each tank (2.3, 2.9.2, Annexure 3); the inspector draws from the nozzles of all tanks, six 1-litre samples per MS tank and three per HSD tank (2.2.2.2, 2.4.1, 2.4.2); the lorry samples compared are those of the tank connected to the dispensing unit sampled, and depot reference samples are needed for each tank's last receipt date where they differ (2.4.1(ii)-(iii)); the density record carries tank number and product (Annexure 1) and the sample label carries unit and tank (Annexure 4).",
  },
  {
    id: "density-out-of-range-what-happens", pillar: "density", path: "/guides/density/out-of-range-what-happens/", hi: true, type: "Explainer", wave: 3,
    queries: ["density range se bahar ya invoice se alag aaye to kya hoga", "Density out of range or different from the invoice: what happens at each stage"],
    clauses: "1.2(iv), 1.2(ix), 2.3, 2.4.3, 2.5(K), 2.10, 5.1.9, 7.4 Note (i), 7.4 Note (ii), 7.6, Annexure 12a, Annexure 13a",
    brief: "Answers what happens when density is out of range or differs from the reference, at four moments. MDG-tagged: on arrival, outside +/-3.0 kg/m3 of the invoice means calling the supply location or Area Field Officer (1.2(iv), 1.2(ix)); at inspection, a density or filter paper failure suspends sales of all products and samples go on priority (2.5(K)) and a missing reference density has its own ladder (5.1.9); a mobile lab report sets the dealer's tank density after the last receipt against the officer's reading, maximum variation 3.0 kg/m3 as printed (Annexures 12a, 13a), and failure in density or any clinical test is acted on as established adulteration with sales suspended (7.4 Notes (i)-(ii)). Give the 7.6 ranges (720-775, 810-845 and 820-860 kg/m3 at 15°C) and say MDG gives no tolerance for the dealer's own morning reading.",
  },
  {
    id: "density-2t-premix-nozzle", pillar: "density", path: "/guides/density/premix-2t-nozzle-sample/", hi: true, type: "Explainer", wave: 3,
    queries: ["2T petrol wale nozzle se density sample le sakte hain kya", "Density sample from a 2T premixed petrol nozzle: which nozzle to use"],
    clauses: "Notes to 5.1 (ii), 1.4.1(c), 1.2(xiv), 2.2.2.2, 2.4.1",
    brief: "Answers which nozzle to take a density sample from at a pump that sells 2T premixed petrol. MDG-tagged: an official MS sample is drawn only through a nozzle delivering non-2T premixed MS, and where every nozzle on that tank gives 2T premix, precautions must ensure the sample is free of 2T oil (Notes to 5.1 (ii)); the dealer's own morning and after-decant samples are drawn from the pump nozzle (1.4.1(c), 1.2(xiv)). MDG does not say which nozzle the dealer should use or how the precaution is taken; applying the same rule to the dealer's own sample is practice and must be labelled, with a line to confirm with the oil company.",
  },
  {
    id: "density-missing-on-invoice", pillar: "density", path: "/guides/density/missing-on-invoice/", hi: true, type: "Explainer", wave: 3,
    queries: ["invoice par density likhi hi nahi ho to kya karein", "Invoice has no density (or tank number) written on it: what to do before unloading"],
    clauses: "1.1(v), 1.2(iv), 1.2(ix), 2.2.1(iv), 2.10, 3.1(h)",
    brief: "Answers what to do when the invoice carries no density. MDG-tagged: the supply location must record density at 15°C, the filling point, the tank number and the release time on the invoice (2.2.1(iv), 3.1(h)); the dealer's receipt check is against that invoice density within +/-3.0 kg/m3 (1.1(v), 1.2(iv)); until decanting, the reference density is the figure in the dispatch document (2.10); in doubt, contact the supply location or Area Field Officer (1.2(ix)). MDG does not say what to do when the figure is missing and gives no substitute reference: say so; practice, labelled: ask the supply location to confirm the figure in writing before unloading.",
  },
  {
    id: "stock-book-and-dip-do-not-match", pillar: "stock", path: "/guides/stock-variation/book-and-dip-do-not-match/", hi: true, type: "Checklist", wave: 3,
    queries: ["stock aur dip match nahi kar raha pehle kya check karein", "Book stock and dip stock do not match: what to check first"],
    clauses: "1.2(xi), 1.2(xiii), 1.3, 1.4.1(b), 1.4.2(d), 5.1.11, Annexure 9",
    brief: "Answers what to re-check when the book and the dip disagree. MDG-tagged entries to look at: morning meter readings and product and water dips taken separately (1.3); receipts entered after decanting (1.2(xiii)); short-dip make-up quantities recorded on the back of the invoice (1.2(xi)); the testing quantity recorded in the stock register (1.4.2(d)); then the allowances, which are 4% operational variation, evaporation or handling loss, and shrinkage or TVA only where applicable (5.1.11, Annexures 8-10), and the Annexure 9 comparison of book closing stock against dip. The order of checking is practice and labelled; point to the positive-vs-negative page for what happens beyond the limits.",
  },
  {
    id: "stock-four-percent-of-what", pillar: "stock", path: "/guides/stock-variation/four-percent-of-what/", hi: true, type: "Explainer", wave: 3,
    queries: ["4 percent stock variation kitne ka hota hai", "Stock variation 4%: four percent of what, and how the check is made"],
    clauses: "5.1.11, Annexure 9, Annexure 10",
    brief: "Answers four percent of what. MDG-tagged: 5.1.11 sets normal operational variation at 4% of tank stock; Annexure 9 shows the comparison as book closing stock against closing stock as per dip, within +/-4% of the dip figure; Annexure 10 says the TVA method is the same as Annexure 9. One made-up example, marked 'for example', with a round closing dip figure showing the 4% band only; MDG gives no worked example that combines the 4% with the loss percentages, so none is invented, and the reader is pointed to the calculator and the oil company.",
  },
  {
    id: "stock-600-kl-slab", pillar: "stock", path: "/guides/stock-variation/annual-average-600-kl/", hi: true, type: "Explainer", wave: 3,
    queries: ["stock variation me 600 KL ka matlab kya hai", "Evaporation and handling loss allowance: what the 600 KL annual average means"],
    clauses: "5.1.11(i), 5.1.11(ii)",
    brief: "Answers what the 600 KL annual average means. MDG-tagged: MS evaporation and handling loss is 0.75% on quantity sold up to an annual average of 600 KL and 0.60% on the quantity beyond; HSD handling loss is 0.25% up to 600 KL and 0.20% beyond (5.1.11(i)-(ii)). MDG does not say how the annual average is worked out or how it applies to a shorter inspection period: say so and tell the reader to ask the oil company. One clearly labelled annual illustration of the rate step only, with no invented monthly conversion.",
  },
  {
    id: "quantity-broken-seal-first-steps", pillar: "quantity", path: "/guides/quantity/broken-seal-first-steps/", hi: true, type: "Checklist", wave: 3,
    queries: ["dispenser ka W&M seal toota ya alag mile to kya karein", "W&M seal broken, missing or different on a dispenser: first steps for the dealer"],
    clauses: "1.4.2(a), 4.3(a), 5.1.2(b), 5.1.3, 8.2(ii), 8.2(iii), 8.5.2",
    brief: "Answers what to do in the first hour when a W&M seal is found broken, missing or different. MDG-tagged: suspend sales through that dispensing unit forthwith, report at once to the controlling oil company office and keep it suspended until the seals are replaced (1.4.2(a)); a seal is deemed tampered if missing, if a seal other than the W&M inspector's is fitted, or if the wire is not in one piece, W&M's opinion is final and penal action follows even if delivery is correct or excess (5.1.2(b)); the unit is sealed and samples of all products go to the lab (5.1.2(b), 5.1.3); critical, termination at the first instance once established (8.2, 8.5.2); if the company's maintenance representative finds it broken, he informs the company and records it in the report the dealer also signs (4.3(a)). Practice, labelled: note the time and photograph it; never fit a seal yourself, since a seal other than the W&M inspector's counts as tampering.",
  },
  {
    id: "quantity-short-nozzle-or-whole-unit", pillar: "quantity", path: "/guides/quantity/short-nozzle-or-whole-unit/", hi: true, type: "Explainer", wave: 3,
    queries: ["ek nozzle kam tel de raha ho to poori machine band karni padegi kya", "Nozzle giving short delivery: does only that nozzle stop, or the whole dispenser?"],
    clauses: "1.4.2(d), 4.3(a), 5.1.2(a), 5.1.2(b), 5.1.3, 5.1.4, 8.4(iii)(h)",
    brief: "Answers whether a short-delivering nozzle stops alone or the whole dispenser stops. MDG-tagged: short beyond Legal Metrology limits with seals intact stops sales through the concerned unit or nozzle (nozzle only, for a dual DU or MPD) until recalibrated and re-stamped (5.1.2(a)); between +/-10 ml and +/-25 ml per 5 litres it is recorded, sales continue, and recalibration and re-stamping fall due within 15 days or that unit or nozzle is suspended (5.1.2(a) Note); the dealer notifies W&M and the oil company and does not operate the unit until re-stamped (1.4.2(d)); recalibration is arranged with the W&M inspector (4.3(a)); minor class (8.4(iii)(h)). Point out that 1.4.2(d) says 'dispensing unit' while 5.1.2(a) says 'unit or nozzle' and tell the reader to confirm with the oil company; seal tampering, totaliser tampering and unauthorised fittings suspend the whole unit (5.1.2(b), 5.1.3, 5.1.4).",
  },
  {
    id: "quantity-dispenser-repair-record", pillar: "quantity", path: "/guides/quantity/dispenser-repair-record/", hi: true, type: "Explainer", wave: 3,
    queries: ["dispenser ka part badalwana ho to kya dhyan rakhein", "Dispenser repair or part replaced: what counts as tampering and what the job report records"],
    clauses: "4.1, 4.2(a), 4.2(b), 4.3(a), 5.1.4, 5.1.12(ii), 8.2(iv), Annexure 6",
    brief: "Answers what MDG counts as tampering when a dispenser part is repaired or replaced, and what the job report records. MDG-tagged: addition, removal, replacement or manipulation of any part, including gears, microprocessor chips, electronic parts or OEM software, is deemed tampering with the manufacturer's opinion sought, and it is critical (5.1.4, 8.2(iv)); the company attends breakdowns of its own equipment and the dealer reports them promptly (4.2(a)) while the dealer maintains his own equipment (4.2(b)); the job report records repairs, parts replaced and parts required and checks for unauthorised fittings, signed by both sides (4.1, Annexure 6), and pump maintenance records are kept for the current and previous financial year (5.1.12(ii)). MDG does not say a recorded replacement is exempt: state that plainly; practice, labelled: take the signed copy before the visitor leaves.",
  },
  {
    id: "quantity-dispenser-inspection-checklist", pillar: "quantity", path: "/guides/quantity/dispenser-inspection-checklist/", hi: true, type: "Checklist", wave: 3,
    queries: ["inspector dispenser par kya kya check karta hai", "What an inspector checks on a dispenser: seals, 5 litre test, fittings and stickers"],
    clauses: "1.4.2(a), 1.4.2(e), 1.4.2(f), 5.1.2(a), 5.1.3, 5.1.4, 5.1.17, circular 20.03.2025 item 3",
    brief: "Answers what is looked at on a dispenser, as a checklist grouped by what is seen. MDG-tagged: W&M seals on the metering unit and totaliser and valid W&M certification (1.4.2(a)); delivery against the 5-litre measure, noting the +/-10 ml to +/-25 ml band (5.1.2(a)); no extra fittings, chips or software changes (5.1.4); the totaliser working, and reported if not (5.1.3); zero before each delivery with a sticker on each unit and the closing reading shown (1.4.2(f), 5.1.17, circular item 3); the product name on each MPD nozzle (5.1.17); the daily leak check on pump, hose and nozzle (1.4.2(e)). Each line gets its class from the penalties pages by link; the long pages are linked, not repeated.",
  },
  {
    id: "quantity-lube-measures-stamp", pillar: "quantity", path: "/guides/quantity/lube-measures-stamp/", hi: true, type: "Explainer", wave: 3,
    queries: ["lube oil naapne ke measure par W&M stamp zaroori hai kya", "Lube oil measures at the pump island and service bay: the W&M stamp rule"],
    clauses: "1.4.2(b), 1.4.2(c), 7.1, 8.5.4",
    brief: "Answers whether lube oil measures need a W&M stamp. MDG-tagged: all measures used to dispense bulk lube oil on the pump island and in service bays must be duly stamped by Weights and Measures (1.4.2(c)); this is separate from the verified 5-litre measure kept only for pump testing (1.4.2(b)); mobile labs may also take lube samples (7.1). MDG names no specific irregularity or amount for unstamped measures, and irregularities it does not cover are dealt with after enquiry on natural-justice principles (8.5.4): say so plainly and keep the page short.",
  },
  {
    id: "service-customer-complaint-steps", pillar: "service", path: "/guides/customer-service/customer-complaint-steps/", hi: true, type: "Checklist", wave: 3,
    queries: ["customer shikayat kare to kya karna chahiye", "Customer complains about quantity, quality or price: what the dealer and staff should do"],
    clauses: "1.4.1(a), 1.4.2(f), 1.6(iii), 1.6(iv), 1.6(viii), 2.2.2.2, 5.1.15, 5.1.17, circular 20.03.2025 items 3 and 18",
    brief: "Answers what the dealer and staff should do at the counter when a customer complains. MDG-tagged: show zero before each delivery and the closing reading (1.4.2(f), circular item 3); give filter paper for MS on demand (1.4.1(a)); keep the complaint book ready with a displayed notice and show the dealer's and the oil company's contact names and numbers (1.6(iv), 1.6(viii), 5.1.17); courteous behaviour (1.6(iii)); price on display (5.1.15); a specific complaint to the company can lead to sampling (2.2.2.2). A 5-litre check on request is practice, not an MDG duty: label it. Neutral tone and no helpline numbers.",
  },
  {
    id: "service-air-and-telephone", pillar: "service", path: "/guides/customer-service/air-and-telephone/", hi: true, type: "Explainer", wave: 3,
    queries: ["pump par hawa aur telephone ki suvidha zaroori hai kya", "Air and telephone facility at a petrol pump: what MDG 2024 requires"],
    clauses: "1.6(ii), 1.6(vii), 5.1.14(a), 8.4(ii), circular 20.03.2025 item 6",
    brief: "Answers what MDG requires for air and telephone. MDG-tagged: air facility for customers during operating hours (1.6(ii)); air with a calibrated air gauge (5.1.14(a)); manned air facility (circular item 6); a telephone facility in the premises (1.6(vii)); non-provision is minor (8.4(ii)): warning-cum-guidance letter, then Rs 10,000, then Rs 25,000 (8.4), with {{penalty-note}}. MDG gives no calibration interval for the gauge and no standard for the telephone: say so and tell the reader to ask the oil company.",
  },
  {
    id: "service-hours-and-holiday-notice", pillar: "service", path: "/guides/customer-service/working-hours-and-holiday-notice/", hi: true, type: "Explainer", wave: 3,
    queries: ["pump ke khulne ka time aur holiday notice kab lagana hai", "Working hours, holiday notice and manned nozzles: what MDG 2024 asks of a pump"],
    clauses: "1.6(ii), 1.6(v), 5.1.18, 8.4(iii)(f), circular 20.03.2025 items 2 and 17",
    brief: "Answers what MDG asks about working hours, holiday notices and manned units. MDG-tagged: working hours displayed prominently and holiday notices displayed well in time (1.6(v)); circular items 17 (display of working hours) and 2 (dispensing units manned by CA, DSM or CSA during working hours); air during operating hours (1.6(ii)); deficiencies are minor under 5.1.18 (8.4(iii)(f)). MDG gives no minimum hours and does not say how many days 'well in time' is: state that and send the reader to the oil company.",
  },
  {
    id: "service-digital-payment-enabled", pillar: "service", path: "/guides/customer-service/digital-payment-enabled/", hi: true, type: "Explainer", wave: 3,
    queries: ["pump par card machine ya QR kaam na kare to kya MDG me penalty hai", "Digital payment at a petrol pump: what the minimum service obligations require"],
    clauses: "5.1.18, 8.4(iii)(f), 8.4, 8.5.2, circular 20.03.2025 item 9",
    brief: "Answers whether MDG requires digital payment to be working and what follows if it is not. Circular 20.03.2025 item 9: digital payment (credit or debit card, loyalty machine, QR code and so on) should be available and enabled; a deviation found at inspection is acted on under 5.1.18 as a minor irregularity (8.4(iii)(f)): warning-cum-guidance letter, Rs 10,000, then Rs 25,000 per irregularity, counted as one with other a-h items (8.4); it must be established first (8.5.2). Neither MDG nor the circular says anything on outage length, bank or network faults or a cash fallback: say so and tell the reader to ask the oil company.",
  },
  {
    id: "service-forecourt-housekeeping", pillar: "service", path: "/guides/customer-service/forecourt-housekeeping/", hi: true, type: "Checklist", wave: 3,
    queries: ["pump ki safai aur housekeeping me kya kya dekha jata hai", "Forecourt, driveway and sales room housekeeping checklist under MDG 2024"],
    clauses: "1.6(x), 5.1.17, 5.1.18, 8.4(iii)(d), circular 20.03.2025 items 4, 10, 11, 12, 13, 15",
    brief: "Answers what MDG and the circular tie to housekeeping, as a checklist. MDG-tagged: poor housekeeping is a minor irregularity (5.1.17, 8.4(iii)(d)); the outlet is kept adequately illuminated and clean per the company's housekeeping standards (1.6(x)); circular items 4 (marshalling and regulating the queue), 10 (dispensing units, pedestals, island and lube display clean), 11 (driveway entry and exit free of obstacles, clean and lit), 12 (emblem, light poles, monolith, signage and fascia clean), 13 (sales room neat and clean) and 15 (utility bins and dustbins clean and easy to reach). MDG sets no standard of its own and refers to the company's standards: say so.",
  },
  {
    id: "service-safety-equipment-and-signs", pillar: "service", path: "/guides/customer-service/safety-equipment-and-signs/", hi: true, type: "Checklist", wave: 3,
    queries: ["pump par safety equipment aur no smoking board ke liye MDG kya kehta hai", "Safety equipment, trained staff and safety signs at a petrol pump: what MDG 2024 asks"],
    clauses: "1.2(i), 1.5(ii), 1.6(xi), 5.1.18, circular 20.03.2025 item 16",
    brief: "Answers what MDG asks about safety equipment, trained staff and safety signs. MDG-tagged: safety equipment as per statutory requirements, kept in working condition, with the dealer trained and trained staff available to operate it (1.6(xi)); PESO rules observed (1.5(ii)); a DCP extinguisher near the lorry during unloading (1.2(i)); proper safety signages such as no smoking and switch off engine (circular item 16, where the company's letter format also names 'No Mobile' as an example); a deficiency is minor under 5.1.18. MDG lists no equipment of its own and the statutory list applies: say so.",
  },
  {
    id: "service-product-not-available", pillar: "service", path: "/guides/customer-service/product-not-available/", hi: true, type: "Explainer", wave: 3,
    queries: ["pump par petrol ya diesel khatam ho jaye to MDG me kya penalty hai", "Product not available at the pump (dry out): what the MDG 2024 service obligations say"],
    clauses: "1.5(iii), 5.1.6, 5.1.18, 8.2(vi), 8.4(iii)(f), circular 20.03.2025 item 1",
    brief: "Answers what MDG says if a product runs out. Circular 20.03.2025 item 1: always ensure availability of all products at the RO; a deficiency is minor under 5.1.18 (8.4(iii)(f)): warning-cum-guidance letter, Rs 10,000, then Rs 25,000. MDG gives no ordering deadline and does not define when an outlet counts as dry, so say so. The real warning, MDG-tagged: buying or exchanging product from anyone other than the principal oil company is unauthorised purchase, which is critical (1.5(iii), 5.1.6, 8.2(vi)); practice, labelled: order early and record the order time.",
  },
  {
    id: "penalties-minor-ladder", pillar: "penalties", path: "/guides/penalties/minor-irregularity-ladder/", hi: true, type: "Explainer", wave: 3,
    queries: ["minor irregularity par pehli baar kya hota hai aur dobara kitna penalty", "Minor irregularity at a petrol pump: warning letter, Rs 10,000 and Rs 25,000 explained"],
    clauses: "8.1, 8.4, 8.5.2, 8.5.3, 8.5.5, 8.7, 8.8(iii)",
    brief: "Answers what happens at the first, second and third minor irregularity, in one place. Figures: warning-cum-guidance letter first; Rs 10,000 per irregularity second; Rs 25,000 per irregularity third onward (8.4); items a to h under miscellaneous count as one irregularity for action, while records (i) and air, telephone and first aid (ii) are listed separately and the one-irregularity line names only a to h (8.4). Five-year instance count (8.5.5), established first (8.5.2), fines payable within 30 days (8.7), approval by the Territory, Regional or Divisional head (8.8(iii)); needs {{penalty-note}} and a made-up example of a toilet lapse and a display lapse found together counting as one.",
  },
  {
    id: "penalties-beyond-the-table", pillar: "penalties", path: "/guides/penalties/beyond-the-table/", hi: true, type: "Explainer", wave: 3,
    queries: ["kya company MDG me likhe se zyada penalty laga sakti hai", "Is the MDG penalty table the limit? Higher action and irregularities not on the list"],
    clauses: "8.1, 8.5.1, 8.5.2, 8.5.4, 8.8, 8.9",
    brief: "Answers whether the MDG table is the limit. MDG-tagged: the actions in MDG 2024 are minimum and the competent authority may take higher action, including termination in the first or any instance, in line with the Agreement (8.5.1); an irregularity must be established first (8.5.2); irregularities not covered are acted on after enquiry and on natural-justice principles (8.5.4); approval levels differ by class (8.8); the 30-day appeal is only for termination arising from MDG (8.9). No opinion on fairness; end with the legal line.",
  },
  {
    id: "penalties-unauthorised-purchase-sale", pillar: "penalties", path: "/guides/penalties/unauthorised-purchase-sale-storage/", hi: true, type: "Explainer", wave: 3,
    queries: ["company ke bahar se tel kharidna ya bechna MDG me kya hota hai", "Unauthorised purchase, sale or storage at a petrol pump: what MDG 2024 counts as critical"],
    clauses: "1.5(iii), 5.1.5, 5.1.6, 5.1.11, 8.2(v), 8.2(vi), 8.5.2, 8.6",
    brief: "Answers what counts as unauthorised purchase, sale or storage. MDG-tagged: purchase from a source other than those authorised by the principal oil company is unauthorised purchase, and any sale of MS or HSD other than through the outlet's own dispensing units is unauthorised sale (5.1.6); the dealer must not buy, sell or exchange with any other dealer or anyone but the principal oil company (1.5(iii)); unauthorised storage is a facility inside the licensed area not approved by the company, or one outside it with an interconnection, where interconnection means an unauthorised link between tanks inside the premises (5.1.5); all are critical, termination at the first instance (8.2(v), (vi)), with a personal hearing before termination (8.6). Positive stock variation can lead to this finding (5.1.11); needs {{penalty-note}}.",
  },
  {
    id: "penalties-sales-stopped-on-the-spot", pillar: "penalties", path: "/guides/penalties/when-sales-stop-on-the-spot/", hi: true, type: "Explainer", wave: 3,
    queries: ["pump ki bikri turant kab band ho sakti hai", "When can sales be stopped on the spot at a petrol pump? Every trigger in MDG 2024"],
    clauses: "1.4.2(a), 1.4.2(d), 2.5(K), 4.3(b), 4.3(c), 5.1.2(a), 5.1.2(b), 5.1.3, 5.1.4, 5.1.9, 5.1.11, 7.4 Note (ii), 7.6.1(b)",
    brief: "Answers when sales can be stopped on the spot, as a table of triggers grouped by our own headings rather than chapter order. MDG-tagged: tampered W&M seal, totaliser or fittings suspend that dispensing unit (5.1.2(b), 5.1.3, 5.1.4); short delivery beyond the limit suspends that unit or nozzle (5.1.2(a)); missing reference density, positive stock variation beyond limits, and a density, filter paper or mobile lab clinical failure suspend all products pending samples (5.1.9, 5.1.11, 2.5(K), 7.4 Note (ii)); ethanol content out of range after water removal stops sales (4.3(c)); a major pipeline leak leads the representative to advise suspension (4.3(b)); negative variation lets sales continue unless the explanation fails (5.1.11). Say this is separate from the penalty suspensions of 8.3.",
  },
  {
    id: "automation-power-cut-backup", pillar: "automation", path: "/guides/automation/power-cut-and-backup/", hi: true, type: "Explainer", wave: 3,
    queries: ["light chali jaye to automated pump me kya karna chahiye", "Power cut at an automated petrol pump: generator, UPS and what to report"],
    clauses: "1.5(viii), 1.5(ix), 5.1.16(a), 5.1.16(b), 5.1.16 Note, 8.3(vii)",
    brief: "Answers what to do in a power cut at an automated outlet. MDG-tagged: a power backup, generator or UPS, must be ensured, which matters for automated outlets and electronic totalisers (1.5(ix)); a malfunction of automation is reported to the authorised company official immediately and then handled as directed (1.5(viii)); running a unit in manual mode, or leaving the ATG off or non-operational, without written authorisation is an irregularity (5.1.16(a), (b)), with authorisation only by email or a signed letter from a company official kept on record (5.1.16 Note); major, with Rs 1,00,000, then Rs 2,00,000 plus 7 days' suspension, then termination (8.3(vii)) and {{penalty-note}}. MDG gives no backup duration: say so.",
  },
  {
    id: "automation-atg-not-working", pillar: "automation", path: "/guides/automation/atg-not-working/", hi: true, type: "Explainer", wave: 3,
    queries: ["ATG band ya kharab ho jaye to kya karna chahiye", "ATG switched off or not working at an automated pump: what MDG 2024 says"],
    clauses: "1.5(viii), 4.2(a), 5.1.16(b), 5.1.16(c), 5.1.16 Note, 8.3(vii)",
    brief: "Answers what MDG says when the ATG is switched off or not working. MDG-tagged: an ATG switched off or non-operational without authorisation from the competent authority is irregularity 5.1.16(b); deliberately disabling any other automation component is (c), which excludes dispensing units, MPDs and ATGs; authorisation counts only by email or a signed letter from a company official and the dealer keeps it (5.1.16 Note); report any malfunction immediately and follow the company's direction (1.5(viii)); the company attends breakdowns of its own equipment and the dealer reports them promptly (4.2(a)); major, with the 8.3(vii) ladder and {{penalty-note}}. MDG does not define 'competent authority': say so.",
  },
  {
    id: "company-sample-containers-and-seals", pillar: "company", path: "/guides/oil-company-duties/sample-containers-and-seals/", hi: true, type: "Explainer", wave: 3,
    queries: ["sample ke container seal aur label kaun deta hai", "Who supplies sample containers, seals and labels, and when to ask for more"],
    clauses: "2.3, 2.6(A), 2.6(B), 2.6 Note, 2.7, 2.8, 2.9.2",
    brief: "Answers who supplies sample material and what the dealer must do. MDG-tagged: the oil company supplies adequate 1-litre aluminium containers with wooden boxes, random-numbered plastic seals, ISI-marked stainless steel sealing wire, sealing pliers and printed labels at the outlet free of cost (2.6(A)-(B), 2.7, 2.8); the dealer must request them in time (2.6(B)); the inspecting official or mobile lab replaces the empty container for any collected (2.6(B)); the supply location keeps a corpus of containers for company-owned lorries (2.6 Note). Link to the retention page: each load needs 2x1 litre MS and/or 1x1 litre HSD drawn before unloading (2.3). MDG gives no re-order quantity: say so.",
  },
  {
    id: "company-maintenance-job-report", pillar: "company", path: "/guides/oil-company-duties/maintenance-job-report/", hi: true, type: "Checklist", wave: 3,
    queries: ["company ka fitter job report de to sign karne se pehle kya dekhein", "Fitter's maintenance job report: what to check before the dealer signs"],
    clauses: "4.1, 4.2(a), 4.3(a), 4.3(b), 4.4, 5.1.12(ii), Annexure 6",
    brief: "Answers what the dealer should look at before signing the company's job report (Annexure 6, Hindi or English, 4.1). Describe in our own words, never copy the form, what it records: purpose of visit, equipment details, whether delivery rate is right, filters, hoses and nozzles for leaks, the W&M seal calibration check, the tank water dip in cm, tank interconnection, any unauthorised fitting, silica gel on the ethanol-blended MS vent, repairs done, parts replaced and required, times, and both signatures. MDG-tagged: a broken W&M seal is recorded in this report and the dealer signs too (4.3(a)); for a major leak the totaliser reading and tank dip are noted and signed (4.3(b)); water dip on every visit (4.4); keep it as a pump maintenance record for the current and previous financial year (5.1.12(ii)). Practice, labelled: no blank fields before signing.",
  },
  {
    id: "company-depot-reference-sample", pillar: "company", path: "/guides/oil-company-duties/depot-reference-sample/", hi: true, type: "Explainer", wave: 3,
    queries: ["depot ka sample kitne din rakha jata hai", "Depot reference sample is kept 30 days: why a quality doubt should be raised early"],
    clauses: "2.2.1(i), 2.2.1(ii), 2.2.1(iii), 2.5(G), 2.5(I), 2.9.1, 3.1(e), Chapter 2 General Notes (1)",
    brief: "Answers how long the depot keeps its reference sample and why it matters to a dealer. MDG-tagged: supply locations collect at least 4x1 litre MS and 2x1 litre HSD from the filling point every day and again at a tank switch-over (2.2.1(i)-(ii)); samples carry traceable numbers and are kept at least 30 days (2.2.1(iii), 2.9.1), the number going on the delivery documents (3.1(e)); the lab needs the supply location sample if it is within the retention period (2.5(I)), compares RO, TL1 and SL1 (2.5(G)), and uses the lab report if the depot sample has already been sent for testing (General Notes (1)). MDG does not tell the dealer to complain within 30 days: say so; practice, labelled: note invoice details and date when raising a doubt.",
  },
  {
    id: "sko-inspection-checklist", pillar: "sko", path: "/guides/sko-dealers/inspection-checklist/", hi: true, type: "Checklist", wave: 3,
    queries: ["SKO dealer ke inspection me kya kya ready rakhna chahiye", "Kerosene (SKO) wholesale dealer: what to keep ready for an oil company inspection"],
    clauses: "Chapter 6 (items 1-7), 8.10",
    brief: "Answers what an SKO wholesale dealer should have ready for an inspection, as a checklist from Chapter 6. MDG-tagged: only blue-dyed kerosene to the intended persons; no refusal during working hours when stock is held; no closure in working hours without the company's prior written permission; no price above the fixed price; adequate stock at all times; a stock-cum-price board displayed; and a daily account of purchase, sale and stock at the premises or tank lorry (Chapter 6 items 1-7). Company officials inspect and act under 8.10 (critical, major, minor; major means allocation cut by 50% for three calendar months with State Govt approval); the rest follows RO rules as applicable (8.10). 8.10 names stock variation 'beyond permissible limits' without a limit: do not invent one.",
  },
];

export const byId = new Map(PAGES.map((p) => [p.id, p]));

/** The public path of a page in a language. */
export function pathOf(page: GuidePage, lang: Lang): string {
  return `${prefixOf(lang)}${page.path}`;
}

applyTranslations(PAGES, MDG_TRANSLATIONS);
