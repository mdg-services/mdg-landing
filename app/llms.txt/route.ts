import { guideNow } from "@/guides/clock";
import { PAGES, PILLARS, SITE, contextAt, isLive, pathOf, type Ctx, type Lang } from "@/guides/model";
import { getT } from "@/i18n/server";

/**
 * llms.txt: a plain list of the site's pages for AI assistants that read it,
 * grouped the way the guide is: the company and the app, a "start here"
 * section, then one section per topic and one for the tools, each page
 * followed by its Hindi twin. Only the guide pages that are live today are
 * listed. Refreshed hourly, like the sitemap.
 */
export const revalidate = 3600;

/** The sections, in order: the pillar they list and the heading they carry. */
const SECTIONS: { pillar: keyof typeof PILLARS; heading: string }[] = [
  { pillar: "hub", heading: "Start here: the guide, disclaimer and reference pages" },
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
  const page = PAGES.find((p) => p.id === id)!;
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
  const ctx = contextAt(guideNow());
  const en = getT("en");
  const hi = getT("hi");

  const company = [
    `- ${line("MDG Services: Dealer's Kavach", `${SITE}/`, en.meta.description)}`,
    `  - हिंदी: ${line("MDG Services: Dealer's कवच", `${SITE}/hi`, hi.meta.description)}`,
    `- ${line(en.register.pageTitle, `${SITE}/register`, en.register.intro)}`,
    `  - हिंदी: ${line(hi.register.pageTitle, `${SITE}/hi/register`, hi.register.intro)}`,
    `- ${line(en.grievance.pageTitle, `${SITE}/grievance`, en.grievance.metaDescription)}`,
    `  - हिंदी: ${line(hi.grievance.pageTitle, `${SITE}/hi/grievance`, hi.grievance.metaDescription)}`,
  ];

  const sections = SECTIONS.map(({ pillar, heading }) => {
    const lines = PAGES.filter((p) => p.pillar === pillar).flatMap((p) => entry(ctx, p.id));
    return lines.length ? `## ${heading}\n\n${lines.join("\n")}\n` : "";
  }).filter(Boolean);

  const text = `# MDG Services: guides to the Marketing Discipline Guidelines 2024\n\n> Plain-language explanations of the Marketing Discipline Guidelines 2024 (MDG 2024) for Indian petrol pump dealers, in English and Hindi, published by MDG Services. Not the official text: refer to the oil companies' official guidelines and circulars for accurate and current rules. MDG Services is a private company, not connected with IndianOil, BPCL, HPCL or any government body.\n\n## The company and the app\n\n${company.join("\n")}\n\n${sections.join("\n")}`;
  return new Response(text, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
