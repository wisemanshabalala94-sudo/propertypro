import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101828",
        mist: "#eef2f6",
        brand: {
          DEFAULT: "#0f766e",
          dark: "#115e59",
          soft: "#ccfbf1"
        },
        sand: "#f8f5ef",
        warning: "#b54708",
        danger: "#b42318"
      },
      fontFamily: {
        sans: ["Georgia", "Cambria", "Times New Roman", "serif"],
        mono: ["Consolas", "Monaco", "monospace"]
      },
      boxShadow: {
        panel: "0 18px 48px rgba(16, 24, 40, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;

