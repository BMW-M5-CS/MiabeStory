import React, { useState } from 'react';
import {
  Compass,
  BookOpen,
  Bot,
  MapPin,
  ShieldCheck,
  Menu,
  X,
  Search,
  Sparkles,
  Download,
  SlidersHorizontal,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'sites' | 'stories' | 'ai-guide' | 'map' | 'admin';
  setActiveTab: (tab: 'home' | 'sites' | 'stories' | 'ai-guide' | 'map' | 'admin') => void;
  onOpenSearch: () => void;
  aiStatus: { configured: boolean; primaryModel: string; hasApiKey: boolean };
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  aiStatus,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Accueil' },
    { id: 'sites', label: 'Destinations' },
    { id: 'stories', label: 'Récits & Audio' },
    { id: 'ai-guide', label: 'Guide IA' },
    { id: 'map', label: 'Carte' },
    { id: 'admin', label: 'Administration' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#DCE8DF]/80 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Identity / Logo */}
          <div
            className="flex items-center space-x-3.5 cursor-pointer shrink-0 group select-none py-1"
            onClick={() => setActiveTab('home')}
          >
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden bg-[#F7F4EC] p-1 border border-[#174C3C]/10 shadow-xs group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
              <img
                src="/assets/aistudio/file_000000002ee881f4a172112df967746e_d25af120.png"
                alt="Logo officiel miabeStory"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline leading-none">
                <span className="text-2xl font-black tracking-tight text-[#174C3C]">Miabe</span>
                <span className="text-2xl font-black tracking-tight text-[#D6A64F]">Story</span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-[#68716C] tracking-wider uppercase mt-1">
                Le Togo, ses lieux, ses histoires
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links — Aerated and Editorial */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'text-[#174C3C] font-semibold bg-[#DCE8DF]/50 shadow-2xs'
                      : 'text-[#202722]/80 hover:text-[#174C3C] hover:bg-[#F7F4EC]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-[#174C3C] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Medium screen Navigation (Icons + Tooltips) for 1024-1280px */}
          <nav className="hidden md:flex xl:hidden items-center space-x-1">
            {navItems.slice(0, 5).map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#174C3C] font-bold bg-[#DCE8DF]'
                      : 'text-[#202722] hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar — Generously Spaced and Balanced */}
          <div className="hidden md:flex items-center space-x-3 shrink-0">
            {/* Search Trigger Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center space-x-2 px-3.5 py-2 bg-[#F7F4EC] hover:bg-[#DCE8DF]/70 text-[#68716C] hover:text-[#174C3C] text-xs rounded-xl border border-[#DCE8DF] transition-all cursor-pointer"
              title="Recherche rapide"
            >
              <Search className="w-3.5 h-3.5 text-[#174C3C]" />
              <span className="hidden lg:inline text-xs">Rechercher</span>
              <kbd className="hidden lg:inline text-[10px] bg-white px-1.5 py-0.5 rounded-md border border-gray-200 text-gray-500 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Subtle Divider */}
            <div className="h-5 w-px bg-[#DCE8DF]" />

            {/* Gemma IA Status pill */}
            <div
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                aiStatus.hasApiKey
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200/80'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
              title={aiStatus.hasApiKey ? 'Modèle Google Gemma 4-31B-IT opérationnel' : 'Mode démonstration'}
            >
              <span className={`w-2 h-2 rounded-full ${aiStatus.hasApiKey ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="font-semibold text-[11px]">Gemma 4</span>
            </div>

            {/* Download Project ZIP button */}
            <a
              href="/api/download-zip"
              download="miabestory-project.zip"
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#D6A64F] hover:bg-[#b88632] text-[#202722] text-xs font-bold rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              title="Télécharger tout le dossier du projet (ZIP) sur votre ordinateur"
            >
              <Download className="w-3.5 h-3.5 text-[#202722]" />
              <span className="tracking-wide">Projet ZIP</span>
            </a>
          </div>

          {/* Mobile Actions Button */}
          <div className="flex md:hidden items-center space-x-1.5">
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#202722] hover:bg-[#DCE8DF] rounded-xl transition-colors"
              aria-label="Recherche"
            >
              <Search className="w-5 h-5 text-[#174C3C]" />
            </button>

            <a
              href="/api/download-zip"
              download="miabestory-project.zip"
              className="p-2 text-[#202722] hover:bg-[#DCE8DF] rounded-xl transition-colors"
              title="Télécharger le code ZIP"
            >
              <Download className="w-5 h-5 text-[#174C3C]" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#202722] hover:bg-[#DCE8DF] rounded-xl transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#174C3C]" /> : <Menu className="w-6 h-6 text-[#174C3C]" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-lg border-b border-[#DCE8DF] px-5 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-center px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#174C3C] text-white shadow-xs'
                      : 'bg-[#F7F4EC] text-[#202722] hover:bg-[#DCE8DF]'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-gray-100 space-y-2">
            <a
              href="/api/download-zip"
              download="miabestory-project.zip"
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#D6A64F] text-[#202722] rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Download className="w-4 h-4 text-[#202722]" />
              <span>Télécharger le code complet (ZIP)</span>
            </a>

            <div className="flex items-center justify-between text-xs text-[#68716C] px-2 pt-1">
              <span>Guide IA : Google Gemma</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${aiStatus.hasApiKey ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {aiStatus.hasApiKey ? 'Connecté (4-31B-IT)' : 'Mode démo'}
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
