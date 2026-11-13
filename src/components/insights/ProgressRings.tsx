import React, { useState } from 'react';
import {
  ChevronDown,
  Box,
  Layers,
  Triangle,
  Target,
  BarChart2,
  Flame,
  Trophy,
  ArrowUp,
  Maximize2,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Problem } from '../../types';
import { useProgressRingsData, DifficultyRingStats } from '../../hooks/useProgressRingsData';

interface ProgressRingsProps {
  onOpenDetail?: () => void;
  problems?: Problem[];
}

export const ProgressRings: React.FC<ProgressRingsProps> = ({
  onOpenDetail,
  problems,
}) => {
  const { currentTheme } = useTheme();
  const accent = currentTheme.tokens.accent || '#F59E0B';
  const accentGlow = currentTheme.tokens.accentGlow || 'rgba(245, 158, 11, 0.4)';

  const [categoryFilter, setCategoryFilter] = useState<string>('All Categories');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | null>(null);

  const { rings, overall, categoriesList } = useProgressRingsData(problems, categoryFilter);

  // SVG parameters for rings
  const size = 150;
  const strokeWidth = 11;
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

  return (
    <div
      onClick={onOpenDetail}
      className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-5 md:p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:border-[var(--border-accent)] hover:shadow-lg cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-start gap-3">
          <span className="w-6 h-6 rounded-lg bg-[var(--active-nav-bg)] text-[var(--accent)] font-bold text-xs flex items-center justify-center shrink-0 border border-[var(--border-accent)]">
            B
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[var(--text-primary)] tracking-wide group-hover:text-[var(--accent)] transition-colors">
                PROGRESS RINGS
              </h2>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-semibold text-[var(--accent)]">
                View Full Analytics →
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Track your solving progress by difficulty
            </p>
          </div>
        </div>

        {/* Dynamic Category Filter & Full View Action */}
        <div className="flex items-center gap-2">
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none bg-[var(--bg-surface-elevated)] text-xs text-[var(--text-secondary)] border border-[var(--border-subtle)] rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:border-[var(--accent)] cursor-pointer max-w-[170px] truncate"
            >
              <option value="All Categories">All Categories</option>
              {categoriesList.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenDetail) onOpenDetail();
            }}
            title="Open Full Analytics View"
            aria-label="Open Full Analytics View"
            className="p-1.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-accent)] text-[var(--text-muted)] group-hover:text-[var(--accent)] hover:text-[var(--accent)] transition-all cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 Circular Rings Row — Dynamic live values with semantic colors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-4 justify-items-center">
        {rings.map((item) => {
          const Icon = getDifficultyIcon(item.difficulty);
          const strokeDashoffset =
            circumference - (item.percent / 100) * circumference;
          const isSelected = selectedDifficulty === item.difficulty;

          return (
            <div
              key={item.difficulty}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDifficulty(selectedDifficulty === item.difficulty ? null : item.difficulty);
              }}
              className={`flex flex-col items-center cursor-pointer p-2 rounded-2xl transition-all duration-200 group ${
                isSelected
                  ? 'bg-[var(--bg-surface-elevated)] ring-1 ring-white/30'
                  : 'hover:bg-[var(--bg-surface-elevated)]/40'
              }`}
            >
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg
                  className="w-full h-full transform -rotate-90 overflow-visible"
                  viewBox={`0 0 ${size} ${size}`}
                >
                  <defs>
                    <filter
                      id={`glow-progress-${item.difficulty}`}
                      x="-20%"
                      y="-20%"
                      width="140%"
                      height="140%"
                    >
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Background Track */}
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="rgba(255, 255, 255, 0.06)"
                    strokeWidth={strokeWidth}
                  />

                  {/* Glowing Progress Arc with fixed semantic color */}
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    filter={`url(#glow-progress-${item.difficulty})`}
                    className="transition-all duration-700 ease-out"
                  />
                </svg>

                {/* Inner Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <Icon
                    className="w-5 h-5 mb-1 transition-transform group-hover:scale-110"
                    style={{ color: item.color }}
                  />
                  <span className="text-xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums leading-tight">
                    {item.percent}%
                  </span>
                  <span className="text-xs font-semibold text-[var(--text-secondary)] mt-0.5">
                    {item.difficulty}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono tabular-nums">
                    {item.solved} / {item.total}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Summary Bar (4 dynamic metric tiles) */}
      <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {/* Card 1: Total Solved */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--bg-surface-elevated)]/50">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors"
            style={{
              backgroundColor: 'var(--active-nav-bg)',
              borderColor: 'var(--border-accent)',
              color: accent,
            }}
          >
            <Target className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-1">
              <div className="font-extrabold text-[var(--text-primary)] font-mono text-sm tabular-nums">
                {overall.totalSolved}
              </div>
              <div
                className="text-[10px] font-semibold font-mono flex items-center gap-0.5"
                style={{ color: accent }}
              >
                <ArrowUp className="w-2.5 h-2.5" /> {overall.overallCompletion}%
              </div>
            </div>
            <div className="text-[10px] text-[var(--text-muted)] flex items-center justify-between">
              <span>Total Solved</span>
              <span className="font-mono text-[9px] font-bold" style={{ color: accent }}>
                {overall.totalSolved} / {overall.totalQuestions}
              </span>
            </div>
            {/* Completion progress bar */}
            <div className="mt-1.5 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${overall.overallCompletion}%`,
                  backgroundColor: accent,
                  boxShadow: `0 0 6px ${accentGlow}`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Total Questions Available */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--bg-surface-elevated)]/50">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center text-cyan-400 shrink-0">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-[var(--text-primary)] font-mono text-sm tabular-nums">
              {overall.totalQuestions.toLocaleString()}
            </div>
            <div className="text-[10px] text-[var(--text-muted)] truncate">Total Questions</div>
            <div className="text-[9px] text-[var(--text-secondary)] font-mono truncate">
              {overall.easyTotal}E • {overall.mediumTotal}M • {overall.hardTotal}H
            </div>
          </div>
        </div>

        {/* Card 3: Day Streak */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--bg-surface-elevated)]/50">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400 shrink-0">
            <Flame className="w-4 h-4 fill-amber-400 stroke-amber-400" />
          </div>
          <div>
            <div className="font-extrabold text-[var(--text-primary)] font-mono text-sm tabular-nums">
              {overall.dayStreak > 0 ? overall.dayStreak : '0'}
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">Day Streak</div>
            <div className="text-[10px] font-semibold text-emerald-400 font-mono flex items-center gap-0.5">
              {overall.dayStreak > 0 ? (
                <>
                  <ArrowUp className="w-2.5 h-2.5" /> Active
                </>
              ) : (
                <span className="text-slate-400 font-normal">Start today</span>
              )}
            </div>
          </div>
        </div>

        {/* Card 4: Overall Accuracy */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--bg-surface-elevated)]/50">
          <div className="w-8 h-8 rounded-lg bg-yellow-500/15 flex items-center justify-center text-yellow-400 shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-[var(--text-primary)] font-mono text-sm tabular-nums">
              {overall.overallAccuracy !== null ? `${overall.overallAccuracy}%` : '—'}
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">Overall Accuracy</div>
            <div className="text-[10px] font-semibold text-emerald-400 font-mono flex items-center gap-0.5">
              {overall.overallAccuracy !== null ? (
                <>
                  <ArrowUp className="w-2.5 h-2.5" /> Calibrated
                </>
              ) : (
                <span className="text-slate-400 font-normal">No attempts</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
