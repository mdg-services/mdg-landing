import type { VercelRequest, VercelResponse } from "@vercel/node";
import { RELEASES, dayOf } from "../guide/schedule.js";

/**
 * Daily cron (vercel.json, 06:15 India time): tells Bing, Yandex and the other
 * IndexNow search engines which MDG guide pages went live today, so they are
 * crawled the same day. Google does not use IndexNow; it reads the sitemap.
 *
 * The key is public by design: IndexNow checks it against
 * https://mdgservices.in/<key>.txt. Vercel signs cron calls with CRON_SECRET.
 */
const KEY = "4ae7e0c80185fc80b0c6d75bc28f80ab";
const HOST = "mdgservices.in";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ ok: false, error: "Not allowed." });
  }
  const day = dayOf(new Date());
  const urlList = RELEASES.filter((r) => r.day === day).map((r) => `https://${HOST}${r.path}`);
  if (day === 1) urlList.push(`https://${HOST}/`);
  if (!urlList.length) return res.status(200).json({ ok: true, day, sent: 0 });
  const r = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
  });
  return res.status(200).json({ ok: r.ok, status: r.status, day, sent: urlList.length });
}
