import React, { useState } from 'react';
import { Search, Sparkles, Compass, MapPin, Bot, ShieldCheck, ArrowRight } from 'lucide-react';
import { REGIONS } from '../data/sites';

interface HeroProps {
  onSearch: (query: string, region?: string, category?: string) => void;
  onExploreSites: () => void;
  onOpenGuide: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch, onExploreSites, onOpenGuide }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Toutes les régions');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, selectedRegion);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#174C3C] via-[#144234] to-[#0f3429] text-white">
      {/* Decorative cultural contour background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,0 C30,40 70,60 100,0 L100,100 L0,100 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Vision & Brand Promise */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Tagline Badge with airy padding */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#D6A64F]/15 border border-[#D6A64F]/35 text-[#D6A64F] text-xs font-semibold tracking-wider uppercase backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Patrimoine · Mémoire · Guide IA Gemma</span>
            </div>

            {/* Main Headline according to Brand Book with generous leading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.18] font-serif">
              Le Togo, <span className="text-[#D6A64F]">ses lieux</span>,<br />
              ses histoires.
            </h1>

            {/* Official Subtext with generous line-height */}
            <p className="text-base sm:text-lg lg:text-xl text-emerald-50/90 font-light max-w-2xl leading-relaxed">
              Explorez les sites qui façonnent le patrimoine togolais. Découvrez leur histoire vérifiée,
              écoutez leurs récits immersifs et laissez-vous guider dans une autre manière de voyager.
            </p>

            {/* Integrated Search Box — Spacious and Aereated */}
            <form
              onSubmit={handleSubmit}
              className="bg-white/12 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl border border-white/20 shadow-2xl flex flex-col sm:flex-row gap-2 max-w-2xl"
            >
              <div className="relative flex-1 flex items-center pl-3">
                <Search className="w-5 h-5 text-[#D6A64F] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher Koutammakou, Agbodrafo, Togoville..."
                  className="w-full pl-3 pr-4 py-3 bg-transparent text-white placeholder-emerald-100/60 focus:outline-hidden text-sm sm:text-base"
                />
              </div>

              {/* Region Selector with clean separator */}
              <div className="sm:w-48 border-t sm:border-t-0 sm:border-l border-white/15">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full py-3 px-3 bg-transparent text-white text-xs sm:text-sm focus:outline-hidden cursor-pointer"
                >
                  {REGIONS.map((r) => (
                    <option key={r} value={r} className="text-[#202722] bg-white">
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3.5 bg-[#D6A64F] hover:bg-[#b88632] text-[#202722] font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 shrink-0 cursor-pointer hover:shadow-lg"
              >
                <span>Explorer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Pills with comfortable margins */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-emerald-100/80">
              <span className="font-semibold text-[#D6A64F]">Suggestions rapides :</span>
              {['Koutammakou UNESCO', 'Traite négrière Agbodrafo', 'Cascade de Kpimé', 'Métallurgie de Bassar'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onSearch(tag)}
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/15 text-white cursor-pointer hover:scale-105"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Value Pillars with generous top spacing */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/15 max-w-2xl">
              <div className="space-y-1">
                <p className="text-3xl font-bold font-serif text-[#D6A64F]">5</p>
                <p className="text-xs text-emerald-100/80 leading-snug">Régions couvertes des Savanes au Littoral</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold font-serif text-[#D6A64F]">100%</p>
                <p className="text-xs text-emerald-100/80 leading-snug">Sources vérifiées et mémoires orales citées</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold font-serif text-[#D6A64F]">Gemma</p>
                <p className="text-xs text-emerald-100/80 leading-snug">Guide IA & Narration augmentée par RAG</p>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Card Highlight */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-white">
              <div className="relative h-72 sm:h-84 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80"
                  alt="Takienta du Koutammakou"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#D6A64F] text-[#202722] shadow-sm">
                    Patrimoine mondial UNESCO
                  </span>
                </div>
                <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                  <p className="text-xs uppercase tracking-wider text-[#D6A64F] font-semibold flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Kara · Kéran</span>
                  </p>
                  <h3 className="text-xl font-bold font-serif text-white">
                    Koutammakou, les châteaux de terre
                  </h3>
                  <p className="text-xs text-gray-200 mt-1 line-clamp-2">
                    L’harmonie millénaire entre l’architecture des Batammariba et le paysage sacré.
                  </p>
                </div>
              </div>

              {/* Action bar on card */}
              <div className="p-4 bg-[#F7F4EC] border-t border-[#DCE8DF] flex items-center justify-between">
                <button
                  onClick={onExploreSites}
                  className="text-xs font-semibold text-[#174C3C] hover:text-[#0f3429] flex items-center space-x-1.5 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#174C3C]" />
                  <span>Voir le catalogue complet</span>
                </button>
                <button
                  onClick={onOpenGuide}
                  className="px-3.5 py-2 rounded-xl bg-[#174C3C] text-white hover:bg-[#0f3429] text-xs font-medium flex items-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5 text-[#D6A64F]" />
                  <span>Interroger le guide IA</span>
                </button>
              </div>
            </div>

            {/* Cultural accent stamp with soft float */}
            <div className="absolute -bottom-6 -right-3 bg-white p-3.5 rounded-2xl shadow-xl border border-[#DCE8DF] hidden sm:flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#174C3C] flex items-center justify-center text-[#D6A64F] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#202722]">Charte Éthique & Culturelle</p>
                <p className="text-[10px] text-[#68716C]">Respect des traditions orales du Togo</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
