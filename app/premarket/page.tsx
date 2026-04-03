"use client";

import { useState, useEffect } from "react";
import { premarketData } from "@/lib/mock-data";
import { fetchPremarketData } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Sunrise, TrendingUp, TrendingDown, AlertOctagon, BookOpen, Newspaper } from "lucide-react";

// Heatmap cell color
function heatColor(change: number): string {
  if (change > 2) return "rgba(34,197,94,0.45)";
  if (change > 1) return "rgba(34,197,94,0.3)";
  if (change > 0.3) return "rgba(34,197,94,0.18)";
  if (change > -0.3) return "rgba(255,255,255,0.06)";
  if (change > -1) return "rgba(239,68,68,0.18)";
  if (change > -2) return "rgba(239,68,68,0.3)";
  return "rgba(239,68,68,0.45)";
}

export default function PremarketPage() {
  const [d, setD] = useState(premarketData);
  useEffect(() => {
    fetchPremarketData().then((api) => {
      // Merge API data with mock data for fields not yet available from backend
      setD((prev) => ({ ...prev, ...api }));
    }).catch(() => {});
  }, []);

  const regimeBg = {
    green: "bg-green-500/15 border-green-500/40 text-green-400",
    amber: "bg-amber-500/15 border-amber-500/40 text-amber-400",
    red: "bg-red-500/15 border-red-500/40 text-red-400",
  }[d.regime.color];

  return (
    <div className="page-content">
      {/* Regime Banner */}
      <div className={cn("border rounded-md p-2.5 mb-3 flex items-start justify-between gap-4", regimeBg)}>
        <div className="flex items-center gap-3">
          <Sunrise className="w-4 h-4 flex-shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest uppercase">{d.regime.label}</span>
            </div>
            <div className="flex items-center gap-4 mt-0.5 flex-wrap">
              <span className="text-[10px] opacity-80">VIX {d.regime.vix}</span>
              <span className="text-[10px] opacity-80">P/C {d.regime.putCall}</span>
              <span className="text-[10px] opacity-80">{d.regime.crossAsset}</span>
            </div>
          </div>
        </div>
        <p className="text-[10px] opacity-80 max-w-[400px] text-right">{d.regime.summary}</p>
      </div>

      {/* Row 1: Index Levels + Options Flow */}
      <div className="grid grid-cols-5 gap-3 mb-3">
        {/* Index Levels */}
        <div className="col-span-3 grid grid-cols-2 gap-2">
          {d.indexLevels.map((idx) => (
            <Card key={idx.index} className="bg-card border-card-border" data-testid={`index-level-${idx.index.toLowerCase()}`}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-1.5">
                  <span className="text-sm font-bold text-foreground">{idx.index}</span>
                  <div className="text-right">
                    <div className="text-sm font-bold tabular-nums">{idx.value}</div>
                    <div className={cn("text-[10px] tabular-nums", idx.positive ? "text-green-500" : "text-red-400")}>{idx.change}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4">
                  <div>
                    <div className="text-[9px] text-muted-foreground uppercase mb-0.5">Support</div>
                    {idx.support.map((s) => (
                      <div key={s} className="text-[10px] text-red-400/80 tabular-nums">{s}</div>
                    ))}
                  </div>
                  <div>
                    <div className="text-[9px] text-muted-foreground uppercase mb-0.5">Resistance</div>
                    {idx.resistance.map((r) => (
                      <div key={r} className="text-[10px] text-green-500/80 tabular-nums">{r}</div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1.5 border-t border-border/30 pt-1">
                  <span className="text-[9px] text-muted-foreground">OH: <span className="text-foreground tabular-nums">{idx.overnightHigh}</span></span>
                  <span className="text-[9px] text-muted-foreground">OL: <span className="text-foreground tabular-nums">{idx.overnightLow}</span></span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Options Flow */}
        <Card className="bg-card border-card-border col-span-2">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">Options Tape &amp; Flow</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="mb-3 p-2 rounded bg-primary/[0.08] border border-primary/20">
              <p className="text-[10px] text-primary font-medium">{d.optionsFlow.gexRegime}</p>
            </div>
            <div className="mb-2">
              <div className="text-[9px] text-muted-foreground uppercase tracking-wide mb-1">0DTE Hotspots</div>
              <div className="flex flex-wrap gap-1">
                {d.optionsFlow.zeroDteHotspots.map((z) => (
                  <span key={z} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-amber-400 tabular-nums">{z}</span>
                ))}
              </div>
            </div>
            <div className="mb-2">
              <div className="text-[9px] text-muted-foreground uppercase tracking-wide mb-1">Unusual Activity</div>
              {d.optionsFlow.unusualActivity.map((ua, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] py-0.5 border-b border-border/30 last:border-0">
                  <span className="font-bold text-foreground w-10 flex-shrink-0">{ua.ticker}</span>
                  <span className={cn("font-medium", ua.type.includes("Call") ? "text-green-500" : "text-red-400")}>{ua.type}</span>
                  <span className="text-muted-foreground">{ua.strike} {ua.exp}</span>
                  <span className="ml-auto text-amber-400 tabular-nums">{ua.premium}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-[10px] mt-1">
              <span className="text-muted-foreground">Put/Call Ratio</span>
              <span className="tabular-nums font-medium text-foreground">{d.optionsFlow.putCallRatio}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Heatmap + Earnings */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {/* MSM Universe Heatmap */}
        <Card className="bg-card border-card-border col-span-2">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">MSM Universe Heatmap (25 Tickers)</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="grid grid-cols-5 gap-1.5">
              {d.heatmap.map((cell) => (
                <div
                  key={cell.ticker}
                  className="heatmap-cell"
                  style={{ backgroundColor: heatColor(cell.change) }}
                  data-testid={`heatmap-cell-${cell.ticker.toLowerCase()}`}
                >
                  <span className="text-[10px] font-bold text-foreground">{cell.ticker}</span>
                  <span className={cn("text-[9px] tabular-nums font-medium", cell.change >= 0 ? "text-green-400" : "text-red-400")}>
                    {cell.change >= 0 ? "+" : ""}{cell.change.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Earnings + Economic Calendar */}
        <div className="space-y-2">
          <Card className="bg-card border-card-border">
            <CardHeader className="pb-1 pt-3 px-3">
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">Earnings Movers</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <table className="trading-table w-full">
                <thead>
                  <tr>
                    <th className="text-left">Ticker</th>
                    <th className="text-left">EPS</th>
                    <th className="text-right">Move</th>
                  </tr>
                </thead>
                <tbody>
                  {d.earningsMovers.map((e) => (
                    <tr key={e.ticker}>
                      <td>
                        <div className="font-bold text-foreground">{e.ticker}</div>
                        <div className="text-[9px] text-muted-foreground">{e.timing}</div>
                      </td>
                      <td className="text-[10px] text-muted-foreground">{e.eps}</td>
                      <td className={cn("text-right font-bold tabular-nums", e.positive ? "text-green-500" : "text-red-400")}>{e.move}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Do Not Touch */}
          <Card className="bg-card border-red-900/30 border">
            <CardHeader className="pb-1 pt-3 px-3">
              <CardTitle className="text-xs text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertOctagon className="w-3 h-3" />
                Do Not Touch
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              {d.doNotTouch.map((item) => (
                <div key={item.ticker} className="flex items-start gap-2 py-1 border-b border-border/30 last:border-0">
                  <span className="text-[11px] font-bold text-red-400 flex-shrink-0 w-12">{item.ticker}</span>
                  <span className="text-[10px] text-muted-foreground leading-tight">{item.reason}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Row 3: Econ Calendar + Trade Setups + Macro + Fear Dashboard */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {/* Economic Calendar */}
        <Card className="bg-card border-card-border">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3 h-3" />
              Economic Calendar
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <table className="trading-table w-full">
              <thead>
                <tr>
                  <th className="text-left">Time</th>
                  <th className="text-left">Event</th>
                  <th className="text-right">Prior</th>
                  <th className="text-right">Cons</th>
                  <th className="text-right">Act</th>
                </tr>
              </thead>
              <tbody>
                {d.economicCalendar.map((ev) => (
                  <tr key={ev.event}>
                    <td className="text-primary font-mono">{ev.time}</td>
                    <td className="text-[10px]">{ev.event}</td>
                    <td className="text-right text-muted-foreground">{ev.prior}</td>
                    <td className="text-right text-muted-foreground">{ev.consensus}</td>
                    <td className={cn("text-right font-medium", ev.actual !== "—" ? "text-amber-400" : "text-muted-foreground")}>{ev.actual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Trade Setups */}
        <Card className="bg-card border-card-border">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">High-Probability Setups</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 space-y-2">
            {d.tradeSetups.map((setup) => (
              <div key={setup.ticker} className="p-2 rounded bg-muted/20 border border-border/40">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      "text-[9px] font-bold uppercase px-1 py-0.5 rounded",
                      setup.direction.includes("Long") ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    )}>
                      {setup.direction}
                    </span>
                    <span className="text-xs font-bold text-foreground">{setup.ticker}</span>
                  </div>
                  <span className="text-[10px] text-primary font-medium">R:R {setup.rr}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mb-1">{setup.thesis}</p>
                <div className="flex gap-3 text-[10px]">
                  <span className="text-muted-foreground">E: <span className="text-foreground">{setup.entry}</span></span>
                  <span className="text-green-500">T: {setup.target}</span>
                  <span className="text-red-400">S: {setup.stop}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Fear Dashboard + Macro Catalysts */}
        <div className="space-y-2">
          <Card className="bg-card border-card-border">
            <CardHeader className="pb-1 pt-3 px-3">
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">Fear Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              {Object.entries(d.fearDashboard).filter(([k]) => k !== "assessment").map(([key, val]) => {
                if (typeof val === "object" && val !== null && "value" in val) {
                  const v = val as { value: string | number; regime: string; color: string };
                  return (
                    <div key={key} className="flex items-center justify-between py-0.5 border-b border-border/30 last:border-0">
                      <span className="text-[10px] text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                      <div className="text-right">
                        <span className={cn(
                          "text-[10px] font-medium tabular-nums",
                          v.color === "green" ? "text-green-500" : v.color === "amber" ? "text-amber-400" : "text-red-400"
                        )}>
                          {typeof v.value === "number" ? v.value.toFixed(1) : v.value}
                        </span>
                        <span className="text-[9px] text-muted-foreground ml-1">{v.regime}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
              <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                {d.fearDashboard.assessment}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-card-border">
            <CardHeader className="pb-1 pt-3 px-3">
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Newspaper className="w-3 h-3" />
                Macro Catalysts
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              {d.macroCatalysts.map((c, i) => (
                <div key={i} className="flex items-start gap-2 py-1 border-b border-border/30 last:border-0">
                  <span className="text-[9px] text-primary mt-0.5">▸</span>
                  <span className="text-[10px] text-muted-foreground leading-relaxed">{c}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
