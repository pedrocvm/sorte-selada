/** Wordmark da Dourê recriado em código (sem fundo): "Dourê" serifado,
 *  diamante losango, "semijoias" espaçado — tudo em ouro da marca. */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col items-center leading-none text-bronze ${className}`}>
      <span className="font-display font-semibold tracking-tight text-[1.9em]">Dourê</span>
      <svg
        viewBox="0 0 10 10"
        aria-hidden="true"
        className="fill-current my-[0.28em] w-[0.42em] h-[0.42em]"
      >
        <path d="M5 0 L10 5 L5 10 L0 5 Z" />
      </svg>
      <span className="font-display tracking-[0.42em] text-[0.62em] pl-[0.42em] opacity-80">
        semijoias
      </span>
    </span>
  );
}
