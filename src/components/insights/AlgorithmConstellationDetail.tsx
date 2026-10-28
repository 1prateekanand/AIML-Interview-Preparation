import React, { useState, useEffect } from 'react';
import {
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
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';
import { CONSTELLATION_TOPICS } from '../../data/mockData';
import { ConstellationTopic } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { InsightsDetailHeader } from './InsightsDetailHeader';

interface AlgorithmConstellationDetailProps {
  onBack: () => void;
  onNavigateToProblems?: (tag?: string) => void;
}

export const AlgorithmConstellationDetail: React.FC<AlgorithmConstellationDetailProps> = ({
  onBack,
  onNavigateToProblems,
}) => {
  const { currentTheme } = useTheme();
  const [selectedTopic, setSelectedTopic] = useState<ConstellationTopic | null>(
    CONSTELLATION_TOPICS[0]
  );
  const [hoveredTopic, setHoveredTopic] = useState<ConstellationTopic | null>(null);

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
  const accentGlow = currentTheme.tokens.accentGlow;

  const topics = CONSTELLATION_TOPICS;

  const centerNode = {
    id: 'algorithms',
    label: 'Algorithms Core',
    x: 50,
    y: 50,
  };

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

  const activeTopic = hoveredTopic || selectedTopic || topics[0];

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

  const completedCount = topics.filter((t) => t.status === 'completed').length;
  const inProgressCount = topics.filter((t) => t.status === 'in-progress').length;
  const notStartedCount = topics.filter((t) => t.status === 'not-started').length;

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header with Back Navigation */}
      <InsightsDetailHeader
        badge="C"
        title="Algorithm Constellation Network"
        subtitle="Visual map of algorithmic knowledge dependencies, mastered clusters, and learning trajectories"
        onBack={onBack}
      />

      {/* Top Progression Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>Topics Mastered</span>
            <CheckCircle2 className="w-4 h-4" style={{ color: accent }} />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              {completedCount}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              / {topics.length} Nodes
            </span>
          </div>
          <div className="mt-2 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(completedCount / topics.length) * 100}%`,
                backgroundColor: accent,
              }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>In Progress</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              {inProgressCount}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              Active topics
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Trees & Graphs currently active
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>Locked / Next Up</span>
            <Lock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              {notStartedCount}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              Prerequisites required
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            SQL & System Design
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>Constellation Coverage</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              71%
            </span>
            <span className="text-xs font-semibold text-emerald-400 font-mono">
              Optimal path
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Next recommendation: Binary Search Trees
          </p>
        </div>
      </div>

      {/* Main Large Constellation Canvas & Side Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Full-bleed Network Canvas (8 cols) */}
        <div className="lg:col-span-8 relative h-[440px] md:h-[500px] w-full rounded-2xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center select-none shadow-2xl">
          {/* Theme-tinted starfield particles */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            {[
              { x: '10%', y: '15%', s: '2px', o: 0.6 },
              { x: '22%', y: '68%', s: '3px', o: 0.8 },
              { x: '85%', y: '20%', s: '2px', o: 0.5 },
              { x: '72%', y: '82%', s: '2.5px', o: 0.7 },
              { x: '42%', y: '12%', s: '2px', o: 0.9 },
              { x: '90%', y: '62%', s: '3px', o: 0.4 },
              { x: '12%', y: '84%', s: '1.5px', o: 0.5 },
              { x: '35%', y: '45%', s: '2px', o: 0.3 },
              { x: '65%', y: '40%', s: '2px', o: 0.4 },
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
              <filter id="neonGlowConstellationLarge" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Hub-to-Node Connection Lines */}
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
                  strokeWidth={highlighted ? 1.5 : 0.7}
                  strokeOpacity={highlighted ? 0.95 : 0.4}
                  strokeDasharray={t.status === 'not-started' ? '1 1.5' : undefined}
                  filter={highlighted ? 'url(#neonGlowConstellationLarge)' : undefined}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Cross-Topic Interconnection Lines */}
            <line
              x1={topics[0].x}
              y1={topics[0].y}
              x2={topics[1].x}
              y2={topics[1].y}
              stroke={accentSecondary}
              strokeWidth={isLineHighlighted('arrays', 'trees') ? 1.4 : 0.7}
              strokeOpacity="0.5"
            />
            <line
              x1={topics[1].x}
              y1={topics[1].y}
              x2={topics[2].x}
              y2={topics[2].y}
              stroke={accentSecondary}
              strokeWidth={isLineHighlighted('trees', 'graphs') ? 1.4 : 0.7}
              strokeOpacity="0.5"
            />
            <line
              x1={topics[3].x}
              y1={topics[3].y}
              x2={topics[4].x}
              y2={topics[4].y}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="0.6"
              strokeDasharray="1 1"
            />
          </svg>

          {/* Central Algorithms Hub */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-10"
            style={{ left: `${centerNode.x}%`, top: `${centerNode.y}%` }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xl"
              style={{
                backgroundColor: 'var(--active-nav-bg)',
                border: `2px solid ${accent}`,
                color: accent,
                boxShadow: `0 0 28px ${accentGlow}`,
              }}
            >
              <Box className="w-8 h-8 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-[var(--text-primary)] mt-1.5 drop-shadow-md">
              Algorithms Core
            </span>
          </div>

          {/* Topic Nodes */}
          {topics.map((t) => {
            const Icon = getNodeIcon(t.iconName);
            const isCompleted = t.status === 'completed';
            const isInProgress = t.status === 'in-progress';
            const isSelected = activeTopic.id === t.id;

            let nodeStyle: React.CSSProperties = {};
            if (isCompleted) {
              nodeStyle = {
                backgroundColor: 'var(--active-nav-bg)',
                borderColor: accent,
                color: accent,
                boxShadow: `0 0 18px ${accentGlow}`,
              };
            } else if (isInProgress) {
              nodeStyle = {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderColor: accentSecondary,
                color: accentSecondary,
                boxShadow: `0 0 14px ${accentGlow}`,
              };
            } else {
              nodeStyle = {
                backgroundColor: 'rgba(30, 41, 59, 0.7)',
                borderColor: 'rgba(100, 116, 139, 0.4)',
                color: 'rgba(148, 163, 184, 0.8)',
              };
            }

            return (
              <div
                key={t.id}
                onMouseEnter={() => setHoveredTopic(t)}
                onMouseLeave={() => setHoveredTopic(null)}
                onClick={() => setSelectedTopic(t)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer transition-all duration-200 z-10 ${
                  isSelected ? 'scale-125' : 'hover:scale-110'
                }`}
                style={{ left: `${t.x}%`, top: `${t.y}%` }}
              >
                <div
                  className="w-11 h-11 rounded-full border-2 flex items-center justify-center relative transition-all shadow-md"
                  style={nodeStyle}
                >
                  <Icon className="w-5 h-5" />
                  {t.status === 'not-started' && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400">
                      <Lock className="w-2.5 h-2.5" />
                    </span>
                  )}
                  {t.status === 'completed' && (
                    <span
                      className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[var(--bg-main)] font-extrabold text-[8px]"
                      style={{ backgroundColor: accent }}
                    >
                      ✓
                    </span>
                  )}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-1.5 px-2 py-0.5 rounded transition-colors whitespace-nowrap shadow-sm ${
                    isSelected
                      ? 'text-white bg-slate-900/90 ring-1 ring-[var(--border-accent)] font-bold'
                      : 'text-slate-200 bg-black/60 backdrop-blur-xs'
                  }`}
                >
                  {t.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Selected Node Inspector (4 cols) */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-accent)] shadow-xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] font-mono">
                  Inspecting Topic Node
                </span>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mt-0.5">
                  {activeTopic.label}
                </h3>
                <span className="text-xs text-[var(--text-muted)]">
                  {activeTopic.category}
                </span>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-full font-bold uppercase border"
                style={{
                  backgroundColor:
                    activeTopic.status === 'completed'
                      ? 'var(--active-nav-bg)'
                      : 'rgba(255, 255, 255, 0.08)',
                  borderColor:
                    activeTopic.status === 'completed'
                      ? 'var(--border-accent)'
                      : 'rgba(255, 255, 255, 0.1)',
                  color:
                    activeTopic.status === 'completed'
                      ? accent
                      : activeTopic.status === 'in-progress'
                      ? accentSecondary
                      : 'var(--text-muted)',
                }}
              >
                {activeTopic.status.replace('-', ' ')}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--text-muted)]">Problems Solved:</span>
                <span className="font-bold text-[var(--text-primary)]">
                  {activeTopic.solvedCount} / {activeTopic.totalCount}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round((activeTopic.solvedCount / activeTopic.totalCount) * 100)}%`,
                    backgroundColor: accent,
                  }}
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="text-[var(--text-muted)] font-medium block">Key Concepts Covered:</span>
              <div className="flex flex-wrap gap-1.5">
                {activeTopic.id === 'arrays' && (
                  <>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">Two Pointers</span>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">Sliding Window</span>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">Prefix Sums</span>
                  </>
                )}
                {activeTopic.id === 'trees' && (
                  <>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">BST Validation</span>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">LCA</span>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">Trie Operations</span>
                  </>
                )}
                {activeTopic.id === 'graphs' && (
                  <>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">BFS / DFS</span>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">Topological Sort</span>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">Dijkstra</span>
                  </>
                )}
                {activeTopic.id === 'dp' && (
                  <>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">Knapsack</span>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">Memoization</span>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">Tabulation</span>
                  </>
                )}
                {activeTopic.id === 'math' && (
                  <>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">Combinatorics</span>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">Modular Arithmetic</span>
                  </>
                )}
                {(activeTopic.id === 'sql' || activeTopic.id === 'system-design') && (
                  <>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">Schema Design</span>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">Indexing & Scaling</span>
                  </>
                )}
              </div>
            </div>

            {onNavigateToProblems && (
              <button
                type="button"
                onClick={() => onNavigateToProblems(activeTopic.label)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[var(--accent)] text-[var(--bg-main)] hover:bg-[var(--accent-hover)] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md group"
              >
                <span>Practice {activeTopic.label} Problems</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </div>

          {/* Node Legend & Status List */}
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2 flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
              All Constellation Nodes
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
              {topics.map((t) => {
                const isSelected = activeTopic.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTopic(t)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[var(--active-nav-bg)] border-[var(--border-accent)] text-[var(--text-primary)] font-semibold'
                        : 'hover:bg-[var(--bg-surface-elevated)] border-transparent text-[var(--text-secondary)]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            t.status === 'completed'
                              ? accent
                              : t.status === 'in-progress'
                              ? accentSecondary
                              : '#64748B',
                        }}
                      />
                      <span>{t.label}</span>
                    </div>
                    <span className="text-[11px] font-mono text-[var(--text-muted)]">
                      {t.solvedCount}/{t.totalCount}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
