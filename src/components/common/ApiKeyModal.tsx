import React, { useState } from 'react';
import { Key, X, Check, Cloud, Cpu, RefreshCw, HardDrive, Eye, EyeOff, Zap, AlertCircle } from 'lucide-react';
import { getGeminiApiKey, isCloudAiAvailable, testGeminiApiKey } from '../../services/aiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSaved }) => {
  const [apiKey, setApiKey] = useState(getGeminiApiKey());
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    setIsTesting(true);
    setTestResult(null);
    const result = await testGeminiApiKey(apiKey);
    setIsTesting(false);
    setTestResult(result);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('verdant_gemini_api_key', apiKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onSaved();
      onClose();
    }, 800);
  };

  const handleClear = () => {
    localStorage.removeItem('verdant_gemini_api_key');
    setApiKey('');
    setTestResult(null);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263D32]/40 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-[#FFFFFF] rounded-2xl border border-[#D3DFCE] shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          aria-label="Close API configuration modal"
          className="absolute top-5 right-5 p-1.5 rounded-lg text-[#796A59] hover:text-[#263D32] hover:bg-[#E7EDE3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#355B46]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#E7EDE3] flex items-center justify-center text-[#355B46]">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-[#263D32]">
              AI Engine & Cloud Settings
            </h3>
            <p className="text-xs text-[#796A59]">
              Configure Google Gemini & local IndexedDB storage
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-2 gap-3 my-5">
          <div className="p-3.5 rounded-xl border border-[#D3DFCE] bg-[#FAF9F4]">
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="w-4 h-4 text-[#355B46]" />
              <span className="text-xs font-mono font-medium text-[#263D32]">ON-DEVICE AI</span>
            </div>
            <p className="text-[11px] text-[#796A59]">
              Local Vision + Nano heuristic engine active & zero-latency
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-[#D3DFCE] bg-[#FAF9F4]">
            <div className="flex items-center gap-2 mb-1">
              <Cloud className="w-4 h-4 text-[#C8795B]" />
              <span className="text-xs font-mono font-medium text-[#263D32]">CLOUD GEMINI</span>
            </div>
            <p className="text-[11px] text-[#796A59]">
              {isCloudAiAvailable() ? (
                <span className="text-[#355B46] font-medium">Connected & Active</span>
              ) : (
                <span className="text-[#C8795B]">Key not configured</span>
              )}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-[#263D32]">
                Google Gemini API Key
              </label>
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="text-[11px] text-[#796A59] hover:text-[#263D32] flex items-center gap-1"
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showKey ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestResult(null);
                }}
                placeholder="AQ.Ab8RN..."
                className="w-full px-3.5 py-2.5 pr-24 rounded-xl border border-[#D3DFCE] bg-[#FAF9F4] text-xs text-[#263D32] placeholder-[#8FA88A] focus:outline-hidden focus:ring-2 focus:ring-[#8FA88A] focus:border-[#355B46] font-mono"
              />
              <button
                type="button"
                onClick={handleTestKey}
                disabled={isTesting || !apiKey.trim()}
                className="absolute right-1.5 top-1.5 px-3 py-1.5 rounded-lg bg-[#E7EDE3] hover:bg-[#D3DFCE] text-[#355B46] text-[11px] font-mono font-medium flex items-center gap-1 disabled:opacity-50 transition-colors"
              >
                {isTesting ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Zap className="w-3 h-3 text-[#C8795B]" />
                )}
                <span>Test</span>
              </button>
            </div>

            {testResult && (
              <div
                className={`mt-2 p-2.5 rounded-lg text-xs font-mono flex items-center gap-2 ${
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

            <p className="text-[11px] text-[#796A59] mt-1.5">
              Stored securely in browser local storage. Powers multimodal leaf pathology and dynamic Plant Doctor responses.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#E7EDE3]/60 border border-[#D3DFCE] text-xs text-[#263D32] flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[#355B46] shrink-0" />
            <div>
              <span className="font-semibold text-[#263D32]">Storage Engine: </span>
              <span className="text-[#355B46]">Persistent Native IndexedDB (Firebase Alternative)</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#D3DFCE]">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-[#796A59] hover:text-[#C8795B] transition-colors"
            >
              Clear Key
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#263D32] hover:bg-[#E7EDE3] rounded-xl transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 bg-[#355B46] hover:bg-[#2B4C3A] text-[#FAF9F4] text-xs font-medium rounded-xl transition-colors shadow-xs"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#E7EDE3]" />
                    Saved!
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    Save Configuration
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
