import { head, list } from "@vercel/blob";

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
        // O CDN do Blob cacheia a URL mesmo depois de um overwrite. O query param
        // com o uploadedAt muda a cada publicação → sempre lê a versão recém-publicada.
        const v = new Date(b.uploadedAt).getTime();
        const r = await fetch(`${b.url}?v=${v}`, { cache: "no-store" });
        return (await r.json()) as Rodada;
      })
    );
    return rounds.sort((a, b) => b.numero - a.numero);
  } catch {
    return [];
  }
}

// A página pública é o caminho crítico de confiança: publicar → abrir o link tem
// que mostrar EXATAMENTE o que acabou de ser sorteado. head() é fortemente
// consistente (list() pode demorar até 1 min pra refletir), e o cache-buster
// único pula o cache do CDN — o JSON é minúsculo, frescor vale mais que cache.
export async function getRoundByNumero(numero: number): Promise<Rodada | undefined> {
  try {
    const meta = await head(roundPath(numero));
    const r = await fetch(`${meta.url}?v=${Date.now()}`, { cache: "no-store" });
    return (await r.json()) as Rodada;
  } catch {
    return undefined;
  }
}
