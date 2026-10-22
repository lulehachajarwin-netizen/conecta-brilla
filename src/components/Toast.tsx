import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  icon?: string;
  type?: 'success' | 'info' | 'celebrate';
  visible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  icon = 'check_circle',
  type = 'success',
  visible,
  onClose,
}) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <aside
      aria-live="polite"
      className="fixed bottom-20 inset-x-4 max-w-sm mx-auto z-50 pointer-events-auto select-none"
    >
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-inverse-surface/95 text-inverse-on-surface shadow-2xl backdrop-blur-md border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            type === 'celebrate'
              ? 'bg-amber-400 text-amber-950 font-bold'
              : 'bg-primary-container text-on-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {type === 'celebrate' ? 'celebration' : icon}
          </span>
        </div>
        <p className="flex-1 text-xs font-medium leading-snug">
          {message}
        </p>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          aria-label="Cerrar notificación"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </aside>
  );
};
