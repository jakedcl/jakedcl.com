import { ImageResponse } from "next/og";

import { getSite } from "@/lib/content";

export const revalidate = 60;

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default async function AppleIcon() {
  // Letters come from Studio > Search & sharing > Phone icon letters.
  const { appIconLetters } = await getSite();
  return new ImageResponse(
    (
      <div
        style={{
          background: "#f6f3ec",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#0a0a0a",
          fontSize: 84,
          fontWeight: 800,
          letterSpacing: "-0.06em",
          fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        }}
      >
        {appIconLetters}
      </div>
    ),
    size,
  );
}
