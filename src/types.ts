export type AppMode = 'BENTO' | 'PORTFOLIO' | 'DARKNET' | 'ADMIN' | 'PROFILE';

export interface Registration {
  id?: string;
  name: string;
  email: string;
  alias: string;
  ip: string;
  location: string;
  city: string;
  country: string;
  isp: string;
  uagent: string;
  timestamp: string;
  // New technical metadata
  screen: string;
  language: string;
  timezone: string;
  platform: string;
  cores: number;
  memory?: number;
  battery?: string;
  connection?: string;
  mugshotUrl?: string;
  achievements?: string[];
  notes?: string;
  theme?: 'stealth' | 'neon' | 'brutalist';
  // User profile fields
  password?: string;
  bio?: string;
  avatarUrl?: string;
  github?: string;
  linkedin?: string;
  website?: string;
}

export interface VisitorStat {
  ip: string;
  location: string;
  browser: string;
  time: string;
  status: 'ONLINE' | 'PASIF' | 'CIKTI';
}

export interface ActivityLog {
  time: string;
  msg: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  icon: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'alert';
  timestamp: number;
}
