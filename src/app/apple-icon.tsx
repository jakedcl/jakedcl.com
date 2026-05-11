import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#ffffff",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#000000",
          fontSize: 84,
          fontWeight: 700,
          letterSpacing: "-0.06em",
          fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        }}
      >
        JD
      </div>
    ),
    size,
  );
}
