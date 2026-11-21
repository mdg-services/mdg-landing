import { Inter, Noto_Sans_Oriya, Space_Grotesk, Space_Mono, Tiro_Devanagari_Hindi } from "next/font/google";

/**
 * The Odia page's faces. The one the first screen is drawn in is Noto Sans
 * Oriya, so that is preloaded, with Inter (for the spaces and digits between
 * the words) and the two faces the page's headings and tracked labels use,
 * Space Grotesk and Space Mono. It is laid out like the Hindi page
 * (src/fonts/hi.ts has the long reasoning): Inter and the script face are
 * `optional`, so nothing in the body text moves when a file lands late;
 * Space Grotesk stays `swap`; Space Mono stays `swap` with the hand-made
 * fallback of the same width.
 *
 * Tiro Devanagari Hindi (the कवच marks, which are Devanagari in every
 * language) is switched on once the page has loaded (components/LateFonts.tsx).
 *
 * Noto Sans Oriya is a variable font, so one file holds every weight the page
 * asks for.
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

export const notoOdia = Noto_Sans_Oriya({
  subsets: ["oriya"],
  display: "optional",
  variable: "--font-noto-odia",
});

export const tiroDeva = Tiro_Devanagari_Hindi({
  subsets: ["devanagari"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-tiro",
});

/** On <html> from the first byte: on the Odia page Noto Sans Oriya is the page. */
export const fontClassNames = [inter, spaceGrotesk, spaceMono, notoOdia].map((f) => f.variable).join(" ");

/** The कवच marks' own face waits for the page to load, as on the other pages. */
export const lateFontClassNames = tiroDeva.variable;
