import { Inter, Space_Grotesk, Space_Mono, Tiro_Devanagari_Hindi } from "next/font/google";

/**
 * The English page's faces, self-hosted by next/font (no request to Google
 * from the visitor's browser). Each exposes a CSS variable that
 * tailwind.config.js wires into the font families.
 *
 * What the first screen is drawn in is preloaded: Inter, Space Grotesk and
 * Space Mono, Latin (the mono labels are small, but a late swap of their font
 * moves the lines around them, so they come with the first paint).
 *
 * ── Which faces may swap, and which may not ───────────────────────────────
 *
 * A face that swaps in after the first paint moves the text drawn in its
 * fallback if the two differ in width. Measured with the network slowed to a
 * phone's (Lighthouse's applied throttling), that was the whole of the page's
 * layout shift: with Inter on `swap`, 8 of the 58 English guide pages shifted
 * by more than 0.05 (worst 0.108) on a plain run, and 40 of 58 when the font
 * files arrived 1.5 s late. The body text is Inter, in long paragraphs, and a
 * paragraph is where a line break flips.
 *
 *  - Inter is `optional`: it is used if it arrives with the first paint (it is
 *    preloaded, so on a normal connection it does) and otherwise the page keeps
 *    its size-matched fallback for that view and has Inter from the next one.
 *    Nothing moves either way.
 *  - Space Grotesk (headings) stays `swap`: the heading face is the brand's
 *    voice and must show on the first visit; its fallback is within 1-2%
 *    of its width, so the swap barely moves a line.
 *  - Space Mono (the tracked labels) stays `swap` but gets a hand-made
 *    fallback. next/font can only build a fallback from Arial, a proportional
 *    face standing in for a monospace one, which is 26% too wide. The
 *    fallback below is a real monospace face scaled to Space Mono's width and
 *    line height, so the label does not change size when the real one lands.
 *
 * The two Devanagari faces are only for the कवच marks and the हिंदी switch.
 * Tiro Devanagari Hindi (the mark) is set on <html> by components/LateFonts.tsx
 * once the page has loaded, so it never competes with the first paint; until
 * then those few words are drawn in the device's own Devanagari font. Noto Sans
 * Devanagari is not loaded on English pages at all: the हिंदी switch is the
 * only Hindi text on most of them, and the device's own Devanagari face (on
 * most Android phones, Noto itself) draws it as well as a 121 kB download would.
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
export const lateFontClassNames = tiroDeva.variable;
