"use client";

import Lottie from "lottie-react";
import raw from "@/public/diamond-rotation.json";

// Rampa de ouro da Dourê (escuro → claro). As cores originais da animação
// (ciano/azul/lavanda/branco) são remapeadas por ranking de luminância,
// preservando o contraste entre as facetas.
const RAMP = [
  [0x6e, 0x58, 0x36],
  [0x9c, 0x7e, 0x4a],
  [0xc6, 0xa5, 0x66],
  [0xef, 0xdc, 0xa8],
];

const lum = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

function recolor(src: unknown) {
  const data = JSON.parse(JSON.stringify(src));
  const nodes: { k: number[] }[] = [];
  const walk = (o: unknown) => {
    if (Array.isArray(o)) return o.forEach(walk);
    if (o && typeof o === "object") {
      const node = o as Record<string, unknown>;
      if (
        (node.ty === "fl" || node.ty === "st") &&
        node.c &&
        Array.isArray((node.c as { k?: unknown }).k) &&
        typeof (node.c as { k: number[] }).k[0] === "number"
      ) {
        nodes.push(node.c as { k: number[] });
      }
      Object.values(node).forEach(walk);
    }
  };
  walk(data);

  const key = (k: number[]) => k.slice(0, 3).map((x) => Math.round(x * 255)).join(",");
  const distinct = [...new Set(nodes.map((c) => key(c.k)))]
    .map((s) => s.split(",").map(Number))
    .sort((a, b) => lum(a[0], a[1], a[2]) - lum(b[0], b[1], b[2]));

  const map = new Map<string, number[]>();
  distinct.forEach((rgb, i) => {
    const g = RAMP[Math.round((i / Math.max(1, distinct.length - 1)) * (RAMP.length - 1))];
    map.set(rgb.join(","), g);
  });

  nodes.forEach((c) => {
    const g = map.get(key(c.k));
    if (g) c.k = [g[0] / 255, g[1] / 255, g[2] / 255, c.k[3] ?? 1];
  });
  return data;
}

const goldDiamond = recolor(raw);

const SIZES = {
  lg: { box: "h-64 sm:h-72", gem: "w-56 h-56 sm:w-64 sm:h-64" },
  sm: { box: "h-16 sm:h-20", gem: "w-14 h-14 sm:w-16 sm:h-16" },
};

// tamanho "sm" existe pra reaproveitar a mesma peça (com a mesma identidade
// visual da home) dentro do show de suspense, sem precisar de outro asset.
export default function Gem3D({ size = "lg" }: { size?: "lg" | "sm" }) {
  const s = SIZES[size];
  return (
    <div className={`flex items-center justify-center ${s.box}`}>
      <Lottie
        animationData={goldDiamond}
        loop
        autoplay
        className={s.gem}
        aria-hidden
      />
    </div>
  );
}
