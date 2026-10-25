# miabeStory — Le Togo, ses lieux, ses histoires 🇹🇬

Plateforme numérique de référence consacrée à la découverte touristique, à l'histoire vérifiée et à la mémoire culturelle du Togo, enrichie d'un guide conversationnel IA et de récits immersifs.

---

## 1. Vision et Proposition de Valeur

**miabeStory** réunit trois dimensions complémentaires :
- **Découvrir** : explorer le catalogue des destinations des 5 régions du Togo (Maritime, Plateaux, Centrale, Kara, Savanes).
- **Comprendre** : accéder à des fiches documentaires rigoureuses, distinguant expressément l'histoire vérifiée/archivée des traditions orales et des légendes.
- **Vivre les récits** : interagir en direct avec un guide IA et vivre chaque lieu à travers une narration immersive (« Raconte-moi ce lieu ») avec écoute audio.

---

## 2. Charte Graphique & Identité Visuelle

L'application applique scrupuleusement la charte graphique et intègre le logo officiel :
- **Vert forêt (`#174C3C`)** : structuration, en-tête, boutons principaux et identité culturelle.
- **Or patrimonial (`#D6A64F`)** : accents visuels, repères, étoiles et détails de valorisation.
- **Ivoire (`#F7F4EC`)** : fond principal chaleureux et surfaces de lecture éditoriale.
- **Charbon (`#202722`)** : typographie contrastée et titres.
- **Vert doux (`#DCE8DF`)** : arrière-plans de cartes secondaires et séparateurs.
- **Typographie** : *Playfair Display* pour les titres éditoriaux et *Inter* pour les textes d'interface.
- **Logo officiel** : intégré dans la barre de navigation, l'en-tête, le pied de page et le favicon.

---

## 3. Architecture Technique

Le projet adopte une architecture full-stack moderne et modulaire :

### Frontend
- **React 19 & Vite 8** : interface réactive, rapide et responsive (ordinateur, tablette, mobile).
- **Tailwind CSS v4** : styles thématiques basés sur les variables de la charte.
- **Lucide React** : iconographie cohérente (repères géographiques, audio, guide IA, sources).
- **Lecteur Audio & Synthèse** : prise en charge de la synthèse vocale (Web Speech API et Gemini TTS).
- **Carte Interactive SVG** : cartographie du Togo reliant les coordonnées GPS réelles de chaque site à la fiche détaillée et au calcul d'itinéraire Google Maps.

### Backend & API REST
- **Node.js & Express** : serveur full-stack servant l'API REST et montant les middlewares Vite en développement.
- **API Endpoints** :
  - `GET /api/sites` : catalogue complet, filtrage par région, catégorie et recherche textuelle.
  - `GET /api/sites/:id` : fiche détaillée d'un site.
  - `POST /api/sites` : ajout ou modification d'une fiche (Administration).
  - `POST /api/sites/reset` : réinitialisation avec les données authentifiées de démonstration.
  - `GET /api/ai/status` : état de configuration de la clé API et du modèle actif.
  - `POST /api/ai/chat` : Guide conversationnel RAG (Génération augmentée par récupération documentaire).
  - `POST /api/ai/story` : Générateur de récits immersifs « Raconte-moi ce lieu » (formats immersion, court, jeunesse).
  - `POST /api/ai/tts` : Synthèse vocale haute fidélité pour la narration.

### Intelligence Artificielle & Intégration Gemma
- **SDK officiel** : `@google/genai` (version 2.4+).
- **Modèle principal** : `gemma-4-31b-it` (famille Google Gemma).
- **Sécurité et secret** : La clé API `GEMINI_API_KEY` est conservée exclusivement côté serveur et n'est jamais exposée au navigateur.
- **Transparence totale** : Le modèle ayant généré chaque réponse est explicitement affiché (Gemma, relais transparent en cas d'indisponibilité temporaire, ou mode démonstration simulé).

---

## 4. Arborescence du Projet

```text
/
├── .env.example                     # Exemple de variables d'environnement
├── index.html                       # Entry-point HTML avec polices Playfair & Inter
├── metadata.json                    # Métadonnées du projet AI Studio
├── package.json                     # Dépendances et scripts de lancement
├── server.ts                        # Serveur Express full-stack + logique Gemma
├── tsconfig.json                    # Configuration TypeScript
├── vite.config.ts                   # Configuration Vite
├── public/
│   └── assets/aistudio/             # Logo officiel miabeStory et documents
├── src/
│   ├── main.tsx                     # Montage React
│   ├── App.tsx                      # Composant racine orchestrant les 6 vues
│   ├── index.css                    # Thème Tailwind et import des variables charte
│   ├── data/
│   │   └── sites.ts                 # Base documentaire des sites togolais
│   └── components/
│       ├── Navbar.tsx               # Barre de navigation et statut Gemma
│       ├── Hero.tsx                 # En-tête d'accueil avec recherche et accroche
│       ├── SiteCard.tsx             # Carte de présentation d'une destination
│       ├── SiteDetailModal.tsx      # Fiche complète en 6 sections documentées
│       ├── AIGuidePanel.tsx         # Guide IA conversationnel RAG
│       ├── StorytellingPlayer.tsx   # Lecteur audio et expérience « Raconte-moi »
│       ├── InteractiveMap.tsx       # Cartographie interactive des 5 régions
│       ├── AdminPanel.tsx           # Interface de gestion et contrôle éditorial
│       └── Footer.tsx               # Pied de page avec engagement éthique
```

---

## 5. Guide de Lancement et Commandes

### 1. Installation des dépendances
```bash
npm install
```

### 2. Configuration des variables d'environnement
Copiez `.env.example` en `.env` :
```bash
cp .env.example .env
```
Renseignez votre clé API Google :
```env
GEMINI_API_KEY="VOTRE_CLE_API"
```

### 3. Lancement de l'application (Dev Full-Stack)
```bash
npm run dev
```
L'application est accessible sur : `http://localhost:3000`

### 4. Compilation pour la production
```bash
npm run build
npm start
```

---

## 6. Destinations de Démonstration Référencées

1. **Koutammakou, le pays des Batammariba** (Patrimoine mondial de l'UNESCO — Région de la Kara).
2. **Maison des Esclaves d'Agbodrafo / Woold Home** (Mémoire de la traite négrière — Région Maritime).
3. **Cascade de Kpimé et le Mont Agou** (Toit du Togo et écotourisme — Région des Plateaux).
4. **Togoville et la Forêt Sacrée** (Traité historique de 1884 et spiritualité — Région Maritime).
5. **Hauts-Fourneaux traditionnels de Bassar** (Métallurgie séculaire du fer — Région de la Kara).
6. **Grottes et Greniers de Nok et Tandjouaré** (Refuge troglodytique — Région des Savanes).
7. **Monument de l'Indépendance et Palais de Lomé** (Mémoire civique et art — Région Maritime).

---

## 7. Fonctionnalités Opérationnelles

- [x] Page d'accueil professionnelle avec accroche officielle de la charte.
- [x] Annuaire complet avec recherche instantanée et filtres (Région, Catégorie, Mots-clés).
- [x] Fiches détaillées en 6 sections (Découvrir, Histoire, Traditions & Mémoire, Vivre le récit, Préparer sa visite, Sources documentaires).
- [x] Guide conversationnel IA alimenté par Google Gemma avec RAG documentaire strict.
- [x] Mode narratif immersif « Raconte-moi ce lieu » en 3 variantes (immersion, courte, jeunesse).
- [x] Guide audio avec commandes lecture/pause et vitesses de lecture réglables.
- [x] Carte interactive des 5 régions du Togo avec calcul d'itinéraire Google Maps.
- [x] Espace d'administration pour éditer les fiches, contrôler les dates de vérification et exporter les données en JSON.

---

## 8. Limitations Connues et Perspectives Futures

- **Perspectives v2** : Réservation guidée en ligne, audioguide multilingue (Éwé, Kabyè, Anglais), contributions communautaires vérifiées avec workflow de relecture par les comités locaux du patrimoine.
