import React, { createContext, useContext, useEffect, useState } from 'react';
import { ColorTheme } from '../types';

export const THEMES: ColorTheme[] = [
  {
    id: 'forest-lime',
    name: 'Forest + Lime',
    swatches: {
      background: '#0C120F',
      surface: '#19251D',
      accent: '#A3E635',
      secondaryAccent: '#D9F99D',
    },
    tokens: {
      bgMain: '#0C120F',
      bgSurface: '#19251D',
      bgSurfaceElevated: '#223328',
      bgSidebar: '#131E17',
      borderSubtle: '#26382C',
      borderAccent: 'rgba(163, 230, 53, 0.35)',
      accent: '#A3E635',
      accentSecondary: '#D9F99D',
      accentGlow: 'rgba(163, 230, 53, 0.22)',
      accentHover: '#b4ee4d',
      textPrimary: '#F1F5F9',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
      activeNavBg: 'rgba(163, 230, 53, 0.12)',
      activeNavBorder: 'rgba(163, 230, 53, 0.35)',
    },
  },
  {
    id: 'midnight-purple',
    name: 'Midnight + Purple',
    swatches: {
      background: '#0B1020',
      surface: '#151C32',
      accent: '#8B5CF6',
      secondaryAccent: '#C4B5FD',
    },
    tokens: {
      bgMain: '#0B1020',
      bgSurface: '#151C32',
      bgSurfaceElevated: '#1D2744',
      bgSidebar: '#0E1428',
      borderSubtle: '#253052',
      borderAccent: 'rgba(139, 92, 246, 0.35)',
      accent: '#8B5CF6',
      accentSecondary: '#C4B5FD',
      accentGlow: 'rgba(139, 92, 246, 0.22)',
      accentHover: '#9d74f8',
      textPrimary: '#F1F5F9',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
      activeNavBg: 'rgba(139, 92, 246, 0.14)',
      activeNavBorder: 'rgba(139, 92, 246, 0.35)',
    },
  },
  {
    id: 'navy-royal-blue',
    name: 'Navy + Royal Blue',
    swatches: {
      background: '#111827',
      surface: '#1F2937',
      accent: '#3B82F6',
      secondaryAccent: '#93C5FD',
    },
    tokens: {
      bgMain: '#111827',
      bgSurface: '#1F2937',
      bgSurfaceElevated: '#283548',
      bgSidebar: '#162033',
      borderSubtle: '#374151',
      borderAccent: 'rgba(59, 130, 246, 0.35)',
      accent: '#3B82F6',
      accentSecondary: '#93C5FD',
      accentGlow: 'rgba(59, 130, 246, 0.22)',
      accentHover: '#60a5fa',
      textPrimary: '#F1F5F9',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
      activeNavBg: 'rgba(59, 130, 246, 0.14)',
      activeNavBorder: 'rgba(59, 130, 246, 0.35)',
    },
  },
  {
    id: 'navy-teal',
    name: 'Navy + Teal',
    swatches: {
      background: '#0B1320',
      surface: '#162535',
      accent: '#14B8A6',
      secondaryAccent: '#99F6E4',
    },
    tokens: {
      bgMain: '#0B1320',
      bgSurface: '#162535',
      bgSurfaceElevated: '#1D3146',
      bgSidebar: '#0F1C2C',
      borderSubtle: '#263A4F',
      borderAccent: 'rgba(20, 184, 166, 0.35)',
      accent: '#14B8A6',
      accentSecondary: '#99F6E4',
      accentGlow: 'rgba(20, 184, 166, 0.22)',
      accentHover: '#2dd4bf',
      textPrimary: '#F1F5F9',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
      activeNavBg: 'rgba(20, 184, 166, 0.14)',
      activeNavBorder: 'rgba(20, 184, 166, 0.35)',
    },
  },
  {
    id: 'charcoal-cyan',
    name: 'Charcoal + Cyan',
    swatches: {
      background: '#101418',
      surface: '#202830',
      accent: '#06B6D4',
      secondaryAccent: '#A5F3FC',
    },
    tokens: {
      bgMain: '#101418',
      bgSurface: '#202830',
      bgSurfaceElevated: '#2A3440',
      bgSidebar: '#161C22',
      borderSubtle: '#2E3A45',
      borderAccent: 'rgba(6, 182, 212, 0.35)',
      accent: '#06B6D4',
      accentSecondary: '#A5F3FC',
      accentGlow: 'rgba(6, 182, 212, 0.22)',
      accentHover: '#22d3ee',
      textPrimary: '#F1F5F9',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
      activeNavBg: 'rgba(6, 182, 212, 0.14)',
      activeNavBorder: 'rgba(6, 182, 212, 0.35)',
    },
  },
  {
    id: 'graphite-magenta',
    name: 'Graphite + Magenta',
    swatches: {
      background: '#09090B',
      surface: '#24212B',
      accent: '#E879F9',
      secondaryAccent: '#F5D0FE',
    },
    tokens: {
      bgMain: '#09090B',
      bgSurface: '#24212B',
      bgSurfaceElevated: '#302C39',
      bgSidebar: '#17151D',
      borderSubtle: '#3C3547',
      borderAccent: 'rgba(232, 121, 249, 0.35)',
      accent: '#E879F9',
      accentSecondary: '#F5D0FE',
      accentGlow: 'rgba(232, 121, 249, 0.22)',
      accentHover: '#f0abfc',
      textPrimary: '#F1F5F9',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
      activeNavBg: 'rgba(232, 121, 249, 0.14)',
      activeNavBorder: 'rgba(232, 121, 249, 0.35)',
    },
  },
  {
    id: 'black-gold',
    name: 'Black + Gold',
    swatches: {
      background: '#0A0A0A',
      surface: '#1A1A1A',
      accent: '#EAB308',
      secondaryAccent: '#FDE68A',
    },
    tokens: {
      bgMain: '#0A0A0A',
      bgSurface: '#1A1A1A',
      bgSurfaceElevated: '#262626',
      bgSidebar: '#121212',
      borderSubtle: '#333333',
      borderAccent: 'rgba(234, 179, 8, 0.35)',
      accent: '#EAB308',
      accentSecondary: '#FDE68A',
      accentGlow: 'rgba(234, 179, 8, 0.22)',
      accentHover: '#facc15',
      textPrimary: '#F1F5F9',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
      activeNavBg: 'rgba(234, 179, 8, 0.14)',
      activeNavBorder: 'rgba(234, 179, 8, 0.35)',
    },
  },
  {
    id: 'blue-violet',
    name: 'Blue + Violet',
    swatches: {
      background: '#172554',
      surface: '#1D4ED8', // Supplied palette reference
      accent: '#8B5CF6',
      secondaryAccent: '#DDD6FE',
    },
    // Note: User prompt instruction: "The Blue + Violet theme must retain a readable dark dashboard.
    // Do not use #1D4ED8 as the background of every card. Keep the supplied colours as the palette reference,
    // but use darker derived surface shades where necessary to maintain hierarchy and text contrast."
    tokens: {
      bgMain: '#101738', // Dark deep navy
      bgSurface: '#18244E', // Readable derived dark surface
      bgSurfaceElevated: '#202F64',
      bgSidebar: '#131B40',
      borderSubtle: '#2E3F78',
      borderAccent: 'rgba(139, 92, 246, 0.4)',
      accent: '#8B5CF6',
      accentSecondary: '#DDD6FE',
      accentGlow: 'rgba(139, 92, 246, 0.25)',
      accentHover: '#a78bfa',
      textPrimary: '#F1F5F9',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
      activeNavBg: 'rgba(139, 92, 246, 0.16)',
      activeNavBorder: 'rgba(139, 92, 246, 0.4)',
    },
  },
  {
    id: 'espresso-copper',
    name: 'Espresso + Copper',
    swatches: {
      background: '#211713',
      surface: '#43291F',
      accent: '#C87941',
      secondaryAccent: '#F0C9A5',
    },
    tokens: {
      bgMain: '#211713',
      bgSurface: '#34211A', // Balanced dark espresso
      bgSurfaceElevated: '#452B22',
      bgSidebar: '#271B16',
      borderSubtle: '#54362A',
      borderAccent: 'rgba(200, 121, 65, 0.35)',
      accent: '#C87941',
      accentSecondary: '#F0C9A5',
      accentGlow: 'rgba(200, 121, 65, 0.22)',
      accentHover: '#d98b53',
      textPrimary: '#F1F5F9',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
      activeNavBg: 'rgba(200, 121, 65, 0.15)',
      activeNavBorder: 'rgba(200, 121, 65, 0.35)',
    },
  },
  {
    id: 'charcoal-crimson',
    name: 'Charcoal + Crimson',
    swatches: {
      background: '#111111',
      surface: '#222222',
      accent: '#EF4444',
      secondaryAccent: '#FCA5A5',
    },
    tokens: {
      bgMain: '#111111',
      bgSurface: '#202020',
      bgSurfaceElevated: '#2A2A2A',
      bgSidebar: '#171717',
      borderSubtle: '#333333',
      borderAccent: 'rgba(239, 68, 68, 0.35)',
      accent: '#EF4444',
      accentSecondary: '#FCA5A5',
      accentGlow: 'rgba(239, 68, 68, 0.22)',
      accentHover: '#f87171',
      textPrimary: '#F1F5F9',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
      activeNavBg: 'rgba(239, 68, 68, 0.14)',
      activeNavBorder: 'rgba(239, 68, 68, 0.35)',
    },
  },
];

interface ThemeContextType {
  currentTheme: ColorTheme;
  setTheme: (themeId: string) => void;
  themes: ColorTheme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'codenexus-theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && THEMES.some((t) => t.id === saved)) {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'forest-lime'; // Default as requested
  });

  const currentTheme = THEMES.find((t) => t.id === themeId) || THEMES[0];

  useEffect(() => {
    const root = document.documentElement;
    const tokens = currentTheme.tokens;

    root.style.setProperty('--bg-main', tokens.bgMain);
    root.style.setProperty('--bg-surface', tokens.bgSurface);
    root.style.setProperty('--bg-surface-elevated', tokens.bgSurfaceElevated);
    root.style.setProperty('--bg-sidebar', tokens.bgSidebar);
    root.style.setProperty('--border-subtle', tokens.borderSubtle);
    root.style.setProperty('--border-accent', tokens.borderAccent);
    root.style.setProperty('--accent', tokens.accent);
    root.style.setProperty('--accent-secondary', tokens.accentSecondary);
    root.style.setProperty('--accent-glow', tokens.accentGlow);
    root.style.setProperty('--accent-hover', tokens.accentHover);
    root.style.setProperty('--text-primary', tokens.textPrimary);
    root.style.setProperty('--text-secondary', tokens.textSecondary);
    root.style.setProperty('--text-muted', tokens.textMuted);
    root.style.setProperty('--active-nav-bg', tokens.activeNavBg);
    root.style.setProperty('--active-nav-border', tokens.activeNavBorder);

    try {
      localStorage.setItem(STORAGE_KEY, currentTheme.id);
    } catch {
      // Storage unavailable
    }
  }, [currentTheme]);

  const setTheme = (id: string) => {
    if (THEMES.some((t) => t.id === id)) {
      setThemeId(id);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
