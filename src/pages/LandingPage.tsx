import React from 'react';
import { Navbar } from '../components/Navbar.js';
import { 
  Shield, 
  Upload, 
  Sparkles, 
  FolderLock, 
  FileText, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Eye, 
  Users 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

export const LandingPage: React.FC = () => {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemoAccess = async () => {
    await demoLogin();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/15 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="inline-flex items-center space-x-2 bg-brand-500/10 border border-brand-500/30 px-4 py-1.5 rounded-full text-xs font-semibold text-brand-300 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Assisted Cyber-Harassment Evidence Assistant</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight font-outfit max-w-4xl mx-auto leading-tight">
          Your Evidence. <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-300">Organized. Protected.</span> Understood.
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          DeepShield Women helps organize, evaluate risk, and structure digital harassment evidence using AI-assisted indicators and Human-in-the-Loop review.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleDemoAccess}
            className="w-full sm:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-xl shadow-brand-600/25 transition-all flex items-center justify-center space-x-2 text-base"
          >
            <span>Analyze Evidence (Demo)</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold rounded-xl transition-all flex items-center justify-center text-base"
          >
            See How It Works
          </a>
        </div>

        {/* Prototype Privacy Alert */}
        <div className="mt-12 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 max-w-xl mx-auto flex items-center space-x-3 text-left">
          <Lock className="w-5 h-5 text-brand-400 shrink-0" />
          <p className="text-xs text-slate-400">
            <strong className="text-slate-200">Prototype Notice:</strong> DeepShield is an educational software project. Demo mode includes sample evidence. Do not upload sensitive real-world evidence into this demonstration environment.
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-slate-900/50 border-y border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-outfit">The Challenges of Digital Evidence</h2>
            <p className="text-slate-400 text-sm mt-2">Managing online harassment evidence across multiple platforms can be overwhelming.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Scattered Screenshots',
                desc: 'Evidence buried across phone galleries, chat threads, and emails without timestamps or context.',
                icon: AlertTriangle
              },
              {
                title: 'Threats & Stalking',
                desc: 'Persistent messages, location monitoring, and intimidation across multiple fake accounts.',
                icon: Eye
              },
              {
                title: 'Manipulated Media',
                desc: 'Edited photos, deepfake image leaks, and impersonation profiles designed to damage reputation.',
                icon: Users
              }
            ].map((prob, idx) => {
              const Icon = prob.icon;
              return (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors">
                  <div className="p-3 bg-brand-500/10 rounded-xl text-brand-400 w-fit mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{prob.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{prob.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-brand-400 uppercase tracking-widest">WORKFLOW</span>
          <h2 className="text-3xl font-bold text-white font-outfit mt-1">4-Step Evidence Processing</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {[
            { step: '01', title: 'Upload', desc: 'Drag & drop screenshots, messages, or image files securely into a case vault.', icon: Upload },
            { step: '02', title: 'Analyze', desc: 'AI scans content for threat keywords, coercion language, and image manipulation.', icon: Sparkles },
            { step: '03', title: 'Organize', desc: 'Automatic risk scoring (Low, Medium, High, Critical) and chronological timeline mapping.', icon: FolderLock },
            { step: '04', title: 'Report', desc: 'Human-in-the-Loop review confirmation followed by structured PDF report export.', icon: FileText }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative">
                <span className="text-4xl font-extrabold text-slate-800 font-outfit absolute top-4 right-4">{item.step}</span>
                <div className="p-3 bg-brand-600/20 text-brand-400 rounded-xl w-fit mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-slate-900/30 border-t border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white font-outfit">Core Platform Capabilities</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'AI Threat Indicators', desc: 'Rule-based & NLP heuristic checks for explicit threats, harassment, extortion, and location tracking.' },
              { title: 'Media Authenticity Signals', desc: 'Extract image metadata, ELA heatmap signals, and compression flags without claiming false forensic certainty.' },
              { title: 'Human Review Governance', desc: 'Human-in-the-Loop review interface allowing investigators to confirm or override AI risk flags with audit notes.' },
              { title: 'Chronological Timeline', desc: 'Automatic timeline ordering with risk level filtering to establish pattern of harassment over time.' },
              { title: 'Case Management', desc: 'Organize multiple evidence items into cohesive cases categorized by incident type.' },
              { title: 'PDF Case Report Export', desc: 'Download professional PDF reports complete with evidence inventories, AI diagnostic summaries, and disclaimers.' }
            ].map((feat, idx) => (
              <div key={idx} className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-xl hover:border-brand-500/40 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-brand-400 mb-3" />
                <h3 className="text-base font-bold text-white mb-1">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <Shield className="w-4 h-4 text-brand-400" />
            <span className="font-bold text-white">DeepShield Women</span>
            <span>— AI-assisted evidence organizational prototype.</span>
          </div>
          <div>
            <span>Developed for educational & prototype demonstration.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
