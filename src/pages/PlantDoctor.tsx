import React, { useState, useEffect, useRef } from 'react';
import { 
  Stethoscope, 
  Send, 
  Sparkles, 
  Cpu, 
  Cloud, 
  Flower2, 
  ArrowRight, 
  HelpCircle,
  Clock,
  RefreshCw,
  Paperclip,
  Trash2,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { Plant, DoctorMessage } from '../types';
import { HealthScorePill } from '../components/common/HealthScorePill';
import { getDoctorChat, addDoctorMessage, clearDoctorChat } from '../services/storageService';
import { askPlantDoctor, isCloudAiAvailable } from '../services/aiService';

interface PlantDoctorProps {
  plants: Plant[];
  selectedPlantId?: string;
  onSelectPlantId: (id: string) => void;
  onScanPlant: (plant: Plant) => void;
}

export const PlantDoctor: React.FC<PlantDoctorProps> = ({
  plants,
  selectedPlantId,
  onSelectPlantId,
  onScanPlant,
}) => {
  // Current active plant for this consultation
  const activePlant = plants.find((p) => p.id === selectedPlantId) || plants[0];
  const [messages, setMessages] = useState<DoctorMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load chat history whenever active plant changes
  useEffect(() => {
    if (activePlant) {
      getDoctorChat(activePlant.id).then((chat) => {
        setMessages(chat);
      });
    }
  }, [activePlant?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleImageAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearChat = async () => {
    if (!activePlant) return;
    if (confirm(`Clear consultation history for ${activePlant.name}?`)) {
      await clearDoctorChat(activePlant.id);
      const fresh = await getDoctorChat(activePlant.id);
      setMessages(fresh);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const rawText = textToSend || inputText;
    if ((!rawText.trim() && !attachedImage) || !activePlant || isLoading) return;

    let text = rawText.trim();
    if (attachedImage && !text) {
      text = 'Please inspect this attached foliar photograph and evaluate leaf health.';
    }

    const userMsg: DoctorMessage = {
      id: 'msg-' + Date.now(),
      plantId: activePlant.id,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInputText('');
    setAttachedImage(null);
    setIsLoading(true);

    try {
      await addDoctorMessage(activePlant.id, userMsg);

      const doctorReplyText = await askPlantDoctor(activePlant, text, updated);

      const docMsg: DoctorMessage = {
        id: 'msg-doc-' + Date.now(),
        plantId: activePlant.id,
        sender: 'doctor',
        text: doctorReplyText,
        timestamp: new Date().toISOString(),
      };

      await addDoctorMessage(activePlant.id, docMsg);
      setMessages((prev) => [...prev, docMsg]);
    } catch (err) {
      console.error('Doctor consultation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const starterQuestions = [
    `How do I treat the symptoms on my ${activePlant.name}?`,
    `What is the optimal watering cadence for this plant?`,
    `How do I safely prune damaged leaves on ${activePlant.name}?`,
    `What sunlight and soil conditions does ${activePlant.species} thrive in?`,
  ];

  if (!activePlant) {
    return (
      <div className="p-10 text-center text-[#796A59]">
        Please add a plant to your garden to consult the Plant Doctor.
      </div>
    );
  }

  const isCloud = isCloudAiAvailable();

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto h-[calc(100vh-80px)] flex flex-col space-y-4">
      {/* Header & Plant Selector Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D3DFCE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C8795B] font-semibold">
              BOTANICAL PATHOLOGY CONSULTATION
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#263D32]">
            Let's talk about your plant.
          </h2>
        </div>

        {/* Plant Switcher Dropdown / Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs text-[#796A59] font-mono shrink-0">SPECIMEN:</span>
          {plants.map((p) => {
            const isSelected = p.id === activePlant.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPlantId(p.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 border transition-all ${
                  isSelected
                    ? 'bg-[#355B46] text-[#FAF9F4] border-[#355B46] shadow-xs'
                    : 'bg-[#FFFFFF] text-[#263D32] border-[#D3DFCE] hover:bg-[#FAF9F4]'
                }`}
              >
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Conversation Window */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Left: Active Plant Medical Dossier Sidebar */}
        <div className="hidden lg:flex lg:col-span-4 flex-col bg-[#FFFFFF] rounded-2xl border border-[#D3DFCE] p-5 space-y-4 overflow-y-auto">
          <div className="aspect-4/3 rounded-xl overflow-hidden border border-[#D3DFCE] relative shrink-0">
            <img
              src={activePlant.imageUrl}
              alt={activePlant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2">
              <HealthScorePill score={activePlant.healthScore} size="sm" />
            </div>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg text-[#263D32]">{activePlant.name}</h3>
            <p className="text-xs text-[#796A59] italic mt-0.5">{activePlant.species}</p>
          </div>

          <div className="space-y-2 text-xs border-t border-[#D3DFCE] pt-3">
            <div className="flex justify-between py-1 border-b border-[#D3DFCE]/40">
              <span className="text-[#796A59]">Health State:</span>
              <span className="font-semibold text-[#263D32] capitalize">{activePlant.status}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#D3DFCE]/40">
              <span className="text-[#796A59]">Location:</span>
              <span className="text-[#263D32]">{activePlant.location || 'Garden'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#D3DFCE]/40">
              <span className="text-[#796A59]">Last Analyzed:</span>
              <span className="text-[#263D32]">{new Date(activePlant.lastScanned).toLocaleDateString()}</span>
            </div>
          </div>

          {activePlant.notes && (
            <div className="p-3 rounded-xl bg-[#FAF9F4] border border-[#D3DFCE] text-xs text-[#796A59]">
              <span className="font-semibold text-[#263D32] block mb-1">Recent Pathology:</span>
              {activePlant.notes}
            </div>
          )}

          <button
            onClick={() => onScanPlant(activePlant)}
            className="w-full mt-auto py-2.5 text-center text-xs font-medium text-[#FAF9F4] bg-[#355B46] hover:bg-[#2B4C3A] rounded-xl transition-colors shadow-xs"
          >
            Scan Foliage Again
          </button>
        </div>

        {/* Right: Message Stream */}
        <div className="lg:col-span-8 flex flex-col bg-[#FFFFFF] rounded-2xl border border-[#D3DFCE] overflow-hidden">
          {/* Chat header bar */}
          <div className="px-5 py-3 border-b border-[#D3DFCE] bg-[#FAF9F4] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#E7EDE3] text-[#355B46] flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-serif font-bold text-[#263D32]">
                  Consultation: {activePlant.name}
                </p>
                <p className="text-[10px] text-[#796A59] font-mono">
                  {isCloud ? 'Cloud Gemini Pathology Reasoning' : 'Local Botanical Knowledge Engine'}
                </p>
              </div>
            </div>

            <button
              onClick={handleClearChat}
              title="Clear consultation history"
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono text-[#796A59] hover:text-[#C8795B] hover:bg-[#F2DFD1]/50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-2xl ${
                    isUser ? 'ml-auto' : 'mr-auto'
                  }`}
                >
                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? 'bg-[#355B46] text-[#FAF9F4] rounded-br-xs shadow-xs'
                        : 'bg-[#FAF9F4] text-[#263D32] border border-[#D3DFCE] rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>

                  <span className="text-[10px] font-mono text-[#796A59] mt-1 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  {/* Suggested actions if provided */}
                  {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.suggestedActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(action)}
                          className="text-[11px] px-3 py-1 rounded-full bg-[#E7EDE3] hover:bg-[#D3DFCE] text-[#263D32] border border-[#8FA88A]/50 transition-colors text-left"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 p-3.5 bg-[#FAF9F4] border border-[#D3DFCE] rounded-2xl w-fit text-xs text-[#796A59] font-mono animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#355B46]" />
                <span>Doctor is evaluating pathology and formulating care plan...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar if chat is fresh */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-5 py-2.5 bg-[#FAF9F4] border-t border-[#D3DFCE] flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] font-mono text-[#796A59] uppercase shrink-0">
                SUGGESTIONS:
              </span>
              {starterQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(q)}
                  className="text-[11px] px-3 py-1 bg-[#FFFFFF] hover:bg-[#E7EDE3] text-[#263D32] rounded-full border border-[#D3DFCE] shrink-0 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-4 border-t border-[#D3DFCE] bg-[#FAF9F4] space-y-2">
            {attachedImage && (
              <div className="flex items-center gap-2 p-1.5 px-3 bg-[#FFFFFF] border border-[#8FA88A] rounded-xl w-fit">
                <img src={attachedImage} alt="Attachment" className="w-8 h-8 rounded-lg object-cover" />
                <span className="text-[11px] font-mono text-[#355B46]">Foliar Photo Attached</span>
                <button
                  type="button"
                  onClick={() => setAttachedImage(null)}
                  className="p-1 text-[#796A59] hover:text-[#C8795B]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Attach foliar photograph"
                className="p-2.5 rounded-xl border border-[#D3DFCE] bg-[#FFFFFF] text-[#796A59] hover:text-[#355B46] hover:bg-[#E7EDE3] transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageAttach}
                accept="image/*"
                className="hidden"
              />

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Ask the Plant Doctor about ${activePlant.name}...`}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#D3DFCE] bg-[#FFFFFF] text-xs text-[#263D32] placeholder-[#796A59]/60 focus:outline-hidden focus:ring-1 focus:ring-[#8FA88A]"
              />
              <button
                type="submit"
                disabled={(!inputText.trim() && !attachedImage) || isLoading}
                className={`p-2.5 rounded-xl text-[#FAF9F4] transition-all shadow-xs ${
                  (inputText.trim() || attachedImage) && !isLoading
                    ? 'bg-[#355B46] hover:bg-[#2B4C3A] cursor-pointer'
                    : 'bg-[#D3DFCE] text-[#796A59] cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
