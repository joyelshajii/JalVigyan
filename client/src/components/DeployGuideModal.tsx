import React, { useState } from 'react';
import { X, Globe, Server, CheckCircle2, Copy, Check } from 'lucide-react';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedVercel, setCopiedVercel] = useState(false);
  const [copiedDocker, setCopiedDocker] = useState(false);
  const [copiedDNS, setCopiedDNS] = useState(false);

  if (!isOpen) return null;

  const copyText = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-7 space-y-5 text-xs text-slate-700">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Live Deployment & Custom Domain Readiness
              </h2>
              <p className="text-[11px] text-slate-500">ANAVANDI 2026 Production Hosting Guide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Evaluation Criterion Note */}
        <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl text-emerald-950 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-xs">ANAVANDI Selection Requirement (35% Weight):</span>
            <p className="text-slate-600 leading-relaxed text-xs">
              "A live URL that the reviewers can open. A repository or a localhost video is not a deployed prototype."
            </p>
          </div>
        </div>

        {/* Deployment Options */}
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
              <Server className="w-4 h-4 text-sky-600" /> 1. Instant Production Deployment
            </h3>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div>
                <span className="font-bold text-slate-800 block text-xs">Option A (Vercel Edge Deployment):</span>
                <p className="text-slate-500 text-[11px] mb-1.5">
                  Deploys the client with its embedded resilient engine for zero-downtime static evaluation.
                </p>
                <div className="flex items-center justify-between bg-slate-900 text-slate-100 p-2.5 rounded-xl font-mono text-[11px]">
                  <span>cd client && npm run build && npx vercel --prod</span>
                  <button
                    onClick={() => copyText('cd client && npm run build && npx vercel --prod', setCopiedVercel)}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                  >
                    {copiedVercel ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-800 block text-xs">Option B (Docker Container with Go + SQLite):</span>
                <p className="text-slate-500 text-[11px] mb-1.5">
                  Fullstack containerized deployment for Render, Railway, Fly.io, or self-hosted VPS.
                </p>
                <div className="flex items-center justify-between bg-slate-900 text-slate-100 p-2.5 rounded-xl font-mono text-[11px]">
                  <span>docker build -t water-sentinel . && docker run -p 8085:8085 water-sentinel</span>
                  <button
                    onClick={() => copyText('docker build -t water-sentinel . && docker run -p 8085:8085 water-sentinel', setCopiedDocker)}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                  >
                    {copiedDocker ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600" /> 2. Custom Domain Setup
            </h3>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
              <p className="text-slate-600 text-xs leading-relaxed">
                To attach your institution or project domain (e.g. <code>water.ajce.in</code>), create a CNAME record with your DNS provider:
              </p>
              <div className="flex items-center justify-between bg-white p-2.5 border border-slate-200 rounded-xl font-mono text-[11px]">
                <span>CNAME water.ajce.in -&gt; cname.vercel-dns.com</span>
                <button
                  onClick={() => copyText('water.ajce.in CNAME cname.vercel-dns.com', setCopiedDNS)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  {copiedDNS ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="btn-primary text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
