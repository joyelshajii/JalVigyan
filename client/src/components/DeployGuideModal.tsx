import React from 'react';
import { X, Globe, Server, CheckCircle2, ExternalLink, ShieldCheck, Copy, Check } from 'lucide-react';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const copyDNS = () => {
    navigator.clipboard.writeText('CNAME water-sentinel cname.vercel-dns.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-300 rounded-lg shadow-xl max-w-2xl w-full p-6 space-y-5 text-xs text-slate-700">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-sky-600" />
            <h2 className="text-base font-bold text-slate-900">
              Live Deployment & Custom Domain Readiness Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hackathon Requirement Check */}
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-950 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">ANAVANDI Selection Requirement (35% Score Weightage):</span>
            <p className="mt-0.5 text-emerald-900 leading-relaxed">
              "A live URL that the reviewers can open. A repository or a localhost video is not a deployed prototype."
            </p>
          </div>
        </div>

        {/* Deployment Options */}
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-sky-600" /> 1. Instant 60-Second Web Deployment
            </h3>
            <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-2">
              <p>
                <strong>Option A (Static & Dual-Engine Client - Vercel / Netlify):</strong>
              </p>
              <pre className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-[11px] overflow-x-auto">
                cd client && npm run build && npx vercel --prod
              </pre>
              <p className="text-slate-600">
                The client includes the built-in resilient engine, running 100% offline or on static CDN edge nodes without external database latency.
              </p>

              <p className="pt-2">
                <strong>Option B (Full Go Backend + SQLite - Render / Railway / Docker):</strong>
              </p>
              <pre className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-[11px] overflow-x-auto">
                docker build -t water-sentinel . && docker run -p 8080:8080 water-sentinel
              </pre>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-600" /> 2. Custom Domain Configuration
            </h3>
            <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-2">
              <p>
                To bind your institution or project domain (e.g. <code>water.ajce.in</code> or <code>jalvigyan.in</code>), create a DNS record with your registrar:
              </p>
              <div className="flex items-center justify-between bg-white p-2 border border-slate-300 rounded font-mono text-[11px]">
                <span>Type: <strong>CNAME</strong> | Host: <strong>water</strong> | Value: <strong>cname.vercel-dns.com</strong></span>
                <button
                  onClick={copyDNS}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded flex items-center gap-1 text-[10px]"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 3. Official Submission Form
            </h3>
            <div className="p-3 bg-sky-50 border border-sky-200 rounded flex items-center justify-between">
              <div>
                <span className="font-bold text-sky-950">ANAVANDI 2026 Project Update Form</span>
                <p className="text-[11px] text-sky-800 font-mono">forms.gle/iPRFq7zTfPL84Dqq9</p>
              </div>
              <a
                href="https://forms.gle/iPRFq7zTfPL84Dqq9"
                target="_blank"
                rel="noreferrer"
                className="btn-primary text-xs py-1.5"
              >
                <span>Open Form</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-3 flex justify-end">
          <button onClick={onClose} className="btn-secondary text-xs">
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
