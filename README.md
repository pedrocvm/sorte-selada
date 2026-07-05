# Sorteio da Sorte — Dourê Semijoias

Página pública e permanente de cada rodada do sorteio. Qualquer pessoa que
receber o link consegue ver a prova (a lista trancada, o código da sorte e
os ganhadores) e conferir o resultado sozinha, sem confiar em ninguém.

Este projeto é a **vitrine pública**. Quem grava o sorteio (a lista sendo
trancada, o código sendo digitado, a revelação) continua sendo a ferramenta
`sorteio-auditavel.html` já usada nos stories — os dois usam exatamente a
mesma matemática, então o resultado bate sempre.

## Como rodar localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:3000`.

## Como publicar no Vercel

1. Suba esta pasta para um repositório no GitHub (`git init`, `git add .`,
   `git commit -m "primeira versão"`, crie o repo no GitHub e faça `git push`).
2. Entre em [vercel.com](https://vercel.com), clique em **Add New → Project**
   e importe esse repositório.
3. Não precisa configurar nada — a Vercel detecta que é Next.js sozinha.
   Clique em **Deploy**.
4. Pronto: você recebe uma URL pública (ex. `sorteio-doure.vercel.app`).
   Pode trocar por um domínio próprio depois, se quiser.

Toda vez que você fizer `git push` com uma rodada nova, o site atualiza
sozinho — não precisa repetir o passo 2 e 3.

## Como publicar uma rodada nova

Não tem senha, não tem painel de admin — de propósito, para não ter nada
para vazar ou travar no meio de uma gravação. O fluxo é:

1. Depois de gravar o sorteio (lista trancada + código da sorte definido),
   crie um arquivo de rascunho, por exemplo `data/rascunhos/rodada-02.json`:

   ```json
   {
     "numero": 2,
     "data": "2026-07-08",
     "jogo": "Brasil × Argentina",
     "regra": "Código da sorte = soma das camisas dos 3 atacantes titulares.",
     "premios": [
       { "cor": "verde", "nome": "Colar Verde Ponto de Luz" },
       { "cor": "azul", "nome": "Colar Azul Gota" }
     ],
     "lista": "nome1\nnome2\nnome3\nnome4",
     "codigoDaSorte": "30"
   }
   ```

2. Rode:

   ```bash
   npm run lacrar -- data/rascunhos/rodada-02.json
   ```

   Isso trava a lista, calcula a impressão digital (o selo) e sorteia os
   ganhadores — com o mesmo algoritmo usado na ferramenta de gravação e no
   verificador público. O resultado sai em
   `data/rounds/rodada-02.json`, pronto.

3. `git add .`, `git commit -m "rodada 2"`, `git push`. A página
   `/rodada/2` aparece sozinha, e a rodada entra na lista da home.

**Nunca edite um arquivo de `data/rounds/` depois de publicado.** Se algo
saiu errado, gere a rodada de novo com um número novo — editar um arquivo já
publicado quebra a confiança de quem já conferiu.

## Estrutura do projeto

```
app/
  page.tsx                     → landing (hero + lista de rodadas)
  rodada/[numero]/page.tsx     → página pública de cada rodada
  rodada/[numero]/opengraph-image.tsx → imagem de compartilhamento automática
  verificar/page.tsx           → verificador solto, sem depender de rodada
components/
  Gem3D.tsx                    → joia 3D no topo (com fallback estático)
  SealCard.tsx                 → cartão da "impressão digital da lista"
  WinnerCard.tsx                → cartão de cada ganhador
  VerifyPanel.tsx              → o verificador (recalcula tudo no navegador)
  RoundReveal.tsx              → orquestra a animação da revelação
lib/
  draw.ts                      → a matemática do sorteio, em TypeScript, usada no navegador
  rounds.ts                    → lê os arquivos de data/rounds
data/rounds/                  → uma rodada = um arquivo JSON
scripts/lacrar.mjs             → gera uma rodada nova (mesma matemática, em Node)
```

## Identidade visual

Paleta e tipografia vêm da identidade real da Dourê (creme, bronze-dourado,
serifada de alto contraste + sans humanista). Verde e azul aparecem **só**
como cor dos dois prêmios (tema Seleção) — nunca como cor de base da
interface, para não competir com o dourado da marca.

A logo real ainda não está no projeto — veja `public/LOGO-AQUI.txt` para
trocar a marca-texto atual pelo arquivo de verdade quando ele estiver em mãos.

## Assinatura do desenvolvedor

Aparece no rodapé de toda página pública e na imagem de compartilhamento.
Para trocar o link/usuário, edite `components/Footer.tsx` e
`app/rodada/[numero]/opengraph-image.tsx`.
# sorte-selada
