"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SealCard from "@/components/SealCard";
import WinnerCard from "@/components/WinnerCard";
import VerifyPanel from "@/components/VerifyPanel";
import SuspenseReveal from "@/components/SuspenseReveal";
import Deck from "@/components/Deck";
import type { Rodada } from "@/lib/rounds";
import { CountUp } from "@/components/stage";

export default function RoundReveal({ rodada }: { rodada: Rodada }) {
  const [show, setShow] = useState(true); // audiência abre o link → suspense primeiro

  const data = new Date(rodada.data + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Deck
      slides={[
        <SlideProva key="prova" rodada={rodada} data={data} />,
        <SlideRevelacao key="revelacao" rodada={rodada} show={show} setShow={setShow} />,
        <SlideVerificar key="verificar" rodada={rodada} />,
      ]}
    />
  );
}

function SlideProva({ rodada, data }: { rodada: Rodada; data: string }) {
  return (
    <div className="mx-auto max-w-xl text-center">
      <p className="text-sm font-mono uppercase tracking-[0.24em] text-bronze">
        Rodada {String(rodada.numero).padStart(2, "0")} · {data}
      </p>
      <h1 className="font-display text-4xl sm:text-5xl mt-1 gold-text pb-1">{rodada.jogo}</h1>

      <div className="mt-4">
        <SealCard selo={rodada.selo} totalParticipantes={rodada.lista.length} seladoEm={rodada.seladoEm} />
      </div>

      <div className="mt-4 rounded-card border border-line bg-bronze-chip/30 px-5 py-4">
        <p className="text-sm font-mono uppercase tracking-[0.2em] text-bronze">Código da sorte</p>
        <p className="font-display text-5xl text-ink mt-1">
          <CountUp value={rodada.codigoDaSorte} />
        </p>
        <p className="text-base text-ink2 mt-2 max-w-md mx-auto">{rodada.regra}</p>
      </div>

      <p className="text-sm text-bronze mt-5 font-mono">deslize para ver a revelação →</p>
    </div>
  );
}

function SlideRevelacao({
  rodada,
  show,
  setShow,
}: {
  rodada: Rodada;
  show: boolean;
  setShow: (v: boolean) => void;
}) {
  const premio1 = rodada.premios[0];
  const premio2 = rodada.premios[1];

  return (
    <div className="mx-auto max-w-2xl">
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
            <div className="grid gap-3">
              {premio1 && (
                <WinnerCard cor={premio1.cor} nomePremio={premio1.nome} ganhador={rodada.ganhadores[0]} delay={0.1} />
              )}
              {premio2 && (
                <WinnerCard cor={premio2.cor} nomePremio={premio2.nome} ganhador={rodada.ganhadores[1]} delay={0.3} />
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                onClick={() => setShow(true)}
                className="rounded-xl min-h-14 bg-ink text-cream hover:opacity-90 text-lg font-medium py-3.5 transition-opacity"
              >
                ↺ Rever o sorteio
              </button>
              <a
                href={`/rodada/${rodada.numero}/card`}
                download={`sorte-selada-rodada-${rodada.numero}.png`}
                className="grid place-items-center text-center rounded-xl min-h-14 border border-bronze/40 text-bronze hover:bg-bronze-chip/40 text-lg font-medium py-3.5 transition-colors"
              >
                ✦ Baixar card do resultado
              </a>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

function SlideVerificar({ rodada }: { rodada: Rodada }) {
  return (
    <div className="mx-auto max-w-xl">
      <h3 className="font-display text-2xl sm:text-3xl text-ink text-center mb-4">
        Não confia? Confira você mesmo.
      </h3>
      <VerifyPanel
        listaEsperada={rodada.lista}
        codigoEsperado={rodada.codigoDaSorte}
        seloEsperado={rodada.selo}
        ganhadoresEsperados={rodada.ganhadores}
      />
    </div>
  );
}
