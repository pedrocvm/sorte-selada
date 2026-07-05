"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { normalizeList, sha256, pickWinners, type TrailStep } from "@/lib/draw";
import SealCard from "@/components/SealCard";
import WinnerCard from "@/components/WinnerCard";
import SuspenseReveal from "@/components/SuspenseReveal";

type Etapa = "editando" | "trancada" | "revelada";

export default function SortearTool() {
  const [etapa, setEtapa] = useState<Etapa>("editando");

  // metadados da rodada
  const [numero, setNumero] = useState("2");
  const [data, setData] = useState("");
  const [jogo, setJogo] = useState("");
  const [regra, setRegra] = useState(
    "Código da sorte = soma das camisas dos 3 atacantes titulares na escalação oficial da CBF."
  );
  const [nomeVerde, setNomeVerde] = useState("Colar Verde");
  const [nomeAzul, setNomeAzul] = useState("Colar Azul");

  // sorteio
  const [listaTexto, setListaTexto] = useState("");
  const [lista, setLista] = useState<string[]>([]);
  const [selo, setSelo] = useState("");
  const [seladoEm, setSeladoEm] = useState("");
  const [codigo, setCodigo] = useState("");
  const [ganhadores, setGanhadores] = useState<string[]>([]);
  const [trilha, setTrilha] = useState<TrailStep[]>([]);
  const [erro, setErro] = useState("");
  const [copiado, setCopiado] = useState(false);

  // show + publicação
  const [rodandoShow, setRodandoShow] = useState(false);
  const [publicando, setPublicando] = useState(false);
  const [linkPublico, setLinkPublico] = useState("");

  // sugere o próximo número de rodada sozinho
  useEffect(() => {
    fetch("/api/rodada")
      .then((r) => r.json())
      .then((d) => d?.proximoNumero && setNumero(String(d.proximoNumero)))
      .catch(() => {});
  }, []);

  const premios = [
    { cor: "verde" as const, nome: nomeVerde },
    { cor: "azul" as const, nome: nomeAzul },
  ];

  async function trancar() {
    const normalizada = normalizeList(listaTexto);
    if (normalizada.length < 2) {
      setErro("Precisa de pelo menos 2 participantes.");
      return;
    }
    setErro("");
    const s = await sha256(normalizada.join("\n"));
    setLista(normalizada);
    setListaTexto(normalizada.join("\n"));
    setSelo(s);
    setSeladoEm(new Date().toISOString());
    setEtapa("trancada");
  }

  async function revelar() {
    if (!codigo.trim()) {
      setErro("Digite o código da sorte.");
      return;
    }
    setErro("");
    const { winners, trail } = await pickWinners(lista, selo, codigo.trim());
    setGanhadores(winners);
    setTrilha(trail);
    setEtapa("revelada");
    setRodandoShow(true); // dispara o show de suspense antes de mostrar os cards
  }

  async function publicar() {
    setPublicando(true);
    setErro("");
    try {
      const rodada = {
        numero: Number(numero),
        data,
        jogo,
        regra,
        premios,
        lista,
        selo,
        codigoDaSorte: codigo.trim(),
        ganhadores,
        trilhaDaProva: trilha,
        seladoEm,
      };
      const res = await fetch("/api/rodada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rodada),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d?.erro || "Não deu pra publicar.");
      setLinkPublico(`${window.location.origin}/rodada/${numero}`);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não deu pra publicar.");
    } finally {
      setPublicando(false);
    }
  }

  function recomecar() {
    if (etapa !== "editando" && !confirm("Recomeçar do zero? Isso limpa tudo desta rodada.")) return;
    setEtapa("editando");
    setListaTexto("");
    setLista([]);
    setSelo("");
    setCodigo("");
    setGanhadores([]);
    setTrilha([]);
    setErro("");
    setCopiado(false);
    setRodandoShow(false);
    setLinkPublico("");
  }

  const passoAtual = etapa === "editando" ? 0 : etapa === "trancada" ? 1 : 2;

  return (
    <div className="space-y-6">
      {/* Progresso gamificado */}
      <div className="flex items-center justify-center gap-2">
        {["Lista", "Código", "Revelar"].map((rotulo, p) => {
          const feito = p < passoAtual;
          const ativo = p === passoAtual;
          return (
            <div key={rotulo} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <motion.span
                  animate={{ scale: ativo ? [1, 1.12, 1] : 1 }}
                  transition={{ repeat: ativo ? Infinity : 0, duration: 1.8 }}
                  className={`grid place-items-center w-7 h-7 rounded-full text-xs font-display font-semibold ${
                    feito || ativo ? "coin text-bronze-dark" : "bg-line text-ink2"
                  }`}
                >
                  {feito ? "✓" : p + 1}
                </motion.span>
                <span className={`text-xs font-medium ${ativo ? "text-ink" : "text-ink2"}`}>{rotulo}</span>
              </div>
              {p < 2 && (
                <span className={`h-px w-5 ${feito ? "bg-bronze" : "bg-line"} transition-colors`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Metadados da rodada */}
      <div className="rounded-card border border-line bg-surface shadow-soft p-5 space-y-3">
        <p className="font-display text-lg text-ink">Dados da rodada</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-ink2 mb-1">Número da rodada</label>
            <input
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              disabled={etapa !== "editando"}
              className="w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm disabled:opacity-60"
            />
          </div>
          <div>
            <label className="block text-xs text-ink2 mb-1">Data</label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              disabled={etapa !== "editando"}
              className="w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm disabled:opacity-60"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-ink2 mb-1">Jogo</label>
          <input
            value={jogo}
            onChange={(e) => setJogo(e.target.value)}
            disabled={etapa !== "editando"}
            placeholder="ex.: Brasil × Argentina"
            className="w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm disabled:opacity-60"
          />
        </div>
        <div>
          <label className="block text-xs text-ink2 mb-1">Regra do código da sorte</label>
          <input
            value={regra}
            onChange={(e) => setRegra(e.target.value)}
            disabled={etapa !== "editando"}
            className="w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm disabled:opacity-60"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-ink2 mb-1">Nome do prêmio verde</label>
            <input
              value={nomeVerde}
              onChange={(e) => setNomeVerde(e.target.value)}
              disabled={etapa !== "editando"}
              className="w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm disabled:opacity-60"
            />
          </div>
          <div>
            <label className="block text-xs text-ink2 mb-1">Nome do prêmio azul</label>
            <input
              value={nomeAzul}
              onChange={(e) => setNomeAzul(e.target.value)}
              disabled={etapa !== "editando"}
              className="w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm disabled:opacity-60"
            />
          </div>
        </div>
      </div>

      {/* Passo 1 — lista */}
      <div className="rounded-card border border-line bg-surface shadow-soft p-5">
        <p className="font-display text-lg text-ink mb-1">1. Participantes</p>
        <p className="text-xs text-ink2 mb-3">Um nome por linha. Repetidos são unidos sozinhos.</p>
        <textarea
          value={listaTexto}
          onChange={(e) => setListaTexto(e.target.value)}
          disabled={etapa !== "editando"}
          rows={8}
          className="w-full rounded-lg border border-line bg-cream px-3 py-2.5 font-mono text-[13px] disabled:opacity-70 resize-y"
          placeholder="@maria.silva&#10;@joao_p&#10;@carla.designs"
        />
        {etapa === "editando" && (
          <motion.button
            onClick={trancar}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            className="w-full mt-3 rounded-lg bg-bronze hover:bg-bronze-dark text-cream font-medium text-sm py-2.5 transition-colors"
          >
            Trancar a lista
          </motion.button>
        )}
      </div>

      {/* Selo */}
      {etapa !== "editando" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <SealCard selo={selo} totalParticipantes={lista.length} seladoEm={seladoEm} />
        </motion.div>
      )}

      {/* Passo 2 — código da sorte */}
      {etapa !== "editando" && (
        <div className="rounded-card border border-line bg-surface shadow-soft p-5">
          <p className="font-display text-lg text-ink mb-1">2. Código da sorte</p>
          <p className="text-xs text-ink2 mb-3">
            Já anunciado no story antes de você digitar aqui.
          </p>
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            disabled={etapa === "revelada"}
            placeholder="ex.: 30"
            className="w-full rounded-lg border border-line bg-cream px-3 py-2.5 text-sm disabled:opacity-70"
          />
          {etapa === "trancada" && (
            <motion.button
              onClick={revelar}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              className="w-full mt-3 rounded-lg bg-bronze hover:bg-bronze-dark text-cream font-medium text-sm py-2.5 transition-colors"
            >
              Revelar os ganhadores
            </motion.button>
          )}
        </div>
      )}

      {/* O show de suspense — roda ao vivo antes de revelar os cards */}
      <AnimatePresence>
        {etapa === "revelada" && rodandoShow && (
          <SuspenseReveal
            lista={lista}
            ganhadores={ganhadores}
            premios={premios}
            onDone={() => setRodandoShow(false)}
          />
        )}
      </AnimatePresence>

      {/* Ganhadores — aparecem depois do show */}
      {etapa === "revelada" && !rodandoShow && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid sm:grid-cols-2 gap-3"
        >
          <WinnerCard cor="verde" nomePremio={nomeVerde} ganhador={ganhadores[0]} delay={0.1} />
          <WinnerCard cor="azul" nomePremio={nomeAzul} ganhador={ganhadores[1]} delay={0.35} />
        </motion.div>
      )}

      {etapa === "revelada" && !rodandoShow && (
        <button
          onClick={() => setRodandoShow(true)}
          className="w-full rounded-lg border border-line text-ink2 hover:text-ink text-sm py-2 transition-colors"
        >
          ↺ Rever o sorteio
        </button>
      )}

      {/* Publicar — um botão, um link, pronto pro Instagram */}
      {etapa === "revelada" && !rodandoShow && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-card border border-line bg-surface shadow-soft p-5"
        >
          <p className="font-display text-lg text-ink mb-1">3. Publicar</p>
          <p className="text-xs text-ink2 mb-3 leading-relaxed">
            Um clique gera a página pública com o mesmo show. Copie o link e cole no story
            ou na bio do Instagram — qualquer pessoa pode abrir e conferir.
          </p>

          {!linkPublico ? (
            <motion.button
              onClick={publicar}
              disabled={publicando}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              className="w-full rounded-lg bg-bronze hover:bg-bronze-dark text-cream font-medium text-sm py-2.5 transition-colors disabled:opacity-60"
            >
              {publicando ? "Publicando…" : "Publicar página da rodada"}
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 rounded-lg border border-line bg-cream px-3 py-2.5">
                <span className="flex-1 truncate font-mono text-[13px] text-ink">{linkPublico}</span>
                <a href={linkPublico} target="_blank" rel="noreferrer" className="text-bronze text-xs hover:underline">
                  abrir ↗
                </a>
              </div>
              <motion.button
                onClick={() => {
                  navigator.clipboard.writeText(linkPublico);
                  setCopiado(true);
                  setTimeout(() => setCopiado(false), 2000);
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                className="w-full rounded-lg bg-bronze hover:bg-bronze-dark text-cream font-medium text-sm py-2.5 transition-colors"
              >
                {copiado ? "Link copiado ✓" : "Copiar link pro Instagram"}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      )}

      {erro && (
        <p className="text-sm text-amber bg-amber/10 border border-amber/30 rounded-lg px-3 py-2.5">
          {erro}
        </p>
      )}

      {etapa !== "editando" && (
        <button
          onClick={recomecar}
          className="w-full rounded-lg border border-line text-ink2 hover:text-ink text-sm py-2.5 transition-colors"
        >
          Recomeçar sorteio
        </button>
      )}
    </div>
  );
}
