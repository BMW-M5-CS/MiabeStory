import React, { useState } from 'react';
import { Compass, BookOpen, Bot, MapPin, ShieldCheck, Menu, X, Search, Sparkles, Download } from 'lucide-react';

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
    { id: 'home', label: 'Accueil', icon: Compass },
    { id: 'sites', label: 'Destinations', icon: BookOpen },
    { id: 'stories', label: 'Récits & Audio', icon: Sparkles },
    { id: 'ai-guide', label: 'Guide IA', icon: Bot },
    { id: 'map', label: 'Carte', icon: MapPin },
    { id: 'admin', label: 'Administration', icon: ShieldCheck },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#DCE8DF] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#F7F4EC] p-0.5 border border-[#174C3C]/10 shadow-xs group-hover:scale-105 transition-transform">
              <img
                src="/assets/aistudio/file_000000002ee881f4a172112df967746e_d25af120.png"
                alt="Logo officiel miabeStory"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-baseline">
                <span className="text-2xl font-black tracking-tight text-[#174C3C]">Miabe</span>
                <span className="text-2xl font-black tracking-tight text-[#D6A64F]">Story</span>
              </div>
              <p className="text-[11px] font-medium text-[#68716C] tracking-wide uppercase">
                Le Togo, ses lieux, ses histoires
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#174C3C] text-white shadow-xs'
                      : 'text-[#202722] hover:text-[#174C3C] hover:bg-[#DCE8DF]/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D6A64F]' : 'text-[#68716C]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Search Trigger & AI Badge */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={onOpenSearch}
              className="flex items-center space-x-2 px-3.5 py-2 bg-[#F7F4EC] hover:bg-[#DCE8DF] text-[#68716C] hover:text-[#174C3C] text-sm rounded-lg border border-[#DCE8DF] transition-colors"
              title="Rechercher un site ou une histoire"
            >
              <Search className="w-4 h-4 text-[#174C3C]" />
              <span className="text-xs">Rechercher...</span>
              <kbd className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-500">⌘K</kbd>
            </button>

            {/* Gemma Status indicator */}
            <div
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border ${
                aiStatus.hasApiKey
                  ? 'bg-[#174C3C]/10 text-[#174C3C] border-[#174C3C]/20'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
              title={aiStatus.hasApiKey ? 'Modèle Gemma connecté et opérationnel' : 'Mode démonstration'}
            >
              <span className={`w-2 h-2 rounded-full ${aiStatus.hasApiKey ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="font-semibold">Gemma</span>
            </div>

            {/* Download Project ZIP Button */}
            <a
              href="/api/download-zip"
              download="miabestory-project.zip"
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#D6A64F] hover:bg-[#b88632] text-[#202722] text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
              title="Télécharger tout le dossier du projet (ZIP) sur votre ordinateur"
            >
              <Download className="w-3.5 h-3.5 text-[#202722]" />
              <span>Télécharger le projet (ZIP)</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#202722] hover:bg-[#DCE8DF] rounded-lg"
              aria-label="Recherche"
            >
              <Search className="w-5 h-5 text-[#174C3C]" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#202722] hover:bg-[#DCE8DF] rounded-lg"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#174C3C]" /> : <Menu className="w-6 h-6 text-[#174C3C]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#DCE8DF] px-4 pt-3 pb-5 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#174C3C] text-white'
                    : 'text-[#202722] hover:bg-[#F7F4EC]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#D6A64F]' : 'text-[#174C3C]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <a
            href="/api/download-zip"
            download="miabestory-project.zip"
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-[#D6A64F] text-[#202722] rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-[#202722]" />
            <span>Télécharger tout le projet (ZIP)</span>
          </a>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-[#68716C] px-2">
            <span>Guide IA : Google Gemma</span>
            <span className={`px-2 py-0.5 rounded-full ${aiStatus.hasApiKey ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {aiStatus.hasApiKey ? 'Connecté' : 'Mode démo'}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
