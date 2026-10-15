import { guideNow } from "@/guides/clock";
import { SITE, contextAt, releasesOn } from "@/guides/model";

/**
 * llms.txt: a plain list of the guide pages that are live today, for AI
 * assistants that read it. Refreshed hourly, like the sitemap.
 */
export const revalidate = 3600;

export function GET(): Response {
  const ctx = contextAt(guideNow());
  const lines = releasesOn(ctx.content, ctx.day).map((r) => {
    const c = ctx.content.get(`${r.lang}:${r.page.id}`)!;
    return `- [${c.title}](${SITE}${r.path}): ${c.description}`;
  });
  const text = `# MDG Services: guides to the Marketing Discipline Guidelines 2024\n\n> Plain-language explanations of the Marketing Discipline Guidelines 2024 (MDG 2024) for Indian petrol pump dealers, in English and Hindi, published by MDG Services. Not the official text: refer to the oil companies' official guidelines and circulars for accurate and current rules. MDG Services is a private company, not connected with IndianOil, BPCL, HPCL or any government body.\n\n## Pages\n\n${lines.join("\n")}\n`;
  return new Response(text, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
