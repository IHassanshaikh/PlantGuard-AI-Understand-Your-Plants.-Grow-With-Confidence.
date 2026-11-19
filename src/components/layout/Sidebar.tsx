import React from 'react';
import { 
  Sprout, 
  ScanLine, 
  Flower2, 
  Stethoscope, 
  BookOpen, 
  Library, 
  Settings, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  User,
  Calendar
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { isCloudAiAvailable } from '../../services/aiService';

export type NavTab = 
  | 'overview' 
  | 'scanner' 
  | 'garden' 
  | 'doctor' 
  | 'journal' 
  | 'library' 
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  pendingRemindersCount?: number;
  onSelectTab: (tab: NavTab) => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  pendingRemindersCount = 0,
  onSelectTab, 
  onOpenSettings 
}) => {
  const cloudAvailable = isCloudAiAvailable();

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <Sprout className="w-4 h-4" /> },
    { id: 'scanner', label: 'Plant Scanner', icon: <ScanLine className="w-4 h-4" />, badge: 'AI' },
    { id: 'garden', label: 'My Garden', icon: <Flower2 className="w-4 h-4" /> },
    { id: 'doctor', label: 'Plant Doctor', icon: <Stethoscope className="w-4 h-4" /> },
    { 
      id: 'journal', 
      label: 'Health Journal', 
      icon: <BookOpen className="w-4 h-4" />,
      badge: pendingRemindersCount > 0 ? `${pendingRemindersCount} DUE` : undefined 
    },
    { id: 'library', label: 'Plant Library', icon: <Library className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside 
      className="hidden md:flex flex-col w-64 bg-[#FAF9F4] border-r border-[#D3DFCE] h-screen sticky top-0 shrink-0 p-5 select-none"
      aria-label="Sidebar Navigation"
    >
      {/* Brand Identity */}
      <div className="pb-6 border-b border-[#D3DFCE]/70">
        <Logo size="md" />
        <p className="text-[11px] text-[#796A59] italic mt-2.5 leading-snug">
          Understand Your Plants. Grow With Confidence.
        </p>
      </div>

      {/* Prominent CTA */}
      <div className="pt-5 pb-4">
        <button
          onClick={() => onSelectTab('scanner')}
          aria-label="Scan a plant now with hybrid AI"
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm group ${
            currentTab === 'scanner'
              ? 'bg-[#263D32] text-[#FAF9F4] ring-2 ring-[#8FA88A]'
              : 'bg-[#355B46] hover:bg-[#2B4C3A] text-[#FAF9F4]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <ScanLine className="w-4 h-4 text-[#8FA88A] group-hover:scale-110 transition-transform" />
            <span className="font-medium">Scan a Plant</span>
          </div>
          <span className="text-[10px] font-mono bg-[#263D32]/60 px-1.5 py-0.5 rounded text-[#E7EDE3]">
            HYBRID AI
          </span>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 py-2 overflow-y-auto" role="navigation" aria-label="Main menu">
        <div className="text-[10px] font-mono uppercase tracking-widest text-[#796A59] px-3 pb-1">
          Garden Navigation
        </div>
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors ${
                isActive
                  ? 'bg-[#E7EDE3] text-[#263D32] font-semibold border border-[#D3DFCE]'
                  : 'text-[#263D32]/80 hover:bg-[#E7EDE3]/60 hover:text-[#263D32]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-[#355B46]' : 'text-[#796A59]'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                  item.badge.includes('DUE') 
                    ? 'bg-[#FBEBE8] border-[#F2C2BA] text-[#A63A24] font-bold' 
                    : 'bg-[#FAF9F4] border-[#D3DFCE] text-[#355B46]'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* AI Engine Status Pill */}
      <div className="pt-3 pb-3 border-t border-[#D3DFCE]/70">
        <div 
          onClick={onOpenSettings}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpenSettings(); }}
          className="cursor-pointer p-2.5 rounded-xl border border-[#D3DFCE] bg-[#FAF9F4] hover:bg-[#E7EDE3]/50 transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#8FA88A]"
          aria-label="View engine and AI settings"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#796A59] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#355B46]" /> Engine Status
            </span>
            <ChevronRight className="w-3 h-3 text-[#796A59]" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#263D32] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#355B46] animate-pulse" />
            <span>On-Device AI Active</span>
          </div>
          <div className="text-[10px] font-mono text-[#796A59] mt-0.5">
            {cloudAvailable ? 'Cloud Gemini Ready' : 'Local Heuristics / Nano'}
          </div>
        </div>
      </div>

      {/* User Profile Bar */}
      <div className="pt-3 border-t border-[#D3DFCE]/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#E7EDE3] border border-[#8FA88A] flex items-center justify-center text-[#355B46]">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-xs font-medium text-[#263D32] leading-tight">Hassan</p>
            <p className="text-[10px] font-mono text-[#796A59]">Botanist Member</p>
          </div>
        </div>
        <button
          onClick={onOpenSettings}
          title="Account & API Settings"
          aria-label="Open settings"
          className="p-1.5 rounded-lg text-[#796A59] hover:bg-[#E7EDE3] hover:text-[#263D32] transition-colors focus:outline-hidden focus:ring-1 focus:ring-[#8FA88A]"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
