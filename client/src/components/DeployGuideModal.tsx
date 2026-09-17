import React, { useState } from 'react';
import { X, Globe, Server, CheckCircle2, ExternalLink, ShieldCheck, Copy, Check } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-zinc-950/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-zinc-200 rounded shadow-xl max-w-2xl w-full p-6 space-y-5 text-xs text-zinc-700">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-600" />
            <h2 className="text-sm font-semibold text-zinc-950">
              Live Deployment & Custom Domain Readiness
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Evaluation Criterion Note */}
        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded text-emerald-950 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-xs">ANAVANDI Selection Requirement (35% Weight):</span>
            <p className="mt-0.5 text-zinc-600 leading-relaxed text-[11px]">
              "A live URL that the reviewers can open. A repository or a localhost video is not a deployed prototype."
            </p>
          </div>
        </div>

        {/* Deployment Options */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-zinc-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-sky-600" /> 1. Instant Production Deployment
            </h3>
            <div className="bg-zinc-50 p-3.5 rounded border border-zinc-200 space-y-2.5">
              <div>
                <span className="font-semibold text-zinc-800 block text-xs">Option A (Vercel Edge Deployment):</span>
                <p className="text-zinc-500 text-[11px] mb-1.5">
                  Deploys the client with its embedded resilient engine for zero-downtime static evaluation.
                </p>
                <div className="flex items-center justify-between bg-zinc-900 text-zinc-100 p-2 rounded font-mono text-[11px]">
                  <span>cd client && npm run build && npx vercel --prod</span>
                  <button
                    onClick={() => copyText('cd client && npm run build && npx vercel --prod', setCopiedVercel)}
                    className="p-1 text-zinc-400 hover:text-white transition-colors"
                  >
                    {copiedVercel ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-200">
                <span className="font-semibold text-zinc-800 block text-xs">Option B (Docker Container with Go + SQLite):</span>
                <p className="text-zinc-500 text-[11px] mb-1.5">
                  Fullstack containerized deployment for Render, Railway, Fly.io, or self-hosted VPS.
                </p>
                <div className="flex items-center justify-between bg-zinc-900 text-zinc-100 p-2 rounded font-mono text-[11px]">
                  <span>docker build -t water-sentinel . && docker run -p 8085:8085 water-sentinel</span>
                  <button
                    onClick={() => copyText('docker build -t water-sentinel . && docker run -p 8085:8085 water-sentinel', setCopiedDocker)}
                    className="p-1 text-zinc-400 hover:text-white transition-colors"
                  >
                    {copiedDocker ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-zinc-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-600" /> 2. Custom Domain Setup
            </h3>
            <div className="bg-zinc-50 p-3.5 rounded border border-zinc-200 space-y-2">
              <p className="text-zinc-600 text-[11px]">
                To attach your institution or project domain (e.g. <code>water.ajce.in</code>), create a CNAME record with your DNS provider:
              </p>
              <div className="flex items-center justify-between bg-white p-2 border border-zinc-200 rounded font-mono text-[11px]">
                <span>Type: <strong>CNAME</strong> | Host: <strong>water</strong> | Target: <strong>cname.vercel-dns.com</strong></span>
                <button
                  onClick={() => copyText('CNAME water cname.vercel-dns.com', setCopiedDNS)}
                  className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded text-[10px] flex items-center gap-1"
                >
                  {copiedDNS ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedDNS ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-zinc-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 3. Official Submission Form
            </h3>
            <div className="p-3 bg-sky-50/70 border border-sky-200 rounded flex items-center justify-between">
              <div>
                <span className="font-semibold text-sky-950 text-xs">ANAVANDI 2026 Project Update Form</span>
                <p className="text-[11px] text-sky-800 font-mono">forms.gle/iPRFq7zTfPL84Dqq9</p>
              </div>
              <a
                href="https://forms.gle/iPRFq7zTfPL84Dqq9"
                target="_blank"
                rel="noreferrer"
                className="btn-primary py-1 px-3 text-xs"
              >
                <span>Open Form</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-100 pt-3 flex justify-end">
          <button onClick={onClose} className="btn-secondary text-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
