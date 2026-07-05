/** Diamante 3D real em CSS (octaedro de 8 faces com preserve-3d).
 *  Gira sozinho, respeita prefers-reduced-motion, sem WebGL. */

// ponytail: geometria fixa de octaedro regular. base S=140 → apótema S/2, altura de face S·√3/2.
const S = 140;
const APO = S / 2; // 70
const SLANT = Math.round((S * Math.sqrt(3)) / 2); // 121
const TILT = 35.26; // 90° − diedro(54.74°): dobra a face vertical até o octaedro fechar

const faces: { up: boolean; grad: string; transform: string }[] = [];
for (let k = 0; k < 4; k++) {
  const spin = k * 90;
  // topo: triângulo apontando pra cima, pivô na base
  faces.push({
    up: true,
    grad: `linear-gradient(${135 - k * 25}deg, #E4CB92 0%, #B0905B 45%, #7C6340 100%)`,
    transform: `rotateY(${spin}deg) translateZ(${APO}px) rotateX(-${TILT}deg)`,
  });
  // fundo: triângulo apontando pra baixo, pivô no topo
  faces.push({
    up: false,
    grad: `linear-gradient(${-45 + k * 25}deg, #8A6E45 0%, #5F4C31 55%, #3E301E 100%)`,
    transform: `rotateY(${spin}deg) translateZ(${APO}px) rotateX(${TILT}deg)`,
  });
}

export default function Gem3D() {
  return (
    <div
      className="flex items-center justify-center h-64 sm:h-72"
      style={{ perspective: 800 }}
    >
      <div
        className="relative motion-safe:animate-spinGem"
        style={{
          width: S,
          height: S,
          transformStyle: "preserve-3d",
          transform: "rotateX(-14deg) rotateY(-24deg)",
          filter: "drop-shadow(0 14px 16px rgba(31,29,26,0.28))",
        }}
      >
        {faces.map((f, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: `calc(50% - ${APO}px)`,
              top: f.up ? `calc(50% - ${SLANT}px)` : "50%",
              width: S,
              height: SLANT,
              background: f.grad,
              clipPath: f.up
                ? "polygon(50% 0, 100% 100%, 0 100%)"
                : "polygon(50% 100%, 0 0, 100% 0)",
              transformOrigin: f.up ? "50% 100%" : "50% 0",
              transform: f.transform,
              backfaceVisibility: "hidden",
            }}
            aria-hidden
          />
        ))}
      </div>
    </div>
  );
}
