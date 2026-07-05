import Gem3D from "@/components/Gem3D";
import RoundCard from "@/components/RoundCard";
import { getAllRounds } from "@/lib/rounds";
import Link from "next/link";

export default function HomePage() {
  const rodadas = getAllRounds();

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      {/* Hero */}
      <section className="text-center">
        <Gem3D />
        <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-bronze mt-2">
          À prova de fraude · confira você mesmo
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-ink mt-2 leading-tight">
          Sorte Selada
        </h1>
        <p className="text-ink2 mt-3 max-w-md mx-auto leading-relaxed">
          A cada jogo do Brasil na Copa, a Dourê sorteia dois colares — um
          verde, um azul. Toda lista é trancada em público, e qualquer pessoa
          pode conferir o resultado sozinha.
        </p>
      </section>

      {/* Como funciona, resumido */}
      <section className="mt-12 grid sm:grid-cols-3 gap-3">
        {[
          {
            n: "1",
            t: "Trancamos a lista",
            d: "Geramos uma impressão digital única da lista de participantes, antes de sortear.",
          },
          {
            n: "2",
            t: "Um código de fora decide",
            d: "O número que sorteia vem de algo público que a loja não controla — como a escalação da Seleção.",
          },
          {
            n: "3",
            t: "Você confere sozinho",
            d: "Cole a mesma lista e o mesmo código e chegue exatamente no mesmo resultado.",
          },
        ].map((s) => (
          <div key={s.n} className="rounded-card border border-line bg-surface shadow-soft p-4">
            <span className="font-mono text-xs text-bronze">{s.n}</span>
            <p className="font-display text-base text-ink mt-1">{s.t}</p>
            <p className="text-xs text-ink2 mt-1.5 leading-relaxed">{s.d}</p>
          </div>
        ))}
      </section>

      {/* Rodadas */}
      <section className="mt-14">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-2xl text-ink">Rodadas</h2>
          <Link href="/verificar" className="text-xs text-bronze hover:underline">
            Conferir manualmente →
          </Link>
        </div>

        {rodadas.length === 0 ? (
          <div className="rounded-card border border-dashed border-line bg-surface/50 p-8 text-center text-ink2 text-sm">
            Nenhuma rodada publicada ainda. A primeira aparece aqui assim que
            for lacrada.
          </div>
        ) : (
          <div className="space-y-3">
            {rodadas.map((r) => (
              <RoundCard key={r.numero} rodada={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
