/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#2C2E80",
          50: "#EEF0FB",
          100: "#D9DCF4",
          200: "#B0B5E8",
          300: "#7A82D2",
          500: "#3A3F9A",
          700: "#22246B",
          900: "#16184A",
        },
        coral: {
          DEFAULT: "#E94B4B",
          600: "#D33A3A",
        },
        cream: "#FFF8EE",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "ui-sans-serif", "sans-serif"],
        display: ['"Plus Jakarta Sans"', "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(34, 36, 107, 0.25)",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.06) 0, transparent 35%), radial-gradient(circle at 90% 30%, rgba(233,75,75,0.18) 0, transparent 40%)",
      },
    },
  },
  plugins: [],
};
