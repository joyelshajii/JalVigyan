import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { MeterLogger } from './components/MeterLogger';
import { CohortComparison } from './components/CohortComparison';
import { LeakInjectionSuite } from './components/LeakInjectionSuite';
import { PresentationDeck } from './components/PresentationDeck';
import { TariffCalculator } from './components/TariffCalculator';
import { Legal } from './components/Legal';
import { DeployGuideModal } from './components/DeployGuideModal';
import { apiService } from './services/api';
import type {
  HouseholdProfile,
  DailySummary,
  MeterReading,
  HourlyPattern,
  AnomalyAlert,
  CohortStats,
  VerificationScorecard,
} from './types';
import { Droplet, Globe, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [household, setHousehold] = useState<HouseholdProfile>({
    id: 'HH-KWA-402',
    name: 'Mathew Residence (KWA Consumer # 4821)',
    residents: 4,
    dwelling_type: 'Independent House',
    has_garden: true,
    water_source: 'KWA Municipal Piped',
    target_lpcd: 135.0,
  });
  const [summaries, setSummaries] = useState<DailySummary[]>([]);
  const [readings, setReadings] = useState<MeterReading[]>([]);
  const [hourlyPattern, setHourlyPattern] = useState<HourlyPattern[]>([]);
  const [alerts, setAlerts] = useState<AnomalyAlert[]>([]);
  const [cohortStats, setCohortStats] = useState<CohortStats>({
    resident_count: 4,
    cohort_size: 248,
    average_lpcd: 138.5,
    median_lpcd: 132.0,
    p25_lpcd: 105.0,
    p75_lpcd: 160.0,
    national_benchmark_lpcd: 135.0,
    user_average_lpcd: 135.0,
    percentile_rank: 50.0,
    comparison_summary: 'Usage is within normal limits.',
  });
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    try {
      const isOnline = await apiService.checkHealth();
      setIsBackendOnline(isOnline);

      const [h, s, r, hp, a, cs] = await Promise.all([
        apiService.getHousehold(),
        apiService.getSummaries(),
        apiService.getReadings(40),
        apiService.getHourlyPattern(),
        apiService.getAlerts(),
        apiService.getCohortStats(),
      ]);

      setHousehold(h);
      setSummaries(s);
      setReadings(r);
      setHourlyPattern(hp);
      setAlerts(a);
      setCohortStats(cs);
    } catch (err) {
      console.error('Error loading water telemetry data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handlers
  const handleAddReading = async (meterValue: number, timestamp?: string, tag?: string) => {
    await apiService.addReading(meterValue, timestamp, tag);
    await loadData();
  };

  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter((l) => l.trim().length > 0);
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length >= 2) {
          const ts = parts[0].trim();
          const val = parseFloat(parts[1].trim());
          const tag = parts[2]?.trim() || 'csv_batch';
          if (!isNaN(val)) {
            try {
              await apiService.addReading(val, ts, tag);
            } catch {
              // ignore duplicate or out of order
            }
          }
        }
      }
      await loadData();
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleUpdateHousehold = async (updated: HouseholdProfile) => {
    const res = await apiService.updateHousehold(updated);
    setHousehold(res);
    await loadData();
  };

  const handleInjectScenario = async (
    type: string,
    flowRate?: number
  ): Promise<{ scorecard: VerificationScorecard; alerts: AnomalyAlert[] }> => {
    const res = await apiService.injectScenario(type, flowRate);
    await loadData();
    return res;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeAlertCount={alerts.length}
        isBackendOnline={isBackendOnline}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-3">
            <RefreshCw className="w-7 h-7 text-sky-600 animate-spin" />
            <span className="text-xs font-mono text-slate-500">Initializing water telemetry pipeline...</span>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                household={household}
                summaries={summaries}
                hourlyPattern={hourlyPattern}
                alerts={alerts}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'logger' && (
              <MeterLogger
                readings={readings}
                onAddReading={handleAddReading}
                onBatchUpload={handleBatchUpload}
              />
            )}

            {activeTab === 'cohorts' && (
              <CohortComparison
                household={household}
                cohortStats={cohortStats}
                onUpdateHousehold={handleUpdateHousehold}
              />
            )}

            {activeTab === 'tariff' && (
              <TariffCalculator
                household={household}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'leak-suite' && (
              <LeakInjectionSuite
                onInjectScenario={handleInjectScenario}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'presentation' && (
              <PresentationDeck onNavigate={setActiveTab} />
            )}

            {activeTab === 'legal' && <Legal />}
          </>
        )}
      </main>

      {/* Deployment and Domain Guide Modal */}
      <DeployGuideModal
        isOpen={isDeployGuideOpen}
        onClose={() => setIsDeployGuideOpen(false)}
      />

      {/* Understated Modern Utility Footer */}
      <footer className="bg-white border-t border-slate-200/80 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <Droplet className="w-3.5 h-3.5 fill-white/20" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">JalVigyan</span>
              <span className="text-slate-400 text-[11px] font-mono">SC-06 Sentinel Prototype</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="hover:text-slate-950 transition-colors"
            >
              Overview
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('logger')}
              className="hover:text-slate-950 transition-colors"
            >
              Meter Ledger
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('cohorts')}
              className="hover:text-slate-950 transition-colors"
            >
              Community
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('tariff')}
              className="hover:text-slate-950 transition-colors"
            >
              Tariff & Slabs
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('leak-suite')}
              className="hover:text-slate-950 transition-colors"
            >
              Simulator Lab
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('presentation')}
              className="hover:text-slate-950 transition-colors"
            >
              Pitch Deck
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('legal')}
              className="hover:text-slate-950 transition-colors"
            >
              Privacy & Legal
            </button>
            <span>•</span>
            <button
              onClick={() => setIsDeployGuideOpen(true)}
              className="hover:text-slate-950 transition-colors flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Deploy Guide</span>
            </button>
          </div>

          <div className="text-center sm:text-right text-xs text-slate-400">
            Amal Jyothi College of Engineering • ANAVANDI 2026
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
