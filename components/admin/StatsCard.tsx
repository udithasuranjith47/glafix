import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  accent?: boolean;
}

export function StatsCard({ label, value, icon: Icon, accent }: StatsCardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-xl border p-6 flex items-center gap-4",
        accent ? "border-primary/30 bg-primary/5" : "border-border"
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          accent ? "bg-primary/15" : "bg-secondary"
        )}
      >
        <Icon className={cn("w-5 h-5", accent ? "text-primary" : "text-muted-foreground")} />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}
