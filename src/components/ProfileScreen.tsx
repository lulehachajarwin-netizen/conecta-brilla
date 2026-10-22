import React, { useState } from 'react';
import { UserProfile } from '../types';
import { getCompletedDaysCount } from '../data/challenges365';
import {
  extractDisplayName,
  sendPasswordReset,
  configureSupabase,
  activeSupabaseUrl,
  activeSupabaseKey,
  isRealSupabaseConfigured,
  SUPABASE_SQL_SCHEMA,
} from '../lib/supabase';

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

  // Admin password reset helper state
  const [adminTargetEmail, setAdminTargetEmail] = useState('');
  const [showAdminResetForm, setShowAdminResetForm] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [inputUrl, setInputUrl] = useState(activeSupabaseUrl);
  const [inputKey, setInputKey] = useState(activeSupabaseKey);
  const [sqlCopied, setSqlCopied] = useState(false);

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
    onShowToast('¡Perfil actualizado y sincronizado en la base de datos!', 'check_circle', 'celebrate');
  };

  const handleAdminResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminTargetEmail.trim()) return;

    const res = await sendPasswordReset(adminTargetEmail.trim());
    onShowToast(res.message, res.success ? 'mark_email_read' : 'error', res.success ? 'celebrate' : 'info');
    setAdminTargetEmail('');
    setShowAdminResetForm(false);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = configureSupabase(inputUrl, inputKey);
    if (ok) {
      setShowConfigModal(false);
      onShowToast('¡Configuración de Supabase actualizada correctamente!', 'check_circle', 'celebrate');
    } else {
      onShowToast('La URL debe comenzar con https://', 'warning');
    }
  };

  const handleCopySql = () => {
    navigator.clipboard?.writeText(SUPABASE_SQL_SCHEMA);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2500);
    onShowToast('¡Script SQL copiado! Pégalo en el SQL Editor de Supabase.', 'content_copy', 'celebrate');
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
                Guardar en Supabase
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
                ? 'Habilitado: Publicar comunicados y gestionar accesos'
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

      {/* Herramientas de Administrador: Restablecer Accesos / Contraseñas */}
      {user.isAdmin && (
        <section className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-amber-700">
                lock_reset
              </span>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Gestión de Accesos y Contraseñas
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAdminResetForm(!showAdminResetForm)}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              {showAdminResetForm ? 'Ocultar' : 'Restablecer'}
            </button>
          </div>

          <p className="text-xs text-slate-600">
            Como Administrador/Propietario, puedes enviar enlaces de restablecimiento de contraseña para cualquier colaboradora registrada en Supabase.
          </p>

          {showAdminResetForm && (
            <form onSubmit={handleAdminResetPassword} className="flex flex-col gap-2 pt-1 border-t border-slate-100">
              <input
                type="email"
                value={adminTargetEmail}
                onChange={(e) => setAdminTargetEmail(e.target.value)}
                placeholder="correo.colaboradora@empresa.com"
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all"
              >
                Enviar Enlace de Restablecimiento
              </button>
            </form>
          )}
        </section>
      )}

      {/* Supabase Connection & SQL Migration Panel */}
      <section className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-emerald-700">
              database
            </span>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Base de Datos Supabase
            </h3>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            {isRealSupabaseConfigured() ? 'Conectado a Proyecto' : 'Local + Supabase'}
          </span>
        </div>

        <p className="text-xs text-slate-600">
          Tus datos (check-ins, retos diarios y comunicados) se persisten tanto en Supabase como en almacenamiento local permanente.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleCopySql}
            className="flex-1 py-2 px-3 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[15px]">content_copy</span>
            <span>{sqlCopied ? '¡SQL Copiado!' : 'Copiar Script SQL'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            className="py-2 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            Configurar
          </button>
        </div>
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
          Conecta &amp; Brilla • Supabase Auth &amp; Persistencia Permanente
        </p>
      </section>

      {/* Supabase Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Credenciales de Proyecto Supabase
              </h3>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-800">
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://xyzproject.supabase.co"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-800">
                  Supabase Anon Key
                </label>
                <input
                  type="text"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="eyJhbGciOi..."
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-3 py-1.5 rounded-full text-xs text-slate-600 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                >
                  Guardar Conexión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
