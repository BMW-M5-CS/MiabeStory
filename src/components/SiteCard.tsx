import React from 'react';
import { MapPin, ArrowRight, Bot, Sparkles, BookOpen } from 'lucide-react';
import { HeritageSite } from '../data/sites';

interface SiteCardProps {
  site: HeritageSite;
  onSelectSite: (site: HeritageSite) => void;
  onOpenGuideForSite: (site: HeritageSite) => void;
  onOpenStoryForSite: (site: HeritageSite) => void;
}

export const SiteCard: React.FC<SiteCardProps> = ({
  site,
  onSelectSite,
  onOpenGuideForSite,
  onOpenStoryForSite,
}) => {
  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-[#DCE8DF] hover:border-[#174C3C]/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Cover Image & Category Badges */}
      <div className="relative h-56 overflow-hidden bg-gray-100 cursor-pointer" onClick={() => onSelectSite(site)}>
        <img
          src={site.coverImage}
          alt={site.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#174C3C] text-white shadow-xs">
            {site.categoryLabel}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#F7F4EC]/90 text-[#174C3C] backdrop-blur-xs border border-[#174C3C]/10">
            {site.region}
          </span>
        </div>

        {/* Bottom Locality inside image */}
        <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
          <p className="text-xs font-medium flex items-center space-x-1 drop-shadow-sm text-emerald-100">
            <MapPin className="w-3.5 h-3.5 text-[#D6A64F] shrink-0" />
            <span className="truncate">{site.locality}</span>
          </p>
          <span className="text-[11px] text-[#D6A64F] bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs font-mono">
            {site.coordinates.lat.toFixed(2)}°N
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          <h3
            onClick={() => onSelectSite(site)}
            className="text-xl font-bold font-serif text-[#202722] group-hover:text-[#174C3C] transition-colors cursor-pointer line-clamp-1"
          >
            {site.name}
          </h3>

          <p className="text-xs font-medium text-[#D6A64F]">
            {site.subtitle}
          </p>

          <p className="text-xs text-[#68716C] leading-relaxed line-clamp-3">
            {site.shortDescription}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 pt-1">
            {site.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F7F4EC] text-[#174C3C] border border-[#DCE8DF]"
              >
                #{tag}
              </span>
            ))}
            {site.tags.length > 3 && (
              <span className="text-[10px] text-[#68716C] self-center">+{site.tags.length - 3}</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-5 mt-4 border-t border-[#DCE8DF]/70 flex flex-col gap-2">
          {/* Main Action */}
          <button
            onClick={() => onSelectSite(site)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#174C3C] hover:bg-[#0f3429] text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-colors shadow-xs cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#D6A64F]" />
            <span>Découvrir la fiche complète</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Sub Actions: Guide IA & Récit */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenGuideForSite(site)}
              className="py-1.5 px-2.5 rounded-lg border border-[#174C3C]/20 hover:bg-[#DCE8DF]/50 text-[#174C3C] text-[11px] font-medium flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              title="Poser des questions au guide IA sur ce site"
            >
              <Bot className="w-3 h-3 text-[#174C3C]" />
              <span>Guide IA</span>
            </button>

            <button
              onClick={() => onOpenStoryForSite(site)}
              className="py-1.5 px-2.5 rounded-lg border border-[#D6A64F]/50 hover:bg-[#D6A64F]/10 text-[#8c6722] text-[11px] font-medium flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              title="Vivre le récit immersif"
            >
              <Sparkles className="w-3 h-3 text-[#D6A64F]" />
              <span>Raconte-moi</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
