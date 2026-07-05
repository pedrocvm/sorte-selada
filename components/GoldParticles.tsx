"use client";

import { motion, useReducedMotion } from "framer-motion";

// posições determinísticas (sem Math.random) pra não dar mismatch de hidratação
const frac = (i: number, salt: number) => ((i * 7919 + salt * 104729) % 1000) / 1000;

/** Poeira de ouro ambiente: partículas subindo devagar, com brilho.
 *  Puro enfeite — some inteira com prefers-reduced-motion. */
export default function GoldParticles({ count = 18 }: { count?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: count }).map((_, i) => {
        const left = frac(i, 1) * 100;
        const size = 2 + frac(i, 2) * 3.5;
        const dur = 6 + frac(i, 3) * 7;
        const delay = frac(i, 4) * 8;
        const drift = (frac(i, 5) - 0.5) * 40;
        const gold = ["#EFDCA8", "#C6A566", "#9C7E4A"][i % 3];
        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${left}%`,
              bottom: -8,
              width: size,
              height: size,
              background: gold,
              boxShadow: `0 0 ${size * 2.5}px ${gold}`,
            }}
            animate={{ y: "-105vh" as unknown as number, x: drift, opacity: [0, 0.9, 0.7, 0] }}
            transition={{ duration: dur, delay, repeat: Infinity, ease: "linear" }}
          />
        );
      })}
    </div>
  );
}

/** Estouro de confete dourado one-shot (ex.: quando os dois prêmios saem). */
export function GoldConfetti({ pieces = 30 }: { pieces?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
      {Array.from({ length: pieces }).map((_, i) => {
        const ang = (i / pieces) * Math.PI * 2 + frac(i, 6) * 0.5;
        const dist = 110 + frac(i, 7) * 140;
        const gold = ["#EFDCA8", "#C6A566", "#876B45", "#3E7A5C", "#3B5D8A"][i % 5];
        return (
          <motion.span
            key={i}
            className="absolute"
            style={{ width: 7, height: 11, borderRadius: 2, background: gold, boxShadow: `0 0 10px ${gold}` }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
            animate={{
              x: Math.cos(ang) * dist,
              y: Math.sin(ang) * dist + 60, // cai um pouco, como confete de verdade
              opacity: 0,
              scale: 0.5,
              rotate: frac(i, 8) * 540,
            }}
            transition={{ duration: 1.3, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}
