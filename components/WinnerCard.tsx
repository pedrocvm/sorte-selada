"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import DiamondFacetGlow from "./DiamondFacetGlow";

// Card do vencedor — o clímax filmado. Nome em tamanho de herói e tilt 3D
// com brilho especular que segue o mouse. ponytail: sem giroscópio (iOS exige
// prompt de permissão); adicionar se o tilt no celular virar pedido real.
export default function WinnerCard({
  cor,
  nomePremio,
  ganhador,
  delay = 0,
}: {
  cor: "verde" | "azul";
  nomePremio: string;
  ganhador: string;
  delay?: number;
}) {
  const [pulse, setPulse] = useState(false);
  const isVerde = cor === "verde";
  const hex = isVerde ? "#3E7A5C" : "#3B5D8A";
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotX = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 200, damping: 20 });
  const rotY = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 200, damping: 20 });
  const glare = useTransform([mx, my] as const, ([x, y]: number[]) =>
    `radial-gradient(320px circle at ${x * 100}% ${y * 100}%, rgba(239,220,168,0.35), transparent 65%)`
  );

  useEffect(() => {
    const t = setTimeout(() => setPulse(true), delay * 1000 + 350);
    return () => clearTimeout(t);
  }, [delay]);

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }

  return (
    <div style={{ perspective: 800 }}>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
        style={reduce ? undefined : { rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        className="relative overflow-hidden rounded-card border border-line bg-surface shadow-soft p-6 flex items-center gap-4"
      >
        {/* brilho especular que segue o mouse */}
        {!reduce && (
          <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glare }} />
        )}
        <div
          className={`w-14 h-14 rounded-full flex-shrink-0 ${isVerde ? "bg-premioVerde" : "bg-premioAzul"}`}
          style={{
            boxShadow: `inset 0 0 0 1px rgba(0,0,0,0.06), 0 0 0 5px ${
              isVerde ? "rgba(62,122,92,0.1)" : "rgba(59,93,138,0.1)"
            }`,
          }}
          aria-hidden="true"
        />
        <div className="text-left min-w-0">
          <p
            className={`text-sm font-mono uppercase tracking-[0.16em] ${
              isVerde ? "text-premioVerde" : "text-premioAzul"
            }`}
          >
            {nomePremio}
          </p>
          <p className="font-display text-3xl lg:text-4xl text-ink mt-1 flex items-center gap-2 break-all">
            @{ganhador}
            <DiamondFacetGlow pulse={pulse} color={hex} />
          </p>
        </div>
      </motion.div>
    </div>
  );
}
