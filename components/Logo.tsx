import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
  /** Show the "G" circuit mark only, without background */
  markOnly?: boolean;
}

/**
 * Glafix brand logo — stylised "G" letterform with AI circuit-node accents.
 * Uses a 64×64 viewBox so it scales cleanly at any rendered size.
 *
 * Design language: premium dark luxury + AI SaaS circuit-board aesthetic.
 * - Arc path = the G letterform
 * - Gold dot at the arc opening = circuit end-point
 * - Three small nodes along the arc = neural network connections
 */
export function Logo({ size = 32, className, markOnly = false }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-label="Glafix logo"
    >
      {/* ── Background ──────────────────────────────────────────── */}
      {!markOnly && (
        <>
          <rect width="64" height="64" rx="14" fill="#0a0a0a" />
          {/* Subtle gold border */}
          <rect
            x="1.5"
            y="1.5"
            width="61"
            height="61"
            rx="12.5"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeOpacity="0.35"
            fill="none"
          />
        </>
      )}

      {/* ── G letterform arc ────────────────────────────────────── */}
      {/*
        Path breakdown:
          M 41,16          → start at ~2 o'clock (arc opening, upper-right)
          A 18,18 0 1,0 50,32  → large counterclockwise arc to 3 o'clock
                               (traces through 12→9→6→3, forming the C of G)
          L 36,32          → horizontal crossbar inward
          L 36,27          → short upward stroke (G crossbar foot)
      */}
      <path
        d="M 41,16 A 18,18 0 1,0 50,32 L 36,32 L 36,27"
        stroke="#f59e0b"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* ── Circuit end-dot at arc opening ──────────────────────── */}
      <circle cx="41" cy="16" r="3.5" fill="#f59e0b" />

      {/* ── Neural node dots along the arc (AI circuit feel) ─────── */}
      {/* 12 o'clock */}
      <circle cx="32" cy="14" r="2" fill="#f59e0b" fillOpacity="0.55" />
      {/* 9 o'clock */}
      <circle cx="14" cy="32" r="2" fill="#f59e0b" fillOpacity="0.55" />
      {/* 6 o'clock */}
      <circle cx="32" cy="50" r="2" fill="#f59e0b" fillOpacity="0.55" />
    </svg>
  );
}
