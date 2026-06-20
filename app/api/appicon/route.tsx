import { ImageResponse } from "next/og";

export const runtime = "edge";

// Generates the PWA app icon as a PNG (no binary asset needed).
export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const size = Math.min(512, Math.max(64, Number(searchParams.get("size")) || 512));
  const maskable = searchParams.get("maskable") === "1";
  const pad = maskable ? Math.round(size * 0.12) : 0; // safe zone for maskable

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #4f46e5, #0ea5e9)",
        }}
      >
        <div
          style={{
            width: size - pad * 2,
            height: size - pad * 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: size * 0.34,
            fontWeight: 800,
            letterSpacing: -2,
          }}
        >
          <div style={{ fontSize: size * 0.4 }}>Y8</div>
          <div style={{ fontSize: size * 0.13, fontWeight: 700, opacity: 0.9 }}>SCIENCE</div>
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}
