import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { getAllRounds, roundPath, type Rodada } from "@/lib/rounds";

// Sugere o próximo número de rodada, pra ferramenta preencher sozinha.
export async function GET() {
  const rounds = await getAllRounds();
  const proximo = rounds.length ? Math.max(...rounds.map((r) => r.numero)) + 1 : 1;
  return NextResponse.json({ proximoNumero: proximo });
}

// Publica uma rodada no Vercel Blob. Só quem está logado na área /sortear
// (cookie httpOnly) consegue publicar — mesmo segredo do middleware.
export async function POST(req: NextRequest) {
  const cookie = req.cookies.get("sorteio_session")?.value;
  if (!process.env.SORTEIO_SESSION_SECRET || cookie !== process.env.SORTEIO_SESSION_SECRET) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { erro: "Armazenamento não configurado (falta BLOB_READ_WRITE_TOKEN)." },
      { status: 500 }
    );
  }

  const rodada = (await req.json()) as Rodada;
  if (!rodada?.numero || !rodada.ganhadores?.length) {
    return NextResponse.json({ erro: "Rodada inválida." }, { status: 400 });
  }

  const { url } = await put(roundPath(rodada.numero), JSON.stringify(rodada), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    addRandomSuffix: false,
    cacheControlMaxAge: 60, // mínimo permitido — republicação aparece rápido mesmo sem o cache-buster
  });

  // Overwrite no Blob pode levar segundos pra propagar. Só devolvemos o link
  // quando o storage já serve ESTE resultado — assim "publicar → abrir o link"
  // nunca mostra uma rodada antiga (é o caminho crítico de confiança).
  for (let i = 0; i < 5; i++) {
    try {
      const r = await fetch(`${url}?v=${Date.now()}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      });
      const atual = (await r.json()) as Rodada;
      if (
        atual?.selo === rodada.selo &&
        JSON.stringify(atual.ganhadores) === JSON.stringify(rodada.ganhadores)
      )
        break;
    } catch {
      // ainda propagando — tenta de novo
    }
    await new Promise((s) => setTimeout(s, 1000));
  }

  return NextResponse.json({ ok: true, numero: rodada.numero, blobUrl: url });
}
