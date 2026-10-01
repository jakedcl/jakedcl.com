import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background: "#f6f3ec",
          color: "#0a0a0a",
          fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: "0.16em",
            textTransform: "uppercase" as const,
            color: "#0a0a0a",
            opacity: 0.55,
          }}
        >
          <span>
            NYC · WEB · SYSTEMS ·{" "}
            <span style={{ color: "#00a651" }}>AVAILABLE</span>
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              fontSize: 140,
              fontWeight: 800,
              letterSpacing: "-0.05em",
              lineHeight: 0.85,
              color: "#0a0a0a",
            }}
          >
            JAKE
          </div>
          <div
            style={{
              fontSize: 140,
              fontWeight: 800,
              letterSpacing: "-0.05em",
              lineHeight: 0.85,
              color: "#f5c518",
            }}
          >
            DCL
          </div>
        </div>
        <div style={{ fontSize: 28, color: "#0a0a0a", opacity: 0.55 }}>
          jakedcl.com — web developer · IT systems
        </div>
      </div>
    ),
    size,
  );
}
