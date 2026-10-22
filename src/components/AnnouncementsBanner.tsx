import React, { useState } from 'react';
import { Announcement, AnnouncementCategory, UserProfile } from '../types';

interface AnnouncementsBannerProps {
  announcement: Announcement;
  user: UserProfile;
  onUpdateAnnouncement: (updated: Announcement) => void;
  onToggleAdminRole?: () => void;
  onShowToast: (message: string, icon?: string, type?: 'success' | 'info' | 'celebrate') => void;
}

export const AnnouncementsBanner: React.FC<AnnouncementsBannerProps> = ({
  announcement,
  user,
  onUpdateAnnouncement,
  onToggleAdminRole,
  onShowToast,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRsvpd, setIsRsvpd] = useState(announcement.userRsvp || false);
  const [rsvpCount, setRsvpCount] = useState(announcement.rsvpCount || 14);

  // Form state for editing
  const [formTitle, setFormTitle] = useState(announcement.title);
  const [formMessage, setFormMessage] = useState(announcement.message);
  const [formCategory, setFormCategory] = useState<AnnouncementCategory>(announcement.category);
  const [formScheduledTime, setFormScheduledTime] = useState(announcement.scheduledTime || 'Hoy a las 3:00 PM');
  const [formIsPinned, setFormIsPinned] = useState(announcement.isPinned);

  const isAdmin = Boolean(user.isAdmin || user.role.toLowerCase().includes('admin') || user.role.toLowerCase().includes('propietari'));

  const handleToggleRsvp = () => {
    const nextState = !isRsvpd;
    setIsRsvpd(nextState);
    const nextCount = nextState ? rsvpCount + 1 : Math.max(0, rsvpCount - 1);
    setRsvpCount(nextCount);

    onUpdateAnnouncement({
      ...announcement,
      userRsvp: nextState,
      rsvpCount: nextCount,
    });

    onShowToast(
      nextState
        ? '¡Confirmaste tu asistencia a la Pausa Activa! 🙌'
        : 'Participación cancelada.',
      nextState ? 'check_circle' : 'remove_circle',
      nextState ? 'celebrate' : 'info'
    );
  };

  const handleCopyAnnouncement = () => {
    const textToCopy = `📢 ${announcement.title}\n🕒 ${announcement.scheduledTime || ''}\n${announcement.message}\n— Programa Conecta & Brilla`;
    navigator.clipboard?.writeText(textToCopy);
    onShowToast('¡Recordatorio copiado al portapapeles! Listo para compartir.', 'content_copy', 'info');
  };

  const handleOpenEdit = () => {
    setFormTitle(announcement.title);
    setFormMessage(announcement.message);
    setFormCategory(announcement.category);
    setFormScheduledTime(announcement.scheduledTime || 'Hoy a las 3:00 PM');
    setFormIsPinned(announcement.isPinned);
    setIsModalOpen(true);
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formMessage.trim()) return;

    const categoryLabels: Record<AnnouncementCategory, string> = {
      pausa_activa: 'Pausa Activa Semanal',
      taller: 'Taller de Bienestar',
      comunicado: 'Comunicado Oficial',
      celebracion: 'Celebración de Equipo',
    };

    const updated: Announcement = {
      ...announcement,
      title: formTitle.trim(),
      message: formMessage.trim(),
      category: formCategory,
      categoryLabel: categoryLabels[formCategory],
      scheduledTime: formScheduledTime.trim(),
      isPinned: formIsPinned,
      dateString: 'Actualizado hoy',
      authorName: user.name || 'Administración de Bienestar',
      authorRole: user.role || 'Administrador',
      rsvpCount,
      userRsvp: isRsvpd,
    };

    onUpdateAnnouncement(updated);
    setIsModalOpen(false);
    onShowToast('¡Comunicado oficial actualizado y visible para todo el equipo! 📢', 'campaign', 'celebrate');
  };

  // Quick preset templates for admin convenience
  const applyPreset = (preset: 'pausa' | 'mindfulness' | 'viernes') => {
    if (preset === 'pausa') {
      setFormTitle('Recordatorio: Hoy a las 3:00 PM tenemos nuestra Pausa Activa semanal');
      setFormMessage('Desconéctate 15 minutos: tendremos ejercicios suaves de estiramiento guiado, respiración consciente y un espacio para reír juntas.');
      setFormCategory('pausa_activa');
      setFormScheduledTime('Hoy a las 3:00 PM');
    } else if (preset === 'mindfulness') {
      setFormTitle('Taller Especial: Gestión del Estrés y Desconexión Digital');
      setFormMessage('Aprende técnicas sencillas para dejar las preocupaciones del trabajo fuera de tu tiempo personal con nuestra psicóloga invitada.');
      setFormCategory('taller');
      setFormScheduledTime('Mañana a las 11:00 AM');
    } else {
      setFormTitle('Viernes de Reconocimiento y Cierre Consciente');
      setFormMessage('Acompáñanos a las 4:30 PM para agradecer a las compañeras que hicieron la diferencia esta semana y brindar por el fin de semana.');
      setFormCategory('celebracion');
      setFormScheduledTime('Viernes a las 4:30 PM');
    }
  };

  return (
    <>
      <section
        aria-label="Anuncios del Equipo y Pausas Activas"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-5 shadow-md border border-emerald-500/30 flex flex-col gap-3.5 transition-all"
      >
        {/* Glow ambient effects */}
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-emerald-500/20 blur-2xl pointer-events-none" />
        <div className="absolute -left-6 -bottom-6 w-28 h-28 rounded-full bg-amber-500/15 blur-xl pointer-events-none" />

        {/* Top meta row */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-300">
              <span className="material-symbols-outlined text-[17px] material-symbols-fill animate-pulse">
                campaign
              </span>
            </span>
            <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-200">
              Anuncios del Equipo • Pausas Activas
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {announcement.isPinned && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 text-[10px] font-bold">
                <span className="material-symbols-outlined text-[12px] material-symbols-fill">
                  push_pin
                </span>
                <span>Fijado</span>
              </span>
            )}

            {isAdmin ? (
              <button
                type="button"
                onClick={handleOpenEdit}
                aria-label="Editar comunicado como Administrador"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-[11px] font-bold text-white transition-all active:scale-95 border border-white/30 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[14px]">edit_note</span>
                <span>Editar (Admin)</span>
              </button>
            ) : (
              onToggleAdminRole && (
                <button
                  type="button"
                  onClick={onToggleAdminRole}
                  title="Cambiar temporalmente al rol de Administrador para probar la publicación"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[10px] text-slate-300 transition-colors"
                >
                  <span className="material-symbols-outlined text-[12px]">admin_panel_settings</span>
                  <span>Modo Admin</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col gap-1.5">
          {announcement.scheduledTime && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold w-fit border border-emerald-500/30">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              <span>{announcement.scheduledTime}</span>
            </div>
          )}

          <h3 className="text-base font-extrabold text-white leading-snug tracking-tight">
            {announcement.title}
          </h3>

          <p className="text-xs text-slate-200 leading-relaxed font-normal">
            {announcement.message}
          </p>

          <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-300/80">
            <span className="material-symbols-outlined text-[14px]">account_circle</span>
            <span>{announcement.authorName} ({announcement.authorRole})</span>
          </div>
        </div>

        {/* Action Row */}
        <div className="relative z-10 flex items-center justify-between gap-2 pt-1 border-t border-white/10">
          <button
            type="button"
            onClick={handleToggleRsvp}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs ${
              isRsvpd
                ? 'bg-emerald-400 text-slate-900 shadow-emerald-400/30'
                : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isRsvpd ? 'check_circle' : 'handshake'}
            </span>
            <span>{isRsvpd ? '¡Asistiré!' : 'Me sumo a la pausa'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">
              {rsvpCount}
            </span>
          </button>

          <button
            type="button"
            onClick={handleCopyAnnouncement}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">content_copy</span>
            <span className="hidden xs:inline">Copiar</span>
          </button>
        </div>
      </section>

      {/* Admin Announcement Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">edit_calendar</span>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Publicar / Actualizar Comunicado
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Rol: {user.role} ({user.name})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {/* Quick Templates */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Plantillas rápidas:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyPreset('pausa')}
                  className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-[11px] font-semibold hover:bg-emerald-100 transition-colors"
                >
                  ⚡ Pausa Activa 3:00 PM
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('mindfulness')}
                  className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-900 border border-sky-200 text-[11px] font-semibold hover:bg-sky-100 transition-colors"
                >
                  🌿 Taller Mindfulness
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('viernes')}
                  className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-semibold hover:bg-amber-100 transition-colors"
                >
                  🎉 Cierre de Viernes
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveAnnouncement} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-800">
                  Título del Anuncio
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ej: Recordatorio: Hoy a las 3:00 PM..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-800">
                  Horario Programado / Fecha
                </label>
                <input
                  type="text"
                  value={formScheduledTime}
                  onChange={(e) => setFormScheduledTime(e.target.value)}
                  placeholder="Ej: Hoy a las 3:00 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-800">
                  Categoría
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as AnnouncementCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="pausa_activa">Pausa Activa Semanal</option>
                  <option value="taller">Taller de Bienestar</option>
                  <option value="comunicado">Comunicado Oficial</option>
                  <option value="celebracion">Celebración de Equipo</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-800">
                  Mensaje / Detalles para el equipo
                </label>
                <textarea
                  rows={3}
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Explica el objetivo, link o instrucciones..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pinAnnouncement"
                  checked={formIsPinned}
                  onChange={(e) => setFormIsPinned(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <label htmlFor="pinAnnouncement" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Fijar este anuncio en la parte superior para todo el equipo
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">publish</span>
                  <span>Publicar Comunicado</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
