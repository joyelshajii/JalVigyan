import React, { useState } from 'react';
import { ShieldCheck, FileText, Lock, CheckCircle2 } from 'lucide-react';

export const Legal: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'privacy' | 'terms'>('privacy');

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Data Governance & Legal Compliance</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Public compliance documentation governing household water telemetry, consumer data privacy, and advisory terms.
        </p>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200/70 w-fit">
        <button
          onClick={() => setActiveSubTab('privacy')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeSubTab === 'privacy'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Privacy Policy</span>
        </button>

        <button
          onClick={() => setActiveSubTab('terms')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeSubTab === 'terms'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-sky-600" />
          <span>Terms & Conditions</span>
        </button>
      </div>

      {/* Content Canvas */}
      <div className="panel p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed shadow-xs">
        {activeSubTab === 'privacy' ? (
          <>
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">Privacy Policy</h2>
              <span className="text-xs text-slate-400 font-mono">Last updated: September 17, 2026</span>
            </div>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">1. Executive Summary</h3>
              <p className="text-slate-600">
                JalVigyan ("Water Sentinel", "we", "our") is an open public utility prototype created for residential water conservation and concealed leak detection. We respect the absolute privacy of every consumer and residence. This document sets out how meter observations, demographic parameters, and consumption telemetry are gathered, processed, and preserved.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">2. Information We Process</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Meter Telemetry:</strong> Cumulative water meter dial readings in Liters or cubic meters ($m^3$), timestamps, incremental delta values, and manual observation tags.</li>
                <li><strong>Demographic Parameters:</strong> Household occupant count, dwelling classification (apartment, independent house, villa), water source, and garden irrigation status. No personally identifiable government IDs or biometric information are collected or stored.</li>
                <li><strong>Derived Diagnostics:</strong> Diurnal consumption profiles, Minimum Night Flow (MNF) calculations, and leak detection flags.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">3. Local-First Processing Architecture</h3>
              <p className="text-slate-600">
                All statistical computations (including Hampel Median Absolute Deviation filtering and Minimum Night Flow evaluations) occur on the user's localized instance or encrypted private database. Telemetry is not commodified, sold, or shared with third-party marketing brokers.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">4. Data Retention & Erasure</h3>
              <p className="text-slate-600">
                Users retain full sovereignty over their recorded meter history. A full baseline reset or record deletion can be initiated via the platform interface, which executes immediate atomic database purges.
              </p>
            </section>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-950 text-xs">
              <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>JalVigyan enforces zero third-party tracking scripts, zero marketing telemetry, and zero unauthenticated data transmission.</span>
            </div>
          </>
        ) : (
          <>
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">Terms & Conditions of Service</h2>
              <span className="text-xs text-slate-400 font-mono">Effective: September 17, 2026</span>
            </div>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">1. Scope of Service</h3>
              <p className="text-slate-600">
                JalVigyan is an open engineering prototype developed for residential water conservation and rapid leak awareness. It provides advisory algorithmic leak detection based on standard hydraulic engineering principles (Minimum Night Flow and CUSUM analysis).
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">2. Advisory Disclaimer</h3>
              <p className="text-slate-600">
                While the anomaly detector demonstrates rigorous statistical precision (zero false positives under normal high-demand spikes and confirmed identification of continuous leaks), all diagnostic recommendations (such as isolating internal valves or inspecting toilet flapper valves) are informational advisories. Homeowners should consult licensed plumbing professionals or local municipal utility engineers (such as Kerala Water Authority) for physical plumbing repairs.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">3. User Responsibilities</h3>
              <p className="text-slate-600">
                The user agrees to log meter readings accurately from physical utility dials and ensure property plumbing configurations are entered honestly to maintain valid cohort benchmarking.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">4. Intellectual Property & Open Architecture</h3>
              <p className="text-slate-600">
                JalVigyan is developed as a public utility innovation prototype under open educational standards for the ANAVANDI 2026 Hackathon Selection Round.
              </p>
            </section>

            <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-center gap-3 text-sky-950 text-xs">
              <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0" />
              <span>By utilizing the JalVigyan platform, you affirm your agreement to these ethical engineering and operational terms.</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
