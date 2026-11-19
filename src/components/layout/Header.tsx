import React from 'react';
import { NavTab } from './Sidebar';
import { Cpu, Cloud, Key, Sparkles, Home, CalendarCheck } from 'lucide-react';
import { isCloudAiAvailable } from '../../services/aiService';

interface HeaderProps {
  currentTab: NavTab;
  onOpenSettings: () => void;
  onGoHome?: () => void;
  onNavigate?: (tab: NavTab) => void;
  totalPlants: number;
  attentionCount: number;
  pendingRemindersCount?: number;
}

const TAB_TITLES: Record<NavTab, { title: string; subtitle: string }> = {
  overview: {
    title: 'Your Garden Overview',
    subtitle: 'Understand your collection, track health trends, and view recent diagnoses.',
  },
  scanner: {
    title: 'Plant Health Scanner',
    subtitle: 'High-precision hybrid vision diagnosis powered by Gemini Nano & Cloud Gemini.',
  },
  garden: {
    title: 'Botanical Collection',
    subtitle: 'Organized herbarium records of all plants under your active care.',
  },
  doctor: {
    title: 'AI Plant Doctor',
    subtitle: 'Specialized botanical pathologist consultations tailored to your individual specimens.',
  },
  journal: {
    title: 'Garden Health Journal',
    subtitle: 'Chronological timeline of treatments, foliar scans, and plant recovery observations.',
  },
  library: {
    title: 'Botanical Knowledge Library',
    subtitle: 'Verified horticultural profiles, care requirements, and common plant pathology.',
  },
  settings: {
    title: 'Preferences & AI Engine',
    subtitle: 'Manage on-device inference settings, API keys, and local garden data persistence.',
  },
};

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenSettings,
  onGoHome,
  onNavigate,
  attentionCount,
  pendingRemindersCount = 0,
}) => {
  const { title, subtitle } = TAB_TITLES[currentTab] || TAB_TITLES.overview;
  const cloudAvailable = isCloudAiAvailable();

  return (
    <header 
      role="banner" 
      aria-label="Application Header"
      className="bg-[#FAF9F4] border-b border-[#D3DFCE] px-6 py-4 sticky top-0 z-30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
    >
      <div>
        <div className="flex items-center gap-2">
          {onGoHome && (
            <button 
              onClick={onGoHome}
              title="Return to Home Landing"
              aria-label="Return to landing overview"
              className="text-[#796A59] hover:text-[#263D32] transition-colors p-1 -ml-1 rounded-md hover:bg-[#E7EDE3] focus:outline-none focus:ring-2 focus:ring-[#355B46]"
            >
              <Home className="w-4 h-4" />
            </button>
          )}
          <h1 className="font-serif text-2xl font-bold text-[#263D32] tracking-tight">
            {title}
          </h1>
        </div>
        <p className="text-xs text-[#796A59] mt-0.5">{subtitle}</p>
      </div>

      <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
        {/* Urgent Attention Alert Pill if any */}
        {attentionCount > 0 && currentTab !== 'scanner' && (
          <button 
            role="status" 
            aria-live="polite"
            onClick={() => onNavigate?.('garden')}
            title="View plants needing care in garden"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2DFD1] hover:bg-[#ebd2c2] border border-[#E8CFC1] text-[#796A59] text-xs font-mono transition-colors cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8795B] animate-ping" aria-hidden="true" />
            <span>{attentionCount} {attentionCount === 1 ? 'PLANT' : 'PLANTS'} NEED ATTENTION</span>
          </button>
        )}

        {/* Care Reminders Due Pill if any */}
        {pendingRemindersCount > 0 && (
          <button 
            onClick={() => onNavigate?.('overview')}
            title="View care tasks in your schedule"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7EDE3] hover:bg-[#d8e2d2] border border-[#D3DFCE] text-[#355B46] text-xs font-mono transition-colors cursor-pointer"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-[#355B46]" aria-hidden="true" />
            <span>{pendingRemindersCount} {pendingRemindersCount === 1 ? 'TASK' : 'TASKS'} DUE</span>
          </button>
        )}

        {/* Engine status pill */}
        <button
          onClick={onOpenSettings}
          aria-label="Configure local and cloud AI inference engines"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D3DFCE] bg-[#FFFFFF] hover:bg-[#E7EDE3] transition-colors text-xs text-[#263D32] font-mono shadow-xs focus:outline-none focus:ring-2 focus:ring-[#355B46]"
        >
          <div className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-[#355B46]" aria-hidden="true" />
            <span className="text-[11px] font-semibold text-[#355B46]">LOCAL</span>
          </div>
          <span className="text-[#8FA88A]">/</span>
          <div className="flex items-center gap-1">
            <Cloud className={`w-3.5 h-3.5 ${cloudAvailable ? 'text-[#C8795B]' : 'text-[#8FA88A]'}`} aria-hidden="true" />
            <span className={`text-[11px] ${cloudAvailable ? 'font-semibold text-[#C8795B]' : 'text-[#8FA88A]'}`}>
              {cloudAvailable ? 'CLOUD' : 'KEY'}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
