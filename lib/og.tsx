import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

type OgOptions = {
  eyebrow: string;
  title: string;
  subtitle: string;
  accent?: string;
};

/** Shared Open Graph artwork: a light-glass card over soft light sources. */
export function renderOg({ eyebrow, title, subtitle, accent = "#4F8CFF" }: OgOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(180deg, #F8FAFF 0%, #EEF4FF 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            left: -120,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background: "radial-gradient(closest-side, rgba(220,234,255,1), rgba(220,234,255,0))",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 90,
            width: 260,
            height: 260,
            borderRadius: 9999,
            background: "radial-gradient(circle at 32% 28%, #ffffff 0%, #bfe6ff 20%, #6ec8ff 50%, #4f8cff 85%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 120,
            width: 170,
            height: 170,
            borderRadius: 9999,
            background: "radial-gradient(circle at 35% 30%, #ffffff 0%, #e4defe 30%, #b9acff 80%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            margin: 64,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 56,
            borderRadius: 40,
            background: "rgba(255,255,255,0.62)",
            border: "1.5px solid rgba(255,255,255,0.95)",
            boxShadow: "0 30px 80px -30px rgba(37,99,235,0.35)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, letterSpacing: 4, color: "#64748B" }}>
            <div style={{ width: 14, height: 14, borderRadius: 9999, background: accent }} />
            {eyebrow.toUpperCase()}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ fontSize: 66, fontWeight: 700, letterSpacing: -2.5, lineHeight: 1.04, color: "#0F172A", maxWidth: 900 }}>
              {title}
            </div>
            <div style={{ fontSize: 28, color: "#475569", maxWidth: 900, lineHeight: 1.35 }}>{subtitle}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#475569" }}>
            <span>John Gabrielle Ofiangga</span>
            <span>Full-Stack Software Developer</span>
          </div>
        </div>
      </div>
    ),
    ogSize,
  );
}
