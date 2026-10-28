import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  Flame,
  Target,
  ArrowUp,
  Maximize2,
} from 'lucide-react';
import { HeatmapDay } from '../../types';
import { useTheme } from '../../context/ThemeContext';

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

interface MasteryGridProps {
  onOpenDetail?: () => void;
}

export const MasteryGrid: React.FC<MasteryGridProps> = ({ onOpenDetail }) => {
  const { currentTheme } = useTheme();
  const [timeRange, setTimeRange] = useState<string>('Past 3 Months');
  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  const accent = currentTheme.tokens.accent;
  const accentSecondary = currentTheme.tokens.accentSecondary;
  const [r, g, b] = useMemo(() => hexToRgb(accent), [accent]);

  // Generate 13 weeks of daily activity for Past 3 Months
  const weeksData = useMemo(() => {
    const totalWeeks = 13;
    const weeks: HeatmapDay[][] = [];
    const baseDate = new Date(2024, 9, 1); // Oct 1, 2024

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
  }, [timeRange]);

  // Dynamic theme-aware cell styling preserving intensity hierarchy
  const getCellInlineStyle = (level: 0 | 1 | 2 | 3 | 4): React.CSSProperties => {
    switch (level) {
      case 0:
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
        };
      case 1:
        return {
          backgroundColor: `rgba(${r}, ${g}, ${b}, 0.22)`,
          borderColor: `rgba(${r}, ${g}, ${b}, 0.38)`,
        };
      case 2:
        return {
          backgroundColor: `rgba(${r}, ${g}, ${b}, 0.48)`,
          borderColor: `rgba(${r}, ${g}, ${b}, 0.68)`,
        };
      case 3:
        return {
          backgroundColor: `rgba(${r}, ${g}, ${b}, 0.78)`,
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
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-[var(--bg-surface-elevated)] text-xs text-[var(--text-secondary)] border border-[var(--border-subtle)] rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:border-[var(--accent)] cursor-pointer"
            >
              <option>Past 3 Months</option>
              <option>Past 6 Months</option>
              <option>This Year</option>
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

      {/* Main Heatmap Container */}
      <div className="overflow-x-auto py-2">
        <div className="min-w-[460px]">
          {/* Month Header Labels */}
          <div className="flex text-[11px] text-[var(--text-muted)] font-medium mb-2 pl-8">
            <span className="w-1/3">Oct 2024</span>
            <span className="w-1/3 pl-2">Nov 2024</span>
            <span className="w-1/3 pl-4">Dec 2024</span>
          </div>

          {/* Grid with Day of Week row headers */}
          <div className="flex gap-2">
            {/* Weekday Labels (Mon, Wed, Fri) */}
            <div className="flex flex-col justify-between text-[10px] text-[var(--text-muted)] font-mono py-0.5 w-6 shrink-0 select-none">
              <span className="h-4 leading-4">Mon</span>
              <span className="h-4 leading-4">Wed</span>
              <span className="h-4 leading-4">Fri</span>
            </div>

            {/* Matrix of 13 Columns (Weeks) */}
            <div className="flex gap-1.5 flex-1">
              {weeksData.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1.5">
                  {week.map((day, dIdx) => {
                    const cellStyle = getCellInlineStyle(day.level);

                    return (
                      <div
                        key={dIdx}
                        style={cellStyle}
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
                        className="w-4 h-4 rounded-xs border transition-all duration-150 cursor-pointer hover:scale-110"
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Theme Legend */}
          <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-[var(--text-muted)]">
            <span>No activity</span>
            <span
              className="w-3 h-3 rounded-xs border"
              style={getCellInlineStyle(0)}
            />
            <span
              className="w-3 h-3 rounded-xs border"
              style={getCellInlineStyle(1)}
            />
            <span className="text-[10px]">1-2</span>
            <span
              className="w-3 h-3 rounded-xs border"
              style={getCellInlineStyle(2)}
            />
            <span className="text-[10px]">3-5</span>
            <span
              className="w-3 h-3 rounded-xs border"
              style={getCellInlineStyle(3)}
            />
            <span className="text-[10px]">6-10</span>
            <span
              className="w-3 h-3 rounded-xs border"
              style={getCellInlineStyle(4)}
            />
            <span className="text-[10px]">11+</span>
          </div>
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredCell && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full mb-2 px-2.5 py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-accent)] text-xs shadow-2xl text-center whitespace-nowrap"
          style={{ left: hoveredCell.x, top: hoveredCell.y - 8 }}
        >
          <div className="font-semibold text-[var(--text-primary)]">
            {hoveredCell.count === 0
              ? 'No problems solved'
              : `${hoveredCell.count} problem${hoveredCell.count > 1 ? 's' : ''} solved`}
          </div>
          <div className="text-[10px] text-[var(--text-muted)]">
            {hoveredCell.date}
          </div>
        </div>
      )}

      {/* Bottom Summary Bar */}
      <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Problems Solved this Month */}
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
                42
              </span>
              <span
                className="text-[10px] font-semibold font-mono inline-flex items-center gap-0.5"
                style={{ color: accent }}
              >
                <ArrowUp className="w-2.5 h-2.5" /> 27%
              </span>
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">
              problems solved this month
            </div>
          </div>
        </div>

        {/* Day Streak */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--bg-surface-elevated)]/50">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 shrink-0">
            <Flame className="w-5 h-5 fill-amber-400 stroke-amber-400" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              12
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">
              Day Streak
            </div>
          </div>
        </div>

        {/* Overall Accuracy */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--bg-surface-elevated)]/50">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-400 shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              63%
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">
              Overall Accuracy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
