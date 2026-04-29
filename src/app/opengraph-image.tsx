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
          padding: "64px 72px",
          background: "#ffffff",
          color: "#000000",
          fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        }}
      >
        <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: "-0.06em" }}>JD</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 60, fontWeight: 700, letterSpacing: "-0.03em" }}>Jake DCL</div>
          <div style={{ fontSize: 34, color: "#333333" }}>
            Web Developer Portfolio - Next.js, TypeScript, Sanity
          </div>
          <div style={{ fontSize: 28, color: "#555555" }}>jakedcl.com</div>
        </div>
      </div>
    ),
    size,
  );
}
