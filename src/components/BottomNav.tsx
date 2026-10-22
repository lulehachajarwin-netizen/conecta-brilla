import React from 'react';
import { ScreenType } from '../types';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  uncompletedChallengesCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  uncompletedChallengesCount = 0,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ScreenType,
      label: 'Inicio',
      icon: 'wb_sunny',
      badge: null,
    },
    {
      id: 'challenges' as ScreenType,
      label: 'Retos',
      icon: 'stars',
      badge: uncompletedChallengesCount > 0 ? uncompletedChallengesCount : null,
    },
    {
      id: 'profile' as ScreenType,
      label: 'Perfil',
      icon: 'person',
      badge: null,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-surface/90 backdrop-blur-xl border-t border-surface-container-high/60 shadow-[0_-4px_24px_rgba(15,23,42,0.06)] pb-safe select-none"
      aria-label="Navegación principal"
    >
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[48px] px-3 py-1.5 rounded-2xl transition-all duration-200 group active:scale-95 focus:outline-none ${
                isActive
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant hover:text-primary font-medium'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active pill subtle background indicator */}
              {isActive && (
                <span className="absolute inset-0 bg-primary-fixed/30 rounded-2xl -z-10 animate-in fade-in zoom-in-95 duration-200" />
              )}

              <div className="relative flex items-center justify-center">
                <span
                  className={`material-symbols-outlined text-[24px] transition-transform duration-200 ${
                    isActive ? 'scale-110 material-symbols-fill text-primary' : 'text-slate-500'
                  }`}
                >
                  {item.icon}
                </span>

                {/* Badge indicator for available challenges */}
                {item.badge !== null && (
                  <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-tertiary-container rounded-full shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] tracking-tight transition-colors ${
                  isActive ? 'text-primary font-bold' : 'text-slate-600'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
