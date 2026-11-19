import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  showSubtitle = true,
  className = '' 
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }[size];

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`${iconDimensions} rounded-xl bg-[#355B46] text-[#FAF9F4] flex items-center justify-center shadow-xs shrink-0 overflow-hidden relative`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 48 48" fill="none" className="w-4/5 h-4/5">
          {/* Leaf silhouette */}
          <path
            d="M24 7C16 7 11 15 11 24C11 32 17 39 24 41C31 39 37 32 37 24C37 15 32 7 24 7Z"
            fill="#FAF9F4"
          />
          <path d="M24 9V40" stroke="#355B46" strokeWidth="1.8" strokeLinecap="round" />
          {/* Veins */}
          <path d="M24 16C20 14 16 17 15 20" stroke="#355B46" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M24 23C19 21 15 24 14 28" stroke="#355B46" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M24 16C28 14 32 17 33 20" stroke="#355B46" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M24 23C29 21 33 24 34 28" stroke="#355B46" strokeWidth="1.2" strokeLinecap="round" />
          {/* Diagnostic terracotta reticle */}
          <circle cx="30" cy="18" r="4.2" fill="#FAF9F4" stroke="#C8795B" strokeWidth="1.6" />
          <circle cx="30" cy="18" r="1.6" fill="#C8795B" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-serif font-bold text-[#263D32] tracking-tight ${titleSizes}`}>
              PlantGuard
            </span>
            <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded-full bg-[#E7EDE3] text-[#355B46] font-semibold border border-[#8FA88A]/30">
              AI
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#796A59] leading-none">
              Verdant Atelier
            </span>
          )}
        </div>
      )}
    </div>
  );
};
