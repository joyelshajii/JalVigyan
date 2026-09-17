import React from 'react';
import {
  Droplet,
  LayoutDashboard,
  Binary,
  Users2,
  AlertCircle,
  Presentation,
  Shield,
  ExternalLink,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeAlertCount: number;
  isBackendOnline: boolean;
  onOpenDeployGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeAlertCount,
  isBackendOnline,
  onOpenDeployGuide,
}) => {
  const navTabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'logger', label: 'Meter Ledger', icon: Binary },
    { id: 'cohorts', label: 'Cohort Benchmarks', icon: Users2 },
    {
      id: 'leak-suite',
      label: 'Leak Test Suite',
      icon: AlertCircle,
      badge: 'Test Harness',
    },
    { id: 'presentation', label: 'Pitch Deck (8 Slides)', icon: Presentation },
  ];

  return (
    <header className="bg-white border-b border-zinc-200/80 sticky top-0 z-40">
      {/* Top Application Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 border-b border-zinc-100">
          {/* Brand & Connection Context */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="w-7 h-7 rounded bg-sky-600 text-white flex items-center justify-center shadow-xs">
                <Droplet className="w-4 h-4" />
              </div>
              <span className="font-semibold text-zinc-950 text-sm tracking-tight">JalVigyan</span>
            </div>

            <div className="h-4 w-px bg-zinc-200 hidden sm:block"></div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500">
              <span className="font-medium text-zinc-700">SC-06 Sentinel</span>
              <span>/</span>
              <span className="font-mono text-zinc-400 text-[11px]">KWA Consumer # 4821</span>
            </div>
          </div>

          {/* Right Status & Meta Actions */}
          <div className="flex items-center gap-2.5">
            {/* Live Telemetry Heartbeat */}
            <div
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono border ${
                isBackendOnline
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-sky-50 text-sky-800 border-sky-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isBackendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-sky-500'
                }`}
              ></span>
              <span>{isBackendOnline ? 'Go API :8085' : 'Resilient Engine'}</span>
            </div>

            <button
              onClick={onOpenDeployGuide}
              className="btn-secondary py-1 px-2.5 text-xs text-zinc-600 hover:text-zinc-900 flex items-center gap-1.5"
              title="Custom Domain & Deployment Guide"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Deployment</span>
            </button>

            <button
              onClick={() => setActiveTab('legal')}
              className={`p-1.5 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors ${
                activeTab === 'legal' ? 'text-zinc-900 bg-zinc-100' : ''
              }`}
              title="Data Governance & Terms"
            >
              <Shield className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none" aria-label="Tabs">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors relative ${
                  isActive
                    ? 'border-sky-600 text-sky-700 font-semibold'
                    : 'border-transparent text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-600' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>

                {tab.id === 'leak-suite' && tab.badge && (
                  <span className="text-[10px] font-medium font-mono px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    {tab.badge}
                  </span>
                )}

                {tab.id === 'dashboard' && activeAlertCount > 0 && (
                  <span className="flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rose-600 rounded-full">
                    {activeAlertCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
