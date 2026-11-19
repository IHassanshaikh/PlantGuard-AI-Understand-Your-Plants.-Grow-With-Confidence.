import React from 'react';
import { PlantStatus } from '../../types';

interface HealthScorePillProps {
  score: number;
  status?: PlantStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const HealthScorePill: React.FC<HealthScorePillProps> = ({
  score,
  size = 'md',
  showLabel = true,
}) => {
  const formattedScore = String(Math.max(0, Math.min(100, Math.round(score)))).padStart(3, '0');

  let colorClasses = 'bg-[#E7EDE3] text-[#355B46] border-[#D3DFCE]';
  let indicatorColor = 'bg-[#355B46]';

  if (score < 60) {
    colorClasses = 'bg-[#FBEBE8] text-[#A63A24] border-[#F2C2BA]';
    indicatorColor = 'bg-[#A63A24]';
  } else if (score < 80) {
    colorClasses = 'bg-[#F2DFD1] text-[#796A59] border-[#E8CFC1]';
    indicatorColor = 'bg-[#C8795B]';
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2',
    lg: 'text-sm px-3.5 py-1.5 gap-2.5',
  }[size];

  return (
    <div
      className={`inline-flex items-center font-mono font-medium rounded-full border ${colorClasses} ${sizeClasses}`}
      title={`Health Assessment: ${score}%`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${indicatorColor} animate-pulse`} />
      {showLabel && <span className="opacity-70 tracking-widest text-[10px] uppercase">HEALTH SCORE</span>}
      {showLabel && <span className="opacity-40">/</span>}
      <span className="font-semibold tracking-wider">{formattedScore}</span>
    </div>
  );
};
