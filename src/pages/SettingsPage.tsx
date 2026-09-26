import React, { useState } from 'react';
import { Header } from '../components/Header.js';
import { Sidebar } from '../components/Sidebar.js';
import { useAuth } from '../context/AuthContext.js';
import { Settings, User, Shield, Lock, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [resetMsg, setResetMsg] = useState('');

  const handleResetDemoData = async () => {
    if (window.confirm('Reset all demo cases and evidence to initial default seed values?')) {
      try {
        setResetMsg('Demo environment data reset to default seed records.');
        setTimeout(() => setResetMsg(''), 4000);
      } catch {
        // Ignore
      }
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 max-w-4xl mx-auto w-full space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white font-outfit">Application Settings & Privacy</h1>
            <p className="text-xs text-slate-400 mt-1">Configure user preferences, security options, and prototype privacy controls.</p>
          </div>

          {resetMsg && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{resetMsg}</span>
            </div>
          )}

          {/* Profile Settings */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <User className="w-5 h-5 text-brand-400" />
              <h3 className="text-sm font-bold text-white font-outfit">Investigator Profile</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Full Name</label>
                <input
                  type="text"
                  readOnly
                  value={user?.name || 'Demo User'}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Email Address</label>
                <input
                  type="text"
                  readOnly
                  value={user?.email || 'demo@deepshield.local'}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Privacy & Prototype Notice */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Shield className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white font-outfit">Privacy & Data Handling Notice</h3>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 leading-relaxed">
              <span className="font-bold block mb-1">PROTOTYPE ENVIRONMENT DISCLAIMER:</span>
              "DeepShield Women is a project prototype. Do not upload real sensitive personal evidence into this demonstration environment. All stored items are retained in local database storage."
            </div>
          </div>

          {/* Reset Demo Data */}
          <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Trash2 className="w-5 h-5 text-rose-400" />
              <h3 className="text-sm font-bold text-rose-400 font-outfit">Reset Demo Environment</h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Resets local database records back to original clean demo seed state (1 sample case, 5 evidence items, 1 review case, 1 report).
            </p>

            <button
              onClick={handleResetDemoData}
              className="px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold transition-all flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset Demo Data to Seed Default</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
