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
  AlertOctagon,
  CheckCircle2,
  TrendingUp,
  Clock,
  Gauge,
  Home,
  ArrowRight,
  Info,
  Wrench,
  IndianRupee,
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
      {/* Top Banner / Household Context */}
      <div className="bg-white border border-slate-200 rounded p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{household.name}</h1>
            <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-300 rounded font-medium">
              {household.water_source}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-1">
            <span className="flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-slate-400" />
              {household.dwelling_type} ({household.residents} occupants)
            </span>
            <span>•</span>
            <span>Target: {household.target_lpcd} LPCD (CPHEEO Indian Municipal Standard)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('logger')}
            className="btn-primary"
          >
            Record Meter Reading
          </button>
          <button
            onClick={() => onNavigate('leak-suite')}
            className="btn-secondary text-amber-700 border-amber-300 hover:bg-amber-50"
          >
            Reviewer Leak Harness
          </button>
        </div>
      </div>

      {/* Active Anomaly Alert Banner (If present) */}
      {activeAlert && (
        <div className="bg-rose-50 border border-rose-300 rounded p-4 sm:p-5 text-slate-900">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                    {activeAlert.severity} Alert: Persistent Flow Anomaly
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">
                    Continuous Water Loss Detected ({activeAlert.estimated_leak_lph} Liters/Hour)
                  </h2>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <p className="text-xs text-slate-500">Projected Monthly Waste</p>
                    <p className="text-base font-bold text-rose-700">
                      {Math.round(activeAlert.daily_loss_liters * 30).toLocaleString()} Liters
                    </p>
                  </div>
                  <div className="border-l border-rose-200 pl-3">
                    <p className="text-xs text-slate-500">Estimated Extra Cost</p>
                    <p className="text-base font-bold text-slate-900 flex items-center justify-end">
                      <IndianRupee className="w-4 h-4 text-slate-700" />
                      {activeAlert.monthly_cost_inr.toFixed(0)}/mo
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="bg-white/80 p-3 rounded border border-rose-200">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                    <Info className="w-3.5 h-3.5 text-rose-600" /> Probable Technical Cause
                  </span>
                  <p className="text-slate-700 leading-relaxed">{activeAlert.probable_cause}</p>
                </div>
                <div className="bg-white/80 p-3 rounded border border-rose-200">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                    <Wrench className="w-3.5 h-3.5 text-sky-600" /> Action Recommendation
                  </span>
                  <p className="text-slate-700 leading-relaxed">{activeAlert.action_recommendation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Consumption */}
        <div className="card-base p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Today's Consumption</span>
            <Gauge className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {latestSummary.total_liters.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">Liters</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-600">7-Day Mean: {avg7Day} L</span>
          </div>
        </div>

        {/* Card 2: Per Capita Usage */}
        <div className="card-base p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Per Capita Daily (LPCD)</span>
            <span className="text-[11px] text-slate-400">4 persons</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold tracking-tight ${
              latestSummary.per_capita_liters > 160 ? 'text-amber-600' : 'text-slate-900'
            }`}>
              {latestSummary.per_capita_liters}
            </span>
            <span className="text-xs text-slate-500">L/person/day</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center justify-between">
            <span>Benchmark: 135 LPCD</span>
            <span className={latestSummary.per_capita_liters <= 135 ? 'text-emerald-700 font-medium' : 'text-amber-700 font-medium'}>
              {latestSummary.per_capita_liters <= 135 ? 'Within Limit' : `+${(latestSummary.per_capita_liters - 135).toFixed(0)} over`}
            </span>
          </div>
        </div>

        {/* Card 3: Minimum Night Flow */}
        <div className="card-base p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Minimum Night Flow (MNF)</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold tracking-tight ${
              latestSummary.min_night_flow >= 5.0 ? 'text-rose-600' : 'text-emerald-600'
            }`}>
              {latestSummary.min_night_flow.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500">L/hour (01:00-04:30)</span>
          </div>
          <div className="mt-2 text-xs text-slate-600">
            {latestSummary.min_night_flow < 5.0 ? (
              <span className="text-emerald-700 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Quiescent (Zero leak floor)
              </span>
            ) : (
              <span className="text-rose-700 flex items-center gap-1 font-medium">
                <AlertOctagon className="w-3.5 h-3.5" /> Continuous flow detected
              </span>
            )}
          </div>
        </div>

        {/* Card 4: Integrity Status */}
        <div className="card-base p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>System Integrity</span>
            <span className="text-[11px] text-slate-400">Automated</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-lg font-bold tracking-tight ${
              isLeak ? 'text-rose-600' : 'text-emerald-700'
            }`}>
              {isLeak ? 'Leak Alert Active' : 'Normal / Quiescent'}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600">
            {isLeak ? (
              <span className="text-rose-600 font-medium">Action recommended</span>
            ) : (
              <span className="text-slate-500">Transient spikes filtered</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Chart 1: 30-Day Consumption & Night Flow Trend */}
      <div className="card-base p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">30-Day Daily Consumption & Night Flow Trend</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Bars indicate total daily liters. Line indicates minimum night flow (MNF) between 01:00 and 04:30 AM.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-sky-500 rounded-sm"></span>
              <span className="text-slate-600">Normal Day</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-amber-500 rounded-sm"></span>
              <span className="text-slate-600">Normal Spike (Laundry)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-rose-500 rounded-sm"></span>
              <span className="text-slate-600">Confirmed Leak</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-rose-700"></span>
              <span className="text-slate-600">Night Flow (L/h)</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={summaries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => d.slice(5)}
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                label={{ value: 'Daily Total (Liters)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748b' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#e11d48"
                fontSize={11}
                tickLine={false}
                domain={[0, 60]}
                label={{ value: 'Night Flow (L/h)', angle: 90, position: 'insideRight', fontSize: 10, fill: '#e11d48' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as DailySummary;
                    return (
                      <div className="bg-slate-900 text-white text-xs p-3 rounded shadow-lg border border-slate-700 space-y-1">
                        <p className="font-semibold text-slate-200">{data.date}</p>
                        <p className="text-sky-300">Total: {data.total_liters} L ({data.per_capita_liters} LPCD)</p>
                        <p className="text-rose-300">Min Night Flow: {data.min_night_flow.toFixed(1)} L/h</p>
                        <p className="text-slate-300 font-mono text-[11px] pt-1 border-t border-slate-700">
                          Status: {data.status}
                        </p>
                        {data.flagged_reason && (
                          <p className="text-amber-200 text-[11px] max-w-xs">{data.flagged_reason}</p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine yAxisId="left" y={540} stroke="#94a3b8" strokeDasharray="3 3" />
              <ReferenceLine yAxisId="right" y={5.0} stroke="#dc2626" strokeDasharray="2 2" />
              <Bar
                yAxisId="left"
                dataKey="total_liters"
                name="Daily Total"
                shape={(props: any) => {
                  const { x, y, width, height, payload } = props;
                  let barColor = '#0284c7'; // normal blue
                  if (payload.status === 'ELEVATED_NORMAL') barColor = '#d97706'; // amber
                  if (payload.status === 'LEAK_CONFIRMED') barColor = '#e11d48'; // crimson
                  if (payload.status === 'LEAK_SUSPECTED') barColor = '#f43f5e';
                  return <rect x={x} y={y} width={width} height={height} rx={2} fill={barColor} />;
                }}
              />
              <Line
                yAxisId="right"
                type="stepAfter"
                dataKey="min_night_flow"
                stroke="#be123c"
                strokeWidth={2}
                dot={false}
                name="Min Night Flow (L/h)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: 24-Hour Diurnal Hourly Consumption Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-base p-4 sm:p-5 lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">24-Hour Diurnal Demand Curve</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Hourly water flow showing domestic morning/evening peaks and shaded 01:00-04:30 AM night-leak window.
              </p>
            </div>
            <span className="text-xs text-slate-500 font-mono">Quiescent Period: 01:00 - 04:30</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyPattern} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="hour"
                  tickFormatter={(h) => `${h.toString().padStart(2, '0')}:00`}
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  label={{ value: 'Flow (L/h)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748b' }}
                />
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} L/h`, name === 'avg_liters' ? 'Average Flow' : 'Minimum Flow']}
                  labelFormatter={(h) => (h != null ? `Hour ${h.toString().padStart(2, '0')}:00` : '')}
                />
                <ReferenceLine x={1} stroke="#e11d48" strokeDasharray="3 3" label={{ value: 'Night Window', fontSize: 10, fill: '#e11d48', position: 'top' }} />
                <ReferenceLine x={4} stroke="#e11d48" strokeDasharray="3 3" />
                <Area
                  type="monotone"
                  dataKey="avg_liters"
                  stroke="#0284c7"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAvg)"
                />
                <Line
                  type="monotone"
                  dataKey="min_flow_liters"
                  stroke="#059669"
                  strokeWidth={1.5}
                  dot={false}
                  name="Baseline Quiescent Floor"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Informative Side Panel: The Municipal Engineering Standard */}
        <div className="card-base p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Why Minimum Night Flow (MNF)?
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Standard municipal water engineering uses <strong>Minimum Night Flow</strong> between 01:00 and 04:30 AM when human activity naturally ceases.
            </p>
            <div className="mt-3 space-y-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="font-semibold text-slate-800">Normal Household</span>
                <p className="text-slate-600 mt-0.5">Intermittent use. Meter dial completely halts between flushes (MNF = 0 L/h).</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="font-semibold text-slate-800">Internal Leak / Cistern</span>
                <p className="text-slate-600 mt-0.5">Continuous trickle. Meter never halts even at 3:00 AM (MNF &ge; 5 L/h).</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="font-semibold text-slate-800">Laundry / Guests Spike</span>
                <p className="text-slate-600 mt-0.5">High daytime total, but night drops to 0 L/h. Correctly recognized as non-leak.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => onNavigate('cohorts')}
              className="w-full flex items-center justify-between text-xs font-semibold text-sky-700 hover:text-sky-900"
            >
              <span>View Cohort Comparisons</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
