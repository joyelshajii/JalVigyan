import React, { useState } from 'react';
import type { HouseholdProfile, CohortStats } from '../types';
import { Users, Home, Trees, Droplet, Scale, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
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
      setSaveMessage('Household profile updated. Baseline cohort statistics refreshed.');
    } finally {
      setIsSaving(false);
    }
  };

  // Synthetic cohort distribution curve for municipal ward
  const cohortDistribution = [
    { range: '< 80', count: 12, label: 'Very Low (<80 L)', lpcdValue: 70 },
    { range: '80-105', count: 38, label: 'Frugal (80-105 L)', lpcdValue: 95 },
    { range: '105-130', count: 72, label: 'Standard (105-130 L)', lpcdValue: 120 },
    { range: '130-155', count: 68, label: 'Optimal / CPHEEO (130-155 L)', lpcdValue: 142 },
    { range: '155-180', count: 36, label: 'Elevated (155-180 L)', lpcdValue: 168 },
    { range: '180-220', count: 14, label: 'High (180-220 L)', lpcdValue: 200 },
    { range: '> 220', count: 8, label: 'Severe / Anomaly (>220 L)', lpcdValue: 250 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Demographic Cohort Comparison</h1>
        <p className="text-xs text-slate-500 mt-1">
          Contextualizing consumption against 248 statistically matched households in the municipal division and the Indian CPHEEO 135 LPCD standard.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Configuration Form */}
        <div className="card-base p-5 lg:col-span-1 h-fit space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Home className="w-4 h-4 text-sky-600" /> Household Demographic Parameters
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Adjust demographic traits to observe normalized per-capita baseline adjustments.
            </p>
          </div>

          {saveMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-700 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{saveMessage}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" /> Family Size / Permanent Residents
              </label>
              <select
                value={residents}
                onChange={(e) => setResidents(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Person (Single occupant)' : 'Persons'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-slate-400" /> Dwelling Classification
              </label>
              <select
                value={dwellingType}
                onChange={(e) => setDwellingType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="Independent House">Independent Detached House</option>
                <option value="Apartment">Apartment / High-rise Flat</option>
                <option value="Villa">Villa / Gated Community Home</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-slate-400" /> Primary Supply Source
              </label>
              <select
                value={waterSource}
                onChange={(e) => setWaterSource(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="KWA Municipal Piped">Kerala Water Authority (KWA) Piped</option>
                <option value="Borewell / Open Well">Borewell / Private Well Pump</option>
                <option value="Dual (KWA + Well Hybrid)">Dual (KWA + Private Well Hybrid)</option>
              </select>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasGarden}
                  onChange={(e) => setHasGarden(e.target.checked)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                <span className="font-medium text-slate-700 flex items-center gap-1">
                  <Trees className="w-3.5 h-3.5 text-slate-400" /> Has Garden / Yard Irrigation Area
                </span>
              </label>
              <p className="text-[11px] text-slate-500 mt-1 pl-6">
                Applies an empirical +15 LPCD outdoor allowance during non-monsoon months.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full btn-primary mt-2"
            >
              {isSaving ? 'Updating Cohort...' : 'Update Household Baseline'}
            </button>
          </form>
        </div>

        {/* Cohort Distribution and Metric Analysis */}
        <div className="space-y-6 lg:col-span-2">
          {/* Key Benchmark Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card-base p-4">
              <span className="text-xs text-slate-500 font-medium">Your Household LPCD</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {cohortStats.user_average_lpcd} <span className="text-xs font-normal text-slate-500">L/person</span>
              </p>
              <span className="text-[11px] text-slate-600 mt-1 block">
                Rank: <strong>{cohortStats.percentile_rank}th percentile</strong>
              </span>
            </div>

            <div className="card-base p-4">
              <span className="text-xs text-slate-500 font-medium">Matched Peer Median</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {cohortStats.median_lpcd} <span className="text-xs font-normal text-slate-500">L/person</span>
              </p>
              <span className="text-[11px] text-slate-600 mt-1 block">
                P25-P75: {cohortStats.p25_lpcd} - {cohortStats.p75_lpcd} LPCD
              </span>
            </div>

            <div className="card-base p-4">
              <span className="text-xs text-slate-500 font-medium">CPHEEO Benchmark</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {cohortStats.national_benchmark_lpcd} <span className="text-xs font-normal text-slate-500">L/person</span>
              </p>
              <span className="text-[11px] text-slate-600 mt-1 block">
                Ministry of Housing & Urban Affairs
              </span>
            </div>
          </div>

          {/* Distribution Chart */}
          <div className="card-base p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Ward Per-Capita Consumption Distribution (n = 248)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Frequency of households across per-capita daily consumption tiers (LPCD).
                </p>
              </div>
              <span className="text-xs font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                You: {cohortStats.user_average_lpcd} LPCD
              </span>
            </div>

            <div className="h-60 w-full pt-2">
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
                  <ReferenceLine x="130-155" stroke="#059669" strokeDasharray="3 3" label={{ value: 'CPHEEO Target (135)', fontSize: 10, fill: '#059669', position: 'top' }} />
                  <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                    {cohortDistribution.map((entry, index) => {
                      // Highlight user's bucket
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
                          stroke={isUserBucket ? '#0369a1' : 'transparent'}
                          strokeWidth={isUserBucket ? 1.5 : 0}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs flex items-start gap-2">
              <Scale className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">Diagnostic Synthesis: </span>
                <span className="text-slate-600">{cohortStats.comparison_summary}</span>
              </div>
            </div>
          </div>

          {/* Educational Callout: Why Warnings Are Meaningful */}
          <div className="card-base p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-600" />
              Engineering Rationale: Why Household Normalization is Mandatory
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded text-slate-800">
                <span className="font-bold text-rose-800 flex items-center gap-1 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Pitfall of Un-normalized Thresholds
                </span>
                <p className="text-slate-600 leading-relaxed">
                  A static alarm set at 600 L/day causes false alarms for a 5-person family (120 LPCD = frugal), while completely missing a 200 L/day toilet leak in a 2-person apartment (350 L total &lt; 600 L limit, but 175 LPCD = severe leak).
                </p>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-slate-800">
                <span className="font-bold text-emerald-800 flex items-center gap-1 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> JalVigyan Normalized Architecture
                </span>
                <p className="text-slate-600 leading-relaxed">
                  By calibrating against household occupants, property topology, and quiescent Minimum Night Flow (01:00-04:30 AM), our warnings are mathematically meaningful and prevent alert fatigue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
