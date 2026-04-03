"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaPct?: string;
  positive?: boolean;
  sparklineData?: number[];
  className?: string;
  large?: boolean;
}

export function KpiCard({
  label,
  value,
  delta,
  deltaPct,
  positive,
  sparklineData,
  className,
  large = false,
}: KpiCardProps) {
  const hasChange = delta !== undefined && delta !== "";
  const isPositive = positive === true;
  const isNegative = positive === false;
  const isNeutral = positive === undefined;

  const deltaColor = isPositive
    ? "text-green-500"
    : isNegative
    ? "text-red-400"
    : "text-amber-400";

  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  const sparkColor = isPositive ? "#22c55e" : isNegative ? "#ef4444" : "#f59e0b";

  const chartData = sparklineData?.map((v, i) => ({ i, v }));

  return (
    <div
      className={cn(
        "bg-card border border-card-border rounded-md p-3 flex flex-col gap-1 min-w-0",
        className
      )}
      data-testid={`kpi-card-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider leading-tight">
          {label}
        </span>
        {sparklineData && sparklineData.length > 0 && (
          <div className="w-16 h-6 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={sparkColor}
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className={cn("font-bold tabular-nums terminal-value leading-none", large ? "text-xl" : "text-sm")}>
        {value}
      </div>

      {hasChange && (
        <div className={cn("flex items-center gap-1", deltaColor)}>
          {!isNeutral && (
            <TrendIcon className="w-3 h-3 flex-shrink-0" />
          )}
          <span className="text-[10px] font-medium tabular-nums terminal-value">
            {delta}
            {deltaPct && ` (${deltaPct})`}
          </span>
        </div>
      )}
    </div>
  );
}

// Compact stat display for dense panels
interface StatRowProps {
  label: string;
  value: string;
  valueColor?: "positive" | "negative" | "neutral" | "primary" | "default";
}

export function StatRow({ label, value, valueColor = "default" }: StatRowProps) {
  const colorClass = {
    positive: "text-green-500",
    negative: "text-red-400",
    neutral: "text-amber-400",
    primary: "text-primary",
    default: "text-foreground",
  }[valueColor];

  return (
    <div className="flex items-center justify-between py-1 border-b border-border/40 last:border-0">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className={cn("text-[11px] font-medium tabular-nums terminal-value", colorClass)}>{value}</span>
    </div>
  );
}
