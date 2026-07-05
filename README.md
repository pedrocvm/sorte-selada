# Sorte Selada — Dourê Semijoias

Página pública e permanente de cada rodada do sorteio, **e** a ferramenta de
sorteio, no mesmo projeto. Qualquer pessoa que receber o link consegue ver a
prova (a lista trancada, o código da sorte e os ganhadores) e conferir o
resultado sozinha, sem confiar em ninguém.

A parte pública é a **vitrine** (`/`, `/rodada/[numero]`, `/verificar`). A
área restrita `/sortear` (protegida por senha) é onde você faz o sorteio:
trava a lista, digita o código da sorte, revela os ganhadores e sai com o
arquivo pronto pra publicar. A antiga ferramenta `sorteio-auditavel.html`
segue valendo como backup fora do navegador — os três caminhos usam a mesma
matemática de `lib/draw.ts`, então o resultado bate sempre.

## Como rodar localmente

```bash
npm install
cp .env.local.example .env.local   # e edite a senha/segredo
npm run dev
```

Abre em `http://localhost:3000`.

## Configurar a senha (variáveis de ambiente)

Local: copie `.env.local.example` para `.env.local`. No Vercel: **Project
Settings → Environment Variables**. As três variáveis:

- `SITE_URL` — a URL final do site, ex. `https://sorte-selada.vercel.app`
  (usada para montar os links de compartilhamento / Open Graph).
- `SORTEIO_SENHA` — a senha que você digita para entrar em `/sortear`.
- `SORTEIO_SESSION_SECRET` — qualquer texto aleatório longo (é o valor do
  cookie de sessão).

Sem `SORTEIO_SENHA` e `SORTEIO_SESSION_SECRET` configuradas, `/sortear` fica
inacessível — de propósito, por segurança nunca libera sem elas.

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

## Como fazer e publicar uma rodada — pelo site

O caminho normal, direto do navegador:

1. Acesse `SUA-URL.vercel.app/sortear` e faça login com a `SORTEIO_SENHA`.
2. Preencha os dados da rodada (número, data, jogo, regra, nomes dos
   prêmios), cole a lista de participantes e clique em **Trancar a lista**.
   *(É esse o momento que a Karol grava e posta no story — a impressão
   digital aparece na tela.)*
3. Depois que o código da sorte for anunciado (ex. a soma das camisas do
   ataque), digite-o e clique em **Revelar os ganhadores**.
4. A tela mostra o JSON pronto da rodada. Clique em **Copiar JSON da rodada**.
5. Salve o conteúdo em `data/rounds/rodada-XX.json` (mesmo número do passo 2).
6. `git add .`, `git commit -m "rodada X"`, `git push`. A página
   `/rodada/X` aparece sozinha, e a rodada entra na lista da home.

### Alternativa: gerar a rodada pelo terminal

Se preferir não depender do navegador, `scripts/lacrar.mjs` faz a mesma
coisa que os passos 2–4, com o mesmo algoritmo. A partir de um rascunho
`data/rascunhos/rodada-02.json`:

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

```bash
npm run lacrar -- data/rascunhos/rodada-02.json
```

O resultado sai em `data/rounds/rodada-02.json`, pronto pra commitar.

**Nunca edite um arquivo de `data/rounds/` depois de publicado.** Se algo
saiu errado, gere a rodada de novo com um número novo — editar um arquivo já
publicado quebra a confiança de quem já conferiu.

## Estrutura do projeto

```
middleware.ts                  → protege /sortear com o cookie de sessão
app/
  page.tsx                     → landing (hero + lista de rodadas)
  rodada/[numero]/page.tsx     → página pública de cada rodada
  rodada/[numero]/opengraph-image.tsx → imagem de compartilhamento automática
  verificar/page.tsx           → verificador solto, sem depender de rodada
  sortear/page.tsx             → ferramenta de sorteio (área restrita)
  sortear/login/page.tsx       → tela de senha
  api/sortear-login/route.ts   → checa a senha, cria o cookie de sessão
components/
  SortearTool.tsx              → a ferramenta de sorteio em si
  Gem3D.tsx                    → joia 3D no topo (com fallback estático)
  SealCard.tsx                 → cartão da "impressão digital da lista"
  WinnerCard.tsx                → cartão de cada ganhador
  VerifyPanel.tsx              → o verificador (recalcula tudo no navegador)
  RoundReveal.tsx              → orquestra a animação da revelação
lib/
  draw.ts                      → a matemática do sorteio, usada em /sortear e /verificar
  rounds.ts                    → lê os arquivos de data/rounds
data/rounds/                  → uma rodada = um arquivo JSON
scripts/lacrar.mjs             → gera uma rodada pelo terminal (caminho alternativo)
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
