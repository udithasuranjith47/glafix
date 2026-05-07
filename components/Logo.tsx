import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
  /** Show the wordmark text only (no black background) — for inline navbar use */
  textOnly?: boolean;
}

export function Logo({ size = 40, className, textOnly = false }: LogoProps) {
  if (textOnly) {
    // Horizontal wordmark — no background, gold text, for light-on-dark navbars
    return (
      <svg
        width={size * 2.8}
        height={size}
        viewBox="0 0 140 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        aria-label="Glafix"
      >
        <defs>
          <path id="glafix-arc-inline" d="M 4 34 Q 70 14 136 34" />
        </defs>
        <text
          fontFamily="Impact, 'Arial Black', 'Helvetica Neue', sans-serif"
          fontWeight="900"
          fontSize="30"
          fill="#FFD93D"
          letterSpacing="1.5"
        >
          <textPath href="#glafix-arc-inline" startOffset="50%" textAnchor="middle">
            GLAFIX
          </textPath>
        </text>
      </svg>
    );
  }

  // Square badge version — black background + arced gold GLAFIX wordmark
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-label="Glafix"
    >
      {/* Black background */}
      <rect width="200" height="200" rx="28" fill="#000000" />

      {/* Subtle inner border — matches the image's slight border feel */}
      <rect
        x="4" y="4" width="192" height="192"
        rx="24"
        stroke="#FFD93D"
        strokeWidth="1.5"
        strokeOpacity="0.15"
        fill="none"
      />

      <defs>
        {/* Gentle upward arc: edges at y=125, centre lifted to y=82 */}
        <path id="glafix-arc" d="M 12 125 Q 100 82 188 125" />
      </defs>

      {/* GLAFIX wordmark on the arc */}
      <text
        fontFamily="Impact, 'Arial Black', 'Helvetica Neue', sans-serif"
        fontWeight="900"
        fontSize="54"
        fill="#FFD93D"
        letterSpacing="2"
      >
        <textPath href="#glafix-arc" startOffset="50%" textAnchor="middle">
          GLAFIX
        </textPath>
      </text>
    </svg>
  );
}
