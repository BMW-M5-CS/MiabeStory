import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, BookOpen, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { HeritageSite, REGIONS } from '../data/sites';

interface InteractiveMapProps {
  sites: HeritageSite[];
  onSelectSite: (site: HeritageSite) => void;
  onOpenStoryForSite: (site: HeritageSite) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  sites,
  onSelectSite,
  onOpenStoryForSite,
}) => {
  const [selectedSite, setSelectedSite] = useState<HeritageSite | null>(sites[0] || null);
  const [regionFilter, setRegionFilter] = useState<string>('Toutes les régions');

  const filteredSites =
    regionFilter === 'Toutes les régions'
      ? sites
      : sites.filter((s) => s.region.toLowerCase() === regionFilter.toLowerCase());

  // Convert real GPS (Lat 6.1 to 11.0, Lng 0.0 to 1.8) to SVG viewbox (width 400, height 700)
  // Togo bounds: Lat ~6.0 (south) to 11.2 (north), Lng ~0.0 (west) to 1.8 (east)
  const mapCoordsToSvg = (lat: number, lng: number) => {
    const minLat = 5.9;
    const maxLat = 11.3;
    const minLng = -0.2;
    const maxLng = 2.0;

    const x = ((lng - minLng) / (maxLng - minLng)) * 360 + 20;
    // Invert Y because SVG 0 is top
    const y = ((maxLat - lat) / (maxLat - minLat)) * 620 + 40;

    return { x, y };
  };

  return (
    <div className="bg-white rounded-3xl border border-[#DCE8DF] shadow-md overflow-hidden">
      {/* Top Header */}
      <div className="bg-[#174C3C] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#D6A64F] text-[#202722]">
            Cartographie Culturelle
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif mt-2 text-white">
            Carte des hauts lieux du Togo
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 font-light mt-1">
            Visualisez les destinations répertoriées, de l’océan Atlantique aux falaises des Savanes.
          </p>
        </div>

        {/* Region Filter Dropdown & Counts */}
        <div className="flex items-center space-x-2 bg-white/10 p-1.5 rounded-xl border border-white/20 self-start md:self-auto">
          <Filter className="w-4 h-4 text-[#D6A64F] ml-1" />
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="bg-transparent text-white text-xs sm:text-sm focus:outline-hidden cursor-pointer"
          >
            {REGIONS.map((r) => (
              <option key={r} value={r} className="text-[#202722] bg-white">
                {r} ({r === 'Toutes les régions' ? sites.length : sites.filter((s) => s.region.toLowerCase() === r.toLowerCase()).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Region Switcher Buttons Strip */}
      <div className="bg-[#EDF4EE] px-6 py-2.5 border-b border-[#DCE8DF] flex items-center space-x-2 overflow-x-auto scrollbar-none text-xs">
        <span className="text-[#174C3C] font-semibold text-[11px] shrink-0 mr-1">Régions :</span>
        {REGIONS.map((r) => {
          const count = r === 'Toutes les régions' ? sites.length : sites.filter((s) => s.region.toLowerCase() === r.toLowerCase()).length;
          const isSelected = regionFilter === r;
          return (
            <button
              key={r}
              onClick={() => setRegionFilter(r)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#174C3C] text-white shadow-2xs font-bold'
                  : 'bg-white hover:bg-[#DCE8DF] text-[#202722] border border-[#DCE8DF]'
              }`}
            >
              <span>{r}</span>
              <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                isSelected ? 'bg-white/20 text-white' : 'bg-[#DCE8DF] text-[#174C3C]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Map & Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Column: Visual Map Canvas */}
        <div className="lg:col-span-7 bg-[#F7F4EC] p-4 sm:p-8 flex items-center justify-center relative border-b lg:border-b-0 lg:border-r border-[#DCE8DF]">
          <div className="relative w-full max-w-[380px] aspect-[4/7]">
            <svg
              viewBox="0 0 400 700"
              className="w-full h-full drop-shadow-md select-none"
            >
              {/* Regional Togo Background Outline (Stylized geographic corridor) */}
              <defs>
                <linearGradient id="togoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#DCE8DF" />
                  <stop offset="100%" stopColor="#C9DBCF" />
                </linearGradient>
                <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
                </filter>
              </defs>

              {/* Togo silhouette polygon approximation */}
              <polygon
                points="
                  110,40  290,40  320,130  270,220  260,330 
                  270,440  290,520  320,620  240,650  140,660 
                  130,620  140,510  160,400  150,300  130,200  90,110
                "
                fill="url(#togoGrad)"
                stroke="#174C3C"
                strokeWidth="2.5"
                filter="url(#shadow)"
                className="transition-colors duration-300"
              />

              {/* Regional Boundaries Dashed Lines */}
              <line x1="100" y1="130" x2="310" y2="130" stroke="#174C3C" strokeDasharray="4 4" strokeOpacity="0.4" />
              <text x="320" y="90" fontSize="11" fill="#68716C" fontWeight="bold">SAVANES</text>

              <line x1="120" y1="240" x2="280" y2="240" stroke="#174C3C" strokeDasharray="4 4" strokeOpacity="0.4" />
              <text x="290" y="190" fontSize="11" fill="#68716C" fontWeight="bold">KARA</text>

              <line x1="150" y1="360" x2="270" y2="360" stroke="#174C3C" strokeDasharray="4 4" strokeOpacity="0.4" />
              <text x="280" y="300" fontSize="11" fill="#68716C" fontWeight="bold">CENTRALE</text>

              <line x1="140" y1="520" x2="290" y2="520" stroke="#174C3C" strokeDasharray="4 4" strokeOpacity="0.4" />
              <text x="300" y="440" fontSize="11" fill="#68716C" fontWeight="bold">PLATEAUX</text>

              <text x="310" y="590" fontSize="11" fill="#68716C" fontWeight="bold">MARITIME</text>
              <text x="220" y="675" fontSize="10" fill="#174C3C" fontStyle="italic">Golfe de Guinée (Atlantique)</text>

              {/* Destination Markers */}
              {filteredSites.map((site) => {
                const { x, y } = mapCoordsToSvg(site.coordinates.lat, site.coordinates.lng);
                const isSelected = selectedSite?.id === site.id;

                return (
                  <g
                    key={site.id}
                    onClick={() => setSelectedSite(site)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing ring if selected */}
                    {isSelected && (
                      <circle
                        cx={x}
                        cy={y}
                        r="20"
                        fill="#D6A64F"
                        fillOpacity="0.35"
                        className="animate-ping"
                      />
                    )}

                    {/* Outer Circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? '14' : '10'}
                      fill={isSelected ? '#174C3C' : '#D6A64F'}
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      className="transition-all duration-200 group-hover:scale-125"
                    />

                    {/* Inner Dot */}
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill={isSelected ? '#D6A64F' : '#174C3C'}
                    />

                    {/* Label */}
                    <text
                      x={x + 16}
                      y={y + 4}
                      fontSize="10"
                      fontWeight="bold"
                      fill="#202722"
                      className="pointer-events-none drop-shadow-xs"
                    >
                      {site.name.split(',')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map Legend */}
            <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-[#DCE8DF] text-[10px] space-y-1 shadow-xs">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#174C3C]" />
                <span className="font-semibold text-[#202722]">Destination sélectionnée</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D6A64F]" />
                <span className="text-[#68716C]">Autres sites répertoriés</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Site Detail Card preview */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white">
          {selectedSite ? (
            <div className="space-y-5">
              <div className="relative h-48 rounded-2xl overflow-hidden border border-[#DCE8DF]">
                <img
                  src={selectedSite.coverImage}
                  alt={selectedSite.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#174C3C] text-white">
                    {selectedSite.categoryLabel}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 text-white text-xs font-medium flex items-center space-x-1 drop-shadow-sm">
                  <MapPin className="w-3.5 h-3.5 text-[#D6A64F]" />
                  <span>{selectedSite.locality} ({selectedSite.region})</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold font-serif text-[#174C3C]">
                  {selectedSite.name}
                </h3>
                <p className="text-xs font-medium text-[#D6A64F]">
                  {selectedSite.subtitle}
                </p>
                <p className="text-xs text-[#202722] leading-relaxed line-clamp-4">
                  {selectedSite.shortDescription}
                </p>
              </div>

              {/* Distance from Lomé & Coordinates */}
              <div className="bg-[#F7F4EC] p-3.5 rounded-xl border border-[#DCE8DF] space-y-2 text-xs">
                {selectedSite.distanceFromLome && (
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#DCE8DF]/60">
                    <span className="font-semibold text-[#174C3C]">Trajet depuis Lomé :</span>
                    <span className="font-medium text-[#202722]">{selectedSite.distanceFromLome}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#174C3C]">Coordonnées GPS :</span>
                  <span className="font-mono text-[11px] text-[#68716C]">
                    {selectedSite.coordinates.lat}° N, {selectedSite.coordinates.lng}° E
                  </span>
                </div>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedSite.coordinates.lat},${selectedSite.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#174C3C] hover:underline pt-0.5"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#D6A64F]" />
                  <span>Calculer l'itinéraire avec Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-[#68716C]" />
                </a>
              </div>

              {/* Cultural Etiquette Notice */}
              {selectedSite.culturalEtiquette && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 text-[11px] text-emerald-950 leading-relaxed">
                  <span className="font-bold text-emerald-900">Éthique de visite : </span>
                  {selectedSite.culturalEtiquette}
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => onSelectSite(selectedSite)}
                  className="w-full py-2.5 px-4 bg-[#174C3C] hover:bg-[#0f3429] text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-xs cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#D6A64F]" />
                  <span>Consulter la fiche détaillée</span>
                </button>

                <button
                  onClick={() => onOpenStoryForSite(selectedSite)}
                  className="w-full py-2 px-4 border border-[#D6A64F] hover:bg-[#D6A64F]/10 text-[#8c6722] text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D6A64F]" />
                  <span>Écouter le récit de ce lieu</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-6 text-[#68716C] text-sm">
              Cliquez sur un marqueur de la carte pour afficher les détails du site.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
