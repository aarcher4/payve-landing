import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "custom-grey": "#505050",
        ivory: "#FAFAF8",
        sage: "#8FB3A1",
        graphite: "#666666",
        platinum: "#D1D1D1",
      },
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        serif: ["Cormorant Garamond", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "scroll-hint": "scrollHint 2s ease-in-out infinite",
        "slow-zoom": "slowZoom 20s linear infinite alternate",
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
      },
    },
  },
  plugins: [],
};

export default config;

