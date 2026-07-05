import VerifyPanel from "@/components/VerifyPanel";

export const metadata = {
  title: "Conferir sorteio · Dourê Semijoias",
};

export default function VerificarPage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-10 sm:py-14">
      <header className="text-center mb-8">
        <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-bronze">
          Verificação pública
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-ink mt-2">
          Confira qualquer sorteio
        </h1>
        <p className="text-ink2 mt-3 text-sm max-w-sm mx-auto leading-relaxed">
          Cole a lista de participantes e o código da sorte que foram
          anunciados no story. O resultado que aparecer aqui tem que ser
          idêntico ao que a Dourê revelou.
        </p>
      </header>

      <VerifyPanel />
    </div>
  );
}
