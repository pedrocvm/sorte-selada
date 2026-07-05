"use client";

import { motion } from "framer-motion";
import SealCard from "@/components/SealCard";
import WinnerCard from "@/components/WinnerCard";
import VerifyPanel from "@/components/VerifyPanel";
import type { Rodada } from "@/lib/rounds";

export default function RoundReveal({ rodada }: { rodada: Rodada }) {
  const premioVerde = rodada.premios.find((p) => p.cor === "verde");
  const premioAzul = rodada.premios.find((p) => p.cor === "azul");

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SealCard
          selo={rodada.selo}
          totalParticipantes={rodada.lista.length}
          seladoEm={rodada.seladoEm}
        />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="rounded-card border border-line bg-bronze-chip/30 px-5 py-4 text-center"
      >
        <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-bronze">
          Código da sorte
        </p>
        <p className="font-display text-3xl text-ink mt-1">{rodada.codigoDaSorte}</p>
        <p className="text-xs text-ink2 mt-2 max-w-sm mx-auto">{rodada.regra}</p>
      </motion.section>

      <section className="grid sm:grid-cols-2 gap-3">
        {premioVerde && (
          <WinnerCard
            cor="verde"
            nomePremio={premioVerde.nome}
            ganhador={rodada.ganhadores[0]}
            delay={0.35}
          />
        )}
        {premioAzul && (
          <WinnerCard
            cor="azul"
            nomePremio={premioAzul.nome}
            ganhador={rodada.ganhadores[1]}
            delay={0.6}
          />
        )}
      </section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.85 }}
      >
        <h3 className="font-display text-xl text-ink mb-3">
          Não confia? Confira você mesmo.
        </h3>
        <VerifyPanel
          listaEsperada={rodada.lista}
          codigoEsperado={rodada.codigoDaSorte}
          seloEsperado={rodada.selo}
          ganhadoresEsperados={rodada.ganhadores}
        />
      </motion.section>
    </div>
  );
}
