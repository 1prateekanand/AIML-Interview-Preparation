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

interface DifficultyRingData {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  percent: number;
  solved: number;
  total: number;
  color: string;
  glowColor: string;
  icon: React.ElementType;
}

interface ProgressRingsProps {
  onOpenDetail?: () => void;
}

export const ProgressRings: React.FC<ProgressRingsProps> = ({ onOpenDetail }) => {
  const { currentTheme } = useTheme();
  const accent = currentTheme.tokens.accent;
  const accentGlow = currentTheme.tokens.accentGlow;
  const [filter, setFilter] = useState<string>('All Categories');
  const [selectedRing, setSelectedRing] = useState<'Easy' | 'Medium' | 'Hard' | null>(null);

  // FIXED SEMANTIC COLOURS across all 10 themes:
  // Easy: Green (#10B981)
  // Medium: Yellow/Amber (#F59E0B)
  // Hard: Red (#F43F5E)
  const ringData: DifficultyRingData[] = [
    {
      difficulty: 'Easy',
      percent: 78,
      solved: 320,
      total: 410,
      color: '#10B981',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      icon: Box,
    },
    {
      difficulty: 'Medium',
      percent: 46,
      solved: 180,
      total: 390,
      color: '#F59E0B',
      glowColor: 'rgba(245, 158, 11, 0.4)',
      icon: Layers,
    },
    {
      difficulty: 'Hard',
      percent: 22,
      solved: 80,
      total: 360,
      color: '#F43F5E',
      glowColor: 'rgba(244, 63, 94, 0.4)',
      icon: Triangle,
    },
  ];

  // SVG parameters for rings
  const size = 150;
  const strokeWidth = 11;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  const totalSolved = ringData.reduce((acc, r) => acc + r.solved, 0);
  const totalQuestions = ringData.reduce((acc, r) => acc + r.total, 0);
  const overallPercent = Math.round((totalSolved / totalQuestions) * 100);

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

        {/* Category Filter & Full View Action */}
        <div className="flex items-center gap-2">
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-[var(--bg-surface-elevated)] text-xs text-[var(--text-secondary)] border border-[var(--border-subtle)] rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:border-[var(--accent)] cursor-pointer"
            >
              <option>All Categories</option>
              <option>Data Structures</option>
              <option>Algorithms</option>
              <option>System Design</option>
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

      {/* 3 Circular Rings Row — Fixed semantic colors: Green, Amber, Red */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-4 justify-items-center">
        {ringData.map((item) => {
          const Icon = item.icon;
          const strokeDashoffset =
            circumference - (item.percent / 100) * circumference;
          const isSelected = selectedRing === item.difficulty;

          return (
            <div
              key={item.difficulty}
              onClick={() =>
                setSelectedRing(selectedRing === item.difficulty ? null : item.difficulty)
              }
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
                      id={`glow-fixed-${item.difficulty}`}
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
                    filter={`url(#glow-fixed-${item.difficulty})`}
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

      {/* Bottom Summary Bar (4 metric tiles) with fixed semantic colors */}
      <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {/* Total Solved */}
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
                {totalSolved}
              </div>
              <div
                className="text-[10px] font-semibold font-mono flex items-center gap-0.5"
                style={{ color: accent }}
              >
                <ArrowUp className="w-2.5 h-2.5" /> 18%
              </div>
            </div>
            <div className="text-[10px] text-[var(--text-muted)] flex items-center justify-between">
              <span>Total Solved</span>
              <span className="font-mono text-[9px] font-bold" style={{ color: accent }}>
                {overallPercent}%
              </span>
            </div>
            {/* Total Solved progress indicator on the Insights overview */}
            <div className="mt-1.5 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${overallPercent}%`,
                  backgroundColor: accent,
                  boxShadow: `0 0 6px ${accentGlow}`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Total Questions */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--bg-surface-elevated)]/50">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center text-cyan-400 shrink-0">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-[var(--text-primary)] font-mono text-sm tabular-nums">
              1,160
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">Total Questions</div>
            <div className="text-[10px] text-[var(--text-secondary)]">Available</div>
          </div>
        </div>

        {/* Day Streak */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--bg-surface-elevated)]/50">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400 shrink-0">
            <Flame className="w-4 h-4 fill-amber-400 stroke-amber-400" />
          </div>
          <div>
            <div className="font-extrabold text-[var(--text-primary)] font-mono text-sm tabular-nums">
              12
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">Day Streak</div>
            <div className="text-[10px] font-semibold text-emerald-400 font-mono flex items-center gap-0.5">
              <ArrowUp className="w-2.5 h-2.5" /> 3
            </div>
          </div>
        </div>

        {/* Overall Accuracy */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--bg-surface-elevated)]/50">
          <div className="w-8 h-8 rounded-lg bg-yellow-500/15 flex items-center justify-center text-yellow-400 shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-[var(--text-primary)] font-mono text-sm tabular-nums">
              63%
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">Overall Accuracy</div>
            <div className="text-[10px] font-semibold text-emerald-400 font-mono flex items-center gap-0.5">
              <ArrowUp className="w-2.5 h-2.5" /> 7%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
