import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Layers,
  Database,
  ShieldAlert,
  ArrowRight,
  Building,
  UserCheck,
  Award,
} from 'lucide-react';

interface PresentationDeckProps {
  onNavigate: (tab: string) => void;
}

export const PresentationDeck: React.FC<PresentationDeckProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 8;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentSlide((prev) => Math.min(totalSlides, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentSlide((prev) => Math.max(1, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Controller */}
      <div className="bg-white border border-slate-200 rounded p-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              ANAVANDI 2026 Selection Deck
            </span>
            <span className="text-xs text-slate-500 font-mono">Official 8-Slide Pitch Format</span>
          </div>
          <h1 className="text-base font-bold text-slate-900 mt-1">
            Slide {currentSlide} of {totalSlides}: {getSlideTitle(currentSlide)}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(1, prev - 1))}
            disabled={currentSlide === 1}
            className="p-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Previous Slide (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold px-2 text-slate-800">
            {currentSlide} / {totalSlides}
          </span>
          <button
            onClick={() => setCurrentSlide((prev) => Math.min(totalSlides, prev + 1))}
            disabled={currentSlide === totalSlides}
            className="p-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Next Slide (Right Arrow)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide Canvas */}
      <div className="bg-white border border-slate-300 rounded-lg shadow-sm min-h-[500px] p-6 sm:p-10 flex flex-col justify-between">
        {/* Slide 1 */}
        {currentSlide === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-mono font-bold text-sky-700 uppercase tracking-wider">
                Slide 01 of 08
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                1. Challenge Selected and Why
              </h2>
              <p className="text-sm font-medium text-slate-500 mt-0.5">
                SC-06: Household Water Use and Leak Detection
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">The Hidden Crisis in Indian Households</h3>
                  <p className="leading-relaxed">
                    In India, municipal utilities like the Kerala Water Authority (KWA) issue bills on a <strong>bimonthly (60-day) or monthly cycle</strong>. When a silent leak develops—such as an overhead tank float valve overflow, an underground PVC pipe joint crack, or a toilet flush tank flapper failure—it often runs undetected for 30 to 60 days.
                  </p>
                </div>

                <div className="bg-rose-50 p-4 rounded border border-rose-200 text-rose-950">
                  <h3 className="text-sm font-bold text-rose-900 mb-2">The Real Impact</h3>
                  <ul className="space-y-1.5 list-disc pl-4 leading-relaxed">
                    <li>A minor 18 L/h toilet flapper leak wastes <strong>12,960 Liters</strong> per month.</li>
                    <li>Surprise water bills jump from ₹180 to upwards of ₹2,200 (slab tariff penalties).</li>
                    <li>Depletes critical potable municipal reservoirs and strains domestic groundwater sumps.</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Why We Chose This Problem</h3>
                  <p className="leading-relaxed">
                    Water is a fundamental public utility. While electricity has visible trips and instant indicators, water distribution is largely silent and concealed. Building an empirical, accessible tool that empowers households to catch leaks within 48 hours without expensive IoT hardware transforms municipal resource conservation.
                  </p>
                </div>

                <div className="bg-sky-50 p-4 rounded border border-sky-200">
                  <h3 className="text-sm font-bold text-sky-900 mb-2">Core Engineering Requirement</h3>
                  <p className="text-sky-950 leading-relaxed">
                    The tool must distinguish between <em>genuine continuous leaks</em> and <em>routine domestic consumption spikes</em> (like weekend laundry or visitors), providing mathematically meaningful warnings based on demographic cohort comparisons.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slide 2 */}
        {currentSlide === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-mono font-bold text-sky-700 uppercase tracking-wider">
                Slide 02 of 08
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                2. Who Has This Problem and What They Do Today
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Target User Persona</h3>
                <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
                  <p className="font-semibold text-slate-800">Primary: Urban & Semi-Urban Indian Households</p>
                  <p className="leading-relaxed">
                    Families with domestic municipal piped connections (e.g. KWA), residential apartment resident welfare associations (RWAs), and homes reliant on hybrid well-plus-piped setups across Kerala and Indian cities.
                  </p>
                  <p className="font-semibold text-slate-800 pt-2">Secondary: Rented Properties & Small Establishments</p>
                  <p className="leading-relaxed">
                    Tenants and landlords who frequently dispute inflated utility bills caused by pre-existing or concealed plumbing failures.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">What People Do Today (Current Ineffective Workflow)</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded">
                    <span className="font-bold text-rose-800">1. Bill Shock Discovery</span>
                    <p className="text-slate-600 mt-0.5">
                      95% discover leaks only when the physical meter reader delivers a 4x-inflated bi-monthly invoice.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <span className="font-bold text-slate-800">2. Blind Guessing / Physical Destruction</span>
                    <p className="text-slate-600 mt-0.5">
                      Plumbers break floor tiles or dig up gardens searching blindly for broken pipes without diagnostic rate telemetry.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <span className="font-bold text-slate-800">3. Absence of Cohort Benchmarks</span>
                    <p className="text-slate-600 mt-0.5">
                      Households do not know what normal consumption looks like for their family size (CPHEEO 135 LPCD benchmark is unknown to 99% of consumers).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slide 3 */}
        {currentSlide === 3 && (
          <div className="space-y-8 my-auto py-8 text-center">
            <span className="text-xs font-mono font-bold text-sky-700 uppercase tracking-wider">
              Slide 03 of 08
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              3. What You Built (One Clear Sentence)
            </h2>

            <div className="max-w-3xl mx-auto bg-slate-900 text-white p-8 rounded-lg shadow-md border border-slate-800">
              <p className="text-lg sm:text-xl font-medium leading-relaxed tracking-tight text-slate-100 font-sans">
                "JalVigyan is an open household water monitoring and leak detection system that combines routine meter logging with Minimum Night Flow analysis and demographic cohort benchmarking to identify concealed leaks within 48 hours while eliminating false alarms from normal domestic spikes."
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Working Meter Logger
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Minimum Night Flow (MNF) Engine
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 248-Household Cohort Matcher
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Live Leak Injection Suite
              </span>
            </div>
          </div>
        )}

        {/* Slide 4 */}
        {currentSlide === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-mono font-bold text-sky-700 uppercase tracking-wider">
                Slide 04 of 08
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                4. Live Product Screenshots & User Flow
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="card-base p-4 space-y-2 border-t-4 border-t-sky-600">
                <span className="font-bold text-slate-900 block text-sm">Step 1: Dashboard</span>
                <p className="text-slate-600 leading-relaxed">
                  Real-time KPI cards displaying today's liters, per-capita LPCD vs 135 benchmark, and Minimum Night Flow rate with active diagnostic banner.
                </p>
                <div className="bg-slate-100 p-2 rounded text-[11px] font-mono text-slate-700">
                  Feature: 30-day dual trend + 24-hr diurnal curve
                </div>
              </div>

              <div className="card-base p-4 space-y-2 border-t-4 border-t-emerald-600">
                <span className="font-bold text-slate-900 block text-sm">Step 2: Meter Logger</span>
                <p className="text-slate-600 leading-relaxed">
                  Fast input supporting cumulative readings in Liters or m³, instant validation against meter rollback, and batch CSV spreadsheet imports.
                </p>
                <div className="bg-slate-100 p-2 rounded text-[11px] font-mono text-slate-700">
                  Feature: Automated incremental delta & flow rate
                </div>
              </div>

              <div className="card-base p-4 space-y-2 border-t-4 border-t-indigo-600">
                <span className="font-bold text-slate-900 block text-sm">Step 3: Cohort Matcher</span>
                <p className="text-slate-600 leading-relaxed">
                  Demographic configurator (family size, dwelling type, garden) comparing usage against 248 municipal peers and the CPHEEO 135 LPCD standard.
                </p>
                <div className="bg-slate-100 p-2 rounded text-[11px] font-mono text-slate-700">
                  Feature: Dynamic distribution bell curve
                </div>
              </div>

              <div className="card-base p-4 space-y-2 border-t-4 border-t-amber-600">
                <span className="font-bold text-slate-900 block text-sm">Step 4: Test Suite</span>
                <p className="text-slate-600 leading-relaxed">
                  Dedicated reviewer cockpit allowing immediate injection of continuous toilet/pipe leaks vs high-volume Sunday laundry spikes.
                </p>
                <div className="bg-slate-100 p-2 rounded text-[11px] font-mono text-slate-700">
                  Feature: Real-time verification scorecard
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={() => onNavigate('dashboard')}
                className="btn-secondary text-xs flex items-center gap-1.5"
              >
                <span>Switch to Live Interactive Prototype</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Slide 5 */}
        {currentSlide === 5 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-mono font-bold text-sky-700 uppercase tracking-wider">
                Slide 05 of 08
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                5. How It Works: Architecture, Stack and Data
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
              <div className="card-base p-4 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                  <Database className="w-4 h-4 text-sky-600" />
                  <span>Backend & Storage</span>
                </div>
                <ul className="space-y-2 text-slate-600 leading-relaxed">
                  <li><strong>Language:</strong> Go 1.27 (standard library `net/http`).</li>
                  <li><strong>Database:</strong> SQLite with `modernc.org/sqlite` (Pure Go, 100% CGO-free, cross-platform binary).</li>
                  <li><strong>Architecture:</strong> RESTful API with automated database migration and realistic seed generators.</li>
                </ul>
              </div>

              <div className="card-base p-4 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Frontend & Design</span>
                </div>
                <ul className="space-y-2 text-slate-600 leading-relaxed">
                  <li><strong>Framework:</strong> React 18 + Vite + TypeScript.</li>
                  <li><strong>Styling:</strong> Tailwind CSS v4 utility architecture.</li>
                  <li><strong>Visualizations:</strong> Recharts SVG Composed Charts (diurnal curves, cohort distribution).</li>
                  <li><strong>Resilience:</strong> Dual-mode synchronization (talks to Go API, with seamless local engine fallback for zero-downtime offline review).</li>
                </ul>
              </div>

              <div className="card-base p-4 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Detection Algorithms</span>
                </div>
                <ul className="space-y-2 text-slate-600 leading-relaxed">
                  <li><strong>Hampel Filter (MAD):</strong> Robust median baseline immune to high-demand outlier days.</li>
                  <li><strong>Minimum Night Flow (MNF):</strong> Quiescent flow between 01:00-04:30 AM (&ge;5 L/h threshold).</li>
                  <li><strong>Persistence Gate:</strong> Requires 2 consecutive nights to eliminate nocturnal bathroom flushes.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Slide 6 */}
        {currentSlide === 6 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-mono font-bold text-sky-700 uppercase tracking-wider">
                Slide 06 of 08
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                6. What Works Now and What Does Not
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> What Works Now (100% Operational)
                </h3>
                <div className="space-y-2">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded">
                    <p className="font-semibold text-emerald-950">End-to-End Meter Logging & Validation</p>
                    <p className="text-slate-600 mt-0.5">
                      Manual meter dial logging, rollback guards, and CSV bulk import working with real-time delta tracking.
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded">
                    <p className="font-semibold text-emerald-950">Minimum Night Flow & Outlier Separation</p>
                    <p className="text-slate-600 mt-0.5">
                      Successfully detects toilet cistern trickle (+18 L/h) and pipe fractures (+45 L/h) while strictly ignoring a +340 L daytime laundry spike.
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded">
                    <p className="font-semibold text-emerald-950">Cohort Normalization & Cost Modeling</p>
                    <p className="text-slate-600 mt-0.5">
                      Instant per-capita normalization and financial loss computation in INR using Indian slab tariffs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600" /> Honest Limitations (What Does Not Yet)
                </h3>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <p className="font-semibold text-slate-800">Phone Camera Dial OCR</p>
                    <p className="text-slate-600 mt-0.5">
                      Requires user to type the dial digits manually or import CSV; direct computer vision reading from analog rotary dials is not yet integrated.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <p className="font-semibold text-slate-800">Direct Smart Ultrasonic IoT Hardware</p>
                    <p className="text-slate-600 mt-0.5">
                      Current version models and ingests digital telemetry via API/CSV, but does not ship with physical Modbus/LoRaWAN pulse hardware.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <p className="font-semibold text-slate-800">Automated SMS/WhatsApp Dispatch</p>
                    <p className="text-slate-600 mt-0.5">
                      Alerts are currently rendered on the live dashboard rather than triggering live outbound telecommunication gateways.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slide 7 */}
        {currentSlide === 7 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-mono font-bold text-sky-700 uppercase tracking-wider">
                Slide 07 of 08
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                7. What You Would Improve with Two More Weeks
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-700">
              <div className="card-base p-4 space-y-2 border-t-4 border-t-sky-600">
                <span className="font-bold text-slate-900 block text-sm">1. Mobile Camera Dial Scanner</span>
                <p className="leading-relaxed">
                  Implement an on-device WebAssembly OCR model (TensorFlow.js or Tesseract) that allows an elderly homeowner to point their phone camera at the mechanical meter dial to automatically extract and log the reading in under 2 seconds.
                </p>
              </div>

              <div className="card-base p-4 space-y-2 border-t-4 border-t-emerald-600">
                <span className="font-bold text-slate-900 block text-sm">2. WhatsApp Emergency Alerts</span>
                <p className="leading-relaxed">
                  Integrate WhatsApp Business API (via Gupshup/Twilio) to send an immediate bilingual (Malayalam and English) alert to the household head after 48 hours of persistent night flow: <em>"Notice: 18 L/h continuous leak detected. Potential toilet valve failure."</em>
                </p>
              </div>

              <div className="card-base p-4 space-y-2 border-t-4 border-t-indigo-600">
                <span className="font-bold text-slate-900 block text-sm">3. Municipal District Utility View</span>
                <p className="leading-relaxed">
                  Build an aggregated, privacy-preserved municipal dashboard for KWA / local panchayat ward engineers to view non-revenue water (NRW) across pipe zones and pinpoint underground mains bursts before surface flooding.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Slide 8 */}
        {currentSlide === 8 && (
          <div className="space-y-6 my-auto">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-mono font-bold text-sky-700 uppercase tracking-wider">
                Slide 08 of 08
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                8. Team Names, Institution and Contact Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
              <div className="card-base p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <UserCheck className="w-4 h-4 text-sky-600" />
                  <span className="font-bold text-sm text-slate-900">Team Information (2 Members)</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <p className="font-bold text-slate-900">Team Member 1 (Lead & Backend Architecture)</p>
                    <p className="text-slate-600 mt-0.5">Joyel / Project Lead</p>
                    <p className="text-slate-500 text-[11px]">Backend Go Services, Statistical Modeling, SQLite</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <p className="font-bold text-slate-900">Team Member 2 (Frontend & UI/UX)</p>
                    <p className="text-slate-600 mt-0.5">Co-Developer / Systems Engineering</p>
                    <p className="text-slate-500 text-[11px]">React Frontend, Recharts Analytics, Cohort Modeling</p>
                  </div>
                </div>
              </div>

              <div className="card-base p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Building className="w-4 h-4 text-sky-600" />
                  <span className="font-bold text-sm text-slate-900">Institution & Submission Metadata</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="font-bold text-slate-800">Institution:</span>
                    <p className="text-slate-600 mt-0.5">Amal Jyothi College of Engineering (AJCE), Kerala</p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-800">Hackathon Event:</span>
                    <p className="text-slate-600 mt-0.5">ANAVANDI 2026 Selection Round (Jain Kochi to Munnar)</p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-800">Challenge Code:</span>
                    <p className="text-slate-600 mt-0.5 font-mono">SC-06: Household water use and leak detection</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-800 font-semibold">
                      Fully Working Deployed Prototype Ready for Shortlisting
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slide Footer Navigation */}
        <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <button
                key={n}
                onClick={() => setCurrentSlide(n)}
                className={`w-6 h-6 rounded text-xs font-mono font-bold transition-colors ${
                  currentSlide === n
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">Use &larr; / &rarr; arrow keys to navigate</span>
            <button
              onClick={() => onNavigate('dashboard')}
              className="font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1"
            >
              <span>Back to Prototype</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function getSlideTitle(slide: number): string {
  switch (slide) {
    case 1:
      return 'Challenge Selected and Why';
    case 2:
      return 'Who Has This Problem and What They Do Today';
    case 3:
      return 'What You Built (One Clear Sentence)';
    case 4:
      return 'Live Product Screenshots & User Flow';
    case 5:
      return 'How It Works: Architecture, Stack and Data';
    case 6:
      return 'What Works Now and What Does Not';
    case 7:
      return 'What You Would Improve with Two More Weeks';
    case 8:
      return 'Team Names, Institution and Contact Details';
    default:
      return '';
  }
}
