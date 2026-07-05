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
        // hexes espelham os tokens de globals.css :root (var() quebra os modificadores /40)
        ink2: "#5C584F",
        line: "#CFC7BA",
        // Acento Dourê — DEFAULT é o dourado de TEXTO (AA); deco é o antigo, só enfeite
        bronze: { DEFAULT: "#6F5733", deco: "#876B45", chip: "#E4D9C4", dark: "#5F4C31" },
        // Estados (tom calmo, nunca vermelho agressivo) — escurecidos p/ AA em texto
        sage: "#3E7A5C",
        amber: "#8F6118",
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
