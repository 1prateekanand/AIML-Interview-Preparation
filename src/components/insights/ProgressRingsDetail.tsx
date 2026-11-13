import React, { useState, useEffect } from 'react';
import {
  Box,
  Layers,
  Triangle,
  Target,
  BarChart2,
  Flame,
  Trophy,
  ArrowUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  Zap,
  Filter,
} from 'lucide-react';
import { InsightsDetailHeader } from './InsightsDetailHeader';
import { useTheme } from '../../context/ThemeContext';
import { Problem } from '../../types';
import { useProgressRingsData } from '../../hooks/useProgressRingsData';

interface ProgressRingsDetailProps {
  onBack: () => void;
  onNavigateToProblems?: (difficulty?: string) => void;
  problems?: Problem[];
}

export const ProgressRingsDetail: React.FC<ProgressRingsDetailProps> = ({
  onBack,
  onNavigateToProblems,
  problems,
}) => {
  const { currentTheme } = useTheme();
  const accent = currentTheme.tokens.accent || '#F59E0B';
  const accentGlow = currentTheme.tokens.accentGlow || 'rgba(245, 158, 11, 0.4)';

  const [categoryFilter, setCategoryFilter] = useState<string>('All Categories');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | null>(null);

  const { rings, overall, categoryName, categoriesList } = useProgressRingsData(
    problems,
    categoryFilter
  );

  // Keyboard shortcut: Esc to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  // SVG parameters for large rings
  const size = 200;
  const strokeWidth = 14;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  const getDifficultyIcon = (diff: 'Easy' | 'Medium' | 'Hard') => {
    switch (diff) {
      case 'Easy':
        return Box;
      case 'Medium':
        return Layers;
      case 'Hard':
        return Triangle;
    }
  };

  const getDifficultyDescription = (diff: 'Easy' | 'Medium' | 'Hard') => {
    switch (diff) {
      case 'Easy':
        return 'Foundational concepts, linear algebra, prompt mechanics, and basic evaluation formulas.';
      case 'Medium':
        return 'Core engineering patterns: multi-head attention, RAG chunking, hybrid retrieval, agent loops, and KV cache.';
      case 'Hard':
        return 'Complex systems: FlashAttention CUDA tiling, distributed 3D parallelism, vLLM paging, and high-throughput vector indexing.';
    }
  };

  const activeRing = selectedDifficulty
    ? rings.find((r) => r.difficulty === selectedDifficulty) || rings[0]
    : null;

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header with Back Button and Category Filter */}
      <InsightsDetailHeader
        badge="B"
        title="Progress Rings Analytics"
        subtitle="Tier-by-tier question completion, solving velocity, and accuracy metrics"
        onBack={onBack}
        actions={
          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[var(--bg-surface-elevated)] text-xs text-[var(--text-secondary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 cursor-pointer max-w-[200px] truncate"
            >
              <option value="All Categories">All Categories</option>
              {categoriesList.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        }
      />

      {/* Overview Stat Cards (4 Dynamic Summary Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Solved */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>Total Solved</span>
            <Target className="w-4 h-4" style={{ color: accent }} />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              {overall.totalSolved}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              / {overall.totalQuestions}
            </span>
          </div>
          <div className="mt-2 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${overall.overallCompletion}%`,
                backgroundColor: accent,
                boxShadow: `0 0 8px ${accentGlow}`,
              }}
            />
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1.5 font-mono">
            {overall.overallCompletion}% completion across {categoryName}
          </p>
        </div>

        {/* Card 2: Total Questions Available */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>Total Questions</span>
            <BarChart2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              {overall.totalQuestions.toLocaleString()}
            </span>
            <span className="text-xs text-[var(--text-muted)]">catalog items</span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] font-mono mt-1.5 truncate">
            {overall.easyTotal} Easy • {overall.mediumTotal} Medium • {overall.hardTotal} Hard
          </p>
        </div>

        {/* Card 3: Day Streak */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>Day Streak</span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              {overall.dayStreak}
            </span>
            <span className="text-xs font-semibold text-emerald-400 font-mono flex items-center gap-0.5">
              {overall.dayStreak > 0 ? (
                <>
                  <ArrowUp className="w-3 h-3" /> Active Streak
                </>
              ) : (
                <span className="text-slate-400 font-normal">Start today</span>
              )}
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1.5">
            {overall.dayStreak > 0
              ? 'Consecutive daily learning activity'
              : 'Complete a problem today to build your streak'}
          </p>
        </div>

        {/* Card 4: Overall Accuracy */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>Overall Accuracy</span>
            <Trophy className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              {overall.overallAccuracy !== null ? `${overall.overallAccuracy}%` : '—'}
            </span>
            <span className="text-xs font-semibold text-emerald-400 font-mono flex items-center gap-0.5">
              {overall.overallAccuracy !== null ? (
                <>
                  <ArrowUp className="w-3 h-3" /> Live
                </>
              ) : (
                <span className="text-slate-400 font-normal">Pending attempts</span>
              )}
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1.5">
            {overall.overallAccuracy !== null
              ? `Derived from ${overall.totalAttempted} unique attempted problems`
              : 'No problem submissions recorded yet'}
          </p>
        </div>
      </div>

      {/* The 3 Large Rings Display — with fixed Easy/Medium/Hard colors */}
      <div className="p-6 md:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)] tracking-wide">
              DIFFICULTY COMPLETION TIERS
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Select any tier to view specialized breakdown and practice recommendations
            </p>
          </div>
          <span
            className="text-xs font-mono font-bold px-3 py-1 rounded-full border transition-colors"
            style={{
              borderColor: 'var(--border-accent)',
              color: accent,
              backgroundColor: 'var(--active-nav-bg)',
            }}
          >
            {categoryName}
          </span>
        </div>

        {/* 3 Interactive Large Rings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {rings.map((ring) => {
            const Icon = getDifficultyIcon(ring.difficulty);
            const strokeDashoffset =
              circumference - (ring.percent / 100) * circumference;
            const isSelected = selectedDifficulty === ring.difficulty;

            return (
              <div
                key={ring.difficulty}
                onClick={() =>
                  setSelectedDifficulty(isSelected ? null : ring.difficulty)
                }
                className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col items-center text-center relative group ${
                  isSelected
                    ? 'ring-2 shadow-xl scale-[1.02]'
                    : 'hover:border-slate-600 hover:scale-[1.01]'
                }`}
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: isSelected ? ring.color : 'var(--border-subtle)',
                  boxShadow: isSelected ? `0 0 25px ${ring.glowColor}` : undefined,
                }}
              >
                {/* SVG Ring */}
                <div className="relative w-48 h-48 flex items-center justify-center my-2">
                  <svg
                    className="w-full h-full transform -rotate-90 overflow-visible"
                    viewBox={`0 0 ${size} ${size}`}
                  >
                    <defs>
                      <filter
                        id={`glow-large-${ring.difficulty}`}
                        x="-20%"
                        y="-20%"
                        width="140%"
                        height="140%"
                      >
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Background Track */}
                    <circle
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      fill="transparent"
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth={strokeWidth}
                    />

                    {/* Glowing Progress Arc */}
                    <circle
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      fill="transparent"
                      stroke={ring.color}
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      filter={`url(#glow-large-${ring.difficulty})`}
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>

                  {/* Inner Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <Icon
                      className="w-6 h-6 mb-1 transition-transform group-hover:scale-110"
                      style={{ color: ring.color }}
                    />
                    <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums leading-tight">
                      {ring.percent}%
                    </span>
                    <span
                      className="text-xs font-bold uppercase tracking-wider mt-0.5"
                      style={{ color: ring.color }}
                    >
                      {ring.difficulty}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)] font-mono tabular-nums mt-0.5">
                      {ring.solved} / {ring.total} solved
                    </span>
                  </div>
                </div>

                {/* Sub-metrics */}
                <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[var(--border-subtle)] text-xs">
                  <div className="p-2 rounded-xl bg-slate-900/40">
                    <span className="text-[10px] text-[var(--text-muted)] block">Remaining</span>
                    <span className="font-bold text-[var(--text-primary)] font-mono">
                      {ring.remaining}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/40">
                    <span className="text-[10px] text-[var(--text-muted)] block">Accuracy</span>
                    <span className="font-bold font-mono" style={{ color: ring.color }}>
                      {ring.accuracy !== null ? `${ring.accuracy}%` : '—'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[var(--text-muted)] mt-3 leading-relaxed">
                  {getDifficultyDescription(ring.difficulty)}
                </p>

                {/* Action CTA */}
                {onNavigateToProblems && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToProblems(ring.difficulty.toLowerCase());
                    }}
                    className="mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border"
                    style={{
                      backgroundColor: `${ring.color}15`,
                      borderColor: `${ring.color}40`,
                      color: ring.color,
                    }}
                  >
                    <span>Practice {ring.difficulty} Problems</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
