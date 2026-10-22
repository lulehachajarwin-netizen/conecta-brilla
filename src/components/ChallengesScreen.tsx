import React from 'react';
import { UserProfile, ChallengeItem } from '../types';

interface ChallengesScreenProps {
  user: UserProfile;
  challenges: ChallengeItem[];
  onCompleteChallenge: (challengeId: string) => void;
  onResetChallenges: () => void;
  onShowToast: (message: string, icon?: string, type?: 'success' | 'info' | 'celebrate') => void;
}

export const ChallengesScreen: React.FC<ChallengesScreenProps> = ({
  user,
  challenges,
  onCompleteChallenge,
  onResetChallenges,
  onShowToast,
}) => {
  const uncompletedCount = challenges.filter((c) => !c.completed).length;

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pt-20 pb-28 gap-5">
      {/* Tarjeta de Progreso & Estado Gamificado */}
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

          {/* Nivel & Meta */}
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
              <span className="text-sm font-extrabold text-primary">
                {user.progressPercent}%
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
              {/* Badge 1 */}
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

              {/* Badge 2 */}
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

              {/* Badge 3 */}
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

      {/* Encabezado de Sección de Retos */}
      <section className="flex flex-col gap-1 select-none">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Retos del Día
          </h2>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              uncompletedCount > 0
                ? 'bg-emerald-100 text-emerald-900'
                : 'bg-amber-100 text-amber-900'
            }`}
          >
            {uncompletedCount > 0 ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span>{uncompletedCount} disponibles</span>
              </>
            ) : (
              <>
                <span>🎉</span>
                <span>¡Todos completados!</span>
              </>
            )}
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Pequeñas acciones cotidianas con un gran impacto en tu bienestar y en el de tu equipo.
        </p>
      </section>

      {/* Lista de Retos Diarios */}
      <section className="flex flex-col gap-4">
        {challenges.map((challenge) => {
          return (
            <article
              key={challenge.id}
              className={`relative rounded-3xl p-5 shadow-sm transition-all duration-300 flex flex-col gap-3.5 border ${
                challenge.completed
                  ? 'bg-slate-50/90 border-slate-200/80 opacity-95'
                  : 'bg-surface-container-lowest border-slate-100 hover:shadow-md'
              }`}
            >
              {/* Challenge Top Badges */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${challenge.categoryBg} ${challenge.categoryText}`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {challenge.actionIcon}
                    </span>
                    <span>
                      {challenge.category} • {challenge.duration}
                    </span>
                  </span>
                </div>

                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                  <span>+{challenge.points} pts</span>
                  <span className="material-symbols-outlined text-[15px] material-symbols-fill">
                    auto_awesome
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="flex flex-col gap-1">
                <h3
                  className={`text-sm xs:text-base font-bold ${
                    challenge.completed
                      ? 'text-slate-700 line-through decoration-slate-400'
                      : 'text-slate-900'
                  }`}
                >
                  {challenge.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {challenge.description}
                </p>
              </div>

              {/* Bottom action row: Image + Complete button */}
              <div className="flex items-center gap-3 pt-1">
                <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 shadow-xs border border-slate-100 bg-slate-100">
                  <img
                    alt={challenge.imageAlt}
                    className="w-full h-full object-cover"
                    src={challenge.imageUrl}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=150&q=80';
                    }}
                  />
                </div>

                {/* Challenge Action Button */}
                <button
                  type="button"
                  disabled={challenge.completed}
                  onClick={() => onCompleteChallenge(challenge.id)}
                  className={`flex-1 h-12 rounded-full font-bold text-xs xs:text-sm flex items-center justify-center gap-2 shadow-xs transition-all duration-200 cursor-pointer ${
                    challenge.completed
                      ? 'bg-slate-200 text-slate-600 cursor-default shadow-none font-semibold'
                      : challenge.category === 'Autocuidado'
                      ? 'bg-primary text-white hover:bg-emerald-600 active:scale-[0.98]'
                      : 'bg-secondary text-white hover:bg-sky-700 active:scale-[0.98]'
                  }`}
                  aria-pressed={challenge.completed}
                >
                  {challenge.completed ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] text-emerald-700 font-bold">
                        task_alt
                      </span>
                      <span>¡Completado!</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">
                        check_circle
                      </span>
                      <span>Completar Reto</span>
                    </>
                  )}
                </button>
              </div>
            </article>
          );
        })}
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
