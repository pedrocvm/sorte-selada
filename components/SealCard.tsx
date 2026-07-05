"use client";

import { Scramble } from "@/components/stage";

export default function SealCard({
  selo,
  totalParticipantes,
  seladoEm,
  label = "Impressão digital da lista",
  helper = "Se um nome fosse trocado, esse código mudaria por completo.",
}: {
  selo: string;
  totalParticipantes?: number;
  seladoEm?: string;
  label?: string;
  helper?: string;
}) {
  return (
    <div className="rounded-card border border-dashed border-bronze/40 bg-bronze-chip/40 px-5 py-6 text-center">
      <p className="text-sm font-mono uppercase tracking-[0.24em] text-bronze">
        {label}
      </p>
      {/* o hash é "cunhado": embaralha e estabiliza da esquerda pra direita */}
      <p className="font-mono text-base sm:text-lg text-ink break-all leading-relaxed mt-3 mx-1">
        <Scramble text={selo} />
      </p>
      {(totalParticipantes || seladoEm) && (
        <p className="text-sm font-mono text-ink2 mt-3">
          {totalParticipantes ? `${totalParticipantes} participantes` : ""}
          {totalParticipantes && seladoEm ? " · " : ""}
          {seladoEm ? new Date(seladoEm).toLocaleString("pt-BR") : ""}
        </p>
      )}
      <p className="text-sm text-ink2 mt-3 max-w-md mx-auto">{helper}</p>
    </div>
  );
}
