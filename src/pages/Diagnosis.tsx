import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Save, 
  Stethoscope, 
  ScanLine, 
  ArrowLeft, 
  ShieldAlert,
  Bell,
  Check,
  Calendar,
  Layers
} from 'lucide-react';
import { ScanResult, Plant, CareReminder } from '../types';
import { InferenceBadge } from '../components/common/InferenceBadge';
import { HealthScorePill } from '../components/common/HealthScorePill';
import { HealthScoreRadial } from '../components/common/HealthScoreRadial';
import { FoliarHotspotViewer } from '../components/diagnosis/FoliarHotspotViewer';
import { savePlant, addJournalEntry, saveReminder } from '../services/storageService';

interface DiagnosisProps {
  scanResult: ScanResult;
  onAskDoctor: (plant: Plant, scan: ScanResult) => void;
  onScanAnother: () => void;
  onViewGarden: () => void;
}

export const Diagnosis: React.FC<DiagnosisProps> = ({
  scanResult,
  onAskDoctor,
  onScanAnother,
  onViewGarden,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isReminderSet, setIsReminderSet] = useState(false);

  const getSeverityBadge = () => {
    switch (scanResult.severity) {
      case 'None (Healthy)':
        return 'bg-[#E7EDE3] text-[#355B46] border-[#8FA88A]';
      case 'Mild':
        return 'bg-[#F2DFD1] text-[#796A59] border-[#E8CFC1]';
      case 'Moderate Concern':
        return 'bg-[#FBEBE8] text-[#C8795B] border-[#F2C2BA] font-bold';
      case 'Severe':
      default:
        return 'bg-[#FDE8E8] text-[#A63A24] border-[#F8B4B4] font-bold';
    }
  };

  const handleSaveToGarden = async () => {
    const newPlant: Plant = {
      id: scanResult.plantId || 'plant-' + Date.now(),
      userId: 'guest-user',
      name: scanResult.plantName,
      species: scanResult.species,
      commonName: scanResult.plantName,
      imageUrl: scanResult.imageUrl,
      status: scanResult.status,
      healthScore: scanResult.healthScore,
      lastScanned: new Date().toISOString(),
      location: 'Garden Bed / Balcony',
      notes: scanResult.diagnosisTitle + ' - ' + scanResult.possibleDisease,
      createdAt: new Date().toISOString(),
    };

    await savePlant(newPlant);

    // Record initial journal entry
    await addJournalEntry({
      id: 'journal-' + Date.now(),
      plantId: newPlant.id,
      plantName: newPlant.name,
      scanId: scanResult.id,
      date: new Date().toISOString(),
      title: 'Initial AI Foliar Diagnosis: ' + scanResult.diagnosisTitle,
      notes: scanResult.observations.join(' '),
      treatmentApplied: scanResult.recommendedTreatments[0] || 'Care plan initiated.',
      healthScore: scanResult.healthScore,
      imageUrl: scanResult.imageUrl,
      type: 'scan',
    });

    setIsSaved(true);
  };

  const handleSetReminder = async () => {
    const reminder: CareReminder = {
      id: 'rem-' + Date.now(),
      plantId: scanResult.plantId || 'plant-temp',
      plantName: scanResult.plantName,
      taskType: scanResult.severity === 'None (Healthy)' ? 'water' : 'prune',
      title: scanResult.recommendedTreatments[0] || `Foliar care for ${scanResult.plantName}`,
      frequencyDays: scanResult.severity === 'None (Healthy)' ? 7 : 3,
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      isCompleted: false,
      priority: scanResult.severity === 'None (Healthy)' ? 'normal' : 'urgent',
    };

    await saveReminder(reminder);
    setIsReminderSet(true);
  };

  const handleConsultDoctor = () => {
    const plantContext: Plant = {
      id: scanResult.plantId || 'plant-' + Date.now(),
      userId: 'guest-user',
      name: scanResult.plantName,
      species: scanResult.species,
      commonName: scanResult.plantName,
      imageUrl: scanResult.imageUrl,
      status: scanResult.status,
      healthScore: scanResult.healthScore,
      lastScanned: scanResult.createdAt,
      notes: scanResult.diagnosisTitle,
      createdAt: scanResult.createdAt,
    };
    onAskDoctor(plantContext, scanResult);
  };

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D3DFCE]">
        <div>
          <button
            onClick={onScanAnother}
            className="flex items-center gap-1.5 text-xs font-mono text-[#796A59] hover:text-[#263D32] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO SCANNER</span>
          </button>
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#263D32]">
              {scanResult.plantName}
            </h2>
            <span className="text-sm font-serif italic text-[#796A59]">
              ({scanResult.species})
            </span>
          </div>
          <p className="text-xs text-[#796A59] font-mono mt-1">
            RECORD ID: {scanResult.id} · TIMESTAMP: {new Date(scanResult.createdAt).toLocaleTimeString()}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <InferenceBadge source={scanResult.inferenceSource} latencyMs={scanResult.inferenceLatencyMs} />
          <HealthScorePill score={scanResult.healthScore} size="lg" />
        </div>
      </div>

      {/* Main Grid: Interactive Hotspot Viewer & Primary Diagnosis Details */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] border border-[#D3DFCE] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Foliar Hotspot Viewer */}
        <div className="lg:col-span-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#796A59]">
              INTERACTIVE PATHOLOGY VIEW
            </span>
            <span className="text-[10px] font-mono text-[#355B46]">
              CLICK PINS FOR MICROSCOPIC DETAILS
            </span>
          </div>

          <FoliarHotspotViewer
            imageUrl={scanResult.imageUrl}
            plantName={scanResult.plantName}
            hotspots={scanResult.hotspots}
            severity={scanResult.severity}
          />
        </div>

        {/* Right: Primary Diagnosis Details & Radial Gauge */}
        <div className="lg:col-span-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#C8795B] font-semibold">
                PRIMARY PATHOLOGICAL FINDING
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#263D32] mt-1">
                {scanResult.diagnosisTitle}
              </h3>
              <p className="text-xs font-mono text-[#796A59] mt-0.5">
                Etiology: {scanResult.possibleDisease}
              </p>
            </div>

            <HealthScoreRadial score={scanResult.healthScore} size={90} strokeWidth={8} showDetails={false} />
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9F4] border border-[#D3DFCE] space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-[#263D32]">
              <Sparkles className="w-3.5 h-3.5 text-[#355B46]" />
              <span>Diagnostic Summary</span>
            </div>
            <p className="text-[#796A59] leading-relaxed">
              {scanResult.localAnalysisSummary || scanResult.cloudAnalysisSummary || 'Preliminary on-device foliar assessment complete.'}
            </p>
          </div>

          {/* Action Button Strip */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              onClick={handleSaveToGarden}
              disabled={isSaved}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all shadow-xs ${
                isSaved
                  ? 'bg-[#E7EDE3] text-[#355B46] border border-[#8FA88A]'
                  : 'bg-[#355B46] hover:bg-[#2B4C3A] text-[#FAF9F4]'
              }`}
            >
              {isSaved ? <Check className="w-4 h-4 text-[#355B46]" /> : <Save className="w-4 h-4" />}
              <span>{isSaved ? 'Saved to My Garden' : 'Save to Garden'}</span>
            </button>

            <button
              onClick={handleSetReminder}
              disabled={isReminderSet}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-colors border ${
                isReminderSet
                  ? 'bg-[#E7EDE3] text-[#355B46] border-[#8FA88A]'
                  : 'bg-[#FFFFFF] hover:bg-[#FAF9F4] text-[#263D32] border-[#D3DFCE]'
              }`}
            >
              <Bell className="w-4 h-4 text-[#C8795B]" />
              <span>{isReminderSet ? 'Task Scheduled' : 'Schedule Care Task'}</span>
            </button>

            <button
              onClick={handleConsultDoctor}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-[#FFFFFF] hover:bg-[#FAF9F4] text-[#263D32] border border-[#D3DFCE] transition-colors"
            >
              <Stethoscope className="w-4 h-4 text-[#355B46]" />
              <span>Ask Doctor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: What We Observed & Possible Causes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What We Observed */}
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D3DFCE] shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#D3DFCE] pb-3">
            <CheckCircle2 className="w-4 h-4 text-[#355B46]" />
            <h4 className="font-serif font-bold text-base text-[#263D32]">
              What We Observed
            </h4>
          </div>

          <ul className="space-y-2.5 text-xs text-[#263D32]">
            {scanResult.observations.map((obs, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#355B46] mt-1.5 shrink-0" />
                <span className="leading-relaxed">{obs}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Possible Causes */}
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D3DFCE] shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#D3DFCE] pb-3">
            <AlertTriangle className="w-4 h-4 text-[#C8795B]" />
            <h4 className="font-serif font-bold text-base text-[#263D32]">
              Possible Root Causes
            </h4>
          </div>

          <ul className="space-y-2.5 text-xs text-[#263D32]">
            {scanResult.possibleCauses.map((cause, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8795B] mt-1.5 shrink-0" />
                <span className="leading-relaxed">{cause}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Treatment Protocol */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] border border-[#D3DFCE] shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-[#D3DFCE] pb-3">
          <div>
            <h4 className="font-serif font-bold text-lg text-[#263D32]">
              Recommended Curative Protocol
            </h4>
            <p className="text-xs text-[#796A59] mt-0.5">
              Organic, cultural, and pharmacological intervention steps
            </p>
          </div>
          <span className="text-[10px] font-mono text-[#796A59] uppercase tracking-wider">
            STEP-BY-STEP
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {scanResult.recommendedTreatments.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#FAF9F4] border border-[#D3DFCE] flex items-start gap-3.5"
            >
              <span className="w-6 h-6 rounded-lg bg-[#E7EDE3] text-[#355B46] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <p className="text-xs text-[#263D32] leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scientific Uncertainty & Grounding */}
      <div className="p-5 rounded-2xl bg-[#E7EDE3]/40 border border-[#D3DFCE] space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-medium text-[#796A59]">
          <ShieldAlert className="w-4 h-4 text-[#796A59]" />
          <span>SCIENTIFIC LIMITATIONS & UNCERTAINTY</span>
        </div>
        <p className="text-xs text-[#796A59] leading-relaxed">
          {scanResult.uncertaintyNotes ||
            'Diagnosis generated via on-device spectral heuristics and generative pathology. For severe agricultural blight, always verify root collar integrity and soil moisture.'}
        </p>
      </div>
    </div>
  );
};
