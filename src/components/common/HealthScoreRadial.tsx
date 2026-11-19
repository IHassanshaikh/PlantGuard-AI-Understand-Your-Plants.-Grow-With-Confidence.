import React from 'react';

interface HealthScoreRadialProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showDetails?: boolean;
  className?: string;
}

export const HealthScoreRadial: React.FC<HealthScoreRadialProps> = ({
  score,
  size = 120,
  strokeWidth = 9,
  showDetails = true,
  className = '',
}) => {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalizedScore / 100) * circumference;

  let strokeColor = '#355B46'; // Forest Canopy
  let statusText = 'Optimal Health';
  let badgeBg = 'bg-[#E7EDE3] text-[#355B46]';

  if (normalizedScore < 60) {
    strokeColor = '#A63A24'; // Red alert
    statusText = 'Critical Attention';
    badgeBg = 'bg-[#FBEBE8] text-[#A63A24]';
  } else if (normalizedScore < 80) {
    strokeColor = '#C8795B'; // Terracotta
    statusText = 'Moderate Stress';
    badgeBg = 'bg-[#F2DFD1] text-[#796A59]';
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#D3DFCE"
            strokeWidth={strokeWidth}
            fill="none"
            opacity={0.5}
          />
          {/* Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-mono text-2xl font-bold tracking-tight text-[#263D32]">
            {String(normalizedScore).padStart(2, '0')}
          </span>
          <span className="text-[9px] font-mono uppercase tracking-widest text-[#796A59]">
            / 100
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-2 text-center">
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold ${badgeBg}`}>
            {statusText}
          </span>
        </div>
      )}
    </div>
  );
};
