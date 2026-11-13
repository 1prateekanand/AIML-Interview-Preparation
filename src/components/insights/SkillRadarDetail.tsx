import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowUp,
  ArrowRight,
  TrendingUp,
  Target,
  Award,
  Sparkles,
  BookOpen,
  Filter,
  Brain,
  Layers,
  Bot,
  Code,
  ShieldCheck,
  Rocket,
  CheckCircle2,
  Clock,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Problem } from '../../types';
import { useSkillRadarData, DomainMetric, CategoryMetric } from '../../hooks/useSkillRadarData';
import { InsightsDetailHeader } from './InsightsDetailHeader';

interface SkillRadarDetailProps {
  onBack: () => void;
  onNavigateToProblems?: (category?: string) => void;
  problems?: Problem[];
}

export const SkillRadarDetail: React.FC<SkillRadarDetailProps> = ({
  onBack,
  onNavigateToProblems,
  problems,
}) => {
  const { currentTheme } = useTheme();
  const { domains, overall, insufficientDataNotice } = useSkillRadarData(problems);

  const [filter, setFilter] = useState<string>('All Domains');
  const [selectedDomainId, setSelectedDomainId] = useState<string>(domains[0]?.id || 'ml-deep-learning');
  const [hoveredDomainId, setHoveredDomainId] = useState<string | null>(null);

  // Keyboard shortcut: Esc to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  const accent = currentTheme.tokens.accent || '#F59E0B';
  const accentGlow = currentTheme.tokens.accentGlow || 'rgba(245, 158, 11, 0.4)';

  // Chart geometry
  const center = 230;
  const radius = 160;
  const numAxes = 6;

  // Axis angle calculation (-120° at index 0 for matching the canonical reference)
  const getAngle = (index: number) => {
    return (index * (2 * Math.PI)) / numAxes - (2 * Math.PI) / 3;
  };

  const getCoordinates = (index: number, valueRatio: number, rOffset = 0) => {
    const angle = getAngle(index);
    const r = radius * Math.max(0.08, Math.min(1.0, valueRatio)) + rOffset;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const dataPoints = domains
    .map((d, i) => {
      const ratio = d.hasSufficientData ? d.proficiency / 100 : 0.12;
      const { x, y } = getCoordinates(i, ratio);
      return `${x},${y}`;
    })
    .join(' ');

  const activeDomain =
    domains.find((d) => d.id === (hoveredDomainId || selectedDomainId)) || domains[0];

  // Filtered domains for listing
  const filteredDomains = useMemo(() => {
    if (filter === 'All Domains') return domains;
    return domains.filter((d) => d.status.toLowerCase() === filter.toLowerCase());
  }, [domains, filter]);

  // Identify lowest performing or focus area
  const focusDomain = useMemo(() => {
    const withActivity = [...domains].sort((a, b) => a.proficiency - b.proficiency);
    return withActivity[0] || domains[0];
  }, [domains]);

  const renderDomainIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'Brain':
        return <Brain className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      case 'Bot':
        return <Bot className={className} />;
      case 'Code':
        return <Code className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'Rocket':
        return <Rocket className={className} />;
      default:
        return <Brain className={className} />;
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Detail Header with Back Navigation */}
      <InsightsDetailHeader
        badge="A"
        title="Skill Radar Deep-Dive"
        subtitle="Live mastery analysis across the 6 core AI Engineering & Machine Learning domains"
        onBack={onBack}
        actions={
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-[var(--bg-surface-elevated)] text-xs text-[var(--text-secondary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 focus:outline-none focus:border-[var(--accent)] cursor-pointer"
            >
              <option>All Domains</option>
              <option value="Mastered">Mastered (&gt;80%)</option>
              <option value="Proficient">Proficient (60-80%)</option>
              <option value="Developing">Developing (30-60%)</option>
              <option value="Needs Practice">Needs Practice (&lt;30%)</option>
            </select>
          </div>
        }
      />

      {/* Top High-Level Metrics Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Overall Skill Mastery */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-accent)] transition-all">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>Overall Skill Mastery</span>
            <TrendingUp className="w-4 h-4" style={{ color: accent }} />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              {overall.overallMastery}%
            </span>
            <span
              className="inline-flex items-center gap-0.5 text-xs font-semibold font-mono"
              style={{ color: accent }}
            >
              <ArrowUp className="w-3.5 h-3.5" /> Live
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            {overall.hasAnyData
              ? `Calculated from ${overall.totalAttempted} live problem attempts`
              : 'Complete practice questions to calibrate your score'}
          </p>
        </div>

        {/* Metric 2: Problems Solved */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-accent)] transition-all">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>Problems Solved</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              {overall.totalSolved}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              / {overall.totalQuestions}
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            {overall.totalQuestions > 0
              ? `${Math.round((overall.totalSolved / overall.totalQuestions) * 100)}% overall problem completion`
              : '0% completed'}
          </p>
        </div>

        {/* Metric 3: Domains Mastered */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-accent)] transition-all">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>Domains Mastered</span>
            <Award className="w-4 h-4" style={{ color: accent }} />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono tabular-nums">
              {overall.domainsMasteredCount}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              / 6 domains
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            {overall.domainsMasteredCount > 0
              ? `${overall.domainsMasteredCount} domains exceed 80% proficiency`
              : 'Target 80%+ proficiency in each domain'}
          </p>
        </div>

        {/* Metric 4: Primary Focus Area */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-accent)] transition-all">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
            <span>Recommended Focus</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 font-bold text-base text-[var(--text-primary)] truncate">
            {focusDomain.name}
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Proficiency at {focusDomain.proficiency}% ({focusDomain.status})
          </p>
        </div>
      </div>

      {/* Main Radar View & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Large Interactive Radar SVG Chart (7 cols) */}
        <div
          className="lg:col-span-7 rounded-2xl border p-6 flex flex-col items-center justify-between relative overflow-hidden transition-all duration-300"
          style={{
            backgroundColor: '#070A13',
            borderColor: `${accent}40`,
            boxShadow: `0 20px 40px -15px rgba(0,0,0,0.8), inset 0 0 40px ${accent}08`,
          }}
        >
          {/* Chart Header Bar */}
          <div className="w-full flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-mono uppercase tracking-widest font-bold px-2 py-0.5 rounded border transition-colors"
                style={{
                  color: accent,
                  backgroundColor: `${accent}15`,
                  borderColor: `${accent}35`,
                }}
              >
                Hexagonal Radar
              </span>
              <span className="text-xs text-slate-300 font-semibold">
                6-Domain Competency Matrix
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Click node to inspect domain
            </span>
          </div>

          {/* SVG Radar */}
          <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center py-2">
            <svg
              className="w-full h-full overflow-visible select-none"
              viewBox="0 0 460 460"
            >
              <defs>
                <radialGradient id="radarDetailGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={accent} stopOpacity="0.32" />
                  <stop offset="55%" stopColor={accent} stopOpacity="0.08" />
                  <stop offset="100%" stopColor={accent} stopOpacity="0" />
                </radialGradient>

                <filter id="glowDetailFilter" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background ambient circular glow */}
              <circle cx={center} cy={center} r={radius * 1.1} fill="url(#radarDetailGlow)" />

              {/* Concentric Hexagons */}
              {gridLevels.map((lvl, idx) => {
                const hexPoints = domains
                  .map((_, i) => {
                    const { x, y } = getCoordinates(i, lvl);
                    return `${x},${y}`;
                  })
                  .join(' ');
                const isOuterRing = idx === gridLevels.length - 1;
                return (
                  <g key={idx}>
                    <polygon
                      points={hexPoints}
                      fill="none"
                      stroke={isOuterRing ? accent : 'rgba(255, 255, 255, 0.12)'}
                      strokeOpacity={isOuterRing ? 0.6 : 0.8}
                      strokeWidth={isOuterRing ? 1.5 : 1}
                      strokeDasharray={isOuterRing ? undefined : '3 3'}
                    />
                    {/* Ring percentage label */}
                    <text
                      x={center + 6}
                      y={center - radius * lvl + 10}
                      className="text-[9px] font-mono fill-slate-500 font-medium"
                    >
                      {Math.round(lvl * 100)}%
                    </text>
                  </g>
                );
              })}

              {/* Radial Axes (dashed lines from center to outer vertices) */}
              {domains.map((_, i) => {
                const { x, y } = getCoordinates(i, 1.0);
                return (
                  <line
                    key={`axis-${i}`}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.16)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Dynamic Theme Radar Polygon */}
              <polygon
                points={dataPoints}
                fill={accent}
                fillOpacity="0.22"
                stroke={accent}
                strokeWidth="2.5"
                filter="url(#glowDetailFilter)"
                className="transition-all duration-500 ease-out"
              />

              {/* Center Info Hub */}
              <g className="cursor-default select-none pointer-events-none">
                <circle
                  cx={center}
                  cy={center}
                  r="34"
                  fill="rgba(10, 15, 29, 0.92)"
                  stroke={accent}
                  strokeWidth="1.5"
                  strokeOpacity="0.6"
                />
                <text
                  x={center}
                  y={center - 7}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[9px] font-mono uppercase font-bold tracking-wider"
                  fill={accent}
                >
                  MASTERY
                </text>
                <text
                  x={center}
                  y={center + 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-base font-extrabold font-mono fill-white tabular-nums"
                >
                  {overall.overallMastery}%
                </text>
              </g>

              {/* Vertex Nodes (circular markers) */}
              {domains.map((domain, i) => {
                const ratio = domain.hasSufficientData ? domain.proficiency / 100 : 0.12;
                const { x, y } = getCoordinates(i, ratio);
                const isSelected = activeDomain.id === domain.id;
                const isHovered = hoveredDomainId === domain.id;

                return (
                  <g key={`vertex-${domain.id}`} className="cursor-pointer">
                    {/* Animated ping ring on selected node */}
                    {isSelected && (
                      <circle
                        cx={x}
                        cy={y}
                        r="14"
                        fill="none"
                        stroke={accent}
                        strokeWidth="2"
                        className="animate-ping opacity-75"
                      />
                    )}

                    {/* Generous touch target */}
                    <circle
                      cx={x}
                      cy={y}
                      r="18"
                      fill="transparent"
                      onMouseEnter={() => setHoveredDomainId(domain.id)}
                      onMouseLeave={() => setHoveredDomainId(null)}
                      onClick={() => setSelectedDomainId(domain.id)}
                    />

                    {/* Circular marker */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected || isHovered ? 7.5 : 5}
                      fill={isSelected ? '#FFFFFF' : accent}
                      stroke="#070A13"
                      strokeWidth="2.5"
                      filter="url(#glowDetailFilter)"
                      className="transition-all duration-200"
                      onMouseEnter={() => setHoveredDomainId(domain.id)}
                      onMouseLeave={() => setHoveredDomainId(null)}
                      onClick={() => setSelectedDomainId(domain.id)}
                    />
                  </g>
                );
              })}

              {/* Outer Vertex Labels, Icons & Percentages */}
              {domains.map((domain, i) => {
                const { x, y } = getCoordinates(i, 1.28);
                const isSelected = activeDomain.id === domain.id;

                return (
                  <g
                    key={`lbl-detail-${domain.id}`}
                    className="cursor-pointer select-none transition-transform duration-200"
                    onMouseEnter={() => setHoveredDomainId(domain.id)}
                    onMouseLeave={() => setHoveredDomainId(null)}
                    onClick={() => setSelectedDomainId(domain.id)}
                  >
                    {/* Domain Name */}
                    <text
                      x={x}
                      y={y - 9}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-[11px] transition-colors duration-150 ${
                        isSelected ? 'font-bold fill-white' : 'font-medium fill-slate-300'
                      }`}
                    >
                      {domain.shortName}
                    </text>
                    {/* Proficiency percentage */}
                    <text
                      x={x}
                      y={y + 8}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs font-mono font-extrabold tabular-nums"
                      fill={domain.hasSufficientData ? accent : '#94A3B8'}
                    >
                      {domain.hasSufficientData ? `${domain.proficiency}%` : '—'}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Footnote */}
          <div className="w-full flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-slate-400">
            <span>Needs Review questions are excluded from calculations</span>
            <span className="font-mono font-semibold" style={{ color: accent }}>
              Theme Calibrated
            </span>
          </div>
        </div>

        {/* Selected Domain Inspector & Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          {/* Active Domain Inspector Card */}
          <div
            className="p-5 rounded-2xl border relative space-y-4 backdrop-blur-md transition-all duration-300"
            style={{
              backgroundColor: 'rgba(10, 15, 29, 0.95)',
              borderColor: `${accent}40`,
              boxShadow: `0 16px 36px -12px rgba(0,0,0,0.7), 0 0 20px ${accent}20`,
            }}
          >
            {/* Header: Domain Title & Status Badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors"
                  style={{
                    backgroundColor: `${accent}18`,
                    borderColor: `${accent}40`,
                    color: accent,
                  }}
                >
                  {renderDomainIcon(activeDomain.iconName, 'w-5 h-5')}
                </div>
                <div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider font-mono"
                    style={{ color: accent }}
                  >
                    Inspecting Domain
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                    {activeDomain.name}
                  </h3>
                </div>
              </div>

              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold border shrink-0 ${
                  activeDomain.status === 'Mastered'
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                    : activeDomain.status === 'Proficient'
                    ? 'border-sky-500/40 bg-sky-500/10 text-sky-400'
                    : activeDomain.status === 'Developing'
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                    : 'border-slate-500/40 bg-slate-500/10 text-slate-400'
                }`}
              >
                {activeDomain.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeDomain.description}
            </p>

            {/* Metrics Triple Box */}
            <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-white/10 text-center">
              <div>
                <div className="text-[10px] text-slate-400">Mastery</div>
                <div
                  className="text-xl font-extrabold font-mono mt-0.5"
                  style={{ color: accent }}
                >
                  {activeDomain.hasSufficientData ? `${activeDomain.proficiency}%` : '—'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Solved</div>
                <div className="text-xl font-extrabold text-white font-mono mt-0.5">
                  {activeDomain.solvedCount}{' '}
                  <span className="text-xs font-normal text-slate-500">
                    / {activeDomain.totalQuestions}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Accuracy</div>
                <div className="text-xl font-extrabold text-white font-mono mt-0.5">
                  {activeDomain.accuracy !== null ? `${activeDomain.accuracy}%` : '—'}
                </div>
              </div>
            </div>

            {/* Overall Domain Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-medium">
                <span>Domain Problem Completion</span>
                <span className="font-mono text-white">
                  {activeDomain.completionRate}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${activeDomain.completionRate}%`,
                    backgroundColor: accent,
                    boxShadow: `0 0 10px ${accent}80`,
                  }}
                />
              </div>
            </div>

            {/* Constituent Categories List */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>Constituent Categories ({activeDomain.categories.length})</span>
                <span className="text-[10px] font-normal text-slate-500">
                  Individual category metrics
                </span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                {activeDomain.categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-white truncate">
                        {cat.name}
                      </span>
                      {onNavigateToProblems && (
                        <button
                          type="button"
                          onClick={() => onNavigateToProblems(cat.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-medium hover:opacity-80 transition-opacity cursor-pointer shrink-0"
                          style={{ color: accent }}
                        >
                          Practice
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>
                        Solved: {cat.solvedCount}/{cat.totalCount} ({cat.completion}%)
                      </span>
                      <span className="font-bold" style={{ color: accent }}>
                        Mastery: {cat.hasData ? `${cat.mastery}%` : '—'}
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${cat.completion}%`,
                          backgroundColor: accent,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* All 6 AI Competency Domains Quick Selection Table */}
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2 flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
              All 6 Competency Domains
            </span>
            <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
              {filteredDomains.map((d) => {
                const isSelected = activeDomain.id === d.id;
                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDomainId(d.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-all cursor-pointer border ${
                      isSelected
                        ? 'border text-white font-semibold'
                        : 'hover:bg-[var(--bg-surface-elevated)] border-transparent text-[var(--text-secondary)]'
                    }`}
                    style={
                      isSelected
                        ? {
                            backgroundColor: 'var(--active-nav-bg)',
                            borderColor: 'var(--border-accent)',
                          }
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                        style={{
                          backgroundColor: 'var(--active-nav-bg)',
                          color: 'var(--accent)',
                        }}
                      >
                        {renderDomainIcon(d.iconName, 'w-3.5 h-3.5')}
                      </div>
                      <span className="truncate">{d.name}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 font-mono">
                      <span className="text-[11px] text-[var(--text-muted)]">
                        {d.solvedCount}/{d.totalQuestions}
                      </span>
                      <span
                        className="font-bold tabular-nums"
                        style={{ color: 'var(--accent)' }}
                      >
                        {d.hasSufficientData ? `${d.proficiency}%` : '—'}
                      </span>
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
