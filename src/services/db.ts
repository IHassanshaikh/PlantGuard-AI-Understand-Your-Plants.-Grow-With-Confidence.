import { Plant, ScanResult, JournalEntry, DoctorMessage, CareReminder, ComparisonPair } from '../types';
import { 
  INITIAL_PLANTS, 
  INITIAL_JOURNAL, 
  INITIAL_DOCTOR_MESSAGES, 
  INITIAL_REMINDERS, 
  INITIAL_COMPARISONS 
} from './sampleData';

const DB_NAME = 'PlantGuardDB';
const DB_VERSION = 2;

export const STORES = {
  PLANTS: 'plants',
  SCANS: 'scans',
  JOURNAL: 'journal',
  CHATS: 'chats',
  SETTINGS: 'settings',
  REMINDERS: 'reminders',
  COMPARISONS: 'comparisons',
} as const;

let dbPromise: Promise<IDBDatabase> | null = null;

export function openDatabase(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      console.warn('[IndexedDB] Not available, falling back to memory/local.');
      return reject(new Error('IndexedDB not supported'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORES.PLANTS)) {
        db.createObjectStore(STORES.PLANTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.SCANS)) {
        db.createObjectStore(STORES.SCANS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.JOURNAL)) {
        db.createObjectStore(STORES.JOURNAL, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.CHATS)) {
        db.createObjectStore(STORES.CHATS, { keyPath: 'plantId' });
      }
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(STORES.REMINDERS)) {
        db.createObjectStore(STORES.REMINDERS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.COMPARISONS)) {
        db.createObjectStore(STORES.COMPARISONS, { keyPath: 'id' });
      }
    };

    request.onsuccess = async () => {
      const db = request.result;
      await seedInitialDataIfEmpty(db);
      resolve(db);
    };

    request.onerror = () => {
      console.error('[IndexedDB] Error opening database:', request.error);
      reject(request.error);
    };
  });

  return dbPromise;
}

async function seedInitialDataIfEmpty(db: IDBDatabase) {
  try {
    const tx = db.transaction([STORES.PLANTS, STORES.JOURNAL, STORES.CHATS, STORES.REMINDERS, STORES.COMPARISONS], 'readonly');
    const plantStore = tx.objectStore(STORES.PLANTS);
    const countReq = plantStore.count();

    countReq.onsuccess = () => {
      if (countReq.result === 0) {
        console.log('[IndexedDB] Seeding default botanical sanctuary flora & journal...');
        const writeTx = db.transaction(
          [STORES.PLANTS, STORES.JOURNAL, STORES.CHATS, STORES.REMINDERS, STORES.COMPARISONS],
          'readwrite'
        );
        
        // Seed plants
        const pStore = writeTx.objectStore(STORES.PLANTS);
        INITIAL_PLANTS.forEach((p) => pStore.put(p));

        // Seed journal
        const jStore = writeTx.objectStore(STORES.JOURNAL);
        INITIAL_JOURNAL.forEach((j) => jStore.put(j));

        // Seed doctor chats
        const cStore = writeTx.objectStore(STORES.CHATS);
        Object.entries(INITIAL_DOCTOR_MESSAGES).forEach(([plantId, messages]) => {
          cStore.put({ plantId, messages });
        });

        // Seed reminders
        const rStore = writeTx.objectStore(STORES.REMINDERS);
        INITIAL_REMINDERS.forEach((r) => rStore.put(r));

        // Seed comparisons
        const compStore = writeTx.objectStore(STORES.COMPARISONS);
        INITIAL_COMPARISONS.forEach((c) => compStore.put(c));
      }
    };
  } catch (err) {
    console.warn('[IndexedDB] Seeding error:', err);
  }
}

// Generic CRUD helpers
export async function dbGetAll<T>(storeName: string): Promise<T[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch (e) {
    const fallback = localStorage.getItem(`pg_${storeName}`);
    return fallback ? JSON.parse(fallback) : [];
  }
}

export async function dbGetById<T>(storeName: string, id: string): Promise<T | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}

export async function dbPut<T>(storeName: string, item: T): Promise<T> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);
      req.onsuccess = () => resolve(item);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    return item;
  }
}

export async function dbDelete(storeName: string, id: string): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('dbDelete error:', e);
  }
}

export async function dbClear(storeName: string): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('dbClear error:', e);
  }
}

// 1-Click Complete Database Export / Import
export async function exportDatabaseBackup(): Promise<string> {
  const plants = await dbGetAll<Plant>(STORES.PLANTS);
  const scans = await dbGetAll<ScanResult>(STORES.SCANS);
  const journal = await dbGetAll<JournalEntry>(STORES.JOURNAL);
  const chats = await dbGetAll<{ plantId: string; messages: DoctorMessage[] }>(STORES.CHATS);
  const reminders = await dbGetAll<CareReminder>(STORES.REMINDERS);
  const comparisons = await dbGetAll<ComparisonPair>(STORES.COMPARISONS);

  const backup = {
    app: 'PlantGuard AI',
    version: '2.0.0',
    exportedAt: new Date().toISOString(),
    data: {
      plants,
      scans,
      journal,
      chats,
      reminders,
      comparisons,
    },
  };

  return JSON.stringify(backup, null, 2);
}

export async function importDatabaseBackup(jsonString: string): Promise<boolean> {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed.data) return false;

    const db = await openDatabase();
    const storeNames = [
      STORES.PLANTS, 
      STORES.SCANS, 
      STORES.JOURNAL, 
      STORES.CHATS, 
      STORES.REMINDERS, 
      STORES.COMPARISONS
    ];
    const tx = db.transaction(storeNames, 'readwrite');

    if (parsed.data.plants) {
      const pStore = tx.objectStore(STORES.PLANTS);
      pStore.clear();
      parsed.data.plants.forEach((p: Plant) => pStore.put(p));
    }
    if (parsed.data.scans) {
      const sStore = tx.objectStore(STORES.SCANS);
      sStore.clear();
      parsed.data.scans.forEach((s: ScanResult) => sStore.put(s));
    }
    if (parsed.data.journal) {
      const jStore = tx.objectStore(STORES.JOURNAL);
      jStore.clear();
      parsed.data.journal.forEach((j: JournalEntry) => jStore.put(j));
    }
    if (parsed.data.chats) {
      const cStore = tx.objectStore(STORES.CHATS);
      cStore.clear();
      parsed.data.chats.forEach((c: { plantId: string; messages: DoctorMessage[] }) => cStore.put(c));
    }
    if (parsed.data.reminders) {
      const rStore = tx.objectStore(STORES.REMINDERS);
      rStore.clear();
      parsed.data.reminders.forEach((r: CareReminder) => rStore.put(r));
    }
    if (parsed.data.comparisons) {
      const compStore = tx.objectStore(STORES.COMPARISONS);
      compStore.clear();
      parsed.data.comparisons.forEach((c: ComparisonPair) => compStore.put(c));
    }

    return true;
  } catch (err) {
    console.error('Import database backup failed:', err);
    return false;
  }
}
