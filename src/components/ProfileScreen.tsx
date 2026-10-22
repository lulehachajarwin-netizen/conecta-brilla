import React, { useState } from 'react';
import { UserProfile } from '../types';
import { getCompletedDaysCount } from '../data/challenges365';
import { extractDisplayName } from '../lib/supabase';

interface ProfileScreenProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onToggleAdminRole: () => void;
  onOpenVoiceAssistant?: () => void;
  onLogout: () => void;
  onShowToast: (message: string, icon?: string, type?: 'success' | 'info' | 'celebrate') => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onUpdateUser,
  onToggleAdminRole,
  onOpenVoiceAssistant,
  onLogout,
  onShowToast,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editRole, setEditRole] = useState(user.role);
  const completedCount = getCompletedDaysCount();
  const displayName = extractDisplayName(user.name, user.email);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    onUpdateUser({
      name: editName.trim(),
      role: editRole.trim(),
    });
    setIsEditing(false);
    onShowToast('¡Perfil actualizado con éxito!', 'check_circle', 'celebrate');
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pt-20 pb-28 gap-5">
      {/* User Card */}
      <section className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-r from-emerald-100 via-teal-100 to-sky-100" />

        <div className="relative mt-8 mb-3">
          <img
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-md bg-white"
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

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="w-full flex flex-col gap-2 mt-1">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Tu nombre completo"
              required
              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-center text-slate-900"
            />
            <input
              type="text"
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
              placeholder="Cargo o Rol"
              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-center text-slate-700"
            />
            <div className="flex justify-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 rounded-full bg-slate-100 text-xs text-slate-600 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold"
              >
                Guardar
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-bold text-slate-900">{user.name || displayName}</h2>
              <button
                type="button"
                onClick={() => {
                  setEditName(user.name);
                  setEditRole(user.role);
                  setIsEditing(true);
                }}
                className="text-slate-400 hover:text-slate-600 p-0.5"
                title="Editar nombre"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
              </button>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-emerald-800 font-semibold">{user.role}</p>
              {user.isAdmin && (
                <span className="px-2 py-0.2 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                  Administrador
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {user.company} · {user.email}
            </p>
          </>
        )}

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
            <span className="text-base font-extrabold text-emerald-700">{completedCount}</span>
            <span className="text-[10px] text-slate-500 font-medium">Retos 365 hechos</span>
          </div>
        </div>
      </section>

      {/* Control de Rol: Administrador vs Colaborador */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-4 shadow-sm border border-amber-200/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px] material-symbols-fill">
              admin_panel_settings
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900">
              Rol de Administrador / Propietario
            </span>
            <span className="text-[11px] text-slate-600">
              {user.isAdmin
                ? 'Habilitado: Puedes publicar y editar comunicados de pausas activas'
                : 'Deshabilitado: Modo colaboradora estándar'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleAdminRole}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs ${
            user.isAdmin
              ? 'bg-amber-600 text-white hover:bg-amber-700'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {user.isAdmin ? 'Desactivar' : 'Activar'}
        </button>
      </section>

      {/* Asistente de Voz Psicóloga Direct CTA */}
      {onOpenVoiceAssistant && (
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-4 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0 text-xl">
              <span className="material-symbols-outlined text-[24px]">psychology</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold">
                Asistente de Voz "Escucha &amp; Apoyo"
              </span>
              <span className="text-[11px] text-emerald-100">
                Psicóloga clínica y organizacional interactiva
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenVoiceAssistant}
            className="px-3.5 py-2 rounded-full bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 active:scale-95 transition-all shadow-xs shrink-0 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px]">mic</span>
            <span>Hablar</span>
          </button>
        </section>
      )}

      {/* Preferencias de Bienestar */}
      <section className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Configuración Consciente &amp; Sesión
        </h3>

        <div className="flex flex-col divide-y divide-slate-100">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-slate-500">
                storage
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900">Estado de Sesión</span>
                <span className="text-[11px] text-slate-500">
                  {user.supabaseSessionActive ? 'Sincronizado con Supabase' : 'Sesión local activa'}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700">Conectado</span>
          </div>

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
          <span>Cerrar Sesión</span>
        </button>

        <p className="text-center text-[11px] text-slate-400">
          Conecta &amp; Brilla • Versión 2.0 (365 Días &amp; Asistente de Voz)
        </p>
      </section>
    </div>
  );
};
