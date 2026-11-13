import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  Layers,
  ChevronDown,
  Info,
  Check,
  Compass,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Problem } from '../../types';
import {
  useConstellationData,
  ConstellationCategoryData,
} from '../../hooks/useConstellationData';
import { ConstellationNodeIcon } from './ConstellationNodeIcon';
import { InsightsDetailHeader } from './InsightsDetailHeader';

interface AlgorithmConstellationDetailProps {
  onBack: () => void;
  onNavigateToProblems?: (categorySlug?: string) => void;
  problems?: Problem[];
}

export const AlgorithmConstellationDetail: React.FC<AlgorithmConstellationDetailProps> = ({
  onBack,
  onNavigateToProblems,
  problems,
}) => {
  const { currentTheme } = useTheme();
  const { categories, centralHub, overall, getCategoryById } = useConstellationData(problems);

  // Selected topic in the constellation (starts as null to fulfill Initial Selection rule:
  // "On initial page load: Show all 11 category nodes. Display muted connections. Do not show an arbitrary highlighted connection. Show a neutral right-side message asking the user to select a category.")
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All Categories');

  // Keyboard shortcut: Esc to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  // Active theme accent & glows
  const accent = currentTheme.tokens.accent || '#F5A623';
  const accentSecondary = currentTheme.tokens.accentSecondary || '#FFC247';
  const accentGlow = currentTheme.tokens.accentGlow || 'rgba(245, 166, 35, 0.4)';

  // Synchronize category dropdown filter with constellation selection
  const handleFilterChange = (catId: string) => {
    setFilterCategory(catId);
    if (catId === 'All Categories') {
      setSelectedCategoryId(null);
    } else {
      setSelectedCategoryId(catId);
    }
  };

  const handleSelectNode = (catId: string) => {
    if (selectedCategoryId === catId) {
      // Toggle or keep selected
      setSelectedCategoryId(catId);
    } else {
      setSelectedCategoryId(catId);
      setFilterCategory(catId);
    }
  };

  const selectedCategory = selectedCategoryId ? getCategoryById(selectedCategoryId) : null;
  const hoveredCategory = hoveredCategoryId ? getCategoryById(hoveredCategoryId) : null;

  // Active display category for inspect (hover preview or selected)
  const activeCategory = hoveredCategory || selectedCategory;

  // Generate deterministic subtle starfield background points
  const starParticles = useMemo(() => {
    const stars = [];
    const count = 48;
    for (let i = 0; i < count; i++) {
      const x = (i * 73 + 17) % 800 + 10;
      const y = (i * 97 + 29) % 660 + 10;
      const r = (i % 3 === 0 ? 1.4 : i % 2 === 0 ? 1.0 : 0.7);
      const opacity = ((i % 5) * 0.12 + 0.18).toFixed(2);
      stars.push({ x, y, r, opacity });
    }
    return stars;
  }, []);

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* 1. Header with Breadcrumb, Title, C icon, and Filter Dropdown */}
      <InsightsDetailHeader
        badge="C"
        title="ALGORITHM CONSTELLATION"
        subtitle="Explore your journey across topics"
        onBack={onBack}
        actions={
          <div className="flex items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="bg-[var(--bg-surface-elevated)] text-xs text-[var(--text-secondary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 focus:outline-none focus:border-[var(--accent)] cursor-pointer max-w-[200px] truncate"
            >
              <option value="All Categories">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        }
      />

      {/* 2. Main Two-Column Layout (65% Constellation / 35% Inspection & Nodes List) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Section: Interactive Constellation Graph (~65% width) */}
        <div
          className="lg:col-span-8 rounded-2xl border p-4 sm:p-6 flex flex-col items-center justify-between relative overflow-hidden select-none transition-all duration-300"
          style={{
            backgroundColor: '#070A13',
            borderColor: `${accent}40`,
            boxShadow:
              `0 24px 48px -18px rgba(0,0,0,0.85), inset 0 0 60px ${accent}08`,
            minHeight: '580px',
          }}
        >
          {/* Top Bar inside Constellation Canvas */}
          <div className="w-full flex items-center justify-between text-xs mb-1 z-10">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: accent }}
              />
              <span
                className="font-mono text-[11px] uppercase tracking-wider font-semibold"
                style={{ color: accent }}
              >
                Radial Topology
              </span>
              <span className="text-slate-400 text-[11px] hidden sm:inline">
                • 11 Competency Nodes
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} /> Solved
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full border" style={{ borderColor: accent }} /> Active
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-600" /> Todo
              </span>
            </div>
          </div>

          {/* SVG Constellation Canvas */}
          <div className="relative w-full aspect-[820/680] flex items-center justify-center my-auto">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 820 680"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Glow filter for highlighted central connection */}
                <filter id="connGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Glow filter for selected node */}
                <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Radial glow under Central Hub */}
                <radialGradient id="centralCoreGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
                  <stop offset="45%" stopColor={accent} stopOpacity="0.10" />
                  <stop offset="100%" stopColor={accent} stopOpacity="0" />
                </radialGradient>

                {/* Concentric guide ring gradient */}
                <radialGradient id="orbitGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="85%" stopColor={accent} stopOpacity="0.04" />
                  <stop offset="100%" stopColor={accent} stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Starfield Particles */}
              {starParticles.map((star, idx) => (
                <circle
                  key={`star-${idx}`}
                  cx={star.x}
                  cy={star.y}
                  r={star.r}
                  fill="#FFFFFF"
                  opacity={star.opacity}
                />
              ))}

              {/* Ambient radial glow under central core */}
              <circle
                cx={centralHub.x}
                cy={centralHub.y}
                r={240}
                fill="url(#centralCoreGlow)"
              />

              {/* Subtle orbital concentric guides */}
              <circle
                cx={centralHub.x}
                cy={centralHub.y}
                r={285}
                fill="none"
                stroke={`${accent}20`}
                strokeWidth="1"
                strokeDasharray="6 6"
              />
              <circle
                cx={centralHub.x}
                cy={centralHub.y}
                r={160}
                fill="none"
                stroke={`${accent}15`}
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              {/* LAYER 1: Connection Lines from Central Hub to Nodes */}
              {categories.map((node) => {
                const isSelected = selectedCategoryId === node.id;
                const isHovered = hoveredCategoryId === node.id;
                const isHighlighted = isSelected;

                return (
                  <line
                    key={`conn-${node.id}`}
                    x1={centralHub.x}
                    y1={centralHub.y}
                    x2={node.x}
                    y2={node.y}
                    stroke={
                      isHighlighted
                        ? accentSecondary
                        : isHovered
                        ? `${accent}99`
                        : `${accent}40`
                    }
                    strokeWidth={isHighlighted ? 3.5 : isHovered ? 2 : 1.2}
                    strokeOpacity={isHighlighted ? 1 : isHovered ? 0.75 : 0.35}
                    filter={isHighlighted ? 'url(#connGlow)' : undefined}
                    className="transition-all duration-300 ease-out"
                  />
                );
              })}

              {/* LAYER 2: Central AI Interview Competency Core */}
              <g className="cursor-default select-none">
                {/* Outer pulsing ring */}
                <circle
                  cx={centralHub.x}
                  cy={centralHub.y}
                  r={centralHub.radius + 8}
                  fill="none"
                  stroke={accent}
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                  strokeDasharray="4 4"
                />

                {/* Central Hub Main Circle */}
                <circle
                  cx={centralHub.x}
                  cy={centralHub.y}
                  r={centralHub.radius}
                  fill="rgba(10, 15, 29, 0.95)"
                  stroke={accent}
                  strokeWidth="2.5"
                  filter="url(#nodeGlow)"
                  className="shadow-2xl"
                />

                {/* Inner decorative ring */}
                <circle
                  cx={centralHub.x}
                  cy={centralHub.y}
                  r={centralHub.radius - 8}
                  fill={`${accent}15`}
                  stroke={`${accent}50`}
                  strokeWidth="1"
                />

                {/* Isometric 3D Geometric Cube AI Symbol inside Central Hub */}
                <g transform={`translate(${centralHub.x - 18}, ${centralHub.y - 25})`}>
                  {/* Top face */}
                  <polygon
                    points="18,3 32,10 18,17 4,10"
                    fill={accentSecondary}
                    opacity="0.95"
                  />
                  {/* Left face */}
                  <polygon
                    points="4,10 18,17 18,31 4,24"
                    fill={accent}
                    opacity="0.8"
                  />
                  {/* Right face */}
                  <polygon
                    points="18,17 32,10 32,24 18,31"
                    fill={currentTheme.tokens.accentHover || accent}
                    opacity="0.9"
                  />
                  {/* Glowing center spark */}
                  <circle cx="18" cy="17" r="2.5" fill="#FFFFFF" />
                </g>

                {/* White Title inside/below Hub */}
                <text
                  x={centralHub.x}
                  y={centralHub.y + 16}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-white tracking-wider font-mono select-none"
                >
                  AI COMPETENCY
                </text>
                <text
                  x={centralHub.x}
                  y={centralHub.y + 27}
                  textAnchor="middle"
                  className="text-[8.5px] font-extrabold tracking-widest font-mono select-none"
                  fill={accent}
                >
                  CORE
                </text>
              </g>

              {/* LAYER 3: Category Nodes & Labels */}
              {categories.map((node) => {
                const isSelected = selectedCategoryId === node.id;
                const isHovered = hoveredCategoryId === node.id;
                const isCompleted = node.status === 'completed';
                const isInProgress = node.status === 'in-progress';

                // Node radius
                const nodeRadius = 24;

                return (
                  <g
                    key={`node-grp-${node.id}`}
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredCategoryId(node.id)}
                    onMouseLeave={() => setHoveredCategoryId(null)}
                    onClick={() => handleSelectNode(node.id)}
                  >
                    {/* Generous touch/hover target */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={nodeRadius + 14}
                      fill="transparent"
                    />

                    {/* Outer selected glow ring */}
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={nodeRadius + 7}
                        fill="none"
                        stroke={accentSecondary}
                        strokeWidth="2.5"
                        strokeOpacity="0.8"
                        filter="url(#nodeGlow)"
                        className="animate-pulse"
                      />
                    )}

                    {/* Node Circle Background */}
                    <circle
                      cx={node.x}
                      cy={node.y}
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
                      filter={isSelected ? 'url(#nodeGlow)' : undefined}
                      className="transition-all duration-200"
                    />

                    {/* Icon ForeignObject centered inside node */}
                    <foreignObject
                      x={node.x - 11}
                      y={node.y - 11}
                      width={22}
                      height={22}
                      className="pointer-events-none select-none overflow-visible"
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <ConstellationNodeIcon
                          name={node.iconName}
                          className="w-5 h-5 transition-transform duration-200"
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

                    {/* Small Checkmark Badge for Completed status */}
                    {isCompleted && (
                      <g transform={`translate(${node.x + 10}, ${node.y - 18})`}>
                        <circle cx="8" cy="8" r="8" fill={accent} />
                        <path
                          d="M5 8.5L7 10.5L11 6"
                          fill="none"
                          stroke="#070A13"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    )}

                    {/* Category Name Label with dark pill background */}
                    <g transform={`translate(${node.x}, ${node.y + nodeRadius + 14})`}>
                      <rect
                        x="-65"
                        y="-10"
                        width="130"
                        height="20"
                        rx="10"
                        fill="rgba(10, 15, 29, 0.88)"
                        stroke={
                          isSelected
                            ? accentSecondary
                            : isHovered
                            ? `${accent}88`
                            : 'rgba(255, 255, 255, 0.12)'
                        }
                        strokeWidth={isSelected ? 1.5 : 1}
                        className="transition-all duration-150"
                      />
                      <text
                        x="0"
                        y="3"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className={`text-[9.5px] font-sans transition-colors duration-150 ${
                          isSelected
                            ? 'font-extrabold fill-white'
                            : isHovered
                            ? 'font-bold'
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

          {/* Bottom helper prompt */}
          <div className="w-full flex items-center justify-between pt-3 border-t border-white/5 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
              Click any category node or list item to inspect topic details
            </span>
            <span className="font-mono text-right font-semibold" style={{ color: 'var(--accent)' }}>
              {overall.totalSolved} / {overall.totalQuestions} Solved ({overall.overallCompletion}%)
            </span>
          </div>
        </div>

        {/* Right Section: Topic Inspection & All Constellation Nodes (~35% width) */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          {/* Top Panel: Selected Topic Inspection Card */}
          {activeCategory ? (
            <div
              className="p-5 rounded-2xl border relative space-y-4 backdrop-blur-md transition-all duration-300 shadow-xl"
              style={{
                backgroundColor: 'rgba(10, 15, 29, 0.95)',
                borderColor: `${accent}40`,
                boxShadow:
                  `0 16px 36px -12px rgba(0,0,0,0.7), 0 0 20px ${accent}20`,
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors"
                    style={{
                      backgroundColor: `${accent}18`,
                      borderColor: `${accent}40`,
                      color: accent,
                    }}
                  >
                    <ConstellationNodeIcon
                      name={activeCategory.iconName}
                      className="w-5 h-5"
                      style={{ color: accent }}
                    />
                  </div>
                  <div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider font-mono block"
                      style={{ color: accent }}
                    >
                      INSPECTING TOPIC NODE
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5 leading-snug">
                      {activeCategory.name}
                    </h3>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 uppercase tracking-wider ${
                    activeCategory.status === 'completed'
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                      : activeCategory.status === 'in-progress'
                      ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                      : 'border-slate-500/40 bg-slate-500/10 text-slate-400'
                  }`}
                >
                  {activeCategory.status === 'completed'
                    ? 'COMPLETED'
                    : activeCategory.status === 'in-progress'
                    ? 'IN PROGRESS'
                    : 'NOT STARTED'}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeCategory.description}
              </p>

              {/* Problems Solved Progress Box */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Problems Solved</span>
                  <span className="font-mono font-bold text-white">
                    {activeCategory.solvedCount} / {activeCategory.totalCount}
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${activeCategory.completionRate}%`,
                      backgroundColor: accent,
                      boxShadow: `0 0 10px ${accent}80`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                  <span>Completion Rate</span>
                  <span className="font-mono font-semibold" style={{ color: accent }}>
                    {activeCategory.completionRate}%
                  </span>
                </div>
              </div>

              {/* Key Concepts Covered */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                  Key Concepts Covered
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeCategory.keyConcepts.map((concept, idx) => (
                    <span
                      key={`concept-${idx}`}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800/80 border border-white/10 text-slate-200"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Practice Button */}
              {onNavigateToProblems && (
                <button
                  type="button"
                  onClick={() => onNavigateToProblems(activeCategory.id)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg group hover:opacity-95"
                  style={{
                    backgroundColor: accent,
                    color: '#000000',
                    boxShadow: `0 4px 14px ${accent}50`,
                  }}
                >
                  <span>Practice {activeCategory.shortName} Problems</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              )}
            </div>
          ) : (
            /* Initial Neutral State (when no node is selected yet) */
            <div
              className="p-6 rounded-2xl border relative flex flex-col items-center justify-center text-center space-y-3 backdrop-blur-md py-12 transition-all duration-300"
              style={{
                backgroundColor: 'rgba(10, 15, 29, 0.95)',
                borderColor: `${accent}35`,
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center border"
                style={{
                  backgroundColor: `${accent}18`,
                  borderColor: `${accent}40`,
                  color: accent,
                }}
              >
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h3 className="text-sm font-bold text-white">
                  Select a Topic Node
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Click any of the 11 constellation nodes or the list below to inspect topic mastery, concepts, and practice questions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSelectNode(categories[0].id)}
                className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 transition-all cursor-pointer border"
                style={{
                  color: accent,
                  borderColor: `${accent}40`,
                }}
              >
                Inspect {categories[0].name}
              </button>
            </div>
          )}

          {/* Bottom Panel: ALL CONSTELLATION NODES List */}
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] font-mono">
                ALL CONSTELLATION NODES
              </span>
              <span className="text-[11px] text-[var(--text-muted)] font-mono">
                11 Categories
              </span>
            </div>

            <div className="space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar pr-1 flex-1">
              {categories.map((cat) => {
                const isSelected = selectedCategoryId === cat.id;
                const isCompleted = cat.status === 'completed';
                const isInProgress = cat.status === 'in-progress';

                return (
                  <div
                    key={`row-${cat.id}`}
                    onClick={() => handleSelectNode(cat.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-all cursor-pointer border ${
                      isSelected
                        ? 'border text-white font-semibold shadow-sm'
                        : 'hover:bg-[var(--bg-surface-elevated)] border-transparent text-[var(--text-secondary)]'
                    }`}
                    style={
                      isSelected
                        ? {
                            backgroundColor: 'var(--active-nav-bg)',
                            borderColor: 'var(--border-accent)',
                            boxShadow: `0 0 12px ${accent}25`,
                          }
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Status Indicator */}
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 flex items-center justify-center"
                        style={{
                          backgroundColor: isCompleted
                            ? accent
                            : isInProgress
                            ? accentSecondary
                            : '#64748B',
                          boxShadow: isCompleted || isInProgress ? `0 0 6px ${accent}` : undefined,
                        }}
                      />
                      <span className="truncate">{cat.name}</span>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 font-mono text-[11px]">
                      <span className="text-slate-400">
                        {cat.solvedCount} / {cat.totalCount}
                      </span>
                      {isSelected && (
                        <span
                          className="text-[10px] font-bold"
                          style={{ color: 'var(--accent)' }}
                        >
                          ACTIVE
                        </span>
                      )}
                    </div>
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

