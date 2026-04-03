// Mock data for Trading Dashboard — all realistic market values

// ============================================================
// UTILITY: Generate 30-day time series
// ============================================================
export function generate30DaySeries(
  startVal: number,
  endVal: number,
  volatility = 0.02
): { date: string; value: number }[] {
  const series: { date: string; value: number }[] = [];
  let val = startVal;
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    val = val + (endVal - val) / (i + 1) + (Math.random() - 0.5) * val * volatility;
    series.push({ date: dateStr, value: parseFloat(val.toFixed(2)) });
  }
  return series;
}

export function generateSparkline(base: number, volatility = 0.015, points = 20): number[] {
  const result: number[] = [];
  let v = base;
  for (let i = 0; i < points; i++) {
    v = v * (1 + (Math.random() - 0.5) * volatility * 2);
    result.push(parseFloat(v.toFixed(2)));
  }
  return result;
}

// ============================================================
// TAB 1: VOLATILITY REGIME
// ============================================================
export const volRegimeData = {
  regime: "HEDGED-ORDERLY",
  regimeColor: "amber" as const,
  timestamp: "2024-12-06 09:34:22 ET",

  kpis: [
    { label: "VIX Spot", value: "18.42", delta: "+0.73", deltaPct: "+4.13%", positive: false },
    { label: "S&P 500", value: "5,722.31", delta: "-23.45", deltaPct: "-0.41%", positive: false },
    { label: "WTI Crude", value: "68.24", delta: "+0.82", deltaPct: "+1.22%", positive: true },
    { label: "MOVE Index", value: "98.7", delta: "-2.10", deltaPct: "-2.08%", positive: true },
    { label: "VIXY", value: "23.45", delta: "+0.19", deltaPct: "+0.82%", positive: false },
    { label: "20d Real Vol", value: "14.2%", delta: "-0.3", deltaPct: "", positive: true },
    { label: "Impl/Real Spread", value: "4.2 pts", delta: "+0.5", deltaPct: "", positive: false },
    { label: "Term Structure", value: "Contango", delta: "", deltaPct: "", positive: true },
  ],

  vixLevel: 18.42,

  signals: [
    { name: "VIX Level", status: "amber", value: "18.42", note: "Above 15 threshold" },
    { name: "VIX 1-Day Change", status: "green", value: "+0.73", note: "Manageable move" },
    { name: "Term Structure", status: "green", value: "Contango", note: "Normal carry" },
    { name: "Impl-Real Spread", status: "amber", value: "4.2 pts", note: "Elevated premium" },
    { name: "MOVE Index", status: "green", value: "98.7", note: "Below 110 alert" },
    { name: "Oil (WTI)", status: "amber", value: "$68.24", note: "Near support" },
  ],

  vixSeries: generate30DaySeries(16.2, 18.42, 0.04),
  spxSeries: generate30DaySeries(5580, 5722.31, 0.008),
  termStructure: [
    { tenor: "Spot", value: 18.42 },
    { tenor: "1M", value: 19.1 },
    { tenor: "2M", value: 19.8 },
    { tenor: "3M", value: 20.3 },
    { tenor: "6M", value: 21.1 },
    { tenor: "1Y", value: 21.8 },
  ],
  implRealSeries: generate30DaySeries(3.2, 4.2, 0.05),

  forwardReturns: [
    { regime: "Complacent (VIX <15)", "1d": "+0.12%", "5d": "+0.61%", "20d": "+1.94%" },
    { regime: "Normal (15-20)", "1d": "+0.04%", "5d": "+0.21%", "20d": "+0.89%" },
    { regime: "Fear (20-30)", "1d": "-0.08%", "5d": "-0.42%", "20d": "-0.76%" },
    { regime: "Panic (30+)", "1d": "-0.31%", "5d": "-1.87%", "20d": "+2.14%" },
  ],

  events: [
    { time: "08:30", event: "Initial Jobless Claims", prior: "213K", consensus: "218K", actual: "220K", impact: "low" },
    { time: "10:00", event: "ISM Services PMI", prior: "54.8", consensus: "55.2", actual: "—", impact: "high" },
    { time: "14:00", event: "Fed Speak (Williams)", prior: "—", consensus: "—", actual: "—", impact: "medium" },
  ],

  narrative: `HEDGED-ORDERLY REGIME | VIX 18.42 — Volatility remains anchored in the 17-19 range as term structure holds in normal contango. The implied-realized spread of 4.2 pts suggests modest risk premium above fair value. MOVE Index pullback from 108 to 98.7 confirms rates vol is decompressing post-FOMC. SPX held the 5,700 gamma pin overnight — dealer positioning remains net long gamma near ATM. WTI at $68.24 is technically range-bound between $66-$72 support/resistance. Today's ISM Services print at 10:00 is the key catalyst. A beat above 56 could trigger a squeeze through 5,740; miss below 54 risks a vol spike toward 20.`,
};

// ============================================================
// TAB 2: DERIVATIVES DESK
// ============================================================
export const derivativesData = {
  scoreboard: [
    { instrument: "ZT", sector: "2Y Tsy", last: "102-14", change: "+0-04", changePct: "+0.12%", qtd: "+0.34%", volume: "342K", oi: "2.14M" },
    { instrument: "ZF", sector: "5Y Tsy", last: "107-08", change: "+0-06", changePct: "+0.18%", qtd: "+0.52%", volume: "289K", oi: "1.87M" },
    { instrument: "ZN", sector: "10Y Tsy", last: "110-12", change: "+0-10", changePct: "+0.31%", qtd: "+0.81%", volume: "467K", oi: "3.21M" },
    { instrument: "ZB", sector: "30Y Tsy", last: "118-24", change: "+0-24", changePct: "+0.76%", qtd: "+1.43%", volume: "198K", oi: "1.03M" },
    { instrument: "ES", sector: "S&P 500", last: "5722.25", change: "-23.00", changePct: "-0.40%", qtd: "+2.14%", volume: "1.23M", oi: "2.89M" },
    { instrument: "NQ", sector: "Nasdaq", last: "20,134.50", change: "-87.25", changePct: "-0.43%", qtd: "+3.21%", volume: "678K", oi: "984K" },
    { instrument: "RTY", sector: "Russell", last: "2,187.40", change: "-12.60", changePct: "-0.57%", qtd: "-0.82%", volume: "234K", oi: "412K" },
    { instrument: "VX", sector: "VIX Fut", last: "19.10", change: "+0.68", changePct: "+3.70%", qtd: "-4.23%", volume: "89K", oi: "342K" },
    { instrument: "MOVE", sector: "Rates Vol", last: "98.7", change: "-2.10", changePct: "-2.08%", qtd: "-8.14%", volume: "N/A", oi: "N/A" },
    { instrument: "DXY", sector: "USD Index", last: "104.23", change: "+0.34", changePct: "+0.33%", qtd: "+1.87%", volume: "N/A", oi: "N/A" },
    { instrument: "BTC", sector: "Crypto", last: "67,234", change: "+1,243", changePct: "+1.88%", qtd: "+12.4%", volume: "$34.2B", oi: "$18.4B" },
    { instrument: "ETH", sector: "Crypto", last: "3,456", change: "+78", changePct: "+2.31%", qtd: "+8.7%", volume: "$18.6B", oi: "$9.2B" },
  ],

  rates: {
    fedFunds: "5.25%",
    sofr: "5.31%",
    spread2s10s: "-42 bps",
    spread5s30s: "+18 bps",
    cpi: "3.2%",
    ppi: "2.1%",
    inflationBreakeven: "2.34%",
  },

  fedwatch: [
    { meeting: "Dec '24", hold: 82, cut25: 16, cut50: 2 },
    { meeting: "Jan '25", hold: 61, cut25: 33, cut50: 6 },
    { meeting: "Mar '25", hold: 34, cut25: 48, cut50: 18 },
    { meeting: "May '25", hold: 22, cut25: 51, cut50: 27 },
  ],

  vol: {
    vix: 18.42,
    move: 98.7,
    ratio: 0.187,
    structure: "Contango",
    skew: "Bearish (5pt skew)",
  },

  crypto: {
    btc: "$67,234",
    eth: "$3,456",
    ethBtcRatio: "0.0514",
    basisAnn: "8.2%",
    fundingRate: "+0.012%",
    btcDominance: "52.4%",
  },

  tradeSetups: [
    {
      id: 1,
      instrument: "ZN (10Y Tsy Futures)",
      direction: "Long",
      thesis: "Rate vol decompressing post-FOMC. 10Y yield approaching 4.35% resistance. Bond futures positioned for a breakout above 110-16 on ISM Services miss.",
      entry: "110-10",
      target: "111-04",
      stop: "109-28",
      rr: "2.3:1",
      score: 78,
    },
    {
      id: 2,
      instrument: "VX (VIX Futures)",
      direction: "Long",
      thesis: "December OpEx + holiday thin markets. VIX at 18 with a floor — positive carry has eroded. February contract at 20.2 offers convexity into year-end risk.",
      entry: "19.40",
      target: "22.50",
      stop: "17.80",
      rr: "1.8:1",
      score: 65,
    },
    {
      id: 3,
      instrument: "DXY (USD Index)",
      direction: "Short",
      thesis: "Dollar crowded long. Rate differentials compressing. ECB less dovish than priced. DXY overbought at 104.5 — tactical short to 102.80 support.",
      entry: "104.20",
      target: "102.80",
      stop: "104.95",
      rr: "1.9:1",
      score: 71,
    },
  ],
};

// ============================================================
// TAB 3: TRADER'S COCKPIT
// ============================================================
export const cockpitData = {
  gex: {
    ticker: "SPY",
    netGex: "$2.1B",
    gammaRegime: "Positive",
    callWall: 5800,
    putWall: 5600,
    maxPain: 5720,
    flipPoint: 5680,
    currentPrice: 5722,
  },

  gexStrikes: [
    { strike: 5600, callGex: 0.3, putGex: -1.8 },
    { strike: 5620, callGex: 0.5, putGex: -1.2 },
    { strike: 5640, callGex: 0.8, putGex: -0.9 },
    { strike: 5660, callGex: 1.2, putGex: -0.6 },
    { strike: 5680, callGex: 1.8, putGex: -0.4 },
    { strike: 5700, callGex: 2.4, putGex: -0.3 },
    { strike: 5720, callGex: 3.1, putGex: -0.2 },
    { strike: 5740, callGex: 2.6, putGex: -0.1 },
    { strike: 5760, callGex: 1.9, putGex: -0.1 },
    { strike: 5780, callGex: 1.3, putGex: -0.05 },
    { strike: 5800, callGex: 3.8, putGex: -0.05 },
    { strike: 5820, callGex: 0.8, putGex: -0.02 },
  ],

  darkPoolPrints: [
    { time: "09:31:04", ticker: "SPY", price: "571.84", size: "$847M", exchange: "FINRA", type: "BLOCK" },
    { time: "09:33:22", ticker: "NVDA", price: "141.23", size: "$324M", exchange: "FINRA", type: "SWEEP" },
    { time: "09:41:11", ticker: "QQQ", price: "489.67", size: "$512M", exchange: "FINRA", type: "BLOCK" },
    { time: "09:48:33", ticker: "TSLA", price: "247.89", size: "$189M", exchange: "FINRA", type: "SWEEP" },
    { time: "09:52:17", ticker: "AAPL", price: "243.12", size: "$421M", exchange: "FINRA", type: "BLOCK" },
    { time: "09:57:44", ticker: "META", price: "587.34", size: "$267M", exchange: "FINRA", type: "SWEEP" },
    { time: "10:02:09", ticker: "MSFT", price: "432.87", size: "$384M", exchange: "FINRA", type: "BLOCK" },
    { time: "10:08:31", ticker: "AMZN", price: "213.45", size: "$298M", exchange: "FINRA", type: "SWEEP" },
  ],

  fearGauges: [
    { name: "VIX", value: 18.42, min: 0, max: 50, threshold: 20, unit: "", color: "amber" },
    { name: "MOVE", value: 98.7, min: 50, max: 200, threshold: 120, unit: "", color: "green" },
    { name: "Fear & Greed", value: 52, min: 0, max: 100, threshold: 40, unit: "", color: "green" },
    { name: "AAII Bull%", value: 41.3, min: 0, max: 100, threshold: 35, unit: "%", color: "green" },
    { name: "NAAIM Exp.", value: 78.4, min: 0, max: 200, threshold: 100, unit: "", color: "amber" },
    { name: "HY OAS", value: 312, min: 200, max: 800, threshold: 450, unit: "bps", color: "green" },
    { name: "VIX Term Sprd", value: 0.68, min: -3, max: 5, threshold: 2, unit: "", color: "green" },
  ],

  watchlistScanner: [
    { ticker: "NVDA", signal: "Gamma Squeeze", score: 94, reason: "Dark pool accumulation + IV rank 87 + call sweep $45M" },
    { ticker: "TSLA", signal: "Put Wall Test", score: 82, reason: "Approaching $240 put wall — heavy negative GEX zone" },
    { ticker: "META", signal: "Momentum Long", score: 79, reason: "Breaking 52w high + bullish flow + NAAIM rotation" },
    { ticker: "SPY", signal: "Pin Detected", score: 76, reason: "5720 max pain alignment — OpEx magnet effect" },
    { ticker: "QQQ", signal: "IV Crush", score: 71, reason: "Post-earnings IV crush trade. IV rank 72 → 25 expected" },
    { ticker: "AMZN", signal: "Dark Pool Alert", score: 68, reason: "$298M block at 213.45 — institutional accumulation" },
    { ticker: "IWM", signal: "Bearish Divergence", score: 62, reason: "RTY underperforming ES. Small-cap stress building" },
    { ticker: "GLD", signal: "Breakout Watch", score: 57, reason: "Gold above $2,650. DXY reversal could accelerate" },
  ],

  tradeSetups: [
    {
      name: "Pin Fade",
      ticker: "SPY",
      score: 82,
      direction: "Fade rally",
      thesis: "5,720 is max pain and major GEX flip. Sell any rip to 5,740 on light volume. OpEx pinning likely through Friday close.",
      entry: "5,738-5,742",
      target: "5,710",
      stop: "5,752",
      expiry: "0DTE Friday",
    },
    {
      name: "Long Vol",
      ticker: "VIX",
      score: 71,
      direction: "Long",
      thesis: "VIX at 18 with positive carry. Holiday thinning into year-end + geopolitical tail risk. Buy Feb VX calls for convexity.",
      entry: "19.40 (Feb VX)",
      target: "22.50",
      stop: "17.60",
      expiry: "Feb 2025",
    },
    {
      name: "Momentum Breakout",
      ticker: "NVDA",
      score: 94,
      direction: "Long",
      thesis: "Dark pool accumulation + gamma squeeze setup at $145. Call wall at $150 — if $142 breaks, squeeze to $148+.",
      entry: "$141.50-$142.00",
      target: "$148.00",
      stop: "$139.00",
      expiry: "Weekly",
    },
  ],
};

// ============================================================
// TAB 4: PREMARKET
// ============================================================
export const premarketData = {
  regime: {
    label: "RISK-ON",
    color: "green" as const,
    vix: "18.42 (Contango)",
    putCall: "0.82 (Neutral)",
    crossAsset: "BTC +1.9%, Gold +0.4%, Oil +1.2%",
    summary: "Futures pointing higher. APAC equity markets closed mixed; European bourses up 0.3-0.5%. Credit spreads stable.",
  },

  indexLevels: [
    {
      index: "SPX", value: "5,722", change: "-0.41%", positive: false,
      support: ["5,680 (GEX flip)", "5,650 (200 DMA)", "5,600 (put wall)"],
      resistance: ["5,740 (prior high)", "5,760 (options OI)", "5,800 (call wall)"],
      overnightHigh: "5,731", overnightLow: "5,698",
    },
    {
      index: "QQQ", value: "489.67", change: "-0.43%", positive: false,
      support: ["485 (GEX flip)", "481 (50 DMA)", "475 (put wall)"],
      resistance: ["493 (call OI)", "497 (52w high)", "500 (call wall)"],
      overnightHigh: "491.2", overnightLow: "487.3",
    },
    {
      index: "IWM", value: "218.74", change: "-0.57%", positive: false,
      support: ["215 (support cluster)", "210 (200 DMA)"],
      resistance: ["223 (resistance)", "228 (52w high)"],
      overnightHigh: "219.8", overnightLow: "217.1",
    },
    {
      index: "DIA", value: "434.12", change: "-0.22%", positive: false,
      support: ["430 (key level)", "425 (200 DMA)"],
      resistance: ["437 (call OI)", "440 (call wall)"],
      overnightHigh: "435.0", overnightLow: "432.5",
    },
  ],

  optionsFlow: {
    gexRegime: "Positive GEX — Long Gamma. Dealers will sell rips, buy dips.",
    zeroDteHotspots: ["5720 (max pain pin)", "5700 (high put OI)", "5750 (call resistance)"],
    unusualActivity: [
      { ticker: "NVDA", type: "Call Sweep", strike: "$145", exp: "Fri", size: "3,200 contracts", premium: "$4.8M" },
      { ticker: "SPY", type: "Put Buy", strike: "$570", exp: "Fri", size: "8,400 contracts", premium: "$6.2M" },
      { ticker: "META", type: "Call Buy", strike: "$600", exp: "Dec 20", size: "1,850 contracts", premium: "$3.1M" },
    ],
    putCallRatio: "0.82",
  },

  heatmap: [
    { ticker: "AAPL", change: +0.82 }, { ticker: "MSFT", change: -0.34 }, { ticker: "NVDA", change: +2.14 }, { ticker: "AMZN", change: -0.67 }, { ticker: "GOOGL", change: +0.43 },
    { ticker: "META", change: +1.23 }, { ticker: "TSLA", change: -1.87 }, { ticker: "BRK.B", change: +0.21 }, { ticker: "LLY", change: +0.56 }, { ticker: "V", change: -0.12 },
    { ticker: "JPM", change: +0.34 }, { ticker: "WMT", change: +0.87 }, { ticker: "UNH", change: -0.43 }, { ticker: "XOM", change: +1.12 }, { ticker: "MA", change: -0.23 },
    { ticker: "PG", change: +0.18 }, { ticker: "COST", change: +0.64 }, { ticker: "HD", change: -0.51 }, { ticker: "JNJ", change: +0.09 }, { ticker: "NFLX", change: +1.87 },
    { ticker: "BAC", change: -0.28 }, { ticker: "CRM", change: +0.94 }, { ticker: "AMD", change: +1.43 }, { ticker: "ORCL", change: +0.72 }, { ticker: "ABBV", change: -0.34 },
  ],

  earningsMovers: [
    { ticker: "AVGO", timing: "PM Yest.", eps: "$1.42 vs $1.39E", rev: "$14.1B vs $13.9BE", move: "+6.2%", positive: true },
    { ticker: "COST", timing: "AM Today", eps: "$3.78 vs $3.74E", rev: "$60.4B vs $60.1BE", move: "+1.4%", positive: true },
    { ticker: "DOCU", timing: "PM Yest.", eps: "$0.90 vs $0.87E", rev: "$743M vs $738ME", move: "+8.3%", positive: true },
    { ticker: "GME", timing: "PM Yest.", eps: "-$0.02 vs -$0.01E", rev: "$780M vs $793ME", move: "-3.7%", positive: false },
  ],

  economicCalendar: [
    { time: "08:30", event: "Initial Jobless Claims", prior: "213K", consensus: "218K", actual: "220K", impact: "low", surprise: "bearish" },
    { time: "10:00", event: "ISM Services PMI", prior: "54.8", consensus: "55.2", actual: "—", impact: "high", surprise: "—" },
    { time: "10:30", event: "EIA Natural Gas Storage", prior: "-22 Bcf", consensus: "-18 Bcf", actual: "—", impact: "medium", surprise: "—" },
    { time: "14:00", event: "Fed Speak (Williams - NY)", prior: "—", consensus: "—", actual: "—", impact: "medium", surprise: "—" },
    { time: "15:00", event: "Consumer Credit", prior: "$6.0B", consensus: "$8.5B", actual: "—", impact: "low", surprise: "—" },
  ],

  macroCatalysts: [
    "CHINA: PBOC unexpectedly held rates at 3.45%, disappointing stimulus expectations. Hang Seng -0.8%",
    "EUROPE: ECB Lagarde speech today at 11:00 ET — market expects dovish pivot hints",
    "TARIFFS: US-China phase 2 trade talks to resume next week per Commerce Dept statement",
    "GEOPOLITICS: Red Sea shipping routes still disrupted — Baltic Dry Index +3.2% WoW",
    "TREASURY: $25B 30Y bond auction today at 1PM — demand critical for rate vol",
  ],

  tradeSetups: [
    {
      ticker: "NVDA",
      direction: "Long",
      entry: "$141.50 break + hold",
      target: "$148.00",
      stop: "$139.00",
      rr: "2.4:1",
      thesis: "Dark pool accumulation + gamma squeeze + earnings catalyst in 3 weeks. Call wall at $150.",
    },
    {
      ticker: "SPY 0DTE",
      direction: "Sell the rip",
      entry: "5,738-5,742",
      target: "5,710",
      stop: "5,752",
      rr: "2.0:1",
      thesis: "Max pain pin at 5,720 for Friday OpEx. Positive GEX — dealers will suppress range.",
    },
    {
      ticker: "GLD",
      direction: "Long",
      entry: "$265.00 on dip",
      target: "$272.00",
      stop: "$261.50",
      rr: "2.0:1",
      thesis: "Gold breaking multi-month resistance. DXY reversal catalyst. China central bank buying.",
    },
  ],

  doNotTouch: [
    { ticker: "NVAX", reason: "FDA decision pending — binary event. IV crush risk 60-80%." },
    { ticker: "SMCI", reason: "Auditor controversy ongoing. Liquidity risk + SEC scrutiny." },
    { ticker: "GME", reason: "Ryan Cohen tweet risk. Meme momentum fading. Earnings miss." },
    { ticker: "MSTR", reason: "BTC proxy with 3x leverage exposure. Too binary for controlled risk." },
    { ticker: "SPCE", reason: "Bankruptcy risk — cash runway under 90 days." },
  ],

  fearDashboard: {
    vix: { value: 18.42, regime: "Hedged-Orderly", color: "amber" },
    move: { value: 98.7, regime: "Calm", color: "green" },
    fearGreed: { value: 52, regime: "Neutral", color: "green" },
    aaii: { value: "41% Bull", regime: "Mildly Bullish", color: "green" },
    naaim: { value: 78.4, regime: "Elevated Exposure", color: "amber" },
    hyOas: { value: "312 bps", regime: "Tight", color: "green" },
    assessment: "Risk environment is HEDGED-ORDERLY. Complacency building but not extreme. Tactical risk-taking is appropriate with defined stops. Avoid leveraged longs ahead of this week's 30Y auction.",
  },
};

// ============================================================
// TAB 5: GULF ENERGY
// ============================================================
export const energyData = {
  commodities: [
    { name: "Brent Crude", symbol: "BZ=F", price: "$82.45", change: "+$0.97", changePct: "+1.19%", positive: true, sparkline: generateSparkline(79.5, 0.012) },
    { name: "WTI Crude", symbol: "CL=F", price: "$78.90", change: "+$0.71", changePct: "+0.91%", positive: true, sparkline: generateSparkline(76.1, 0.012) },
    { name: "Henry Hub Gas", symbol: "NG=F", price: "$2.34", change: "-$0.08", changePct: "-3.31%", positive: false, sparkline: generateSparkline(2.5, 0.025) },
    { name: "RBOB Gasoline", symbol: "RB=F", price: "$2.67", change: "+$0.01", changePct: "+0.38%", positive: true, sparkline: generateSparkline(2.62, 0.01) },
    { name: "Heating Oil", symbol: "HO=F", price: "$2.89", change: "+$0.02", changePct: "+0.70%", positive: true, sparkline: generateSparkline(2.83, 0.01) },
    { name: "3-2-1 Crack Spread", symbol: "CRACK", price: "$28.45", change: "+$0.59", changePct: "+2.12%", positive: true, sparkline: generateSparkline(26.2, 0.02) },
  ],

  watchlistTickers: [
    { ticker: "XOM", change: +1.12, sector: "Integrated" },
    { ticker: "CVX", change: +0.87, sector: "Integrated" },
    { ticker: "COP", change: +1.43, sector: "E&P" },
    { ticker: "EOG", change: +0.94, sector: "E&P" },
    { ticker: "PXD", change: +0.62, sector: "E&P" },
    { ticker: "SLB", change: +1.67, sector: "Services" },
    { ticker: "HAL", change: +2.14, sector: "Services" },
    { ticker: "BKR", change: +1.38, sector: "Services" },
    { ticker: "PSX", change: -0.34, sector: "Refining" },
    { ticker: "VLO", change: -0.82, sector: "Refining" },
    { ticker: "MPC", change: -0.47, sector: "Refining" },
    { ticker: "KMI", change: +0.23, sector: "Midstream" },
    { ticker: "ET", change: +0.41, sector: "Midstream" },
    { ticker: "WMB", change: +0.18, sector: "Midstream" },
    { ticker: "OKE", change: +0.56, sector: "Midstream" },
    { ticker: "DVN", change: +1.23, sector: "E&P" },
    { ticker: "FANG", change: +1.87, sector: "E&P" },
    { ticker: "OXY", change: +0.94, sector: "Integrated" },
    { ticker: "MRO", change: +0.73, sector: "E&P" },
    { ticker: "AAL", change: -1.23, sector: "Airlines" },
    { ticker: "DAL", change: -0.87, sector: "Airlines" },
    { ticker: "UAL", change: -1.41, sector: "Airlines" },
    { ticker: "LUV", change: -0.52, sector: "Airlines" },
  ],

  supplyShocks: [
    {
      headline: "Houthi Strikes Escalate — Tanker Diversion Accelerates",
      severity: "HIGH",
      severity_color: "red",
      summary: "Three additional tankers diverted around Cape of Good Hope. Suez Canal transits down 47% YoY. Daily cost impact estimated $1-1.2M per vessel rerouting.",
      affected: ["DHT", "STNG", "FRO", "TK"],
      date: "2024-12-06",
    },
    {
      headline: "Libya Sirte Basin Production Disruption",
      severity: "MEDIUM",
      severity_color: "amber",
      summary: "NOC reports 180,000 bpd offline at Sharara field following pipeline sabotage. Rival faction standoff ongoing. Resolution timeline unclear.",
      affected: ["XOM", "BP", "ENI"],
      date: "2024-12-05",
    },
    {
      headline: "Saudi Aramco Maintains $6B Share Buyback Despite OPEC+ Cuts",
      severity: "LOW",
      severity_color: "green",
      summary: "Aramco board approves extended buyback program. Signals fiscal comfort at current price deck. Bullish price signal for OPEC+ discipline.",
      affected: ["XOM", "CVX", "COP"],
      date: "2024-12-04",
    },
  ],

  exposureRankings: [
    { rank: 1, ticker: "HAL", price: "$38.24", change: "+2.14%", sector: "OFS", direction: "Long", thesis: "Oilfield services pricing power + international capex ramp" },
    { rank: 2, ticker: "SLB", price: "$47.83", change: "+1.67%", sector: "OFS", direction: "Long", thesis: "AI drilling tech + Mideast market share gains" },
    { rank: 3, ticker: "FANG", price: "$182.40", change: "+1.87%", sector: "E&P", direction: "Long", thesis: "Permian pure play + dividend growth + buybacks" },
    { rank: 4, ticker: "COP", price: "$118.72", change: "+1.43%", sector: "E&P", direction: "Long", thesis: "LNG exposure + Surmont ramp + balance sheet optionality" },
    { rank: 5, ticker: "DVN", price: "$42.15", change: "+1.23%", sector: "E&P", direction: "Long", thesis: "WPX synergies + variable dividend + Williston upside" },
    { rank: 6, ticker: "UAL", price: "$87.23", change: "-1.41%", sector: "Airlines", direction: "Short", thesis: "Fuel cost headwind + leisure demand softening" },
    { rank: 7, ticker: "AAL", price: "$14.67", change: "-1.23%", sector: "Airlines", direction: "Short", thesis: "Balance sheet stress + jet fuel unhedged exposure" },
    { rank: 8, ticker: "VLO", price: "$162.34", change: "-0.82%", sector: "Refining", direction: "Watch", thesis: "Crack spread compression. Margin outlook uncertain Q1" },
  ],

  hormuzSeries: generate30DaySeries(42, 28, 0.08),

  geopoliticalPulse: [
    { time: "09:15 ET", headline: "Iran seizes Greek-flagged tanker in Strait of Hormuz — 3rd incident this month", tags: ["Hormuz", "Iran", "Tankers"] },
    { time: "08:42 ET", headline: "Saudi Arabia extends 1M bpd voluntary cut through Q1 2025 — OPEC communique", tags: ["OPEC", "Saudi", "Production"] },
    { time: "07:30 ET", headline: "IEA raises 2025 demand forecast by 200K bpd on stronger China consumption", tags: ["IEA", "China", "Demand"] },
    { time: "06:15 ET", headline: "Russia-Ukraine pipeline gas flows to Europe halt — Slovakia dispute", tags: ["Russia", "Gas", "Europe"] },
    { time: "05:00 ET", headline: "Libya NOC declares force majeure at Sharara — 180K bpd offline", tags: ["Libya", "Supply Shock"] },
    { time: "Yesterday", headline: "Biden admin releases 5M bbls from SPR ahead of potential winter shortage", tags: ["SPR", "US Policy"] },
    { time: "Yesterday", headline: "Iraq production at 4.2M bpd, above OPEC quota — compliance concern", tags: ["Iraq", "OPEC", "Compliance"] },
  ],
};

// ============================================================
// PIPELINE: MSM → MC-Trading Unified Dashboard
// ============================================================

export const pipelineOverviewData = {
  status: "LIVE" as const,
  timestamp: "2024-12-06 09:34:22 ET",
  health: {
    msm_research: { status: "healthy" as const, label: "MSM Research", uptime: "99.8%", lastRun: "06:15 ET" },
    feature_pipeline: { status: "healthy" as const, label: "Feature Pipeline", uptime: "99.9%", lastRun: "09:30 ET" },
    signal_gen: { status: "warning" as const, label: "Signal Generator", uptime: "98.2%", lastRun: "09:29 ET" },
    mc_execution: { status: "healthy" as const, label: "MC-Trading Engine", uptime: "100%", lastRun: "Live" },
    ib_gateway: { status: "healthy" as const, label: "IB Gateway", uptime: "100%", lastRun: "Live" },
  },
  strategies: [
    { id: "fade_v21", name: "Fade v2.1", type: "MSM", status: "active", pnl_today: 847, pnl_total: 18420, trades_today: 3, win_rate: 68.2, ev_bps: 4.2, symbols: 21 },
    { id: "odpc_v13", name: "ODPC v1.3", type: "MSM", status: "active", pnl_today: 312, pnl_total: 9870, trades_today: 1, win_rate: 71.4, ev_bps: 5.1, symbols: 17 },
    { id: "vwap_mr_v31", name: "VWAP MR v3.1", type: "MSM", status: "active", pnl_today: -124, pnl_total: 14230, trades_today: 2, win_rate: 58.9, ev_bps: 3.8, symbols: 25 },
    { id: "orb", name: "ORB", type: "MC-Trading", status: "active", pnl_today: 1240, pnl_total: 22100, trades_today: 4, win_rate: 62.5, ev_bps: 6.2, symbols: 5 },
    { id: "momentum", name: "Momentum", type: "MC-Trading", status: "idle", pnl_today: 0, pnl_total: 5430, trades_today: 0, win_rate: 55.0, ev_bps: 2.8, symbols: 10 },
  ],
  live_positions: [
    { symbol: "NVDA", strategy: "ORB", side: "LONG", entry: 134.20, current: 135.84, qty: 100, pnl: 164, pnl_bps: 12.2 },
    { symbol: "AAPL", strategy: "Fade v2.1", side: "SHORT", entry: 243.10, current: 242.45, qty: 50, pnl: 32, pnl_bps: 2.7 },
  ],
  daily_pnl_series: Array.from({length: 20}, (_, i) => {
    const totalMinutes = 9 * 60 + 30 + i * 30; // start at 09:30, advance 30 min each step
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    return {
      time: `${hour}:${String(minute).padStart(2, "0")}`,
      value: Math.round((i < 10 ? i * 180 : 1800 + (i - 10) * 130) + (Math.random() - 0.4) * 200),
    };
  }),
  alerts: [
    { id: 1, severity: "warning" as const, message: "Signal generator latency elevated: 145ms (threshold: 100ms)", time: "09:28 ET" },
    { id: 2, severity: "info" as const, message: "ODPC v1.3: New trade signal generated for MSFT", time: "09:15 ET" },
    { id: 3, severity: "info" as const, message: "Feature pipeline: Daily rebuild complete (847 features)", time: "06:18 ET" },
  ],
};

export const msmResearchData = {
  strategies: [
    {
      id: "fade_v21",
      name: "Fade v2.1",
      description: "Breakout failure + order-flow exhaustion. Tick-level entry.",
      timeframe: "Tick",
      symbols: 21,
      status: "production" as const,
      ev_bps: 4.2,
      win_rate: 68.2,
      sharpe: 2.31,
      max_dd_pct: -3.8,
      total_trades: 1842,
      total_pnl_bps: 7732,
      last_updated: "2024-11-15",
      parameters: { stop_bps: 8, target_bps: 16, min_oi_ratio: 1.4, exhaustion_threshold: 0.72 },
      monthly_pnl: Array.from({length:12}, (_, i) => ({ month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i], pnl: Math.round((Math.random() - 0.3) * 800 + 400) })),
    },
    {
      id: "odpc_v13",
      name: "ODPC v1.3",
      description: "Opening drive pullback continuation. 1-minute bars.",
      timeframe: "1m",
      symbols: 17,
      status: "production" as const,
      ev_bps: 5.1,
      win_rate: 71.4,
      sharpe: 2.87,
      max_dd_pct: -2.9,
      total_trades: 968,
      total_pnl_bps: 4937,
      last_updated: "2024-11-20",
      parameters: { pullback_pct: 0.38, vol_filter: 1.2, min_drive_bps: 25, max_pullback_time: 8 },
      monthly_pnl: Array.from({length:12}, (_, i) => ({ month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i], pnl: Math.round((Math.random() - 0.2) * 600 + 350) })),
    },
    {
      id: "vwap_mr_v31",
      name: "VWAP MR v3.1",
      description: "VWAP mean reversion, shorts only. 5-minute bars.",
      timeframe: "5m",
      symbols: 25,
      status: "production" as const,
      ev_bps: 3.8,
      win_rate: 58.9,
      sharpe: 1.94,
      max_dd_pct: -5.2,
      total_trades: 2314,
      total_pnl_bps: 8793,
      last_updated: "2024-11-28",
      parameters: { vwap_dev_threshold: 1.8, rsi_overbought: 72, vol_ratio_min: 1.1, max_hold_bars: 6 },
      monthly_pnl: Array.from({length:12}, (_, i) => ({ month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i], pnl: Math.round((Math.random() - 0.35) * 900 + 300) })),
    },
  ],
  recent_backtests: [
    { id: "bt_001", strategy: "Fade v2.1", date: "2024-12-05", period: "2024-01 to 2024-11", ev_bps: 4.2, sharpe: 2.31, trades: 1842, status: "passed" as const },
    { id: "bt_002", strategy: "ODPC v1.3", date: "2024-12-04", period: "2024-06 to 2024-11", ev_bps: 5.1, sharpe: 2.87, trades: 492, status: "passed" as const },
    { id: "bt_003", strategy: "VWAP MR v3.1", date: "2024-12-03", period: "2024-01 to 2024-11", ev_bps: 3.8, sharpe: 1.94, trades: 2314, status: "passed" as const },
    { id: "bt_004", strategy: "Fade v2.2 (dev)", date: "2024-12-02", period: "2024-09 to 2024-11", ev_bps: 2.1, sharpe: 1.12, trades: 284, status: "failed" as const },
  ],
};

export const mcExecutionData = {
  mode: "PAPER" as const,
  connected: true,
  timestamp: "2024-12-06 09:34:22 ET",
  strategies: [
    {
      name: "ORB (Opening Range Breakout)",
      status: "active" as const,
      symbols: ["NVDA", "AAPL", "TSLA", "MSFT", "AMZN"],
      trades_today: 4,
      pnl_today: 1240,
      win_rate_today: 75.0,
      classifier_score: 0.847,
      model_version: "rf_v2.3",
    },
    {
      name: "Event (Micro-Move Detection)",
      status: "monitoring" as const,
      symbols: ["NVDA", "AAPL", "META"],
      trades_today: 0,
      pnl_today: 0,
      win_rate_today: 0,
      classifier_score: 0.612,
      model_version: "event_v1.1",
    },
    {
      name: "Momentum (SMA Crossover)",
      status: "idle" as const,
      symbols: ["SPY", "QQQ"],
      trades_today: 0,
      pnl_today: 0,
      win_rate_today: 0,
      classifier_score: 0.0,
      model_version: "mom_v1.0",
    },
  ],
  live_positions: [
    { symbol: "NVDA", side: "LONG" as const, entry: 134.20, current: 135.84, qty: 100, pnl: 164, stop: 133.10, target: 136.80, time_in_trade: "14m" },
    { symbol: "AAPL", side: "LONG" as const, entry: 241.50, current: 242.10, qty: 75, pnl: 45, stop: 240.20, target: 243.80, time_in_trade: "6m" },
  ],
  order_log: [
    { time: "09:31:42", symbol: "NVDA", action: "BUY", qty: 100, price: 134.20, status: "FILLED" as const, strategy: "ORB" },
    { time: "09:32:15", symbol: "TSLA", action: "BUY", qty: 50, price: 248.70, status: "FILLED" as const, strategy: "ORB" },
    { time: "09:33:08", symbol: "TSLA", action: "SELL", qty: 50, price: 250.10, status: "FILLED" as const, strategy: "ORB" },
    { time: "09:33:45", symbol: "AAPL", action: "BUY", qty: 75, price: 241.50, status: "FILLED" as const, strategy: "ORB" },
    { time: "09:34:10", symbol: "MSFT", action: "BUY", qty: 60, price: 421.30, status: "PENDING" as const, strategy: "ORB" },
  ],
  pnl_series: Array.from({length: 25}, (_, i) => ({
    time: `09:${String(30 + i).padStart(2, "0")}`,
    pnl: Math.round(i * 52 + (Math.random() - 0.3) * 100),
    cumulative: Math.round(i * 52 * 1.1),
  })),
  risk: {
    gross_exposure: 42840,
    net_exposure: 35200,
    var_1d: 1240,
    max_position_size: 15000,
    daily_loss_limit: 5000,
    current_drawdown: 0,
  },
};

export const riskMonitorData = {
  overall_risk: "LOW" as const,
  timestamp: "2024-12-06 09:34:22 ET",
  pipeline_risk: {
    msm_model_drift: 0.12,
    feature_staleness_hours: 0.08,
    signal_confidence_avg: 0.847,
    execution_slippage_bps: 1.4,
  },
  portfolio_risk: {
    gross_exposure: 42840,
    net_exposure: 35200,
    var_1d: 1240,
    beta_adj_exposure: 38200,
    concentration_top3_pct: 47.2,
    correlation_avg: 0.34,
  },
  strategy_risk: [
    { strategy: "Fade v2.1", current_dd: -1.2, max_allowed_dd: -8.0, trades_today: 3, stop_hit_rate: 31.8, health: "good" as const },
    { strategy: "ODPC v1.3", current_dd: -0.4, max_allowed_dd: -6.0, trades_today: 1, stop_hit_rate: 28.6, health: "good" as const },
    { strategy: "VWAP MR v3.1", current_dd: -3.1, max_allowed_dd: -10.0, trades_today: 2, stop_hit_rate: 41.1, health: "warning" as const },
    { strategy: "ORB", current_dd: 0.0, max_allowed_dd: -5.0, trades_today: 4, stop_hit_rate: 25.0, health: "good" as const },
  ],
  alerts: [
    { severity: "warning" as const, message: "VWAP MR v3.1: Stop hit rate 41.1% above 40% threshold today", time: "09:22 ET" },
    { severity: "info" as const, message: "Gross exposure within normal range ($42.8K)", time: "09:15 ET" },
    { severity: "info" as const, message: "All strategy drawdowns within limits", time: "09:00 ET" },
  ],
};

export const portfolioAnalyticsData = {
  period: "YTD 2024",
  total_pnl: 64050,
  total_pnl_bps: 41372,
  sharpe_ratio: 2.28,
  max_drawdown_pct: -4.2,
  win_rate: 64.8,
  total_trades: 7124,
  strategy_attribution: [
    { strategy: "Fade v2.1", pnl: 18420, pnl_pct: 28.8, contribution_bps: 11902, trades: 1842 },
    { strategy: "ODPC v1.3", pnl: 9870, pnl_pct: 15.4, contribution_bps: 6369, trades: 968 },
    { strategy: "VWAP MR v3.1", pnl: 14230, pnl_pct: 22.2, contribution_bps: 9192, trades: 2314 },
    { strategy: "ORB", pnl: 22100, pnl_pct: 34.5, contribution_bps: 14279, trades: 1842 },
    { strategy: "Momentum", pnl: -570, pnl_pct: -0.9, contribution_bps: -368, trades: 158 },
  ],
  monthly_pnl: Array.from({length:11}, (_, i) => ({
    month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov"][i],
    pnl: Math.round((Math.random() - 0.15) * 8000 + 5000),
    fade: Math.round((Math.random() - 0.2) * 2000 + 1200),
    odpc: Math.round((Math.random() - 0.2) * 1500 + 700),
    vwap: Math.round((Math.random() - 0.25) * 2200 + 1000),
    orb: Math.round((Math.random() - 0.1) * 3000 + 2000),
  })),
  equity_curve: Array.from({length: 240}, (_, i) => ({
    day: i + 1,
    value: 100000 + Math.round(i * 270 + (Math.random() - 0.3) * 800),
  })),
};


// ============================================================
// MSM QUALITY SCORES
// ============================================================
export const msmQualityData = {
  timestamp: "2024-12-06 09:34:00 ET",
  scores: [
    { strategy: "ODPC v1.3", overall: 92.1, code_quality: 94.0, performance_quality: 93.5, compliance_quality: 88.8, rank: 1, grade: "A", recommendations: [] },
    { strategy: "Fade v2.1", overall: 87.4, code_quality: 91.0, performance_quality: 88.2, compliance_quality: 83.0, rank: 2, grade: "B", recommendations: ["Consider tightening compliance thresholds"] },
    { strategy: "VWAP MR v3.1", overall: 78.6, code_quality: 82.0, performance_quality: 75.4, compliance_quality: 78.4, rank: 3, grade: "C", recommendations: ["Improve drawdown controls", "Increase test coverage"] },
  ],
};

// ============================================================
// MSM VALIDATION STATUS
// ============================================================
export const msmValidationData = {
  timestamp: "2024-12-06 09:34:00 ET",
  summary: { total: 3, passing: 3, failing: 0 },
  results: [
    {
      strategy: "Fade v2.1", level: "GOLD", score: 96, passed: true,
      rule_results: [
        { rule_id: "R001", severity: "ERROR", passed: true, description: "Max drawdown within limits" },
        { rule_id: "R002", severity: "WARNING", passed: true, description: "Win rate above minimum threshold" },
        { rule_id: "R003", severity: "ERROR", passed: true, description: "Risk controls present" },
      ],
      issues: 0,
    },
    {
      strategy: "ODPC v1.3", level: "GOLD", score: 98, passed: true,
      rule_results: [
        { rule_id: "R001", severity: "ERROR", passed: true, description: "Max drawdown within limits" },
        { rule_id: "R002", severity: "WARNING", passed: true, description: "Win rate above minimum threshold" },
        { rule_id: "R003", severity: "ERROR", passed: true, description: "Risk controls present" },
      ],
      issues: 0,
    },
    {
      strategy: "VWAP MR v3.1", level: "SILVER", score: 84, passed: true,
      rule_results: [
        { rule_id: "R001", severity: "ERROR", passed: true, description: "Max drawdown within limits" },
        { rule_id: "R002", severity: "WARNING", passed: false, description: "Win rate below recommended 65%" },
        { rule_id: "R003", severity: "ERROR", passed: true, description: "Risk controls present" },
      ],
      issues: 1,
    },
  ],
};

// ============================================================
// MSM SIGNALS
// ============================================================
export const msmSignalsData = {
  timestamp: "2024-12-06 09:34:00 ET",
  count: 8,
  export_dir: "/home/ubuntu/msm/out/signals",
  signals: [
    { id: "sig_001", strategy: "Fade v2.1", symbol: "AAPL", side: "SHORT", entry_price: 192.34, signal_time: "09:31:14", confidence: 0.82, ev_bps: 4.2, status: "filled" },
    { id: "sig_002", strategy: "ODPC v1.3", symbol: "NVDA", side: "LONG", entry_price: 487.21, signal_time: "09:32:08", confidence: 0.91, ev_bps: 5.8, status: "filled" },
    { id: "sig_003", strategy: "VWAP MR v3.1", symbol: "TSLA", side: "SHORT", entry_price: 241.50, signal_time: "09:35:22", confidence: 0.74, ev_bps: 3.4, status: "pending" },
    { id: "sig_004", strategy: "Fade v2.1", symbol: "META", side: "SHORT", entry_price: 558.73, signal_time: "09:38:47", confidence: 0.79, ev_bps: 3.9, status: "filled" },
    { id: "sig_005", strategy: "ODPC v1.3", symbol: "MSFT", side: "LONG", entry_price: 421.18, signal_time: "09:41:03", confidence: 0.88, ev_bps: 5.1, status: "filled" },
    { id: "sig_006", strategy: "VWAP MR v3.1", symbol: "AMD", side: "SHORT", entry_price: 148.32, signal_time: "09:44:17", confidence: 0.71, ev_bps: 3.1, status: "cancelled" },
    { id: "sig_007", strategy: "Fade v2.1", symbol: "GOOGL", side: "SHORT", entry_price: 172.81, signal_time: "09:48:52", confidence: 0.85, ev_bps: 4.7, status: "filled" },
    { id: "sig_008", strategy: "ODPC v1.3", symbol: "AMZN", side: "LONG", entry_price: 224.65, signal_time: "09:51:29", confidence: 0.93, ev_bps: 6.1, status: "filled" },
  ],
};

// ============================================================
// MSM PARAMETERS
// ============================================================
export const msmParametersData = {
  timestamp: "2024-12-06 09:34:00 ET",
  strategies: [
    {
      strategy: "Fade v2.1", version: "v2.1.3",
      parameters: { stop_bps: 8, target_bps: 16, min_oi_ratio: 1.4, exhaustion_threshold: 0.72 },
      last_updated: "2024-11-15 14:32:10", source: "optimization",
    },
    {
      strategy: "ODPC v1.3", version: "v1.3.1",
      parameters: { pullback_pct: 0.38, vol_filter: 1.2, min_drive_bps: 25, max_pullback_time: 8 },
      last_updated: "2024-11-20 09:15:44", source: "manual",
    },
    {
      strategy: "VWAP MR v3.1", version: "v3.1.2",
      parameters: { vwap_dev_threshold: 1.8, rsi_overbought: 72, vol_ratio_min: 1.1, max_hold_bars: 6 },
      last_updated: "2024-11-28 11:07:22", source: "optimization",
    },
  ],
};

// ============================================================
// MSM COORDINATION
// ============================================================
export const msmCoordinationData = {
  timestamp: "2024-12-06 09:34:00 ET",
  strategies: [
    { strategy: "Fade v2.1", active: true, healthy: true, heartbeat_age_s: 2.1, latency_p99_ms: 4.2, published_count: 847, dropped_count: 0 },
    { strategy: "ODPC v1.3", active: true, healthy: true, heartbeat_age_s: 1.8, latency_p99_ms: 3.7, published_count: 412, dropped_count: 1 },
    { strategy: "VWAP MR v3.1", active: true, healthy: true, heartbeat_age_s: 3.4, latency_p99_ms: 5.1, published_count: 1203, dropped_count: 2 },
  ],
  conflict_resolution: { mode: "priority_rank", conflicts_today: 3, resolved: 3 },
  zmq_status: { publisher_bound: true, control_channel: true, endpoint: "tcp://localhost:5557" },
};
