"use client";

import { useState, useEffect } from "react";
import { derivativesData } from "@/lib/mock-data";
import { fetchDerivativesData } from "@/lib/api";
import { StatRow } from "@/components/kpi-card";
import { FedWatchChart } from "@/components/mini-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Target } from "lucide-react";

function ChangeCell({ value, pct }: { value: string; pct: string }) {
  const isNeg = value.startsWith("-");
  return (
    <td className="text-right">
      <div className={cn("tabular-nums text-[11px]", isNeg ? "text-red-400" : "text-green-500")}>
        {value}
      </div>
      <div className={cn("tabular-nums text-[10px]", isNeg ? "text-red-400/70" : "text-green-500/70")}>
        {pct}
      </div>
    </td>
  );
}

function TradeSetupCard({ setup }: { setup: typeof derivativesData.tradeSetups[0] }) {
  const isLong = setup.direction === "Long";
  return (
    <Card className="bg-card border-card-border">
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-[9px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wider",
                isLong ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              )}>
                {setup.direction}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">{setup.instrument}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-muted-foreground uppercase tracking-wide">Score</div>
            <div className={cn("text-sm font-bold tabular-nums", setup.score >= 75 ? "text-primary" : "text-amber-400")}>{setup.score}</div>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">{setup.thesis}</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className="text-[9px] text-muted-foreground uppercase">Entry</div>
            <div className="text-[11px] text-foreground tabular-nums font-medium">{setup.entry}</div>
          </div>
          <div className="text-center">
            <div className="text-[9px] text-green-500 uppercase">Target</div>
            <div className="text-[11px] text-green-500 tabular-nums font-medium">{setup.target}</div>
          </div>
          <div className="text-center">
            <div className="text-[9px] text-red-400 uppercase">Stop</div>
            <div className="text-[11px] text-red-400 tabular-nums font-medium">{setup.stop}</div>
          </div>
        </div>
        <div className="mt-2 text-right">
          <span className="text-[10px] text-primary font-medium">R:R {setup.rr}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DerivativesDeskPage() {
  const [d, setD] = useState(derivativesData);
  useEffect(() => { fetchDerivativesData().then(setD).catch(() => {}); }, []);

  return (
    <div className="page-content">
      <div className="mb-3">
        <h1 className="text-sm font-bold text-foreground tracking-wide uppercase">Derivatives Desk</h1>
        <p className="text-[11px] text-muted-foreground">Multi-asset scoreboard · Rates · Vol · Crypto</p>
      </div>

      {/* Scoreboard */}
      <Card className="bg-card border-card-border mb-3">
        <CardHeader className="pb-1 pt-3 px-3">
          <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">12-Instrument Scoreboard</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <table className="trading-table w-full">
              <thead>
                <tr>
                  <th className="text-left">Instrument</th>
                  <th className="text-left">Sector</th>
                  <th className="text-right">Last</th>
                  <th className="text-right">Change</th>
                  <th className="text-right">QTD%</th>
                  <th className="text-right">Volume</th>
                  <th className="text-right">OI</th>
                </tr>
              </thead>
              <tbody>
                {d.scoreboard.map((row) => (
                  <tr key={row.instrument}>
                    <td className="font-bold text-foreground">{row.instrument}</td>
                    <td className="text-muted-foreground">{row.sector}</td>
                    <td className="text-right tabular-nums font-medium text-foreground">{row.last}</td>
                    <ChangeCell value={row.change} pct={row.changePct} />
                    <td className={cn("text-right tabular-nums text-[11px]", row.qtd.startsWith("-") ? "text-red-400" : "text-green-500")}>{row.qtd}</td>
                    <td className="text-right tabular-nums text-muted-foreground">{row.volume}</td>
                    <td className="text-right tabular-nums text-muted-foreground">{row.oi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 3-column row: Rates + FedWatch + Vol+Crypto */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {/* Rates Panel */}
        <Card className="bg-card border-card-border">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">Rates Panel</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <StatRow label="Fed Funds" value={d.rates.fedFunds} valueColor="primary" />
            <StatRow label="SOFR" value={d.rates.sofr} valueColor="primary" />
            <StatRow label="2s10s Spread" value={d.rates.spread2s10s} valueColor="negative" />
            <StatRow label="5s30s Spread" value={d.rates.spread5s30s} valueColor="positive" />
            <StatRow label="CPI YoY" value={d.rates.cpi} valueColor="neutral" />
            <StatRow label="PPI YoY" value={d.rates.ppi} valueColor="positive" />
            <StatRow label="Infl. Breakeven" value={d.rates.inflationBreakeven} valueColor="default" />
          </CardContent>
        </Card>

        {/* FedWatch */}
        <Card className="bg-card border-card-border">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">CME FedWatch Probabilities</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-2">
            <FedWatchChart data={d.fedwatch} height={140} />
            <div className="flex items-center gap-3 mt-1 justify-center">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm" style={{ background: "hsl(0 0% 30%)" }} />
                <span className="text-[9px] text-muted-foreground">Hold</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-primary" />
                <span className="text-[9px] text-muted-foreground">-25bps</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-green-500" />
                <span className="text-[9px] text-muted-foreground">-50bps</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vol + Crypto */}
        <div className="space-y-3">
          <Card className="bg-card border-card-border">
            <CardHeader className="pb-1 pt-3 px-3">
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">Vol Panel</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <StatRow label="VIX Spot" value={d.vol.vix.toString()} valueColor="neutral" />
              <StatRow label="MOVE Index" value={d.vol.move.toString()} valueColor="positive" />
              <StatRow label="VIX/MOVE Ratio" value={d.vol.ratio.toString()} valueColor="default" />
              <StatRow label="Term Structure" value={d.vol.structure} valueColor="primary" />
              <StatRow label="Vol Skew" value={d.vol.skew} valueColor="negative" />
            </CardContent>
          </Card>
          <Card className="bg-card border-card-border">
            <CardHeader className="pb-1 pt-3 px-3">
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">Crypto Panel</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <StatRow label="BTC" value={d.crypto.btc} valueColor="positive" />
              <StatRow label="ETH" value={d.crypto.eth} valueColor="positive" />
              <StatRow label="ETH/BTC" value={d.crypto.ethBtcRatio} valueColor="default" />
              <StatRow label="Basis (Ann.)" value={d.crypto.basisAnn} valueColor="positive" />
              <StatRow label="Funding Rate" value={d.crypto.fundingRate} valueColor="positive" />
              <StatRow label="BTC Dominance" value={d.crypto.btcDominance} valueColor="neutral" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trade Setups */}
      <div className="mb-3">
        <div className="section-label mb-2 flex items-center gap-1.5">
          <Target className="w-3 h-3" />
          Top 3 Trade Setups
        </div>
        <div className="grid grid-cols-3 gap-3">
          {d.tradeSetups.map((setup) => (
            <TradeSetupCard key={setup.id} setup={setup} />
          ))}
        </div>
      </div>
    </div>
  );
}
