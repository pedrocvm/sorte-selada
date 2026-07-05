import { ImageResponse } from "next/og";
import { getRoundByNumero } from "@/lib/rounds";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ numero: string }>;
}) {
  const { numero } = await params;
  const rodada = await getRoundByNumero(Number(numero));

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
          backgroundColor: "#FAF9F7",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontSize: 40, color: "#1F1D1A" }}>Dourê</span>
          <span style={{ fontSize: 22, color: "#876B45" }}>◆</span>
          <span style={{ fontSize: 40, color: "#6E6A63" }}>semijoias</span>
        </div>

        <div
          style={{
            fontSize: 13,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#876B45",
            marginTop: 28,
          }}
        >
          À prova de fraude · confira você mesmo
        </div>

        <div style={{ fontSize: 64, color: "#1F1D1A", marginTop: 12 }}>
          Sorte Selada
        </div>

        <div style={{ fontSize: 22, color: "#6E6A63", marginTop: 8 }}>
          {rodada ? `Rodada ${rodada.numero} · ${rodada.jogo}` : "Nova rodada"}
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
          <div style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: "#3E7A5C" }} />
          <div style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: "#3B5D8A" }} />
        </div>

        <div style={{ fontSize: 16, color: "#6E6A63", marginTop: 34 }}>
          ferramenta desenvolvida por @pedro.cenlo
        </div>
      </div>
    ),
    { ...size }
  );
}
