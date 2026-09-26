import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Header } from '../components/Header.js';
import { Sidebar } from '../components/Sidebar.js';
import { ProtectionBanner } from '../components/ProtectionBanner.js';
import { RiskBadge } from '../components/RiskBadge.js';
import { CaseItem, EvidenceItem } from '../types/index.js';
import { 
  FolderLock, 
  FileSearch, 
  ShieldAlert, 
  FileText, 
  Plus, 
  Sparkles, 
  UserCheck, 
  ArrowRight,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      const [casesRes, evRes] = await Promise.all([
        fetch('/api/cases'),
        fetch('/api/evidence')
      ]);

      if (casesRes.ok) setCases(await casesRes.json());
      if (evRes.ok) setEvidenceList(await evRes.json());
    } catch {
      // Ignore background errors
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const highRiskCount = evidenceList.filter(e => e.riskLevel === 'HIGH' || e.riskLevel === 'CRITICAL').length;
  const activeCasesCount = cases.filter(c => c.status !== 'Archived' && c.status !== 'Resolved').length;

  const filteredEvidence = evidenceList.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <main className="p-6 max-w-7xl mx-auto w-full space-y-6">
          {/* Greeting & Quick Action Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white font-outfit">
                Good afternoon, {user?.name || 'Demo User'}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Overview of cyber-harassment evidence metrics & automated threat indicators.
              </p>
            </div>
            <Link
              to="/upload"
              className="inline-flex items-center space-x-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-brand-600/25 w-fit"
            >
              <Plus className="w-4 h-4" />
              <span>+ Upload Evidence</span>
            </Link>
          </div>

          <ProtectionBanner />

          {/* Metrics Statistics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Active Cases</span>
                <div className="p-2 bg-brand-500/10 text-brand-400 rounded-lg">
                  <FolderLock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-white font-outfit mt-2">{activeCasesCount}</div>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">Total Cases: {cases.length}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Evidence Vault</span>
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                  <FileSearch className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-white font-outfit mt-2">{evidenceList.length}</div>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">Cataloged Artifacts</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">High / Critical Risk</span>
                <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
                  <ShieldAlert className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-rose-400 font-outfit mt-2">{highRiskCount}</div>
              <span className="text-[10px] text-rose-400/80 font-mono mt-1 block">Human Review Required</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Reports Generated</span>
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-white font-outfit mt-2">1</div>
              <span className="text-[10px] text-emerald-400 font-mono mt-1 block">Ready for Export</span>
            </div>
          </div>

          {/* Quick Actions & Risk Summary Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Quick Actions Panel */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">QUICK ACTIONS</h3>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/upload"
                  className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-left transition-colors group"
                >
                  <Plus className="w-4 h-4 text-brand-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="block text-xs font-bold text-white">Upload</span>
                  <span className="text-[10px] text-slate-400">New Evidence</span>
                </Link>

                <Link
                  to="/review"
                  className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-left transition-colors group"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="block text-xs font-bold text-white">Review</span>
                  <span className="text-[10px] text-slate-400">HITL Center</span>
                </Link>

                <Link
                  to="/timeline"
                  className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-left transition-colors group"
                >
                  <Clock className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="block text-xs font-bold text-white">Timeline</span>
                  <span className="text-[10px] text-slate-400">Chronology</span>
                </Link>

                <Link
                  to="/reports"
                  className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-left transition-colors group"
                >
                  <FileText className="w-4 h-4 text-indigo-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="block text-xs font-bold text-white">Report</span>
                  <span className="text-[10px] text-slate-400">PDF Export</span>
                </Link>
              </div>
            </div>

            {/* Risk Overview */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">RISK OVERVIEW SUMMARY</h3>
                  <span className="text-[10px] bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded font-mono">AUTOMATED ASSESSMENT</span>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4">
                  {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(lvl => {
                    const count = evidenceList.filter(e => e.riskLevel === lvl).length;
                    return (
                      <div key={lvl} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                        <RiskBadge level={lvl} showIcon={false} size="sm" />
                        <span className="block text-lg font-bold text-white font-outfit mt-1">{count}</span>
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  DeepShield transparently scores evidence using explicit indicators (e.g. violent threats, surveillance terms, blackmail demands). Critical & High items are flagged for mandatory human reviewer confirmation.
                </p>
              </div>

              <Link
                to="/analysis"
                className="mt-4 text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center space-x-1 w-fit"
              >
                <span>Inspect full AI heuristic engine output</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Recent Evidence Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileSearch className="w-4 h-4 text-brand-400" />
                <h3 className="text-sm font-bold text-white">Recent Evidence Inventory</h3>
              </div>
              <Link to="/evidence" className="text-xs text-brand-400 hover:text-brand-300 font-medium">
                View all ({evidenceList.length})
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3 pl-4">Evidence ID</th>
                    <th className="p-3">Title & Type</th>
                    <th className="p-3">Source Platform</th>
                    <th className="p-3">Date recorded</th>
                    <th className="p-3">Risk Assessment</th>
                    <th className="p-3">Review Status</th>
                    <th className="p-3 text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredEvidence.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-500">
                        No evidence records found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredEvidence.slice(0, 5).map((ev) => (
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
