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

  return (
    <div className="min-h-full">
      <RoundReveal rodada={rodada} />
    </div>
  );
}
