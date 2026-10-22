import React, { useState } from 'react';
import { extractDisplayName, checkIsAdmin } from '../lib/supabase';

interface LoginScreenProps {
  initialEmail?: string;
  onLoginSuccess: (userData: { email: string; name?: string; isAdmin?: boolean }) => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  initialEmail = 'colaboradora@empresa.com',
  onLoginSuccess,
  onShowToast,
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [asAdmin, setAsAdmin] = useState(checkIsAdmin(initialEmail));
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Verificando credenciales en Supabase...');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setLoadingMessage('Verificando credenciales de sesión...');

    const resolvedName = name.trim() || extractDisplayName(name, email);
    const isAdminRole = asAdmin || checkIsAdmin(email);

    setTimeout(() => {
      setLoadingMessage('¡Acceso autorizado! Bienvenido/a a tu oasis.');
      onShowToast(`¡Bienvenida/o, ${resolvedName}! 🌿`, 'spa');
      setTimeout(() => {
        onLoginSuccess({
          email: email.trim().toLowerCase(),
          name: resolvedName,
          isAdmin: isAdminRole,
        });
      }, 400);
    }, 600);
  };

  const handleSSOLogin = (provider: string) => {
    if (isLoading) return;
    setIsLoading(true);
    setLoadingMessage(`Autenticando sesión con ${provider}...`);
    onShowToast(`Conectando con ${provider}...`, 'hub');

    const resolvedName = name.trim() || extractDisplayName(name, email);
    const isAdminRole = asAdmin || checkIsAdmin(email);

    setTimeout(() => {
      setLoadingMessage('Sesión verificada correctamente.');
      setTimeout(() => {
        onLoginSuccess({
          email: email.trim().toLowerCase(),
          name: resolvedName,
          isAdmin: isAdminRole,
        });
      }, 400);
    }, 700);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-surface px-5 py-6">
      {/* Ambient decorative glow shapes */}
      <div className="absolute -top-16 -left-14 w-56 h-56 rounded-full bg-primary-fixed/25 blur-3xl pointer-events-none" />
      <div className="absolute top-48 -right-16 w-60 h-60 rounded-full bg-tertiary-fixed/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-72 h-72 rounded-full bg-secondary-fixed/30 blur-3xl pointer-events-none" />

      {/* Header & Brand Section */}
      <header className="relative z-10 flex flex-col items-center text-center pt-2 mb-6">
        <div className="inline-flex items-center gap-2 bg-surface-container-lowest shadow-xs px-4 py-1.5 rounded-full mb-4 border border-emerald-50">
          <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse" />
          <span className="text-[11px] font-bold text-primary tracking-wider uppercase">
            Pausa · Respira · Florece
          </span>
        </div>

        {/* Brand Emblem */}
        <div className="relative flex items-center justify-center w-24 h-24 mb-3 rounded-full bg-surface-container-lowest shadow-md p-2.5 border border-slate-100">
          <img
            alt="Logotipo Conecta y Brilla"
            className="w-full h-full object-contain select-none"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEywEf1Rz8jtaqj6Mk9TuRhK07r6Ct7Vf9Srqthj7ced6bZ5zGCp3eEouOZK1sNm8RkIvzCEqYZyJCiUhWd0vgXay2BXxhQiJNnXBBOX48gjWlIyP67djDsD8kK4x4280SBP_1Eu1aJDv-727mU-f7vEp285ciatHsxG9w4mech4buSOf2KmxPC9lXFJUX05CUGKrG-xSnCUuMhY4wvWiv8hCQmb7JdgC9bpY5jU94tGAxRd-VBA"
          />
          <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-7 h-7 rounded-full bg-tertiary-fixed text-on-tertiary-fixed shadow-xs">
            <span className="material-symbols-outlined text-[16px] text-amber-900 material-symbols-fill">
              spark
            </span>
          </span>
        </div>

        <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-1 text-slate-900">
          Conecta <span className="text-tertiary-container">&amp;</span> Brilla
        </h1>
        <p className="text-sm font-semibold text-primary mb-1">
          Tu pausa consciente en el trabajo
        </p>
        <p className="text-xs text-on-surface-variant max-w-xs mx-auto text-slate-600 leading-relaxed">
          Bienvenido/a a tu espacio seguro de bienestar, pausas activas y acompañamiento diario.
        </p>
      </header>

      {/* Secure Form Container */}
      <section className="relative z-10 w-full max-w-md mx-auto bg-surface-container-lowest/95 backdrop-blur-md rounded-3xl shadow-lg border border-white/80 p-6 mb-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Input: Nombre opcional */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="fullNameInput"
              className="text-xs font-semibold text-slate-800 flex items-center justify-between"
            >
              <span>Nombre para tu saludo</span>
              <span className="text-[10px] text-slate-400">Opcional</span>
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-[20px] text-slate-400">
                badge
              </span>
              <input
                id="fullNameInput"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Laura Morales (o déjalo en blanco)"
                className="w-full h-11 pl-11 pr-4 rounded-full bg-surface-container-low text-on-surface text-xs sm:text-sm placeholder:text-slate-400 border border-transparent focus:border-primary-container focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary-container/20 transition-all"
              />
            </div>
          </div>

          {/* Input: Corporate Email */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="corporateEmail"
              className="text-xs font-semibold text-on-surface flex items-center justify-between text-slate-800"
            >
              <span>Usuario o Correo corporativo (Supabase)</span>
              <span className="text-primary text-[11px] font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md">
                <span className="material-symbols-outlined text-[14px]">domain</span>
                Empresa
              </span>
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-outline pointer-events-none text-[20px] text-slate-400">
                alternate_email
              </span>
              <input
                id="corporateEmail"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@empresa.com"
                required
                className="w-full h-11 pl-11 pr-4 rounded-full bg-surface-container-low text-on-surface text-xs sm:text-sm placeholder:text-slate-400 border border-transparent focus:border-primary-container focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary-container/20 transition-all"
              />
            </div>
          </div>

          {/* Input: Password */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor="passwordField"
                className="text-xs font-semibold text-on-surface text-slate-800"
              >
                Contraseña
              </label>
              <button
                type="button"
                onClick={() =>
                  onShowToast('Se envió un enlace a tu correo corporativo.', 'mark_email_read')
                }
                className="text-secondary text-[11px] hover:underline active:opacity-80 transition-opacity text-sky-700 font-medium"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-outline pointer-events-none text-[20px] text-slate-400">
                lock
              </span>
              <input
                id="passwordField"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full h-11 pl-11 pr-12 rounded-full bg-surface-container-low text-on-surface text-xs sm:text-sm placeholder:text-slate-400 border border-transparent focus:border-primary-container focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary-container/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute right-3.5 w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Role selector & Remember checkbox */}
          <div className="flex flex-col gap-2 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={asAdmin}
                onChange={(e) => setAsAdmin(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <span className="text-xs text-slate-800 font-semibold flex items-center gap-1">
                <span>Acceder con rol de Administrador/Propietario</span>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                  Publicar Anuncios
                </span>
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <span className="text-xs text-slate-500">
                Recordar mi sesión en este dispositivo
              </span>
            </label>
          </div>

          {/* Primary Action CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 mt-1 rounded-full bg-primary-container hover:bg-emerald-600 active:scale-[0.98] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">
                  progress_activity
                </span>
                <span>Iniciando...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">spa</span>
                <span>Iniciar Sesión</span>
              </>
            )}
          </button>

          {/* Feedback Banner during interaction */}
          {isLoading && (
            <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-surface-container-low text-primary text-center justify-center text-xs font-semibold animate-in fade-in">
              <span className="material-symbols-outlined text-[16px] text-emerald-700 animate-spin">
                progress_activity
              </span>
              <span>{loadingMessage}</span>
            </div>
          )}
        </form>

        {/* Visual Divider */}
        <div className="relative flex items-center my-4">
          <div className="flex-grow h-px bg-slate-200" />
          <span className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-surface-container-lowest">
            o accede con
          </span>
          <div className="flex-grow h-px bg-slate-200" />
        </div>

        {/* Corporate Single Sign-On (SSO) Options */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => handleSSOLogin('SSO Corporativo')}
            className="w-full h-11 rounded-full bg-surface-container-low hover:bg-surface-container text-xs font-semibold shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-2 px-4 border border-slate-100 text-slate-700 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-sky-700">
              hub
            </span>
            <span>Continuar con SSO Corporativo</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleSSOLogin('Google Workspace')}
              className="h-10 rounded-full bg-surface-container-lowest shadow-xs hover:shadow-sm active:scale-[0.99] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all px-2 border border-slate-100 text-slate-700 cursor-pointer"
            >
              <span className="material-symbols-outlined text-amber-600 text-[16px]">
                verified_user
              </span>
              <span className="truncate">Google Workspace</span>
            </button>
            <button
              type="button"
              onClick={() => handleSSOLogin('Microsoft 365')}
              className="h-10 rounded-full bg-surface-container-lowest shadow-xs hover:shadow-sm active:scale-[0.99] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all px-2 border border-slate-100 text-slate-700 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sky-600 text-[16px]">
                cloud
              </span>
              <span className="truncate">Microsoft 365</span>
            </button>
          </div>
        </div>
      </section>

      {/* Trust & Privacy Footer */}
      <footer className="relative z-10 flex flex-col items-center text-center mt-auto px-2 max-w-md mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high/70 backdrop-blur-sm shadow-xs max-w-full">
          <span className="material-symbols-outlined text-[15px] text-emerald-800 material-symbols-fill shrink-0">
            lock
          </span>
          <p className="text-[11px] truncate text-slate-600">
            Sesión segura gestionada por{' '}
            <span className="font-bold text-slate-800">Supabase Auth &amp; Bienestar</span>
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mt-2 text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">shield</span>
            Cifrado E2E
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">health_and_safety</span>
            Salud Laboral
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">volunteer_activism</span>
            100% Confidencial
          </span>
        </div>
      </footer>
    </div>
  );
};
