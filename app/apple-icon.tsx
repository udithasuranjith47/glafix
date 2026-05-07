import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#0a0a0a",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          border: "2px solid rgba(245,158,11,0.4)",
        }}
      >
        <svg
          width="180"
          height="180"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* G arc + crossbar */}
          <path
            d="M 41,16 A 18,18 0 1,0 50,32 L 36,32 L 36,27"
            stroke="#f59e0b"
            strokeWidth="5"
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
