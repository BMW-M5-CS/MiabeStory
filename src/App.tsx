import React, { useState, useEffect } from 'react';
import {
  Compass,
  BookOpen,
  Bot,
  MapPin,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Volume2,
  Calendar,
  Layers,
  X,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SiteCard } from './components/SiteCard';
import { SiteDetailModal } from './components/SiteDetailModal';
import { AIGuidePanel } from './components/AIGuidePanel';
import { StorytellingPlayer } from './components/StorytellingPlayer';
import { InteractiveMap } from './components/InteractiveMap';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { HeritageSite, INITIAL_SITES, REGIONS, CATEGORIES } from './data/sites';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'sites' | 'stories' | 'ai-guide' | 'map' | 'admin'>('home');
  const [sites, setSites] = useState<HeritageSite[]>(INITIAL_SITES);
  const [isLoadingSites, setIsLoadingSites] = useState(false);

  // Modals & Active Selections
  const [selectedSiteForDetail, setSelectedSiteForDetail] = useState<HeritageSite | null>(null);
  const [activeStorySite, setActiveStorySite] = useState<HeritageSite>(INITIAL_SITES[0]);
  const [guideSiteContext, setGuideSiteContext] = useState<HeritageSite | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Filters for Catalogue
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Toutes les régions');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // AI Status
  const [aiStatus, setAiStatus] = useState({
    configured: false,
    primaryModel: 'gemma-4-31b-it',
    hasApiKey: false,
  });

  // Fetch initial sites & AI status from backend
  const fetchSites = async () => {
    setIsLoadingSites(true);
    try {
      const res = await fetch('/api/sites');
      if (res.ok) {
        const data = await res.json();
        if (data.sites && data.sites.length > 0) {
          setSites(data.sites);
        }
      }
    } catch (err) {
      console.warn('Backend /api/sites unreachable, using fallback dataset:', err);
    } finally {
      setIsLoadingSites(false);
    }
  };

  const fetchAIStatus = async () => {
    try {
      const res = await fetch('/api/ai/status');
      if (res.ok) {
        const data = await res.json();
        setAiStatus(data);
      }
    } catch (e) {
      console.warn('Backend /api/ai/status unreachable:', e);
    }
  };

  useEffect(() => {
    fetchSites();
    fetchAIStatus();

    // Keyboard shortcut ⌘K for search
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered sites list
  const filteredSites = sites.filter((site) => {
    const matchesRegion =
      selectedRegion === 'Toutes les régions' ||
      site.region.toLowerCase() === selectedRegion.toLowerCase();

    const matchesCategory =
      selectedCategory === 'all' ||
      site.category === selectedCategory ||
      site.categoryLabel.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesQuery =
      !searchQuery.trim() ||
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesRegion && matchesCategory && matchesQuery;
  });

  // Navigation Handlers
  const handleHeroSearch = (query: string, region?: string) => {
    setSearchQuery(query);
    if (region) setSelectedRegion(region);
    setActiveTab('sites');
  };

  const handleOpenGuideForSite = (site: HeritageSite) => {
    setGuideSiteContext(site);
    setActiveTab('ai-guide');
    setSelectedSiteForDetail(null);
  };

  const handleOpenStoryForSite = (site: HeritageSite) => {
    setActiveStorySite(site);
    setActiveTab('stories');
    setSelectedSiteForDetail(null);
  };

  const handleUpdateSiteInAdmin = (updatedSite: HeritageSite) => {
    setSites((prev) => {
      const idx = prev.findIndex((s) => s.id === updatedSite.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedSite;
        return next;
      }
      return [updatedSite, ...prev];
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EC] text-[#202722]">
      {/* Global Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        aiStatus={aiStatus}
      />

      {/* Main View Container */}
      <main className="flex-1">
        {/* VIEW 1: HOME PAGE */}
        {activeTab === 'home' && (
          <div className="space-y-16 lg:space-y-24">
            {/* Hero section */}
            <Hero
              onSearch={handleHeroSearch}
              onExploreSites={() => setActiveTab('sites')}
              onOpenGuide={() => {
                setGuideSiteContext(null);
                setActiveTab('ai-guide');
              }}
            />

            {/* Section 2: Explore by Region */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#DCE8DF] text-[#174C3C]">
                  Les 5 Régions du Togo
                </span>
                <h2 className="text-3xl font-bold font-serif text-[#174C3C]">
                  Une diversité culturelle du sud au nord
                </h2>
                <p className="text-xs sm:text-sm text-[#68716C]">
                  Des lagunes du littoral maritime aux falaises millénaires des Savanes.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {[
                  { name: 'Maritime', desc: 'Lomé, Lac Togo, Agbodrafo', count: 3, img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Plateaux', desc: 'Kpalimé, Mont Agou, Kpimé', count: 1, img: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Centrale', desc: 'Sokodé, Faille d’Alédjo', count: 1, img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Kara', desc: 'Koutammakou UNESCO, Bassar', count: 2, img: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Savanes', desc: 'Dapaong, Grottes de Nok', count: 1, img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
                ].map((reg) => (
                  <div
                    key={reg.name}
                    onClick={() => {
                      setSelectedRegion(reg.name);
                      setActiveTab('sites');
                    }}
                    className="group relative h-44 rounded-2xl overflow-hidden border border-[#DCE8DF] shadow-xs cursor-pointer"
                  >
                    <img
                      src={reg.img}
                      alt={reg.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-base font-bold font-serif">{reg.name}</p>
                      <p className="text-[10px] text-emerald-200 truncate">{reg.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: Featured Destinations (Lieux à découvrir) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#D6A64F]/20 text-[#8c6722] border border-[#D6A64F]/30">
                    Sélection Patrimoniale
                  </span>
                  <h2 className="text-3xl font-bold font-serif text-[#174C3C] mt-2">
                    Lieux emblématiques du patrimoine
                  </h2>
                  <p className="text-xs sm:text-sm text-[#68716C] mt-1">
                    Chaque destination dispose de sources documentaires vérifiées et de traditions transmises.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('sites')}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#174C3C] hover:text-[#0f3429] hover:underline"
                >
                  <span>Voir tous les sites ({sites.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sites.slice(0, 6).map((site) => (
                  <SiteCard
                    key={site.id}
                    site={site}
                    onSelectSite={(s) => setSelectedSiteForDetail(s)}
                    onOpenGuideForSite={handleOpenGuideForSite}
                    onOpenStoryForSite={handleOpenStoryForSite}
                  />
                ))}
              </div>
            </section>

            {/* Section 4: Histoires à écouter & Vivre les récits */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-br from-[#174C3C] to-[#0f3429] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-5">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#D6A64F] text-[#202722]">
                      Immersion Sensorielle
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white">
                      « Raconte-moi ce lieu » : vivez le Togo à travers ses récits
                    </h2>
                    <p className="text-sm sm:text-base text-emerald-100 font-light leading-relaxed">
                      Loin des guides froids, laissez-vous porter par des narrations vivantes structurées en séquences, avec écoute audio et adaptation selon vos envies (version courte, détaillée ou jeunesse).
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => {
                          setActiveStorySite(sites[0]);
                          setActiveTab('stories');
                        }}
                        className="px-5 py-3 rounded-xl bg-[#D6A64F] hover:bg-[#b88632] text-[#202722] font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all shadow-md cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4 text-[#202722]" />
                        <span>Lancer une écoute narrative</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('sites')}
                        className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/20 transition-colors"
                      >
                        Choisir une destination
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 space-y-4">
                    <p className="text-xs uppercase tracking-wider text-[#D6A64F] font-bold">
                      Extrait narratif à l’honneur :
                    </p>
                    <h3 className="text-xl font-bold font-serif text-white">
                      {sites[0]?.immersiveStory.title}
                    </h3>
                    <p className="text-xs text-emerald-100/90 leading-relaxed italic line-clamp-4">
                      « {sites[0]?.immersiveStory.fullVersion.slice(0, 240)}... »
                    </p>
                    <div className="pt-2 flex items-center justify-between text-xs text-emerald-200">
                      <span>Région : {sites[0]?.region}</span>
                      <span className="font-semibold text-[#D6A64F]">• Durée : ~{sites[0]?.audioDurationMinutes} min</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Comprendre autrement avec l'IA Gemma */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#DCE8DF] text-[#174C3C]">
                    Intelligence Artificielle & RAG
                  </span>
                  <h2 className="text-3xl font-bold font-serif text-[#174C3C]">
                    Un guide conversationnel rigoureux, propulsé par Gemma
                  </h2>
                  <p className="text-sm text-[#202722] leading-relaxed">
                    Le guide miabeStory ne se contente pas de bavarder. Il s'appuie sur une base documentaire contrôlée (UNESCO, archives nationales, traditions orales authentifiées).
                  </p>
                  <ul className="text-xs text-[#68716C] space-y-2 pt-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#174C3C]" />
                      <span>Distinction explicite des faits prouvés et des traditions orales</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#174C3C]" />
                      <span>Citations documentaires et signalement des incertitudes</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#174C3C]" />
                      <span>Modèle Google Gemma 4-31B-IT connecté côté serveur</span>
                    </li>
                  </ul>
                  <div className="pt-3">
                    <button
                      onClick={() => {
                        setGuideSiteContext(null);
                        setActiveTab('ai-guide');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#174C3C] hover:bg-[#0f3429] text-white text-xs font-semibold flex items-center space-x-2 shadow-xs cursor-pointer"
                    >
                      <Bot className="w-4 h-4 text-[#D6A64F]" />
                      <span>Ouvrir l'assistant conversationnel</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <AIGuidePanel
                    currentSite={sites[0]}
                    availableSites={sites}
                    onSelectSite={(id) => {
                      const s = sites.find((x) => x.id === id);
                      if (s) setGuideSiteContext(s);
                    }}
                  />
                </div>
              </div>
            </section>

            {/* Section 6: Interactive Map Preview */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              <InteractiveMap
                sites={sites}
                onSelectSite={(s) => setSelectedSiteForDetail(s)}
                onOpenStoryForSite={handleOpenStoryForSite}
              />
            </section>
          </div>
        )}

        {/* VIEW 2: SITES DIRECTORY (Annuaire & Recherche) */}
        {activeTab === 'sites' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            {/* Header & Search Bar */}
            <div className="space-y-4">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#DCE8DF] text-[#174C3C]">
                  Annuaire du patrimoine
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#174C3C] mt-2">
                  Destinations touristiques et culturelles
                </h1>
                <p className="text-xs sm:text-sm text-[#68716C] mt-1">
                  Parcourez les sites répertoriés au Togo, filtrez par région ou par thématique historique.
                </p>
              </div>

              {/* Filters Bar */}
              <div className="bg-white p-4 rounded-2xl border border-[#DCE8DF] shadow-xs flex flex-col md:flex-row gap-3 items-center">
                {/* Search Text */}
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-[#68716C] absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par nom, ville, mot-clé..."
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F7F4EC] rounded-xl text-xs sm:text-sm text-[#202722] focus:outline-hidden focus:bg-white focus:border-[#174C3C] border border-[#DCE8DF]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Region Selector */}
                <div className="w-full md:w-52">
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#F7F4EC] rounded-xl text-xs sm:text-sm text-[#202722] border border-[#DCE8DF] focus:outline-hidden"
                  >
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                {/* Category Selector */}
                <div className="w-full md:w-56">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#F7F4EC] rounded-xl text-xs sm:text-sm text-[#202722] border border-[#DCE8DF] focus:outline-hidden"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active filters status */}
              <div className="flex items-center justify-between text-xs text-[#68716C] px-1">
                <span>
                  Affichage de <strong>{filteredSites.length}</strong> site{filteredSites.length > 1 ? 's' : ''} sur {sites.length}
                </span>

                {(searchQuery || selectedRegion !== 'Toutes les régions' || selectedCategory !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedRegion('Toutes les régions');
                      setSelectedCategory('all');
                    }}
                    className="text-[#174C3C] hover:underline font-medium cursor-pointer"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            </div>

            {/* Sites Grid */}
            {filteredSites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSites.map((site) => (
                  <SiteCard
                    key={site.id}
                    site={site}
                    onSelectSite={(s) => setSelectedSiteForDetail(s)}
                    onOpenGuideForSite={handleOpenGuideForSite}
                    onOpenStoryForSite={handleOpenStoryForSite}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#DCE8DF] space-y-3">
                <Compass className="w-12 h-12 text-[#D6A64F] mx-auto opacity-70" />
                <h3 className="text-lg font-bold font-serif text-[#174C3C]">
                  Aucun site ne correspond à votre recherche
                </h3>
                <p className="text-xs text-[#68716C] max-w-md mx-auto">
                  Essayez d'élargir votre recherche, de sélectionner « Toutes les régions » ou d'effacer les mots-clés saisis.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRegion('Toutes les régions');
                    setSelectedCategory('all');
                  }}
                  className="px-4 py-2 bg-[#174C3C] text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Afficher toutes les destinations
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: STORIES & AUDIO PLAYER */}
        {activeTab === 'stories' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            {/* Header */}
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#D6A64F]/20 text-[#8c6722] border border-[#D6A64F]/30">
                Mode Narratif Immersif
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#174C3C] mt-2">
                « Raconte-moi ce lieu » & Guide Audio
              </h1>
              <p className="text-xs sm:text-sm text-[#68716C] mt-1">
                Choisissez une destination ci-dessous pour lancer l'écoute et découvrir son histoire vivante.
              </p>
            </div>

            {/* Destination Selector Tabs */}
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
              {sites.map((site) => (
                <button
                  key={site.id}
                  onClick={() => setActiveStorySite(site)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                    activeStorySite.id === site.id
                      ? 'bg-[#174C3C] text-white border-[#174C3C] shadow-sm'
                      : 'bg-white text-[#202722] border-[#DCE8DF] hover:bg-[#F7F4EC]'
                  }`}
                >
                  <span>{site.name.split(',')[0]}</span>
                  <span className="ml-1.5 text-[10px] opacity-70 font-normal">({site.region})</span>
                </button>
              ))}
            </div>

            {/* Active Story Player */}
            <StorytellingPlayer
              site={activeStorySite}
              onOpenGuide={handleOpenGuideForSite}
            />
          </div>
        )}

        {/* VIEW 4: AI GUIDE GEMMA */}
        {activeTab === 'ai-guide' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#DCE8DF] text-[#174C3C]">
                Assistant Conversationnel & Archives
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#174C3C] mt-2">
                Le Guide IA miabeStory
              </h1>
              <p className="text-xs sm:text-sm text-[#68716C] mt-1">
                Posez vos questions sur les faits historiques, la cosmogonie, les architectures et la mémoire togolaise.
              </p>
            </div>

            <AIGuidePanel
              currentSite={guideSiteContext}
              onClearSiteContext={() => setGuideSiteContext(null)}
              onSelectSite={(id) => {
                const s = sites.find((x) => x.id === id);
                if (s) setGuideSiteContext(s);
              }}
              availableSites={sites}
            />
          </div>
        )}

        {/* VIEW 5: INTERACTIVE MAP */}
        {activeTab === 'map' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <InteractiveMap
              sites={sites}
              onSelectSite={(s) => setSelectedSiteForDetail(s)}
              onOpenStoryForSite={handleOpenStoryForSite}
            />
          </div>
        )}

        {/* VIEW 6: ADMINISTRATION */}
        {activeTab === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <AdminPanel
              sites={sites}
              onUpdateSite={handleUpdateSiteInAdmin}
              onRefreshSites={fetchSites}
            />
          </div>
        )}
      </main>

      {/* Global Detailed Modal */}
      <SiteDetailModal
        site={selectedSiteForDetail}
        onClose={() => setSelectedSiteForDetail(null)}
        onOpenGuideForSite={handleOpenGuideForSite}
        onOpenStoryForSite={handleOpenStoryForSite}
      />

      {/* Quick Search Modal (⌘K) */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full my-auto overflow-hidden border border-[#DCE8DF] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCE8DF] pb-3">
              <h3 className="font-bold font-serif text-lg text-[#174C3C] flex items-center space-x-2">
                <Search className="w-5 h-5 text-[#D6A64F]" />
                <span>Recherche rapide miabeStory</span>
              </h3>
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tapez un nom de site, région, mot-clé..."
                className="w-full px-4 py-3 bg-[#F7F4EC] rounded-xl border border-[#DCE8DF] text-sm focus:outline-hidden focus:bg-white focus:border-[#174C3C]"
              />
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 text-xs">
              {filteredSites.slice(0, 5).map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setSelectedSiteForDetail(s);
                    setIsSearchModalOpen(false);
                  }}
                  className="py-2.5 px-2 hover:bg-[#F7F4EC] rounded-lg cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-[#174C3C]">{s.name}</p>
                    <p className="text-[#68716C]">{s.locality} ({s.region})</p>
                  </div>
                  <span className="text-[10px] bg-[#DCE8DF] text-[#174C3C] px-2 py-0.5 rounded-full font-semibold">
                    {s.categoryLabel}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-between items-center text-[11px] text-[#68716C] border-t border-gray-100">
              <span>Appuyez sur Échap pour fermer</span>
              <button
                onClick={() => {
                  setActiveTab('sites');
                  setIsSearchModalOpen(false);
                }}
                className="text-[#174C3C] font-bold hover:underline"
              >
                Voir dans le catalogue →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Footer */}
      <Footer onNavigate={setActiveTab} />
    </div>
  );
}
