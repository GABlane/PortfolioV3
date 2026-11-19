/**
 * The "screen" behind the glass: a soft wallpaper of colour fields and two broad
 * light ribbons. It is fixed, so frosted panels pick up shifting colour as they
 * scroll over it — the way glass reads over a lit display.
 *
 * Cost: drawn once. Gradients only, plus a single static blur on the ribbon layer
 * (fixed + static, so it is rasterised once and composited). No animation.
 * Tints stay pale so body text keeps AA contrast anywhere on the page.
 */
export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* 1 · Base canvas */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #f6f9ff 0%, #f1f5ff 50%, #ecf2ff 100%)" }}
      />

      {/* 2 · Colour field (mesh of soft radial washes) */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(60% 55% at 0% 0%, rgba(186, 214, 255, 0.7), rgba(186, 214, 255, 0) 70%)",
            "radial-gradient(55% 50% at 100% 8%, rgba(214, 204, 255, 0.66), rgba(214, 204, 255, 0) 70%)",
            "radial-gradient(50% 45% at 8% 72%, rgba(190, 232, 255, 0.58), rgba(190, 232, 255, 0) 70%)",
            "radial-gradient(55% 50% at 96% 88%, rgba(196, 214, 255, 0.6), rgba(196, 214, 255, 0) 72%)",
            "radial-gradient(40% 35% at 55% 50%, rgba(226, 222, 255, 0.45), rgba(226, 222, 255, 0) 70%)",
          ].join(","),
        }}
      />

      {/* 3 · Light ribbons — broad blurred bands that give the glass shape to refract */}
      <svg
        className="absolute inset-0 h-full w-full blur-[42px] sm:blur-[56px]"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="ribbon-a" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#7cc9ff" stopOpacity="0.0" />
            <stop offset="0.25" stopColor="#7cc9ff" stopOpacity="0.252" />
            <stop offset="0.6" stopColor="#6f9dff" stopOpacity="0.228" />
            <stop offset="1" stopColor="#b5a4ff" stopOpacity="0.192" />
          </linearGradient>
          <linearGradient id="ribbon-b" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#c6b8ff" stopOpacity="0.192" />
            <stop offset="0.55" stopColor="#9fd8ff" stopOpacity="0.18" />
            <stop offset="1" stopColor="#9fd8ff" stopOpacity="0.0" />
          </linearGradient>
          <radialGradient id="ribbon-light" cx="0.5" cy="0" r="0.6">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Lower ribbon: sweeps up from bottom-left to the right edge */}
        <path
          d="M-120 660 C 260 470, 640 800, 1000 560 S 1400 260, 1560 300 L 1560 470 C 1360 440, 1180 700, 980 760 S 300 680, -120 860 Z"
          fill="url(#ribbon-a)"
        />
        {/* Upper ribbon: a thinner crossing band */}
        <path
          d="M-120 170 C 300 70, 700 330, 1060 230 S 1420 60, 1560 110 L 1560 200 C 1380 170, 1180 330, 1000 340 S 360 190, -120 290 Z"
          fill="url(#ribbon-b)"
        />
        {/* Key light from the top, like a lit display */}
        <rect x="0" y="0" width="1440" height="520" fill="url(#ribbon-light)" />
      </svg>

      {/* 4 · Fine grain dithers the gradients so they never band */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "160px 160px",
        }}
      />
    </div>
  );
}

const dotTones = {
  blue: "rgba(79, 140, 255, 0.55)",
  lavender: "rgba(140, 120, 240, 0.5)",
  cyan: "rgba(56, 170, 230, 0.5)",
} as const;

/**
 * A dotted halftone disc placed partly behind a glass panel. The dot field fades
 * out toward its edge, so it reads as texture rather than an object; under the
 * frosted glass the dots soften into a gentle tint.
 */
export function LightSphere({
  tone = "blue",
  className,
}: {
  tone?: keyof typeof dotTones;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full ${className ?? ""}`}
      style={{
        backgroundImage: `radial-gradient(${dotTones[tone]} 1.15px, transparent 1.6px)`,
        backgroundSize: "8px 8px",
        maskImage: "radial-gradient(closest-side, #000 35%, rgba(0,0,0,0.5) 65%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(closest-side, #000 35%, rgba(0,0,0,0.5) 65%, transparent 100%)",
      }}
    />
  );
}

type GlowProps = {
  className?: string;
  color?: string;
  size?: string;
};

/** A local glow placed behind glass panels so they have colour to refract. */
export function Glow({ className, color = "rgba(79, 140, 255, 0.28)", size = "28rem" }: GlowProps) {
  return (
    <div
      aria-hidden
      className={`orb ${className ?? ""}`}
      style={{ width: size, height: size, ["--orb-color" as string]: color }}
    />
  );
}
