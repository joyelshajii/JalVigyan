import React from 'react';
import { Droplet, Activity, Database, Users, AlertTriangle, Presentation, ShieldCheck, ExternalLink } from 'lucide-react';

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
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'logger', label: 'Meter Logger', icon: Database },
    { id: 'cohorts', label: 'Cohort Benchmark', icon: Users },
    {
      id: 'leak-suite',
      label: 'Leak Test Suite',
      icon: AlertTriangle,
      badge: 'Evaluation Harness',
    },
    { id: 'presentation', label: 'Pitch Deck (8 Slides)', icon: Presentation },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 bg-sky-600 rounded flex items-center justify-center text-white shadow-sm">
              <Droplet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-base tracking-tight">JalVigyan</span>
                <span className="text-xs font-mono px-1.5 py-0.5 bg-slate-800 text-sky-400 border border-slate-700 rounded">
                  SC-06 Sentinel
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal">Household Water Monitoring & Anomaly Sentinel</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-sky-400 border border-slate-700'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                      {item.badge}
                    </span>
                  )}
                  {item.id === 'dashboard' && activeAlertCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status & Tools */}
          <div className="flex items-center gap-3">
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border ${
                isBackendOnline
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
                  : 'bg-slate-800 text-sky-300 border-slate-700'
              }`}
              title={isBackendOnline ? 'Connected to Go SQLite Backend (Port 8085)' : 'Client-Side Resilient Engine Active'}
            >
              <span className={`w-2 h-2 rounded-full ${isBackendOnline ? 'bg-emerald-400' : 'bg-sky-400'}`}></span>
              <span>{isBackendOnline ? 'Go API :8085' : 'Resilient Engine'}</span>
            </div>

            <button
              onClick={onOpenDeployGuide}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700"
              title="Custom Domain & Deployment Guide"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Deploy & Domain</span>
            </button>

            <button
              onClick={() => setActiveTab('legal')}
              className={`p-1.5 rounded text-slate-400 hover:text-white ${activeTab === 'legal' ? 'text-sky-400 bg-slate-800' : ''}`}
              title="Privacy Policy & Terms"
            >
              <ShieldCheck className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Tab bar */}
        <div className="md:hidden flex items-center justify-between border-t border-slate-800 py-2 overflow-x-auto gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs whitespace-nowrap ${
                  isActive ? 'bg-slate-800 text-sky-400 font-medium' : 'text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
