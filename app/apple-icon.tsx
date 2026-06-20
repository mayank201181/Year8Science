import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS home-screen icon.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #4f46e5, #0ea5e9)",
          color: "white",
          fontWeight: 800,
        }}
      >
        <div style={{ fontSize: 76, letterSpacing: -3 }}>Y8</div>
        <div style={{ fontSize: 22, fontWeight: 700, opacity: 0.9 }}>SCIENCE</div>
      </div>
    ),
    size,
  );
}
