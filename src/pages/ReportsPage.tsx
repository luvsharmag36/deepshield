import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header.js';
import { Sidebar } from '../components/Sidebar.js';
import { ProtectionBanner } from '../components/ProtectionBanner.js';
import { RiskBadge } from '../components/RiskBadge.js';
import { CaseItem } from '../types/index.js';
import { FileText, Download, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [reportData, setReportData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/cases')
      .then(res => res.json())
      .then(data => {
        setCases(data);
        if (data.length > 0) {
          setSelectedCaseId(data[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const fetchReportData = async (caseId: string) => {
    if (!caseId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/reports/${caseId}/json`);
      if (res.ok) {
        setReportData(await res.json());
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCaseId) {
      fetchReportData(selectedCaseId);
    }
  }, [selectedCaseId]);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white font-outfit">Evidence Report Generator</h1>
              <p className="text-xs text-slate-400 mt-1">Compile structured evidence portfolios with AI findings and Human-in-the-Loop review notes.</p>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl px-3.5 py-2 focus:outline-none focus:border-brand-500 font-mono"
              >
                {cases.map(c => (
                  <option key={c.id} value={c.id}>{c.id} — {c.title}</option>
                ))}
              </select>

              {selectedCaseId && (
                <a
                  href={`/api/reports/${selectedCaseId}/pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-brand-600/25 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Report</span>
                </a>
              )}
            </div>
          </div>

          <ProtectionBanner compact />

          {/* Report Live Document Preview */}
          {reportData ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8 shadow-2xl max-w-4xl mx-auto">
              {/* Report Header */}
              <div className="border-b border-slate-800 pb-6 flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-6 h-6 text-brand-400" />
                    <h2 className="text-xl font-extrabold text-white font-outfit tracking-tight">DEEPSHIELD EVIDENCE REPORT</h2>
                  </div>
                  <span className="text-xs text-slate-400 mt-1 block">Case ID: {reportData.caseInfo.id} | Generated: {new Date(reportData.generatedAt).toLocaleDateString()}</span>
                </div>
                <div className="text-right">
                  <span className="bg-brand-500/20 text-brand-300 text-xs px-3 py-1 rounded-full font-mono">
                    STATUS: {reportData.caseInfo.status}
                  </span>
                </div>
              </div>

              {/* Disclaimer Notice */}
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-xs text-amber-300 space-y-1">
                <span className="font-bold block">PROTOTYPE & LEGAL DISCLAIMER:</span>
                <p>AI-assisted analysis requiring human verification. Prototype only — not a forensic or legal determination of criminal guilt.</p>
              </div>

              {/* Section 1: Case Overview */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white font-outfit uppercase tracking-wider text-brand-400 border-b border-slate-800 pb-1">1. Case Overview</h3>
                <div className="grid sm:grid-cols-2 gap-4 text-xs text-slate-300">
                  <div><span className="text-slate-500 font-mono">Title:</span> {reportData.caseInfo.title}</div>
                  <div><span className="text-slate-500 font-mono">Category:</span> {reportData.caseInfo.category}</div>
                  <div className="sm:col-span-2"><span className="text-slate-500 font-mono">Description:</span> {reportData.caseInfo.description}</div>
                </div>
              </div>

              {/* Section 2: Evidence Inventory */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white font-outfit uppercase tracking-wider text-brand-400 border-b border-slate-800 pb-1">
                  2. Evidence Inventory ({reportData.evidenceList.length} items)
                </h3>
                <div className="space-y-2">
                  {reportData.evidenceList.map((ev: any) => (
                    <div key={ev.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-brand-400 mr-2">{ev.id}</span>
                        <span className="font-semibold text-white">{ev.title}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">Type: {ev.type} | Platform: {ev.source} | Date: {ev.date}</span>
                      </div>
                      <RiskBadge level={ev.riskLevel} size="sm" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: AI Diagnostic Summary */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white font-outfit uppercase tracking-wider text-brand-400 border-b border-slate-800 pb-1">3. AI Diagnostic Summary</h3>
                <div className="space-y-2">
                  {reportData.analyses.map((a: any) => (
                    <div key={a.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-brand-300 font-bold">Evidence: {a.evidenceId}</span>
                        <span className="text-slate-400 font-mono">Risk Score: {a.score}/100</span>
                      </div>
                      <p className="text-slate-300">{a.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Human Review Audit Log */}
              {reportData.reviews.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white font-outfit uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-1">4. Human Review Audit Log</h3>
                  <div className="space-y-2">
                    {reportData.reviews.map((r: any) => (
                      <div key={r.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between font-mono text-[10px] text-emerald-400">
                          <span>Reviewer: {r.reviewerName} | Action: {r.action}</span>
                          <span>{new Date(r.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-200">"{r.notes}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
              Select a case to compile evidence report preview.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
