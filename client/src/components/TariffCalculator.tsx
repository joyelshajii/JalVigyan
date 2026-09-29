import React, { useState, useMemo } from 'react';
import {
  Droplets,
  AlertTriangle,
  Sparkles,
  Zap,
  Info,
  Users2,
} from 'lucide-react';
import type { HouseholdProfile } from '../types';

interface TariffCalculatorProps {
  household: HouseholdProfile;
  onNavigate: (tab: string) => void;
}

export const TariffCalculator: React.FC<TariffCalculatorProps> = ({ household, onNavigate }) => {
  const [occupants, setOccupants] = useState<number>(household.residents || 4);
  const [dailyLPCD, setDailyLPCD] = useState<number>(135);
  const [simulatedLeakLPH, setSimulatedLeakLPH] = useState<number>(0);

  // KWA Domestic Bimonthly (60-day) Slab Structure
  // In Kerala, billing is bimonthly. Monthly cost is calculated proportionally.
  const calculateMonthlyBill = (monthlyKL: number) => {
    let bill = 0;
    if (monthlyKL <= 0) return 0;

    // Minimum fixed baseline
    const minCharge = 50;

    // Slabs:
    // 0 - 5 kL: ₹4.50 / kL
    // 5 - 10 kL: ₹5.50 / kL
    // 10 - 15 kL: ₹7.50 / kL
    // 15 - 20 kL: ₹11.00 / kL
    // 20 - 25 kL: ₹15.00 / kL
    // 25 - 30 kL: ₹20.00 / kL
    // 30 - 40 kL: ₹28.00 / kL
    // 40 - 50 kL: ₹36.00 / kL
    // > 50 kL: ₹45.00 / kL

    let remaining = monthlyKL;

    if (remaining > 50) {
      bill += (remaining - 50) * 45;
      remaining = 50;
    }
    if (remaining > 40) {
      bill += (remaining - 40) * 36;
      remaining = 40;
    }
    if (remaining > 30) {
      bill += (remaining - 30) * 28;
      remaining = 30;
    }
    if (remaining > 25) {
      bill += (remaining - 25) * 20;
      remaining = 25;
    }
    if (remaining > 20) {
      bill += (remaining - 20) * 15;
      remaining = 20;
    }
    if (remaining > 15) {
      bill += (remaining - 15) * 11;
      remaining = 15;
    }
    if (remaining > 10) {
      bill += (remaining - 10) * 7.5;
      remaining = 10;
    }
    if (remaining > 5) {
      bill += (remaining - 5) * 5.5;
      remaining = 5;
    }
    bill += remaining * 4.5;

    return Math.max(minCharge, bill);
  };

  const normalMonthlyLiters = occupants * dailyLPCD * 30;
  const normalMonthlyKL = normalMonthlyLiters / 1000;
  const normalBill = useMemo(() => calculateMonthlyBill(normalMonthlyKL), [normalMonthlyKL]);

  const leakMonthlyLiters = simulatedLeakLPH * 24 * 30;
  const totalWithLeakKL = (normalMonthlyLiters + leakMonthlyLiters) / 1000;
  const totalBillWithLeak = useMemo(() => calculateMonthlyBill(totalWithLeakKL), [totalWithLeakKL]);

  const monthlyExtraLeakCost = Math.max(0, totalBillWithLeak - normalBill);
  const annualLossINR = monthlyExtraLeakCost * 12;

  // Determine current tariff tier label
  const getTierBadge = (kl: number) => {
    if (kl <= 10) return { label: 'Subsidized Tier 1', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    if (kl <= 20) return { label: 'Standard Tier 2', color: 'bg-sky-100 text-sky-800 border-sky-200' };
    if (kl <= 30) return { label: 'Elevated Tier 3', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    return { label: 'Punitive High Tier 4', color: 'bg-rose-100 text-rose-800 border-rose-200' };
  };

  const currentTier = getTierBadge(totalWithLeakKL);

  const conservationTips = [
    {
      title: 'Fix Cistern Flapper Valve',
      savingsLiters: '12,960 L / mo',
      savingsINR: '₹430 / mo',
      desc: 'Replacing a ₹80 rubber valve prevents silent 18 L/h continuous toilet loss.',
    },
    {
      title: 'Install Flow Aerators on Taps',
      savingsLiters: '2,400 L / mo',
      savingsINR: '₹95 / mo',
      desc: 'Reduces sink flow from 12 L/min to 5 L/min without sacrificing water pressure.',
    },
    {
      title: 'Rainwater Sump Recharging',
      savingsLiters: '15,000 L / mo (Monsoon)',
      savingsINR: '₹620 / mo',
      desc: 'Diverting clean roof runoff during Kerala monsoon months reduces piped municipal draw.',
    },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Kerala Water Authority (KWA) Tariff & Savings Simulator
            </h1>
            <span className="badge-normal font-mono text-xs">Official Slabs</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Model your domestic water bill, explore steep non-linear slab penalties from leaks, and calculate exact rupee savings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className="btn-secondary text-xs"
          >
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Sliders */}
        <div className="panel p-6 space-y-6 lg:col-span-1">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-sky-600" />
              Consumption Parameters
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Adjust your household values to see instant tariff impact.
            </p>
          </div>

          {/* Occupants Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Users2 className="w-3.5 h-3.5 text-slate-400" /> Family Size
              </span>
              <strong className="text-slate-900 font-mono text-sm">{occupants} Occupants</strong>
            </div>
            <input
              type="range"
              min={1}
              max={8}
              value={occupants}
              onChange={(e) => setOccupants(parseInt(e.target.value, 10))}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1 person</span>
              <span>4 people</span>
              <span>8 people</span>
            </div>
          </div>

          {/* Daily Per Person LPCD Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-sky-600" /> Per-Capita Use (LPCD)
              </span>
              <strong className="text-slate-900 font-mono text-sm">{dailyLPCD} L/person/day</strong>
            </div>
            <input
              type="range"
              min={60}
              max={220}
              step={5}
              value={dailyLPCD}
              onChange={(e) => setDailyLPCD(parseInt(e.target.value, 10))}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>60 L (Frugal)</span>
              <span className="text-emerald-600 font-semibold">135 L (Target)</span>
              <span>220 L (High)</span>
            </div>
          </div>

          {/* Simulated Leak Injection Slider */}
          <div className="p-4 bg-rose-50/70 border border-rose-200/80 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-rose-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Simulated Leak Rate
              </span>
              <strong className="text-rose-700 font-mono text-sm">
                {simulatedLeakLPH} L/h
              </strong>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={1}
              value={simulatedLeakLPH}
              onChange={(e) => setSimulatedLeakLPH(parseInt(e.target.value, 10))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex items-center justify-between gap-1 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setSimulatedLeakLPH(0)}
                className={`px-2 py-0.5 rounded-md border ${
                  simulatedLeakLPH === 0 ? 'bg-white text-slate-900 border-slate-300 font-bold' : 'text-slate-500'
                }`}
              >
                0 (Zero Leak)
              </button>
              <button
                type="button"
                onClick={() => setSimulatedLeakLPH(18)}
                className={`px-2 py-0.5 rounded-md border ${
                  simulatedLeakLPH === 18 ? 'bg-rose-600 text-white border-rose-600 font-bold' : 'text-slate-500'
                }`}
              >
                18 L/h (Flapper)
              </button>
              <button
                type="button"
                onClick={() => setSimulatedLeakLPH(45)}
                className={`px-2 py-0.5 rounded-md border ${
                  simulatedLeakLPH === 45 ? 'bg-rose-600 text-white border-rose-600 font-bold' : 'text-slate-500'
                }`}
              >
                45 L/h (Crack)
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
            <Info className="w-3.5 h-3.5 text-slate-400 inline mr-1" />
            Kerala Water Authority bills bimonthly using progressive volume tariffs. When a continuous leak occurs, you not only pay for the lost volume, but every additional liter pushes your base consumption into higher rate tiers.
          </div>
        </div>

        {/* Right 2 Columns: Financial & Slab Impact Dashboard */}
        <div className="space-y-6 lg:col-span-2">
          {/* Real-time Bill Shock Card */}
          <div className="panel p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Projected Monthly Water Tariff Breakdown
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Calculated using statutory KWA domestic slab rates in Indian Rupees.
                </p>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-semibold font-mono border ${currentTier.color}`}>
                {currentTier.label}
              </span>
            </div>

            {/* Big Comparative Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium block">Baseline Legitimate Bill</span>
                <div className="mt-1 flex items-baseline gap-1 text-slate-900">
                  <span className="text-sm font-semibold text-slate-400">₹</span>
                  <span className="text-3xl font-bold font-mono tracking-tight tabular-nums">
                    {Math.round(normalBill)}
                  </span>
                  <span className="text-xs text-slate-500">/ mo</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  ~{normalMonthlyKL.toFixed(1)} kL total usage
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium block">Total Bill With Leak</span>
                <div className="mt-1 flex items-baseline gap-1 text-slate-900">
                  <span className="text-sm font-semibold text-slate-400">₹</span>
                  <span className={`text-3xl font-bold font-mono tracking-tight tabular-nums ${
                    monthlyExtraLeakCost > 0 ? 'text-rose-600' : 'text-slate-900'
                  }`}>
                    {Math.round(totalBillWithLeak)}
                  </span>
                  <span className="text-xs text-slate-500">/ mo</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  ~{totalWithLeakKL.toFixed(1)} kL total volume
                </span>
              </div>

              <div className={`p-4 rounded-2xl border ${
                monthlyExtraLeakCost > 0
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}>
                <span className="text-xs font-medium block">
                  {monthlyExtraLeakCost > 0 ? 'Leak Penalty Waste' : 'Status'}
                </span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-sm font-semibold">₹</span>
                  <span className="text-3xl font-bold font-mono tracking-tight tabular-nums">
                    {Math.round(monthlyExtraLeakCost)}
                  </span>
                  <span className="text-xs">/ mo</span>
                </div>
                <span className="text-[11px] font-semibold mt-1 block">
                  {monthlyExtraLeakCost > 0
                    ? `₹${Math.round(annualLossINR).toLocaleString()} wasted annually`
                    : '100% efficient domestic use'}
                </span>
              </div>
            </div>

            {/* Visual Slab Ladder Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Monthly Volume Relative to Slab Tiers</span>
                <span className="font-mono text-slate-500">{totalWithLeakKL.toFixed(1)} kL of 50 kL ceiling</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${Math.min(20, (totalWithLeakKL / 50) * 100)}%` }}
                  title="0-10 kL (Subsidized)"
                ></div>
                <div
                  className="bg-sky-500 h-full transition-all duration-300"
                  style={{ width: `${Math.min(20, Math.max(0, (totalWithLeakKL - 10) / 50) * 100)}%` }}
                  title="10-20 kL (Standard)"
                ></div>
                <div
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${Math.min(20, Math.max(0, (totalWithLeakKL - 20) / 50) * 100)}%` }}
                  title="20-30 kL (Elevated)"
                ></div>
                <div
                  className="bg-rose-600 h-full transition-all duration-300"
                  style={{ width: `${Math.min(40, Math.max(0, (totalWithLeakKL - 30) / 50) * 100)}%` }}
                  title=">30 kL (Punitive)"
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0-10 kL (₹4.50)</span>
                <span>10-20 kL (₹11.00)</span>
                <span>20-30 kL (₹20.00)</span>
                <span className="text-rose-600">&gt;30 kL (₹36.00+)</span>
              </div>
            </div>
          </div>

          {/* Actionable Conservation & Rupee Savings Tips */}
          <div className="panel p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                Actionable Domestic Conservation & Payback Interventions
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {conservationTips.map((tip, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{tip.title}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-emerald-700 font-mono text-sm">{tip.savingsINR}</span>
                    <span className="text-slate-400 text-[10px] font-mono">({tip.savingsLiters})</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {tip.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
