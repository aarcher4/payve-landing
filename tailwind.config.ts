import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds - Dark Mode
        "bg-primary": "#0A0A0B",
        "bg-secondary": "#111113",
        "bg-tertiary": "#18181B",
        "bg-elevated": "#1C1C1F",
        // Text
        "text-primary": "#FAFAFA",
        "text-secondary": "#A1A1AA",
        "text-tertiary": "#71717A",
        "text-muted": "#52525B",
        // Brand Colors (legacy support)
        "custom-grey": "#0A0A0B",
        ivory: "#FAFAFA",
        sage: "#8FB3A1",
        graphite: "#666666",
        platinum: "#D1D1D1",
        // Accent
        "accent-primary": "#8FB3A1",
        "accent-hover": "#A3C4B5",
      },
      fontFamily: {
        display: ["Instrument Sans", "system-ui", "sans-serif"],
        body: ["Instrument Sans", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        serif: ["Cormorant Garamond", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "scroll-hint": "scrollHint 2s ease-in-out infinite",
        "slow-zoom": "slowZoom 20s linear infinite alternate",
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scrollHint: {
          "0%, 100%": { opacity: "1", transform: "translateY(0)" },
          "50%": { opacity: "0.5", transform: "translateY(10px)" },
        },
        slowZoom: {
          "0%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1.15)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
