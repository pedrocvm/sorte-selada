import Link from "next/link";
import Logo from "@/components/Logo";

export default function Nav() {
  return (
    <header className="border-b border-line bg-cream/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto max-w-3xl px-5 h-14 flex items-center justify-between">
        <Link href="/" aria-label="Dourê Semijoias" className="flex items-center">
          <Logo className="text-[15px]" />
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/verificar"
            className="text-sm font-medium text-bronze hover:text-bronze-dark transition-colors"
          >
            Conferir um sorteio →
          </Link>
          <Link
            href="/sortear"
            aria-label="Área da Dourê"
            title="Área da Dourê"
            className="grid place-items-center w-12 h-12 rounded-full border border-line text-bronze hover:text-bronze-dark hover:border-bronze/40 hover:bg-bronze-chip/40 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
