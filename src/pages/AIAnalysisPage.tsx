import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../components/Header.js';
import { Sidebar } from '../components/Sidebar.js';
import { RiskBadge } from '../components/RiskBadge.js';
import { ProtectionBanner } from '../components/ProtectionBanner.js';
import { EvidenceItem, AIAnalysisResult, HumanReviewRecord } from '../types/index.js';
import { Sparkles, ShieldAlert, CheckCircle2, UserCheck, ArrowLeft, RefreshCw, FileText } from 'lucide-react';

export const AIAnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // evidenceId if accessed directly
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>(id || 'DS-EV-0001');
  const [evidenceData, setEvidenceData] = useState<EvidenceItem | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [reviews, setReviews] = useState<HumanReviewRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    fetch('/api/evidence')
      .then(res => res.json())
      .then(data => {
        setEvidenceList(data);
        if (!id && data.length > 0) {
          setSelectedId(data[0].id);
        }
      })
      .catch(() => {});
  }, [id]);

  const fetchDetails = async (targetId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/evidence/${targetId}`);
      if (res.ok) {
        const data = await res.json();
        setEvidenceData(data.evidence);
        setAiAnalysis(data.aiAnalysis);
        setReviews(data.reviews || []);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedId) {
      fetchDetails(selectedId);
    }
  }, [selectedId]);

  const handleReAnalyze = async () => {
    if (!selectedId) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch(`/api/analysis/${selectedId}`, { method: 'POST' });
      if (res.ok) {
        await fetchDetails(selectedId);
      }
    } catch {
      // Ignore
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white font-outfit">AI Evidence Analysis Inspector</h1>
              <p className="text-xs text-slate-400 mt-1">Deep Shield natural language & visual metadata heuristic diagnostics.</p>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 font-mono"
              >
                {evidenceList.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.id} — {ev.title}</option>
                ))}
              </select>

              <button
                onClick={handleReAnalyze}
                disabled={isAnalyzing}
                className="inline-flex items-center space-x-1.5 bg-brand-600 hover:bg-brand-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-brand-600/25"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Scanning...' : 'Re-Run AI Scan'}</span>
              </button>
            </div>
          </div>

          <ProtectionBanner compact />

          {evidenceData && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Evidence Overview Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-mono text-xs font-bold text-brand-400">{evidenceData.id}</span>
                  <RiskBadge level={evidenceData.riskLevel} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-white mb-1">{evidenceData.title}</h3>
                  <span className="text-[10px] text-slate-400 font-mono block">Type: {evidenceData.type} | Platform: {evidenceData.source}</span>
                </div>

                {evidenceData.fileUrl && (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-center">
                    <img src={evidenceData.fileUrl} alt="Evidence media" className="max-h-56 mx-auto rounded-lg object-contain" />
                  </div>
                )}

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">DESCRIPTION & TEXT</span>
                    <p className="text-slate-200 mt-1 leading-relaxed">{evidenceData.description || 'No description provided.'}</p>
                  </div>
                  {evidenceData.accountUsername && (
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">FLAGGED USERNAME</span>
                      <span className="text-brand-300 font-mono font-semibold">{evidenceData.accountUsername}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Diagnostic Output */}
              <div className="lg:col-span-2 space-y-6">
                {aiAnalysis ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-5 h-5 text-brand-400" />
                          <h3 className="text-lg font-bold text-white font-outfit">AI Heuristic Diagnostic Report</h3>
                        </div>
                        <span className="text-xs text-slate-400 mt-0.5 block">Confidence Rating: {aiAnalysis.confidence}%</span>
                      </div>

                      <div className="flex items-center space-x-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                        <span className="text-xs text-slate-400 font-mono">Risk Score:</span>
                        <span className="text-xl font-extrabold text-brand-400 font-outfit">{aiAnalysis.score} / 100</span>
                      </div>
                    </div>

                    {/* Detected Categories */}
                    <div>
                      <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">DETECTED INCIDENT CATEGORIES</h4>
                      <div className="flex flex-wrap gap-2">
                        {aiAnalysis.detectedCategories.map((cat, i) => (
                          <span key={i} className="bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs px-3 py-1 rounded-full font-medium">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Indicators */}
                    <div>
                      <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">FLAGGED THREAT INDICATORS</h4>
                      <ul className="space-y-2">
                        {aiAnalysis.keyIndicators.map((ind, i) => (
                          <li key={i} className="flex items-start space-x-2 text-xs text-slate-200 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>{ind}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Media Manipulation Analysis (Prompt 12) */}
                    {aiAnalysis.metadataAnalysis && (
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-mono font-bold text-brand-300 uppercase">MEDIA AUTHENTICITY ANALYSIS</h4>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">VISION DIAGNOSTICS</span>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-300">
                          <div><span className="text-slate-500 font-mono">Dimensions:</span> {aiAnalysis.metadataAnalysis.fileDimensions}</div>
                          <div><span className="text-slate-500 font-mono">Format:</span> {aiAnalysis.metadataAnalysis.fileFormat}</div>
                        </div>
                        {aiAnalysis.metadataAnalysis.manipulationSignals && (
                          <div className="border-t border-slate-800/80 pt-2 space-y-1">
                            <span className="text-[11px] font-semibold text-slate-400">Signals Identified:</span>
                            {aiAnalysis.metadataAnalysis.manipulationSignals.map((sig, i) => (
                              <div key={i} className="text-xs text-amber-300/90 flex items-center space-x-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                <span>{sig}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Explanation Panel */}
                    <div className="bg-brand-950/40 border border-brand-500/20 p-4 rounded-xl space-y-2">
                      <h4 className="text-xs font-semibold text-brand-300">Diagnostic Summary & Explanation</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{aiAnalysis.explanation}</p>
                    </div>

                    {/* Human Review Status */}
                    <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 font-mono block">HUMAN REVIEW GOVERNANCE</span>
                        <span className="text-xs font-semibold text-white">
                          {reviews.length > 0 ? `Reviewed by ${reviews[0].reviewerName}` : 'Pending Human Confirmation'}
                        </span>
                      </div>
                      <Link
                        to="/review"
                        className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-brand-300 border border-brand-500/30 px-3.5 py-1.5 rounded-lg text-xs font-semibold"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Go to Review Center</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
                    No AI analysis record found for this evidence item. Click "Re-Run AI Scan" to process heuristics.
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
