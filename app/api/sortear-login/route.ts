import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { senha } = await req.json();

  const senhaCorreta = process.env.SORTEIO_SENHA;
  const segredoSessao = process.env.SORTEIO_SESSION_SECRET;

  if (!senhaCorreta || !segredoSessao) {
    return NextResponse.json(
      { erro: "SORTEIO_SENHA / SORTEIO_SESSION_SECRET não configurados no servidor." },
      { status: 500 }
    );
  }

  if (senha !== senhaCorreta) {
    return NextResponse.json({ erro: "Senha incorreta." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("sorteio_session", segredoSessao, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 dias
  });
  return res;
}
