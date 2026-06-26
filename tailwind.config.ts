import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0b",
        ink2: "#08080a",
        bone: "#f0ede7",
        muted: "#cfc7b9",
        faint: "#9b9384",
        copper: "#d2a86a",
        copperlight: "#e0bd86",
        charcoal: "#14110c",
        cardline: "#2e2a22",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: { label: "0.3em" },
    },
  },
  plugins: [],
};
export default config;
