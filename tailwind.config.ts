import type { Config } from "tailwindcss";

// Tailwind only supplies the base reset here; every style lives in globals.css.
const config = {
  content: ["./src/**/*.{ts,tsx}"],
} satisfies Config;

export default config;
