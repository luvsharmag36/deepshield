import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header.js';
import { Sidebar } from '../components/Sidebar.js';
import { ProtectionBanner } from '../components/ProtectionBanner.js';
import { CaseItem, EvidenceType } from '../types/index.js';
import { UploadCloud, File, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const EvidenceUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultCaseId = searchParams.get('caseId') || '';

  const [cases, setCases] = useState<CaseItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [caseId, setCaseId] = useState(defaultCaseId);
  const [type, setType] = useState<EvidenceType>('Screenshot');
  const [source, setSource] = useState('Instagram DM');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');
  const [description, setDescription] = useState('');
  const [accountUsername, setAccountUsername] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/cases')
      .then(res => res.json())
      .then(data => {
        setCases(data);
        if (!caseId && data.length > 0) {
          setCaseId(data[0].id);
        }
      })
      .catch(() => {});
  }, [caseId]);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.size > 25 * 1024 * 1024) {
      setError('File size exceeds maximum 25 MB limit');
      return;
    }
    setError('');
    setFile(selectedFile);

    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !caseId) {
      setError('Evidence title and case association are required');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('caseId', caseId);
    formData.append('type', type);
    formData.append('source', source);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('description', description);
    formData.append('accountUsername', accountUsername);
    if (file) {
      formData.append('file', file);
    }

    try {
      const res = await fetch('/api/evidence', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setSuccess(`Evidence recorded successfully with ID ${data.id}. AI heuristic scan complete.`);
      setTimeout(() => {
        navigate(`/evidence/${data.id}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Evidence upload failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const evidenceTypes: EvidenceType[] = [
    'Screenshot',
    'Message',
    'Social Media Profile',
    'Image',
    'Video',
    'Document'
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 max-w-4xl mx-auto w-full space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white font-outfit">Evidence Upload System</h1>
            <p className="text-xs text-slate-400 mt-1">Catalog digital artifacts into secure investigation cases.</p>
          </div>

          <ProtectionBanner />

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            {/* Drag & Drop File Zone */}
            <div>
              <label className="block text-xs font-bold text-white mb-2">Upload Evidence File (Optional / Demo)</label>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-slate-700 hover:border-brand-500/60 bg-slate-950/60 rounded-xl p-6 text-center cursor-pointer transition-colors"
              >
                {filePreview ? (
                  <div className="space-y-2">
                    <img src={filePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg border border-slate-700" />
                    <span className="block text-xs text-slate-300 font-mono">{file?.name} ({(file!.size / 1024).toFixed(1)} KB)</span>
                    <button
                      type="button"
                      onClick={() => { setFile(null); setFilePreview(null); }}
                      className="text-[11px] text-rose-400 underline font-semibold"
                    >
                      Remove file
                    </button>
                  </div>
                ) : file ? (
                  <div className="space-y-2">
                    <File className="w-8 h-8 text-brand-400 mx-auto" />
                    <span className="block text-xs text-slate-300 font-mono">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-[11px] text-rose-400 underline font-semibold"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div>
                    <UploadCloud className="w-10 h-10 text-brand-400 mx-auto mb-2" />
                    <span className="block text-xs font-semibold text-white">Drag and drop files here, or click to browse</span>
                    <span className="block text-[10px] text-slate-400 mt-1">Supports PNG, JPG, PDF, TXT up to 25 MB</span>
                    <input
                      type="file"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                      className="hidden"
                      id="file-upload-input"
                    />
                    <label
                      htmlFor="file-upload-input"
                      className="inline-block mt-3 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg cursor-pointer"
                    >
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata Inputs */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Evidence Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Direct Threat DM Screenshot"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Associate with Case</label>
                <select
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-brand-500"
                >
                  {cases.map(c => (
                    <option key={c.id} value={c.id}>{c.id} — {c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Evidence Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as EvidenceType)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-brand-500"
                >
                  {evidenceTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Source / Platform</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Instagram DM, WhatsApp, Twitter"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Incident Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Flagged Username / Account (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. @shadow_account_99"
                  value={accountUsername}
                  onChange={(e) => setAccountUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Description & Text Content</label>
              <textarea
                rows={4}
                placeholder="Include extracted message text, threat statements, or context..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-lg p-3 focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center space-x-2"
            >
              <span>{isSubmitting ? 'Processing AI Heuristics...' : 'Upload & Perform AI Analysis'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};
