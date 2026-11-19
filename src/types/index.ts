export type PlantStatus = 'healthy' | 'attention' | 'critical';

export type InferenceSource = 
  | 'local-nano' 
  | 'local-edge' 
  | 'cloud-gemini' 
  | 'hybrid';

export interface FoliarHotspot {
  id: string;
  x: number; // percentage from left (0 - 100)
  y: number; // percentage from top (0 - 100)
  title: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe' | 'healthy';
}

export interface Plant {
  id: string;
  userId: string;
  name: string;
  species: string;
  commonName: string;
  imageUrl: string;
  status: PlantStatus;
  healthScore: number; // 0 - 100
  lastScanned: string;
  location?: string;
  wateringFrequency?: string;
  notes?: string;
  createdAt: string;
}

export interface ScanResult {
  id: string;
  plantId?: string;
  imageUrl: string;
  plantName: string;
  species: string;
  confidence: number;
  status: PlantStatus;
  healthScore: number;
  diagnosisTitle: string;
  possibleDisease: string;
  severity: 'Mild' | 'Moderate Concern' | 'Severe' | 'None (Healthy)';
  observations: string[];
  possibleCauses: string[];
  recommendedTreatments: string[];
  preventionTips: string[];
  inferenceSource: InferenceSource;
  inferenceLatencyMs: number;
  localAnalysisSummary?: string;
  cloudAnalysisSummary?: string;
  uncertaintyNotes?: string;
  hotspots?: FoliarHotspot[];
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  plantId: string;
  plantName: string;
  scanId?: string;
  date: string;
  title: string;
  notes: string;
  treatmentApplied?: string;
  healthScore: number;
  imageUrl?: string;
  type: 'scan' | 'watering' | 'treatment' | 'pruning' | 'note';
}

export interface CareReminder {
  id: string;
  plantId: string;
  plantName: string;
  taskType: 'water' | 'fertilize' | 'prune' | 'inspect' | 'mist';
  title: string;
  frequencyDays: number;
  dueDate: string; // ISO
  lastCompletedDate?: string;
  isCompleted: boolean;
  priority: 'low' | 'normal' | 'urgent';
}

export interface ComparisonPair {
  id: string;
  plantId: string;
  plantName: string;
  beforeDate: string;
  beforeImageUrl: string;
  beforeScore: number;
  beforeDiagnosis: string;
  afterDate: string;
  afterImageUrl: string;
  afterScore: number;
  afterDiagnosis: string;
  recoverySummary: string;
}

export interface DoctorMessage {
  id: string;
  plantId?: string;
  sender: 'user' | 'doctor';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  attachmentUrl?: string;
}

export interface LibraryPlant {
  id: string;
  name: string;
  scientificName: string;
  category: 'Indoor' | 'Outdoor' | 'Vegetables' | 'Herbs' | 'Fruits' | 'Flowers';
  imageUrl: string;
  difficulty: 'Easy' | 'Moderate' | 'Demanding';
  sunlight: string;
  watering: string;
  soil: string;
  humidity: string;
  commonDiseases: {
    name: string;
    symptoms: string;
    treatment: string;
    prevention?: string;
    recommendedDosage?: string;
  }[];
  description: string;
}

export interface SpecimenSample {
  id: string;
  name: string;
  species: string;
  condition: string;
  severity: 'Mild' | 'Moderate Concern' | 'Severe' | 'None (Healthy)';
  imageUrl: string;
  description: string;
  simulatedLocalScore: number;
  sampleHotspots?: FoliarHotspot[];
}
