import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 240,
          fontWeight: 700,
          letterSpacing: "-0.08em",
          fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        }}
      >
        JD
      </div>
    ),
    size,
  );
}
