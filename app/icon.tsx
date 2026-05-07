import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#0a0a0a",
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          boxSizing: "border-box",
          border: "1px solid rgba(245,158,11,0.35)",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* G arc + crossbar */}
          <path
            d="M 41,16 A 18,18 0 1,0 50,32 L 36,32 L 36,27"
            stroke="#f59e0b"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Circuit end-dot */}
          <circle cx="41" cy="16" r="3.5" fill="#f59e0b" />
          {/* Neural nodes */}
          <circle cx="32" cy="14" r="2" fill="#f59e0b" fillOpacity="0.6" />
          <circle cx="14" cy="32" r="2" fill="#f59e0b" fillOpacity="0.6" />
          <circle cx="32" cy="50" r="2" fill="#f59e0b" fillOpacity="0.6" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
