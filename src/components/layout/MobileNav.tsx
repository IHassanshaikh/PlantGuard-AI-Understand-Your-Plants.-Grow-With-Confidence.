import React from 'react';
import { Sprout, ScanLine, Flower2, BookOpen, Stethoscope } from 'lucide-react';
import { NavTab } from './Sidebar';

interface MobileNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  const items: { id: NavTab; label: string; icon: React.ReactNode; isScan?: boolean }[] = [
    { id: 'overview', label: 'Dashboard', icon: <Sprout className="w-5 h-5" /> },
    { id: 'garden', label: 'Garden', icon: <Flower2 className="w-5 h-5" /> },
    { id: 'scanner', label: 'Scan', icon: <ScanLine className="w-6 h-6" />, isScan: true },
    { id: 'doctor', label: 'Doctor', icon: <Stethoscope className="w-5 h-5" /> },
    { id: 'journal', label: 'Journal', icon: <BookOpen className="w-5 h-5" /> },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation Bar" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F4]/95 backdrop-blur-md border-t border-[#D3DFCE] px-3 py-2 flex items-center justify-around"
    >
      {items.map((item) => {
        const isActive = currentTab === item.id;

        if (item.isScan) {
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              aria-label="Scan a plant with AI"
              className="-mt-5 w-12 h-12 rounded-full bg-[#355B46] text-[#FAF9F4] flex items-center justify-center shadow-lg border-2 border-[#FAF9F4] active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-[#355B46]"
            >
              {item.icon}
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-medium transition-colors focus:outline-none focus:text-[#355B46] ${
              isActive ? 'text-[#355B46] font-bold' : 'text-[#796A59]'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
