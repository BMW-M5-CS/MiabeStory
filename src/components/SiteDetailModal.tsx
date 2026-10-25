import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Coins,
  Compass,
  Calendar,
  Sparkles,
  Bot,
  ExternalLink,
  BookOpen,
  Volume2,
  BookmarkCheck,
  Info,
  ChevronRight,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { HeritageSite } from '../data/sites';

interface SiteDetailModalProps {
  site: HeritageSite | null;
  onClose: () => void;
  onOpenGuideForSite: (site: HeritageSite) => void;
  onOpenStoryForSite: (site: HeritageSite) => void;
}

export const SiteDetailModal: React.FC<SiteDetailModalProps> = ({
  site,
  onClose,
  onOpenGuideForSite,
  onOpenStoryForSite,
}) => {
  const [activeSection, setActiveSection] = useState<
    'decouvrir' | 'histoire' | 'traditions' | 'recit' | 'visite' | 'sources'
  >('decouvrir');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!site) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const sections = [
    { id: 'decouvrir', label: '1. Découvrir le lieu' },
    { id: 'histoire', label: '2. Comprendre son histoire' },
    { id: 'traditions', label: '3. Traditions & mémoire' },
    { id: 'recit', label: '4. Vivre le récit' },
    { id: 'visite', label: '5. Préparer sa visite' },
    { id: 'sources', label: '6. Sources documentaires' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#F7F4EC] rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] border border-[#174C3C]/20">
        {/* Sticky Top Header */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#DCE8DF] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#174C3C] text-white">
              {site.categoryLabel}
            </span>
            <span className="text-xs text-[#68716C] flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-[#D6A64F]" />
              <span>{site.locality} ({site.region})</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 text-[#68716C] hover:text-[#174C3C] hover:bg-[#DCE8DF]/50 rounded-lg transition-colors cursor-pointer"
              title="Partager le lien de ce site"
            >
              {copiedLink ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#68716C] hover:text-[#202722] hover:bg-[#DCE8DF]/60 rounded-full transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1">
          {/* Hero Banner inside modal */}
          <div className="relative h-72 sm:h-96 w-full overflow-hidden">
            <img
              src={site.coverImage}
              alt={site.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#202722]/90 via-[#202722]/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <span className="px-3 py-1 rounded-md text-xs font-semibold bg-[#D6A64F] text-[#202722]">
                Région : {site.region} · {site.prefecture}
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif leading-tight text-white drop-shadow-md">
                {site.name}
              </h2>
              <p className="text-sm sm:text-base text-emerald-100 font-light max-w-2xl">
                {site.subtitle}
              </p>
              {site.imageCaption && (
                <p className="text-[11px] text-gray-300 italic pt-1">
                  Photo : {site.imageCaption}
                </p>
              )}
            </div>
          </div>

          {/* Quick Action Floating Bar */}
          <div className="bg-white px-6 py-3 border-b border-[#DCE8DF] flex flex-wrap items-center justify-between gap-3 shadow-xs">
            {/* Quick Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenStoryForSite(site)}
                className="px-4 py-2 bg-[#D6A64F] hover:bg-[#b88632] text-[#202722] rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#202722]" />
                <span>Raconte-moi ce lieu</span>
              </button>

              <button
                onClick={() => onOpenGuideForSite(site)}
                className="px-4 py-2 bg-[#174C3C] hover:bg-[#0f3429] text-white rounded-xl text-xs font-medium flex items-center space-x-2 transition-all shadow-xs cursor-pointer"
              >
                <Bot className="w-4 h-4 text-[#D6A64F]" />
                <span>Poser une question au Guide IA</span>
              </button>
            </div>

            {/* GPS coordinates & Google Maps link */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${site.coordinates.lat},${site.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#174C3C] hover:underline flex items-center space-x-1"
            >
              <Compass className="w-3.5 h-3.5 text-[#174C3C]" />
              <span>Ouvrir sur Maps ({site.coordinates.lat}, {site.coordinates.lng})</span>
              <ExternalLink className="w-3 h-3 text-[#68716C]" />
            </a>
          </div>

          {/* Tab Navigation */}
          <div className="bg-[#EDF4EE] px-6 py-2 border-b border-[#DCE8DF] flex overflow-x-auto space-x-1 scrollbar-none">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeSection === s.id
                    ? 'bg-[#174C3C] text-white shadow-xs'
                    : 'text-[#202722] hover:bg-white/60'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div className="p-6 sm:p-8 space-y-8 bg-[#F7F4EC]">
            {/* Section 1: Découvrir le lieu */}
            {activeSection === 'decouvrir' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-[#DCE8DF] shadow-xs space-y-4">
                  <h3 className="text-xl font-bold font-serif text-[#174C3C] flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-[#D6A64F]" />
                    <span>Présentation générale</span>
                  </h3>
                  <p className="text-sm sm:text-base text-[#202722] leading-relaxed">
                    {site.presentation}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#DCE8DF] shadow-xs space-y-3">
                  <h4 className="text-base font-bold text-[#174C3C] flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#D6A64F]" />
                    <span>Intérêt touristique et culturel</span>
                  </h4>
                  <p className="text-sm text-[#202722] leading-relaxed">
                    {site.touristicInterest}
                  </p>
                </div>

                {/* Practical Quick Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-[#DCE8DF]">
                    <div className="flex items-center space-x-2 text-[#174C3C] mb-1">
                      <Clock className="w-4 h-4 text-[#D6A64F]" />
                      <span className="text-xs font-bold uppercase">Horaires</span>
                    </div>
                    <p className="text-xs text-[#202722]">{site.practicalInfo.openingHours}</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#DCE8DF]">
                    <div className="flex items-center space-x-2 text-[#174C3C] mb-1">
                      <Coins className="w-4 h-4 text-[#D6A64F]" />
                      <span className="text-xs font-bold uppercase">Tarifs indicatifs</span>
                    </div>
                    <p className="text-xs text-[#202722]">{site.practicalInfo.fees}</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#DCE8DF]">
                    <div className="flex items-center space-x-2 text-[#174C3C] mb-1">
                      <Calendar className="w-4 h-4 text-[#D6A64F]" />
                      <span className="text-xs font-bold uppercase">Période conseillée</span>
                    </div>
                    <p className="text-xs text-[#202722]">{site.practicalInfo.bestSeason}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Comprendre son histoire */}
            {activeSection === 'histoire' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-[#DCE8DF] shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold font-serif text-[#174C3C]">
                      Contexte et mémoire historique
                    </h3>
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <BookmarkCheck className="w-3.5 h-3.5" />
                      <span>Histoire vérifiée & documentée</span>
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-[#202722] leading-relaxed">
                    {site.historicalContext}
                  </p>

                  {/* Key figures */}
                  {site.keyFigures.length > 0 && (
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs font-semibold text-[#68716C] mb-2 uppercase tracking-wider">
                        Personnages et acteurs majeurs :
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {site.keyFigures.map((fig) => (
                          <span
                            key={fig}
                            className="px-3 py-1 bg-[#F7F4EC] text-[#174C3C] rounded-lg text-xs font-medium border border-[#DCE8DF]"
                          >
                            {fig}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Historical Timeline */}
                <div className="bg-white p-6 rounded-2xl border border-[#DCE8DF] shadow-xs space-y-4">
                  <h4 className="text-lg font-bold font-serif text-[#174C3C]">
                    Chronologie des événements
                  </h4>
                  <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-[#DCE8DF]">
                    {site.timeline.map((item, index) => (
                      <div key={index} className="relative flex items-start space-x-4 pl-8">
                        <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-[#174C3C] border-2 border-white ring-2 ring-[#D6A64F]/50" />
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-[#D6A64F] uppercase tracking-wider">
                            {item.period}
                          </span>
                          <p className="text-sm font-medium text-[#202722]">{item.event}</p>
                          {item.sourceRef && (
                            <p className="text-[11px] text-[#68716C] italic">Source : {item.sourceRef}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Traditions et mémoire */}
            {activeSection === 'traditions' && (
              <div className="space-y-6">
                <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/80 flex items-start space-x-3 text-amber-900 text-xs">
                  <Info className="w-5 h-5 shrink-0 text-amber-700 mt-0.5" />
                  <div>
                    <span className="font-bold">Distinction éthique & patrimoniale : </span>
                    Cette section regroupe les mémoires orales, croyances cosmogoniques et traditions transmises de génération en génération. Elles complètent les archives écrites en leur apportant leur souffle spirituel.
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#DCE8DF] shadow-xs space-y-3">
                  <h4 className="text-lg font-bold font-serif text-[#174C3C]">
                    Traditions orales transmises
                  </h4>
                  <p className="text-sm text-[#202722] leading-relaxed">
                    {site.oralTraditions}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#DCE8DF] shadow-xs space-y-3">
                  <h4 className="text-lg font-bold font-serif text-[#174C3C]">
                    Légendes, mythes et symboles sacrés
                  </h4>
                  <p className="text-sm text-[#202722] leading-relaxed">
                    {site.legendsAndBeliefs}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#DCE8DF] shadow-xs space-y-3">
                  <h4 className="text-lg font-bold font-serif text-[#174C3C]">
                    Pratiques rituelles et festivités coutumières
                  </h4>
                  <p className="text-sm text-[#202722] leading-relaxed">
                    {site.culturalPractices}
                  </p>
                </div>
              </div>
            )}

            {/* Section 4: Vivre le récit */}
            {activeSection === 'recit' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-[#174C3C] to-[#0f3429] text-white p-6 sm:p-8 rounded-3xl shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#D6A64F] text-[#202722]">
                      Narration miabeStory
                    </span>
                    <button
                      onClick={() => onOpenStoryForSite(site)}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4 text-[#D6A64F]" />
                      <span>Écouter & Personnaliser</span>
                    </button>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                    {site.immersiveStory.title}
                  </h3>

                  <p className="text-sm sm:text-base text-emerald-50 leading-relaxed font-light whitespace-pre-line">
                    {site.immersiveStory.fullVersion}
                  </p>

                  <div className="pt-4 border-t border-white/10 text-xs text-emerald-200/80 italic">
                    ⚠️ {site.immersiveStory.disclaimer}
                  </div>
                </div>

                {/* Sub-cards: versions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-[#DCE8DF] space-y-2">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-[#174C3C]">
                      Version condensée (Mobile)
                    </h5>
                    <p className="text-xs text-[#202722] leading-relaxed">
                      {site.immersiveStory.shortVersion}
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#DCE8DF] space-y-2">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-[#D6A64F]">
                      Version Jeune Public / Écoliers
                    </h5>
                    <p className="text-xs text-[#202722] leading-relaxed">
                      {site.immersiveStory.youthVersion}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section 5: Préparer sa visite */}
            {activeSection === 'visite' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-[#DCE8DF] shadow-xs space-y-4">
                    <h4 className="text-base font-bold text-[#174C3C] flex items-center space-x-2">
                      <Compass className="w-5 h-5 text-[#D6A64F]" />
                      <span>Itinéraire et voies d’accès</span>
                    </h4>
                    <p className="text-sm text-[#202722] leading-relaxed">
                      {site.practicalInfo.accessRoute}
                    </p>

                    <div className="pt-2">
                      <p className="text-xs font-semibold text-[#68716C] mb-1">Coordonnées GPS officielles :</p>
                      <code className="text-xs bg-[#F7F4EC] px-3 py-1.5 rounded-lg border border-[#DCE8DF] text-[#174C3C] font-mono">
                        Latitude: {site.coordinates.lat} / Longitude: {site.coordinates.lng}
                      </code>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-[#DCE8DF] shadow-xs space-y-4">
                    <h4 className="text-base font-bold text-[#174C3C] flex items-center space-x-2">
                      <Info className="w-5 h-5 text-[#D6A64F]" />
                      <span>Conseils et guides locaux</span>
                    </h4>
                    <ul className="text-sm text-[#202722] space-y-2.5">
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 text-[#D6A64F] shrink-0 mt-0.5" />
                        <span><strong>Accompagnement :</strong> {site.practicalInfo.guidanceAvailable ? 'Guides locaux agréés disponibles sur place.' : 'Visite en autonomie.'}</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 text-[#D6A64F] shrink-0 mt-0.5" />
                        <span><strong>Contact utile :</strong> {site.practicalInfo.contactInfo || 'Office National du Tourisme du Togo'}</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 text-[#D6A64F] shrink-0 mt-0.5" />
                        <span><strong>Respect des lieux :</strong> Demandez toujours l’autorisation avant de photographier des autels ou des résidents.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Section 6: Sources documentaires */}
            {activeSection === 'sources' && (
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl border border-[#DCE8DF] shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold font-serif text-[#174C3C]">
                      Références bibliographiques et archivistiques
                    </h4>
                    <span className="text-xs text-[#68716C]">
                      {site.sources.length} sources répertoriées
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {site.sources.map((src, index) => (
                      <div key={index} className="py-3.5 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#174C3C]/10 text-[#174C3C]">
                            {src.type}
                          </span>
                          <span className="text-xs text-[#68716C]">
                            Vérifié le {src.verificationDate}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-[#202722]">
                          {src.title}
                        </p>
                        <p className="text-xs text-[#68716C]">
                          Auteur / Institution : {src.authorOrOrg} {src.year ? `(${src.year})` : ''}
                        </p>
                        {src.notes && <p className="text-xs text-[#174C3C] italic">{src.notes}</p>}
                        {src.url && (
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-xs text-[#174C3C] hover:underline pt-1"
                          >
                            <span>Consulter la source en ligne</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-white px-6 py-3 border-t border-[#DCE8DF] flex items-center justify-between">
          <p className="text-xs text-[#68716C] hidden sm:block">
            miabeStory · Plateforme culturelle du Togo
          </p>
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => onOpenGuideForSite(site)}
              className="px-4 py-2 bg-[#174C3C] text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Bot className="w-4 h-4 text-[#D6A64F]" />
              <span>Interroger l’IA sur ce site</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#DCE8DF] hover:bg-gray-100 rounded-xl text-xs font-medium text-[#202722] cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
