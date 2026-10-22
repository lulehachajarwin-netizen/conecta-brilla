import React from 'react';

interface VoiceAssistantFloatingButtonProps {
  onClick: () => void;
}

export const VoiceAssistantFloatingButton: React.FC<VoiceAssistantFloatingButtonProps> = ({
  onClick,
}) => {
  return (
    <div className="fixed bottom-20 right-4 z-40 flex items-center justify-end select-none">
      <button
        type="button"
        onClick={onClick}
        aria-label="Abrir asistente de voz interactivo Escucha y Apoyo"
        className="group relative flex items-center gap-2 pl-3.5 pr-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-lg hover:shadow-emerald-600/30 active:scale-95 transition-all duration-200 border border-emerald-400/40 cursor-pointer"
      >
        {/* Subtle glowing animated pulse aura */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400/30 blur-sm animate-pulse -z-10 group-hover:bg-emerald-400/50" />

        <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-white/20 text-white">
          <span className="material-symbols-outlined text-[18px] animate-pulse">
            mic
          </span>
        </div>

        <div className="flex flex-col text-left">
          <span className="text-xs font-extrabold tracking-tight leading-none text-white drop-shadow-xs">
            Escucha &amp; Apoyo
          </span>
          <span className="text-[9px] font-semibold text-emerald-200 leading-tight">
            IA Psicóloga Emocional
          </span>
        </div>
      </button>
    </div>
  );
};
