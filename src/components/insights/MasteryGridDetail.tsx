import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  Flame,
  Target,
  ArrowUp,
  Clock,
  Sparkles,
  BarChart3,
  CheckCircle,
} from 'lucide-react';
import { HeatmapDay } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { InsightsDetailHeader } from './InsightsDetailHeader';

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return [r, g, b];
  }
  const r = parseInt(clean.substring(0, 2), 16) || 16;
  const g = parseInt(clean.substring(2, 4), 16) || 185;
  const b = parseInt(clean.substring(4, 6), 16) || 129;
  return [r, g, b];
}

interface MasteryGridDetailProps {
  onBack: () => void;
  onNavigateToProblems?: () => void;
}

export const MasteryGridDetail: React.FC<MasteryGridDetailProps> = ({
  onBack,
  onNavigateToProblems,
}) => {
  const { currentTheme } = useTheme();
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y'>('3m');
  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);
  const [selectedDate, setSelectedDate] = useState<HeatmapDay | null>(null);

  // Keyboard shortcut: Esc to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  const accent = currentTheme.tokens.accent;
  const accentSecondary = currentTheme.tokens.accentSecondary;
  const [r, g, b] = useMemo(() => hexToRgb(accent), [accent]);

  const totalWeeks = timeRange === '1y' ? 52 : timeRange === '6m' ? 26 : 14;

  const weeksData = useMemo(() => {
    const weeks: HeatmapDay[][] = [];
    const baseDate = new Date(2024, 9, 1);

    for (let w = 0; w < totalWeeks; w++) {
      const week: HeatmapDay[] = [];
      for (let d = 0; d < 7; d++) {
        const currentDate = new Date(baseDate);
        currentDate.setDate(baseDate.getDate() + w * 7 + d);

        let count = 0;
        let level: 0 | 1 | 2 | 3 | 4 = 0;

        const dayNum = w * 7 + d;
        const hash = (dayNum * 17 + w * 3) % 29;

        if (dayNum >= totalWeeks * 7 - 12) {
          count = 4 + (dayNum % 6);
          level = count >= 8 ? 4 : count >= 5 ? 3 : 2;
        } else if (hash > 21) {
          count = 11 + (hash % 5);
          level = 4;
        } else if (hash > 15) {
          count = 6 + (hash % 4);
          level = 3;
        } else if (hash > 10) {
          count = 3 + (hash % 3);
          level = 2;
        } else if (hash > 6) {
          count = 1 + (hash % 2);
          level = 1;
        } else {
          count = 0;
          level = 0;
        }

        const dateStr = currentDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

        week.push({
          date: dateStr,
          dayOfWeek: d,
          count,
          level,
        });
      }
      weeks.push(week);
    }

    return weeks;
  }, [totalWeeks]);

  const allDays = weeksData.flat();
  const activeDaysCount = allDays.filter((d) => d.count > 0).length;
  const totalSubmissions = allDays.reduce((acc, d) => acc + d.count, 0);

  const getCellInlineStyle = (level: 0 | 1 | 2 | 3 | 4): React.CSSProperties => {
    switch (level) {
      case 0:
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
        };
      case 1:
        return {
          backgroundColor: `rgba(${r}, ${g}, ${b}, 0.25)`,
          borderColor: `rgba(${r}, ${g}, ${b}, 0.4)`,
        };
      case 2:
        return {
          backgroundColor: `rgba(${r}, ${g}, ${b}, 0.5)`,
          borderColor: `rgba(${r}, ${g}, ${b}, 0.7)`,
        };
      case 3:
        return {
          backgroundColor: `rgba(${r}, ${g}, ${b}, 0.8)`,
          borderColor: accent,
          boxShadow: `0 0 8px rgba(${r}, ${g}, ${b}, 0.35)`,
        };
      case 4:
        return {
          backgroundColor: accent,
          borderColor: accentSecondary,
          boxShadow: `0 0 12px rgba(${r}, ${g}, ${b}, 0.65)`,
        };
      default:
        return {};
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header with Back Button */}
      <InsightsDetailHeader
        badge="D"
        title="Mastery Grid Activity Log"
        subtitle="Long-term coding consistency, daily commit frequency, and streak resilience"
        onBack={onBack}
        actions={
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => setTimeRange('3m')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timeRange === '3m'
                  ? 'bg-[var(--accent)] text-[var(--bg-main)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Past 3 Months
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('6m')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timeRange === '6m'
                  ? 'bg-[var(--accent)] text-[var(--bg-main)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Past 6 Months
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('1y')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timeRange === '1y'
                  ? 'bg-[var(--accent)] text-[var(--bg-main)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              This Year
            </button>
          </div>
        }
      />

      {/* Top Activity Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>Active Coding Days</span>
            <Calendar className="w-4 h-4" style={{ color: accent }} />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              {activeDaysCount}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              / {allDays.length} days
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            {Math.round((activeDaysCount / allDays.length) * 100)}% consistency rate
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>Current Streak</span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              12
            </span>
            <span className="text-xs font-semibold text-emerald-400 font-mono">
              Active Now
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Longest recorded: 19 days
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>Total Submissions</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              {totalSubmissions}
            </span>
            <span className="text-xs font-semibold text-emerald-400 font-mono flex items-center gap-0.5">
              <ArrowUp className="w-3 h-3" /> +27%
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Average {(totalSubmissions / activeDaysCount || 0).toFixed(1)} solves/day
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>Peak Activity Day</span>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-[var(--text-primary)]">
            Wednesday
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Avg 4.8 questions solved mid-week
          </p>
        </div>
      </div>

      {/* Full-Width Interactive Heatmap Viewport */}
      <div className="p-6 md:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)] tracking-wide">
              ACTIVITY MATRIX
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Hover over any square for daily count; click to inspect recorded problems
            </p>
          </div>

          {/* Dynamic Theme Legend */}
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <span className="text-[11px]">Less</span>
            <span className="w-3.5 h-3.5 rounded-xs border" style={getCellInlineStyle(0)} />
            <span className="w-3.5 h-3.5 rounded-xs border" style={getCellInlineStyle(1)} />
            <span className="w-3.5 h-3.5 rounded-xs border" style={getCellInlineStyle(2)} />
            <span className="w-3.5 h-3.5 rounded-xs border" style={getCellInlineStyle(3)} />
            <span className="w-3.5 h-3.5 rounded-xs border" style={getCellInlineStyle(4)} />
            <span className="text-[11px]">More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto py-2 custom-scrollbar">
          <div className="min-w-fit">
            <div className="flex gap-2">
              {/* Day of Week Labels */}
              <div className="flex flex-col justify-between text-[11px] text-[var(--text-muted)] font-mono py-1 w-8 shrink-0 select-none">
                <span className="h-4 leading-4">Mon</span>
                <span className="h-4 leading-4">Wed</span>
                <span className="h-4 leading-4">Fri</span>
                <span className="h-4 leading-4">Sun</span>
              </div>

              {/* Weeks columns */}
              <div className="flex gap-1.5 flex-1">
                {weeksData.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1.5">
                    {week.map((day, dIdx) => {
                      const isSelected = selectedDate?.date === day.date;
                      const cellStyle = getCellInlineStyle(day.level);

                      return (
                        <div
                          key={dIdx}
                          style={{
                            ...cellStyle,
                            transform: isSelected ? 'scale(1.25)' : undefined,
                            zIndex: isSelected ? 10 : undefined,
                          }}
                          onClick={() => setSelectedDate(day)}
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredCell({
                              date: day.date,
                              count: day.count,
                              x: rect.left + rect.width / 2,
                              y: rect.top,
                            });
                          }}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`w-4 h-4 rounded-xs border transition-all duration-150 cursor-pointer hover:scale-120 ${
                            isSelected ? 'ring-2 ring-white' : ''
                          }`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Tooltip */}
        {hoveredCell && (
          <div
            className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full mb-2 px-3 py-1.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-accent)] text-xs shadow-2xl text-center whitespace-nowrap"
            style={{ left: hoveredCell.x, top: hoveredCell.y - 8 }}
          >
            <div className="font-bold text-[var(--text-primary)]">
              {hoveredCell.count === 0
                ? 'No problems solved'
                : `${hoveredCell.count} problem${hoveredCell.count > 1 ? 's' : ''} solved`}
            </div>
            <div className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">
              {hoveredCell.date}
            </div>
          </div>
        )}

        {/* Selected Date Inspector Card */}
        {selectedDate && (
          <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-accent)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-150">
            <div className="flex items-center gap-3">
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm border"
                style={{
                  backgroundColor: 'var(--active-nav-bg)',
                  borderColor: 'var(--border-accent)',
                  color: accent,
                }}
              >
                {selectedDate.count}
              </span>
              <div>
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  Activity for {selectedDate.date}
                </h4>
                <p className="text-xs text-[var(--text-muted)]">
                  {selectedDate.count === 0
                    ? 'No submissions logged on this date.'
                    : `Completed ${selectedDate.count} problems including algorithmic optimizations.`}
                </p>
              </div>
            </div>

            {onNavigateToProblems && (
              <button
                type="button"
                onClick={onNavigateToProblems}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--accent)] text-[var(--bg-main)] hover:bg-[var(--accent-hover)] transition-colors cursor-pointer self-start sm:self-auto"
              >
                Practice More Today
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
