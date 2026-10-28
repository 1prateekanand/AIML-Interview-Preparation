import React, { useMemo } from 'react';
import { Flame, ArrowRight, Sparkles } from 'lucide-react';
import { FuturisticHeroScene } from './FuturisticHeroScene';
import { useTheme } from '../../context/ThemeContext';
import { Problem } from '../../types';

interface DashboardHeroProps {
  problems?: Problem[];
  onNavigateToProblems?: () => void;
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({
  problems = [],
  onNavigateToProblems,
}) => {
  const { currentTheme } = useTheme();

  // Dynamic user streak: check localStorage or problem activity, fallback to active streak 12
  const { streakCount, streakDots } = useMemo(() => {
    let count = 12;
    try {
      const stored = localStorage.getItem('codenexus-streak');
      if (stored) {
        const val = parseInt(stored, 10);
        if (!isNaN(val) && val > 0) count = val;
      }
    } catch {
      // Ignore
    }

    // 7-day streak activity dots (true = active today/past days, last one pending)
    const dots = [true, true, true, true, true, true, false];
    return { streakCount: count, streakDots: dots };
  }, [problems]);

  const accentColor = currentTheme.tokens.accent || '#10b981';

  return (
    <div
      className="relative w-full rounded-2xl border overflow-hidden shadow-2xl transition-all duration-300 min-h-[300px] sm:min-h-[320px] md:h-[330px] lg:h-[340px] flex items-center"
      style={{
        backgroundColor: currentTheme.tokens.bgMain || '#070d12',
        borderColor: currentTheme.tokens.borderAccent || 'rgba(0, 240, 255, 0.25)',
        boxShadow: `0 12px 36px -8px ${currentTheme.tokens.accentGlow || 'rgba(0,0,0,0.6)'}, inset 0 1px 0 rgba(255,255,255,0.08)`,
      }}
    >
      {/* =================================================================== */}
      {/* Layer 0: Full-Width Seamless Background (Zero black gaps or margins) */}
      {/* =================================================================== */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
        {/* Supplied Futuristic AI Engineering panoramic backdrop image */}
        <img
          src="/assets/aistudio/Futuristic_AI_Coding_Dashboard_5666edb8.png"
          alt="AI Engineering Scene"
          className="w-full h-full object-cover object-center opacity-60 mix-blend-screen transition-opacity duration-500"
        />

        {/* Ambient Theme Lighting Vignettes */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 95% 85% at 50% 50%, transparent 20%, ${currentTheme.tokens.bgMain}ee 95%)`,
          }}
        />

        {/* Left & Right darkening gradients to ensure absolute text & card legibility */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, ${currentTheme.tokens.bgMain}f2 0%, ${currentTheme.tokens.bgMain}99 26%, transparent 48%, ${currentTheme.tokens.bgMain}88 78%, ${currentTheme.tokens.bgMain}f2 100%)`,
          }}
        />

        {/* Subtle Theme Colored Glow Spots */}
        <div
          className="absolute -left-10 -bottom-10 w-96 h-96 rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute right-1/4 -top-10 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: '#00f0ff' }}
        />
      </div>

      {/* =================================================================== */}
      {/* Layer 1: Live Interactive Three.js 3D Engineering Scene Canvas      */}
      {/* (Holographic Cube, Neural Brain, DB, Code Panels, Net, Analytics)   */}
      {/* =================================================================== */}
      <FuturisticHeroScene />

      {/* =================================================================== */}
      {/* Layer 2: Foreground UI Overlay (Left Welcome & Right Streak Card)   */}
      {/* =================================================================== */}
      <div className="relative z-20 w-full h-full px-6 sm:px-8 py-6 flex flex-col md:flex-row items-center justify-between pointer-events-none gap-6">
        {/* Left Area: Welcome Section */}
        <div className="pointer-events-auto max-w-sm lg:max-w-md text-left space-y-2.5 z-20 drop-shadow-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold tracking-wider uppercase bg-[var(--active-nav-bg)] border border-[var(--border-accent)] text-[var(--accent)] backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-[var(--accent)]" />
            <span>AI / ML Engineering Nexus</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-white leading-tight">
            Welcome back,{' '}
            <span
              className="transition-colors duration-300 drop-shadow-[0_0_12px_var(--accent-glow)]"
              style={{ color: accentColor }}
            >
              Alex!
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal max-w-md text-shadow-sm">
            You're on a{' '}
            <span
              className="font-bold underline decoration-2 underline-offset-2 transition-colors duration-300"
              style={{ color: accentColor }}
            >
              {streakCount}-day coding streak
            </span>
            . Keep the momentum going to unlock the &ldquo;System Architect&rdquo; badge.
          </p>

          {onNavigateToProblems && (
            <div className="pt-1 hidden sm:block">
              <button
                type="button"
                onClick={onNavigateToProblems}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[var(--accent)] text-[var(--bg-main)] hover:bg-[var(--accent-hover)] transition-all cursor-pointer shadow-md active:scale-95"
              >
                <span>Continue Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Center Spatial Gap: Let the 3D scene (Cube, Brain, DB, Net) shine */}
        <div className="hidden md:block flex-1 min-w-[120px] pointer-events-none" />

        {/* Right Area: Day Streak Card matching reference image */}
        <div className="pointer-events-auto shrink-0 z-20">
          <div
            className="w-44 sm:w-48 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center backdrop-blur-xl border transition-all duration-300 shadow-2xl group hover:border-cyan-400/50"
            style={{
              backgroundColor: 'rgba(6, 18, 26, 0.82)',
              borderColor: 'rgba(0, 240, 255, 0.32)',
              boxShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.7), 0 0 20px -6px rgba(0, 240, 255, 0.25)',
            }}
          >
            {/* Top Pill / Badge with Flame Icon */}
            <div className="w-11 h-11 rounded-xl bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-2.5 shadow-[0_0_14px_rgba(0,240,255,0.35)] group-hover:scale-105 transition-transform duration-200">
              <Flame className="w-5 h-5 fill-cyan-400 stroke-cyan-400 animate-pulse" />
            </div>

            {/* Streak Number */}
            <div className="text-3xl sm:text-[34px] font-black text-white font-mono tabular-nums leading-none tracking-tight">
              {streakCount}
            </div>

            {/* DAY STREAK Label */}
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mt-1.5 mb-3">
              DAY STREAK
            </div>

            {/* 7 Progress Indicator Dots */}
            <div
              className="flex items-center gap-1.5 pt-0.5"
              title="Coding streak progress (past 7 days)"
            >
              {streakDots.map((active, idx) => (
                <span
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    active
                      ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.9)]'
                      : 'bg-slate-700/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
