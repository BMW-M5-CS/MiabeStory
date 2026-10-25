import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  UserCheck,
  Compass,
  AlertCircle,
  Loader2,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { HeritageSite } from '../data/sites';

interface StorytellingPlayerProps {
  site: HeritageSite;
  onClose?: () => void;
  onOpenGuide: (site: HeritageSite) => void;
}

export const StorytellingPlayer: React.FC<StorytellingPlayerProps> = ({
  site,
  onClose,
  onOpenGuide,
}) => {
  const [styleMode, setStyleMode] = useState<'immersion' | 'short' | 'youth'>('immersion');
  const [storyTitle, setStoryTitle] = useState(site.immersiveStory.title);
  const [storyContent, setStoryContent] = useState(site.immersiveStory.fullVersion);
  const [disclaimer, setDisclaimer] = useState(site.immersiveStory.disclaimer);
  const [isGenerating, setIsGenerating] = useState(false);
  const [modelLabel, setModelLabel] = useState('Archives documentaires miabeStory');

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSynthesizingTTS, setIsSynthesizingTTS] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Switch versions when style changes
  useEffect(() => {
    if (styleMode === 'short') {
      setStoryContent(site.immersiveStory.shortVersion);
    } else if (styleMode === 'youth') {
      setStoryContent(site.immersiveStory.youthVersion);
    } else {
      setStoryContent(site.immersiveStory.fullVersion);
    }
    stopAudio();
  }, [styleMode, site]);

  const stopAudio = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  // Generate dynamic story via Gemma backend
  const handleRegenerateWithAI = async () => {
    stopAudio();
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: site.id,
          style: styleMode,
        }),
      });

      if (!res.ok) throw new Error('Erreur lors de la génération du récit');
      const data = await res.json();
      setStoryTitle(data.title);
      setStoryContent(data.story);
      setDisclaimer(data.disclaimer);
      setModelLabel(data.modelUsed);
    } catch (e: any) {
      console.warn('Génération IA échouée, conservation du récit validé:', e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Text-To-Speech Playback
  const handleTogglePlayAudio = async () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    // Try server-side Gemini 3.8 Flash Lite TTS first
    try {
      setIsSynthesizingTTS(true);
      const res = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: storyContent }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const sound = new Audio(`data:${data.mimeType};base64,${data.audioBase64}`);
          audioRef.current = sound;
          sound.playbackRate = playbackSpeed;
          sound.onended = () => setIsPlaying(false);
          await sound.play();
          setIsPlaying(true);
          setIsSynthesizingTTS(false);
          return;
        }
      }
    } catch (ttsErr) {
      console.log('Gemini TTS failed or unavailable, fallback to Web Speech API:', ttsErr);
    } finally {
      setIsSynthesizingTTS(false);
    }

    // Fallback: Web Speech API (Client speech synthesis in French)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(storyContent);
      utterance.lang = 'fr-FR';
      utterance.rate = playbackSpeed;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    } else {
      alert("La synthèse vocale n'est pas supportée par votre navigateur.");
    }
  };

  const paragraphs = storyContent.split('\n\n').filter(Boolean);

  return (
    <div className="bg-white rounded-3xl border border-[#DCE8DF] shadow-xl overflow-hidden flex flex-col">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-[#174C3C] via-[#1b5644] to-[#0f3429] text-white p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#D6A64F] text-[#202722]">
              Expérience Narrative · « Raconte-moi ce lieu »
            </span>
            <span className="text-xs text-emerald-200 font-mono hidden sm:inline">
              {modelLabel}
            </span>
          </div>

          {onClose && (
            <button
              onClick={() => {
                stopAudio();
                onClose();
              }}
              className="text-xs px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Fermer
            </button>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-[#D6A64F] font-semibold">
            {site.locality} · {site.region}
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white">
            {storyTitle}
          </h2>
          <p className="text-sm text-emerald-100 font-light">
            Une évocation sensible et documentée de : {site.name}
          </p>
        </div>

        {/* Format Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs text-[#D6A64F] font-medium mr-1">Format de récit :</span>
          {[
            { id: 'immersion', label: 'Immersion complète', desc: '4 paragraphes sensoriels' },
            { id: 'short', label: 'Version courte', desc: 'Essentiel en 2 min' },
            { id: 'youth', label: 'Jeune public / Écoles', desc: 'Pédagogique & imagé' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setStyleMode(mode.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                styleMode === mode.id
                  ? 'bg-white text-[#174C3C] shadow-md font-bold'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
              }`}
            >
              {mode.label}
            </button>
          ))}

          <button
            onClick={handleRegenerateWithAI}
            disabled={isGenerating}
            className="ml-auto px-3 py-1.5 rounded-xl bg-[#D6A64F] hover:bg-[#b88632] text-[#202722] text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            title="Générer une variation narrative par Gemma"
          >
            {isGenerating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>{isGenerating ? 'Écriture Gemma...' : 'Varier avec Gemma'}</span>
          </button>
        </div>
      </div>

      {/* Audio Control Bar */}
      <div className="bg-[#EDF4EE] px-6 py-3.5 border-b border-[#DCE8DF] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleTogglePlayAudio}
            disabled={isSynthesizingTTS}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition-all cursor-pointer ${
              isPlaying ? 'bg-[#D6A64F] text-[#202722]' : 'bg-[#174C3C] hover:bg-[#0f3429]'
            }`}
          >
            {isSynthesizingTTS ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>

          <div>
            <p className="text-xs font-bold text-[#174C3C] flex items-center space-x-1.5">
              <Volume2 className="w-4 h-4 text-[#D6A64F]" />
              <span>{isPlaying ? 'Lecture audio en cours...' : 'Écouter le récit'}</span>
            </p>
            <p className="text-[11px] text-[#68716C]">
              {isSynthesizingTTS ? 'Synthèse de la voix haute fidélité...' : `Durée estimée : ~${site.audioDurationMinutes} min`}
            </p>
          </div>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-[#68716C]">Vitesse :</span>
          {[0.9, 1, 1.15].map((spd) => (
            <button
              key={spd}
              onClick={() => {
                setPlaybackSpeed(spd);
                if (audioRef.current) audioRef.current.playbackRate = spd;
              }}
              className={`px-2 py-1 rounded text-xs font-semibold ${
                playbackSpeed === spd
                  ? 'bg-[#174C3C] text-white'
                  : 'bg-white text-[#202722] border border-[#DCE8DF]'
              }`}
            >
              {spd}x
            </button>
          ))}
          <button
            onClick={stopAudio}
            className="p-1.5 text-[#68716C] hover:text-red-600 rounded"
            title="Arrêter"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Story Content Reading Surface (Ivoire #F7F4EC background) */}
      <div className="p-6 sm:p-10 bg-[#F7F4EC] space-y-6 flex-1">
        <div className="max-w-3xl mx-auto space-y-5">
          {paragraphs.map((p, idx) => (
            <p
              key={idx}
              className="text-base sm:text-lg text-[#202722] leading-relaxed font-serif first-letter:text-4xl first-letter:font-bold first-letter:text-[#174C3C] first-letter:float-left first-letter:mr-2.5 first-letter:leading-none"
            >
              {p}
            </p>
          ))}

          {/* Ethical Disclaimer */}
          <div className="mt-8 p-4 bg-white rounded-2xl border border-[#DCE8DF] flex items-start space-x-3 text-xs text-[#68716C] shadow-2xs">
            <AlertCircle className="w-4 h-4 text-[#D6A64F] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#174C3C]">Rigueur mémorielle : </span>
              {disclaimer} Les personnages historiques et traditions évoqués s'appuient sur les inventaires du Ministère de la Culture et de l'UNESCO.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="bg-white px-6 py-4 border-t border-[#DCE8DF] flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-[#68716C]">
          Sources associées : {site.sources.map((s) => s.authorOrOrg).join(', ')}
        </span>

        <button
          onClick={() => {
            stopAudio();
            onOpenGuide(site);
          }}
          className="px-4 py-2 bg-[#174C3C] hover:bg-[#0f3429] text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-colors shadow-xs cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#D6A64F]" />
          <span>Poser des questions au guide sur cette histoire</span>
        </button>
      </div>
    </div>
  );
};
