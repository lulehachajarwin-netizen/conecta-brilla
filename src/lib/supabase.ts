import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { UserProfile, Announcement } from '../types';

// Read environment variables or fallback to local storage configuration
const ENV_SUPABASE_URL = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_SUPABASE_URL || '';
const ENV_SUPABASE_ANON_KEY = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY || '';

// Check localStorage for user-provided Supabase config (allows testing in preview)
const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('conecta_supabase_url') || '' : '';
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('conecta_supabase_anon_key') || '' : '';

const activeUrl = ENV_SUPABASE_URL || storedUrl || 'https://xyzcompanyproject.supabase.co';
const activeKey = ENV_SUPABASE_ANON_KEY || storedKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key_for_preview';

export const isSupabaseConfigured = Boolean(
  (ENV_SUPABASE_URL && ENV_SUPABASE_ANON_KEY) || (storedUrl && storedKey)
);

export let supabase: SupabaseClient;

try {
  supabase = createClient(activeUrl, activeKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
} catch (e) {
  console.warn('Supabase client initialized with mock credentials:', e);
  supabase = createClient('https://mock.supabase.co', 'mock-key');
}

const STORAGE_KEY_USER = 'conecta_active_user_session';

/**
 * Extracts a clean, friendly display name from email or profile
 * Ensures no hardcoded names are ever forced.
 */
export function extractDisplayName(name?: string, email?: string): string {
  if (name && name.trim()) {
    const parts = name.trim().split(' ');
    return parts[0];
  }
  if (email && email.includes('@')) {
    const username = email.split('@')[0];
    // Remove numbers and separate by dot, dash or underscore
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
 * Retrieves the currently active user profile
 */
export async function getActiveSessionUser(): Promise<UserProfile | null> {
  // 1. Check local storage first for persisted fast boot
  if (typeof window !== 'undefined') {
    const localSaved = localStorage.getItem(STORAGE_KEY_USER);
    if (localSaved) {
      try {
        const parsed = JSON.parse(localSaved) as UserProfile;
        return parsed;
      } catch (err) {
        console.error('Error parsing stored session:', err);
      }
    }
  }

  // 2. Try fetching from Supabase auth if client is active
  if (supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const user: User = session.user;
        const email = user.email || '';
        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          extractDisplayName('', email);
        const role = user.user_metadata?.role || (checkIsAdmin(email) ? 'Administrador de Bienestar' : 'Especialista de Equipo');
        const isAdmin = checkIsAdmin(email, role);

        const profile: UserProfile = {
          id: user.id,
          name,
          email,
          role,
          isAdmin,
          company: user.user_metadata?.company || 'Conecta & Brilla Wellness',
          avatarUrl:
            user.user_metadata?.avatar_url ||
            `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(email || name)}`,
          streakDays: 4,
          points: 350,
          level: 2,
          levelTitle: 'Guardián de la Calma',
          nextBadge: 'Respiro Consciente',
          progressPercent: 70,
          teamCompletedBreaks: 48,
          supabaseSessionActive: true,
        };

        saveActiveSessionUser(profile);
        return profile;
      }
    } catch (e) {
      console.warn('Could not retrieve Supabase session:', e);
    }
  }

  return null;
}

/**
 * Saves current user session to localStorage and syncs state
 */
export function saveActiveSessionUser(profile: UserProfile): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
  }
}

/**
 * Clears active session
 */
export async function clearSession(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_USER);
  }
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }
}

/**
 * Perform login: authenticates via Supabase if possible,
 * or gracefully generates dynamic active session from user credentials.
 */
export async function loginUser(
  email: string,
  password?: string,
  customName?: string,
  asAdmin: boolean = false
): Promise<UserProfile> {
  const cleanEmail = email.trim().toLowerCase();
  let supId = '';
  let metaName = customName;

  // Try real Supabase login if configured
  if (isSupabaseConfigured && password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (!error && data.user) {
        supId = data.user.id;
        metaName = data.user.user_metadata?.name || data.user.user_metadata?.full_name || metaName;
      }
    } catch (e) {
      console.log('Supabase sign in note:', e);
    }
  }

  const derivedName = metaName || extractDisplayName('', cleanEmail);
  const isAdmin = asAdmin || checkIsAdmin(cleanEmail);
  const role = isAdmin ? 'Administrador de Bienestar' : 'Especialista de Equipo';

  const userProfile: UserProfile = {
    id: supId || 'user_' + Math.random().toString(36).substring(2, 9),
    name: derivedName,
    email: cleanEmail,
    role,
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
    supabaseSessionActive: Boolean(supId),
  };

  saveActiveSessionUser(userProfile);
  return userProfile;
}
