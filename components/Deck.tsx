"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

// Deck genérico: slides que cabem na primeira dobra, com setas, bolinhas,
// teclado e swipe. Usado pela home e pela página pública da rodada — mesma
// mecânica de navegação em toda a experiência filmada.
export default function Deck({ slides }: { slides: React.ReactNode[] }) {
  const reduce = useReducedMotion();
  const [[i, dir], setSlide] = useState<[number, number]>([0, 0]);
  const TOTAL = slides.length;

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
      {/* px extra reserva um corredor pras setas (w-12 = 48px) — evita que elas cubram o conteúdo */}
      <div className="relative w-full max-w-3xl flex-1 min-h-0 flex items-center justify-center px-14 sm:px-16">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.section
            key={i}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: EASE }}
            drag={reduce ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) go(i + 1);
              else if (info.offset.x > 80) go(i - 1);
            }}
            className="w-full max-h-full overflow-y-auto"
          >
            {slides[i]}
          </motion.section>
        </AnimatePresence>

        {i > 0 && <Arrow side="left" onClick={() => go(i - 1)} />}
        {i < TOTAL - 1 && <Arrow side="right" onClick={() => go(i + 1)} />}
      </div>

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
        side === "left" ? "left-0" : "right-0"
      } grid place-items-center w-12 h-12 rounded-full border border-line bg-surface/80 backdrop-blur text-bronze shadow-soft hover:border-bronze/40 hover:bg-bronze-chip/40 transition-colors z-20`}
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {side === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
      </svg>
    </button>
  );
}
