import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0a0f1e",
          800: "#0d1526",
          700: "#111d35",
          600: "#162344",
          500: "#1a2a52",
        },
        cyber: {
          blue: "#3b82f6",
          cyan: "#06b6d4",
          green: "#10b981",
          amber: "#f59e0b",
          red: "#ef4444",
          purple: "#8b5cf6",
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "Consolas", "monospace"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan": "scan 2s linear infinite",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
