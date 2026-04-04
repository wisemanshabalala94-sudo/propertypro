import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#09111f",
        mist: "#d9e5ff",
        panel: "#101c30",
        fog: "#8ea4c8",
        brand: {
          DEFAULT: "#5b8cff",
          dark: "#3c6df2",
          soft: "#d9e6ff"
        },
        accent: {
          cyan: "#35e0ff",
          emerald: "#4dee9a",
          amber: "#ffb84d",
          violet: "#cf7cff"
        },
        sand: "#eef4ff",
        warning: "#ffb84d",
        danger: "#ff6b7a"
      },
      fontFamily: {
        sans: ["var(--font-plex)", "sans-serif"],
        display: ["var(--font-space)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"]
      },
      boxShadow: {
        panel: "0 30px 90px rgba(4, 11, 24, 0.28)",
        glow: "0 0 0 1px rgba(91, 140, 255, 0.3), 0 0 80px rgba(53, 224, 255, 0.16)"
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(217,229,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(217,229,255,0.08) 1px, transparent 1px)"
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        pulseLine: "pulseLine 5s ease-in-out infinite",
        doorDrift: "doorDrift 18s linear infinite",
        shine: "shine 6s linear infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" }
        },
        pulseLine: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "1" }
        },
        doorDrift: {
          "0%": { transform: "translateZ(0px) scale(1)", opacity: "0" },
          "10%": { opacity: "0.95" },
          "90%": { opacity: "0.5" },
          "100%": { transform: "translateZ(520px) scale(0.14)", opacity: "0" }
        },
        shine: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" }
        }
      }
    }
  },
  plugins: []
};

export default config;
