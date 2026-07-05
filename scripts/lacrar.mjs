// Gera o arquivo final de uma rodada a partir de um rascunho.
// Uso:  npm run lacrar -- data/rascunhos/rodada-02.json
//
// O rascunho é um JSON simples:
// {
//   "numero": 2,
//   "data": "2026-07-08",
//   "jogo": "Brasil × Argentina",
//   "regra": "Código da sorte = soma das camisas dos 3 atacantes titulares.",
//   "premios": [{ "cor": "verde", "nome": "Colar Verde X" }, { "cor": "azul", "nome": "Colar Azul Y" }],
//   "lista": "nome1\nnome2\nnome3...",
//   "codigoDaSorte": "30"
// }
//
// O script trava a lista, calcula o selo, sorteia os ganhadores e escreve
// data/rounds/rodada-XX.json — pronto para commitar e subir para o Vercel.

import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

function sha256(str) {
  return createHash("sha256").update(str, "utf8").digest("hex");
}

function normalizeList(raw) {
  const seen = new Set();
  const out = [];
  raw
    .split("\n")
    .map((l) => l.trim().replace(/^@+/, "").trim())
    .filter(Boolean)
    .forEach((l) => {
      const k = l.toLowerCase();
      if (!seen.has(k)) {
        seen.add(k);
        out.push(l);
      }
    });
  return out;
}

function pickWinners(list, selo, codigo, k = 2) {
  const base = `${selo}|${codigo}`;
  const pool = list.map((_, i) => i);
  const trail = [];
  const winners = [];
  for (let i = 0; i < k; i++) {
    const h = sha256(`${base}|${i}`);
    const num = parseInt(h.slice(0, 12), 16);
    const idx = num % pool.length;
    const chosen = pool[idx];
    trail.push({ posicao: idx + 1, total: pool.length, ganhador: list[chosen] });
    winners.push(list[chosen]);
    pool.splice(idx, 1);
  }
  return { winners, trail };
}

const draftPath = process.argv[2];
if (!draftPath) {
  console.error("Uso: npm run lacrar -- caminho/para/rascunho.json");
  process.exit(1);
}

const draft = JSON.parse(fs.readFileSync(draftPath, "utf8"));
const lista = normalizeList(draft.lista);

if (lista.length < 2) {
  console.error("A lista precisa ter pelo menos 2 participantes.");
  process.exit(1);
}
if (!draft.codigoDaSorte) {
  console.error("Falta o codigoDaSorte no rascunho.");
  process.exit(1);
}

const selo = sha256(lista.join("\n"));
const { winners, trail } = pickWinners(lista, selo, String(draft.codigoDaSorte));

const rodada = {
  numero: draft.numero,
  data: draft.data,
  jogo: draft.jogo,
  regra: draft.regra,
  premios: draft.premios,
  lista,
  selo,
  codigoDaSorte: String(draft.codigoDaSorte),
  ganhadores: winners,
  trilhaDaProva: trail,
  seladoEm: new Date().toISOString(),
};

const outDir = path.join(process.cwd(), "data", "rounds");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `rodada-${String(draft.numero).padStart(2, "0")}.json`);
fs.writeFileSync(outPath, JSON.stringify(rodada, null, 2) + "\n");

console.log("✔ Rodada lacrada e salva em", outPath);
console.log("  Selo:", selo);
console.log("  Ganhadores:", winners.join(" · "));
console.log("\nAgora é só: git add, commit, push. O Vercel publica sozinho.");
