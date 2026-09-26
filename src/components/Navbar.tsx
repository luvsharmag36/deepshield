import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

export const Navbar: React.FC = () => {
  const { user, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemoClick = async () => {
    await demoLogin();
    navigate('/dashboard');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="p-2 bg-brand-600/20 border border-brand-500/30 rounded-xl group-hover:border-brand-500/60 transition-colors">
            <Shield className="w-6 h-6 text-brand-400" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-white tracking-tight font-outfit">
              DeepShield <span className="text-brand-400 font-normal">Women</span>
            </span>
            <span className="block text-[10px] text-slate-400 font-mono tracking-wide -mt-1">
              AI EVIDENCE ASSISTANT
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#privacy" className="hover:text-white transition-colors">Privacy & Prototype</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
        </div>

        <div className="flex items-center space-x-3">
          {user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-brand-600/25"
            >
              <UserCheck className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </Link>
          ) : (
            <>
              <button
                onClick={handleDemoClick}
                className="hidden sm:inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-brand-300 border border-brand-500/30 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all"
              >
                <span>Demo Access</span>
                <span className="bg-brand-500/20 text-brand-300 text-[10px] px-1.5 py-0.5 rounded font-mono">1-CLICK</span>
              </button>
              <Link
                to="/login"
                className="inline-flex items-center space-x-1.5 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-brand-600/25"
              >
                <Lock className="w-4 h-4" />
                <span>Login</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
