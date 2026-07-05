import SortearTool from "@/components/SortearTool";

export const metadata = {
  title: "Sortear · área restrita",
  robots: { index: false, follow: false },
};

export default function SortearPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-xl px-5 py-8">
        <header className="mb-6 text-center">
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-bronze">
            Área da Karol
          </p>
          <h1 className="font-display text-3xl sm:text-4xl mt-1 gold-text pb-1">
            Fazer o sorteio
          </h1>
          <p className="text-sm text-ink2 mt-1 max-w-sm mx-auto">
            Trava a lista, digita o código da sorte, revela — e publica a
            página pública com um clique.
          </p>
        </header>

        <SortearTool />
      </div>
    </div>
  );
}
