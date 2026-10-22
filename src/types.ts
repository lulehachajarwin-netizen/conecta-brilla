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

export interface ChallengeItem {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  points: number;
  imageUrl: string;
  imageAlt: string;
  categoryBg: string;
  categoryText: string;
  completed: boolean;
  actionIcon: string;
}

export interface UserProfile {
  name: string;
  role: string;
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
}
