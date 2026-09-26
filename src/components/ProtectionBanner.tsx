import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const ProtectionBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-brand-950/60 border border-brand-500/20 rounded-lg px-3 py-2 text-xs text-slate-300 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0" />
          <span>AI-assisted prototype — not forensic verification.</span>
        </div>
        <span className="text-[10px] bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded font-mono">DEMO ENVIRONMENT</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-brand-500/10 rounded-lg text-brand-400 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-semibold text-white">Prototype & Privacy Information</h4>
            <span className="text-[10px] bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full font-mono">ASSISTIVE AI</span>
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            DeepShield Women is an educational demonstration application. AI analysis provides structural organization and heuristic risk detection to assist users, but does not provide legally binding forensic verification. Do not upload sensitive real-world evidence into this demonstration environment.
          </p>
        </div>
      </div>
    </div>
  );
};
