import { Plant, ScanResult, JournalEntry, DoctorMessage, CareReminder, ComparisonPair } from '../types';
import { 
  INITIAL_PLANTS, 
  INITIAL_JOURNAL, 
  INITIAL_DOCTOR_MESSAGES, 
  INITIAL_REMINDERS, 
  INITIAL_COMPARISONS 
} from './sampleData';
import { 
  dbGetAll, 
  dbGetById, 
  dbPut, 
  dbDelete, 
  dbClear, 
  STORES, 
  exportDatabaseBackup, 
  importDatabaseBackup 
} from './db';

// --- PLANTS ---
export async function getPlants(): Promise<Plant[]> {
  const plants = await dbGetAll<Plant>(STORES.PLANTS);
  if (plants && plants.length > 0) {
    return plants.sort((a, b) => new Date(b.lastScanned || b.createdAt).getTime() - new Date(a.lastScanned || a.createdAt).getTime());
  }
  return INITIAL_PLANTS;
}

export async function savePlant(plant: Plant): Promise<Plant> {
  return await dbPut<Plant>(STORES.PLANTS, plant);
}

export async function updatePlant(id: string, updates: Partial<Plant>): Promise<Plant | null> {
  const existing = await dbGetById<Plant>(STORES.PLANTS, id);
  if (!existing) return null;
  const updated = { ...existing, ...updates };
  await dbPut<Plant>(STORES.PLANTS, updated);
  return updated;
}

export async function deletePlant(id: string): Promise<void> {
  await dbDelete(STORES.PLANTS, id);
}

// --- SCANS ---
export async function getScans(): Promise<ScanResult[]> {
  const scans = await dbGetAll<ScanResult>(STORES.SCANS);
  return scans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function saveScan(scan: ScanResult): Promise<ScanResult> {
  return await dbPut<ScanResult>(STORES.SCANS, scan);
}

// --- JOURNAL ---
export async function getJournalEntries(): Promise<JournalEntry[]> {
  const entries = await dbGetAll<JournalEntry>(STORES.JOURNAL);
  if (entries && entries.length > 0) {
    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  return INITIAL_JOURNAL;
}

export async function addJournalEntry(entry: JournalEntry): Promise<JournalEntry> {
  return await dbPut<JournalEntry>(STORES.JOURNAL, entry);
}

export async function deleteJournalEntry(id: string): Promise<void> {
  await dbDelete(STORES.JOURNAL, id);
}

// --- REMINDERS ---
export async function getReminders(): Promise<CareReminder[]> {
  const reminders = await dbGetAll<CareReminder>(STORES.REMINDERS);
  if (reminders && reminders.length > 0) {
    return reminders.sort((a, b) => {
      // Put incomplete first, then sort by due date
      if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }
  return INITIAL_REMINDERS;
}

export async function saveReminder(reminder: CareReminder): Promise<CareReminder> {
  return await dbPut<CareReminder>(STORES.REMINDERS, reminder);
}

export async function toggleReminder(id: string): Promise<CareReminder | null> {
  const existing = await dbGetById<CareReminder>(STORES.REMINDERS, id);
  if (!existing) return null;
  const updated = {
    ...existing,
    isCompleted: !existing.isCompleted,
    lastCompletedDate: !existing.isCompleted ? new Date().toISOString() : existing.lastCompletedDate,
  };
  await dbPut<CareReminder>(STORES.REMINDERS, updated);
  return updated;
}

export async function deleteReminder(id: string): Promise<void> {
  await dbDelete(STORES.REMINDERS, id);
}

// --- COMPARISONS ---
export async function getComparisons(): Promise<ComparisonPair[]> {
  const comparisons = await dbGetAll<ComparisonPair>(STORES.COMPARISONS);
  if (comparisons && comparisons.length > 0) {
    return comparisons;
  }
  return INITIAL_COMPARISONS;
}

export async function saveComparison(comp: ComparisonPair): Promise<ComparisonPair> {
  return await dbPut<ComparisonPair>(STORES.COMPARISONS, comp);
}

// --- DOCTOR CHATS ---
export async function getDoctorChat(plantId: string): Promise<DoctorMessage[]> {
  const record = await dbGetById<{ plantId: string; messages: DoctorMessage[] }>(STORES.CHATS, plantId);
  if (record && record.messages && record.messages.length > 0) {
    return record.messages;
  }

  const initial = INITIAL_DOCTOR_MESSAGES[plantId];
  if (initial) return initial;

  return [
    {
      id: 'welcome-' + plantId,
      plantId,
      sender: 'doctor',
      text: `Hello! I am your AI Plant Doctor. Ask me anything about watering, diagnosing foliage irregularities, or optimizing light and soil for this specimen.`,
      timestamp: new Date().toISOString(),
      suggestedActions: [
        'How often should I water this plant?',
        'What are signs of overwatering?',
        'How do I promote fuller leaf growth?'
      ]
    }
  ];
}

export async function addDoctorMessage(plantId: string, message: DoctorMessage): Promise<void> {
  const currentMessages = await getDoctorChat(plantId);
  const updated = [...currentMessages, message];
  await dbPut(STORES.CHATS, { plantId, messages: updated });
}

export async function clearDoctorChat(plantId: string): Promise<void> {
  await dbDelete(STORES.CHATS, plantId);
}

// Reset data to defaults
export async function resetGardenData() {
  await dbClear(STORES.PLANTS);
  await dbClear(STORES.SCANS);
  await dbClear(STORES.JOURNAL);
  await dbClear(STORES.CHATS);
  await dbClear(STORES.REMINDERS);
  await dbClear(STORES.COMPARISONS);

  for (const plant of INITIAL_PLANTS) {
    await dbPut(STORES.PLANTS, plant);
  }
  for (const entry of INITIAL_JOURNAL) {
    await dbPut(STORES.JOURNAL, entry);
  }
  for (const [plantId, messages] of Object.entries(INITIAL_DOCTOR_MESSAGES)) {
    await dbPut(STORES.CHATS, { plantId, messages });
  }
  for (const rem of INITIAL_REMINDERS) {
    await dbPut(STORES.REMINDERS, rem);
  }
  for (const comp of INITIAL_COMPARISONS) {
    await dbPut(STORES.COMPARISONS, comp);
  }
}

export { exportDatabaseBackup, importDatabaseBackup };
