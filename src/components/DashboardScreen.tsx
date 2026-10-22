import React, { useState, useEffect } from 'react';
import { MoodType, UserProfile, MoodOption } from '../types';

interface DashboardScreenProps {
  user: UserProfile;
  selectedMood: MoodType | null;
  onSelectMood: (mood: MoodType) => void;
  onShowToast: (message: string, icon?: string, type?: 'success' | 'info' | 'celebrate') => void;
  onNavigateToChallenges: () => void;
}

const MOOD_OPTIONS: MoodOption[] = [
  {
    id: 'energia',
    emoji: '🌟',
    title: 'Con energía',
    subtitle: 'Vital y activa',
    bgClass: 'bg-amber-50 hover:bg-amber-100/70 border-amber-200 text-amber-950',
    iconBgClass: 'bg-amber-200 text-amber-900',
    feedbackMessage: '¡Energía radiante! 🌟 Aprovecha este impulso para inspirar tu jornada con alegría.',
  },
  {
    id: 'calma',
    emoji: '🌿',
    title: 'En calma',
    subtitle: 'Serena y clara',
    bgClass: 'bg-emerald-50 hover:bg-emerald-100/70 border-emerald-200 text-emerald-950',
    iconBgClass: 'bg-emerald-200 text-emerald-900',
    feedbackMessage: '¡Serenidad plena! 🌿 Mantén ese foco consciente y avanza con tranquilidad paso a paso.',
  },
  {
    id: 'cansada',
    emoji: '☁️',
    title: 'Cansada',
    subtitle: 'Batería baja',
    bgClass: 'bg-sky-50 hover:bg-sky-100/70 border-sky-200 text-sky-950',
    iconBgClass: 'bg-sky-200 text-sky-900',
    feedbackMessage: 'Tu descanso es prioridad. ☁️ Regálate micro-pausas suaves y mantén una postura relajada.',
  },
  {
    id: 'estresada',
    emoji: '⚡',
    title: 'Estresada',
    subtitle: 'Tensión mental',
    bgClass: 'bg-rose-50 hover:bg-rose-100/70 border-rose-200 text-rose-950',
    iconBgClass: 'bg-rose-200 text-rose-900',
    feedbackMessage: 'Inhala hondo y suelta los hombros. ⚡ Recuerda que puedes atender una tarea a la vez.',
  },
];

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  user,
  selectedMood,
  onSelectMood,
  onShowToast,
  onNavigateToChallenges,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathSeconds, setBreathSeconds] = useState(4);
  const [communityCheers, setCommunityCheers] = useState(18);
  const [hasCheered, setHasCheered] = useState(false);

  // Breathing exercise timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathSeconds((prev) => {
          if (prev <= 1) {
            setBreathPhase((current) => {
              if (current === 'inhale') return 'hold';
              if (current === 'hold') return 'exhale';
              return 'inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive]);

  const handleSelectMood = (mood: MoodType) => {
    onSelectMood(mood);
    const chosen = MOOD_OPTIONS.find((m) => m.id === mood);
    if (chosen) {
      onShowToast(chosen.feedbackMessage, 'sentiment_satisfied', 'celebrate');
    }
  };

  const toggleBookmark = () => {
    const newState = !isBookmarked;
    setIsBookmarked(newState);
    onShowToast(
      newState ? 'Reflexión guardada en tus favoritos.' : 'Reflexión removida de favoritos.',
      newState ? 'bookmark' : 'bookmark_border'
    );
  };

  const handleShareQuote = () => {
    navigator.clipboard?.writeText(
      '“No necesitas resolver todas las demandas al mismo tiempo. Haz una pausa, inhala profundo y avanza un paso consciente a la vez.” - Conecta & Brilla'
    );
    onShowToast('¡Mensaje de inspiración copiado al portapapeles!', 'content_copy', 'info');
  };

  const toggleBreathing = () => {
    if (!isBreathingActive) {
      setIsBreathingActive(true);
      setBreathPhase('inhale');
      setBreathSeconds(4);
      onShowToast('Pausa iniciada. Sigue el ritmo suave de la respiración.', 'self_improvement');
    } else {
      setIsBreathingActive(false);
      onShowToast('Práctica de respiración pausada.', 'pause');
    }
  };

  const handleCheerCommunity = () => {
    if (!hasCheered) {
      setCommunityCheers((prev) => prev + 1);
      setHasCheered(true);
      onShowToast('¡Enviaste un abrazo de energía a la comunidad! 💖', 'favorite', 'celebrate');
    }
  };

  const currentMoodObj = MOOD_OPTIONS.find((m) => m.id === selectedMood);

  const breathInstruction =
    breathPhase === 'inhale'
      ? `Inhala profundamente... (${breathSeconds}s)`
      : breathPhase === 'hold'
      ? `Sostén con serenidad... (${breathSeconds}s)`
      : `Exhala y suelta tensión... (${breathSeconds}s)`;

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pt-20 pb-28 gap-5">
      {/* Saludo Cálido y Racha */}
      <section className="flex flex-col gap-1 select-none">
        <div className="flex items-center justify-between">
          <span className="text-xs text-on-surface-variant flex items-center gap-1.5 text-slate-500 font-medium">
            <span className="material-symbols-outlined text-[16px] text-primary">
              calendar_today
            </span>
            <span>Hoy, 24 de Octubre</span>
          </span>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/70 border border-amber-200/50 rounded-full shadow-xs">
            <span
              className="material-symbols-outlined text-[16px] text-amber-600 material-symbols-fill"
            >
              local_fire_department
            </span>
            <span className="text-xs font-bold text-amber-900 tracking-tight">
              {user.streakDays} días en calma
            </span>
          </div>
        </div>

        <div className="mt-1">
          <h2 className="text-2xl xs:text-3xl font-extrabold text-on-surface tracking-tight text-slate-900 flex items-center gap-2">
            <span>¡Hola, {user.name.split(' ')[0]}!</span>
            <span className="text-emerald-700 animate-bounce">🌿</span>
          </h2>
          <p className="text-xs xs:text-sm text-on-surface-variant text-slate-600 mt-0.5">
            Tómate un respiro y conecta con tu momento presente.
          </p>
        </div>
      </section>

      {/* Widget Check-in Emocional */}
      <section className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              ¿Cómo te sientes hoy?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Registra tu energía para personalizar tu jornada.
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px]">spa</span>
          </div>
        </div>

        {/* 4 Píldoras Interactivas */}
        <div className="grid grid-cols-2 gap-2.5">
          {MOOD_OPTIONS.map((mood) => {
            const isSelected = selectedMood === mood.id;
            return (
              <button
                key={mood.id}
                type="button"
                onClick={() => handleSelectMood(mood.id)}
                className={`relative flex items-center gap-3 p-3 rounded-2xl text-left transition-all duration-200 border cursor-pointer active:scale-95 min-h-[56px] ${
                  isSelected
                    ? 'ring-2 ring-emerald-500/80 shadow-sm ' + mood.bgClass
                    : 'bg-surface-container-low/70 border-transparent hover:bg-surface-container-low text-slate-800'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xl shadow-xs transition-transform duration-200 ${
                    isSelected ? 'scale-110 ' + mood.iconBgClass : 'bg-white'
                  }`}
                >
                  {mood.emoji}
                </div>
                <div className="min-w-0 flex flex-col">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {mood.title}
                  </span>
                  <span className="text-[11px] text-slate-500 truncate">
                    {mood.subtitle}
                  </span>
                </div>

                {isSelected && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Dinámico con Animación de Confirmación */}
        {currentMoodObj && (
          <div className="flex flex-col gap-1.5 p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl text-emerald-950 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5 text-emerald-800">
                <span className="material-symbols-outlined text-[18px] text-emerald-600">
                  check_circle
                </span>
                <span>Registro guardado con éxito</span>
              </span>
              <button
                onClick={() => onSelectMood('calma')}
                className="text-[11px] font-semibold text-emerald-700 hover:underline"
              >
                Reajustar
              </button>
            </div>
            <p className="text-xs text-emerald-900/90 leading-snug pl-6 font-medium">
              {currentMoodObj.feedbackMessage}
            </p>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-slate-400 pt-1">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          <p className="text-[11px]">
            Tu registro es 100% privado y confidencial.
          </p>
        </div>
      </section>

      {/* Tarjeta Destacada: Reflexión del Día */}
      <section className="bg-gradient-to-br from-amber-100/80 via-amber-50 to-surface-container-lowest rounded-3xl p-5 shadow-sm border border-amber-200/40 relative flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full shadow-xs border border-amber-200/60">
            <span
              className="material-symbols-outlined text-[15px] text-amber-700 material-symbols-fill"
            >
              wb_twilight
            </span>
            <span className="text-[11px] text-amber-900 font-bold tracking-tight">
              Reflexión del Día • Gestión del Estrés
            </span>
          </div>

          <button
            type="button"
            onClick={toggleBookmark}
            aria-label="Guardar reflexión en favoritos"
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-700 hover:text-amber-600 transition-colors shadow-xs active:scale-90"
          >
            <span
              className={`material-symbols-outlined text-[18px] ${
                isBookmarked ? 'text-amber-600 material-symbols-fill' : ''
              }`}
            >
              {isBookmarked ? 'bookmark' : 'bookmark_border'}
            </span>
          </button>
        </div>

        <blockquote className="text-sm xs:text-base text-amber-950 font-medium italic leading-relaxed">
          “No necesitas resolver todas las demandas al mismo tiempo. Haz una pausa, inhala profundo y avanza un paso consciente a la vez.”
        </blockquote>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-amber-800 shadow-xs text-xs">
              <span className="material-symbols-outlined text-[14px]">psychology_alt</span>
            </div>
            <span className="text-[11px] text-amber-900 font-semibold">
              Guía Mindful
            </span>
          </div>

          <button
            type="button"
            onClick={handleShareQuote}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-slate-700 hover:bg-slate-50 transition-all active:scale-95 shadow-xs text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-[15px] text-emerald-700">
              share
            </span>
            <span>Compartir ánimo</span>
          </button>
        </div>
      </section>

      {/* Tarjeta de Acción Rápida: Pausa de Respiración Guiada */}
      <section className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[24px] material-symbols-fill">
                air
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-primary uppercase font-bold tracking-wider">
                Micro-práctica
              </span>
              <h4 className="text-sm font-bold text-slate-900 truncate">
                Pausa de Respiración Guiada
              </h4>
            </div>
          </div>
          <div className="shrink-0 px-2.5 py-1 bg-surface-container-low rounded-full text-slate-600 text-[11px] font-semibold">
            3 min
          </div>
        </div>

        {/* Visual interactivo con ciclo de respiración animado */}
        <div className="w-full bg-surface-container-low rounded-2xl p-4 flex items-center justify-between gap-3 transition-all border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              {isBreathingActive && (
                <span
                  className={`w-10 h-10 rounded-full absolute transition-all duration-1000 ${
                    breathPhase === 'inhale'
                      ? 'bg-emerald-300/80 scale-150 animate-pulse'
                      : breathPhase === 'hold'
                      ? 'bg-amber-300/70 scale-125'
                      : 'bg-sky-300/60 scale-95'
                  }`}
                />
              )}
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white relative shadow-xs">
                <span className="material-symbols-outlined text-[20px]">
                  {isBreathingActive ? 'spa' : 'self_improvement'}
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900">
                {isBreathingActive ? breathInstruction : 'Calma tu ritmo cardíaco'}
              </span>
              <span className="text-[11px] text-slate-500">
                {isBreathingActive ? 'Técnica 4-4-4 en curso' : 'Técnica 4-4-4 para descontracturar'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleBreathing}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer ${
              isBreathingActive
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-primary hover:bg-primary-container text-white'
            }`}
          >
            {isBreathingActive ? 'Pausar' : 'Comenzar'}
          </button>
        </div>
      </section>

      {/* Banner de Acceso a Retos del Día */}
      <section className="bg-gradient-to-r from-emerald-500 to-teal-700 text-white rounded-3xl p-4 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0 text-xl">
            🏆
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-emerald-100 font-semibold uppercase tracking-wider">
              Gamificación de Bienestar
            </span>
            <span className="text-xs font-bold truncate">
              Tienes 2 retos diarios disponibles
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onNavigateToChallenges}
          className="px-3.5 py-2 rounded-full bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 active:scale-95 transition-all shadow-sm shrink-0"
        >
          Ver Retos
        </button>
      </section>

      {/* Comunidad Consciente */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">
            Comunidad Consciente
          </span>
          <button
            type="button"
            onClick={handleCheerCommunity}
            className="text-[11px] text-primary font-semibold hover:underline flex items-center gap-1 active:scale-95 transition-transform"
          >
            <span
              className={`material-symbols-outlined text-[14px] ${
                hasCheered ? 'text-rose-500 material-symbols-fill' : 'text-primary'
              }`}
            >
              favorite
            </span>
            <span>{communityCheers} compañeros activos</span>
          </button>
        </div>

        <div className="relative w-full h-36 rounded-3xl overflow-hidden shadow-xs border border-slate-100">
          <img
            alt="Ambiente de oficina luminoso y tranquilo con compañeros de trabajo practicando estiramientos conscientes"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOS0zeEH___pH0j_lM_SR2sKJ3txOHueR05es7Kc3XVYSz_ECnAC5wzuWkS_vnxWeKAyKckH9wUqgG18HQbDI0r05byak5avwu0ABHuWKfC7tOlOI50bKoPM7xpLmLQVyqtbwgg45PUFnai0vD7Agp5AoW9wf9dPIvDNv63JlmXKC_H2aVRh7xUwHivtQRrPLuMM39RNkbh72psyWOPkzES8FfEZkVKbpBUfFqXAHDeFFgZFeT8w"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent flex items-end p-4">
            <p className="text-xs text-white font-medium leading-snug">
              “Pequeñas pausas colectivas cultivan grandes espacios de innovación.”
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
