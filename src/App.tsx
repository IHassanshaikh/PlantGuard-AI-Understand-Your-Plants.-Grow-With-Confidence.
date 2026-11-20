import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { ApiKeyModal } from './components/common/ApiKeyModal';

// Pages
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Scanner } from './pages/Scanner';
import { Diagnosis } from './pages/Diagnosis';
import { Garden } from './pages/Garden';
import { PlantDoctor } from './pages/PlantDoctor';
import { Journal } from './pages/Journal';
import { Library } from './pages/Library';
import { Settings } from './pages/Settings';

// Services & Types
import { Plant, ScanResult, JournalEntry, CareReminder } from './types';
import { getPlants, getScans, getJournalEntries, getReminders, savePlant, saveScan, addDoctorMessage, addJournalEntry } from './services/storageService';
import { subscribeToAuth, loginAnonymousUser } from './services/firebase';

export function App() {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [reminders, setReminders] = useState<CareReminder[]>([]);
  const [activeScanResult, setActiveScanResult] = useState<ScanResult | null>(null);
  const [selectedPlantId, setSelectedPlantId] = useState<string | undefined>(undefined);
  const [targetScanPlant, setTargetScanPlant] = useState<Plant | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Initialize and load data
  const refreshData = async () => {
    const [loadedPlants, loadedScans, loadedJournal, loadedReminders] = await Promise.all([
      getPlants(),
      getScans(),
      getJournalEntries(),
      getReminders(),
    ]);
    setPlants(loadedPlants);
    setScans(loadedScans);
    setJournalEntries(loadedJournal);
    setReminders(loadedReminders);
    if (!selectedPlantId && loadedPlants.length > 0) {
      setSelectedPlantId(loadedPlants[0].id);
    }
  };

  useEffect(() => {
    loginAnonymousUser().catch(() => {});
    subscribeToAuth(() => {});
    refreshData();
  }, []);

  const handleEnterApp = (targetTab: NavTab = 'overview') => {
    setView('app');
    setCurrentTab(targetTab);
    setActiveScanResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Called when a scan finishes on Scanner.tsx
  const handleScanComplete = async (result: ScanResult) => {
    const plantId = result.plantId || 'plant-' + Date.now();
    const existing = plants.find((p) => p.id === plantId);

    const plantToSave: Plant = existing
      ? {
          ...existing,
          status: result.status,
          healthScore: result.healthScore,
          lastScanned: result.createdAt,
          notes: `${result.diagnosisTitle} (${result.possibleDisease})`,
          imageUrl: result.imageUrl || existing.imageUrl,
        }
      : {
          id: plantId,
          userId: 'guest-user',
          name: result.plantName || 'Scanned Specimen',
          species: result.species || 'Species Unspecified',
          commonName: result.plantName || 'Scanned Specimen',
          imageUrl: result.imageUrl,
          status: result.status,
          healthScore: result.healthScore,
          lastScanned: result.createdAt,
          location: 'My Garden',
          notes: `${result.diagnosisTitle} (${result.possibleDisease})`,
          createdAt: result.createdAt,
        };

    result.plantId = plantId;

    // Persist plant & scan to IndexedDB
    await savePlant(plantToSave);
    await saveScan(result);

    // Auto-seed or update doctor consultation tailored to this scanned plant
    await addDoctorMessage(plantId, {
      id: 'doc-scan-' + Date.now(),
      plantId: plantId,
      sender: 'doctor',
      text: `Hello! I have analyzed the latest scan for your ${plantToSave.name} (${plantToSave.species}).\n\nFinding: ${result.diagnosisTitle} (${result.possibleDisease}) with an estimated health rating of ${result.healthScore}/100.\n\nKey observations: ${result.observations.slice(0, 2).join(' ')}\n\nWhat would you like to know about managing or caring for this specimen?`,
      timestamp: new Date().toISOString(),
      suggestedActions: [
        `How do I treat ${result.possibleDisease}?`,
        `What watering cadence is best for ${plantToSave.name}?`,
        `Will this spread to nearby plants?`,
        `Can I prune the affected leaves safely?`
      ]
    });

    // Update state so this uploaded plant is immediately selected
    await refreshData();
    setSelectedPlantId(plantId);
    setTargetScanPlant(null);
    setActiveScanResult(result);
  };

  const handleAskDoctorFromDiagnosis = async (plant: Plant, scan: ScanResult) => {
    setSelectedPlantId(plant.id);
    setActiveScanResult(null);
    setCurrentTab('doctor');
  };

  const handleSelectPlant = (plant: Plant) => {
    setSelectedPlantId(plant.id);
    setCurrentTab('doctor');
  };

  const handleScanSpecificPlant = (plant?: Plant) => {
    setTargetScanPlant(plant || null);
    setActiveScanResult(null);
    setCurrentTab('scanner');
  };

  const attentionCount = plants.filter((p) => p.status !== 'healthy').length;
  const pendingRemindersCount = reminders.filter((r) => !r.isCompleted).length;

  // View: Landing Page
  if (view === 'landing') {
    return <Landing onEnterApp={handleEnterApp} />;
  }

  // View: Main Application with Verdant Atelier Layout
  return (
    <div className="min-h-screen bg-[#FAF9F4] text-[#263D32] flex selection:bg-[#E7EDE3]">
      {/* Fixed Left Sidebar on Desktop */}
      <Sidebar
        currentTab={currentTab}
        pendingRemindersCount={pendingRemindersCount}
        onSelectTab={(tab) => {
          setActiveScanResult(null);
          setCurrentTab(tab);
        }}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Header
          currentTab={currentTab}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onGoHome={() => setView('landing')}
          onNavigate={(tab) => {
            setActiveScanResult(null);
            setCurrentTab(tab);
          }}
          totalPlants={plants.length}
          attentionCount={attentionCount}
          pendingRemindersCount={pendingRemindersCount}
        />

        <main className="flex-1 overflow-y-auto">
          {/* If there is an active diagnosis report from the scanner */}
          {activeScanResult ? (
            <Diagnosis
              scanResult={activeScanResult}
              onAskDoctor={handleAskDoctorFromDiagnosis}
              onScanAnother={() => setActiveScanResult(null)}
              onViewGarden={() => {
                setActiveScanResult(null);
                setCurrentTab('garden');
              }}
            />
          ) : (
            <>
              {currentTab === 'overview' && (
                <Dashboard
                  plants={plants}
                  recentScans={scans}
                  reminders={reminders}
                  onRefreshReminders={refreshData}
                  onNavigate={(tab) => setCurrentTab(tab)}
                  onSelectPlant={handleSelectPlant}
                />
              )}

              {currentTab === 'scanner' && (
                <Scanner
                  onScanComplete={handleScanComplete}
                  targetPlant={targetScanPlant}
                  onOpenSettings={() => setIsSettingsModalOpen(true)}
                />
              )}

              {currentTab === 'garden' && (
                <Garden
                  plants={plants}
                  onSelectPlant={handleSelectPlant}
                  onScanPlant={handleScanSpecificPlant}
                  onRefresh={refreshData}
                />
              )}

              {currentTab === 'doctor' && (
                <PlantDoctor
                  plants={plants}
                  selectedPlantId={selectedPlantId}
                  onSelectPlantId={setSelectedPlantId}
                  onScanPlant={handleScanSpecificPlant}
                />
              )}

              {currentTab === 'journal' && (
                <Journal
                  entries={journalEntries}
                  plants={plants}
                  onRefresh={refreshData}
                />
              )}

              {currentTab === 'library' && <Library />}

              {currentTab === 'settings' && (
                <Settings onRefreshAll={refreshData} />
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setActiveScanResult(null);
          setCurrentTab(tab);
        }}
      />

      {/* Floating API & Cloud Settings Modal */}
      <ApiKeyModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSaved={refreshData}
      />
    </div>
  );
}

export default App;
