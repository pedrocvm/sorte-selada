"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { normalizeList, sha256, pickWinners, type TrailStep } from "@/lib/draw";
import SuspenseReveal from "@/components/SuspenseReveal";
import Gem3D from "@/components/Gem3D";
import DiamondFacetGlow from "@/components/DiamondFacetGlow";
import GoldParticles, { GoldConfetti } from "@/components/GoldParticles";
import { Scramble } from "@/components/stage";

const EASE = [0.16, 1, 0.3, 1] as const;

type RodadaResumo = { numero: number; jogo: string; data: string; ganhadores: string[] };

const CORES = {
  verde: { hex: "#3E7A5C", soft: "rgba(62,122,92,0.16)", grad: "linear-gradient(135deg,#4C8A6A,#2C5A42)" },
  azul: { hex: "#3B5D8A", soft: "rgba(59,93,138,0.16)", grad: "linear-gradient(135deg,#4A6E9E,#2A4468)" },
};

// Assistente do sorteio em formato de deck: 3 slides que cabem na primeira
// dobra (Dados → Participantes → Sorteio). O sorteio é o palco principal:
// cada prêmio é disparado individualmente e ganha seu próprio show.
export default function SortearTool() {
  const reduce = useReducedMotion();
  const [[slide, dir], setSlideRaw] = useState<[number, number]>([0, 0]);
  const go = (to: number) => setSlideRaw(([s]) => [to, to > s ? 1 : -1]);

  // dados da rodada
  const [numero, setNumero] = useState("1");
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10));
  const [jogo, setJogo] = useState("");
  const [regra, setRegra] = useState("");
  const [nomeVerde, setNomeVerde] = useState("Colar Verde");
  const [nomeAzul, setNomeAzul] = useState("Colar Azul");

  // lista
  const [listaTexto, setListaTexto] = useState("");
  const [lista, setLista] = useState<string[]>([]);
  const [selo, setSelo] = useState("");
  const [seladoEm, setSeladoEm] = useState("");
  const trancada = !!selo;

  // sorteio
  const [codigo, setCodigo] = useState("");
  const [codigoOk, setCodigoOk] = useState(false);
  const [ganhadores, setGanhadores] = useState<string[]>([]);
  const [trilha, setTrilha] = useState<TrailStep[]>([]);
  const [mostrando, setMostrando] = useState<number | null>(null);
  const [revelado, setRevelado] = useState<[boolean, boolean]>([false, false]);

  // som da revelação — muda muito ao vivo; default desligado
  const [som, setSom] = useState(false);

  // publicação
  const [publicando, setPublicando] = useState(false);
  const [linkPublico, setLinkPublico] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [erro, setErro] = useState("");

  // rodadas já publicadas — pra sugerir o próximo número e permitir apagar
  const [rodadasPublicadas, setRodadasPublicadas] = useState<RodadaResumo[]>([]);

  function carregarRodadas() {
    fetch("/api/rodada")
      .then((r) => r.json())
      .then((d) => {
        if (d?.proximoNumero) setNumero(String(d.proximoNumero));
        if (Array.isArray(d?.rodadas)) setRodadasPublicadas(d.rodadas);
      })
      .catch(() => {});
  }

  useEffect(() => {
    carregarRodadas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function apagarRodada(n: number) {
    if (!confirm(`Apagar a rodada ${n}? A página pública dela deixa de existir.`)) return;
    try {
      const res = await fetch(`/api/rodada?numero=${n}`, { method: "DELETE" });
      const d = await res.json();
      if (!res.ok) throw new Error(d?.erro || "Não deu pra apagar.");
      setRodadasPublicadas((rs) => rs.filter((r) => r.numero !== n));
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não deu pra apagar.");
    }
  }

  const premios = [
    { cor: "verde" as const, nome: nomeVerde },
    { cor: "azul" as const, nome: nomeAzul },
  ];
  const participantes = normalizeList(listaTexto).length;
  const ambosRevelados = revelado[0] && revelado[1];

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
    go(2);
  }

  async function confirmarCodigo() {
    if (!codigo.trim()) {
      setErro("Digite o código da sorte.");
      return;
    }
    setErro("");
    const { winners, trail } = await pickWinners(lista, selo, codigo.trim());
    setGanhadores(winners);
    setTrilha(trail);
    setCodigoOk(true);
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
      carregarRodadas();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não deu pra publicar.");
    } finally {
      setPublicando(false);
    }
  }

  function recomecar() {
    if (!confirm("Recomeçar do zero? Isso limpa tudo desta rodada.")) return;
    setSlideRaw([0, -1]);
    setListaTexto("");
    setLista([]);
    setSelo("");
    setSeladoEm("");
    setCodigo("");
    setCodigoOk(false);
    setGanhadores([]);
    setTrilha([]);
    setMostrando(null);
    setRevelado([false, false]);
    setLinkPublico("");
    setCopiado(false);
    setErro("");
  }

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 70 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * -70 }),
  };

  const passos = [
    { rotulo: "Rodada", feito: slide > 0 },
    { rotulo: "Participantes", feito: trancada },
    { rotulo: "Sorteio", feito: ambosRevelados },
  ];

  return (
    <div className="h-full mx-auto w-full max-w-3xl flex flex-col px-5 py-3">
      {/* Progresso gamificado */}
      <div className="flex items-center justify-center gap-3 shrink-0 py-1.5">
        {passos.map((p, i) => {
          const ativo = i === slide;
          return (
            <div key={p.rotulo} className="flex items-center gap-3">
              <button
                onClick={() => i < slide && go(i)}
                disabled={i >= slide}
                className="flex items-center gap-2 disabled:cursor-default"
              >
                <motion.span
                  animate={{ scale: ativo && !reduce ? [1, 1.12, 1] : 1 }}
                  transition={{ repeat: ativo ? Infinity : 0, duration: 1.8 }}
                  className={`grid place-items-center w-12 h-12 rounded-full text-base font-display font-semibold ${
                    p.feito || ativo ? "coin text-bronze-dark" : "bg-line text-ink"
                  }`}
                >
                  {p.feito ? "✓" : i + 1}
                </motion.span>
                <span className={`text-base font-medium ${ativo ? "text-ink" : "text-ink2"}`}>
                  {p.rotulo}
                </span>
              </button>
              {i < 2 && <span className={`h-px w-8 ${p.feito ? "bg-bronze" : "bg-line"} transition-colors`} />}
            </div>
          );
        })}
      </div>

      {/* Slides */}
      <div className="relative flex-1 min-h-0 flex items-center justify-center">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.section
            key={slide}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: EASE }}
            className="w-full max-h-full overflow-y-auto"
          >
            {slide === 0 && (
              <SlideDados
                {...{ numero, setNumero, data, setData, jogo, setJogo, regra, setRegra, nomeVerde, setNomeVerde, nomeAzul, setNomeAzul, trancada, rodadasPublicadas }}
                onNext={() => go(1)}
                onApagar={apagarRodada}
              />
            )}
            {slide === 1 && (
              <SlideLista
                {...{ listaTexto, setListaTexto, trancada, participantes, selo }}
                onLock={trancar}
                onNext={() => go(2)}
              />
            )}
            {slide === 2 && (
              <SlideSorteio
                {...{ selo, lista, codigo, setCodigo, codigoOk, confirmarCodigo, premios, ganhadores, mostrando, setMostrando, revelado, setRevelado, ambosRevelados, publicar, publicando, linkPublico, copiado, setCopiado, som, setSom }}
              />
            )}
          </motion.section>
        </AnimatePresence>
      </div>

      {/* Erro + recomeçar */}
      <div className="shrink-0 flex items-center justify-between gap-3 pt-1.5 min-h-[30px]">
        <AnimatePresence>
          {erro && (
            <motion.p
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: reduce ? 0 : [0, -6, 6, -4, 4, 0] }}
              exit={{ opacity: 0 }}
              className="text-sm text-amber bg-amber/10 border border-amber/30 rounded-lg px-3 py-1.5"
            >
              {erro}
            </motion.p>
          )}
        </AnimatePresence>
        <button onClick={recomecar} className="ml-auto text-sm text-ink2 hover:text-ink transition-colors py-2 px-1">
          ↺ Recomeçar
        </button>
      </div>
    </div>
  );
}

/* ── Peças reutilizáveis ── */

function Campo({
  label,
  className = "",
  ...props
}: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-sm font-mono uppercase tracking-[0.16em] text-bronze mb-1.5">
        {label}
      </span>
      <input
        {...props}
        className="w-full h-14 rounded-xl border border-line bg-surface px-4 text-lg text-ink shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-bronze/50 focus:border-bronze/60 focus:-translate-y-0.5 focus:shadow-md hover:border-bronze/30 disabled:opacity-60 disabled:hover:border-line"
      />
    </label>
  );
}

function BotaoOuro({
  children,
  ...props
}: React.ComponentProps<typeof motion.button>) {
  return (
    <motion.button
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.97 }}
      {...props}
      className="w-full rounded-xl min-h-14 px-8 py-4 text-lg font-semibold text-cream shadow-lg transition-opacity disabled:opacity-50"
      style={{
        background: "linear-gradient(120deg,#5F4C31,#876B45 40%,#C6A566 50%,#876B45 60%,#5F4C31)",
        backgroundSize: "200% auto",
        boxShadow: "0 6px 20px -6px rgba(135,107,69,0.6)",
      }}
    >
      {children}
    </motion.button>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-mono uppercase tracking-[0.26em] text-bronze text-center">
      {children}
    </p>
  );
}

/* ── Slide 1: dados ── */

function SlideDados(p: {
  numero: string; setNumero: (v: string) => void;
  data: string; setData: (v: string) => void;
  jogo: string; setJogo: (v: string) => void;
  regra: string; setRegra: (v: string) => void;
  nomeVerde: string; setNomeVerde: (v: string) => void;
  nomeAzul: string; setNomeAzul: (v: string) => void;
  trancada: boolean; onNext: () => void;
  rodadasPublicadas: RodadaResumo[];
  onApagar: (n: number) => void;
}) {
  const dis = p.trancada;
  return (
    <div className="mx-auto max-w-xl">
      <Kicker>Área da Dourê</Kicker>
      <h1 className="font-display text-4xl lg:text-5xl gold-text text-center pb-1 mt-1">
        Dados da rodada
      </h1>
      <div className="mt-5 grid grid-cols-2 gap-3.5">
        <Campo label="Rodada nº" value={p.numero} onChange={(e) => p.setNumero(e.target.value)} disabled={dis} />
        <Campo label="Data" type="date" value={p.data} onChange={(e) => p.setData(e.target.value)} disabled={dis} />
        <Campo label="Jogo" className="col-span-2" placeholder="Brasil × Argentina" value={p.jogo} onChange={(e) => p.setJogo(e.target.value)} disabled={dis} />
        <Campo
          label="Regra do código da sorte"
          className="col-span-2"
          placeholder="Ex.: soma das camisas dos 3 atacantes titulares na escalação oficial da CBF"
          value={p.regra}
          onChange={(e) => p.setRegra(e.target.value)}
          disabled={dis}
        />
        <Campo label="Prêmio 1" value={p.nomeVerde} onChange={(e) => p.setNomeVerde(e.target.value)} disabled={dis} />
        <Campo label="Prêmio 2" value={p.nomeAzul} onChange={(e) => p.setNomeAzul(e.target.value)} disabled={dis} />
      </div>
      <div className="mt-5">
        <BotaoOuro onClick={p.onNext}>Continuar →</BotaoOuro>
      </div>

      {p.rodadasPublicadas.length > 0 && (
        <div className="mt-6 rounded-xl border border-line bg-surface/60 p-4">
          <p className="text-sm font-mono uppercase tracking-[0.16em] text-bronze mb-2">
            Rodadas publicadas
          </p>
          <ul className="space-y-1.5">
            {p.rodadasPublicadas.map((r) => (
              <li key={r.numero} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-ink2 truncate">
                  <span className="text-ink font-medium">Rodada {r.numero}</span>
                  {r.jogo ? ` · ${r.jogo}` : ""}
                </span>
                <button
                  onClick={() => p.onApagar(r.numero)}
                  className="shrink-0 text-amber hover:underline py-1.5 px-1"
                  aria-label={`Apagar rodada ${r.numero}`}
                >
                  🗑 Apagar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ── Slide 2: participantes ── */

function SlideLista(p: {
  listaTexto: string; setListaTexto: (v: string) => void;
  trancada: boolean; participantes: number; selo: string;
  onLock: () => void; onNext: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl">
      <Kicker>Um nome por linha · repetidos são unidos sozinhos</Kicker>
      <h1 className="font-display text-4xl lg:text-5xl gold-text text-center pb-1 mt-1">
        Quem está concorrendo?
      </h1>
      <div className="relative mt-5">
        <textarea
          value={p.listaTexto}
          onChange={(e) => p.setListaTexto(e.target.value)}
          disabled={p.trancada}
          rows={7}
          className="w-full rounded-xl border border-line bg-surface px-4 py-3 font-mono text-base text-ink shadow-sm resize-none transition-all focus:outline-none focus:ring-2 focus:ring-bronze/50 focus:border-bronze/60 hover:border-bronze/30 disabled:opacity-70"
          placeholder={"@maria.silva\n@joao_p\n@carla.designs"}
        />
        <AnimatePresence>
          {p.participantes > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              key={p.participantes}
              className="absolute -top-3 right-3 coin px-3.5 py-1.5 rounded-full text-sm font-semibold text-bronze-dark"
            >
              {p.participantes} {p.participantes === 1 ? "participante" : "participantes"}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {p.trancada ? (
        <div className="mt-4 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-dashed border-bronze/50 bg-bronze-chip/40 px-4 py-3 text-center"
          >
            <p className="text-sm font-mono uppercase tracking-[0.2em] text-bronze">
              Lista trancada 🔒
            </p>
            {/* o selo é "cunhado": embaralha e estabiliza, dando materialidade ao hash */}
            <p className="font-mono text-base text-ink mt-1 break-all">
              <Scramble text={p.selo} />
            </p>
          </motion.div>
          <BotaoOuro onClick={p.onNext}>Ir pro sorteio →</BotaoOuro>
        </div>
      ) : (
        <div className="mt-4">
          <BotaoOuro onClick={p.onLock}>🔒 Trancar a lista</BotaoOuro>
        </div>
      )}
    </div>
  );
}

/* ── Slide 3: o palco do sorteio ── */

function SlideSorteio(p: {
  selo: string; lista: string[];
  codigo: string; setCodigo: (v: string) => void;
  codigoOk: boolean; confirmarCodigo: () => void;
  premios: { cor: "verde" | "azul"; nome: string }[];
  ganhadores: string[];
  mostrando: number | null; setMostrando: (v: number | null) => void;
  revelado: [boolean, boolean]; setRevelado: (v: [boolean, boolean]) => void;
  ambosRevelados: boolean;
  publicar: () => void; publicando: boolean;
  linkPublico: string; copiado: boolean; setCopiado: (v: boolean) => void;
  som: boolean; setSom: (v: boolean) => void;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="relative overflow-hidden rounded-card border border-bronze/25 bg-ink text-cream shadow-soft p-5 sm:p-6">
      {/* poeira de ouro subindo no palco */}
      <GoldParticles count={16} />
      {/* estouro de confete quando os dois prêmios saem */}
      {p.ambosRevelados && p.mostrando === null && <GoldConfetti />}

      <div className="relative z-10">
        <div className="flex items-center justify-center gap-2.5 text-sm font-mono text-cream/75">
          <span className="uppercase tracking-[0.2em] text-bronze-chip">Lista trancada</span>
          <span className="text-cream/40">·</span>
          <span>{p.lista.length} na disputa</span>
          <span className="text-cream/40">·</span>
          <span title={p.selo}>{p.selo.slice(0, 12)}…</span>
          <span className="text-cream/40">·</span>
          <button
            onClick={() => p.setSom(!p.som)}
            aria-pressed={p.som}
            title={p.som ? "Desligar som da revelação" : "Ligar som da revelação"}
            className="grid place-items-center w-10 h-10 -my-2 rounded-full hover:bg-cream/10 transition-colors"
          >
            {p.som ? "🔔" : "🔕"}
          </button>
        </div>

        {/* Código da sorte */}
        {!p.codigoOk ? (
          <div className="mt-4 mx-auto max-w-sm text-center">
            <p className="font-display text-3xl gold-text pb-1">Código da sorte</p>
            <input
              value={p.codigo}
              onChange={(e) => p.setCodigo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && p.confirmarCodigo()}
              placeholder="ex.: 30"
              autoFocus
              className="mt-3 w-full rounded-xl border border-bronze-chip/50 bg-cream/10 px-4 py-4 text-center font-display text-4xl text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-bronze-chip/60 transition-all"
            />
            <div className="mt-3">
              <BotaoOuro onClick={p.confirmarCodigo}>Confirmar código ✦</BotaoOuro>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3 flex items-center justify-center gap-2"
          >
            <span className="coin grid place-items-center w-9 h-9 rounded-full font-display font-semibold text-bronze-dark text-base">
              ✦
            </span>
            <span className="font-mono text-base text-cream/85">código da sorte:</span>
            <span className="font-display text-3xl text-bronze-chip">{p.codigo}</span>
          </motion.div>
        )}

        {/* Palco: show rodando OU pedestais dos prêmios */}
        <div className="mt-4">
          <AnimatePresence mode="wait">
            {p.mostrando !== null ? (
              <motion.div key={`show-${p.mostrando}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SuspenseReveal
                  som={p.som}
                  lista={p.lista}
                  ganhadores={[p.ganhadores[p.mostrando]]}
                  premios={[p.premios[p.mostrando]]}
                  onDone={() => {
                    const idx = p.mostrando!;
                    p.setRevelado(idx === 0 ? [true, p.revelado[1]] : [p.revelado[0], true]);
                    p.setMostrando(null);
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="pedestais"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 gap-3.5"
                style={{ perspective: 900 }}
              >
                {p.premios.map((premio, i) => {
                  const c = CORES[premio.cor];
                  const done = p.revelado[i];
                  return (
                    <div
                      key={premio.cor}
                      className="rounded-card border p-4 text-center"
                      style={{ borderColor: `${c.hex}55`, background: c.soft }}
                    >
                      <p className="text-sm font-mono uppercase tracking-[0.18em]" style={{ color: c.hex === "#3E7A5C" ? "#8FC4A8" : "#9FB8DA" }}>
                        {premio.nome}
                      </p>
                      {done ? (
                        <motion.div
                          initial={{ rotateY: reduce ? 0 : 90, opacity: 0 }}
                          animate={{ rotateY: 0, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 120, damping: 14 }}
                          style={{ transformStyle: "preserve-3d" }}
                          className="mt-1"
                        >
                          <Gem3D size="sm" />
                          <p className="font-display text-3xl lg:text-4xl text-cream flex items-center justify-center gap-1.5 -mt-1">
                            @{p.ganhadores[i]}
                            <DiamondFacetGlow pulse color={c.hex} />
                          </p>
                        </motion.div>
                      ) : (
                        <motion.button
                          onClick={() => p.setMostrando(i)}
                          disabled={!p.codigoOk || p.mostrando !== null}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.95 }}
                          animate={
                            p.codigoOk && !reduce
                              ? { boxShadow: [`0 0 0px ${c.hex}00`, `0 0 26px ${c.hex}88`, `0 0 0px ${c.hex}00`] }
                              : {}
                          }
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="mt-4 mb-2 w-full rounded-xl min-h-14 py-4 text-lg font-semibold text-cream disabled:opacity-40"
                          style={{ background: c.grad }}
                        >
                          ✦ Sortear
                        </motion.button>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Publicar — aparece quando os dois prêmios foram revelados */}
        <AnimatePresence>
          {p.ambosRevelados && p.mostrando === null && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, ease: EASE }}
              className="mt-4"
            >
              {!p.linkPublico ? (
                <BotaoOuro onClick={p.publicar} disabled={p.publicando}>
                  {p.publicando ? "Publicando…" : "Publicar página da rodada ✦"}
                </BotaoOuro>
              ) : (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                  <div className="flex items-center gap-2 rounded-xl border border-bronze-chip/50 bg-cream/10 px-4 py-3.5">
                    <span className="flex-1 truncate font-mono text-base text-cream">{p.linkPublico}</span>
                    <a href={p.linkPublico} target="_blank" rel="noreferrer" className="text-bronze-chip text-sm hover:underline shrink-0 py-2">
                      abrir ↗
                    </a>
                  </div>
                  <BotaoOuro
                    onClick={() => {
                      navigator.clipboard.writeText(p.linkPublico);
                      p.setCopiado(true);
                      setTimeout(() => p.setCopiado(false), 2000);
                    }}
                  >
                    {p.copiado ? "Link copiado ✓" : "Copiar link para o Instagram"}
                  </BotaoOuro>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
