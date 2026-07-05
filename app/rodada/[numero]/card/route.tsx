import { ImageResponse } from "next/og";
import { getRoundByNumero } from "@/lib/rounds";

// Card 9:16 pronto pro story — evita print de tela. Mesma identidade do OG.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ numero: string }> }
) {
  const { numero } = await params;
  const rodada = await getRoundByNumero(Number(numero));
  if (!rodada) return new Response("Rodada não encontrada", { status: 404 });

  const verde = rodada.premios.find((p) => p.cor === "verde");
  const azul = rodada.premios.find((p) => p.cor === "azul");
  const site = (process.env.SITE_URL ?? "").replace(/^https?:\/\//, "").replace(/\/$/, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1F1D1A",
          color: "#FAF9F7",
          fontFamily: "serif",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 52 }}>Dourê</span>
          <div style={{ width: 16, height: 16, backgroundColor: "#C6A566", transform: "rotate(45deg)" }} />
          <span style={{ fontSize: 52, color: "#B8B2A6" }}>semijoias</span>
        </div>

        <div
          style={{
            fontSize: 26,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "#C6A566",
            marginTop: 60,
          }}
        >
          {`Sorte Selada · Rodada ${String(rodada.numero).padStart(2, "0")}`}
        </div>

        <div style={{ fontSize: 72, marginTop: 20, textAlign: "center" }}>{rodada.jogo}</div>

        <div style={{ fontSize: 34, color: "#B8B2A6", marginTop: 36, display: "flex", gap: 16 }}>
          <span>código da sorte</span>
          <span style={{ color: "#EFDCA8" }}>{rodada.codigoDaSorte}</span>
        </div>

        {[
          { cor: "#5FA07D", premio: verde, ganhador: rodada.ganhadores[0] },
          { cor: "#6B8FC4", premio: azul, ganhador: rodada.ganhadores[1] },
        ].map(
          ({ cor, premio, ganhador }, i) =>
            premio &&
            ganhador && (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: i === 0 ? 80 : 44,
                  padding: "36px 60px",
                  borderRadius: 32,
                  border: `2px solid ${cor}`,
                  backgroundColor: "rgba(250,249,247,0.05)",
                }}
              >
                <span style={{ fontSize: 28, letterSpacing: 6, textTransform: "uppercase", color: cor }}>
                  {premio.nome}
                </span>
                <span style={{ fontSize: 88, marginTop: 10 }}>{`@${ganhador}`}</span>
              </div>
            )
        )}

        <div style={{ fontSize: 28, color: "#B8B2A6", marginTop: 90 }}>
          confira você mesmo · lista trancada em público
        </div>
        {site && (
          <div style={{ fontSize: 26, color: "#C6A566", marginTop: 12 }}>
            {`${site}/rodada/${rodada.numero}`}
          </div>
        )}
      </div>
    ),
    { width: 1080, height: 1920 }
  );
}
