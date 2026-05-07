import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 36, className }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/glafix-logo.png"
      alt="Glafix"
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
    />
  );
}
