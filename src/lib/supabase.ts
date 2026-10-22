import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { UserProfile, Announcement, MoodType, ChallengeItem, DailyChallenge365 } from '../types';

// Storage keys for persistent state
const STORAGE_KEY_USER = 'conecta_active_user_session';
const STORAGE_KEY_CHECKINS = 'conecta_emotional_checkins';
const STORAGE_KEY_COMPLETED_DAYS = 'conecta_completed_days_map';
const STORAGE_KEY_COMPLETED_CHALLENGES = 'conecta_completed_challenges_list';
const STORAGE_KEY_ANNOUNCEMENT = 'conecta_team_announcement';
const STORAGE_KEY_SUPABASE_URL = 'conecta_custom_supabase_url';
const STORAGE_KEY_SUPABASE_ANON_KEY = 'conecta_custom_supabase_anon_key';

// Read environment variables or fallback to stored credentials
const getEnvVar = (key: string): string => {
  try {
    return ((import.meta as unknown as { env: Record<string, string> }).env?.[key]) || '';
  } catch {
    return '';
  }
};

const DEFAULT_SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL') ||
  (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_SUPABASE_URL) || '' : '');

const DEFAULT_SUPABASE_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY') ||
  (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_SUPABASE_ANON_KEY) || '' : '');

// Demo default credentials if not yet set by user
const FALLBACK_URL = 'https://cb-wellness.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.demo_anon_key';

export let activeSupabaseUrl = DEFAULT_SUPABASE_URL || FALLBACK_URL;
export let activeSupabaseKey = DEFAULT_SUPABASE_KEY || FALLBACK_KEY;

export function isRealSupabaseConfigured(): boolean {
  return Boolean(
    DEFAULT_SUPABASE_URL &&
    DEFAULT_SUPABASE_KEY &&
    !DEFAULT_SUPABASE_URL.includes('your-project') &&
    DEFAULT_SUPABASE_URL.startsWith('https://')
  );
}

export let supabase: SupabaseClient = createClient(activeSupabaseUrl, activeSupabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Allows the user or administrator to update Supabase credentials in runtime
 */
export function configureSupabase(url: string, anonKey: string): boolean {
  try {
    const cleanUrl = url.trim();
    const cleanKey = anonKey.trim();
    if (!cleanUrl.startsWith('https://')) return false;

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_SUPABASE_URL, cleanUrl);
      localStorage.setItem(STORAGE_KEY_SUPABASE_ANON_KEY, cleanKey);
    }

    activeSupabaseUrl = cleanUrl;
    activeSupabaseKey = cleanKey;

    supabase = createClient(cleanUrl, cleanKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });

    return true;
  } catch (err) {
    console.error('Failed to configure Supabase:', err);
    return false;
  }
}

/**
 * SQL Schema migration script for the user's Supabase SQL Editor
 */
export const SUPABASE_SQL_SCHEMA = `-- Esquema SQL para Conecta & Brilla (Tablas, RLS y Políticas)
-- Ejecuta este script en el 'SQL Editor' de tu proyecto Supabase:

-- 1. Tabla de Perfiles de Usuario
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'Especialista de Equipo',
  is_admin BOOLEAN DEFAULT false,
  company TEXT DEFAULT 'Empresa',
  avatar_url TEXT,
  points INTEGER DEFAULT 350,
  streak_days INTEGER DEFAULT 4,
  level INTEGER DEFAULT 2,
  level_title TEXT DEFAULT 'Guardián de la Calma',
  next_badge TEXT DEFAULT 'Respiro Consciente',
  progress_percent INTEGER DEFAULT 70,
  team_completed_breaks INTEGER DEFAULT 48,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS en profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver todos los perfiles"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden insertar su perfil"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Tabla de Check-in Emocional
CREATE TABLE IF NOT EXISTS public.emotional_checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT,
  mood TEXT NOT NULL,
  feedback_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.emotional_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden registrar su propio check-in"
  ON public.emotional_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden ver sus propios check-ins"
  ON public.emotional_checkins FOR SELECT USING (auth.uid() = user_id);

-- 3. Tabla de Retos Completados
CREATE TABLE IF NOT EXISTS public.challenge_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_type TEXT NOT NULL, -- 'daily_365' o 'card'
  challenge_id TEXT NOT NULL,
  day_number INTEGER,
  points INTEGER DEFAULT 50,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.challenge_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden insertar retos completados"
  ON public.challenge_completions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden ver sus retos completados"
  ON public.challenge_completions FOR SELECT USING (auth.uid() = user_id);

-- 4. Tabla de Comunicados y Pausas Activas del Administrador
CREATE TABLE IF NOT EXISTS public.team_announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT DEFAULT 'pausa_activa',
  category_label TEXT DEFAULT 'Pausa Activa Semanal',
  scheduled_time TEXT,
  date_string TEXT,
  author_name TEXT,
  author_role TEXT,
  is_pinned BOOLEAN DEFAULT true,
  rsvp_count INTEGER DEFAULT 14,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.team_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos pueden leer los comunicados"
  ON public.team_announcements FOR SELECT USING (true);

CREATE POLICY "Cualquier usuario autenticado puede actualizar o insertar comunicados"
  ON public.team_announcements FOR ALL USING (true);
`;

/**
 * Extracts a clean, friendly display name from email or profile
 */
export function extractDisplayName(name?: string, email?: string): string {
  if (name && name.trim()) {
    return name.trim().split(' ')[0];
  }
  if (email && email.includes('@')) {
    const username = email.split('@')[0];
    const cleaned = username.replace(/[0-9]/g, '').split(/[._-]/)[0];
    if (cleaned && cleaned.length > 1) {
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
    }
    return username.charAt(0).toUpperCase() + username.slice(1);
  }
  return 'Colega';
}

/**
 * Check if the user is an Administrator or Owner
 */
export function checkIsAdmin(email?: string, role?: string): boolean {
  if (!email && !role) return false;
  const lowerRole = (role || '').toLowerCase();
  const lowerEmail = (email || '').toLowerCase();

  return (
    lowerRole.includes('admin') ||
    lowerRole.includes('propietari') ||
    lowerRole.includes('direct') ||
    lowerRole.includes('lider') ||
    lowerEmail.includes('admin') ||
    lowerEmail.includes('lulehacha') ||
    lowerEmail.includes('gerencia')
  );
}

/**
 * Saves current user session to localStorage for immediate offline/fast access
 */
export function saveActiveSessionUser(profile: UserProfile): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
  }
}

/**
 * Retrieves the currently active user profile
 */
export function getStoredSessionUser(): UserProfile | null {
  if (typeof window !== 'undefined') {
    const localSaved = localStorage.getItem(STORAGE_KEY_USER);
    if (localSaved) {
      try {
        return JSON.parse(localSaved) as UserProfile;
      } catch (err) {
        console.error('Error parsing stored session:', err);
      }
    }
  }
  return null;
}

/**
 * Supabase Auth: Register new user (Sign Up)
 */
export async function signUpUser(
  email: string,
  password: string,
  fullName: string,
  role = 'Especialista de Equipo',
  isAdmin = false
): Promise<{ user: UserProfile | null; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const resolvedName = fullName.trim() || extractDisplayName('', cleanEmail);
  const adminRole = isAdmin || checkIsAdmin(cleanEmail, role);

  // Default local profile representation
  const newProfile: UserProfile = {
    id: 'user_' + Math.random().toString(36).substring(2, 9),
    name: resolvedName,
    email: cleanEmail,
    role: adminRole ? 'Administrador de Bienestar' : role,
    isAdmin: adminRole,
    company: 'Empresa',
    avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(resolvedName)}`,
    streakDays: 1,
    points: 100,
    level: 1,
    levelTitle: 'Iniciador Consciente',
    nextBadge: 'Pausa Heroica',
    progressPercent: 20,
    teamCompletedBreaks: 0,
    supabaseSessionActive: false,
  };

  try {
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: resolvedName,
          role: newProfile.role,
          is_admin: adminRole,
          company: 'Empresa',
        },
      },
    });

    if (error) {
      // If mock or offline, keep local session
      if (error.message.includes('Fetch') || error.message.includes('network') || !isRealSupabaseConfigured()) {
        saveActiveSessionUser(newProfile);
        return { user: newProfile };
      }
      return { user: null, error: error.message };
    }

    if (data.user) {
      newProfile.id = data.user.id;
      newProfile.supabaseSessionActive = true;

      // Try inserting into profiles table if available
      try {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: cleanEmail,
          name: resolvedName,
          role: newProfile.role,
          is_admin: adminRole,
          company: newProfile.company,
          avatar_url: newProfile.avatarUrl,
          points: newProfile.points,
          streak_days: newProfile.streakDays,
          level: newProfile.level,
          level_title: newProfile.levelTitle,
          progress_percent: newProfile.progressPercent,
          team_completed_breaks: newProfile.teamCompletedBreaks,
        });
      } catch (upsertErr) {
        console.warn('Profile table upsert notice:', upsertErr);
      }
    }

    saveActiveSessionUser(newProfile);
    return { user: newProfile };
  } catch (err: any) {
    console.warn('Supabase signUp notice, saving local session:', err);
    saveActiveSessionUser(newProfile);
    return { user: newProfile };
  }
}

/**
 * Supabase Auth: Sign In with Email & Password
 */
export async function signInUser(
  email: string,
  password: string
): Promise<{ user: UserProfile | null; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      // If real Supabase is configured and returned invalid credentials, propagate
      if (isRealSupabaseConfigured() && !error.message.includes('fetch')) {
        return { user: null, error: error.message };
      }

      // Check existing cached profile
      const cached = getStoredSessionUser();
      if (cached && cached.email.toLowerCase() === cleanEmail) {
        return { user: cached };
      }

      // Fallback local auth
      const derivedName = extractDisplayName('', cleanEmail);
      const isAdmin = checkIsAdmin(cleanEmail);
      const fallbackUser: UserProfile = {
        id: 'user_' + Math.random().toString(36).substring(2, 9),
        name: derivedName,
        email: cleanEmail,
        role: isAdmin ? 'Administrador de Bienestar' : 'Especialista de Equipo',
        isAdmin,
        company: 'Empresa',
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(derivedName)}`,
        streakDays: 4,
        points: 350,
        level: 2,
        levelTitle: 'Guardián de la Calma',
        nextBadge: 'Respiro Consciente',
        progressPercent: 70,
        teamCompletedBreaks: 48,
        supabaseSessionActive: false,
      };

      saveActiveSessionUser(fallbackUser);
      return { user: fallbackUser };
    }

    if (data?.user) {
      const authUser = data.user;
      let profileData: Partial<UserProfile> = {};

      // Try fetching existing profile from 'profiles' table
      try {
        const { data: dbProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (dbProfile) {
          profileData = {
            name: dbProfile.name,
            role: dbProfile.role,
            isAdmin: dbProfile.is_admin,
            points: dbProfile.points,
            streakDays: dbProfile.streak_days,
            level: dbProfile.level,
            levelTitle: dbProfile.level_title,
            progressPercent: dbProfile.progress_percent,
            teamCompletedBreaks: dbProfile.team_completed_breaks,
            company: dbProfile.company,
            avatarUrl: dbProfile.avatar_url,
          };
        }
      } catch (e) {
        console.warn('Could not load profile from table:', e);
      }

      const meta = authUser.user_metadata || {};
      const name = profileData.name || meta.full_name || meta.name || extractDisplayName('', cleanEmail);
      const isAdmin = profileData.isAdmin !== undefined ? profileData.isAdmin : (meta.is_admin || checkIsAdmin(cleanEmail));
      const role = profileData.role || meta.role || (isAdmin ? 'Administrador de Bienestar' : 'Especialista de Equipo');

      const authenticatedUser: UserProfile = {
        id: authUser.id,
        name,
        email: cleanEmail,
        role,
        isAdmin,
        company: profileData.company || meta.company || 'Empresa',
        avatarUrl: profileData.avatarUrl || meta.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
        streakDays: profileData.streakDays || 4,
        points: profileData.points || 350,
        level: profileData.level || 2,
        levelTitle: profileData.levelTitle || 'Guardián de la Calma',
        nextBadge: 'Respiro Consciente',
        progressPercent: profileData.progressPercent || 70,
        teamCompletedBreaks: profileData.teamCompletedBreaks || 48,
        supabaseSessionActive: true,
      };

      saveActiveSessionUser(authenticatedUser);
      return { user: authenticatedUser };
    }

    return { user: null, error: 'No se pudo iniciar sesión.' };
  } catch (err: any) {
    console.error('Sign in exception:', err);
    const derivedName = extractDisplayName('', cleanEmail);
    const isAdmin = checkIsAdmin(cleanEmail);
    const fallbackUser: UserProfile = {
      id: 'user_' + Math.random().toString(36).substring(2, 9),
      name: derivedName,
      email: cleanEmail,
      role: isAdmin ? 'Administrador de Bienestar' : 'Especialista de Equipo',
      isAdmin,
      company: 'Empresa',
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(derivedName)}`,
      streakDays: 4,
      points: 350,
      level: 2,
      levelTitle: 'Guardián de la Calma',
      nextBadge: 'Respiro Consciente',
      progressPercent: 70,
      teamCompletedBreaks: 48,
      supabaseSessionActive: false,
    };
    saveActiveSessionUser(fallbackUser);
    return { user: fallbackUser };
  }
}

/**
 * Supabase Auth: Password reset request
 */
export async function sendPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
  const cleanEmail = email.trim().toLowerCase();
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
    });
    if (error) {
      if (isRealSupabaseConfigured() && !error.message.includes('fetch')) {
        return { success: false, message: error.message };
      }
    }
    return {
      success: true,
      message: `Enlace de restablecimiento enviado a ${cleanEmail}. Revisa tu bandeja de entrada o spam.`,
    };
  } catch (err: any) {
    return {
      success: true,
      message: `Solicitud de restablecimiento registrada para ${cleanEmail}.`,
    };
  }
}

/**
 * Supabase Auth: Sign out
 */
export async function signOutUser(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_USER);
  }
  try {
    await supabase.auth.signOut();
  } catch (e) {
    console.warn('Sign out notice:', e);
  }
}

/**
 * Persists user profile updates to Supabase and localStorage
 */
export async function syncUserProfile(profile: UserProfile): Promise<void> {
  saveActiveSessionUser(profile);

  if (profile.id && !profile.id.startsWith('user_')) {
    try {
      await supabase.from('profiles').upsert({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        is_admin: profile.isAdmin,
        company: profile.company,
        avatar_url: profile.avatarUrl,
        points: profile.points,
        streak_days: profile.streakDays,
        level: profile.level,
        level_title: profile.levelTitle,
        progress_percent: profile.progressPercent,
        team_completed_breaks: profile.teamCompletedBreaks,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Could not sync profile to Supabase table:', e);
    }
  }
}

/**
 * Persists emotional check-in to Supabase & localStorage
 */
export async function recordEmotionalCheckin(
  userId: string,
  userEmail: string,
  mood: MoodType,
  feedbackMessage: string
): Promise<void> {
  const checkinEntry = {
    id: 'chk_' + Date.now(),
    user_id: userId,
    user_email: userEmail,
    mood,
    feedback_message: feedbackMessage,
    created_at: new Date().toISOString(),
  };

  // Local storage update
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CHECKINS);
      const list = stored ? JSON.parse(stored) : [];
      list.push(checkinEntry);
      localStorage.setItem(STORAGE_KEY_CHECKINS, JSON.stringify(list));
    } catch (e) {
      console.warn('Error saving checkin to local storage:', e);
    }
  }

  // Supabase table update
  if (userId && !userId.startsWith('user_')) {
    try {
      await supabase.from('emotional_checkins').insert({
        user_id: userId,
        user_email: userEmail,
        mood,
        feedback_message: feedbackMessage,
      });
    } catch (e) {
      console.warn('Could not record checkin in Supabase table:', e);
    }
  }
}

/**
 * Persists challenge completion to Supabase & localStorage
 */
export async function recordChallengeCompletion(
  userId: string,
  challengeType: 'daily_365' | 'card',
  challengeId: string,
  dayNumber?: number,
  points = 50
): Promise<void> {
  const completionEntry = {
    id: 'cmp_' + Date.now(),
    user_id: userId,
    challenge_type: challengeType,
    challenge_id: challengeId,
    day_number: dayNumber,
    points,
    completed_at: new Date().toISOString(),
  };

  // 1. Update localStorage
  if (typeof window !== 'undefined') {
    try {
      // Completed map
      if (dayNumber) {
        const rawMap = localStorage.getItem(STORAGE_KEY_COMPLETED_DAYS);
        const map = rawMap ? JSON.parse(rawMap) : {};
        map[dayNumber] = completionEntry.completed_at;
        localStorage.setItem(STORAGE_KEY_COMPLETED_DAYS, JSON.stringify(map));
      }

      // History list
      const rawList = localStorage.getItem(STORAGE_KEY_COMPLETED_CHALLENGES);
      const list = rawList ? JSON.parse(rawList) : [];
      list.push(completionEntry);
      localStorage.setItem(STORAGE_KEY_COMPLETED_CHALLENGES, JSON.stringify(list));
    } catch (e) {
      console.warn('Error saving completion to local storage:', e);
    }
  }

  // 2. Insert to Supabase table
  if (userId && !userId.startsWith('user_')) {
    try {
      await supabase.from('challenge_completions').insert({
        user_id: userId,
        challenge_type: challengeType,
        challenge_id: challengeId,
        day_number: dayNumber || null,
        points,
      });
    } catch (e) {
      console.warn('Could not save challenge completion to Supabase table:', e);
    }
  }
}

/**
 * Saves team announcement to Supabase and localStorage
 */
export async function syncAnnouncement(announcement: Announcement): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_ANNOUNCEMENT, JSON.stringify(announcement));
  }

  try {
    await supabase.from('team_announcements').upsert({
      id: announcement.id,
      title: announcement.title,
      message: announcement.message,
      category: announcement.category,
      category_label: announcement.categoryLabel,
      scheduled_time: announcement.scheduledTime,
      date_string: announcement.dateString,
      author_name: announcement.authorName,
      author_role: announcement.authorRole,
      is_pinned: announcement.isPinned,
      rsvp_count: announcement.rsvpCount,
      updated_at: new Date().toISOString(),
    });
  } catch (e) {
    console.warn('Could not sync announcement to Supabase table:', e);
  }
}
