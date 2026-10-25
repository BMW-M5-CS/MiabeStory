import React from 'react';
import { Compass, BookOpen, Bot, MapPin, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'home' | 'sites' | 'stories' | 'ai-guide' | 'map' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#174C3C] text-white pt-16 pb-12 border-t-4 border-[#D6A64F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-sm">
                <img
                  src="/assets/aistudio/file_000000002ee881f4a172112df967746e_d25af120.png"
                  alt="Logo officiel miabeStory"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-black text-white">Miabe</span>
                  <span className="text-2xl font-black text-[#D6A64F]">Story</span>
                </div>
                <p className="text-[11px] text-emerald-200 uppercase tracking-wider">
                  Le Togo, ses lieux, ses histoires
                </p>
              </div>
            </div>

            <p className="text-sm text-emerald-100 font-light max-w-sm leading-relaxed">
              Plateforme numérique de référence consacrée à la découverte touristique, à l'histoire vérifiée et à la mémoire culturelle du Togo, enrichie d'un guide IA Gemma et de récits immersifs.
            </p>

            <div className="p-3 bg-white/10 rounded-xl border border-white/15 text-xs text-emerald-100 flex items-start space-x-2.5 max-w-sm">
              <ShieldCheck className="w-4 h-4 text-[#D6A64F] shrink-0 mt-0.5" />
              <span>
                <strong>Engagement éthique :</strong> Les faits historiques proviennent d'archives vérifiées et sont explicitement distingués des traditions orales et des reconstitutions narratives.
              </span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-[#D6A64F] uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-emerald-100">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  Page d'accueil
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('sites')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  Annuaire des destinations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('stories')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  Récits « Raconte-moi ce lieu » & Audio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ai-guide')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  Guide IA Gemma conversationnel
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('map')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  Carte interactive des 5 régions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  Administration & Vérification
                </button>
              </li>
              <li className="pt-2">
                <a
                  href="/api/download-zip"
                  download="miabestory-project.zip"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#D6A64F] text-[#202722] text-xs font-bold hover:bg-[#b88632] transition-colors"
                >
                  <span>📦 Télécharger le projet (ZIP)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Documentary Partners & Sources */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-[#D6A64F] uppercase tracking-wider">
              Références & Partenariats
            </h4>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Les fiches de miabeStory sont documentées en conformité avec les travaux du Ministère de la Culture du Togo, du Centre du Patrimoine Mondial de l'UNESCO et de l'Université de Lomé.
            </p>
            <div className="pt-2 space-y-1.5 text-xs text-emerald-200">
              <p className="flex items-center space-x-1">
                <span>• UNESCO — Liste du patrimoine mondial</span>
              </p>
              <p className="flex items-center space-x-1">
                <span>• Ministère de la Culture et du Tourisme du Togo</span>
              </p>
              <p className="flex items-center space-x-1">
                <span>• Recherches historiques du Prof. Nicoué Gayibor</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-200/80 gap-3">
          <p>© {new Date().getFullYear()} miabeStory — Tous droits réservés.</p>
          <p className="flex items-center space-x-1">
            <span>Conçu avec passion pour le patrimoine togolais</span>
            <Heart className="w-3.5 h-3.5 text-[#D6A64F] fill-[#D6A64F]" />
          </p>
        </div>
      </div>
    </footer>
  );
};
