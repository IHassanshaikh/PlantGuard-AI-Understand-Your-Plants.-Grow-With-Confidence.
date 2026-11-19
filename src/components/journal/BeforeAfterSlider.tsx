import React, { useState, useRef } from 'react';
import { Sparkles, ArrowLeftRight } from 'lucide-react';
import { ComparisonPair } from '../../types';
import { HealthScorePill } from '../common/HealthScorePill';

interface BeforeAfterSliderProps {
  comparison: ComparisonPair;
  className?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ comparison, className = '' }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className={`p-6 rounded-2xl bg-[#FFFFFF] border border-[#D3DFCE] shadow-xs space-y-4 ${className}`}>
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D3DFCE]/60 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C8795B] font-semibold">
            CHRONOLOGICAL RECOVERY COMPARISON
          </span>
          <h4 className="font-serif font-bold text-lg text-[#263D32]">
            {comparison.plantName} Healing Progress
          </h4>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="opacity-70">BEFORE:</span>
            <HealthScorePill score={comparison.beforeScore} size="sm" showLabel={false} />
          </div>
          <span className="text-[#8FA88A]">→</span>
          <div className="flex items-center gap-1.5">
            <span className="opacity-70">AFTER:</span>
            <HealthScorePill score={comparison.afterScore} size="sm" showLabel={false} />
          </div>
        </div>
      </div>

      {/* Interactive Split View Container */}
      <div
        ref={containerRef}
        onMouseDown={() => (isDragging.current = true)}
        onMouseUp={() => (isDragging.current = false)}
        onMouseLeave={() => (isDragging.current = false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative aspect-16/9 sm:aspect-21/9 rounded-xl overflow-hidden select-none cursor-ew-resize border border-[#D3DFCE]"
      >
        {/* After (Full background image) */}
        <img
          src={comparison.afterImageUrl}
          alt={`Recovered foliage of ${comparison.plantName}`}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* After Label Badge */}
        <div className="absolute top-3 right-3 z-10 bg-[#355B46]/90 backdrop-blur-xs text-[#FAF9F4] px-3 py-1 rounded-full text-xs font-mono">
          LATEST · {new Date(comparison.afterDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
        </div>

        {/* Before (Clipped image overlay) */}
        <div
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
          className="absolute inset-0 w-full h-full overflow-hidden"
        >
          <img
            src={comparison.beforeImageUrl}
            alt={`Initial symptomatic foliage of ${comparison.plantName}`}
            className="w-full h-full object-cover filter contrast-105"
          />
          {/* Before Label Badge */}
          <div className="absolute top-3 left-3 bg-[#A63A24]/90 backdrop-blur-xs text-[#FAF9F4] px-3 py-1 rounded-full text-xs font-mono">
            INITIAL · {new Date(comparison.beforeDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </div>
        </div>

        {/* Draggable Divider Line */}
        <div
          style={{ left: `${sliderPosition}%` }}
          className="absolute top-0 bottom-0 w-1 bg-[#FAF9F4] shadow-2xl flex items-center justify-center -translate-x-1/2 z-20"
        >
          <div className="w-8 h-8 rounded-full bg-[#FAF9F4] border-2 border-[#355B46] shadow-md flex items-center justify-center text-[#355B46]">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Summary Narrative */}
      <div className="p-3.5 rounded-xl bg-[#FAF9F4] border border-[#D3DFCE] text-xs text-[#263D32] space-y-1">
        <div className="flex items-center gap-1.5 font-semibold text-[#355B46]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Foliar Recovery Trajectory</span>
        </div>
        <p className="text-[#796A59] leading-relaxed">
          {comparison.recoverySummary}
        </p>
      </div>
    </div>
  );
};
