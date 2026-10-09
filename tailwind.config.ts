import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        accent: {
          coral: "#FF3B30",
          amber: "#FFB800",
          emerald: "#10B981",
          violet: "#7C3AED",
          pink: "#EC4899",
          blue: "#3B82F6",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "window-float": "0 25px 60px -15px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.6)",
        "pill-float": "0 8px 24px -4px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.6)",
        "card-light": "0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03)",
        "card-hover": "0 12px 28px -6px rgba(0, 0, 0, 0.09), 0 4px 10px -2px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
