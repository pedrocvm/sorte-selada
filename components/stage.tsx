"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/* Peças de "palco": efeitos usados nas telas filmadas ao vivo.
   Todos respeitam prefers-reduced-motion caindo direto no estado final. */

const HEX = "0123456789abcdef";

/** Texto "cunhado": embaralha os caracteres e estabiliza da esquerda pra direita. */
export function Scramble({
  text,
  className,
  duration = 1400,
  charset = HEX,
}: {
  text: string;
  className?: string;
  duration?: number;
  charset?: string;
}) {
  const reduce = useReducedMotion();
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (reduce) {
      setOut(text);
      return;
    }
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const settled = Math.floor(text.length * p);
      setOut(
        text.slice(0, settled) +
          text
            .slice(settled)
            .split("")
            .map((c) => (/\s/.test(c) ? c : charset[Math.floor(Math.random() * charset.length)]))
            .join("")
      );
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, reduce, duration, charset]);

  return <span className={className}>{out}</span>;
}

/** Número que sobe até o valor final (código da sorte). Valor não numérico rende direto. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const reduce = useReducedMotion();
  const n = Number(value);
  const anima = !reduce && Number.isFinite(n);
  const [out, setOut] = useState(anima ? "0" : value);

  useEffect(() => {
    if (!anima) {
      setOut(value);
      return;
    }
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 900);
      const eased = 1 - Math.pow(1 - p, 3);
      setOut(String(Math.round(n * eased)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className={className}>{out}</span>;
}

/** Chime dourado da revelação — arpejo curto em WebAudio, sem asset. */
export function playChime() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = f;
      o.connect(g);
      g.connect(ctx.destination);
      const t = ctx.currentTime + i * 0.09;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.16, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
      o.start(t);
      o.stop(t + 1);
    });
  } catch {
    // sem áudio disponível — segue o show em silêncio
  }
}
