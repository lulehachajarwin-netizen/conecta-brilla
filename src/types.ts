export type ScreenType = 'login' | 'dashboard' | 'challenges' | 'profile';

export type MoodType = 'energia' | 'calma' | 'cansada' | 'estresada';

export interface MoodOption {
  id: MoodType;
  emoji: string;
  title: string;
  subtitle: string;
  bgClass: string;
  iconBgClass: string;
  feedbackMessage: string;
}

export type ChallengeCategory =
  | 'Autocuidado'
  | 'Motivación Personal'
  | 'Pensamiento Positivo'
  | 'Reconocimiento entre Compañeras';

export interface ChallengeItem {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  duration: string;
  points: number;
  imageUrl: string;
  imageAlt: string;
  categoryBg: string;
  categoryText: string;
  completed: boolean;
  actionIcon: string;
}

export interface DailyChallenge365 {
  dayOfYear: number; // 1 to 365
  title: string;
  description: string;
  category: ChallengeCategory;
  duration: string;
  points: number;
  actionIcon: string;
  categoryBg: string;
  categoryText: string;
  reflectionPrompt: string;
  completed?: boolean;
  completedAt?: string;
}

export interface UserProfile {
  id?: string;
  name: string;
  role: string;
  isAdmin?: boolean;
  company: string;
  email: string;
  avatarUrl: string;
  streakDays: number;
  points: number;
  level: number;
  levelTitle: string;
  nextBadge: string;
  progressPercent: number;
  teamCompletedBreaks: number;
  supabaseSessionActive?: boolean;
}

export type AnnouncementCategory =
  | 'pausa_activa'
  | 'taller'
  | 'comunicado'
  | 'celebracion';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  category: AnnouncementCategory;
  categoryLabel: string;
  scheduledTime?: string; // e.g. "Hoy a las 3:00 PM"
  dateString: string;
  authorName: string;
  authorRole: string;
  isPinned: boolean;
  rsvpCount: number;
  userRsvp?: boolean;
}

export interface VoiceChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
