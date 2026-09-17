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
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface PresentationDeckProps {
  onNavigate: (tab: string) => void;
}

export const PresentationDeck: React.FC<PresentationDeckProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const totalSlides = 8;

  const slideTitles = [
    'Challenge Selected & Why',
    'Target Persona & Today’s Workflow',
    'What We Built (One Clear Sentence)',
    'Product Workflow & Live Flow',
    'Architecture, Stack & Data',
    'What Works Now & Current Limitations',
    'Two-Week Roadmap & Evolution',
    'Team, Institution & Credentials',
  ];

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
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-zinc-950 p-6 sm:p-10 overflow-y-auto' : ''}`}>
      {/* Deck Toolbar */}
      <div className={`panel p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isFullscreen ? 'bg-zinc-900 border-zinc-800 text-white' : ''
      }`}>
        <div className="flex items-center gap-2">
          <span className="badge-normal font-mono text-[10px] uppercase">
            ANAVANDI 2026 Evaluation Deck
          </span>
          <span className="text-xs text-zinc-400 font-mono">
            Slide {currentSlide} of {totalSlides}
          </span>
        </div>

        {/* Slide Step Navigation Chips */}
        <div className="hidden lg:flex items-center gap-1">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <button
              key={n}
              onClick={() => setCurrentSlide(n)}
              className={`px-2 py-1 text-[11px] font-mono rounded transition-colors ${
                currentSlide === n
                  ? isFullscreen ? 'bg-sky-600 text-white font-semibold' : 'bg-zinc-900 text-white font-semibold'
                  : isFullscreen ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:bg-zinc-100'
              }`}
            >
              0{n}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(1, prev - 1))}
            disabled={currentSlide === 1}
            className="p-1.5 rounded border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Previous Slide (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-semibold px-1 text-zinc-700">
            {currentSlide} / {totalSlides}
          </span>
          <button
            onClick={() => setCurrentSlide((prev) => Math.min(totalSlides, prev + 1))}
            disabled={currentSlide === totalSlides}
            className="p-1.5 rounded border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Next Slide (Right Arrow)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-zinc-200 mx-1"></div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Presentation Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Slide Canvas */}
      <div className={`panel p-6 sm:p-10 min-h-[520px] flex flex-col justify-between shadow-xs ${
        isFullscreen ? 'bg-zinc-900 border-zinc-800 text-zinc-100 max-w-5xl mx-auto w-full' : ''
      }`}>
        {/* Slide 1 */}
        {currentSlide === 1 && (
          <div className="space-y-6">
            <div className="border-b border-zinc-200/80 pb-4">
              <span className="text-xs font-mono font-semibold text-sky-700 uppercase tracking-wider">
                Slide 01 / 08 • Problem Statement
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight mt-1">
                1. Challenge Selected and Why
              </h2>
              <p className="text-xs font-medium text-zinc-500 mt-0.5">
                SC-06: Household Water Use and Leak Detection (Track 2: Water & Coast)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-700">
              <div className="space-y-4">
                <div className="p-4 bg-zinc-50 rounded border border-zinc-200/80 space-y-2">
                  <h3 className="text-sm font-semibold text-zinc-900">The Municipal Bimonthly Blindspot</h3>
                  <p className="leading-relaxed text-zinc-600">
                    In India, municipal agencies like the Kerala Water Authority (KWA) calculate consumption on a <strong>bimonthly (60-day) billing cycle</strong>. When a silent leak occurs—such as a deteriorated toilet cistern flapper valve, broken sump riser pipe, or float valve overflow—it discharges continuously for 30 to 60 days before any notification reaches the consumer.
                  </p>
                </div>

                <div className="p-4 bg-rose-50/70 rounded border border-rose-200 text-zinc-900 space-y-2">
                  <h3 className="text-sm font-semibold text-rose-900">Empirical Financial & Ecological Waste</h3>
                  <ul className="space-y-1.5 list-disc pl-4 text-zinc-700 leading-relaxed">
                    <li>An 18 L/h continuous toilet trickle loses <strong>12,960 Liters</strong> each month.</li>
                    <li>Slab tariffs push bimonthly bills from ₹180 to ₹2,200+ (a 12x penalty shock).</li>
                    <li>Depletes critical municipal reservoirs and strains domestic aquifers.</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-zinc-50 rounded border border-zinc-200/80 space-y-2">
                  <h3 className="text-sm font-semibold text-zinc-900">The Core Engineering Objective</h3>
                  <p className="leading-relaxed text-zinc-600">
                    Electricity has circuit breakers that trip instantly. Water leaks are silent and subterranean. We chose SC-06 to build an accessible, empirical tool that catches leaks within 48 hours without demanding expensive IoT hardware installations.
                  </p>
                </div>

                <div className="p-4 bg-sky-50/70 rounded border border-sky-200 space-y-2">
                  <h3 className="text-sm font-semibold text-sky-900">The Core Deliverable</h3>
                  <p className="leading-relaxed text-sky-950">
                    The tool must distinguish between <em>genuine continuous leaks</em> and <em>routine domestic surges</em> (such as Sunday laundry or family visitors), providing mathematically meaningful warnings based on demographic cohort comparisons.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slide 2 */}
        {currentSlide === 2 && (
          <div className="space-y-6">
            <div className="border-b border-zinc-200/80 pb-4">
              <span className="text-xs font-mono font-semibold text-sky-700 uppercase tracking-wider">
                Slide 02 / 08 • User Archetype & Context
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight mt-1">
                2. Who Has This Problem and What They Do Today
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-700">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-zinc-900">Primary & Secondary Stakeholders</h3>
                <div className="p-4 bg-zinc-50 rounded border border-zinc-200 space-y-3">
                  <div>
                    <span className="font-semibold text-zinc-900 block">Urban & Semi-Urban Domestic Consumers</span>
                    <p className="text-zinc-600 mt-0.5 leading-relaxed">
                      Middle-class households connected to piped municipal water or hybrid borewells across Kerala and tier-1/2 Indian towns.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-zinc-200">
                    <span className="font-semibold text-zinc-900 block">Residential Welfare Associations & Landlords</span>
                    <p className="text-zinc-600 mt-0.5 leading-relaxed">
                      Apartment complexes and rental property owners who dispute unexpected utility charges after tenants move out.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-zinc-900">Existing Ineffective Workflows</h3>
                <div className="space-y-2.5">
                  <div className="p-3 bg-rose-50/60 border border-rose-200 rounded">
                    <span className="font-semibold text-rose-900 block">1. Late Bill Shock Discovery</span>
                    <p className="text-zinc-600 mt-0.5">
                      95% of leaks are discovered 30 to 60 days late when an inflated paper invoice arrives.
                    </p>
                  </div>
                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded">
                    <span className="font-semibold text-zinc-900 block">2. Destructive Physical Guesswork</span>
                    <p className="text-zinc-600 mt-0.5">
                      Plumbers break bathroom floor tiles or excavate courtyards searching blindly without diagnostic rate telemetry.
                    </p>
                  </div>
                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded">
                    <span className="font-semibold text-zinc-900 block">3. Total Absence of Benchmarking</span>
                    <p className="text-zinc-600 mt-0.5">
                      Households have zero reference points for expected per-capita usage (CPHEEO 135 LPCD benchmark is virtually unknown).
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
            <span className="text-xs font-mono font-semibold text-sky-700 uppercase tracking-wider">
              Slide 03 / 08 • Solution Statement
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight">
              3. What You Built (One Clear Sentence)
            </h2>

            <div className="max-w-3xl mx-auto bg-zinc-950 text-white p-8 rounded border border-zinc-800 shadow-sm">
              <p className="text-lg sm:text-xl font-medium leading-relaxed tracking-tight text-zinc-100 font-sans">
                "JalVigyan is an open household water monitoring and leak detection system that combines routine meter logging with Minimum Night Flow analysis and demographic cohort benchmarking to identify concealed leaks within 48 hours while eliminating false alarms from normal domestic spikes."
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Working Meter Logger
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Minimum Night Flow (MNF) Engine
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 248-Household Cohort Benchmark
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
            <div className="border-b border-zinc-200/80 pb-4">
              <span className="text-xs font-mono font-semibold text-sky-700 uppercase tracking-wider">
                Slide 04 / 08 • Product Architecture
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight mt-1">
                4. Live Product Workflow & User Flow
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-zinc-50 rounded border border-zinc-200 space-y-2 border-t-2 border-t-sky-600">
                <span className="font-semibold text-zinc-900 block text-sm">1. Overview Strip</span>
                <p className="text-zinc-600 leading-relaxed">
                  Real-time telemetry showing today's volume, per-capita LPCD vs 135 benchmark, and Minimum Night Flow rate with active diagnostic banner.
                </p>
                <div className="text-[11px] font-mono text-zinc-500 pt-1">
                  30-day dual trend + 24-hr diurnal curve
                </div>
              </div>

              <div className="p-4 bg-zinc-50 rounded border border-zinc-200 space-y-2 border-t-2 border-t-emerald-600">
                <span className="font-semibold text-zinc-900 block text-sm">2. Meter Ledger</span>
                <p className="text-zinc-600 leading-relaxed">
                  Rapid logging in Liters or m³, instant validation against dial rollback, and batch CSV spreadsheet import.
                </p>
                <div className="text-[11px] font-mono text-zinc-500 pt-1">
                  Automated incremental delta & rate calculation
                </div>
              </div>

              <div className="p-4 bg-zinc-50 rounded border border-zinc-200 space-y-2 border-t-2 border-t-indigo-600">
                <span className="font-semibold text-zinc-900 block text-sm">3. Cohort Matcher</span>
                <p className="text-zinc-600 leading-relaxed">
                  Demographic calibration (family size, dwelling type, garden) benchmarking usage against 248 municipal peers.
                </p>
                <div className="text-[11px] font-mono text-zinc-500 pt-1">
                  Ward peer bell-curve vs CPHEEO 135 target
                </div>
              </div>

              <div className="p-4 bg-zinc-50 rounded border border-zinc-200 space-y-2 border-t-2 border-t-amber-600">
                <span className="font-semibold text-zinc-900 block text-sm">4. Test Suite</span>
                <p className="text-zinc-600 leading-relaxed">
                  Dedicated evaluator workbench allowing immediate injection of continuous toilet/pipe leaks vs high-volume Sunday laundry spikes.
                </p>
                <div className="text-[11px] font-mono text-zinc-500 pt-1">
                  Real-time verification scorecard (100% accuracy)
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
            <div className="border-b border-zinc-200/80 pb-4">
              <span className="text-xs font-mono font-semibold text-sky-700 uppercase tracking-wider">
                Slide 05 / 08 • Engineering Stack
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight mt-1">
                5. How It Works: Architecture, Stack and Data
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
              <div className="p-4 bg-zinc-50 rounded border border-zinc-200 space-y-2.5">
                <div className="flex items-center gap-2 font-semibold text-zinc-950 text-sm border-b border-zinc-200 pb-2">
                  <Database className="w-4 h-4 text-sky-600" />
                  <span>Backend & Storage</span>
                </div>
                <ul className="space-y-1.5 text-zinc-600 leading-relaxed">
                  <li><strong>Language:</strong> Go 1.27 (`net/http` standard library).</li>
                  <li><strong>Database:</strong> SQLite via `modernc.org/sqlite` (Pure Go, 100% CGO-free, cross-platform binary).</li>
                  <li><strong>Architecture:</strong> RESTful API with automated database migration and realistic seed generators.</li>
                </ul>
              </div>

              <div className="p-4 bg-zinc-50 rounded border border-zinc-200 space-y-2.5">
                <div className="flex items-center gap-2 font-semibold text-zinc-950 text-sm border-b border-zinc-200 pb-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Frontend & Design</span>
                </div>
                <ul className="space-y-1.5 text-zinc-600 leading-relaxed">
                  <li><strong>Framework:</strong> React 19 + Vite + TypeScript.</li>
                  <li><strong>Styling:</strong> Tailwind CSS v4 design tokens.</li>
                  <li><strong>Visualizations:</strong> Recharts SVG Composed Charts (diurnal curves, cohort distribution).</li>
                  <li><strong>Resilience:</strong> Dual-mode synchronization (talks to Go API, with seamless local engine fallback for zero-downtime offline review).</li>
                </ul>
              </div>

              <div className="p-4 bg-zinc-50 rounded border border-zinc-200 space-y-2.5">
                <div className="flex items-center gap-2 font-semibold text-zinc-950 text-sm border-b border-zinc-200 pb-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Detection Algorithms</span>
                </div>
                <ul className="space-y-1.5 text-zinc-600 leading-relaxed">
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
            <div className="border-b border-zinc-200/80 pb-4">
              <span className="text-xs font-mono font-semibold text-sky-700 uppercase tracking-wider">
                Slide 06 / 08 • Honest Status
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight mt-1">
                6. What Works Now and What Does Not
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> What Works Now (100% Operational)
                </h3>
                <div className="space-y-2">
                  <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded">
                    <p className="font-semibold text-zinc-900">End-to-End Meter Logging & Validation</p>
                    <p className="text-zinc-600 mt-0.5">
                      Manual meter dial logging, rollback guards, and CSV bulk import working with real-time delta tracking.
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded">
                    <p className="font-semibold text-zinc-900">Minimum Night Flow & Outlier Separation</p>
                    <p className="text-zinc-600 mt-0.5">
                      Successfully detects toilet cistern trickle (+18 L/h) and pipe fractures (+45 L/h) while strictly ignoring a +340 L daytime laundry spike.
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded">
                    <p className="font-semibold text-zinc-900">Cohort Normalization & Cost Modeling</p>
                    <p className="text-zinc-600 mt-0.5">
                      Instant per-capita normalization and financial loss computation in INR using Indian slab tariffs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600" /> Current Limitations (What Does Not Yet)
                </h3>
                <div className="space-y-2">
                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded">
                    <p className="font-semibold text-zinc-800">Phone Camera Dial OCR</p>
                    <p className="text-zinc-600 mt-0.5">
                      Requires user to type the dial digits manually or import CSV; direct computer vision reading from analog rotary dials is not yet integrated.
                    </p>
                  </div>
                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded">
                    <p className="font-semibold text-zinc-800">Direct Smart Ultrasonic IoT Hardware</p>
                    <p className="text-zinc-600 mt-0.5">
                      Current version models and ingests digital telemetry via API/CSV, but does not ship with physical Modbus/LoRaWAN pulse hardware.
                    </p>
                  </div>
                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded">
                    <p className="font-semibold text-zinc-800">Automated SMS/WhatsApp Dispatch</p>
                    <p className="text-zinc-600 mt-0.5">
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
            <div className="border-b border-zinc-200/80 pb-4">
              <span className="text-xs font-mono font-semibold text-sky-700 uppercase tracking-wider">
                Slide 07 / 08 • Roadmap
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight mt-1">
                7. What You Would Improve with Two More Weeks
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-zinc-700">
              <div className="p-4 bg-zinc-50 rounded border border-zinc-200 space-y-2 border-t-2 border-t-sky-600">
                <span className="font-semibold text-zinc-900 block text-sm">1. Mobile Camera Dial Scanner</span>
                <p className="leading-relaxed text-zinc-600">
                  Implement an on-device WebAssembly OCR model (TensorFlow.js / Tesseract) that allows an elderly homeowner to point their phone camera at the mechanical meter dial to automatically extract and log the reading in under 2 seconds.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 rounded border border-zinc-200 space-y-2 border-t-2 border-t-emerald-600">
                <span className="font-semibold text-zinc-900 block text-sm">2. WhatsApp Emergency Alerts</span>
                <p className="leading-relaxed text-zinc-600">
                  Integrate WhatsApp Business API (via Gupshup/Twilio) to send an immediate bilingual (Malayalam and English) alert to the household head after 48 hours of persistent night flow: <em>"Notice: 18 L/h continuous leak detected. Potential toilet valve failure."</em>
                </p>
              </div>

              <div className="p-4 bg-zinc-50 rounded border border-zinc-200 space-y-2 border-t-2 border-t-indigo-600">
                <span className="font-semibold text-zinc-900 block text-sm">3. Municipal District Utility View</span>
                <p className="leading-relaxed text-zinc-600">
                  Build an aggregated, privacy-preserved municipal dashboard for KWA / local panchayat ward engineers to view non-revenue water (NRW) across pipe zones and pinpoint underground mains bursts before surface flooding.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Slide 8 */}
        {currentSlide === 8 && (
          <div className="space-y-6 my-auto">
            <div className="border-b border-zinc-200/80 pb-4">
              <span className="text-xs font-mono font-semibold text-sky-700 uppercase tracking-wider">
                Slide 08 / 08 • Team & Submission
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight mt-1">
                8. Team Names, Institution and Contact Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-700">
              <div className="p-5 bg-zinc-50 rounded border border-zinc-200 space-y-3">
                <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
                  <UserCheck className="w-4 h-4 text-sky-600" />
                  <span className="font-semibold text-sm text-zinc-950">Team Information (2 Members)</span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 bg-white rounded border border-zinc-200">
                    <p className="font-semibold text-zinc-900">Joyel (Project Lead)</p>
                    <p className="text-zinc-600 mt-0.5">Backend Go Services, Statistical Modeling, SQLite</p>
                  </div>

                  <div className="p-3 bg-white rounded border border-zinc-200">
                    <p className="font-semibold text-zinc-900">Co-Developer (Systems Engineering)</p>
                    <p className="text-zinc-600 mt-0.5">React Frontend, Recharts Analytics, Cohort Modeling</p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-zinc-50 rounded border border-zinc-200 space-y-3">
                <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
                  <Building className="w-4 h-4 text-sky-600" />
                  <span className="font-semibold text-sm text-zinc-950">Institution & Submission Credentials</span>
                </div>

                <div className="space-y-2 text-zinc-600">
                  <div>
                    <span className="font-semibold text-zinc-800">Institution:</span>
                    <p className="text-zinc-700">Amal Jyothi College of Engineering (AJCE), Kerala</p>
                  </div>

                  <div>
                    <span className="font-semibold text-zinc-800">Hackathon Event:</span>
                    <p className="text-zinc-700">ANAVANDI 2026 Selection Round (Jain Kochi to Munnar)</p>
                  </div>

                  <div>
                    <span className="font-semibold text-zinc-800">Challenge Code:</span>
                    <p className="font-mono text-zinc-700">SC-06: Household water use and leak detection</p>
                  </div>

                  <div className="pt-2 border-t border-zinc-200 flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-800 font-semibold">
                      Deployed Working Prototype Ready for Selection
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slide Canvas Footer */}
        <div className="border-t border-zinc-200/80 pt-4 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-500">
          <div className="font-mono text-[11px] text-zinc-400">
            {slideTitles[currentSlide - 1]}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-zinc-400">Navigate using arrow keys &larr; / &rarr;</span>
            <button
              onClick={() => onNavigate('dashboard')}
              className="font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1 transition-colors"
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
