import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#11263d",
          blue: "#0568a6",
          sky: "#12a4d9",
          mint: "#22c7a9",
          coral: "#ff6b5f"
        }
      },
      boxShadow: {
        panel: "0 18px 50px rgba(17, 38, 61, 0.12)",
        glow:
          "0 0 0 1px rgba(18, 164, 217, 0.12), 0 16px 44px rgba(5, 104, 166, 0.18)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
} satisfies Config;
