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
  Info
} from 'lucide-react';
import { SAMPLE_SPECIMENS } from '../services/sampleData';
import { SpecimenSample, ScanResult, Plant } from '../types';
import { executeHybridScan, isCloudAiAvailable, checkLocalGeminiNano } from '../services/aiService';

interface ScannerProps {
  onScanComplete: (result: ScanResult) => void;
  targetPlant?: Plant | null;
}

export const Scanner: React.FC<ScannerProps> = ({ onScanComplete, targetPlant }) => {
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (targetPlant) {
      setPlantName(targetPlant.name);
      setSpecies(targetPlant.species);
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

  const runScan = async () => {
    if (!selectedImage) return;
    setIsScanning(true);

    try {
      const result = await executeHybridScan(
        selectedImage,
        plantName || 'Botanical Specimen',
        species || 'Species Unspecified',
        symptoms,
        preferCloud,
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
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-[#263D32] flex items-center gap-1.5">
                    <Cloud className="w-3.5 h-3.5 text-[#C8795B]" />
                    <span>Engage Cloud Gemini Flash</span>
                  </span>
                  <p className="text-[10px] text-[#796A59] mt-0.5">
                    Perform deep multimodal cross-comparison for rare fungal variants
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferCloud}
                  onChange={(e) => setPreferCloud(e.target.checked)}
                  className="rounded-sm text-[#355B46] focus:ring-[#8FA88A] w-4 h-4 cursor-pointer"
                />
              </label>
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
              onClick={runScan}
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
    </div>
  );
};
