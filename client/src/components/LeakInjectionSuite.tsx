import React, { useState } from 'react';
import type { VerificationScorecard, AnomalyAlert } from '../types';
import {
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Gauge,
  Info,
  Clock,
  Shirt,
  Users,
  Waves,
} from 'lucide-react';

interface LeakInjectionSuiteProps {
  onInjectScenario: (type: string, flowRate?: number) => Promise<{ scorecard: VerificationScorecard; alerts: AnomalyAlert[] }>;
  onNavigate: (tab: string) => void;
}

export const LeakInjectionSuite: React.FC<LeakInjectionSuiteProps> = ({
  onInjectScenario,
  onNavigate,
}) => {
  const [currentScorecard, setCurrentScorecard] = useState<VerificationScorecard | null>(null);
  const [activeScenario, setActiveScenario] = useState<string>('BASELINE');
  const customRate = 18;
  const [isRunning, setIsRunning] = useState(false);

  const handleRunScenario = async (type: string, rate = 0) => {
    setIsRunning(true);
    try {
      const res = await onInjectScenario(type, rate || customRate);
      setCurrentScorecard(res.scorecard);
      setActiveScenario(type);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">Leak Injection & Verification Suite</h1>
              <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded font-semibold">
                Official Hackathon Evaluation Matrix
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Live test harness verifying that the anomaly detector accurately catches concealed continuous leaks while strictly ignoring normal high-consumption spikes.
            </p>
          </div>

          <button
            onClick={() => handleRunScenario('RESET')}
            disabled={isRunning}
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>

      {/* Live Verification Scorecard Banner */}
      {currentScorecard ? (
        <div
          className={`p-5 rounded border ${
            currentScorecard.correct_diagnosis
              ? 'bg-emerald-50/80 border-emerald-300'
              : 'bg-rose-50 border-rose-300'
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold uppercase px-2 py-0.5 rounded border ${
                    currentScorecard.correct_diagnosis
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border-rose-300'
                  }`}
                >
                  Evaluation Result: {currentScorecard.correct_diagnosis ? 'Test Passed' : 'Test Failed'}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Scenario: {currentScorecard.scenario_name}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                {currentScorecard.is_actual_leak
                  ? `Injected Leak Successfully Identified (${currentScorecard.night_flow_observed.toFixed(1)} L/h Night Flow)`
                  : 'Legitimate Normal Spike Successfully Filtered (Zero False Alarms)'}
              </h2>
              <p className="text-xs text-slate-700 max-w-3xl leading-relaxed">
                {currentScorecard.explanation}
              </p>
            </div>

            {/* Scorecard Metrics */}
            <div className="flex items-center gap-4 bg-white p-3.5 rounded border border-slate-200 shrink-0 text-xs">
              <div className="text-center px-2">
                <span className="text-slate-500 block text-[11px]">Ground Truth</span>
                <span className={`font-bold ${currentScorecard.is_actual_leak ? 'text-rose-600' : 'text-slate-800'}`}>
                  {currentScorecard.is_actual_leak ? 'Genuine Leak' : 'Normal Demand'}
                </span>
              </div>
              <div className="h-8 border-l border-slate-200"></div>
              <div className="text-center px-2">
                <span className="text-slate-500 block text-[11px]">Detector State</span>
                <span className={`font-bold ${currentScorecard.system_detected_leak ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {currentScorecard.system_detected_leak ? 'Leak Alarm Fired' : 'Normal / Suppressed'}
                </span>
              </div>
              <div className="h-8 border-l border-slate-200"></div>
              <div className="text-center px-2">
                <span className="text-slate-500 block text-[11px]">Night Flow</span>
                <span className="font-bold text-slate-900 font-mono">
                  {currentScorecard.night_flow_observed.toFixed(1)} L/h
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-100 border border-slate-200 rounded p-4 text-xs text-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-500" />
            <span>Select one of the test scenarios below to inject hydraulic events and observe real-time algorithmic classification.</span>
          </div>
          <span className="font-mono text-slate-500">Detector Engine: Standby</span>
        </div>
      )}

      {/* Test Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Scenario 1: Toilet Flapper Valve Leak */}
        <div className={`card-base p-5 transition-all ${activeScenario === 'TOILET_FLAPPER' ? 'border-sky-500 ring-1 ring-sky-500' : ''}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                <Waves className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                  Target: Leak Detection
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">Toilet Cistern Flapper Leak</h3>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded">
              +18 L/h continuous
            </span>
          </div>

          <p className="text-xs text-slate-600 mt-3 leading-relaxed">
            Simulates a worn flush tank rubber flapper trickling continuously into the toilet bowl 24/7. Adds ~432 L/day with uninterrupted flow during the 01:00-04:30 AM night window.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Expected Outcome: <strong>Warning Alarm</strong>
            </span>
            <button
              onClick={() => handleRunScenario('TOILET_FLAPPER', 18)}
              disabled={isRunning}
              className="btn-primary py-1.5 text-xs"
            >
              <Play className="w-3 h-3" />
              <span>Inject Leak</span>
            </button>
          </div>
        </div>

        {/* Scenario 2: Concealed Pipe Fissure */}
        <div className={`card-base p-5 transition-all ${activeScenario === 'PIPE_CRACK' ? 'border-sky-500 ring-1 ring-sky-500' : ''}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                  Target: Severe Leak
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">Concealed Pipe Joint Crack</h3>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded">
              +45 L/h continuous
            </span>
          </div>

          <p className="text-xs text-slate-600 mt-3 leading-relaxed">
            Simulates an underground fractured PVC elbow joint or split riser pipe discharging unmonitored water into surrounding earth. Total waste: 1,080 L/day.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Expected Outcome: <strong>Critical Alarm</strong>
            </span>
            <button
              onClick={() => handleRunScenario('PIPE_CRACK', 45)}
              disabled={isRunning}
              className="btn-danger py-1.5 text-xs"
            >
              <Play className="w-3 h-3" />
              <span>Inject Crack</span>
            </button>
          </div>
        </div>

        {/* Scenario 3: Sunday Laundry Spike (Normal Event) */}
        <div className={`card-base p-5 transition-all ${activeScenario === 'WEEKEND_LAUNDRY' ? 'border-sky-500 ring-1 ring-sky-500' : ''}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs">
                <Shirt className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Target: Reject False Alarm
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">Sunday Laundry & Deep Clean</h3>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded">
              +340 L daytime only
            </span>
          </div>

          <p className="text-xs text-slate-600 mt-3 leading-relaxed">
            Tests robustness against false positives. Simulates 4 loads of laundry and courtyard washing during 10:00 AM - 02:00 PM. Night flow strictly drops to 0.0 L/h.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Expected Outcome: <strong>NO Alarm (Filtered)</strong>
            </span>
            <button
              onClick={() => handleRunScenario('WEEKEND_LAUNDRY')}
              disabled={isRunning}
              className="btn-secondary py-1.5 text-xs text-sky-800 border-sky-300 hover:bg-sky-50"
            >
              <Play className="w-3 h-3" />
              <span>Inject Normal Spike</span>
            </button>
          </div>
        </div>

        {/* Scenario 4: Weekend Guests Event (Normal Event) */}
        <div className={`card-base p-5 transition-all ${activeScenario === 'GUEST_EVENT' ? 'border-sky-500 ring-1 ring-sky-500' : ''}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Target: Reject False Alarm
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">Visiting Relatives / Event</h3>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded">
              +215 L/day daytime
            </span>
          </div>

          <p className="text-xs text-slate-600 mt-3 leading-relaxed">
            Simulates temporary guest occupancy over 2 consecutive days. Total volume rises, but intermittent usage ceases at night. Night flow returns cleanly to 0.0 L/h.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Expected Outcome: <strong>NO Alarm (Filtered)</strong>
            </span>
            <button
              onClick={() => handleRunScenario('GUEST_EVENT')}
              disabled={isRunning}
              className="btn-secondary py-1.5 text-xs text-emerald-800 border-emerald-300 hover:bg-emerald-50"
            >
              <Play className="w-3 h-3" />
              <span>Inject Guests Spike</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reviewer Verification Architecture Breakdown */}
      <div className="card-base p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
          <Zap className="w-4 h-4 text-sky-600" />
          Algorithmic Anomaly Architecture: Mathematical Guarantees
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-sky-600" /> 1. Hampel MAD Filter
            </span>
            <p className="text-slate-600 leading-relaxed">
              Standard deviations fail when outliers are present. We use Median Absolute Deviation (MAD):
              <code className="block mt-1 bg-white p-1 rounded font-mono text-[10px] border border-slate-200">
                &sigma; = 1.4826 &times; Median(|x - Median(x)|)
              </code>
              Outliers cannot contaminate the baseline.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-rose-600" /> 2. Quiescent Night Gate
            </span>
            <p className="text-slate-600 leading-relaxed">
              Before raising any leak flag, the algorithm queries the 01:00-04:30 AM telemetry. If flow reaches 0 L/h, any daily elevation is strictly classified as <span className="font-semibold text-amber-700">ELEVATED_NORMAL</span>.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 3. Persistence Gate
            </span>
            <p className="text-slate-600 leading-relaxed">
              Requires continuous non-zero night flow for &ge; 2 consecutive days, eliminating transient night events (e.g. single 3:00 AM toilet flush) from causing false alarms.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => onNavigate('dashboard')}
            className="btn-primary text-xs"
          >
            <span>Return to Live Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
