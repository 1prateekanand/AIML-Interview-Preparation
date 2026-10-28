export type PageId = 'dashboard' | 'problems' | 'favorites' | 'insights';

export type InsightViewId =
  | 'skill-radar'
  | 'progress-rings'
  | 'algorithm-constellation'
  | 'mastery-grid';

export interface CategorySkill {
  id: string;
  name: string;
  shortName: string;
  proficiency: number;
  solvedCount: number;
  totalCount: number;
  attemptRate: number;
  status: 'Mastered' | 'Proficient' | 'Developing' | 'Needs Practice';
  color: string;
}

export interface ConstellationTopic {
  id: string;
  label: string;
  category: string;
  status: 'completed' | 'in-progress' | 'not-started';
  solvedCount: number;
  totalCount: number;
  iconName: string;
  x: number; // Percentage coordinate on canvas
  y: number;
  connections: string[]; // Connected topic IDs
}

export interface HeatmapDay {
  date: string;
  dayOfWeek: number; // 0 = Sun, 1 = Mon, etc.
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type ProblemStatus = 'Solved' | 'Attempted' | 'Todo';

export interface Problem {
  id: number;
  number: number;
  title: string;
  difficulty: Difficulty;
  category: string;
  categorySlug?: string;
  categoryName?: string;
  subcategory?: string | null;
  tags?: string[];
  successRate: string;
  status: ProblemStatus;
  solvedAgo?: string;
  companies?: string[];
  description?: string;
  requirements?: string[];
  markedForReview?: boolean;
}

export interface Activity {
  id: string;
  type: 'solved' | 'drafted' | 'badge';
  title: string;
  detail: string;
  timestamp: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  pointsDelta?: string;
  isCurrentUser?: boolean;
}

export interface BadgeItem {
  id: string;
  title: string;
  type: 'pro-verified' | 'elite-solver' | 'grand-master';
  earned: boolean;
}

export interface CollectionList {
  id: string;
  name: string;
  count: number;
  problemIds: number[];
}

export interface ColorTheme {
  id: string;
  name: string;
  // Swatches for the preview in popover
  swatches: {
    background: string;
    surface: string;
    accent: string;
    secondaryAccent: string;
  };
  // CSS variable values applied to root
  tokens: {
    bgMain: string;
    bgSurface: string;
    bgSurfaceElevated: string;
    bgSidebar: string;
    borderSubtle: string;
    borderAccent: string;
    accent: string;
    accentSecondary: string;
    accentGlow: string;
    accentHover: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    activeNavBg: string;
    activeNavBorder: string;
  };
}
