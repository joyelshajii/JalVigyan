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
      setSaveMessage('Household profile updated. Baseline cohort statistics recalculated.');
    } finally {
      setIsSaving(false);
    }
  };

  // Synthetic cohort distribution curve for municipal ward (n = 248)
  const cohortDistribution = [
    { range: '< 80', count: 12, label: 'Very Low (<80 L)', lpcdValue: 70 },
    { range: '80-105', count: 38, label: 'Frugal (80-105 L)', lpcdValue: 95 },
    { range: '105-130', count: 72, label: 'Standard (105-130 L)', lpcdValue: 120 },
    { range: '130-155', count: 68, label: 'CPHEEO Optimal (130-155 L)', lpcdValue: 142 },
    { range: '155-180', count: 36, label: 'Elevated (155-180 L)', lpcdValue: 168 },
    { range: '180-220', count: 14, label: 'High (180-220 L)', lpcdValue: 200 },
    { range: '> 220', count: 8, label: 'Severe Anomaly (>220 L)', lpcdValue: 250 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-zinc-200/80">
        <h1 className="text-lg font-semibold text-zinc-950 tracking-tight">Demographic Cohort Benchmarking</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Normalizing water consumption across household occupancy and property typology against 248 municipal peers and the CPHEEO 135 LPCD standard.
        </p>
      </div>

      {/* Integrated Benchmark Overview Strip */}
      <div className="panel divide-y sm:divide-y-0 sm:divide-x divide-zinc-200/80 grid grid-cols-1 sm:grid-cols-3">
        <div className="p-4 sm:p-5">
          <span className="text-xs text-zinc-500 font-medium">Household Per-Capita (LPCD)</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-semibold text-zinc-950 font-mono tracking-tight tabular-nums">
              {cohortStats.user_average_lpcd.toFixed(1)}
            </span>
            <span className="text-xs text-zinc-500 font-medium">L/person/day</span>
          </div>
          <span className="text-[11px] font-mono text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200 mt-2 inline-block">
            {cohortStats.percentile_rank}th Percentile Rank
          </span>
        </div>

        <div className="p-4 sm:p-5">
          <span className="text-xs text-zinc-500 font-medium">Matched Peer Median (n = 248)</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-semibold text-zinc-950 font-mono tracking-tight tabular-nums">
              {cohortStats.median_lpcd.toFixed(1)}
            </span>
            <span className="text-xs text-zinc-500 font-medium">L/person/day</span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500 mt-2 block">
            Interquartile (P25-P75): {cohortStats.p25_lpcd} - {cohortStats.p75_lpcd} LPCD
          </span>
        </div>

        <div className="p-4 sm:p-5">
          <span className="text-xs text-zinc-500 font-medium">CPHEEO Indian Municipal Target</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-semibold text-zinc-950 font-mono tracking-tight tabular-nums">
              {cohortStats.national_benchmark_lpcd}
            </span>
            <span className="text-xs text-zinc-500 font-medium">L/person/day</span>
          </div>
          <span className="text-[11px] text-zinc-500 mt-2 block">
            Ministry of Housing & Urban Affairs
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Demographic Calibration Terminal */}
        <div className="space-y-4 lg:col-span-1">
          <div className="panel p-5 space-y-4">
            <div className="border-b border-zinc-100 pb-3">
              <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-sky-600" /> Demographic Calibration
              </h2>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Adjust physical household parameters to recalculate normalized expectations.
              </p>
            </div>

            {saveMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-700 flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{saveMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-zinc-700 mb-1.5 flex items-center gap-1.5">
                  <Users2 className="w-3.5 h-3.5 text-zinc-400" /> Permanent Occupants (Residents)
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setResidents(n)}
                      className={`py-1.5 text-xs font-mono font-medium rounded border transition-colors ${
                        residents === n
                          ? 'bg-zinc-900 text-white border-zinc-900'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                      }`}
                    >
                      {n} {n === 1 ? 'p' : 'ppl'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1 flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-zinc-400" /> Dwelling Classification
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
                <label className="block font-medium text-zinc-700 mb-1 flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-zinc-400" /> Water Connection Type
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

              <div className="pt-2 border-t border-zinc-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasGarden}
                    onChange={(e) => setHasGarden(e.target.checked)}
                    className="rounded border-zinc-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
                  />
                  <span className="font-medium text-zinc-700 text-xs">
                    Garden / Yard Irrigation Area
                  </span>
                </label>
                <p className="text-[11px] text-zinc-500 mt-1 pl-6">
                  Adds an empirical +15 LPCD outdoor seasonal adjustment.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full btn-primary py-2 text-xs font-semibold mt-2"
              >
                {isSaving ? 'Recalibrating...' : 'Update Baseline Parameters'}
              </button>
            </form>
          </div>

          <div className="p-3.5 bg-zinc-100/60 rounded border border-zinc-200 text-xs text-zinc-600 space-y-1">
            <span className="font-semibold text-zinc-800 flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-sky-600" /> Synthesis Assessment
            </span>
            <p className="text-[11px] leading-relaxed text-zinc-700">
              {cohortStats.comparison_summary}
            </p>
          </div>
        </div>

        {/* Right Column: Ward Distribution & Rationale */}
        <div className="space-y-6 lg:col-span-2">
          {/* Distribution Chart */}
          <div className="panel p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-zinc-100 gap-2">
              <div>
                <h3 className="text-sm font-semibold text-zinc-950">
                  Ward Per-Capita Consumption Distribution (n = 248)
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Peer frequency across per-capita daily consumption tiers (LPCD).
                </p>
              </div>
              <span className="text-xs font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                Your Household: {cohortStats.user_average_lpcd.toFixed(1)} LPCD
              </span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cohortDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 3" stroke="#f4f4f5" vertical={false} />
                  <XAxis dataKey="range" stroke="#a1a1aa" fontSize={11} tickLine={false} />
                  <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} />
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
                  <Bar dataKey="count" radius={[2, 2, 0, 0]}>
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
                          fill={isUserBucket ? '#0284c7' : '#d4d4d8'}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Comparative Case Study: The Danger of Flat Thresholds */}
          <div className="panel p-5 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-950 border-b border-zinc-100 pb-2.5 flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-600" />
              Mathematical Necessity of Demographic Normalization
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-rose-50/60 border border-rose-200 rounded text-zinc-800">
                <span className="font-semibold text-rose-900 flex items-center gap-1 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Pitfall of Static Thresholds
                </span>
                <p className="text-zinc-600 leading-relaxed">
                  A flat 600 L/day alert generates persistent false alarms for a 5-person home (120 LPCD = frugal conservation), while completely missing a severe 200 L/day toilet leak in a 2-person apartment (350 L total &lt; 600 L limit, yet 175 LPCD = severe leak).
                </p>
              </div>

              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded text-zinc-800">
                <span className="font-semibold text-emerald-900 flex items-center gap-1 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> JalVigyan Normalized Framework
                </span>
                <p className="text-zinc-600 leading-relaxed">
                  By calibrating against household occupants, property topology, and quiescent Minimum Night Flow, JalVigyan ensures that warnings are meaningful, eliminates alert fatigue, and prevents wasted water.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
