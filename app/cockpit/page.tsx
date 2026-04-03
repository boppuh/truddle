"use client";

import { useState, useEffect } from "react";
import { cockpitData } from "@/lib/mock-data";
import { fetchCockpitData } from "@/lib/api";
import { GexBarChart } from "@/components/mini-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatRow } from "@/components/kpi-card";
import { cn } from "@/lib/utils";
import { Crosshair, Database, Gauge, Scan, Target, TrendingUp, TrendingDown } from "lucide-react";

function GaugeBar({ name, value, min, max, threshold, unit, color }: typeof cockpitData.fearGauges[0]) {
  const pct = ((value - min) / (max - min)) * 100;
  const barColor = color === "green" ? "#22c55e" : color === "amber" ? "#f59e0b" : "#ef4444";

  return (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[10px] text-muted-foreground">{name}</span>
        <span className={cn("text-[10px] font-medium tabular-nums", {
          "text-green-500": color === "green",
          "text-amber-400": color === "amber",
          "text-red-400": color === "red",
        })}>
          {typeof value === "number" ? value.toFixed(value < 10 ? 2 : 1) : value}{unit}
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? "#00d4aa" : score >= 65 ? "#f59e0b" : "#888";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-[10px] tabular-nums font-bold" style={{ color }}>{score}</span>
    </div>
  );
}

export default function CockpitPage() {
  const [d, setD] = useState(cockpitData);
  useEffect(() => { fetchCockpitData().then(setD).catch(() => {}); }, []);

  return (
    <div className="page-content">
      <div className="mb-3">
        <h1 className="text-sm font-bold text-foreground tracking-wide uppercase flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-primary" />
          Trader&apos;s Cockpit
        </h1>
        <p className="text-[11px] text-muted-foreground">GEX · Dark Pool · Fear Gauges · Scanner · Trade Setups</p>
      </div>

      {/* Row 1: GEX Summary + GEX Chart */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {/* GEX Summary */}
        <Card className="bg-card border-card-border">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">
              GEX Summary — {d.gex.ticker}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="grid grid-cols-2 gap-x-4">
              <StatRow label="Net GEX" value={d.gex.netGex} valueColor="positive" />
              <StatRow label="Regime" value={d.gex.gammaRegime} valueColor="primary" />
              <StatRow label="Call Wall" value={d.gex.callWall.toLocaleString()} valueColor="positive" />
              <StatRow label="Put Wall" value={d.gex.putWall.toLocaleString()} valueColor="negative" />
              <StatRow label="Max Pain" value={d.gex.maxPain.toLocaleString()} valueColor="neutral" />
              <StatRow label="Flip Point" value={d.gex.flipPoint.toLocaleString()} valueColor="default" />
            </div>
            <div className="mt-3 p-2 rounded bg-muted/30 border border-border/40">
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Dealers are net long gamma — they sell rips and buy dips near <span className="text-primary">{d.gex.maxPain}</span>.
                Breach of <span className="text-amber-400">{d.gex.flipPoint}</span> flips regime to short gamma.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* GEX Bar Chart */}
        <Card className="bg-card border-card-border col-span-2">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">
              GEX by Strike ($B) — Calls → Green / Puts → Red
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <GexBarChart
              data={d.gexStrikes}
              currentPrice={d.gex.currentPrice}
              height={160}
            />
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Dark Pool + Fear Gauges */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Dark Pool Prints */}
        <Card className="bg-card border-card-border">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3 h-3" />
              Dark Pool Prints (&gt;$100M)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="overflow-y-auto max-h-[200px]">
              <table className="trading-table w-full">
                <thead>
                  <tr>
                    <th className="text-left">Time</th>
                    <th className="text-left">Ticker</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Size</th>
                    <th className="text-left">Exch</th>
                    <th className="text-left">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {d.darkPoolPrints.map((print, i) => (
                    <tr key={i}>
                      <td className="text-primary font-mono text-[10px]">{print.time}</td>
                      <td className="font-bold text-foreground">{print.ticker}</td>
                      <td className="text-right tabular-nums">{print.price}</td>
                      <td className="text-right tabular-nums text-amber-400 font-medium">{print.size}</td>
                      <td className="text-muted-foreground">{print.exchange}</td>
                      <td>
                        <span className={cn(
                          "text-[9px] font-bold uppercase px-1 py-0.5 rounded",
                          print.type === "BLOCK" ? "bg-primary/15 text-primary" : "bg-amber-500/15 text-amber-400"
                        )}>
                          {print.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Fear Gauges */}
        <Card className="bg-card border-card-border">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Gauge className="w-3 h-3" />
              Fear &amp; Macro Gauges
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            {d.fearGauges.map((gauge) => (
              <GaugeBar key={gauge.name} {...gauge} />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Watchlist Scanner + Trade Setups */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Scanner */}
        <Card className="bg-card border-card-border">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Scan className="w-3 h-3" />
              Watchlist Scanner
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="overflow-y-auto max-h-[220px]">
              <table className="trading-table w-full">
                <thead>
                  <tr>
                    <th className="text-left">Ticker</th>
                    <th className="text-left">Signal</th>
                    <th className="text-center" style={{ width: 100 }}>Score</th>
                    <th className="text-left">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {d.watchlistScanner.map((row) => (
                    <tr key={row.ticker} data-testid={`scanner-row-${row.ticker}`}>
                      <td className="font-bold text-foreground">{row.ticker}</td>
                      <td>
                        <span className="text-[9px] font-medium text-primary">{row.signal}</span>
                      </td>
                      <td className="px-2">
                        <ScoreBar score={row.score} />
                      </td>
                      <td className="text-[10px] text-muted-foreground max-w-[200px] truncate" title={row.reason}>
                        {row.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Trade Setups */}
        <div className="space-y-2">
          <div className="section-label flex items-center gap-1.5">
            <Target className="w-3 h-3" />
            Trade Setups
          </div>
          {d.tradeSetups.map((setup) => (
            <Card key={setup.name} className="bg-card border-card-border" data-testid={`trade-setup-${setup.name.toLowerCase().replace(/\s+/g, "-")}`}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[9px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wider",
                      setup.direction === "Long" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    )}>
                      {setup.direction}
                    </span>
                    <span className="text-xs font-bold text-foreground">{setup.name}</span>
                    <span className="text-[10px] text-muted-foreground">{setup.ticker}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-muted-foreground">Score</div>
                    <div className="text-sm font-bold text-primary tabular-nums">{setup.score}</div>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mb-2">{setup.thesis}</p>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="text-muted-foreground">Entry: <span className="text-foreground font-medium">{setup.entry}</span></span>
                  <span className="text-green-500">Target: {setup.target}</span>
                  <span className="text-red-400">Stop: {setup.stop}</span>
                  <span className="ml-auto text-muted-foreground">{setup.expiry}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
