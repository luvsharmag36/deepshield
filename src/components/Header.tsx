import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import { NotificationDropdown } from './NotificationDropdown.js';
import { Search, Plus, LogOut, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Header: React.FC<{ searchTerm?: string; onSearchChange?: (val: string) => void }> = ({
  searchTerm = '',
  onSearchChange
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center space-x-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cases, evidence ID, keywords..."
            value={searchTerm}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/60 text-slate-200 text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Link
          to="/upload"
          className="hidden sm:inline-flex items-center space-x-1.5 bg-brand-600 hover:bg-brand-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-md shadow-brand-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Evidence</span>
        </Link>

        <NotificationDropdown />

        <div className="h-6 w-px bg-slate-800" />

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-brand-600/30 border border-brand-500/40 flex items-center justify-center text-brand-300 font-bold text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'D'}
            </div>
            <div className="hidden lg:block text-left">
              <span className="block text-xs font-semibold text-white leading-none">{user?.name || 'Demo User'}</span>
              <span className="block text-[10px] text-slate-400 font-mono mt-0.5">{user?.role || 'Investigator'}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
