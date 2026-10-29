import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Problem } from '../../types';

interface DashboardHeroProps {
  problems?: Problem[];
  onNavigateToProblems?: () => void;
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({
  onNavigateToProblems,
}) => {
  const { currentTheme } = useTheme();
  const isLight = currentTheme.id === 'ivory-amber';

  return (
    <div
      className="relative w-full rounded-2xl border overflow-hidden shadow-xl transition-all duration-300 min-h-[220px] sm:min-h-[240px] md:min-h-[260px] flex items-center"
      style={{
        backgroundColor: currentTheme.tokens.bgSurface,
        borderColor: currentTheme.tokens.borderAccent,
        boxShadow: `0 16px 36px -8px ${currentTheme.tokens.accentGlow}, inset 0 1px 0 rgba(255,255,255,${isLight ? '0.6' : '0.08'})`,
      }}
    >
      {/* Background Artwork Layer: Celestial Mountain, Glowing Summit Star, Golden Path, Space Library */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
        <img
          src="/assets/aistudio/sabevia_mountain_art.png"
          alt="Sabevia Mountain of Knowledge"
          className="absolute right-0 top-0 h-full w-full sm:w-[65%] md:w-[60%] lg:w-[55%] object-cover object-center transition-opacity duration-500"
          style={{
            opacity: isLight ? 0.85 : 0.9,
          }}
        />

        {/* Left-to-right gradient fade for text legibility across all dark/light themes */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isLight
              ? `linear-gradient(90deg, ${currentTheme.tokens.bgSurface} 0%, ${currentTheme.tokens.bgSurface}f2 42%, ${currentTheme.tokens.bgSurface}99 65%, transparent 100%)`
              : `linear-gradient(90deg, ${currentTheme.tokens.bgSurface} 0%, ${currentTheme.tokens.bgSurface}fa 40%, ${currentTheme.tokens.bgSurface}bb 60%, transparent 100%)`,
          }}
        />

        {/* Ambient Theme Lighting Glow */}
        <div
          className="absolute -left-12 -bottom-12 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors duration-500"
          style={{
            backgroundColor: currentTheme.tokens.accent,
            opacity: isLight ? 0.08 : 0.16,
          }}
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full px-6 sm:px-8 md:px-10 py-6 sm:py-8 flex flex-col justify-between items-start">
        {/* Small Sabevia Mountain Mark */}
        <div className="flex items-center gap-2 mb-3">
          <img
            src="/assets/aistudio/sabevia_logo.png"
            alt="Sabevia"
            className="w-5 h-5 object-contain"
          />
          <span
            className="text-[11px] font-bold tracking-widest uppercase"
            style={{ color: currentTheme.tokens.accent }}
          >
            Sabevia Path
          </span>
        </div>

        {/* Welcome Headline */}
        <h1
          className="text-2xl sm:text-3xl md:text-[32px] font-extrabold tracking-tight leading-tight transition-colors duration-200"
          style={{ color: currentTheme.tokens.textPrimary }}
        >
          Welcome back,{' '}
          <span
            className="transition-colors duration-300 drop-shadow-sm font-black"
            style={{ color: currentTheme.tokens.accent }}
          >
            Alex!
          </span>
        </h1>

        {/* Supporting Copy */}
        <p
          className="mt-2 max-w-md sm:max-w-lg text-xs sm:text-sm leading-relaxed transition-colors duration-200 font-normal"
          style={{ color: currentTheme.tokens.textSecondary }}
        >
          Continue your AI/ML journey. Practice, learn, and master interview concepts with curated questions and detailed insights.
        </p>

        {/* Primary Call to Action Button: "Continue Practice →" */}
        <div className="mt-5">
          <button
            type="button"
            onClick={onNavigateToProblems}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer shadow-lg active:scale-95 hover:brightness-110"
            style={{
              backgroundColor: currentTheme.tokens.accent,
              color: isLight ? '#FFFFFF' : '#0B0B0C',
              boxShadow: `0 4px 16px -2px ${currentTheme.tokens.accentGlow}`,
            }}
          >
            <span>Continue Practice</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
