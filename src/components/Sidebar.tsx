import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderLock, 
  FileSearch, 
  UploadCloud, 
  Sparkles, 
  Clock, 
  UserCheck, 
  FileText, 
  Settings, 
  Shield 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/cases', label: 'Cases', icon: FolderLock },
    { to: '/evidence', label: 'Evidence Vault', icon: FileSearch },
    { to: '/upload', label: 'Upload Evidence', icon: UploadCloud },
    { to: '/analysis', label: 'AI Analysis', icon: Sparkles },
    { to: '/timeline', label: 'Timeline', icon: Clock },
    { to: '/review', label: 'Review Center', icon: UserCheck },
    { to: '/reports', label: 'Case Reports', icon: FileText },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 h-screen sticky top-0">
      <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
        <div className="p-2 bg-brand-600/20 border border-brand-500/30 rounded-xl">
          <Shield className="w-5 h-5 text-brand-400" />
        </div>
        <div>
          <span className="font-bold text-white text-base tracking-tight font-outfit">DeepShield</span>
          <span className="block text-[10px] text-brand-400 font-mono tracking-wider">WOMEN PORTAL</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
          MAIN MODULES
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="p-3 border-t border-slate-800 bg-slate-900/40">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase">ASSISTIVE AI ENGINE</span>
          <span className="block text-xs text-brand-300 font-semibold mt-0.5">v1.0 Demo Heuristic</span>
        </div>
      </div>
    </aside>
  );
};
