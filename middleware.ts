import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protege a área de sorteio (/sortear). É uma trava simples, não um sistema
// de login completo — o suficiente para manter visitantes casuais fora,
// já que só o Pedro/a Karol precisam entrar aqui. O cookie é httpOnly,
// então só o servidor consegue criá-lo (via /api/sortear-login) — o
// visitante não pode simplesmente criar o cookie no navegador.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = pathname.startsWith("/sortear") && pathname !== "/sortear/login";
  if (!isProtected) return NextResponse.next();

  const cookie = req.cookies.get("sorteio_session")?.value;
  const esperado = process.env.SORTEIO_SESSION_SECRET;

  if (!esperado || cookie !== esperado) {
    const url = req.nextUrl.clone();
    url.pathname = "/sortear/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sortear", "/sortear/:path*"],
};
