import React, { useState } from 'react';
import {
  ChevronDown,
  Flame,
  Target,
  ArrowUp,
  ArrowDown,
  Maximize2,
  Calendar,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Problem } from '../../types';
import {
  useMasteryGridData,
  MasteryTimeRange,
  MasteryDayData,
} from '../../hooks/useMasteryGridData';
import { MasteryDateModal } from './MasteryDateModal';

interface MasteryGridProps {
  onOpenDetail?: () => void;
  problems?: Problem[];
  onNavigateToProblems?: (category?: string) => void;
}

export const MasteryGrid: React.FC<MasteryGridProps> = ({
  onOpenDetail,
  problems,
  onNavigateToProblems,
}) => {
  const { currentTheme } = useTheme();
  const accent = currentTheme.tokens.accent || '#F59E0B';

  const [timeRange, setTimeRange] = useState<MasteryTimeRange>('3m');
  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    count: number;
    accuracy: number | null;
    x: number;
    y: number;
  } | null>(null);

  const [selectedDay, setSelectedDay] = useState<MasteryDayData | null>(null);
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');
  const [showCustomPicker, setShowCustomPicker] = useState<boolean>(false);

  const { weeks, monthLabels, overall } = useMasteryGridData(
    problems,
    timeRange,
    customStart,
    customEnd
  );

  // Intensity style mapping matching Sabevia amber theme
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
    <div
      onClick={onOpenDetail}
      className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-5 md:p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:border-[var(--border-accent)] hover:shadow-lg cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <span className="w-6 h-6 rounded-lg bg-[var(--active-nav-bg)] text-[var(--accent)] font-bold text-xs flex items-center justify-center shrink-0 border border-[var(--border-accent)]">
            D
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[var(--text-primary)] tracking-wide group-hover:text-[var(--accent)] transition-colors">
                MASTERY GRID
              </h2>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-semibold text-[var(--accent)]">
                View Full Analytics →
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Your coding activity over time
            </p>
          </div>
        </div>

        {/* Time-Range Filter & Full View Action */}
        <div className="flex items-center gap-2">
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <select
              value={timeRange}
              onChange={(e) => handleRangeChange(e.target.value)}
              className="appearance-none bg-[var(--bg-surface-elevated)] text-xs text-[var(--text-secondary)] border border-[var(--border-subtle)] rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:border-[var(--accent)] cursor-pointer"
            >
              <option value="30d">Past 30 Days</option>
              <option value="3m">Past 3 Months</option>
              <option value="6m">Past 6 Months</option>
              <option value="12m">Past 12 Months</option>
              <option value="this_year">This Year</option>
              <option value="all_time">All Time</option>
              <option value="custom">Custom Range</option>
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

      {/* Custom Date Range Picker inputs when selected */}
      {showCustomPicker && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex flex-wrap items-center gap-2 pb-3 text-xs text-slate-300 border-b border-white/5 mb-2"
        >
          <span className="text-[11px] text-slate-400">From:</span>
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
          />
          <span className="text-[11px] text-slate-400">To:</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
          />
        </div>
      )}

      {/* Main Heatmap Container */}
      <div className="overflow-x-auto py-2 custom-scrollbar">
        <div className="min-w-[460px] inline-block">
          {/* Dynamic Month Labels (aligned with week columns) */}
          <div className="relative h-4 mb-2 pl-8 text-[11px] text-[var(--text-muted)] font-medium">
            {monthLabels.map((m, idx) => (
              <span
                key={`${m.label}-${idx}`}
                className="absolute transform -translate-x-1"
                style={{ left: `${m.weekIndex * 22 + 32}px` }}
              >
                {m.label}
              </span>
            ))}
          </div>

          {/* Grid with Weekday Labels on the left (Mon, Wed, Fri) */}
          <div className="flex gap-2">
            {/* Weekday Row Labels */}
            <div className="flex flex-col justify-between text-[10px] text-[var(--text-muted)] font-mono py-0.5 w-6 shrink-0 select-none">
              <span className="h-4 leading-4">Mon</span>
              <span className="h-4 leading-4">Wed</span>
              <span className="h-4 leading-4">Fri</span>
            </div>

            {/* Matrix of Columns (Weeks) */}
            <div className="flex gap-1.5 flex-1">
              {weeks.map((week, wIdx) => (
                <div key={`wk-${wIdx}`} className="flex flex-col gap-1.5">
                  {week.map((day) => {
                    const cellStyle = getCellInlineStyle(day.level, day.isFuture);

                    return (
                      <div
                        key={day.date}
                        style={cellStyle}
                        onClick={(e) => {
                          e.stopPropagation();
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
                        className={`w-4 h-4 rounded-xs border transition-all duration-150 ${
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

          {/* Dynamic Intensity Legend matching Sabevia amber scale */}
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

      {/* Bottom Summary Bar (3 dynamic summary cards) */}
      <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Card 1: Problems Solved */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--bg-surface-elevated)]/50">
          <div
            className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 font-mono font-bold"
            style={{
              backgroundColor: 'var(--active-nav-bg)',
              borderColor: 'var(--border-accent)',
              color: accent,
            }}
          >
            &lt;/&gt;
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
                {overall.periodSolved}
              </span>
              {overall.percentageChange !== null && (
                <span
                  className={`text-[10px] font-semibold font-mono inline-flex items-center gap-0.5 ${
                    overall.percentageChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {overall.percentageChange >= 0 ? (
                    <ArrowUp className="w-2.5 h-2.5" />
                  ) : (
                    <ArrowDown className="w-2.5 h-2.5" />
                  )}
                  {Math.abs(overall.percentageChange)}%
                </span>
              )}
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">
              problems solved in period
            </div>
          </div>
        </div>

        {/* Card 2: Day Streak */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--bg-surface-elevated)]/50">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 shrink-0">
            <Flame className="w-5 h-5 fill-amber-400 stroke-amber-400" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              {overall.dayStreak}
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">
              Day Streak
            </div>
          </div>
        </div>

        {/* Card 3: Overall Accuracy */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--bg-surface-elevated)]/50">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-400 shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              {overall.overallAccuracy !== null ? `${overall.overallAccuracy}%` : '—'}
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">
              Overall Accuracy
            </div>
          </div>
        </div>
      </div>

      {/* Date Inspection Modal on Click */}
      <MasteryDateModal
        day={selectedDay}
        onClose={() => setSelectedDay(null)}
        onNavigateToProblems={onNavigateToProblems}
      />
    </div>
  );
};
