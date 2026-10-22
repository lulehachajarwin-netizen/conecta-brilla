import React, { useState } from 'react';
import { UserProfile, ChallengeItem, DailyChallenge365, ChallengeCategory } from '../types';
import {
  getDayOfYear,
  getChallengeForDay,
  ALL_365_CHALLENGES,
  getCompletedDaysCount,
} from '../data/challenges365';

interface ChallengesScreenProps {
  user: UserProfile;
  challenges: ChallengeItem[];
  onCompleteChallenge: (challengeId: string) => void;
  onComplete365DayChallenge: (dayNumber: number) => void;
  onResetChallenges: () => void;
  onShowToast: (message: string, icon?: string, type?: 'success' | 'info' | 'celebrate') => void;
}

export const ChallengesScreen: React.FC<ChallengesScreenProps> = ({
  user,
  challenges,
  onCompleteChallenge,
  onComplete365DayChallenge,
  onResetChallenges,
  onShowToast,
}) => {
  const currentTodayNumber = getDayOfYear();
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(currentTodayNumber);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<ChallengeCategory | 'Todos'>('Todos');
  const [reflectionInput, setReflectionInput] = useState('');
  const [savedReflections, setSavedReflections] = useState<Record<number, string>>({});

  const activeChallenge: DailyChallenge365 = getChallengeForDay(selectedDayNumber);
  const completed365Count = getCompletedDaysCount();
  const isViewingToday = selectedDayNumber === currentTodayNumber;

  const handleDayChange = (newDay: number) => {
    const clamped = Math.max(1, Math.min(newDay, 365));
    setSelectedDayNumber(clamped);
  };

  const handleSaveReflection = (dayNumber: number) => {
    if (!reflectionInput.trim()) return;
    setSavedReflections((prev) => ({
      ...prev,
      [dayNumber]: reflectionInput.trim(),
    }));
    setReflectionInput('');
    onShowToast('Reflexión registrada en tu bitácora de bienestar. 📝', 'edit_note', 'info');
  };

  const handleToggleDailyComplete = () => {
    onComplete365DayChallenge(selectedDayNumber);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pt-20 pb-28 gap-5">
      {/* 1. Tarjeta de Progreso & Estado Gamificado */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-high p-5 shadow-sm border border-slate-100">
        <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-primary-fixed/30 blur-2xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-tertiary-fixed/30 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-4">
          {/* Puntos & Racha */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-surface-container-lowest/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-xs border border-white/60">
              <span className="material-symbols-outlined text-[18px] text-amber-600 material-symbols-fill animate-pulse">
                auto_awesome
              </span>
              <span className="text-base font-extrabold text-slate-900 tracking-tight transition-all duration-300">
                {user.points}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                pts bienestar
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-amber-100/80 px-3 py-1.5 rounded-full text-amber-900 border border-amber-200/50">
              <span className="material-symbols-outlined text-[16px] text-amber-600 material-symbols-fill">
                local_fire_department
              </span>
              <span className="text-xs font-bold tracking-wide">
                {user.streakDays} DÍAS RACHA
              </span>
            </div>
          </div>

          {/* Nivel & Meta 365 */}
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex items-center justify-between text-slate-900">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px] material-symbols-fill">
                  shield_moon
                </span>
                <span className="text-sm font-bold text-slate-900">
                  Nivel {user.level}: {user.levelTitle}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {completed365Count} / 365 Días
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Rumbo a tu próxima insignia: "{user.nextBadge}"
            </p>
          </div>

          {/* Barra de Progreso Fluida */}
          <div className="w-full h-3 bg-surface-container-lowest/90 rounded-full overflow-hidden p-0.5 shadow-inner border border-slate-200/40">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-600 rounded-full transition-all duration-700 ease-out shadow-xs"
              style={{ width: `${Math.min(user.progressPercent, 100)}%` }}
            />
          </div>

          {/* Mini Vitrina de Insignias Logradas */}
          <div className="pt-1 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                Insignias Destacadas
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">
                3 de 6 activas
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() =>
                  onShowToast('Insignia "Pausa Heroica Nivel Oro": 10 pausas activas consecutivas.', 'military_tech')
                }
                className="flex flex-col items-center justify-center p-2 rounded-2xl bg-surface-container-lowest/80 backdrop-blur-sm text-center shadow-xs border border-white/80 active:scale-95 transition-transform"
              >
                <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center mb-1 text-sky-800">
                  <span className="material-symbols-outlined text-[20px] material-symbols-fill">
                    military_tech
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-900 truncate w-full">
                  Pausa Heroica
                </span>
                <span className="text-[10px] text-slate-500 leading-none">
                  Nivel Oro
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onShowToast('Insignia "Mente Serena": 5 micro-prácticas de respiración realizadas.', 'self_improvement')
                }
                className="flex flex-col items-center justify-center p-2 rounded-2xl bg-surface-container-lowest/80 backdrop-blur-sm text-center shadow-xs border border-white/80 active:scale-95 transition-transform"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center mb-1 text-emerald-800">
                  <span className="material-symbols-outlined text-[20px] material-symbols-fill">
                    self_improvement
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-900 truncate w-full">
                  Mente Serena
                </span>
                <span className="text-[10px] text-slate-500 leading-none">
                  Paz Diaria
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onShowToast('Insignia "Colega Luz": Reconocimientos empáticos enviados a tu equipo.', 'favorite')
                }
                className="flex flex-col items-center justify-center p-2 rounded-2xl bg-surface-container-lowest/80 backdrop-blur-sm text-center shadow-xs border border-white/80 active:scale-95 transition-transform"
              >
                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center mb-1 text-amber-800">
                  <span className="material-symbols-outlined text-[20px] material-symbols-fill">
                    favorite
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-900 truncate w-full">
                  Colega Luz
                </span>
                <span className="text-[10px] text-slate-500 leading-none">
                  Empatía
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sistema de Retos Diarios 365 Días (Destacado del Día) */}
      <section className="flex flex-col gap-3">
        {/* Encabezado y Navegador de Días */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Retos Diarios (365 Días)</span>
                <span className="text-amber-500 text-base">✨</span>
              </h2>
              <p className="text-xs text-slate-600">
                Un reto diferente y automático para cada día del año.
              </p>
            </div>

            {isViewingToday && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Hoy</span>
              </span>
            )}
          </div>

          {/* Selector y Navegación Rápida entre Días */}
          <div className="flex items-center justify-between gap-2 p-2 bg-surface-container-lowest rounded-2xl border border-slate-100 shadow-xs">
            <button
              type="button"
              disabled={selectedDayNumber <= 1}
              onClick={() => handleDayChange(selectedDayNumber - 1)}
              className="p-1.5 rounded-xl hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 transition-colors"
              title="Día anterior"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-900">
                Día {selectedDayNumber} de 365
              </span>

              {!isViewingToday && (
                <button
                  type="button"
                  onClick={() => handleDayChange(currentTodayNumber)}
                  className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold hover:bg-emerald-100 transition-colors"
                >
                  Volver a Hoy
                </button>
              )}
            </div>

            <button
              type="button"
              disabled={selectedDayNumber >= 365}
              onClick={() => handleDayChange(selectedDayNumber + 1)}
              className="p-1.5 rounded-xl hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 transition-colors"
              title="Día siguiente"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Tarjeta Principal del Reto Seleccionado (365 Días) */}
        <article
          className={`relative rounded-3xl p-5 shadow-sm transition-all duration-300 flex flex-col gap-4 border ${
            activeChallenge.completed
              ? 'bg-gradient-to-br from-emerald-50/90 to-teal-50/90 border-emerald-200'
              : 'bg-surface-container-lowest border-slate-100 hover:shadow-md'
          }`}
        >
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${activeChallenge.categoryBg} ${activeChallenge.categoryText}`}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {activeChallenge.actionIcon}
                </span>
                <span>
                  {activeChallenge.category} • {activeChallenge.duration}
                </span>
              </span>
            </div>

            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold shadow-xs">
              <span>+{activeChallenge.points} pts</span>
              <span className="material-symbols-outlined text-[15px] material-symbols-fill">
                auto_awesome
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="flex flex-col gap-1.5">
            <h3
              className={`text-base font-extrabold leading-snug ${
                activeChallenge.completed
                  ? 'text-emerald-950 font-bold'
                  : 'text-slate-900'
              }`}
            >
              {activeChallenge.title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {activeChallenge.description}
            </p>
          </div>

          {/* Reflection Prompt Box */}
          <div className="p-3 bg-surface-container-low rounded-2xl flex flex-col gap-2 border border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="material-symbols-outlined text-[16px] text-amber-600 material-symbols-fill">
                psychology_alt
              </span>
              <span className="text-[11px] font-bold">
                Pregunta de Reflexión Consciente:
              </span>
            </div>
            <p className="text-xs text-slate-800 italic font-medium">
              "{activeChallenge.reflectionPrompt}"
            </p>

            {savedReflections[selectedDayNumber] ? (
              <div className="p-2 bg-white rounded-xl text-xs text-emerald-900 border border-emerald-100 font-medium">
                Tu reflexión: "{savedReflections[selectedDayNumber]}"
              </div>
            ) : (
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  type="text"
                  value={reflectionInput}
                  onChange={(e) => setReflectionInput(e.target.value)}
                  placeholder="Escribe tu breve respuesta reflexiva..."
                  className="flex-1 px-3 py-1.5 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-normal"
                />
                <button
                  type="button"
                  onClick={() => handleSaveReflection(selectedDayNumber)}
                  disabled={!reflectionInput.trim()}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                >
                  Guardar
                </button>
              </div>
            )}
          </div>

          {/* Complete Action Button */}
          <button
            type="button"
            onClick={handleToggleDailyComplete}
            className={`w-full h-12 rounded-full font-bold text-xs xs:text-sm flex items-center justify-center gap-2 shadow-xs transition-all duration-200 cursor-pointer ${
              activeChallenge.completed
                ? 'bg-emerald-600 text-white shadow-emerald-600/30 font-bold hover:bg-emerald-700'
                : 'bg-primary hover:bg-emerald-700 text-white active:scale-[0.98]'
            }`}
          >
            {activeChallenge.completed ? (
              <>
                <span className="material-symbols-outlined text-[20px] font-bold">
                  task_alt
                </span>
                <span>¡Reto del Día {selectedDayNumber} Completado! (+{activeChallenge.points} pts)</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">
                  check_circle
                </span>
                <span>Completar Reto del Día {selectedDayNumber}</span>
              </>
            )}
          </button>
        </article>
      </section>

      {/* 3. Retos Complementarios de Apoyo */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
            Micro-Acciones de Conexión en Equipo
          </h3>
          <span className="text-[11px] text-slate-500 font-semibold">
            Diarias
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {challenges.map((challenge) => (
            <article
              key={challenge.id}
              className={`relative rounded-3xl p-4 shadow-sm transition-all duration-200 flex flex-col gap-3 border ${
                challenge.completed
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-surface-container-lowest border-slate-100 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${challenge.categoryBg} ${challenge.categoryText}`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {challenge.actionIcon}
                  </span>
                  <span>{challenge.category}</span>
                </span>

                <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                  +{challenge.points} pts
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <h4
                  className={`text-xs xs:text-sm font-bold ${
                    challenge.completed ? 'line-through text-slate-500' : 'text-slate-900'
                  }`}
                >
                  {challenge.title}
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {challenge.description}
                </p>
              </div>

              <button
                type="button"
                disabled={challenge.completed}
                onClick={() => onCompleteChallenge(challenge.id)}
                className={`w-full h-10 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  challenge.completed
                    ? 'bg-slate-200 text-slate-600'
                    : 'bg-secondary text-white hover:bg-sky-700 active:scale-98'
                }`}
              >
                {challenge.completed ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] text-emerald-700">
                      task_alt
                    </span>
                    <span>Completado</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">
                      check
                    </span>
                    <span>Marcar realizado</span>
                  </>
                )}
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Banner Resumen de Equipo Semanal */}
      <section className="rounded-3xl bg-surface-container p-5 flex items-center gap-3.5 shadow-xs border border-slate-100">
        <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[26px] material-symbols-fill">
            group_work
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-bold text-primary uppercase tracking-wide">
            Comunidad Activa
          </span>
          <p className="text-xs text-slate-700 leading-snug">
            Tu equipo ha completado{' '}
            <span className="font-bold text-slate-900">
              {user.teamCompletedBreaks} pausas saludables
            </span>{' '}
            esta semana. ¡Sigan brillando juntos!
          </p>
        </div>
      </section>

      {/* Quick Demo Replay Trigger */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={onResetChallenges}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 underline active:scale-95 transition-all p-2"
        >
          <span className="material-symbols-outlined text-[14px]">refresh</span>
          <span>Reiniciar retos para demostración</span>
        </button>
      </div>
    </div>
  );
};
