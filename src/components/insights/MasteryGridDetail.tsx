import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Flame,
  Target,
  ArrowUp,
  ArrowDown,
  Clock,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Filter,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Problem } from '../../types';
import {
  useMasteryGridData,
  MasteryTimeRange,
  MasteryDayData,
} from '../../hooks/useMasteryGridData';
import { InsightsDetailHeader } from './InsightsDetailHeader';
import { MasteryDateModal } from './MasteryDateModal';

interface MasteryGridDetailProps {
  onBack: () => void;
  onNavigateToProblems?: (category?: string) => void;
  problems?: Problem[];
}

export const MasteryGridDetail: React.FC<MasteryGridDetailProps> = ({
  onBack,
  onNavigateToProblems,
  problems,
}) => {
  const { currentTheme } = useTheme();
  const accent = currentTheme.tokens.accent || '#F59E0B';

  const [timeRange, setTimeRange] = useState<MasteryTimeRange>('12m');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');
  const [showCustomPicker, setShowCustomPicker] = useState<boolean>(false);

  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    count: number;
    accuracy: number | null;
    x: number;
    y: number;
  } | null>(null);

  const [selectedDay, setSelectedDay] = useState<MasteryDayData | null>(null);

  const { weeks, monthLabels, overall, allDays } = useMasteryGridData(
    problems,
    timeRange,
    customStart,
    customEnd
  );

  // Keyboard shortcut: Esc to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  const getCellInlineStyle = (level: 0 | 1 | 2 | 3 | 4, isFuture: boolean): React.CSSProperties => {
    if (isFuture) {
      return {
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderColor: 'rgba(255, 255, 255, 0.04)',
        opacity: 0.35,
      };
    }

    switch (level) {
      case 0:
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
        };
      case 1:
        return {
          backgroundColor: 'rgba(245, 158, 11, 0.25)',
          borderColor: 'rgba(245, 158, 11, 0.40)',
        };
      case 2:
        return {
          backgroundColor: 'rgba(245, 158, 11, 0.50)',
          borderColor: 'rgba(245, 158, 11, 0.65)',
        };
      case 3:
        return {
          backgroundColor: 'rgba(245, 158, 11, 0.80)',
          borderColor: '#F59E0B',
          boxShadow: '0 0 8px rgba(245, 158, 11, 0.4)',
        };
      case 4:
        return {
          backgroundColor: '#F59E0B',
          borderColor: '#FBBF24',
          boxShadow: '0 0 12px rgba(245, 158, 11, 0.75)',
        };
      default:
        return {};
    }
  };

  const handleRangeChange = (val: string) => {
    if (val === 'custom') {
      setShowCustomPicker(true);
      setTimeRange('custom');
    } else {
      setShowCustomPicker(false);
      setTimeRange(val as MasteryTimeRange);
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header with Back Navigation and Date Range Selector */}
      <InsightsDetailHeader
        badge="D"
        title="Mastery Grid Activity Heatmap"
        subtitle="Daily practice consistency, commit momentum, and streak tracking"
        onBack={onBack}
        actions={
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => handleRangeChange(e.target.value)}
              className="bg-[var(--bg-surface-elevated)] text-xs text-[var(--text-secondary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="30d">Past 30 Days</option>
              <option value="3m">Past 3 Months</option>
              <option value="6m">Past 6 Months</option>
              <option value="12m">Past 12 Months</option>
              <option value="this_year">This Year</option>
              <option value="all_time">All Time</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        }
      />

      {/* Custom Date Range Picker inputs when selected */}
      {showCustomPicker && (
        <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300">
          <span className="font-semibold text-amber-400">Custom Date Range:</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px]">Start:</span>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="bg-slate-800 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px]">End:</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="bg-slate-800 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
            />
          </div>
        </div>
      )}

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Problems Solved */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>Problems Solved</span>
            <Target className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              {overall.periodSolved}
            </span>
            {overall.percentageChange !== null && (
              <span
                className={`text-xs font-semibold font-mono inline-flex items-center gap-0.5 ${
                  overall.percentageChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {overall.percentageChange >= 0 ? (
                  <ArrowUp className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDown className="w-3.5 h-3.5" />
                )}
                {Math.abs(overall.percentageChange)}%
              </span>
            )}
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Across selected timeline window
          </p>
        </div>

        {/* Card 2: Day Streak */}
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
                  <ArrowUp className="w-3 h-3" /> Active
                </>
              ) : (
                <span className="text-slate-400 font-normal">0 days</span>
              )}
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Consecutive calendar activity days
          </p>
        </div>

        {/* Card 3: Overall Accuracy */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>Overall Accuracy</span>
            <BarChart3 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              {overall.overallAccuracy !== null ? `${overall.overallAccuracy}%` : '—'}
            </span>
            <span className="text-xs font-semibold text-emerald-400 font-mono flex items-center gap-0.5">
              Live
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Solved vs. attempted submissions
          </p>
        </div>

        {/* Card 4: Active Practice Days */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>Active Days</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              {overall.activeDaysCount}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              / {allDays.length} days
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Days with qualifying problem completions
          </p>
        </div>
      </div>

      {/* Main Heatmap Canvas Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)] tracking-wide">
              CONTRIBUTION HEATMAP
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Click any calendar square to inspect problem breakdown for that date
            </p>
          </div>
          <span
            className="text-xs font-mono font-bold px-3 py-1 rounded-full border"
            style={{
              borderColor: 'rgba(245, 158, 11, 0.3)',
              color: accent,
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
            }}
          >
            {overall.periodSolved} Solved in Period
          </span>
        </div>

        {/* Heatmap Grid with horizontal scroll */}
        <div className="overflow-x-auto py-2 custom-scrollbar">
          <div className="min-w-[650px] inline-block">
            {/* Dynamic Month Labels */}
            <div className="relative h-4 mb-2 pl-8 text-[11px] text-[var(--text-muted)] font-medium">
              {monthLabels.map((m, idx) => (
                <span
                  key={`${m.label}-${idx}`}
                  className="absolute transform -translate-x-1"
                  style={{ left: `${m.weekIndex * 20 + 32}px` }}
                >
                  {m.label}
                </span>
              ))}
            </div>

            {/* Grid with Weekday Labels on the left (Mon, Wed, Fri) */}
            <div className="flex gap-2">
              <div className="flex flex-col justify-between text-[10px] text-[var(--text-muted)] font-mono py-0.5 w-6 shrink-0 select-none">
                <span className="h-3.5 leading-3.5">Mon</span>
                <span className="h-3.5 leading-3.5">Wed</span>
                <span className="h-3.5 leading-3.5">Fri</span>
              </div>

              {/* Columns of Weeks */}
              <div className="flex gap-1 flex-1">
                {weeks.map((week, wIdx) => (
                  <div key={`wk-detail-${wIdx}`} className="flex flex-col gap-1">
                    {week.map((day) => {
                      const cellStyle = getCellInlineStyle(day.level, day.isFuture);

                      return (
                        <div
                          key={`cell-${day.date}`}
                          style={cellStyle}
                          onClick={() => {
                            if (!day.isFuture) setSelectedDay(day);
                          }}
                          onMouseEnter={(e) => {
                            if (day.isFuture) return;
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredCell({
                              date: day.displayDate,
                              count: day.count,
                              accuracy: day.accuracy,
                              x: rect.left + rect.width / 2,
                              y: rect.top,
                            });
                          }}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`w-3.5 h-3.5 rounded-xs border transition-all duration-150 ${
                            day.isFuture
                              ? 'cursor-default'
                              : 'cursor-pointer hover:scale-125 hover:z-20'
                          }`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-[var(--text-muted)]">
              <span>No activity</span>
              <span className="w-3 h-3 rounded-xs border" style={getCellInlineStyle(0, false)} />
              <span className="w-3 h-3 rounded-xs border" style={getCellInlineStyle(1, false)} />
              <span className="text-[10px]">1-2</span>
              <span className="w-3 h-3 rounded-xs border" style={getCellInlineStyle(2, false)} />
              <span className="text-[10px]">3-5</span>
              <span className="w-3 h-3 rounded-xs border" style={getCellInlineStyle(3, false)} />
              <span className="text-[10px]">6-10</span>
              <span className="w-3 h-3 rounded-xs border" style={getCellInlineStyle(4, false)} />
              <span className="text-[10px]">11+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredCell && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full mb-2 px-3 py-2 rounded-xl bg-slate-900 border border-amber-400/40 text-xs shadow-2xl text-center whitespace-nowrap"
          style={{ left: hoveredCell.x, top: hoveredCell.y - 8 }}
        >
          <div className="font-bold text-white text-xs">
            {hoveredCell.count === 0
              ? 'No questions solved'
              : `${hoveredCell.count} question${hoveredCell.count > 1 ? 's' : ''} solved`}
          </div>
          {hoveredCell.accuracy !== null && (
            <div className="text-[11px] text-amber-400 font-mono mt-0.5">
              Accuracy: {hoveredCell.accuracy}%
            </div>
          )}
          <div className="text-[10px] text-slate-400 mt-0.5">
            {hoveredCell.date}
          </div>
        </div>
      )}

      {/* Date Inspection Modal on Click */}
      <MasteryDateModal
        day={selectedDay}
        onClose={() => setSelectedDay(null)}
        onNavigateToProblems={onNavigateToProblems}
      />
    </div>
  );
};
