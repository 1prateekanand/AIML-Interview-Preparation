import React, { useState } from 'react';
import {
  Maximize2,
  ArrowRight,
  Sparkles,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Problem } from '../../types';
import {
  useConstellationData,
  ConstellationCategoryData,
} from '../../hooks/useConstellationData';
import { ConstellationNodeIcon } from './ConstellationNodeIcon';

interface AlgorithmConstellationProps {
  onNavigateToProblems?: (tag?: string) => void;
  onOpenDetail?: () => void;
  problems?: Problem[];
}

export const AlgorithmConstellation: React.FC<AlgorithmConstellationProps> = ({
  onNavigateToProblems,
  onOpenDetail,
  problems,
}) => {
  const { currentTheme } = useTheme();
  const { categories, centralHub, overall, getCategoryById } = useConstellationData(problems);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All Categories');

  const accent = currentTheme.tokens.accent || '#F5A623';
  const accentSecondary = currentTheme.tokens.accentSecondary || '#FFC247';
  const accentGlow = currentTheme.tokens.accentGlow || 'rgba(245, 166, 35, 0.4)';

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const val = e.target.value;
    setFilterCategory(val);
    if (val === 'All Categories') {
      setSelectedCategoryId(null);
    } else {
      setSelectedCategoryId(val);
    }
  };

  const handleNodeClick = (e: React.MouseEvent, catId: string) => {
    e.stopPropagation();
    if (selectedCategoryId === catId) {
      setSelectedCategoryId(null);
      setFilterCategory('All Categories');
    } else {
      setSelectedCategoryId(catId);
      setFilterCategory(catId);
    }
  };

  const selectedCategory = selectedCategoryId ? getCategoryById(selectedCategoryId) : null;
  const hoveredCategory = hoveredCategoryId ? getCategoryById(hoveredCategoryId) : null;
  const activeCategory = hoveredCategory || selectedCategory;

  return (
    <div
      onClick={onOpenDetail}
      className="rounded-2xl border p-5 md:p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer group"
      style={{
        backgroundColor: '#070A13',
        borderColor: `${accent}40`,
        boxShadow: `0 20px 40px -15px rgba(0,0,0,0.8), inset 0 0 50px ${accent}06`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3 z-10">
        <div className="flex items-start gap-3">
          <span
            className="w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 border transition-colors shadow-xs"
            style={{
              backgroundColor: 'var(--active-nav-bg)',
              borderColor: 'var(--border-accent)',
              color: 'var(--accent)',
            }}
          >
            C
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide group-hover:text-[var(--accent)] transition-colors">
                ALGORITHM CONSTELLATION
              </h2>
              <span
                className="text-[10px] font-mono px-1.5 py-0.5 rounded border font-bold transition-colors"
                style={{
                  backgroundColor: 'var(--active-nav-bg)',
                  borderColor: 'var(--border-accent)',
                  color: 'var(--accent)',
                }}
              >
                11 TOPICS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Explore your journey across topics
            </p>
          </div>
        </div>

        {/* Top-Right: Dropdown Filter & Expand Icon */}
        <div className="flex items-center gap-2">
          <select
            value={filterCategory}
            onChange={handleFilterChange}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900/90 text-xs text-slate-300 border border-white/10 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[var(--accent)] cursor-pointer max-w-[140px] truncate"
          >
            <option value="All Categories">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenDetail) onOpenDetail();
            }}
            title="Open Fullscreen Constellation View"
            className="p-1.5 rounded-lg bg-slate-900/80 text-slate-400 hover:text-[var(--accent)] hover:bg-slate-800 transition-colors border border-white/10"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Constellation Canvas Preview */}
      <div className="relative w-full aspect-[820/640] max-h-[380px] my-auto flex items-center justify-center">
        <svg
          className="w-full h-full overflow-visible select-none"
          viewBox="0 0 820 640"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="cardConnGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="cardNodeGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <radialGradient id="cardCentralCoreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={accent} stopOpacity="0.32" />
              <stop offset="50%" stopColor={accent} stopOpacity="0.08" />
              <stop offset="100%" stopColor={accent} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Central Ambient Glow */}
          <circle
            cx={centralHub.x}
            cy={centralHub.y - 20}
            r={220}
            fill="url(#cardCentralCoreGlow)"
          />

          {/* Concentric Guide Ring */}
          <circle
            cx={centralHub.x}
            cy={centralHub.y - 20}
            r={265}
            fill="none"
            stroke={`${accent}22`}
            strokeWidth="1"
            strokeDasharray="6 6"
          />

          {/* Connections: Single central-to-node line */}
          {categories.map((node) => {
            const isSelected = selectedCategoryId === node.id;
            const isHovered = hoveredCategoryId === node.id;
            const isHighlighted = isSelected;

            // Slight vertical adjustment for preview canvas
            const nodeY = node.y - 15;
            const hubY = centralHub.y - 20;

            return (
              <line
                key={`prev-conn-${node.id}`}
                x1={centralHub.x}
                y1={hubY}
                x2={node.x}
                y2={nodeY}
                stroke={
                  isHighlighted
                    ? accentSecondary
                    : isHovered
                    ? `${accent}99`
                    : `${accent}40`
                }
                strokeWidth={isHighlighted ? 3.5 : isHovered ? 2 : 1.2}
                strokeOpacity={isHighlighted ? 1 : isHovered ? 0.75 : 0.35}
                filter={isHighlighted ? 'url(#cardConnGlow)' : undefined}
                className="transition-all duration-300"
              />
            );
          })}

          {/* Central Hub */}
          <g className="cursor-default select-none">
            <circle
              cx={centralHub.x}
              cy={centralHub.y - 20}
              r={centralHub.radius}
              fill="rgba(10, 15, 29, 0.95)"
              stroke={accent}
              strokeWidth="2.5"
              filter="url(#cardNodeGlow)"
            />
            {/* 3D Cube Icon */}
            <g transform={`translate(${centralHub.x - 16}, ${centralHub.y - 42})`}>
              <polygon points="16,3 29,9 16,15 3,9" fill={accentSecondary} opacity="0.95" />
              <polygon points="3,9 16,15 16,27 3,21" fill={accent} opacity="0.8" />
              <polygon points="16,15 29,9 29,21 16,27" fill={currentTheme.tokens.accentHover || accent} opacity="0.9" />
            </g>
            <text
              x={centralHub.x}
              y={centralHub.y - 6}
              textAnchor="middle"
              className="text-[9.5px] font-bold fill-white tracking-wider font-mono select-none"
            >
              COMPETENCY
            </text>
            <text
              x={centralHub.x}
              y={centralHub.y + 5}
              textAnchor="middle"
              className="text-[8px] font-extrabold tracking-widest font-mono select-none"
              fill={accent}
            >
              CORE
            </text>
          </g>

          {/* Category Nodes */}
          {categories.map((node) => {
            const isSelected = selectedCategoryId === node.id;
            const isHovered = hoveredCategoryId === node.id;
            const isCompleted = node.status === 'completed';
            const isInProgress = node.status === 'in-progress';
            const nodeRadius = 22;
            const nodeY = node.y - 15;

            return (
              <g
                key={`prev-node-${node.id}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredCategoryId(node.id)}
                onMouseLeave={() => setHoveredCategoryId(null)}
                onClick={(e) => handleNodeClick(e, node.id)}
              >
                {/* Generous touch target */}
                <circle cx={node.x} cy={nodeY} r={nodeRadius + 10} fill="transparent" />

                {/* Selected pulse ring */}
                {isSelected && (
                  <circle
                    cx={node.x}
                    cy={nodeY}
                    r={nodeRadius + 6}
                    fill="none"
                    stroke={accentSecondary}
                    strokeWidth="2.5"
                    filter="url(#cardNodeGlow)"
                  />
                )}

                {/* Node Circle */}
                <circle
                  cx={node.x}
                  cy={nodeY}
                  r={nodeRadius}
                  fill={
                    isCompleted
                      ? `${accent}33`
                      : isInProgress
                      ? 'rgba(15, 23, 42, 0.95)'
                      : 'rgba(15, 23, 42, 0.85)'
                  }
                  stroke={
                    isSelected
                      ? accentSecondary
                      : isCompleted
                      ? accent
                      : isInProgress
                      ? `${accent}99`
                      : 'rgba(100, 116, 139, 0.45)'
                  }
                  strokeWidth={isSelected ? 3 : isCompleted ? 2.5 : 1.5}
                  filter={isSelected ? 'url(#cardNodeGlow)' : undefined}
                />

                {/* Icon */}
                <foreignObject
                  x={node.x - 10}
                  y={nodeY - 10}
                  width={20}
                  height={20}
                  className="pointer-events-none select-none overflow-visible"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <ConstellationNodeIcon
                      name={node.iconName}
                      className="w-4 h-4"
                      style={{
                        color: isSelected
                          ? '#FFFFFF'
                          : isCompleted
                          ? accentSecondary
                          : isInProgress
                          ? accent
                          : '#94A3B8',
                      }}
                    />
                  </div>
                </foreignObject>

                {/* Checkmark */}
                {isCompleted && (
                  <g transform={`translate(${node.x + 8}, ${nodeY - 16})`}>
                    <circle cx="7" cy="7" r="7" fill={accent} />
                    <path
                      d="M4 7.5L6 9.5L10 5"
                      fill="none"
                      stroke="#070A13"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                )}

                {/* Label */}
                <g transform={`translate(${node.x}, ${nodeY + nodeRadius + 12})`}>
                  <rect
                    x="-55"
                    y="-9"
                    width="110"
                    height="18"
                    rx="9"
                    fill="rgba(10, 15, 29, 0.88)"
                    stroke={
                      isSelected
                        ? accentSecondary
                        : isHovered
                        ? `${accent}88`
                        : 'rgba(255, 255, 255, 0.12)'
                    }
                    strokeWidth={isSelected ? 1.5 : 1}
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`text-[8.5px] transition-colors ${
                      isSelected
                        ? 'font-bold fill-white'
                        : isHovered
                        ? 'font-semibold'
                        : 'font-medium fill-slate-300'
                    }`}
                    fill={isHovered ? accentSecondary : undefined}
                  >
                    {node.shortName}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer / Active Topic Preview Bar */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs z-10">
        {activeCategory ? (
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                backgroundColor:
                  activeCategory.status === 'completed'
                    ? accent
                    : activeCategory.status === 'in-progress'
                    ? accentSecondary
                    : '#64748B',
              }}
            />
            <span className="font-semibold text-white truncate">
              {activeCategory.name}
            </span>
            <span
              className="font-mono text-[11px] shrink-0 font-semibold"
              style={{ color: 'var(--accent)' }}
            >
              ({activeCategory.solvedCount}/{activeCategory.totalCount} solved)
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Compass className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            <span>Click any node to inspect or tap to explore full dashboard</span>
          </div>
        )}

        <div
          className="flex items-center gap-1 text-[11px] font-semibold hover:opacity-80 shrink-0 ml-2"
          style={{ color: 'var(--accent)' }}
        >
          <span>Full View</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
};

