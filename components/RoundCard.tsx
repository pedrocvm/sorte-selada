import Link from "next/link";
import type { Rodada } from "@/lib/rounds";

export default function RoundCard({ rodada }: { rodada: Rodada }) {
  const data = new Date(rodada.data + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });

  return (
    <Link
      href={`/rodada/${rodada.numero}`}
      className="block rounded-card border border-line bg-surface shadow-soft p-5 hover:border-bronze/40 hover:-translate-y-0.5 hover:shadow-md transition-all group"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-mono uppercase tracking-[0.16em] text-bronze">
          Rodada {String(rodada.numero).padStart(2, "0")} · {data}
        </p>
        <span className="flex gap-1" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-premioVerde" />
          <span className="w-2.5 h-2.5 rounded-full bg-premioAzul" />
        </span>
      </div>
      <p className="font-display text-lg text-ink mt-1.5">{rodada.jogo}</p>
      <p className="text-sm text-ink2 mt-1">
        Ganhadores: {rodada.ganhadores.map((g) => "@" + g).join(" · ")}
      </p>
      <p className="text-sm text-bronze mt-3 group-hover:underline">
        Ver a prova dessa rodada →
      </p>
    </Link>
  );
}
