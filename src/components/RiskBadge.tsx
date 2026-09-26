import React from 'react';
import { RiskLevel } from '../types/index.js';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, showIcon = true, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-bold'
  };

  const getStyle = () => {
    switch (level) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          icon: <ShieldAlert className="w-3.5 h-3.5 mr-1 animate-pulse text-rose-400" />
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
          icon: <AlertTriangle className="w-3.5 h-3.5 mr-1 text-orange-400" />
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: <Info className="w-3.5 h-3.5 mr-1 text-amber-400" />
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
        };
    }
  };

  const style = getStyle();

  return (
    <span
      className={`inline-flex items-center rounded-full border ${style.bg} ${sizeClasses[size]}`}
    >
      {showIcon && style.icon}
      {level}
    </span>
  );
};
