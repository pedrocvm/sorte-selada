export default function Footer() {
  return (
    <footer className="border-t border-line mt-20">
      <div className="mx-auto max-w-3xl px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <p className="text-xs text-ink2">
          Sorte Selada · Dourê Semijoias — um sorteio por jogo, enquanto o
          Brasil estiver na Copa.
        </p>
        <p className="text-xs font-mono text-ink2">
          Ferramenta desenvolvida por{" "}
          <a
            href="https://instagram.com/pedro.cenlo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-bronze hover:text-bronze-dark underline underline-offset-2"
          >
            @pedro.cenlo
          </a>
        </p>
      </div>
    </footer>
  );
}
