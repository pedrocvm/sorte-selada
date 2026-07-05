/**
 * Lógica do sorteio — mesma matemática usada na ferramenta de gravação (sorteio-auditavel.html)
 * e no script scripts/lacrar.mjs. As três implementações têm que dar sempre o mesmo resultado
 * para a mesma lista + código da sorte. É essa consistência que sustenta a conferência pública.
 */

export async function sha256(input: string): Promise<string> {
  const enc = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function normalizeList(raw: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
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

export interface TrailStep {
  posicao: number;
  total: number;
  ganhador: string;
}

export async function pickWinners(
  list: string[],
  selo: string,
  codigo: string,
  k = 2
): Promise<{ winners: string[]; trail: TrailStep[] }> {
  const base = `${selo}|${codigo}`;
  const pool = list.map((_, i) => i);
  const trail: TrailStep[] = [];
  const winners: string[] = [];
  for (let i = 0; i < k; i++) {
    const h = await sha256(`${base}|${i}`);
    const num = parseInt(h.slice(0, 12), 16);
    const idx = num % pool.length;
    const chosen = pool[idx];
    trail.push({ posicao: idx + 1, total: pool.length, ganhador: list[chosen] });
    winners.push(list[chosen]);
    pool.splice(idx, 1);
  }
  return { winners, trail };
}
