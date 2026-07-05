'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Gem3D from '@/components/Gem3D';
import GoldParticles from '@/components/GoldParticles';
import RoundCard from '@/components/RoundCard';
import Deck from '@/components/Deck';
import type { Rodada } from '@/lib/rounds';

const PASSOS = [
  {
    n: '1',
    t: 'Trancamos a lista',
    d: 'Geramos uma impressão digital única da lista de participantes, antes de sortear.',
  },
  {
    n: '2',
    t: 'Um código de fora decide',
    d: 'O número que sorteia vem de algo público que a loja não controla — como a escalação da Seleção.',
  },
  {
    n: '3',
    t: 'Você confere por conta própria',
    d: 'Cole a mesma lista e o mesmo código e chegue exatamente no mesmo resultado.',
  },
];

// Home em formato de "deck": tudo cabe na primeira dobra, e cada seção troca
// com animação em vez de rolar a página.
export default function HomeDeck({ rodadas }: { rodadas: Rodada[] }) {
  return (
    <Deck
      slides={[
        <Hero key='hero' />,
        <Como key='como' />,
        <Rodadas key='rodadas' rodadas={rodadas} />,
      ]}
    />
  );
}

function Hero() {
  return (
    <div className='relative text-center'>
      <GoldParticles count={14} />
      <div
        aria-hidden
        className='pointer-events-none absolute left-1/2 top-6 -z-10 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl glow-pulse'
        style={{
          background:
            'radial-gradient(circle, rgba(198,165,102,0.45), rgba(198,165,102,0) 70%)',
        }}
      />
      <div className='floaty'>
        <Gem3D />
      </div>
      <p className='text-sm font-mono uppercase tracking-[0.28em] text-bronze mt-1'>
        À prova de fraude · confira você mesmo
      </p>
      <h1 className='font-display text-5xl sm:text-6xl lg:text-7xl mt-2 leading-tight gold-text pb-1'>
        Sorte Selada
      </h1>
      <p className='text-ink2 mt-3 max-w-lg mx-auto leading-relaxed text-base sm:text-lg'>
        A cada jogo do Brasil na Copa, a Dourê sorteia dois prêmios. Toda lista
        é trancada em público, e qualquer pessoa pode conferir o resultado por
        conta própria.
      </p>
      <p className='text-sm text-bronze mt-6 font-mono'>
        deslize para ver como funciona →
      </p>
    </div>
  );
}

function Como() {
  return (
    <div className='text-center'>
      <h2 className='font-display text-3xl sm:text-4xl text-ink mb-6'>
        Como funciona
      </h2>
      <div className='grid sm:grid-cols-3 gap-3'>
        {PASSOS.map((s, idx) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className='group rounded-card border border-line bg-surface shadow-soft p-4 text-left transition-all hover:-translate-y-1 hover:border-bronze/40 hover:shadow-md'
          >
            <span className='coin grid place-items-center w-9 h-9 rounded-full font-display font-semibold text-bronze-dark transition-transform group-hover:scale-110 group-hover:rotate-6'>
              {s.n}
            </span>
            <p className='font-display text-lg text-ink mt-3'>{s.t}</p>
            <p className='text-sm text-ink2 mt-1.5 leading-relaxed'>{s.d}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ponytail: campanha da Copa tem tamanho fixo conhecido; vira campo da rodada se mudar
const TOTAL_COPA = 7;

function Rodadas({ rodadas }: { rodadas: Rodada[] }) {
  return (
    <div>
      <div className='flex items-baseline justify-between mb-3'>
        <h2 className='font-display text-3xl sm:text-4xl text-ink'>Rodadas</h2>
        <Link
          href='/verificar'
          className='text-sm text-bronze hover:underline py-2'
        >
          Conferir outro sorteio →
        </Link>
      </div>

      {/* Barra de progresso da campanha */}
      <div className='mb-4'>
        <div className='flex items-baseline justify-between text-sm font-mono text-ink2 mb-1.5'>
          <span>
            Rodada {Math.min(rodadas.length, TOTAL_COPA)} de {TOTAL_COPA}
          </span>
          <span>
            {TOTAL_COPA - Math.min(rodadas.length, TOTAL_COPA)} por vir
          </span>
        </div>
        <div className='h-2.5 rounded-full bg-line/60 overflow-hidden'>
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min(100, (rodadas.length / TOTAL_COPA) * 100)}%`,
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className='h-full rounded-full'
            style={{ background: 'linear-gradient(90deg,#876B45,#C6A566)' }}
          />
        </div>
      </div>

      {rodadas.length === 0 ? (
        <div className='rounded-card border border-dashed border-line bg-surface/50 p-8 text-center text-ink2 text-base'>
          Nenhuma rodada publicada ainda. A primeira aparece aqui assim que for
          lacrada.
        </div>
      ) : (
        // ponytail: lista contida com scroll interno só se houver muitas rodadas
        // (numa Copa são poucas) — a página em si nunca rola.
        <div className='space-y-3 max-h-[50vh] overflow-y-auto pr-1'>
          {rodadas.map((r) => (
            <RoundCard key={r.numero} rodada={r} />
          ))}
        </div>
      )}
    </div>
  );
}
