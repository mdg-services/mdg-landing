import { guideNow } from "@/guides/clock";
import { KK, MDG, SITE, contextAt, isLive, pathOf, type Ctx, type Lang } from "@/guides/model";
import { getT } from "@/i18n/server";
import { DOC_KEY } from "@/i18n/doc";
import { COMPANY_ROUTES, pathFor } from "@/i18n/lang";
import { docFacts, fill } from "@/lib/docText";

/**
 * llms.txt: a plain list of the site's pages for AI assistants that read it,
 * grouped the way the guides are: the company and the apps, the MDG guides (a
 * "start here" section, then one section per topic and one for the tools), then
 * the Khata Kavach pages (the same, per topic), each page followed by its Hindi
 * twin. Only the guide pages that are live today are listed. Refreshed hourly,
 * like the sitemap.
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

/** One page's lines: the English entry, then its Hindi twin under it (or the Hindi entry alone when only that one is live). */
function entry(ctx: Ctx, id: string): string[] {
  const page = ctx.col.byId.get(id)!;
  const out: string[] = [];
  const one = (lang: Lang, nested: boolean) => {
    const c = ctx.content.get(`${lang}:${id}`)!;
    const text = line(c.title, `${SITE}${pathOf(page, lang)}`, c.description);
    out.push(nested ? `  - हिंदी: ${text}` : `- ${lang === "hi" ? "हिंदी: " : ""}${text}`);
  };
  const en = isLive(ctx, id, "en");
  const hi = page.hi && isLive(ctx, id, "hi");
  if (en) one("en", false);
  if (hi) one("hi", en);
  return out;
}

export function GET(): Response {
  const now = guideNow();
  const ctx = contextAt(MDG, now);
  const kk = contextAt(KK, now);
  const en = getT("en");
  const hi = getT("hi");

  const company = [
    `- ${line("MDG Services: Dealer's Kavach", `${SITE}/`, en.meta.description)}`,
    `  - हिंदी: ${line("MDG Services: Dealer's कवच", `${SITE}/hi`, hi.meta.description)}`,
    `- ${line("Khata Kavach", `${SITE}/khata-kavach`, en.kk.meta.description)}`,
    `  - हिंदी: ${line("खाता कवच", `${SITE}/hi/khata-kavach`, hi.kk.meta.description)}`,
    `- ${line(en.register.pageTitle, `${SITE}/register`, en.register.intro)}`,
    `  - हिंदी: ${line(hi.register.pageTitle, `${SITE}/hi/register`, hi.register.intro)}`,
    `- ${line(en.grievance.pageTitle, `${SITE}/grievance`, en.grievance.metaDescription)}`,
    `  - हिंदी: ${line(hi.grievance.pageTitle, `${SITE}/hi/grievance`, hi.grievance.metaDescription)}`,
    // About, contact, pricing, terms, refund and shipping: the pages that say who is behind the site
    ...COMPANY_ROUTES.flatMap((route) => {
      const facts = docFacts("en");
      const d = en[DOC_KEY[route]];
      const h = hi[DOC_KEY[route]];
      return [
        `- ${line(d.pageTitle, `${SITE}${pathFor("en", route)}`, fill(d.metaDescription, facts))}`,
        `  - हिंदी: ${line(h.pageTitle, `${SITE}${pathFor("hi", route)}`, fill(h.metaDescription, docFacts("hi")))}`,
      ];
    }),
  ];

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

  const kkIntro = kkSections.length
    ? "\n## About the Khata Kavach pages\n\nPlain-language pages from MDG Services, the maker of Khata Kavach, on selling goods on credit (udhar) to regular customers and keeping the account, in English and Hindi. Facts about other apps come from their own websites on the date each page shows; check them there. General information, not legal, tax or financial advice.\n\n"
    : "";
  const text = `# MDG Services: Dealer's Kavach, Khata Kavach and plain-language guides\n\n> MDG Services (a brand of VRUOOM Private Limited, India) makes two apps: Dealer's Kavach, which keeps an Indian petrol pump dealer's filings, renewals, inspections and daily reports on time, and Khata Kavach, a shared credit book between a business and its regular customers. It also publishes plain-language guides in English and Hindi: to the Marketing Discipline Guidelines 2024 (MDG 2024) for petrol pump dealers, and to selling goods on credit. The MDG guides are not the official text: refer to the oil companies' official guidelines and circulars for accurate and current rules. MDG Services is a private company, not connected with IndianOil, BPCL, HPCL or any government body.\n\n## The company and the apps\n\n${company.join("\n")}\n\n${sections.join("\n")}${kkIntro}${kkSections.join("\n")}`;
  return new Response(text, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
