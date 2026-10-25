import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Info,
  BookOpen,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Bookmark,
  Volume2,
} from 'lucide-react';
import { HeritageSite } from '../data/sites';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  modelUsed?: string;
  sourcesUsed?: string[];
  suggestions?: string[];
  isSimulated?: boolean;
  timestamp: string;
}

interface AIGuidePanelProps {
  currentSite: HeritageSite | null;
  onClearSiteContext?: () => void;
  onSelectSite?: (siteId: string) => void;
  availableSites: HeritageSite[];
}

export const AIGuidePanel: React.FC<AIGuidePanelProps> = ({
  currentSite,
  onClearSiteContext,
  onSelectSite,
  availableSites,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or update welcome message when site context changes
  useEffect(() => {
    const welcomeText = currentSite
      ? `Bonjour ! Je suis le guide IA de miabeStory dédié à la découverte de « ${currentSite.name} ». Posez-moi vos questions sur son histoire vérifiée, ses légendes, son architecture ou la préparation de votre visite.`
      : `Bonjour ! Je suis le guide conversationnel de miabeStory, propulsé par le modèle Google Gemma. Choisissez un site ou posez-moi vos questions sur le patrimoine, la mémoire historique et la culture du Togo.`;

    const initialSuggestions = currentSite
      ? [
          `Quelle est l’histoire documentée de ce lieu ?`,
          `Quelles sont les traditions et croyances associées ?`,
          `Pourquoi ce site est-il emblématique pour le Togo ?`,
          `Raconte-moi ce lieu avec des mots simples.`,
        ]
      : [
          `Quels sont les sites inscrits au patrimoine mondial au Togo ?`,
          `Raconte-moi l'histoire du roi Mlapa III et de Togoville.`,
          `Que symbolisent les Tata Somba du Koutammakou ?`,
          `Quels hauts lieux de mémoire visiter sur la côte togolaise ?`,
        ];

    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: welcomeText,
        modelUsed: 'Google Gemma (gemma-4-31b-it)',
        suggestions: initialSuggestions,
        sourcesUsed: currentSite ? currentSite.sources.map((s) => s.title) : ['Archives culturelles du Togo'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [currentSite]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery.trim();
    if (!query || isLoading) return;

    setErrorMsg(null);
    setInputQuery('');

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build lightweight conversation history
      const historyPayload = messages.slice(-4).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: currentSite ? currentSite.id : undefined,
          query,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur serveur (${res.status})`);
      }

      const data = await res.json();

      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        modelUsed: data.modelUsed,
        sourcesUsed: data.sourcesUsed,
        suggestions: data.suggestions,
        isSimulated: data.isSimulated,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Erreur guide IA:', err);
      setErrorMsg(
        err.message ||
          "Le guide IA n'a pas pu répondre. Vérifiez la connexion réseau ou réessayez dans un instant."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages((prev) => prev.slice(0, 1));
    setErrorMsg(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#DCE8DF] shadow-md flex flex-col h-[750px] max-h-[85vh] overflow-hidden">
      {/* Top Banner & Context Info */}
      <div className="bg-[#174C3C] text-white px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
            <Bot className="w-6 h-6 text-[#D6A64F]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm sm:text-base font-serif">Guide IA miabeStory</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#D6A64F] text-[#202722]">
                Gemma 4-31B-IT
              </span>
            </div>
            <p className="text-xs text-emerald-100/80 truncate max-w-xs sm:max-w-md">
              {currentSite
                ? `Contexte ancré : ${currentSite.name}`
                : 'Contexte global : Tout le patrimoine togolais'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {currentSite && onClearSiteContext && (
            <button
              onClick={onClearSiteContext}
              className="text-[11px] px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-emerald-100 transition-colors cursor-pointer"
              title="Passer en mode découverte globale"
            >
              Vue générale
            </button>
          )}

          <button
            onClick={handleResetChat}
            className="p-1.5 text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Réinitialiser la conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Site Selector Bar if no site selected */}
      {!currentSite && onSelectSite && (
        <div className="bg-[#F7F4EC] px-4 py-2 border-b border-[#DCE8DF] flex items-center space-x-2 text-xs overflow-x-auto scrollbar-none">
          <span className="text-[#68716C] shrink-0 font-medium">Ancrer sur un site :</span>
          {availableSites.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectSite(s.id)}
              className="px-2.5 py-1 rounded-md bg-white hover:bg-[#DCE8DF] text-[#174C3C] border border-[#DCE8DF] whitespace-nowrap text-[11px] font-medium transition-colors cursor-pointer"
            >
              {s.name.split(',')[0]}
            </button>
          ))}
        </div>
      )}

      {/* Chat Messages Scrollable Box */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#F7F4EC]/50">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              {/* Message Bubble */}
              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-5 py-3.5 shadow-xs text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#174C3C] text-white rounded-br-xs'
                    : 'bg-white text-[#202722] border border-[#DCE8DF] rounded-bl-xs'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-gray-100 text-xs">
                    <span className="font-bold text-[#174C3C] flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#D6A64F]" />
                      <span>Réponse du Guide</span>
                    </span>
                    <span className="text-[10px] text-[#68716C] font-mono">
                      {msg.modelUsed || 'Gemma'}
                    </span>
                  </div>
                )}

                <div className="whitespace-pre-line text-[13px] sm:text-sm">
                  {msg.content}
                </div>

                {/* Sources Used footer if available */}
                {msg.sourcesUsed && msg.sourcesUsed.length > 0 && !isUser && (
                  <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] text-[#68716C] space-y-1">
                    <p className="font-semibold text-[#174C3C] flex items-center space-x-1">
                      <Bookmark className="w-3 h-3 text-[#D6A64F]" />
                      <span>Sources documentaires associées :</span>
                    </p>
                    <ul className="list-disc list-inside space-y-0.5 text-gray-500">
                      {msg.sourcesUsed.map((src, i) => (
                        <li key={i} className="truncate">{src}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Simulation Notice if offline */}
                {msg.isSimulated && (
                  <div className="mt-2 text-[10px] text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                    Mode Démonstration simulée (absence de clé API en environnement)
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <span className="text-[10px] text-[#68716C] px-1">{msg.timestamp}</span>

              {/* Follow-up suggestions */}
              {msg.suggestions && msg.suggestions.length > 0 && !isUser && (
                <div className="pt-2 flex flex-wrap gap-1.5 max-w-[85%]">
                  {msg.suggestions.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(sug)}
                      className="px-3 py-1.5 rounded-full bg-white hover:bg-[#DCE8DF] text-[#174C3C] text-xs font-medium border border-[#DCE8DF] shadow-2xs text-left transition-colors cursor-pointer"
                    >
                      💡 {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex items-center space-x-3 bg-white p-4 rounded-2xl border border-[#DCE8DF] max-w-sm shadow-xs animate-pulse">
            <div className="w-8 h-8 rounded-full bg-[#174C3C]/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#174C3C] animate-spin" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#174C3C]">Le modèle Gemma réfléchit...</p>
              <p className="text-[11px] text-[#68716C]">Consultation des archives togolaises et vérification des sources</p>
            </div>
          </div>
        )}

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-800 rounded-xl border border-red-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 bg-white border-t border-[#DCE8DF]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading}
            placeholder={
              currentSite
                ? `Posez votre question sur ${currentSite.name}...`
                : "Posez votre question sur l'histoire ou les sites du Togo..."
            }
            className="flex-1 px-4 py-3 bg-[#F7F4EC] rounded-xl border border-[#DCE8DF] text-sm text-[#202722] placeholder-[#68716C] focus:outline-hidden focus:border-[#174C3C] focus:bg-white transition-colors"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-3 bg-[#174C3C] hover:bg-[#0f3429] disabled:bg-gray-300 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
            aria-label="Envoyer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between pt-2 px-1 text-[11px] text-[#68716C]">
          <span className="flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>RAG contextuel : faits vérifiés séparés des traditions orales</span>
          </span>
          <span className="font-mono text-[10px]">Gemma 4-31B-IT</span>
        </div>
      </div>
    </div>
  );
};
