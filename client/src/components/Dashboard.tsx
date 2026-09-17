import React from 'react';
import type { DailySummary, HourlyPattern, AnomalyAlert, HouseholdProfile } from '../types';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  AreaChart,
  Area,
} from 'recharts';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Gauge,
  Home,
  ArrowRight,
  Info,
  Wrench,
  IndianRupee,
  Activity,
  Plus,
  Compass,
} from 'lucide-react';

interface DashboardProps {
  household: HouseholdProfile;
  summaries: DailySummary[];
  hourlyPattern: HourlyPattern[];
  alerts: AnomalyAlert[];
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  household,
  summaries,
  hourlyPattern,
  alerts,
  onNavigate,
}) => {
  const latestSummary = summaries[summaries.length - 1] || {
    total_liters: 540,
    min_night_flow: 0,
    per_capita_liters: 135,
    status: 'NORMAL',
  };

  // 7-day rolling average
  const last7Days = summaries.slice(-7);
  const avg7Day =
    last7Days.length > 0
      ? Math.round(last7Days.reduce((acc, s) => acc + s.total_liters, 0) / last7Days.length)
      : 540;

  const activeAlert = alerts.find((a) => a.active);
  const isLeak = !!activeAlert || latestSummary.status === 'LEAK_CONFIRMED';

  return (
    <div className="space-y-6">
      {/* Top Context & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-semibold text-zinc-950 tracking-tight">{household.name}</h1>
            <span className="badge-neutral font-mono">{household.water_source}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
            <span className="flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-zinc-400" />
              {household.dwelling_type} ({household.residents} occupants)
            </span>
            <span>•</span>
            <span>Target: {household.target_lpcd} LPCD (CPHEEO Indian Municipal Baseline)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('logger')}
            className="btn-primary"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Reading</span>
          </button>
          <button
            onClick={() => onNavigate('leak-suite')}
            className="btn-secondary text-zinc-700"
          >
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>Evaluation Suite</span>
          </button>
        </div>
      </div>

      {/* Active Anomaly Alert Banner (Authoritative Engineering Dispatch) */}
      {activeAlert && (
        <div className="panel border-l-4 border-l-rose-600 p-4 sm:p-5 text-zinc-900 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="badge-alert uppercase font-mono tracking-wider">
                      {activeAlert.severity} Alert
                    </span>
                    <span className="text-xs font-mono text-zinc-400">ID: {activeAlert.id}</span>
                  </div>
                  <h2 className="text-base font-semibold text-zinc-950 mt-1">
                    Continuous Water Loss Detected: {activeAlert.estimated_leak_lph} Liters/Hour
                  </h2>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="bg-zinc-50 px-3 py-1.5 rounded border border-zinc-200">
                    <span className="text-zinc-500 block text-[10px] uppercase">Projected Loss</span>
                    <span className="text-sm font-semibold text-rose-700">
                      {Math.round(activeAlert.daily_loss_liters * 30).toLocaleString()} L/mo
                    </span>
                  </div>
                  <div className="bg-zinc-50 px-3 py-1.5 rounded border border-zinc-200">
                    <span className="text-zinc-500 block text-[10px] uppercase">Extra Tariff Cost</span>
                    <span className="text-sm font-semibold text-zinc-900 flex items-center">
                      <IndianRupee className="w-3 h-3 text-zinc-500" />
                      {activeAlert.monthly_cost_inr.toFixed(0)}/mo
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-zinc-50/70 rounded border border-zinc-200/80">
                  <span className="font-semibold text-zinc-800 flex items-center gap-1.5 mb-1">
                    <Info className="w-3.5 h-3.5 text-zinc-500" /> Probable Technical Cause
                  </span>
                  <p className="text-zinc-600 leading-relaxed">{activeAlert.probable_cause}</p>
                </div>
                <div className="p-3 bg-zinc-50/70 rounded border border-zinc-200/80">
                  <span className="font-semibold text-zinc-800 flex items-center gap-1.5 mb-1">
                    <Wrench className="w-3.5 h-3.5 text-zinc-500" /> Action Recommendation
                  </span>
                  <p className="text-zinc-600 leading-relaxed">{activeAlert.action_recommendation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integrated Telemetry Overview Strip (No Card-itis) */}
      <div className="panel divide-y sm:divide-y-0 sm:divide-x divide-zinc-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Today's Volume */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span className="font-medium">Today's Consumption</span>
            <Gauge className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-semibold text-zinc-950 font-mono tracking-tight tabular-nums">
              {latestSummary.total_liters.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-500 font-medium">Liters</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
            <Activity className="w-3.5 h-3.5 text-zinc-400" />
            <span>7-Day Baseline: <strong className="text-zinc-700 font-mono">{avg7Day} L</strong></span>
          </div>
        </div>

        {/* Metric 2: Per Capita LPCD */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span className="font-medium">Per Capita Daily (LPCD)</span>
            <span className="text-[11px] font-mono text-zinc-400">{household.residents} occupants</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-semibold text-zinc-950 font-mono tracking-tight tabular-nums">
              {latestSummary.per_capita_liters.toFixed(1)}
            </span>
            <span className="text-xs text-zinc-500 font-medium">L/person/day</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-zinc-500">Target: 135 LPCD</span>
            <span className={latestSummary.per_capita_liters <= 135 ? 'badge-normal' : 'badge-caution'}>
              {latestSummary.per_capita_liters <= 135 ? 'Target Met' : `+${(latestSummary.per_capita_liters - 135).toFixed(0)} L`}
            </span>
          </div>
        </div>

        {/* Metric 3: Minimum Night Flow */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span className="font-medium">Minimum Night Flow (MNF)</span>
            <Clock className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className={`text-2xl font-semibold font-mono tracking-tight tabular-nums ${
              latestSummary.min_night_flow >= 5.0 ? 'text-rose-600' : 'text-zinc-950'
            }`}>
              {latestSummary.min_night_flow.toFixed(1)}
            </span>
            <span className="text-xs text-zinc-500 font-medium">L/h (01:00-04:30)</span>
          </div>
          <div className="mt-2 text-xs">
            {latestSummary.min_night_flow < 5.0 ? (
              <span className="badge-normal">
                <CheckCircle2 className="w-3 h-3" /> Quiescent (Zero Leak Floor)
              </span>
            ) : (
              <span className="badge-alert">
                <AlertTriangle className="w-3 h-3" /> Continuous Night Flow
              </span>
            )}
          </div>
        </div>

        {/* Metric 4: Sentinel Status */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span className="font-medium">Hydraulic Sentinel State</span>
            <span className="text-[11px] font-mono text-zinc-400">Automated</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className={`text-base font-semibold ${
              isLeak ? 'text-rose-700' : 'text-emerald-700'
            }`}>
              {isLeak ? 'Leak Alert Active' : 'Normal / Quiescent'}
            </span>
          </div>
          <div className="mt-2 text-xs text-zinc-500">
            {isLeak ? (
              <span className="text-rose-700 font-medium">Immediate check recommended</span>
            ) : (
              <span>Transient spikes filtered</span>
            )}
          </div>
        </div>
      </div>

      {/* Chart 1: 30-Day Daily Consumption & Minimum Night Flow */}
      <div className="panel p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-100 gap-2">
          <div>
            <h2 className="text-sm font-semibold text-zinc-950">
              30-Day Daily Consumption & Minimum Night Flow (MNF)
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Bars denote aggregate daily liters. Step line denotes continuous flow floor between 01:00 and 04:30 AM.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-600 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-sky-600 rounded-xs"></span>
              <span>Normal Day</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-xs"></span>
              <span>Daytime Spike (Laundry)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-rose-600 rounded-xs"></span>
              <span>Confirmed Leak</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 bg-rose-800"></span>
              <span>Night Flow Rate</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={summaries} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 3" stroke="#f4f4f5" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => d.slice(5)}
                stroke="#a1a1aa"
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                stroke="#a1a1aa"
                fontSize={11}
                tickLine={false}
                label={{ value: 'Daily Total (L)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#71717a' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#b91c1c"
                fontSize={11}
                tickLine={false}
                domain={[0, 60]}
                label={{ value: 'MNF (L/h)', angle: 90, position: 'insideRight', fontSize: 10, fill: '#b91c1c' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as DailySummary;
                    return (
                      <div className="bg-zinc-900 text-white text-xs p-3 rounded shadow-lg border border-zinc-800 space-y-1">
                        <p className="font-semibold text-zinc-200">{data.date}</p>
                        <p className="text-sky-400 font-mono">Daily Total: {data.total_liters} L ({data.per_capita_liters} LPCD)</p>
                        <p className="text-rose-400 font-mono">Min Night Flow: {data.min_night_flow.toFixed(1)} L/h</p>
                        <p className="text-zinc-400 font-mono text-[11px] pt-1 border-t border-zinc-800">
                          Classification: {data.status}
                        </p>
                        {data.flagged_reason && (
                          <p className="text-amber-300 text-[11px] max-w-xs">{data.flagged_reason}</p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine yAxisId="left" y={540} stroke="#cbd5e1" strokeDasharray="3 3" />
              <ReferenceLine yAxisId="right" y={5.0} stroke="#dc2626" strokeDasharray="2 2" />
              <Bar
                yAxisId="left"
                dataKey="total_liters"
                name="Daily Total"
                shape={(props: any) => {
                  const { x, y, width, height, payload } = props;
                  let barColor = '#0284c7'; // normal blue
                  if (payload.status === 'ELEVATED_NORMAL') barColor = '#d97706'; // amber
                  if (payload.status === 'LEAK_CONFIRMED') barColor = '#dc2626'; // crimson
                  if (payload.status === 'LEAK_SUSPECTED') barColor = '#f43f5e';
                  return <rect x={x} y={y} width={width} height={height} rx={1} fill={barColor} />;
                }}
              />
              <Line
                yAxisId="right"
                type="stepAfter"
                dataKey="min_night_flow"
                stroke="#991b1b"
                strokeWidth={2}
                dot={false}
                name="Min Night Flow (L/h)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: 24-Hour Diurnal Demand Curve + Engineering Callout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Diurnal Demand Curve */}
        <div className="panel p-4 sm:p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h2 className="text-sm font-semibold text-zinc-950">24-Hour Diurnal Demand Curve</h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Observed domestic cycle with shaded 01:00-04:30 AM quiescent leak detection window.
              </p>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 bg-zinc-50 px-2 py-1 rounded border border-zinc-200">
              Quiescent Gate: 01:00 - 04:30
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyPattern} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 3" stroke="#f4f4f5" vertical={false} />
                <XAxis
                  dataKey="hour"
                  tickFormatter={(h) => `${h.toString().padStart(2, '0')}:00`}
                  stroke="#a1a1aa"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#a1a1aa"
                  fontSize={11}
                  tickLine={false}
                  label={{ value: 'Flow (L/h)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#71717a' }}
                />
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} L/h`, name === 'avg_liters' ? 'Average Flow' : 'Quiescent Floor']}
                  labelFormatter={(h) => (h != null ? `Hour ${h.toString().padStart(2, '0')}:00` : '')}
                />
                <ReferenceLine x={1} stroke="#dc2626" strokeDasharray="3 3" />
                <ReferenceLine x={4} stroke="#dc2626" strokeDasharray="3 3" />
                <Area
                  type="monotone"
                  dataKey="avg_liters"
                  stroke="#0284c7"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#areaGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="min_flow_liters"
                  stroke="#059669"
                  strokeWidth={1.5}
                  dot={false}
                  name="Quiescent Floor"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Panel: Engineering Rationale & Next Steps */}
        <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-950 border-b border-zinc-100 pb-2.5">
              Hydraulic Detection Principles
            </h3>
            <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
              Standard municipal water systems rely on <strong>Minimum Night Flow (MNF)</strong> between 01:00 and 04:30 AM when domestic human activity ceases.
            </p>

            <div className="mt-3 space-y-2 text-xs">
              <div className="p-2.5 bg-zinc-50/80 rounded border border-zinc-200">
                <span className="font-semibold text-zinc-800">Normal Intermittent Flow</span>
                <p className="text-zinc-600 mt-0.5">Meters halt completely between toilet flushes. Observed night floor = 0.0 L/h.</p>
              </div>

              <div className="p-2.5 bg-zinc-50/80 rounded border border-zinc-200">
                <span className="font-semibold text-zinc-800">Concealed Leak / Cistern Trickle</span>
                <p className="text-zinc-600 mt-0.5">Continuous discharge prevents meter from ever stopping (night floor &ge; 5.0 L/h).</p>
              </div>

              <div className="p-2.5 bg-zinc-50/80 rounded border border-zinc-200">
                <span className="font-semibold text-zinc-800">Transient Surge (Laundry/Guests)</span>
                <p className="text-zinc-600 mt-0.5">Elevated daytime volume, but drops to 0.0 L/h at night. Correctly ignored.</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100">
            <button
              onClick={() => onNavigate('cohorts')}
              className="w-full flex items-center justify-between text-xs font-semibold text-sky-700 hover:text-sky-900 transition-colors"
            >
              <span>Inspect Cohort Benchmarking</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
