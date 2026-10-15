import { Inter, Noto_Sans_Devanagari, Space_Grotesk, Space_Mono, Tiro_Devanagari_Hindi } from "next/font/google";

/**
 * The English page's faces, self-hosted by next/font (no request to Google
 * from the visitor's browser). Each exposes a CSS variable that
 * tailwind.config.js wires into the font families.
 *
 * What the first screen is drawn in is preloaded: Inter, Space Grotesk and
 * Space Mono, Latin (the mono labels are small, but a late swap of their font
 * moves the lines around them, so they come with the first paint).
 *
 * The Latin faces and the कवच mark use `display: "swap"`: the brand fonts must
 * show on the first visit, because the guides and the homepage have to look
 * like one site. next/font gives each a size-matched fallback, so the swap
 * barely moves a line. Noto Sans Devanagari is `optional`: most Android phones
 * already draw Hindi in Noto Sans Devanagari, so on a slow first visit the
 * device's own copy looks the same and nothing shifts.
 *
 * The two Devanagari faces are only for the कवच marks and the हिंदी switch,
 * 185 kB between them. They are set on <html> by components/LateFonts.tsx once
 * the page has loaded, so they never compete with the first paint; until then
 * those few words are drawn in the device's own Devanagari font.
 */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
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
});

export const notoDeva = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  display: "optional",
  preload: false,
  variable: "--font-noto-deva",
});

export const tiroDeva = Tiro_Devanagari_Hindi({
  subsets: ["devanagari"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-tiro",
});

/** On <html> from the first byte. */
export const fontClassNames = [inter, spaceGrotesk, spaceMono].map((f) => f.variable).join(" ");

/** Added to <html> after the page has loaded. */
export const lateFontClassNames = [notoDeva, tiroDeva].map((f) => f.variable).join(" ");
