import Link from "next/link";
import Logo from "@/components/Logo";

export default function Nav() {
  return (
    <header className="border-b border-line bg-cream/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto max-w-3xl px-5 h-20 flex items-center justify-between">
        <Link href="/" aria-label="Dourê Semijoias" className="flex items-center">
          <Logo className="text-[15px]" />
        </Link>
        <Link
          href="/verificar"
          className="text-sm font-medium text-bronze hover:text-bronze-dark transition-colors"
        >
          Conferir um sorteio →
        </Link>
      </div>
    </header>
  );
}
