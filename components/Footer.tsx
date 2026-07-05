export default function Footer() {
  return (
    <footer className="border-t border-line shrink-0">
      <div className="mx-auto max-w-3xl px-5 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
        <p className="text-[11px] text-ink2">
          Sorte Selada · Dourê Semijoias — um sorteio por jogo do Brasil na Copa.
        </p>
        <p className="text-[11px] font-mono text-ink2">
          por{" "}
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
