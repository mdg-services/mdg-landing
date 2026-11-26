import { guideNow } from "@/guides/clock";
import { KK, MDG, PUMP, SITE, contextAt, isLive, pathOf, type Ctx, type Lang } from "@/guides/model";
import { getT } from "@/i18n/server";
import { DOC_KEY } from "@/i18n/doc";
import { COMPANY_ROUTES, LANGUAGES, pathFor } from "@/i18n/lang";
import { OTHER_LANGS, localPath } from "@/i18n/languages";
import { pageLangs } from "../../guide/calendar";
import { docFacts, fill } from "@/lib/docText";
import catalog from "@/videos/catalog.json";

/**
 * llms.txt: a plain list of the site's pages for AI assistants that read it,
 * grouped the way the guides are: the company and the apps, the MDG guides (a
 * "start here" section, then one section per topic and one for the tools), then
 * the Khata Kavach pages (the same, per topic), each page followed by its twin
 * in every other language it is live in (Hindi, Odia, …: src/i18n/languages.ts).
 * Only the guide pages that are live today are listed. Refreshed hourly, like
 * the sitemap.
 */
export const revalidate = 3600;

/** The sections, in order: the pillar they list and the heading they carry. */
const SECTIONS: { pillar: string; heading: string }[] = [
  { pillar: "hub", heading: "MDG guides: start here (the guide, disclaimer and reference pages)" },
  { pillar: "penalties", heading: "Penalties" },
  { pillar: "inspection", heading: "Inspections and notices" },
  { pillar: "density", heading: "Density and quality" },
  { pillar: "stock", heading: "Stock variation" },
  { pillar: "quantity", heading: "Meters and seals" },
  { pillar: "tanker", heading: "Receiving a tanker" },
  { pillar: "sampling", heading: "Samples and labs" },
  { pillar: "service", heading: "Customer facilities" },
  { pillar: "automation", heading: "Automated outlets" },
  { pillar: "company", heading: "Oil company duties" },
  { pillar: "sko", heading: "Kerosene dealers" },
  { pillar: "tools", heading: "Tools" },
];

const line = (title: string, url: string, description: string) => `[${title}](${url}): ${description}`;

/** The label in front of a non-English entry, in that language's own script: "हिंदी: ", "ଓଡ଼ିଆ: ". */
const tag = (lang: Lang) => `${LANGUAGES[lang].native}: `;

/** One page's lines: the English entry, then its twins under it (or the first live language's entry alone when English is not live). */
function entry(ctx: Ctx, id: string): string[] {
  const page = ctx.col.byId.get(id)!;
  const out: string[] = [];
  let nested = false;
  for (const lang of pageLangs(page)) {
    if (!isLive(ctx, id, lang)) continue;
    const c = ctx.content.get(`${lang}:${id}`)!;
    const text = line(c.title, `${SITE}${pathOf(page, lang)}`, c.description);
    out.push(nested ? `  - ${tag(lang)}${text}` : `- ${lang === "en" ? "" : tag(lang)}${text}`);
    nested = true;
  }
  return out;
}

export function GET(): Response {
  const now = guideNow();
  const ctx = contextAt(MDG, now);
  const kk = contextAt(KK, now);
  const pump = contextAt(PUMP, now);

  /** An entry for a site page: the English line, then one nested line per other language. */
  const sitePage = (route: Parameters<typeof pathFor>[1], about: (lang: Lang) => { title: string; text: string }) => [
    `- ${line(about("en").title, `${SITE}${pathFor("en", route)}`, about("en").text)}`,
    ...OTHER_LANGS.map((l) => `  - ${tag(l)}${line(about(l).title, `${SITE}${pathFor(l, route)}`, about(l).text)}`),
  ];
  const company = [
    ...sitePage("", (l) => ({ title: l === "en" ? "MDG Services: Dealer's Kavach" : "MDG Services: Dealer's कवच", text: getT(l).meta.description })),
    ...sitePage("/khata-kavach", (l) => ({ title: l === "en" ? "Khata Kavach" : getT(l).kk.name, text: getT(l).kk.meta.description })),
    // Kavach Shuruaat: the Dealer Kavach app's rule-book chat for people planning a pump (ADR 0058)
    ...sitePage("/new-pump", (l) => ({ title: getT(l).newPump.name, text: fill(getT(l).newPump.meta.description, docFacts(l)) })),
    // and its questions page: the short answers people look for before opening a pump (ADR 0059 §6)
    `- ${line(getT("en").shuruaat.llms.questionsTitle, `${SITE}/new-pump/questions`, getT("en").shuruaat.llms.questionsText)}`,
    ...OTHER_LANGS.map((l) => `  - ${tag(l)}${line(getT(l).shuruaat.llms.questionsTitle, `${SITE}${localPath(l, "/new-pump/questions")}`, getT(l).shuruaat.llms.questionsText)}`),
    ...sitePage("/register", (l) => ({ title: getT(l).register.pageTitle, text: getT(l).register.intro })),
    ...sitePage("/grievance", (l) => ({ title: getT(l).grievance.pageTitle, text: getT(l).grievance.metaDescription })),
    // About, contact, pricing, terms, refund and shipping: the pages that say who is behind the site
    ...COMPANY_ROUTES.flatMap((route) =>
      sitePage(route, (l) => {
        const d = getT(l)[DOC_KEY[route]];
        return { title: d.pageTitle, text: fill(d.metaDescription, docFacts(l)) };
      }),
    ),
  ];

  // The short explainer videos: one page each, in Hindi (the bare address) and English (?lang=en).
  const videos = catalog.videos.flatMap((v) => [
    `- ${line(v.en.title, `${SITE}/videos/${v.slug}?lang=en`, v.en.subtitle)}`,
    `  - हिंदी: ${line(v.hi.title, `${SITE}/videos/${v.slug}`, v.hi.subtitle)}`,
  ]);

  const sections = SECTIONS.map(({ pillar, heading }) => {
    const lines = MDG.pages.filter((p) => p.pillar === pillar).flatMap((p) => entry(ctx, p.id));
    return lines.length ? `## ${heading}\n\n${lines.join("\n")}\n` : "";
  }).filter(Boolean);

  // The Khata Kavach pages, in the order of their topics: the front door first.
  const kkSections = Object.entries(KK.pillars).map(([pillar, meta]) => {
    const lines = KK.pages.filter((p) => p.pillar === pillar).flatMap((p) => entry(kk, p.id));
    const heading = pillar === "hub" ? "Khata Kavach: start here" : `Khata Kavach: ${meta.en}`;
    return lines.length ? `## ${heading}\n\n${lines.join("\n")}\n` : "";
  }).filter(Boolean);

  // The Petrol pump guide: the front door first, then one section per topic.
  const pumpSections = Object.entries(PUMP.pillars).map(([pillar, meta]) => {
    const lines = PUMP.pages.filter((p) => p.pillar === pillar).flatMap((p) => entry(pump, p.id));
    const heading = pillar === "hub" ? "Petrol pump guide: start here" : `Petrol pump guide: ${meta.en}`;
    return lines.length ? `## ${heading}\n\n${lines.join("\n")}\n` : "";
  }).filter(Boolean);
  const pumpIntro = pumpSections.length
    ? "\n## About the Petrol pump guide\n\nPlain-language pages from MDG Services on getting, licensing and running a petrol pump in India (dealership, cost, licences, land, fire safety, equipment, staff, fuels, complaints), in English and Hindi. Every fact names its source (a law, a rule, a government notice or an oil company's published guideline) and the date it was checked. MDG Services does not sell or arrange dealerships or licences.\n\n"
    : "";
  const kkIntro = kkSections.length
    ? "\n## About the Khata Kavach pages\n\nPlain-language pages from MDG Services, the maker of Khata Kavach, on giving fuel on credit (udhar) to transporters and other regular customers and keeping the account, in English and Hindi. Facts about other apps come from their own websites on the date each page shows; check them there. General information, not legal, tax or financial advice.\n\n"
    : "";
  // Said once, in plain words, so an assistant asked for Odia knows where the Odia pages are and what they are.
  const odiaNote = `## Odia (ଓଡ଼ିଆ)\n\nThe whole website (home, Khata Kavach, Kavach Shuruaat, enrolment, grievance, pricing, terms, refund and shipping pages) and a selected set of the guides are also written in Odia, under ${SITE}/or . The Odia guides cover the MDG guide's front door, petrol and diesel density, penalties, inspections, stock variation and receiving a tanker, and the Petrol pump guide's pages on opening a pump (eligibility, process, rural outlets), licences and money. The Odia pages are translations for Odia-speaking readers: where the English and Odia differ, the English page and the oil companies' official documents are the reference. The Dealer's Kavach and Khata Kavach apps themselves work in Hindi and English.\n\n`;
  const text = `# MDG Services: Dealer's Kavach, Khata Kavach and plain-language guides\n\n> MDG Services (a brand of VRUOOM Private Limited, India) makes two apps: Dealer's Kavach, which keeps an Indian petrol pump dealer's filings, renewals, inspections and daily reports on time, and Khata Kavach, a shared account book between a petrol pump and its transporters. Inside the Dealer's Kavach app, Kavach Shuruaat is a paid rule-book chat for people planning a petrol pump: it explains the official rules and does not sell or arrange dealerships. It also publishes plain-language guides in English and Hindi, and a selected set in Odia: to the Marketing Discipline Guidelines 2024 (MDG 2024) for petrol pump dealers, and to giving fuel on credit. The MDG guides are not the official text: refer to the oil companies' official guidelines and circulars for accurate and current rules. MDG Services is a private company, not connected with IndianOil, BPCL, HPCL or any government body.\n\n## The company and the apps\n\n${company.join("\n")}\n\n${odiaNote}## Short videos on running a pump\n\nOne-minute videos in Hindi and English on the daily rules of a petrol pump, each on its own page. Library: ${SITE}/videos\n\n${videos.join("\n")}\n\n${sections.join("\n")}${kkIntro}${kkSections.join("\n")}${pumpIntro}${pumpSections.join("\n")}`;
  return new Response(text, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
