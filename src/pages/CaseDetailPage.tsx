import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../components/Header.js';
import { Sidebar } from '../components/Sidebar.js';
import { RiskBadge } from '../components/RiskBadge.js';
import { CaseItem, EvidenceItem } from '../types/index.js';
import { 
  FolderLock, 
  FileSearch, 
  Plus, 
  Download, 
  Clock, 
  UserCheck, 
  Sparkles, 
  ExternalLink,
  ArrowLeft 
} from 'lucide-react';

export const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [caseData, setCaseData] = useState<CaseItem | null>(null);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCaseDetails = async () => {
    try {
      const res = await fetch(`/api/cases/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCaseData(data);
        setEvidenceList(data.evidenceList || []);
      }
    } catch {
      // Ignore error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-950 text-slate-100 items-center justify-center">
        <div className="text-xs text-slate-400 font-mono animate-pulse">Loading case vault...</div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex h-screen bg-slate-950 text-slate-100 items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-bold text-white mb-2">Case Not Found</h2>
          <Link to="/cases" className="text-xs text-brand-400 underline">Back to Cases</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 max-w-7xl mx-auto w-full space-y-6">
          {/* Breadcrumb & Navigation */}
          <Link to="/cases" className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Case Management</span>
          </Link>

          {/* Case Header Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="font-mono text-xs font-bold text-brand-400 bg-brand-500/10 border border-brand-500/30 px-2.5 py-0.5 rounded-full">
                  {caseData.id}
                </span>
                <span className="text-xs text-slate-400 font-mono">Category: {caseData.category}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white font-outfit">{caseData.title}</h1>
              <p className="text-xs text-slate-300 mt-2 max-w-3xl leading-relaxed">{caseData.description}</p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <Link
                to={`/upload?caseId=${caseData.id}`}
                className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Evidence</span>
              </Link>

              <a
                href={`/api/reports/${caseData.id}/pdf`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-brand-600/25"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF Report</span>
              </a>
            </div>
          </div>

          {/* Evidence Inventory Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileSearch className="w-4 h-4 text-brand-400" />
                <h3 className="text-sm font-bold text-white">Evidence Items in Case ({evidenceList.length})</h3>
              </div>
              <Link to="/timeline" className="text-xs text-brand-400 hover:text-brand-300 flex items-center space-x-1 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>View Timeline</span>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3 pl-4">Evidence ID</th>
                    <th className="p-3">Title & Type</th>
                    <th className="p-3">Source Platform</th>
                    <th className="p-3">Date Recorded</th>
                    <th className="p-3">Risk Assessment</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {evidenceList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        No evidence items uploaded to this case yet.
                      </td>
                    </tr>
                  ) : (
                    evidenceList.map((ev) => (
                      <tr key={ev.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 pl-4 font-mono font-bold text-white">{ev.id}</td>
                        <td className="p-3">
                          <span className="block font-semibold text-slate-100">{ev.title}</span>
                          <span className="text-[10px] text-slate-400">{ev.type}</span>
                        </td>
                        <td className="p-3 text-slate-300">{ev.source}</td>
                        <td className="p-3 font-mono text-slate-400">{ev.date}</td>
                        <td className="p-3">
                          <RiskBadge level={ev.riskLevel} />
                        </td>
                        <td className="p-3">
                          <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            ev.analysisStatus === 'Flagged' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {ev.analysisStatus}
                          </span>
                        </td>
                        <td className="p-3 text-right pr-4">
                          <Link
                            to={`/evidence/${ev.id}`}
                            className="inline-flex items-center text-brand-400 hover:text-brand-300 font-medium"
                          >
                            <span>Inspect</span>
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
