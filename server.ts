import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_SITES, HeritageSite } from './src/data/sites';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '2mb' }));

// In-memory data store initialized with authentic Togolese heritage sites
let sitesDatabase: HeritageSite[] = [...INITIAL_SITES];

// Google Gen AI Client setup
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Preferred Gemma model as requested by project specification
const GEMMA_MODEL = 'gemma-4-31b-it';
const FALLBACK_MODEL = 'gemini-3.1-flash-lite';

// AI Health & Configuration Status
app.get('/api/ai/status', (req: Request, res: Response) => {
  res.json({
    configured: Boolean(aiClient),
    primaryModel: GEMMA_MODEL,
    fallbackModel: FALLBACK_MODEL,
    hasApiKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Download Project Source ZIP
app.get('/api/download-zip', (req: Request, res: Response) => {
  const filePath = path.resolve(__dirname, 'public', 'miabestory-project.zip');
  res.download(filePath, 'miabestory-project.zip', (err) => {
    if (err) {
      console.error('Erreur téléchargement zip:', err);
      res.status(404).send('Archive du projet introuvable.');
    }
  });
});

// REST API: Sites listing
app.get('/api/sites', (req: Request, res: Response) => {
  const { region, category, search } = req.query;
  let results = [...sitesDatabase];

  if (region && region !== 'Toutes les régions') {
    results = results.filter((s) => s.region.toLowerCase() === String(region).toLowerCase());
  }

  if (category && category !== 'all' && category !== 'Toutes les catégories') {
    results = results.filter(
      (s) => s.category === category || s.categoryLabel.toLowerCase().includes(String(category).toLowerCase())
    );
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.locality.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  res.json({ sites: results, count: results.length });
});

// REST API: Single site
app.get('/api/sites/:id', (req: Request, res: Response) => {
  const site = sitesDatabase.find((s) => s.id === req.params.id || s.slug === req.params.id);
  if (!site) {
    return res.status(404).json({ error: 'Site touristique introuvable.' });
  }
  res.json({ site });
});

// REST API: Admin update or add site
app.post('/api/sites', (req: Request, res: Response) => {
  const siteData: HeritageSite = req.body;
  if (!siteData.name || !siteData.region) {
    return res.status(400).json({ error: 'Le nom et la région sont requis.' });
  }

  const existingIndex = sitesDatabase.findIndex((s) => s.id === siteData.id);
  if (existingIndex >= 0) {
    sitesDatabase[existingIndex] = { ...sitesDatabase[existingIndex], ...siteData };
    return res.json({ success: true, site: sitesDatabase[existingIndex], action: 'updated' });
  } else {
    const newSite = {
      ...siteData,
      id: siteData.id || `site-${Date.now()}`,
      slug: siteData.slug || siteData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };
    sitesDatabase.unshift(newSite);
    return res.status(201).json({ success: true, site: newSite, action: 'created' });
  }
});

// REST API: Admin reset dataset
app.post('/api/sites/reset', (req: Request, res: Response) => {
  sitesDatabase = [...INITIAL_SITES];
  res.json({ success: true, count: sitesDatabase.length });
});

// Helper: build documentary grounding text for a site
function buildSiteContext(site: HeritageSite): string {
  const otherSitesSummary = sitesDatabase
    .filter((s) => s.id !== site.id)
    .map((s) => `- ${s.name} (${s.region}, ${s.categoryLabel})`)
    .join('\n');

  return `
CONTEXTE DOCUMENTAIRE DU SITE TOUJOURS PRIORITAIRE :
Nom du site : ${site.name} (${site.categoryLabel})
Localisation : ${site.locality}, Préfecture de ${site.prefecture}, Région : ${site.region}
Coordonnées GPS : Lat ${site.coordinates.lat}, Lng ${site.coordinates.lng}
Distance & trajet depuis Lomé : ${site.distanceFromLome || 'Accessible par la route'}

Présentation générale :
${site.presentation}

Intérêt touristique et culturel :
${site.touristicInterest}

Contexte historique documenté :
${site.historicalContext}
Personnages et acteurs clés : ${site.keyFigures.join(', ')}

Chronologie historique vérifiée :
${site.timeline.map((t) => `- ${t.period} : ${t.event} (Réf : ${t.sourceRef || 'Archive'})`).join('\n')}

Traditions orales, croyances et mémoire locale :
- Traditions orales : ${site.oralTraditions}
- Mythes et légendes : ${site.legendsAndBeliefs}
- Pratiques culturelles et rituels : ${site.culturalPractices}
- Statut mémoriel : ${site.memoryStatusNotice}
- Étiquette et respect coutumier : ${site.culturalEtiquette || 'Respecter les dignitaires locaux et demander avant de photographier'}

Informations pratiques pour la visite :
- Horaires : ${site.practicalInfo.openingHours}
- Tarifs / Droits d'entrée : ${site.practicalInfo.fees}
- Présence de guides : ${site.practicalInfo.guidanceAvailable ? 'Oui, guides locaux agréés disponibles' : 'Visite libre'}
- Meilleure saison : ${site.practicalInfo.bestSeason}
- Accès : ${site.practicalInfo.accessRoute}

Sources documentaires de référence :
${site.sources.map((s) => `- ${s.title} (${s.type}) par ${s.authorOrOrg} [Vérifié le ${s.verificationDate}]`).join('\n')}

AUTRES SITES DU PATRIMOINE TOGOLAIS POUR ÉVENTUELLE COMPARAISON OU TRANSVERSALITÉ :
${otherSitesSummary}
`;
}

// REST API: Guide Conversationnel Gemma (RAG Context Grounding)
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { siteId, query, history = [] } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Une question ou message est requis.' });
  }

  // Find site context if siteId is specified
  const site = siteId ? sitesDatabase.find((s) => s.id === siteId || s.slug === siteId) : null;

  const allSitesIndex = sitesDatabase
    .map((s) => `- ${s.name} (${s.region}, ${s.categoryLabel}, ${s.locality}) : ${s.shortDescription}`)
    .join('\n');

  const siteContextText = site
    ? buildSiteContext(site)
    : `
PANORAMA COMPLET DU PATRIMOINE DU TOGO :
${allSitesIndex}

L'utilisateur pose une question générale sur le patrimoine touristique, l'histoire et les mémoires culturelles du Togo.
`;

  const systemInstruction = `
Tu es le Guide Conversationnel Officiel de miabeStory, la plateforme numérique d'excellence consacrée au patrimoine, à l'histoire et à la mémoire culturelle du Togo.

EXIGENCES ABSOLUES DE PRÉCISION ET DE PERTINENCE :
1. TON ET POSTURE :
   - Exprime-toi dans un français soigné, chaleureux, élégant et pédagogue.
   - Adopte une posture d'historien et de passeur de mémoire togolais respectueux.

2. RIGUEUR MÉMORIELLE ET TYPOLOGIE DES SAVOIRS :
   - Distingue TOUJOURS avec clarté :
     * Les faits historiques attestés par des archives écrites ou des fouilles archéologiques.
     * Les traditions orales transmises de génération en génération (noblesse de la transmission orale africaine).
     * Les mythes cosmogoniques ou croyances spirituelles (Kuié, vodous d'eau, esprits de l'Atakora).
   - N'invente JAMAIS d'événements, de dates ou de citations fictives. Si un point n'est pas documenté, dis-le avec franchise (« Les sources archivistiques disponibles ne précisent pas... »).

3. CITATION SYSTÉMATIQUE DES SOURCES :
   - Mentionne les sources scientifiques et institutionnelles répertoriées (UNESCO, Ministère de la Culture du Togo, travaux du Prof. Nicoué Gayibor, Université de Lomé, etc.).

4. STRUCTURE VISUELLE DE RÉPONSE :
   - Structure tes réponses avec des paragraphes aérés, du texte en gras pour les concepts clés ou les mots en langues locales (ex: Takienta, Gatovoudo, Tata Somba, Otammari), et des puces si plusieurs points sont abordés.

${siteContextText}
`;

  // If no AI key is configured, provide a clear fallback with indication
  if (!aiClient) {
    return res.json({
      response: `[Mode Démonstration hors-ligne] La clé API pour le modèle Gemma n'est pas configurée dans l'environnement. Voici une réponse préparée à partir de la fiche documentaire : ${site ? site.presentation : "miabeStory vous invite à découvrir les merveilles patrimoniales du Togo."}`,
      modelUsed: 'Démonstration simulée (Clé API absente)',
      isSimulated: true,
      sourcesUsed: site ? site.sources.map((s) => s.title) : [],
      suggestions: [
        'Quelle est l’origine historique de ce lieu ?',
        'Quelles traditions sont encore vivantes ici ?',
        'Comment préparer au mieux ma visite ?',
      ],
    });
  }

  // Attempt generation with Gemma 4-31B-IT
  let modelAttempt = GEMMA_MODEL;
  try {
    const promptWithHistory = `
${history.map((h: { role: string; content?: string; text?: string }) => `${h.role === 'user' ? 'Visiteur' : 'Guide'}: ${h.content || h.text}`).join('\n')}
Visiteur: ${query}
Guide miabeStory:`;

    // Call Gemma with a 15-second timeout safeguard to protect UX from upstream 500/queuing
    const gemmaPromise = aiClient.models.generateContent({
      model: modelAttempt,
      contents: promptWithHistory,
      config: {
        systemInstruction,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Délai d’attente dépassé sur le modèle Gemma upstream')), 14000)
    );

    const response = await Promise.race([gemmaPromise, timeoutPromise]);
    const replyText = response.text || "Pardonnez-moi, je n'ai pas pu formuler de réponse à partir des archives.";

    // Generate contextual follow-up questions
    const suggestions: string[] = [
      site ? `Quelle est la symbolique de ce lieu pour le peuple togolais ?` : `Quels sont les sites incontournables du Togo ?`,
      site ? `Quelles sont les traditions orales liées à cet endroit ?` : `Comment l'architecture traditionnelle a-t-elle évolué ?`,
      site ? `Quels conseils donneriez-vous pour une visite respectueuse ?` : `Quels lieux mémoriels visiter dans la région Maritime ?`,
    ];

    return res.json({
      response: replyText,
      modelUsed: `Google Gemma (${modelAttempt})`,
      sourcesUsed: site ? site.sources.map((s) => `${s.title} (${s.authorOrOrg})`) : ['Archives générales du Togo'],
      suggestions,
      isSimulated: false,
    });
  } catch (err: any) {
    console.warn(`Gemma call failed with ${modelAttempt}:`, err?.message);

    // Fallback to gemini-3.8-flash if Gemma has transient demand error
    try {
      modelAttempt = FALLBACK_MODEL;
      const fallbackResponse = await aiClient.models.generateContent({
        model: modelAttempt,
        contents: query,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({
        response: fallbackResponse.text,
        modelUsed: `Secours : ${modelAttempt} (Gemma indisponible temporairement)`,
        sourcesUsed: site ? site.sources.map((s) => `${s.title} (${s.authorOrOrg})`) : [],
        suggestions: [
          'Quelle est l’histoire de ce lieu ?',
          'Quelles traditions y sont associées ?',
        ],
        isSimulated: false,
      });
    } catch (fallbackErr: any) {
      console.error('All AI attempts failed:', fallbackErr?.message);
      return res.status(503).json({
        error: `Le service d'intelligence artificielle est momentanément indisponible (${fallbackErr?.message || 'Erreur réseau'}).`,
        modelAttempted: modelAttempt,
      });
    }
  }
});

// REST API: Mode Narratif Immersif « Raconte-moi ce lieu »
app.post('/api/ai/story', async (req: Request, res: Response) => {
  const { siteId, style = 'immersion' } = req.body;

  const site = sitesDatabase.find((s) => s.id === siteId || s.slug === siteId);
  if (!site) {
    return res.status(404).json({ error: 'Site non trouvé.' });
  }

  // Pre-configured authentic curated story
  if (!aiClient) {
    let chosenStory = site.immersiveStory.fullVersion;
    if (style === 'short') chosenStory = site.immersiveStory.shortVersion;
    if (style === 'youth') chosenStory = site.immersiveStory.youthVersion;

    return res.json({
      title: site.immersiveStory.title,
      story: chosenStory,
      disclaimer: site.immersiveStory.disclaimer,
      modelUsed: 'Récit documentaire miabeStory (Mode hors-ligne)',
      isSimulated: true,
      audioNarrationSnippet: site.audioNarrationSnippet,
    });
  }

  try {
    const stylePrompt =
      style === 'youth'
        ? 'Rédige une version vivante, imagée et captivante accessible pour un jeune public (enfants / élèves), en insistant sur l’émerveillement et les leçons de courage.'
        : style === 'short'
        ? 'Rédige une version concise en 2 ou 3 paragraphes denses et puissants, idéale pour une lecture rapide sur mobile.'
        : 'Rédige une narration immersive complète en 4 à 5 paragraphes denses et sensoriels (odeurs, sons, lumières, voix), faisant vivre le site comme si le lecteur y était.';

    const systemInstruction = `
Tu es le conteur et narrateur culturel de miabeStory.
Tu dois transformer la documentation du site togolais en un récit vivant, sensible et mémorable.
Important : Tu dois distinguer la reconstitution narrative des faits historiques avérés, en respectant la dignité du lieu.

${buildSiteContext(site)}
`;

    const gemmaStoryPromise = aiClient.models.generateContent({
      model: GEMMA_MODEL,
      contents: `Génère le récit « Raconte-moi ce lieu » pour : ${site.name}.\nFormat demandé : ${stylePrompt}`,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Délai d’attente dépassé sur le modèle Gemma upstream')), 14000)
    );

    const response = await Promise.race([gemmaStoryPromise, timeoutPromise]);

    return res.json({
      title: `${site.immersiveStory.title}`,
      story: response.text || site.immersiveStory.fullVersion,
      disclaimer: 'Reconstitution narrative générée par le modèle Gemma à partir des sources historiques vérifiées.',
      modelUsed: `Google Gemma (${GEMMA_MODEL})`,
      isSimulated: false,
      audioNarrationSnippet: site.audioNarrationSnippet,
    });
  } catch (err: any) {
    console.warn('Gemma story generation failed, returning curated archive story:', err?.message);
    let chosenStory = site.immersiveStory.fullVersion;
    if (style === 'short') chosenStory = site.immersiveStory.shortVersion;
    if (style === 'youth') chosenStory = site.immersiveStory.youthVersion;

    return res.json({
      title: site.immersiveStory.title,
      story: chosenStory,
      disclaimer: `${site.immersiveStory.disclaimer} (Fallback après indisponibilité temporaire)`,
      modelUsed: 'Archive documentaire validée',
      isSimulated: true,
      audioNarrationSnippet: site.audioNarrationSnippet,
    });
  }
});

// REST API: Audio Synthesis (Gemini 3.8 Flash Lite TTS)
app.post('/api/ai/tts', async (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Texte requis pour la synthèse vocale.' });
  }

  if (!aiClient) {
    return res.status(503).json({ error: 'Service TTS indisponible sans clé API.' });
  }

  try {
    const ttsText = text.slice(0, 800); // Keep reasonable sample length for narration
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: ttsText,
              speechMetadata: {
                style: 'Guide touristique et culturel chaleureux, voix posée et narrative en français',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'Aucun flux audio généré par le modèle.' });
    }

    res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
      modelUsed: 'gemini-3.8-flash-lite-tts',
    });
  } catch (e: any) {
    console.error('TTS error:', e?.message);
    res.status(500).json({ error: 'Erreur lors de la génération audio.' });
  }
});

// Configure Vite middleware in development or static serve in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(`  ★ miabeStory — Le Togo, ses lieux, ses histoires ★`);
    console.log(`  Serveur opérationnel sur le port ${PORT}`);
    console.log(`  Modèle IA configuré : ${GEMMA_MODEL}`);
    console.log(`======================================================\n`);
  });
}

startServer();
