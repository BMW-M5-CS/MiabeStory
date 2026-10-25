export interface PracticalInfo {
  openingHours: string;
  fees: string;
  guidanceAvailable: boolean;
  bestSeason: string;
  contactInfo?: string;
  accessRoute: string;
}

export interface TimelineEvent {
  period: string;
  event: string;
  sourceRef?: string;
}

export interface SourceDocument {
  title: string;
  type: 'UNESCO' | 'Institutionnel' | 'Ouvrage' | 'Archive' | 'Tradition orale' | 'Recherche universitaire';
  authorOrOrg: string;
  year?: string;
  url?: string;
  verificationDate: string;
  notes?: string;
}

export interface SiteStory {
  title: string;
  fullVersion: string;
  shortVersion: string;
  youthVersion: string;
  disclaimer: string;
}

export interface HeritageSite {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  region: 'Maritime' | 'Plateaux' | 'Centrale' | 'Kara' | 'Savanes';
  prefecture: string;
  locality: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  category: 'patrimoine-mondial' | 'historique' | 'naturel' | 'culturel' | 'architectural' | 'memorial';
  categoryLabel: string;
  coverImage: string;
  imageCaption: string;
  galleryImages: string[];
  tags: string[];
  shortDescription: string;
  
  // 1. Découvrir le lieu
  touristicInterest: string;
  presentation: string;
  practicalInfo: PracticalInfo;

  // 2. Comprendre son histoire
  historicalContext: string;
  keyFigures: string[];
  timeline: TimelineEvent[];
  isVerifiedHistory: boolean;

  // 3. Traditions et mémoire
  oralTraditions: string;
  legendsAndBeliefs: string;
  culturalPractices: string;
  memoryStatusNotice: string;

  // 4. Vivre le récit
  immersiveStory: SiteStory;

  // 5. Sources documentaires
  sources: SourceDocument[];

  // 6. Audio
  audioNarrationSnippet: string;
  audioDurationMinutes: number;
}

export const INITIAL_SITES: HeritageSite[] = [
  {
    id: 'koutammakou-batammariba',
    name: 'Koutammakou, le pays des Batammariba',
    slug: 'koutammakou-batammariba',
    subtitle: 'Terre d’architecture fortifiée et harmonie cosmogonique',
    region: 'Kara',
    prefecture: 'Kéran',
    locality: 'Nadoba & Warengo (frontière Togo-Bénin)',
    coordinates: {
      lat: 10.0683,
      lng: 1.1467
    },
    category: 'patrimoine-mondial',
    categoryLabel: 'Patrimoine mondial de l’UNESCO',
    coverImage: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Une Takienta traditionnelle (Tata Somba) érigée en banco avec ses tours à greniers coniques.',
    galleryImages: [
      'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['UNESCO', 'Tata Somba', 'Batammariba', 'Architecture vernaculaire', 'Rituels'],
    shortDescription: 'Inscrit sur la liste du patrimoine mondial de l’UNESCO en 2004, le Koutammakou témoigne du génie architectural et spirituel du peuple Batammariba, dont les maisons-forteresses en terre incarnent un modèle vivant de symbiose entre l’homme et la nature.',
    presentation: 'Le paysage culturel du Koutammakou s’étend sur environ 50 000 hectares au nord-est du Togo. Ce territoire est façonné par les Takienta (singulier de Tata Somba), impressionnantes habitations de terre à deux étages combinant fortification défensive, espace familial, sanctuaire pour les ancêtres et greniers à céréales. Les Batammariba (« les maîtres bâtisseurs de la terre ») y maintiennent un mode de vie profondément ancré dans le respect des esprits de la terre, des arbres séculaires et des collines sacrées.',
    touristicInterest: 'Une immersion dans l’une des architectures vernaculaires les plus singulières et poétiques du continent africain. Les visiteurs peuvent y comprendre la symbolique du corps humain reflétée dans chaque recoin de la maison, admirer la précision du travail de la terre glaise pétrie à la main, et contempler des collines rocheuses parsemées de baobabs millénaires.',
    practicalInfo: {
      openingHours: 'Accessible toute l’année. Visite des concessions de 08h00 à 17h30.',
      fees: 'Droit d’entrée géré par l’Association pour la Sauvegarde du Koutammakou (environ 3 000 à 5 000 FCFA avec guide agréé).',
      guidanceAvailable: true,
      bestSeason: 'De novembre à février (saison sèche, lumière dorée et température clémente).',
      contactInfo: 'Antenne de gestion du site du Koutammakou — Nadoba / Direction régionale de la Culture de Kara.',
      accessRoute: 'Route goudronnée de Lomé à Kara (410 km), puis piste praticable vers Kandé et Nadoba (environ 50 km).'
    },
    historicalContext: 'L’installation des Batammariba dans les contreforts de l’Atakora remonte à plusieurs siècles. Menacés au XVIIe et XVIIIe siècle par les razzias esclavagistes des cavaliers Bariba et du royaume du Dahomey, ainsi que par les pressions des conquérants extérieurs, ils ont conçu ces demeures comme des bastions imprenables. Les murs épais, la terrasse de guet, l’obscurité voulue du rez-de-chaussée et les embrasures étroites permettaient aux archers d’assurer la défense du lignage.',
    keyFigures: ['Kouié (Dieu créateur dans la cosmogonie Otammari)', 'Les bâtisseurs du clan des Otammari', 'Anciens chefs coutumiers de Nadoba'],
    timeline: [
      { period: 'XVIIe - XVIIIe siècle', event: 'Structuration défensive des habitats fortifiés face aux incursions guerrières.', sourceRef: 'Études anthropologiques UNESCO' },
      { period: '1900 - 1914', event: 'Résistance acharnée des Batammariba à la pénétration coloniale allemande dans le Haut-Togo.', sourceRef: 'Archives nationales du Togo' },
      { period: '2004', event: 'Inscription du paysage culturel du Koutammakou au Patrimoine Mondial de l’UNESCO.', sourceRef: 'Dossier d’inscription UNESCO n°1140' },
      { period: '2023', event: 'Extension transfrontalière de l’inscription au Bénin pour englober la continuité du territoire Batammariba.', sourceRef: 'Comité du patrimoine mondial' }
    ],
    isVerifiedHistory: true,
    oralTraditions: 'Chez les Batammariba, chaque maison est conçue comme un être vivant doté de souffle et d’yeux (les orifices de ventilation). Les cornes sculptées en banco au-dessus de l’entrée symbolisent la virilité et le lien avec les taureaux sacrés. Selon la tradition transmise par les aînés, nulle pierre ni brique de terre cuite ne doit être posée sans libation préalable à Kuié et aux divinités de la terre (Oyinkwenta).',
    legendsAndBeliefs: 'La légende rapporte que le premier Batammariba tomba du ciel en tenant une poignée de terre glaise rouge et un arc. Les ancêtres ne meurent jamais : leurs âmes continuent d’habiter les autels coniques de banco érigés devant le seuil de chaque Takienta.',
    culturalPractices: 'Le rituel d’initiation masculine Difouani (ou Dikuntri pour les femmes) a lieu tous les quatre ans. Il marque le passage à l’âge adulte et la capacité à bâtir sa propre Takienta sans aide extérieure.',
    memoryStatusNotice: 'Informations issues de la tradition orale collectée auprès des initiés de Nadoba, corroborées par les mémoires de l’Université de Lomé.',
    immersiveStory: {
      title: 'L’aube sur les toits d’argile du Koutammakou',
      fullVersion: 'La brume de l’harmattan enveloppe encore les crêtes de l’Atakora lorsque les premiers rayons du soleil enflamment la terre ocre. Devant vous se dresse la Takienta, surgie du sol comme un temple d’argile vivante. À son seuil, le vieil ancien Koutan pose ses mains calleuses sur le linteau de bois d’iroko. « Cette maison n’est pas qu’un toit, murmure-t-il, c’est le corps de nos pères ». Au rez-de-chaussée, le silence est sacré, tempéré par la fraîcheur des murs épais. On monte à l’étage par un tronc sculpté d’encoches : la terrasse s’ouvre sur le ciel immense. Les greniers coniques, coiffés de chapeaux de paille tressée, semblent monter la garde face aux collines lointaines. Ici, l’histoire ne s’écrit pas dans des parchemins mais se modèle dans la terre avec de l’eau, de la paille et la mémoire des défunts.',
      shortVersion: 'Au cœur du nord togolais, le Koutammakou dresse ses châteaux de terre à deux étages. Les Batammariba y ont sculpté un habitat où chaque pierre, chaque grenier conique et chaque autel dialogue avec le ciel et la mémoire des ancêtres.',
      youthVersion: 'Imagine un vrai château fort miniature, entièrement fabriqué en boue séchée et en paille ! À l’intérieur, les animaux dorment en bas pour être protégés, et la famille vit tout en haut sous les étoiles. Les tours ressemblent à des fusées de terre qui gardent le mil récolté !',
      disclaimer: 'Narration immersive rédigée à partir des éléments architecturaux et anthropologiques documentés par l’UNESCO et les récits de voyage.'
    },
    sources: [
      {
        title: 'Dossier d’inscription du Paysage culturel du Koutammakou au Patrimoine mondial',
        type: 'UNESCO',
        authorOrOrg: 'Centre du patrimoine mondial de l’UNESCO',
        year: '2004',
        url: 'https://whc.unesco.org/fr/list/1140',
        verificationDate: '2024-03-12',
        notes: 'Texte officiel décrivant les critères (v) et (vi).'
      },
      {
        title: 'Les Batammariba : Guerriers souverains du nord Togo',
        type: 'Ouvrage',
        authorOrOrg: 'Dominique Sewane (anthropologue)',
        year: '2002',
        verificationDate: '2023-11-15'
      },
      {
        title: 'Inventaire général du patrimoine culturel togolais',
        type: 'Institutionnel',
        authorOrOrg: 'Ministère de la Communication, des Arts et de la Culture du Togo',
        year: '2019',
        verificationDate: '2024-01-20'
      }
    ],
    audioNarrationSnippet: 'Écoutez le souffle du vent entre les greniers coniques du Koutammakou. Vous êtes au nord du Togo, dans un territoire où chaque maison est un corps vivant façonné par la terre...',
    audioDurationMinutes: 3.5
  },
  {
    id: 'maison-esclaves-agbodrafo',
    name: 'Maison des Esclaves d’Agbodrafo (Woold Home)',
    slug: 'maison-esclaves-agbodrafo',
    subtitle: 'Lieu de mémoire de la traite transatlantique et du Puits des Enchaînés',
    region: 'Maritime',
    prefecture: 'Lacs',
    locality: 'Agbodrafo (Porto-Seguro)',
    coordinates: {
      lat: 6.2044,
      lng: 1.4828
    },
    category: 'memorial',
    categoryLabel: 'Lieu de mémoire & Histoire',
    coverImage: 'https://images.unsplash.com/photo-1590845947670-c009801ffa74?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'La bâtisse historique de style afro-brésilien d’Agbodrafo abritant le cachot sous son plancher.',
    galleryImages: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['Mémoire', 'Traite négrière', 'Esclavage', 'Agbodrafo', 'Gatovoudo', 'Histoire'],
    shortDescription: 'Témoin poignant de la déportation clandestine au XIXe siècle, la Maison des Esclaves d’Agbodrafo conserve un cachot souterrain de seulement 1,50 mètre de haut où s’entassaient les captifs avant leur traversée sans retour.',
    presentation: 'Située sur le cordon littoral entre l’océan Atlantique et le lac Togo, la maison Wood (dite Woold Home) a été construite vers 1835 par le marchand négrier écossais William Wood. Derrière son élégante façade coloniale de plain-pied se cache un sous-sol exigu, obscur et étouffant. Les captifs venus de l’intérieur des terres y étaient clandestinement séquestrés pour échapper aux patrouilles de la marine britannique qui pourchassait la traite devenue illégale.',
    touristicInterest: 'Un lieu de recueillement et de transmission pédagogique incontournable pour la jeunesse togolaise et la diaspora mondiale. La visite permet de descendre quelques marches pour ressentir l’atmosphère confinée du cachot, d’observer les chaînes et fers d’époque, et de relier cette étape au célèbre « Puits des Enchaînés » (Gatovoudo) situé à Togoville.',
    practicalInfo: {
      openingHours: 'Ouvert du mardi au dimanche de 09h00 à 18h00.',
      fees: 'Visite guidée : 2 000 FCFA résidents, 3 000 FCFA non-résidents. Gratuit pour les groupes scolaires sur réservation.',
      guidanceAvailable: true,
      bestSeason: 'Accessible toute l’année avec brise côtière marine.',
      contactInfo: 'Comité de gestion du site mémoriel d’Agbodrafo / Office National du Tourisme du Togo.',
      accessRoute: 'Situé sur la Route Nationale 2 (Lomé-Aného), à 30 km à l’est du centre-ville de Lomé.'
    },
    historicalContext: 'Même après l’abolition officielle de la traite négrière en Angleterre en 1807 et en France en 1848, le commerce illégal des êtres humains s’est poursuivi le long de la Côte des Esclaves. Agbodrafo offrait une position stratégique : les navires négriers mouillaient au large hors de portée, tandis que des barques de pêcheurs transportaient les captifs de nuit à travers la barre de l’océan.',
    keyFigures: ['William Wood (armateur et trafiquant)', 'Captifs anonymes de la vallée du Mono et de l’Atakora', 'Guides mémoriaux locaux'],
    timeline: [
      { period: 'Vers 1835', event: 'Construction de la maison à double fond par William Wood.', sourceRef: 'Inventaire des monuments historiques du Togo' },
      { period: '1850 - 1860', event: 'Embarquements clandestins nocturnes vers les plantations du Brésil et de Cuba.', sourceRef: 'Recherches Faculté des Lettres de Lomé' },
      { period: '2000', event: 'Aménagement du site en musée de la mémoire et réhabilitation par le ministère de la Culture.', sourceRef: 'Rapport national de valorisation' }
    ],
    isVerifiedHistory: true,
    oralTraditions: 'Les anciens racontent que la nuit, des bruits de fers et des complaintes montaient de la terre. Avant de monter dans les chaloupes, les captifs étaient conduits au bord du lac pour un dernier bain rituel destiné à « effacer leur nom et leur identité », afin qu’ils ne puissent plus retrouver le chemin de leur village.',
    legendsAndBeliefs: 'Le Puits des Enchaînés (Gatovoudo) est encore aujourd’hui entouré d’un respect sacré. Les descendants de captifs venus d’Amériques y viennent accomplir des prières de réconciliation avec la terre ancestrale.',
    culturalPractices: 'Cérémonie annuelle du souvenir de l’abolition de l’esclavage et recueillement de la communauté afro-brésilienne des Aguda du Togo.',
    memoryStatusNotice: 'Faits historiques vérifiés par les travaux du professeur Nicoué Gayibor et les archives coloniales maritimes.',
    immersiveStory: {
      title: 'Le murmure des fers sous le plancher de bois',
      fullVersion: 'Sous la maison ensoleillée aux volets verts d’Agbodrafo, la terre garde un froid que le soleil d’Afrique n’a jamais pu réchauffer. Il faut courber l’échine pour franchir l’ouverture. Le plafond ne dépasse pas la hauteur d’un homme assis. C’est là, dans cette ombre lourde, que des dizaines d’hommes et de femmes ont passé leurs dernières nuits sur la terre de leurs aïeux. À quelques mètres, les vagues de l’océan grondent contre la grève de sable fin. Pour eux, ce grondement était l’annonce du grand départ sans retour. Aujourd’hui, le silence qui règne dans la pièce n’est pas un oubli : c’est une promesse solennelle que leur mémoire ne s’éteindra jamais.',
      shortVersion: 'À Agbodrafo, sous une maison bourgeoise du XIXe siècle, se cache une trappe vers la douleur. Les esclaves y attendaient dans le noir complet les pirogues de la nuit. Un pèlerinage de mémoire pour ne jamais oublier.',
      youthVersion: 'C’est un lieu pour apprendre et respecter ceux qui ont souffert autrefois. Des personnes courageuses y ont été enfermées injustement il y a longtemps, mais aujourd’hui nous venons les honorer pour que chacun reste libre pour toujours.',
      disclaimer: 'Texte d’évocation rédigé dans un esprit de dignité mémorielle et de respect historique.'
    },
    sources: [
      {
        title: 'Le Togo et la traite négrière transatlantique',
        type: 'Recherche universitaire',
        authorOrOrg: 'Prof. Nicoué Lodjou Gayibor (Historien togolais)',
        year: '2008',
        verificationDate: '2023-10-05',
        notes: 'Ouvrage de référence sur les comptoirs négriers de la côte togolaise.'
      },
      {
        title: 'Mémoire de la route des esclaves au Togo',
        type: 'UNESCO',
        authorOrOrg: 'Comité national UNESCO Togo',
        year: '2015',
        verificationDate: '2024-02-18'
      }
    ],
    audioNarrationSnippet: 'Fermez les yeux et écoutez la mer qui bat contre la côte d’Agbodrafo. Ici, sous les planches d’une maison en apparence paisible, l’histoire a gravé son épreuve la plus lourde...',
    audioDurationMinutes: 4.0
  },
  {
    id: 'cascade-kpime-mont-agou',
    name: 'Cascade de Kpimé et le Mont Agou',
    slug: 'cascade-kpime-mont-agou',
    subtitle: 'Toit du Togo, fraîcheur des cascades et paysages luxuriants',
    region: 'Plateaux',
    prefecture: 'Kloto & Agou',
    locality: 'Kpimé-Séva & Agou Nyogbo',
    coordinates: {
      lat: 6.9408,
      lng: 0.6389
    },
    category: 'naturel',
    categoryLabel: 'Patrimoine naturel & Écotourisme',
    coverImage: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Les chutes d’eau de Kpimé dévalant la falaise rocheuse bordée d’une végétation tropicale dense.',
    galleryImages: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['Cascade', 'Mont Agou', 'Kpalimé', 'Randonnée', 'Nature', 'Plateaux'],
    shortDescription: 'Dominée par le sommet le plus élevé du pays culminant à 986 mètres d’altitude, la région de Kpalimé abrite la majestueuse cascade de Kpimé, écrin de fraîcheur, de plantations de cacao et de biodiversité tropicale.',
    presentation: 'Au cœur de la région des Plateaux, la cascade de Kpimé jaillit d’un amphithéâtre naturel tapissé de fougères arborescentes et d’arbres tropicaux centenaires. L’eau fraîche dévale une paroi abrupte de près de 100 mètres avant de former des vasques naturelles. Non loin, le Mont Agou s’élève fièrement comme la sentinelle du Togo, offrant depuis son belvédère une vue panoramique embrassant les vallées fertiles togolaises jusqu’au lac Volta ghanéen par temps dégagé.',
    touristicInterest: 'Paradis des randonneurs, des amateurs d’agrotourisme et de photographie. Le chemin qui serpente jusqu’aux cascades traverse des parcelles parfumées de caféiers robusta, de cacaoyers et de bananiers plantains. Les coopératives artisanales de Kpalimé réputées pour leurs batiks et poteries enrichissent l’excursion.',
    practicalInfo: {
      openingHours: 'Accès libre du lever au coucher du soleil (06h30 - 18h00). Guide vivement conseillé.',
      fees: 'Taxe de visite locale au village de Kpimé : environ 1 500 à 2 500 FCFA.',
      guidanceAvailable: true,
      bestSeason: 'De juin à octobre pour un débit d’eau maximal après la saison des pluies, ou novembre-décembre pour la randonnée.',
      contactInfo: 'Association des éco-guides du Kloto — Kpalimé.',
      accessRoute: 'Route bitumée Lomé - Kpalimé (120 km, environ 2h de route), puis embranchement asphalté vers Kpimé.'
    },
    historicalContext: 'La région du Kloto a constitué dès la fin du XIXe siècle un haut lieu de la recherche agronomique et botanique coloniale allemande (poste de Misahöhé fondé par Jesko von Puttkamer en 1890). Les populations Ewé locales ont su préserver la forêt tout en développant une agriculture de montagne respectueuse des équilibres hydrologiques.',
    keyFigures: ['Populations autochtones Ewé du Kloto', 'Botanistes et planteurs traditionnels'],
    timeline: [
      { period: '1890', event: 'Fondation de la station de Misahöhé au pied des monts Kloto.', sourceRef: 'Chroniques du Togo allemand' },
      { period: '1970 - 1980', event: 'Mise en valeur touristique des circuits de cascades par les pionniers de l’écotourisme togolais.', sourceRef: 'Ministère de l’Environnement' },
      { period: 'Aujourd’hui', event: 'Zone classée pour la conservation de la flore des Plateaux.', sourceRef: 'Office National du Tourisme' }
    ],
    isVerifiedHistory: true,
    oralTraditions: 'Les anciens de Kpimé considèrent les chutes comme la demeure d’esprits bienveillants (les vodous d’eau ou Trovodu). On raconte que lors des grandes sécheresses d’autrefois, les prêtresses venaient y offrir des calebasses de farine de maïs blanche pour solliciter la générosité des nuages sur les récoltes.',
    legendsAndBeliefs: 'Le Mont Agou était autrefois réputé impénétrable aux ennemis : un brouillard épais descendait soudainement pour désorienter quiconque cherchait à troubler la paix des villages montagnards.',
    culturalPractices: 'Célébration des fêtes des moissons du café-cacao et rituels de bénédiction de l’eau au début des semailles.',
    memoryStatusNotice: 'Récits traditionnels recueillis auprès des notables de Kpimé-Séva.',
    immersiveStory: {
      title: 'Le chant de l’eau claire au pied du géant d’Agou',
      fullVersion: 'La marche commence à travers la canopée de caféiers en fleur qui exhale un parfum d’amande douce. Le grondement de l’eau n’est d’abord qu’un frémissement lointain, puis il s’amplifie à chaque pas. Soudain, le rideau de verdure s’écarte. La cascade de Kpimé apparaît : un voile d’argent pur plongeant dans le bassin de roche noire, dispersant une bruine rafraîchissante qui caresse le visage du marcheur. Au-dessus, le mont Agou monte la garde, drapé dans un nuage blanc que le vent matinal effiloche. On comprend ici pourquoi les poètes nomment Kpalimé le jardin du Togo : la terre y est généreuse, vive et porteuse de renouveau.',
      shortVersion: 'À Kpalimé, le ruissellement puissant de Kpimé et l’altitude majestueuse du Mont Agou composent une symphonie de fraîcheur, de plantations verdoyantes et de légendes montagnardes.',
      youthVersion: 'C’est comme un gigantesque toboggan d’eau naturelle niché au milieu de la jungle ! Les gouttes d’eau volent dans l’air comme des confettis magiques, et les papillons géants aux couleurs vives virevoltent autour de toi.',
      disclaimer: 'Évocation narrative contemplative des paysages naturels du Kloto.'
    },
    sources: [
      {
        title: 'Guide des écosystèmes et des aires protégées du Togo',
        type: 'Institutionnel',
        authorOrOrg: 'Ministère de l’Environnement et des Ressources Forestières',
        year: '2018',
        verificationDate: '2023-09-10'
      },
      {
        title: 'Géographie du Togo : reliefs et potentiels hydrographiques',
        type: 'Recherche universitaire',
        authorOrOrg: 'Presses de l’Université de Lomé',
        year: '2014',
        verificationDate: '2024-01-14'
      }
    ],
    audioNarrationSnippet: 'Respirez la fraîcheur des feuilles de bananier humides. Écoutez le jaillissement puissant de la cascade de Kpimé au cœur des montagnes verdoyantes de Kpalimé...',
    audioDurationMinutes: 3.0
  },
  {
    id: 'togoville-foret-sacree',
    name: 'Togoville et la Forêt Sacrée',
    slug: 'togoville-foret-sacree',
    subtitle: 'Berceau du nom du Togo, pacte historique et terre spirituelle',
    region: 'Maritime',
    prefecture: 'Vo',
    locality: 'Togoville (rive nord du lac Togo)',
    coordinates: {
      lat: 6.2306,
      lng: 1.4886
    },
    category: 'historique',
    categoryLabel: 'Histoire & Haut lieu spirituel',
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Le lac Togo que l’on traverse en pirogue traditionnelle pour aborder les rives chargées d’histoire de Togoville.',
    galleryImages: [
      'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['Togoville', 'Mlapa III', '1884', 'Traité de protectorat', 'Vaudou', 'Lac Togo'],
    shortDescription: 'C’est à Togoville que le roi Mlapa III signa en juillet 1884 avec l’explorateur Gustav Nachtigal le traité donnant son nom au Togo (« Togo » signifiant « au-delà de la falaise ou au-delà de l’eau » en langue éwé).',
    presentation: 'Posée sur la rive nord du lac Togo que l’on rejoint traditionnellement par une traversée en pirogue à perche, Togoville est une cité doublement fascinante. Berceau politique ayant donné son nom au pays tout entier, elle est aussi un pôle spirituel majeur où cohabitent en parfaite concorde religieuse les couvents traditionnels vodous séculaires et le sanctuaire catholique de Notre-Dame du Lac, érigé après une apparition mariale en 1940.',
    touristicInterest: 'Traverser le lac Togo au clapotis des rames est une expérience contemplative unique. À l’arrivée, on découvre le monument commémoratif du centenaire du traité de 1884, la maison royale de Mlapa, la forêt sacrée interdite aux profanes sans autorisation rituelle, et l’artisanat des sculpteurs sur bois.',
    practicalInfo: {
      openingHours: 'Accessible tous les jours. Traversée en pirogue de 07h00 à 18h00.',
      fees: 'Pirogue aller-retour : environ 2 000 FCFA par personne. Guide de visite de Togoville : 3 000 FCFA.',
      guidanceAvailable: true,
      bestSeason: 'Toute l’année. Fêtes traditionnelles particulièrement vivantes en août et novembre.',
      contactInfo: 'Mairie de Togoville / Chefferie traditionnelle du Palais Mlapa.',
      accessRoute: 'Depuis Lomé, se rendre à Agbodrafo en voiture, puis traverser le lac en pirogue (20 min) ou emprunter la piste contournant le lac par Aného.'
    },
    historicalContext: 'Le 4 et 5 juillet 1884, le diplomate et médecin allemand Gustav Nachtigal signe à bord de la canonnière Möwe puis sur les rives de Togoville un traité de protectorat avec le chef traditionnel Mlapa III. Le village, alors nommé « Togo » (ce qui se trouve derrière la lagune), donna son appellation à l’ensemble du territoire placé sous administration allemande jusqu’en 1914.',
    keyFigures: ['Roi Mlapa III', 'Gustav Nachtigal', 'Prêtres traditionnels du panthéon vodou'],
    timeline: [
      { period: 'Juillet 1884', event: 'Signature du traité historique de protectorat germano-togolais.', sourceRef: 'Archives impériales / Traité de 1884' },
      { period: '1910', event: 'Érection de l’église catholique de style colonial néogothique.', sourceRef: 'Archives diocésaines d’Aného' },
      { period: 'Novembre 1940', event: 'Témoignage de l’apparition mariale sur le lac et développement du pèlerinage chrétien.', sourceRef: 'Chronique paroissiale de Togoville' },
      { period: '1984', event: 'Célébration du centenaire et pose de la stèle commémorative Mlapa-Nachtigal.', sourceRef: 'Gouvernement togolais' }
    ],
    isVerifiedHistory: true,
    oralTraditions: 'Les prêtres traditionnels rappellent que Togoville repose sur un pacte conclu avec les divinités de l’eau et des profondeurs. Aucun conflit sanglant n’y est toléré : quiconque foule la terre de Togoville doit déposer toute haine et respecter les sanctuaires de justice gardés par les divinités gardiennes.',
    legendsAndBeliefs: 'La forêt sacrée abrite les secrets fondateurs des clans fondateurs. On dit que les arbres anciens y protègent les âmes de ceux qui ont préservé la dignité de leur peuple face aux menaces extérieures.',
    culturalPractices: 'Libations rituelles au bord du lac, célébrations de purification, danses initiatiques des adeptes des divinités Sakpata et Mami Wata.',
    memoryStatusNotice: 'Documentation combinant les traités officiels de 1884 et la mémoire des gardiens du trône royal Mlapa.',
    immersiveStory: {
      title: 'La pirogue glissant vers le berceau du nom',
      fullVersion: 'La longue perche de bois du piroguier s’enfonce doucement dans le lit limoneux du lac Togo. L’eau s’ouvre en rideau argenté. Devant vous, émergeant des palmiers et des fromagers géants, les toits de Togoville se dessinent. C’est ici, en ce point précis de la rive, qu’un chef local au regard fier apposa sa marque sur un parchemin rédigé en caractères gothiques, conférant sans le savoir à un peuple tout entier son identité moderne. Plus loin, sous le couvert dense de la forêt sacrée, les autels de terre et d’argile reçoivent les offrandes séculaires dans un silence empli de mystère. À Togoville, les siècles ne se succèdent pas en s’effaçant : ils vivent côte à côte.',
      shortVersion: 'Une traversée en pirogue sur les eaux calmes mène à Togoville, la ville qui a donné son nom au Togo. Ici, le traité historique de 1884 et les sanctuaires vodous ancestraux partagent la même mémoire.',
      youthVersion: 'Savais-tu d’où vient le nom de ton pays ? Il vient d’un village où les gens devaient traverser une grande eau en pirogue pour s’y rendre ! « To-go » voulait dire « de l’autre côté de l’eau ». C’est une vraie aventure de pirates et de rois !',
      disclaimer: 'Récit mêlant la traversée vécue du lac et les épisodes diplomatiques de l’année 1884.'
    },
    sources: [
      {
        title: 'Histoire des Togolais : Des origines à 1884',
        type: 'Recherche universitaire',
        authorOrOrg: 'Nicoué Lodjou Gayibor',
        year: '1997',
        verificationDate: '2023-11-20'
      },
      {
        title: 'Texte officiel du Traité de protectorat de Togoville du 5 juillet 1884',
        type: 'Archive',
        authorOrOrg: 'Archives Nationales du Togo / Archives de Berlin',
        year: '1884',
        verificationDate: '2024-02-01'
      }
    ],
    audioNarrationSnippet: 'Le clapotis de l’eau contre la coque de la pirogue vous accompagne. Vous voguez sur le lac Togo en direction de la rive nord, là où l’histoire moderne a pris racine...',
    audioDurationMinutes: 3.8
  },
  {
    id: 'fourneaux-fer-bassar',
    name: 'Les Hauts-Fourneaux traditionnels de Bassar',
    slug: 'fourneaux-fer-bassar',
    subtitle: 'L’un des plus anciens foyers de la métallurgie du fer en Afrique de l’Ouest',
    region: 'Kara',
    prefecture: 'Bassar',
    locality: 'Nangbani, Bandjéli & Bitchabé',
    coordinates: {
      lat: 9.2517,
      lng: 0.7817
    },
    category: 'architectural',
    categoryLabel: 'Archéologie & Savoir-faire ancestral',
    coverImage: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Vestiges des hauts-fourneaux coniques en terre réfractaire de Bandjéli utilisés pour la réduction du minerai de fer.',
    galleryImages: [
      'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['Bassar', 'Métallurgie', 'Hauts-fourneaux', 'Archéologie', 'Fer', 'Savoir-faire'],
    shortDescription: 'Témoignant d’une maîtrise métallurgique continue depuis plus de deux millénaires, les hauts-fourneaux de Bassar et de Bandjéli ont alimenté toute l’Afrique de l’Ouest en outils aratoires et en parures de fer.',
    presentation: 'Le pays Bassar est mondialement reconnu par les archéologues et historiens comme l’un des plus gigantesques centres de production du fer précolonial du continent africain. Dans les villages de Bandjéli et Nangbani, des dizaines de hauts-fourneaux en banco thermo-résistant s’élèvent jusqu’à 4 mètres de hauteur. L’activité sidérurgique y a laissé d’immenses terrils de scories métallurgiques témoignant de l’extraction de centaines de milliers de tonnes de minerai de fer.',
    touristicInterest: 'Un voyage fascinant dans l’histoire des technologies traditionnelles africaines. Découverte des fourneaux coniques remarquablement conservés, des carrières d’extraction manuelle de la colline de Bandjéli et des forges traditionnelles où les maîtres forgerons martèlent encore le métal incandescent selon les gestes hérités de leurs pères.',
    practicalInfo: {
      openingHours: 'Visites de 08h00 à 17h00. Accueil chaleureux par les comités villageois de Nangbani et Bandjéli.',
      fees: 'Contribution villageoise pour l’entretien du site : 2 000 à 3 000 FCFA.',
      guidanceAvailable: true,
      bestSeason: 'D’octobre à mai (saison sèche propice aux pistes de l’arrière-pays).',
      contactInfo: 'Office du tourisme de Bassar / Maison des Métallurgistes de Bandjéli.',
      accessRoute: 'Route bitumée Sokodé - Bassar (55 km), puis pistes bien damées vers Nangbani (15 km) et Bandjéli.'
    },
    historicalContext: 'Les datations au radiocarbone réalisées par les missions archéologiques de l’Université de Genève et de l’Université de Lomé attestent que le fer était déjà réduit à Bassar dès le début du premier millénaire avant notre ère. Aux XVIIIe et XIXe siècles, Bassar exportait ses barres de fer jusqu’aux confins de l’actuel Ghana, du Burkina Faso et du Bénin.',
    keyFigures: ['Les forgerons et fondeurs de la caste des Biyobé et Bassar', 'Prof. Philip de Barros (Archéologue sidérurgiste)'],
    timeline: [
      { period: 'VIe siècle av. J.-C.', event: 'Premières traces documentées de réduction métallurgique du fer dans le bassin de Bassar.', sourceRef: 'Fouilles archéologiques internationales' },
      { period: 'XIVe - XIXe siècle', event: 'Apogée industrielle : production annuelle estimée à plusieurs centaines de tonnes de fer marchand.', sourceRef: 'Études de Philip de Barros' },
      { period: '2021', event: 'Inscription sur la liste indicative du patrimoine mondial de l’UNESCO.', sourceRef: 'Commission nationale togolaise pour l’UNESCO' }
    ],
    isVerifiedHistory: true,
    oralTraditions: 'La réduction du fer à Bassar n’était pas un simple processus mécanique : c’était un enfantement sacré. Le fourneau était assimilé à une femme enceinte, orné de seins en relief et de colliers de perles de banco. Durant toute la fonte, les maîtres fondeurs devaient observer des jeûnes et chanter des incantations pour que le fer « naisse » pur et sans scories excessives.',
    legendsAndBeliefs: 'Le tonnerre et le feu céleste étaient considérés comme les ancêtres du feu de forge. Nul ne pouvait approcher les fourneaux avec des intentions impures sans risquer de voir la fonte se solidifier prématurément.',
    culturalPractices: 'Fête traditionnelle D’pontr (fête des ignames et de la métallurgie) célébrée chaque année au mois de septembre à Bassar.',
    memoryStatusNotice: 'Enseignements oraux transmis par les maîtres fondeurs et corroborés par les fouilles archéologiques universitaires.',
    immersiveStory: {
      title: 'Le feu des ancêtres dans la colline rouge de Bandjéli',
      fullVersion: 'Sous la chaleur écrasante de l’après-midi, la silhouette du haut-fourneau de terre rouge s’élève vers le ciel comme une cheminée magique. Le sol sous vos pieds crisse d’un éclat métallique sombre : des résidus de scories vieilles de huit cents ans. Le maître forgeron approche avec sa pince de fer forgé. Il vous montre la bouche de soufflage où les tuyères en terre cuite acheminaient l’air pulsé par de puissants soufflets de cuir d’antilope. Dans la nuit d’autrefois, ces collines s’illuminaient de dizaines de feux vifs crachant des gerbes d’étincelles au rythme des tambours d’encouragement. Bassar n’était pas seulement un village : c’était la forge indomptable de l’Afrique de l’Ouest.',
      shortVersion: 'À Bassar, des tours coniques en argile racontent plus de deux mille ans de maîtrise du fer. Une technologie sacrée où la terre et le feu donnaient naissance aux socs de charrue et aux armes de liberté.',
      youthVersion: 'Savais-tu qu’il y a très longtemps, bien avant les grandes usines, des sorciers du feu fabriquaient du fer solide juste avec des pierres rouges, du charbon de bois et des tours magiques en terre ? C’est la plus vieille école de forgerons du pays !',
      disclaimer: 'Narration basée sur les témoignages des fondeurs traditionnels et les reconstitutions archéologiques.'
    },
    sources: [
      {
        title: 'Bassar : A thousand years of African iron production',
        type: 'Recherche universitaire',
        authorOrOrg: 'Philip L. de Barros',
        year: '1986',
        verificationDate: '2023-12-01'
      },
      {
        title: 'Dossier de candidature des sites métallurgiques de Bassar à l’UNESCO',
        type: 'UNESCO',
        authorOrOrg: 'Délégation permanente du Togo auprès de l’UNESCO',
        year: '2021',
        verificationDate: '2024-03-01'
      }
    ],
    audioNarrationSnippet: 'Entendez le choc cadencé du marteau sur l’enclume. À Bassar, le feu a façonné le fer et la mémoire des hommes depuis plus de vingt siècles...',
    audioDurationMinutes: 3.2
  },
  {
    id: 'grottes-greniers-nok',
    name: 'Les Grottes et Greniers de Nok et Tandjouaré',
    slug: 'grottes-greniers-nok',
    subtitle: 'Refuge troglodytique millénaire suspendu dans les falaises des Savanes',
    region: 'Savanes',
    prefecture: 'Tandjouaré',
    locality: 'Nok & Bogou (Falaises de Nano-Bompégou)',
    coordinates: {
      lat: 10.6658,
      lng: 0.1583
    },
    category: 'historique',
    categoryLabel: 'Refuge troglodytique & Paysage',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Les falaises abruptes de grès de Tandjouaré abritant les greniers en banco sous les surplombs rocheux.',
    galleryImages: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['Grottes', 'Nok', 'Tandjouaré', 'Savanes', 'Moba', 'Refuge historique'],
    shortDescription: 'Niché à mi-hauteur des falaises rocheuses de grès rouge de Nano, ce complexe troglodytique compte plus de 130 greniers en banco parfaitement préservés qui servaient de refuge aux populations Moba durant les conflits précoloniaux.',
    presentation: 'Dans l’extrême nord du Togo, les falaises de Nano s’élèvent en une imposante muraille minérale dominant la plaine des Savanes. C’est sous de vastes auvents rocheux naturels, inaccessibles sans connaître les passages secrets entre les failles, que les Moba et Gourma ont édifié au fil des siècles les greniers de Nok. Ces structures cylindriques et oblongues, montées en couches d’argile mêlée de paille et de graviers, pouvaient stocker céréales, eau et provisions pour des mois de siège.',
    touristicInterest: 'Une randonnée spectaculaire offrant un panorama vertigineux sur les savanes sahéliennes togolaises. La descente guidée le long de la corniche rocheuse permet de toucher ces greniers séculaires et d’observer les restes d’arcs, de flèches empoisonnées et de meules dormantes encore visibles dans les cavités.',
    practicalInfo: {
      openingHours: 'Visites de 07h30 à 17h00. Chaussures de marche obligatoires.',
      fees: 'Droit d’accès communautaire : 2 000 FCFA avec éco-guide local.',
      guidanceAvailable: true,
      bestSeason: 'De novembre à mars (saison sèche et fraîche, visibilité maximale).',
      contactInfo: 'Association de sauvegarde des sites rupestres des Savanes — Dapaong.',
      accessRoute: 'Route Nationale 1 jusqu’à Dapaong (620 km de Lomé), puis direction Tandjouaré et piste de Nano (25 km).'
    },
    historicalContext: 'Entre le XVIIe et le XIXe siècle, les cavaliers conquérants Tyokossi venus de Côte d’Ivoire et les détachements militaires coloniaux ravageaient périodiquement les villages de plaine. En cas d’alerte, les sentinelles postées sur les sommets allumaient des feux de fumée : femmes, enfants et vieillards grimpaient alors par des échelles de lianes retirées immédiatement après leur passage.',
    keyFigures: ['Chefs de clans Moba et Gourma', 'Guetteurs des falaises de Nano'],
    timeline: [
      { period: 'XVIIIe siècle', event: 'Aménagement défensif systématique des surplombs rocheux par les Moba.', sourceRef: 'Tradition orale des Savanes' },
      { period: '1897 - 1898', event: 'Résistance des populations retranchées dans les grottes face aux troupes du lieutenant allemand von Thierry.', sourceRef: 'Rapports militaires coloniaux' },
      { period: '2000', event: 'Inventaire archéologique et inscription sur la liste indicative du patrimoine de l’UNESCO.', sourceRef: 'Patrimoine Togo' }
    ],
    isVerifiedHistory: true,
    oralTraditions: 'Les récits racontent que les grottes étaient protégées par un essaim d’abeilles sacrées que les anciens pouvaient réveiller par des sifflements secrets pour attaquer les assaillants essayant d’escalader la paroi.',
    legendsAndBeliefs: 'Le sommet des falaises de Tandjouaré est réputé habité par les esprits du vent (Yenn). Avant chaque récolte, les villageois déposent de la farine de sorgho blanc à l’entrée de la falaise en signe de gratitude.',
    culturalPractices: 'Cérémonie Tingban de protection des terres et de cohésion sociale chez les Moba-Gourma.',
    memoryStatusNotice: 'Récits des aînés de Nano recueillis lors des inventaires du patrimoine régional des Savanes.',
    immersiveStory: {
      title: 'Les sentinelles suspendues entre ciel et roche',
      fullVersion: 'Le vent des savanes souffle fort au bord du gouffre. En vous penchant avec précaution, vous découvrez l’impensable : suspendus entre ciel et terre, abrités de la pluie sous une immense voûte de grès rose, se dressent des dizaines de greniers en terre cuite. Leurs ventres arrondis semblent défier les lois de l’équilibre. Il y a deux siècles, des mères y berçaient leurs nourrissons en retenant leur souffle, pendant que les chevaux des ravisseurs galopaient vainement dans la plaine cent mètres plus bas sans rien voir. Ce n’était pas un simple abri de fortune : c’était la forteresse invisible de la liberté.',
      shortVersion: 'Cachés dans les failles vertigineuses des falaises de Nano, les greniers de Nok ont sauvé des générations d’habitants grâce à leur ingéniosité troglodytique.',
      youthVersion: 'C’est une vraie cachette secrète digne des meilleurs explorateurs ! Des maisons et des garde-mangers entiers construits sur une falaise géante pour échapper aux méchants qui passaient en bas !',
      disclaimer: 'Récit d’ambiance historique rédigé en accord avec la topographie réelle du site.'
    },
    sources: [
      {
        title: 'Les sites rupestres et troglodytiques de l’extrême-nord togolais',
        type: 'Recherche universitaire',
        authorOrOrg: 'Département d’Histoire et d’Archéologie de l’Université de Lomé',
        year: '2016',
        verificationDate: '2023-08-25'
      },
      {
        title: 'Les greniers des grottes de Nok et Bogou',
        type: 'UNESCO',
        authorOrOrg: 'Liste indicative du patrimoine mondial UNESCO',
        year: '2000',
        verificationDate: '2024-02-10'
      }
    ],
    audioNarrationSnippet: 'Le vent siffle contre la paroi rocheuse des falaises de Tandjouaré. Regardez bien sous le surplomb : plus de cent greniers de terre se dissimulent dans l’ombre depuis des siècles...',
    audioDurationMinutes: 3.5
  },
  {
    id: 'monument-independance-palais-lome',
    name: 'Monument de l’Indépendance et Palais de Lomé',
    slug: 'monument-independance-palais-lome',
    subtitle: 'Cœur civique de la République et renaissance contemporaine des arts',
    region: 'Maritime',
    prefecture: 'Golfe',
    locality: 'Lomé (Quartier administratif & Marina)',
    coordinates: {
      lat: 6.1264,
      lng: 1.2189
    },
    category: 'memorial',
    categoryLabel: 'Monument national & Centre d’art',
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Le Monument de l’Indépendance de Lomé érigé au milieu de jardins verdoyants au cœur de la capitale.',
    galleryImages: [
      'https://images.unsplash.com/photo-1590845947670-c009801ffa74?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['Lomé', 'Indépendance 1960', 'Sylvanus Olympio', 'Palais de Lomé', 'Art contemporain', 'Maritime'],
    shortDescription: 'Inauguré lors de la proclamation de l’indépendance le 27 avril 1960, le Monument de l’Indépendance sculpté par Georges Coustère symbolise l’émancipation du peuple togolais, voisin du Palais des Gouverneurs transformé en fleuron culturel contemporain.',
    presentation: 'Au centre de la capitale Lomé, la place de l’Indépendance est ornée d’une silhouette sculpturale monumentale : une figure humaine s’arrachant du roc de la sujétion pour s’élancer vers la lumière de la liberté. À quelques centaines de mètres, le Palais de Lomé (ancien Palais des Gouverneurs allemand puis français, achevé en 1905) est entouré d’un parc botanique de 11 hectares abritant des sculptures d’artistes togolais et africains renommés.',
    touristicInterest: 'Un parcours idéal pour débuter la découverte de la capitale togolaise. La majesté civique du monument s’accorde avec les expositions temporaires, les galeries de design et les allées bordées d’arbres centenaires du Palais de Lomé.',
    practicalInfo: {
      openingHours: 'Monument visible en permanence (accès piétonnier en journée). Palais de Lomé ouvert du mercredi au dimanche de 10h00 à 18h00.',
      fees: 'Monument : gratuit. Palais de Lomé : 2 000 FCFA nationaux, 5 000 FCFA internationaux.',
      guidanceAvailable: true,
      bestSeason: 'Agréable toute l’année grâce aux brises marines de la côte atlantique.',
      contactInfo: 'Direction du Palais de Lomé (palaisdelome.com) / Ville de Lomé.',
      accessRoute: 'Situé en plein centre-ville de Lomé, à l’intersection du boulevard du Mono et de l’avenue de la Marina.'
    },
    historicalContext: 'Le 27 avril 1960 à minuit, Sylvanus Olympio proclamait solennellement : « Sentinelle, que dis-tu de la nuit ? La nuit est longue mais le jour vient ! » Le monument a été commandé pour incarner cette aube républicaine. Les chaînes brisées taillées dans la pierre réaffirment le refus de toute oppression.',
    keyFigures: ['Sylvanus Olympio (Premier président de la République togolaise)', 'Georges Coustère (Sculpteur architecte)', 'Pères fondateurs de la nation togolaise'],
    timeline: [
      { period: '1898 - 1905', event: 'Construction du Palais des Gouverneurs par l’ingénieur allemand Föhre.', sourceRef: 'Archives coloniales de Lomé' },
      { period: '27 avril 1960', event: 'Proclamation de l’Indépendance du Togo et inauguration du Monument.', sourceRef: 'Journal officiel de la République Togolaise' },
      { period: 'Novembre 2019', event: 'Réouverture du Palais de Lomé réhabilité en centre international d’art et de culture.', sourceRef: 'Présidence de la République' }
    ],
    isVerifiedHistory: true,
    oralTraditions: 'Les Loméens gardent la mémoire populaire des cortèges de femmes commerçantes (les mythiques Nana Benz) qui défilèrent fièrement lors des journées d’avril 1960 en chantant l’hymne national « Terre de nos aïeux ».',
    legendsAndBeliefs: 'Le parc du Palais de Lomé conserve des arbres plusieurs fois centenaires où les anciens venaient autrefois méditer avant l’arrivée des puissances européennes sur la côte de Lomé.',
    culturalPractices: 'Cérémonie solennelle de ravivage de la flamme de l’indépendance chaque 27 avril.',
    memoryStatusNotice: 'Sources officielles de la République togolaise et archives de la radiodiffusion nationale.',
    immersiveStory: {
      title: 'L’élan vers la lumière sur la place de la liberté',
      fullVersion: 'La nuit du 27 avril 1960, une clameur immense monte des rues de Lomé jusqu’aux flots de l’océan. La foule retient son souffle. Lorsque la flamme jaillit au pied du monument, la silhouette de pierre taillée semble prendre vie : un homme brisant de ses bras nus les entraves de la servitude pour regarder droit vers l’horizon libre. Tout près, le vieux palais impérial jadis réservé aux maîtres d’hier ouvre aujourd’hui ses grilles dorées à la jeunesse, aux artistes et aux enfants de la République. À Lomé, la mémoire ne pleure plus : elle crée, elle invente et elle rayonne.',
      shortVersion: 'À Lomé, la statue de l’Indépendance qui brise ses fers et le somptueux parc du Palais des Gouverneurs racontent le passage victorieux de la nuit coloniale à la souveraineté républicaine.',
      youthVersion: 'Regarde cette grande statue : c’est un champion qui brise de grosses chaînes pour dire : « Maintenant, nous sommes libres et fiers de notre beau pays ! »',
      disclaimer: 'Évocation civique et artistique de la fondation républicaine du Togo.'
    },
    sources: [
      {
        title: 'Histoire politique du Togo : Le chemin vers l’indépendance',
        type: 'Recherche universitaire',
        authorOrOrg: 'Prof. Messan Adimado Aduayom',
        year: '2010',
        verificationDate: '2023-10-12'
      },
      {
        title: 'Le Palais de Lomé : Métamorphose d’un patrimoine colonial en centre d’art',
        type: 'Ouvrage',
        authorOrOrg: 'Éditions Palais de Lomé',
        year: '2020',
        verificationDate: '2024-02-15'
      }
    ],
    audioNarrationSnippet: 'La rumeur joyeuse de Lomé s’élève autour de la place de l’Indépendance. Devant vous, la pierre sculptée s’ouvre vers le ciel, commémorant le jour sacré du 27 avril 1960...',
    audioDurationMinutes: 3.2
  }
];

export const REGIONS = ['Toutes les régions', 'Maritime', 'Plateaux', 'Centrale', 'Kara', 'Savanes'] as const;

export const CATEGORIES = [
  { id: 'all', label: 'Toutes les catégories' },
  { id: 'patrimoine-mondial', label: 'Patrimoine mondial UNESCO' },
  { id: 'historique', label: 'Histoire & Traités' },
  { id: 'naturel', label: 'Nature & Cascades' },
  { id: 'culturel', label: 'Traditions & Mémoire' },
  { id: 'architectural', label: 'Architecture & Savoir-faire' },
  { id: 'memorial', label: 'Lieux de mémoire' },
];
