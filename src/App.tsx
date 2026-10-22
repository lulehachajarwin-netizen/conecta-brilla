/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType, MoodType, ChallengeItem, UserProfile, Announcement, DailyChallenge365 } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { LoginScreen } from './components/LoginScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { ChallengesScreen } from './components/ChallengesScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { Toast } from './components/Toast';
import { VoiceAssistantFloatingButton } from './components/VoiceAssistantFloatingButton';
import { VoicePsychologistModal } from './components/VoicePsychologistModal';
import { getTodayChallenge, setDayChallengeCompleted } from './data/challenges365';
import { extractDisplayName, saveActiveSessionUser, clearSession } from './lib/supabase';

const INITIAL_USER: UserProfile = {
  name: 'Alejandra Santos',
  role: 'Especialista de Equipo',
  isAdmin: false,
  company: 'Empresa',
  email: 'alejandra.santos@empresa.com',
  avatarUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  streakDays: 4,
  points: 350,
  level: 2,
  levelTitle: 'Guardián de la Calma',
  nextBadge: 'Respiro Consciente',
  progressPercent: 70,
  teamCompletedBreaks: 48,
  supabaseSessionActive: true,
};

const INITIAL_ANNOUNCEMENT: Announcement = {
  id: 'announcement-1',
  title: 'Recordatorio: Hoy a las 3:00 PM tenemos nuestra Pausa Activa semanal',
  message:
    'Tómate 15 minutos para desconectarte de la pantalla, realizar estiramientos cervicales guiados y respirar con el equipo.',
  category: 'pausa_activa',
  categoryLabel: 'Pausa Activa Semanal',
  scheduledTime: 'Hoy a las 3:00 PM',
  dateString: 'Hoy',
  authorName: 'Equipo de Bienestar Laboral',
  authorRole: 'Administrador',
  isPinned: true,
  rsvpCount: 14,
  userRsvp: false,
};

const INITIAL_CHALLENGES: ChallengeItem[] = [
  {
    id: 'card-challenge-1',
    title: 'Toma una pausa activa de 5 minutos',
    description:
      'Aléjate de la pantalla, estira suavemente tus hombros y cuello, y bebe un vaso con agua para renovar tu enfoque.',
    category: 'Autocuidado',
    duration: '5 min',
    points: 50,
    imageUrl:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=200&q=80',
    imageAlt: 'Vaso de agua fresca y estiramiento consciente',
    categoryBg: 'bg-emerald-100/70',
    categoryText: 'text-emerald-900',
    completed: false,
    actionIcon: 'nature_people',
  },
  {
    id: 'card-challenge-2',
    title: 'Envía un reconocimiento sincero a una compañera',
    description:
      'Dedica unas palabras de agradecimiento o destaca el apoyo brindado por alguien de tu equipo esta semana.',
    category: 'Reconocimiento entre Compañeras',
    duration: '3 min',
    points: 70,
    imageUrl:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=200&q=80',
    imageAlt: 'Compañeras compartiendo una nota de aprecio y optimismo',
    categoryBg: 'bg-sky-100/70',
    categoryText: 'text-sky-900',
    completed: false,
    actionIcon: 'diversity_1',
  },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  const [user, setUser] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('conecta_active_user_session');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_USER;
  });

  const [announcement, setAnnouncement] = useState<Announcement>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('conecta_team_announcement');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_ANNOUNCEMENT;
  });

  const [todayChallenge, setTodayChallenge] = useState<DailyChallenge365>(() => getTodayChallenge());
  const [challenges, setChallenges] = useState<ChallengeItem[]>(INITIAL_CHALLENGES);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>('calma');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Device frame presentation mode for desktop reviewers
  const [deviceFrameMode, setDeviceFrameMode] = useState<'mobile-frame' | 'responsive'>('responsive');

  // Toast state
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    icon: string;
    type: 'success' | 'info' | 'celebrate';
  }>({
    visible: false,
    message: '',
    icon: 'check_circle',
    type: 'success',
  });

  const showToast = (
    message: string,
    icon: string = 'check_circle',
    type: 'success' | 'info' | 'celebrate' = 'success'
  ) => {
    setToast({
      visible: true,
      message,
      icon,
      type,
    });
  };

  // Sync user state changes to storage
  useEffect(() => {
    saveActiveSessionUser(user);
  }, [user]);

  // Sync announcement updates to storage
  const handleUpdateAnnouncement = (updated: Announcement) => {
    setAnnouncement(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('conecta_team_announcement', JSON.stringify(updated));
    }
  };

  // Toggle admin role for testing publishing capabilities
  const handleToggleAdminRole = () => {
    const nextIsAdmin = !user.isAdmin;
    const nextRole = nextIsAdmin ? 'Administrador de Bienestar' : 'Especialista de Equipo';
    setUser((prev) => ({
      ...prev,
      isAdmin: nextIsAdmin,
      role: nextRole,
    }));
    showToast(
      nextIsAdmin
        ? '¡Rol cambiado a Administrador! Ahora puedes publicar y editar comunicados. 📢'
        : 'Rol cambiado a Colaboradora estándar.',
      'admin_panel_settings',
      nextIsAdmin ? 'celebrate' : 'info'
    );
  };

  // Login handler
  const handleLoginSuccess = (userData: { email: string; name?: string; isAdmin?: boolean }) => {
    const resolvedName = userData.name || extractDisplayName(userData.name, userData.email);
    const isAdmin = Boolean(userData.isAdmin);
    const updatedUser: UserProfile = {
      ...user,
      email: userData.email,
      name: resolvedName,
      isAdmin,
      role: isAdmin ? 'Administrador de Bienestar' : 'Especialista de Equipo',
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(resolvedName)}`,
      supabaseSessionActive: true,
    };

    setUser(updatedUser);
    saveActiveSessionUser(updatedUser);
    setCurrentScreen('dashboard');
  };

  // Logout handler
  const handleLogout = () => {
    clearSession();
    setCurrentScreen('login');
    showToast('Sesión cerrada. Regresaste a la pantalla de acceso.', 'logout');
  };

  // Complete 365 daily challenge
  const handleComplete365DayChallenge = (dayNumber: number) => {
    const isCurrentlyDone = todayChallenge.dayOfYear === dayNumber && todayChallenge.completed;
    const nextDoneState = !isCurrentlyDone;

    setDayChallengeCompleted(dayNumber, nextDoneState);

    // Refresh today's challenge if it matches
    if (todayChallenge.dayOfYear === dayNumber) {
      setTodayChallenge((prev) => ({
        ...prev,
        completed: nextDoneState,
      }));
    }

    if (nextDoneState) {
      const addedPoints = todayChallenge.points || 50;
      setUser((prev) => ({
        ...prev,
        points: prev.points + addedPoints,
        streakDays: prev.streakDays + 1,
        progressPercent: Math.min(100, prev.progressPercent + 15),
        teamCompletedBreaks: prev.teamCompletedBreaks + 1,
      }));

      showToast(
        `¡Excelente! 🌟 Completaste el Reto del Día ${dayNumber} (+${addedPoints} pts).`,
        'celebration',
        'celebrate'
      );
    } else {
      showToast(`Reto del Día ${dayNumber} desmarcado.`, 'refresh');
    }
  };

  // Complete complementary micro-challenges
  const handleCompleteChallenge = (challengeId: string) => {
    const targetChallenge = challenges.find((c) => c.id === challengeId);
    if (!targetChallenge || targetChallenge.completed) return;

    const updatedChallenges = challenges.map((c) =>
      c.id === challengeId ? { ...c, completed: true } : c
    );
    setChallenges(updatedChallenges);

    const addedPoints = targetChallenge.points;
    const newPoints = user.points + addedPoints;
    const completedCount = updatedChallenges.filter((c) => c.completed).length;

    let newProgress = user.progressPercent;
    if (completedCount === 1) newProgress = 85;
    if (completedCount >= 2) newProgress = 100;

    setUser((prev) => ({
      ...prev,
      points: newPoints,
      progressPercent: newProgress,
      teamCompletedBreaks: prev.teamCompletedBreaks + 1,
    }));

    showToast(
      `¡Bien hecho! 🌟 Sumaste +${addedPoints} pts a tu bienestar.`,
      'celebration',
      'celebrate'
    );
  };

  const handleResetChallenges = () => {
    setChallenges(INITIAL_CHALLENGES);
    setUser(INITIAL_USER);
    setTodayChallenge(getTodayChallenge());
    showToast('Retos y progreso restaurados para la demostración.', 'refresh');
  };

  const uncompletedCount = challenges.filter((c) => !c.completed).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start text-slate-800 antialiased font-sans">
      {/* Top Floating Helper Controls for Review and Evaluation */}
      <div className="w-full bg-slate-900/90 backdrop-blur-md text-white py-2 px-4 flex items-center justify-between text-xs z-50 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">
            Conecta &amp; Brilla
          </span>
          <span className="text-slate-400 hidden sm:inline">
            • Usuario: <strong className="text-emerald-300">{extractDisplayName(user.name, user.email)}</strong>
            {' '}({user.isAdmin ? 'Admin' : 'Colaboradora'})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick jump bar for reviewing screens */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setCurrentScreen('login')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentScreen === 'login'
                  ? 'bg-emerald-500 text-white font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              1. Login
            </button>
            <button
              onClick={() => setCurrentScreen('dashboard')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentScreen === 'dashboard'
                  ? 'bg-emerald-500 text-white font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              2. Dashboard
            </button>
            <button
              onClick={() => setCurrentScreen('challenges')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentScreen === 'challenges'
                  ? 'bg-emerald-500 text-white font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              3. Retos 365
            </button>
            <button
              onClick={() => setCurrentScreen('profile')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentScreen === 'profile'
                  ? 'bg-emerald-500 text-white font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              4. Perfil
            </button>
          </div>

          {/* Quick toggle for Admin role */}
          <button
            onClick={handleToggleAdminRole}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 ${
              user.isAdmin
                ? 'bg-amber-500 text-white font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Alternar rol de Administrador para probar comunicados"
          >
            <span className="material-symbols-outlined text-[13px]">admin_panel_settings</span>
            <span>Admin: {user.isAdmin ? 'ON' : 'OFF'}</span>
          </button>

          {/* Direct trigger for Voice Assistant */}
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="hidden xs:flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-[11px] font-bold shadow-xs"
            title="Abrir Asistente de Voz Psicóloga"
          >
            <span className="material-symbols-outlined text-[14px]">mic</span>
            <span>Voz</span>
          </button>

          {/* Toggle Device Frame */}
          <button
            onClick={() =>
              setDeviceFrameMode(
                deviceFrameMode === 'mobile-frame' ? 'responsive' : 'mobile-frame'
              )
            }
            className="hidden md:flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors text-[11px]"
            title="Alternar vista con marco de teléfono o adaptable"
          >
            <span className="material-symbols-outlined text-[14px]">
              {deviceFrameMode === 'mobile-frame' ? 'smartphone' : 'fit_screen'}
            </span>
            <span>
              {deviceFrameMode === 'mobile-frame' ? 'Marco Móvil' : 'Adaptable'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Container / Mobile Frame Wrapper */}
      <div
        className={`w-full flex justify-center transition-all duration-300 ${
          deviceFrameMode === 'mobile-frame' ? 'py-8' : ''
        }`}
      >
        <div
          className={`relative bg-surface w-full overflow-hidden transition-all duration-300 ${
            deviceFrameMode === 'mobile-frame'
              ? 'max-w-[412px] min-h-[860px] rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border-[8px] border-slate-800 ring-1 ring-slate-900/10'
              : 'max-w-md min-h-screen shadow-md'
          }`}
        >
          {/* Mobile Speaker / Dynamic Island styling if in frame mode */}
          {deviceFrameMode === 'mobile-frame' && (
            <div className="absolute top-2 inset-x-0 z-50 flex justify-center pointer-events-none">
              <div className="w-24 h-4 bg-slate-900 rounded-full flex items-center justify-end px-2">
                <span className="w-2 h-2 rounded-full bg-slate-800" />
              </div>
            </div>
          )}

          {/* Persistent Fixed Header (Only in authenticated screens: Inicio, Retos, Perfil) */}
          {currentScreen !== 'login' && (
            <Header
              currentScreen={currentScreen}
              user={user}
              onNavigate={(screen) => setCurrentScreen(screen)}
              onLogout={handleLogout}
            />
          )}

          {/* Screen Content with Smooth Transitions */}
          <main className="relative w-full min-h-screen">
            <AnimatePresence mode="wait">
              {currentScreen === 'login' && (
                <motion.div
                  key="screen-login"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="w-full"
                >
                  <LoginScreen
                    initialEmail={user.email}
                    onLoginSuccess={handleLoginSuccess}
                    onShowToast={showToast}
                  />
                </motion.div>
              )}

              {currentScreen === 'dashboard' && (
                <motion.div
                  key="screen-dashboard"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="w-full"
                >
                  <DashboardScreen
                    user={user}
                    selectedMood={selectedMood}
                    onSelectMood={setSelectedMood}
                    announcement={announcement}
                    onUpdateAnnouncement={handleUpdateAnnouncement}
                    onToggleAdminRole={handleToggleAdminRole}
                    todayChallenge={todayChallenge}
                    onCompleteDailyChallenge={handleComplete365DayChallenge}
                    onShowToast={showToast}
                    onNavigateToChallenges={() => setCurrentScreen('challenges')}
                    onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
                  />
                </motion.div>
              )}

              {currentScreen === 'challenges' && (
                <motion.div
                  key="screen-challenges"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="w-full"
                >
                  <ChallengesScreen
                    user={user}
                    challenges={challenges}
                    onCompleteChallenge={handleCompleteChallenge}
                    onComplete365DayChallenge={handleComplete365DayChallenge}
                    onResetChallenges={handleResetChallenges}
                    onShowToast={showToast}
                  />
                </motion.div>
              )}

              {currentScreen === 'profile' && (
                <motion.div
                  key="screen-profile"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="w-full"
                >
                  <ProfileScreen
                    user={user}
                    onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
                    onToggleAdminRole={handleToggleAdminRole}
                    onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
                    onLogout={handleLogout}
                    onShowToast={showToast}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Floating Action Button for Voice Assistant ("Escucha & Apoyo") */}
          {currentScreen !== 'login' && (
            <VoiceAssistantFloatingButton onClick={() => setIsVoiceModalOpen(true)} />
          )}

          {/* Voice Psychologist Interactive Modal */}
          <VoicePsychologistModal
            user={user}
            isOpen={isVoiceModalOpen}
            onClose={() => setIsVoiceModalOpen(false)}
            onShowToast={showToast}
          />

          {/* Persistent Fixed Bottom Navigation Bar (Only in authenticated screens) */}
          {currentScreen !== 'login' && (
            <BottomNav
              currentScreen={currentScreen}
              onNavigate={(screen) => setCurrentScreen(screen)}
              uncompletedChallengesCount={uncompletedCount}
            />
          )}

          {/* Reusable Toast Notification */}
          <Toast
            visible={toast.visible}
            message={toast.message}
            icon={toast.icon}
            type={toast.type}
            onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
          />
        </div>
      </div>
    </div>
  );
}
