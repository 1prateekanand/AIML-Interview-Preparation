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
} from 'lucide-react';
import { InsightsDetailHeader } from './InsightsDetailHeader';
import { useTheme } from '../../context/ThemeContext';

interface ProgressRingsDetailProps {
  onBack: () => void;
  onNavigateToProblems?: (difficulty?: string) => void;
}

export const ProgressRingsDetail: React.FC<ProgressRingsDetailProps> = ({
  onBack,
  onNavigateToProblems,
}) => {
  const { currentTheme } = useTheme();
  const accent = currentTheme.tokens.accent;
  const accentGlow = currentTheme.tokens.accentGlow;
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | null>(null);

  // Keyboard shortcut: Esc to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  // STRICT REQUIREMENT: Keep difficulty colors FIXED across every theme
  // Easy: Green (#10B981)
  // Medium: Yellow/Amber (#F59E0B)
  // Hard: Red (#F43F5E)
  const rings = [
    {
      difficulty: 'Easy' as const,
      percent: 78,
      solved: 320,
      total: 410,
      color: '#10B981',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      bgGlow: 'rgba(16, 185, 129, 0.1)',
      icon: Box,
      avgTime: '12 mins',
      accuracy: '84%',
      description: 'Foundational algorithmic concepts, two-pointers, hash maps, simple recursion',
    },
    {
      difficulty: 'Medium' as const,
      percent: 46,
      solved: 180,
      total: 390,
      color: '#F59E0B',
      glowColor: 'rgba(245, 158, 11, 0.4)',
      bgGlow: 'rgba(245, 158, 11, 0.1)',
      icon: Layers,
      avgTime: '26 mins',
      accuracy: '62%',
      description: 'Core interview patterns: BFS/DFS, dynamic programming, heaps, tree traversals',
    },
    {
      difficulty: 'Hard' as const,
      percent: 22,
      solved: 80,
      total: 360,
      color: '#F43F5E',
      glowColor: 'rgba(244, 63, 94, 0.4)',
      bgGlow: 'rgba(244, 63, 94, 0.1)',
      icon: Triangle,
      avgTime: '48 mins',
      accuracy: '41%',
      description: 'Complex optimizations, multi-dimensional DP, segment trees, graph flows',
    },
  ];

  const totalSolved = rings.reduce((acc, r) => acc + r.solved, 0);
  const totalQuestions = rings.reduce((acc, r) => acc + r.total, 0);
  const overallPercent = Math.round((totalSolved / totalQuestions) * 100);

  // SVG parameters for large rings
  const size = 200;
  const strokeWidth = 14;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header with Back Button */}
      <InsightsDetailHeader
        badge="B"
        title="Progress Rings Analytics"
        subtitle="Tier-by-tier question completion, solving velocity, and accuracy metrics"
        onBack={onBack}
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>Total Solved</span>
            <Target className="w-4 h-4" style={{ color: accent }} />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              {totalSolved}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              / {totalQuestions}
            </span>
          </div>
          <div className="mt-2 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${overallPercent}%`,
                backgroundColor: accent,
                boxShadow: `0 0 8px ${accentGlow}`,
              }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>Day Streak</span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              12
            </span>
            <span className="text-xs font-semibold text-emerald-400 font-mono flex items-center gap-0.5">
              <ArrowUp className="w-3 h-3" /> +3 days
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Personal best: 19 days
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>Overall Accuracy</span>
            <Trophy className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              63%
            </span>
            <span className="text-xs font-semibold text-emerald-400 font-mono flex items-center gap-0.5">
              <ArrowUp className="w-3 h-3" /> +7% MoM
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            First-submission pass rate
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>Solving Velocity</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              14.2
            </span>
            <span className="text-xs text-[var(--text-muted)]">problems / week</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Estimated 6 weeks to complete catalog
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
              Select any tier to view specialized practice recommendations
            </p>
          </div>
          <span
            className="text-xs font-mono font-bold px-3 py-1 rounded-full border transition-colors"
            style={{
              backgroundColor: 'var(--active-nav-bg)',
              borderColor: 'var(--border-accent)',
              color: accent,
            }}
          >
            {totalSolved} / {totalQuestions} Total
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4 justify-items-center">
          {rings.map((item) => {
            const Icon = item.icon;
            const strokeDashoffset =
              circumference - (item.percent / 100) * circumference;
            const isSelected = selectedDifficulty === item.difficulty;

            return (
              <div
                key={item.difficulty}
                onClick={() =>
                  setSelectedDifficulty(selectedDifficulty === item.difficulty ? null : item.difficulty)
                }
                className={`w-full max-w-xs flex flex-col items-center cursor-pointer p-6 rounded-2xl transition-all duration-200 border ${
                  isSelected
                    ? 'bg-[var(--bg-surface-elevated)] shadow-xl'
                    : 'bg-black/20 hover:bg-[var(--bg-surface-elevated)]/60 border-transparent hover:border-white/10'
                }`}
                style={{
                  borderColor: isSelected ? item.color : undefined,
                  boxShadow: isSelected ? `0 0 24px ${item.glowColor}` : undefined,
                }}
              >
                {/* Ring SVG with fixed color */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg
                    className="w-full h-full transform -rotate-90 overflow-visible"
                    viewBox={`0 0 ${size} ${size}`}
                  >
                    <defs>
                      <filter
                        id={`glow-fixed-detail-${item.difficulty}`}
                        x="-30%"
                        y="-30%"
                        width="160%"
                        height="160%"
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
                      stroke="rgba(255, 255, 255, 0.06)"
                      strokeWidth={strokeWidth}
                    />

                    {/* Progress Arc with fixed color */}
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
                      filter={`url(#glow-fixed-detail-${item.difficulty})`}
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>

                  {/* Inner Ring Labels */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <Icon
                      className="w-6 h-6 mb-1"
                      style={{ color: item.color }}
                    />
                    <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums leading-tight">
                      {item.percent}%
                    </span>
                    <span className="text-sm font-bold text-[var(--text-secondary)] mt-0.5">
                      {item.difficulty}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                      {item.solved} / {item.total}
                    </span>
                  </div>
                </div>

                {/* Sub-metrics */}
                <div className="w-full grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-white/5 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block">Avg Time</span>
                    <span className="font-mono font-bold text-[var(--text-primary)]">
                      {item.avgTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block">Accuracy</span>
                    <span className="font-mono font-bold" style={{ color: item.color }}>
                      {item.accuracy}
                    </span>
                  </div>
                </div>

                {/* Action button */}
                {onNavigateToProblems && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToProblems(item.difficulty);
                    }}
                    className="w-full mt-4 py-2 px-3 rounded-xl text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                    style={{ backgroundColor: item.color }}
                  >
                    <span>Practice {item.difficulty}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Comprehensive Breakdown Table */}
      <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Tier-by-Tier Strategic Analysis
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Tier</th>
                <th className="pb-3 font-semibold">Solved / Total</th>
                <th className="pb-3 font-semibold">Completion</th>
                <th className="pb-3 font-semibold">Pass Rate</th>
                <th className="pb-3 font-semibold">Avg Solve Time</th>
                <th className="pb-3 font-semibold">Focus Recommendation</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] font-medium">
              {rings.map((r) => (
                <tr key={r.difficulty} className="hover:bg-[var(--bg-surface-elevated)]/50 transition-colors">
                  <td className="py-3.5 flex items-center gap-2 font-bold" style={{ color: r.color }}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                    {r.difficulty}
                  </td>
                  <td className="py-3.5 font-mono text-[var(--text-primary)]">
                    {r.solved} / {r.total}
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${r.percent}%`, backgroundColor: r.color }}
                        />
                      </div>
                      <span className="font-mono font-bold" style={{ color: r.color }}>
                        {r.percent}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 font-mono text-[var(--text-primary)]">
                    {r.accuracy}
                  </td>
                  <td className="py-3.5 font-mono text-[var(--text-muted)]">
                    {r.avgTime}
                  </td>
                  <td className="py-3.5 text-[var(--text-secondary)] max-w-xs truncate">
                    {r.description}
                  </td>
                  <td className="py-3.5 text-right">
                    {onNavigateToProblems && (
                      <button
                        type="button"
                        onClick={() => onNavigateToProblems(r.difficulty)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold border cursor-pointer transition-colors"
                        style={{
                          borderColor: r.color,
                          color: r.color,
                        }}
                      >
                        Filter
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
