import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Droplets, 
  Sparkles, 
  Scissors, 
  Eye, 
  Wind, 
  Clock, 
  Plus, 
  Calendar,
  X,
  Trash2
} from 'lucide-react';
import { CareReminder, Plant } from '../../types';
import { toggleReminder, saveReminder, deleteReminder } from '../../services/storageService';

interface CareRemindersWidgetProps {
  reminders: CareReminder[];
  plants: Plant[];
  onRefresh: () => void;
  className?: string;
}

export const CareRemindersWidget: React.FC<CareRemindersWidgetProps> = ({
  reminders,
  plants,
  onRefresh,
  className = '',
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPlantId, setNewPlantId] = useState(plants[0]?.id || '');
  const [newTaskType, setNewTaskType] = useState<CareReminder['taskType']>('water');
  const [newFreq, setNewFreq] = useState(7);

  const pendingCount = reminders.filter((r) => !r.isCompleted).length;

  const handleToggle = async (id: string) => {
    await toggleReminder(id);
    onRefresh();
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this scheduled care task?')) {
      await deleteReminder(id);
      onRefresh();
    }
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    const plant = plants.find((p) => p.id === newPlantId) || plants[0];
    if (!plant || !newTitle) return;

    const reminder: CareReminder = {
      id: 'rem-' + Date.now(),
      plantId: plant.id,
      plantName: plant.name,
      taskType: newTaskType,
      title: newTitle,
      frequencyDays: newFreq,
      dueDate: new Date(Date.now() + 86400000 * newFreq).toISOString(),
      isCompleted: false,
      priority: newTaskType === 'prune' || newTaskType === 'fertilize' ? 'urgent' : 'normal',
    };

    await saveReminder(reminder);
    setIsAddOpen(false);
    setNewTitle('');
    onRefresh();
  };

  const getTaskIcon = (type: CareReminder['taskType']) => {
    switch (type) {
      case 'water':
        return <Droplets className="w-3.5 h-3.5 text-[#355B46]" />;
      case 'fertilize':
        return <Sparkles className="w-3.5 h-3.5 text-[#C8795B]" />;
      case 'prune':
        return <Scissors className="w-3.5 h-3.5 text-[#796A59]" />;
      case 'mist':
        return <Wind className="w-3.5 h-3.5 text-[#8FA88A]" />;
      case 'inspect':
      default:
        return <Eye className="w-3.5 h-3.5 text-[#263D32]" />;
    }
  };

  return (
    <div className={`p-6 rounded-2xl bg-[#FFFFFF] border border-[#D3DFCE] shadow-xs space-y-4 ${className}`}>
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-[#D3DFCE]/60 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#355B46]" />
          <h4 className="font-serif font-bold text-base text-[#263D32]">
            Botanical Care Schedule
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#E7EDE3] text-[#355B46] font-semibold">
            {pendingCount} {pendingCount === 1 ? 'TASK PENDING' : 'TASKS PENDING'}
          </span>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="p-1 rounded-lg text-[#796A59] hover:text-[#263D32] hover:bg-[#E7EDE3] transition-colors"
            title="Add Care Reminder"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {reminders.slice(0, 5).map((reminder) => {
          const isDone = reminder.isCompleted;
          return (
            <div
              key={reminder.id}
              onClick={() => handleToggle(reminder.id)}
              className={`cursor-pointer p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                isDone
                  ? 'bg-[#FAF9F4] border-[#D3DFCE]/40 opacity-60'
                  : 'bg-[#FAF9F4] border-[#D3DFCE] hover:border-[#8FA88A] shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  className="text-[#355B46] hover:scale-110 transition-transform shrink-0"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-[#355B46] fill-[#E7EDE3]" />
                  ) : (
                    <Circle className="w-4 h-4 text-[#8FA88A]" />
                  )}
                </button>

                <div className="p-1.5 rounded-lg bg-[#E7EDE3] shrink-0">
                  {getTaskIcon(reminder.taskType)}
                </div>

                <div className="min-w-0">
                  <p
                    className={`text-xs font-medium text-[#263D32] truncate ${
                      isDone ? 'line-through text-[#796A59]' : ''
                    }`}
                  >
                    {reminder.title}
                  </p>
                  <p className="text-[10px] font-mono text-[#796A59] truncate">
                    {reminder.plantName} · Every {reminder.frequencyDays} days
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {reminder.priority === 'urgent' && !isDone && (
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-xs bg-[#FBEBE8] text-[#A63A24] font-semibold">
                    DUE
                  </span>
                )}
                <span className="text-[10px] font-mono text-[#796A59]">
                  {new Date(reminder.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, reminder.id)}
                  title="Remove care task"
                  aria-label={`Delete task ${reminder.title}`}
                  className="p-1 text-[#796A59] hover:text-[#C8795B] hover:bg-[#F2DFD1]/50 rounded-md transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Reminder Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263D32]/40 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] border border-[#D3DFCE] rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D3DFCE]">
              <h3 className="font-serif font-bold text-lg text-[#263D32]">New Botanical Care Task</h3>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-lg text-[#796A59] hover:bg-[#E7EDE3]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#263D32] mb-1">Target Specimen</label>
                <select
                  value={newPlantId}
                  onChange={(e) => setNewPlantId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D3DFCE] bg-[#FAF9F4] text-xs text-[#263D32]"
                >
                  {plants.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.species})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#263D32] mb-1">Task Description</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Knuckle Soil Moisture Check & Soak"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D3DFCE] bg-[#FAF9F4] text-xs text-[#263D32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#263D32] mb-1">Task Action</label>
                  <select
                    value={newTaskType}
                    onChange={(e) => setNewTaskType(e.target.value as CareReminder['taskType'])}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D3DFCE] bg-[#FAF9F4] text-xs text-[#263D32]"
                  >
                    <option value="water">Irrigation / Soak</option>
                    <option value="fertilize">Nutrient Drench</option>
                    <option value="prune">Foliar Pruning</option>
                    <option value="inspect">Pathology Check</option>
                    <option value="mist">Canopy Mist</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#263D32] mb-1">Cadence (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={newFreq}
                    onChange={(e) => setNewFreq(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D3DFCE] bg-[#FAF9F4] text-xs text-[#263D32]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#D3DFCE]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#796A59] hover:bg-[#E7EDE3] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium bg-[#355B46] hover:bg-[#2B4C3A] text-[#FAF9F4] rounded-xl shadow-xs"
                >
                  Schedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
