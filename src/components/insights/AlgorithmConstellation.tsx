import React, { useState } from 'react';
import {
  ChevronDown,
  Box,
  List,
  TreePine,
  Network,
  Code2,
  Sigma,
  Database,
  Layers,
  Lock,
  ArrowRight,
  Maximize2,
} from 'lucide-react';
import { CONSTELLATION_TOPICS } from '../../data/mockData';
import { ConstellationTopic } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface AlgorithmConstellationProps {
  onNavigateToProblems?: (tag?: string) => void;
  onOpenDetail?: () => void;
}

export const AlgorithmConstellation: React.FC<AlgorithmConstellationProps> = ({
  onNavigateToProblems,
  onOpenDetail,
}) => {
  const { currentTheme } = useTheme();
  const [filter, setFilter] = useState<string>('All Categories');
  const [selectedTopic, setSelectedTopic] = useState<ConstellationTopic | null>(null);
  const [hoveredTopic, setHoveredTopic] = useState<ConstellationTopic | null>(null);

  // Dynamic theme colors
  const accent = currentTheme.tokens.accent;
  const accentSecondary = currentTheme.tokens.accentSecondary;
  const accentGlow = currentTheme.tokens.accentGlow;

  const topics = CONSTELLATION_TOPICS;

  // Center node definition
  const centerNode = {
    id: 'algorithms',
    label: 'Algorithms',
    x: 48,
    y: 56,
  };

  // Node icon mapping
  const getNodeIcon = (iconName: string) => {
    switch (iconName) {
      case 'list':
        return List;
      case 'tree':
        return TreePine;
      case 'network':
        return Network;
      case 'code':
        return Code2;
      case 'sigma':
        return Sigma;
      case 'database':
        return Database;
      case 'layout':
        return Layers;
      default:
        return Box;
    }
  };

  const activeTopic = hoveredTopic || selectedTopic;

  // Helper to determine if a line is active/highlighted
  const isLineHighlighted = (sourceId: string, targetId: string) => {
    if (!activeTopic) return false;
    return (
      (activeTopic.id === sourceId && targetId === 'algorithms') ||
      (activeTopic.id === targetId && sourceId === 'algorithms') ||
      (activeTopic.id === sourceId && activeTopic.connections.includes(targetId)) ||
      (activeTopic.id === targetId &&
        topics.find((t) => t.id === sourceId)?.connections.includes(targetId))
    );
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
            C
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[var(--text-primary)] tracking-wide group-hover:text-[var(--accent)] transition-colors">
                ALGORITHM CONSTELLATION
              </h2>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-semibold text-[var(--accent)]">
                View Full Analytics →
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Explore your journey across topics
            </p>
          </div>
        </div>

        {/* Filter Dropdown & Full View Action */}
        <div className="flex items-center gap-2">
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-[var(--bg-surface-elevated)] text-xs text-[var(--text-secondary)] border border-[var(--border-subtle)] rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:border-[var(--accent)] cursor-pointer"
            >
              <option>All Categories</option>
              <option>Core Foundations</option>
              <option>Specialized Systems</option>
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

      {/* Main Visual & Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Constellation Canvas (col-span 8) */}
        <div className="md:col-span-8 relative h-72 sm:h-80 w-full rounded-xl bg-black/30 border border-white/5 overflow-hidden flex items-center justify-center select-none">
          {/* Subtle starry background particles tinted with theme accent */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            {[
              { x: '12%', y: '18%', s: '2px', o: 0.6 },
              { x: '25%', y: '72%', s: '3px', o: 0.8 },
              { x: '88%', y: '22%', s: '2px', o: 0.5 },
              { x: '70%', y: '85%', s: '1.5px', o: 0.7 },
              { x: '45%', y: '10%', s: '2.5px', o: 0.9 },
              { x: '92%', y: '65%', s: '2px', o: 0.4 },
              { x: '15%', y: '88%', s: '1.5px', o: 0.5 },
            ].map((star, i) => (
              <span
                key={i}
                className="absolute rounded-full animate-pulse"
                style={{
                  left: star.x,
                  top: star.y,
                  width: star.s,
                  height: star.s,
                  opacity: star.o,
                  backgroundColor: i % 2 === 0 ? accent : '#FFFFFF',
                }}
              />
            ))}
          </div>

          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <filter id="neonGlowConstellation" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Hub-to-Node Connection Lines — dynamic colors */}
            {topics.map((t) => {
              const highlighted = isLineHighlighted(t.id, 'algorithms');
              const strokeColor =
                t.status === 'completed'
                  ? accent
                  : t.status === 'in-progress'
                  ? accentSecondary
                  : 'rgba(255, 255, 255, 0.15)';

              return (
                <line
                  key={`line-hub-${t.id}`}
                  x1={centerNode.x}
                  y1={centerNode.y}
                  x2={t.x}
                  y2={t.y}
                  stroke={strokeColor}
                  strokeWidth={highlighted ? 1.3 : 0.6}
                  strokeOpacity={highlighted ? 0.95 : 0.45}
                  strokeDasharray={t.status === 'not-started' ? '1 1.5' : undefined}
                  filter={highlighted ? 'url(#neonGlowConstellation)' : undefined}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Inter-Topic Connection Lines */}
            {/* Arrays <-> Trees */}
            <line
              x1={topics[0].x}
              y1={topics[0].y}
              x2={topics[1].x}
              y2={topics[1].y}
              stroke={accentSecondary}
              strokeWidth={isLineHighlighted('arrays', 'trees') ? 1.2 : 0.6}
              strokeOpacity="0.5"
            />
            {/* Trees <-> Graphs */}
            <line
              x1={topics[1].x}
              y1={topics[1].y}
              x2={topics[2].x}
              y2={topics[2].y}
              stroke={accentSecondary}
              strokeWidth={isLineHighlighted('trees', 'graphs') ? 1.2 : 0.6}
              strokeOpacity="0.5"
            />
            {/* DP <-> Math */}
            <line
              x1={topics[3].x}
              y1={topics[3].y}
              x2={topics[4].x}
              y2={topics[4].y}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="0.5"
              strokeDasharray="1 1"
            />
          </svg>

          {/* Central Algorithms Hub HTML Element — dynamic theme primary accent */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-10"
            style={{ left: `${centerNode.x}%`, top: `${centerNode.y}%` }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
              style={{
                backgroundColor: 'var(--active-nav-bg)',
                border: `2px solid ${accent}`,
                color: accent,
                boxShadow: `0 0 24px ${accentGlow}`,
              }}
            >
              <Box className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-[11px] font-bold text-[var(--text-primary)] mt-1 drop-shadow-md">
              Algorithms
            </span>
          </div>

          {/* Topic Nodes — dynamically themed based on completion status */}
          {topics.map((t) => {
            const Icon = getNodeIcon(t.iconName);
            const isCompleted = t.status === 'completed';
            const isInProgress = t.status === 'in-progress';
            const isHovered = activeTopic?.id === t.id;

            // Dynamically computed node styling
            let nodeStyle: React.CSSProperties = {};
            if (isCompleted) {
              nodeStyle = {
                backgroundColor: 'var(--active-nav-bg)',
                borderColor: accent,
                color: accent,
                boxShadow: `0 0 16px ${accentGlow}`,
              };
            } else if (isInProgress) {
              nodeStyle = {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: accentSecondary,
                color: accentSecondary,
                boxShadow: `0 0 12px ${accentGlow}`,
              };
            } else {
              nodeStyle = {
                backgroundColor: 'rgba(30, 41, 59, 0.6)',
                borderColor: 'rgba(100, 116, 139, 0.4)',
                color: 'rgba(148, 163, 184, 0.8)',
              };
            }

            return (
              <div
                key={t.id}
                onMouseEnter={() => setHoveredTopic(t)}
                onMouseLeave={() => setHoveredTopic(null)}
                onClick={() => setSelectedTopic(selectedTopic?.id === t.id ? null : t)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer transition-all duration-200 z-10 ${
                  isHovered ? 'scale-115' : 'hover:scale-105'
                }`}
                style={{ left: `${t.x}%`, top: `${t.y}%` }}
              >
                <div
                  className="w-9 h-9 rounded-full border flex items-center justify-center relative transition-all"
                  style={nodeStyle}
                >
                  <Icon className="w-4 h-4" />
                  {t.status === 'not-started' && (
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400">
                      <Lock className="w-2 h-2" />
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-semibold mt-1 px-1.5 py-0.5 rounded transition-colors whitespace-nowrap ${
                    isHovered
                      ? 'text-white bg-slate-900/80 ring-1 ring-[var(--border-accent)]'
                      : 'text-slate-300 bg-black/40 backdrop-blur-xs'
                  }`}
                >
                  {t.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right Summary Panel (col-span 4) */}
        <div className="md:col-span-4 space-y-5">
          {/* Topics Mastered Box */}
          <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)]/60 border border-[var(--border-subtle)]">
            <span className="text-xs text-[var(--text-secondary)] font-medium">
              Topics Mastered
            </span>
            <div className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums mt-1 mb-2.5">
              3 <span className="text-base text-[var(--text-muted)] font-normal">/ 7</span>
            </div>

            {/* Dynamic theme progress bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(3 / 7) * 100}%`,
                  backgroundColor: accent,
                  boxShadow: `0 0 8px ${accentGlow}`,
                }}
              />
            </div>
          </div>

          {/* Status Breakdown Legend — dynamically themed dots */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-surface-elevated)]/30">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shadow-sm"
                  style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accentGlow}` }}
                />
                <span className="text-[var(--text-secondary)]">Completed</span>
              </div>
              <span className="font-mono font-bold text-[var(--text-primary)] tabular-nums">
                3
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-surface-elevated)]/30">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shadow-sm"
                  style={{ backgroundColor: accentSecondary, boxShadow: `0 0 6px ${accentGlow}` }}
                />
                <span className="text-[var(--text-secondary)]">In Progress</span>
              </div>
              <span className="font-mono font-bold text-[var(--text-primary)] tabular-nums">
                2
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-surface-elevated)]/30">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                <span className="text-[var(--text-secondary)]">Not Started</span>
              </div>
              <span className="font-mono font-bold text-[var(--text-primary)] tabular-nums">
                2
              </span>
            </div>
          </div>

          {/* Active node detail card */}
          {activeTopic && (
            <div className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-accent)] animate-in fade-in duration-150 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--text-primary)]">
                  {activeTopic.label}
                </span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase"
                  style={{
                    backgroundColor:
                      activeTopic.status === 'completed'
                        ? 'var(--active-nav-bg)'
                        : 'rgba(255, 255, 255, 0.08)',
                    color:
                      activeTopic.status === 'completed'
                        ? accent
                        : activeTopic.status === 'in-progress'
                        ? accentSecondary
                        : 'var(--text-muted)',
                    border: `1px solid ${
                      activeTopic.status === 'completed'
                        ? 'var(--border-accent)'
                        : 'transparent'
                    }`,
                  }}
                >
                  {activeTopic.status.replace('-', ' ')}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] font-mono">
                <span>Progress: {activeTopic.solvedCount} / {activeTopic.totalCount}</span>
                <span style={{ color: accent }}>
                  {Math.round((activeTopic.solvedCount / activeTopic.totalCount) * 100)}%
                </span>
              </div>

              {onNavigateToProblems && (
                <button
                  type="button"
                  onClick={() => onNavigateToProblems(activeTopic.label)}
                  className="w-full mt-1 py-1.5 px-2.5 rounded-lg text-[11px] font-semibold bg-[var(--accent)] text-[var(--bg-main)] hover:bg-[var(--accent-hover)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Practice {activeTopic.label}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
