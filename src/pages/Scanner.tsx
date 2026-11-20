import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  X, 
  Cpu, 
  Cloud, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw,
  Sliders,
  Image as ImageIcon,
  Zap,
  Info,
  Key,
  ExternalLink,
  Check
} from 'lucide-react';
import { SAMPLE_SPECIMENS } from '../services/sampleData';
import { SpecimenSample, ScanResult, Plant } from '../types';
import { executeHybridScan, isCloudAiAvailable, hasUserApiKey, checkLocalGeminiNano, testGeminiApiKey } from '../services/aiService';

interface ScannerProps {
  onScanComplete: (result: ScanResult) => void;
  targetPlant?: Plant | null;
  onOpenSettings?: () => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onScanComplete, targetPlant, onOpenSettings }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [plantName, setPlantName] = useState(targetPlant?.name || '');
  const [species, setSpecies] = useState(targetPlant?.species || '');
  const [symptoms, setSymptoms] = useState('');
  const [preferCloud, setPreferCloud] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [currentStage, setCurrentStage] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [nanoAvailable, setNanoAvailable] = useState<boolean>(false);
  const [userHasKey, setUserHasKey] = useState<boolean>(() => hasUserApiKey());
  const [showApiKeyPromptModal, setShowApiKeyPromptModal] = useState<boolean>(false);
  const [promptApiKey, setPromptApiKey] = useState<string>('');
  const [showPromptKey, setShowPromptKey] = useState<boolean>(false);
  const [isTestingKey, setIsTestingKey] = useState<boolean>(false);
  const [keyTestError, setKeyTestError] = useState<string | null>(null);
  const [keySavedSuccess, setKeySavedSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (targetPlant) {
      setPlantName(targetPlant.name);
      setSpecies(targetPlant.species);
      if (targetPlant.imageUrl) {
        setSelectedImage(targetPlant.imageUrl);
      }
      if (targetPlant.notes) {
        setSymptoms(targetPlant.notes);
      }
    }
  }, [targetPlant]);

  // Check for local Gemini Nano capabilities on mount
  useEffect(() => {
    checkLocalGeminiNano().then((res) => {
      setNanoAvailable(res.available);
    });
  }, []);

  // Cleanup camera stream
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Camera start
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Camera access unavailable. Please upload a photo or pick a sample specimen.');
    }
  };

  const captureCameraPhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setSelectedImage(dataUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSpecimen = (sample: SpecimenSample) => {
    setSelectedImage(sample.imageUrl);
    setPlantName(sample.name);
    setSpecies(sample.species);
    setSymptoms(sample.description);
    if (isCameraActive) stopCamera();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveKeyAndScan = async () => {
    const trimmed = promptApiKey.trim();
    if (!trimmed || trimmed.length < 10) {
      setKeyTestError('Please paste a valid Gemini API key (starts with AIzaSy or AQ).');
      return;
    }
    setIsTestingKey(true);
    setKeyTestError(null);
    const test = await testGeminiApiKey(trimmed);
    setIsTestingKey(false);
    if (!test.success) {
      setKeyTestError(test.message || 'Key validation failed. Please check your key.');
      return;
    }
    localStorage.setItem('verdant_gemini_api_key', trimmed);
    setUserHasKey(true);
    setKeySavedSuccess(true);
    setTimeout(() => {
      setShowApiKeyPromptModal(false);
      setKeySavedSuccess(false);
      if (selectedImage) {
        runScan(false, true);
      }
    }, 600);
  };

  const handleProceedOffline = () => {
    setShowApiKeyPromptModal(false);
    runScan(true, true);
  };

  const runScan = async (forceOffline = false, keyBypass = false) => {
    if (!selectedImage) return;

    // If user has not configured their own key and hasn't explicitly chosen offline mode:
    if (!hasUserApiKey() && !forceOffline && !keyBypass) {
      setShowApiKeyPromptModal(true);
      return;
    }

    setIsScanning(true);

    try {
      const result = await executeHybridScan(
        selectedImage,
        plantName || 'Botanical Specimen',
        species || 'Species Unspecified',
        symptoms,
        forceOffline ? false : preferCloud,
        (stage) => setCurrentStage(stage)
      );

      if (targetPlant) {
        result.plantId = targetPlant.id;
      }

      setIsScanning(false);
      onScanComplete(result);
    } catch (err) {
      console.error('Scan execution error:', err);
      setIsScanning(false);
    }
  };

  const cloudConfigured = isCloudAiAvailable();

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#D3DFCE]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7EDE3] border border-[#8FA88A] text-xs font-mono text-[#355B46] mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C8795B]" />
          <span>HYBRID INFERENCE PIPELINE</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#263D32]">
          Let's take a closer look.
        </h2>
        <p className="text-sm text-[#796A59] mt-1.5 max-w-xl">
          Capture high-resolution foliar photography to detect early disease markers, cellular chlorosis, and nutritional deficits before they spread.
        </p>
      </div>

      {/* Required API Key & Steps Banner (visible when user hasn't configured key) */}
      {!userHasKey && (
        <div className="p-5 rounded-2xl bg-[#FBF6ED] border-2 border-[#E8CFC1] shadow-xs space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F6EDE4] text-[#C8795B] flex items-center justify-center shrink-0 border border-[#E8CFC1]">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#263D32]">
                    Free Gemini API Key Required for Live AI Plant Doctor
                  </h3>
                  <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E7EDE3] text-[#355B46] border border-[#8FA88A] font-semibold">
                    100% FREE
                  </span>
                </div>
                <p className="text-xs text-[#796A59] mt-0.5">
                  Follow these 3 quick steps to unlock real-time multimodal leaf disease diagnosis & treatment plans.
                </p>
              </div>
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#355B46] hover:bg-[#2B4C3A] text-[#FAF9F4] text-xs font-medium transition-colors shrink-0 self-start sm:self-center shadow-xs"
            >
              <span>Get Free Key (Google AI Studio)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 3 Step Visual Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D3DFCE] space-y-1">
              <span className="font-mono text-[10px] font-bold text-[#C8795B] px-1.5 py-0.5 rounded bg-[#FBF6ED] border border-[#E8CFC1] inline-block">
                STEP 1
              </span>
              <p className="font-medium text-xs text-[#263D32]">Open Google AI Studio</p>
              <p className="text-[11px] text-[#796A59]">
                Sign in with any Google account and click <strong>"Create API Key"</strong> (no credit card needed).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D3DFCE] space-y-1">
              <span className="font-mono text-[10px] font-bold text-[#C8795B] px-1.5 py-0.5 rounded bg-[#FBF6ED] border border-[#E8CFC1] inline-block">
                STEP 2
              </span>
              <p className="font-medium text-xs text-[#263D32]">Paste Your Key Below</p>
              <p className="text-[11px] text-[#796A59]">
                Paste your key into the quick setup bar below. It saves securely in your browser's private storage.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D3DFCE] space-y-1">
              <span className="font-mono text-[10px] font-bold text-[#C8795B] px-1.5 py-0.5 rounded bg-[#FBF6ED] border border-[#E8CFC1] inline-block">
                STEP 3
              </span>
              <p className="font-medium text-xs text-[#263D32]">Scan Any Specimen</p>
              <p className="text-[11px] text-[#796A59]">
                Instant foliar pathology analysis, hotspot lesion coordinates, and custom organic recipes.
              </p>
            </div>
          </div>

          {/* Inline Quick Paste Bar */}
          <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="password"
              value={promptApiKey}
              onChange={(e) => {
                setPromptApiKey(e.target.value);
                setKeyTestError(null);
              }}
              placeholder="Paste your Gemini API key here (starts with AIzaSy or AQ)..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#D3DFCE] bg-[#FFFFFF] text-xs font-mono text-[#263D32] focus:outline-hidden focus:ring-1 focus:ring-[#8FA88A]"
            />
            <button
              type="button"
              onClick={handleSaveKeyAndScan}
              disabled={isTestingKey || !promptApiKey.trim()}
              className="px-5 py-2.5 bg-[#355B46] hover:bg-[#2B4C3A] disabled:opacity-50 text-[#FAF9F4] text-xs font-medium rounded-xl transition-all shadow-xs shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isTestingKey ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Validating Key...</span>
                </>
              ) : keySavedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#8FA88A]" />
                  <span>Key Activated!</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save & Enable Live AI</span>
                </>
              )}
            </button>
          </div>

          {keyTestError && (
            <p className="text-xs text-[#C8795B] flex items-center gap-1.5 bg-[#FFFFFF] p-2.5 rounded-xl border border-[#F2C2BA]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{keyTestError}</span>
            </p>
          )}
        </div>
      )}

      {/* 1-Click Curated Specimens Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase tracking-widest text-[#796A59] font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C8795B]" />
            <span>TEST SPECIMEN SAMPLES (ONE-CLICK EVALUATION)</span>
          </label>
          <span className="text-[11px] text-[#796A59]">Select to test pipeline instantly</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {SAMPLE_SPECIMENS.map((specimen) => (
            <div
              key={specimen.id}
              onClick={() => handleSelectSpecimen(specimen)}
              className="cursor-pointer p-2.5 rounded-xl bg-[#FFFFFF] border border-[#D3DFCE] hover:border-[#355B46] hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div className="aspect-square rounded-lg overflow-hidden border border-[#D3DFCE] mb-2 relative">
                <img
                  src={specimen.imageUrl}
                  alt={specimen.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1 rounded bg-[#263D32]/80 text-[#FAF9F4]">
                  {specimen.severity === 'None (Healthy)' ? 'HEALTHY' : 'DISEASED'}
                </span>
              </div>
              <div>
                <p className="font-serif font-bold text-xs text-[#263D32] leading-tight line-clamp-1">
                  {specimen.name}
                </p>
                <p className="text-[10px] text-[#796A59] italic mt-0.5 line-clamp-1">
                  {specimen.condition}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Upload / Camera Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Image Input Box */}
        <div className="lg:col-span-7 space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all bg-[#FAF9F4] ${
              selectedImage
                ? 'border-[#8FA88A] bg-[#FFFFFF]'
                : 'border-[#8FA88A]/60 hover:border-[#355B46] hover:bg-[#E7EDE3]/40'
            }`}
          >
            {/* Live Camera View */}
            {isCameraActive ? (
              <div className="relative rounded-xl overflow-hidden aspect-4/3 bg-black flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                  <button
                    onClick={captureCameraPhoto}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#FAF9F4] text-[#263D32] text-xs font-mono font-bold rounded-xl shadow-lg hover:bg-[#E7EDE3] active:scale-95 transition-all"
                  >
                    <Camera className="w-4 h-4 text-[#355B46]" />
                    <span>CAPTURE LEAF</span>
                  </button>
                  <button
                    onClick={stopCamera}
                    className="p-2.5 bg-[#263D32]/70 text-[#FAF9F4] rounded-xl hover:bg-[#263D32]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : selectedImage ? (
              /* Selected Image Preview */
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden aspect-4/3 border border-[#D3DFCE] mx-auto shadow-xs max-h-80">
                  <img
                    src={selectedImage}
                    alt="Selected leaf"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-[#263D32]/70 text-[#FAF9F4] hover:bg-[#263D32] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-medium text-[#796A59] hover:text-[#263D32] transition-colors"
                  >
                    Change Photograph
                  </button>
                </div>
              </div>
            ) : (
              /* Dropzone Placeholder */
              <div className="py-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#E7EDE3] text-[#355B46] flex items-center justify-center mx-auto shadow-2xs">
                  <Camera className="w-8 h-8 text-[#355B46]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-[#263D32]">
                    Drop foliar photograph here
                  </h4>
                  <p className="text-xs text-[#796A59] mt-1 max-w-sm mx-auto">
                    Take a clear close-up of affected leaf surfaces, avoiding blurry reflections or dark shadows.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={startCamera}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#FFFFFF] hover:bg-[#FAF9F4] border border-[#D3DFCE] text-xs font-medium text-[#263D32] rounded-xl transition-colors shadow-2xs"
                  >
                    <Camera className="w-4 h-4 text-[#355B46]" />
                    <span>Live Camera</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#355B46] hover:bg-[#2B4C3A] text-[#FAF9F4] text-xs font-medium rounded-xl transition-colors shadow-xs"
                  >
                    <Upload className="w-4 h-4 text-[#8FA88A]" />
                    <span>Upload Image</span>
                  </button>
                </div>
              </div>
            )}

            {cameraError && (
              <p className="text-xs text-[#C8795B] mt-3 flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {cameraError}
              </p>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Engine Routing Info Box */}
          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D3DFCE] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#796A59]">
                INFERENCE DISPATCH HIERARCHY
              </span>
              <span className="font-mono text-[10px] text-[#355B46]">
                {nanoAvailable ? 'NANO DETECTED' : 'EDGE VISION + LOCAL HEURISTICS'}
              </span>
            </div>
            <p className="text-[#796A59] text-[11px] leading-relaxed">
              Step 1 extracts physical foliar chlorophyll, necrosis, and chlorosis on-device. Step 2 generates structured pathology. If symptoms indicate advanced systemic concern, Cloud Gemini verifies etiology.
            </p>
          </div>
        </div>

        {/* Right: Botanical Context Inputs */}
        <div className="lg:col-span-5 space-y-5 bg-[#FFFFFF] p-6 rounded-2xl border border-[#D3DFCE] shadow-xs">
          <div className="border-b border-[#D3DFCE] pb-3 flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-[#263D32]">
              Specimen Parameters
            </h3>
            {targetPlant && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E7EDE3] text-[#355B46] border border-[#8FA88A]">
                RE-SCANNING REGISTERED SPECIMEN
              </span>
            )}
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-[#263D32] mb-1.5">
                Common Plant Name (Optional)
              </label>
              <input
                type="text"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                placeholder="e.g. San Marzano Tomato, Golden Pothos"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D3DFCE] bg-[#FAF9F4] text-xs text-[#263D32] placeholder-[#796A59]/60 focus:outline-hidden focus:ring-1 focus:ring-[#8FA88A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#263D32] mb-1.5">
                Botanical Species (Optional)
              </label>
              <input
                type="text"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                placeholder="e.g. Solanum lycopersicum"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D3DFCE] bg-[#FAF9F4] text-xs text-[#263D32] placeholder-[#796A59]/60 italic focus:outline-hidden focus:ring-1 focus:ring-[#8FA88A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#263D32] mb-1.5">
                Observable Symptoms or Gardener Notes
              </label>
              <textarea
                rows={3}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. Yellowing margins on lower foliage after 3 days of high humidity. White fuzzy patches underneath."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D3DFCE] bg-[#FAF9F4] text-xs text-[#263D32] placeholder-[#796A59]/60 focus:outline-hidden focus:ring-1 focus:ring-[#8FA88A]"
              />
            </div>

            {/* Cloud Deep Analysis Switch */}
            <div className="pt-2 border-t border-[#D3DFCE]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#263D32] flex items-center gap-1.5 flex-wrap">
                    <Cloud className="w-3.5 h-3.5 text-[#C8795B]" />
                    <span>Engage Cloud Gemini Flash</span>
                    {userHasKey ? (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#E7EDE3] text-[#355B46] border border-[#8FA88A]">
                        CONNECTED
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowApiKeyPromptModal(true)}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F2DFD1] text-[#C8795B] border border-[#E8CFC1] hover:bg-[#E8CFC1] cursor-pointer font-bold inline-flex items-center gap-1"
                      >
                        <Key className="w-3 h-3" />
                        <span>FREE KEY REQUIRED</span>
                      </button>
                    )}
                  </span>
                  <p className="text-[10px] text-[#796A59] mt-0.5">
                    {userHasKey
                      ? 'Live Google Gemini multimodal intelligence actively connected'
                      : 'Free Gemini API key required for live AI pathology. Click to set up in 30 seconds.'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferCloud && userHasKey}
                  disabled={!userHasKey}
                  onChange={(e) => setPreferCloud(e.target.checked)}
                  className="rounded-sm text-[#355B46] focus:ring-[#8FA88A] w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Scanning Progress or Scan Trigger */}
          {isScanning ? (
            <div className="p-4 rounded-xl bg-[#E7EDE3] border border-[#8FA88A] space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#355B46]">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>PROCESSING BOTANICAL INFERENCE...</span>
              </div>
              <p className="text-xs text-[#263D32] font-mono leading-relaxed">
                {currentStage}
              </p>
              <div className="w-full bg-[#FAF9F4] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#355B46] h-1.5 rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          ) : (
            <button
              onClick={() => runScan(false, false)}
              disabled={!selectedImage}
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-medium text-xs transition-all shadow-sm ${
                selectedImage
                  ? 'bg-[#355B46] hover:bg-[#2B4C3A] text-[#FAF9F4] cursor-pointer'
                  : 'bg-[#D3DFCE] text-[#796A59] cursor-not-allowed opacity-70'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#8FA88A]" />
              <span>RUN HYBRID AI DIAGNOSIS</span>
            </button>
          )}
        </div>
      </div>

      {/* Required API Key Modal */}
      {showApiKeyPromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263D32]/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-[#FFFFFF] rounded-2xl border border-[#D3DFCE] shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowApiKeyPromptModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-[#796A59] hover:text-[#263D32] hover:bg-[#E7EDE3] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#F6EDE4] text-[#C8795B] flex items-center justify-center border border-[#E8CFC1]">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E7EDE3] text-[#355B46] border border-[#8FA88A]">
                  FREE SETUP (30 SECONDS)
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#263D32] mt-1">
                  Gemini API Key Required
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#796A59] leading-relaxed mb-5">
              Live multimodal foliage pathology, early disease diagnosis, and clinical treatment generation require a free Google Gemini API key. Follow these 3 simple steps to activate live AI:
            </p>

            {/* Step-by-Step Instructions */}
            <div className="space-y-3 mb-6">
              <div className="p-3.5 rounded-xl bg-[#FAF9F4] border border-[#D3DFCE] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#355B46] text-[#FAF9F4] text-xs font-mono font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <div className="text-xs">
                  <p className="font-semibold text-[#263D32]">Get your free Google Gemini API Key</p>
                  <p className="text-[#796A59] mt-0.5 text-[11px]">Free tier, no credit card required, ready in under 30 seconds.</p>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg bg-[#E7EDE3] hover:bg-[#D3DFCE] text-[#355B46] font-mono text-[11px] font-medium transition-colors"
                  >
                    <span>Open Google AI Studio</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF9F4] border border-[#D3DFCE] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#355B46] text-[#FAF9F4] text-xs font-mono font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <div className="text-xs flex-1">
                  <p className="font-semibold text-[#263D32]">Paste your Gemini API Key here</p>
                  <p className="text-[#796A59] mt-0.5 text-[11px]">Saved privately in your browser's IndexedDB/localStorage.</p>
                  <div className="mt-2 relative">
                    <input
                      type={showPromptKey ? 'text' : 'password'}
                      value={promptApiKey}
                      onChange={(e) => {
                        setPromptApiKey(e.target.value);
                        setKeyTestError(null);
                      }}
                      placeholder="Paste your key (starts with AIzaSy or AQ...)"
                      className="w-full px-3 py-2 pr-16 rounded-lg border border-[#D3DFCE] bg-[#FFFFFF] text-xs font-mono text-[#263D32] focus:outline-hidden focus:ring-1 focus:ring-[#8FA88A]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPromptKey(!showPromptKey)}
                      className="absolute right-2 top-2 text-[10px] text-[#796A59] hover:text-[#263D32] font-mono cursor-pointer"
                    >
                      {showPromptKey ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                  {keyTestError && (
                    <p className="text-[11px] text-[#C8795B] mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{keyTestError}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF9F4] border border-[#D3DFCE] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#355B46] text-[#FAF9F4] text-xs font-mono font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <div className="text-xs">
                  <p className="font-semibold text-[#263D32]">Scan and verify botanical health</p>
                  <p className="text-[#796A59] mt-0.5 text-[11px]">Real-time multimodal diagnosis with hotspot lesion coordinates.</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleSaveKeyAndScan}
                disabled={isTestingKey || !promptApiKey.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#355B46] hover:bg-[#2B4C3A] disabled:opacity-50 text-[#FAF9F4] text-xs font-medium transition-all shadow-sm cursor-pointer"
              >
                {isTestingKey ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Validating Key with Google Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#8FA88A]" />
                    <span>Save Key & Run Live AI Scan</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleProceedOffline}
                className="w-full py-2.5 px-4 rounded-xl border border-[#D3DFCE] hover:bg-[#FAF9F4] text-xs text-[#796A59] hover:text-[#263D32] transition-colors cursor-pointer"
              >
                Or proceed in On-Device Local Mode (Offline Heuristics)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
