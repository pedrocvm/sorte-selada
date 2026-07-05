import { list } from "@vercel/blob";

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

export const ROUND_PREFIX = "rounds/";
export const roundPath = (numero: number) => `${ROUND_PREFIX}rodada-${String(numero).padStart(2, "0")}.json`;

// As rodadas vivem no Vercel Blob (armazenamento público). A Karol publica pela
// ferramenta /sortear e a página aparece sozinha — sem JSON, sem git.
// Sem BLOB_READ_WRITE_TOKEN configurado (ex.: build local antes de ligar o Blob),
// a galeria simplesmente vem vazia em vez de quebrar. ponytail: try/catch, sobe pra
// storage real quando o token existir.
export async function getAllRounds(): Promise<Rodada[]> {
  try {
    const { blobs } = await list({ prefix: ROUND_PREFIX });
    const rounds = await Promise.all(
      blobs.map(async (b) => {
        const r = await fetch(b.url, { cache: "no-store" });
        return (await r.json()) as Rodada;
      })
    );
    return rounds.sort((a, b) => b.numero - a.numero);
  } catch {
    return [];
  }
}

export async function getRoundByNumero(numero: number): Promise<Rodada | undefined> {
  const all = await getAllRounds();
  return all.find((r) => r.numero === numero);
}
