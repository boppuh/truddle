"use client";

import { useState, useEffect } from "react";
import { energyData } from "@/lib/mock-data";
import { fetchEnergyData } from "@/lib/api";
import { MiniLineChart } from "@/components/mini-chart";
import { Sparkline } from "@/components/mini-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Flame, AlertTriangle, Map, Radio, Ship, TrendingUp, TrendingDown } from "lucide-react";

function heatColor(change: number): string {
  if (change > 2) return "rgba(34,197,94,0.45)";
  if (change > 1) return "rgba(34,197,94,0.3)";
  if (change > 0.3) return "rgba(34,197,94,0.18)";
  if (change > -0.3) return "rgba(255,255,255,0.06)";
  if (change > -1) return "rgba(239,68,68,0.18)";
  if (change > -2) return "rgba(239,68,68,0.3)";
  return "rgba(239,68,68,0.45)";
}

export default function EnergyPage() {
  const [d, setD] = useState(energyData);
  useEffect(() => {
    fetchEnergyData().then((api) => {
      // Merge API data with mock data for fields not yet available (geopoliticalPulse)
      setD((prev) => ({ ...prev, ...api }));
    }).catch(() => {});
  }, []);

  return (
    <div className="page-content">
      <div className="mb-3 flex items-center gap-2">
        <Flame className="w-4 h-4 text-amber-400" />
        <h1 className="text-sm font-bold text-foreground tracking-wide uppercase">Gulf Energy Dashboard</h1>
      </div>

      {/* Commodity Strip */}
      <div className="grid grid-cols-6 gap-2 mb-3">
        {d.commodities.map((c) => (
          <Card key={c.symbol} className="bg-card border-card-border" data-testid={`commodity-${c.symbol.toLowerCase()}`}>
            <CardContent className="p-2.5">
              <div className="text-[9px] text-muted-foreground uppercase tracking-wide mb-1">{c.name}</div>
              <div className="text-sm font-bold tabular-nums terminal-value text-foreground">{c.price}</div>
              <div className="flex items-center justify-between mt-0.5">
                <span className={cn("text-[10px] font-medium tabular-nums", c.positive ? "text-green-500" : "text-red-400")}>
                  {c.change} ({c.changePct})
                </span>
              </div>
              <div className="mt-1.5">
                <Sparkline data={c.sparkline} positive={c.positive} width={80} height={22} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Row 2: Heatmap + Supply Shocks */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {/* Watchlist Heatmap */}
        <Card className="bg-card border-card-border col-span-2">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">Energy &amp; Airlines Heatmap</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
              {d.watchlistTickers.map((t) => (
                <div
                  key={t.ticker}
                  className="heatmap-cell"
                  style={{ backgroundColor: heatColor(t.change) }}
                  data-testid={`energy-heatmap-${t.ticker.toLowerCase()}`}
                >
                  <span className="text-[10px] font-bold text-foreground">{t.ticker}</span>
                  <span className={cn("text-[9px] tabular-nums", t.change >= 0 ? "text-green-400" : "text-red-400")}>
                    {t.change >= 0 ? "+" : ""}{t.change.toFixed(2)}%
                  </span>
                  <span className="text-[8px] text-muted-foreground">{t.sector}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Supply Shocks */}
        <Card className="bg-card border-card-border">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3" />
              Supply Shocks Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 space-y-3">
            {d.supplyShocks.map((shock, i) => (
              <div key={i} className="border-b border-border/40 last:border-0 pb-2 last:pb-0">
                <div className="flex items-start gap-2 mb-1">
                  <span className={cn(
                    "text-[9px] font-bold uppercase px-1.5 py-0.5 rounded flex-shrink-0",
                    shock.severity === "HIGH" ? "bg-red-500/20 text-red-400" :
                      shock.severity === "MEDIUM" ? "bg-amber-500/20 text-amber-400" :
                        "bg-green-500/20 text-green-400"
                  )}>
                    {shock.severity}
                  </span>
                  <span className="text-[10px] font-medium text-foreground leading-tight">{shock.headline}</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed mb-1">{shock.summary}</p>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-muted-foreground">Affected:</span>
                  {shock.affected.map((t) => (
                    <span key={t} className="text-[9px] font-medium text-primary bg-primary/10 px-1 rounded">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Exposure Rankings + Hormuz Tracker */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {/* Exposure Rankings */}
        <Card className="bg-card border-card-border col-span-2">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Map className="w-3 h-3" />
              Exposure Rankings
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <table className="trading-table w-full">
                <thead>
                  <tr>
                    <th className="text-center">#</th>
                    <th className="text-left">Ticker</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Chg%</th>
                    <th className="text-left">Sector</th>
                    <th className="text-left">Dir</th>
                    <th className="text-left">Thesis</th>
                  </tr>
                </thead>
                <tbody>
                  {d.exposureRankings.map((row) => (
                    <tr key={row.rank} data-testid={`exposure-row-${row.ticker.toLowerCase()}`}>
                      <td className="text-center text-muted-foreground font-bold">{row.rank}</td>
                      <td className="font-bold text-foreground">{row.ticker}</td>
                      <td className="text-right tabular-nums">{row.price}</td>
                      <td className={cn("text-right tabular-nums font-medium", row.change.startsWith("-") ? "text-red-400" : "text-green-500")}>{row.change}</td>
                      <td className="text-muted-foreground">{row.sector}</td>
                      <td>
                        <span className={cn(
                          "text-[9px] font-bold uppercase px-1 py-0.5 rounded",
                          row.direction === "Long" ? "bg-green-500/20 text-green-400" :
                            row.direction === "Short" ? "bg-red-500/20 text-red-400" :
                              "bg-muted text-muted-foreground"
                        )}>
                          {row.direction}
                        </span>
                      </td>
                      <td className="text-[10px] text-muted-foreground max-w-[180px] truncate" title={row.thesis}>{row.thesis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Hormuz Tracker */}
        <Card className="bg-card border-card-border">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Ship className="w-3 h-3" />
              Strait of Hormuz Tracker
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="text-center p-2 bg-muted/20 rounded">
                <div className="text-[9px] text-muted-foreground uppercase">Daily Transits</div>
                <div className="text-sm font-bold text-amber-400 tabular-nums">28</div>
                <div className="text-[9px] text-red-400">↓ vs 42 (30d ago)</div>
              </div>
              <div className="text-center p-2 bg-muted/20 rounded">
                <div className="text-[9px] text-muted-foreground uppercase">Incidents/Mo</div>
                <div className="text-sm font-bold text-red-400 tabular-nums">3</div>
                <div className="text-[9px] text-amber-400">ELEVATED</div>
              </div>
            </div>
            <MiniLineChart
              data={d.hormuzSeries}
              color="#f59e0b"
              height={110}
              showXAxis={false}
            />
            <div className="mt-2 p-1.5 rounded bg-red-500/[0.08] border border-red-500/20">
              <p className="text-[10px] text-red-400 font-medium">STATUS: DISRUPTED</p>
              <p className="text-[9px] text-muted-foreground">Transits -33% from 30d avg. Tanker rerouting adds 8-12 days via Cape of Good Hope.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geopolitical Pulse */}
      <Card className="bg-card border-card-border mb-3">
        <CardHeader className="pb-1 pt-3 px-3">
          <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-3 h-3" />
            Geopolitical Pulse
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="grid grid-cols-2 gap-x-6">
            {d.geopoliticalPulse.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 py-1.5 border-b border-border/30 last:border-0">
                <span className="text-[10px] text-primary font-mono flex-shrink-0 min-w-[70px]">{item.time}</span>
                <div>
                  <p className="text-[11px] text-foreground leading-tight">{item.headline}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-[9px] bg-muted px-1 py-0.5 rounded text-muted-foreground">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
