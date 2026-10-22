import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, VoiceChatMessage } from '../types';

interface VoicePsychologistModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string, icon?: string, type?: 'success' | 'info' | 'celebrate') => void;
}

export const VoicePsychologistModal: React.FC<VoicePsychologistModalProps> = ({
  user,
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [messages, setMessages] = useState<VoiceChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hola, ${user.name ? user.name.split(' ')[0] : 'colega'}. Soy la Dra. Sofía, psicóloga del programa Conecta & Brilla. Este es tu espacio seguro, confidencial y sin juicios. Tómate una inhalación suave y cuéntame: ¿cómo te sientes en este momento de tu jornada?`,
      timestamp: 'Ahora',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);
  const [transcriptDraft, setTranscriptDraft] = useState('');

  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize Web Speech API & Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;

      // Speech Recognition setup
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.lang = 'es-ES';

          recognition.onstart = () => {
            setIsListening(true);
            setTranscriptDraft('');
          };

          recognition.onresult = (event: any) => {
            let current = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
              current += event.results[i][0].transcript;
            }
            setTranscriptDraft(current);
            setInputText(current);
          };

          recognition.onerror = (err: any) => {
            console.warn('Speech recognition notice:', err);
            setIsListening(false);
            if (err.error === 'not-allowed') {
              onShowToast('Permiso de micrófono no habilitado. Puedes escribir tu mensaje.', 'mic_off', 'info');
            }
          };

          recognition.onend = () => {
            setIsListening(false);
          };

          recognitionRef.current = recognition;
        } catch (e) {
          console.warn('Could not initialize SpeechRecognition:', e);
          setHasSpeechSupport(false);
        }
      } else {
        setHasSpeechSupport(false);
      }
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isThinking, isListening]);

  // Voice synthesis function: soft, calm, warm, and paused
  const speakText = (text: string) => {
    if (!voiceEnabled || !synthRef.current) return;

    try {
      synthRef.current.cancel(); // cancel previous utterances

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      // Voice configuration: soft, paused and serene
      utterance.rate = 0.88; // pausado
      utterance.pitch = 0.98; // cálido y natural
      utterance.volume = 1.0;

      // Try selecting the best natural sounding Spanish voice
      const voices = synthRef.current.getVoices();
      const spanishVoice = voices.find(
        (v) =>
          v.lang.startsWith('es') &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Paulina') ||
            v.name.includes('Monica') ||
            v.name.includes('Helena'))
      ) || voices.find((v) => v.lang.startsWith('es'));

      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
      setIsSpeaking(false);
    }
  };

  const handleStopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      onShowToast('El reconocimiento de voz no está soportado en este navegador. Puedes escribir.', 'keyboard', 'info');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    } else {
      // Stop ongoing speech before listening
      handleStopSpeaking();
      try {
        recognitionRef.current.start();
        onShowToast('Escuchando... Háblale a la Dra. Sofía con tranquilidad.', 'mic');
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }
  };

  const handleSendMessage = async (userPrompt?: string) => {
    const textToSend = userPrompt || inputText;
    if (!textToSend.trim() || isThinking) return;

    handleStopSpeaking();
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    }

    const newUserMsg: VoiceChatMessage = {
      id: 'user_' + Date.now(),
      role: 'user',
      text: textToSend.trim(),
      timestamp: 'Ahora',
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputText('');
    setTranscriptDraft('');
    setIsThinking(true);

    try {
      // Call server-side psychological assistant API
      const response = await fetch('/api/gemini/psychologist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: textToSend.trim(),
          userContext: {
            name: user.name,
            role: user.role,
            email: user.email,
          },
          history: messages.slice(-5).map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      const data = await response.json();
      const replyText = data.reply || data.fallback || 'Estoy contigo. Respira hondo y avancemos juntas.';

      const newModelMsg: VoiceChatMessage = {
        id: 'model_' + Date.now(),
        role: 'model',
        text: replyText,
        timestamp: 'Ahora',
      };

      setMessages((prev) => [...prev, newModelMsg]);
      setIsThinking(false);

      // Speak answer with warm, soft clinical psychologist voice
      speakText(replyText);
    } catch (err) {
      console.error('Error fetching psychologist reply:', err);
      setIsThinking(false);
      const fallbackReply =
        'Comprendo la situación que atraviesas y quiero recordarte que es completamente válido sentirte sobrepasada en ocasiones. Hagamos una pausa breve: suelta los hombros, exhala despacio y date permiso de atender una sola cosa a la vez.';
      setMessages((prev) => [
        ...prev,
        {
          id: 'model_' + Date.now(),
          role: 'model',
          text: fallbackReply,
          timestamp: 'Ahora',
        },
      ]);
      speakText(fallbackReply);
    }
  };

  const starterChips = [
    'Siento mucha sobrecarga laboral hoy 😣',
    'Tengo dudas con el síndrome del impostor 💭',
    'Guíame en un ejercicio de respiración guiada 🫁',
    'Tuve una conversación difícil con un compañero 💬',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-[92vh] sm:h-[82vh] bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-emerald-100/70 via-teal-50/50 to-transparent pointer-events-none" />

        {/* Modal Header */}
        <header className="relative z-10 px-5 pt-4 pb-3 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-sm">
                <img
                  alt="Dra. Sofía - Psicóloga de Bienestar"
                  className="w-full h-full rounded-full object-cover bg-white"
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-extrabold text-slate-900">
                  Dra. Sofía • Escucha &amp; Apoyo
                </h3>
              </div>
              <p className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">psychology</span>
                Psicología Clínica y Organizacional
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Toggle voice button */}
            <button
              type="button"
              onClick={() => {
                const next = !voiceEnabled;
                setVoiceEnabled(next);
                if (!next) handleStopSpeaking();
                onShowToast(next ? 'Voz de la psicóloga activada' : 'Voz silenciada (modo lectura)', next ? 'volume_up' : 'volume_off');
              }}
              title={voiceEnabled ? 'Silenciar voz' : 'Activar voz'}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                voiceEnabled ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400 bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {voiceEnabled ? 'volume_up' : 'volume_off'}
              </span>
            </button>

            {/* Close button */}
            <button
              type="button"
              onClick={() => {
                handleStopSpeaking();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
        </header>

        {/* Dynamic Voice Status Aura Banner */}
        <div className="px-4 py-2 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-b border-emerald-100/60 flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {isSpeaking || isListening ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-400" />
              )}
            </span>
            <span className="text-[11px] font-semibold text-slate-800">
              {isListening
                ? 'Escuchándote con empatía...'
                : isThinking
                ? 'Procesando con cuidado tu mensaje...'
                : isSpeaking
                ? 'Dra. Sofía hablando con tono cálido y pausado...'
                : 'Espacio activo • Voz pausada configurada'}
            </span>
          </div>

          {isSpeaking && (
            <button
              type="button"
              onClick={handleStopSpeaking}
              className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-bold hover:bg-rose-100"
            >
              Detener voz
            </button>
          )}
        </div>

        {/* Chat History View */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 no-scrollbar">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] ${
                  isUser ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {!isUser && (
                  <div className="flex items-center gap-2 mt-1 px-1">
                    <button
                      type="button"
                      onClick={() => speakText(msg.text)}
                      className="text-[11px] text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-semibold"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        volume_up
                      </span>
                      <span>Escuchar</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Thinking animation */}
          {isThinking && (
            <div className="flex items-center gap-2 p-3.5 bg-white border border-slate-100 rounded-2xl w-fit shadow-xs animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-slate-500 font-medium">Dra. Sofía está reflexionando...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggestion Chips */}
        {messages.length <= 3 && (
          <div className="px-4 py-1.5 flex gap-1.5 overflow-x-auto no-scrollbar">
            {starterChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip)}
                className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-[11px] text-slate-700 hover:text-emerald-900 border border-slate-200 transition-colors font-medium active:scale-95"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Voice Input Bottom Dock */}
        <footer className="p-3.5 bg-white border-t border-slate-100 flex flex-col gap-2">
          {/* Real-time draft speech preview */}
          {isListening && transcriptDraft && (
            <div className="p-2 bg-emerald-50 text-emerald-950 rounded-xl text-xs italic border border-emerald-200 animate-in fade-in">
              "{transcriptDraft}"
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Interactive Mic Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`relative flex items-center justify-center w-12 h-12 rounded-full shrink-0 shadow-md transition-all active:scale-95 cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white shadow-rose-600/40 animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
              }`}
              title={isListening ? 'Detener micrófono' : 'Hablar por micrófono'}
            >
              <span className="material-symbols-outlined text-[24px]">
                {isListening ? 'mic' : 'mic'}
              </span>
              {isListening && (
                <span className="absolute -inset-1 rounded-full border-2 border-rose-400 animate-ping opacity-75" />
              )}
            </button>

            {/* Text Input Fallback */}
            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  isListening
                    ? 'Te escucho atentamente...'
                    : 'Háblame o escribe lo que sientes...'
                }
                className="w-full h-11 pl-4 pr-10 rounded-full bg-slate-100 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white border border-transparent transition-all"
              />

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isThinking}
                className="absolute right-1.5 w-8 h-8 rounded-full bg-emerald-600 disabled:bg-slate-300 text-white flex items-center justify-center transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
            <span className="material-symbols-outlined text-[12px]">lock</span>
            <span>Espacio privado y protegido • Orientación psicológica de bienestar</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
