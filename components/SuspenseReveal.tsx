"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Gem3D from "@/components/Gem3D";
import { playChime } from "@/components/stage";

type Premio = { cor: "verde" | "azul"; nome: string };

// hex são as variantes claras dos prêmios — legíveis sobre o palco escuro (AA)
const CORES: Record<string, { hex: string; soft: string }> = {
  verde: { hex: "#5FA07D", soft: "rgba(62,122,92,0.14)" },
  azul: { hex: "#6B8FC4", soft: "rgba(59,93,138,0.14)" },
};

// Show do sorteio: um rolo de nomes que acelera, desacelera e trava no
// ganhador (que já foi decidido matematicamente — isto é só teatro em cima).
// Usado ao vivo na ferramenta e como replay na página pública.
export default function SuspenseReveal({
  lista,
  ganhadores,
  premios,
  onDone,
  som = false,
}: {
  lista: string[];
  ganhadores: string[];
  premios: Premio[];
  onDone?: () => void;
  som?: boolean;
}) {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0); // qual prêmio está sorteando
  const [display, setDisplay] = useState(lista[0] ?? "");
  const [fase, setFase] = useState<"intro" | "rolando" | "travado" | "fim">("intro");
  const [burst, setBurst] = useState(0); // muda pra disparar novo estouro
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const vivo = useRef(true);

  const cor = premios[idx]?.cor ?? "verde";
  const paleta = CORES[cor];
  const nomePremio = premios[idx]?.nome ?? "Prêmio";

  useEffect(() => {
    vivo.current = true;
    const wait = (ms: number) =>
      new Promise<void>((r) => timers.current.push(setTimeout(r, ms)));

    async function rolar(winner: string) {
      // agenda de intervalos: rápido no começo, cada vez mais lento até travar
      const delays: number[] = [];
      let d = 55;
      while (d < 420) {
        delays.push(d);
        d = Math.round(d * 1.14);
      }
      for (const delay of delays) {
        if (!vivo.current) return;
        setDisplay(lista[Math.floor(Math.random() * lista.length)] ?? winner);
        await wait(delay);
      }
      if (!vivo.current) return;
      setDisplay(winner);
      setFase("travado");
      setBurst((b) => b + 1);
      if (som) playChime();
    }

    async function show() {
      for (let i = 0; i < ganhadores.length; i++) {
        if (!vivo.current) return;
        setIdx(i);
        setFase("intro");
        await wait(reduce ? 200 : 1100);
        if (reduce) {
          setDisplay(ganhadores[i]);
          setFase("travado");
          setBurst((b) => b + 1);
          if (som) playChime();
        } else {
          setFase("rolando");
          await rolar(ganhadores[i]);
        }
        await wait(reduce ? 400 : 1700); // segura o momento
      }
      if (!vivo.current) return;
      setFase("fim");
      onDone?.();
    }

    show();
    return () => {
      vivo.current = false;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    // roda uma vez por montagem
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (fase === "fim") return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative overflow-hidden rounded-card border border-line bg-ink text-cream shadow-soft"
      style={{ minHeight: 320 }}
    >
      {/* halo pulsante atrás do palco */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: fase === "rolando" ? [0.25, 0.55, 0.25] : 0.4 }}
        transition={{ duration: 1.1, repeat: fase === "rolando" ? Infinity : 0 }}
        style={{
          background: `radial-gradient(120% 90% at 50% 0%, ${paleta.soft}, transparent 60%)`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-10 text-center">
        <motion.p
          key={`label-${idx}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-mono uppercase tracking-[0.24em]"
          style={{ color: paleta.hex }}
        >
          {fase === "intro" ? `Sorteando · ${nomePremio}` : nomePremio}
        </motion.p>

        {/* contador de tensão antes do rolo girar */}
        {fase === "intro" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-base text-cream/70"
          >
            {lista.length} na disputa por {premios.length === 1 ? "este prêmio" : `${premios.length} colares`}
          </motion.p>
        )}

        {/* o rolo de nomes — o clímax filmado, tamanho de herói */}
        <div className="relative mt-4 min-h-20 sm:min-h-28 lg:min-h-32 flex items-center justify-center w-full">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={display + idx + fase}
              initial={fase === "rolando" ? { y: 28, opacity: 0 } : { scale: 0.7, opacity: 0 }}
              animate={
                fase === "travado"
                  ? { scale: 1, opacity: 1, y: 0 }
                  : { y: 0, opacity: 1 }
              }
              exit={{ y: -28, opacity: 0 }}
              transition={
                fase === "travado"
                  ? { type: "spring", stiffness: 260, damping: 11 } // o nome "quica" antes de fixar
                  : { duration: 0.12, ease: "easeOut" }
              }
              className={`font-display px-4 max-w-full break-words text-center ${
                display.length > 20
                  ? "text-2xl sm:text-3xl lg:text-4xl"
                  : display.length > 14
                  ? "text-2xl sm:text-4xl lg:text-5xl"
                  : "text-3xl sm:text-5xl lg:text-6xl"
              }`}
              style={{ color: fase === "travado" ? paleta.hex : "#FAF9F7" }}
            >
              @{display}
            </motion.span>
          </AnimatePresence>
        </div>

        {fase === "intro" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-2"
          >
            {/* o diamante da marca gira enquanto o próximo prêmio é anunciado —
                a mesma peça da home, só que no tamanho do palco */}
            {reduce ? (
              <div className="mt-2 flex gap-1.5 justify-center" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-2 h-2 rounded-full" style={{ background: paleta.hex }} />
                ))}
              </div>
            ) : (
              <Gem3D size="sm" />
            )}
          </motion.div>
        )}

        {/* "N de M" só faz sentido quando há mais de um prêmio nesta sequência —
            no palco individual da Dourê (um prêmio por vez) seria um "1 de 1" órfão. */}
        {fase === "travado" && ganhadores.length > 1 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 text-sm text-cream/70"
          >
            {idx + 1} de {ganhadores.length}
          </motion.p>
        )}
      </div>

      {/* estouro de lascas douradas ao travar */}
      <Burst trigger={burst} color={paleta.hex} />
    </motion.div>
  );
}

function Burst({ trigger, color }: { trigger: number; color: string }) {
  const reduce = useReducedMotion();
  if (!trigger || reduce) return null;
  const N = 18;
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {Array.from({ length: N }).map((_, i) => {
        const ang = (i / N) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 90 + Math.random() * 80;
        const gold = i % 3 === 0 ? "#EFDCA8" : i % 3 === 1 ? "#C6A566" : color;
        return (
          <motion.span
            key={`${trigger}-${i}`}
            className="absolute"
            style={{
              width: 6,
              height: 10,
              borderRadius: 2,
              background: gold,
              boxShadow: `0 0 8px ${gold}`,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
            animate={{
              x: Math.cos(ang) * dist,
              y: Math.sin(ang) * dist,
              opacity: 0,
              scale: 0.4,
              rotate: Math.random() * 360,
            }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}
