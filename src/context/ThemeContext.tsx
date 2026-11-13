import React, { createContext, useContext, useEffect, useState } from 'react';
import { ColorTheme } from '../types';

export const THEMES: ColorTheme[] = [
  {
    id: 'black-gold',
    name: 'Black + Gold',
    heroImage: '/assets/themes/01_Black_Gold.png',
    swatches: {
      background: '#0B0B0C',
      surface: '#161618',
      accent: '#E5A93C',
      secondaryAccent: '#F5D77F',
    },
    tokens: {
      bgMain: '#0B0B0C',
      bgSurface: '#161618',
      bgSurfaceElevated: '#202024',
      bgSidebar: '#09090B',
      borderSubtle: '#26262A',
      borderAccent: 'rgba(229, 169, 60, 0.42)',
      accent: '#E5A93C',
      accentSecondary: '#F5D77F',
      accentGlow: 'rgba(229, 169, 60, 0.28)',
      accentHover: '#f5ba42',
      textPrimary: '#F5F5F7',
      textSecondary: '#A1A1AA',
      textMuted: '#71717A',
      activeNavBg: 'rgba(229, 169, 60, 0.15)',
      activeNavBorder: 'rgba(229, 169, 60, 0.42)',
      themeNavText: '#F5D77F',
      themeNavTextMuted: '#D4A359',
    },
  },
  {
    id: 'forest-lime',
    name: 'Forest + Lime',
    heroImage: '/assets/themes/02_Forest_Lime.png',
    swatches: {
      background: '#0A120D',
      surface: '#132218',
      accent: '#84CC16',
      secondaryAccent: '#D9F99D',
    },
    tokens: {
      bgMain: '#0A120D',
      bgSurface: '#132218',
      bgSurfaceElevated: '#1C3022',
      bgSidebar: '#09130D',
      borderSubtle: '#1E3526',
      borderAccent: 'rgba(132, 204, 22, 0.4)',
      accent: '#84CC16',
      accentSecondary: '#D9F99D',
      accentGlow: 'rgba(132, 204, 22, 0.24)',
      accentHover: '#9ae624',
      textPrimary: '#F2F7F4',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
      activeNavBg: 'rgba(132, 204, 22, 0.14)',
      activeNavBorder: 'rgba(132, 204, 22, 0.38)',
      themeNavText: '#D9F99D',
      themeNavTextMuted: '#84CC16',
    },
  },
  {
    id: 'midnight-purple',
    name: 'Midnight + Purple',
    heroImage: '/assets/themes/03_Midnight_Purple.png',
    swatches: {
      background: '#0B0A16',
      surface: '#15132A',
      accent: '#A855F7',
      secondaryAccent: '#C4B5FD',
    },
    tokens: {
      bgMain: '#0B0A16',
      bgSurface: '#15132A',
      bgSurfaceElevated: '#1F1C3D',
      bgSidebar: '#0B0918',
      borderSubtle: '#262247',
      borderAccent: 'rgba(168, 85, 247, 0.4)',
      accent: '#A855F7',
      accentSecondary: '#C4B5FD',
      accentGlow: 'rgba(168, 85, 247, 0.25)',
      accentHover: '#b86ff9',
      textPrimary: '#F5F3FF',
      textSecondary: '#A5A0C0',
      textMuted: '#756F90',
      activeNavBg: 'rgba(168, 85, 247, 0.15)',
      activeNavBorder: 'rgba(168, 85, 247, 0.4)',
      themeNavText: '#C4B5FD',
      themeNavTextMuted: '#A855F7',
    },
  },
  {
    id: 'navy-royal-blue',
    name: 'Navy + Royal Blue',
    heroImage: '/assets/themes/04_Navy_Royal_Blue.png',
    swatches: {
      background: '#080E1C',
      surface: '#101B33',
      accent: '#3B82F6',
      secondaryAccent: '#93C5FD',
    },
    tokens: {
      bgMain: '#080E1C',
      bgSurface: '#101B33',
      bgSurfaceElevated: '#182747',
      bgSidebar: '#070C1A',
      borderSubtle: '#1E2F54',
      borderAccent: 'rgba(59, 130, 246, 0.4)',
      accent: '#3B82F6',
      accentSecondary: '#93C5FD',
      accentGlow: 'rgba(59, 130, 246, 0.25)',
      accentHover: '#60a5fa',
      textPrimary: '#F0F6FF',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
      activeNavBg: 'rgba(59, 130, 246, 0.15)',
      activeNavBorder: 'rgba(59, 130, 246, 0.4)',
      themeNavText: '#93C5FD',
      themeNavTextMuted: '#3B82F6',
    },
  },
  {
    id: 'navy-teal',
    name: 'Navy + Teal',
    heroImage: '/assets/themes/05_Navy_Teal.png',
    swatches: {
      background: '#081216',
      surface: '#0F2026',
      accent: '#14B8A6',
      secondaryAccent: '#99F6E4',
    },
    tokens: {
      bgMain: '#081216',
      bgSurface: '#0F2026',
      bgSurfaceElevated: '#162E37',
      bgSidebar: '#060F13',
      borderSubtle: '#1A3742',
      borderAccent: 'rgba(20, 184, 166, 0.4)',
      accent: '#14B8A6',
      accentSecondary: '#99F6E4',
      accentGlow: 'rgba(20, 184, 166, 0.25)',
      accentHover: '#2dd4bf',
      textPrimary: '#F0FDFA',
      textSecondary: '#8EA7A3',
      textMuted: '#607B77',
      activeNavBg: 'rgba(20, 184, 166, 0.15)',
      activeNavBorder: 'rgba(20, 184, 166, 0.4)',
      themeNavText: '#99F6E4',
      themeNavTextMuted: '#14B8A6',
    },
  },
  {
    id: 'charcoal-cyan',
    name: 'Charcoal + Cyan',
    heroImage: '/assets/themes/06_Charcoal_Cyan.png',
    swatches: {
      background: '#0D1117',
      surface: '#161D26',
      accent: '#06B6D4',
      secondaryAccent: '#A5F3FC',
    },
    tokens: {
      bgMain: '#0D1117',
      bgSurface: '#161D26',
      bgSurfaceElevated: '#202A36',
      bgSidebar: '#0A0E13',
      borderSubtle: '#24303F',
      borderAccent: 'rgba(6, 182, 212, 0.4)',
      accent: '#06B6D4',
      accentSecondary: '#A5F3FC',
      accentGlow: 'rgba(6, 182, 212, 0.25)',
      accentHover: '#22d3ee',
      textPrimary: '#F1F5F9',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
      activeNavBg: 'rgba(6, 182, 212, 0.15)',
      activeNavBorder: 'rgba(6, 182, 212, 0.4)',
      themeNavText: '#A5F3FC',
      themeNavTextMuted: '#06B6D4',
    },
  },
  {
    id: 'graphite-magenta',
    name: 'Graphite + Magenta',
    heroImage: '/assets/themes/07_Graphite_Magenta.png',
    swatches: {
      background: '#100C14',
      surface: '#1B1522',
      accent: '#D946EF',
      secondaryAccent: '#F5D0FE',
    },
    tokens: {
      bgMain: '#100C14',
      bgSurface: '#1B1522',
      bgSurfaceElevated: '#271F32',
      bgSidebar: '#0E0A12',
      borderSubtle: '#2F243B',
      borderAccent: 'rgba(217, 70, 239, 0.4)',
      accent: '#D946EF',
      accentSecondary: '#F5D0FE',
      accentGlow: 'rgba(217, 70, 239, 0.25)',
      accentHover: '#e879f9',
      textPrimary: '#FAF5FF',
      textSecondary: '#A79BB0',
      textMuted: '#7A6E83',
      activeNavBg: 'rgba(217, 70, 239, 0.15)',
      activeNavBorder: 'rgba(217, 70, 239, 0.4)',
      themeNavText: '#F5D0FE',
      themeNavTextMuted: '#D946EF',
    },
  },
  {
    id: 'ivory-amber',
    name: 'Ivory + Amber',
    heroImage: '/assets/themes/08_Ivory_Amber.png',
    swatches: {
      background: '#FBF7F0',
      surface: '#FFFFFF',
      accent: '#D97706',
      secondaryAccent: '#FDE68A',
    },
    tokens: {
      bgMain: '#FBF7F0',
      bgSurface: '#FFFFFF',
      bgSurfaceElevated: '#F4EFE6',
      bgSidebar: '#F5EFE4',
      borderSubtle: '#E5DCD0',
      borderAccent: 'rgba(217, 119, 6, 0.4)',
      accent: '#D97706',
      accentSecondary: '#FDE68A',
      accentGlow: 'rgba(217, 119, 6, 0.2)',
      accentHover: '#b45309',
      textPrimary: '#17130F',
      textSecondary: '#51483D',
      textMuted: '#817567',
      activeNavBg: 'rgba(217, 119, 6, 0.12)',
      activeNavBorder: 'rgba(217, 119, 6, 0.4)',
      themeNavText: '#17130F',
      themeNavTextMuted: '#29231C',
    },
  },
];

interface ThemeContextType {
  currentTheme: ColorTheme;
  setTheme: (themeId: string) => void;
  themes: ColorTheme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const PRIMARY_STORAGE_KEY = 'sabevia-theme';
const LEGACY_STORAGE_KEY = 'codenexus-theme';

function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '');
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }
  return '229, 169, 60';
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(PRIMARY_STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved && THEMES.some((t) => t.id === saved)) {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'black-gold'; // Default as requested
  });

  const currentTheme = THEMES.find((t) => t.id === themeId) || THEMES[0];

  // Preload all 8 theme hero images for instant, zero-flicker theme transitions
  useEffect(() => {
    THEMES.forEach((theme) => {
      if (theme.heroImage) {
        const img = new Image();
        img.src = theme.heroImage;
      }
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const tokens = currentTheme.tokens;
    const accentRgb = hexToRgb(tokens.accent);

    // Core application tokens
    root.style.setProperty('--bg-main', tokens.bgMain);
    root.style.setProperty('--bg-surface', tokens.bgSurface);
    root.style.setProperty('--bg-surface-elevated', tokens.bgSurfaceElevated);
    root.style.setProperty('--bg-sidebar', tokens.bgSidebar);
    root.style.setProperty('--border-subtle', tokens.borderSubtle);
    root.style.setProperty('--border-accent', tokens.borderAccent);
    root.style.setProperty('--accent', tokens.accent);
    root.style.setProperty('--accent-rgb', accentRgb);
    root.style.setProperty('--accent-secondary', tokens.accentSecondary);
    root.style.setProperty('--accent-glow', tokens.accentGlow);
    root.style.setProperty('--accent-hover', tokens.accentHover);
    root.style.setProperty('--text-primary', tokens.textPrimary);
    root.style.setProperty('--text-secondary', tokens.textSecondary);
    root.style.setProperty('--text-muted', tokens.textMuted);
    root.style.setProperty('--active-nav-bg', tokens.activeNavBg);
    root.style.setProperty('--active-nav-border', tokens.activeNavBorder);

    // Centralized Theme Tokens requested by user:
    root.style.setProperty('--theme-primary', tokens.accent);
    root.style.setProperty('--theme-secondary', tokens.accentSecondary);
    root.style.setProperty('--theme-surface', tokens.bgSurface);
    root.style.setProperty('--theme-surface-elevated', tokens.bgSurfaceElevated);
    root.style.setProperty('--theme-hover', tokens.accentHover);
    root.style.setProperty('--theme-glow', tokens.accentGlow);
    root.style.setProperty('--theme-border', tokens.borderAccent);
    root.style.setProperty('--theme-border-subtle', tokens.borderSubtle);
    root.style.setProperty('--theme-active-bg', tokens.activeNavBg);
    root.style.setProperty('--theme-active-border', tokens.activeNavBorder);

    // Theme-Aware Navigation Text & Icons (Eliminates white/blue defaults)
    const navText = tokens.themeNavText || tokens.accentSecondary;
    const navTextMuted = tokens.themeNavTextMuted || tokens.accent;
    root.style.setProperty('--theme-nav-text', navText);
    root.style.setProperty('--theme-nav-text-muted', navTextMuted);
    root.style.setProperty('--theme-nav-hover', `rgba(${accentRgb}, 0.12)`);
    root.style.setProperty('--theme-text', navText);

    root.style.setProperty('--bg-primary', tokens.bgMain);
    root.style.setProperty('--bg-secondary', tokens.bgSurface);
    root.style.setProperty('--accent-primary', tokens.accent);
    root.style.setProperty('--accent-secondary', tokens.accentSecondary);
    root.style.setProperty('--border-color', tokens.borderSubtle);
    root.style.setProperty('--active-bg', tokens.activeNavBg);
    root.style.setProperty('--active-glow', tokens.accentGlow);

    // Specification alias tokens
    root.style.setProperty('--color-background', tokens.bgMain);
    root.style.setProperty('--color-surface', tokens.bgSurface);
    root.style.setProperty('--color-surface-elevated', tokens.bgSurfaceElevated);
    root.style.setProperty('--color-primary', tokens.accent);
    root.style.setProperty('--color-primary-hover', tokens.accentHover);
    root.style.setProperty('--color-secondary', tokens.accentSecondary);
    root.style.setProperty('--color-border', tokens.borderSubtle);
    root.style.setProperty('--color-text', tokens.textPrimary);
    root.style.setProperty('--color-text-muted', tokens.textMuted);
    root.style.setProperty('--color-glow', tokens.accentGlow);
    root.style.setProperty('--theme-hero-image', `url("${currentTheme.heroImage}")`);

    // Set data attribute for theme targeting
    root.setAttribute('data-theme', currentTheme.id);
    if (currentTheme.id === 'ivory-amber') {
      root.classList.add('theme-light');
      root.classList.remove('theme-dark');
      root.style.setProperty('--nav-text', '#29231C');
      root.style.setProperty('--nav-text-active', '#17130F');
      root.style.setProperty('--category-name', '#17130F');
      root.style.setProperty('--question-count', '#817567');
      root.style.setProperty('--dropdown-label', '#29231C');
      root.style.setProperty('--light-btn-text', '#17130F');
    } else {
      root.classList.add('theme-dark');
      root.classList.remove('theme-light');
      root.style.setProperty('--nav-text', '#FFFFFF');
      root.style.setProperty('--nav-text-active', '#FFFFFF');
      root.style.setProperty('--category-name', '#FFFFFF');
      root.style.setProperty('--question-count', tokens.accent);
      root.style.setProperty('--dropdown-label', tokens.accent);
      root.style.setProperty('--light-btn-text', '#FFFFFF');
    }

    try {
      localStorage.setItem(PRIMARY_STORAGE_KEY, currentTheme.id);
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
