import { Inter, Noto_Sans_Devanagari, Space_Grotesk, Space_Mono, Tiro_Devanagari_Hindi } from "next/font/google";

/**
 * The Hindi page's faces. The one the first screen is drawn in is Noto Sans
 * Devanagari, so that is preloaded, with Inter (for the spaces and digits
 * between the words) and the two faces the page's headings and tracked labels
 * use, Space Grotesk and Space Mono. Fetched late, they were asked for 85 ms
 * after the stylesheet at top priority and held the first paint back by about
 * half a second; preloaded, they arrive with it.
 *
 * Which faces may swap, and which may not (see fonts/en.ts for the long
 * version): Inter and Noto Sans Devanagari are `optional`, so nothing in the
 * body text moves when a file lands late. Hindi copy carries Latin words (SDMS,
 * OMC, MDG), and Inter's fallback is 3% too wide for them, enough to re-wrap a
 * Hindi paragraph: with Inter on `swap`, /hi shifted by 0.168 on a throttled
 * run, against 0.000 now. Space Grotesk stays `swap`, and Space Mono stays
 * `swap` with a hand-made fallback of the same width and line height.
 *
 * Tiro Devanagari Hindi, used only for the कवच marks, is switched on once the
 * page has loaded (components/LateFonts.tsx).
 */
export const inter = Inter({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-inter",
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-grotesk",
});

export const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-space-mono",
  // "Space Mono Fallback" is declared by hand in src/index.css
  adjustFontFallback: false,
  fallback: ["Space Mono Fallback", "ui-monospace", "monospace"],
});

export const notoDeva = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  display: "optional",
  variable: "--font-noto-deva",
});

export const tiroDeva = Tiro_Devanagari_Hindi({
  subsets: ["devanagari"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-tiro",
});

/** On <html> from the first byte: on the Hindi page Noto Sans Devanagari is the page. */
export const fontClassNames = [inter, spaceGrotesk, spaceMono, notoDeva].map((f) => f.variable).join(" ");

/** The कवच marks' own face waits for the page to load, as on the English page. */
export const lateFontClassNames = tiroDeva.variable;
