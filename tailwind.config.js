/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "oklch(98% 0.008 80 / <alpha-value>)",
          warm: "oklch(96% 0.014 75 / <alpha-value>)",
          sunk: "oklch(93% 0.018 70 / <alpha-value>)",
        },
        ink: {
          DEFAULT: "oklch(20% 0.015 60 / <alpha-value>)",
          soft: "oklch(36% 0.014 60 / <alpha-value>)",
          muted: "oklch(52% 0.012 60 / <alpha-value>)",
          faint: "oklch(70% 0.010 60 / <alpha-value>)",
          hairline: "oklch(88% 0.008 60 / <alpha-value>)",
        },
        seal: {
          DEFAULT: "oklch(45% 0.155 28 / <alpha-value>)",
          deep: "oklch(36% 0.145 28 / <alpha-value>)",
          tint: "oklch(94% 0.025 28 / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "ui-sans-serif", "sans-serif"],
        serif: ['"Fraunces"', "Georgia", "serif"],
        deva: ['"Tiro Devanagari Hindi"', '"Fraunces"', "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.035em",
        kerned: "-0.045em",
      },
      maxWidth: {
        prose2: "62ch",
        readable: "72ch",
      },
    },
  },
  plugins: [],
};
