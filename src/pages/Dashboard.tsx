import React from 'react';
import { 
  Plus, 
  ScanLine, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Stethoscope, 
  Sparkles, 
  Droplets, 
  Calendar, 
  Flower2 
} from 'lucide-react';
import { Plant, ScanResult, CareReminder } from '../types';
import { NavTab } from '../components/layout/Sidebar';
import { HealthScorePill } from '../components/common/HealthScorePill';
import { CareRemindersWidget } from '../components/dashboard/CareRemindersWidget';

interface DashboardProps {
  plants: Plant[];
  recentScans: ScanResult[];
  reminders: CareReminder[];
  onRefreshReminders: () => void;
  onNavigate: (tab: NavTab) => void;
  onSelectPlant: (plant: Plant) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  plants,
  recentScans,
  reminders,
  onRefreshReminders,
  onNavigate,
  onSelectPlant,
}) => {
  const totalPlants = plants.length;
  const healthyPlants = plants.filter((p) => p.status === 'healthy').length;
  const attentionPlants = plants.filter((p) => p.status !== 'healthy').length;
  const criticalPlant = plants.find((p) => p.status !== 'healthy') || plants[0];

  const currentDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <div id="main-content" className="p-6 sm:p-10 max-w-6xl mx-auto space-y-10">
      {/* Editorial Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#D3DFCE]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#796A59] mb-1">
            <Calendar className="w-3.5 h-3.5 text-[#355B46]" />
            <span>{currentDate}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#263D32] tracking-tight">
            Good morning, Hassan.
          </h2>
          <p className="text-sm text-[#796A59] mt-1.5 font-normal">
            Let's see how your botanical collection is growing today.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('garden')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#FFFFFF] hover:bg-[#FAF9F4] text-[#263D32] border border-[#D3DFCE] text-xs font-medium rounded-xl transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#355B46]" />
            <span>View All Plants</span>
          </button>
          <button
            onClick={() => onNavigate('scanner')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#355B46] hover:bg-[#2B4C3A] text-[#FAF9F4] text-xs font-medium rounded-xl transition-all shadow-xs"
          >
            <ScanLine className="w-3.5 h-3.5 text-[#8FA88A]" />
            <span>Scan a Plant</span>
          </button>
        </div>
      </div>

      {/* Grid: Metrics Strip */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#796A59] font-semibold">
            YOUR GARDEN OVERVIEW
          </h3>
          <span className="text-xs text-[#796A59] font-mono">Realtime Sanctuary Sensor</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Metric 1 */}
          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D3DFCE] shadow-xs relative overflow-hidden group hover:border-[#8FA88A] transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#796A59]">Total Flora</span>
              <Flower2 className="w-4 h-4 text-[#355B46]" />
            </div>
            <p className="font-mono text-4xl sm:text-5xl font-bold text-[#263D32]">
              {String(totalPlants).padStart(2, '0')}
            </p>
            <p className="text-xs text-[#796A59] mt-2 flex items-center gap-1">
              Active registered botanical specimens
            </p>
          </div>

          {/* Metric 2 */}
          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D3DFCE] shadow-xs relative overflow-hidden group hover:border-[#8FA88A] transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#796A59]">Healthy</span>
              <CheckCircle2 className="w-4 h-4 text-[#355B46]" />
            </div>
            <p className="font-mono text-4xl sm:text-5xl font-bold text-[#355B46]">
              {String(healthyPlants).padStart(2, '0')}
            </p>
            <p className="text-xs text-[#796A59] mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#355B46]" />
              Optimum photosynthetic turgor
            </p>
          </div>

          {/* Metric 3 */}
          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D3DFCE] shadow-xs relative overflow-hidden group hover:border-[#C8795B] transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#796A59]">Needs Attention</span>
              <AlertTriangle className="w-4 h-4 text-[#C8795B]" />
            </div>
            <p className="font-mono text-4xl sm:text-5xl font-bold text-[#C8795B]">
              {String(attentionPlants).padStart(2, '0')}
            </p>
            <p className="text-xs text-[#796A59] mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8795B]" />
              Foliar chlorosis or blight symptoms
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Split: Doctor Insight & Care Reminders Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Doctor's Botanical Insight Banner & Tips */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-7 rounded-2xl bg-[#FFFFFF] border border-[#D3DFCE] shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E7EDE3]/40 rounded-full blur-2xl -mr-10 -mt-10" />

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#E7EDE3] text-[#355B46] flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C8795B] font-semibold">
                  A NOTE FROM YOUR PLANT DOCTOR
                </span>
                <h4 className="font-serif text-lg font-bold text-[#263D32]">
                  {criticalPlant
                    ? `${criticalPlant.name} requires attention.`
                    : 'Your garden is thriving.'}
                </h4>
              </div>
            </div>

            {criticalPlant ? (
              <div className="space-y-4">
                <p className="text-xs text-[#263D32] leading-relaxed bg-[#FAF9F4] p-4 rounded-xl border border-[#D3DFCE]">
                  "Recent on-device vision scan of your <span className="font-semibold">{criticalPlant.name}</span> ({criticalPlant.species}) revealed concentric fungal target rings and early chlorosis halos. Lower foliage needs sanitized pruning to prevent spore dissemination."
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-3">
                    <img
                      src={criticalPlant.imageUrl}
                      alt={criticalPlant.name}
                      className="w-10 h-10 rounded-lg object-cover border border-[#D3DFCE]"
                    />
                    <div>
                      <p className="text-xs font-semibold text-[#263D32]">{criticalPlant.name}</p>
                      <p className="text-[10px] font-mono text-[#796A59]">{criticalPlant.species}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectPlant(criticalPlant)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#355B46] hover:bg-[#2B4C3A] text-[#FAF9F4] text-xs font-medium rounded-xl transition-colors"
                    >
                      <span>Consult Doctor</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#796A59]">
                All registered botanical specimens are exhibiting steady photosynthetic vigor.
              </p>
            )}
          </div>

          {/* Interactive Care Reminders Schedule */}
          <CareRemindersWidget
            reminders={reminders}
            plants={plants}
            onRefresh={onRefreshReminders}
          />
        </div>

        {/* Right: Recent Botanical Activity */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#796A59] font-semibold">
              ACTIVE HERBARIUM SPECIMENS
            </h3>
            <button
              onClick={() => onNavigate('garden')}
              className="text-xs font-medium text-[#355B46] hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {plants.slice(0, 5).map((plant) => (
              <div
                key={plant.id}
                onClick={() => onSelectPlant(plant)}
                className="cursor-pointer p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D3DFCE] hover:border-[#8FA88A] hover:shadow-xs transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={plant.imageUrl}
                    alt={plant.name}
                    className="w-12 h-12 rounded-lg object-cover border border-[#D3DFCE] group-hover:scale-105 transition-transform shrink-0"
                  />
                  <div className="min-w-0">
                    <h5 className="font-serif font-bold text-sm text-[#263D32] group-hover:text-[#355B46] transition-colors truncate">
                      {plant.name}
                    </h5>
                    <p className="text-[11px] text-[#796A59] italic truncate">{plant.species}</p>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#796A59] mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{plant.status === 'healthy' ? 'Optimal Health' : 'Needs Care'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <HealthScorePill score={plant.healthScore} size="sm" showLabel={false} />
                  <span className="text-[10px] font-mono text-[#796A59] truncate max-w-[100px]">
                    {plant.location || 'Garden'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Seasonal Tip */}
          <div className="p-4 rounded-xl bg-[#E7EDE3]/50 border border-[#D3DFCE] flex items-start gap-3">
            <Droplets className="w-4 h-4 text-[#355B46] shrink-0 mt-0.5" />
            <p className="text-xs text-[#796A59] leading-relaxed">
              <strong className="text-[#263D32]">Root Zone Principle:</strong> Always allow container substrate to dry according to the species knuckle test to prevent hypoxic anaerobic root decay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
