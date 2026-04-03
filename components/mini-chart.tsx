"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, ReferenceLine } from "recharts";
import { cn } from "@/lib/utils";

interface MiniLineChartProps {
  data: { date?: string; value: number; [key: string]: any }[];
  dataKey?: string;
  color?: string;
  height?: number;
  showGrid?: boolean;
  showXAxis?: boolean;
  showTooltip?: boolean;
  title?: string;
  className?: string;
}

export function MiniLineChart({
  data,
  dataKey = "value",
  color = "#00d4aa",
  height = 120,
  showGrid = true,
  showXAxis = true,
  showTooltip = true,
  title,
  className,
}: MiniLineChartProps) {
  const vals = data.map((d) => d[dataKey] as number);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const padding = (max - min) * 0.1;

  return (
    <div className={cn("flex flex-col", className)}>
      {title && <span className="section-label mb-1">{title}</span>}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            {showGrid && (
              <CartesianGrid
                strokeDasharray="2 4"
                stroke="hsl(240 22% 14%)"
                vertical={false}
              />
            )}
            {showXAxis && (
              <XAxis
                dataKey="date"
                tick={{ fontSize: 9, fill: "hsl(0 0% 40%)" }}
                tickLine={false}
                axisLine={{ stroke: "hsl(240 22% 14%)" }}
                interval="preserveStartEnd"
              />
            )}
            <YAxis
              domain={[min - padding, max + padding]}
              tick={{ fontSize: 9, fill: "hsl(0 0% 40%)" }}
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(v: number) => {
                if (Math.abs(v) >= 1000) return v.toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 1 } as any);
                if (Math.abs(v) >= 10) return v.toFixed(1);
                return v.toFixed(2);
              }}
            />
            {showTooltip && (
              <Tooltip
                contentStyle={{
                  background: "hsl(240 22% 8%)",
                  border: "1px solid hsl(240 22% 14%)",
                  borderRadius: "4px",
                  fontSize: "11px",
                  color: "hsl(0 0% 88%)",
                }}
                formatter={(v: any) => [typeof v === 'number' ? v.toFixed(2) : v, dataKey]}
                labelStyle={{ color: "hsl(0 0% 53%)", fontSize: "10px" }}
              />
            )}
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface GexBarChartProps {
  data: { strike: number; callGex: number; putGex: number }[];
  currentPrice?: number;
  height?: number;
  className?: string;
}

export function GexBarChart({ data, currentPrice, height = 180, className }: GexBarChartProps) {
  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="hsl(240 22% 14%)" vertical={false} />
          <XAxis
            dataKey="strike"
            tick={{ fontSize: 9, fill: "hsl(0 0% 40%)" }}
            tickLine={false}
            axisLine={{ stroke: "hsl(240 22% 14%)" }}
          />
          <YAxis
            tick={{ fontSize: 9, fill: "hsl(0 0% 40%)" }}
            tickLine={false}
            axisLine={false}
            width={36}
            tickFormatter={(v: number) => Math.abs(v) < 1 ? v.toFixed(2) : v.toFixed(1)}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(240 22% 8%)",
              border: "1px solid hsl(240 22% 14%)",
              borderRadius: "4px",
              fontSize: "11px",
              color: "hsl(0 0% 88%)",
            }}
            formatter={(v: any, name: any) => [`${typeof v === 'number' ? v.toFixed(2) : v}B`, name === "callGex" ? "Call GEX" : "Put GEX"]}
          />
          <ReferenceLine y={0} stroke="hsl(240 22% 20%)" />
          {currentPrice && (
            <ReferenceLine
              x={Math.round(currentPrice / 20) * 20}
              stroke="#f59e0b"
              strokeDasharray="3 3"
              strokeWidth={1.5}
              label={{ value: "NOW", position: "insideTopRight", fill: "#f59e0b", fontSize: 8 }}
            />
          )}
          <Bar dataKey="callGex" fill="#22c55e" opacity={0.8} radius={[2, 2, 0, 0]} />
          <Bar dataKey="putGex" fill="#ef4444" opacity={0.8} radius={[0, 0, 2, 2]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface FedWatchBarChartProps {
  data: { meeting: string; hold: number; cut25: number; cut50: number }[];
  height?: number;
  className?: string;
}

export function FedWatchChart({ data, height = 140, className }: FedWatchBarChartProps) {
  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="hsl(240 22% 14%)" vertical={false} />
          <XAxis
            dataKey="meeting"
            tick={{ fontSize: 9, fill: "hsl(0 0% 40%)" }}
            tickLine={false}
            axisLine={{ stroke: "hsl(240 22% 14%)" }}
          />
          <YAxis
            tick={{ fontSize: 9, fill: "hsl(0 0% 40%)" }}
            tickLine={false}
            axisLine={false}
            width={28}
            tickFormatter={(v) => `${v}%`}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(240 22% 8%)",
              border: "1px solid hsl(240 22% 14%)",
              borderRadius: "4px",
              fontSize: "11px",
              color: "hsl(0 0% 88%)",
            }}
            formatter={(v: any, name: any) => {
              const labels: Record<string, string> = { hold: "Hold", cut25: "-25bps", cut50: "-50bps" };
              return [`${v}%`, labels[name] || name];
            }}
          />
          <Bar dataKey="hold" stackId="a" fill="hsl(0 0% 30%)" radius={[0, 0, 0, 0]} />
          <Bar dataKey="cut25" stackId="a" fill="#00d4aa" opacity={0.7} />
          <Bar dataKey="cut50" stackId="a" fill="#22c55e" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// VIX Semicircle Gauge
interface VixGaugeProps {
  value: number;
  className?: string;
}

export function VixGauge({ value, className }: VixGaugeProps) {
  const clampedValue = Math.min(Math.max(value, 0), 50);
  const percentage = clampedValue / 50;

  const getZoneColor = (v: number) => {
    if (v < 15) return "#22c55e";
    if (v < 20) return "#f59e0b";
    if (v < 30) return "#f97316";
    return "#ef4444";
  };

  const color = getZoneColor(clampedValue);
  const cx = 80, cy = 80, r = 60;

  // Convert angle to radians for needle
  const needleAngle = (percentage * 180) * (Math.PI / 180);
  const nx = cx - r * 0.8 * Math.cos(needleAngle);
  const ny = cy - r * 0.8 * Math.sin(needleAngle);

  // Zone arcs (semicircle): green 0-15, amber 15-20, orange 20-30, red 30-50
  const arcPath = (startPct: number, endPct: number, radius: number, strokeColor: string) => {
    const startAngle = startPct * Math.PI;
    const endAngle = endPct * Math.PI;
    const x1 = cx - radius * Math.cos(startAngle);
    const y1 = cy - radius * Math.sin(startAngle);
    const x2 = cx - radius * Math.cos(endAngle);
    const y2 = cy - radius * Math.sin(endAngle);
    const largeArc = endPct - startPct > 0.5 ? 1 : 0;
    return (
      <path
        d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`}
        fill="none"
        stroke={strokeColor}
        strokeWidth={10}
        strokeLinecap="round"
        opacity={0.7}
      />
    );
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <svg viewBox="0 0 160 100" className="w-full max-w-[180px]">
        {/* Background arc */}
        {arcPath(0, 1, r, "hsl(240 22% 14%)")}
        {/* Zone arcs */}
        {arcPath(0, 15 / 50, r, "#22c55e")}
        {arcPath(15 / 50, 20 / 50, r, "#f59e0b")}
        {arcPath(20 / 50, 30 / 50, r, "#f97316")}
        {arcPath(30 / 50, 1, r, "#ef4444")}
        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={4} fill={color} />
        {/* Labels */}
        <text x={12} y={92} fontSize="8" fill="#22c55e" textAnchor="middle">0</text>
        <text x={55} y={22} fontSize="8" fill="#f59e0b" textAnchor="middle">15</text>
        <text x={80} y={14} fontSize="8" fill="#f97316" textAnchor="middle">20</text>
        <text x={108} y={22} fontSize="8" fill="#ef4444" textAnchor="middle">30</text>
        <text x={150} y={92} fontSize="8" fill="#ef4444" textAnchor="middle">50</text>
        {/* Value */}
        <text x={cx} y={78} fontSize="18" fill={color} textAnchor="middle" fontWeight="700" fontFamily="monospace">
          {value.toFixed(1)}
        </text>
      </svg>
      <div className="flex gap-3 mt-1">
        <span className="text-[9px] text-green-500">CALM</span>
        <span className="text-[9px] text-amber-400">HEDGED</span>
        <span className="text-[9px] text-orange-500">FEAR</span>
        <span className="text-[9px] text-red-400">PANIC</span>
      </div>
    </div>
  );
}

// Sparkline-only (no axes)
interface SparklineProps {
  data: number[];
  positive?: boolean;
  width?: number;
  height?: number;
}

export function Sparkline({ data, positive, width = 60, height = 24 }: SparklineProps) {
  const color = positive === true ? "#22c55e" : positive === false ? "#ef4444" : "#f59e0b";
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 1, right: 1, left: 1, bottom: 1 }}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
