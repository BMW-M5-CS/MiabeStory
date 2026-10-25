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
  VolumeX,
  Copy,
  Check,
  Compass,
  ArrowRight,
  Filter,
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
  pendingQuestion?: string | null;
  onClearPendingQuestion?: () => void;
}

export const AIGuidePanel: React.FC<AIGuidePanelProps> = ({
  currentSite,
  onClearSiteContext,
  onSelectSite,
  availableSites,
  pendingQuestion,
  onClearPendingQuestion,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or update welcome message when site context changes
  useEffect(() => {
    const welcomeText = currentSite
      ? `Bonjour ! Je suis le guide conversationnel officiel de miabeStory dédié à la découverte de « **${currentSite.name}** » (${currentSite.categoryLabel}, région ${currentSite.region}).\n\nPosez-moi vos questions sur son **histoire documentée**, ses **traditions orales**, son **architecture** ou la **préparation de votre visite**.`
      : `Bonjour ! Je suis le guide conversationnel de **miabeStory**, propulsé par le modèle d'IA de la famille Google Gemma.\n\nJe suis formé sur les archives et les inventaires patrimoniaux du Togo. Vous pouvez sélectionner une destination précise ci-dessous ou me poser vos questions sur l'histoire, les mémoires et les peuples togolais.`;

    const initialSuggestions = currentSite
      ? [
          `Quelle est l’histoire documentée de ce lieu ?`,
          `Quelles traditions et croyances orales y sont associées ?`,
          `Que symbolise cet endroit pour le patrimoine togolais ?`,
          `Quels conseils donnez-vous pour visiter ce site avec respect ?`,
        ]
      : [
          `Quels sont les sites classés au patrimoine mondial UNESCO au Togo ?`,
          `Raconte-moi l'origine du nom du Togo à Togoville en 1884.`,
          `Pourquoi la métallurgie de Bassar est-elle si célèbre ?`,
          `Quels lieux de mémoire de la traite visiter sur la côte ?`,
        ];

    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: welcomeText,
        modelUsed: 'Google Gemma (gemma-4-31b-it)',
        suggestions: initialSuggestions,
        sourcesUsed: currentSite ? currentSite.sources.map((s) => s.title) : ['Archives culturelles et historiques du Togo'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [currentSite]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Audio Speech Synthesis for Assistant Messages
  const handleToggleSpeak = (msgId: string, text: string) => {
    if (speakingMessageId === msgId) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeakingMessageId(null);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Clean markdown tags for natural speech
      const cleanText = text.replace(/[*#_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.0;
      utterance.onend = () => setSpeakingMessageId(null);
      utterance.onerror = () => setSpeakingMessageId(null);
      window.speechSynthesis.speak(utterance);
      setSpeakingMessageId(msgId);
    }
  };

  // Copy to clipboard
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery.trim();
    if (!query || isLoading) return;

    if (speakingMessageId) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }

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

  // Auto-send pending question when passed from SiteDetailModal
  useEffect(() => {
    if (pendingQuestion && pendingQuestion.trim()) {
      handleSendMessage(pendingQuestion);
      onClearPendingQuestion?.();
    }
  }, [pendingQuestion]);

  const handleResetChat = () => {
    if (speakingMessageId && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }
    setMessages((prev) => prev.slice(0, 1));
    setErrorMsg(null);
  };

  // Helper to render basic markdown bold, headings, lists, quotes cleanly
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-2">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1.5" />;

          // Heading ###
          if (line.startsWith('### ')) {
            return (
              <h5 key={idx} className="font-bold text-[#174C3C] text-sm pt-2 border-b border-[#DCE8DF]/40 pb-1">
                {line.replace('### ', '')}
              </h5>
            );
          }

          // Heading ##
          if (line.startsWith('## ')) {
            return (
              <h4 key={idx} className="font-bold font-serif text-[#174C3C] text-base pt-2">
                {line.replace('## ', '')}
              </h4>
            );
          }

          // Blockquote >
          if (trimmed.startsWith('> ')) {
            return (
              <div key={idx} className="border-l-2 border-[#D6A64F] pl-3 py-1 my-1 italic text-xs text-[#174C3C] bg-[#F7F4EC]/60 rounded-r-lg">
                {renderInlineStyles(trimmed.slice(2))}
              </div>
            );
          }

          // Bullet list - or *
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const text = trimmed.slice(2);
            return (
              <div key={idx} className="flex items-start space-x-2 pl-2 text-xs sm:text-sm">
                <span className="text-[#D6A64F] font-bold mt-0.5">•</span>
                <span className="leading-relaxed">{renderInlineStyles(text)}</span>
              </div>
            );
          }

          // Numbered list 1. 2. etc.
          const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start space-x-2 pl-2 text-xs sm:text-sm">
                <span className="text-[#174C3C] font-bold text-xs shrink-0 mt-0.5">{numMatch[1]}.</span>
                <span className="leading-relaxed">{renderInlineStyles(numMatch[2])}</span>
              </div>
            );
          }

          return (
            <p key={idx} className="text-xs sm:text-sm leading-relaxed">
              {renderInlineStyles(line)}
            </p>
          );
        })}
      </div>
    );
  };

  const renderInlineStyles = (text: string) => {
    // Process **bold** first
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-[#174C3C]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-[#DCE8DF] shadow-md flex flex-col h-[760px] max-h-[85vh] overflow-hidden">
      {/* Top Banner & Context Info */}
      <div className="bg-[#174C3C] text-white px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-xs shrink-0">
            <Bot className="w-6 h-6 text-[#D6A64F]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm sm:text-base font-serif">Guide IA miabeStory</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#D6A64F] text-[#202722]">
                Gemma RAG
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 truncate max-w-xs sm:max-w-md">
              {currentSite
                ? `Ancrage : ${currentSite.name}`
                : 'Ancrage : Patrimoine global des 5 régions du Togo'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {currentSite && onClearSiteContext && (
            <button
              onClick={onClearSiteContext}
              className="text-[11px] px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-emerald-100 transition-colors cursor-pointer"
              title="Passer en mode découverte globale"
            >
              Vue globale
            </button>
          )}

          <button
            onClick={handleResetChat}
            className="p-2 text-emerald-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            title="Effacer et recommencer la conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Destination Quick Selector Strip */}
      {onSelectSite && (
        <div className="bg-[#F7F4EC] px-4 py-2 border-b border-[#DCE8DF] flex items-center space-x-2 text-xs overflow-x-auto scrollbar-none">
          <span className="text-[#68716C] shrink-0 font-semibold text-[11px] flex items-center space-x-1">
            <Compass className="w-3.5 h-3.5 text-[#174C3C]" />
            <span>Changer de destination :</span>
          </span>
          {availableSites.map((s) => {
            const isSelected = currentSite?.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onSelectSite(s.id)}
                className={`px-3 py-1 rounded-lg whitespace-nowrap text-[11px] font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#174C3C] text-white shadow-2xs font-bold'
                    : 'bg-white hover:bg-[#DCE8DF] text-[#202722] border border-[#DCE8DF]'
                }`}
              >
                {s.name.split(',')[0]}
              </button>
            );
          })}
        </div>
      )}

      {/* Chat Messages Scrollable Box */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#F7F4EC]/40">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isSpeaking = speakingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              {/* Message Bubble */}
              <div
                className={`max-w-[90%] sm:max-w-[82%] rounded-2xl px-5 py-4 shadow-xs text-sm leading-relaxed transition-all ${
                  isUser
                    ? 'bg-[#174C3C] text-white rounded-br-xs'
                    : 'bg-white text-[#202722] border border-[#DCE8DF] rounded-bl-xs'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-gray-100 text-xs">
                    <span className="font-bold text-[#174C3C] flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D6A64F]" />
                      <span>Réponse du Guide miabeStory</span>
                    </span>

                    <div className="flex items-center space-x-1.5">
                      {/* Audio listen button */}
                      <button
                        onClick={() => handleToggleSpeak(msg.id, msg.content)}
                        className={`p-1 rounded-md transition-colors ${
                          isSpeaking
                            ? 'bg-[#D6A64F] text-[#202722]'
                            : 'text-[#68716C] hover:text-[#174C3C] hover:bg-gray-100'
                        }`}
                        title={isSpeaking ? 'Arrêter la lecture vocale' : 'Écouter la réponse à voix haute'}
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>

                      {/* Copy button */}
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="p-1 text-[#68716C] hover:text-[#174C3C] hover:bg-gray-100 rounded-md transition-colors"
                        title="Copier le texte"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <span className="text-[10px] text-[#68716C] font-mono ml-1">
                        {msg.modelUsed || 'Gemma'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Formatted body */}
                {isUser ? (
                  <div className="whitespace-pre-line text-xs sm:text-sm">{msg.content}</div>
                ) : (
                  renderFormattedContent(msg.content)
                )}

                {/* Sources Used footer if available */}
                {msg.sourcesUsed && msg.sourcesUsed.length > 0 && !isUser && (
                  <div className="mt-3.5 pt-2.5 border-t border-gray-100 text-[11px] text-[#68716C] space-y-1">
                    <p className="font-semibold text-[#174C3C] flex items-center space-x-1">
                      <Bookmark className="w-3 h-3 text-[#D6A64F]" />
                      <span>Sources documentaires & archives de référence :</span>
                    </p>
                    <ul className="list-disc list-inside space-y-0.5 text-gray-500 pl-1">
                      {msg.sourcesUsed.map((src, i) => (
                        <li key={i} className="truncate">{src}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Simulation Notice if offline */}
                {msg.isSimulated && (
                  <div className="mt-2 text-[10px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                    Mode Démonstration préparé (clé API non renseignée)
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <span className="text-[10px] text-[#68716C] px-1">{msg.timestamp}</span>

              {/* Follow-up suggestions */}
              {msg.suggestions && msg.suggestions.length > 0 && !isUser && (
                <div className="pt-2 flex flex-wrap gap-1.5 max-w-[88%]">
                  {msg.suggestions.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(sug)}
                      className="px-3 py-1.5 rounded-full bg-white hover:bg-[#DCE8DF] text-[#174C3C] text-xs font-medium border border-[#DCE8DF] shadow-2xs text-left transition-all cursor-pointer hover:border-[#174C3C]/40"
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
            <div className="w-8 h-8 rounded-full bg-[#174C3C]/10 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-[#174C3C] animate-spin" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#174C3C]">Le guide explore les archives...</p>
              <p className="text-[11px] text-[#68716C]">Vérification documentaire et formulation de la réponse</p>
            </div>
          </div>
        )}

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3.5 bg-red-50 text-red-800 rounded-xl border border-red-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form with Send */}
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
                ? `Posez votre question sur ${currentSite.name.split(',')[0]}...`
                : "Posez votre question sur l'histoire, les mémoires ou les sites du Togo..."
            }
            className="flex-1 px-4 py-3 bg-[#F7F4EC] rounded-xl border border-[#DCE8DF] text-xs sm:text-sm text-[#202722] placeholder-[#68716C] focus:outline-hidden focus:border-[#174C3C] focus:bg-white transition-colors"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-3 bg-[#174C3C] hover:bg-[#0f3429] disabled:bg-gray-300 text-white rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
            aria-label="Envoyer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between pt-2 px-1 text-[11px] text-[#68716C]">
          <span className="flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>RAG contextuel : séparation des faits avérés et des traditions orales</span>
          </span>
          <span className="font-mono text-[10px] text-[#174C3C] font-semibold">Gemma 4-31B-IT</span>
        </div>
      </div>
    </div>
  );
};
