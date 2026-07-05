"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Gem3D from "@/components/Gem3D";
import GoldParticles from "@/components/GoldParticles";
import RoundCard from "@/components/RoundCard";
import type { Rodada } from "@/lib/rounds";

const PASSOS = [
  { n: "1", t: "Trancamos a lista", d: "Geramos uma impressão digital única da lista de participantes, antes de sortear." },
  { n: "2", t: "Um código de fora decide", d: "O número que sorteia vem de algo público que a loja não controla — como a escalação da Seleção." },
  { n: "3", t: "Você confere sozinho", d: "Cole a mesma lista e o mesmo código e chegue exatamente no mesmo resultado." },
];

// Home em formato de "deck": tudo cabe na primeira dobra, e cada seção troca
// com animação em vez de rolar a página. Setas, bolinhas, teclado e swipe.
export default function HomeDeck({ rodadas }: { rodadas: Rodada[] }) {
  const reduce = useReducedMotion();
  const [[i, dir], setSlide] = useState<[number, number]>([0, 0]);
  const TOTAL = 3;

  const go = (to: number) => {
    const next = Math.max(0, Math.min(TOTAL - 1, to));
    if (next !== i) setSlide([next, next > i ? 1 : -1]);
  };

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 60 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * -60 }),
  };

  return (
    <div
      className="h-full flex flex-col items-center justify-center px-5 outline-none"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(i + 1);
        if (e.key === "ArrowLeft") go(i - 1);
      }}
    >
      <div className="relative w-full max-w-3xl flex-1 min-h-0 flex items-center justify-center">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.section
            key={i}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            drag={reduce ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) go(i + 1);
              else if (info.offset.x > 80) go(i - 1);
            }}
            className="w-full"
          >
            {i === 0 && <Hero />}
            {i === 1 && <Como />}
            {i === 2 && <Rodadas rodadas={rodadas} />}
          </motion.section>
        </AnimatePresence>

        {/* Setas */}
        {i > 0 && <Arrow side="left" onClick={() => go(i - 1)} />}
        {i < TOTAL - 1 && <Arrow side="right" onClick={() => go(i + 1)} />}
      </div>

      {/* Bolinhas de navegação */}
      <div className="flex items-center gap-2 py-4 shrink-0">
        {Array.from({ length: TOTAL }).map((_, d) => (
          <button
            key={d}
            aria-label={`Ir para a seção ${d + 1}`}
            onClick={() => go(d)}
            className={`h-2 rounded-full transition-all ${
              d === i ? "w-6 bg-bronze" : "w-2 bg-line hover:bg-bronze/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Arrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={side === "left" ? "Anterior" : "Próximo"}
      className={`absolute top-1/2 -translate-y-1/2 ${
        side === "left" ? "left-0 -ml-1 sm:-ml-4" : "right-0 -mr-1 sm:-mr-4"
      } grid place-items-center w-9 h-9 rounded-full border border-line bg-surface/80 backdrop-blur text-bronze shadow-soft hover:border-bronze/40 hover:bg-bronze-chip/40 transition-colors`}
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {side === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
      </svg>
    </button>
  );
}

function Hero() {
  return (
    <div className="relative text-center">
      <GoldParticles count={14} />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-6 -z-10 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl glow-pulse"
        style={{ background: "radial-gradient(circle, rgba(198,165,102,0.45), rgba(198,165,102,0) 70%)" }}
      />
      <div className="floaty">
        <Gem3D />
      </div>
      <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-bronze mt-1">
        À prova de fraude · confira você mesmo
      </p>
      <h1 className="font-display text-4xl sm:text-6xl mt-2 leading-tight gold-text pb-1">
        Sorte Selada
      </h1>
      <p className="text-ink2 mt-3 max-w-md mx-auto leading-relaxed text-sm sm:text-base">
        A cada jogo do Brasil na Copa, a Dourê sorteia dois colares — um verde,
        um azul. Toda lista é trancada em público, e qualquer pessoa pode
        conferir o resultado sozinha.
      </p>
      <p className="text-xs text-bronze/70 mt-6 font-mono">deslize para ver como funciona →</p>
    </div>
  );
}

function Como() {
  return (
    <div className="text-center">
      <h2 className="font-display text-2xl sm:text-3xl text-ink mb-6">Como funciona</h2>
      <div className="grid sm:grid-cols-3 gap-3">
        {PASSOS.map((s, idx) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group rounded-card border border-line bg-surface shadow-soft p-4 text-left transition-all hover:-translate-y-1 hover:border-bronze/40 hover:shadow-md"
          >
            <span className="coin grid place-items-center w-9 h-9 rounded-full font-display font-semibold text-bronze-dark transition-transform group-hover:scale-110 group-hover:rotate-6">
              {s.n}
            </span>
            <p className="font-display text-base text-ink mt-3">{s.t}</p>
            <p className="text-xs text-ink2 mt-1.5 leading-relaxed">{s.d}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Rodadas({ rodadas }: { rodadas: Rodada[] }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-display text-2xl sm:text-3xl text-ink">Rodadas</h2>
        <Link href="/verificar" className="text-xs text-bronze hover:underline">
          Conferir manualmente →
        </Link>
      </div>
      {rodadas.length === 0 ? (
        <div className="rounded-card border border-dashed border-line bg-surface/50 p-8 text-center text-ink2 text-sm">
          Nenhuma rodada publicada ainda. A primeira aparece aqui assim que for lacrada.
        </div>
      ) : (
        // ponytail: lista contida com scroll interno só se houver muitas rodadas
        // (numa Copa são poucas) — a página em si nunca rola.
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {rodadas.map((r) => (
            <RoundCard key={r.numero} rodada={r} />
          ))}
        </div>
      )}
    </div>
  );
}
