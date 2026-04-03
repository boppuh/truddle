const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API ${path}: ${res.status}`);
  return res.json();
}

// ── Vol Regime ──────────────────────────────────────────────

export async function fetchVolRegimeData() {
  const [regime, history, forwardReturns, events, note] = await Promise.all([
    fetchJson<any>("/api/vol/regime"),
    fetchJson<any>("/api/vol/history"),
    fetchJson<any[]>("/api/vol/forward-returns"),
    fetchJson<any[]>("/api/vol/events"),
    fetchJson<{ text: string }>("/api/vol/note"),
  ]);

  return {
    regime: regime.regime || "HEDGED-ORDERLY",
    regimeColor: regime.regimeColor || "amber",
    timestamp: regime.timestamp || "",
    vixLevel: regime.vixLevel || 0,
    kpis: regime.kpis || [],
    signals: regime.signals || [],
    termStructure: regime.termStructure || [],
    vixSeries: history.vixSeries || [],
    spxSeries: history.spxSeries || [],
    implRealSeries: history.implRealSeries || [],
    forwardReturns,
    events,
    narrative: note.text || "",
  };
}

// ── Derivatives ─────────────────────────────────────────────

export async function fetchDerivativesData() {
  const [scoreboard, rates, vol, crypto, setups] = await Promise.all([
    fetchJson<any[]>("/api/derivatives/scoreboard"),
    fetchJson<any>("/api/derivatives/rates"),
    fetchJson<any>("/api/derivatives/vol"),
    fetchJson<any>("/api/derivatives/crypto"),
    fetchJson<any[]>("/api/derivatives/setups"),
  ]);

  // rates.fedwatch is nested in the backend response
  const { fedwatch, ...ratesData } = rates;

  return {
    scoreboard,
    rates: ratesData,
    fedwatch: fedwatch || [],
    vol,
    crypto,
    tradeSetups: setups,
  };
}

// ── Cockpit ─────────────────────────────────────────────────

export async function fetchCockpitData() {
  const [gexResult, darkpool, fear, scanner, setups] = await Promise.all([
    fetchJson<{ summary: any; strikes: any[] }>("/api/cockpit/gex?ticker=SPY"),
    fetchJson<any[]>("/api/cockpit/darkpool"),
    fetchJson<any[]>("/api/cockpit/fear"),
    fetchJson<any[]>("/api/cockpit/scanner"),
    fetchJson<any[]>("/api/cockpit/setups"),
  ]);

  return {
    gex: gexResult.summary,
    gexStrikes: gexResult.strikes,
    darkPoolPrints: darkpool,
    fearGauges: fear,
    watchlistScanner: scanner,
    tradeSetups: setups,
  };
}

// ── Premarket ───────────────────────────────────────────────

export async function fetchPremarketData() {
  const full = await fetchJson<any>("/api/premarket/full");

  // Build heatmap from universe quotes
  const heatmap = (full.universe || []).map((u: any) => ({
    ticker: u.symbol,
    change: u.changePct || 0,
  }));

  // Build fear dashboard from premarket fear data
  const fearData = full.fear || {};

  // Economic calendar from full response
  const calendar = (full.calendar || []).map((ev: any) => ({
    time: ev.time || "",
    event: ev.event || "",
    prior: ev.prior || "",
    consensus: ev.consensus || "",
    actual: ev.actual || "—",
    impact: ev.impact || "low",
    surprise: ev.surprise || "—",
  }));

  // Earnings from full response
  const earnings = (full.earnings || []).map((e: any) => ({
    ticker: e.symbol || "",
    timing: e.reportTime || "",
    eps: e.epsActual ? `$${e.epsActual} vs $${e.epsEstimate}E` : "Pending",
    rev: e.revenueActual ? `$${(e.revenueActual / 1e9).toFixed(1)}B` : "Pending",
    move: e.priceReactionPct ? `${e.priceReactionPct >= 0 ? "+" : ""}${e.priceReactionPct.toFixed(1)}%` : "—",
    positive: (e.priceReactionPct || 0) >= 0,
  }));

  return {
    regime: {
      label: fearData.assessment ? (fearData.assessment.includes("ELEVATED") ? "RISK-OFF" : fearData.assessment.includes("COMPLACENT") ? "RISK-ON" : "HEDGED") : "HEDGED",
      color: fearData.vix?.color || "amber",
      vix: fearData.vix ? `${fearData.vix.value} (${fearData.vix.regime})` : "",
      putCall: "0.82 (Neutral)",
      crossAsset: "",
      summary: fearData.assessment || "",
    },
    heatmap,
    economicCalendar: calendar,
    earningsMovers: earnings,
    fearDashboard: fearData,
  };
}

// ── Energy ──────────────────────────────────────────────────

export async function fetchEnergyData() {
  const [commodities, watchlist, exposure, shocks, hormuz] = await Promise.all([
    fetchJson<any[]>("/api/energy/commodities"),
    fetchJson<any[]>("/api/energy/watchlist"),
    fetchJson<any[]>("/api/energy/exposure"),
    fetchJson<any[]>("/api/energy/shocks"),
    fetchJson<any[]>("/api/energy/hormuz"),
  ]);

  // Transform shocks to match frontend shape
  const supplyShocks = shocks.map((s: any) => ({
    headline: s.headline || "",
    severity: (s.severity || "LOW").toUpperCase(),
    severity_color: s.severityColor || "green",
    summary: s.summary || "",
    affected: (s.affectedTickers || "").split(",").filter(Boolean),
    date: s.timestamp || "",
  }));

  // Transform hormuz to chart series
  const hormuzSeries = hormuz.map((h: any) => ({
    date: h.date || "",
    value: h.transitCount || 0,
  }));

  // Transform exposure to add rank
  const exposureRankings = exposure.map((e: any, i: number) => ({
    rank: e.rank || i + 1,
    ticker: e.ticker || "",
    price: e.price || "$0.00",
    change: e.change || "+0.00%",
    sector: e.sector || "",
    direction: e.direction || "Watch",
    thesis: e.thesis || "",
  }));

  return {
    commodities,
    watchlistTickers: watchlist,
    supplyShocks,
    exposureRankings,
    hormuzSeries,
  };
}

// ── Pipeline: MSM → MC-Trading ──────────────────────────────

export async function fetchPipelineOverview() {
  try {
    const data = await fetchJson<any>("/api/pipeline/overview");
    return data;
  } catch {
    const { pipelineOverviewData } = await import("./mock-data");
    return pipelineOverviewData;
  }
}

export async function fetchMsmResearch() {
  try {
    const data = await fetchJson<any>("/api/pipeline/msm-research");
    return data;
  } catch {
    const { msmResearchData } = await import("./mock-data");
    return msmResearchData;
  }
}

export async function fetchMcExecution() {
  try {
    const data = await fetchJson<any>("/api/pipeline/execution");
    return data;
  } catch {
    const { mcExecutionData } = await import("./mock-data");
    return mcExecutionData;
  }
}

export async function fetchRiskMonitor() {
  try {
    const data = await fetchJson<any>("/api/pipeline/risk");
    return data;
  } catch {
    const { riskMonitorData } = await import("./mock-data");
    return riskMonitorData;
  }
}

export async function fetchPortfolioAnalytics() {
  try {
    const data = await fetchJson<any>("/api/pipeline/analytics");
    return data;
  } catch {
    const { portfolioAnalyticsData } = await import("./mock-data");
    return portfolioAnalyticsData;
  }
}

// ── MSM Advanced Features ────────────────────────────────────

export async function fetchMsmQualityScores() {
  try {
    const data = await fetchJson<any>("/api/msm/quality-scores");
    return data;
  } catch {
    const { msmQualityData } = await import("./mock-data");
    return msmQualityData;
  }
}

export async function fetchMsmValidationStatus() {
  try {
    const data = await fetchJson<any>("/api/msm/validation-status");
    return data;
  } catch {
    const { msmValidationData } = await import("./mock-data");
    return msmValidationData;
  }
}

export async function fetchMsmSignals() {
  try {
    const data = await fetchJson<any>("/api/msm/signals");
    return data;
  } catch {
    const { msmSignalsData } = await import("./mock-data");
    return msmSignalsData;
  }
}

export async function fetchMsmParameters() {
  try {
    const data = await fetchJson<any>("/api/msm/parameters");
    return data;
  } catch {
    const { msmParametersData } = await import("./mock-data");
    return msmParametersData;
  }
}

export async function fetchMsmCoordination() {
  try {
    const data = await fetchJson<any>("/api/msm/coordination");
    return data;
  } catch {
    const { msmCoordinationData } = await import("./mock-data");
    return msmCoordinationData;
  }
}
