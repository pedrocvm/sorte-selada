import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Base neutra da marca (extraída da logo real da Dourê)
        cream: "#FAF9F7",
        surface: "#FFFFFF",
        ink: "#1F1D1A",
        ink2: "#6E6A63",
        line: "#ECE9E4",
        // Acento Dourê
        bronze: { DEFAULT: "#876B45", chip: "#E4D9C4", dark: "#5F4C31" },
        // Estados (tom calmo, nunca vermelho agressivo)
        sage: "#4C8A6A",
        amber: "#C98A2D",
        // Cores dos dois prêmios (tema Seleção, harmonizadas com a paleta terrosa)
        premioVerde: { DEFAULT: "#3E7A5C", chip: "#DCEAE2" },
        premioAzul: { DEFAULT: "#3B5D8A", chip: "#DEE6F0" },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(31,29,26,0.04), 0 8px 24px -8px rgba(31,29,26,0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
