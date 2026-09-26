import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header.js';
import { Sidebar } from '../components/Sidebar.js';
import { CaseItem, CaseCategory, CaseStatus } from '../types/index.js';
import { FolderLock, Plus, ShieldAlert, FileSearch, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CasesPage: React.FC = () => {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CaseCategory>('Cyberstalking');
  const [status, setStatus] = useState<CaseStatus>('Open');

  const fetchCases = async () => {
    try {
      const res = await fetch('/api/cases');
      if (res.ok) {
        setCases(await res.json());
      }
    } catch {
      // Ignore background errors
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category, status })
      });
      if (res.ok) {
        const newCase = await res.json();
        setCases([newCase, ...cases]);
        setIsModalOpen(false);
        setTitle('');
        setDescription('');
      }
    } catch {
      // Ignore error
    }
  };

  const categoriesList: CaseCategory[] = [
    'Cyberstalking',
    'Threat',
    'Harassment',
    'Fake Account',
    'Image Manipulation',
    'Impersonation',
    'Other'
  ];

  const filteredCases = cases.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <main className="p-6 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-white font-outfit">Case Management</h1>
              <p className="text-xs text-slate-400 mt-1">Group harassment evidence items into structured investigation cases.</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center space-x-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-brand-600/25"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Case</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map((c) => (
              <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-brand-500/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-brand-400">{c.id}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      c.status === 'Open' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      c.status === 'Under Review' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 leading-snug">{c.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">{c.description || 'No description provided.'}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-xs text-slate-400 mb-3">
                    <span className="flex items-center space-x-1">
                      <FileSearch className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.evidenceCount || 0} items</span>
                    </span>
                    {(c.highRiskCount || 0) > 0 && (
                      <span className="flex items-center space-x-1 text-rose-400 font-semibold">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>{c.highRiskCount} High Risk</span>
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/cases/${c.id}`}
                    className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <span>Open Case Vault</span>
                    <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Create Case Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-lg font-bold text-white font-outfit mb-1">Create Investigation Case</h3>
                <p className="text-xs text-slate-400 mb-4">Initialize a structured container for related digital harassment evidence.</p>

                <form onSubmit={handleCreateCase} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Case Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cyberstalking & Threat DMs Campaign"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Incident Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as CaseCategory)}
                      className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500"
                    >
                      {categoriesList.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as CaseStatus)}
                      className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500"
                    >
                      <option value="Open">Open</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Case Description</label>
                    <textarea
                      rows={3}
                      placeholder="Provide incident summary and context..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-lg p-3 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-brand-600/25"
                    >
                      Create Case
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
