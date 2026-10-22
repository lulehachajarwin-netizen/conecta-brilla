import React, { useState } from 'react';
import { ScreenType, UserProfile } from '../types';

interface HeaderProps {
  currentScreen: ScreenType;
  user: UserProfile;
  onNavigate: (screen: ScreenType) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  user,
  onNavigate,
  onLogout,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const screenTitle = {
    login: '',
    dashboard: 'Inicio',
    challenges: 'Retos',
    profile: 'Perfil',
  }[currentScreen];

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-surface-container-high/60 shadow-[0_1px_8px_rgba(0,0,0,0.03)] select-none">
      <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-between gap-3">
        {/* Left: Brand emblem & title */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-left focus:outline-none group active:scale-95 transition-transform"
          aria-label="Ir al Inicio"
        >
          <div className="w-8 h-8 rounded-full bg-surface-container-lowest shadow-xs flex items-center justify-center p-1 border border-emerald-100">
            <img
              alt="Logo Conecta & Brilla"
              className="h-full w-full object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEywEf1Rz8jtaqj6Mk9TuRhK07r6Ct7Vf9Srqthj7ced6bZ5zGCp3eEouOZK1sNm8RkIvzCEqYZyJCiUhWd0vgXay2BXxhQiJNnXBBOX48gjWlIyP67djDsD8kK4x4280SBP_1Eu1aJDv-727mU-f7vEp285ciatHsxG9w4mech4buSOf2KmxPC9lXFJUX05CUGKrG-xSnCUuMhY4wvWiv8hCQmb7JdgC9bpY5jU94tGAxRd-VBA"
              onError={(e) => {
                // Fallback icon if image network fails
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <span className="font-semibold text-primary tracking-tight text-sm hidden xs:inline">
            Conecta & Brilla
          </span>
        </button>

        {/* Center: Current view title */}
        <div className="flex-1 text-center">
          <h1 className="text-sm font-bold text-on-surface tracking-wide uppercase text-slate-700">
            {screenTitle}
          </h1>
        </div>

        {/* Right: User Profile Avatar with dropdown */}
        <div className="relative flex items-center justify-end">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="relative flex items-center justify-center w-9 h-9 rounded-full ring-2 ring-emerald-500/20 hover:ring-emerald-500/40 focus:outline-none transition-all active:scale-95"
            aria-label="Menú de perfil"
            aria-expanded={showProfileMenu}
          >
            <img
              alt={user.name}
              className="w-full h-full rounded-full object-cover shadow-xs"
              src={user.avatarUrl}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
              }}
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
          </button>

          {/* Quick Profile Popover */}
          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 p-3 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
                  <img
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                    src={user.avatarUrl}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {user.name}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate">
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2 py-1 text-xs text-slate-600">
                  <span>Puntos Bienestar</span>
                  <span className="font-bold text-emerald-700">
                    {user.points} pts
                  </span>
                </div>

                <hr className="border-slate-100 my-1" />

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate('profile');
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    account_circle
                  </span>
                  <span>Ver mi perfil completo</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    logout
                  </span>
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
