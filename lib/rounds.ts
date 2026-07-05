import fs from "node:fs";
import path from "node:path";

export interface Premio {
  cor: "verde" | "azul";
  nome: string;
}

export interface TrailStep {
  posicao: number;
  total: number;
  ganhador: string;
}

export interface Rodada {
  numero: number;
  data: string;
  jogo: string;
  regra: string;
  premios: Premio[];
  lista: string[];
  selo: string;
  codigoDaSorte: string;
  ganhadores: string[];
  trilhaDaProva: TrailStep[];
  seladoEm: string;
}

const ROUNDS_DIR = path.join(process.cwd(), "data", "rounds");

export function getAllRounds(): Rodada[] {
  if (!fs.existsSync(ROUNDS_DIR)) return [];
  const files = fs.readdirSync(ROUNDS_DIR).filter((f) => f.endsWith(".json"));
  const rounds = files.map((f) => {
    const raw = fs.readFileSync(path.join(ROUNDS_DIR, f), "utf8");
    return JSON.parse(raw) as Rodada;
  });
  return rounds.sort((a, b) => b.numero - a.numero);
}

export function getRoundByNumero(numero: number): Rodada | undefined {
  return getAllRounds().find((r) => r.numero === numero);
}
