"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SealCard from "@/components/SealCard";
import WinnerCard from "@/components/WinnerCard";
import VerifyPanel from "@/components/VerifyPanel";
import SuspenseReveal from "@/components/SuspenseReveal";
import type { Rodada } from "@/lib/rounds";
import { CountUp } from "@/components/stage";

export default function RoundReveal({ rodada }: { rodada: Rodada }) {
  const premioVerde = rodada.premios.find((p) => p.cor === "verde");
  const premioAzul = rodada.premios.find((p) => p.cor === "azul");
  const [show, setShow] = useState(true); // audiência abre o link → suspense primeiro

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
        <p className="text-sm font-mono uppercase tracking-[0.2em] text-bronze">
          Código da sorte
        </p>
        <p className="font-display text-5xl text-ink mt-1">
          <CountUp value={rodada.codigoDaSorte} />
        </p>
        <p className="text-base text-ink2 mt-2 max-w-md mx-auto">{rodada.regra}</p>
      </motion.section>

      {/* O show — roda sozinho ao abrir, com botão de rever */}
      <AnimatePresence mode="wait">
        {show ? (
          <SuspenseReveal
            key="show"
            lista={rodada.lista}
            ganhadores={rodada.ganhadores}
            premios={rodada.premios}
            onDone={() => setShow(false)}
          />
        ) : (
          <motion.section
            key="cards"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="grid sm:grid-cols-2 gap-3">
              {premioVerde && (
                <WinnerCard cor="verde" nomePremio={premioVerde.nome} ganhador={rodada.ganhadores[0]} delay={0.1} />
              )}
              {premioAzul && (
                <WinnerCard cor="azul" nomePremio={premioAzul.nome} ganhador={rodada.ganhadores[1]} delay={0.3} />
              )}
            </div>
            <button
              onClick={() => setShow(true)}
              className="w-full rounded-xl min-h-14 bg-ink text-cream hover:opacity-90 text-lg font-medium py-3.5 transition-opacity"
            >
              ↺ Rever o sorteio
            </button>
            <a
              href={`/rodada/${rodada.numero}/card`}
              download={`sorte-selada-rodada-${rodada.numero}.png`}
              className="block w-full text-center rounded-xl min-h-14 border border-bronze/40 text-bronze hover:bg-bronze-chip/40 text-lg font-medium py-3.5 transition-colors"
            >
              ✦ Baixar card do resultado (story)
            </a>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="font-display text-2xl text-ink mb-3">
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
