
export enum ViewType {
  HOME = 'home',
  CHAT = 'chat',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  MAPS = 'maps',
  SEARCH = 'search',
  DICTIONARY = 'dictionary',
  TRANSLATE = 'translate',
  SUBSCRIPTION = 'subscription',
  AUTH = 'auth',
  ABOUT = 'about',
  PROFILE = 'profile'
}

export type AppLanguage = 'en' | 'zo' | 'my';

export interface UserProfile {
  isAuthenticated: boolean;
  username?: string;
  email?: string;
  isPro: boolean;
  dailyCreditsUsed: number;
  lastResetDate: string;
  language: AppLanguage;
}

export const FREE_DAILY_LIMIT = 5;

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: number;
  sources?: Array<{ title: string; uri: string }>;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

export interface GeneratedVideo {
  id: string;
  url: string;
  prompt: string;
  status: 'processing' | 'completed' | 'failed';
  timestamp: number;
}

export interface GeneratedAudio {
  id: string;
  prompt: string;
  timestamp: number;
}
