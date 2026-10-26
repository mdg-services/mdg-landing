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
];

export const byId = new Map(PAGES.map((p) => [p.id, p]));

export type Lang = "en" | "hi";

/** The public path of a page in a language. */
export function pathOf(page: GuidePage, lang: Lang): string {
  return lang === "hi" ? `/hi${page.path}` : page.path;
}
