import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Plus, 
  Filter, 
  Droplets, 
  Scissors, 
  Activity, 
  Sparkles, 
  FileText, 
  Clock, 
  X,
  ArrowLeftRight,
  Trash2,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { JournalEntry, Plant, ComparisonPair } from '../types';
import { HealthScorePill } from '../components/common/HealthScorePill';
import { BeforeAfterSlider } from '../components/journal/BeforeAfterSlider';
import { addJournalEntry, deleteJournalEntry, getComparisons } from '../services/storageService';

interface JournalProps {
  entries: JournalEntry[];
  plants: Plant[];
  onRefresh: () => void;
}

export const Journal: React.FC<JournalProps> = ({ entries, plants, onRefresh }) => {
  const [selectedPlantFilter, setSelectedPlantFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [comparisons, setComparisons] = useState<ComparisonPair[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Journal Entry Form State
  const [plantId, setPlantId] = useState(plants[0]?.id || '');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [treatment, setTreatment] = useState('');
  const [entryType, setEntryType] = useState<JournalEntry['type']>('treatment');
  const [entryImageUrl, setEntryImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getComparisons().then(setComparisons);
  }, []);

  const filteredEntries = entries.filter((e) => {
    const matchesPlant = selectedPlantFilter === 'all' || e.plantId === selectedPlantFilter;
    const matchesType = selectedTypeFilter === 'all' || e.type === selectedTypeFilter;
    return matchesPlant && matchesType;
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEntryImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (confirm('Delete this journal observation?')) {
      await deleteJournalEntry(id);
      onRefresh();
    }
  };

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const plant = plants.find((p) => p.id === plantId) || plants[0];
    if (!plant || !title) return;

    const newEntry: JournalEntry = {
      id: 'journal-' + Date.now(),
      plantId: plant.id,
      plantName: plant.name,
      date: new Date().toISOString(),
      title,
      notes,
      treatmentApplied: treatment,
      healthScore: plant.healthScore,
      imageUrl: entryImageUrl || plant.imageUrl,
      type: entryType,
    };

    await addJournalEntry(newEntry);
    setIsAddModalOpen(false);
    setTitle('');
    setNotes('');
    setTreatment('');
    setEntryImageUrl('');
    onRefresh();
  };

  const getEntryIcon = (type: JournalEntry['type']) => {
    switch (type) {
      case 'scan':
        return <Activity className="w-4 h-4 text-[#355B46]" />;
      case 'treatment':
        return <Sparkles className="w-4 h-4 text-[#C8795B]" />;
      case 'watering':
        return <Droplets className="w-4 h-4 text-[#8FA88A]" />;
      case 'pruning':
        return <Scissors className="w-4 h-4 text-[#796A59]" />;
      case 'note':
      default:
        return <FileText className="w-4 h-4 text-[#263D32]" />;
    }
  };

  return (
    <div id="main-content" className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#D3DFCE]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#796A59]">
            TEMPORAL HEALTH CHRONICLE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#263D32] mt-1">
            Plant Health Journal
          </h2>
          <p className="text-sm text-[#796A59] mt-1.5 font-normal">
            A continuous chronological log of treatments, foliage changes, and healing progress.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#355B46] hover:bg-[#2B4C3A] text-[#FAF9F4] text-xs font-medium rounded-xl transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4 text-[#8FA88A]" />
          <span>New Journal Note</span>
        </button>
      </div>

      {/* Featured Before & After Interactive Comparator */}
      {comparisons.length > 0 && (
        <BeforeAfterSlider comparison={comparisons[0]} />
      )}

      {/* Filter Ribbon: By Plant & By Type */}
      <div className="space-y-3">
        {/* Plant Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-mono text-[#796A59] shrink-0">SPECIMEN:</span>
          <button
            onClick={() => setSelectedPlantFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 border transition-colors ${
              selectedPlantFilter === 'all'
                ? 'bg-[#355B46] text-[#FAF9F4] border-[#355B46]'
                : 'bg-[#FFFFFF] text-[#263D32] border-[#D3DFCE] hover:bg-[#FAF9F4]'
            }`}
          >
            All Flora ({entries.length})
          </button>
          {plants.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlantFilter(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 border transition-colors ${
                selectedPlantFilter === p.id
                  ? 'bg-[#355B46] text-[#FAF9F4] border-[#355B46]'
                  : 'bg-[#FFFFFF] text-[#263D32] border-[#D3DFCE] hover:bg-[#FAF9F4]'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Activity Type Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-mono text-[#796A59] shrink-0">ENTRY TYPE:</span>
          {[
            { id: 'all', label: 'All Activities' },
            { id: 'treatment', label: 'Treatments' },
            { id: 'scan', label: 'Foliar Scans' },
            { id: 'watering', label: 'Watering' },
            { id: 'pruning', label: 'Pruning' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedTypeFilter(type.id)}
              className={`px-3 py-1 rounded-md text-[11px] font-mono transition-colors ${
                selectedTypeFilter === type.id
                  ? 'bg-[#E7EDE3] text-[#355B46] font-bold border border-[#8FA88A]'
                  : 'bg-[#FFFFFF] text-[#796A59] hover:text-[#263D32] border border-[#D3DFCE]/60'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative border-l-2 border-[#D3DFCE] ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
        {filteredEntries.length === 0 ? (
          <div className="p-8 text-center bg-[#FFFFFF] rounded-2xl border border-[#D3DFCE] text-xs text-[#796A59]">
            No journal entries match your selected filter.
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div key={entry.id} className="relative group">
              {/* Timeline Dot Marker */}
              <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-6 h-6 rounded-full bg-[#FAF9F4] border-2 border-[#355B46] flex items-center justify-center shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#355B46]" />
              </div>

              {/* Entry Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#D3DFCE] shadow-xs space-y-3 hover:border-[#8FA88A] transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D3DFCE]/60 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#E7EDE3]">
                      {getEntryIcon(entry.type)}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#263D32]">
                        {entry.title}
                      </h4>
                      <p className="text-xs text-[#796A59] font-serif italic">
                        Specimen: {entry.plantName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] font-mono text-[#796A59] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#8FA88A]" />
                      {new Date(entry.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <HealthScorePill score={entry.healthScore} size="sm" />
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      title="Delete journal note"
                      aria-label={`Delete note for ${entry.plantName}`}
                      className="p-1 rounded-md text-[#796A59] hover:text-[#C8795B] hover:bg-[#F2DFD1]/50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                  <div className="sm:col-span-9 space-y-2 text-xs text-[#263D32]">
                    <p className="leading-relaxed">{entry.notes}</p>
                    {entry.treatmentApplied && (
                      <div className="p-3 rounded-xl bg-[#FAF9F4] border border-[#D3DFCE] text-[#796A59]">
                        <span className="font-semibold text-[#355B46] block mb-0.5">Applied Action:</span>
                        {entry.treatmentApplied}
                      </div>
                    )}
                  </div>

                  {entry.imageUrl && (
                    <div className="sm:col-span-3 aspect-square rounded-xl overflow-hidden border border-[#D3DFCE]">
                      <img
                        src={entry.imageUrl}
                        alt={entry.plantName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Entry Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263D32]/40 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] border border-[#D3DFCE] rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D3DFCE]">
              <h3 className="font-serif font-bold text-lg text-[#263D32]">Add Health Journal Note</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-[#796A59] hover:bg-[#E7EDE3]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEntry} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#263D32] mb-1">Select Specimen</label>
                <select
                  value={plantId}
                  onChange={(e) => setPlantId(e.target.value)}
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
                <label className="block font-medium text-[#263D32] mb-1">Entry Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Copper Spray Applied / Lower Foliage Pruned"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D3DFCE] bg-[#FAF9F4] text-xs text-[#263D32]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#263D32] mb-1">Entry Type</label>
                <select
                  value={entryType}
                  onChange={(e) => setEntryType(e.target.value as JournalEntry['type'])}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D3DFCE] bg-[#FAF9F4] text-xs text-[#263D32]"
                >
                  <option value="treatment">Treatment / Medicine</option>
                  <option value="scan">Foliage Inspection</option>
                  <option value="watering">Watering & Moisture</option>
                  <option value="pruning">Pruning & Sanitation</option>
                  <option value="note">General Observation</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#263D32] mb-1">Observations / Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe leaf turgor, color changes, or recovery signs..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D3DFCE] bg-[#FAF9F4] text-xs text-[#263D32]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#263D32] mb-1">Treatment Applied</label>
                <input
                  type="text"
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  placeholder="e.g. 500ml diluted organic copper solution"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D3DFCE] bg-[#FAF9F4] text-xs text-[#263D32]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#263D32] mb-1">Progress Photograph (Optional)</label>
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#D3DFCE] bg-[#FAF9F4] shrink-0">
                    {entryImageUrl ? (
                      <img src={entryImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#8FA88A]">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E7EDE3] hover:bg-[#D3DFCE] text-[#355B46] text-xs font-medium transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <input
                      type="text"
                      value={entryImageUrl}
                      onChange={(e) => setEntryImageUrl(e.target.value)}
                      placeholder="Or enter image URL..."
                      className="w-full px-2.5 py-1 rounded-lg border border-[#D3DFCE] bg-[#FAF9F4] text-[10px] text-[#263D32]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#D3DFCE]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#796A59] hover:bg-[#E7EDE3] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium bg-[#355B46] hover:bg-[#2B4C3A] text-[#FAF9F4] rounded-xl shadow-xs"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
