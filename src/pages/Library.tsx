import React, { useState } from 'react';
import { 
  Library as LibraryIcon, 
  Search, 
  Sun, 
  Droplets, 
  Layers, 
  Wind, 
  AlertTriangle, 
  Sparkles,
  BookOpen,
  Calculator,
  ShieldCheck
} from 'lucide-react';
import { PLANT_LIBRARY } from '../services/sampleData';
import { LibraryPlant } from '../types';

export const Library: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlant, setActivePlant] = useState<LibraryPlant>(PLANT_LIBRARY[0]);

  // Dosage Calculator State
  const [sprayGallons, setSprayGallons] = useState<number>(1);
  const [selectedRemedy, setSelectedRemedy] = useState<'copper' | 'neem' | 'bicarb' | 'bacillus'>('copper');

  const REMEDY_DATA = {
    copper: {
      name: 'Liquid Copper Octanoate',
      ratePerGal: '2.0 tbsp (30 ml)',
      calc: (gal: number) => `${(gal * 2).toFixed(1)} tbsp (${(gal * 30).toFixed(0)} ml)`,
      target: 'Alternaria Blight, Anthracnose, Leaf Spot',
    },
    neem: {
      name: 'Cold-Pressed Neem Oil Emulsion',
      ratePerGal: '2.5 tbsp (37.5 ml) + 1 tsp soap',
      calc: (gal: number) => `${(gal * 2.5).toFixed(1)} tbsp (${(gal * 37.5).toFixed(0)} ml) + ${(gal * 1).toFixed(0)} tsp mild soap`,
      target: 'Powdery Mildew, Spider Mites, Aphids',
    },
    bicarb: {
      name: 'Potassium Bicarbonate Antifungal',
      ratePerGal: '1.0 tbsp (15 g)',
      calc: (gal: number) => `${(gal * 1).toFixed(1)} tbsp (${(gal * 15).toFixed(0)} g)`,
      target: 'Rusts, Black Spot, Stunted Growth',
    },
    bacillus: {
      name: 'Bacillus subtilis Bio-Fungicide',
      ratePerGal: '1.5 tbsp (22.5 ml)',
      calc: (gal: number) => `${(gal * 1.5).toFixed(1)} tbsp (${(gal * 22.5).toFixed(0)} ml)`,
      target: 'Downy Mildew, Gray Mold (Botrytis)',
    },
  };

  const categories = ['All', 'Vegetables', 'Indoor', 'Herbs', 'Fruits'];

  const filteredPlants = PLANT_LIBRARY.filter((plant) => {
    const matchesCat = selectedCategory === 'All' || plant.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesName =
      plant.name.toLowerCase().includes(query) ||
      plant.scientificName.toLowerCase().includes(query);
    const matchesDiseases = plant.commonDiseases.some(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        d.symptoms.toLowerCase().includes(query) ||
        d.treatment.toLowerCase().includes(query)
    );

    return matchesCat && (matchesName || matchesDiseases);
  });

  return (
    <div id="main-content" className="p-6 sm:p-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#D3DFCE]">
        <span className="text-xs font-mono uppercase tracking-widest text-[#796A59]">
          BOTANICAL ENCYCLOPEDIA & PATHOLOGY REFERENCE
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#263D32] mt-1">
          Plant Knowledge Library
        </h2>
        <p className="text-sm text-[#796A59] mt-1.5 font-normal">
          Verified physiological profiles, horticultural care requirements, disease identification, and organic remedies.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#355B46] text-[#FAF9F4]'
                  : 'bg-[#FFFFFF] text-[#796A59] hover:text-[#263D32] border border-[#D3DFCE]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#796A59] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flora name, species, or symptoms..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#D3DFCE] bg-[#FFFFFF] text-xs text-[#263D32] placeholder-[#796A59]/60 focus:outline-hidden focus:ring-1 focus:ring-[#8FA88A]"
          />
        </div>
      </div>

      {/* Main Split: Encyclopedia Selector & Profile Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Plant Catalog Strip */}
        <div className="lg:col-span-4 space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-widest text-[#796A59] font-semibold">
            CATALOGED SPECIES ({filteredPlants.length})
          </h4>

          {filteredPlants.length === 0 ? (
            <div className="p-6 rounded-xl bg-[#FFFFFF] border border-[#D3DFCE] text-xs text-[#796A59] text-center">
              No flora or diseases matched your search.
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredPlants.map((plant) => {
                const isSelected = plant.id === activePlant.id;
                return (
                  <div
                    key={plant.id}
                    onClick={() => setActivePlant(plant)}
                    className={`cursor-pointer p-3 rounded-xl border transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-[#FFFFFF] border-[#355B46] shadow-sm ring-1 ring-[#355B46]'
                        : 'bg-[#FFFFFF] border-[#D3DFCE] hover:border-[#8FA88A]'
                    }`}
                  >
                    <img
                      src={plant.imageUrl}
                      alt={plant.name}
                      className="w-12 h-12 rounded-lg object-cover border border-[#D3DFCE] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-serif font-bold text-sm text-[#263D32] truncate">
                        {plant.name}
                      </h5>
                      <p className="text-[11px] text-[#796A59] italic truncate">
                        {plant.scientificName}
                      </p>
                      <span className="inline-block mt-0.5 text-[9px] font-mono uppercase px-1.5 py-0.2 rounded-xs bg-[#E7EDE3] text-[#355B46]">
                        {plant.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Comprehensive Plant Dossier & Treatment Guides */}
        <div className="lg:col-span-8 bg-[#FFFFFF] rounded-2xl border border-[#D3DFCE] p-6 sm:p-8 space-y-6 shadow-xs">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D3DFCE]">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#C8795B]">
                {activePlant.category} SPECIMEN PROFILE
              </span>
              <h3 className="font-serif text-3xl font-bold text-[#263D32] mt-1">
                {activePlant.name}
              </h3>
              <p className="text-xs font-serif italic text-[#796A59]">
                {activePlant.scientificName}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#E7EDE3] border border-[#8FA88A] text-[#355B46]">
                DIFFICULTY: {activePlant.difficulty.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Plant Photo & Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-5 aspect-4/3 rounded-xl overflow-hidden border border-[#D3DFCE]">
              <img
                src={activePlant.imageUrl}
                alt={activePlant.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="sm:col-span-7">
              <p className="text-xs text-[#263D32] leading-relaxed">
                {activePlant.description}
              </p>
            </div>
          </div>

          {/* 4 Essential Care Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#FAF9F4] border border-[#D3DFCE] space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#263D32]">
                <Sun className="w-4 h-4 text-[#C8795B]" />
                <span>Photosynthetic Sunlight</span>
              </div>
              <p className="text-xs text-[#796A59] leading-relaxed">{activePlant.sunlight}</p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF9F4] border border-[#D3DFCE] space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#263D32]">
                <Droplets className="w-4 h-4 text-[#355B46]" />
                <span>Irrigation Cadence</span>
              </div>
              <p className="text-xs text-[#796A59] leading-relaxed">{activePlant.watering}</p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF9F4] border border-[#D3DFCE] space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#263D32]">
                <Layers className="w-4 h-4 text-[#796A59]" />
                <span>Substrate & Soil Composition</span>
              </div>
              <p className="text-xs text-[#796A59] leading-relaxed">{activePlant.soil}</p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF9F4] border border-[#D3DFCE] space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#263D32]">
                <Wind className="w-4 h-4 text-[#8FA88A]" />
                <span>Relative Humidity</span>
              </div>
              <p className="text-xs text-[#796A59] leading-relaxed">{activePlant.humidity}</p>
            </div>
          </div>

          {/* Common Pathologies & Recommended Dosages */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-[#D3DFCE] pb-2">
              <h4 className="font-serif font-bold text-base text-[#263D32]">
                Known Pathologies & Treatment Dosages
              </h4>
              <span className="text-[10px] font-mono text-[#796A59] uppercase">
                CLINICAL HORTICULTURE
              </span>
            </div>

            <div className="space-y-3">
              {activePlant.commonDiseases.map((d, i) => (
                <div key={i} className="p-4 rounded-xl border border-[#D3DFCE] bg-[#FAF9F4] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-semibold text-[#263D32]">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#C8795B]" />
                      <span>{d.name}</span>
                    </div>
                    {d.recommendedDosage && (
                      <span className="text-[10px] font-mono bg-[#E7EDE3] text-[#355B46] px-2 py-0.5 rounded-full font-semibold">
                        DOSAGE VERIFIED
                      </span>
                    )}
                  </div>

                  <p className="text-[#796A59]"><strong className="text-[#263D32]">Observed Symptoms:</strong> {d.symptoms}</p>
                  <p className="text-[#355B46]"><strong className="text-[#263D32]">Curative Protocol:</strong> {d.treatment}</p>

                  {d.recommendedDosage && (
                    <div className="mt-2 pt-2 border-t border-[#D3DFCE]/60 flex items-center gap-2 text-[11px] font-mono text-[#796A59]">
                      <Calculator className="w-3.5 h-3.5 text-[#C8795B]" />
                      <span><strong>Prescription Dosage:</strong> {d.recommendedDosage}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Spray Dilution Dosage Calculator */}
          <div className="p-5 rounded-xl bg-[#E7EDE3]/40 border border-[#D3DFCE] space-y-4">
            <div className="flex items-center justify-between border-b border-[#D3DFCE]/60 pb-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#263D32]">
                <Calculator className="w-4 h-4 text-[#355B46]" />
                <span>ORGANIC FOLIAR SPRAY DILUTION CALCULATOR</span>
              </div>
              <span className="text-[10px] font-mono text-[#796A59]">
                TARGET: {REMEDY_DATA[selectedRemedy].target}
              </span>
            </div>

            {/* Remedy Pills */}
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(REMEDY_DATA) as Array<keyof typeof REMEDY_DATA>).map((remKey) => (
                <button
                  key={remKey}
                  type="button"
                  onClick={() => setSelectedRemedy(remKey)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    selectedRemedy === remKey
                      ? 'bg-[#355B46] text-[#FAF9F4]'
                      : 'bg-[#FFFFFF] text-[#263D32] border border-[#D3DFCE] hover:bg-[#FAF9F4]'
                  }`}
                >
                  {REMEDY_DATA[remKey].name}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs pt-1">
              <div>
                <label className="block text-[#796A59] mb-1 font-medium">Batch Volume</label>
                <div className="flex items-center gap-2">
                  {[0.5, 1, 2, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSprayGallons(val)}
                      className={`px-3 py-1 rounded-lg font-mono text-xs transition-colors ${
                        sprayGallons === val
                          ? 'bg-[#355B46] text-[#FAF9F4]'
                          : 'bg-[#FFFFFF] text-[#263D32] border border-[#D3DFCE]'
                      }`}
                    >
                      {val} gal
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#D3DFCE] text-right font-mono min-w-48">
                <span className="text-[10px] text-[#796A59] block uppercase">
                  {REMEDY_DATA[selectedRemedy].name}:
                </span>
                <span className="text-sm font-bold text-[#355B46]">
                  {REMEDY_DATA[selectedRemedy].calc(sprayGallons)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
