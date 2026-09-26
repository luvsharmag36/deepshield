import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header.js';
import { Sidebar } from '../components/Sidebar.js';
import { RiskBadge } from '../components/RiskBadge.js';
import { RiskLevel, HumanReviewRecord } from '../types/index.js';
import { UserCheck, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, MessageSquare, History } from 'lucide-react';

export const ReviewCenterPage: React.FC = () => {
  const [reviewQueue, setReviewQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Review Form state
  const [action, setAction] = useState<'Confirmed' | 'Modified Risk' | 'Rejected Flag'>('Confirmed');
  const [finalRisk, setFinalRisk] = useState<RiskLevel>('HIGH');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchQueue = async () => {
    try {
      const res = await fetch('/api/review');
      if (res.ok) {
        const data = await res.json();
        setReviewQueue(data);
        if (data.length > 0) {
          setSelectedItem(data[0]);
          setFinalRisk(data[0].evidence.riskLevel);
        }
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleSelect = (item: any) => {
    setSelectedItem(item);
    setFinalRisk(item.evidence.riskLevel);
    setAction('Confirmed');
    setNotes('');
    setSuccessMsg('');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setIsSubmitting(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evidenceId: selectedItem.evidence.id,
          finalRisk,
          action,
          notes
        })
      });

      if (res.ok) {
        setSuccessMsg(`Review successfully recorded for ${selectedItem.evidence.id}. Final Risk set to ${finalRisk}.`);
        await fetchQueue();
      }
    } catch {
      // Ignore
    } finally {
      setIsSubmitting(false);
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
              <h1 className="text-2xl font-extrabold text-white font-outfit">Human-in-the-Loop Review Center</h1>
              <p className="text-xs text-slate-400 mt-1">Human reviewers retain final authority over AI threat assessments.</p>
            </div>

            {/* Formula Badge */}
            <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono text-slate-300 flex items-center space-x-2">
              <span className="text-brand-400 font-bold">AI Assessment</span>
              <span>+</span>
              <span className="text-emerald-400 font-bold">Human Review</span>
              <span>=</span>
              <span className="text-white font-extrabold">Final Case Assessment</span>
            </div>
          </div>

          {successMsg && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Queue List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[650px]">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase font-mono">REVIEW QUEUE ({reviewQueue.length})</span>
                <span className="text-[10px] text-slate-400 font-mono">SELECT ITEM</span>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-800">
                {reviewQueue.map((item) => (
                  <button
                    key={item.evidence.id}
                    onClick={() => handleSelect(item)}
                    className={`w-full p-4 text-left transition-colors flex flex-col justify-between ${
                      selectedItem?.evidence.id === item.evidence.id
                        ? 'bg-brand-950/40 border-l-4 border-brand-500'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-bold text-brand-400">{item.evidence.id}</span>
                        <RiskBadge level={item.evidence.riskLevel} size="sm" />
                      </div>
                      <h4 className="text-xs font-semibold text-white truncate">{item.evidence.title}</h4>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{item.evidence.caseTitle}</span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{item.evidence.type}</span>
                      <span className={item.evidence.analysisStatus === 'Flagged' ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                        {item.evidence.analysisStatus}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Review Decision Workspace */}
            <div className="lg:col-span-2 space-y-6">
              {selectedItem ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                  {/* Item Header */}
                  <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-brand-400 bg-brand-500/10 border border-brand-500/30 px-2.5 py-0.5 rounded-full">
                          {selectedItem.evidence.id}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">Platform: {selectedItem.evidence.source}</span>
                      </div>
                      <h2 className="text-xl font-bold text-white font-outfit mt-2">{selectedItem.evidence.title}</h2>
                      <p className="text-xs text-slate-300 mt-1">{selectedItem.evidence.description}</p>
                    </div>
                    <RiskBadge level={selectedItem.evidence.riskLevel} size="lg" />
                  </div>

                  {/* AI Diagnosis Context */}
                  {selectedItem.aiAnalysis && (
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-brand-400">AI HEURISTIC DIAGNOSIS</span>
                        <span className="text-slate-400 font-mono">Score: {selectedItem.aiAnalysis.score}/100</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{selectedItem.aiAnalysis.explanation}</p>
                      <div className="pt-2 flex flex-wrap gap-1">
                        {selectedItem.aiAnalysis.keyIndicators.map((ind: string, idx: number) => (
                          <span key={idx} className="bg-rose-500/10 text-rose-300 text-[10px] px-2 py-0.5 rounded border border-rose-500/20">
                            {ind}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Human Reviewer Input Form */}
                  <form onSubmit={handleSubmitReview} className="space-y-4 pt-2">
                    <h3 className="text-sm font-bold text-white font-outfit border-b border-slate-800 pb-2">Human Review Decision</h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Reviewer Action</label>
                        <select
                          value={action}
                          onChange={(e) => setAction(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-brand-500"
                        >
                          <option value="Confirmed">Confirm AI Risk Level</option>
                          <option value="Modified Risk">Modify Risk Rating</option>
                          <option value="Rejected Flag">Reject AI Flag (False Positive)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Final Risk Rating</label>
                        <select
                          value={finalRisk}
                          onChange={(e) => setFinalRisk(e.target.value as RiskLevel)}
                          className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-brand-500"
                        >
                          <option value="LOW">LOW</option>
                          <option value="MEDIUM">MEDIUM</option>
                          <option value="HIGH">HIGH</option>
                          <option value="CRITICAL">CRITICAL</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Official Reviewer Note & Rationale</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Document human reviewer findings and justification..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-lg p-3 focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>{isSubmitting ? 'Recording Audit Trail...' : 'Commit Human Review Decision'}</span>
                    </button>
                  </form>

                  {/* Audit Trail History */}
                  {selectedItem.reviews && selectedItem.reviews.length > 0 && (
                    <div className="border-t border-slate-800 pt-4 space-y-2">
                      <div className="flex items-center space-x-2 text-xs font-bold text-slate-400">
                        <History className="w-4 h-4" />
                        <span>Audit Trail History</span>
                      </div>
                      <div className="space-y-2">
                        {selectedItem.reviews.map((r: HumanReviewRecord) => (
                          <div key={r.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                              <span>{r.reviewerName} • Action: {r.action}</span>
                              <span>{new Date(r.timestamp).toLocaleString()}</span>
                            </div>
                            <p className="text-slate-300">"{r.notes}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
                  Select an evidence item from the left queue to conduct human review.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
