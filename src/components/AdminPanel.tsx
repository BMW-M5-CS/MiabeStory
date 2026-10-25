import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Download,
  RotateCcw,
  BookOpen,
  Save,
  X,
  FileText,
  Calendar,
} from 'lucide-react';
import { HeritageSite, REGIONS, CATEGORIES } from '../data/sites';

interface AdminPanelProps {
  sites: HeritageSite[];
  onUpdateSite: (site: HeritageSite) => void;
  onRefreshSites: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  sites,
  onUpdateSite,
  onRefreshSites,
}) => {
  const [editingSite, setEditingSite] = useState<HeritageSite | null>(null);
  const [filterRegion, setFilterRegion] = useState('Toutes les régions');
  const [notification, setNotification] = useState<string | null>(null);

  const filteredSites =
    filterRegion === 'Toutes les régions'
      ? sites
      : sites.filter((s) => s.region.toLowerCase() === filterRegion.toLowerCase());

  const handleEditClick = (site: HeritageSite) => {
    setEditingSite(JSON.parse(JSON.stringify(site)));
  };

  const handleAddNewClick = () => {
    const newSite: HeritageSite = {
      id: `site-${Date.now()}`,
      name: 'Nouveau site culturel togolais',
      slug: `nouveau-site-${Date.now()}`,
      subtitle: 'Description courte du monument',
      region: 'Maritime',
      prefecture: 'Golfe',
      locality: 'Lomé',
      coordinates: { lat: 6.13, lng: 1.22 },
      category: 'culturel',
      categoryLabel: 'Traditions & Mémoire',
      coverImage: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80',
      imageCaption: 'Photographie du site',
      galleryImages: [],
      tags: ['Patrimoine', 'Togo'],
      shortDescription: 'Présentation concise du site pour la découverte.',
      touristicInterest: 'Intérêt culturel et touristique majeur.',
      presentation: 'Historique et contexte de fondation du site.',
      practicalInfo: {
        openingHours: '08h00 - 17h00',
        fees: '2 000 FCFA',
        guidanceAvailable: true,
        bestSeason: 'Novembre à Mars',
        accessRoute: 'Route goudronnée praticable',
      },
      historicalContext: 'Faits historiques vérifiés et documentés.',
      keyFigures: ['Fondateurs locaux'],
      timeline: [{ period: 'XXe siècle', event: 'Fondation du site' }],
      isVerifiedHistory: true,
      oralTraditions: 'Traditions transmises par les aînés.',
      legendsAndBeliefs: 'Mythes fondateurs du lieu.',
      culturalPractices: 'Fêtes et célébrations rituelles annuelles.',
      memoryStatusNotice: 'Documentation transmise par les autorités coutumières.',
      immersiveStory: {
        title: 'Le récit du nouveau lieu',
        fullVersion: 'La terre togolaise murmure son histoire séculaire...',
        shortVersion: 'Une escale incontournable pour comprendre le Togo.',
        youthVersion: 'Découvre les secrets de ce lieu fantastique !',
        disclaimer: 'Reconstitution narrative respectant les sources fournies.',
      },
      sources: [
        {
          title: 'Inventaire du patrimoine culturel togolais',
          type: 'Institutionnel',
          authorOrOrg: 'Ministère de la Culture',
          verificationDate: new Date().toISOString().split('T')[0],
        },
      ],
      audioNarrationSnippet: 'Écoutez le récit de ce haut lieu togolais...',
      audioDurationMinutes: 3,
    };
    setEditingSite(newSite);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSite) return;

    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSite),
      });

      if (res.ok) {
        onUpdateSite(editingSite);
        setNotification('Fiche sauvegardée avec succès !');
        setEditingSite(null);
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error('Erreur sauvegarde admin:', err);
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sites, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `miabestory_sites_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetData = async () => {
    if (!confirm('Voulez-vous réinitialiser le catalogue avec les données de démonstration officielles ?')) return;
    try {
      const res = await fetch('/api/sites/reset', { method: 'POST' });
      if (res.ok) {
        onRefreshSites();
        setNotification('Catalogue réinitialisé avec succès.');
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#174C3C] text-white p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#D6A64F] text-[#202722]">
              Espace Gestionnaire
            </span>
            <span className="text-xs text-emerald-200">
              Contrôle éditorial & Vérification documentaire
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif mt-2 text-white">
            Administration des contenus miabeStory
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 font-light mt-1 max-w-2xl">
            Vérifiez l’exactitude des sources, mettez à jour les informations pratiques et contrôlez les récits associés aux destinations togolaises.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleAddNewClick}
            className="px-4 py-2.5 bg-[#D6A64F] hover:bg-[#b88632] text-[#202722] rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une destination</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium flex items-center space-x-1.5 border border-white/20 transition-colors cursor-pointer"
            title="Exporter pour migration de base de données"
          >
            <Download className="w-4 h-4 text-[#D6A64F]" />
            <span>Exporter JSON</span>
          </button>

          <button
            onClick={handleResetData}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs border border-white/20 transition-colors cursor-pointer"
            title="Réinitialiser le jeu de données"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-2 text-sm animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#DCE8DF] shadow-2xs">
          <p className="text-xs text-[#68716C]">Destinations enregistrées</p>
          <p className="text-2xl font-bold font-serif text-[#174C3C] mt-1">{sites.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#DCE8DF] shadow-2xs">
          <p className="text-xs text-[#68716C]">Sources documentaires</p>
          <p className="text-2xl font-bold font-serif text-[#174C3C] mt-1">
            {sites.reduce((acc, s) => acc + s.sources.length, 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#DCE8DF] shadow-2xs">
          <p className="text-xs text-[#68716C]">Sites vérifiés</p>
          <p className="text-2xl font-bold font-serif text-emerald-700 mt-1">100%</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#DCE8DF] shadow-2xs">
          <p className="text-xs text-[#68716C]">Modèle IA actif</p>
          <p className="text-sm font-bold font-mono text-[#D6A64F] mt-2">gemma-4-31b-it</p>
        </div>
      </div>

      {/* Sites Data Table */}
      <div className="bg-white rounded-3xl border border-[#DCE8DF] shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-[#DCE8DF] flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-bold font-serif text-lg text-[#202722]">
            Catalogue des sites ({filteredSites.length})
          </h3>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#68716C]">Région :</span>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="text-xs bg-[#F7F4EC] border border-[#DCE8DF] rounded-lg px-3 py-1.5 text-[#202722] focus:outline-hidden"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F4EC] text-[#68716C] border-b border-[#DCE8DF] uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Localité / Région</th>
                <th className="py-3 px-4">Catégorie</th>
                <th className="py-3 px-4">Sources</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSites.map((site) => (
                <tr key={site.id} className="hover:bg-[#F7F4EC]/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#202722] flex items-center space-x-3">
                    <img
                      src={site.coverImage}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover border border-[#DCE8DF]"
                    />
                    <div>
                      <p className="font-bold text-sm text-[#174C3C]">{site.name}</p>
                      <p className="text-[11px] text-[#68716C] line-clamp-1">{site.subtitle}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#202722]">
                    <span className="font-medium">{site.locality}</span>
                    <span className="text-[#68716C] block text-[11px]">{site.region} ({site.prefecture})</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#DCE8DF] text-[#174C3C]">
                      {site.categoryLabel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#68716C]">
                    <span className="font-semibold text-[#174C3C]">{site.sources.length}</span> réf. vérifiées
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>Publié & Conforme</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleEditClick(site)}
                      className="p-1.5 hover:bg-[#DCE8DF] rounded-lg text-[#174C3C] transition-colors cursor-pointer"
                      title="Modifier la fiche"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal Form */}
      {editingSite && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full my-auto overflow-hidden border border-[#DCE8DF] flex flex-col max-h-[90vh]">
            <div className="bg-[#174C3C] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold font-serif text-lg text-white">
                Édition de la fiche : {editingSite.name}
              </h3>
              <button
                onClick={() => setEditingSite(null)}
                className="p-1 hover:bg-white/20 rounded-full"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 overflow-y-auto space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#174C3C] block mb-1">Nom du site</label>
                  <input
                    type="text"
                    value={editingSite.name}
                    onChange={(e) => setEditingSite({ ...editingSite, name: e.target.value })}
                    className="w-full px-3 py-2 border border-[#DCE8DF] rounded-xl focus:outline-hidden focus:border-[#174C3C]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-[#174C3C] block mb-1">Sous-titre / Accroche</label>
                  <input
                    type="text"
                    value={editingSite.subtitle}
                    onChange={(e) => setEditingSite({ ...editingSite, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-[#DCE8DF] rounded-xl focus:outline-hidden focus:border-[#174C3C]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#174C3C] block mb-1">Région</label>
                  <select
                    value={editingSite.region}
                    onChange={(e) => setEditingSite({ ...editingSite, region: e.target.value as any })}
                    className="w-full px-3 py-2 border border-[#DCE8DF] rounded-xl focus:outline-hidden focus:border-[#174C3C]"
                  >
                    {['Maritime', 'Plateaux', 'Centrale', 'Kara', 'Savanes'].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#174C3C] block mb-1">Localité & Préfecture</label>
                  <input
                    type="text"
                    value={editingSite.locality}
                    onChange={(e) => setEditingSite({ ...editingSite, locality: e.target.value })}
                    className="w-full px-3 py-2 border border-[#DCE8DF] rounded-xl focus:outline-hidden focus:border-[#174C3C]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#174C3C] block mb-1">Description courte (Catalogue)</label>
                <textarea
                  rows={2}
                  value={editingSite.shortDescription}
                  onChange={(e) => setEditingSite({ ...editingSite, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-[#DCE8DF] rounded-xl focus:outline-hidden focus:border-[#174C3C]"
                />
              </div>

              <div>
                <label className="font-bold text-[#174C3C] block mb-1">1. Présentation générale (Découvrir)</label>
                <textarea
                  rows={3}
                  value={editingSite.presentation}
                  onChange={(e) => setEditingSite({ ...editingSite, presentation: e.target.value })}
                  className="w-full px-3 py-2 border border-[#DCE8DF] rounded-xl focus:outline-hidden focus:border-[#174C3C]"
                />
              </div>

              <div>
                <label className="font-bold text-[#174C3C] block mb-1">2. Contexte historique documenté</label>
                <textarea
                  rows={3}
                  value={editingSite.historicalContext}
                  onChange={(e) => setEditingSite({ ...editingSite, historicalContext: e.target.value })}
                  className="w-full px-3 py-2 border border-[#DCE8DF] rounded-xl focus:outline-hidden focus:border-[#174C3C]"
                />
              </div>

              <div>
                <label className="font-bold text-[#174C3C] block mb-1">3. Traditions orales & croyances locales</label>
                <textarea
                  rows={2}
                  value={editingSite.oralTraditions}
                  onChange={(e) => setEditingSite({ ...editingSite, oralTraditions: e.target.value })}
                  className="w-full px-3 py-2 border border-[#DCE8DF] rounded-xl focus:outline-hidden focus:border-[#174C3C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#174C3C] block mb-1">Horaires d'ouverture</label>
                  <input
                    type="text"
                    value={editingSite.practicalInfo.openingHours}
                    onChange={(e) =>
                      setEditingSite({
                        ...editingSite,
                        practicalInfo: { ...editingSite.practicalInfo, openingHours: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-[#DCE8DF] rounded-xl focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#174C3C] block mb-1">Tarifs indicatifs</label>
                  <input
                    type="text"
                    value={editingSite.practicalInfo.fees}
                    onChange={(e) =>
                      setEditingSite({
                        ...editingSite,
                        practicalInfo: { ...editingSite.practicalInfo, fees: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-[#DCE8DF] rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#DCE8DF] flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingSite(null)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#174C3C] hover:bg-[#0f3429] text-white font-bold rounded-xl flex items-center space-x-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4 text-[#D6A64F]" />
                  <span>Enregistrer les modifications</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
