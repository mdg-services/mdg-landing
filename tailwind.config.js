/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
        // ── "Handled / done" success, used only in diagram states ──
        ok: {
          DEFAULT: "#12A87B",
          tint: "#E4F6EF",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "ui-sans-serif", "sans-serif"],
        display: ['"Space Grotesk"', "Inter", "system-ui", "sans-serif"],
        deva: ['"Tiro Devanagari Hindi"', '"Space Grotesk"', "serif"],
        mono: ['"Space Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
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
