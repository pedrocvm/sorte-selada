"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { normalizeList, sha256, pickWinners } from "@/lib/draw";

interface Props {
  /** Se vier preenchido (numa página de rodada), o painel já testa e mostra se bate. */
  listaEsperada?: string[];
  codigoEsperado?: string;
  seloEsperado?: string;
  ganhadoresEsperados?: string[];
}

type Resultado =
  | { status: "idle" }
  | { status: "erro"; mensagem: string }
  | {
      status: "ok";
      selo: string;
      ganhadores: string[];
      bateComEsperado: boolean | null;
    };

export default function VerifyPanel({
  listaEsperada,
  codigoEsperado,
  seloEsperado,
  ganhadoresEsperados,
}: Props) {
  const [listaTexto, setListaTexto] = useState(
    listaEsperada ? listaEsperada.join("\n") : ""
  );
  const [codigo, setCodigo] = useState(codigoEsperado ?? "");
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState<Resultado>({ status: "idle" });

  async function conferir() {
    const lista = normalizeList(listaTexto);
    if (lista.length < 2 || !codigo.trim()) {
      setResultado({
        status: "erro",
        mensagem: "Cole a lista (2 nomes ou mais) e o código da sorte.",
      });
      return;
    }
    setCarregando(true);
    const selo = await sha256(lista.join("\n"));
    const { winners } = await pickWinners(lista, selo, codigo.trim());

    let bate: boolean | null = null;
    if (seloEsperado || ganhadoresEsperados) {
      const seloBate = seloEsperado ? selo === seloEsperado : true;
      const ganhadoresBate = ganhadoresEsperados
        ? JSON.stringify(winners) === JSON.stringify(ganhadoresEsperados)
        : true;
      bate = seloBate && ganhadoresBate;
    }

    setResultado({ status: "ok", selo, ganhadores: winners, bateComEsperado: bate });
    setCarregando(false);
  }

  return (
    <div className="rounded-card border border-line bg-surface shadow-soft p-5 sm:p-6">
      <p className="text-xs text-ink2 mb-4 leading-relaxed">
        Cole a mesma lista e o mesmo código que foram anunciados no story.
        Aperte conferir — se o resultado bater, o sorteio foi limpo.
      </p>

      <label className="block text-xs text-ink2 mb-1.5">Lista de participantes</label>
      <textarea
        value={listaTexto}
        onChange={(e) => setListaTexto(e.target.value)}
        rows={6}
        className="w-full rounded-lg border border-line bg-cream px-3 py-2.5 font-mono text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-bronze/40 resize-y"
        placeholder="cole a lista aqui..."
      />

      <label className="block text-xs text-ink2 mb-1.5 mt-3">Código da sorte</label>
      <input
        type="text"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        className="w-full rounded-lg border border-line bg-cream px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-bronze/40"
        placeholder="ex.: 30"
      />

      <motion.button
        onClick={conferir}
        disabled={carregando}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.97 }}
        className="w-full mt-4 rounded-lg bg-bronze hover:bg-bronze-dark disabled:opacity-50 text-cream font-medium text-sm py-2.5 transition-colors"
      >
        {carregando ? "Conferindo…" : "Conferir"}
      </motion.button>

      {resultado.status === "erro" && (
        <p className="mt-4 text-sm text-amber bg-amber/10 border border-amber/30 rounded-lg px-3 py-2.5">
          {resultado.mensagem}
        </p>
      )}

      {resultado.status === "ok" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 space-y-3"
        >
          <div className="rounded-lg bg-cream border border-line px-3 py-3">
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink2">
              Impressão digital recalculada
            </p>
            <p className="font-mono text-[12px] text-ink break-all mt-1.5">
              {resultado.selo}
            </p>
          </div>

          <div
            className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
              resultado.bateComEsperado === false
                ? "bg-amber/10 border border-amber/30 text-amber"
                : "bg-sage/10 border border-sage/30 text-sage"
            }`}
          >
            {resultado.bateComEsperado === false
              ? "Não bateu com o resultado publicado — revise a lista e o código colados."
              : "Ganhadores: " + resultado.ganhadores.map((g) => "@" + g).join(" · ")}
          </div>
        </motion.div>
      )}
    </div>
  );
}
