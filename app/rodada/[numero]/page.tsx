import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getRoundByNumero } from "@/lib/rounds";
import RoundReveal from "@/components/RoundReveal";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ numero: string }>;
}): Promise<Metadata> {
  const { numero } = await params;
  const rodada = await getRoundByNumero(Number(numero));
  if (!rodada) return {};
  return {
    title: `Rodada ${rodada.numero} · Sorte Selada · Dourê Semijoias`,
    description: `Confira a prova da rodada ${rodada.numero}: ${rodada.jogo}. Lista trancada, código público, resultado verificável por qualquer pessoa.`,
    openGraph: {
      title: `Sorte Selada · Rodada ${rodada.numero}`,
      description: rodada.jogo,
    },
  };
}

export default async function RodadaPage({
  params,
}: {
  params: Promise<{ numero: string }>;
}) {
  const { numero } = await params;
  const rodada = await getRoundByNumero(Number(numero));
  if (!rodada) notFound();

  const data = new Date(rodada.data + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-2xl px-5 py-8">
        <header className="text-center mb-8">
          <p className="text-sm font-mono uppercase tracking-[0.24em] text-bronze">
            Rodada {String(rodada.numero).padStart(2, "0")} · {data}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-1 gold-text pb-1">
            {rodada.jogo}
          </h1>
        </header>

        <RoundReveal rodada={rodada} />
      </div>
    </div>
  );
}
