/**
 * Vercel Routing Middleware for the film pages only. It hands the page the
 * visitor's country / state / city (from Vercel's own edge headers) in a
 * short-lived cookie, so the film's view measurement can say where a view
 * came from without the page ever seeing an IP address. Nothing else on the
 * site runs through here, and the pages work the same with no cookie at all.
 */
import { next } from "@vercel/functions";

// The two pages only. A wider pattern ("/film/:path*") would also run this on
// hls.js, the preview images and the logo, and stamp a cookie on each of them.
// Vercel's matcher already accepts the trailing-slash form of each path.
export const config = { matcher: ["/film", "/film/short"] };

/** The cookie value: "country|region|city", URL-encoded. Empty parts stay empty. */
export function geoCookie(headers: Headers): string | null {
  const read = (k: string) => {
    const raw = headers.get(k) || "";
    try {
      // Vercel URL-encodes the city so multi-byte names survive a header
      return decodeURIComponent(raw).replace(/\|/g, " ").trim().slice(0, 64);
    } catch {
      return "";
    }
  };
  const country = read("x-vercel-ip-country");
  const region = read("x-vercel-ip-country-region");
  const city = read("x-vercel-ip-city");
  if (!country && !region && !city) return null;
  const value = encodeURIComponent(`${country}|${region}|${city}`);
  return `mdg_geo=${value}; Path=/film; Max-Age=86400; SameSite=Lax; Secure`;
}

export default function middleware(request: Request): Response {
  const cookie = geoCookie(request.headers);
  return cookie ? next({ headers: { "set-cookie": cookie } }) : next();
}
