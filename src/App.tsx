/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType, MoodType, ChallengeItem, UserProfile } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { LoginScreen } from './components/LoginScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { ChallengesScreen } from './components/ChallengesScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { Toast } from './components/Toast';

const INITIAL_USER: UserProfile = {
  name: 'Camila Valenzuela',
  role: 'Diseñadora de Experiencias UX',
  company: 'Empresa',
  email: 'camila.valenzuela@empresa.com',
  avatarUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD7GSVnY5b9GA3KP_KZXa-i9AVzmkHXNPZitRxzYw-h3CRDsy190y1mQ0lcIBKY_GgyAvxBcvcxrysFHS8a_P9C1k85mAqZqorvJcw-U39XQUNHR4ZZzxXdLCNU6vCAb0Rvg3GAhFjnC8ZpakZA-GL6wNq839EcTr-ZeFvtun9l3Cvg7qBBDvI13-lU2YRz81D2mRebbDi4VPNxlDiF1jHQ221YYcbMmXNK6Z852z80miEiWQI9gQ',
  streakDays: 4,
  points: 350,
  level: 2,
  levelTitle: 'Guardián de la Calma',
  nextBadge: 'Respiro Consciente',
  progressPercent: 70,
  teamCompletedBreaks: 48,
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
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB8oYR2cqkVrVqktmPp9-XHJLkhhe5ESp8Cw-DTWGPmgTmRMNCJuiMEpBiKgd3Yw-tZxsgPsV1YhE-hIWnlv7QwMSnYfKxnBrtA36BMzCs_CuDc2y_C_2-FLr7Tqczd5upj8DlxVoazRxIRRHOLjZZ2nasIExY3fPyivW8pYeGX3hHu9-3U_C6Pmd1jGTwvmx4wcOflaBdV0ZmdjAvwUzCZB4u_U-9fusCMRQSGTqgiUb4Gbc5zXQ',
    imageAlt: 'Vaso de agua fresca y planta sobre escritorio de madera',
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
    category: 'Conexión Humana',
    duration: '3 min',
    points: 70,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ8bTnJx4QYxLEys0B5imOb-Owz-6H9Fv9iuGMaab-WTn2HNQ6y3LtUUxzlqGvyAJZyo-Tu7Wv6O98cBRcXw3fPe3A5W2JLPHy5udc9_PdzAqbcUgvGr1sp3kImkzW-30v7ib4Qa9gTU4FUI_9kV4KDVcMhx3Lsh3QAnbjjA0w2kfHFJdItgtgcDFALaNxhwF7eoKIpTKun0VFbdu8pnJWJ8-KSYeY9qPpWN0uZjm02eskOKeixQ',
    imageAlt: 'Compañeras compartiendo una nota de aprecio y optimismo',
    categoryBg: 'bg-sky-100/70',
    categoryText: 'text-sky-900',
    completed: false,
    actionIcon: 'diversity_1',
  },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('login');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [challenges, setChallenges] = useState<ChallengeItem[]>(INITIAL_CHALLENGES);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>('calma');

  // Device frame presentation mode for desktop reviewers
  const [deviceFrameMode, setDeviceFrameMode] = useState<'mobile-frame' | 'responsive'>(
    'responsive'
  );

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

  const handleCompleteChallenge = (challengeId: string) => {
    const targetChallenge = challenges.find((c) => c.id === challengeId);
    if (!targetChallenge || targetChallenge.completed) return;

    // 1. Mark challenge as completed
    const updatedChallenges = challenges.map((c) =>
      c.id === challengeId ? { ...c, completed: true } : c
    );
    setChallenges(updatedChallenges);

    // 2. Increment points & calculate new progress percentage
    const addedPoints = targetChallenge.points;
    const newPoints = user.points + addedPoints;
    const completedCount = updatedChallenges.filter((c) => c.completed).length;

    // Progress updates: 70% initial -> 85% with 1 completed -> 100% with both completed
    let newProgress = 70;
    if (completedCount === 1) newProgress = 85;
    if (completedCount >= 2) newProgress = 100;

    setUser((prev) => ({
      ...prev,
      points: newPoints,
      progressPercent: newProgress,
      teamCompletedBreaks: prev.teamCompletedBreaks + 1,
    }));

    // 3. Show celebratory toast
    showToast(
      `¡Bien hecho! 🌟 Sumaste +${addedPoints} pts a tu bienestar.`,
      'celebration',
      'celebrate'
    );
  };

  const handleResetChallenges = () => {
    setChallenges(INITIAL_CHALLENGES);
    setUser(INITIAL_USER);
    showToast('Retos y progreso restaurados para la demostración.', 'refresh');
  };

  const handleLogout = () => {
    setCurrentScreen('login');
    showToast('Sesión cerrada. Regresaste a la Pantalla 1.', 'logout');
  };

  const uncompletedCount = challenges.filter((c) => !c.completed).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start text-slate-800 antialiased font-sans">
      {/* Top Floating Helper Controls for Evaluation */}
      <div className="w-full bg-slate-900/90 backdrop-blur-md text-white py-2 px-4 flex items-center justify-between text-xs z-50 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">
            Prototipo Conecta &amp; Brilla
          </span>
          <span className="text-slate-400 hidden sm:inline">
            • Pantalla activa: <strong className="text-white capitalize">{currentScreen}</strong>
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
              3. Retos
            </button>
          </div>

          {/* Toggle Device Frame / Full View */}
          <button
            onClick={() =>
              setDeviceFrameMode(
                deviceFrameMode === 'mobile-frame' ? 'responsive' : 'mobile-frame'
              )
            }
            className="hidden md:flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors text-[11px]"
            title="Alternar vista con marco de teléfono o ancho adaptable"
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

          {/* Screen Content with Smooth Animated Transitions */}
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
                    onLoginSuccess={() => setCurrentScreen('dashboard')}
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
                    onShowToast={showToast}
                    onNavigateToChallenges={() => setCurrentScreen('challenges')}
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
                    onLogout={handleLogout}
                    onShowToast={showToast}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

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
