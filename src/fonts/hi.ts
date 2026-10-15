import { Inter, Noto_Sans_Devanagari, Space_Grotesk, Space_Mono, Tiro_Devanagari_Hindi } from "next/font/google";

/**
 * The Hindi page's faces, all `display: "optional"` (see fonts/en.ts for why). The same five as the English page, but the one the
 * first screen is drawn in is Noto Sans Devanagari, so that is the one that is
 * preloaded (with Inter for the spaces and digits between the words). Space
 * Grotesk and Space Mono are fetched only if something on the page needs them,
 * and Tiro Devanagari Hindi, used only for the कवच marks, is switched on once the
 * page has loaded (components/LateFonts.tsx).
 */
export const inter = Inter({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-inter",
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "optional",
  preload: false,
  variable: "--font-grotesk",
});

export const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "optional",
  preload: false,
  variable: "--font-space-mono",
});

export const notoDeva = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  display: "optional",
  variable: "--font-noto-deva",
});

export const tiroDeva = Tiro_Devanagari_Hindi({
  subsets: ["devanagari"],
  weight: "400",
  display: "optional",
  preload: false,
  variable: "--font-tiro",
});

/** On <html> from the first byte: on the Hindi page Noto Sans Devanagari is the page. */
export const fontClassNames = [inter, spaceGrotesk, spaceMono, notoDeva].map((f) => f.variable).join(" ");

/** The कवच marks' own face waits for the page to load, as on the English page. */
export const lateFontClassNames = tiroDeva.variable;
