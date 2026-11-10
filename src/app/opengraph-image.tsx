import { ImageResponse } from "next/og";

import { getSite } from "@/lib/content";

export const revalidate = 60;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Card text comes from Studio: Site-wide > Big title, and Search & sharing > Generated preview card.
// The first word of the title is ink, the rest are yellow.
export default async function OpenGraphImage() {
  const c = await getSite();
  const words = c.bigTitle.split(/\s+/).filter(Boolean);
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
            {c.cardTopLine}
            {c.cardTopLine && c.cardGreenWord ? " " : null}
            {c.cardGreenWord ? (
              <span style={{ color: "#00a651" }}>{c.cardGreenWord}</span>
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
          {c.cardBottomLine}
        </div>
      </div>
    ),
    size,
  );
}
