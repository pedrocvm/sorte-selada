"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Gem3D from "@/components/Gem3D";

export default function LoginPage() {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  async function entrar() {
    setCarregando(true);
    setErro("");
    const res = await fetch("/api/sortear-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senha }),
    });
    setCarregando(false);
    if (res.ok) {
      router.push("/sortear");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setErro(data.erro ?? "Não foi possível entrar.");
    }
  }

  return (
    <div className="h-full flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
        className="relative w-full max-w-sm rounded-card border border-line bg-surface shadow-soft p-7 text-center overflow-hidden"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 -top-10 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl glow-pulse"
          style={{ background: "radial-gradient(circle, rgba(198,165,102,0.4), rgba(198,165,102,0) 70%)" }}
        />
        <div className="floaty">
          <Gem3D size="sm" />
        </div>
        <h1 className="font-display text-2xl mt-2 gold-text pb-0.5">Área da Karol</h1>
        <p className="text-sm text-ink2 mt-1">
          Acesso restrito. Só quem faz os sorteios entra aqui.
        </p>

        <div className="relative mt-6">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-bronze/60" aria-hidden>
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          </span>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && entrar()}
            placeholder="senha"
            className="w-full rounded-lg border border-line bg-cream pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bronze/40 transition-shadow"
            autoFocus
          />
        </div>

        <motion.button
          onClick={entrar}
          disabled={carregando || !senha}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          className="w-full mt-3 rounded-lg bg-bronze hover:bg-bronze-dark disabled:opacity-50 text-cream font-medium text-sm py-2.5 transition-colors"
        >
          {carregando ? "Entrando…" : "Entrar"}
        </motion.button>

        {erro && (
          <motion.p
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
            className="text-sm text-amber bg-amber/10 border border-amber/30 rounded-lg px-3 py-2 mt-4"
          >
            {erro}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
