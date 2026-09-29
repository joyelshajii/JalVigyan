import React, { useState } from 'react';
import {
  Droplet,
  LayoutDashboard,
  Binary,
  Users2,
  AlertCircle,
  Presentation,
  Shield,
  ExternalLink,
  Menu,
  X,
  Radio,
  IndianRupee,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navTabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'logger', label: 'Meter Ledger', icon: Binary },
    { id: 'cohorts', label: 'Community Benchmarks', icon: Users2 },
    { id: 'tariff', label: 'Tariff & Slabs', icon: IndianRupee },
    {
      id: 'leak-suite',
      label: 'Leak Simulator',
      icon: AlertCircle,
      badge: 'Test Lab',
    },
    { id: 'presentation', label: 'Pitch Deck', icon: Presentation },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Connection Context */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2.5 cursor-pointer select-none group"
              onClick={() => handleTabClick('dashboard')}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Droplet className="w-5 h-5 fill-white/20" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-base tracking-tight leading-none">
                    JalVigyan
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold font-mono rounded-md bg-sky-50 text-sky-700 border border-sky-200/60">
                    SC-06
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5 hidden xs:block">
                  Water & Leak Sentinel
                </span>
              </div>
            </div>

            <div className="hidden xl:flex items-center gap-2 ml-3 pl-3 border-l border-slate-200 text-xs text-slate-500">
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[11px]">
                KWA Consumer #4821
              </span>
            </div>
          </div>

          {/* Desktop Segmented Navigation Pills */}
          <nav className="hidden md:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/70" aria-label="Tabs">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all relative ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>

                  {tab.id === 'leak-suite' && tab.badge && (
                    <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800">
                      {tab.badge}
                    </span>
                  )}

                  {tab.id === 'dashboard' && activeAlertCount > 0 && (
                    <span className="flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rose-600 rounded-full animate-pulse">
                      {activeAlertCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Badges & Controls */}
          <div className="flex items-center gap-2.5">
            {/* Live Telemetry Heartbeat Indicator */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                isBackendOnline
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                  : 'bg-sky-50 text-sky-700 border-sky-200/80'
              }`}
              title={isBackendOnline ? 'Go API Backend Active on port 8085' : 'In-Browser Engine Resilient Mode'}
            >
              <Radio className={`w-3 h-3 ${isBackendOnline ? 'text-emerald-500 animate-pulse' : 'text-sky-500'}`} />
              <span className="font-mono text-[11px]">
                {isBackendOnline ? 'Live API :8085' : 'Resilient Engine'}
              </span>
            </div>

            {/* Deployment Guide Action */}
            <button
              onClick={onOpenDeployGuide}
              className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
              title="Deployment & Custom Domain Readiness"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Deployment</span>
            </button>

            {/* Legal / Data Governance */}
            <button
              onClick={() => handleTabClick('legal')}
              className={`p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors ${
                activeTab === 'legal' ? 'text-sky-600 bg-sky-50' : ''
              }`}
              title="Data Governance & Terms"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <div className="px-2 py-1.5 text-xs text-slate-400 font-mono">
            KWA Consumer #4821 • Mathew Residence
          </div>
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </div>

                {tab.id === 'leak-suite' && tab.badge && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {tab.badge}
                  </span>
                )}

                {tab.id === 'dashboard' && activeAlertCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-rose-600 rounded-full">
                    {activeAlertCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
