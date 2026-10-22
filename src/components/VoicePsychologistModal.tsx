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
  const [messages, setMessages] = useState<VoiceChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [transcriptDraft, setTranscriptDraft] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const isComponentMounted = useRef(true);

  // Initialize welcome message dynamically for the current active user
  useEffect(() => {
    const userFirstName = user.name ? user.name.split(' ')[0] : 'colega';
    const welcomeText = `Hola, ${userFirstName}. Soy la Dra. Sofía, psicóloga de bienestar y salud laboral en Conecta & Brilla. Este es tu espacio confidencial y seguro para desahogarte, procesar cualquier tensión de tu jornada y reencontrar tu equilibrio. Tómate una inhalación suave y cuéntame con tranquilidad: ¿cómo te sientes en este momento?`;

    setMessages([
      {
        id: 'msg_welcome_' + Date.now(),
        role: 'model',
        text: welcomeText,
        timestamp: 'Ahora',
      },
    ]);
  }, [user.name]);

  // Setup Web Speech API & Synthesis
  useEffect(() => {
    isComponentMounted.current = true;
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;

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
            setSpeechError(null);
            setTranscriptDraft('');
          };

          recognition.onresult = (event: any) => {
            let fullTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
              fullTranscript += event.results[i][0].transcript;
            }
            setTranscriptDraft(fullTranscript);
            setInputText(fullTranscript);
          };

          recognition.onerror = (event: any) => {
            console.warn('SpeechRecognition error:', event.error);
            setIsListening(false);
            if (event.error === 'not-allowed') {
              setSpeechError('Acceso al micrófono no concedido. Puedes escribir tu mensaje abajo.');
              onShowToast('Permiso de micrófono no otorgado. Puedes escribir.', 'mic_off', 'info');
            } else if (event.error === 'no-speech') {
              setSpeechError(null);
            }
          };

          recognition.onend = () => {
            setIsListening(false);
            // If we have captured text, auto-send or let user confirm
            if (transcriptDraft.trim().length > 3) {
              handleSendMessage(transcriptDraft.trim());
            }
          };

          recognitionRef.current = recognition;
        } catch (e) {
          console.warn('Could not setup SpeechRecognition:', e);
        }
      }
    }

    return () => {
      isComponentMounted.current = false;
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [transcriptDraft]);

  // Auto-scroll chat
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isThinking, isListening]);

  // Voice synthesis with soft, calm, warm, and paused tone
  const speakText = (textToSpeak: string) => {
    if (!voiceEnabled || !synthRef.current) return;

    try {
      synthRef.current.cancel(); // cancel any active utterance

      const cleanText = textToSpeak.replace(/[*#_~]/g, ''); // strip markdown
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'es-ES';

      // Warm, paused and empathetic voice configuration
      utterance.rate = 0.88; // pausado
      utterance.pitch = 0.98; // cálido
      utterance.volume = 1.0;

      // Select Spanish voice
      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(
        (v) =>
          v.lang.startsWith('es') &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Monica') ||
            v.name.includes('Paulina') ||
            v.name.includes('Helena'))
      ) || voices.find((v) => v.lang.startsWith('es'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
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
      onShowToast(
        'El reconocimiento de voz no está habilitado en este navegador. Puedes escribir tu mensaje.',
        'keyboard',
        'info'
      );
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
      handleStopSpeaking();
      setSpeechError(null);
      setTranscriptDraft('');
      try {
        recognitionRef.current.start();
        onShowToast('Escuchándote... Habla libremente con la Dra. Sofía 🎤', 'mic');
      } catch (err) {
        console.warn('Failed to start recognition:', err);
      }
    }
  };

  const handleSendMessage = async (textPrompt?: string) => {
    const messageContent = textPrompt || inputText;
    if (!messageContent.trim() || isThinking) return;

    handleStopSpeaking();
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    }

    const userMessage: VoiceChatMessage = {
      id: 'usr_' + Date.now(),
      role: 'user',
      text: messageContent.trim(),
      timestamp: 'Ahora',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setTranscriptDraft('');
    setIsThinking(true);

    try {
      const response = await fetch('/api/gemini/psychologist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: messageContent.trim(),
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
      const reply = data.reply || 'Te escucho con cariño. Tómate una respiración suave y avancemos juntas.';

      const psychologistMessage: VoiceChatMessage = {
        id: 'psy_' + Date.now(),
        role: 'model',
        text: reply,
        timestamp: 'Ahora',
      };

      setMessages((prev) => [...prev, psychologistMessage]);
      setIsThinking(false);

      // Speak output with warm psychologist tone
      speakText(reply);
    } catch (err) {
      console.error('Error in psychologist voice chat:', err);
      setIsThinking(false);

      const fallbackReply =
        `Te escucho atentamente, ${user.name ? user.name.split(' ')[0] : 'colega'}. Reconozco lo desafiante que puede ser lo que estás viviendo. Recuerda que no tienes que resolver todas las exigencias a la vez. Suelta la tensión de tu espalda y permítete un respiro consciente.`;

      setMessages((prev) => [
        ...prev,
        {
          id: 'psy_' + Date.now(),
          role: 'model',
          text: fallbackReply,
          timestamp: 'Ahora',
        },
      ]);
      speakText(fallbackReply);
    }
  };

  const quickStarters = [
    'Siento mucha sobrecarga laboral hoy 😣',
    'Tengo dudas con el síndrome del impostor 💭',
    'Guíame en un ejercicio de respiración consciente 🫁',
    'Tuve una conversación tensa con un compañero de equipo 💬',
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
            <button
              type="button"
              onClick={() => {
                const next = !voiceEnabled;
                setVoiceEnabled(next);
                if (!next) handleStopSpeaking();
                onShowToast(
                  next ? 'Voz activada (tono cálido)' : 'Voz silenciada (modo texto)',
                  next ? 'volume_up' : 'volume_off'
                );
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

        {/* Dynamic Voice Status Banner with Real-time Wave Animation */}
        <div className="px-4 py-2 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-b border-emerald-100/60 flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-2">
            {/* Visualizer Wave */}
            <div className="flex items-center gap-0.5 h-4">
              <span className={`w-1 rounded-full bg-emerald-600 transition-all ${isSpeaking || isListening ? 'h-4 animate-pulse' : 'h-1.5'}`} />
              <span className={`w-1 rounded-full bg-emerald-500 transition-all ${isSpeaking || isListening ? 'h-3 animate-pulse [animation-delay:0.1s]' : 'h-2'}`} />
              <span className={`w-1 rounded-full bg-teal-600 transition-all ${isSpeaking || isListening ? 'h-4 animate-pulse [animation-delay:0.2s]' : 'h-1.5'}`} />
              <span className={`w-1 rounded-full bg-emerald-600 transition-all ${isSpeaking || isListening ? 'h-2.5 animate-pulse [animation-delay:0.3s]' : 'h-1'}`} />
            </div>

            <span className="text-[11px] font-semibold text-slate-800">
              {isListening
                ? 'Escuchándote en tiempo real... Di lo que sientes'
                : isThinking
                ? 'Dra. Sofía está reflexionando tu mensaje...'
                : isSpeaking
                ? 'Hablando con voz suave, pausada y empática...'
                : 'Lista para escucharte • Pulsa el micrófono'}
            </span>
          </div>

          {isSpeaking && (
            <button
              type="button"
              onClick={handleStopSpeaking}
              className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-bold hover:bg-rose-100 transition-colors"
            >
              Pausar voz
            </button>
          )}
        </div>

        {/* Live speech error or notice */}
        {speechError && (
          <div className="px-4 py-1.5 bg-amber-50 text-amber-900 text-[11px] border-b border-amber-200/50 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-amber-700">info</span>
            <span>{speechError}</span>
          </div>
        )}

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
                      <span>Escuchar de nuevo</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {isThinking && (
            <div className="flex items-center gap-2 p-3 bg-white border border-slate-100 rounded-2xl w-fit shadow-xs animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-slate-500 font-medium">Procesando respuesta terapéutica...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggestion Chips */}
        {messages.length <= 4 && (
          <div className="px-4 py-1.5 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickStarters.map((chip, idx) => (
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

        {/* Live Speech Draft Preview */}
        {isListening && transcriptDraft && (
          <div className="mx-4 mb-2 p-2.5 bg-emerald-50/90 text-emerald-950 rounded-xl text-xs border border-emerald-200 flex items-center gap-2 animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="italic font-medium">"{transcriptDraft}"</span>
          </div>
        )}

        {/* Bottom Interactive Voice Dock */}
        <footer className="p-3.5 bg-white border-t border-slate-100 flex flex-col gap-2">
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
              title={isListening ? 'Detener micrófono' : 'Hablar por micrófono con la Dra. Sofía'}
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
            <span>Espacio confidencial • Psicología clínica y de bienestar organizacional</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
