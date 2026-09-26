import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header.js';
import { Sidebar } from '../components/Sidebar.js';
import { RiskBadge } from '../components/RiskBadge.js';
import { EvidenceItem, RiskLevel, EvidenceType } from '../types/index.js';
import { Clock, Filter, ArrowUpDown, ShieldAlert, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TimelinePage: React.FC = () => {
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  useEffect(() => {
    fetch('/api/evidence')
      .then(res => res.json())
      .then(data => setEvidenceList(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Filter & Sort Logic
  const filtered = evidenceList.filter(item => {
    if (selectedRisk !== 'ALL' && item.riskLevel !== selectedRisk) return false;
    if (selectedType !== 'ALL' && item.type !== selectedType) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
    const dateB = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  // Calculate Incident Summary metrics
  const dates = evidenceList.map(e => e.date).filter(Boolean).sort();
  const firstIncident = dates[0] || 'N/A';
  const latestIncident = dates[dates.length - 1] || 'N/A';
  const highRiskCount = evidenceList.filter(e => e.riskLevel === 'HIGH' || e.riskLevel === 'CRITICAL').length;
  const hasRepeatedContact = evidenceList.length >= 3;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white font-outfit">Evidence Chronological Timeline</h1>
              <p className="text-xs text-slate-400 mt-1">Reconstruct patterns of cyber-harassment and incident progression over time.</p>
            </div>

            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors w-fit"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-brand-400" />
              <span>Sort: {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>

          {/* Incident Summary Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase block">FIRST INCIDENT</span>
              <span className="text-sm font-bold text-white font-mono mt-1 block">{firstIncident}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase block">LATEST INCIDENT</span>
              <span className="text-sm font-bold text-white font-mono mt-1 block">{latestIncident}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase block">TOTAL EVIDENCE</span>
              <span className="text-sm font-bold text-white font-mono mt-1 block">{evidenceList.length} items</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase block">HIGH / CRITICAL ITEMS</span>
              <span className="text-sm font-bold text-rose-400 font-mono mt-1 block">{highRiskCount} items</span>
            </div>

            <div className="col-span-2 lg:col-span-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">REPEATED CONTACT PATTERN</span>
              <span className={`text-xs font-bold mt-1 block ${hasRepeatedContact ? 'text-amber-400' : 'text-emerald-400'}`}>
                {hasRepeatedContact ? 'Detected (Multiple Events)' : 'Low Frequency'}
              </span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center space-x-2 text-slate-400 font-semibold">
              <Filter className="w-4 h-4 text-brand-400" />
              <span>Filter Timeline:</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-mono">Risk Level:</span>
              <select
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-500 font-mono"
              >
                <option value="ALL">ALL RISKS</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-mono">Evidence Type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-500 font-mono"
              >
                <option value="ALL">ALL TYPES</option>
                <option value="Screenshot">Screenshot</option>
                <option value="Message">Message</option>
                <option value="Social Media Profile">Social Media Profile</option>
                <option value="Image">Image</option>
                <option value="Document">Document</option>
              </select>
            </div>
          </div>

          {/* Timeline Visual Feed */}
          <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-8 py-4">
            {sorted.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-slate-500 text-xs">
                No evidence timeline events match the current filter selection.
              </div>
            ) : (
              sorted.map((ev) => (
                <div key={ev.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 ${
                    ev.riskLevel === 'CRITICAL' ? 'bg-rose-500 border-rose-300 animate-pulse' :
                    ev.riskLevel === 'HIGH' ? 'bg-orange-500 border-orange-300' :
                    ev.riskLevel === 'MEDIUM' ? 'bg-amber-500 border-amber-300' :
                    'bg-emerald-500 border-emerald-300'
                  }`} />

                  {/* Event Card */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-brand-500/40 transition-colors shadow-lg space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-xs font-bold text-brand-400">{ev.id}</span>
                        <span className="text-xs text-slate-400 font-mono flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{ev.date} {ev.time && `• ${ev.time}`}</span>
                        </span>
                      </div>
                      <RiskBadge level={ev.riskLevel} />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white mb-1">{ev.title}</h3>
                      <span className="text-[10px] text-slate-400 font-mono block">Type: {ev.type} | Source: {ev.source}</span>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">{ev.description}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                      <span className="text-[10px] font-mono text-slate-500">Analysis Status: {ev.analysisStatus}</span>
                      <Link
                        to={`/evidence/${ev.id}`}
                        className="inline-flex items-center text-xs font-semibold text-brand-400 hover:text-brand-300 space-x-1"
                      >
                        <span>View Analysis Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
