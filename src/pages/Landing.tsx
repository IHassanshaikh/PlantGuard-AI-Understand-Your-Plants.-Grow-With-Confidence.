import React, { useState } from 'react';
import { 
  Sprout, 
  ScanLine, 
  ArrowRight, 
  Cpu, 
  Cloud, 
  ShieldCheck, 
  CheckCircle2, 
  BookOpen, 
  Stethoscope, 
  Flower2, 
  Sparkles,
  Leaf,
  ChevronDown,
  HelpCircle,
  Clock,
  Bug
} from 'lucide-react';
import { NavTab } from '../components/layout/Sidebar';
import { InferenceBadge } from '../components/common/InferenceBadge';
import { HealthScorePill } from '../components/common/HealthScorePill';
import { Logo } from '../components/common/Logo';

interface LandingProps {
  onEnterApp: (tab?: NavTab) => void;
}

const FAQ_ITEMS = [
  {
    q: "How does PlantGuard AI diagnose plant leaf diseases?",
    a: "PlantGuard AI analyzes leaf images in two stages. First, on-device computer vision extracts the Excess Green index (ExG), chlorosis ratio, and necrotic spotting clusters directly inside the browser. Second, Google Gemini models evaluate symptoms against thousands of botanical pathology references to recommend targeted cultural and organic treatments."
  },
  {
    q: "What are the early signs of Early Blight on tomato plants?",
    a: "Early Blight (Alternaria solani) typically manifests as concentric brown target rings (bullseye lesions) surrounded by pale yellow chlorotic halos, appearing first on the lower and oldest foliage after periods of elevated humidity or overhead watering."
  },
  {
    q: "Does PlantGuard AI keep my plant photos private?",
    a: "Yes. PlantGuard AI uses an IndexedDB local-first database architecture. All plant photos, clinical scans, foliar hotspots, and treatment notes remain stored locally in your browser with zero mandatory cloud data storage."
  },
  {
    q: "Can PlantGuard AI detect pest infestations like spider mites or aphids?",
    a: "Yes. The AI inspects fine stippling, webbing clusters, honeydew secretions, and leaf curling characteristic of Tetranychidae (spider mites), Aphidoidea (aphids), and Thripidae (thrips), and recommends targeted neem or potassium soap foliar washes."
  },
  {
    q: "How frequently should I record journal scans for an ailing plant?",
    a: "For acute bacterial or fungal symptoms, record a foliar scan every 48 to 72 hours following treatment application. PlantGuard's Before & After comparator slider will visually track lesion margin retreat and chlorophyll recovery."
  }
];

export const Landing: React.FC<LandingProps> = ({ onEnterApp }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F4] text-[#263D32] flex flex-col selection:bg-[#E7EDE3]">
      {/* Top Botanical Navigation */}
      <header role="banner" className="border-b border-[#D3DFCE] px-6 sm:px-12 py-4 flex items-center justify-between sticky top-0 bg-[#FAF9F4]/95 backdrop-blur-xs z-30">
        <Logo size="md" />

        <nav aria-label="Main Landing Navigation" className="hidden md:flex items-center gap-8 text-sm font-medium text-[#263D32]/80">
          <a href="#how-it-works" className="hover:text-[#355B46] transition-colors focus:outline-none focus:underline">How It Works</a>
          <a href="#hybrid-ai" className="hover:text-[#355B46] transition-colors focus:outline-none focus:underline">Hybrid AI</a>
          <a href="#categories" className="hover:text-[#355B46] transition-colors focus:outline-none focus:underline">Botanical Flora</a>
          <a href="#faq" className="hover:text-[#355B46] transition-colors focus:outline-none focus:underline">Pathology FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onEnterApp('overview')}
            className="hidden sm:inline-flex px-4 py-2 text-xs font-mono font-medium text-[#263D32] hover:bg-[#E7EDE3] rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#355B46]"
          >
            OPEN JOURNAL →
          </button>
          <button
            onClick={() => onEnterApp('scanner')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#355B46] hover:bg-[#2B4C3A] text-[#FAF9F4] text-xs font-medium rounded-xl transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#355B46] focus:ring-offset-2"
          >
            <ScanLine className="w-4 h-4 text-[#8FA88A]" />
            <span>Scan a Plant</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="px-6 sm:px-12 pt-12 pb-20 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D3DFCE] bg-[#E7EDE3] text-xs font-mono text-[#355B46]">
                <Sparkles className="w-3.5 h-3.5 text-[#C8795B]" />
                <span>ON-DEVICE HYBRID BOTANICAL INTELLIGENCE</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#263D32] leading-[1.12] tracking-tight">
                Your Plants Deserve Better Care.
              </h1>

              <p className="text-base sm:text-lg text-[#796A59] max-w-xl leading-relaxed">
                Understand plant diseases, discover hidden symptoms and make smarter care decisions with your personal AI plant doctor. Designed as a living botanical field journal.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
                <button
                  onClick={() => onEnterApp('scanner')}
                  className="flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#355B46] hover:bg-[#2B4C3A] text-[#FAF9F4] text-sm font-medium rounded-xl transition-all shadow-md group focus:outline-none focus:ring-2 focus:ring-[#355B46] focus:ring-offset-2"
                >
                  <ScanLine className="w-4 h-4 text-[#8FA88A] group-hover:scale-110 transition-transform" />
                  <span>Scan Your First Plant</span>
                  <ArrowRight className="w-4 h-4 text-[#8FA88A] group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onEnterApp('overview')}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#FAF9F4] hover:bg-[#E7EDE3] text-[#263D32] border border-[#D3DFCE] text-sm font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#355B46]"
                >
                  <span>Explore How It Works</span>
                </button>
              </div>

              {/* Micro Guarantees */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#D3DFCE]">
                <div>
                  <p className="font-serif font-bold text-lg text-[#263D32]">100% Light</p>
                  <p className="text-xs text-[#796A59]">Warm botanical paper theme</p>
                </div>
                <div>
                  <p className="font-serif font-bold text-lg text-[#263D32]">On-Device AI</p>
                  <p className="text-xs text-[#796A59]">Gemini Nano local inference</p>
                </div>
                <div>
                  <p className="font-serif font-bold text-lg text-[#263D32]">Scientific</p>
                  <p className="text-xs text-[#796A59]">Multi-symptom pathology</p>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Specimen Card */}
            <div className="lg:col-span-5 relative">
              {/* Background Botanical Border */}
              <div className="absolute -inset-2 rounded-3xl bg-[#E7EDE3]/60 -rotate-1 border border-[#D3DFCE] -z-10" />

              <div className="bg-[#FFFFFF] border border-[#D3DFCE] rounded-2xl shadow-xl overflow-hidden p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#796A59]">Botanical Specimen #084</span>
                    <h3 className="font-serif text-lg font-bold text-[#263D32]">Monstera Deliciosa</h3>
                  </div>
                  <HealthScorePill score={89} />
                </div>

                {/* Plant Image with Botanical Callouts */}
                <div className="relative rounded-xl overflow-hidden aspect-4/3 border border-[#D3DFCE]">
                  <img
                    src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80"
                    alt="Healthy Monstera Deliciosa Leaf Surface"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Annotation Pin 1 */}
                  <div className="absolute top-4 left-4 bg-[#FFFFFF]/90 backdrop-blur-xs border border-[#8FA88A] px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1.5 text-[11px] font-mono text-[#263D32]">
                    <Leaf className="w-3 h-3 text-[#355B46]" />
                    <span>Fenestration: Optimal</span>
                  </div>

                  {/* Annotation Pin 2 */}
                  <div className="absolute bottom-4 right-4 bg-[#FFFFFF]/90 backdrop-blur-xs border border-[#C8795B]/40 px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1.5 text-[11px] font-mono text-[#263D32]">
                    <span className="w-2 h-2 rounded-full bg-[#C8795B]" />
                    <span>Foliar Chlorophyll: 92%</span>
                  </div>
                </div>

                {/* Sample Diagnosis Snapshot */}
                <div className="p-4 rounded-xl bg-[#FAF9F4] border border-[#D3DFCE] space-y-2">
                  <div className="flex items-center justify-between">
                    <InferenceBadge source="local-nano" latencyMs={48} />
                    <span className="text-[10px] font-mono text-[#796A59]">VERIFIED</span>
                  </div>
                  <p className="text-xs text-[#263D32] leading-relaxed">
                    <span className="font-semibold text-[#355B46]">Preliminary Assessment:</span> Excellent tissue hydration with balanced stomatal transpiration. No fungal or pest activity observed.
                  </p>
                </div>

                <button
                  onClick={() => onEnterApp('scanner')}
                  className="w-full py-2.5 text-center text-xs font-medium text-[#355B46] hover:bg-[#E7EDE3] rounded-xl border border-[#D3DFCE] transition-colors focus:outline-none focus:ring-2 focus:ring-[#355B46]"
                >
                  Scan A Specimen Now →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: How PlantGuard Works */}
        <section id="how-it-works" className="py-20 px-6 sm:px-12 bg-[#FAF9F4] border-t border-[#D3DFCE]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C8795B] font-semibold">Scientific Methodology</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#263D32] mt-2">
                How PlantGuard Protects Your Flora
              </h2>
              <p className="text-sm text-[#796A59] mt-3">
                We replace guesswork with structured botanical pathology, combining on-device computer vision with Google Gemini models.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-[#FFFFFF] border border-[#D3DFCE] shadow-xs relative">
                <span className="font-mono text-3xl font-bold text-[#D3DFCE]">01</span>
                <div className="w-10 h-10 rounded-xl bg-[#E7EDE3] text-[#355B46] flex items-center justify-center my-4">
                  <ScanLine className="w-5 h-5 text-[#355B46]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#263D32] mb-2">Capture & Extract</h3>
                <p className="text-xs text-[#796A59] leading-relaxed">
                  Take a photograph or pick a specimen. Our on-device vision engine analyzes foliar pigmentation, chlorotic spotting, and cell turgor instantly in your browser.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-[#FFFFFF] border border-[#D3DFCE] shadow-xs relative">
                <span className="font-mono text-3xl font-bold text-[#D3DFCE]">02</span>
                <div className="w-10 h-10 rounded-xl bg-[#E7EDE3] text-[#355B46] flex items-center justify-center my-4">
                  <Cpu className="w-5 h-5 text-[#355B46]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#263D32] mb-2">Hybrid Intelligence</h3>
                <p className="text-xs text-[#796A59] leading-relaxed">
                  Gemini Nano performs preliminary diagnosis locally without sending images to external servers. For complex diseases, Cloud Gemini conducts deep comparative reasoning.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-[#FFFFFF] border border-[#D3DFCE] shadow-xs relative">
                <span className="font-mono text-3xl font-bold text-[#D3DFCE]">03</span>
                <div className="w-10 h-10 rounded-xl bg-[#E7EDE3] text-[#355B46] flex items-center justify-center my-4">
                  <Stethoscope className="w-5 h-5 text-[#355B46]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#263D32] mb-2">Consult & Track</h3>
                <p className="text-xs text-[#796A59] leading-relaxed">
                  Save findings to your living Garden Journal. Ask the conversational Plant Doctor specific questions anchored to that exact specimen’s medical history.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Hybrid Architecture Details */}
        <section id="hybrid-ai" className="py-20 px-6 sm:px-12 bg-[#FAF9F4] border-t border-[#D3DFCE]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-5">
                <span className="text-xs font-mono uppercase tracking-widest text-[#355B46] font-semibold">Transparent Architecture</span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#263D32]">
                  Local-First Privacy Meets Deep Cloud Reasoning
                </h2>
                <p className="text-sm text-[#796A59] leading-relaxed">
                  Most AI apps route everything through remote servers. PlantGuard introduces a transparent hybrid AI hierarchy: everyday checks run 100% on your device, while advanced pathology engages Google Gemini Cloud on demand.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D3DFCE]">
                    <CheckCircle2 className="w-4 h-4 text-[#355B46] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-[#263D32]">Zero-Latency Local Inference</p>
                      <p className="text-[11px] text-[#796A59]">Processes in &lt;100ms with offline capability and complete image privacy.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D3DFCE]">
                    <CheckCircle2 className="w-4 h-4 text-[#C8795B] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-[#263D32]">Deep Multimodal Cloud Diagnostics</p>
                      <p className="text-[11px] text-[#796A59]">Evaluates intricate fungal sporulation, viral mosaics, and pest damage via Gemini Flash.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D3DFCE] shadow-sm space-y-4">
                  <h3 className="font-serif font-bold text-base text-[#263D32] border-b border-[#D3DFCE] pb-3">
                    AI Responsibility Matrix
                  </h3>
                  <div className="divide-y divide-[#D3DFCE] text-xs">
                    <div className="py-2.5 flex justify-between">
                      <span className="text-[#796A59]">Visual Symptom Recognition</span>
                      <span className="font-mono text-[#355B46]">Local & Cloud</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-[#796A59]">Preliminary Disease Assessment</span>
                      <span className="font-mono text-[#355B46]">Local (Gemini Nano)</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-[#796A59]">Multi-symptom Differential Diagnosis</span>
                      <span className="font-mono text-[#C8795B]">Cloud Gemini Flash</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-[#796A59]">Offline Journal & History</span>
                      <span className="font-mono text-[#355B46]">100% Local IndexedDB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Supported Botanical Categories */}
        <section id="categories" className="py-20 px-6 sm:px-12 bg-[#FAF9F4] border-t border-[#D3DFCE]">
          <div className="max-w-6xl mx-auto text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-[#796A59]">Botanical Flora</span>
            <h2 className="font-serif text-3xl font-bold text-[#263D32] mt-2 mb-10">
              Engineered For Every Leaf In Your Care
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: 'Indoor Foliage', count: '120+ species', icon: '🪴' },
                { name: 'Garden Veggies', count: 'Solanaceae & more', icon: '🍅' },
                { name: 'Culinary Herbs', count: 'Basil, Mint, Thyme', icon: '🌿' },
                { name: 'Orchard Fruits', count: 'Citrus, Apples, Berries', icon: '🍋' },
                { name: 'Succulents & Cacti', count: 'Low-moisture flora', icon: '🌵' },
                { name: 'Ornamental Flowers', count: 'Roses, Orchids, Lilies', icon: '🌸' },
              ].map((cat, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D3DFCE] hover:border-[#8FA88A] transition-colors">
                  <span className="text-2xl" role="img" aria-label={cat.name}>{cat.icon}</span>
                  <p className="font-serif font-semibold text-sm text-[#263D32] mt-2">{cat.name}</p>
                  <p className="text-[10px] font-mono text-[#796A59] mt-0.5">{cat.count}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: AEO Structured Pathology FAQ */}
        <section id="faq" aria-labelledby="faq-heading" className="py-20 px-6 sm:px-12 bg-[#FAF9F4] border-t border-[#D3DFCE]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-mono uppercase tracking-widest text-[#355B46] font-semibold">Botanical Pathology Knowledge</span>
              <h2 id="faq-heading" className="font-serif text-3xl sm:text-4xl font-bold text-[#263D32] mt-2">
                Frequently Asked Horticultural Questions
              </h2>
              <p className="text-sm text-[#796A59] mt-3">
                Authoritative answers on botanical diagnostics, foliar symptom analysis, and privacy architecture.
              </p>
            </div>

            <div className="space-y-4">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div 
                    key={idx}
                    className="border border-[#D3DFCE] rounded-xl bg-[#FFFFFF] overflow-hidden transition-all shadow-xs"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${idx}`}
                      className="w-full text-left p-5 flex items-center justify-between gap-4 font-serif font-bold text-base text-[#263D32] hover:text-[#355B46] transition-colors focus:outline-none focus:bg-[#E7EDE3]/40"
                    >
                      <span className="flex items-center gap-3">
                        <HelpCircle className="w-4 h-4 text-[#8FA88A] shrink-0" aria-hidden="true" />
                        <span>{item.q}</span>
                      </span>
                      <ChevronDown 
                        className={`w-4 h-4 text-[#796A59] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#355B46]' : ''}`}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <div 
                        id={`faq-answer-${idx}`}
                        className="px-5 pb-5 pt-1 text-sm text-[#796A59] leading-relaxed border-t border-[#D3DFCE]/60 bg-[#FAF9F4]/40"
                      >
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final Editorial Call to Action */}
        <section className="py-20 px-6 sm:px-12 bg-[#E7EDE3]/60 border-t border-[#D3DFCE]">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-[#355B46] text-[#FAF9F4] flex items-center justify-center mx-auto shadow-sm">
              <Sprout className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#263D32]">
              Begin Your Botanical Field Journal Today
            </h2>
            <p className="text-sm text-[#796A59] max-w-lg mx-auto">
              Test on-device AI, diagnose leaf blight, and maintain your personal plant records with scientific clarity.
            </p>
            <div className="pt-2 flex justify-center gap-4">
              <button
                onClick={() => onEnterApp('scanner')}
                className="flex items-center gap-2 px-8 py-3.5 bg-[#355B46] hover:bg-[#2B4C3A] text-[#FAF9F4] text-sm font-medium rounded-xl transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-[#355B46] focus:ring-offset-2"
              >
                <ScanLine className="w-4 h-4 text-[#8FA88A]" />
                <span>Launch Plant Scanner</span>
              </button>
              <button
                onClick={() => onEnterApp('overview')}
                className="px-6 py-3.5 bg-[#FFFFFF] hover:bg-[#FAF9F4] text-[#263D32] border border-[#D3DFCE] text-sm font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#355B46]"
              >
                View Garden Dashboard
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="border-t border-[#D3DFCE] px-6 sm:px-12 py-8 bg-[#FAF9F4] text-xs text-[#796A59] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo size="sm" showSubtitle={false} />
          <span className="font-mono text-[#8FA88A]">|</span>
          <span className="font-mono text-[#796A59]">Design System: Verdant Paper</span>
        </div>
        <p className="text-[11px] font-mono">
          Understand Your Plants. Grow With Confidence. © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};
