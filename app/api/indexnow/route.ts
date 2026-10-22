import { revalidatePath } from "next/cache";
import { RELEASES, dayOf } from "../../../guide/schedule.ts";
import { KK_RELEASES, kkDayOf } from "../../../kk-guide/schedule.ts";
import { guideNow } from "@/guides/clock";
import { json } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * Daily cron (vercel.json, 06:15 India time): tells Bing, Yandex and the other
 * IndexNow search engines which guide pages went live today (the MDG guides
 * and the Khata Kavach pages, each on its own calendar), so they are crawled
 * the same day. Google does not use IndexNow; it reads the sitemap.
 *
 * Before it tells anyone, it throws away the saved copies of everything that
 * lists the guides by date (llms.txt, the hubs, and the pages with
 * their "related" and "in this section" links). Those pages refresh hourly, but
 * only when somebody asks, so without this the first visit after midnight India
 * time - the crawl IndexNow starts - would still be handed yesterday's list.
 *
 * The key is public by design: IndexNow checks it against
 * https://mdgservices.in/<key>.txt. Vercel signs cron calls with CRON_SECRET.
 */
const KEY = "4ae7e0c80185fc80b0c6d75bc28f80ab";
const HOST = "mdgservices.in";

/**
 * Everything whose content depends on which guide pages are live today:
 * llms.txt, the hubs, every guide and tool page (each shows
 * "related" and "in this section" links to the pages live that day), and the
 * pages that list the newest guides (the home pages, the Khata Kavach page).
 * Each is named by its real address, which is what the saved copy is filed
 * under.
 */
function refreshGuideLists(): void {
  // The sitemap is built fresh on every request, so it has no saved copy to throw away.
  for (const path of ["/llms.txt", "/", "/hi", "/khata-kavach", "/hi/khata-kavach"]) revalidatePath(path);
  for (const r of [...RELEASES, ...KK_RELEASES]) revalidatePath(r.path.replace(/\/$/, ""));
}

async function handler(req: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return json({ ok: false, error: "Not allowed." }, 401);
  }
  refreshGuideLists();
  const now = guideNow();
  const day = dayOf(now);
  const kkDay = kkDayOf(now);
  const urlList = [...RELEASES.filter((r) => r.day === day), ...KK_RELEASES.filter((r) => r.day === kkDay)].map((r) => `https://${HOST}${r.path}`);
  if (day === 1) urlList.push(`https://${HOST}/`);
  if (kkDay === 1) urlList.push(`https://${HOST}/khata-kavach`, `https://${HOST}/hi/khata-kavach`);
  if (!urlList.length) return json({ ok: true, day, kkDay, sent: 0 });
  const r = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
  });
  return json({ ok: r.ok, status: r.status, day, kkDay, sent: urlList.length });
}

// The old function answered every method the same way; so does this.
export { handler as GET, handler as HEAD, handler as POST, handler as PUT, handler as PATCH, handler as DELETE, handler as OPTIONS };
