import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings as SettingsIcon, 
  Cpu, 
  Cloud, 
  Key, 
  Database, 
  RefreshCw, 
  Check, 
  RotateCcw, 
  User, 
  ShieldCheck,
  Palette,
  Download,
  Upload,
  HardDrive,
  Eye,
  EyeOff,
  Zap,
  AlertCircle
} from 'lucide-react';
import { getGeminiApiKey, checkLocalGeminiNano, isCloudAiAvailable, testGeminiApiKey } from '../services/aiService';
import { resetGardenData, exportDatabaseBackup, importDatabaseBackup } from '../services/storageService';

interface SettingsProps {
  onRefreshAll: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onRefreshAll }) => {
  const [apiKey, setApiKey] = useState(getGeminiApiKey());
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [nanoStatus, setNanoStatus] = useState<string>('Checking...');
  const [isSaved, setIsSaved] = useState(false);
  const [isResetDone, setIsResetDone] = useState(false);
  const [backupNotice, setBackupNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkLocalGeminiNano().then((res) => {
      setNanoStatus(res.available ? 'Supported & Ready (Gemini Nano)' : 'Local Vision & Pathology Heuristics Active');
    });
  }, []);

  const handleTestKey = async () => {
    setIsTesting(true);
    setTestResult(null);
    const result = await testGeminiApiKey(apiKey);
    setIsTesting(false);
    setTestResult(result);
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('verdant_gemini_api_key', apiKey.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    onRefreshAll();
  };

  const handleResetData = async () => {
    if (confirm('Reset garden, journal, and doctor chats back to pristine demo state?')) {
      await resetGardenData();
      setIsResetDone(true);
      setTimeout(() => setIsResetDone(false), 2000);
      onRefreshAll();
    }
  };

  const handleExportBackup = async () => {
    const json = await exportDatabaseBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plantguard-garden-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupNotice('Garden archive downloaded successfully!');
    setTimeout(() => setBackupNotice(null), 3000);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target?.result as string;
        const success = await importDatabaseBackup(content);
        if (success) {
          setBackupNotice('Garden archive restored successfully!');
          onRefreshAll();
        } else {
          alert('Failed to parse backup file. Please provide a valid PlantGuard backup JSON.');
        }
        setTimeout(() => setBackupNotice(null), 3000);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#D3DFCE]">
        <span className="text-xs font-mono uppercase tracking-widest text-[#796A59]">
          CONFIGURATION & PREFERENCES
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#263D32] mt-1">
          Settings & Local-First Architecture
        </h2>
        <p className="text-sm text-[#796A59] mt-1.5 font-normal">
          Manage your hybrid inference engine, Google Gemini key, and zero-cloud IndexedDB storage.
        </p>
      </div>

      {/* Section 1: User Profile */}
      <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D3DFCE] shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#E7EDE3] border border-[#8FA88A] flex items-center justify-center text-[#355B46]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#263D32]">Hassan (Botanist Member)</h3>
            <p className="text-xs font-mono text-[#796A59]">
              Session: Standalone Local-First Guest (No Firebase account required)
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: AI Engine Configuration */}
      <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D3DFCE] shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-[#D3DFCE] pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#355B46]" />
            <h3 className="font-serif font-bold text-lg text-[#263D32]">
              Hybrid AI Engine Configuration
            </h3>
          </div>
          <span className="text-xs font-mono text-[#355B46] bg-[#E7EDE3] px-2.5 py-0.5 rounded-full">
            MULTI-TIERED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#FAF9F4] border border-[#D3DFCE] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#796A59] block">
              TIER 1 · ON-DEVICE LOCAL AI
            </span>
            <p className="text-xs font-semibold text-[#263D32]">{nanoStatus}</p>
            <p className="text-[11px] text-[#796A59]">
              Executes in-browser image colorimetry and pathology scoring with zero data egress.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9F4] border border-[#D3DFCE] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#796A59] block">
              TIER 2 · CLOUD MULTIMODAL AI
            </span>
            <p className="text-xs font-semibold text-[#263D32]">
              {isCloudAiAvailable() ? 'Google Gemini 1.5 Flash Connected' : 'Cloud Key Not Configured (Local Mode)'}
            </p>
            <p className="text-[11px] text-[#796A59]">
              Engages multimodal pathology reasoning for intricate leaf disorders.
            </p>
          </div>
        </div>

        {/* Gemini API Key Form */}
        <form onSubmit={handleSaveKey} className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-[#263D32]">
              Google Gemini API Key
            </label>
            <div className="flex items-center gap-3">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#355B46] hover:text-[#2B4C3A] underline font-medium"
              >
                Get Free Key ↗
              </a>
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="text-[11px] text-[#796A59] hover:text-[#263D32] flex items-center gap-1 cursor-pointer"
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showKey ? 'Hide' : 'Show'}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestResult(null);
                }}
                placeholder="Enter Gemini API key..."
                className="w-full px-3.5 py-2.5 pr-20 rounded-xl border border-[#D3DFCE] bg-[#FAF9F4] text-xs font-mono text-[#263D32] focus:outline-hidden focus:ring-1 focus:ring-[#8FA88A]"
              />
              <button
                type="button"
                onClick={handleTestKey}
                disabled={isTesting || !apiKey.trim()}
                className="absolute right-1.5 top-1.5 px-2.5 py-1.5 rounded-lg bg-[#E7EDE3] hover:bg-[#D3DFCE] text-[#355B46] text-[11px] font-mono font-medium flex items-center gap-1 disabled:opacity-50 transition-colors"
              >
                {isTesting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 text-[#C8795B]" />}
                <span>Test</span>
              </button>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#355B46] hover:bg-[#2B4C3A] text-[#FAF9F4] text-xs font-medium rounded-xl transition-colors shadow-xs"
            >
              {isSaved ? <Check className="w-4 h-4 text-[#E7EDE3]" /> : <RefreshCw className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Key Saved' : 'Save Key'}</span>
            </button>
          </div>

          {testResult && (
            <div
              className={`p-2.5 rounded-lg text-xs font-mono flex items-center gap-2 ${
                testResult.success
                  ? 'bg-[#E7EDE3] text-[#355B46] border border-[#8FA88A]'
                  : 'bg-[#FBEBE8] text-[#A63A24] border border-[#F2C2BA]'
              }`}
            >
              {testResult.success ? (
                <Check className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              )}
              <span className="leading-tight">{testResult.message}</span>
            </div>
          )}

          <p className="text-[11px] text-[#796A59]">
            Active Key: <code>{apiKey.slice(0, 10)}...{apiKey.slice(-6)}</code> (Saved securely in your browser and .env).
          </p>
        </form>
      </div>

      {/* Section 3: Native IndexedDB (Firebase Alternative) */}
      <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D3DFCE] shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-[#D3DFCE] pb-3">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-[#355B46]" />
            <h3 className="font-serif font-bold text-lg text-[#263D32]">
              Local-First Database (Firebase Alternative)
            </h3>
          </div>
          <span className="text-xs font-mono text-[#355B46] bg-[#E7EDE3] px-2.5 py-0.5 rounded-full">
            INDEXEDDB ACTIVE
          </span>
        </div>

        <p className="text-xs text-[#796A59] leading-relaxed">
          Your flora records, photos, clinical scans, and doctor chat transcripts are stored locally inside your browser's persistent <strong>IndexedDB engine</strong>. No cloud servers, no account hurdles, and zero quota restrictions.
        </p>

        {backupNotice && (
          <div className="p-3 rounded-xl bg-[#E7EDE3] border border-[#8FA88A] text-xs text-[#355B46] font-mono">
            {backupNotice}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Export JSON */}
          <button
            onClick={handleExportBackup}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-[#D3DFCE] bg-[#FAF9F4] hover:bg-[#E7EDE3] text-xs font-medium text-[#263D32] transition-colors"
          >
            <Download className="w-4 h-4 text-[#355B46]" />
            <span>Export Garden Archive (JSON)</span>
          </button>

          {/* Import JSON */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-[#D3DFCE] bg-[#FAF9F4] hover:bg-[#E7EDE3] text-xs font-medium text-[#263D32] transition-colors"
          >
            <Upload className="w-4 h-4 text-[#C8795B]" />
            <span>Restore From Archive</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportBackup}
            accept=".json"
            className="hidden"
          />
        </div>

        {/* Reset Sanctuary */}
        <div className="p-4 rounded-xl bg-[#FAF9F4] border border-[#D3DFCE] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
          <div>
            <p className="text-xs font-semibold text-[#263D32]">
              Reset Demo Botanical Sanctuary
            </p>
            <p className="text-[11px] text-[#796A59] mt-0.5">
              Restores initial Heritage Tomato, Swiss Cheese Monstera, and sweet basil records.
            </p>
          </div>

          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#FAF9F4] hover:bg-[#F2DFD1] text-[#796A59] hover:text-[#C8795B] border border-[#D3DFCE] text-xs font-medium rounded-xl transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isResetDone ? 'Sanctuary Reset!' : 'Reset Demo Data'}</span>
          </button>
        </div>
      </div>

      {/* Section 4: Brand & Design System Verification */}
      <div className="p-6 rounded-2xl bg-[#E7EDE3]/50 border border-[#D3DFCE] space-y-3 text-xs text-[#263D32]">
        <div className="flex items-center gap-2 font-serif font-bold text-sm">
          <Palette className="w-4 h-4 text-[#355B46]" />
          <span>Verdant Atelier Design Tokens</span>
        </div>
        <p className="text-[11px] text-[#796A59] leading-relaxed">
          Theme: <strong>Verdant Paper</strong> · Palette: Porcelain Paper (#FAF9F4), Botanical Ink (#263D32), Forest Canopy (#355B46), Sage Leaf (#8FA88A), Terracotta Bloom (#C8795B) · Typography: <strong>Herbarium Type</strong> (Fraunces + DM Sans + IBM Plex Mono).
        </p>
      </div>
    </div>
  );
};
