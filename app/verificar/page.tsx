import VerifyPanel from "@/components/VerifyPanel";

export const metadata = {
  title: "Conferir sorteio · Dourê Semijoias",
};

export default function VerificarPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-xl px-5 py-8">
        <header className="text-center mb-6">
          <p className="text-sm font-mono uppercase tracking-[0.24em] text-bronze">
            Verificação pública
          </p>
          <h1 className="font-display text-4xl lg:text-5xl mt-1 gold-text pb-1">
            Confira qualquer sorteio
          </h1>
          <p className="text-ink2 mt-2 text-base max-w-md mx-auto leading-relaxed">
            O resultado que aparecer aqui tem que ser idêntico ao que a Dourê
            revelou no story.
          </p>
        </header>

        <VerifyPanel />
      </div>
    </div>
  );
}
