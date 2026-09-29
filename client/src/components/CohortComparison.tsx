import React, { useState } from 'react';
import type { HouseholdProfile, CohortStats } from '../types';
import {
  Users2,
  Home,
  Droplet,
  Scale,
  Info,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Check,
  Award,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from 'recharts';

interface CohortComparisonProps {
  household: HouseholdProfile;
  cohortStats: CohortStats;
  onUpdateHousehold: (updated: HouseholdProfile) => Promise<void>;
}

export const CohortComparison: React.FC<CohortComparisonProps> = ({
  household,
  cohortStats,
  onUpdateHousehold,
}) => {
  const [residents, setResidents] = useState(household.residents);
  const [dwellingType, setDwellingType] = useState(household.dwelling_type);
  const [hasGarden, setHasGarden] = useState(household.has_garden);
  const [waterSource, setWaterSource] = useState(household.water_source);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);
    try {
      await onUpdateHousehold({
        ...household,
        residents,
        dwelling_type: dwellingType,
        has_garden: hasGarden,
        water_source: waterSource,
      });
      setSaveMessage('Household profile updated successfully. Demographic baseline recalculated.');
    } finally {
      setIsSaving(false);
    }
  };

  // Synthetic cohort distribution curve for municipal ward (n = 248)
  const cohortDistribution = [
    { range: '< 80', count: 12, label: 'Very Frugal (<80 L)', lpcdValue: 70 },
    { range: '80-105', count: 38, label: 'Efficient (80-105 L)', lpcdValue: 95 },
    { range: '105-130', count: 72, label: 'Standard (105-130 L)', lpcdValue: 120 },
    { range: '130-155', count: 68, label: 'CPHEEO Optimal (130-155 L)', lpcdValue: 142 },
    { range: '155-180', count: 36, label: 'Elevated (155-180 L)', lpcdValue: 168 },
    { range: '180-220', count: 14, label: 'High Demand (180-220 L)', lpcdValue: 200 },
    { range: '> 220', count: 8, label: 'Severe Anomaly (>220 L)', lpcdValue: 250 },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Community & Cohort Benchmarks</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Normalizing consumption by family occupancy and property type against 248 municipal peers and the CPHEEO national 135 LPCD benchmark.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge-normal font-mono text-xs">
            Ward Benchmark (n = 248)
          </span>
        </div>
      </div>

      {/* Integrated Benchmark Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="panel p-5 space-y-2 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Household Per-Capita</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-slate-900 font-mono tracking-tight tabular-nums">
                {cohortStats.user_average_lpcd.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500 font-medium">L / person / day</span>
            </div>
            <div className="mt-2">
              <span className="badge-normal font-mono text-xs">
                {cohortStats.percentile_rank}th Percentile Rank
              </span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-1">
            Normal range for {household.residents} occupants
          </div>
        </div>

        <div className="panel p-5 space-y-2 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Ward Peer Median (n = 248)</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-slate-900 font-mono tracking-tight tabular-nums">
                {cohortStats.median_lpcd.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500 font-medium">L / person / day</span>
            </div>
            <div className="mt-2 text-xs text-slate-600">
              Interquartile: <strong>{cohortStats.p25_lpcd} - {cohortStats.p75_lpcd} LPCD</strong>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-1">
            Typical municipal consumption
          </div>
        </div>

        <div className="panel p-5 space-y-2 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">CPHEEO National Target</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-slate-900 font-mono tracking-tight tabular-nums">
                {cohortStats.national_benchmark_lpcd}
              </span>
              <span className="text-xs text-slate-500 font-medium">L / person / day</span>
            </div>
            <div className="mt-2 text-xs text-emerald-700 font-medium">
              Ministry of Housing & Urban Affairs
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-1">
            Indian Municipal Guideline (135 LPCD)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Demographic Calibration Terminal */}
        <div className="space-y-4 lg:col-span-1">
          <div className="panel p-6 space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-600" /> Demographic Profile
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust household parameters to recalibrate your baseline expectations.
              </p>
            </div>

            {saveMessage && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{saveMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Users2 className="w-3.5 h-3.5 text-slate-400" /> Permanent Occupants
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setResidents(n)}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                        residents === n
                          ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {n} {n === 1 ? 'Person' : 'People'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-slate-400" /> Dwelling Classification
                </label>
                <select
                  value={dwellingType}
                  onChange={(e) => setDwellingType(e.target.value)}
                  className="form-input text-xs"
                >
                  <option value="Independent House">Independent Detached House</option>
                  <option value="Apartment">Apartment / High-rise Flat</option>
                  <option value="Villa">Villa / Gated Community Home</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-slate-400" /> Water Connection Type
                </label>
                <select
                  value={waterSource}
                  onChange={(e) => setWaterSource(e.target.value)}
                  className="form-input text-xs"
                >
                  <option value="KWA Municipal Piped">Kerala Water Authority (KWA) Piped</option>
                  <option value="Borewell / Open Well">Borewell / Private Well Pump</option>
                  <option value="Dual (KWA + Well Hybrid)">Dual (KWA + Private Well Hybrid)</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasGarden}
                    onChange={(e) => setHasGarden(e.target.checked)}
                    className="rounded-md border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
                  />
                  <span className="font-semibold text-slate-700 text-xs">
                    Garden / Yard Irrigation Area
                  </span>
                </label>
                <p className="text-[11px] text-slate-500 mt-1 pl-6.5 leading-normal">
                  Applies an empirical +15 LPCD outdoor seasonal adjustment.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full btn-primary py-2.5 text-xs font-semibold mt-2"
              >
                {isSaving ? 'Recalibrating...' : 'Update Baseline Parameters'}
              </button>
            </form>
          </div>

          <div className="p-4 bg-slate-100/70 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-sky-600" /> Synthesis Assessment
            </span>
            <p className="text-slate-700 leading-relaxed">
              {cohortStats.comparison_summary}
            </p>
          </div>
        </div>

        {/* Right Column: Ward Distribution & Rationale */}
        <div className="space-y-6 lg:col-span-2">
          {/* Distribution Chart */}
          <div className="panel p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Ward Per-Capita Consumption Distribution (n = 248)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Frequency of matched peer households across daily per-capita usage brackets.
                </p>
              </div>
              <span className="badge-normal font-mono text-xs">
                Your Household: {cohortStats.user_average_lpcd.toFixed(1)} LPCD
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cohortDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    formatter={(val: any, _name: any, item: any) => [
                      `${val} households`,
                      `${item.payload.label}`,
                    ]}
                  />
                  <ReferenceLine
                    x="130-155"
                    stroke="#059669"
                    strokeDasharray="3 3"
                    label={{ value: 'CPHEEO Target (135)', fontSize: 10, fill: '#059669', position: 'top' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {cohortDistribution.map((entry, index) => {
                      const isUserBucket =
                        (entry.range === '< 80' && cohortStats.user_average_lpcd < 80) ||
                        (entry.range === '80-105' && cohortStats.user_average_lpcd >= 80 && cohortStats.user_average_lpcd < 105) ||
                        (entry.range === '105-130' && cohortStats.user_average_lpcd >= 105 && cohortStats.user_average_lpcd < 130) ||
                        (entry.range === '130-155' && cohortStats.user_average_lpcd >= 130 && cohortStats.user_average_lpcd < 155) ||
                        (entry.range === '155-180' && cohortStats.user_average_lpcd >= 155 && cohortStats.user_average_lpcd < 180) ||
                        (entry.range === '180-220' && cohortStats.user_average_lpcd >= 180 && cohortStats.user_average_lpcd < 220) ||
                        (entry.range === '> 220' && cohortStats.user_average_lpcd >= 220);

                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={isUserBucket ? '#0284c7' : '#cbd5e1'}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Comparative Case Study: The Danger of Flat Thresholds */}
          <div className="panel p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-600" />
              Why Flat Limits Fail & Why Normalization Wins
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-rose-50/70 border border-rose-200/80 rounded-2xl text-slate-800 space-y-1.5">
                <span className="font-bold text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> Pitfall of Static Thresholds
                </span>
                <p className="text-slate-600 leading-relaxed">
                  A flat 600 L/day limit triggers persistent false alarms for a 5-person home (120 LPCD = water-conserving), while completely failing to catch a continuous 200 L/day toilet leak in a 2-person flat (350 L total &lt; 600 L limit, yet 175 LPCD = severe leak).
                </p>
              </div>

              <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-slate-800 space-y-1.5">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> JalVigyan Normalized Framework
                </span>
                <p className="text-slate-600 leading-relaxed">
                  By calibrating against household occupants, property typology, and quiescent Minimum Night Flow, JalVigyan ensures that warnings are meaningful, eliminates alert fatigue, and prevents wasted water.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
