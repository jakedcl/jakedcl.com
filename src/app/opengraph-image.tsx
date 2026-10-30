import { ImageResponse } from "next/og";

import { getHomeContent } from "@/lib/siteContent";

export const revalidate = 60;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Card text comes from Site Settings (Big title and the "Generated card" fields).
// The first word of the title is ink, the rest are yellow.
export default async function OpenGraphImage() {
  const c = await getHomeContent();
  const words = c.heroTitle.split(/\s+/).filter(Boolean);
  const wordStyle = {
    fontSize: 140,
    fontWeight: 800,
    letterSpacing: "-0.05em",
    lineHeight: 0.85,
  };
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
            {c.ogCardKicker}
            {c.ogCardKicker && c.ogCardStatus ? " " : null}
            {c.ogCardStatus ? (
              <span style={{ color: "#00a651" }}>{c.ogCardStatus}</span>
            ) : null}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {words.map((word, i) => (
            <div
              key={`${word}-${i}`}
              style={{ ...wordStyle, color: i === 0 ? "#0a0a0a" : "#f5c518" }}
            >
              {word}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 28, color: "#0a0a0a", opacity: 0.55 }}>
          {c.ogCardFooter}
        </div>
      </div>
    ),
    size,
  );
}
