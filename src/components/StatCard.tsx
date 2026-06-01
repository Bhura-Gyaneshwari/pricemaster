import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down";
  icon: LucideIcon;
  accent?: "primary" | "accent" | "success" | "warning";
}

const accentMap = {
  primary: "from-primary/20 to-primary/0 text-primary",
  accent: "from-accent/20 to-accent/0 text-accent",
  success: "from-success/20 to-success/0 text-success",
  warning: "from-warning/20 to-warning/0 text-warning",
};

export function StatCard({
  label,
  value,
  delta,
  trend = "up",
  icon: Icon,
  accent = "primary",
}: StatCardProps) {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-card p-5 shadow-soft transition-all hover:border-primary/40 hover:shadow-elevated">
      <div
        className={cn(
          "absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br opacity-60 blur-2xl transition-opacity group-hover:opacity-100",
          accentMap[accent],
        )}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
          {delta && (
            <div
              className={cn(
                "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                trend === "up"
                  ? "bg-success/15 text-success"
                  : "bg-destructive/15 text-destructive",
              )}
            >
              <TrendIcon className="h-3 w-3" />
              {delta}
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card-elevated",
            accentMap[accent].split(" ").pop(),
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
