"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DiamondFacetGlow from "./DiamondFacetGlow";

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

  useEffect(() => {
    const t = setTimeout(() => setPulse(true), delay * 1000 + 350);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="rounded-card border border-line bg-surface shadow-soft p-5 flex items-center gap-4"
    >
      <div
        className={`w-11 h-11 rounded-full flex-shrink-0 ${
          isVerde ? "bg-premioVerde" : "bg-premioAzul"
        }`}
        style={{
          boxShadow: `inset 0 0 0 1px rgba(0,0,0,0.06), 0 0 0 4px ${
            isVerde ? "rgba(62,122,92,0.08)" : "rgba(59,93,138,0.08)"
          }`,
        }}
        aria-hidden="true"
      />
      <div className="text-left">
        <p
          className={`text-[11px] font-mono uppercase tracking-[0.16em] ${
            isVerde ? "text-premioVerde" : "text-premioAzul"
          }`}
        >
          {nomePremio}
        </p>
        <p className="font-display text-xl text-ink mt-0.5 flex items-center gap-1.5">
          @{ganhador}
          <DiamondFacetGlow pulse={pulse} color={isVerde ? "#3E7A5C" : "#3B5D8A"} />
        </p>
      </div>
    </motion.div>
  );
}
