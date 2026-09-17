import React, { useState } from 'react';
import { ShieldCheck, FileText, Lock, CheckCircle2 } from 'lucide-react';

export const Legal: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'privacy' | 'terms'>('privacy');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Legal & Data Governance Disclosures</h1>
        <p className="text-xs text-slate-500 mt-1">
          Public compliance documentation governing household water telemetry, data privacy, and service terms.
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('privacy')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            activeSubTab === 'privacy'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Privacy Policy</span>
        </button>

        <button
          onClick={() => setActiveSubTab('terms')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            activeSubTab === 'terms'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Terms & Conditions</span>
        </button>
      </div>

      {/* Content */}
      <div className="card-base p-6 sm:p-8 space-y-6 text-xs text-slate-700 leading-relaxed">
        {activeSubTab === 'privacy' ? (
          <>
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Privacy Policy</h2>
              <span className="text-[11px] text-slate-400 font-mono">Last updated: September 17, 2026</span>
            </div>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">1. Introduction</h3>
              <p>
                JalVigyan ("Water Sentinel", "we", "our", or "the Platform") operates a decentralized household water monitoring, logger, and anomaly detection prototype. We respect the fundamental privacy of every consumer and household. This Privacy Policy details how meter observations, demographic parameters, and consumption telemetry are processed.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">2. Information We Collect</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Meter Telemetry:</strong> Cumulative water meter dial readings in Liters or cubic meters ($m^3$), reading timestamps, and manual observation tags.</li>
                <li><strong>Demographic Metadata:</strong> Household occupant count, dwelling classification (apartment, independent house, villa), water source, and yard presence. No personally identifiable government IDs or aadhaar numbers are collected or stored.</li>
                <li><strong>Derived Diagnostics:</strong> Diurnal consumption profiles, Minimum Night Flow (MNF) calculations, and leak detection flags.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">3. Local-First and On-Device Processing</h3>
              <p>
                All statistical computations (including Hampel Median Absolute Deviation filtering and Minimum Night Flow evaluations) occur on the user's localized instance or encrypted private database. Telemetry is not sold, rented, or commodified for third-party commercial marketing.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">4. Data Retention & Deletion</h3>
              <p>
                Users maintain complete control over their recorded meter history. A full baseline reset or record deletion can be executed at any time via the platform interface, which executes immediate atomic database purges.
              </p>
            </section>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center gap-2 text-slate-600">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>JalVigyan strictly enforces zero tracker scripts, zero marketing telemetry, and zero unauthenticated data transmission.</span>
            </div>
          </>
        ) : (
          <>
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Terms & Conditions of Service</h2>
              <span className="text-[11px] text-slate-400 font-mono">Effective: September 17, 2026</span>
            </div>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">1. Nature of Service</h3>
              <p>
                JalVigyan is an open engineering prototype developed for residential water conservation and rapid leak awareness. It provides advisory algorithmic leak detection based on standard hydraulic engineering principles (Minimum Night Flow and CUSUM analysis).
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">2. Advisory Disclaimer</h3>
              <p>
                While the anomaly detector demonstrates rigorous statistical precision (zero false positives under normal high-demand spikes and confirmed identification of continuous leaks), all diagnostic recommendations (such as isolating internal valves or inspecting toilet flapper valves) are informational advisories. Homeowners should consult licensed plumbing professionals or local municipal utility engineers (such as Kerala Water Authority) for physical repairs.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">3. User Responsibilities</h3>
              <p>
                The user agrees to log meter readings accurately from their physical utility dials and ensure property plumbing configurations are entered honestly to maintain valid cohort benchmarking.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">4. Intellectual Property & Open Architecture</h3>
              <p>
                JalVigyan is developed as a public utility innovation prototype under open educational standards for the ANAVANDI 2026 Hackathon Selection Round.
              </p>
            </section>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center gap-2 text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
              <span>By utilizing the JalVigyan platform, you affirm your agreement to these ethical engineering and operational terms.</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
