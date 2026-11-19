import React, { useState } from 'react';
import { Eye, EyeOff, ZoomIn, Info, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { FoliarHotspot } from '../../types';

interface FoliarHotspotViewerProps {
  imageUrl: string;
  plantName: string;
  hotspots?: FoliarHotspot[];
  severity?: string;
  className?: string;
}

export const FoliarHotspotViewer: React.FC<FoliarHotspotViewerProps> = ({
  imageUrl,
  plantName,
  hotspots = [],
  severity = 'Moderate Concern',
  className = '',
}) => {
  const [activeHotspot, setActiveHotspot] = useState<FoliarHotspot | null>(null);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showGrid, setShowGrid] = useState(false);

  // Fallback hotspots if none provided
  const displayHotspots: FoliarHotspot[] = hotspots.length > 0 ? hotspots : [
    {
      id: 'hs-default-1',
      x: 50,
      y: 45,
      title: 'Observed Symptom Zone',
      description: 'Primary visual pattern analyzed by on-device computer vision and Gemini models.',
      severity: severity.includes('Healthy') ? 'healthy' : 'moderate',
    }
  ];

  const getPinColor = (sev: FoliarHotspot['severity']) => {
    switch (sev) {
      case 'severe':
        return 'bg-[#A63A24] text-[#FAF9F4] ring-[#A63A24]/40';
      case 'moderate':
        return 'bg-[#C8795B] text-[#FAF9F4] ring-[#C8795B]/40';
      case 'mild':
        return 'bg-[#796A59] text-[#FAF9F4] ring-[#796A59]/40';
      case 'healthy':
      default:
        return 'bg-[#355B46] text-[#FAF9F4] ring-[#355B46]/40';
    }
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-[#D3DFCE] bg-[#FAF9F4] ${className}`}>
      {/* Top Floating Controls */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-[#FAF9F4]/90 backdrop-blur-xs p-1 rounded-xl border border-[#D3DFCE] shadow-xs">
        <button
          type="button"
          onClick={() => setShowHotspots(!showHotspots)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors ${
            showHotspots
              ? 'bg-[#355B46] text-[#FAF9F4]'
              : 'text-[#796A59] hover:bg-[#E7EDE3]'
          }`}
          title="Toggle Symptom Markers"
        >
          {showHotspots ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>{showHotspots ? 'PINS ON' : 'PINS OFF'}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowGrid(!showGrid)}
          className={`p-1.5 rounded-lg text-[11px] font-mono transition-colors ${
            showGrid ? 'bg-[#355B46] text-[#FAF9F4]' : 'text-[#796A59] hover:bg-[#E7EDE3]'
          }`}
          title="Toggle Botanical Grid"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Image Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden select-none">
        <img
          src={imageUrl}
          alt={`Foliar pathology inspection of ${plantName}`}
          className="w-full h-full object-cover transition-transform duration-300"
        />

        {/* Optional Coordinate Grid Overlay */}
        {showGrid && (
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none border border-[#8FA88A]/30">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="border border-[#8FA88A]/20 flex items-start justify-start p-1">
                <span className="text-[8px] font-mono text-[#FAF9F4]/80 drop-shadow-sm">
                  {String.fromCharCode(65 + Math.floor(i / 4))}{(i % 4) + 1}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Interactive Hotspot Pins */}
        {showHotspots &&
          displayHotspots.map((hs, index) => {
            const isSelected = activeHotspot?.id === hs.id;
            return (
              <div
                key={hs.id}
                style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
              >
                {/* Pulsing Aura */}
                <div
                  className={`absolute -inset-2 rounded-full animate-ping opacity-60 ${
                    hs.severity === 'severe'
                      ? 'bg-[#A63A24]'
                      : hs.severity === 'moderate'
                      ? 'bg-[#C8795B]'
                      : 'bg-[#355B46]'
                  }`}
                />

                {/* Pin Button */}
                <button
                  type="button"
                  onClick={() => setActiveHotspot(isSelected ? null : hs)}
                  onMouseEnter={() => setActiveHotspot(hs)}
                  className={`relative w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold shadow-md transition-transform ring-4 hover:scale-110 active:scale-95 ${getPinColor(
                    hs.severity
                  )} ${isSelected ? 'scale-115 ring-opacity-100' : 'ring-opacity-40'}`}
                  aria-label={`Inspect foliar marker: ${hs.title}`}
                >
                  {index + 1}
                </button>
              </div>
            );
          })}
      </div>

      {/* Hotspot Inspection Drawer / Tooltip */}
      {showHotspots && activeHotspot && (
        <div className="p-4 bg-[#FFFFFF] border-t border-[#D3DFCE] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#E7EDE3] text-[#355B46] shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="font-serif font-bold text-sm text-[#263D32]">
                    {activeHotspot.title}
                  </h5>
                  <span
                    className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-semibold ${
                      activeHotspot.severity === 'severe'
                        ? 'bg-[#FBEBE8] text-[#A63A24]'
                        : activeHotspot.severity === 'moderate'
                        ? 'bg-[#F2DFD1] text-[#C8795B]'
                        : 'bg-[#E7EDE3] text-[#355B46]'
                    }`}
                  >
                    {activeHotspot.severity} marker
                  </span>
                </div>
                <p className="text-xs text-[#796A59] mt-1 leading-relaxed">
                  {activeHotspot.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveHotspot(null)}
              className="text-xs text-[#796A59] hover:text-[#263D32] px-2 py-1 rounded-md hover:bg-[#E7EDE3]"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
