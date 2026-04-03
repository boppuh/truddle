"use client";

import { useState, useEffect } from "react";
import { volRegimeData } from "@/lib/mock-data";
import { fetchVolRegimeData } from "@/lib/api";
import { KpiCard } from "@/components/kpi-card";
import { MiniLineChart, VixGauge } from "@/components/mini-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertTriangle, CheckCircle, Minus, Calendar, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

function SignalDot({ status }: { status: string }) {
  const colors = {
    green: "bg-green-500",
    amber: "bg-amber-400",
    red: "bg-red-400",
  };
  return (
    <span
      className={cn(
        "inline-block w-2.5 h-2.5 rounded-full flex-shrink-0",
        colors[status as keyof typeof colors] || "bg-muted-foreground"
      )}
    />
  );
}

function RegimeBadge({ regime }: { regime: string }) {
  const styles: Record<string, string> = {
    "HEDGED-ORDERLY": "border-amber-500 text-amber-400 bg-amber-500/10",
    COMPLACENT: "border-green-500 text-green-400 bg-green-500/10",
    FEAR: "border-orange-500 text-orange-400 bg-orange-500/10",
    PANIC: "border-red-500 text-red-400 bg-red-500/10",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold tracking-widest border",
        styles[regime] || styles["HEDGED-ORDERLY"]
      )}
    >
      <AlertTriangle className="w-3 h-3" />
      {regime}
    </span>
  );
}

export default function VolRegimePage() {
  const [d, setD] = useState(volRegimeData);
  useEffect(() => { fetchVolRegimeData().then(setD).catch(() => {}); }, []);

  return (
    <div className="page-content">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <RegimeBadge regime={d.regime} />
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold tabular-nums terminal-value text-foreground">
              {d.vixLevel}
            </span>
            <span className="text-xs text-muted-foreground">VIX</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs">{d.timestamp}</span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-2 mb-4">
        {d.kpis.map((kpi) => (
          <KpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta || undefined}
            deltaPct={kpi.deltaPct || undefined}
            positive={kpi.delta ? kpi.positive : undefined}
          />
        ))}
      </div>

      {/* Row 2: Gauge + Signal Summary + Term Structure */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* VIX Gauge */}
        <Card className="bg-card border-card-border">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">VIX Gauge</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <VixGauge value={d.vixLevel} />
          </CardContent>
        </Card>

        {/* Signal Summary */}
        <Card className="bg-card border-card-border">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">Signal Summary</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 space-y-1.5">
            {d.signals.map((sig) => (
              <div key={sig.name} className="flex items-center gap-2">
                <SignalDot status={sig.status} />
                <span className="text-xs text-foreground flex-1">{sig.name}</span>
                <span className="text-[10px] tabular-nums terminal-value text-muted-foreground">{sig.value}</span>
                <span className="text-[9px] text-muted-foreground hidden lg:block">{sig.note}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* VIX Term Structure */}
        <Card className="bg-card border-card-border">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">VIX Term Structure</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <MiniLineChart
              data={d.termStructure.map((t) => ({ date: t.tenor, value: t.value }))}
              color="#f59e0b"
              height={100}
              showXAxis={true}
            />
          </CardContent>
        </Card>
      </div>

      {/* Chart Grid 2x2 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="bg-card border-card-border">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">VIX 30-Day Path</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <MiniLineChart data={d.vixSeries} color="#ef4444" height={110} />
          </CardContent>
        </Card>

        <Card className="bg-card border-card-border">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">S&P 500 30-Day Path</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <MiniLineChart data={d.spxSeries} color="#22c55e" height={110} />
          </CardContent>
        </Card>

        <Card className="bg-card border-card-border">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">Implied vs Realized Vol (30d)</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <MiniLineChart data={d.implRealSeries} color="#00d4aa" height={110} />
          </CardContent>
        </Card>

        {/* Forward Returns Table */}
        <Card className="bg-card border-card-border">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">Forward Returns by Regime</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <table className="trading-table w-full">
                <thead>
                  <tr>
                    <th className="text-left">Regime</th>
                    <th className="text-right">1D</th>
                    <th className="text-right">5D</th>
                    <th className="text-right">20D</th>
                  </tr>
                </thead>
                <tbody>
                  {d.forwardReturns.map((row) => (
                    <tr key={row.regime}>
                      <td className="text-xs text-foreground">{row.regime}</td>
                      <td className={cn("text-right", row["1d"].startsWith("-") ? "text-red-400" : "text-green-500")}>{row["1d"]}</td>
                      <td className={cn("text-right", row["5d"].startsWith("-") ? "text-red-400" : "text-green-500")}>{row["5d"]}</td>
                      <td className={cn("text-right", row["20d"].startsWith("-") ? "text-red-400" : "text-green-500")}>{row["20d"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Calendar + Premarket Narrative */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="bg-card border-card-border">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Event Risk Calendar
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <table className="trading-table w-full">
              <thead>
                <tr>
                  <th className="text-left">Time</th>
                  <th className="text-left">Event</th>
                  <th className="text-right">Prior</th>
                  <th className="text-right">Cons.</th>
                  <th className="text-right">Actual</th>
                  <th className="text-left">Impact</th>
                </tr>
              </thead>
              <tbody>
                {d.events.map((ev) => (
                  <tr key={ev.event}>
                    <td className="text-primary font-mono">{ev.time}</td>
                    <td className="text-xs">{ev.event}</td>
                    <td className="text-right text-muted-foreground">{ev.prior}</td>
                    <td className="text-right text-muted-foreground">{ev.consensus}</td>
                    <td className={cn("text-right font-medium", ev.actual !== "—" ? "text-amber-400" : "text-muted-foreground")}>{ev.actual}</td>
                    <td>
                      <span className={cn(
                        "text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded",
                        ev.impact === "high" ? "bg-red-500/20 text-red-400" :
                          ev.impact === "medium" ? "bg-amber-500/20 text-amber-400" :
                            "bg-muted text-muted-foreground"
                      )}>
                        {ev.impact}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="bg-card border-card-border">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Premarket Narrative
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <p className="text-xs text-muted-foreground leading-relaxed">{d.narrative}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
