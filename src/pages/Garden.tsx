import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Stethoscope, 
  ScanLine, 
  Trash2, 
  Clock, 
  Flower2,
  X,
  Check,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { Plant, PlantStatus } from '../types';
import { HealthScorePill } from '../components/common/HealthScorePill';
import { savePlant, deletePlant } from '../services/storageService';

interface GardenProps {
  plants: Plant[];
  onSelectPlant: (plant: Plant) => void;
  onScanPlant: (plant?: Plant) => void;
  onRefresh: () => void;
}

export const Garden: React.FC<GardenProps> = ({
  plants,
  onSelectPlant,
  onScanPlant,
  onRefresh,
}) => {
  const [filter, setFilter] = useState<'all' | 'healthy' | 'attention'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Plant Form State
  const [newName, setNewName] = useState('');
  const [newSpecies, setNewSpecies] = useState('');
  const [newLocation, setNewLocation] = useState('Living Room Window');
  const [newImageUrl, setNewImageUrl] = useState(
    'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=800&q=80'
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredPlants = plants.filter((plant) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'healthy'
        ? plant.status === 'healthy'
        : plant.status !== 'healthy';

    const matchesSearch =
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (plant.location && plant.location.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const handleCreatePlant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const plant: Plant = {
      id: 'plant-' + Date.now(),
      userId: 'guest-user',
      name: newName,
      species: newSpecies || 'Botanical specimen',
      commonName: newName,
      imageUrl: newImageUrl,
      status: 'healthy',
      healthScore: 85,
      lastScanned: new Date().toISOString(),
      location: newLocation,
      notes: 'Newly cataloged into garden collection.',
      createdAt: new Date().toISOString(),
    };

    await savePlant(plant);
    setIsAddModalOpen(false);
    setNewName('');
    setNewSpecies('');
    onRefresh();
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Remove this plant from your botanical collection?')) {
      await deletePlant(id);
      onRefresh();
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto space-y-8">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#D3DFCE]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#796A59]">
            BOTANICAL HERBARIUM
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#263D32] mt-1">
            My Garden Collection
          </h2>
          <p className="text-sm text-[#796A59] mt-1.5 font-normal">
            Care for and monitor each individual specimen in your living sanctuary.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#355B46] hover:bg-[#2B4C3A] text-[#FAF9F4] text-xs font-medium rounded-xl transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#8FA88A]" />
            <span>Add New Specimen</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FFFFFF] rounded-xl border border-[#D3DFCE]">
          {[
            { id: 'all', label: `All (${plants.length})` },
            { id: 'healthy', label: `Healthy (${plants.filter((p) => p.status === 'healthy').length})` },
            { id: 'attention', label: `Needs Attention (${plants.filter((p) => p.status !== 'healthy').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as 'all' | 'healthy' | 'attention')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === tab.id
                  ? 'bg-[#355B46] text-[#FAF9F4]'
                  : 'text-[#796A59] hover:text-[#263D32]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#796A59] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flora name or species..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#D3DFCE] bg-[#FFFFFF] text-xs text-[#263D32] placeholder-[#796A59]/60 focus:outline-hidden focus:ring-1 focus:ring-[#8FA88A]"
          />
        </div>
      </div>

      {/* Editorial Plant Grid */}
      {filteredPlants.length === 0 ? (
        <div className="text-center py-16 bg-[#FFFFFF] rounded-2xl border border-[#D3DFCE] p-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#E7EDE3] text-[#355B46] flex items-center justify-center mx-auto">
            <Flower2 className="w-6 h-6" />
          </div>
          <h4 className="font-serif font-bold text-lg text-[#263D32]">No specimens found</h4>
          <p className="text-xs text-[#796A59] max-w-sm mx-auto">
            No botanical specimens matched your filter or search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlants.map((plant) => (
            <div
              key={plant.id}
              onClick={() => onSelectPlant(plant)}
              className="cursor-pointer botanical-card overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Photo Header */}
                <div className="aspect-4/3 overflow-hidden relative border-b border-[#D3DFCE]">
                  <img
                    src={plant.imageUrl}
                    alt={plant.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <HealthScorePill score={plant.healthScore} size="sm" />
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, plant.id)}
                    title="Remove specimen"
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-[#FFFFFF]/80 hover:bg-[#FFFFFF] text-[#796A59] hover:text-[#C8795B] opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Botanical Metadata */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#263D32] group-hover:text-[#355B46] transition-colors">
                      {plant.name}
                    </h3>
                    <p className="text-xs text-[#796A59] italic mt-0.5">{plant.species}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#796A59] pt-2 border-t border-[#D3DFCE]/60">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3 h-3 text-[#355B46] shrink-0" />
                      <span className="truncate">{plant.location || 'Home'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Clock className="w-3 h-3 text-[#8FA88A] shrink-0" />
                      <span>{new Date(plant.lastScanned).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {plant.notes && (
                    <p className="text-xs text-[#796A59] line-clamp-2 bg-[#FAF9F4] p-2.5 rounded-lg border border-[#D3DFCE]/60 leading-relaxed">
                      {plant.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-2 border-t border-[#D3DFCE]/40">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPlant(plant);
                  }}
                  className="flex-1 py-2 text-center text-xs font-medium text-[#263D32] hover:bg-[#E7EDE3] rounded-lg border border-[#D3DFCE] transition-colors"
                >
                  Medical Chart
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onScanPlant(plant);
                  }}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-[#355B46] hover:bg-[#2B4C3A] text-[#FAF9F4] rounded-lg text-xs font-medium transition-colors"
                  title="Rescan foliage"
                >
                  <ScanLine className="w-3.5 h-3.5" />
                  <span>Scan</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Specimen Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263D32]/40 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] border border-[#D3DFCE] rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D3DFCE]">
              <h3 className="font-serif font-bold text-lg text-[#263D32]">Add New Plant Specimen</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-[#796A59] hover:bg-[#E7EDE3]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePlant} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#263D32] mb-1">Common Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. San Marzano Tomato"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D3DFCE] bg-[#FAF9F4] text-xs text-[#263D32]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#263D32] mb-1">Botanical Species (Latin)</label>
                <input
                  type="text"
                  value={newSpecies}
                  onChange={(e) => setNewSpecies(e.target.value)}
                  placeholder="e.g. Solanum lycopersicum"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D3DFCE] bg-[#FAF9F4] text-xs text-[#263D32] italic"
                />
              </div>

              <div>
                <label className="block font-medium text-[#263D32] mb-1">Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Sunny Balcony / South Window"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D3DFCE] bg-[#FAF9F4] text-xs text-[#263D32]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#263D32] mb-1">Specimen Photograph</label>
                <div className="flex gap-3 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#D3DFCE] bg-[#FAF9F4] shrink-0">
                    {newImageUrl ? (
                      <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#8FA88A]">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E7EDE3] hover:bg-[#D3DFCE] text-[#355B46] text-xs font-medium transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo from Device</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFilePick}
                      accept="image/*"
                      className="hidden"
                    />
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Or enter image URL..."
                      className="w-full px-3 py-1.5 rounded-lg border border-[#D3DFCE] bg-[#FAF9F4] text-[11px] text-[#263D32]"
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
                  Save Specimen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
