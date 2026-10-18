/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Brand indigo / navy (primary). Brand mark = #2C2E80 ──
        navy: {
          50: "#F1F2FB",
          100: "#E3E4F6",
          200: "#C5C7ED",
          300: "#9EA1E0",
          400: "#6E72CC",
          500: "#4A4EB4",
          600: "#393C9A",
          700: "#2C2E80", // brand
          800: "#222466",
          900: "#1A1B4B",
          950: "#101133",
        },
        // ── Energy accent (gold / amber). "Fueling Success" ──
        gold: {
          50: "#FEF7E7",
          100: "#FDECC4",
          200: "#FBD888",
          300: "#F8C24B",
          400: "#F5A524", // accent
          500: "#E0860A",
          600: "#B96807",
          700: "#92500A",
        },
        // ── Neutrals — cool slate, biased toward the navy ──
        paper: {
          DEFAULT: "#FCFCFE",
          warm: "#F5F6FB",
          sunk: "#EDEFF7",
        },
        ink: {
          DEFAULT: "#15163A", // deep navy-ink for body text
          soft: "#3D3F66",
          muted: "#6B6D93",
          faint: "#9B9DBE",
          hairline: "#E4E6F1",
        },
        // ── Khata Kavach's own palette, the same as its apps since 18 Oct 2026: pine green
        //    for actions and dark panels, a cream page. Used on the /khata-kavach page and
        //    the home page's second-app panel, never to restyle Dealer's Kavach. (The key is
        //    still called siyahi, the old blue's name, so no class had to change.) ──
        kk: {
          siyahi: "#0F4A3D", // pine: the one brand colour
          deep: "#0A3B30", // pressed
          wash: "#E3EEE8",
          cream: "#F4EFE3", // marketing ground
          paper: "#F6F5EF",
          surface: "#FFFEFB",
          coal: "#0B3F33",
          ink: "#14231F",
          soft: "#43524D",
          muted: "#5B6964", // the lightest text allowed on paper or cream
          steel: "#9FB3AC", // dark grounds only
        },
        // The nozzle's three lights. They mean one thing each and appear ONLY
        // inside the nozzle demo on /khata-kavach, never as decoration.
        light: {
          go: "#0F7A3D",
          wait: "#F5A100",
          "wait-ink": "#8A4B00",
          stop: "#B42318",
        },
        // ── "Handled / done" success, used only in diagram states ──
        ok: {
          DEFAULT: "#12A87B",
          tint: "#E4F6EF",
        },
      },
      fontFamily: {
        // Devanagari always sits BEHIND the Latin faces. Each @font-face
        // carries a unicode-range, so an English reader never reaches the
        // Hindi font and never downloads it.
        //
        // The faces come from next/font (src/fonts), self-hosted: each
        // variable holds the real family plus its metric-matched fallback.
        // The two Devanagari variables (--font-noto-deva, --font-tiro) are not
        // set on the English page until it has finished loading (see
        // components/LateFonts.tsx), so each use carries a fallback.
        sans: ["var(--font-inter)", "var(--font-noto-deva, system-ui)", "system-ui", "ui-sans-serif", "sans-serif"],
        display: ["var(--font-grotesk)", "var(--font-inter)", "var(--font-noto-deva, system-ui)", "system-ui", "sans-serif"],
        // The brand's own Devanagari face, for the कवच marks only.
        deva: ["var(--font-tiro, serif)", "var(--font-noto-deva, system-ui)", "var(--font-grotesk)", "serif"],
        mono: ["var(--font-space-mono)", "var(--font-noto-deva, system-ui)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        kerned: "-0.05em",
      },
      maxWidth: {
        prose2: "60ch",
        readable: "72ch",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,17,51,.04), 0 8px 24px -12px rgba(16,17,51,.12)",
        lift: "0 2px 4px rgba(16,17,51,.06), 0 24px 48px -20px rgba(16,17,51,.28)",
        glow: "0 0 0 1px rgba(245,165,36,.35), 0 18px 50px -16px rgba(245,165,36,.45)",
        navy: "0 24px 60px -24px rgba(44,46,128,.55)",
      },
    },
  },
  plugins: [],
};
