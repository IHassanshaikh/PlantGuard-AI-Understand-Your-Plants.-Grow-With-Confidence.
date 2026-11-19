import React from 'react';
import { Cpu, Cloud, Sparkles, Zap } from 'lucide-react';
import { InferenceSource } from '../../types';

interface InferenceBadgeProps {
  source: InferenceSource;
  latencyMs?: number;
  className?: string;
}

export const InferenceBadge: React.FC<InferenceBadgeProps> = ({ source, latencyMs, className = '' }) => {
  const getBadgeConfig = () => {
    switch (source) {
      case 'local-nano':
        return {
          icon: <Cpu className="w-3.5 h-3.5 text-[#355B46]" />,
          text: 'LOCAL INFERENCE · GEMINI NANO',
          bg: 'bg-[#E7EDE3]',
          border: 'border-[#8FA88A]',
          textColor: 'text-[#263D32]',
        };
      case 'local-edge':
        return {
          icon: <Zap className="w-3.5 h-3.5 text-[#355B46]" />,
          text: 'LOCAL INFERENCE · ON-DEVICE VISION',
          bg: 'bg-[#E7EDE3]',
          border: 'border-[#8FA88A]',
          textColor: 'text-[#263D32]',
        };
      case 'cloud-gemini':
        return {
          icon: <Cloud className="w-3.5 h-3.5 text-[#C8795B]" />,
          text: 'CLOUD INFERENCE · GEMINI FLASH',
          bg: 'bg-[#F2DFD1]',
          border: 'border-[#E8CFC1]',
          textColor: 'text-[#796A59]',
        };
      case 'hybrid':
      default:
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-[#355B46]" />,
          text: 'HYBRID · ON-DEVICE + CLOUD GEMINI',
          bg: 'bg-[#E7EDE3]',
          border: 'border-[#8FA88A]',
          textColor: 'text-[#263D32]',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono tracking-wider font-medium ${config.bg} ${config.border} ${config.textColor} ${className}`}
    >
      {config.icon}
      <span>{config.text}</span>
      {latencyMs !== undefined && (
        <span className="opacity-60 pl-1 border-l border-current/20">
          {latencyMs}ms
        </span>
      )}
    </div>
  );
};
