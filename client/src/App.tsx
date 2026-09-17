import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { MeterLogger } from './components/MeterLogger';
import { CohortComparison } from './components/CohortComparison';
import { LeakInjectionSuite } from './components/LeakInjectionSuite';
import { PresentationDeck } from './components/PresentationDeck';
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeAlertCount={alerts.length}
        isBackendOnline={isBackendOnline}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <RefreshCw className="w-8 h-8 text-sky-600 animate-spin" />
            <p className="text-xs font-mono text-slate-500">Initializing hydraulic telemetry telemetry pipeline...</p>
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

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 text-white rounded flex items-center justify-center">
              <Droplet className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div>
              <span className="font-semibold text-slate-800">JalVigyan Sentinel</span>
              <span className="text-slate-400 ml-1.5 font-mono">SC-06 Prototype</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <button
              onClick={() => setActiveTab('presentation')}
              className="hover:text-slate-900 transition-colors"
            >
              8-Slide Presentation Deck
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('legal')}
              className="hover:text-slate-900 transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('legal')}
              className="hover:text-slate-900 transition-colors"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              onClick={() => setIsDeployGuideOpen(true)}
              className="hover:text-slate-900 transition-colors flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Domain Setup</span>
            </button>
          </div>

          <div className="text-center sm:text-right font-mono text-[11px] text-slate-400">
            ANAVANDI 2026 Selection Round | AJCE
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
