import React, { useState } from 'react';
import {
  signInUser,
  signUpUser,
  sendPasswordReset,
  configureSupabase,
  activeSupabaseUrl,
  activeSupabaseKey,
  isRealSupabaseConfigured,
  SUPABASE_SQL_SCHEMA,
  extractDisplayName,
} from '../lib/supabase';
import { UserProfile } from '../types';

interface LoginScreenProps {
  initialEmail?: string;
  onLoginSuccess: (user: UserProfile) => void;
  onShowToast: (message: string, icon?: string, type?: 'success' | 'info' | 'celebrate') => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  initialEmail = 'colaboradora@empresa.com',
  onLoginSuccess,
  onShowToast,
}) => {
  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Form fields
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Especialista de Equipo');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Modals state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetAdminMode, setResetAdminMode] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [inputUrl, setInputUrl] = useState(activeSupabaseUrl);
  const [inputKey, setInputKey] = useState(activeSupabaseKey);
  const [sqlCopied, setSqlCopied] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (authMode === 'register') {
        const { user, error } = await signUpUser(email, password, fullName, role, isAdmin);
        setIsLoading(false);

        if (error) {
          setErrorMessage(error);
          onShowToast(`Error de registro: ${error}`, 'error');
          return;
        }

        if (user) {
          onShowToast(
            `¡Cuenta creada con éxito! Bienvenida, ${user.name}. 🌿`,
            'celebration',
            'celebrate'
          );
          onLoginSuccess(user);
        }
      } else {
        const { user, error } = await signInUser(email, password || 'demo1234');
        setIsLoading(false);

        if (error) {
          setErrorMessage(error);
          onShowToast(`Error de acceso: ${error}`, 'error');
          return;
        }

        if (user) {
          onShowToast(
            `¡Bienvenida/o de vuelta, ${user.name}! 🌿`,
            'spa',
            'celebrate'
          );
          onLoginSuccess(user);
        }
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Ocurrió un error inesperado.');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;

    const res = await sendPasswordReset(resetEmail.trim());
    setShowResetModal(false);
    onShowToast(res.message, res.success ? 'mark_email_read' : 'error', res.success ? 'info' : 'success');
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const success = configureSupabase(inputUrl, inputKey);
    if (success) {
      setShowConfigModal(false);
      onShowToast('¡Credenciales de Supabase actualizadas con éxito!', 'check_circle', 'celebrate');
    } else {
      onShowToast('La URL de Supabase debe comenzar con https://', 'warning');
    }
  };

  const handleCopySql = () => {
    navigator.clipboard?.writeText(SUPABASE_SQL_SCHEMA);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2500);
    onShowToast('¡Script SQL copiado! Pégalo en el SQL Editor de Supabase.', 'content_copy', 'celebrate');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-surface px-5 py-6">
      {/* Decorative Glow */}
      <div className="absolute -top-16 -left-14 w-56 h-56 rounded-full bg-primary-fixed/25 blur-3xl pointer-events-none" />
      <div className="absolute top-48 -right-16 w-60 h-60 rounded-full bg-tertiary-fixed/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-72 h-72 rounded-full bg-secondary-fixed/30 blur-3xl pointer-events-none" />

      {/* Header & Brand Sanctuary */}
      <header className="relative z-10 flex flex-col items-center text-center pt-2 mb-4">
        <div className="inline-flex items-center gap-2 bg-surface-container-lowest shadow-xs px-4 py-1.5 rounded-full mb-3 border border-emerald-50">
          <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse" />
          <span className="text-[11px] font-bold text-primary tracking-wider uppercase">
            Pausa · Respira · Florece
          </span>
        </div>

        <div className="relative flex items-center justify-center w-20 h-20 mb-2 rounded-full bg-surface-container-lowest shadow-md p-2 border border-slate-100">
          <img
            alt="Logotipo Conecta y Brilla"
            className="w-full h-full object-contain select-none"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEywEf1Rz8jtaqj6Mk9TuRhK07r6Ct7Vf9Srqthj7ced6bZ5zGCp3eEouOZK1sNm8RkIvzCEqYZyJCiUhWd0vgXay2BXxhQiJNnXBBOX48gjWlIyP67djDsD8kK4x4280SBP_1Eu1aJDv-727mU-f7vEp285ciatHsxG9w4mech4buSOf2KmxPC9lXFJUX05CUGKrG-xSnCUuMhY4wvWiv8hCQmb7JdgC9bpY5jU94tGAxRd-VBA"
          />
          <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-amber-950 shadow-xs">
            <span className="material-symbols-outlined text-[14px] material-symbols-fill">
              spark
            </span>
          </span>
        </div>

        <h1 className="text-2xl xs:text-3xl font-bold text-slate-900 tracking-tight">
          Conecta <span className="text-amber-600">&amp;</span> Brilla
        </h1>
        <p className="text-xs font-semibold text-emerald-700">
          Bienestar Laboral &amp; Supabase Auth
        </p>
      </header>

      {/* Main Glass Form Container */}
      <section className="relative z-10 w-full max-w-md mx-auto bg-surface-container-lowest/95 backdrop-blur-md rounded-3xl shadow-lg border border-white/80 p-5 mb-4">
        {/* Toggle between Iniciar Sesión and Registrarse */}
        <div className="flex p-1 bg-slate-100 rounded-2xl mb-4 border border-slate-200/60">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              authMode === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              authMode === 'register'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Crear Cuenta (Registro)
          </button>
        </div>

        {errorMessage && (
          <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-rose-600 shrink-0">
              error
            </span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="flex flex-col gap-3">
          {/* Full Name field in Registration mode */}
          {authMode === 'register' && (
            <div className="flex flex-col gap-1">
              <label
                htmlFor="registerFullName"
                className="text-xs font-semibold text-slate-800"
              >
                Nombre completo
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-slate-400 text-[18px]">
                  person
                </span>
                <input
                  id="registerFullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej: Sofia Gómez"
                  required
                  className="w-full h-11 pl-11 pr-4 rounded-full bg-slate-50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>
          )}

          {/* Email input */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="authEmail"
              className="text-xs font-semibold text-slate-800 flex items-center justify-between"
            >
              <span>Correo electrónico (Supabase Auth)</span>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                {isRealSupabaseConfigured() ? 'Supabase Conectado' : 'Modo Autónomo'}
              </span>
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-slate-400 text-[18px]">
                alternate_email
              </span>
              <input
                id="authEmail"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@empresa.com"
                required
                className="w-full h-11 pl-11 pr-4 rounded-full bg-slate-50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor="authPassword"
                className="text-xs font-semibold text-slate-800"
              >
                Contraseña
              </label>
              {authMode === 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setShowResetModal(true);
                  }}
                  className="text-[11px] text-emerald-700 hover:underline font-semibold"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
            </div>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-slate-400 text-[18px]">
                lock
              </span>
              <input
                id="authPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={authMode === 'register' ? 'Mínimo 6 caracteres' : '••••••••••••'}
                required={authMode === 'register'}
                className="w-full h-11 pl-11 pr-11 rounded-full bg-slate-50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Role and Admin selection in Registration mode */}
          {authMode === 'register' && (
            <div className="flex flex-col gap-2 pt-1 border-t border-slate-100">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-800">
                  Cargo o Rol en la organización
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Especialista de Equipo">Colaboradora / Especialista de Equipo</option>
                  <option value="Diseñadora UX / Creativa">Diseñadora / Creativa</option>
                  <option value="Líder de Proyecto">Líder de Proyecto / Scrum Master</option>
                  <option value="Administrador de Bienestar">Administrador / Propietario de Bienestar</option>
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span className="text-xs text-slate-800 font-bold flex items-center gap-1">
                  <span>Asignar privilegios de Administrador/Propietario</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                    Publicar Pausas
                  </span>
                </span>
              </label>
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 mt-2 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">
                  progress_activity
                </span>
                <span>Procesando en Supabase...</span>
              </>
            ) : authMode === 'register' ? (
              <>
                <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                <span>Crear Cuenta en Supabase</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">login</span>
                <span>Iniciar Sesión en Supabase</span>
              </>
            )}
          </button>
        </form>

        {/* Supabase Config / SQL Migration Link */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 hover:underline"
          >
            <span className="material-symbols-outlined text-[14px]">tune</span>
            <span>Configurar Supabase / Ver Script SQL</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setResetAdminMode(true);
              setShowResetModal(true);
            }}
            className="text-slate-600 hover:text-slate-900 font-medium hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[13px]">admin_panel_settings</span>
            <span>Gestión Admin</span>
          </button>
        </div>
      </section>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-emerald-700">
                  lock_reset
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  {resetAdminMode ? 'Gestión Admin: Restablecer Acceso' : 'Restablecer mi Contraseña'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowResetModal(false);
                  setResetAdminMode(false);
                }}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {resetAdminMode
                ? 'Como administrador/propietario, ingresa el correo de la colaboradora para enviarle un enlace de restablecimiento seguro o verificar sus accesos.'
                : 'Ingresa tu correo registrado en Supabase. Te enviaremos un enlace seguro para restablecer tu contraseña.'}
            </p>

            <form onSubmit={handlePasswordReset} className="flex flex-col gap-3 pt-1">
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="correo@empresa.com"
                required
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowResetModal(false);
                    setResetAdminMode(false);
                  }}
                  className="px-3 py-1.5 rounded-full text-xs text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">send</span>
                  <span>Enviar Enlace</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supabase Configuration & SQL Schema Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 flex flex-col gap-3.5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-emerald-700">
                  database
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  Configuración de Supabase &amp; Base de Datos
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSupabaseConfig} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-800">
                  Project URL de Supabase
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
                  Anon / Public API Key
                </label>
                <input
                  type="text"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[15px]">content_copy</span>
                  <span>{sqlCopied ? '¡SQL Copiado!' : 'Copiar Script SQL'}</span>
                </button>

                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-xs"
                >
                  Guardar Conexión
                </button>
              </div>
            </form>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-600 flex flex-col gap-1">
              <p className="font-semibold text-slate-800">
                💡 ¿Cómo crear las tablas en Supabase en 1 minuto?
              </p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Haz clic en <strong>Copiar Script SQL</strong> arriba.</li>
                <li>Ve a tu panel de Supabase &gt; <strong>SQL Editor</strong>.</li>
                <li>Pega el código y haz clic en <strong>Run</strong>.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 flex flex-col items-center text-center mt-auto px-2 max-w-md mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high/70 backdrop-blur-sm shadow-xs max-w-full">
          <span className="material-symbols-outlined text-[15px] text-emerald-800 material-symbols-fill shrink-0">
            shield
          </span>
          <p className="text-[11px] truncate text-slate-600">
            Autenticación permanente y cifrada con{' '}
            <span className="font-bold text-slate-800">Supabase Auth</span>
          </p>
        </div>
      </footer>
    </div>
  );
};
