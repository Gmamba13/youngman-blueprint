import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Core backgrounds — light theme
        void:     "#0D0D0D",
        surface:  "#F7F7F7",
        elevated: "#FFFFFF",
        stone:    "#F2F2F2",
        // Text
        primary:  "#0D0D0D",
        secondary:"#888888",
        // Accent — gold (used sparingly but vivid)
        gold:     "#C9963B",
        forge:    "#E8A84A",
        goldDim:  "rgba(201,150,59,0.12)",
        // Utility
        border:   "#E8E8E8",
        success:  "#22C55E",
        danger:   "#EF4444",
        // Legacy aliases
        cream:    "#FAFAFA",
        ink:      "#0D0D0D",
        muted:    "#AAAAAA",
        sand:     "#F0F0F0",
        clay:     "#E86B3A",
        sky:      "#4A7FA5",
        lilac:    "#7B6F9E",
        sun:      "#C9963B",
        sage:     "#22C55E",
        sageDark: "#16A34A",
      },
      fontFamily: {
        sans:    ["'Inter'", "-apple-system", "system-ui", "sans-serif"],
        display: ["Georgia", "serif"],
      },
      borderRadius: {
        "4xl": "1.75rem",
        "5xl": "2.25rem",
      },
      boxShadow: {
        soft:   "0 2px 16px rgba(0,0,0,0.07)",
        lift:   "0 8px 40px rgba(0,0,0,0.11)",
        gold:   "0 0 24px rgba(201,150,59,0.25)",
        glow:   "0 0 40px rgba(201,150,59,0.12)",
        card:   "0 1px 4px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
