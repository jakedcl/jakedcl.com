import { ImageResponse } from "next/og";

import { getSite } from "@/lib/content";
import { faviconSourceUrl } from "@/lib/favicon";

export const revalidate = 60;

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default async function AppleIcon() {
  // Image comes from Studio > Search & sharing > Browser tab icon.
  const { faviconUrl } = await getSite();
  if (!faviconUrl) return new Response(null, { status: 404 });

  const pad = Math.round(size.width * 0.08);
  const inner = size.width - pad * 2;

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
        }}
      >
        <img
          src={faviconSourceUrl(faviconUrl)}
          width={inner}
          height={inner}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    size,
  );
}
