import React from 'react';
import { UserProfile } from '../types';

interface ProfileScreenProps {
  user: UserProfile;
  onLogout: () => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onLogout,
  onShowToast,
}) => {
  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pt-20 pb-28 gap-5">
      {/* User Card */}
      <section className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-r from-emerald-100 via-teal-100 to-sky-100" />

        <div className="relative mt-8 mb-3">
          <img
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-md"
            src={user.avatarUrl}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
            }}
          />
          <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px]">
            ✓
          </span>
        </div>

        <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
        <p className="text-xs text-emerald-800 font-semibold">{user.role}</p>
        <p className="text-xs text-slate-500 mt-0.5">{user.company} · {user.email}</p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-4 border-t border-slate-100">
          <div className="flex flex-col items-center p-2 rounded-2xl bg-surface-container-low">
            <span className="text-base font-extrabold text-slate-900">{user.points}</span>
            <span className="text-[10px] text-slate-500 font-medium">Puntos</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-2xl bg-surface-container-low">
            <span className="text-base font-extrabold text-amber-700">{user.streakDays} días</span>
            <span className="text-[10px] text-slate-500 font-medium">Racha activa</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-2xl bg-surface-container-low">
            <span className="text-base font-extrabold text-emerald-700">Nivel {user.level}</span>
            <span className="text-[10px] text-slate-500 font-medium">Guardián</span>
          </div>
        </div>
      </section>

      {/* Preferencias de Bienestar */}
      <section className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Configuración Consciente
        </h3>

        <div className="flex flex-col divide-y divide-slate-100">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-slate-500">
                notifications_active
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900">Recordatorios de Pausa</span>
                <span className="text-[11px] text-slate-500">Cada 90 minutos de trabajo</span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700">Activado</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-slate-500">
                privacy_tip
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900">Privacidad Emocional</span>
                <span className="text-[11px] text-slate-500">Respuestas anónimas en agregados</span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700">Estricto</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-slate-500">
                spa
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900">Tema Visual</span>
                <span className="text-[11px] text-slate-500">Serene Vitality (Menta & Sol)</span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700">Predeterminado</span>
          </div>
        </div>
      </section>

      {/* Logout CTA */}
      <section className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onLogout}
          className="w-full h-12 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 border border-rose-200/60 active:scale-98 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Cerrar Sesión (Volver a Pantalla 1)</span>
        </button>

        <p className="text-center text-[11px] text-slate-400">
          Conecta & Brilla • Versión 1.0 Prototipo Móvil
        </p>
      </section>
    </div>
  );
};
