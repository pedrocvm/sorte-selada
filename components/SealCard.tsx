"use client";

import { motion } from "framer-motion";

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
      <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-bronze">
        {label}
      </p>
      <motion.p
        className="font-mono text-[13px] sm:text-sm text-ink break-all leading-relaxed mt-3 mx-1"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.006 } },
        }}
      >
        {selo.split("").map((char, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0, y: 4 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.p>
      {(totalParticipantes || seladoEm) && (
        <p className="text-[11px] font-mono text-ink2 mt-3">
          {totalParticipantes ? `${totalParticipantes} participantes` : ""}
          {totalParticipantes && seladoEm ? " · " : ""}
          {seladoEm ? new Date(seladoEm).toLocaleString("pt-BR") : ""}
        </p>
      )}
      <p className="text-xs text-ink2 mt-3 max-w-sm mx-auto">{helper}</p>
    </div>
  );
}
