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
        background: "#080b11",
        card: {
          DEFAULT: "rgba(22, 28, 45, 0.4)",
          solid: "#0f1626",
          border: "rgba(255, 255, 255, 0.08)",
        },
        brand: {
          red: "#e91b4c",     // FIFA World Cup Red
          gold: "#d4af37",    // Prestigious Gold
          cyan: "#00f2fe",    // Holographic Tech Cyan
          blue: "#1d4ed8",    // Tactical Blue
          emerald: "#10b981", // Sustainability Green
        },
        cyber: {
          border: "rgba(0, 242, 254, 0.2)",
          glow: "rgba(0, 242, 254, 0.15)",
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cyber-grid": "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-size": "30px 30px",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s infinite ease-in-out",
        "scanline": "scanline 6s linear infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", boxShadow: "0 0 10px rgba(0, 242, 254, 0.2)" },
          "50%": { opacity: "1", boxShadow: "0 0 20px rgba(0, 242, 254, 0.5)" },
        },
        "scanline": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        }
      }
    },
  },
  plugins: [],
};

export default config;
